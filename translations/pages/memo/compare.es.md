---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="memo-mail-compared-with-email-tools" />
<a id="where-another-tool-fits-better" />
<a id="install-and-licence" />
<a id="when-another-tool-fits-better" />

Varias herramientas abiertas dan memoria a un agente de IA. La mayoría son motores de memoria: tú les envías datos y
un modelo decide qué recordar. `memo` funciona al revés. Lee tus propias notas, tu correo y tus archivos de mensajería
en un solo almacén local, y tu agente busca en ese almacén y guarda lo que tú confirmas. Esta página pone `memo` junto
a cinco de estas herramientas para que elijas la que encaja con tu trabajo. Dice qué hace cada herramienta. No dice
cuál encuentra mejores respuestas, porque nadie lo ha medido aquí.

Las marcas salen de la propia documentación y el código de cada proyecto, revisados el 24 de octubre de 2026. Una
herramienta puede hacer más de lo que dice su documentación. Cada marca de otra herramienta enlaza a la página de la
que sale. Las marcas de `memo` se revisaron con la versión 0.131.66 el 8 de noviembre de 2026.

Las herramientas:

- **memo**: esta herramienta. Una línea de comandos y un servidor MCP sobre un almacén local de tus notas, tu correo y
  tus mensajes.
- **[Hindsight][hs]**: un servidor de memoria para agentes. Un agente guarda texto y hace preguntas, y un modelo
  extrae los hechos.
- **[mem0][m0]**: una capa de memoria para aplicaciones. Una biblioteca, un servidor que alojas tú y una plataforma
  alojada.
- **[Graphiti][gr]**: un marco de trabajo que construye un grafo de conocimiento con hechos que cambian con el tiempo.
  Zep es su nube de pago.
- **[Cognee][cg]**: una plataforma de memoria que convierte documentos y conversaciones en un grafo de conocimiento.
- **[basic-memory][bm]**: notas Markdown que un agente lee y escribe a través de MCP.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación

## Funciones

| Función | memo | Hindsight | mem0 | Graphiti | Cognee | basic-memory |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Encontrar lo que ya tienes** | | | | | | |
| Lee por sí mismo tus chats de Telegram, MAX y WhatsApp | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ➖ | ❌ [↗][bm] |
| Lee una carpeta de notas | ✅ | ✅ [↗][hs-int] | ➖ | ❌ [↗][gr] | 🟡 [↗][cg] | ✅ [↗][bm] |
| Lee transcripciones de reuniones | ✅ | ➖ | ➖ | ❌ [↗][gr] | ➖ | ❌ [↗][bm] |
| Lee documentos de Google Drive | 🟡 | ➖ | ➖ | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] |
| Cada resultado nombra su fuente | ✅ | ✅ [↗][hs-core] | ➖ | 🟡 [↗][gr-mcp] | ➖ | ✅ [↗][bm] |
| **Correo** | | | | | | |
| Sincronizar Gmail e IMAP en una copia local | ✅ | ❌ [↗][hs-core] | ❌ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg-news] | ❌ [↗][bm] |
| Buscar en el correo sin internet, junto con chats y notas | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Elegir qué importar por remitente, tipo de correo o tus filtros de Gmail | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Encontrar remitentes probables de spam o fraude | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Importar años de correo antiguo desde un archivo de Google Takeout | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Conocer a una persona o un proyecto** | | | | | | |
| Personas, organizaciones y proyectos con relaciones entre ellos | ✅ | ✅ [↗][hs-core] | 🟡 [↗][m0-price] | ✅ [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] |
| Tareas, agenda y recordatorios integrados | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Contratos, facturas, pagos y líneas del banco, con el dinero esperando tu revisión | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Recordar** | | | | | | |
| Un agente guarda un hecho o un recuerdo a través de MCP | ✅ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ✅ [↗][gr-mcp] | ✅ [↗][cg-mcp] | ✅ [↗][bm] |
| Los hechos y recuerdos se encuentran en conversaciones y textos sin que nadie los guarde | 🟡 | ✅ [↗][hs-core] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] |
| Un hecho que cambió se sustituye y el antiguo se conserva con sus fechas | 🟡 | 🟡 [↗][hs-core] | 🟡 [↗][m0] | ✅ [↗][gr] | ➖ | ➖ |
| **Agentes y seguridad** | | | | | | |
| Un agente puede leer pero no escribir hasta que lo permitas | ✅ | ➖ | ➖ | ➖ | ➖ | 🟡 [↗][bm] |
| Permiso por comando: denegar, solo lectura, preguntar o permitir | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Lo que guarda un agente espera hasta que lo confirmes | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Un registro de cada llamada de un agente | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Un agente edita notas, tareas y etiquetas a través de MCP | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ [↗][bm] |
| Skill o plugin para agentes de programación | ✅ | ✅ [↗][hs] | ✅ [↗][m0] | ➖ | ✅ [↗][cg] | ✅ [↗][bm] |
| **Configuración** | | | | | | |
| Se instala sin Docker ni servidor de base de datos | ✅ | 🟡 [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr-db] | ✅ [↗][cg] | ✅ [↗][bm] |
| Funciona sin clave de LLM | ✅ | ❌ [↗][hs-core] | ➖ | ❌ [↗][gr-env] | ✅ [↗][cg-news] | ✅ [↗][bm] |
| MCP por stdio, iniciado por la aplicación de tu agente | ✅ | ❌ [↗][hs-mcp] | 🟡 [↗][m0-mcp] | ➖ | ➖ | ✅ [↗][bm] |
| MCP por HTTP, para un servidor o un agente remoto | ✅ | ✅ [↗][hs-mcp] | ✅ [↗][m0-mcp] | ➖ | ➖ | ✅ [↗][bm] |
| Nube alojada, para tener la misma memoria desde cualquier dispositivo | ❌ | ✅ [↗][hs-price] | ✅ [↗][m0] | 🟡 [↗][gr] | ✅ [↗][cg] | ✅ [↗][bm] |
| Una interfaz visual | ❌ | ✅ [↗][hs] | ✅ [↗][m0] | ❌ [↗][gr] | ✅ [↗][cg] | 🟡 [↗][bm] |
| Bibliotecas para crear tu propia aplicación | ❌ | ✅ [↗][hs] | ✅ [↗][m0] | ✅ [↗][gr] | ✅ [↗][cg] | ➖ |
| Publica una puntuación en una prueba de memoria | ❌ | ✅ [↗][hs-bench] | ✅ [↗][m0] | ➖ | ✅ [↗][cg] | ➖ |

Aclaraciones sobre `memo`:

- **Fuentes.** Telegram, MAX, WhatsApp, las reuniones de Zoom y Google Drive llegan al almacén a través de las
  herramientas hermanas `tg`, `max`, `wa`, `zm` y `drive`. `memo` lee ese almacén. El programa
  [mail](../mail/index.md) llena el almacén con tu buzón y `memo` busca en él. Una importación antigua a través de
  [Himalaya](https://github.com/pimalaya/himalaya) todavía funciona y se eliminará. `search all` cubre mensajes,
  correo, notas, eventos de calendario y llamadas telefónicas, tratos y leads, y datos de negocio. Las reuniones tienen
  su propio `search meetings`.
- **Búsqueda.** Las seis herramientas buscan por palabras y por significado. Esta página no las clasifica. En `memo`,
  la búsqueda por significado usa un modelo local que descarga `memo models download`. Sin él, la búsqueda por
  palabras sigue funcionando.
- **Sin clave de LLM.** La sincronización y la búsqueda no necesitan ninguna clave de API de un modelo de lenguaje
  remoto. La búsqueda por significado usa un modelo local. `answers create --analyze` llama a un modelo que tú
  configuras, y solo si se lo pides.
- **MCP.** `memo mcp serve` usa stdio para las aplicaciones locales. `memo mcp serve --http` sirve los mismos comandos
  a través del túnel HTTPS del propietario y del inicio de sesión OAuth con código de acceso
  ([configuración remota](./remote.md)). Ofrece `memo_tools_search`, `memo_read` y `memo_write`. Al buscar comandos,
  los comandos bloqueados siguen apareciendo con su disponibilidad actual y el motivo. Quedan solo para la CLI `mcp`,
  `upgrade`, `skill install`, `jobs start` y `jobs stop`. Los permisos guardados usan `deny`, `readonly`, `ask` o
  `allow`. `MEMO_READ_ONLY=1` rechaza las escrituras. Los recuerdos, hechos y acciones propuestas de un agente esperan
  revisión.
- **Seguridad.** Los permisos de la configuración ponen cada comando en `deny`, `readonly`, `ask` o `allow`.
  Con `MEMO_READ_ONLY=1`, los comandos de escritura se siguen viendo, pero sus llamadas se rechazan. Los recuerdos,
  hechos y acciones que añade un agente se guardan como propuestos hasta que los confirmas. Las decisiones sobre
  propuestas de un proyecto son la excepción: un agente puede tomarlas, con un motivo registrado, hasta que pongas
  `agent_decisions` en `false`.
- **Conocimiento.** `memo` guarda mensajes y los hechos y relaciones que registras tú o tu agente, cada uno con el
  mensaje, la nota o la reunión que lo muestra. Solo encuentra hechos en un texto cuando ejecutas
  `memo sources suggest` sobre una fuente, y tú confirmas cada hecho. Un hecho lleva la fecha en que ocurrió, y una
  decisión se puede marcar como sustituta de otra anterior. Cuando cambia la fuente de un hecho o de un recuerdo,
  `memo` abre una revisión para ti y no cambia nada hasta que decidas.
- **Plataformas.** Probado solo en Linux. macOS y Windows aún no están probados.
- **Prueba de memoria.** No hay ningún resultado publicado de una prueba de memoria para `memo`. Las puntuaciones
  que publican las otras herramientas salen de sus propias pruebas con sus propios datos y no se pueden comparar entre
  sí.

## memo mail comparado con herramientas de correo

El correo es una herramienta propia dentro de `memo`. Las herramientas de memoria de arriba no hacen este trabajo,
así que esta tabla pone `memo` junto a herramientas que la gente usa para el correo. `memo` busca y lee el correo,
pero no lo cambia ni lo envía. Eso lo hace el programa [mail](../mail/index.md). Las marcas salen de la documentación
de cada proyecto, revisada el 24 de octubre de 2026.

- **[Himalaya][hm]**: una línea de comandos de correo para IMAP, SMTP, JMAP, Gmail y otros. `memo` todavía puede
  llamarla para una importación antigua.
- **[gog][gg]**: una sola línea de comandos para los servicios de Google. Sus comandos `gmail` leen, envían y
  gestionan Gmail.
- **[Google Workspace MCP][ws]**: un servidor MCP mantenido para los servicios de Google, con herramientas de Gmail.
  El servidor MCP de Gmail más conocido está archivado, así que no se compara.
- **[notmuch][nm]**: búsqueda rápida y etiquetas sobre el correo que ya tienes en una carpeta local.

| Función | memo | Himalaya | gog (Gmail) | Google Workspace MCP | notmuch |
|---|:-:|:-:|:-:|:-:|:-:|
| Leer Gmail | ✅ | ✅ [↗][hm-gmail] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ❌ [↗][nm] |
| Leer otro correo IMAP, como Fastmail | ✅ | ✅ [↗][hm-gmail] | ❌ [↗][gg] | ❌ [↗][ws] | ❌ [↗][nm] |
| Guardar una copia local y buscar en ella sin internet | ✅ | 🟡 [↗][hm] | ➖ | ➖ | ✅ [↗][nm] |
| Buscar en el correo junto con chats y notas | ✅ | ➖ | ➖ | ➖ | ➖ |
| Leer el texto dentro de los adjuntos, como los PDF | ✅ | ➖ | ➖ | ➖ | ➖ |
| Encontrar remitentes probables de spam o fraude | ✅ | ➖ | ➖ | ➖ | ➖ |
| Crear filtros de Gmail | ❌ | ❌ [↗][hm] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ➖ |
| Poner etiquetas de Gmail o archivar correo en Gmail | ❌ | ➖ | ✅ [↗][gg-mail] | ✅ [↗][ws] | ➖ |
| Escribir y enviar correo | ❌ | ✅ [↗][hm] | ✅ [↗][gg-mail] | ✅ [↗][ws] | ❌ [↗][nm] |
| Leer un archivo mbox de Google Takeout | ✅ | 🟡 [↗][hm] | ➖ | ➖ | 🟡 [↗][nm] |
| Servidor MCP | ✅ | ➖ | ✅ [↗][gg-mcp] | ✅ [↗][ws] | ➖ |
| Un agente puede leer el correo pero no cambiarlo | ✅ | ➖ | ✅ [↗][gg] | ✅ [↗][ws] | ➖ |

Aclaraciones sobre `memo`:

- **Himalaya.** `memo` ya no la necesita. El correo llega al almacén a través del programa `mail`, y la importación
  antigua con Himalaya está de salida. `memo` no cambia ningún buzón. Las reglas de correo, la limpieza de Gmail y la
  restauración son comandos de `mail`. Los antiguos `memo mail delete` y `memo mail restore` solo indican el comando
  de `mail` que hay que ejecutar.
- **Filtros.** `memo` no crea filtros en Gmail. Una exportación de filtros de Gmail se convierte en reglas de qué
  importar con `mail rules import`. `memo sync` sigue esas reglas.
- **Envío.** `memo` nunca envía correo. No tiene código para hacerlo.
- **Marcas de Himalaya.** Las marcas parciales significan lo siguiente. Una carpeta Maildir se puede leer y listar,
  pero Himalaya no crea ningún índice de búsqueda. mbox es un formato compatible, pero Takeout no se nombra. Himalaya
  también gestiona filtros Sieve en el servidor, que no son filtros de Gmail.
- **Marcas de notmuch.** Lee el correo que ya tienes en formato Maildir, así que necesita al lado una herramienta de
  sincronización como `offlineimap`, y primero convierte un archivo mbox a Maildir.

### Dónde encaja mejor otra herramienta

- **Quieres que un agente escriba, responda o envíe correo.** Himalaya, gog y Google Workspace MCP envían correo.
  `memo` solo lo lee.
- **Gestionas el propio Gmail: etiquetas, archivo, filtros.** gog y Google Workspace MCP cambian los ajustes propios de
  Gmail. `memo` no cambia un buzón. El programa `mail` mueve el correo a la papelera con opción de deshacer y mantiene
  carpetas y reglas.
- **Vives en un cliente de correo y quieres una búsqueda rápida por etiquetas sin otras herramientas.** notmuch está
  hecho para eso, y encima de él funciona un cliente de editor de texto o de terminal.

## Instalación y licencia

| | memo | [Hindsight][hs] | [mem0][m0] | [Graphiti][gr] | [Cognee][cg] | [basic-memory][bm] |
|---|---|---|---|---|---|---|
| Instalación | npm, pnpm, Bun | Docker, pip o integrado | biblioteca, servidor propio, plataforma alojada, CLI | necesita Neo4j o FalkorDB | pip | uv |
| Licencia | Apache-2.0 | MIT | Apache-2.0 | Apache-2.0 | Apache-2.0 | AGPL-3.0 |
| Precio | gratis | gratis en tu servidor, [Cloud de pago por uso][hs-price] | [plan Hobby gratis, planes de pago][m0-price] | usas tu propia base de datos, Zep es de pago | Cognee Cloud es opcional | Cloud desde $15 al mes |

## Cuándo encaja mejor otra herramienta

- **Quieres que la memoria se construya sola a partir de las conversaciones.** Hindsight, mem0, Graphiti y Cognee
  usan un modelo para extraer hechos y entidades de lo que les das. `memo` guarda solo lo que registras tú o tu agente
  y tú confirmas.
- **Necesitas que los hechos que cambian con el tiempo se gestionen por ti.** Graphiti marca un hecho antiguo como ya
  no válido cuando llega información nueva, y conserva los dos. `memo` registra fechas y decisiones sustituidas, pero
  las marcas tú o tu agente.
- **Construyes un producto para otras personas o necesitas un servicio alojado.** Hindsight, mem0 y Cognee tienen
  bibliotecas, una nube, un panel y MCP por HTTP. mem0, Hindsight y Cognee publican puntuaciones de pruebas. `memo` es
  una herramienta para el ordenador de una sola persona, con una terminal, MCP local por stdio y MCP por HTTP con
  autenticación a través de tu túnel.
- **Vives en notas Markdown y quieres sincronización y una aplicación móvil.** La nube de basic-memory sincroniza las
  notas entre dispositivos. `memo` tiene un almacén por ordenador y ninguna interfaz propia.

Si `memo` encaja, empieza por la [instalación](./installation.md). Para conectar un agente sin terminal,
consulta [el servidor MCP](./mcp.md).

[hs]: https://github.com/vectorize-io/hindsight
[hs-core]: https://github.com/vectorize-io/hindsight#core-concepts
[hs-mcp]: https://hindsight.vectorize.io/developer/mcp-server
[hs-int]: https://hindsight.vectorize.io/sdks/integrations/obsidian
[hs-bench]: https://benchmarks.hindsight.vectorize.io/
[hs-price]: https://vectorize.io/pricing
[m0]: https://github.com/mem0ai/mem0
[m0-mcp]: https://docs.mem0.ai/platform/mem0-mcp
[m0-price]: https://mem0.ai/pricing
[gr]: https://github.com/getzep/graphiti
[gr-db]: https://github.com/getzep/graphiti#requirements
[gr-env]: https://github.com/getzep/graphiti#optional-environment-variables
[gr-mcp]: https://github.com/getzep/graphiti/tree/main/mcp_server
[cg]: https://github.com/topoteretes/cognee
[cg-news]: https://github.com/topoteretes/cognee#latest-news
[cg-mcp]: https://docs.cognee.ai/cognee-mcp/mcp-overview
[bm]: https://github.com/basicmachines-co/basic-memory
[hm]: https://github.com/pimalaya/himalaya
[hm-gmail]: https://github.com/pimalaya/himalaya#gmail
[gg]: https://github.com/openclaw/gogcli
[gg-mail]: https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md
[gg-mcp]: https://github.com/openclaw/gogcli/blob/main/docs/mcp.md
[ws]: https://github.com/taylorwilsdon/google_workspace_mcp
[nm]: https://notmuchmail.org/
