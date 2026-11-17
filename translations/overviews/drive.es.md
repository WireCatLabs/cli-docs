---
title: "Google Drive: empieza aquí"
description: "Copia a tu ordenador las carpetas de Google que elijas, para que tu agente de IA encuentre un fragmento con su enlace de Google, incluso sin conexión."
---

Tus planes, especificaciones y presupuestos están en Google Docs y Sheets, y un agente de IA en tu ordenador no puede
leerlos a menos que los pegues en el chat. La herramienta de línea de comandos `drive` copia a tu ordenador las carpetas
de Google que elijas. Después tu agente encuentra el fragmento donde quedó escrita una decisión, con el título del
documento y su enlace de Google, incluso sin internet.

Esta página explica qué obtienes, cómo funciona la copia y cómo conectar tu primera carpeta. Si además permites cambios,
la misma herramienta crea y edita documentos de Docs, copia y mueve archivos y gestiona carpetas por ti.

**En esta página:**

1. [Cómo funciona](#how-it-works)
2. [Qué puedes hacer](#what-you-can-do)
3. [Elige cómo quieres trabajar](#choose-the-way-you-want-to-work)
4. [Qué contiene la copia local](#what-the-local-copy-contains)
5. [Pide tu primer resultado](#ask-for-your-first-result)
6. [Contenido y conexiones compatibles](#supported-content-and-connections)

<a id="how-it-works"></a>

## Cómo funciona

- **Una copia en tu ordenador.** `drive` lee las carpetas que eliges y guarda su texto, títulos y enlaces en el
  almacén local, un archivo de base de datos en tu ordenador que comparten todas las herramientas de WireCat. La
  búsqueda lee esta copia, no Google. Tus archivos de Google no cambian.
- **Solo las carpetas que eliges.** Al explorar Google ves todo lo que tu cuenta puede abrir, pero solo se copian las
  carpetas que añades. Cada sincronización trae lo que cambió desde la anterior.
- **Un perfil por cuenta.** Un perfil es el nombre que eliges para una cuenta de Google conectada, como `personal` o
  `work`. Cada comando que usa una cuenta empieza por él: `drive personal search budget`.
- **Lectura por defecto, escritura cuando la permites.** Al iniciar sesión la herramienta pide a Google acceso de
  lectura. Para cambiar archivos de Google hace falta un permiso de escritura aparte, y los permisos del perfil deciden
  qué cambios pueden ejecutarse.
- **Tu agente usa los mismos comandos.** Un agente de terminal como Claude Code ejecuta `drive` por ti, y una
  aplicación que se conecta a servidores MCP recibe los mismos comandos por MCP.

Como la copia está en el almacén compartido, [Memo](/es/docs/memo) encuentra un documento junto con el chat o el
correo que habla de él.

<a id="what-you-can-do"></a>

## Qué puedes hacer

- Encontrar una decisión en los documentos importados y obtener su fragmento, su título y el enlace original de Google.
- Encontrar documentos importados junto con mensajes y notas guardados a través de Memo, Telegram y MAX.
- Leer el texto y los metadatos guardados, recorrer el árbol de carpetas y encontrar archivos ilegibles sin abrir Drive.
- Mantener al día las carpetas elegidas con sincronizaciones repetidas, incluidos los documentos de las subcarpetas.
- Añadir etiquetas, notas y recuerdos con fuente locales, que se conservan al renombrar y en las actualizaciones
  normales.
- Relacionar documentos con los editores de Google y con personas, proyectos u otras fuentes.
- Consultar en directo los metadatos de un archivo, sus permisos, comentarios, revisiones y, si quieres, su historial
  de actividad.
- Crear y editar documentos de Google Docs, copiar o mover archivos y gestionar carpetas cuando concedes acceso de
  escritura.
- Mantener archivos locales de Markdown o tablas al día con un documento o una hoja de Google que editan tus colegas,
  con un [espejo](./mirrors.md).

<a id="choose-the-way-you-want-to-work"></a>

## Elige cómo quieres trabajar

| Tu tarea | Qué hace Drive | Empieza aquí |
| --- | --- | --- |
| Explorar una carpeta o revisar un archivo | Lee Google directamente. Explorar no añade documentos a la búsqueda | [Explorar e importar](./usage.md#choose-the-right-operation) |
| Darle a un agente un proyecto que recordar | Importa los documentos compatibles al almacén local | [Importar una carpeta](./usage.md#import-a-folder-and-check-coverage) |
| Encontrar pruebas sin conexión | Busca en la copia importada y lee el contenido y los metadatos guardados | [Buscar documentos](./search.md) |
| Guardar contexto útil junto a las fuentes | Añade etiquetas, notas, enlaces y recuerdos revisados locales | [Recetas de tareas](./recipes.md) |
| Cambiar un archivo de Google | Usa la API de Google con permiso de escritura y el permiso del comando | [Crear y editar un documento](./recipes.md#create-a-native-doc-and-include-it-in-search) |

<a id="what-the-local-copy-contains"></a>

## Qué contiene la copia local

Importar guarda más que una carpeta de descargas. El texto de cada documento va a SQLite, el archivo de base de datos
del almacén local, dividido en fragmentos para la búsqueda. Los embeddings opcionales ayudan a encontrar frases
parecidas por su significado.

| Información guardada | Qué puedes hacer sin Google |
| --- | --- |
| Texto de las pestañas, tablas y notas al pie de Google Docs, y de archivos Markdown y de texto subidos | Buscar fragmentos, leer una fuente y preparar una respuesta con sus pruebas |
| ID de Google, título, tipo, enlace original, carpetas padre, fechas y versión cuando existen | Identificar la fuente y revisar los metadatos de la última sincronización |
| Propietarios y último editor que muestra Google | Ver quién trabajó en un documento y con qué personas está relacionado |
| Etiquetas, notas, enlaces a personas y proyectos y recuerdos locales | Ordenar el contexto y recuperarlo en el trabajo siguiente |
| Carpetas de Google y sus padres | Recorrer un árbol guardado, listar su contenido, etiquetar carpetas y añadir notas |
| Carpetas elegidas, puntos de control y trabajo pendiente | Mantener la sincronización acotada y reanudar una importación interrumpida |

El catálogo guarda todos los archivos y carpetas del ámbito elegido, también los formatos cuyo texto no se puede leer.
`catalog search` encuentra nombres, descripciones, tipos, propietarios y editores. `search` encuentra el texto indexado
y las etiquetas locales. El campo `content` de un resultado dice si solo hay metadatos, texto indexado o el motivo por
el que no se pudo leer el texto.

Es una copia de la última sincronización. Las listas de permisos, los comentarios, el historial de revisiones y la
actividad se leen en directo de Google y no se guardan. Consulta
[explorar carpetas sin conexión](./usage.md#browse-and-organize-the-local-catalog).

<a id="ask-for-your-first-result"></a>

## Pide tu primer resultado

Después de [instalar y conectar](./installation.md), dale a tu agente una carpeta de proyecto pequeña:

```text prompt
Use drive CLI with profile personal. Import the Google folder I choose and its subfolders.
Find the budget decision, show its exact passage and original Google link, and list skipped files.
Keep the local index. Do not create extra exports or change Google files.
```

La respuesta debe nombrar sus fuentes e informar del trabajo pendiente u omitido. Después la búsqueda lee la copia
local. Vuelve a sincronizar cuando quieras las ediciones nuevas. Para hacerlo tú:

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal --offline search 'budget' --exact --json
```

Sustituye `FOLDER_ID` y el nombre del perfil. Sincroniza de nuevo mientras indique trabajo pendiente.

<a id="supported-content-and-connections"></a>

## Contenido y conexiones compatibles

La indexación local lee Google Docs y Sheets, y archivos subidos de Markdown y texto plano, PDF con capa de texto, Word
`.docx`, Excel `.xlsx`, CSV y TSV. Las hojas de Sheets se importan para leerlas y buscar en ellas. Los
[comandos de Sheets](./recipes.md#read-and-change-spreadsheet-cells) trabajan en directo: leen rangos, cambian valores
y fórmulas, añaden filas y borran las celdas elegidas. También
[organizan pestañas y dan formato a rangos elegidos](./recipes.md#organize-tabs-and-format-selected-cells).

Los PDF escaneados, Slides, el audio y los accesos directos no tienen texto indexado. Las imágenes se encuentran por su
nombre o, si activas la [búsqueda de imágenes](./search.md#search-images-by-what-they-show), por lo que muestran. En un
documento de Google Docs se indexan el cuerpo, las tablas y las notas al pie de todas las pestañas. Las imágenes, los
encabezados, los pies de página, los comentarios y las sugerencias no se indexan.

El inicio de sesión abre la pantalla de consentimiento de Google en tu navegador, y tú apruebas el acceso a tu propia
cuenta. No necesitas un proyecto de Google Cloud: la aplicación de Google de WireCat ya está lista, y tu propio cliente
OAuth de escritorio es una opción. Elegir carpetas limita lo que se copia, mientras que el acceso de lectura de Google
abarca todo el Drive de la cuenta.

Empieza por la [instalación y la conexión con Google](./installation.md) y sigue con
[importar y leer sin conexión](./usage.md) o con una [receta de tarea completa](./recipes.md).
