---
title: "Comparado con otras herramientas"
---

<a id="what-you-can-do" />
<a id="setup-and-licence" />
<a id="when-another-tool-fits-better" />
<a id="where-the-marks-come-from" />

Hay otras herramientas abiertas para MAX. Esta página pone `max` junto a cinco de ellas y las compara por tareas: lo
que puedes hacer. La tabla muestra qué herramienta encaja con tu trabajo. Las marcas de `max` se revisaron con su
código. Las marcas de las demás herramientas salen de la documentación y el código de sus proyectos, a 24 de octubre
de 2026. Una herramienta puede hacer más de lo que dice su documentación.

Las herramientas:

- **max**: esta herramienta. Una línea de comandos y un servidor MCP para tu cuenta de MAX y tus bots.
- **[PyMax](https://github.com/MaxApiTeam/PyMax)**: una biblioteca de Python para una cuenta personal.
- **[tsmax](https://github.com/sibstark/tsmax)** (`@bruch/max-client`): una biblioteca de TypeScript para Bun, cuenta
  personal.
- **[max-mcp](https://github.com/renosaza/max-mcp)**: un servidor MCP construido sobre PyMax, cuenta personal,
  8 herramientas.
- **[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger)**: un servidor MCP sobre la Bot API oficial,
  21 herramientas.
- **[Bot API MAX](https://dev.max.ru/docs-api)** y sus SDK: el único acceso oficial desde programas. Funciona como un
  bot, no como tu cuenta.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación

Una cuenta personal funciona a través del protocolo no oficial de MAX. `max bot`, mcp-max-messenger y los SDK oficiales
usan la Bot API oficial.

## Lo que puedes hacer

La tabla cubre **max**, [PyMax](https://github.com/MaxApiTeam/PyMax), [tsmax](https://github.com/sibstark/tsmax),
[max-mcp](https://github.com/renosaza/max-mcp),
[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger) y [Bot API](https://dev.max.ru/docs-api).

| Tarea | max | PyMax | tsmax | max-mcp | mcp-max-messenger | Bot API |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Ponerse al día** | | | | | | |
| Ver los mensajes sin leer de todos los chats con una sola petición, sin marcarlos como leídos | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver a quién no has respondido y qué promesas siguen abiertas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Responder y enviar** | | | | | | |
| Responder, editar, borrar o reenviar un mensaje | ✅ | ✅ | ✅ | 🟡 | 🟡 | ✅ |
| Enviar una foto o un archivo | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ |
| Enviar varias fotos en un solo mensaje | ✅ | ✅ | ✅ | ❌ | ➖ | ➖ |
| **Encontrar** | | | | | | |
| Encontrar un mensaje en un chat o en todos, en el servidor de MAX | ✅ | ➖ | ❌ | 🟡 | ❌ | ❌ |
| Encontrar un mensaje por su sentido, no por las palabras | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Buscar en una copia local sin internet | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Encontrar un archivo que alguien envió por su nombre, su tipo o el texto que contiene (PDF, documento, escaneo) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Archivos y voz** | | | | | | |
| Pasar un mensaje de voz a texto en tu ordenador | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exportar un chat a JSONL o Markdown, hacer una copia cifrada | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| **Grupos y canales** | | | | | | |
| Crear un grupo, añadir personas, nombrar administradores | ✅ | ✅ | 🟡 | ❌ | 🟡 | 🟡 |
| Ver las solicitudes para unirse, aceptarlas o rechazarlas | ✅ | ✅ | ✅ | ❌ | ➖ | ➖ |
| Un resumen de un grupo o canal en un periodo: mensajes, personas activas, recién llegados, personas que se fueron | ✅ | ❌ | ❌ | 🟡 | ❌ | ➖ |
| Comentarios bajo las publicaciones de un canal | 🟡 | ➖ | ❌ | ❌ | ❌ | ✅ |
| **Bot y automatización** | | | | | | |
| Escribir como tu bot desde la misma herramienta | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Un resumen matutino programado y respuestas automáticas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Agentes y seguridad** | | | | | | |
| Un agente lee y escribe en MAX por MCP | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Un agente con terminal trabaja sin MCP: un skill le explica los comandos | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| Limitar un agente a la lectura | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Aprobación configurable antes de enviar | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Permitir envíos solo a una lista de chats | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Limitar el número de envíos por hora | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| Reintentar un envío compatible con el mismo ID de operación | ✅ | ➖ | ➖ | ❌ | ❌ | ➖ |
| El token se guarda en el llavero del sistema, no en un archivo (sin llavero, `max` escribe un archivo con modo 0600) | ✅ | ❌ | ❌ | 🟡 | 🟡 | ➖ |

**Responder y enviar.** En `max`, repite `--photo` para un álbum. Varias opciones `--file` salen como mensajes
separados, y un vídeo o un archivo no se puede mezclar con otros adjuntos. max-mcp no puede editar ni borrar mensajes.
mcp-max-messenger no puede reenviar y envía los archivos por enlace.

**Encontrar.** La búsqueda de max-mcp es simple: busca una subcadena, y cada llamada lee el historial de un chat.
PyMax nombra la búsqueda en el servidor en su lista de códigos de operación, pero su documentación no la describe.
`max` también puede buscar imágenes por lo que muestran, con un modelo en tu ordenador. Eso se activa aparte.

**Archivos y voz.** max-mcp exporta solo canales, hasta 1000 publicaciones por llamada.

**Grupos y canales.** mcp-max-messenger y la Bot API ven solo los grupos en los que el bot es miembro. tsmax no puede
nombrar administradores. El resumen de `max` se calcula a partir de la copia local, y `max` pregunta a MAX quién entró
y quién salió. max-mcp tiene reacciones y estadísticas de las publicaciones de un canal, pero no un resumen de grupo.
`max` gestiona los comentarios bajo las publicaciones solo como bot. Una cuenta personal no tiene esos comentarios.
`max` puede responder de una vez a todas las solicitudes pendientes para unirse a un canal. No puede elegir solicitudes
por enlace de invitación, porque MAX no indica por qué enlace llegó una solicitud.

**Agentes y seguridad.** PyMax, tsmax y la Bot API tienen ➖ donde la protección la tendría que escribir el autor del
programa: son bibliotecas y no traen ajustes listos.
El servidor MCP de `max` da al agente tres herramientas: buscar un comando, leer y escribir. Exponen los comandos
publicados según lo que permiten los permisos del perfil, escrituras incluidas. Los permisos del perfil también se
aplican a MCP. El bot tiene un servidor aparte. El inicio y el cierre de sesión y los comandos que se ejecutan sin
parar (`watch`, `serve`) no se ofrecen por MCP. Los comandos con los que un agente podría quitarse sus propios límites
(la lista de chats permitidos, los permisos, las respuestas automáticas, las programaciones) siguen en su lista de
comandos marcados como no disponibles. `permissions.mcp.authority` deja ejecutarlos, y por defecto es `deny`. Las
operaciones directas del bot necesitan además `permissions.bot.api: allow` o `ask`. Consulta la
[guía de MCP](./mcp.md) para más detalles. Los permisos del perfil y los ajustes de aprobación de la aplicación del
agente deciden cuándo se permite enviar. MCP en sí no tiene un formulario de confirmación. Configúralos antes de
conectar un agente. El límite por defecto es de 30 envíos por hora por perfil, y el error dice cuándo puedes volver a
enviar. max-mcp tiene un solo límite: una lista de carpetas permitidas para archivos. max-mcp guarda su token en un
archivo con modo 0600, y mcp-max-messenger lo lee de la variable de entorno `MAX_TOKEN`. PyMax y tsmax guardan el
token en el archivo de sesión `session.db`.

## Instalación y licencia

| | max | PyMax | tsmax | max-mcp | mcp-max-messenger | Bot API |
|---|---|---|---|---|---|---|
| Instalación | npm, pnpm, Bun | biblioteca de Python | biblioteca, solo Bun | git, `uv` y un script de inicio de sesión | `npx` | SDK |
| MCP | stdio y HTTP, para agentes en un navegador | no | no | stdio | stdio y HTTP | no |
| Licencia | Apache-2.0 | MIT | MIT | MIT | MIT con Commons Clause | gratis, solo para organizaciones verificadas, empresarios individuales y autónomos |

`max` necesita Node 22.16+ o 24+, o Bun 1.3+. Todavía no hay un instalador sin Node. Un agente de navegador que maneja
`web.max.ru` trabaja a través de la interfaz y de una sesión iniciada en el navegador. `max` habla con MAX
directamente desde la línea de comandos, y solo necesita un navegador para iniciar sesión con un código QR o un SMS.

## Cuándo encaja mejor otra herramienta

- **La app de MAX** ([web.max.ru](https://web.max.ru), escritorio, teléfono): necesitas llamadas, vídeos
  circulares, el aviso de que alguien está escribiendo y nada que configurar. La app es oficial, y las normas de MAX
  no tienen nada en su contra.
- **PyMax o tsmax**: estás escribiendo tu propio programa y necesitas un archivo junto con fotos y vídeos en un solo
  mensaje (tsmax) o vídeos circulares (PyMax).
- **Bot API y mcp-max-messenger**: estás creando un bot oficial para una organización, o necesitas un servidor MCP
  solo para un bot, que se arranca con un solo comando `npx`. Es la única vía oficial, y no incumple las normas de MAX.
  Ahí también tienes los comentarios bajo las publicaciones de un canal.

## De dónde salen las marcas

Las marcas de las demás herramientas salen de estos archivos, con versiones fijadas:
[PyMax](https://github.com/MaxApiTeam/PyMax/blob/53103f0/README.md),
[sus chats](https://github.com/MaxApiTeam/PyMax/blob/53103f0/src/pymax/api/chats/service.py) y
[mensajes](https://github.com/MaxApiTeam/PyMax/blob/53103f0/src/pymax/api/messages/service.py),
[tsmax](https://github.com/sibstark/tsmax/blob/fa3652f/README.md) y
[su API](https://github.com/sibstark/tsmax/tree/fa3652f/src/api),
[max-mcp](https://github.com/renosaza/max-mcp/blob/26eaf70/README.md) y
[sus herramientas](https://github.com/renosaza/max-mcp/blob/26eaf70/docs/TOOLS.md),
[mcp-max-messenger](https://github.com/woyaxnini/mcp-max-messenger/blob/4a3233a/README.md) y
[su licencia](https://github.com/woyaxnini/mcp-max-messenger/blob/4a3233a/LICENSE),
[Bot API](https://dev.max.ru/docs-api). Para `max`, cada marca se revisó con su código: todos los comandos están en
[commands.md](./commands.md).

Si `max` te sirve, empieza por la [instalación](./installation.md). Para conectar un agente sin terminal, consulta el
[servidor MCP](./mcp.md).
