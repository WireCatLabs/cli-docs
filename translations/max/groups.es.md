---
title: "Administrar tus grupos"
---

<a id="historial-diario-de-miembros" />
<a id="informe-semanal-del-grupo" />

Esta página te ayuda a administrar un grupo de MAX: encontrar preguntas pendientes, ver quién entró y quién le añadió, resumir la semana, moderar spam con tus reglas y revisar los cambios realizados. Por defecto `max` solo señala infracciones; necesita tu autorización para eliminar mensajes o expulsar personas.

Aquí todo funciona desde tu cuenta personal, en grupos donde tú eres el administrador. Unas palabras que aparecerán a continuación:

- **Admin**: un miembro con derechos para administrar el grupo. Algunos comandos sólo tienen en cuenta sus respuestas y las respuestas de los administradores.
- **Archivo local**: mensajes que `max` almacena en esta computadora. Los informes y las tareas toman datos de él, por lo que solo ven lo que se descarga.

- **Las reglas** dicen qué está buscando `max chats moderate` (por ejemplo, enlaces o inundaciones) y qué puede hacer.
- **Instantánea de los participantes** - lista de participantes guardada en un día. Las instantáneas de diferentes días muestran quiénes se unieron y quiénes se fueron.

## ¿Qué se puede hacer?

|Tarea|Comando|
| --- | --- |
|Encuentre preguntas que esperan ser respondidas| `max review --unanswered` |
|Vea quién se unió, quién se fue, quién fue agregado o eliminado| `max chats events` |
|Resumen de la semana: decisiones, promesas, preguntas abiertas| `max review --since-time 7d` |
|Mantén una lista de lo que te espera| `max tasks list` |
|Elimina el spam según tus propias reglas| `max chats rules set`, `max chats moderate` |
|Reemplace el enlace de invitación filtrado| `max chats link reset` |
|Dejar entrar a la gente o negarles| `max chats requests list\|accept\|decline` |
|Ver actividad de la semana| `max stats chats show` |
|Guarda la lista de participantes todos los días.| `max chats members fetch --track` |
|Encuentra miembros que parezcan bots o spammers| `max chats members audit` |

La lista completa de comandos para grupos se encuentra [a continuación](#что-можно). Detalles sobre cada uno - [grupos y canales en el manual para usar](./usage.md#группы-и-каналы); cada opción está en [referencia de comando](./commands.md).

## Trabajar con un agente

Un agente de IA (como Claude Code, Codex, Cursor o Gemini CLI) puede realizar estas comprobaciones por usted. Un agente con una terminal necesita [skill max](https://github.com/WireCatLabs/max-cli/blob/v0.43.1/README.md#навык-для-агентов-с-терминалом); agente en una aplicación sin terminal - [servidor MCP](./mcp.md). A continuación se muestra su solicitud, el comando del agente y el resultado.

<a id="la-mañana-del-administrador-quién-espera-respuesta" />

### Revisión de la mañana: quién espera una respuesta

Empieza por las preguntas que esperan una respuesta tuya o de los administradores.

**Tu petición:**

> Usa max CLI. ¿Qué preguntas de Поход llevan más de cuatro horas esperando respuesta?

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

> Usa max CLI. ¿Quién se unió a Поход esta semana? Muéstrame a quién conviene revisar.

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

### Enlace filtrado

Cambie el enlace de invitación solo si lo solicita.

**Tu petición:**

> Usa max CLI. Se filtró el enlace de invitación a “Caminata”. Reemplácelo y permita que solo los administradores agreguen personas.

**Reemplazar enlace:**

```sh
max chats link reset "Поход" --json
```

**Limitar la adición de participantes:**

```sh
max chats update "Поход" --only-admins-add on --json
```

**Ejemplo de respuesta del agente:**

> | Ajuste | Resultado |
> | --- | --- |
> | Enlace anterior | Sustituido |
> | Quién puede añadir miembros | Solo administradores |
>
> El resultado incluye el nuevo enlace; compártelo solo con quienes lo necesiten.

Estos comandos modifican el grupo. La petición del ejemplo autoriza ambos cambios; pedir solo ver el enlace no los autoriza.

### Limpiar spam con tu confirmación

Consulta las propuestas de las reglas antes de aplicar acciones.

**Tu petición:**

> Usa max CLI. Revisa el spam en Поход. Primero muéstrame las acciones propuestas.

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

### Resumen semanal

Pide un resumen de decisiones, compromisos y preguntas pendientes.

**Tu petición:**

> Usa max CLI. Resume la semana en Поход.

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

Sin `--allow-dangerous` en cron, las acciones en el nivel `ask` simplemente están planificadas y esperándote. Las líneas `PATH` y `XDG_RUNTIME_DIR`, sin las cuales `max` en cron no encontrará Node ni su entrada, se encuentran en la sección [cómo ejecutar](./recipes.md#как-запускать-по-расписанию) según una programación.

## Acciones disponibles

| Comando | Qué hace |
|---|---|
| `max review --chat <чат> --unanswered [длительность]` | Preguntas sin respuesta tuya o de administradores durante el plazo indicado (por ejemplo `4h`; por defecto `24h`) |
| `max chats events <чат>` | Entradas, salidas, quién añadió o expulsó a quién; 7 días por defecto |
| `max chats members list <чат>` | Página de miembros de MAX (`--all`: todos disponibles, hasta 5000), propietario, administradores, creación de cuenta y última conexión; tras `admins add`, el rol puede tardar en actualizarse |
| `max chats rules show\|set\|unset <чат>` | Reglas del grupo |
| `max chats moderate <чат>` | Comprueba las reglas y realiza lo permitido |
| `max chats members add\|remove`, `admins add\|remove` | Miembros y administradores |
| `max chats requests list <чат>` | Solicitudes de un canal con aprobación; visibles para administradores, sin hora conocida |
| `max chats requests accept\|decline <чат> <человек>` | Aceptar o rechazar; no admite `--all` ni `--link` |
| `max chats link show\|reset <чат>` | Ver o sustituir la invitación; `reset` invalida la antigua |
| `max chats inspect <ссылка>` | Ver el destino de un enlace sin unirse |
| `max chats create`, `max chats join <ссылка>`, `max chats leave <чат>` | Crear, unirse o salir |
| `max chats update` | Ajustes, título, descripción, foto, quién puede fijar (`--all-can-pin`) o añadir personas (`--only-admins-add`); ver ajustes con `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | Eliminar para todos, fijar o desfijar |

Un agente conectado mediante el [servidor MCP](./mcp.md) puede ejecutar los mismos comandos dentro de los permisos del perfil.

Las órdenes que modifican grupos devuelven `operationId` en JSON; después de crear, entrar, modificar o renovar el enlace, la ficha está en `chat`. Si el título o la descripción cambió pero la solicitud de ajustes no terminó, el resultado es `outcome_unknown`. Consulta el grupo con `chats show` antes de repetir: el cambio puede haberse aplicado parcialmente.

## Qué necesita tu respuesta

`max review` mantiene una lista de tareas en el archivo local; `max serve` todavía no abre tareas en MAX. Una pregunta sin respuesta o un mensaje que te menciona por tu nombre abre una tarea; tu respuesta la cierra. La tarea enlaza al mensaje sin copiar su texto.

Mira lo que te espera, los viejos arriba, y luego solo preguntas y menciones en un grupo:

```sh
max tasks list --state open
```

```sh
max tasks list --chat "Поход" --type question,mention
```

Agrega algo que las reglas no ven, como tu promesa, o cierra una tarea que no necesita respuesta:

```sh
max tasks add msg:max/<вы>/<чат>/<сообщение> --type promise
```

```sh
max tasks close <задача> --as dismissed --reason no-reply-needed
```

Ver tareas abiertas por chat, el tiempo más antiguo y medio hasta el cierre:

```sh
max stats tasks show
```

Una tarea cerrada sigue cerrada y una descartada no reaparece. Solo tu respuesta cierra la tarea (todavía no las de administradores); las menciones con `@ник` no se detectan. Los mismos comandos están disponibles mediante MCP.

## Reglas

Las reglas del grupo dicen qué está buscando `max chats moderate` y qué puede hacer al respecto. Se almacenan en tu computadora, cada grupo tiene el suyo y nunca terminan en MAX. El primer `set` escribe todas las reglas a la vez, con valores predeterminados. Nada monitorea el grupo en segundo plano: la regla solo se activa cuando ejecuta `chats moderate`.

Muestra las reglas. Antes del primer cambio, estos son los valores predeterminados, marcados como no guardados:

```sh
max chats rules show "Поход"
```

Eliminar un mensaje con un enlace:

```sh
max chats rules set "Поход" links delete
```

Bloquea a estas personas por número...

```sh
max chats rules set "Поход" blocked 12345,67890
```

...y borrarlos cuando escriban o entren:

```sh
max chats rules set "Поход" blockedPeople remove
```

Eliminar sin preguntarte:

```sh
max chats rules set "Поход" consent.delete allow
```

Vea lo que haría la prueba sin hacer nada:

```sh
max chats moderate "Поход" --dry-run
```

Consulta las novedades del último ejecución y actúa:

```sh
max chats moderate "Поход"
```

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

Se leen los archivos antiguos: `forbid` se convierte en `deny`, `flag` y `confirm` - `ask`. Un agente conectado vía MCP opera sólo donde el nivel es `allow`; Las acciones de nivel `ask` siguen siendo el plan para usted, no hay formularios de servidor.

`chats moderate --json` devuelve `{ chatId, rows }`. `--since-time` acepta una fecha ISO 8601 o `30m`, `2h`, `1d`, no un ID de mensaje; no cambia el punto guardado. Ese punto se guarda junto a las reglas; el anterior, de la sesión, se migra automáticamente antes de la primera ejecución. CLI y MCP personal comparten el mismo punto.

## Mediante un bot

Un bot administrador puede realizar la misma comprobación: `max <бот> bot chats
moderate`. También puede vetar a usuarios expulsados para que no vuelvan con el enlace; la cuenta personal no puede hacerlo. No conoce la edad de las cuentas. Consulta [moderación con un bot](./bot.md#проверка-чата-по-правилам).

## Límites

- **La cuenta personal no puede vetar el regreso.** Una persona expulsada puede volver por invitación. Renueva el enlace (`max chats link reset`) o utiliza un bot.
- **Solo los canales con aprobación tienen solicitudes de entrada.** Un grupo cerrado no tiene aprobación: con el enlace se entra directamente. En un canal con aprobación, `chats join` solo envía la solicitud (`requested: true`). `chats requests list` no muestra cuándo pidió entrar la persona: MAX no lo informa. No se puede responder a todas a la vez ni filtrar solicitudes por enlace.
- **Máximo 10 acciones por comprobación** (`--max-actions`). Los borrados cuentan en el límite horario; el resto espera.
- **Hasta 1000 mensajes por comprobación en CLI.** La siguiente continúa desde el punto anterior.
- **Una incorporación requiere toda la lista de miembros** para conocer la antigüedad de la cuenta; en grupos grandes puede necesitar decenas de solicitudes.
- **No hay vigilancia automática.** Solo se comprueba cuando tú, tu agente por encargo o tu programación lo iniciáis.

## Estadísticas para administradores de grupos

Consulta los mensajes, las personas que escribieron y las respuestas de la semana. Para saber quién responde, quién necesita ayuda y si los nuevos miembros se quedan, abre [Estadísticas](./rankings.md).

**Tu petición:**

> Usa max CLI. Muéstrame la actividad de Поход esta semana y las lagunas del historial.

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

`max chats members fetch` lee los miembros en una archivo local: guarda sus perfiles, cambios, número de miembros por día y el resultado de la verificación de integridad. `--budget` limita el número de páginas. Si la lista está incompleta, no se registra que nadie se haya ido: esto requiere toda la lista disponible y un número conocido de miembros del grupo, que no exceda el número de personas leídas. En MAX, las listas suelen ser parciales; aumentar el presupuesto sólo ayuda cuando el servidor realmente sirve las páginas restantes.

<a id="ежедневная-история-состава"></a>

Para guardar miembros cada día, añade el grupo al seguimiento con `max chats tracking add <группа>` (no lee miembros inmediatamente) o `max chats members fetch <группа> --track`. Mientras `max server` funciona, lee los grupos seguidos un minuto después de conectar y después una vez al día. Si hoy en UTC ya guardó una respuesta, incluso incompleta, omite la descarga automática; puedes repetirla manualmente con `max chats members fetch <группа>`.

El seguimiento no inicia el servidor ni extiende su tiempo de inactividad: para el historial diario, mantenga `max server` ejecutándose en todo momento. `max chats tracking list` muestra los siguientes grupos y el último número guardado de participantes; `show`: estado del grupo e instantáneas del número de participantes durante los últimos 30 días. `max chats tracking remove <группа>` detiene la recepción automática; el historial acumulado permanece accesible a través de `max chats members history`.

`max chats members history` muestra entradas, salidas y cambios de perfil guardados en orden temporal; `--since-time` limita el período. No consulta MAX. Usa la hora de entrada de MAX si se conoce; si no, la primera vez que se observó a la persona. La salida corresponde a la primera instantánea completa sin ella, no a la hora exacta. La primera lectura crea la lista inicial: esas personas no necesariamente entraron ese día. `chats members list --offline` muestra la última lista completa; una lectura parcial no la sustituye. Sin ninguna instantánea completa puede estar vacía aunque existan perfiles y eventos individuales. Los perfiles y el historial se conservan junto a tus mensajes en el archivo local.

`max chats members audit` consulta los miembros y muestra señales de cuentas sospechosas. `--budget` limita las páginas y `--min-score` establece la puntuación mínima. Es una pista para que una persona la revise: no se elimina a nadie, se excluyen los administradores y el propietario, `more` indica una lista incompleta y `unknown` indica señales desconocidas. MAX no proporciona todas las señales de Telegram. Esta comprobación no está disponible con `--offline`. «No escribió» significa que no se encontraron mensajes de esa persona en el historial local; no demuestra que nunca escribiera en el grupo.

`--deep <n>` comprueba además en profundidad a los primeros n miembros, uno por segundo: su perfil y hasta 1000 mensajes guardados de cada uno. Las listas públicas de spam solo cubren cuentas de Telegram, por lo que no se consultan para MAX, y la respuesta lo explica.

### Informe semanal de tu grupo

"Caminata" a continuación es un grupo de ejemplo ficticio. Primero descargue sus mensajes a través de `store fetch` si aún no están en una archivo local, luego guarde la composición actual y prepare un informe:

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
