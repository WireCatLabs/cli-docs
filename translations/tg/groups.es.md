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
| `tg chats link show\|reset <chat>` | consultar el enlace de invitación; `reset` crea otro y el anterior deja de funcionar |
| `tg messages delete --for-everyone`, `pin`, `unpin` | eliminar para todos o fijar mensajes |

Un agente sin terminal dispone de las operaciones de lectura mediante herramientas MCP: `tg_review` con `unanswered`, `tg_chats_events`, `tg_chats_members`, `tg_chats_inspect` ([MCP](./mcp.md)).

`create`, `join`, `leave`, `update`, `link reset`, `members` y `admins` producen cambios visibles para el grupo: al crear un grupo se avisa a los añadidos, y al entrar o salir aparece un mensaje en el chat. Cada operación pasa por los permisos del perfil y la protección de envíos; cada persona añadida cuenta para el límite por hora ([seguridad](./security.md#the-send-guard)).

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

Por MCP, `tg_chats_moderate` solo actúa si el nivel es `allow`; las acciones que requieren aprobación se enumeran sin ejecutarlas. `newAccount` no está disponible: Telegram no indica la antigüedad de una cuenta.

## Limitaciones

- **El historial de Telegram es la fuente.** `chats events` y `review` ven lo que todavía contiene el historial; si un administrador elimina un mensaje de servicio, también desaparece para estos comandos.
- **Solo se conocen los administradores si Telegram los indica.** En caso contrario, `review --unanswered` solo cuenta tus respuestas y lo avisa.
- **Nada vigila el grupo por su cuenta.** La revisión se ejecuta cuando la inicias tú, un agente por petición tuya o una tarea programada.
- **Se aplican los límites de Telegram.** Leer todos los miembros de un grupo grande requiere muchas peticiones. Una respuesta `FLOOD_WAIT` indica cuánto debes esperar ([solución de problemas](./troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).

## Estadísticas de actividad

```sh
tg chats stats <chat> --since-time 7d --by day --timezone Europe/Madrid --json
tg chats stats <chat> --offline --json
```

Cuenta, a partir del almacén local, los mensajes, los remitentes activos, las respuestas, los hilos, las reacciones, las publicaciones más destacadas y las preguntas contestadas. El comando en línea también pide a Telegram las entradas y salidas del grupo; `--offline` y la herramienta MCP `tg_chats_stats` omiten `members`. Si `complete` es false, las cifras son un mínimo; ejecuta el `store fetch` que se sugiere.

## Revisar miembros sospechosos

`tg chats members audit <chat>` enumera los miembros con señales propias de un bot y los motivos; `--budget` limita el número de páginas y `--min-score` fija el umbral. No elimina a nadie y excluye a los administradores y al propietario. `more` indica que la lista es parcial, y `unknown` nombra las señales que no están disponibles. No funciona con `--offline`; las puntuaciones requieren revisión humana.

Se recogen de Telegram los indicadores de bot, estafa, cuenta falsa, cuenta eliminada y foto, y los datos de entrada y de quién invitó, cuando Telegram los proporciona.
Consulta `unknown` para ver qué datos no están disponibles; las puntuaciones siguen requiriendo revisión humana.
