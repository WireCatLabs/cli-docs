---
title: "Funciones"
description: "Qué pueden hacer los CLI de Telegram y MAX: toda tu cuenta, grupos, un archivo con búsqueda, voz a texto, todos los métodos de la Bot API y límites que fijas para tu agente."
---

Cada CLI trabaja con un mensajero: `tg` con Telegram, `max` con MAX. Todo lo de abajo funciona en
los dos, salvo que una fila diga otra cosa. Los comandos empiezan por `tg` o `max`; la sintaxis
completa está en [comandos de Telegram](./tg/commands.md) y [comandos de MAX](./max/commands.md).

## Mensajes

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

Guías: [uso de Telegram](./tg/usage.md) · [uso de MAX](./max/usage.md)

## Chats, contactos y cuenta

| Qué puedes hacer | Comandos |
|---|---|
| Listar y buscar chats, filtrar por tipo (personas, grupos, canales) | `chats list` |
| Crear, cambiar y eliminar carpetas de chats | `chats folders` |
| Contactos: buscar, añadir, renombrar, bloquear, importar | `contacts` |
| Quién es alguien, qué escribió, si la cuenta parece un bot | `contacts profile`, `context`, `check` |
| Respuestas automáticas con tus reglas, solo a cuentas de prueba | `replies` |
| Actualizar tu perfil; ver cada dispositivo con sesión abierta y cerrar uno | `account` |
| Varias cuentas, un *perfil* para cada una | `tg work …`, `max work …` |

Guías: [personas](./people.md) · [acceso y perfiles de Telegram](./tg/sessions.md) · [sesiones y perfiles de MAX](./max/sessions.md)

## Grupos y canales

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

La moderación se ejecuta cuando la inicias tú, tu agente o una tarea programada; nada vigila un
grupo por sí solo.
Guías: [grupos de Telegram](./tg/groups.md) · [grupos de MAX](./max/groups.md)

## Historial, búsqueda y estar al día

| Qué puedes hacer | Comandos |
|---|---|
| Guardar un archivo local de los chats que elijas | `store fetch` |
| Buscar en él sin conexión por palabras, remitente, fecha y chat, con tolerancia a errores de escritura | `search messages` |
| Separar los hilos de un grupo con mucha actividad por respuestas y menciones | `conversations` |
| Exportar un chat como Markdown o líneas JSON; hacer una copia de seguridad de todo el archivo | `store export`, `store backup` |
| Los mensajes sin leer de todos los chats en una sola lista | `inbox` |
| Quién espera tu respuesta y qué esperas tú | `review` |
| Ver los mensajes nuevos según llegan | `watch` |
| Mantener el archivo al día en segundo plano | `server` |

Guías: [archivo de Telegram](./tg/archive.md) · [búsqueda de Telegram](./tg/search.md) ·
[archivo de MAX](./max/archive.md) · [búsqueda de MAX](./max/search.md)

## Bots

Un bot trabaja con su propio token, separado de tu cuenta personal.

| Qué puedes hacer | Comandos |
|---|---|
| Todos los métodos de la Bot API oficial: los 185 de Telegram y los 33 de MAX | `bot api` |
| Enviar, editar, eliminar y fijar mensajes; buscar en los mensajes del bot | `bot messages` |
| Responder a pulsaciones de botones; definir el menú de comandos del bot; gestionar webhooks | `bot callbacks`, `bot commands`, `bot webhooks` |
| Gestionar administradores y miembros de un grupo | `bot chats admins`, `bot chats members` |
| Moderar un grupo con las mismas reglas que tu cuenta | `bot chats moderate` |
| Dar el bot a un agente por MCP | `bot mcp config` |
| Comentarios bajo publicaciones de canales — *MAX* | `bot comments` |

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

- **Telegram:** varias fotos en un mensaje, borradores, silenciar chats y ajustes de
  notificaciones, archivar chats, pulsar botones en mensajes de otros bots, chats secretos,
  llamadas e historias. [Hoja de ruta](./tg/roadmap.md)
- **MAX:** videomensajes, borradores, enviar tu ubicación, configurar o quitar la contraseña en la
  nube, historias y llamadas. [Hoja de ruta](./max/roadmap.md)
