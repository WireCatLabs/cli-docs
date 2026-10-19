---
title: "Recetas"
---

Da a tu agente una tarea completa: importar un proyecto, preparar un informe, guardar seguimientos
o recuperar una decisión con fuentes. Cada receta vincula una petición con los comandos y las
comprobaciones del resultado. Los ejemplos usan `personal`; sustitúyelo por tu perfil conectado.

Elige si la tarea puede actualizar datos de Google, cambiar solo contexto local o modificar un
archivo de Google. [Importación y almacenamiento](./usage.md) explica la copia guardada.

## Elegir una receta

| Tarea | Usa Google | Cambia datos locales | Cambia archivos de Google |
| --- | --- | --- | --- |
| Importar o actualizar un proyecto | Sí | Índice y copias | No |
| Preparar un informe con la copia guardada | No | No | No |
| Reunir contexto de un proyecto con Memo | La sincronización usa Google; la recopilación lee la copia guardada | Índice y copias durante la sincronización | No |
| Explorar y organizar el árbol guardado | No | Etiquetas/notas cuando se solicitan | No |
| Añadir etiquetas, notas o vínculos | No | Sí | No |
| Proponer recuerdos con IA | Envía texto local al proveedor configurado | Solo con `--yes` o confirmación | No |
| Consultar comentarios o historial | Sí | Sin importación automática | No |
| Crear o editar un Doc | Sí | Se importa al sincronizar después | Sí |
| Leer o editar celdas de una hoja | Sí | Se importa al sincronizar después | Solo al cambiar celdas explícitamente |
| Organizar pestañas y formato de una hoja | Sí | Se importa al sincronizar después | Sí |

## Primera carpeta buscable sin exportaciones extra

```text prompt
Use drive CLI with profile personal to index the project folder I select.
Import supported documents, report skipped files and finish any pending sync batches.
Find one passage about the budget and show its original source link. Do not export extra files.
```

```sh
drive personal folders add FOLDER_ID
drive personal sync --json
drive personal status --json
drive personal search 'budget' --exact --json
drive personal documents show DOC_ID --json
```

Sustituye `DOC_ID` por el ID Google de un resultado de `documents list`. Sigue sincronizando
mientras quede trabajo. La búsqueda exacta no necesita vectores. Evitar exportaciones elimina
copias extra; la base y los snapshots administrados permanecen.

<a id="prepare-for-a-project-meeting"></a>

## Actualizar un proyecto y preparar una reunión

```text prompt
Use drive CLI with profile personal. Refresh my selected folders, then find the latest budget
and launch decisions. Prepare a short meeting brief with open questions and source links.
Tell me about skipped sources and unfinished sync work. Do not change Google files.
```

```sh
drive personal sync --json
drive personal status --json
drive personal search 'budget OR launch' --exact --json
drive personal documents context DOC_ID --json
```

Lee los fragmentos guardados y sus metadatos para comprobar las decisiones. Abre los enlaces
de Google cuando necesites la versión actual. El resumen no cubre fuentes
incompatibles o sin importar. `documents get` lee un Doc accesible directamente de Google sin
importarlo; imprime JSON Docs y no lo añade a la búsqueda.

## Reunir contexto de un proyecto con Memo

Usa este flujo cuando la información del proyecto está repartida entre documentos de Drive y otras
fuentes que tu agente puede leer con Memo. Drive conserva los documentos elegidos localmente;
Memo busca evidencia del proyecto con referencias en ese material guardado. Ambas herramientas
deben usar la misma base WireCat. Conecta primero el perfil Drive con
[la guía de instalación](./installation.md) e instala
[Memo](https://wirecat.dev/en/docs/memo/installation) si todavía no está disponible.

```text prompt
Usa el perfil Drive personal y Memo para reunir contexto de Cobalt Orchard. Primero muestra las
carpetas Drive seleccionadas y déjame elegir una carpeta concreta del proyecto. Sincronízala,
informa de archivos omitidos o trabajo pendiente y reúne evidencia de ese perfil Drive de los
últimos 60 días. Muestra enlaces originales, fechas de las fuentes y lagunas de cobertura.
No cambies archivos Google ni crees relaciones con el proyecto.
```

Para uso manual, sustituye `FOLDER_ID` por el ID o URL de la carpeta Google del proyecto. Se incluyen
sus descendientes, así que elige una carpeta del proyecto en lugar de toda la cuenta:

```sh
drive personal folders list --json
drive personal folders add FOLDER_ID
drive personal sync --limit 50 --json
drive personal status --json
drive personal documents list --json
memo projects list --json
memo projects evidence COB --source drive:personal --json
```

Sustituye `COB` por la clave, nombre o alias de un proyecto existente de `memo projects list`.
También puedes buscar un nombre nuevo sin crear el proyecto. Si tu perfil Drive tiene otro nombre,
sustituye `personal` en los comandos de ambas herramientas. Una sincronización correcta registra
el perfil para seleccionar fuentes locales; `drive:personal` indica a Memo qué cuenta importada leer.

`--limit 50` limita las lecturas de contenido de esa ejecución; no limita el descubrimiento recursivo
a 50 entradas. Las raíces ya seleccionadas siguen incluidas. Revisa primero `folders list` y después
el resultado de sincronización y `status` para ver trabajo pendiente o archivos omitidos. Repite la
sincronización para continuar el trabajo guardado. Un lote terminado no demuestra que se hayan
leído todos los tipos de archivo.

Memo busca los últimos 60 días por defecto. Para ampliar el periodo:

```sh
memo projects evidence COB --source drive:personal --since-time 365d --json
```

En documentos Google importados se usa la fecha de modificación de la fuente cuando está disponible;
si falta, se usa la actualización del registro local. Importar hoy un documento antiguo no convierte
su fecha conocida en reciente. Una fecha de modificación tampoco establece cuándo se tomó una decisión
descrita en el documento. Revisa `time_kind`, URL y texto de cada resultado antes de usarlo como evidencia.
Si Memo devuelve un punto de continuación, sigue con las mismas opciones y su valor `--cursor`;
los errores y fuentes no leídas siguen siendo lagunas de cobertura. La recopilación usa contenido
guardado y no actualiza Google por ti.

Leer un archivo mediante una aplicación Google Drive conectada o el `documents get` en línea no
realiza esta sincronización local. Tras la sincronización normal no hace falta exportar Markdown
ni volver a importar. Ambas herramientas usan la base compartida por defecto; si cambias
`MESSAGING_STORE`, usa la misma ruta en ambas. Bases separadas no comparten referencias de documentos.

El resultado esperado es un conjunto de coincidencias con referencias de la cuenta elegida, enlaces
Google originales y límites explícitos. Importar y buscar no crea pertenencia al proyecto, hechos
ni tareas. Revísalos por separado con [las relaciones de documentos](#link-a-document-to-a-person-or-project)
o [los flujos de proyectos de Memo](https://wirecat.dev/en/docs/memo/recipes).

## Preparar un informe sin conexión

```text prompt
Use drive CLI with profile personal and --offline. Find budget and launch decisions in the saved
project documents. Prepare a brief with exact passages, source titles and links, and the last sync
information. Do not contact Google or an AI extraction provider through the CLI.
```

```sh
drive personal --offline status --json
drive personal --offline search 'budget OR launch' --exact --json
drive personal --offline documents show DOC_ID --json
drive personal --offline documents context DOC_ID --json
```

El resultado usa la última copia guardada. No debe presentar su fecha como una comprobación
reciente de Google. `--offline` controla el CLI; un agente en la nube puede enviar la evidencia
a su proveedor. Revisa sus propios ajustes si todo el flujo debe quedarse en tu ordenador.

## Guardar todos los metadatos disponibles para uso sin conexión

```text prompt
Use drive CLI with profile personal. Fetch all metadata Google exposes for the file I select,
save the JSON locally, and explain its fields. Read that saved file for later questions instead
of contacting Google again. Do not download its binary contents or change Google files.
```

```sh
drive personal files get FILE_ID --json > ./file-metadata.json
drive personal files list --parent FOLDER_ID --json > ./folder-metadata.json
```

Estos comandos solicitan todos los campos de metadatos disponibles en Google. El primero guarda
la respuesta de un archivo; el segundo, una página de hijos directos, incluso para formatos cuyo
contenido no se indexa. Continúa con el token devuelto si necesitas el listado completo. Las
funciones y políticas de Google determinan qué campos expone.

Tu agente puede leer el JSON guardado sin Google. Es una copia separada que tú gestionas;
no se importa automáticamente a la base ni se busca con `drive search`.
Listas de permisos, comentarios e historial siguen siendo operaciones API separadas. Actualiza
o elimina estos JSON adicionales cuando ya no necesites esa versión.

Sync también guarda la respuesta disponible de metadatos en el catálogo local. Usa
`catalog show FILE_ID --offline` sin crear otro JSON. Las entradas antiguas mantienen su conjunto
anterior hasta volver a escanear. Permisos, comentarios e historial siguen siendo operaciones API separadas.

## Explorar y etiquetar carpetas sin Google

```text prompt
Use drive CLI with profile personal and only local data. Show the imported folder tree,
find the PDFs last edited by Rin, and show their source links and content availability.
Tag the folder I choose follow-up and save my memo beside it. Do not download or export files.
```

```sh
drive personal catalog import --offline
drive personal catalog tree --depth 3 --offline --json
drive personal catalog list 'mime:"application/pdf" AND person:Rin*' --offline --json
drive personal catalog tags add FOLDER_ID follow-up --offline
drive personal notes add FOLDER_ID 'Check the final version with Rin' --offline
drive personal catalog list 'tag:follow-up' --offline --json
drive personal documents context FOLDER_ID --offline --json
```

`catalog import` copia una caché anterior a la base; sync la rellena en importaciones nuevas.
Sustituye `FOLDER_ID` por el ID del árbol y comprueba que el contexto contiene la etiqueta y la nota.
La etiqueta afecta a la carpeta, no a todos los descendientes. Los archivos con solo metadatos se
encuentran antes de terminar el lote de contenido. Para citar un pasaje, verifica que el texto esté
indexado y usa `documents show`: los metadatos no prueban lo que dice el archivo. Consulta
[navegación y filtros del catálogo](./usage.md#browse-and-organize-the-local-catalog).

## Mantener seguimientos junto a las fuentes

```sh
drive personal tags add DOC_ID follow-up budget
drive personal notes add DOC_ID 'Confirm whether tax is included' --title 'Budget review'
drive personal documents list tag:follow-up --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal notes list DOC_ID --json
```

Tanto el listado de documentos como la búsqueda aceptan `tag:` en la consulta. Lee la lista de
notas para confirmar el memo. Cambias contexto local, no el documento Google.

## Vincular un documento con una persona o proyecto

```text prompt
Use drive CLI with profile personal to show observed editors and existing document links.
Link the document to the stored project and person I select, then show its saved context.
Do not merge people merely because their names match.
```

```sh
drive personal identities list DOC_ID --json
drive personal relationships add DOC_ID project:PROJECT_ID --kind related-to
drive personal relationships add DOC_ID person:PERSON_ID --kind about
drive personal documents context DOC_ID --json
```

Utiliza referencias de la misma base. Drive enlaza registros existentes; no crea proyectos o
tareas. Los propietarios/últimos editores observados no son un historial completo de colaboradores.
Para vincular registros del servicio de mensajería, usa el mismo `MESSAGING_STORE` en todas las
herramientas si cambias la ruta predeterminada. Las bases separadas no comparten IDs. Consulta [configuración](./configuration.md) y
[organizar fuentes](https://wirecat.dev/en/docs/organize).

## Conservar las notas al cambiar de base

Copia un archivo antiguo de Drive al almacén local compartido conservando etiquetas, notas,
recuerdos, decisiones y enlaces. La base anterior sigue disponible. Los archivos de Google no cambian.

```text prompt
Usa drive CLI con el perfil personal y muestra las rutas de la base seleccionada y del punto de control.
Previsualiza la copia del contexto de la base anterior al almacén compartido seleccionado.
Muestra las referencias sin resolver antes de aplicar el fingerprint revisado. Conserva el original,
luego comprueba mis notas y la búsqueda sin conexión en el destino.
```

1. Ejecuta `drive personal status --json`. `store.selected` es el destino elegido mediante
   `MESSAGING_STORE` o el almacén compartido predeterminado. `store.checkpoint` indica a qué base
   pertenecen las referencias del perfil guardado. Si `MESSAGING_STORE` apunta al archivo antiguo,
   selecciona primero el destino deseado. Usa el mismo destino para las dos órdenes siguientes.
2. Previsualiza el archivo antiguo. Sustituye `SOURCE_DB` por su ruta:

   ```sh
   drive personal store check SOURCE_DB --offline --json
   ```

3. Revisa los recuentos, `missing_bindings` y `conflicts`. Si `ready` es true, copia el
   `fingerprint` devuelto en la orden de importación:

   ```sh
   drive personal store import SOURCE_DB --fingerprint FINGERPRINT --offline --json
   drive personal documents context DOC_ID --offline --json
   drive personal search 'tag:YOUR_TAG' --exact --offline --json
   ```

Sustituye `DOC_ID` y `YOUR_TAG` por un documento y una etiqueta de la copia.
El éxito devuelve `checkpoint_updated: true` y `source_retained: true`. El perfil usa el destino y
sus referencias apuntan a los nuevos ID. Las notas conservan revisiones; los recuerdos, ámbito y
estado; las decisiones aceptadas siguen aceptadas. Los nombres iguales nunca fusionan personas.
Las demás herramientas WireCat deben elegir la misma base para leer esos registros.

Un proyecto, tarea u otro destino sin resolver necesita una referencia explícita del destino.
Un JSON opcional puede relacionarlas, por ejemplo `{"project:1":"project:7"}`. Pásalo como último
argumento posicional a ambas órdenes: `store check SOURCE_DB bindings.json` y
`store import SOURCE_DB bindings.json --fingerprint FINGERPRINT`. Revisa siempre el nuevo fingerprint.
Resuelve antes las decisiones contradictorias sobre identidades, vocabulario o contenido.

Si la copia se confirmó pero falló el guardado del punto de control, repite `store check` e importa
su nuevo fingerprint. `already_transferred: true` reutiliza la copia sin duplicarla. Detén otros
escritores de la base anterior durante el cambio. Es una copia puntual, no sincronización continua.
Si el origen cambia después, se rechaza otra copia en lugar de sobrescribir ediciones del destino.
No se borran archivos. Se rechazan más de 1 000 documentos/anotaciones o 16 MiB; los índices por
significado y las imágenes en caché necesitan indexación explícita. Para copias ausentes o esquemas
antiguos, consulta
[recuperación del almacén](./troubleshooting.md#the-store-upgrade-reports-existing-annotations).

## Recordar una decisión con evidencia

```text prompt
Use drive CLI with profile personal to propose reusable facts from this imported document.
Show exact supporting quotes. Let me review them before saving or confirming anything.
```

Con un [proveedor IA configurado](./configuration.md#optional-ai-extraction):

```sh
drive personal memories extract DOC_ID --scope work
drive personal memories extract DOC_ID --scope work --yes
drive personal memories list DOC_ID scope:work --json
drive personal facts list DOC_ID status:proposed --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
drive personal facts confirm DOC_ID fact:FACT_ID
```

La extracción muestra una vista previa. `--yes` genera un lote nuevo y guarda todas sus propuestas
válidas; no guarda la vista previa anterior. Revisa las propuestas guardadas antes de confirmarlas. Sustituye `MEMORY_ID` por una
referencia devuelta solo tras revisarla. Cambiar o retirar la fuente marca los recuerdos activos
como obsoletos. La extracción envía texto local seleccionado al proveedor; búsqueda por vectores
es una operación distinta. Para escribirlo tú: `memories add DOC_ID 'Your fact' --scope work`.

## Actualizar una decisión

Conserva la decisión anterior y su fuente cuando cambie un acuerdo. Estos comandos actualizan
los hechos locales del documento importado; no editan Google Drive.

```sh
drive personal facts list DOC_ID kind:decision --json
drive personal facts add DOC_ID 'Move the launch to November' --type decision --scope work --supersedes fact:OLD_ID --occurred-time 2026-10-16T10:00:00Z
drive personal facts show DOC_ID fact:OLD_ID --json
```

Sustituye `fact:OLD_ID` por la referencia de la decisión anterior devuelta por el comando.
La nueva decisión se acepta de inmediato y la anterior pasa a `superseded`; ambas siguen visibles.
La opción `--occurred-time` registra cuándo se tomó la decisión, en lugar de cuándo la guardaste.
Una sustitución propuesta por un agente sigue pendiente hasta que la confirmes; la decisión
anterior sigue vigente hasta entonces. Revisa la fuente antes de confirmar.

Si una decisión deja de estar vigente y no hay sustitución:

```sh
drive personal facts reverse DOC_ID fact:DECISION_ID
drive personal facts list DOC_ID status:reversed --json
```

Solo se pueden revertir decisiones aceptadas, no otros tipos de hechos. El hecho debe pertenecer
al documento y la cuenta seleccionados. Estas operaciones funcionan sin conexión y respetan
`--read-only`. Usa `--dry-run` para ver la operación sin cambiar los hechos locales.

## Examinar revisiones o actividad opcional

```sh
drive personal documents history DOC_ID --json
drive personal comments list DOC_ID --json
```

Estas lecturas consultan Google. Revisiones/comentarios usan Drive API. Para eventos y actores,
habilita Drive Activity API y vuelve a conectar con su permiso:

```sh
drive personal session start --client-file /path/to/desktop-client.json --grant activity
drive personal documents history DOC_ID --activity --json
```

Continúa pasando `page.next_cursor` a `--cursor` en el mismo comando. Las revisiones/eventos visibles
pueden estar incompletos; no son un historial carácter por carácter. Los comentarios pueden
consultarse aquí, pero no se incluyen en la búsqueda de documentos.

## Dar un archivo Markdown a otra herramienta

```sh
drive personal documents export DOC_ID --output ./decision.md
```

Abre el archivo o entrega su ruta a una herramienta en el mismo ordenador. Exporta Markdown local:
sincroniza primero si necesitas actualidad. No sube el archivo a un agente remoto. Puedes eliminar
esa exportación extra al acabar; la caché administrada permanece.

## Crear un Doc nativo e incluirlo en búsqueda

Hazlo solo cuando quieras cambiar Google Drive. Conecta de nuevo con `--grant write`, crea el Doc
y muévelo a una carpeta seleccionada:

```sh
drive personal session start --client-file /path/to/desktop-client.json --grant write
drive personal documents create --title 'Project review'
drive personal documents update NEW_DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"Review notes\n"}}]}'
drive personal files get NEW_DOC_ID --json
drive personal files move NEW_DOC_ID --parent FOLDER_ID --old-parent OLD_PARENT_ID
drive personal sync --json
```

Sustituye `NEW_DOC_ID` por el `document_id` de la respuesta. Docs lo crea en la raíz de My Drive.
Consulta `parents` con `files get` y sustituye `OLD_PARENT_ID` por ese ID; `--old-parent` quita el padre
anterior al añadir el nuevo. Los archivos Google tienen un padre: consulta
[la guía oficial para mover archivos](https://developers.google.com/workspace/drive/api/guides/folder#move-files-between-folders).
Comprueba que está en la carpeta elegida
y que el texto aparece en búsqueda local. Para editar documentos existentes, usa el control de
revisión Docs `writeControl` expuesto en [el esquema de actualización](./commands.md#drive-documents-update).
Para subir un PDF, documento de Office o archivo multimedia local, usa
`drive personal files upload ./report.pdf --parent FOLDER_ID`. Necesita el mismo permiso de escritura.
El comando devuelve el ID del archivo; repetirlo reanuda una subida interrumpida.
Ejecuta sync para indexar archivos compatibles dentro de las carpetas seleccionadas. La subida
conserva el formato original; no convierte Markdown local en un Google Doc con formato.

## Usar un cliente MCP local

Para agentes sin terminal, configura ejecutable `drive` y argumentos `personal --read-only mcp`.
La cuenta conectada debe estar en el ordenador que ejecuta el servidor.

```sh
drive personal --read-only mcp --tools --json
drive personal --read-only mcp
```

El servidor ofrece tres tools: `drive_tools_search` encuentra un comando y muestra sus argumentos, y
`drive_read` o `drive_write` lo ejecuta con `{ command, arguments }`. El primer comando de arriba lista
esos comandos, así que revísalo antes de iniciar el servidor stdio. Usa el mismo árbol de comandos,
perfil y controles; `drive_write` no se ofrece cuando el perfil no permite escrituras. Los comandos que
cambian archivos de Google, leen Drive Activity o listan apps de Drive solo se ofrecen si el perfil
inició sesión con `--grant write`, `activity` o `apps`; reinicia el servidor tras volver a iniciar sesión. No es un conector HTTP alojado para navegador. Consulta
[la referencia completa](./commands.md) para otras operaciones.

## Encontrar un documento y la conversación donde se compartió

Después de importar una carpeta, usa Memo, Telegram o MAX para encontrar sus documentos junto a
mensajes y notas guardados. Pide a tu agente:

```text prompt
Usa Drive CLI para sincronizar las carpetas seleccionadas de mi perfil personal. Encuentra el
documento de presupuesto en la búsqueda compartida de WireCat, muestra su enlace de Google y
las conversaciones guardadas donde se compartió.
```

La sincronización Drive vincula documentos importados con URL de Google visibles en mensajes
ya guardados por las herramientas de mensajería. Las siguientes sincronizaciones también vinculan
mensajes nuevos y URL de documentos añadidas al editar mensajes antiguos guardados, aunque el
documento no cambie. La herramienta de mensajería debe guardar primero el mensaje editado localmente.
No descarga historial del servicio de mensajería
ni marca mensajes como leídos. No detecta enlaces ocultos tras texto con formato sin una URL de Google visible.

Para los comandos exactos, sustituye `CHAT_ID` por un chat elegido en tu perfil Telegram:

```sh
drive personal sync
tg personal search all budget --exact
tg personal chats documents list CHAT_ID
```

La búsqueda de Drive incluye la referencia del documento, su URL de Google y la última fecha de edición
en Google. La lista del chat muestra el título del documento importado cuando se ha establecido
el vínculo. Un resultado vacío puede indicar que los documentos o mensajes aún no se han importado.

## Leer y cambiar celdas de una hoja

Usa comandos actuales de Sheets cuando necesites celdas o fórmulas vigentes. Importar una hoja
permite buscar su texto guardado; leer un rango no la importa, y una escritura llega al índice
local tras la siguiente sincronización. Los comandos actuales requieren Google Sheets API en el
proyecto OAuth de la aplicación. Con tu propia app, [habilita Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
en ese proyecto; WireCat mantiene la configuración de la app compartida.

```text prompt
Usa drive CLI con el perfil personal. Inspecciona las pestañas de la hoja que seleccione y lee
Budget!A1:C4. Muéstrame los valores y fórmulas actuales antes de proponer cambios. Si te pido
aplicarlos, cambia solo las celdas acordadas, muestra el rango devuelto y actualiza la copia para búsqueda.
```

Empieza con la conexión de solo lectura:

```sh
drive personal sheets info SHEET_ID --json
drive personal sheets show SHEET_ID 'Budget!A1:C4' --json
drive personal sheets show SHEET_ID 'Budget!C1:C4' --render formula --json
```

Sustituye `SHEET_ID` por el identificador de la hoja o su URL de Google Sheets. La notación A1
indica pestaña y celdas: `Budget!A1:C4` selecciona columnas A–C y filas 1–4. Si la pestaña contiene
espacios, pasa `"'Quarter 1'!A1:C4"`. `--render unformatted` devuelve valores sin formato; por defecto
Google devuelve los valores con formato visible. Las filas y celdas vacías finales pueden no aparecer.

Para cambiar celdas, vuelve a conectar con permiso explícito de escritura:

```sh
drive personal session start --grant write
drive personal sheets update SHEET_ID 'Budget!A2:B2' --values '[["Travel",250]]' --json
drive personal sheets update SHEET_ID 'Budget!C2' --input user-entered --values '[["=B2*1.2"]]' --json
drive personal sheets add SHEET_ID 'Budget!A1:C20' --values '[["Supplies",40,48]]' --json
drive personal sheets clear SHEET_ID 'Budget!A3:C3' --json
```

Las actualizaciones interpretan las cadenas literalmente por defecto, incluidas las que empiezan
con `=`. Elige `--input user-entered` para fórmulas y el análisis de números/fechas según la
configuración regional de la hoja. Envía identificadores largos como cadenas entre comillas.
Los valores son filas JSON de cadenas, números finitos, booleanos o `null`, con un máximo de
10 000 celdas suministradas. `null` omite una celda; `""` borra su valor. Las filas deben caber en
el rectángulo seleccionado; las celdas omitidas no cambian.

Los comandos de escritura simplificados requieren una pestaña y un rectángulo finito. Al añadir,
ese rectángulo permite encontrar la tabla existente de Google, y se insertan filas **después de
la tabla detectada**; pueden quedar fuera del rango de búsqueda. Comprueba `updates.updated_range`
y los valores devueltos en lugar de suponer dónde se insertaron. Vaciar elimina valores y fórmulas,
conservando el formato. Actualizar/añadir devuelve los valores cambiados; usa una lectura posterior
para comprobarlos independientemente. Otros colaboradores pueden editar entre comandos.

`--dry-run` muestra método y rango sin contactar con Google; `--read-only` rechaza escrituras y
`--offline` rechaza operaciones actuales de Sheets. Comprueba en Google cualquier escritura con
`outcome_unknown` antes de repetirla, especialmente al añadir filas que podrían duplicarse.
El CLI no repite automáticamente estas escrituras. Usa `sync` para actualizar la copia local importada.

Para crear pestañas, insertar y dar formato acotado, sigue
[Organizar pestañas y dar formato a celdas](#organize-tabs-and-format-selected-cells) más abajo.
Para otras operaciones o varios rangos en una petición, usa los comandos generados de Sheets API
en la [referencia de comandos](./commands.md). Usan los esquemas JSON de Google y los mismos
controles de permisos, offline y solo lectura, sin los límites de rango finito o 10 000 celdas de
los comandos simplificados. Las escrituras mediante `api call` también requieren `--allow-writes`.
Los `--ranges` repetidos se separan con comas; usa un array JSON en `api call --params` cuando el
nombre de la pestaña incluya una coma. Algunos métodos POST de consulta requieren el permiso
amplio de Drive aunque solo lean; revisa el contrato y la autorización de Google antes de reconectar.

## Organizar pestañas y dar formato a celdas

Usa identificadores de pestaña de `sheets info` para cambiar una pestaña concreta dentro de una
hoja existente. Estos comandos requieren la misma conexión explícita de escritura que las
actualizaciones de celdas. Cambian datos en Google; actualiza la copia importada con `sync` cuando
la búsqueda local necesite la fuente vigente.

```text prompt
Usa drive CLI con el perfil personal. Inspecciona las pestañas de la hoja seleccionada. Crea una
pestaña Quarter 2, renombra la que indique y pon en negrita solo su cabecera A1:C1. Muestra los
identificadores devueltos y el rango cambiado. Conserva los valores y el resto del formato.
```

```sh
drive personal sheets info SHEET_ID --json
drive personal sheets create SHEET_ID 'Quarter 2' --json
drive personal sheets rename SHEET_ID 101 'Quarter 1' --json
drive personal sheets insert SHEET_ID 101 rows 1 3 --json
drive personal sheets insert SHEET_ID 101 columns 0 1 --json
drive personal sheets format SHEET_ID 101 A1:C1 --body '{"textFormat":{"bold":true}}' --json
drive personal sheets format SHEET_ID 101 B2:B10 --body '{"numberFormat":{"type":"NUMBER","pattern":"0.00"}}' --json
```

`create` añade una pestaña vacía a la hoja existente, en lugar de crear otro archivo.
Sustituye `101` por el identificador numérico devuelto por Google. Permanece estable al renombrar;
solo cambia el título. Los nombres deben tener 1–100 caracteres; Google también comprueba validez
y que no estén duplicados.

Insertar recibe `rows` o `columns`, un **índice desde cero delante del cual insertar** y una
cantidad de 1–1 000. `0` indica la primera fila/columna; el índice de fila `1` inserta antes de
la segunda fila. Las posteriores se desplazan. Google valida los límites actuales de la cuadrícula
y de la hoja; usa la API generada para añadir dimensiones al final. El comando hereda el formato
de la dimensión posterior al punto de inserción.

El formato usa un identificador explícito de pestaña y un rango finito **sin prefijo de pestaña**,
como `A1:C4`. Se pueden seleccionar hasta 10 000 celdas. El JSON admite negrita/cursiva/subrayado/
tachado, familia/tamaño de fuente, colores de texto/fondo, alineación horizontal/vertical, ajuste
de texto y formato numérico. Los campos siguen el JSON `CellFormat` de Google. Se rechazan campos
desconocidos, objetos vacíos, valores de celda y fórmulas.

La máscara de campos incluye solo las propiedades de formato suministradas. `textFormat.bold`
conserva cursiva, formato numérico y valores; usa `false` para quitar la negrita. Se admiten los
canales (`red`, `green`, `blue`, `alpha`) y colores del tema. Para otros campos o varias operaciones
en una petición, usa `api sheets-spreadsheets-batch-update`. El lote genérico puede producir
cambios más amplios y no tiene los límites de 10 000 celdas ni de campos del formateador simplificado.

Todas las rutas mantienen la política del perfil, permiso OAuth de escritura, offline/solo
lectura, dry-run y gestión de resultados inciertos. Una denegación como `sheets.rename` también
se aplica al lote bruto/generado equivalente. Comprueba las celdas antes de repetir un cambio
estructural incierto: podrías duplicar pestañas o insertar más filas. Los colaboradores pueden
hacer cambios entre comandos.
