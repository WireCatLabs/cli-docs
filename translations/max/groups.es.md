---
title: "Administrar tus grupos"
---

`max` ayuda a los administradores a encontrar preguntas sin respuesta, ver quién se incorporó y la antigüedad de su cuenta, y eliminar spam según sus reglas. Por defecto solo informa. Borrar mensajes o expulsar personas requiere tu permiso.

Estas acciones usan tu cuenta personal en grupos donde eres administrador. Consulta la [Guía de uso](./usage.md#группы-и-каналы) y la [Referencia de comandos](./commands.md).

Las órdenes que modifican grupos devuelven `operationId` en JSON; después de crear, entrar, modificar o renovar el enlace, la ficha está en `chat`. Si el título o la descripción cambió pero la solicitud de ajustes no terminó, el resultado es `outcome_unknown`. Consulta el grupo con `chats show` antes de repetir: el cambio puede haberse aplicado parcialmente.

## Trabajar con un agente

Los agentes con terminal, como Claude Code o Codex, pueden usar una [skill](https://github.com/leemour/max-cli/blob/v0.27.0/README.md#навык-для-агентов-с-терминалом). También pueden conectarse mediante el [servidor MCP](./mcp.md), por ejemplo en Claude Desktop o Cursor. Los ejemplos muestran tu petición, la llamada del agente y el resultado.

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
Агент:  (max_chats_check)
        — форма: «delete message … from Олег for everyone (invites)?» —
Вы:     Да.
Агент:  Удалено одно сообщение с приглашением от Олега. Олег отмечен: аккаунту 2 дня.
        Остальное в порядке.
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

Sin `--allow-dangerous`, cron solo planifica las acciones de nivel `ask` y espera tu aprobación. Consulta [Programación](./recipes.md#как-запускать-по-расписанию) para configurar `PATH` y `XDG_RUNTIME_DIR`, necesarios para encontrar Node y tu sesión.

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
| `max chats update` | Ajustes, título y descripción; leerlos con `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | Borrar para todos, fijar o desfijar |

Los agentes sin terminal disponen de `max_review` con `unanswered_after_hours`, `max_chats_events`, `max_chats_members`, `max_chats_rules` y `max_chats_check` ([MCP](./mcp.md)).

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

Los archivos anteriores se admiten: `forbid` pasa a `deny`; `flag` y `confirm`, a `ask`. MCP conserva `max_chats_check` y el formulario de confirmación.

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
