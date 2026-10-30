---
title: "Tareas para tu agente"
---

Usa esta página cuando desee que tu agente de IA (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI) realice un trabajo regular con tu WhatsApp: un resumen matutino, un informe sobre un chat, quién debe qué, qué no ha respondido. Cada receta le proporciona una solicitud para copiar, los comandos que el agente puede ejecutar y si escribe algo en WhatsApp. Al final, puede ejecutar el agente según una programación, con límites que no puede eludir.

Términos en esta página:

- **Agente**: un programa de inteligencia artificial que ejecuta comandos en tu ordenador por ti.
- **Habilidad**: un archivo que le indica al agente cómo usar `wa`. `wa skill install` lo pone donde el agente lo busca.
- **Cliente MCP**: una aplicación de IA sin terminal, como Claude Desktop. Llega a `wa` a través del servidor MCP
  `wa personal mcp serve` en lugar de ejecutar comandos.
- **Modo sin cabeza**: el agente toma una solicitud, la ejecuta y sale, sin conversación. Código Claude lo llama
  Modo `-p`; El Códice lo llama `codex exec`.
- **cron**: el programador integrado en Linux y macOS. Inicia un comando en momentos establecidos.

## Qué hacen las recetas

Cada receta a continuación lee el almacén local, que `wa personal serve` mantiene completa desde tu teléfono. Las lecturas nunca se conectan a WhatsApp, por lo que se ejecutan junto a `serve`.

| Receta | Escribe a WhatsApp | Se adapta a un horario |
|---|---|---|
| [Resumen de la mañana](#morning-summary) | no | si |
| [Informe semanal sobre un chat](#weekly-report-on-a-chat) | no | si |
| [Quién debe qué](#who-owes-what) | no | si |
| [Lo que no has respondido](#what-you-have-not-answered) | no | si |
| [Encuentra algo que se dijo](#find-something-that-was-said) | no | si |
| [Redactar una respuesta](#draft-a-reply) | sólo después de tu sí | no |

## Una vez, primero

1. Instale `wa` y vincúlelo: consulte [instalación](./installation.md) y [vinculación](./sessions.md).
2. Mantén llena el almacén local: `wa personal server install`, luego `wa personal server start`. `wa personal server status` dice si se ejecuta.
3. Dale al agente el skill:

   

   ```sh
   wa skill install
   ```

   La skill va a las carpetas de Claude Code (`~/.claude/skills/whatsapp-cli/`) y de Codex y Gemini CLI (`~/.agents/skills/whatsapp-cli/`). `wa skill show` imprime el mismo texto, si tu agente mantiene sus skilles en otro lugar.
4. Guarde las solicitudes siguientes en archivos, por ejemplo en `~/wa-recipes/`. Los comandos de programación leen la solicitud de un archivo.

Un cliente MCP no necesita skilles. Conecte el servidor MCP (`wa personal mcp config` imprime la entrada para tu configuración); consulte [el servidor MCP](./mcp.md).

## Qué puede hacer el agente

Un agente con un horario trabaja sin ti, así que establezca los límites en la configuración, no en la solicitud. Un agente puede leer mal "no enviar nada". No puede eludir una configuración que no se le permite cambiar.

**Limita lo que el agente puede ejecutar.** Esta es una configuración del agente. Por ejemplo, Claude Code en el modo `-p` ejecuta solo los comandos en `--allowedTools`. Sin ningún `wa personal messages send` en la lista, el agente no puede llamarlo:

```sh
claude -p "$(cat ~/wa-recipes/morning.md)" --allowedTools "Bash(wa personal inbox:*)"
```

**Limite lo que puede hacer el perfil.** Esto funciona para todos los agentes:

```sh
wa personal config set permissions.messages readonly
wa personal config set permissions.reactions readonly
wa personal config set permissions.polls readonly
wa personal config set permissions.chats readonly
wa personal config show                     # check the permissions in force
wa personal config set sends_per_hour 5     # or: at most five sends an hour
wa personal recipients add 100000000000001@lid   # and only to the chats on this list
```

`readonly` en un recurso no cubre los demás: `messages` por sí solo aún permite al agente reaccionar o marcar un chat como leído. `recipients add` busca el chat en WhatsApp y se conecta; Mientras se ejecuta `serve`, se ejecuta dentro de `serve`, en su conexión. `permissions` también limita sus propios comandos, hasta que los vuelva a cambiar: `wa personal config unset permissions.messages`. Para limitar solo al agente, asígnele un perfil propio. Cada intento de envío, incluidos los rechazados, está en `wa personal sends list`. Consulta [permisos](./permissions.md).

**Nunca de forma masiva, nunca a extraños.** WhatsApp prohíbe las cuentas que envían a muchas personas a la vez o a números que nunca les escribieron. Ninguna receta aquí se envía sola.

**La lectura no revela nada.** Ningún comando en las recetas siguientes marca nada leído: nadie ve que el agente abrió un chat. Solo `chats mark-read` envía un recibo de lectura.

## Ejecutando según un horario

- **Tareas programadas de Claude Desktop.** La tarea se ejecuta en tu ordenador, por lo que tiene `wa` y su tienda. Consulta [tareas programadas de Claude](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron y `claude -p`.** No se necesita aplicación, en cualquier computadora que esté encendida en ese momento:

  

  ```cron
  30 8 * * * claude -p "$(cat ~/wa-recipes/morning.md)" --allowedTools "Bash(wa personal inbox:*)" >> ~/wa-recipes/morning.log 2>&1
  ```

  cron inicia trabajos con un entorno casi vacío. Si Node proviene de nvm, fnm o Volta, no está en `PATH` de cron y el trabajo falla con `node: not found`, código de salida 127. Coloque la carpeta de `which node` en la parte superior de `crontab -e`:

  

  ```cron
  PATH=/home/you/.nvm/versions/node/v24.0.0/bin:/usr/local/bin:/usr/bin:/bin
  ```

  Ejecuta el primer trabajo a mano y lea el registro. Consulta [Modo sin cabeza de Claude](https://code.claude.com/docs/en/headless).
- **cron y `codex exec`.** Lo mismo para Codex. Su entorno de pruebas cierra la escritura de archivos de forma predeterminada y `wa` escribe sus registros de ejecución y el punto guardado de `--new`:

  

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/wa-recipes/morning.md)" >> ~/wa-recipes/morning.log 2>&1
  ```

- **Dentro de una sesión abierta de Claude Code**: `/loop`, o "recuérdamelo a las 15:00". Funciona mientras la sesión está abierta.

Las rutinas en la nube de Claude no encajan: se ejecutan en otra computadora, donde no hay ningún `wa` ni ninguna tienda suya.

## Resumen de la mañana

Escribe a WhatsApp: **no**. Permitir: `Bash(wa personal inbox:*)`.

> Ejecuta `wa personal inbox --new --json`. Agrupa los mensajes por chat. Para cada chat, una línea: quién escribe y qué
> quiero. Ponga primero lo que necesita una respuesta hoy.

`--new` muestra cada mensaje una vez. `wa` recuerda dónde se detuvo en cada chat y la siguiente ejecución comienza allí.

### Desde cuando es "nuevo"

- `wa personal inbox`: mensajes no leídos de otras personas.
- `wa personal inbox --new`: desde la última ejecución de `--new`. Sólo `wa` conoce ese punto; nadie más lo ve.
- `wa personal inbox 'date>2d'` — los dos últimos días; el punto guardado permanece donde estaba.

Ninguno de ellos marca nada de lo leído. `kind:dialog` mantiene chats uno a uno, grupos `kind:group`.

## Informe semanal sobre un chat

Escribe a WhatsApp: **no**. Permitir: `Bash(wa personal messages list:*)`.

> Lee los últimos 7 días del grupo `120363000000000001@g.us`:
> `wa personal messages list 120363000000000001@g.us "date>7d" --limit 200 --json`. Si la respuesta tiene un `page.next`
> paso, síguelo. Redactar un informe: qué se decidió, quién se hizo cargo de qué y cuándo, qué cuestiones siguen abiertas.
> Indique a cada punto su fecha y autor.

La tienda guarda lo que el teléfono presionó cuando `wa` se vinculó y lo que `serve` recibió desde entonces. Un tramo más antiguo no aparece hasta que `wa personal messages sync 120363000000000001@g.us` lo pide al teléfono ([historial anterior](./archive.md#older-history-from-your-phone)).

## ¿Quién debe qué?

Escribe a WhatsApp: **no**. Permitir: `Bash(wa personal review:*)`, `Bash(wa personal messages context:*)`, `Bash(wa personal search messages:*)`.

> Ejecutar `wa personal review --new --json` (la primera vez, los últimos 3 días; luego desde el último `--new`, un punto por
> charlar). Clasifícalo en tres listas: lo que debo, lo que espero de los demás, lo que necesita ser aclarado. da cada punto
> su chat, fecha y los ID de mensaje en los que se basa. Si la respuesta dice `"complete": false`, dime qué falta.

`review` y `serve` también mantienen una lista de tareas: `wa personal tasks list state:open` muestra lo que te espera ([grupos](./groups.md#what-waits-on-you)).

## Lo que no has respondido

Escribe a WhatsApp: **no**. Permitir: `Bash(wa personal review:*)`.

> Ejecuta `wa personal review 'date>7d' --unanswered --json`. Muestra las preguntas que nadie respondió: quién preguntó, en qué
> chatear, y hace cuanto tiempo.

## Encuentra algo que se dijo

Escribe a WhatsApp: **no**. Permitir: `Bash(wa personal search messages:*)`, `Bash(wa personal messages context:*)`.

> Busque "factura" con `wa personal search messages invoice --json`. Para cada golpe, lea
> `wa personal messages context <locator> --json` y dime quién dijo qué y cuándo.

La búsqueda lee solo el almacén local. Consulta [búsqueda](./search.md).

## Redactar una respuesta

Escribe a WhatsApp: **sólo después de tu sí**. Éste es para una conversación con el agente, no para un cronograma.> Leer los últimos 20 mensajes del chat `100000000000001@lid` y sugerir una respuesta a su última pregunta. no
> envíalo - muéstrame el texto.

Una vez aceptado, el agente lo envía: `wa personal messages send 100000000000001@lid "…"`. Mientras se ejecuta `serve`, el envío pasa por la conexión de `serve` ([una conexión por dispositivo](./sessions.md#one-connection-per-device)); allí no puede preguntar, por lo que en el nivel de permiso `ask` necesita `--yes`. Un cliente MCP le pregunta antes de cada escritura si deja `wa_write` sin aprobar.
