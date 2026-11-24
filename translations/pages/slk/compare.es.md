---
title: "Comparación con otras herramientas"
---

`slk` es una línea de comandos y un servidor MCP para Slack: canales, mensajes directos y grupales, hilos, personas y
archivos. Esta página lo pone junto a las otras herramientas con las que un agente de IA lee Slack, para que veas cuál
encaja con tu trabajo. Las marcas de `slk` salen de sus comandos y su documentación, revisados el 24 de noviembre de
2026, no de un espacio de trabajo real. Se revisan de nuevo en cada versión. Las marcas de las otras herramientas
salen de su propia documentación y su código, enlazados en la tabla, revisados el 24 de noviembre de 2026. No se
inició sesión en ninguna ni se probaron en vivo, y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **slk**: esta herramienta. Lee Slack como tú, con la búsqueda de Slack y una copia en tu ordenador, y decide para
  cada acción qué puede hacer un agente. Inicia sesión con el token de una app de Slack que creas en tu propio espacio
  de trabajo.
- **[Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)**: el servidor MCP oficial de Slack, que ejecuta
  Slack en `mcp.slack.com`. Una app de IA se conecta a él con OAuth, y un administrador del espacio de trabajo aprueba
  esa app.
- **[korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server)**: el servidor MCP de Slack de
  código abierto con más estrellas (1901 estrellas, cambiado el 16 de julio de 2026). Inicia sesión con un token de
  usuario, un token de bot, o un token y una cookie copiados de un navegador donde has iniciado sesión en Slack.
- **[slackdump](https://github.com/rusq/slackdump)**: un archivador que guarda en tu ordenador los mensajes, archivos y
  usuarios de un espacio de trabajo (2875 estrellas, cambiado el 22 de noviembre de 2026). Su servidor MCP lee ese
  archivo y nunca escribe.

Slack deja a un programa leer mensajes solo a través de una app instalada en el espacio de trabajo, o con el token de
una sesión del navegador. Desde mayo de 2025, una app que otra empresa publica fuera del Slack Marketplace lee el
historial de un canal [a una petición de 15 mensajes por minuto](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
Una app que un cliente crea para su propio espacio de trabajo conserva los límites normales. Por eso `slk` te pide
crear tu propia app. El [antiguo servidor MCP de referencia](https://github.com/modelcontextprotocol/servers-archived)
para Slack se archivó en mayo de 2025, así que no está en la tabla.

✅ sí · 🟡 en parte · ❌ no · ➖ no figura en su documentación · n/a no aplica

## Funciones

| Tarea | slk | [Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/) | [korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server) | [slackdump](https://github.com/rusq/slackdump) |
|---|:-:|:-:|:-:|:-:|
| **Encontrar y leer** | | | | |
| Leer canales y mensajes directos | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L34-L40) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| Leer un hilo entero | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L42-L49) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L186-L199) |
| Buscar con la búsqueda de Slack | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L62-L78) | [🟡](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/archive/assets/search.md?plain=1#L8-L20) |
| Leer y buscar sin conexión | 🟡 | ❌ | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L296-L310) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| Lo no leído, en una respuesta | 🟡 | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L189-L199) | ➖ |
| Descargar archivos | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L294) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L3-L4) |
| **Escribir** | | | | |
| Enviar un mensaje como tú | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L51-L54) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Editar, borrar y reaccionar | ✅ | [🟡](https://docs.slack.dev/ai/slack-mcp-server/) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L88-L101) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Cada método de la Slack Web API | ✅ | ➖ | ➖ | n/a |
| **Agentes y seguridad** | | | | |
| Dejar que un agente solo lea | ✅ | ➖ | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L290) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7) |
| Elegir para cada acción: permitir, preguntar o rechazar | ✅ | ➖ | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/docs/03-configuration-and-usage.md?plain=1#L286-L294) | n/a |
| Ver qué enviaría una escritura, sin enviarla | ✅ | ➖ | ➖ | n/a |
| El token se guarda en el llavero del sistema | ✅ | n/a | [❌](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L277-L302) | [❌](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/auth.go#L181-L186) |
| Un agente en la terminal trabaja con comandos, sin MCP | ✅ | n/a | n/a | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/README.md?plain=1#L56-L70) |
| **Configuración** | | | | |
| Un servidor MCP | ✅ | [✅](https://docs.slack.dev/ai/slack-mcp-server/) | [✅](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L22) | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/cmd/slackdump/internal/mcp/assets/mcp.md?plain=1#L7-L18) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [✅](https://slack.com/help/articles/48855576908307-Guide-to-MCP-in-Slack) | [🟡](https://github.com/korotovsky/slack-mcp-server/blob/b88c0de3f706f4f07337c9eda7133c736d1c9524/README.md?plain=1#L282-L283) | ➖ |
| Varios espacios de trabajo, cada uno nombrado en el comando | ✅ | ➖ | ➖ | [✅](https://github.com/rusq/slackdump/blob/448025fac699a915f5b57b908a626487421f81b6/internal/cache/manager.go#L43-L47) |

| | slk | Slack MCP server | korotovsky/slack-mcp-server | slackdump |
|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | ninguna: lo ejecuta Slack, tú conectas una app de IA aprobada | npx, Docker o una extensión de Claude Desktop | Homebrew o un binario |
| Inicio de sesión | el User OAuth Token de tu propia app de Slack | OAuth, con una app del Slack Marketplace o creada dentro del espacio de trabajo | un token de usuario o de bot, o un token y una cookie del navegador | un inicio de sesión en el navegador o un token |
| Licencia | Apache-2.0 | servicio cerrado | MIT | AGPL-3.0 |
| Precio | gratis | no figura en su página | gratis | gratis |

Notas sobre la columna de `slk`:

- **Inicio de sesión.** El User OAuth Token (`xoxp-`) actúa con los derechos de la persona que instaló la app, así
  que `slk` ve solo las conversaciones en las que está esa persona. `session start` lo lee sin mostrarlo o desde
  stdin, nunca como argumento, y lo comprueba con Slack antes de guardarlo. Un token de bot se rechaza. Mira la
  [instalación](./installation.md).
- **Sin conexión.** `messages sync` guarda el historial de un chat en el almacén local de WireCat, con las respuestas
  nuevas de hilos de hasta 14 días, y `search messages --backend archive` lee solo esa copia. Solo están los chats que
  sincronizaste, así que esta fila es en parte.
- **No leídos.** `inbox` cubre todos los mensajes directos y grupales, los canales que nombras en `inbox_channels`, y
  otros canales solo donde te mencionaron o alguien escribió @here, @channel o @everyone. No lee las respuestas dentro
  de hilos, así que esta fila es en parte.
- **El grupo api.** `slk <profile> api` tiene un comando para cada método de la Slack Web API, cada uno con sus
  opciones y su ayuda. `slk api list` los nombra todos.
- **Permitir, preguntar o rechazar.** Cada comando y cada método de la API tiene su clave, con `allow`, `ask`,
  `readonly` o `deny` por perfil en [los ajustes](./configuration.md#permissions). `SLACK_READ_ONLY=1` rechaza
  cualquier escritura.
- **Por MCP.** No hay nadie para responder a `ask`, así que `ask` deja seguir al agente. Cada escritura del agente
  queda en `runs list`. Para impedir escrituras, pon `permissions.api` en `readonly`, o un método en `deny`.
- **Prueba sin enviar.** `--dry-run` muestra lo que una escritura enviaría a Slack, y no envía nada.
- **Varios espacios de trabajo.** Cada comando empieza con un perfil, un nombre que eliges para un espacio de trabajo.
  Nunca se da un perfil por supuesto, ni siquiera el único. Mira [uso](./usage.md).
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta tras un túnel que configuras y
  mantienes en marcha tú, así que esta fila es en parte.

Notas sobre las otras columnas:

- **Slack MCP server.** Slack solo deja usarlo a las apps de su Marketplace y a las creadas dentro del espacio de
  trabajo, y los administradores aprueban cada una. Su página nombra herramientas para enviar y programar mensajes y
  añadir reacciones, pero ninguna para editar o borrar.
- **korotovsky/slack-mcp-server.** El envío, las reacciones y la descarga de archivos están apagados hasta que
  enciendes cada uno, para todos los canales o para una lista. No hay ningún ajuste que pregunte antes de escribir.
  Lo no leído funciona mejor con el token del navegador.
- **slackdump.** Su comando `search` pregunta a la búsqueda de Slack desde la línea de comandos, mientras que su
  servidor MCP solo lee el archivo guardado. Guarda espacios de trabajo sin app ni derechos de administrador, y su
  README avisa de que un espacio de trabajo Enterprise puede alertar a sus administradores.

## Cuándo encaja mejor otra herramienta

- **Slack MCP server**: quieres ChatGPT o Claude sin nada que ejecutar en tu ordenador, y tu administrador aprueba la
  app de IA que usas.
- **korotovsky/slack-mcp-server**: no puedes instalar apps en el espacio de trabajo y te vale el token de tu sesión
  del navegador, o quieres una lista de no leídos de todos los canales.
- **slackdump**: quieres un archivo completo de un espacio de trabajo en tu ordenador, para guardarlo o leerlo sin
  conexión, y tu agente solo lo lee.

Si `slk` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, mira [uso](./usage.md).
