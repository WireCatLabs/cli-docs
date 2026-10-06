---
title: "Ejemplos prácticos: tu agente y Telegram"
---

Cómo encargar a Claude Code o Codex tareas habituales de Telegram: resumen de la mañana, informe de un chat, compromisos pendientes o preguntas sin respuesta. Cada ejemplo incluye qué pedir al agente, qué puede ejecutar y cómo programarlo.

## Preparación inicial

1. `tg` debe estar instalado y con sesión iniciada: [instalación](./installation.md), [sesiones](./sessions.md).
2. El agente debe saber utilizar `tg`. Proporciónale la skill:

   ```sh
   # Claude Code
   mkdir -p ~/.claude/skills/tg-cli && tg skill show > ~/.claude/skills/tg-cli/SKILL.md
   # Codex and Gemini CLI
   mkdir -p ~/.agents/skills/tg-cli && tg skill show > ~/.agents/skills/tg-cli/SKILL.md
   ```

3. Guarda las peticiones siguientes en archivos, por ejemplo en `~/tg-recipes/`. Los comandos programados leen la petición desde un archivo.

Claude Desktop, Cursor y otros clientes sin terminal no necesitan una skill. Conecta el servidor MCP (`tg mcp config` imprime la entrada de configuración) y utiliza sus prompts preparados: `catch-up`, `review`, `reply`, `find` ([MCP](./mcp.md#prompts-and-chats-by-)).

## Qué puede hacer el agente

Un agente programado trabaja sin ti, así que sus límites deben estar en la configuración, no en la petición. Puede interpretar mal «no envíes nada», pero no puede saltarse un ajuste que no tenga permiso para cambiar.

**Limita los comandos que puede ejecutar.** Claude Code en modo `-p` solo ejecuta lo indicado en `--allowedTools`. Si la lista no incluye `tg messages send`, no puede invocarlo:

```sh
claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
```

**Limita los permisos del perfil.** Esto se aplica a cualquier agente:

```sh
tg config set permissions.messages readonly    # no sends, edits or deletions
tg config set permissions.messages.send ask    # or: a yes or no before each send
tg config set sendsPerHour 5                   # or: at most five sends an hour
tg recipients add "Book club"                  # and only to the chats on this list
```

`permissions` también limita tus comandos hasta que lo reviertas con `tg config unset permissions.messages`. Para limitar solo al agente, dale su propio perfil. Todos los intentos de envío, incluidos los rechazados, aparecen en `tg sends list`. Consulta los límites en [seguridad](./security.md#the-send-guard).

**Leer no revela tu actividad.** Ningún comando de estos ejemplos marca mensajes como leídos: nadie ve que el agente abrió el chat.

## Programar las tareas

- **Las tareas programadas de Claude Desktop** se ejecutan en tu equipo, donde tienen acceso a `tg` y tu sesión. Consulta la [documentación de Claude](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron y `claude -p`**, en cualquier equipo encendido a esa hora:

  ```cron
  30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)" >> ~/tg-recipes/morning.log 2>&1
  ```

  cron inicia las tareas con un entorno casi vacío, lo que puede romper `tg` en Linux de dos formas:

  - **`node: not found`, código de salida 127.** Node instalado con nvm, fnm o Volta no está en el `PATH` del sistema, que es el único que conoce cron.
  - **"no Telegram app credentials found … although it has logged in on this machine", código de salida 4.** `tg` no puede acceder al almacén de claves. **No vuelvas a iniciar sesión:** la sesión está bien; el problema es el entorno.

  Añade ambas líneas al principio de `crontab -e` con tus valores. Obtén el directorio con `dirname "$(which node)"` y el número con `id -u`:

  ```cron
  PATH=/home/you/.nvm/versions/node/v24.0.0/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

  El almacén de claves está abierto mientras tu sesión del equipo está activa. Ejecuta la primera tarea manualmente y revisa el registro. Sobre el modo `-p`: [documentación de Claude](https://code.claude.com/docs/en/headless).

- **En una sesión abierta de Claude Code:** `/loop` o «recuérdamelo a las 15:00». Funciona mientras la sesión está abierta ([documentación de Claude](https://code.claude.com/docs/en/scheduled-tasks)).

Las rutinas en la nube de Claude no sirven para esto: se ejecutan en otro equipo, sin `tg` ni tu sesión.

## Resumen de la mañana

Escribe en Telegram: **no**. Permite: `Bash(tg inbox:*)`.

> Ejecuta `tg inbox --new --json`. Agrupa los mensajes por chat. Para cada chat, escribe una línea: quién escribe y qué necesita. Pon primero lo que requiere respuesta hoy. Agrupa anuncios y notificaciones de servicio en una línea al final.

`--new` muestra cada mensaje una sola vez: `tg` recuerda dónde terminó (en cada chat) y la siguiente ejecución continúa allí. La primera revisa las últimas 24 horas.

### Desde cuándo es "nuevo"

- `tg inbox`: lo no leído, tal como lo cuenta Telegram: lo que no has abierto en ningún dispositivo.
- `tg inbox --new`: desde la última ejecución con `--new`. Solo `tg` conoce ese punto; nadie más lo ve.
- `tg inbox --since-time 2d`: los dos últimos días; el punto guardado no se mueve.

Ninguno marca nada como leído. Para eso, añade `--mark-read` o activa `catchUpMarksRead` en la [configuración](./configuration.md); entonces la otra parte ve que lo has leído.

### Chats directos, grupos y canales por separado

`--kind` deja solo los chats de ese tipo: `dialog`, `group`, `channel`. Un resumen de noticias de los canales y un resumen de tus conversaciones pueden ejecutarse por separado, a horas distintas: cada chat tiene su propio punto, así que una ejecución nunca oculta lo que la otra aún no ha mostrado.

```cron
30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
0 19 * * * claude -p "$(cat ~/tg-recipes/news.md)" --allowedTools "Bash(tg inbox:*)"
```

En `morning.md`, `tg inbox --new --kind dialog,group --json`; en `news.md`, `tg inbox --new --kind
channel --json` y una petición para elegir lo importante. Sin `--kind`, todo junto.

## Informe semanal de un chat

Escribe en Telegram: **no**. Permite: `Bash(tg messages list:*)`.

> Lee los últimos 7 días de "Book club": `tg messages list "Book club" --after-time 7d --limit 200
> --json`. Si la respuesta indica `"hasMore": true`, continúa leyendo. Prepara un informe: decisiones, responsables, plazos y preguntas pendientes. Indica fecha y autor de cada punto.

## Quién debe qué

Escribe en Telegram: **no**. Permite: `Bash(tg review:*)`, `Bash(tg messages context:*)`, `Bash(tg messages search:*)`.

> Ejecuta `tg review --new --json` (la primera vez, los últimos 3 días; después, desde el último `--new`, con un punto por chat). Separa el resultado en tres listas: lo que debo hacer, lo que espero de otros y lo que necesita aclaración. Indica chat, fecha e identificadores de los mensajes que respaldan cada punto; añade un plazo solo si se mencionó. Antes de considerar algo vencido, comprueba si se completó después. Al final, enumera los pendientes.

La siguiente revisión usa la misma petición con los pendientes de la anterior. Un chat que no se leyó entero conserva su punto y vuelve a aparecer. En un cliente MCP, corresponde al prompt `review`.

## Qué no has respondido

La forma más corta es `tg review --since-time 7d --unanswered --json`: preguntas sin respuesta dirigidas a ti en chats personales o a ti y los administradores en grupos. El ejemplo siguiente es más amplio: también detecta peticiones sin interrogación.

Escribe en Telegram: **no**. Permite: `Bash(tg chats list:*)`, `Bash(tg messages list:*)`.

> Ejecuta `tg chats list --kind dialog --limit 30 --json`. En cada chat cuyo último mensaje sea de los últimos 7 días, lee `tg messages list <chat id> --limit 5 --json`. Muestra los chats donde el último mensaje no es mío y contiene una pregunta o petición: quién, sobre qué y hace cuántos días.

## Encontrar algo que se dijo

Escribe en Telegram: **no**. Permite: `Bash(tg messages search:*)`, `Bash(tg messages context:*)`.

> Busca "invoice" con `tg messages search invoice --json`. Para cada resultado, consulta `tg messages context <locator> --json` e indica quién dijo qué y cuándo.

La búsqueda solo lee lo guardado en este equipo. Para consultar todo el historial de un chat, descárgalo primero; son peticiones desde tu cuenta, así que hazlo tú: `tg store fetch <chat>` ([archivo local](./archive.md)).

## Preparar una respuesta

Escribe en Telegram: **solo después de tu aprobación**. Este ejemplo es para una conversación con el agente, no una tarea programada.

> Lee los últimos 20 mensajes del chat con @example_user y propón una respuesta a su última pregunta. No la envíes: muéstrame el texto.

Después de aprobarla, el agente la envía: `tg messages send @example_user "…"`. Un agente sin terminal se conecta con `tg mcp --confirm-send`: antes de cada envío ves el chat y el texto, y lo apruebas o rechazas ([MCP](./mcp.md)).

## Un grupo que administras

Escribe en Telegram: **no**. Permite: `Bash(tg review:*)`, `Bash(tg chats events:*)`, `Bash(tg chats members list:*)`.

> Ejecuta `tg review --chat "Hiking" --unanswered 4h --json` y `tg chats events "Hiking" --since-time 7d
> --json`. Resume qué preguntas esperan respuesta, de quién y desde cuándo; quién se unió o fue añadido esta semana y quién lo añadió. No respondas a nadie: enumera a quién debo contestar.

Consulta todos los escenarios en [administrar grupos](./groups.md).

## Otras colecciones de ejemplos

Ejemplos de otras personas para Telegram y agentes. Sus peticiones funcionan con `tg` si sustituyes las herramientas por los comandos correspondientes:

- [Telegram MCP: guía completa](https://mcp.directory/blog/telegram-mcp-complete-guide-2026): revisión de la bandeja de entrada, borradores, resumen de canales y búsquedas en varios chats.
- [pioh/tg](https://github.com/pioh/tg): Claude Code y Codex con una cuenta personal de Telegram; resumen cada N minutos, «avísame si no contesto a mamá en 15 minutos», seguimiento de personas y chats.
- [Recetario de Gorgias MCP](https://github.com/gorgias/mcp-cookbook): ejemplos de soporte al cliente, bien estructurados; cada uno explica si escribe algo y qué adaptar.
