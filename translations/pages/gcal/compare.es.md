---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`gcal` es una línea de comandos y un servidor MCP para el Google Calendar de tu propia cuenta. Esta página lo pone
junto a las otras líneas de comandos, servidores MCP y conectores de asistentes que leen un Google Calendar, para que
veas cuál encaja con tu trabajo. Las marcas de `gcal` salen de su versión 0.3.0, sus comandos y su código, revisados
el 31 de octubre de 2026; se revisan de nuevo en cada versión. Las marcas de las demás herramientas salen de sus
propios README, documentación y código, revisados el 27 de octubre de 2026. No se inició sesión en ninguna ni se
probó nada en vivo, y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **gcal**: esta herramienta. Guarda en tu ordenador una copia de los calendarios que elijas, busca en ella sin
  internet y vincula a los asistentes con las personas que conoces de tus otras herramientas de WireCat. Inicia
  sesión solo con lectura; cuando permites la escritura, también añade, cambia, mueve y borra eventos y responde a
  invitaciones.
- **[gcalcli](https://github.com/insanum/gcalcli)**: la línea de comandos clásica de Google Calendar, en Python:
  agenda, vistas de semana y de mes, búsqueda, añadir y editar (3.778 estrellas, última versión el 4 de octubre de 2024).
- **[gog](https://github.com/openclaw/gogcli)**: una línea de comandos en Go para todo Google Workspace, pensada para
  agentes, con 30 comandos de calendario (8.535 estrellas, versión del 23 de octubre de 2026).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: un servidor MCP en Python para 12
  servicios de Google, 7 de sus herramientas para Calendar (3.417 estrellas, versión del 23 de octubre de 2026).
- **[google-calendar-mcp](https://github.com/nspady/google-calendar-mcp)**: el servidor MCP con más estrellas solo
  para Google Calendar, 13 herramientas (1.206 estrellas, versión del 28 de septiembre de 2026).
- **[El conector de Google Calendar de Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)**:
  integrado en Claude; no hay nada que instalar.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | gcal | [gcalcli](https://github.com/insanum/gcalcli) | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [google-calendar-mcp](https://github.com/nspady/google-calendar-mcp) | [Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Tu día y tu semana** | | | | | | |
| Las reuniones de hoy o de esta semana con un solo comando | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [🟡](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Escribir fechas con palabras, como «mañana a las 15» o «el viernes que viene» | 🟡 | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/utils.py) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/dates.md) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | n/a | n/a |
| Reuniones de todos tus calendarios y cuentas en una sola lista | 🟡 | [🟡](https://github.com/insanum/gcalcli#readme) | [🟡](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-calendar-events.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| Qué cambió desde una fecha: reuniones nuevas, movidas y canceladas | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | ➖ | ➖ |
| Encontrar reuniones que se solapan | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | ➖ | [✅](https://github.com/nspady/google-calendar-mcp#readme) | ➖ |
| **Encontrar una reunión** | | | | | | |
| Encontrar una reunión por su tema, no por sus palabras exactas | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Buscar en tus reuniones sin internet | ✅ | [❌](https://github.com/insanum/gcalcli/blob/main/gcalcli/gcal.py) | [❌](https://github.com/openclaw/gogcli/blob/main/docs/paths.md) | ❌ | ❌ | ❌ |
| Una sola búsqueda en reuniones, chats, correo y notas | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Personas** | | | | | | |
| Saber que un asistente es la persona con la que escribes en Telegram, WhatsApp o el correo | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Preparar la próxima reunión: quién viene, de qué hablasteis la última vez, documentos vinculados | 🟡 | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | ➖ |
| Ver cuándo están libres las personas | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| **Cambiar el calendario** | | | | | | |
| Añadir una reunión | ✅ | [✅](https://github.com/insanum/gcalcli/blob/main/gcalcli/argparsers.py) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Aceptar o rechazar una invitación | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/commands.generated.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/gcalendar/calendar_tools.py) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| **Agentes y seguridad** | | | | | | |
| Servidor MCP | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| Cada comando de calendario es también una herramienta MCP | ✅ | n/a | [❌](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [🟡](https://github.com/taylorwilsdon/google_workspace_mcp/blob/main/core/tool_tiers.yaml) | [✅](https://github.com/nspady/google-calendar-mcp/blob/main/src/tools/registry.ts) | n/a |
| Un agente no puede cambiar tu calendario si no lo permites | ✅ | n/a | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Indicas la cuenta cada vez; la herramienta nunca la elige por ti | ✅ | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | ➖ | [❌](https://github.com/nspady/google-calendar-mcp#readme) | n/a |
| El texto de una invitación se marca para el agente como datos, no instrucciones | ✅ | n/a | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ | ➖ |
| Instrucciones para agentes que usan una terminal | ✅ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/agent-skills.md) | ➖ | ➖ | n/a |
| **Configuración** | | | | | | |
| Empezar sin crear tu propio proyecto de Google Cloud | ❌ | [❌](https://github.com/insanum/gcalcli#initial-setup) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#quick-start) | [❌](https://github.com/nspady/google-calendar-mcp#google-cloud-setup) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |
| Funciona desde claude.ai en la web y en el móvil | 🟡 | ❌ | ❌ | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [🟡](https://github.com/nspady/google-calendar-mcp#readme) | [✅](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) |

| | gcal | gcalcli | gog | Workspace MCP | google-calendar-mcp | Claude |
|---|---|---|---|---|---|---|
| Instalar | npm, Node 22.16+ o 24+ | apt, brew o pip | brew o `go install` | `uvx workspace-mcp` | `npx @cocal/google-calendar-mcp` | nada: integrado en Claude |
| Licencia | Apache-2.0 | MIT | MIT | MIT | MIT | servicio cerrado |

Notas sobre la columna de `gcal`:

- **Solo lectura hasta que permitas más.** `gcal session start` pide a Google acceso de solo lectura. Con
  `--grant write` también añade, cambia, mueve y borra eventos y responde a invitaciones (`events create`, `update`,
  `move`, `delete`, `respond`). En un evento periódico, un cambio o un borrado afecta a una repetición, a toda la serie
  o a esta y todas las siguientes (`--following`). `events move --to-calendar` mueve un evento, con su id, a otro
  calendario de la misma cuenta. `--grant sharing` añade quién puede ver un calendario.
- **Qué cambió y qué se solapa.** `events list changed:<date>` muestra las reuniones guardadas por primera vez, movidas
  o canceladas desde esa fecha, con la hora anterior de cada una que se movió. Lee la copia de tu ordenador, así que
  ve lo que trajeron las sincronizaciones. `events list overlapping` muestra las reuniones que se solapan con otra a
  la que asistes.
- **Tu propia aplicación de Google.** Hoy cada usuario de `gcal` crea un proyecto de Google Cloud y un cliente OAuth,
  y entrega a `gcal` el archivo del cliente al iniciar sesión. Consulta la [instalación](./installation.md).
- **Fechas con palabras.** `events list` acepta `today`, `week`, y `from:` y `to:` con una fecha. No entiende «el
  viernes que viene».
- **Preparar una reunión.** `events show` da los asistentes, cada uno vinculado a la persona que conoces de otras
  herramientas, y los archivos de Drive de la reunión. Lo que hablasteis la última vez está en `memo`, no en `gcal`.
- **Todos los calendarios.** Una lista abarca los calendarios que elegiste sincronizar en un perfil. Cada cuenta de
  Google es su propio perfil, y una lista lee un perfil.
- **Buscar por significado.** Necesita un modelo que descargas una vez. Sin él, la búsqueda encuentra las palabras y
  sus otras formas.
- **Una búsqueda sobre todo.** Las reuniones van al almacén que comparten las demás herramientas de WireCat.
  `search all` en las otras herramientas de WireCat, como `tg`, las lee junto a chats, correo y notas. `gcal search`
  por sí mismo solo encuentra reuniones.
- **Cuándo están libres las personas.** `calendars busy` pregunta a Google cuándo están ocupados tus calendarios y
  otras personas, y con `--duration-minutes` da los huecos libres que comparten dentro del horario laboral.
- **Un agente no puede cambiar tu calendario si no lo permites.** Sin `--grant write`, el propio inicio de sesión es el
  límite. Después, añadir, cambiar, mover y responder se hacen sin preguntar; un borrado pregunta antes en una
  terminal. Por MCP no hay nadie a quien preguntar, así que un agente también borra eventos y, con `--grant sharing`,
  comparte el calendario sin preguntar. Enviar correos a los asistentes y borrar una serie entera siguen rechazados
  hasta que los permitas. Para que te pregunte o para impedir escrituras, pon los permisos del perfil en `ask`, `deny`
  o `readonly` (por ejemplo `permissions.events.create ask` o `permissions.api.calendar.acl deny`), o inicia el
  servidor con `mcp serve --permission` para endurecer una clave solo en ese servidor.
- **Texto de las invitaciones.** Cualquiera puede enviarte una invitación, así que su título, notas y lugar son
  palabras de otra persona. Cada respuesta con eventos lista esos campos en `untrusted`, y el servidor MCP y las
  instrucciones del agente le dicen que son datos, no instrucciones. El texto en sí no cambia.
- **Códigos de acceso.** Los códigos de acceso, PIN y contraseñas se quitan de cada respuesta, incluidos los comandos
  directos de `gcal api`: un enlace pierde su cadena de consulta y se descarta la línea de las notas que nombra un código.
- **Cada comando, una herramienta MCP.** A través de tres herramientas MCP: `gcal_tools_search`, `gcal_read` y
  `gcal_write`. Dos comandos quedan para ti en una terminal: `api call` y vaciar un calendario (`calendars.clear`).
- **claude.ai en la web.** `mcp serve --http` sirve la herramienta a Claude y ChatGPT en el navegador, tras un túnel
  que configuras tú, como Tailscale Funnel.
- **Velocidad y coste frente a un agente de navegador.** `gcal` llama a la API de Google y lee su propia copia; no
  abre ningún navegador. No hay ninguna medición publicada frente a un agente de navegador, así que esta página no
  afirma nada.

## Cuándo encaja mejor otra herramienta

- **gog**: trabajas con todo Google Workspace desde una sola línea de comandos, no solo con el calendario.
- **El conector de Claude**: quieres ayuda con tu calendario en Claude en la web o en el móvil, sin instalar nada ni
  crear un proyecto de Google Cloud.
- **Google Workspace MCP**: necesitas un servidor MCP para todo un equipo en Google Workspace, accesible por HTTP.
- **gcalcli**: quieres una cuadrícula de calendario en la terminal, o añadir un evento con una línea de texto como
  «comida con Ana mañana a las 13».

Si `gcal` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, consulta el
[uso](./usage.md).
