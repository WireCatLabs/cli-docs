---
title: "Recetas: un agente y tu Telegram"
---

<a id="preparación-inicial" />
<a id="programar-las-tareas" />
<a id="desde-cuándo-es-nuevo" />
<a id="chats-directos-grupos-y-canales-por-separado" />
<a id="informe-semanal-de-un-chat" />
<a id="qué-no-has-respondido" />
<a id="encontrar-algo-que-se-dijo" />
<a id="preparar-una-respuesta" />
<a id="un-grupo-que-administras" />
<a id="otras-colecciones-de-ejemplos" />

Utilice esta página cuando desee que su agente de IA (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI) realice un trabajo regular con su Telegram: un resumen matutino, un informe sobre un chat, quién debe qué, qué no ha respondido. Cada receta le brinda una solicitud para copiar, los comandos que el agente puede ejecutar y si escribe algo en Telegram. Al final, puede ejecutar el agente según una programación, con límites que no puede eludir.

Términos en esta página:

- **Agente**: un agente de IA que ejecuta comandos en su computadora por usted.
- **Skill**: un archivo que le indica al agente cómo utilizar `tg`. `tg skill install` lo pone donde el agente lo busca.
- **Cliente MCP**: una aplicación de IA sin terminal, como Claude Desktop. Llega a `tg` a través del servidor MCP `tg mcp` en lugar de ejecutar comandos.
- **Modo sin cabeza**: el agente toma una solicitud, la ejecuta y sale, sin conversación. Claude Code lo llama modo `-p`; El Codex lo llama `codex exec`.
- **cron**: el programador integrado en Linux y macOS. Inicia un comando en momentos establecidos.

## Qué puedes hacer con las recetas

| Receta | Escribe en Telegram | Se adapta a un horario |
|---|---|---| | [Resumen de la mañana](#morning-summary) | no | si |
| [Informe semanal sobre un chat](#weekly-report-on-a-chat) | no | si |
| [Quién debe qué](#who-owes-what) | no | si |
| [Lo que no has respondido](#what-you-have-not-answered) | no | si |
| [Encuentra algo que se dijo](#find-something-that-was-said) | no | si |
| [Redactar una respuesta](#draft-a-reply) | sólo después de tu sí | no |
| [Un grupo que diriges](#a-group-you-run) | sólo si las reglas del grupo lo permiten | si |

## Una vez, primero

1. Instale `tg` e inicie sesión: consulte [instalación](./installation.md) e [inicio de sesión y sesiones](./sessions.md).
2. Dale al agente la skill:

   ```sh
   tg skill install
   ```

La skill va a las carpetas de Claude Code (`~/.claude/skills/tg-cli/`) y de Codex y Gemini CLI (`~/.agents/skills/tg-cli/`). `tg skill show` imprime el mismo texto, si su agente mantiene sus skills en otro lugar.
3. Guarde las solicitudes siguientes en archivos, por ejemplo en `~/tg-recipes/`. Los comandos de programación leen la solicitud de un archivo.

Un cliente MCP no necesita un skill. Conecta el servidor MCP (`tg mcp config` muestra la entrada para sus ajustes) y usa sus peticiones preparadas: `catch-up`, `review`, `reply`, `find`. Consulta [las peticiones del servidor MCP](./mcp.md#prompts-and-chats-by-).

## Qué puede hacer el agente

Un agente con un horario trabaja sin usted, así que establezca los límites en la configuración, no en la solicitud. Un agente puede leer mal "no enviar nada". No puede eludir una configuración que no se le permite cambiar.

**Limita lo que el agente puede ejecutar.** Esta es una configuración del agente. Por ejemplo, Claude Code en el modo `-p` ejecuta solo los comandos en `--allowedTools`. Sin ningún `tg messages send` en la lista, el agente no puede llamarlo:

```sh
claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
```

El Codex no tiene tal lista. Su entorno aislado bloquea la red y la escritura de archivos de forma predeterminada, y `tg` necesita ambas cosas: se conecta a Telegram y guarda lo que lee en su copia local. Por lo tanto, Codex se ejecuta con `--sandbox danger-full-access` y la configuración de `tg` por debajo del límite de envío.

**Limite lo que puede hacer el perfil.** Esto funciona para todos los agentes:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg config set permissions.$key readonly
done
tg config show                       # check the permissions in force
tg config set sendsPerHour 5         # or: at most five sends an hour
tg recipients add "Book club"        # and only to the chats on this list
```

`readonly` en un recurso no cubre los demás: `messages` por sí solo aún permite al agente reaccionar, votar o cambiar de chat. Por eso el bucle establece cada recurso. Una clave más precisa, como `permissions.messages.send: allow`, gana su recurso: elimine dichas claves si el perfil solo debe leer.

`permissions` también limita sus propios comandos, hasta que los vuelva a cambiar: `tg config unset permissions.messages`. Para limitar solo al agente, asígnele un perfil propio. Cada intento de envío, incluidos los rechazados, está en `tg sends list`. Consulte [el control de envío](./security.md#the-send-guard) y [lo que puede hacer un perfil](./configuration-reference.md#what-a-profile-may-do).

**La lectura no revela nada.** Ningún comando en las recetas siguientes marca nada leído: nadie ve que el agente abrió un chat.

## Programar las ejecuciones

- **Tareas programadas de Claude Desktop.** La tarea se ejecuta en su computadora, por lo que tiene `tg` y su inicio de sesión. Una ejecución perdida mientras la computadora estaba en reposo se ejecuta una vez cuando se reactiva. Consulte [Tareas programadas de Claude](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron y `claude -p`.** No se necesita aplicación, en cualquier computadora que esté encendida en ese momento:

  ```cron
  30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)" >> ~/tg-recipes/morning.log 2>&1
  ```

cron inicia trabajos con un entorno casi vacío. En Linux esto rompe `tg` de dos maneras:

- **`node: not found`, código de salida 127.** El nodo de nvm, fnm o Volta no está en el sistema `PATH` y cron solo conoce ese.
  - **"no se encontraron credenciales de la aplicación Telegram... aunque inició sesión en esta máquina", código de salida 4.** `tg` no puede acceder al llavero (el almacén de contraseñas del sistema). **No volver a iniciar sesión**: el inicio de sesión está bien, el entorno no.

Pon ambas líneas en la parte superior de `crontab -e`, con tus valores. La carpeta es `dirname "$(which node)"`, el número es `id -u`:

  ```cron
  PATH=/home/you/.nvm/versions/node/v24.0.0/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

El llavero está abierto mientras usted está conectado a la computadora. Ejecute el primer trabajo a mano y lea el registro. Consulte [Modo sin cabeza de Claude](https://code.claude.com/docs/en/headless).

- **cron y `codex exec`.** Lo mismo para Codex:

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/tg-recipes/morning.md)" >> ~/tg-recipes/morning.log 2>&1
  ```

Consulte [Modo no interactivo del Codex](https://learn.chatgpt.com/docs/non-interactive-mode).
- **Dentro de una sesión abierta de Claude Code**: `/loop`, o "recuérdamelo a las 15:00". Funciona mientras la sesión está abierta. Consulte [Tareas programadas de Claude Code](https://code.claude.com/docs/en/scheduled-tasks).

Las rutinas en la nube de Claude no encajan: se ejecutan en otra computadora, donde no hay ningún `tg` ni ningún inicio de sesión suyo.

## Resumen de la mañana

Escribe en Telegram: **no**. Permitir: `Bash(tg inbox:*)`.

> Ejecute `tg inbox --new --json`. Agrupa los mensajes por chat. Para cada chat, una línea: quién escribe y qué quiere. Ponga primero lo que necesita una respuesta hoy. Doble los anuncios y notificaciones de servicios en > una línea al final.

`--new` muestra cada mensaje una vez. `tg` recuerda dónde se detuvo en cada chat y la siguiente ejecución comienza allí. La primera ejecución se remonta a 24 horas atrás.

### Desde cuando es "nuevo"

- `tg inbox` — no leído, como lo cuenta Telegram: lo que no has abierto en ningún dispositivo.
- `tg inbox --new`: desde la última ejecución de `--new`. Sólo `tg` conoce ese punto; nadie más lo ve.
- `tg inbox --since-time 2d` — los dos últimos días; el punto guardado permanece donde estaba.

Ninguno de ellos marca nada de lo leído. Para hacer eso, agregue `--mark-read` o active `catchUpMarksRead` en la [configuración](./configuration.md). El otro lado ve entonces que lo lees.

### Chats directos, grupos y canales aparte

`--kind` mantiene sólo chats de ese tipo: `dialog` (uno a uno), `group`, `channel`. Un resumen de noticias de canales y un resumen de sus conversaciones pueden aparecer separados, en diferentes momentos. Cada chat tiene su propio punto, por lo que una ejecución nunca oculta lo que la otra aún no ha mostrado.

```cron
30 8 * * * claude -p "$(cat ~/tg-recipes/morning.md)" --allowedTools "Bash(tg inbox:*)"
0 19 * * * claude -p "$(cat ~/tg-recipes/news.md)" --allowedTools "Bash(tg inbox:*)"
```

En `morning.md`, `tg inbox --new --kind dialog,group --json`; en `news.md`, `tg inbox --new --kind
channel --json` y una solicitud para elegir lo que importa. Sin `--kind`, todo junto.

## Informe semanal sobre un chat

Escribe en Telegram: **no**. Permitir: `Bash(tg messages list:*)`.

> Lea los últimos 7 días del chat "Club de lectura": `tg messages list "Book club" --after-time 7d --limit 200
--json`. Si la respuesta dice `"hasMore": true`, sigue leyendo. Redactar un informe: qué se decidió, quién tomó qué y cuándo, qué cuestiones siguen abiertas. Dé a cada punto su fecha y autor.

## ¿Quién debe qué?

Escribe en Telegram: **no**. Permitir: `Bash(tg review:*)`, `Bash(tg messages context:*)`, `Bash(tg search messages:*)`.

> Ejecutar `tg review --new --transcribe --json` (la primera vez, los últimos 3 días; luego desde el último > `--new`, un punto por chat). Clasifíquelo en tres listas: lo que debo, lo que espero de los demás, lo que necesita ser aclarado. Dé a cada punto su chat, fecha y los identificadores de mensaje en los que se basa; una fecha límite sólo si > se nombró a uno. Antes de llamar a algo atrasado, verifique si se hizo más tarde o en un grupo de trabajo. Si la respuesta dice `"complete": false`, dime qué falta. Al final, enumera los puntos > abiertos.

`--transcribe` primero convierte los mensajes de voz en texto; puede tardar unos minutos. La siguiente revisión es la misma solicitud más los puntos abiertos de la anterior: el agente los revisa primero. Un chat no leído completo mantiene su punto y regresa. En un cliente MCP es el mensaje `review`.

## Lo que no has respondido

La forma más corta es `tg review --since-time 7d --unanswered --json`: preguntas que nadie respondió: a usted en chats individuales, a usted o a los administradores en grupos. La receta siguiente es más amplia: también detecta solicitudes sin signo de interrogación.

Escribe en Telegram: **no**. Permitir: `Bash(tg chats list:*)`, `Bash(tg messages list:*)`.

> Ejecute `tg chats list --kind dialog --limit 30 --json`. Para cada chat cuyo último mensaje sea de los últimos 7 días, lea `tg messages list <chat id> --limit 5 --json`. Muestra los chats donde el último > mensaje no es mío y hace una pregunta o hace una petición: quién, sobre qué y hace cuántos días.

## Encuentra algo que se dijo

Escribe en Telegram: **no**. Permitir: `Bash(tg search messages:*)`, `Bash(tg messages context:*)`.

> Busque "factura" con `tg search messages invoice --json`. Para cada respuesta, lea > `tg messages context <locator> --json` y dígame quién dijo qué y cuándo.

De forma predeterminada, la búsqueda busca tanto en la copia de esta computadora como en el servidor de Telegram. La copia local contiene solo lo que ha guardado `tg`. Para buscar en todo el historial local de un chat, descárgalo primero. Esa es una solicitud de su cuenta, así que hágalo usted mismo: `tg store fetch <chat>`. Consulte [obtener el historial de un chat](./archive.md#fetch-a-chats-history).

## Redactar una respuesta

Escribe a Telegram: **sólo después de tu sí**. Éste es para una conversación con el agente, no para un cronograma.

> Lee los últimos 20 mensajes del chat con @example_user y sugiere una respuesta a su última > pregunta. No lo envíes, muéstrame el texto.

Una vez aceptado, el agente lo envía: `tg messages send @example_user "…"`. Un cliente MCP se conecta con `tg mcp`. Deje `tg_write` sin aprobar en el cliente y le preguntará antes de cada envío. Los permisos del perfil aún limitan lo que puede escribir. Consulte [el servidor MCP](./mcp.md).

## Un grupo que diriges

Escribe en Telegram: **sólo si las reglas del grupo lo permiten**. Permitir: `Bash(tg review:*)`, `Bash(tg chats events:*)`, `Bash(tg chats members list:*)`, `Bash(tg chats moderate:*)`.

> Ejecute `tg review --chat "Hiking" --unanswered 4h --json`, `tg chats events "Hiking" --since-time 7d
--json` y `tg chats moderate "Hiking" --dry-run --json`. Brevemente: qué preguntas esperan respuesta, de quién y desde cuándo; quién se unió o fue agregado esta semana y por quién; lo que encontró el cheque en contra de las reglas del grupo y lo que sugiere. No responda ni elimine a nadie: enumere los comandos que lo harían si estoy de acuerdo.

Con planes `--dry-run`, `chats moderate` únicamente. Sin él, actúa hasta donde lo permiten las reglas del grupo, así que deje a `Bash(tg chats moderate:*)` fuera de la lista si el agente nunca debe actuar. Cada escenario para un grupo: [grupos que ejecuta](./groups.md).

## Colecciones similares

Recetas ajenas para Telegram y un agente. Sus solicitudes funcionan con `tg` una vez que reemplaza las herramientas con comandos:

- [Telegram MCP: la guía completa](https://mcp.directory/blog/telegram-mcp-complete-guide-2026): un pase matutino por la bandeja de entrada, borradores de respuestas, un resumen del canal, una búsqueda en varios chats.
- [pioh/tg](https://github.com/pioh/tg) — un agente de IA con una cuenta personal de Telegram: un resumen cada N minutos, "recuérdame si no he respondido a mamá en 15 minutos", observando personas y chateando.
- [Libro de cocina de Gorgias MCP](https://github.com/gorgias/mcp-cookbook) — recetas para atención al cliente, pero bien hechas: cada uno dice si escribe algo y qué cambiar usted mismo.
