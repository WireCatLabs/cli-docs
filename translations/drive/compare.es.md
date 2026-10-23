---
title: "Comparado con otras herramientas"
---

<a id="funciones" />
<a id="instalación-y-licencia" />
<a id="cuándo-otra-herramienta-encaja-mejor" />
<a id="features" />
<a id="install-and-licence" />
<a id="when-another-tool-fits-better" />

Varias herramientas abiertas ya conectan Google Drive, Documentos y Hojas de cálculo con una terminal o un agente de IA. Esta página pone `drive` junto a tres de ellas, para que veas de un vistazo qué hace cada una y elijas la que encaja con tu trabajo. Las marcas proceden de la documentación de cada proyecto; una herramienta puede hacer más de lo que dice su documentación.

Las herramientas:

- **drive** — esta herramienta: una línea de comandos y un servidor MCP para tu cuenta de Google, con una copia local con búsqueda de las carpetas que elijas y espejado bidireccional de archivos locales en Documentos y Hojas de cálculo.
- **[gog](https://github.com/openclaw/gogcli)** — una línea de comandos para todo Google Workspace, con un gran conjunto de comandos de edición de Documentos y Hojas de cálculo y un servidor MCP.
- **[Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)** — un servidor MCP para doce servicios de Google que puedes ejecutar en tu ordenador o alojar para un equipo.
- **[rclone](https://github.com/rclone/rclone)** — una herramienta rápida de copia y sincronización de archivos para Google Drive y muchos otros servicios de almacenamiento.

✅ sí · 🟡 en parte · ❌ no · ➖ no figura en su documentación

## Funciones

| Función | drive | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [rclone](https://github.com/rclone/rclone) |
|---|:-:|:-:|:-:|:-:|
| Iniciar sesión sin crear tu propio proyecto de Google Cloud | ✅¹ | ❌ | ❌ | ✅ |
| Listar, copiar, mover y enviar archivos a la papelera | ✅ | ✅ | ✅ | ✅ |
| Subir y descargar cualquier archivo | 🟡 | ✅ | ✅ | ✅ |
| Leer un Documento de Google como Markdown | ✅ | ✅ | ✅ | 🟡 |
| Convertir Markdown en un Documento de Google con formato | ✅ | ✅ | ✅ | ➖ |
| Actualizar un Documento sin perder los comentarios del texto que no cambia | ✅ | 🟡 | ➖ | ❌ |
| Edición avanzada de Documentos: tablas, estilos, encabezados, imágenes | 🟡 | ✅ | ✅ | ❌ |
| Leer y cambiar celdas de hojas de cálculo | ✅ | ✅ | ✅ | ❌ |
| Formato de hojas de cálculo, gráficos y validación | 🟡 | ✅ | ✅ | ❌ |
| Mantener una carpeta local espejada en Google | ✅ | 🟡 | ❌ | ✅ |
| Mantener archivos CSV y Excel como Hojas de cálculo de Google nativas | ✅ | 🟡 | 🟡 | 🟡 |
| Traer a los archivos locales las ediciones hechas en Google | ✅ | ❌ | ❌ | 🟡 |
| Mostrar un conflicto parte por parte y dejarte elegir un lado | ✅ | ❌ | ❌ | 🟡 |
| Sincronizar en segundo plano | ❌ | 🟡 | ❌ | ❌ |
| Una copia local en la que buscar sin conexión | ✅ | ❌ | ❌ | 🟡 |
| Buscar por significado, y las imágenes por lo que muestran | ✅ | ❌ | ❌ | ❌ |
| Texto de archivos PDF, Word y Excel | ✅ | ➖ | ✅ | ❌ |
| Notas, etiquetas y recuerdos con fuente en los documentos | ✅ | ❌ | ❌ | ❌ |
| Servidor MCP | ✅ | ✅ | ✅ | ❌ |
| MCP remoto con su propio inicio de sesión | ❌ | ❌ | ✅ | ❌ |
| Salida JSON | ✅ | ✅ | 🟡 | 🟡 |
| Varias cuentas | ✅ | ✅ | ✅ | ✅ |
| Límites para un agente: solo lectura, comandos permitidos | ✅ | ✅ | ✅ | 🟡 |
| Unidades compartidas | 🟡 | ✅ | ✅ | ✅ |
| Comentarios e historial de revisiones | ✅ | ✅ | 🟡 | ❌ |
| Exportar a PDF, Word, Excel y CSV | 🟡 | ✅ | 🟡 | ✅ |

¹ Hasta que Google termine de revisar la aplicación de WireCat, Google muestra una pantalla de «aplicación no verificada» al iniciar sesión y admite como máximo 100 usuarios nuevos; también puedes iniciar sesión con tu propia aplicación de Google. Consulta la [instalación](./installation.md#google-shows-an-unverified-app-warning).

## Instalación y licencia

| | drive | [gog](https://github.com/openclaw/gogcli) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | [rclone](https://github.com/rclone/rclone) |
|---|---|---|---|---|
| Instalar | npm (Node 22.16+ en la rama 22.x, o Node 24+) | Homebrew, Go, Docker, binarios | uv, Docker, Helm | un solo binario, la mayoría de los gestores de paquetes |
| Escrito en | TypeScript | Go | Python | Go |
| Licencia | Apache-2.0 | MIT | MIT | MIT |

## Cuándo otra herramienta encaja mejor

- **gog** — editas Documentos y Hojas de cálculo al detalle desde la terminal: tablas, encabezados, chips inteligentes, gráficos, formatos condicionales, hilos de comentarios, y Gmail, Calendar y el resto de Workspace en la misma herramienta.
- **Workspace MCP** — quieres Google Workspace en Claude en la web o el móvil, o en ChatGPT, mediante un servidor alojado en el que inicia sesión cada persona, con una gran comunidad detrás.
- **rclone** — sobre todo mueves archivos: copias de seguridad, migraciones y sincronizaciones de carpetas grandes, con los borrados trasladados, entre Google Drive y otros almacenamientos.
- **El propio Documentos de Google** — Documentos ahora abre y edita archivos Markdown en el sitio, con comentarios, y el archivo sigue siendo Markdown. Si solo necesitas que tus compañeros lean y comenten tu Markdown, puede bastar con Google Drive para ordenador.

Si `drive` te encaja, empieza por la [instalación](./installation.md); para conectar un agente sin terminal, consulta [el servidor MCP](./recipes.md#use-a-local-mcp-client).
