---
title: "Administrar tus grupos"
---

`max` ayuda a los administradores a encontrar preguntas sin respuesta, ver quién se incorporó y la antigüedad de su cuenta, y eliminar spam según sus reglas. Por defecto solo informa. Borrar mensajes o expulsar personas requiere tu permiso.

Estas acciones usan tu cuenta personal en grupos donde eres administrador. Consulta la [Guía de uso](./usage.md#группы-и-каналы) y la [Referencia de comandos](./commands.md).

Las órdenes que modifican grupos devuelven `operationId` en JSON; después de crear, entrar, modificar o renovar el enlace, la ficha está en `chat`. Si el título o la descripción cambió pero la solicitud de ajustes no terminó, el resultado es `outcome_unknown`. Consulta el grupo con `chats show` antes de repetir: el cambio puede haberse aplicado parcialmente.

## Trabajar con un agente

Un agente con acceso al terminal, como Claude Code o Codex, puede usar la [habilidad](https://github.com/leemour/max-cli/blob/v0.38.1/README.md#навык-для-агентов-с-терминалом). Sin acceso al terminal, usa el [servidor MCP](./mcp.md), por ejemplo en Claude Desktop. Cursor admite ambas opciones. A continuación: tu petición, el comando del agente y el resultado.

### La mañana del administrador: quién espera respuesta

```text
Вы:     Что в «Поход» осталось без ответа?
Агент:  (max review --chat "Поход" --unanswered 4h --json)
        Без ответа больше 4 часов — 3 вопроса:
        · Лена, 08:12 — «Во сколько выезд в субботу?»
        · Артём, вчера 22:40 — ответ на ваш пост про маршрут: «А палатки общие?»
        · Ира, вчера 19:05 — «Кто везёт котелок?»
        На остальные ответили вы или админы.
```

Una pregunta contiene «?» o responde a un mensaje tuyo o de un administrador. Se considera contestada si tú o un administrador respondéis, o sois los primeros en hablar después de quien preguntó. Un «?» dentro de un enlace no cuenta.

### Nuevos miembros de la semana

```text
Вы:     Кто вступил в «Поход» за неделю? Есть подозрительные?
Агент:  (max chats events "Поход" --type add --json)
        (max chats members list "Поход" --all --json)
        За неделю добавили 4 человек:
        · Катя Смирнова — добавила Лена, аккаунту 3 года
        · Олег — вступил сам, аккаунту 2 дня
        · …
        Стоит посмотреть: Олег — аккаунт совсем новый.
```

### Limpiar spam con tu confirmación

Configura las reglas una vez:

```sh
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отмечать
max chats rules set "Поход" consent.delete ask        # но перед удалением — спросить меня
```

```text
Вы:     Проверь «Поход».
Агент:  (max_write, command: "chats check")
        Найдено приглашение. Правила требуют отдельного согласия: действие оставлено планом.
        Для выполнения в терминале: max chats moderate "Поход" --allow-dangerous --json
Вы:     Выполняю эту команду.
```

En el terminal, `max chats moderate "Поход"` hace la misma pregunta: `[y/N]`.

### Informe semanal del grupo

```text
Вы:     Сделай итог недели по «Поход».
Агент:  (max review --chat "Поход" --since-time 2026-09-20T00:00 --json)
        Решили: выезд 4 октября, в 7:00 от метро.
        Взяли на себя: Лена — продукты, Артём — палатки.
        Висит: кто везёт котелок — спросили трижды, ответа нет.
```

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

Un agente sin terminal puede usar las herramientas MCP equivalentes: `max_read` (`command: "review"`) con `unanswered_after_hours`, `max_read` (`command: "chats events"`), `max_read` (`command: "chats members"`), `max_read` (`command: "chats rules"`) y `max_write` (`command: "chats check"`) ([mcp.md](./mcp.md)).

## Qué necesita tu respuesta

`max review` mantiene una lista de tareas en la copia local; `max serve` todavía no abre tareas en MAX. Una pregunta sin respuesta o un mensaje que te menciona por tu nombre abre una tarea; tu respuesta la cierra. La tarea enlaza al mensaje sin copiar su texto.

```sh
max tasks list --state open                               # что ждёт ответа, старые сверху
max tasks list --chat "Поход" --type question,mention
max tasks add msg:max/<вы>/<чат>/<сообщение> --type promise   # то, чего правила не видят
max tasks close <задача> --as dismissed --reason no-reply-needed
max stats tasks show                                           # открытые по чатам, самая старая, медиана до закрытия
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
- **No hay solicitudes de incorporación.** Los grupos son públicos o accesibles por invitación, sin aprobación previa.
- **Máximo 10 acciones por comprobación** (`--max-actions`). Los borrados cuentan en el límite horario; el resto espera.
- **Hasta 1000 mensajes por comprobación en CLI.** La siguiente continúa desde el punto anterior.
- **Una incorporación requiere toda la lista de miembros** para conocer la antigüedad de la cuenta; en grupos grandes puede necesitar decenas de solicitudes.
- **No hay vigilancia automática.** Solo se comprueba cuando tú, tu agente por encargo o tu programación lo iniciáis.

## Estadísticas para administradores de grupos

`max stats chats show` cuenta mensajes, remitentes activos, respuestas, hilos, reacciones y preguntas respondidas del periodo elegido a partir del almacenamiento local. `--by day` o `--by week` añade un desglose por días o semanas naturales; la semana empieza el lunes y `--timezone` establece la zona horaria. Las vistas de publicaciones de canales solo aparecen si MAX las proporcionó y se guardaron con los mensajes. Un recuento ausente no significa cero. Las reacciones se cuentan con los datos guardados, sin volver a consultarlas para cada publicación. Las preguntas se identifican como en `review --unanswered`.

Una ejecución normal también consulta a MAX los eventos de entrada y salida. Con `--offline`, esos eventos no se solicitan, por lo que no aparece `members`. Es distinto de `memberCounts`: las instantáneas diarias guardadas del número de miembros siguen disponibles sin conexión.

Si `complete` es `false`, los datos están incompletos: los totales reflejan solo el historial disponible y las medianas y proporciones pueden diferir de los resultados de todo el grupo. `fetch` sugiere un comando para descargar los mensajes que faltan. Un historial de eventos incompleto también limita los recuentos de entradas y salidas. Ni siquiera un historial de mensajes completo permite reconstruir perfiles anteriores o listas de miembros de días anteriores al inicio de la recopilación.

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
max chats members fetch "Поход" --json
max stats chats show "Поход" --since-time 7d --by day --timezone Europe/Madrid --json
max chats members history "Поход" --since-time 7d --offline --json
max chats tracking show "Поход" --offline --json
max chats members audit "Поход" --json
```

Pide al agente que indique el número de mensajes y remitentes activos, las preguntas sin respuesta, los cambios de miembros y los días con instantáneas. Conserva los indicadores de datos incompletos en el informe: `complete`, `more`, `unknown` y los días sin instantáneas. Repite la recopilación de miembros para el siguiente informe; el primero no puede mostrar salidas anteriores a la primera lista de miembros guardada.

## Historial diario de miembros

Añade un grupo con `max chats tracking add <группа>` o ejecuta `max chats members fetch <группа> --track`. Mientras el servidor de MAX está en marcha, obtiene los miembros de los grupos seguidos por primera vez un minuto después de conectarse y después una vez al día. `max chats tracking list` muestra los grupos seguidos y sus últimos recuentos guardados.

El seguimiento no inicia el servidor ni prolonga su tiempo límite de inactividad. Mantén `max server` en marcha de forma continua para obtener un historial diario. Si ya se han guardado los miembros hoy en UTC, incluso con una respuesta parcial, se omite la consulta automática; puedes repetirla manualmente con `max chats members fetch <группа>`. Una lista incompleta no demuestra que los miembros ausentes hayan salido.

`max chats tracking remove <группа>` detiene las consultas automáticas futuras; el historial guardado sigue disponible mediante `max chats members history <группа>`.
