---
title: "Comparado con otras herramientas"
---

<a id="what-each-tool-does" />
<a id="if-google-refuses-the-sign-in" />
<a id="where-another-tool-fits-better" />
<a id="compared-with-an-agent-driving-the-drive-web-page" />
<a id="install-and-licence" />
<a id="how-each-mark-was-checked" />
<a id="features" />
<a id="when-another-tool-fits-better" />

Elige una herramienta según el trabajo que quieres hacer. Esta página reúne los trabajos que la gente le pide a una
herramienta de Google Drive y muestra qué herramienta hace cada uno. Revisado el 24 de octubre de 2026, con `drive` y
la propia documentación de cada proyecto. Una herramienta puede hacer más de lo que dice su documentación. Esas
celdas llevan ➖.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

Las herramientas:

- **drive**: esta herramienta. Una línea de comandos y un servidor MCP para los Documentos, las Hojas de cálculo y
  los archivos de Google en las carpetas que elijas. Los guarda en una copia local en la que puedes buscar, poner
  etiquetas y escribir notas.
- **[gog](https://github.com/openclaw/gogcli)**: una línea de comandos para todo Google Workspace, con muchos comandos
  para editar Documentos y Hojas de cálculo y un servidor MCP.
- **[Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: un servidor MCP para doce servicios de
  Google. Lo ejecutas en tu ordenador o lo alojas para un equipo.
- **[rclone](https://github.com/rclone/rclone)**: copia y sincroniza archivos entre tu ordenador y Google Drive, y
  también muchos otros servicios de almacenamiento.
- **[El conector de Google Drive de Claude](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)**:
  integrado en Claude en la web y en la aplicación de escritorio, con conectores aparte para editar Documentos, Hojas
  de cálculo y Presentaciones.

[gdrive](https://github.com/glotlabs/gdrive) no está en la tabla. Su README dice «only the most basic
functionality is implemented».

## Qué hace cada herramienta

| # | Trabajo | drive | gog | Workspace MCP | rclone | Claude |
|---|---|:-:|:-:|:-:|:-:|:-:|
| | **Encontrar un documento por lo que dice** | | | | | |
| 1 | Encontrar un documento por las palabras que contiene | ✅ | ✅ | ✅ | ➖ | ✅ |
| 2 | Buscar por el significado, no solo por las palabras exactas, y una imagen por lo que muestra | ✅ | ➖ | ➖ | ➖ | ➖ |
| 3 | Buscar en tus documentos sin internet | ✅ | ➖ | ➖ | ➖ | ➖ |
| | **Leer un documento como texto** | | | | | |
| 4 | Leer un Documento o una Hoja de cálculo de Google como texto | ✅ | ✅ | ✅ | 🟡 | ✅ |
| 5 | Leer un archivo PDF, Word o Excel como texto | ✅ | ➖ | 🟡 | ➖ | ✅ |
| | **Ver quién cambió qué** | | | | | |
| 6 | Ver la actividad reciente de un documento: quién hizo qué y cuándo | ✅¹ | ✅ | ➖ | ➖ | 🟡 |
| | **Mantener una copia local al día** | | | | | |
| 7 | Mantener al día una copia local de las carpetas elegidas | 🟡² | ➖ | ➖ | ✅ | ➖ |
| 8 | Mantener archivos locales Markdown y CSV al mismo ritmo que los Documentos y las Hojas de cálculo, en los dos sentidos, y mostrar un conflicto parte por parte | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 9 | Recoger los cambios en cuanto ocurren | 🟡³ | 🟡 | ➖ | ➖ | ➖ |
| | **Descargar, exportar, subir** | | | | | |
| 10 | Descargar un archivo | ✅ | ✅ | ✅ | ✅ | ➖ |
| 11 | Exportar un Documento o una Hoja de cálculo a PDF, Word, Excel o CSV | ✅ | ✅ | 🟡 | ✅ | ➖ |
| 12 | Convertir Markdown en un Documento de Google con formato | ✅ | ✅ | ✅ | ➖ | ➖ |
| | **Etiquetas y notas en documentos** | | | | | |
| 13 | Poner tus propias etiquetas a los documentos | ✅ | 🟡 | ➖ | 🟡 | ➖ |
| 14 | Guardar notas y hechos citados junto a un documento | ✅ | ➖ | ➖ | ➖ | ➖ |
| 15 | Encontrar el chat donde se compartió un documento | ✅⁴ | ➖ | ➖ | ➖ | ➖ |
| | **Agentes y seguridad** | | | | | |
| 16 | Servidor MCP para un agente | ✅ | ✅ | ✅ | ❌ | n/a |
| 17 | Un agente solo lee hasta que permites cambios | ✅ | ✅ | 🟡 | 🟡 | 🟡 |
| 18 | Permitir o denegar los comandos uno a uno | ✅ | ✅ | ✅ | ➖ | 🟡 |
| 19 | Ver un cambio antes de que se haga | ✅ | ✅ | ➖ | ✅ | ➖ |
| 20 | El texto obtenido se marca para el agente como datos, no como instrucciones | 🟡 | ✅ | ➖ | ➖ | ➖ |
| 21 | Tus documentos se quedan en tu ordenador | ✅ | ✅ | 🟡 | ✅ | ❌ |
| | **Configuración** | | | | | |
| 22 | Iniciar sesión sin crear tu propio proyecto de Google Cloud | 🟡⁵ | ❌ | ❌ | 🟡 | ✅ |
| 23 | Usarlo desde Claude o ChatGPT en la web y en el móvil | ✅ | ❌ | ✅ | ❌ | ✅ |

¹ Necesita el permiso opcional de actividad al iniciar sesión. Muestra lo que devuelve el registro de actividad de
Google, no un historial completo de ediciones.

² `drive` guarda instantáneas de texto de Documentos, Hojas de cálculo y archivos PDF y Word. Los archivos originales
se quedan en Google. rclone copia los propios archivos.

³ `mirrors watch` mantiene sincronizadas las carpetas espejo mientras el comando está en marcha. No es un servicio en
segundo plano.

⁴ Necesita una herramienta de mensajería de la misma familia (Telegram o MAX) con el mensaje ya guardado en tu
ordenador.

⁵ Consulta la sección siguiente.

## Si Google rechaza el inicio de sesión

Hacer pública una aplicación compartida de Google para Drive es complicado, así que Google puede rechazar el inicio de
sesión con la aplicación de WireCat. En su lugar, puedes iniciar sesión con tu propia aplicación de Google.
Los pasos y los enlaces a las páginas de Google están en [instalación](./installation.md#google-shows-an-unverified-app-warning).

## Cuándo encaja mejor otra herramienta

- **Editar Documentos y Hojas de cálculo en detalle**: gog o Workspace MCP. Tienen comandos listos para tablas,
  encabezados, estilos, gráficos y formato condicional. `drive` cubre Markdown, celdas y el formato básico de las
  hojas, y las demás ediciones pasan por llamadas directas a la API.
- **Hacer copias de seguridad o mover carpetas grandes y archivos que no son Documentos**: rclone. Copia los propios
  archivos, los mantiene sincronizados en los dos sentidos y funciona con muchos servicios de almacenamiento. `drive`
  guarda texto y no copia los originales.
- **Claude o ChatGPT en la web o en el móvil, sin instalar nada**: el conector de Claude, o Workspace MCP ejecutado
  como servidor alojado. `drive` funciona en tu ordenador o servidor y se conecta a través de tu
  [túnel HTTPS](./remote.md).
- **Gmail y Calendar en la misma herramienta**: gog o Workspace MCP. `drive` solo trabaja con Drive, Documentos y
  Hojas de cálculo.

## Comparado con un agente que maneja la página web de Drive

Un agente de navegador abre Drive en un navegador y hace clic. `drive` y las demás herramientas de esta página llaman
a la API de Google. Esta página no afirma cuál es más rápido, más barato o más fiable, porque no hay ninguna medición
publicada.

## Instalación y licencia

| | drive | gog | Workspace MCP | rclone | Claude |
|---|---|---|---|---|---|
| Instalación | npm (Node 22.16+ en la serie 22.x, o Node 24+) | Homebrew, Go, Docker, binarios | uv, Docker, Helm | un solo binario, la mayoría de los gestores de paquetes | no hay nada que instalar |
| Licencia | Apache-2.0 | MIT | MIT | MIT | servicio |

Si `drive` encaja, empieza por la [instalación](./installation.md). Para conectar un agente, consulta
[el servidor MCP](./recipes.md#use-a-local-mcp-client).

## Cómo se comprobó cada marca

Las marcas de `drive` se comprobaron en el [código revisado](https://github.com/WireCatLabs/drive-cli/tree/v0.27.0):
ejecutando una compilación con una carpeta personal vacía (`drive commands --json` y
`drive <profile> mcp --tools --json`, que listan los comandos y los 105 que MCP ofrece a un perfil sin sesión
iniciada) y con las páginas [guía de uso](./usage.md), [guía de búsqueda](./search.md),
[guía de espejado](https://github.com/WireCatLabs/drive-cli/blob/main/docs/mirrors.md),
[configuración](./configuration.md) y [seguridad](./security.md). Donde una marca es un límite (🟡 o ❌), la sección
anterior explica cuál es ese límite. El MCP remoto usa el servidor HTTP protegido y el inicio de sesión con código de
acceso de la [guía de conexión remota](./remote.md). Necesita tu propio servidor en marcha y tu propio túnel.

Las marcas de las demás herramientas salen de sus propias páginas. Una búsqueda que no encuentra nada en esas páginas
da ➖, nunca ❌, salvo cuando una lista de comandos está completa.

- **gog**
  ([README](https://github.com/openclaw/gogcli/blob/main/README.md),
  [guía de MCP](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md)).
  Filas 1, 10: [`gog drive search`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-search.md)
  («Full-text search across Drive») y
  [`gog drive download`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-download.md).
  Fila 4: [`gog docs cat`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-cat.md) y las
  herramientas MCP `docs_get` y `sheets_read_range`. Fila 6:
  [`gog drive activity query`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-activity-query.md).
  Fila 7: el único subcomando de `gog drive sync` es
  [`push`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-sync-push.md), así que en las filas 7
  y 8 no hay descarga de cambios y la sincronización va en un solo sentido. Fila 9:
  [`gog drive changes watch`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-changes-watch.md)
  configura un webhook y no sincroniza archivos. Fila 11:
  [`gog docs export`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-docs-export.md). Fila 12: MCP
  `docs_write` «optionally as Markdown». Fila 13:
  [`gog drive labels`](https://github.com/openclaw/gogcli/blob/main/docs/commands/gog-drive-labels.md) son etiquetas
  de Google Drive, no etiquetas guardadas en tu ordenador. Filas 16 a 19: README («`gog mcp` ... is read-only by
  default», `--readonly`, listas exactas de comandos permitidos, planes de prueba sin cambios, envoltorio para
  contenido no fiable). Fila 22: README, «download its JSON file», es decir, tu propio cliente OAuth. Fila 23: la guía
  de MCP describe un «typed stdio MCP server».
- **Workspace MCP**
  ([README](https://github.com/taylorwilsdon/google_workspace_mcp),
  [herramientas de Drive](https://workspacemcp.com/google-drive),
  [herramientas de Documentos](https://workspacemcp.com/google-docs),
  [herramientas de Hojas de cálculo](https://workspacemcp.com/google-sheets)).
  Fila 1: `search_drive_files` «speaks the full Drive query syntax». Fila 4: `get_doc_as_markdown`,
  `read_sheet_values`. Fila 5: `get_drive_file_content` lee «uploaded Office files». No nombra PDF, así que 🟡.
  Fila 10: `get_drive_file_download_url`. Fila 11: `export_doc_to_pdf`. La herramienta de descarga acepta un
  `export_format` cuyos valores no están en la lista, así que 🟡. Fila 12: `import_to_google_doc` (Markdown, DOCX, CSV
  y más). Filas 16 a 18: README (`--read-only`, `--permissions`, `--tools`, `--disabled-tools`, «run locally over
  stdio»). Fila 21: README, en local o alojado. Fila 22: README, «You'll need an OAuth client from Google Cloud
  Console». Fila 23: README, «Claude Desktop, web & mobile ... run the server in HTTP mode» y una guía para ChatGPT.
  Las listas de herramientas no tienen ninguna herramienta de revisiones, actividad o etiquetas, así que las filas 6 y
  13 llevan ➖.
- **rclone**
  ([página de Google Drive](https://rclone.org/drive/), [bisync](https://rclone.org/bisync/),
  [lista de comandos](https://rclone.org/commands/)).
  Fila 4: los Documentos se descargan como un archivo en el formato de `--drive-export-formats` que elijas (incluye
  `md`), así que 🟡. Filas 7, 10, 11: [`sync`](https://rclone.org/commands/rclone_sync/), `copy` y
  `--drive-export-formats`. Fila 8: `bisync`, con una sección sobre Documentos de Google y un ejemplo con
  `--drive-skip-gdocs`, así que 🟡. Fila 13: `--drive-metadata-labels` lee y escribe etiquetas de Google Drive, así
  que 🟡. Fila 16: la lista de comandos no tiene ningún comando MCP. Fila 17: `--drive-scope drive.readonly`, un
  inicio de sesión solo de lectura, así que 🟡. Fila 19: `--dry-run`. Fila 22: la página dice que el cliente compartido
  «is being retired and will stop working during 2026».
- **Claude**
  ([Use Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)).
  Fila 1: «Search and retrieve Google Docs». Filas 4, 5: «Read Sheets, Slides, PDFs, images, and MS Office files».
  Fila 6: «list recent changes to your Drive» es una lista de cambios, no quién cambió un documento, así que 🟡.
  Filas 17, 18: «By default, Claude asks for your approval before each of these actions», y los propietarios de los
  planes Team y Enterprise deciden si los miembros pueden saltarse la aprobación, así que 🟡. Fila 21: el conector lee
  tus archivos dentro de Claude, así que ❌. Filas 22, 23: integrado, en la web y en la aplicación de escritorio. La
  página no describe descargar un archivo a tu ordenador ni exportar a PDF, así que las filas 10 y 11 llevan ➖.
