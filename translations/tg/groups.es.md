---
title: "Administrar grupos"
---

`tg` ayuda a administrar un grupo: muestra las preguntas sin respuesta, quién se ha unido y quién lo ha añadido, y lo ocurrido durante la semana. Lee sin marcar los mensajes como leídos, por lo que los miembros no ven que has revisado el grupo.

Todo lo descrito aquí funciona desde tu cuenta personal. Consulta los comandos completos en [uso de grupos y canales](./usage.md#groups-and-channels) y todas las opciones en la [referencia de comandos](./commands.md).

## Con un agente

Un agente con terminal (Claude Code, Codex) necesita la [skill](./recipes.md#once-first); uno sin terminal (Claude Desktop, Cursor) necesita el [servidor MCP](./mcp.md). Los ejemplos siguientes muestran qué pedir, qué comando ejecuta el agente y qué devuelve.

### Revisión de la mañana: quién espera una respuesta

Empieza por las preguntas que esperan una respuesta tuya o de los administradores.

**Tu petición:**

> ¿Qué preguntas de Hiking llevan más de cuatro horas esperando respuesta?

**Comando:**

```sh
tg review --chat "Hiking" --unanswered 4h --json
```

**Ejemplo de respuesta del agente:**

> **3 preguntas esperan una respuesta.**
>
> | Persona | Pregunta | Espera |
> | --- | --- | --- |
> | Lena | ¿A qué hora salimos el sábado? | 6 horas |
> | Sam | ¿Compartimos las tiendas? | 12 horas |
> | Ira | ¿Quién llevará la olla? | 15 horas |
>
> Abre una pregunta para revisar el contexto de la conversación.

Estas son las reglas de `review`: un signo de interrogación fuera de un enlace, o una respuesta a ti o a un administrador, puede abrir una pregunta. Tu respuesta o la de un administrador, incluso el siguiente mensaje, puede cerrarla. El [informe estadístico](./rankings.md) cuenta respuestas directas vinculadas y puede dar otro resultado. Si Telegram no proporciona la lista de administradores, solo cuentan tus respuestas y el resultado lo indica.

### Nuevos miembros de la semana

Revisa los eventos de entrada. Una cuenta nueva merece revisión; su edad no demuestra que sea spam.

**Tu petición:**

> ¿Quién se unió a Hiking esta semana? Muéstrame a quién conviene revisar.

**Comando:**

```sh
tg chats events "Hiking" --type join,add --since-time 7d --json
```

**Ejemplo de respuesta del agente:**

> | Nuevo miembro | Cómo entró |
> | --- | --- |
> | Kate | Añadido por Lena |
> | Oleg | Entró por su cuenta |
>
> Revisa la información disponible del perfil de Oleg antes de sacar conclusiones. La edad de la cuenta no basta para expulsarlo.

Los eventos solo cubren el historial disponible. Puedes consultar la lista actual de miembros por separado.

### Un enlace de invitación filtrado

Reemplaza el enlace de invitación cuando hayas pedido ese cambio.

**Tu petición:**

> Se filtró el enlace de Hiking. Reemplázalo y permite que solo los administradores añadan miembros.

**Reemplazar el enlace:**

```sh
tg chats link reset "Hiking" --json
```

**Restringir la incorporación de miembros:**

```sh
tg chats update "Hiking" --only-admins-add on --json
```

**Ejemplo de respuesta del agente:**

> | Ajuste | Resultado |
> | --- | --- |
> | Enlace anterior | Reemplazado |
> | Quién puede añadir miembros | Solo administradores |
>
> El enlace privado nuevo aparece en el resultado solicitado; compártelo solo con las personas indicadas.

Estos comandos cambian el grupo. La petición del ejemplo autoriza ambos cambios; una petición para consultar el enlace no lo haría.

### Resumen semanal

Pide un resumen de decisiones, compromisos y preguntas pendientes.

**Tu petición:**

> Resume la semana en Hiking.

**Comando:**

```sh
tg review --chat "Hiking" --since-time 7d --json
```

**Ejemplo de respuesta del agente:**

> **Decidido:** salir a las 7:00 desde la estación.
>
> **Compromisos:**
>
> - Lena — comida.
> - Sam — tiendas.
>
> **Pendiente:** quién llevará la olla.
>
> Puedo mostrar los mensajes originales para comprobar el resumen.

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
| `tg topics show <chat> <id>` | un tema: título, si está cerrado o fijado, mensajes sin leer, última actividad |
| `tg topics enable <chat>` | activa un foro; un grupo básico requiere `--upgrade --yes` y devuelve un nuevo identificador de chat |
| `tg topics create <chat> <title>` | crea un tema; si el resultado es desconocido, consulta `topics list` en vez de repetir |
| `tg messages send <chat> <text> --topic <id>`, `tg polls create <chat> <question> <answers> --topic <id>` | envía un mensaje o una encuesta a un tema de foro |
| `tg messages forward <chat> <message> --to <forum> --topic <id>` | reenvía un mensaje a un tema del foro de `--to` |
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
tg tasks list --state open
```

```sh
tg tasks list --chat "Hiking" --type question,mention
```

```sh
tg tasks add msg:telegram/<you>/<chat>/<message> --type promise
```

```sh
tg tasks close <task> --as dismissed --reason no-reply-needed
```

```sh
tg stats tasks show
```

Una tarea cerrada sigue cerrada y una descartada nunca vuelve. Solo tus respuestas cierran una tarea, no las de un administrador; no se detectan las menciones por `@username`. El agente obtiene lo mismo con herramientas MCP: `tg_read` (`command: "tasks list"`), `tg_write` (`command: "tasks add"`), `tg_write` (`command: "tasks close"`), `tg_read` (`command: "stats tasks show"`) ([mcp.md](./mcp.md)).

## Reglas

Las reglas del grupo definen qué busca `tg chats moderate` y qué puede hacer. Se guardan en un archivo del perfil, nunca en Telegram. No hay vigilancia automática en segundo plano: las reglas solo se aplican al ejecutar `chats moderate`.

```sh
tg chats rules show "Hiking"
```

```sh
tg chats rules set "Hiking" links delete
```

```sh
tg chats rules set "Hiking" blocked 12345,67890
```

```sh
tg chats rules set "Hiking" blockedPeople remove
```

```sh
tg chats rules set "Hiking" consent.delete allow
```

```sh
tg chats moderate "Hiking" --dry-run
```

```sh
tg chats moderate "Hiking"
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

Consulta los mensajes, las personas que escribieron y las respuestas de la semana. Para saber quién responde, quién necesita ayuda y si los nuevos miembros se quedan, abre [Estadísticas](./rankings.md).

**Tu petición:**

> Muéstrame la actividad de Hiking esta semana y las lagunas del historial.

**Comando:**

```sh
tg stats chats show "Hiking" --since-time 7d --offline --json
```

**Ejemplo de respuesta del agente:**

> | Métrica | En el historial disponible |
> | --- | ---: |
> | Mensajes | 120 |
> | Personas que escribieron | 18 |
> | Respuestas | 30 |
>
> El historial está incompleto: estos son recuentos observados. Esta consulta local no descargó eventos de entrada o salida.

Sin `--offline`, el CLI también descarga eventos de entrada y salida. Las observaciones diarias de miembros guardadas siguen disponibles localmente. El primer informe no puede reconstruir listas de miembros anteriores.

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
```

```sh
tg stats chats show "Hiking Club" --since-time 7d --by day --timezone Europe/Madrid --json
```

```sh
tg chats members history "Hiking Club" --since-time 7d --offline --json
```

```sh
tg chats tracking show "Hiking Club" --offline --json
```

```sh
tg chats members audit "Hiking Club" --json
```

Pide al agente que incluya mensajes, remitentes activos, preguntas sin respuesta, cambios de miembros y días con instantáneas. Mantén visibles en el informe `complete`, `more`, `unknown` y los huecos entre instantáneas. Deja `tg serve` funcionando o repite las descargas de miembros para los informes siguientes; el primer informe no puede mostrar salidas anteriores a la primera lista registrada.
