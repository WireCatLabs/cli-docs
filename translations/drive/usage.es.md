---
title: "Importar y organizar"
---

Convierte las carpetas elegidas de Google en una copia local que tu agente pueda buscar y leer
sin volver a Drive para cada pregunta. Esta guía muestra cómo elegir el alcance, comprobar lo
guardado, actualizarlo y exportar un documento cuando otra herramienta lo necesita. Los ejemplos
usan el perfil `personal`; sustitúyelo por el nombre de tu perfil conectado.

**Sincronizar** descarga contenido compatible y actualiza su índice local. Una **copia guardada**
conserva contenido y metadatos de esa sincronización. Una **exportación** es un archivo adicional
que solicitas; no hace falta para buscar.

## Elegir la operación adecuada

| Qué quieres | Comando | De dónde vienen los datos | Qué se guarda |
| --- | --- | --- | --- |
| Examinar antes de importar | `drive personal files list --parent FOLDER_ID` | Google, al momento | No importa documentos |
| Leer un Google Doc ahora | `drive personal documents get DOC_ID` | Google, al momento | No importa; imprime JSON Docs |
| Mantener una carpeta buscable | `drive personal folders add FOLDER_ID`, luego `drive personal sync` | Carpeta Google y descendientes | Índice, copias y punto de sincronización |
| Leer una fuente importada | `drive personal documents show DOC_ID` | Copia local | Nada nuevo |
| Dar Markdown a otra herramienta | `drive personal documents export DOC_ID --output ./decision.md` | Copia local | El archivo solicitado |

Redirigir la salida a un archivo también la guarda. Examinar o leer contenido en Google no lo
incluye en la búsqueda local. La búsqueda necesita importar; exportar es opcional.

## Qué tipos de documentos se pueden buscar

| Tipo en Google Drive | Qué hace sync | Resultado para búsqueda/exportación |
| --- | --- | --- |
| Google Doc nativo | Obtiene contenido Docs y Markdown Google | Texto de todas las pestañas; exportación Markdown Google |
| Markdown o TXT subido | Descarga texto a la caché | Texto buscable y exportable |
| Carpeta Google | Guarda metadatos y padres en la base; recorre descendientes | `catalog tree`, búsqueda de metadatos, etiquetas y notas locales |
| Google Sheet | Exporta el libro como `.xlsx` y lee cada hoja | Cada hoja es un encabezado; filas como `Row 2: Column: value`, usando la primera fila textual como nombres de columnas |
| PDF, Word (`.docx`), Excel (`.xlsx`), CSV o TSV subidos | Descarga y lee texto | Texto PDF/Word, cada hoja Excel y filas CSV |
| PDF escaneado sin texto | Guarda el nombre con la razón | Sin OCR; buscable por nombre |
| Imágenes con `picture_search` activado | Guarda el nombre, descarga hasta 25 MB si Google lo permite, calcula un vector y no conserva el archivo | Encuentra el contenido en `pictures`; consulta [buscar imágenes](./search.md#search-images-by-what-they-show) |
| Slides, presentaciones, `.xlsm`, imágenes, audio, vídeo, JSON o código | Guarda el nombre con la razón | Sin extracción, OCR ni transcripción; buscable por nombre |
| Acceso directo Drive | Omite | No sigue el destino |
| Descarga restringida por Google | Guarda el nombre con la razón | Los metadatos no garantizan acceso al contenido; buscable por nombre |

`drive personal config set picture_search true` activa imágenes para un perfil
(consulta [configuración](./configuration.md)). El siguiente `drive personal sync` descarga
imágenes y cuenta las procesadas en `pictures`. `pictures_too_large` cuenta las mayores de 25 MB,
que siguen solo por nombre. `pictures_skipped` indica que falta el modelo: el resto del sync termina
y otro sync procesa las imágenes cuando el modelo está preparado.

Markdown/TXT se reconoce por MIME textual o sufijos `.md`, `.markdown`, `.txt`. Google exporta
hasta 10 MB: una Sheet mayor se omite con esa razón. Los archivos de más de 50 MB se omiten antes
de descargarse, igual que el texto de 2 000 000 caracteres o más (reduce el límite con
[`max_text_chars`](./configuration.md#saved-settings)). Los archivos omitidos por una versión anterior
solo por formato se leen en el siguiente sync. Renombrar no convierte un binario en texto.
Docs incluye cuerpo, tablas y notas al pie; excluye encabezados, pies, comentarios, imágenes y
sugerencias. Texto de búsqueda y Markdown Google son representaciones distintas: comprueba
la exportación si importan formato o pestañas. Revisa cada fuente omitida.

Un archivo ilegible se guarda con nombre, tipo, tamaño, propietarios y enlace, sin texto.
`drive personal sync` los cuenta en `names_only` y muestra la razón en `skipped`. `search` los encuentra
por nombre; `not_read` indica la razón, así que abre `source_url` en vez de citar texto ausente.
La búsqueda por significado los ignora. Salen del índice al borrarse, moverse fuera del alcance
o enviarse a la papelera. Si el formato o límite permite leerlos después, sync sustituye la entrada por texto.

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
drive personal sync --limit 200 --json
drive personal status --json
drive personal documents list --json
```

La importación lista documentos con IDs Google estables y enlaces originales. Si quedan
operaciones pendientes, repite `drive personal sync`: reanuda el trabajo guardado. Un primer recorrido
de carpetas interrumpido también continúa desde su punto guardado. `sync --rescan` reinicia el
recorrido. El trabajo completado se guarda por lotes; si el proceso termina abruptamente,
puede repetir el último lote al continuar.
El primer recorrido es recursivo; `files list --parent` solo lista hijos inmediatos.
Si Google tiene más resultados, `page.next_cursor` contiene el token; pásalo a `files list --cursor TOKEN` para continuar.

`folders list` muestra las raíces elegidas. `catalog tree` muestra su jerarquía guardada;
`catalog list "parent:FOLDER_ID"` lista los hijos inmediatos sin Google. El índice de contenido
agrupa documentos por cuenta; moverlos en Google conserva su referencia local. Los nombres
repetidos son seguros: selecciona la fuente por ID.

## Leer contenido y metadatos sin conexión

Tras importar, estos comandos usan la copia local y no consultan Google:

```sh
drive personal --offline documents list --json
drive personal --offline documents show DOC_ID --json
drive personal --offline documents context DOC_ID --json
drive personal --offline identities list DOC_ID --json
drive personal --offline search 'budget' --exact --json
```

`documents list` devuelve títulos, ID, enlaces originales, tipos MIME, ID de carpetas padre,
propietarios y último editor guardados, con fechas y versiones cuando Google las proporcionó.
`documents show` añade texto indexado e ID/títulos de pestañas. `documents context` añade etiquetas,
notas, vínculos y recuerdos locales. Lee el contenido guardado directamente; abrir Google es opcional.

Sin conexión usas la última versión guardada, no una nueva consulta a Google. `status` informa
del último sync y trabajo pendiente/omitido. No se guardan automáticamente permisos completos,
comentarios, revisiones, actividad ni respuestas API arbitrarias. `files get` y `documents get`
consultan Google, a diferencia de `documents show`; `--offline` las rechaza.

Sync solicita todos los campos de metadatos disponibles y guarda la respuesta en
`provider_metadata` de la entrada del catálogo. Google solo expone campos permitidos a tu cuenta.
Las entradas antiguas mantienen el conjunto normalizado anterior; `sync --rescan` actualiza los metadatos desde Google.

## Explorar y organizar el catálogo local

El **catálogo** guarda los archivos y carpetas de Google, sus metadatos y relaciones de parentesco. Permite localizar fuentes aunque su contenido no se haya descargado o no se pueda leer. Sync lo rellena tras descubrir archivos, antes de procesar el lote limitado de contenido.

Para una importación anterior, copia los metadatos de la caché sin Google ni descargas adicionales:

```sh
drive personal catalog import --offline
drive personal catalog tree --offline
drive personal catalog list 'parent:FOLDER_ID' --offline --json
drive personal catalog show FILE_ID --offline --json
drive personal catalog search 'budget AND kind:file' --offline --json
drive personal catalog list 'person:Rin* AND mime:"application/pdf"' --offline --json
```

`catalog import` copia metadatos del punto de sincronización; no descubre archivos nuevos de Google ni avanza el cursor de sync. Incluye fuentes pendientes y excluye las pendientes de eliminación. Si `entries` es cero y todavía no has sincronizado la carpeta, realiza primero la importación anterior. Para metadatos actuales o más completos, usa `sync --rescan` con conexión.

`tree` parte de las raíces seleccionadas o acepta un ID de carpeta. `--depth 3` limita los descendientes; `truncated: true` indica que una rama tiene más hijos. Los nodos son compactos: usa `show` para los metadatos. Las listas aceptan `--limit` y `--page` e indican continuidad con `has_more`. El lenguaje compartido admite `kind:folder`, `parent:FOLDER_ID`, `tag:follow-up`, `mime:"application/pdf"` y `AND`, `OR`, `NOT`. `person:Rin*` coincide por prefijo con el nombre, correo o ID Google del propietario o último editor observado; entrecomilla un nombre completo para coincidencia exacta. Las palabras sueltas buscan nombres, descripciones o tipos. Es distinto de buscar texto/significado y de `documents list person:PERSON_UID`, que lista los documentos vinculados a una persona guardada.

Las entradas devuelven una referencia estable `document:<id>`, también para carpetas Google; no significa que la carpeta tenga texto de documento. Comprueba `kind` y `content`: `metadata` no tiene cuerpo indexado, `indexed` indica texto guardado y `unreadable` indica un nombre con la razón del fallo de lectura. Estos estados no garantizan una extracción completa.

Puedes etiquetar una carpeta, guardar una nota junto a ella o vincularla a un proyecto existente:

```sh
drive personal catalog tags add FOLDER_ID project follow-up --offline
drive personal catalog list 'tag:follow-up' --offline --json
drive personal notes add FOLDER_ID 'Ask Rin which files are final' --offline
drive personal relationships add FOLDER_ID project:PROJECT_ID --kind related-to --offline
drive personal documents context FOLDER_ID --offline --json
```

Usa ID o URL de Google y referencias de proyecto de la misma base local. Las etiquetas, notas y relaciones reutilizan los registros compartidos. Las etiquetas de carpeta no pasan a los hijos ni cambian etiquetas o permisos Google. Renombrar o mover conserva la referencia. Las fuentes fuera del alcance seleccionado salen del catálogo activo; la reconciliación de metadatos conserva su identidad y anotaciones. Las tareas normales de eliminación de contenido siguen quitando texto y etiquetas de documento según las reglas del índice.

El catálogo de cada cuenta está aislado. Un alcance completo admite hasta 10 000 entradas, con metadatos y salida del árbol limitados. Elige raíces más pequeñas si el recorrido supera el límite.

## Mantener el índice actualizado

```sh
drive personal sync --json
drive personal status --json
```

Sync consulta el registro de cambios Google. Repítelo tras ediciones o antes de una respuesta
que requiera actualidad; no hay observador en segundo plano. `--limit` limita operaciones por
ejecución, no el tamaño final. `--rescan` vuelve a comprobar las carpetas con un token nuevo.
El texto sin cambios reutiliza su identidad y vectores. Renombrar conserva el ID; mover fuera
de las raíces o borrar en Google quita el documento de búsqueda al sincronizar. Los cambios
o retiradas marcan como obsoletos los recuerdos activos.

Un sync lee como máximo 10 000 entradas de las carpetas elegidas y 10 000 cambios.
Si hay más cambios, `--rescan` ayuda mientras las carpetas no superen 10 000 entradas;
si las superan, elige menos carpetas o raíces más pequeñas.

## Disco: indexar sin un directorio de exportaciones

La sincronización normal no crea una carpeta de descargas para el usuario. Guarda:

- texto buscable, fragmentos y vectores opcionales en la base local;
- una copia JSON con metadatos/pestañas y otra Markdown por documento;
- ascendencia de carpetas, puntos de sincronización y tareas pendientes en el estado.

Las copias permiten leer sin conexión, exportar y consultar evidencia de recuerdos. Se conservan:
no existe modo descargar→indexar→descartar ni limpieza automática de copias. Borrarlas manualmente
rompe esas funciones aunque quede texto buscable. Para evitar duplicados, lee/busca la caché y
exporta solo los documentos necesarios para otra herramienta.

La base predeterminada se comparte con las demás herramientas WireCat. `DRIVE_STATE_DIR` controla copias
y puntos de sincronización; `MESSAGING_STORE` elige la base. `DRIVE_CACHE_DIR` no reubica las copias.
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
drive personal documents export DOC_ID --output ./decision.md
drive personal folders remove FOLDER_ID
drive personal sync --json
```

Exportar rechaza sobrescribir. Quitar una raíz reconcilia las copias administradas y registros
indexados en la siguiente sincronización; las fuentes cubiertas por otra raíz permanecen.
Los originales Google y exportaciones independientes no cambian. Reconciliar fuentes no garantiza
reducir el archivo SQLite ni borrar cada nota creada por separado.

Comprueba que listado y búsqueda coinciden con el alcance elegido. Sigue con
[búsqueda](./search.md) o [recetas completas](./recipes.md).

## Salida estructurada

JSON y JSONL permiten que otra herramienta lea los resultados sin interpretar el texto del
terminal. Puedes conservar solo los campos que necesita junto con la paginación y la información sobre si la respuesta está completa.

Las respuestas para programas usan una envoltura: `item` para un resultado único o compuesto,
o `items` con `page` para una lista; `meta` identifica la ejecución, su duración y el estado
`complete`. Las claves de Drive usan snake_case. Los metadatos del proveedor y los diccionarios del
usuario conservan sus claves. Los pasajes de búsqueda están en `item.hits` y los contadores de
sync/status en `item`. La ayuda y el autocompletado siguen siendo texto; `commands --json` usa el
documento compartido de comandos con contrato `3`. `effects` describe lecturas y escrituras remotas
y locales; `api_operation` identifica un método generado de Google. Las listas locales usan
`page.mode: "page"` y devuelven `next_page` si quedan resultados; las listas de Google
(`files list`, `comments list`, `permissions list`, `revisions list`, `shared-drives`, `documents history`)
usan `page.mode: "cursor"` y devuelven `next_cursor`. La búsqueda y las listas de notas
usan `--page`, no `--offset`. JSONL emite registros `{"type":"item","data":…}` seguidos de un único
registro `{"type":"end",…}` con `complete` y metadatos de página. Los errores incluyen
`error.retry.safe`; comprueba una escritura remota de resultado incierto antes de repetirla.
MCP muestra los caracteres de control de forma visible; `--agent-json` ya no es una opción.

Para unos pocos campos del catálogo, usa `--json=id,name` en vez de `--json`. Las rutas con puntos seleccionan objetos y arrays anidados: `--json=hits.ref,hits.excerpt`
selecciona los pasajes de `item.hits`. Las rutas parten de los datos de la respuesta. Se conservan
la envoltura, páginas, cobertura, siguientes pasos, datos ausentes y metadatos de ejecución.
La selección reduce lo que se imprime, no los datos que se examinan.
La misma selección funciona con `--jsonl`. Un campo desconocido de primer nivel produce un error
con los campos disponibles. Una escritura sin campos de resultado declarados requiere `--json`
sin selección; la selección se rechaza antes de ejecutar la escritura.

En un terminal interactivo, los comandos con campos de resultado declarados piden que nombres los
campos al solicitar JSON. Omite `--json` para una lectura normal o elige los campos explícitamente.
Los agentes y las tuberías pueden usar `--json` sin selección para obtener el resultado completo.

Consulta los argumentos y las opciones de salida de cada operación en la [referencia de comandos](./commands.md).
