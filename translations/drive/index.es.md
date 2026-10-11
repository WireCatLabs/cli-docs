---
title: "Google Drive"
---

WireCat Drive es una herramienta de línea de comandos para trabajar con Google Drive y Google
Docs directamente o mediante un agente de IA. Explora y gestiona archivos, importa las carpetas
que elijas y guarda su contenido compatible en una base local para buscarlo. Con esta guía
podrás decidir qué conectar, qué conservar sin conexión y qué tarea probar primero.

## Qué puedes hacer

- Encontrar una decisión entre documentos importados y obtener el fragmento, título y enlace original de Google.
- Leer texto y metadatos guardados sin abrir Drive ni usar la red.
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
| Raíces seleccionadas, relaciones de carpetas, puntos de control y trabajo pendiente | Mantener el alcance y reanudar una importación interrumpida |

Es una copia de las fuentes seleccionadas y compatibles en la última sincronización, no una
copia completa de cada campo de las API de Google. Los comentarios, listas de revisiones,
permisos e historial de actividad se consultan en Google; no se añaden automáticamente al índice
local. Los metadatos se devuelven como datos estructurados; la búsqueda trabaja con el texto
indexado y las etiquetas locales.

También puedes [guardar los metadatos completos disponibles como JSON](./recipes.md#save-full-available-metadata-for-offline-use)
para que otra herramienta los lea sin conexión.

Los ID de carpetas y sus relaciones se conservan en el estado de sincronización. Actualmente la
base agrupa documentos por cuenta de Google; no ofrece un árbol de carpetas navegable. Los
listados en Google muestran hijos directos y la importación recorre los descendientes. Consulta
[el alcance de carpetas y almacenamiento](./usage.md).

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

La indexación local admite Google Docs y Markdown/texto plano subidos. Omite PDF, Office, Sheets,
Slides, imágenes, audio y accesos directos. En Docs indexa cuerpo, tablas y notas al pie de todas
las pestañas; excluye imágenes, encabezados, pies, comentarios y sugerencias. Consultar los
metadatos de un archivo mediante la API es distinto de importar su contenido.

La conexión abre la pantalla de consentimiento de Google. Cada usuario autoriza su cuenta;
el propietario configura la aplicación compartida. Un cliente Desktop OAuth propio sigue
siendo una alternativa. La lectura es el acceso predeterminado; los cambios requieren permiso
de escritura adicional. Elegir carpetas limita la importación, mientras que el permiso de lectura
cubre el Drive de la cuenta.

Empieza con [instalación y conexión de Google](./installation.md), y continúa con
[importar y leer sin conexión](./usage.md) o una [receta completa](./recipes.md).
