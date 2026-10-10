---
title: "Recetas: tu agente y tus conversaciones"
---

Esta página te ayuda a encargar tareas periódicas a tu agente de IA (como Claude Code, Codex, Cursor o Gemini CLI): resúmenes, informes, compromisos pendientes y seguimiento de grupos. Cada receta incluye una petición, comandos y si modifica MAX. Aprenderás a programar ejecuciones y limitar las acciones en una configuración que el agente no pueda modificar.

Palabras en esta página:

- **Agente**: agente de IA que ejecuta comandos por ti en el ordenador.
- **Skill**: archivo de instrucciones para usar `max`. `max skill install` lo coloca donde el agente lo busca.
- **Cliente MCP**: aplicación de IA sin terminal, como Claude Desktop. Usa el servidor `max mcp` en lugar de ejecutar comandos.
- **Modo no interactivo**: recibe una petición, la ejecuta y termina. Claude Code usa `-p`; Codex, `codex exec`.
- **cron**: programador de Linux y macOS que ejecuta comandos a horas indicadas.

## ¿Qué recetas pueden hacer?

|Receta|Escribe en MAX|Adecuado para el horario|
|---|---|---|
|[Resumen matutino](#утренняя-сводка)|No|Sí|
|[Informe semanal de chat de trabajo](#недельный-отчёт-по-рабочему-чату)|No|Sí|
|[Quién le debe a quién](#кто-кому-должен)|No|Sí|
|[A quien no respondiste](#кому-вы-не-ответили)|No|Sí|
|[Encuentra lo que se dijo](#найти-что-было-сказано)|No|Sí|
|[Borrador de respuesta](#черновик-ответа)|sólo después de tu “sí”|No|
|[El grupo que diriges](#группа-которую-вы-ведёте)|sólo si lo permiten las reglas del grupo|Sí|

## Preparación inicial

1. Instala `max` e inicia sesión: [instalación](./installation.md) y [sesiones](./sessions.md).
2. Instala la skill del agente:

   ```sh
   max skill install
   ```

La skill se guarda en `~/.claude/skills/max-cli/` para Claude Code y en `~/.agents/skills/max-cli/` para Codex y Gemini CLI. `max skill show` muestra el mismo texto si tu agente usa otra ubicación.
3. Guarda las peticiones en archivos, por ejemplo `~/max-recipes/`. Los comandos de programación siguientes las leen de un archivo.

El cliente MCP no necesita la habilidad. Conecte el servidor MCP (`max mcp config` imprime una entrada para su configuración) y llame a los comandos listos para usar: `/catch-up`, `/review`, `/reply`, `/find`. Consulte [Comandos listos para el servidor MCP](./mcp.md#команды-и-чаты-по-).

## Permisos del agente

El agente de programación trabaja sin usted, por lo que las restricciones se establecen en la configuración, no en la solicitud. Un agente puede malinterpretar la frase “no envíes nada”. No eludirá una prohibición en aquellas configuraciones que no pueda cambiar.

**Prohibición a nivel de agente.** Esta es una configuración para el propio agente. Por ejemplo, Claude Code en modo `-p` solo ejecuta comandos desde `--allowedTools`. Si `max messages send` no está en la lista, el agente no puede llamarlo:

```sh
claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
```

El Codex no tiene tal lista. Su zona de pruebas cierra de forma predeterminada la red y la escritura de archivos, y `max` necesita ambas cosas: conectarse a MAX y guardar lo que lee en su copia. Por lo tanto, Codex comienza con `--sandbox danger-full-access` y el envío está limitado por la configuración de `max` a continuación.

**En `max`**, el límite se aplica a cualquier agente:

```sh
for resource in messages reactions polls topics chats contacts account bot conversations; do
  max config set "permissions.$resource" readonly
done
max config show                       # проверить эффективные права
max config set sendsPerHour 5          # или: не больше пяти сообщений в час
max recipients add "Иван Петров"       # и писать только в эти чаты
```

`readonly` en un recurso no afecta a otros: limitar solo `messages` deja disponibles reacciones, votos o cambios de chats. Por eso el bucle configura cada recurso. Una clave más precisa, como `permissions.messages.send: allow`, tiene prioridad: elimina esas excepciones para un perfil de solo lectura. Tras migrar, el antiguo `readOnly` ya no puede modificarse.

`permissions` también restringe tus propios comandos hasta que elimines la prohibición: `max config unset permissions.<ресурс>`. Luego, la configuración heredada y los valores predeterminados se aplican nuevamente. Para restringir solo al agente, asígnele un perfil separado. Todos los intentos de envío, incluidos los rechazados, se envían a `max sends list`. Consulte [protección contra direcciones erróneas](./security.md#защита-от-отправки-не-туда) y [permisos](./configuration-reference.md#права-доступа).

**Leer no revela tu actividad.** Ninguna orden de estas recetas marca mensajes leídos; tu interlocutor no ve que el agente abrió el chat.

## Programar ejecuciones

- **Claude Desktop: tareas programadas.** La tarea se ejecuta en su computadora, por lo que puede acceder a `max` y a sus entradas. Un inicio fallido (la computadora estaba inactiva) se realiza una vez después de despertarse. Ver [tareas programadas Claude](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron y `claude -p`.** Sin una aplicación, en cualquier computadora que esté encendida en este momento:

  ```cron
  30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)" >> ~/max-recipes/morning.log 2>&1
  ```

Los trabajos cron se ejecutan en un entorno casi vacío. En Linux esto rompe `max` de dos maneras:

- **`node: not found`, código 127.** Node instalado mediante nvm, fnm o Volta no está en el `PATH` del sistema; cron solo conoce ese PATH.
- **`no token found for profile "default", although it has logged in on this machine`, código 4.** `max` no alcanza el llavero y no ve el token. **No vuelvas a iniciar sesión**: la sesión funciona; el problema es el entorno.

Ambas líneas van al principio de `crontab -e`, con sus propios valores. La carpeta es de `dirname "$(which node)"`, el número es de `id -u`:

  ```cron
  PATH=/home/ivan/.nvm/versions/node/v24.19.0/bin:/home/ivan/.local/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

El almacén de contraseñas está disponible mientras está conectado. Verifique el primer inicio con las manos y mire el registro. Ver [sin modo de diálogo en Claude](https://code.claude.com/docs/en/headless).

- **Cron con `codex exec`:**

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/max-recipes/morning.md)" >> ~/max-recipes/morning.log 2>&1
  ```

Consulte [sin modo de diálogo en Codex](https://learn.chatgpt.com/docs/non-interactive-mode).
- **Dentro de una sesión abierta Claude Code** - `/loop` o “recuérdamelo a las 15:00”. Funciona mientras la sesión está abierta. Ver [tareas programadas Claude Code](https://code.claude.com/docs/en/scheduled-tasks).

Las tareas (rutinas) en la nube de Claude no son adecuadas: se ejecutan en otra computadora donde no están presentes `max` ni su inicio de sesión.

## Resumen de la mañana

Escribe en MAX: **no**. Permite `Bash(max inbox:*)`.

> Ejecute `max inbox --new --json`. Mensajes grupales por chat. Para cada chat - una línea:
> quién escribe y qué quiere. Arriba está lo que necesita respuesta hoy. Anuncios y notificaciones
> reducir los servicios a una línea al final.

`--new` muestra cada mensaje una vez. `max` recuerda dónde quedó en cada chat y el siguiente ejecución comienza desde ese lugar. La primera ejecución analiza las últimas 24 horas.

### Desde cuándo es «nuevo»

- `max inbox`: lo no leído según MAX, es decir, todo lo que no has abierto en ningún dispositivo.
- `max inbox --new`: desde la ejecución anterior de `--new`. Ese punto solo lo conoce `max`; tus interlocutores no lo ven.
- `max inbox --since-time 2d`: los dos últimos días; el punto guardado no se mueve.

Ninguno de ellos marca los mensajes como leídos. Si es necesario, agregue `--mark-read` o habilite `catchUpMarksRead` en [ajustes](./configuration.md). Entonces el interlocutor verá lo que has leído.

### Chats individuales, grupos y canales por separado

`--kind` deja solo chats del tipo requerido: `dialog` - personal, `group` - grupos, `channel` - canales. El resumen del canal y el resumen de la conversación se pueden ejecutar por separado, en momentos diferentes. Cada chat tiene su propio punto y un ejecución no oculta lo que el otro aún no ha mostrado:

```cron
30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
0 19 * * * claude -p "$(cat ~/max-recipes/news.md)" --allowedTools "Bash(max inbox:*)"
```

`morning.md` contiene `max inbox --new --kind dialog,group --json`; `news.md`, `max inbox --new --kind channel --json` y la petición de elegir lo importante. Sin `--kind`, todo junto.

## Informe semanal del trabajo

Escribe: **no**. Permite `Bash(max messages list:*)`.

> Leer mensajes en el chat "Proyecto Alfa" de los últimos 7 días: `max messages list "Проект Альфа"
> --after-time 7d --limit 200 --json`. si en la respuesta
> `"hasMore": true`, sigue leyendo. Hacer un informe: qué se decidió, quién asumió qué y para qué
> plazo, qué preguntas quedaron sin respuesta. Cada artículo tiene una fecha y un autor.

## Compromisos y seguimiento

Escribe: **no**. Permite `Bash(max review:*)`, `Bash(max messages context:*)`, `Bash(max search messages:*)`.

> Complete `max review --new --transcribe --json` (primera vez - 3 días, luego - desde la última
> `--new`, cada chat tiene su punto). Divídalo en tres listas: lo que debo, lo que espero de los demás,
> lo que hay que aclarar. Cada elemento tiene un chat, fecha e id de los mensajes en los que se basa; término -
> sólo si se nombra. Antes de llamar por algo vencido, verifique si se hizo más tarde
> o en grupos de trabajo. Si es `"complete": false`, dime qué falta. Lista al final
> elementos no cerrados.

`--transcribe` primero traduce mensajes de voz a texto; esto puede tardar unos minutos. La siguiente revisión es la misma solicitud más los elementos no cerrados del pasado: el agente los revisará primero. Un chat que no se haya leído en su totalidad guardará su punto y volverá. En el cliente MCP, este es el comando `/review`.

## A quién no has respondido

`max review --since-time 7d --unanswered --json` encuentra preguntas dirigidas a ti, o a ti y administradores en grupos. Esta receta también detecta peticiones sin interrogación.

Escribe: **no**. Permite `Bash(max chats list:*)`, `Bash(max messages list:*)`.

> Ejecute `max chats list --kind dialog --limit 30 --json`. Para cada chat, ¿dónde está el último?
> el mensaje fue en los últimos 7 días, lea `max messages list <id чата> --limit 5 --json`.
> Mostrar chats donde el último mensaje no es mío y contiene una pregunta o solicitud: con quién, sobre qué y
> cuantos dias han pasado?

## Encuentra lo que se dijo

Escribe en MAX: **no**. Permitir: `Bash(max search messages:*)`, `Bash(max messages context:*)`.

> Busque la "cuenta" a través de `max search messages счёт --json`. Para cada uno encontrado, lea
> `max messages context <locator> --json` y dime quién dijo qué y cuándo.

Por defecto, la búsqueda se realiza tanto en la copia de este ordenador como en el servidor MAX. El archivo local contiene sólo lo que `max` ya ha guardado. Para buscar todo tu historial de chat localmente, primero descárgalo. Esta es una solicitud de su cuenta, así que hágala usted mismo: `max store fetch <чат>`. Ver [historial de descargas](./archive.md#скачать-историю).

## Borrador de respuesta

Escribe: **solo después de tu aprobación**. Para conversación interactiva, no programación.

> Lee los últimos 20 mensajes con Iván Petrov y propón una respuesta a su última pregunta. No la envíes; muéstrame el texto.

Tras tu aprobación, el agente envía el texto con `max messages send "Иван Петров" "…"`. El cliente MCP se conecta mediante `max mcp`. No configures una aprobación previa de `max_write`; así el cliente preguntará antes de enviar. Los permisos del perfil siguen limitando la escritura. Consulta [servidor MCP](./mcp.md).

## Un grupo que administras

Escribe: **solo según las reglas**. Permite `Bash(max review:*)`, `Bash(max chats events:*)`, `Bash(max chats members list:*)`, `Bash(max chats moderate:*)`.

> Ejecute `max review --chat "Поход" --unanswered 4h --json`, `max chats events "Поход" --since-time
> 7d --json` и `max chats moderate "Поход" --dry-run --json`. Brevemente: de qué preguntas esperan respuestas
> quién y desde qué hora; quién se unió o fue agregado durante la semana y por quién; lo que encontró el cheque
> reglas del grupo y lo que se propone hacer. No respondas a nadie ni elimines a nadie tú mismo: enuméralo
> equipos que lo harán si estoy de acuerdo.

Con `--dry-run`, el comando de `chats moderate` solo está haciendo un plan. Sin él, actúa dentro de las reglas del grupo, por lo tanto, elimine `Bash(max chats moderate:*)` de la lista si el agente nunca debe actuar. Todos los escenarios y reglas: [grupos que usted lidera](./groups.md).

## Colecciones relacionadas

Todavía no existen recetas preparadas para MAX. Para Telegram existe; sus consultas también son adecuadas para `max`, si reemplaza las herramientas con comandos:

- [Telegram MCP: guía completa](https://mcp.directory/blog/telegram-mcp-complete-guide-2026) - análisis matutino de bandejas de entrada, borradores de respuestas, resumen de canales, búsqueda en varios chats.
- [pioh/tg](https://github.com/pioh/tg) - Agente de IA con una cuenta personal de Telegram: resumen una vez cada N minutos, "recuérdame si no le respondí a mi mamá en 15 minutos", monitoreando personas y chats.
- [Libro de cocina de Gorgias MCP](https://github.com/gorgias/mcp-cookbook) - recetas para el servicio de soporte, pero bien organizadas: a cada uno se le dice si está escribiendo algo y qué corregir por sí mismo.
