---
title: "Administrar tus grupos"
---

`max` ayuda a los administradores a encontrar preguntas sin respuesta, ver quién se incorporó y la antigüedad de su cuenta, y eliminar spam según sus reglas. Por defecto solo informa. Borrar mensajes o expulsar personas requiere tu permiso.

Estas acciones usan tu cuenta personal en grupos donde eres administrador. Consulta la [Guía de uso](./usage.md#группы-и-каналы) y la [Referencia de comandos](./commands.md).

Las órdenes que modifican grupos devuelven `operationId` en JSON; después de crear, entrar, modificar o renovar el enlace, la ficha está en `chat`. Si el título o la descripción cambió pero la solicitud de ajustes no terminó, el resultado es `outcome_unknown`. Consulta el grupo con `chats show` antes de repetir: el cambio puede haberse aplicado parcialmente.

## Trabajar con un agente

Un agente con acceso al terminal, como Claude Code o Codex, puede usar la [habilidad](https://github.com/leemour/max-cli/blob/v0.39.0/README.md#навык-для-агентов-с-терминалом). Sin acceso al terminal, usa el [servidor MCP](./mcp.md), por ejemplo en Claude Desktop. Cursor admite ambas opciones. A continuación: tu petición, el comando del agente y el resultado.

<a id="la-mañana-del-administrador-quién-espera-respuesta" />

### Revisión de la mañana: quién espera una respuesta

Empieza por las preguntas que esperan una respuesta tuya o de los administradores.

**Tu petición:**

> ¿Qué preguntas de Поход llevan más de cuatro horas esperando respuesta?

**Comando:**

```sh
max review --chat "Поход" --unanswered 4h --json
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

Estas son las reglas de `review`: un signo de interrogación fuera de un enlace, o una respuesta a ti o a un administrador, puede abrir una pregunta. Tu respuesta o la de un administrador, incluso el siguiente mensaje, puede cerrarla. El [informe estadístico](./rankings.md) cuenta respuestas directas vinculadas y puede dar otro resultado.

### Nuevos miembros de la semana

Revisa los eventos de entrada. Una cuenta nueva merece revisión; su edad no demuestra que sea spam.

**Tu petición:**

> ¿Quién se unió a Поход esta semana? Muéstrame a quién conviene revisar.

**Comando:**

```sh
max chats events "Поход" --type add --since-time 7d --json
```

**Ejemplo de respuesta del agente:**

> | Nuevo miembro | Cómo entró |
> | --- | --- |
> | Kate | Añadido por Lena |
> | Oleg | Entró por su cuenta |
>
> Revisa la información disponible del perfil de Oleg antes de sacar conclusiones. La edad de la cuenta no basta para expulsarlo.

Los eventos solo cubren el historial disponible. Puedes consultar la lista actual de miembros por separado.

### Limpiar spam con tu confirmación

Consulta las propuestas de las reglas antes de aplicar acciones.

**Tu petición:**

> Revisa el spam en Поход. Primero muéstrame las acciones propuestas.

**Comando:**

```sh
max chats moderate "Поход" --dry-run --json
```

**Ejemplo de respuesta del agente:**

> | Hallazgo | Acción propuesta | Estado |
> | --- | --- | --- |
> | Enlace de invitación | Eliminar el mensaje | Solo vista previa |
>
> No se ha eliminado nada. Confirma el mensaje concreto si quieres aplicar la acción.

Aplicar una acción requiere tu petición y los permisos del perfil. La vista previa no autoriza la eliminación.

<a id="informe-semanal-del-grupo" />

### Resumen semanal

Pide un resumen de decisiones, compromisos y preguntas pendientes.

**Tu petición:**

> Resume la semana en Поход.

**Comando:**

```sh
max review --chat "Поход" --since-time 7d --json
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

### Comprobaciones programadas

No hace falta un agente: la comprobación es una orden normal. Dos veces al día, permitiendo borrar cuando el consentimiento sea `ask`:

```cron
0 9,21 * * * max chats moderate "Поход" --allow-dangerous >> ~/max-check.log 2>&1
```

Sin `--allow-dangerous`, las acciones de cron con nivel `ask` solo se planifican y esperan tu respuesta. Consulta en [recipes.md](./recipes.md#как-запускать-по-расписанию) las líneas `PATH` y `XDG_RUNTIME_DIR` que necesita `max` para encontrar Node y tu sesión en cron.

## Acciones disponibles

| Comando | Función |
|---|---|
| `max review --chat <чат> --unanswered [длительность]` | Preguntas sin contestación tuya ni de administradores durante ese plazo, por ejemplo `4h`; por defecto `24h` |
| `max chats events <чат>` | Incorporaciones, salidas, altas y expulsiones, y sus responsables; últimos 7 días |
| `max chats members list <чат>` | Página de miembros de MAX (`--all` muestra todos los disponibles, hasta 5000): propietario, administradores (el rol puede estar desactualizado justo tras `admins add`), creación de cuenta y última conexión |
| `max chats rules show\|set\|unset <чат>` | Reglas del grupo |
| `max chats moderate <чат>` | Comprobar reglas y ejecutar lo permitido |
| `max chats members add\|remove`, `admins add\|remove` | Gestionar miembros y administradores |
| `max chats link show\|reset <чат>` | Enlace de invitación; `reset` crea uno e invalida el anterior |
| `max chats update` | Ajustes, título, descripción y foto; consulta los ajustes con `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | Borrar para todos, fijar o desfijar |
| `max chats requests list\|accept\|decline <чат>` | Solicitudes para entrar en un canal con aprobación: quién lo pide, dejarle entrar, rechazarle |
| `max chats requests list <чат>` | Solicitudes para un canal con aprobación; las ven los administradores, se desconoce la fecha |
| `max chats requests accept\|decline <чат> <человек>` | Aceptar o rechazar una solicitud; no admite aceptación masiva ni filtros `--link` |

Un agente sin terminal puede usar las herramientas MCP equivalentes: `max_read` (`command: "review"`) con `unanswered_after_hours`, `max_read` (`command: "chats events"`), `max_read` (`command: "chats members"`), `max_read` (`command: "chats rules"`) y `max_write` (`command: "chats check"`) ([mcp.md](./mcp.md)).

## Qué necesita tu respuesta

`max review` mantiene una lista de tareas en la copia local; `max serve` todavía no abre tareas en MAX. Una pregunta sin respuesta o un mensaje que te menciona por tu nombre abre una tarea; tu respuesta la cierra. La tarea enlaza al mensaje sin copiar su texto.

```sh
max tasks list --state open
```

```sh
max tasks list --chat "Поход" --type question,mention
```

```sh
max tasks add msg:max/<вы>/<чат>/<сообщение> --type promise
```

```sh
max tasks close <задача> --as dismissed --reason no-reply-needed
```

```sh
max stats tasks show
```

Las tareas cerradas siguen cerradas y las descartadas no vuelven a aparecer. Solo tu respuesta cierra una tarea; la de un administrador todavía no lo hace y las menciones mediante `@ник` no se detectan. Las herramientas MCP equivalentes son `max_read` (`command: "tasks list"`), `max_write` (`command: "tasks add"`), `max_write` (`command: "tasks close"`) y `max_read` (`command: "stats tasks show"`) ([mcp.md](./mcp.md)).

## Reglas

Se guardan en tu ordenador, por grupo. El primer `set` escribe todas las reglas con sus valores iniciales.

| Regla | Valor inicial | Significado |
|---|---|---|
| `trusted` | — | IDs separados por comas; las reglas no afectan a estas personas |
| `blocked` | — | IDs cuyas incorporaciones y mensajes se comprueban |
| `blockedNames` | — | Fragmentos de nombres separados por comas, sin distinguir mayúsculas |
| `blockedPeople` | `report` | Acción para mensajes o incorporaciones de bloqueados |
| `invites` | `report` | Invitaciones a otros chats (`max.ru/join/…`, enlaces de Telegram) |
| `links` | `report` | Cualquier enlace |
| `forwards` | `report` | Mensajes reenviados |
| `flood.messages`, `flood.minutes`, `flood.action` | 5, 1, `report` | Más de 5 mensajes en un minuto de una persona |
| `newAccount.days`, `newAccount.action` | 7, `report` | Cuenta de menos de 7 días; 0 desactiva |
| `consent.delete`, `consent.remove` | `ask` | Permiso para cada acción |

Las acciones son `report` (informar), `delete` (borrar para todos) y `remove` (expulsar). Ante varias infracciones, se elige la acción más fuerte. Tú, los administradores y `trusted` quedáis excluidos.

El consentimiento decide si se ejecuta:

- `deny`: nunca.
- `readonly`: solo informar.
- `ask`: preguntar en el terminal; sin respuesta, la acción espera. `--allow-dangerous` permite esas acciones en esta ejecución.
- `allow`: inmediatamente.

Los archivos antiguos se siguen leyendo: `forbid` pasa a ser `deny`, y `flag` y `confirm` pasan a ser `ask`. MCP llama a `max_write` con `command: "chats check"`; las acciones con nivel de consentimiento `ask` permanecen como planes, sin formularios de confirmación del servidor.

`chats moderate --json` devuelve `{ chatId, rows }`. `--since-time` acepta una fecha ISO 8601 o `30m`, `2h`, `1d`, no un ID de mensaje; no cambia el punto guardado. Ese punto se guarda junto a las reglas; el anterior, de la sesión, se migra automáticamente antes de la primera ejecución. CLI y MCP personal comparten el mismo punto.

## Mediante un bot

Un bot administrador puede ejecutar `max <бот> bot chats
moderate`. Puede impedir el regreso por invitación a las personas expulsadas, a diferencia de la cuenta personal. No conoce la antigüedad de las cuentas. Consulta [Comprobaciones del bot](./bot.md#проверка-чата-по-правилам).

## Límites

- **La cuenta personal no puede vetar el regreso.** Una persona expulsada puede volver por invitación. Renueva el enlace (`max chats link reset`) o utiliza un bot.
- **Las solicitudes de ingreso solo existen en un canal con aprobación.** Un grupo privado no tiene aprobación: con el enlace se entra al momento. En un canal con aprobación, `chats join` solo envía la solicitud (`requested: true`). `chats requests list` no muestra cuándo lo pidió alguien: MAX no lo informa. No se puede responder a todos a la vez ni elegir solicitudes por enlace.
- **Máximo 10 acciones por comprobación** (`--max-actions`). Los borrados cuentan en el límite horario; el resto espera.
- **Hasta 1000 mensajes por comprobación en CLI.** La siguiente continúa desde el punto anterior.
- **Una incorporación requiere toda la lista de miembros** para conocer la antigüedad de la cuenta; en grupos grandes puede necesitar decenas de solicitudes.
- **No hay vigilancia automática.** Solo se comprueba cuando tú, tu agente por encargo o tu programación lo iniciáis.

## Estadísticas para administradores de grupos

Consulta los mensajes, las personas que escribieron y las respuestas de la semana. Para saber quién responde, quién necesita ayuda y si los nuevos miembros se quedan, abre [Estadísticas](./rankings.md).

**Tu petición:**

> Muéstrame la actividad de Поход esta semana y las lagunas del historial.

**Comando:**

```sh
max stats chats show "Поход" --since-time 7d --offline --json
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

### Instantáneas de miembros

`max chats members fetch` guarda miembros en el almacenamiento local: sus perfiles, cambios, el número diario de miembros y el resultado de la comprobación de integridad. `--budget` limita las páginas. Una lista incompleta no marca a nadie como salido: para ello se necesita toda la lista disponible y un número conocido de miembros del grupo que no supere el número obtenido. En MAX, las listas suelen ser parciales; aumentar el presupuesto solo ayuda cuando el servidor proporciona realmente más páginas.

`chats tracking add` añade un grupo al seguimiento. `chats tracking list` muestra los grupos seguidos; `show` muestra el estado del grupo y las instantáneas del número de miembros de los últimos 30 días. `add` no obtiene los miembros de inmediato; `remove` detiene el seguimiento y conserva el historial recopilado. El servidor de MAX recopila diariamente los miembros de los grupos seguidos mientras está en marcha. Añadir un grupo al seguimiento no inicia el servidor ni prolonga su tiempo límite de inactividad; consulta los detalles más abajo.

`max chats members history` muestra las entradas, salidas y cambios de perfil guardados en orden cronológico; `--since-time` limita el periodo. No contacta con MAX. La fecha de entrada procede de MAX si se conoce; de lo contrario, es la primera vez que se detectó a la persona. La fecha de salida es la primera instantánea completa sin ella, no el momento exacto de su salida. La primera consulta establece la composición inicial; esas personas no necesariamente entraron ese día. `chats members list --offline` muestra la última lista de miembros guardada completa; las consultas parciales no la sustituyen. Si todavía no hay una instantánea completa, la lista puede estar vacía aunque ya haya perfiles y eventos guardados. Los perfiles y el historial permanecen en el almacenamiento local junto a los mensajes.

`max chats members audit` consulta los miembros y muestra señales de cuentas sospechosas. `--budget` limita las páginas y `--min-score` establece la puntuación mínima. Es una pista para que una persona la revise: no se elimina a nadie, se excluyen los administradores y el propietario, `more` indica una lista incompleta y `unknown` indica señales desconocidas. MAX no proporciona todas las señales de Telegram. Esta comprobación no está disponible con `--offline`. «No escribió» significa que no se encontraron mensajes de esa persona en el historial local; no demuestra que nunca escribiera en el grupo.

`--deep <n>` comprueba además en profundidad a los primeros n miembros, uno por segundo: su perfil y hasta 1000 mensajes guardados de cada uno. Las listas públicas de spam solo cubren cuentas de Telegram, por lo que no se consultan para MAX, y la respuesta lo explica.

### Informe semanal de tu grupo

«Поход» es un grupo ficticio del ejemplo siguiente. Primero descarga sus mensajes con `store fetch` si todavía no están guardados; después guarda los miembros actuales y prepara un informe:

```sh
max chats tracking add "Поход" --json
```

```sh
max chats members fetch "Поход" --json
```

```sh
max stats chats show "Поход" --since-time 7d --by day --timezone Europe/Madrid --json
```

```sh
max chats members history "Поход" --since-time 7d --offline --json
```

```sh
max chats tracking show "Поход" --offline --json
```

```sh
max chats members audit "Поход" --json
```

Pide al agente que indique el número de mensajes y remitentes activos, las preguntas sin respuesta, los cambios de miembros y los días con instantáneas. Conserva los indicadores de datos incompletos en el informe: `complete`, `more`, `unknown` y los días sin instantáneas. Repite la recopilación de miembros para el siguiente informe; el primero no puede mostrar salidas anteriores a la primera lista de miembros guardada.

## Historial diario de miembros

Añade un grupo con `max chats tracking add <группа>` o ejecuta `max chats members fetch <группа> --track`. Mientras el servidor de MAX está en marcha, obtiene los miembros de los grupos seguidos por primera vez un minuto después de conectarse y después una vez al día. `max chats tracking list` muestra los grupos seguidos y sus últimos recuentos guardados.

El seguimiento no inicia el servidor ni prolonga su tiempo límite de inactividad. Mantén `max server` en marcha de forma continua para obtener un historial diario. Si ya se han guardado los miembros hoy en UTC, incluso con una respuesta parcial, se omite la consulta automática; puedes repetirla manualmente con `max chats members fetch <группа>`. Una lista incompleta no demuestra que los miembros ausentes hayan salido.

`max chats tracking remove <группа>` detiene las consultas automáticas futuras; el historial guardado sigue disponible mediante `max chats members history <группа>`.
