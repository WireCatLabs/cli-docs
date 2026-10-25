---
title: "Administrar grupos"
---

Usa esta página cuando participe en grupos de WhatsApp, o ejecute uno, y necesite ayuda para mantenerse al día: encuentre preguntas que nadie respondió, resuma una semana, mantenga una lista de lo que le espera y cuente la actividad del grupo. La lectura marca nada leído, por lo que verificar un grupo no les dice a sus miembros que ti miró.

Algunas palabras en esta página:

- **Un ID de grupo** termina en `@g.us` (`120363000000000001@g.us`). `wa personal chats list 'kind:group' --offline` enumera sus grupos con sus identificadores; El nombre de un grupo también funciona cuando solo lo tiene un chat.
- **Un administrador** es un miembro con derechos para administrar el grupo. Algunos comandos cuentan solo sus respuestas y las de los administradores.
- **El almacén local** es la copia de los mensajes que `wa` mantiene en esta computadora, completada por el historial del teléfono y por
  `serve`. Los informes y las tareas lo utilizan, por lo que solo ven lo que llegó.
- **Una tarea** es algo que espera de ti, como una pregunta que nadie respondió. `wa` abre y cierra tareas en el almacén local.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Encuentra preguntas que esperan una respuesta | `wa personal review --unanswered` |
| Resumen de una semana: decisiones, promesas, preguntas abiertas | `wa personal review 'date>7d'` |
| Mantén una lista de lo que le espera | `wa personal tasks list` |
| Ver la actividad de la semana | `wa personal stats chats show --offline` |
| Ver un grupo y quién está en él | `wa personal chats show`, `chats members list` |
| Eliminar un mensaje para todos, como administrador del grupo | `wa personal messages delete --for-everyone` |
| Crea un grupo, únete a uno mediante su enlace o abandona | `wa personal chats create`, `chats join`, `chats leave` |
| Agregar o eliminar personas, convertir a alguien en administrador | `wa personal chats members add`, `chats admins add` |
| Cambiar el nombre de un grupo, configurar o eliminar su foto, o cambiar quién puede agregar personas | `wa personal chats update` |
| Mostrar o reemplazar el enlace de invitación | `wa personal chats links show`, `chats links reset` |
| Dejar entrar o rechazar a las personas que solicitaron unirse | `wa personal chats requests list`, `chats requests confirm` |
| Sigue un canal, lee sus publicaciones o deja de seguirlo | `wa personal chats join`, `messages sync`, `chats leave` ([canales](./usage.md#channels)) |
| Publicar en un canal que ti ejecute | `wa personal messages send` ([canales](./usage.md#channels)) |

Todas las opciones están en la [referencia de comando](./commands.md).

## Con un agente

Su agente de IA (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI) puede ejecutar estas comprobaciones por ti. Un agente con una terminal necesita el skill [wa](./recipes.md#once-first); un agente en una aplicación sin terminal necesita el [servidor MCP](./mcp.md).

Los nombres, mensajes y resultados a continuación son ficticios.

### ¿Quién está esperando una respuesta?

**Tu petición:**> ¿Qué miembro del grupo de excursionistas lleva más de cuatro horas esperando una respuesta?

**Comando:**

```sh
wa personal review 'chat:120363000000000001@g.us' --unanswered 4h --json
```

**Ejemplo de respuesta del agente:**

> **2 preguntas están esperando respuesta.**
>
> 

| Persona | Pregunta | Esperando |
> 

| --- | --- | --- |
> 

| Lena | ¿A qué hora salimos el sábado? | 6 horas |
> 

| Sam | ¿Las tiendas son compartidas? | 12 horas |

Un signo de interrogación fuera de un enlace, o una respuesta dirigida a ti o a un administrador, abre una pregunta; su respuesta o la de un administrador lo cierra.

### Un informe semanal

**Tu petición:**

> Resumir la semana en el grupo de senderismo.

**Comando:**

```sh
wa personal review 'chat:120363000000000001@g.us date>7d' --json
```

**Ejemplo de respuesta del agente:**

> **Decidido:** salir a las 7:00 desde la estación.
>
> **Comprometido:** Lena — comida; Sam: tiendas de campaña.
>
> **Aún abierto:** quién trae la olla.

### En un horario

No se necesita ningún agente para una lista de preguntas abiertas: es un comando ordinario y solo lee el almacén local.

```cron
0 9,21 * * * wa personal review 'chat:120363000000000001@g.us' --unanswered --json >> ~/hiking-open.jsonl 2>> ~/wa-cron.log
```

cron inicia trabajos con un entorno casi vacío: consulte [ejecución programada](./recipes.md#running-on-a-schedule).

## Lo que te espera

`review` y `serve` mantienen una lista de tareas en el almacén local: lo que tienes que hacer y lo que alguien te debe. Una tarea apunta a su mensaje y nunca lo copia. Cuando una regla abre uno:

- **Un chat uno a uno:** una pregunta que no respondiste y un mensaje que te mencione.
- **Un grupo:** solo una pregunta que responda a tu mensaje, y una mención tuya. Las preguntas de otras personas no son tus tareas.
- **Un canal o el chat contigo mismo:** nada.

Tu respuesta cierra la tarea. Para registrar cada pregunta de un grupo, para quien sea, etiquete el grupo. En un grupo etiquetado, una respuesta directa de cualquier miembro que no sea el que preguntó también cierra la pregunta; un mensaje posterior que no responde no cierra nada:

```sh
wa personal tags add --chat 120363000000000001@g.us watch-tasks
```

El primer llenado del almacén local no abre ninguna tarea de su historial; Los mensajes posteriores lo hacen. Para convertir el historial de un grupo en tareas, enumere lo que se abriría y luego ábralo:

```sh
wa personal tasks scan 120363000000000001@g.us
wa personal tasks scan 120363000000000001@g.us --last 300 --yes
```

Cuando alguien te promete algo, mantenlo como su tarea y enumera lo que otros te deben. El localizador de mensajes, la clave de tarea `PR-4` y los demás identificadores de esta sección están compuestos; tome los reales de una búsqueda, una lista o `tasks list`:

```sh
wa personal tasks add msg:whatsapp/100000000000009%40lid/120363000000000001%40g.us/3EB0A1B2C3D4E5F6A7B8 \
  --type promise --category other --assignee sender
wa personal tasks list "assignee:any state:open"
```

`--assignee sender` es quien envió el mensaje; `--assignee person:<id>` nombra a otra persona y `tasks update <task> --assignee none` lo borra. Una tarea sin responsable está bien: mejor que perderla.Vea lo que le espera, primero el mayor, luego solo preguntas y menciones en un grupo:

```sh
wa personal tasks list state:open
wa personal tasks list 'chat:120363000000000001@g.us (kind:question OR kind:mention)'
```

Añade lo que las reglas no pueden ver, como una promesa que hizo, mediante el localizador del mensaje de una búsqueda o una lista:

```sh
wa personal tasks add msg:whatsapp/100000000000009%40lid/120363000000000001%40g.us/3EB0A1B2C3D4E5F6A7B8 \
  --type promise --category other
```

`tasks categories` enumera las categorías que puede tomar una tarea. Si la tarea puede ser el mismo trabajo que uno abierto, `tasks add` lo rechaza con el código de salida `2` y enumera los candidatos; repita con `--into <task>` o `--new`.

Cerrar una tarea que no necesita respuesta:

```sh
wa personal tasks close PR-4 --as dismissed --reason no-reply-needed
```

Un agente de IA que cierra una tarea indica qué tan segura está con `--certainty`, de 0 a 1. Por debajo del umbral del almacén local (`task_agent_close_min`, 0.8 por defecto), la tarea permanece abierta con una sugerencia de cierre. `tasks list close:suggested` los encuentra; confirme uno con `tasks close <task>`, o rechácelo con `tasks reject <task>`.

## Los números del grupo

```sh
wa personal stats chats show 120363000000000001@g.us --offline
wa personal stats chats show 120363000000000001@g.us --offline --since-time 30d --by week
```

Mensajes, miembros activos, respuestas, reacciones y preguntas contestadas, contabilizadas desdel almacén local por un período, 7 días a menos que `--since-time` diga lo contrario. Un recuento cubre sólo lo que contiene el almacén local; un tramo antes del enlace `wa` no está allí, por lo que un número es mínimo, nunca una prueba de silencio. `members` cuenta las uniones y deja las reservas del almacén local, las que enumera `chats events`; para un grupo del que el almacén local aún no contiene nada, el JSON deja fuera `members`, establece `complete` en `false` y lo dice en `missing`. `chats members history` muestra quién se unió o se fue entre búsquedas de miembros.

## Un grupo y quién está en él.

```sh
wa personal chats show 120363000000000001@g.us
wa personal chats members list 120363000000000001@g.us
```

`chats show` proporciona el tipo de grupo, el recuento de no leídos, la hora del último mensaje y sus miembros tal como los contiene el almacén local; nunca se conecta. `chats members list` pregunta a WhatsApp quién está ahora en el grupo; mientras se ejecuta `serve`, pasa por `serve` ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

## Eliminando para todos

```sh
wa personal messages delete 120363000000000001@g.us 3EB0AAAAAAAAAAAAAAAAAA --for-everyone
```

En un grupo que ti administra, esto elimina el mensaje de otro miembro para todos; en cualquier lugar, elimina el tuyo. Necesita el mensaje en el almacén local, ya que WhatsApp también envía un mensaje a su remitente. Pregunta primero de forma predeterminada y no se puede deshacer. Sin `--for-everyone` es solo para ti: `wa` le pide a WhatsApp que tome el mensaje de todos tus dispositivos y lo deje con los demás (aún no verificado en un teléfono).

## Ejecutar un grupo

```sh
wa personal chats create "Hiking" 100000000000002@lid
wa personal chats members add 120363000000000001@g.us 100000000000002@lid
wa personal chats members remove 120363000000000001@g.us 100000000000003@lid
wa personal chats admins add 120363000000000001@g.us 100000000000002@lid
wa personal chats update 120363000000000001@g.us --title "Hiking club" --only-admins-add on --join-approval on
wa personal chats update 120363000000000001@g.us --only-admins-send on --disappear-after 7d
wa personal chats update 120363000000000001@g.us --photo club.jpg
wa personal chats update 120363000000000001@g.us --remove-photo
wa personal chats links show 120363000000000001@g.us
wa personal chats links reset 120363000000000001@g.us
wa personal chats requests list 120363000000000001@g.us
wa personal chats requests confirm 120363000000000001@g.us 100000000000004@lid
wa personal chats join https://chat.whatsapp.com/AAAAAAAAAAAAAAAAAAAAAA
wa personal chats leave 120363000000000001@g.us
```

- **Los miembros ven cada uno de estos**, por lo que cada uno pasa por los [permisos](./permissions.md) y el límite por hora del perfil, como un envío, y se conecta (a través de `serve` mientras se ejecuta).
- **Solo se agregan personas que conoces.** `chats create` y `members add` toman a alguien en tu libreta de direcciones o a quien le hayas escrito, y rechazan a cualquier otra persona: WhatsApp prohíbe las cuentas que agregan extraños.
- **Un administrador tiene todos los derechos.** WhatsApp tiene un tipo de administrador, por lo que `admins add` no acepta ningún `--can` y se los da a todos.
- **Un enlace de invitación.** Un grupo tiene un enlace; `link reset` lo reemplaza y el anterior deja de funcionar. Sólo los administradores lo ven.
- **Configuración.** `update` cambia el nombre, la descripción, `--only-admins-add`, `--join-approval`,
  `--only-admins-send`, `--only-admins-edit-info` y `--disappear-after`. Los mensajes desaparecen a las 24h, 7d o 90d, los tiempos que ofrece WhatsApp; cualquier otro es rechazado, y `off` se queda con ellos.
- **La foto.** `update --photo` toma un JPEG cuadrado de 190 a 720 píxeles por lado, el único tipo que WhatsApp toma como foto grupal. `wa` no convierte ni recorta uno: primero expórtelo como JPEG. Un archivo que no se llame `.jpg` o `.jpeg`, o un PNG o WebP renombrado a uno, se rechaza antes de conectarse. `update --remove-photo` le quita la foto y la rechaza junto a `--photo`. La foto se configura o elimina primero: si el título, la descripción o una configuración dada con ella falla, el error así lo indica.
- **El nombre de un grupo también funciona**, como en todo comando que nombra un chat: `wa` lo busca primero en el almacén local y luego en la lista de chats de WhatsApp. Parte del nombre es suficiente, no importa el caso, y un emoji coincide con o sin la marca invisible que suele llevar uno copiado ("Семья❤️" busca "Семья❤"). Se rechaza un nombre que coincida con varios chats; nombre uno por su identificación `…@g.us`. Cada conexión guarda los grupos en los que se encuentra en el almacén local, por lo que
  `chats list kind:group` los muestra una vez que se ha ejecutado `serve`, `watch` o cualquier comando que conecte.
- `join` en un grupo que aprueba quién se une a las respuestas `requested: true`; estás dentro una vez que un administrador te deja entrar.
- **`leave` marca el grupo que queda en el almacén local** y `wa personal store clear --left` lo enumera. Un `join` que ingresa elimina la marca, al igual que el que se vuelve a agregar mientras se ejecuta `serve` o `watch`.Con `--offline`, `chats members list` muestra los miembros almacenados antes en lugar de preguntar por WhatsApp. `chats members fetch` mantiene la lista de miembros en el almacén local. `chats members history` muestra lo que registraron las recuperaciones: todos los presentes en la primera recuperación, luego quién se unió o se fue en cada una de las posteriores.

```sh
wa personal chats events 120363000000000001@g.us --offline
wa personal chats events 120363000000000001@g.us 'time>=30d' --json
```

`chats events` enumera quién se unió, se fue, fue agregado, eliminado, ascendido o degradado, y cada título nuevo, el más antiguo primero, durante 7 días, a menos que la consulta indique una hora (`time>=30d`). Responde desdel almacén local y nunca se conecta. `wa` mantiene ahí lo que el teléfono empuja con el historial de un grupo (los mensajes de servicio que muestra en el chat) y, mientras se ejecuta `wa serve` o `wa watch`, cada cambio sucede; un cambio visto en ambos sentidos se mantiene una vez. Alguien que entró o salió por tu cuenta `join` o `leave`; alguien más está haciendo `add` o `remove`. Un cambio desde antes del enlace que el teléfono no envió no está allí, por lo que una lista vacía no prueba que nadie se haya unido.

Un agente conectado a través del [servidor MCP](./mcp.md) puede ejecutar los mismos comandos, hasta donde lo permitan los [permisos](./permissions.md) del perfil.

## Comunidades

Una comunidad de WhatsApp agrupa varios grupos bajo un mismo nombre. En `wa` una comunidad también es un grupo, con `provider_metadata.community: true`, y un grupo en una comunidad lo nombra como `parent_chat_id`. Ambos vienen con lo que dice WhatsApp sobre el grupo, por lo que se muestran en las respuestas de `chats update`, `chats create` y `chats join`. El almacén local los mantiene alejados del historial que envía el teléfono, por lo que `chats list` y `chats show` también los muestran. Cuando se agrega un grupo a una comunidad mientras `wa` está conectado, el almacén local nombra la comunidad; cuando se elimina, el almacén local deja de nombrarlo. De cualquier manera mantiene el título del grupo y cuenta.

Enumerar los grupos de una comunidad y agregar un grupo a una comunidad o eliminarlo se realiza por teléfono.
