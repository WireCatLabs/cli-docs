---
title: "Importar y organizar"
---

Convierte una carpeta Google elegida en documentos locales con búsqueda y entiende qué queda
en disco. Conecta primero una cuenta. Cada comando de cuenta indica un perfil: estos ejemplos
usan `personal`. Sustitúyelo por el elegido al [conectar](./installation.md).

## Elegir la operación adecuada

| Qué quieres | Comando | De dónde vienen los datos | Qué se guarda |
| --- | --- | --- | --- |
| Examinar antes de importar | `drive personal files list --parent FOLDER_ID` | Google, al momento | No importa documentos |
| Leer un Google Doc ahora | `drive personal documents get DOC_ID` | Google, al momento | No importa; imprime JSON Docs |
| Mantener una carpeta buscable | `drive personal folders add FOLDER_ID`, luego `drive personal sync` | Carpeta Google y descendientes | Índice, copias y punto de sincronización |
| Leer una fuente importada | `drive personal documents show DOC_ID` | Copia local | Nada nuevo |
| Dar Markdown a otra herramienta | `drive personal documents export DOC_ID --out ./decision.md` | Copia local | El archivo solicitado |

Redirigir la salida a un archivo también la guarda. Examinar o leer contenido en Google no lo
incluye en la búsqueda local. La búsqueda necesita importar; exportar es opcional.

## Qué tipos de documentos se pueden buscar

| Tipo en Drive | Qué hace sync | Resultado para búsqueda/exportación |
| --- | --- | --- |
| Google Doc nativo | Obtiene contenido Docs y exportación Markdown de Google | Búsqueda en todas las pestañas; exportación Markdown Google |
| Markdown o TXT subido | Descarga texto a la caché administrada | Texto buscable y exportable |
| Carpeta Google | Recorre descendientes y guarda IDs/padres en el estado | La carpeta no es un documento buscable |
| PDF, Word, Excel, presentaciones, imágenes o audio | Omite | Sin extracción, OCR o transcripción automáticos |
| Google Sheets o Slides nativo | Omite | Sin indexación de hojas o diapositivas |
| Acceso directo Drive | Omite | No sigue el destino |
| Descarga restringida por Google | Omite | Leer metadatos no garantiza leer contenido |

Markdown/TXT se reconoce por MIME de texto o sufijos `.md`, `.markdown` o `.txt`.
Renombrar no convierte un binario en texto. Docs incluye cuerpo, tablas y notas al pie;
excluye encabezados, pies, comentarios, imágenes y sugerencias. El texto buscable y el Markdown
Google son representaciones separadas: revisa la exportación si importan formato o pestañas.
Comprueba cada fuente omitida en el informe.

<a id="import-a-folder"></a>

## Importar y comprobar cobertura

```text prompt
Use drive CLI with profile personal. Import the Google folder I select and its subfolders.
Show how many documents were imported, what was skipped and whether work remains.
Do not create extra export files or change anything in Google Drive.
```

Para hacerlo manualmente, sustituye `FOLDER_ID` por el ID o la URL completa:

```sh
drive personal files list --parent FOLDER_ID --json
drive personal folders add https://drive.google.com/drive/folders/FOLDER_ID
drive personal sync --max 200 --json
drive personal status --json
drive personal documents list --json
```

La importación lista documentos con IDs Google estables y enlaces originales. Si quedan
operaciones pendientes, repite `drive personal sync`: reanuda el trabajo guardado.
El primer recorrido es recursivo; `files list --parent` solo lista hijos inmediatos.
Si Google devuelve `nextPageToken`, pásalo a `files list --page-token TOKEN` para continuar.

`folders list` muestra raíces seleccionadas. IDs y padres se guardan en el estado del perfil;
todavía no hay árbol navegable en la base compartida. Los documentos se agrupan por cuenta.
Los nombres repetidos no confunden identidades: selecciona por ID, no por título.

## Mantener el índice actualizado

```sh
drive personal sync --json
drive personal status --json
```

Sync consulta el registro de cambios Google. Repítelo tras ediciones o antes de una respuesta
que requiera actualidad; no hay observador en segundo plano. `--max` limita operaciones por
ejecución, no el tamaño final. `--rescan` vuelve a comprobar las carpetas con un token nuevo.
El texto sin cambios reutiliza su identidad y vectores. Renombrar conserva el ID; mover fuera
de las raíces o borrar en Google quita el documento de búsqueda al sincronizar. Los cambios
o retiradas marcan como obsoletos los recuerdos activos.

## Disco: indexar sin un directorio de exportaciones

La sincronización normal no crea una carpeta de descargas para el usuario. Guarda:

- texto buscable, fragmentos y vectores opcionales en la base local;
- una copia JSON con metadatos/pestañas y otra Markdown por documento;
- ascendencia de carpetas, puntos de sincronización y tareas pendientes en el estado.

Las copias permiten leer sin conexión, exportar y consultar evidencia de recuerdos. Se conservan:
no existe modo descargar→indexar→descartar ni limpieza automática de copias. Borrarlas manualmente
rompe esas funciones aunque quede texto buscable. Para evitar duplicados, lee/busca la caché y
exporta solo los documentos necesarios para otra herramienta.

La base usa por defecto el directorio de estado aislado de Drive. `DRIVE_STATE_DIR` controla copias
y puntos de sincronización; `DRIVE_STORE` elige la base. `DRIVE_CACHE_DIR` no reubica las copias.
Consulta [almacenamiento](./configuration.md). Texto y vectores siguen ocupando disco aunque no
exportes; conservar búsqueda requiere almacenar contenido localmente.

<a id="add-local-context"></a>

## Añadir etiquetas y notas

Sustituye `DOC_ID` por el ID Google de una fuente importada:

```sh
drive personal tags add DOC_ID budget follow-up
drive personal notes add DOC_ID 'Ask Rin to confirm the revised totals'
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents context DOC_ID --json
```

Etiquetas, notas y enlaces son contexto local, sin editar el original Google. Renombrar o
sincronizar de nuevo los conserva. `documents context` reúne notas, etiquetas, enlaces, recuerdos
y editores observados. Para hechos revisados o vínculos con personas/proyectos, usa [recetas](./recipes.md).

## Exportar o dejar de importar

```sh
drive personal documents export DOC_ID --out ./decision.md
drive personal folders remove FOLDER_ID
drive personal sync --json
```

Exportar rechaza sobrescribir. Quitar una raíz reconcilia las copias administradas y registros
indexados en la siguiente sincronización; las fuentes cubiertas por otra raíz permanecen.
Los originales Google y exportaciones independientes no cambian. Reconciliar fuentes no garantiza
reducir el archivo SQLite ni borrar cada nota creada por separado.

Comprueba que listado y búsqueda coinciden con el alcance elegido. Sigue con
[búsqueda](./search.md) o [recetas completas](./recipes.md).
