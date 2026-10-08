---
title: "Administrar grupos"
---

`tg` ayuda a administrar un grupo: muestra las preguntas sin respuesta, quién se ha unido y quién lo ha añadido, y lo ocurrido durante la semana. Lee sin marcar los mensajes como leídos, por lo que los miembros no ven que has revisado el grupo.

Todo lo descrito aquí funciona desde tu cuenta personal. Consulta los comandos completos en [uso de grupos y canales](./usage.md#groups-and-channels) y todas las opciones en la [referencia de comandos](./commands.md).

## Con un agente

Un agente con terminal (Claude Code, Codex) necesita la [skill](./recipes.md#once-first); uno sin terminal (Claude Desktop, Cursor) necesita el [servidor MCP](./mcp.md). Los ejemplos siguientes muestran qué pedir, qué comando ejecuta el agente y qué devuelve.

### Revisión de la mañana: quién espera una respuesta

```text
You:    What is still unanswered in "Hiking"?
Agent:  (tg review --chat "Hiking" --unanswered 4h --json)
        Unanswered for more than 4 hours — 3 questions:
        · Lena, 08:12 — "What time do we leave on Saturday?"
        · Artem, yesterday 22:40 — a reply to your post about the route: "Are the tents shared?"
        · Ira, yesterday 19:05 — "Who brings the pot?"
        You or the admins answered the rest.
```

Se considera pregunta un mensaje con `?` o una respuesta a ti o a un administrador; un `?` dentro de un enlace no cuenta. Se considera contestada si tú o un administrador respondéis al mensaje o sois los siguientes en hablar después de quien preguntó. Si Telegram no indica quiénes son los administradores, solo cuentan tus respuestas y el comando lo avisa.

### Nuevos miembros de la semana

```text
You:    Who joined "Hiking" this week?
Agent:  (tg chats events "Hiking" --type join,add --json)
        Five people:
        · Kate — added by Lena, Tuesday
        · Oleg — joined by the link, Wednesday
        · …
```

`chats events` lee los mensajes de servicio del grupo, por lo que muestra lo que Telegram conserva en el historial: quién se unió, salió, fue añadido o eliminado, y quién realizó la acción. `tg chats members list` muestra todos los miembros, su función y cuándo se conectaron por última vez.

### Un enlace de invitación filtrado

```text
You:    The invite link to "Hiking" ended up in a public chat. Replace it, and stop members adding people.
Agent:  (tg chats link reset "Hiking" --json)
        (tg chats update "Hiking" --only-admins-add on --json)
        Done: the old link no longer works, the new one is https://t.me/+…, and only admins can add
        people now.
```

`link reset` devuelve el estado actualizado del grupo, incluido el nuevo enlace; `chats update` también devuelve su estado. Así el agente puede explicar el cambio sin volver a consultar el grupo.

### Resumen semanal

```text
You:    Sum up the week in "Hiking".
Agent:  (tg review --chat "Hiking" --since-time 2026-09-20T00:00 --json)
        Decided: we leave on 4 October, at 7:00 from the station.
        Taken on: Lena — food, Artem — tents.
        Open: who brings the pot — asked three times, no answer.
```

### Revisiones programadas

No necesitas un agente para obtener las preguntas pendientes: basta con ejecutar el comando.

```cron
0 9,21 * * * tg review --chat "Hiking" --unanswered --json >> ~/hiking-open.jsonl 2>> ~/tg-cron.log
```

cron no tiene terminal y a menudo no define `XDG_RUNTIME_DIR`, sin la cual `tg` no puede acceder al almacén de claves: consulta [tareas programadas](./recipes.md#running-on-a-schedule).

## Funciones disponibles

| Comando | Qué hace |
|---|---|
| `tg review --chat <chat> --unanswered [duration]` | preguntas que tú y los administradores no habéis respondido durante ese tiempo: `4h`, `1d`; 24 horas por defecto |
| `tg chats events <chat>` | quién se unió, salió, fue añadido o eliminado, y quién realizó la acción; últimos 7 días por defecto |
| `tg chats members list <chat>` | todos los miembros, su función y cuándo se conectaron por última vez |
| `tg topics list\|search <chat>` | temas de un grupo de foro |
| `tg topics enable <chat>` | activa un foro; un grupo básico requiere `--upgrade --yes` y devuelve un nuevo identificador de chat |
| `tg topics create <chat> <title>` | crea un tema; si el resultado es desconocido, consulta `topics list` en vez de repetir |
| `tg messages send <chat> <text> --topic <id>`, `tg polls create <chat> <question> <answers> --topic <id>` | envía un mensaje o una encuesta a un tema de foro |
| `tg chats inspect <link>` | destino de un enlace público o de invitación, sin unirse |
| `tg chats create <title> [person...]` | nuevo grupo (supergrupo), o canal con `--channel` |
| `tg chats join <link>`, `tg chats leave <chat>` | unirse mediante enlace o salir |
| `tg chats update <chat>` | cambiar título, descripción y permisos para fijar mensajes (`--all-can-pin`) o añadir miembros (`--only-admins-add`) |
| `tg chats members add\|remove <chat> <person...>` | añadir personas (se les notifica y se indica quién no pudo añadirse) o eliminarlas (sus mensajes permanecen) |
| `tg chats admins add <chat> <person> --can <rights>` | convertir a un miembro en administrador con estos permisos: members, admins, info, pin, link, post, edit, delete |
| `tg chats admins remove <chat> <person>` | retirar permisos de administrador; sigue siendo miembro |
| `tg chats link update <chat> <link> --approval\|--no-approval --expire-time <time> --max-uses <n>` | cambia solo la aprobación, caducidad o límite de usos indicados de tu enlace adicional; indica al menos un cambio |
| `tg chats link show\|reset <chat>` | consultar el enlace de invitación; `reset` crea otro y el anterior deja de funcionar |
| `tg messages delete --for-everyone`, `pin`, `unpin` | eliminar para todos o fijar mensajes |

Un agente sin terminal obtiene las funciones de lectura como herramientas MCP: `tg_read` (`command: "review"`) con `unanswered`, `tg_read` (`command: "chats events"`), `tg_read` (`command: "chats members"`), `tg_read` (`command: "chats inspect"`) ([mcp.md](./mcp.md)).

`create`, `join`, `leave`, `update`, `link reset`, `members` y `admins` producen cambios visibles para el grupo: al crear un grupo se avisa a los añadidos, y al entrar o salir aparece un mensaje en el chat. Cada operación pasa por los permisos del perfil y la protección de envíos; cada persona añadida cuenta para el límite por hora ([seguridad](./security.md#the-send-guard)).

## Qué espera tu respuesta

`review` y `serve` mantienen una lista de tareas en el almacén local. Una pregunta sin respuesta y un mensaje que te menciona por nombre abren una tarea; tu respuesta la cierra. La tarea apunta al mensaje y nunca lo copia.

```sh
tg tasks list --state open                                # what waits on you, oldest first
tg tasks list --chat "Hiking" --type question,mention
tg tasks add msg:telegram/<you>/<chat>/<message> --type promise   # what the rules cannot see
tg tasks close <task> --as dismissed --reason no-reply-needed
tg stats tasks show                                            # open per chat, the oldest, the median time to close
```

Una tarea cerrada sigue cerrada y una descartada nunca vuelve. Solo tus respuestas cierran una tarea, no las de un administrador; no se detectan las menciones por `@username`. El agente obtiene lo mismo con herramientas MCP: `tg_read` (`command: "tasks list"`), `tg_write` (`command: "tasks add"`), `tg_write` (`command: "tasks close"`), `tg_read` (`command: "stats tasks show"`) ([mcp.md](./mcp.md)).

## Reglas

Las reglas del grupo definen qué busca `tg chats moderate` y qué puede hacer. Se guardan en un archivo del perfil, nunca en Telegram. No hay vigilancia automática en segundo plano: las reglas solo se aplican al ejecutar `chats moderate`.

```sh
tg chats rules show "Hiking"                       # the defaults, marked not saved, until the first change
tg chats rules set "Hiking" links delete           # a message with a link is deleted
tg chats rules set "Hiking" blocked 12345,67890    # these people…
tg chats rules set "Hiking" blockedPeople remove   # …are removed when they write or join
tg chats rules set "Hiking" consent.delete allow   # delete without asking
tg chats moderate "Hiking" --dry-run               # what it would do, doing nothing
tg chats moderate "Hiking"                         # judge what is new since the last run, and act
```

| Regla | Qué detecta |
|---|---|
| `links`, `invites`, `forwards` | mensajes con enlaces, invitaciones a otro grupo o mensajes reenviados |
| `blocked`, `blockedNames`, `blockedPeople` | personas por identificador o parte del nombre, y qué hacer con ellas |
| `flood.messages`, `flood.minutes`, `flood.action` | más de cierta cantidad de mensajes de una persona en un intervalo de minutos |
| `trusted` | personas sobre las que nunca se actúa; tampoco se actúa sobre ti ni sobre los administradores |

La acción de cada regla es `report`, `delete` o `remove`. Para ejecutar `delete` o `remove`, se consulta el nivel del grupo en `consent.delete` y `consent.remove`: `deny` nunca actúa, `readonly` solo informa, `ask` pregunta por cada acción (predeterminado; `--allow-dangerous` aprueba todas) y `allow` la ejecuta. Cada acción sigue pasando por la protección de envíos y su límite por hora. La ejecución se detiene después de `--max-actions` (10). La siguiente continúa donde se detuvo; `--since-time` consulta un momento que elijas y no cambia ese punto guardado.

Por MCP, `tg_write` (`command: "chats moderate"`) actúa solo donde el nivel es `allow`; las acciones que requieren preguntar se enumeran para ti, pero no se ejecutan. No se ofrece `newAccount`: Telegram no indica la antigüedad de la cuenta.

## Limitaciones

- **El historial de Telegram es la fuente.** `chats events` y `review` ven lo que todavía contiene el historial; si un administrador elimina un mensaje de servicio, también desaparece para estos comandos.
- **Solo se conocen los administradores si Telegram los indica.** En caso contrario, `review --unanswered` solo cuenta tus respuestas y lo avisa.
- **Nada vigila el grupo por su cuenta.** La revisión se ejecuta cuando la inicias tú, un agente por petición tuya o una tarea programada.
- **Se aplican los límites de Telegram.** Leer todos los miembros de un grupo grande requiere muchas peticiones. Una respuesta `FLOOD_WAIT` indica cuánto debes esperar ([solución de problemas](./troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).

## Estadísticas para administradores de grupos

```sh
tg stats chats show <chat> --since-time 7d --by day --timezone Europe/Madrid --json
tg stats chats show <chat> --offline --json
```

`tg stats chats show` cuenta mensajes, remitentes activos, respuestas, hilos, reacciones y preguntas respondidas durante un periodo desde el almacén local. `--by day` o `--by week` añade filas de calendario; las semanas empiezan el lunes y `--timezone` fija su zona horaria. Las vistas, reenvíos y comentarios aparecen solo donde Telegram proporcionó los recuentos y se guardaron con las publicaciones. Un recuento ausente no significa cero. Las reacciones usan los recuentos guardados sin actualizar cada publicación. Las preguntas siguen las mismas reglas que `review --unanswered`. Son cifras calculadas localmente; el comando no solicita las estadísticas oficiales de administración de Telegram.

El comando en línea también consulta a Telegram los eventos de entrada y salida. `--offline` y MCP `tg_read` (`command: "stats chats show"`) omiten `members`, el resumen de esos eventos. Es distinto de `memberCounts`: instantáneas diarias guardadas del tamaño del grupo, disponibles también sin conexión.

Cuando `complete` es false, el historial disponible está incompleto: los totales abarcan solo lo leído, y las medianas y proporciones pueden diferir de las del grupo completo. El campo `fetch` propone un comando para descargar los mensajes que faltan. Un historial de eventos incompleto también limita los recuentos de entradas y salidas. Ni siquiera un historial completo de mensajes puede reconstruir perfiles anteriores de miembros ni listas diarias previas al inicio del registro.

### Estadísticas de Telegram

```sh
tg stats chats official <chat> --json
```

Telegram calcula estadísticas para los administradores de supergrupos y canales suficientemente grandes, las mismas de la pantalla Estadísticas de sus aplicaciones. `tg stats chats official` las consulta e imprime un objeto JSON. Telegram elige el periodo, indicado como `period`. Cada total incluye el valor del periodo anterior.

- Un supergrupo (`kind: "group"`) tiene miembros, mensajes, lectores y autores, los principales autores, administradores e invitadores, y 8 gráficos: crecimiento, miembros, nuevos miembros por origen, idiomas, mensajes, acciones, horas y días de la semana.
- Un canal (`kind: "channel"`) tiene seguidores, vistas, compartidos y reacciones por publicación y por historia, cuántos seguidores tienen notificaciones activadas, publicaciones recientes con sus recuentos y 12 gráficos.

Cada gráfico es una lista de series sobre sus valores `x`: `date` (un día, `YYYY-MM-DD`), `time` (ISO 8601) o `number`. Si Telegram no puede proporcionar un gráfico, aparece como `{ "error": ... }` y los demás siguen disponibles. El comando solo lee: no envía, marca como leído ni cambia nada. Se rechaza `--jsonl`.

Telegram responde solo para un chat donde te muestra estadísticas. En un grupo básico, un chat que no administras o uno demasiado pequeño, el comando falla con un error de permisos o validación. Una ejecución requiere unas 10 a 17 solicitudes: la ficha del chat, las estadísticas y cada gráfico que Telegram envía después. Indica el chat por `@username` o ID: un título se busca primero en tu lista de chats, lo que añade una solicitud por cada 100 chats. Telegram guarda las estadísticas en un servidor propio, así que la primera ejecución añade una clave de acceso para ese servidor al archivo de sesión; nunca se imprime.

### Instantáneas de miembros y cambios

`tg chats members fetch` lee los miembros al almacén local y registra perfiles, cambios, el recuento del día y si la lectura fue completa. `--budget` limita las páginas. Tras una lectura parcial no se registra a nadie como salido: eso exige leer toda la lista disponible y conocer un recuento del grupo no superior al número leído. Un presupuesto mayor no evita los límites de Telegram para las listas de miembros.

`--track` añade el grupo a la lista de seguimiento. `chats tracking list` muestra todos los grupos seguidos; `show` muestra el estado de uno y los recuentos diarios de los últimos 30 días. `add` inicia el seguimiento sin descargar de inmediato; `remove` detiene las descargas diarias y conserva el historial registrado. Mientras funciona `tg serve`, descarga los grupos uno a uno, inicia la primera ronda un minuto después de conectarse y omite los ya descargados en el día UTC actual. El seguimiento no inicia `serve`; si estuvo detenido varios días, la siguiente ejecución registra una instantánea nueva en lugar de rellenar los días perdidos.

`tg chats members history` muestra las entradas, salidas y cambios de perfil registrados, de más antiguo a más nuevo; `--since-time` limita el periodo. Nunca consulta Telegram. Una entrada usa la hora de Telegram si se conoce; si no, la primera vez que se vio a la persona. Una salida se fecha en la primera instantánea completa sin ella, no en el momento exacto de su marcha. La primera descarga registra la lista inicial: esas personas no necesariamente entraron ese día. `chats members list --offline` lee la última lista guardada completa; las lecturas parciales no la sustituyen. Sin una instantánea completa, esta lista puede estar vacía aunque ya se hayan registrado algunos perfiles y eventos. Los perfiles y el historial permanecen en el almacén local junto a los mensajes.

`tg chats members audit` enumera miembros con señales de bot y sus motivos; `--budget` limita las páginas y `--min-score` fija el umbral. No elimina a nadie y excluye a los administradores y al propietario. `more` indica una lista parcial y `unknown` nombra señales no disponibles. No funciona con `--offline`; las puntuaciones necesitan revisión humana. Telegram proporciona datos de bot, scam, fake, deleted, foto, entrada e invitador cuando están disponibles. «Nunca escribió» significa que no se encontraron mensajes en el historial local, no demuestra que esa persona nunca escribiera en el grupo.

`--deep <n>` comprueba también a los primeros n miembros en detalle, a uno por segundo: su perfil, su foto de perfil más antigua, hasta 1000 mensajes guardados de cada uno y dos listas públicas de spam, Combot CAS y lols.bot. Se envía el ID de cada miembro a esas listas. La comprobación completa aparece en `check` de cada miembro revisado.

### Un informe semanal de tu grupo

«Hiking Club» es un grupo ficticio de ejemplo. Descarga primero sus mensajes con `store fetch` si aún no están guardados; después registra la lista actual de miembros y prepara el informe:

```sh
tg chats members fetch "Hiking Club" --track --json
tg stats chats show "Hiking Club" --since-time 7d --by day --timezone Europe/Madrid --json
tg chats members history "Hiking Club" --since-time 7d --offline --json
tg chats tracking show "Hiking Club" --offline --json
tg chats members audit "Hiking Club" --json
```

Pide al agente que incluya mensajes, remitentes activos, preguntas sin respuesta, cambios de miembros y días con instantáneas. Mantén visibles en el informe `complete`, `more`, `unknown` y los huecos entre instantáneas. Deja `tg serve` funcionando o repite las descargas de miembros para los informes siguientes; el primer informe no puede mostrar salidas anteriores a la primera lista registrada.
