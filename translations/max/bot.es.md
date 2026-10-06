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

Primero se carga y después se envía. Mientras MAX procesa vídeo o archivos grandes, puede indicar «no listo»; se espera hasta cuatro veces, unos nueve segundos. Si la carga falla, no se envía nada.

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

Indica siempre chat y mensaje, coherente con `tg`, cuyos IDs solo son únicos dentro del chat. No se modifica un mensaje de otro chat. `--html` y `--md` son incompatibles. Borrar pide confirmación; `--allow-dangerous` acepta. Fijar es silencioso salvo `--notify`. El envío devuelve mensaje y `operationId` del registro.

Si se corta la conexión al enviar, no se repite: código `14`, resultado desconocido. Comprueba el chat antes de reintentar.

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

Todo lo leído, enviado o recibido se guarda aquí para leer y buscar sin conexión:

```sh
max sales bot messages list "Команда продаж" --offline
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de --offline
max sales bot messages search "итоги недели"
```

La búsqueda usa palabras, mejores coincidencias primero; `--newest` prioriza recientes. Exige todas las palabras y admite `"фраза"`, `-слово`, `а OR б`, `from:`, `chat:`, `after:`, `before:`, `has:`, igual que `max messages search --language legacy`, corrigiendo erratas. Para una búsqueda estricta en el archivo compartido, usa la [búsqueda normal](./search.md) con `in:bots`.

Descarga historial anterior:

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

**Cada bot ve solo su copia.** Leer otras requiere permiso y petición explícita:

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

`watch` guarda antes de imprimir: mensajes, botones para `callbacks answer`, incorporaciones y salidas para las reglas. Sin `--events`, solo nuevos mensajes. Con él identifica `message`, `edit`, `delete`, `callback`, `joined`, `left`, `added`, `removed`, `started`, `other`. `--types` acepta nombres MAX. La siguiente ejecución continúa desde la anterior. No funciona con webhook.

Los eventos consumidos no se entregan a otro lector mediante `get-updates`.

## Comprobar las reglas del chat

Un bot administrador puede aplicar las reglas de `max chats moderate` personal ([Grupos](./groups.md)), con reglas propias:

```sh
max sales bot chats rules set -72894839451 invites remove        # приглашения в чужие чаты — удалять автора
max sales bot chats rules set -72894839451 consent.remove allow  # без вопросов
max sales bot chats moderate -72894839451                        # проверить, что нового
max sales bot chats moderate -72894839451 --dry-run              # только показать
```

Lee mensajes desde la última revisión, un día inicialmente, e incorporaciones. Actúa según reglas y consentimiento. Diferencias:

- **Las expulsiones impiden volver por invitación.** Para la persona, el enlace parece caducado; para otros funciona. Un administrador puede añadirla manualmente (`max chats members add`). `--no-ban` evita ese bloqueo. Solo funciona donde hay enlace de invitación.
- **Las incorporaciones vienen de `watch`.** MAX entrega cada evento a un lector; la comprobación usa lo guardado. Sin `watch`, solo comprueba mensajes y lo indica.
- **No conoce antigüedad de cuentas**, ausente del Bot API; esa regla no se aplica.

Necesita permisos para borrar mensajes y expulsar miembros.

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

Ruta y consulta se pasan como opciones, cuerpo JSON en `--body`, `--body -` o `--body-file`. `--body-file -` también lee stdin. El parámetro nativo `timeout` se llama `--poll-timeout`; la opción global `--timeout` limita el comando completo. La opción compartida `--store-token <profile>` no está disponible para los métodos MAX actuales: todos la rechazan antes de ejecutar la operación. Se valida antes de enviar; errores indican campo y tipo esperado sin exponer valor. Consulta [Cobertura API](https://github.com/leemour/max-cli/blob/v0.29.0/docs/dev/bot-api-coverage.md).

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

El perfil determina acceso a detalles, chats, mensajes, búsquedas, personas, miembros, administradores, comentarios, menú, registro y destinatarios. Si permite escribir, también envíos, ediciones, fijados, escritura en curso, comentarios, respuestas a botones, borrados, miembros y moderación (`max_bot_chats_moderate`). `max_bot_status` indica perfil, fuente del token, dueño y herramientas de escritura.

- `permissions.bot: readonly` limita al agente a leer salvo que existan permisos más específicos;
- para permitir solo envíos y comentarios, establece `permissions.bot: readonly` y después `permissions.bot.messages.send: allow`; comprueba que no haya otros permisos más específicos;
- eliminar un mensaje o comentario tiene nivel `ask` por defecto: el agente muestra un formulario; un `allow` explícito para `permissions.bot.messages.delete`, o iniciar el servidor con `--allow-dangerous`, elimina ese formulario salvo que esté activado `--confirm-send`;
- las acciones que las reglas del chat exigen confirmar se muestran en un solo formulario;
- `--confirm-send` muestra un formulario antes de cada escritura.

`--allow-send`, `--allow-delete`, `--allow-moderate` ya no otorgan permisos: se aceptan con aviso.

Cada escritura ejecuta el mismo comando que escribirías tú y comprueba la lista de destinatarios del bot, `permissions` y el registro. El agente no puede acceder al token ni a los webhooks. Puede leer la lista de destinatarios, el menú de comandos y los administradores, pero no cambiarlos; tampoco puede salir del chat, enviar archivos ni usar `bot api`.

Con `--md`, el bot usa las reglas MAX: `__жирный__`, `++подчёркнутый++`, `^^выделенный^^`, enlaces, código, encabezados y citas. El conversor genera HTML seguro con texto y direcciones escapados; es una representación interna, y el argumento --md sigue siendo Markdown.
