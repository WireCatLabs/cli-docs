---
title: "Bots de MAX"
---

`max bot` usa el [Bot API oficial de MAX](https://dev.max.ru/docs-api) con el token del bot. Es independiente de tu cuenta personal: tiene nombre, chats y token propios. `max …` sin `bot` utiliza tu cuenta personal ([Guía de uso](./usage.md)).

Crea el bot en [business.max.ru](https://business.max.ru/self). MAX solo permite bots a organizaciones verificadas, empresarios individuales y autónomos registrados; todos pasan moderación.

Consulta la [Referencia](./commands.md) para todas las opciones.

**Está disponible toda la Bot API de MAX**, incluidos métodos fuera de los comandos habituales de mensajes y chats: `max <бот> bot api <операция>`. Los parámetros se pasan como opciones y el cuerpo como JSON; la ayuda de cada método enumera los campos admitidos. Es la interfaz nativa completa del CLI; MCP ofrece herramientas separadas para tareas habituales.

## Primer minuto

```sh
max sales bot auth set                                  # токен — в скрытом вводе
max sales bot me                                        # какой это бот
```

`auth set` comprueba el dueño del token con MAX antes de guardarlo. Una errata no sobrescribe el token válido.

## Obtener el ID del chat

MAX no proporciona una lista completa de chats del bot. Obtén el ID de sus operaciones o actualizaciones.

- **Conversación con una persona:** usa `user:<номер>`. La respuesta de envío incluye `chatId`.
- **Grupo o canal:** añade el bot y consulta actualizaciones:

  ```sh
  max sales bot api get-updates --limit 10
  ```

  El ID aparece en `chat_id`. Sin novedades espera hasta 30 segundos; `--poll-timeout 0` evita esperar. MAX no entrega otra vez estas actualizaciones. No funciona con un webhook configurado.

Abre el chat con `max sales bot chats show` y su ID para aprender el título y usarlo después. `chats list` muestra todos los chats vistos.

- Los IDs de grupos y canales son **negativos**.
- Un número positivo suele ser una persona. Usa `user:<номер>`; sin `user:`, MAX lo interpreta como chat y devuelve «no encontrado», código `6`, con una indicación de `max`.

## Varios bots

El nombre elegido va como **primera palabra**, igual que un perfil personal:

```sh
max sales bot auth set
max support bot auth set
max support bot messages send user:4815162342 "Ваша заявка принята"
max bot list --check          # все имена с токеном бота и какой бот за каждым
```

Sin nombre se usa `defaultProfile`, o `default` si falta: `max bot me`. `MAX_PROFILE` selecciona para toda la sesión del terminal.

## Token

El token se guarda en el llavero del sistema bajo `bot:<имя>`, separado del personal. Sin llavero, se guarda en archivo `0600`.

```sh
max sales bot auth show       # откуда взят токен и какой это бот
max sales bot auth remove     # забыть токен
```

`MAX_BOT_TOKEN` prevalece para CI. `auth set` no guarda el token de esa variable.

## Mensajes

Usa ID para chats, `user:<номер>` para personas, o título de un chat conocido:

```sh
max sales bot messages send "Команда продаж" "Сборка готова"
max sales bot messages send user:4815162342 "Здравствуйте"
max sales bot messages send "Команда продаж" "**Итоги недели** в закрепе" --md
max sales bot messages send "Команда продаж" "Принято" --reply-to mid.0000019a7f3c21de
echo "Текст из трубы" | max sales bot messages send "Команда продаж" -
```

`--silent` evita notificaciones. Máximo 4.000 caracteres. `user:4815162342` y `mid.0000019a7f3c21de` son ejemplos ficticios; sustituye tus IDs.

### Archivos

`--file` adjunta desde disco; detecta imagen, vídeo y audio por extensión, y lo demás como documento. `--photo` envía foto, `--voice` Ogg Opus como nota de voz, `--as-file` vídeo como documento. Archivos ocultos o de directorios de `max` requieren `--allow-any-file`. El texto es opcional:

```sh
max sales bot messages send "Команда продаж" "Отчёт за неделю" --file report.pdf
max sales bot messages send "Команда продаж" --file screenshot.png
```

Primero se sube el archivo a MAX y después se envía el mensaje. Mientras MAX procesa un vídeo o un archivo grande, responde «todavía no está listo» y `max` espera: cuatro veces, unos nueve segundos en total. Si la subida falla, no se envía nada al chat.

`uploads put` solo carga y muestra un objeto para `attachments` en `bot api send-message`:

```sh
max sales bot uploads put report.pdf
```

```sh
max sales bot messages list "Команда продаж" --limit 20
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de
max sales bot messages edit "Команда продаж" mid.0000019a7f3c21de "Исправленный текст"
max sales bot messages delete "Команда продаж" mid.0000019a7f3c21de --allow-dangerous
max sales bot messages pin "Команда продаж" mid.0000019a7f3c21de --notify
max sales bot messages unpin "Команда продаж" mid.0000019a7f3c21de
```

Identifica siempre un mensaje junto con su chat. Así los comandos son iguales en `max` y `tg`, donde el ID del mensaje solo tiene sentido dentro del chat. `max` no modifica un mensaje de otro chat. `--html` proporciona texto HTML; `--md` y `--html` no se pueden combinar. La eliminación pide confirmación; `--allow-dangerous` responde que sí. Fijar un mensaje es silencioso de forma predeterminada; `--notify` avisa a los miembros. La respuesta de un envío contiene el propio mensaje y `operationId`, el identificador de esa operación en el registro.

Si la conexión se interrumpe durante el envío, `max` no lo repite automáticamente: indica que no sabe si el mensaje llegó (código `14`). Comprueba el chat antes de volver a enviarlo.

## Chats

`chats list` muestra **chats vistos por este bot en este ordenador**: abiertos con `chats show`, enviados o leídos. MAX no tiene una lista completa.

```sh
max sales bot chats list
max sales bot chats show "Команда продаж"
max sales bot chats action "Команда продаж" typing    # typing, photo, video, voice, file
max sales bot chats leave "Команда продаж"    # вернуть бота может только админ чата
```

### Miembros y administradores

El bot necesita ser administrador con permiso para cada acción.

La incorporación de miembros con `bot chats members add` se comprobó el 3 de octubre de 2026: un bot administrador añadió a un miembro ausente y la cuenta personal confirmó el resultado. La [documentación de MAX](https://dev.max.ru/docs-api) declara este método eliminado desde el 30 de septiembre, pero el servidor sigue ejecutándolo en el grupo comprobado. El comando se conserva; el servidor MAX decide si el método está disponible.

Primero permite añadirlo a grupos. MAX lo impide por defecto, tanto desde la aplicación como con `max chats members add` (`participants.filter.out`). Actívalo en [business.max.ru](https://business.max.ru/self): bot → **⋮ → Ajustes → Privacidad** ([Documentación MAX](https://dev.max.ru/docs/chatbots/bots-create/manage)). Añádelo y conviértelo en administrador en la aplicación. Las comprobaciones necesitan lectura; sin ella no recibe mensajes del grupo. También puedes darla con `max chats admins add "Поход" <номер бота> --can read,members,delete`.

```sh
max sales bot chats members list "Команда продаж" --limit 50
max sales bot chats members add "Команда продаж" 4815162342 2342481516
max sales bot chats members remove "Команда продаж" 4815162342 --block
max sales bot chats admins list "Команда продаж"
max sales bot chats admins add "Команда продаж" 4815162342 --can read,pin --title "Дежурный"
max sales bot chats admins remove "Команда продаж" 4815162342
```

`members list` devuelve hasta 100 personas y `marker`; sigue con `--marker`. `--can` usa los permisos de `max chats admins add`: `read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`. `read` permite leer mensajes del grupo.

## Copia local

`max` guarda en este ordenador todo lo que el bot lee, envía o recibe. Puedes leer y buscar en esa copia sin conexión:

```sh
max sales bot messages list "Команда продаж" --offline
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de --offline
max sales bot messages search "итоги недели"
```

La búsqueda usa palabras, mejores coincidencias primero; `--newest` prioriza recientes. Exige todas las palabras y admite `"фраза"`, `-слово`, `а OR б`, `from:`, `chat:`, `after:`, `before:`, `has:`, igual que `max messages search --language legacy`, corrigiendo erratas. Para una búsqueda estricta en el archivo compartido, usa la [búsqueda normal](./search.md) con `in:bots`.

Para incluir también el historial antiguo del chat en la copia, descárgalo:

```sh
max sales bot store fetch "Команда продаж"                 # до 1000 сообщений, новые сначала
max sales bot store fetch "Команда продаж" --last 500      # пока не будет 500 последних
max sales bot store fetch "Команда продаж" --since-time 7d # за последние семь дней
```

Al repetir continúa donde terminó sin pedir lo descargado. Espera un segundo entre solicitudes (`--pause`), con 100 mensajes por página (`--page-size`).

Las órdenes normales siguen consultando MAX, que conserva todo el historial. Borrados propios o detectados por `watch` eliminan mensajes locales; si `watch` estaba detenido, la copia no conoce el borrado.

Busca personas por ID, `@username` o nombre parcial. Si coinciden dos, `max` muestra ambas y pide ID.

```sh
max sales bot contacts show @ann                 # где писала, и её личный чат с ботом
max sales bot contacts show @ann --refresh       # сначала перечитать личный чат у MAX
max sales bot messages search --from @ann        # всё, что она написала
max sales bot messages search "счёт" --from @ann --from Борис
max sales bot messages between @ann Борис --limit 20
```

`between` muestra chats donde todas las personas escribieron, últimos 20 mensajes de cada uno, antiguos primero. Compartido significa visto por el bot, no pertenencia comprobada con MAX.

**Cada bot solo ve su propia copia.** Solo puedes consultar la copia de otro bot si los ajustes lo permiten y lo solicitas en el comando:

```sh
max shop config set --bot readOtherBots true          # боту shop можно читать всех ботов
max shop config set --bot readOtherBots news,support  # или только этих
max shop bot messages search заказ --bots news        # и тогда — явно, в команде
max shop bot contacts show @ann --all-bots            # все, кого разрешено
```

`--all-bots`, `--bots` funcionan con `messages search`, `contacts show`, `messages between`. Sin `readOtherBots` rechazan con `5` y una orden para permitirlo. En `max <имя> bot mcp`, `all_bots` y `bots` solo aparecen cuando está permitido.

## Actualizaciones

```sh
max sales bot watch                       # новые сообщения, до Ctrl-C или --timeout
max sales bot watch --events --jsonl       # и всё остальное: правки, удаления, кнопки, кто вошёл и вышел
max sales bot watch --types message_created,message_edited
```

`watch` primero guarda lo recibido —los mensajes en la copia local, los botones pulsados para `callbacks answer` y las entradas y salidas del chat para comprobar sus reglas (más abajo)— y después lo imprime. Sin `--events`, solo imprime mensajes nuevos; con `--events`, cada línea indica su evento (`message`, `edit`, `delete`, `callback`, `joined`, `left`, `added`, `removed`, `started`, `other`). `--types` utiliza los nombres de eventos de MAX. La siguiente ejecución continúa donde se detuvo la anterior. `watch` no funciona mientras el bot tenga un webhook configurado.

MAX no volverá a entregar lo recibido por `watch` a ningún otro lector de ese bot mediante `get-updates`.

## Comprobar las reglas del chat

Un bot administrador puede aplicar las reglas de `max chats moderate` personal ([Grupos](./groups.md)), con reglas propias:

```sh
max sales bot chats rules set -72894839451 invites remove        # приглашения в чужие чаты — удалять автора
max sales bot chats rules set -72894839451 consent.remove allow  # без вопросов
max sales bot chats moderate -72894839451                        # проверить, что нового
max sales bot chats moderate -72894839451 --dry-run              # только показать
```

La comprobación revisa los mensajes desde la última comprobación (la primera vez, los de las últimas 24 horas) y las personas que han entrado, y hace lo que permitan las reglas y el nivel de consentimiento. Diferencias respecto a una cuenta personal:

- **Las expulsiones impiden volver por invitación.** Para la persona, el enlace parece caducado; para otros funciona. Un administrador puede añadirla manualmente (`max chats members add`). `--no-ban` evita ese bloqueo. Solo funciona donde hay enlace de invitación.
- **El bot solo sabe quién ha entrado gracias a `watch`.** MAX entrega cada evento a un único lector, por lo que la comprobación obtiene las entradas de lo que guardó `watch`. Si `watch` no está en marcha, solo evalúa los mensajes y lo indica.
- **El bot no dispone de la antigüedad de la cuenta**: la Bot API no la proporciona, por lo que esa regla no se aplica mediante el bot.

El bot necesita permisos de administrador para eliminar mensajes y miembros.

## Comentarios

Bajo publicaciones de canales: primero ID de publicación (`mid.…`), después del comentario:

```sh
max sales bot comments list mid.0000019a7f3c21de --limit 20
max sales bot comments get mid.0000019a7f3c21de 42
max sales bot comments send mid.0000019a7f3c21de "Спасибо за вопрос"
max sales bot comments edit mid.0000019a7f3c21de 42 "Исправлено"
max sales bot comments delete mid.0000019a7f3c21de 42
```

Se aplica la misma lista de destinatarios del canal.

## Botones

Al pulsar, el bot recibe `callback_id` y responde:

```sh
max sales bot callbacks answer f9LHodD0cOL5 --notification "Готово"
max sales bot callbacks answer f9LHodD0cOL5 --text "Заказ подтверждён"
```

`--notification` muestra un aviso a quien pulsó; `--text` cambia el texto del mensaje. El ID no permite conocer el chat, así que la lista de destinatarios no se aplica a esa respuesta.

## Menú de comandos

Lo que aparece al escribir `/`:

```sh
max sales bot commands list
max sales bot commands set start=Начать help=Помощь "report=Отчёт за день"
max sales bot commands clear
```

`set` reemplaza el menú completo. Cada entrada es `имя=описание`; descripción opcional.

## Webhooks

MAX envía las actualizaciones a esa dirección. Mientras exista, no puedes recibirlas con `get-updates`.

```sh
max sales bot webhooks list
max sales bot webhooks set https://bot.example.ru/max --secret-stdin --types message_created,bot_started
max sales bot webhooks delete https://bot.example.ru/max
```

- HTTPS en puerto 443 con certificado aceptado por MAX.
- Una dirección nueva **no reemplaza** la antigua; recibe ambas. `set` rechaza si hay otra. Elimínala o usa `--add` si necesitas dos.
- `--secret-stdin` pide secreto sin mostrarlo o lee una tubería. MAX lo envía en `X-Max-Bot-Api-Secret` para identificarlo; nunca en argumentos.

## Destinatarios permitidos

El bot respeta los ajustes del perfil:

- `permissions` define niveles para las claves `bot.*`; `readonly` permite solo leer;
- `allow` permite únicamente las acciones nombradas: enviar `send`, editar `edit`, eliminar `delete`, fijar `pin`, miembros y ajustes del chat `groups`, comandos del bot `profile` y recibir actualizaciones `read`. Una acción sin palabra propia, como los webhooks, queda prohibida cuando se establece `allow`.

Cada bot tiene su lista:

```sh
max sales bot recipients add "Команда продаж"
max sales bot recipients list
max sales bot recipients remove "Команда продаж"
max sales bot recipients clear            # писать можно снова в любой чат
```

Sin lista permite cualquier destino; con ella rechaza otros con `7` y la orden para añadir.

Cada envío, edición, borrado o fijado se registra:

```sh
max sales bot sends list
```

Incluye chat, acción, resultado y longitud, nunca texto. **Toda** escritura, incluido `bot api`, pasa por lista y registro. No hay límite horario hasta configurarlo en `bot` con `max <имя> config set --bot sendsPerHour 200` ([Configuración](./configuration.md)).

## Cualquier operación API

`max bot api <операция>` expone todas las operaciones, generadas de la especificación oficial por cli-core. La construcción de comandos y validación de entradas se comparten con Telegram; al actualizar la especificación aparecen las nuevas:

```sh
max sales bot api get-my-info
max sales bot api get-subscriptions
max sales bot api answer-on-callback --callback-id f9LHodD0cOL5 --body '{"notification": "Готово"}'
max sales bot api send-message --user-id 4815162342 --body-file message.json
```

Ruta y consulta se pasan como opciones, cuerpo JSON en `--body`, `--body -` o `--body-file`. `--body-file -` también lee stdin. El parámetro nativo `timeout` se llama `--poll-timeout`; la opción global `--timeout` limita el comando completo. La opción compartida `--store-token <profile>` no está disponible para los métodos MAX actuales: todos la rechazan antes de ejecutar la operación. Se valida antes de enviar; errores indican campo y tipo esperado sin exponer valor. Consulta [Cobertura API](https://github.com/leemour/max-cli/blob/v0.35.0/docs/dev/bot-api-coverage.md).

## Scripts y agentes

`--json` imprime datos en stdout y errores en stderr con código:

| Código | Significado |
|---|---|
| `4` | Token ausente o rechazado |
| `5` | Solo lectura o acción fuera de `allow` |
| `6` | Chat desconocido o persona sin `user:` |
| `7` | Destino fuera de la lista |
| `8` | Límite `sendsPerHour` alcanzado |
| `14` | Resultado de escritura desconocido |

El formato coincide con cuentas personales. IDs mayores que 2^53 son cadenas para conservar cifras.

`--trace` y `--record` muestran solicitudes, tipo/tamaño/estado de cargas sin URL ni nombre. Fallos se guardan en `max runs list` ([Diagnóstico](./diagnostics.md)).

## Certificado

`platform-api2.max.ru` utiliza una raíz del Ministerio ruso de Desarrollo Digital ausente en Node. `max` la añade solo a sus solicitudes, sin modificar el sistema. Se identifica como `max-cli/<версия>`.

## Bot para un agente (MCP)

`max <имя> bot mcp` expone el bot como `max mcp` expone tu cuenta:

```sh
claude mcp add sales-bot -- max sales bot mcp
max sales bot mcp config          # запись для Claude Desktop, Cursor и других
```

El agente puede acceder a lo que permita el perfil del bot: el bot, los chats que ha visto, mensajes, búsqueda, personas, miembros y administradores, comentarios, menú de comandos, registro y lista de destinatarios. Si el perfil no es de solo lectura, también puede escribir en nombre del bot: enviar, editar, fijar, indicar que está escribiendo, comentar, responder a botones, eliminar, añadir o quitar miembros y comprobar un chat según sus reglas (`max_bot_write` (`command: "chats moderate"`)). `max_bot_read` (`command: "status"`) muestra qué perfil representa el servidor, de dónde procede el token, qué bot es y qué herramientas de escritura están activadas.

- `permissions.bot: readonly` limita al agente a leer salvo que existan permisos más específicos;
- para permitir solo envíos y comentarios, establece `permissions.bot: readonly` y después `permissions.bot.messages.send: allow`; comprueba que no haya otros permisos más específicos;
- La eliminación de mensajes o comentarios tiene el nivel `ask` de forma predeterminada: se permite la operación solicitada sin un formulario de confirmación del servidor; `deny` y `readonly` la prohíben.
- Las acciones que las reglas del chat exigen confirmar permanecen como planes para el propietario.
- Las opciones antiguas de confirmación no cambian el acceso.

`--allow-send`, `--allow-delete`, `--allow-moderate` ya no otorgan permisos: se aceptan con aviso.

Cada escritura ejecuta el mismo comando que escribirías tú y comprueba la lista de destinatarios del bot, `permissions` y el registro. El agente no puede acceder al token ni a los webhooks. Puede leer la lista de destinatarios, el menú de comandos y los administradores, pero no cambiarlos; tampoco puede salir del chat, enviar archivos ni usar `bot api`.

Con `--md`, el bot usa las reglas MAX: `__жирный__`, `++подчёркнутый++`, `^^выделенный^^`, enlaces, código, encabezados y citas. El conversor genera HTML seguro con texto y direcciones escapados; es una representación interna, y el argumento --md sigue siendo Markdown.
