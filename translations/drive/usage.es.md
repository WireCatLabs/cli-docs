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
| Guardar en memoria un documento de Drive fuera de las carpetas sincronizadas | `drive documents add DOC_URL --profiles work,personal` | Google, con el primer perfil nombrado que lo abra | Su texto, como fuente añadida a mano. No se vuelve a sincronizar |
| Mantener una carpeta buscable | `drive personal folders add FOLDER_ID`, luego `drive personal sync` | Carpeta Google y descendientes | Índice, copias y punto de sincronización |
| Leer una fuente importada | `drive personal documents show DOC_ID` | Copia local | Nada nuevo |
| Dar Markdown a otra herramienta | `drive personal documents export DOC_ID --output ./decision.md` | Copia local | El archivo solicitado |

`documents add` acepta un Google Doc, una hoja, un PDF o cualquier otro archivo que lea sync. Prueba los perfiles en el
orden en que los nombras (`all` son todos los perfiles, en orden alfabético), como máximo cinco (`drive personal config set max_add_profiles 8
--defaults` cambia ese número). Responde con el perfil que abrió el documento y lo que respondieron los demás. Solo un
rechazo de acceso (no encontrado, denegado, sesión cerrada) pasa al siguiente perfil. Una cuota agotada o un fallo de
red lo detiene, y nombra el perfil en el que se detuvo. Nada elige un perfil por ti: sin palabra de perfil y sin
`--profiles` lista los perfiles entre los que elegir, y una palabra de perfil junto con `--profiles` se rechaza. Solo
funciona en una terminal, no por MCP.

Guarda la dirección propia del archivo en Google, no los parámetros de uso compartido del enlace. A un archivo que ya
importó una sincronización, de cualquier perfil, responde con `duplicate_of`, y nada se guarda dos veces. Si añades el
mismo archivo otra vez después de que cambió, se guarda una segunda copia junto a la primera: la primera aún no se
reemplaza.

Redirigir la salida a un archivo también la guarda. Examinar o leer contenido en Google no lo
incluye en la búsqueda local. La búsqueda necesita importar; exportar es opcional.

## Qué tipos de documentos se pueden buscar

| Tipo en Google Drive | Qué hace sync | Resultado para búsqueda/exportación |
| --- | --- | --- |
| Google Doc nativo | Obtiene contenido Docs y Markdown Google | Texto de todas las pestañas; exportación Markdown Google |
| Markdown o TXT subido | Descarga texto a la caché | Texto buscable y exportable |
| Carpeta Google | Guarda metadatos y padres en la base; recorre descendientes | `catalog tree`, búsqueda de metadatos, etiquetas y notas locales |
| Google Sheet | Exporta el libro como `.xlsx` y lee cada hoja | Cada hoja es un encabezado; filas como `Row 2: Column: value`, usando la primera fila textual como nombres de columnas |
| PDF, Word (`.docx`, `.doc`), Excel (`.xlsx`), PowerPoint (`.pptx`), OpenDocument (`.odt`, `.ods`, `.odp`), RTF, HTML, EPUB, CSV o TSV subidos | Descarga y lee texto | Texto de documentos y diapositivas, cada hoja Excel y filas CSV. Un archivo omitido antes por un tipo no admitido se lee en el siguiente sync |
| PDF escaneado sin capa de texto, imagen JPEG, PNG o WebP | Lee el texto por OCR según `read_scans`, en este equipo por defecto. Un archivo de más de 20 páginas o una imagen de más de 25 MB se guarda por nombre con la razón | Texto buscable y exportable. Con `read_scans` en `off`, buscable solo por nombre. Consulta [escaneos e imágenes](#scans-and-pictures) |
| Imágenes con `picture_search` activado | Guarda el nombre, descarga hasta 25 MB si Google lo permite, calcula un vector y no conserva el archivo | Encuentra el contenido en `pictures`; consulta [buscar imágenes](./search.md#search-images-by-what-they-show) |
| Slides, `.ppt`, `.xlsm`, otras imágenes (TIFF, HEIC, con `picture_search` desactivado), audio, vídeo, JSON o código | Guarda el nombre con la razón | Sin extracción ni transcripción. Buscable por nombre |
| Acceso directo Drive | Omite | No sigue el destino |
| Descarga restringida por Google | Guarda el nombre con la razón | Los metadatos no garantizan acceso al contenido; buscable por nombre |

`drive personal config set picture_search true` activa imágenes para un perfil
(consulta [configuración](./configuration.md)). El siguiente `drive personal sync` descarga
imágenes y cuenta las procesadas en `pictures`. `pictures_too_large` cuenta las mayores de 25 MB,
que siguen solo por nombre. `pictures_skipped` indica que falta el modelo: el resto del sync termina
y otro sync procesa las imágenes cuando el modelo está preparado.

## Escaneos e imágenes

Un sync lee por OCR el texto de un PDF escaneado (sin capa de texto) y de una imagen JPEG, PNG o WebP. El ajuste
`read_scans` del perfil elige quién lo lee:

| `read_scans` | Quién lee el texto | Qué necesita |
| --- | --- | --- |
| `local` (predeterminado) | El programa `tesseract` en este equipo, en ruso e inglés. Nada sale del equipo y no se descarga nada | `tesseract` instalado, por ejemplo `sudo apt install tesseract-ocr tesseract-ocr-rus` en Debian o Ubuntu, `brew install tesseract tesseract-lang` en macOS |
| `anthropic` u `openai` | El modelo elegido con `memo models ai set`, en la dirección propia de ese proveedor. Cada página se envía al proveedor como imagen, y el proveedor cobra cada página | `memo models ai set` con ese proveedor e imágenes permitidas (`--allow-remote`) |
| `off` | Nadie | Los escaneos y las imágenes se guardan solo por nombre |

`drive personal config set read_scans '"anthropic"'` cambia un perfil. De un archivo se leen hasta 20 páginas, y un
sync lee como máximo 100 páginas. Las páginas que sobran esperan al siguiente sync. Un escaneo que una versión
anterior de drive guardó por nombre se lee en el siguiente sync. Si falta `tesseract`, el sync termina igualmente, y
la razón de cada escaneo explica cómo instalarlo. Con `picture_search` activado, una imagen recibe su texto y también
su vector de imagen. `local` gira una página que está de lado antes de leerla, con los datos de orientación de
`tesseract` (`sudo apt install tesseract-ocr-osd` donde no se instalan con `tesseract`). Sin esos datos, esa página se
lee como texto ilegible, y los `warnings` del sync indican `document.scan-unturned`.

## Transcripciones de Meet y notas de Gemini

Google Meet guarda la transcripción de una reunión y las notas de Gemini como Google Docs en el Drive del organizador
y las comparte con los invitados, así que la mayoría no está en ninguna carpeta tuya. `drive personal transcripts list`
lista los Google Docs cuyo nombre contiene `Transcript`, `Notes by Gemini` o una de sus formas en ruso y español, en tu
Drive y entre los archivos compartidos contigo, y no importa nada. `owned_by_me` es `false` para uno que está en el
Drive de otra persona.

El ajuste `transcripts` del perfil decide qué hace sync con ellos. No se importa nada hasta que lo configures:

| `transcripts` | Qué hace sync |
| --- | --- |
| `include` | Importa cada coincidencia esté donde esté, la mantiene al día y quita la que ya no está compartida o cambió de nombre |
| `skip` o sin valor | No las toca: solo lo que contienen las carpetas elegidas |
| `exclude` | Deja fuera las coincidencias incluso dentro de una carpeta elegida |

`drive personal config set transcripts '"include"'` lo activa. Drive no guarda ninguna marca de que un documento venga
de Meet, así que decide el nombre. `transcript_words` sustituye las palabras (`drive personal config set transcript_words
'["Transcript","Notes by Gemini"]'`). Las formas en ruso y español son los nombres de Google tal como se conocen y aún
no se han visto en un Drive real. Una transcripción que también guardó una herramienta de reuniones aparece una vez en
la búsqueda de WireCat, como la reunión.

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
por nombre; `not_read` indica la razón, así que abre `url` en vez de citar texto ausente.
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

`folders list` muestra las raíces elegidas por ID y nombre, sin preguntar a Google. El nombre es el que vio
`folders add`, y cada sync lo actualiza, así que una carpeta renombrada muestra su nombre nuevo tras el siguiente sync.
Una carpeta elegida antes de que drive guardara nombres muestra solo su ID hasta ese sync. La lista no da `path`:
Google Drive no guarda la ruta de una carpeta, y construirla cuesta una petición por cada carpeta padre, que a menudo
termina en una carpeta padre compartida que no puedes ver.
`catalog tree` muestra su jerarquía guardada;
`catalog list "parent:FOLDER_ID"` lista los hijos inmediatos sin Google. El índice de contenido
agrupa documentos por cuenta; moverlos en Google conserva su referencia local. Los nombres
repetidos son seguros: selecciona la fuente por ID.

Los mismos documentos importados sirven para [reunir evidencia del proyecto con Memo](./recipes.md#gather-project-context-with-memo).
Sincroniza primero las carpetas elegidas: consultar un archivo mediante una aplicación conectada
no lo guarda en Memo. Usa la misma base compartida en ambas herramientas y selecciona
explícitamente el perfil Drive importado.

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

El catálogo de cada cuenta está aislado, con metadatos y salida del árbol limitados. Un alcance de cualquier tamaño
se completa en varios sync.

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

Un sync lee como máximo 10 000 entradas de las carpetas elegidas y guarda dónde se detuvo. El siguiente sync sigue
desde ahí. Un sync también se detiene a tiempo, tras 15 minutos en una terminal y 45 segundos por MCP salvo que
`--timeout` fije otro valor, y pide sincronizar de nuevo. Una carpeta puede tener como máximo 10 000 entradas, y un
sync lee como máximo 10 000 cambios desde el anterior. Si Google lista más cambios, `--rescan` lee las carpetas en su
lugar. Si una carpeta tiene más, elige carpetas más pequeñas.

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
exportes; conservar búsqueda requiere almacenar contenido localmente. Al cambiar de base,
[previsualiza y copia el contexto](./recipes.md#keep-notes-when-changing-databases) en lugar de borrar el
archivo anterior. Se conservan relaciones estructuradas y anotaciones; las referencias dentro de
texto libre no se reescriben.

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

## Descargar o convertir un archivo de Google

Estos comandos leen Google directamente; no necesitas importar el archivo primero.

```sh
drive personal files download FILE_ID --output ./download.bin
drive personal files export DOC_ID --format pdf --output ./document.pdf
drive personal files export DOC_ID --format docx --output ./document.docx
drive personal files export SHEET_ID --format xlsx --output ./workbook.xlsx
drive personal files export SHEET_ID --format csv --output ./sheet.csv
```

`download` guarda los bytes de un archivo subido. `export` pide a Google convertir un documento
nativo: elige un formato compatible con su tipo — PDF o DOCX para Documentos, XLSX o CSV para Hojas
de cálculo. CSV exporta solo la primera hoja. Google limita las exportaciones nativas a 10 MB;
Drive limita cada descarga a 50 MB. Ninguno importa el archivo al buscador ni lo cambia en Google.
Google Vids necesita el flujo API de larga duración y no admite estos comandos simplificados.

Un archivo existente, incluido un enlace simbólico, se rechaza antes de descargar. Usa `--overwrite`
para sustituirlo. El resultado contiene el ID y el número de bytes, sin nombre del documento ni ruta
local. Ambos escriben un archivo local, así que `--read-only` y `DRIVE_READ_ONLY=1` los rechazan; `--dry-run` muestra el plan
sin descargar. El comando existente `documents export --output PATH` escribe una copia Markdown
importada sin conectarse a Google.

Sin `--output`, `files download FILE_ID --json` no guarda nada y responde con el texto del archivo y el `sha256` de sus
bytes, para una edición (abajo). Un texto de más de 200 000 caracteres se corta ahí con `truncated: true` y sin
`sha256`. Un PDF, `.docx` o `.xlsx` responde con su texto extraído, también sin `sha256`: escrito de vuelta, ese texto
sustituiría el documento.
Como no escribe nada aquí, una ejecución de solo lectura (`--read-only`, `DRIVE_READ_ONLY=1`) también lee el texto,
y un agente por MCP la ejecuta con `drive_read`. `--output` es solo del propietario: ninguna herramienta MCP lo
ofrece.

## Editar un archivo guardado en Google Drive

Estos comandos cambian un archivo que Drive guarda como archivo: Markdown, texto o CSV, y archivos Word (`.docx`) y
Excel (`.xlsx`) subidos. Necesitan un acceso con `--grant write`.

| Comando | Qué cambia |
| --- | --- |
| `files update FILE_ID --text <text>` (o el texto por stdin) | todo el texto de un archivo de texto plano |
| `files sheets update FILE_ID <range> --values <json>` | celdas de un `.xlsx`, según `files sheets show`. El resto del libro queda igual |
| `files documents update FILE_ID --payload <json>` | párrafos de un `.docx`, por los índices que da `files documents show` |
| `files restore FILE_ID <version>` | restaura una versión que lista `files history` |

Una edición sustituye un archivo solo si su contenido sigue siendo el que se leyó. Lee primero el `sha256` del archivo y
pásalo como `--expected-fingerprint`: `files download FILE_ID --json` lo da para un archivo de texto,
y `files sheets show` y `files documents show` lo dan para un libro o un archivo Word. Antes de subir, drive descarga el archivo, guarda
su contenido en este equipo en la carpeta de estado del perfil y comprueba que sigue teniendo ese `sha256`. Justo antes
de subir lo comprueba otra vez: por el `sha256` propio de Google para el archivo o, si Google no tiene ninguno o tiene
otro, descargando los bytes de nuevo. Si el archivo cambió, la respuesta es un `conflict` que nombra el comando para
leerlo otra vez, y no se sube nada.

Google Drive no tiene subida condicional: su API no da al archivo ninguna etiqueta de versión de la que pueda depender
una subida. Por eso no se detecta un cambio que llega en el momento entre esa última comprobación y la subida. Su
contenido no se pierde: el contenido que drive sustituyó se guarda en este equipo, y Drive conserva sus propias
revisiones anteriores de un archivo guardado (`revisions list FILE_ID`). El archivo conserva su ID, nombre y carpeta.

`files update` escribe sobre un archivo que ya existe y no crea uno. Google Drive identifica un archivo por su ID, así
que un archivo nuevo se sube con `files upload`. Rechaza un PDF, `.docx` o `.xlsx`, cuyo texto se extrae al leerlo.
`sheets update` escribe un texto como texto, incluso uno que empieza por `=`, y no sobrescribe una fórmula sin
`--replace`. `documents update` rechaza un párrafo con un cambio controlado, un campo, una imagen, un comentario, un
enlace o una nota al pie, y explica por qué. Cada escritura sobre un archivo comprueba también el permiso
`files.delete`: un perfil que lo pone en `ask` pregunta antes, y `deny` rechaza la edición
([configuración](./configuration.md)).

Estos comandos no cambian un Google Doc o Sheet, que no tiene archivo guardado. Lo rechazan y nombran el comando que
sí lo hace: `documents update` para un Doc, los [comandos `sheets`](./recipes.md#read-and-change-spreadsheet-cells)
para un Sheet.

`files history FILE_ID` lista lo que sustituyeron las ediciones de este perfil, con lo más reciente al final. Cada
`version` es el `sha256` del contenido sustituido, y `available` indica si aún se conserva. `files restore FILE_ID` sin
versión sigue sacando un archivo de la papelera. Consulta
[editar un archivo con tu agente](./recipes.md#edit-a-file-stored-in-drive-with-your-agent).

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
documento compartido de comandos con contrato `4`. `effects` describe lecturas y escrituras remotas
y locales; `api_operation` identifica un método generado de Google. Las listas locales usan
`page.mode: "page"` y devuelven `next_page` si quedan resultados; las listas de Google
(`files list`, `comments list`, `permissions list`, `revisions list`, `shared-drives`, `activities list`)
usan `page.mode: "cursor"` y devuelven `next_cursor`. La búsqueda y las listas de notas
usan `--page`, no `--offset`. JSONL emite registros `{"type":"item","data":…}` seguidos de un único
registro `{"type":"end",…}` con `complete` y metadatos de página. Los errores incluyen
`error.retry.safe`, y el código de salida del proceso indica el tipo (`2` entrada incorrecta, `4` sin sesión iniciada,
`5` no permitido, `6` no encontrado, `9` tiempo agotado; la tabla completa está en [códigos de salida](./commands.md#exit-codes));
comprueba una escritura remota de resultado incierto antes de repetirla.
MCP muestra los caracteres de control de forma visible.

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
