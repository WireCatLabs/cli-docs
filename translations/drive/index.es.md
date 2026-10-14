---
title: "Google Drive"
---

WireCat Drive es una herramienta de línea de comandos para trabajar con Google Drive y Google
Docs directamente o mediante un agente de IA. Explora y gestiona archivos, importa las carpetas
que elijas y guarda su contenido compatible en una base local para buscarlo. Con esta guía
podrás decidir qué conectar, qué conservar sin conexión y qué tarea probar primero.

## Qué puedes hacer

- Encontrar una decisión entre documentos importados y obtener el fragmento, título y enlace original de Google.
- Leer texto y metadatos guardados, explorar árboles de carpetas y encontrar archivos ilegibles sin abrir Drive.
- Actualizar las carpetas elegidas mediante sincronizaciones repetibles, incluidas sus subcarpetas.
- Añadir etiquetas, notas y recuerdos con fuentes que se conservan tras renombrar y actualizar documentos.
- Vincular documentos con editores observados en Google y personas, proyectos u otras fuentes existentes.
- Consultar metadatos actuales, permisos, comentarios, revisiones e historial de actividad opcional.
- Crear y editar Docs, copiar o mover archivos y gestionar carpetas tras conceder explícitamente acceso de escritura.
- Usar los mismos comandos, perfiles y permisos con un agente de terminal o un cliente MCP local.

Un **perfil** nombra una cuenta de Google conectada, como `personal` o `work`. Cada comando de
cuenta lo indica. La **copia local** es el texto, los metadatos y el contexto guardados en el
ordenador donde se ejecuta Drive; está separada de los originales de Google.

## Elige cómo trabajar

| Tu tarea | Qué hace Drive | Por dónde empezar |
| --- | --- | --- |
| Explorar una carpeta o revisar un archivo | Lee Google directamente; explorar no añade documentos al índice | [Explorar e importar](./usage.md#choose-the-right-operation) |
| Dar a un agente los materiales del proyecto | Importa documentos compatibles a la base local y a copias gestionadas | [Importar una carpeta](./usage.md#import-a-folder-and-check-coverage) |
| Encontrar evidencia sin conexión | Busca en la copia importada y lee contenido y metadatos guardados | [Buscar documentos](./search.md) |
| Guardar contexto junto a las fuentes | Añade etiquetas, notas, vínculos y recuerdos revisados | [Recetas](./recipes.md) |
| Cambiar un archivo de Google | Usa la API con autorización de escritura y permiso del comando | [Crear y editar un Doc](./recipes.md#create-a-native-doc-and-include-it-in-search) |

## Qué contiene la copia local

La importación conserva más que una carpeta de descargas. El texto y sus fragmentos se guardan
en SQLite, un archivo de base de datos local. Los embeddings opcionales permiten encontrar
formulaciones relacionadas por significado. Las copias JSON y Markdown gestionadas conservan
el material para leerlo y exportarlo.

| Información guardada | Qué puedes hacer sin Google |
| --- | --- |
| Texto de pestañas de Docs, tablas y notas al pie; Markdown/TXT subidos | Buscar fragmentos, leer la fuente y preparar una respuesta con evidencia |
| ID de Google, título, tipo, enlace original, carpetas padre, fechas y versión cuando existen | Identificar la fuente y consultar los metadatos de la última sincronización |
| Propietarios y último editor que muestra Google | Ver participantes observados y vínculos de identidad guardados |
| Etiquetas, notas, vínculos con personas/proyectos y recuerdos locales | Organizar y recuperar contexto en tareas posteriores |
| Carpetas Google y relaciones padre en la base local | Explorar el árbol guardado, listar hijos, etiquetar carpetas y añadir notas |
| Raíces seleccionadas, puntos de control y trabajo pendiente | Mantener el alcance y reanudar una importación interrumpida |

El catálogo conserva archivos y carpetas del alcance elegido, incluidos formatos cuyo contenido
no se puede leer. `catalog search` busca nombres, descripciones, tipos y propietarios/editores observados;
`search` busca texto indexado y etiquetas locales. `content` indica si hay solo metadatos,
texto indexado o una razón de fallo de lectura. Las etiquetas y notas de carpeta son locales.

Sync solicita todos los campos de metadatos que Google permite leer y conserva la respuesta en
la base. Las entradas antiguas guardan su conjunto anterior hasta actualizarse. Es la copia de
la última sincronización: permisos, comentarios, revisiones y actividad siguen siendo consultas
a Google y no se guardan automáticamente. Consulta [carpetas sin conexión](./usage.md#browse-and-organize-the-local-catalog).

## Pide tu primer resultado

Tras [instalar y conectar](./installation.md), da al agente una carpeta pequeña del proyecto:

```text prompt
Use drive CLI with profile personal. Import the Google folder I choose and its subfolders.
Find the budget decision, show its exact passage and original Google link, and list skipped files.
Keep the local index; do not create extra exports or change Google files.
```

El resultado debe identificar las fuentes y avisar del trabajo pendiente u omitido. Después la
búsqueda lee la copia local; sincroniza cuando quieras cambios recientes. Para uso manual:

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal --offline search 'budget' --exact --json
```

Sustituye `FOLDER_ID` y el perfil. Continúa sincronizando mientras quede trabajo pendiente.

## Contenido y conexiones compatibles

La indexación local admite Google Docs y Sheets, Markdown/texto subido, PDF con capa de texto,
Word `.docx`, Excel `.xlsx` y CSV. PDF escaneado, Slides, imágenes, audio y accesos directos se omiten
con su razón. Docs incluye cuerpo, tablas y notas al pie de todas las pestañas; excluye imágenes,
encabezados, pies, comentarios y sugerencias. Consultar metadatos mediante la API es distinto de importar contenido.

La conexión abre la pantalla de consentimiento de Google. Cada usuario autoriza su cuenta;
el propietario configura la aplicación compartida. Un cliente Desktop OAuth propio sigue
siendo una alternativa. La lectura es el acceso predeterminado; los cambios requieren permiso
de escritura adicional. Elegir carpetas limita la importación, mientras que el permiso de lectura
cubre el Drive de la cuenta.

Empieza con [instalación y conexión de Google](./installation.md), y continúa con
[importar y leer sin conexión](./usage.md) o una [receta completa](./recipes.md).
