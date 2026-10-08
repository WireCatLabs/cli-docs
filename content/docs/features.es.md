---
title: "Funciones"
description: "Elige una tarea útil: revisar chats, encontrar acuerdos, reunir archivos o preparar respuestas."
---

Pide a tu asistente que revise conversaciones, encuentre un acuerdo, reúna documentos o prepare una respuesta. Esta página te ayuda a elegir una tarea y reconocer un resultado útil. `tg` y `max` son herramientas de línea de comandos que dan al asistente acceso a Telegram y MAX, respectivamente.

Elige por dónde empezar:

- **Ponerte al día o preparar una respuesta:** [Primeras tareas](./first-tasks.md).
- **Encontrar un mensaje antiguo o texto dentro de un documento:** [Búsqueda](./search.md).
- **Reunir archivos o resumir mensajes de voz:** [Peticiones para archivos y voz](./prompting.md#files-and-voice).
- **Gestionar una comunidad:** [Administración de grupos](./group-admins.md).
- **Trabajar con un bot:** [Bots y Bot API](./bot-api.md).

Si tu cuenta ya está conectada, copia una petición de abajo a tu agente. Si aún no lo está, empieza por [instalación y acceso](./installation.mdx). Para ver una conversación antes de conectar tu cuenta, abre la [demo](./meeting-brief.mdx).

## Mensajes

Entiende qué requiere tu atención y prepara una respuesta que puedas revisar antes de enviarla.

```text prompt
Lee mi conversación con Anna de hoy. ¿Qué necesita mi respuesta? Prepara una respuesta breve sin enviarla.
```

Obtendrás un borrador y los mensajes que lo respaldan. Si el destinatario es ambiguo, aclara el chat antes del envío.

<details>
<summary>Comandos y funciones adicionales</summary>

| Qué puedes hacer | Comandos |
|---|---|
| Leer chats y el historial de mensajes | `messages list`, `messages show` |
| Enviar texto y archivos, responder a un mensaje | `messages send` |
| Editar, eliminar, reenviar y fijar mensajes | `messages edit`, `delete`, `forward`, `pin` |
| Programar un mensaje: se envía aunque tu ordenador esté apagado | `messages send --at-time` |
| Descargar fotos, documentos y otros adjuntos | `messages download` |
| Reaccionar a mensajes | `reactions` |
| Crear encuestas, votar, cerrar las tuyas | `polls` |
| Pasar mensajes de voz a texto en tu propio ordenador | `messages transcribe` |
| Obtener el enlace a un mensaje | `messages link` |
| Marcar chats como leídos, solo cuando lo pides | `chats mark-read` |

</details>

Guías: [uso de Telegram](./tg/usage.md) · [uso de MAX](./max/usage.md)

## Chats, contactos y cuenta

Encuentra a una persona y recupera el contexto de conversaciones anteriores.

```text prompt
Encuentra al diseñador del que hablamos el mes pasado. Muestra quién lo recomendó y qué hemos acordado.
```

Obtendrás un contacto identificado y mensajes que lo respaldan. Usa perfiles distintos para las cuentas personal y de trabajo: [cómo elegir una cuenta](./profiles.md).

<details>
<summary>Comandos y funciones adicionales</summary>

| Qué puedes hacer | Comandos |
|---|---|
| Listar y buscar chats, filtrar por tipo (personas, grupos, canales) | `chats list` |
| Crear, cambiar y eliminar carpetas de chats | `chats folders` |
| Contactos: buscar, añadir, renombrar, bloquear, importar | `contacts` |
| Quién es alguien, qué escribió, si la cuenta parece un bot | `contacts profile`, `context`, `check` |
| Respuestas automáticas con tus reglas, solo a cuentas de prueba | `replies` |
| Actualizar tu perfil; ver cada dispositivo con sesión abierta y cerrar uno | `account` |
| Varias cuentas, un *perfil* para cada una | `tg work …`, `max work …` |

</details>

Guías: [personas](./people.md) · [acceso y perfiles de Telegram](./tg/sessions.md) · [sesiones y perfiles de MAX](./max/sessions.md)

## Grupos y canales

Revisa un grupo antes de cambiar miembros, ajustes o reglas de moderación.

```text prompt
En mi grupo del proyecto, busca preguntas que esperan respuesta de un administrador. Cita las fuentes y no cambies nada.
```

Obtendrás una lista para revisar. Los cambios requieren los permisos adecuados en el grupo. La moderación se ejecuta cuando la inicias tú, tu agente o una tarea programada.

<details>
<summary>Comandos y funciones adicionales</summary>

| Qué puedes hacer | Comandos |
|---|---|
| Crear un grupo o un canal | `chats create` |
| Ver adónde lleva un enlace de invitación sin unirte | `chats inspect` |
| Unirte y salir; mostrar o renovar el enlace de invitación | `chats join`, `leave`, `link` |
| Añadir y quitar miembros; nombrar administradores y fijar sus permisos | `chats members`, `chats admins` |
| Ver quién se unió, salió o fue expulsado | `chats events` |
| Encontrar preguntas que nadie respondió en el grupo | `review --unanswered` |
| Cambiar el título, la descripción y los ajustes | `chats update` |
| Reglas de moderación: enlaces, invitaciones, reenvíos, mensajes masivos, personas bloqueadas | `chats rules`, `chats moderate` |
| Temas de foro: listar, buscar, crear, publicar en un tema — *Telegram* | `topics` |
| Una regla de moderación para cuentas nuevas — *MAX* | `chats rules` |

</details>

La moderación se ejecuta cuando la inicias tú, tu agente o una tarea programada; nada vigila un
grupo por sí solo.
Guías: [grupos de Telegram](./tg/groups.md) · [grupos de MAX](./max/groups.md)

## Historial, búsqueda y estar al día

Encuentra un acuerdo antiguo o reúne lo importante de los mensajes sin leer.

```text prompt
Busca el plazo del proyecto que acordamos el mes pasado. Muestra el acuerdo y los cambios posteriores.
```

Obtendrás la respuesta, las fuentes y el periodo revisado. La búsqueda usa el historial guardado; si falta ese periodo, [descarga primero los chats necesarios](./search.md).

<details>
<summary>Comandos y funciones adicionales</summary>

| Qué puedes hacer | Comandos |
|---|---|
| Guardar un archivo local de los chats que elijas | `store fetch` |
| Buscar en él sin conexión por palabras, remitente, fecha y chat, con tolerancia a errores de escritura | `messages search` |
| Separar los hilos de un grupo con mucha actividad por respuestas y menciones | `conversations` |
| Exportar un chat como Markdown o líneas JSON; hacer una copia de seguridad de todo el archivo | `store export`, `store backup` |
| Los mensajes sin leer de todos los chats en una sola lista | `inbox` |
| Quién espera tu respuesta y qué esperas tú | `review` |
| Ver los mensajes nuevos según llegan | `watch` |
| Mantener el archivo al día en segundo plano | `server` |

</details>

Guías: [archivo de Telegram](./tg/archive.md) · [búsqueda de Telegram](./tg/search.md) ·
[archivo de MAX](./max/archive.md) · [búsqueda de MAX](./max/search.md)

## Bots

Usa un bot para mensajes a clientes, respuestas a botones o tareas de grupo. Tiene su propia identidad y acceso.

```text prompt
Revisa los mensajes disponibles para el bot y prepara respuestas a preguntas pendientes. Muéstrame cada borrador antes de enviarlo.
```

Obtendrás borradores basados en mensajes disponibles para ese bot. El historial de tu cuenta personal es independiente. Empieza por [conexión y funciones de los bots](./bot-api.md).

Un bot trabaja con su propio token, separado de tu cuenta personal.

<details>
<summary>Comandos y funciones adicionales</summary>

| Qué puedes hacer | Comandos |
|---|---|
| Todos los métodos de la Bot API oficial: los 185 de Telegram y los 33 de MAX | `bot api` |
| Enviar, editar, eliminar y fijar mensajes; buscar en los mensajes del bot | `bot messages` |
| Responder a pulsaciones de botones; definir el menú de comandos del bot; gestionar webhooks | `bot callbacks`, `bot commands`, `bot webhooks` |
| Gestionar administradores y miembros de un grupo | `bot chats admins`, `bot chats members` |
| Moderar un grupo con las mismas reglas que tu cuenta | `bot chats moderate` |
| Dar el bot a un agente por MCP | `bot mcp config` |
| Comentarios bajo publicaciones de canales — *MAX* | `bot comments` |

</details>

Guías: [Bot API completa](./bot-api.md) · [bots de Telegram](./tg/bot.md) · [bots de MAX](./max/bot.md)

## Pensado para agentes

- **Un skill** enseña los comandos a Claude Code, Codex, Cursor, Gemini CLI y Hermes.
  [Conectar tu agente](./agents.md)
- **Un servidor MCP** para Claude Desktop y otros clientes. Usa los permisos del perfil: puedes limitarlo a lectura o pedir confirmación antes de escribir. [MCP](./mcp.md)
- **Salida predecible**: cada comando puede devolver un único valor JSON, y cada tipo de fallo
  tiene su propio código de salida, así que los scripts y los agentes pueden reaccionar a él.
- **Autodescripción**: `tg commands --json` lista cada comando y cada opción, así que un agente
  puede consultar lo que necesita en lugar de adivinarlo.

## Límites que tú fijas

- **Permisos por perfil**: solo lectura, preguntar antes de un cambio o permitir.
- **Una lista de destinatarios**: los chats a los que este perfil puede enviar.
- **Un límite por hora** de envíos, 30 por defecto.
- **Un registro de envíos**: cada intento de envío, sin el texto del mensaje.
- **Un bloqueo de perfil** que mantiene a un agente en una sola cuenta.

[Qué permite el inicio de sesión y cómo limitarlo](./installation.mdx) ·
[seguridad de Telegram](./tg/security.md) · [seguridad de MAX](./max/security.md)

## Aún no disponible

Los límites actuales y los planes aparecen en las hojas de ruta de [Telegram](./tg/roadmap.md) y [MAX](./max/roadmap.md). Un plan no es una función disponible.

## Elige la siguiente tarea

Prueba [una primera tarea](./first-tasks.md) y comprueba que el agente muestre fuentes y un resultado útil. Para repetir un flujo que te sirva, consulta [tareas recurrentes](./prompting.md#recurring-tasks). La sintaxis exacta está en las referencias de [Telegram](./tg/commands.md) y [MAX](./max/commands.md).
