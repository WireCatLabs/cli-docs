---
title: "Comparación con otras herramientas"
---

Varias herramientas abiertas dan memoria a un agente de IA. La mayoría son motores de memoria: les envías
datos mediante una API. `memo` funciona al revés. Lee tus notas, correo y archivos de mensajería en un almacén
local donde busca tu agente. Esta página compara `memo` con siete herramientas para elegir según tu tarea.
Las marcas proceden de la documentación y el código de cada proyecto, revisados el 24 de octubre de 2026;
una herramienta puede hacer más de lo documentado. Cada marca de otra herramienta enlaza a su fuente.

Las herramientas:

- **memo** — esta herramienta: línea de comandos y servidor MCP sobre un almacén local de tus notas, correo y mensajes.
- **[Hindsight][hs]** — servidor de memoria para agentes con retain, recall y reflect, entidades y tiempo.
- **[mem0][m0]** — capa de memoria: biblioteca, servidor propio, plataforma alojada, CLI y MCP.
- **[Graphiti][gr]** — marco para grafos de conocimiento temporales, con servidor MCP de referencia. Zep es su nube de pago.
- **[Cognee][cg]** — plataforma de memoria que convierte documentos y conversaciones en un grafo de conocimiento.
- **[basic-memory][bm]** — notas Markdown como grafo de conocimiento, pensado para MCP.
- **[Obsidian][ob] con [mcp-obsidian][obm]** — aplicación de notas y servidor MCP que conecta mediante un plugin.
- **[Screenpipe][sp]** — memoria local de pantalla y audio, con MCP.

✅ sí · 🟡 parcialmente · ❌ no · ➖ no consta en su documentación

## Funciones

| Función | memo | Hindsight | mem0 | Graphiti | Cognee | basic-memory | Obsidian + MCP | Screenpipe |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Instalación** | | | | | | | | |
| Instalar sin Docker ni servidor | ✅ | 🟡 [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr-db] | ✅ [↗][cg] | ✅ [↗][bm] | 🟡 [↗][obm] | ✅ [↗][sp] |
| Funciona sin clave de LLM | ✅ | ❌ [↗][hs-core] | ➖ | ❌ [↗][gr-env] | ✅ [↗][cg-news] | ✅ [↗][bm] | ✅ [↗][obm] | ➖ |
| **Fuentes de tus propias cuentas** | | | | | | | | |
| Chats de Telegram, MAX y WhatsApp | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ➖ | ❌ [↗][bm] | ❌ [↗][obm] | 🟡 [↗][sp] |
| Correo Gmail e IMAP | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] | ❌ [↗][obm] | 🟡 [↗][sp] |
| Una carpeta de notas | ✅ | ✅ [↗][hs-int] | ➖ | ❌ [↗][gr] | 🟡 [↗][cg] | ✅ [↗][bm] | ✅ [↗][obm] | ❌ [↗][sp] |
| Transcripciones de reuniones | ✅ | ➖ | ➖ | ❌ [↗][gr] | ➖ | ❌ [↗][bm] | ❌ [↗][obm] | ✅ [↗][sp] |
| Documentos de Google Drive | 🟡 | ➖ | ➖ | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] | ❌ [↗][obm] | 🟡 [↗][sp] |
| **Búsqueda** | | | | | | | | |
| Palabras y significado juntos | ✅ | ✅ [↗][hs-core] | ✅ [↗][m0] | ✅ [↗][gr-mcp] | ✅ [↗][cg] | ✅ [↗][bm] | 🟡 [↗][obm] | ✅ [↗][sp] |
| Cada resultado cita su fuente | ✅ | ✅ [↗][hs-core] | ➖ | 🟡 [↗][gr-mcp] | ➖ | ✅ [↗][bm] | ✅ [↗][obm] | ➖ |
| Indica qué no buscó | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Conocimiento y memoria** | | | | | | | | |
| Extrae entidades y hechos del texto | ❌ | ✅ [↗][hs-core] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] | ❌ [↗][obm] | ➖ |
| Hechos con fechas de vigencia | 🟡 | ✅ [↗][hs-core] | ➖ | ✅ [↗][gr] | ➖ | ❌ [↗][bm] | ❌ [↗][obm] | ➖ |
| Personas, organizaciones, proyectos y vínculos | ✅ | ✅ [↗][hs-core] | 🟡 [↗][m0-price] | ✅ [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] | ✅ [↗][obm] | ❌ [↗][sp] |
| Leer todo el grafo de vínculos | 🟡 | ➖ | ➖ | ✅ [↗][gr-mcp] | ✅ [↗][cg-news] | ✅ [↗][bm] | ✅ [↗][obm] | ❌ [↗][sp] |
| Los recuerdos del agente esperan tu confirmación | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Tareas, agenda y recordatorios integrados | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Escritura y olvido** | | | | | | | | |
| El agente guarda un recuerdo mediante MCP | ✅ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ✅ [↗][gr-mcp] | ✅ [↗][cg-mcp] | ✅ [↗][bm] | ➖ | ➖ |
| El agente edita notas, tareas y etiquetas mediante MCP | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ [↗][bm] | ➖ | ➖ |
| Olvidar o eliminar un elemento | 🟡 | ➖ | ➖ | ✅ [↗][gr-mcp] | ✅ [↗][cg] | ➖ | ➖ | ➖ |
| **Integración con el agente** | | | | | | | | |
| MCP mediante stdio | ✅ | ❌ [↗][hs-mcp] | 🟡 [↗][m0-mcp] | ✅ [↗][gr-mcp] | ✅ [↗][cg-mcp] | ✅ [↗][bm] | ✅ [↗][obm] | ✅ [↗][sp] |
| MCP mediante HTTP | ❌ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ✅ [↗][gr-mcp] | ✅ [↗][cg] | ➖ | ❌ [↗][obm] | ➖ |
| Skill o plugin para agentes de programación | ✅ | ✅ [↗][hs] | ✅ [↗][m0-int] | ➖ | ➖ | ✅ [↗][bm] | ❌ [↗][obm] | ➖ |
| Lista de comandos en JSON para el agente | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Almacén local y límites** | | | | | | | | |
| Los datos permanecen en tu equipo por defecto | ✅ | 🟡 [↗][hs] | 🟡 [↗][m0-mcp] | ✅ [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] | ✅ [↗][obm] | ✅ [↗][sp] |
| Límites para el agente: permisos por comando y solo lectura | ✅ | ➖ | ➖ | ➖ | ➖ | 🟡 [↗][bm] | ➖ | ➖ |
| Registro de cada llamada del agente | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Interfaz visual | ❌ | ✅ [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] | ✅ [↗][obm] | ✅ [↗][sp] |
| **Cuentas y dispositivos** | | | | | | | | |
| Varias cuentas por fuente, elegidas por ti | ✅ | 🟡 [↗][hs-core] | 🟡 [↗][m0] | 🟡 [↗][gr-mcp] | ➖ | 🟡 [↗][bm] | 🟡 [↗][obm] | ➖ |
| Sincronización entre dispositivos | ❌ | ✅ [↗][hs-price] | ✅ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] | ✅ [↗][ob-price] | 🟡 [↗][sp-lic] |
| **Exportación y evidencia** | | | | | | | | |
| Exportar tus datos | 🟡 | ➖ | 🟡 [↗][m0] | ➖ | ➖ | ✅ [↗][bm] | ✅ [↗][obm] | ➖ |
| Prueba de memoria publicada | ❌ | ✅ [↗][hs-bench] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | ❌ [↗][bm] | ❌ [↗][obm] | ❌ [↗][sp] |

Notas sobre `memo`:

- **Fuentes.** Telegram, MAX, WhatsApp, reuniones de Zoom y Google Drive llegan al almacén mediante las
  herramientas hermanas `tg`, `max`, `wa`, `zm` y `drive`. `memo` lee ese almacén. Importa por sí mismo las
  carpetas de notas y el correo; este pasa por [Himalaya](https://github.com/pimalaya/himalaya). `search all`
  cubre mensajes, correo y notas; las reuniones tienen su propio `search meetings`.
- **La búsqueda por significado** usa un modelo local que descarga `memo models text download`. Sin él funciona la búsqueda por palabras.
- **Sin clave de LLM.** La sincronización y búsqueda no llaman a un modelo. `ask --analyze` llama al modelo que configures y solo si lo pides.
- **MCP.** `memo mcp` ofrece los comandos como herramientas, incluidas escrituras, excepto `mcp`, `upgrade`,
  `skill install`, `auto start` y `auto stop`. Los permisos guardados asignan a cada comando `deny`, `readonly`,
  `ask` o `allow`. `MEMO_READ_ONLY=1` oculta las herramientas de escritura. Los recuerdos, hechos y acciones
  añadidos por el agente se guardan como propuestos hasta que los confirmas.
- **Conocimiento.** `memo` guarda mensajes y los vínculos que tú o tu agente registráis. No extrae entidades
  ni hechos del texto por sí mismo. `facts add` recibe una fecha y `facts reverse` pone fin a una decisión;
  se pueden listar vínculos, pero no hay vista gráfica.
- **Prueba de calidad.** No hay resultados publicados de una prueba de memoria de `memo`.

## Instalación y licencia

| | memo | [Hindsight][hs] | [mem0][m0] | [Graphiti][gr] | [Cognee][cg] | [basic-memory][bm] | [Obsidian][ob] + [mcp-obsidian][obm] | [Screenpipe][sp] |
|---|---|---|---|---|---|---|---|---|
| Instalación | npm, pnpm, Bun | Docker, pip o integrado | biblioteca, servidor propio, plataforma alojada, CLI | requiere Neo4j o FalkorDB | pip | uv | aplicación, plugin y servidor | aplicación |
| Licencia | Apache-2.0 | MIT | Apache-2.0 | Apache-2.0 | Apache-2.0 | AGPL-3.0 | aplicación gratis; plugin MIT | licencia comercial con código disponible |
| Precio | gratis | servidor propio gratis; [nube por uso][hs-price] | [plan Hobby gratis, planes de pago][m0-price] | aporta tu base de datos; Zep es de pago | Cognee Cloud es opcional | nube desde $15 al mes | Sync desde $4 al mes ([precios][ob-price]) | [planes Free, Basic y Business][sp-lic] |

## Cuándo conviene otra herramienta

- **Hindsight, mem0, Graphiti o Cognee** — quieres que un modelo extraiga entidades, hechos y tiempo del texto,
  o un grafo de conocimiento, y aportas los datos mediante una API.
- **Hindsight o mem0** — quieres un servicio alojado, un panel y una prueba de memoria publicada.
- **basic-memory** — tus conocimientos son Markdown escrito con un agente y quieres sincronización en la nube entre dispositivos.
- **Obsidian con mcp-obsidian** — trabajas en Obsidian y quieres mantener su interfaz con un agente encima.
- **Screenpipe** — quieres recordar lo visto en pantalla o dicho en voz alta, en vez del contenido de tus cuentas.
- **Cualquier herramienta con interfaz o sincronización entre dispositivos** — `memo` solo ofrece terminal y agente, con un almacén por ordenador.

Si `memo` encaja, empieza por [instalación](./installation.md); para conectar un agente sin terminal,
consulta [el servidor MCP](./mcp.md).

[hs]: https://github.com/vectorize-io/hindsight
[hs-core]: https://github.com/vectorize-io/hindsight#core-concepts
[hs-mcp]: https://hindsight.vectorize.io/developer/mcp-server
[hs-int]: https://hindsight.vectorize.io/sdks/integrations/obsidian
[hs-bench]: https://benchmarks.hindsight.vectorize.io/
[hs-price]: https://vectorize.io/pricing
[m0]: https://github.com/mem0ai/mem0
[m0-mcp]: https://docs.mem0.ai/platform/mem0-mcp
[m0-int]: https://github.com/mem0ai/mem0/tree/main/integrations
[m0-price]: https://mem0.ai/pricing
[gr]: https://github.com/getzep/graphiti
[gr-db]: https://github.com/getzep/graphiti#requirements
[gr-env]: https://github.com/getzep/graphiti#optional-environment-variables
[gr-mcp]: https://github.com/getzep/graphiti/tree/main/mcp_server
[cg]: https://github.com/topoteretes/cognee
[cg-news]: https://github.com/topoteretes/cognee#latest-news
[cg-mcp]: https://docs.cognee.ai/cognee-mcp/mcp-overview
[bm]: https://github.com/basicmachines-co/basic-memory
[ob]: https://obsidian.md
[ob-price]: https://obsidian.md/pricing
[obm]: https://github.com/MarkusPfundstein/mcp-obsidian
[sp]: https://github.com/screenpipe/screenpipe
[sp-lic]: https://github.com/screenpipe/screenpipe#pricing
