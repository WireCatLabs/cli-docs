---
title: "Administrar grupos"
---

<a id="qué-espera-tu-respuesta" />
<a id="reglas" />

Utilice esta página cuando sea administrador de un grupo de Telegram y desee ayuda para mantenerlo en orden. Aprenderá cómo encontrar preguntas que nadie respondió, ver quién se unió y quién los agregó, resumir una semana, eliminar el spam según sus propias reglas y mantener un historial de la lista de miembros. La lectura marca nada leído, por lo que verificar un grupo no les dice a sus miembros que usted miró.

Aquí todo funciona desde tu cuenta personal, en grupos donde eres administrador. Algunas palabras en esta página:

- **Un administrador** es un miembro con derechos para administrar el grupo. Algunos comandos cuentan sólo sus respuestas y las respuestas de los administradores.
- **El almacén local** es la copia de mensajes que `tg` guarda en esta computadora. Los informes y las tareas lo utilizan, por lo que solo ven lo que se descargó.
- **Una tarea** es algo que espera de ti, como una pregunta que nadie respondió. `tg` abre y cierra tareas en el archivo local.
- **Las reglas** dicen qué busca `tg chats moderate`, como enlaces o inundaciones, y qué puede hacer.
- **Una instantánea de miembros** es la lista de miembros guardada en un día. Las instantáneas a lo largo del tiempo muestran quién se unió y quién se fue.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Encuentra preguntas que esperan una respuesta | `tg review --unanswered` |
| Vea quién se unió, se fue, fue agregado o eliminado | `tg chats events` |
| Resumen de una semana: decisiones, promesas, preguntas abiertas | `tg review --since-time 7d` |
| Mantenga una lista de lo que le espera | `tg tasks list` |
| Elimina el spam según tus propias reglas | `tg chats rules set`, `tg chats moderate` |
| Reemplazar un enlace de invitación filtrado | `tg chats link reset` |
| Dejar entrar a la gente o rechazarla | `tg chats requests list\|accept\|decline` |
| Ver la actividad de la semana y las estadísticas propias de Telegram | `tg stats chats show`, `tg stats chats official` |
| Guarde la lista de miembros todos los días | `tg chats members fetch --track` |
| Encuentra miembros que parezcan bots o spammers | `tg chats members audit` |

La lista completa de comandos de grupo está [abajo](#what-there-is). Los detalles de cada comando se encuentran en [grupos y canales en la guía de uso](./usage.md#groups-and-channels); cada opción está en la [referencia de comando](./commands.md).

## Con un agente

Su agente de IA (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI) puede ejecutar estas comprobaciones por usted. Un agente con una terminal necesita la [skill tg](./recipes.md#once-first); un agente en una aplicación sin terminal necesita el [servidor MCP](./mcp.md). A continuación: lo que usted dice, lo que ejecuta el agente y lo que obtiene a cambio.

Los nombres, mensajes y resultados a continuación son ficticios. Los comandos están separados de la respuesta: el agente lee los datos y los presenta.

### Revisión de la mañana: quién espera una respuesta

Empieza por las preguntas que esperan una respuesta tuya o de los administradores.

**Tu petición:**

> Usa tg CLI. ¿Qué preguntas de Hiking llevan más de cuatro horas esperando respuesta?

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

> Usa tg CLI. ¿Quién se unió a Hiking esta semana? Muéstrame a quién conviene revisar.

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

> Usa tg CLI. Se filtró el enlace de Hiking. Reemplázalo y permite que solo los administradores añadan miembros.

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

### Limpieza de spam con tu aprobación

Primero vea lo que sugieren las reglas, sin ninguna acción.

**Tu petición:**

> Usa tg CLI. Verifique Hiking en busca de spam. No borres nada todavía; mostrar las sugerencias.

**Comando:**

```sh
tg chats moderate "Hiking" --dry-run --json
```

**Ejemplo de respuesta del agente:**

> **Acción sugerida:** eliminar un mensaje con un enlace de invitación.
>
> | Encontrado | Sugerencia | Estado |
> | --- | --- | --- |
> | Enlace de invitación | Eliminar el mensaje | Solo vista previa |
>
> No se eliminó nada. Confirma el mensaje concreto antes de aplicar la acción.

Las acciones reales necesitan tu solicitud y los permisos del perfil. Una vista previa no da permiso para eliminar.

### Resumen semanal

Pide un resumen de decisiones, compromisos y preguntas pendientes.

**Tu petición:**

> Usa tg CLI. Resume la semana en Hiking.

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

cron no tiene terminal y, a menudo, no tiene `XDG_RUNTIME_DIR`, sin el cual `tg` no puede acceder al llavero: consulte [ejecución programada](./recipes.md#running-on-a-schedule).

## Funciones disponibles

| Comando | Qué hace |
|---|---|
| `tg review --chat <chat> --unanswered [duration]` | preguntas que usted y los administradores no han respondido durante tanto tiempo: `4h`, `1d`; 24 horas por defecto |
| `tg chats events <chat>` | quién se incorporó, se fue, fue añadido o eliminado, y por quién; 7 días por defecto |
| `tg chats members list <chat>` | todos los miembros del grupo, con su rol y cuándo fueron vistos por última vez |
| `tg topics list <chat>`, `tg search topics <chat> <text>` | los temas de un grupo de foro; la búsqueda los encuentra por título |
| `tg topics show <chat> <id>` | un tema: título, cerrado o fijado, recuento de no leídos, última actividad |
| `tg topics enable <chat>` | habilitar un foro; un grupo básico requiere `--upgrade --yes` y devuelve una nueva identificación de chat |
| `tg topics create <chat> <title>` | crear un tema; después de un resultado desconocido marque `topics list` en lugar de repetir |
| `tg messages send <chat> <text> --topic <id>`, `tg polls create <chat> <question> <answers> --topic <id>` | enviar un mensaje o encuesta sobre un tema del foro |
| `tg messages forward <chat> <message> --to <forum> --topic <id>` | reenviar un mensaje a un tema del foro `--to` |
| `tg chats inspect <link>` | adónde conduce una invitación o un enlace público; no se une a nada |
| `tg chats create <title> [person...]` | un nuevo grupo (un supergrupo) o un canal con `--channel` |
| `tg chats join <link>`, `tg chats leave <chat>` | unirse por un enlace, salir |
| `tg chats update <chat>` | el título, la descripción y si los miembros pueden fijar (`--all-can-pin`) o agregar personas (`--only-admins-add`) |
| `tg chats members add\|remove <chat> <person...>` | agregar personas (se les dice; se nombra a quienes no se pudieron agregar) o eliminarlas (sus mensajes permanecen) |
| `tg chats admins add <chat> <person> --can <rights>` | convertir a un miembro en administrador con estos derechos: miembros, administradores, información, fijar, vincular, publicar, editar, eliminar |
| `tg chats admins remove <chat> <person>` | retirar los permisos de administrador; sigue siendo miembro |
| `tg chats link update <chat> <link> --approval\|--no-approval --expire-time <time> --max-uses <n>` | cambiar solo la aprobación, el vencimiento o el límite de uso proporcionados de su enlace de invitación adicional; suministrar al menos un cambio |
| `tg chats link show\|reset <chat>` | el enlace de invitación; `reset` hace uno nuevo y el viejo deja de funcionar |
| `tg chats requests list\|accept\|decline <chat>` | solicitudes para unirse a un grupo que necesita la aprobación de un administrador: quién preguntó, déjelo entrar, rechace; `--all` responde a todas las solicitudes |
| `tg chats rules show\|set\|unset <chat>` | las reglas del grupo |
| `tg chats moderate <chat>` | comprobar el grupo según sus reglas; hace lo que permiten las reglas |
| `tg messages delete --for-everyone`, `pin`, `unpin` | eliminar para todos, pin |

Un agente conectado a través del [servidor MCP](./mcp.md) puede ejecutar los mismos comandos, siempre que los permisos del perfil lo permitan.

`create`, `join`, `leave`, `update`, `link reset`, `members` y `admins` cambian algo que ven los miembros del grupo: un nuevo grupo les dice a las personas agregadas, y se muestra una entrada o salida en el chat. Cada uno pasa por los permisos del perfil y el control de envío, y cada persona agregada cuenta para el límite por hora (consulte [el control de envío](./security.md#the-send-guard)).

## Lo que te espera

`review` y `serve` mantienen una lista de tareas en el archivo local. Una pregunta que nadie respondió y un mensaje que lo menciona por su nombre abre una tarea; tu respuesta lo cierra. Una tarea apunta a su mensaje y nunca lo copia.

Vea lo que le espera, primero el mayor, luego solo preguntas y menciones en un grupo:

```sh
tg tasks list --state open
```

```sh
tg tasks list --chat "Hiking" --type question,mention
```

Agregue lo que las reglas no pueden ver, como una promesa que hizo, o cierre una tarea que no necesita respuesta:

```sh
tg tasks add msg:telegram/<you>/<chat>/<message> --type promise
```

```sh
tg tasks close <task> --as dismissed --reason no-reply-needed
```

Vea las tareas abiertas por chat, la más antigua y el tiempo medio para cerrar:

```sh
tg stats tasks show
```

Una tarea cerrada permanece cerrada y una tarea descartada nunca regresa. Solo sus propias respuestas cierran una tarea (las de un administrador no) y no se ve una mención de `@username`. Un agente conectado a través de MCP recibe los mismos comandos.

## Normas

Las reglas de un grupo dicen qué busca `tg chats moderate` y qué puede hacer al respecto. Viven en un archivo de este perfil, nunca en Telegram, y nada vigila al grupo en segundo plano: una regla actúa sólo cuando ejecutas `chats moderate`.

Muestra las reglas. Hasta el primer cambio, son los valores predeterminados, marcados como no guardados:

```sh
tg chats rules show "Hiking"
```

Eliminar un mensaje que tiene un enlace:

```sh
tg chats rules set "Hiking" links delete
```

Bloquear a estas personas por id...

```sh
tg chats rules set "Hiking" blocked 12345,67890
```

…y eliminarlos cuando escriban o se unan:

```sh
tg chats rules set "Hiking" blockedPeople remove
```

Eliminar sin preguntarte primero:

```sh
tg chats rules set "Hiking" consent.delete allow
```

Vea lo que haría el cheque, sin hacerlo:

```sh
tg chats moderate "Hiking" --dry-run
```

Compruebe qué hay de nuevo desde la última ejecución y actúe:

```sh
tg chats moderate "Hiking"
```

| Regla | Predeterminado | Lo que busca |
|---|---|---|
| `links`, `invites`, `forwards` | `report` | un mensaje con un enlace, un enlace de invitación a otro grupo, un mensaje reenviado |
| `blocked`, `blockedNames` | — | personas por id, o por parte de su nombre, separados por comas |
| `blockedPeople` | `report` | qué hacer con un mensaje o unirse a una persona bloqueada |
| `flood.messages`, `flood.minutes`, `flood.action` | 5, 1, `report` | más que tantos mensajes de una persona en tantos minutos |
| `trusted` | — | personas sobre las que nunca se actúa; tampoco se actúa sobre administradores ni sobre ti |
| `consent.delete`, `consent.remove` | `ask` | hasta donde permites cada acción |

La acción de cada regla es `report`, `delete` o `remove`. Si ocurre un `delete` o un `remove` es el nivel del grupo, `consent.delete` y `consent.remove`: `deny` nunca, `readonly` solo informa, `ask` le pregunta sobre cada uno (el valor predeterminado; `--allow-dangerous` dice sí a todos), `allow` lo hace. Cada acción sigue pasando por el control de envío y su límite horario, y una ejecución se detiene después de `--max-actions` (10). La siguiente ejecución comienza donde se detuvo ésta; `--since-time` mira un momento propio y deja ese punto donde está.

Un agente conectado a través de MCP actúa únicamente cuando un nivel es `allow`; lo que pide aparece en la lista, no se hace. `newAccount` no se ofrece: Telegram no dice la antigüedad de una cuenta.

## Con un bot

Si su bot es administrador del grupo, puede ejecutar la misma verificación: `tg <bot> bot chats moderate`. Una persona que el bot elimina no puede volver a través del enlace a menos que agregue `--no-ban`. El bot solo juzga los mensajes que vio o importó en esta computadora, y no juzga las uniones. Consulte [moderar un grupo con un bot](./bot.md#moderating-a-group-by-its-rules).

## Limitaciones

- **El historial de Telegram es el récord.** `chats events` y `review` ven lo que aún contiene el historial del chat; un mensaje de servicio que un administrador eliminó también desapareció para ellos.
- **Los administradores se conocen solo donde dice Telegram.** Sin ellos, `review --unanswered` cuenta solo tus respuestas y lo dice.
- **Nada vigila un grupo por sí solo.** Se ejecuta una verificación cuando usted, un agente a petición suya o su horario la ejecutan.
- **Se aplican límites de tarifas de Telegram.** Leer a cada miembro de un grupo grande representa muchas solicitudes; una respuesta `FLOOD_WAIT` dice cuánto tiempo esperar (ver [cuando Telegram pide esperar](./troubleshooting.md#telegram-asks-to-wait-n-s-before-the-next-request)).

## Estadísticas para administradores de grupos

Consulta los mensajes, las personas que escribieron y las respuestas de la semana. Para saber quién responde, quién necesita ayuda y si los nuevos miembros se quedan, abre [Estadísticas](./rankings.md).

**Tu petición:**

> Usa tg CLI. Muéstrame la actividad de Hiking esta semana y las lagunas del historial.

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
