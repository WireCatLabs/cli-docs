---
title: "Recetas: tu agente y tus conversaciones"
---
Encarga a Claude Code o Codex resúmenes de no leídos, informes, compromisos, recordatorios de preguntas pendientes y comprobaciones de grupos. Cada receta incluye petición, permisos y programación.

## Preparación inicial

1. Instala `max` e inicia sesión: [Instalación](./installation.md), [Sesiones](./sessions.md).
2. Instala las instrucciones del agente:

   ```sh
   max skill install
   ```

   La skill se guarda en las carpetas de Claude Code, Codex y Gemini CLI.
3. Guarda las peticiones en archivos, por ejemplo `~/max-recipes/`; las órdenes programadas las leen de allí.

Si usas MCP en Claude Desktop, Cursor u otro cliente, no necesitas skill. Conecta el servidor (`max mcp config` imprime su configuración) y usa `/catch-up`, `/review`, `/reply`, `/find` ([Peticiones MCP](./mcp.md#команды-и-чаты-по-)).

## Permisos del agente

Un agente programado trabaja sin ti; aplica límites en los ajustes, no solo en el texto. Puede interpretar mal «no envíes nada», mientras la configuración impone el bloqueo.

**En el agente.** Claude Code en modo `-p` solo ejecuta lo permitido por `--allowedTools`. Sin `max messages send`, no puede enviarlo:

```sh
claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
```

Codex no tiene esa lista. Su entorno restringido bloquea red y escritura, necesarias para `max`. Los ejemplos usan `--sandbox danger-full-access` y limitan los envíos mediante ajustes de `max`.

**En `max`**, el límite se aplica a cualquier agente:

```sh
for resource in messages reactions polls topics chats contacts account bot conversations; do
  max config set "permissions.$resource" readonly
done
max config show                       # проверить эффективные права
max config set sendsPerHour 5          # или: не больше пяти сообщений в час
max recipients add "Иван Петров"       # и писать только в эти чаты
```

`readonly` limita cada recurso nombrado tanto para ti como para el agente. Claves más específicas, como `permissions.messages.send: allow`, tienen prioridad: elimina esas autorizaciones si el perfil solo debe leer. Tras migrar no se puede cambiar `readOnly`. Usa `max config unset permissions.<ресурс>` para quitar tu restricción y recuperar los ajustes heredados y predeterminados. `max sends list` incluye todos los intentos, también los rechazados.

**Leer no revela tu actividad.** Ninguna orden de estas recetas marca mensajes leídos; tu interlocutor no ve que el agente abrió el chat.

## Programar ejecuciones

- **Tareas de Claude Desktop.** Se ejecutan en tu ordenador con acceso a `max` y la sesión. Si estaba suspendido, una tarea omitida se ejecuta una vez al despertar. [Documentación](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **Cron con `claude -p`.** Sin aplicación, en un ordenador encendido a esa hora:

  ```cron
  30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)" >> ~/max-recipes/morning.log 2>&1
  ```

  Cron tiene un entorno casi vacío, lo que puede causar dos fallos en Linux:

  - **`node: not found`, código 127.** Node de nvm, fnm o volta no está en el `PATH` del sistema que conoce cron.
  - **`no token found for profile "default", although it has logged in on this machine`, código 4.** `max` no alcanza el llavero. **No vuelvas a iniciar sesión:** el problema está en el entorno.

  Añade estas líneas al comienzo de `crontab -e` con tus valores. Obtén la carpeta con `dirname "$(which node)"` y el número con `id -u`:

  ```cron
  PATH=/home/ivan/.nvm/versions/node/v24.19.0/bin:/home/ivan/.local/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

  El llavero es accesible mientras tengas sesión en el sistema. Prueba manualmente la primera ejecución y revisa el registro. [Modo sin interacción de Claude](https://code.claude.com/docs/en/headless).

- **Cron con `codex exec`:**

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/max-recipes/morning.md)" >> ~/max-recipes/morning.log 2>&1
  ```

  [Modo sin interacción de Codex](https://learn.chatgpt.com/docs/non-interactive-mode).
- **Dentro de Claude Code abierto:** `/loop` o «recuérdamelo a las 15:00». Solo funciona mientras la sesión sigue abierta ([Programación](https://code.claude.com/docs/en/scheduled-tasks)).

Las rutinas de Claude en la nube no sirven aquí: se ejecutan en otro ordenador, sin tu `max` ni tu sesión.

## Resumen de la mañana

Escribe en MAX: **no**. Permite `Bash(max inbox:*)`.

> Ejecuta `max inbox --new --json`. Agrupa por chat y resume en una línea quién escribe y qué necesita. Pon primero lo que necesita respuesta hoy. Agrupa publicidad y notificaciones de servicios al final.

`--new` muestra cada mensaje una vez; `max` guarda la posición, por separado para cada chat, y la siguiente ejecución empieza desde ahí. La primera ejecución abarca 24 horas.

### Desde cuándo es «nuevo»

- `max inbox`: lo no leído según MAX, es decir, todo lo que no has abierto en ningún dispositivo.
- `max inbox --new`: desde la ejecución anterior de `--new`. Ese punto solo lo conoce `max`; tus interlocutores no lo ven.
- `max inbox --since-time 2d`: los dos últimos días; el punto guardado no se mueve.

Ninguna de las tres marca los mensajes como leídos. Si lo necesitas, añade `--mark-read` o activa `catchUpMarksRead` en la [configuración](./configuration.md); entonces tu interlocutor verá que lo has leído.

### Chats individuales, grupos y canales por separado

`--kind` deja solo los chats del tipo indicado: `dialog` para individuales, `group` para grupos y `channel` para canales. Puedes ejecutar el resumen de canales y el de conversaciones por separado, a distintas horas: cada chat tiene su propio punto, y una ejecución no oculta lo que la otra aún no ha mostrado:

```cron
30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
0 19 * * * claude -p "$(cat ~/max-recipes/news.md)" --allowedTools "Bash(max inbox:*)"
```

`morning.md` contiene `max inbox --new --kind dialog,group --json`; `news.md`, `max inbox --new --kind channel --json` y la petición de elegir lo importante. Sin `--kind`, todo junto.

## Informe semanal del trabajo

Escribe: **no**. Permite `Bash(max messages list:*)`.

> Lee los últimos 7 días de Proyecto Alfa: `max messages list "Проект Альфа"
> --after-time 7d --limit 200 --json`. Si aparece `"hasMore": true`, continúa. Resume decisiones, responsables y plazos, y preguntas sin respuesta. Incluye fecha y autor.

## Compromisos y seguimiento

Escribe: **no**. Permite `Bash(max review:*)`, `Bash(max messages context:*)`, `Bash(max messages search:*)`.

> Ejecuta `max review --new --transcribe --json` (la primera vez, 3 días; después, desde el `--new` anterior, con un punto propio por chat). Separa qué debo, qué espero de otros y qué falta aclarar. Incluye chat, fecha e IDs de apoyo; plazos solo si están expresados. Antes de señalar retrasos, comprueba si se resolvió después o en grupos de trabajo. Si `"complete": false`, indica lo que falta. Termina con los asuntos pendientes.

Repite la petición añadiendo pendientes anteriores; el agente los revisará primero. Un chat que no se ha leído entero conserva su punto y volverá a aparecer. En clientes MCP usa `/review` ([Peticiones](./mcp.md#команды-и-чаты-по-)).

## A quién no has respondido

`max review --since-time 7d --unanswered --json` encuentra preguntas dirigidas a ti, o a ti y administradores en grupos. Esta receta también detecta peticiones sin interrogación.

Escribe: **no**. Permite `Bash(max chats list:*)`, `Bash(max messages list:*)`.

> Ejecuta `max chats list --kind dialog --limit 30 --json`. Para cada chat activo en los últimos 7 días, lee `max messages list <id чата> --limit 5 --json`. Muestra aquellos cuyo último mensaje no es mío y contiene una pregunta o petición: persona, tema y días transcurridos.

## Borrador de respuesta

Escribe: **solo después de tu aprobación**. Para conversación interactiva, no programación.

> Lee los últimos 20 mensajes con Iván Petrov y propón una respuesta a su última pregunta. No la envíes; muéstrame el texto.

Tras aprobar, envía con `max messages send "Иван Петров" "…"`. Sin terminal, usa `max mcp --allow-send --confirm-send` para ver destino y texto antes de aceptar o rechazar ([MCP](./mcp.md)).

## Un grupo que administras

Escribe: **solo según las reglas**. Permite `Bash(max review:*)`, `Bash(max chats events:*)`, `Bash(max chats members list:*)`, `Bash(max chats moderate:*)`.

> Ejecuta `max review --chat "Поход" --unanswered 4h --json` y `max chats moderate "Поход" --dry-run
> --json`. Resume preguntas pendientes y autores, infracciones y acciones propuestas. No borres nada: indica las órdenes que las ejecutarían si lo apruebo.

Consulta [Grupos](./groups.md) para escenarios y reglas.

## Colecciones relacionadas

Aún no hay colecciones preparadas para MAX. Para Telegram:

- [Guía completa Telegram MCP](https://mcp.directory/blog/telegram-mcp-complete-guide-2026): resumen matinal, borradores, canales y búsquedas. Las peticiones sirven para `max` sustituyendo herramientas por comandos.
- [pioh/tg](https://github.com/pioh/tg): Claude Code y Codex con Telegram personal, resúmenes cada N minutos, recordatorios por falta de respuesta y seguimiento de personas o chats.
- [Gorgias MCP cookbook](https://github.com/gorgias/mcp-cookbook): recetas de soporte que indican si escriben algo y qué personalizar.
