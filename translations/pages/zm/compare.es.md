---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`zm` es una línea de comandos y un servidor MCP para las reuniones de Zoom de tu propia cuenta. Esta página lo pone
junto a las otras líneas de comandos, servidores MCP y scripts que usan una cuenta de Zoom a través de la API de Zoom,
para que veas cuál encaja con tu trabajo. Las marcas de `zm` salen de su código en `main`, revisado el 24 de octubre
de 2026. Las marcas de las demás herramientas salen de sus propios README y documentación, revisados el 24 de octubre
de 2026. No se inició sesión en ninguna ni se probó nada en vivo, y una herramienta puede hacer más de lo que dicen
sus páginas.

Las herramientas:

- **zm**: esta herramienta. Lee y archiva las reuniones de tu cuenta de Zoom, busca en lo que se dijo y programa
  reuniones. No se une a las llamadas.
- **[El servidor MCP de Zoom](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md)**: el
  servidor MCP que aloja Zoom, con 9 herramientas, del repositorio oficial [zoom/skills](https://github.com/zoom/skills)
  (actualizado el 20 de octubre de 2026).
- **[zoom-cli de rvben](https://github.com/rvben/zoom-cli)**: una línea de comandos en Rust para la API de Zoom:
  reuniones, grabaciones, usuarios, webinars e informes (actualizada el 19 de octubre de 2026).
- **[zoom-agent-cli](https://github.com/bcharleson/zoom-agent-cli)**: una línea de comandos y un servidor MCP para la
  API de Zoom, 61 comandos (actualizada el 8 de septiembre de 2026).
- **[zoom-recording-downloader](https://github.com/ricardorodrigues-ca/zoom-recording-downloader)**: un script en
  Python que descarga grabaciones en la nube, la herramienta con más estrellas de estas (161 estrellas, actualizada el
  14 de agosto de 2026).
- **[@sweatco/zoom-mcp](https://github.com/sweatco/zoom-mcp)**: un servidor MCP de la comunidad para transcripciones
  de reuniones y resúmenes de IA (actualizado el 23 de septiembre de 2026).

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación

## Funciones

| Tarea | zm | [Zoom MCP](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md) | [rvben](https://github.com/rvben/zoom-cli) | [zoom-agent-cli](https://github.com/bcharleson/zoom-agent-cli) | [Downloader](https://github.com/ricardorodrigues-ca/zoom-recording-downloader) | [@sweatco](https://github.com/sweatco/zoom-mcp) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Transcripciones** | | | | | | |
| Leer la transcripción de una reunión que organizaste tú | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#get_recording_resource) | [✅](https://github.com/rvben/zoom-cli#recordings) | [✅](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Leer la transcripción de una reunión que organizó otra persona | 🟡 | ➖ | ➖ | ➖ | ➖ | [🟡](https://github.com/sweatco/zoom-mcp#zoom-api-limitations) |
| **Buscar en lo que se dijo** | | | | | | |
| Encontrar las palabras dichas en una reunión | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | ➖ | [🟡](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [🟡](https://github.com/sweatco/zoom-mcp#features) |
| Encontrar una reunión por su tema, no por las palabras exactas | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | ➖ | ➖ | ➖ | ➖ |
| Encontrar otra forma de una palabra, en inglés, ruso y español | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Abrir las líneas exactas detrás de un resultado, con una referencia que sobrevive a una transcripción corregida | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Guardar una búsqueda y repetirla más tarde | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Encontrar una reunión** | | | | | | |
| Listar reuniones y encontrar una por su título | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#search_meetings) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#recordings-and-transcripts) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Encontrar las reuniones con una persona, por nombre o email | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Resúmenes** | | | | | | |
| Leer el resumen de IA que hizo Zoom | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#get_meeting_assets) | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Ver las reuniones desde la semana pasada con los próximos pasos y cuánto habló cada uno | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Programar reuniones** | | | | | | |
| Crear una reunión | ✅ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#current-live-tools) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [❌](https://github.com/sweatco/zoom-mcp#available-tools) |
| Cambiar o cancelar una reunión | ✅ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#current-live-tools) | [✅](https://github.com/rvben/zoom-cli#meetings) | [✅](https://github.com/bcharleson/zoom-agent-cli#meetings) | ➖ | [❌](https://github.com/sweatco/zoom-mcp#available-tools) |
| **Archivo** | | | | | | |
| Descargar las grabaciones en la nube de un rango de fechas en una sola ejecución | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#recordings_list) | [🟡](https://github.com/rvben/zoom-cli#recordings) | [🟡](https://github.com/bcharleson/zoom-agent-cli#recordings) | [✅](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | ❌ |
| Comprobar cada archivo descargado y reanudar una descarga interrumpida | ✅ | ➖ | ➖ | ➖ | [🟡](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#command-line-arguments-) | ➖ |
| Ejecutar el archivo cada día con un temporizador | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | | |
| Servidor MCP | ✅ | [✅](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md) | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#mcp-server) | ➖ | [✅](https://github.com/sweatco/zoom-mcp#available-tools) |
| Cada comando de la herramienta es también una herramienta MCP | 🟡 | ➖ | ➖ | [✅](https://github.com/bcharleson/zoom-agent-cli#mcp-server) | ➖ | ➖ |
| Limitar un agente a la lectura | ✅ | [🟡](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/references/tools.md#supported-scope-families-advertised-by-zoom-mcp) | ➖ | [🟡](https://github.com/bcharleson/zoom-agent-cli#add-scopes) | ➖ | ➖ |
| Permitir o denegar comandos sueltos a un agente, por perfil | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Preguntar o mostrar una vista previa antes de cambiar una reunión | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| El inicio de sesión se guarda solo en el llavero del sistema | ✅ | ➖ | [❌](https://github.com/rvben/zoom-cli#config-file) | [❌](https://github.com/bcharleson/zoom-agent-cli#interactive-login-local-cli) | [❌](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | [🟡](https://github.com/sweatco/zoom-mcp#privacy--data) |
| Instrucciones para agentes que usan un terminal | ✅ | [✅](https://github.com/zoom/skills) | ➖ | ➖ | ➖ | ➖ |
| **Configuración** | | | | | | |
| Empezar sin crear tu propia app de Zoom | ❌ | [❌](https://github.com/zoom/skills/blob/main/skills/zoom-mcp/SKILL.md) | [❌](https://github.com/rvben/zoom-cli#config-file) | [❌](https://github.com/bcharleson/zoom-agent-cli#create-the-app) | [❌](https://github.com/ricardorodrigues-ca/zoom-recording-downloader#usage-) | [🟡](https://github.com/sweatco/zoom-mcp#quick-start-basic-setup) |
| Varias cuentas de Zoom | ✅ | ➖ | [✅](https://github.com/rvben/zoom-cli#config-file) | ➖ | ➖ | ➖ |

| | zm | Zoom MCP | rvben | zoom-agent-cli | Downloader | @sweatco |
|---|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o posterior | ninguna: lo aloja Zoom | cargo, pip o un archivo de versión | npm o npx | clonarlo y después pip | npx |
| Licencia | Apache-2.0 | servicio cerrado, el repositorio de skills es MIT | MIT | MIT | MIT | MIT |

Notas sobre la columna de `zm`:

- **Tu propia app de Zoom.** Hoy cada usuario de `zm` crea una app de Zoom en el Zoom App Marketplace, o usa una que
  comparte un compañero. Todavía no hay una app compartida que funcione sin configurarla. Sigue
  [la guía de la app](./zoom-app.md). La app la gestiona el usuario: inicias sesión como tú mismo, y la app no necesita
  credenciales de un administrador. Los README de rvben, zoom-agent-cli y el descargador piden en su lugar una app
  Server-to-Server OAuth.
- **Reuniones que organizó otra persona.** `zm` lee las reuniones que tu cuenta organizó o programó. Para una reunión
  a la que solo asististe, pide el archivo de la transcripción al organizador y ejecuta `meetings import`.
- **Encontrar una reunión por su tema.** Necesita un modelo de embeddings que eliges tú. Sin él, la búsqueda compara
  palabras.
- **Resúmenes.** `zm` lee el resumen de IA que hizo Zoom. No hace un resumen propio.
- **Cada comando también es una herramienta MCP.** `zm` ofrece sus comandos a través de tres herramientas MCP. Unos
  pocos se quedan en el terminal: `watch`, `session start`, `meetings scheduled`, `meetings projects scan` y
  `upgrade`.
- **Límites y preguntas.** Un perfil puede denegar un comando o permitir solo los comandos que no cambian nada. Los
  cambios en reuniones de Zoom preguntan antes en un terminal. Por MCP no hay nadie para responder, así que un perfil
  que no debe cambiar Zoom pone `{"remote-meetings": "readonly"}`. Consulta [MCP y skills](./mcp.md).
- **Archivo diario.** El temporizador se instala solo en Linux. En otros sistemas puedes ver una vista previa.
- **Velocidad y coste frente a un agente de navegador.** `zm` llama a la API de Zoom y no abre ningún navegador. No se
  ha publicado ninguna medición frente a un agente de navegador, así que esta página no afirma nada.

## Cuándo encaja mejor otra herramienta

- **El servidor MCP de Zoom**: quieres que una app de IA pregunte a Zoom por reuniones, mensajes de Team Chat y Zoom
  Docs a la vez, sin instalar nada.
- **rvben o zoom-agent-cli**: administras una cuenta y necesitas usuarios, webinars, informes o, con zoom-agent-cli,
  Team Chat y el panel de calidad. `zm` no gestiona nada de eso.
- **zoom-recording-downloader**: quieres las grabaciones de todos los usuarios de una cuenta Business, o una copia en
  Google Drive.
- **@sweatco/zoom-mcp**: tu organización va a ejecutar su proxy, para que las personas puedan leer las reuniones a las
  que asistieron y no solo las que organizaron.

Si `zm` encaja, empieza por la [instalación](./installation.md). Para conectar un agente, consulta
[MCP y skills](./mcp.md).
