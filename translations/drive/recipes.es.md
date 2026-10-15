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
| Añadir etiquetas, notas o vínculos | No | Sí | No |
| Proponer recuerdos con IA | Envía texto local al proveedor configurado | Solo con `--yes` o confirmación | No |
| Consultar comentarios o historial | Sí | Sin importación automática | No |
| Crear o editar un Doc | Sí | Se importa al sincronizar después | Sí |
| Explorar y organizar el árbol guardado | No | Etiquetas/notas cuando se solicitan | No |

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
Para vincular registros del servicio de mensajería, elige explícitamente una base compartida
compatible. Bases separadas no comparten IDs. Consulta [configuración](./configuration.md) y
[organizar fuentes](https://wirecat.dev/en/docs/organize).

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

La extracción muestra una vista previa; `--yes` guarda propuestas. Sustituye `MEMORY_ID` por una
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

Revisa los tools del primer comando antes de iniciar el servidor stdio. Usa el mismo árbol de
comandos, perfil y controles. No es un conector HTTP alojado para navegador. Consulta
[la referencia completa](./commands.md) para otras operaciones.
