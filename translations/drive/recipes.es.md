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
| Proponer recuerdos con IA | Envía texto local al proveedor configurado | Solo con `--save` o confirmación | No |
| Consultar comentarios o historial | Sí | Sin importación automática | No |
| Crear o editar un Doc | Sí | Se importa al sincronizar después | Sí |

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
no se importa automáticamente a la base ni se busca con `drive search`. La sincronización normal
guarda los metadatos seleccionados descritos en [lectura sin conexión](./usage.md#read-content-and-metadata-offline).
Listas de permisos, comentarios e historial siguen siendo operaciones API separadas. Actualiza
o elimina estos JSON adicionales cuando ya no necesites esa versión.

## Mantener seguimientos junto a las fuentes

```sh
drive personal tags add DOC_ID follow-up budget
drive personal notes add DOC_ID 'Confirm whether tax is included' --title 'Budget review'
drive personal documents list --tag follow-up --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal notes list DOC_ID --json
```

`--tag` filtra etiquetas en el listado; la búsqueda usa `tag:` en la consulta. Lee la lista de
notas para confirmar el memo. Cambias contexto local, no el documento Google.

## Vincular un documento con una persona o proyecto

```text prompt
Use drive CLI with profile personal to show observed editors and existing document links.
Link the document to the stored project and person I select, then show its saved context.
Do not merge people merely because their names match.
```

```sh
drive personal people list DOC_ID --json
drive personal links add DOC_ID project:PROJECT_ID --kind related-to
drive personal links add DOC_ID person:PERSON_ID --kind about
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
drive personal memories extract DOC_ID --scope work --save
drive personal memories list DOC_ID --scope work --json
drive personal memories confirm DOC_ID memory:MEMORY_ID
```

La extracción muestra una vista previa; `--save` guarda propuestas. Sustituye `MEMORY_ID` por una
referencia devuelta solo tras revisarla. Cambiar o retirar la fuente marca los recuerdos activos
como obsoletos. La extracción envía texto local seleccionado al proveedor; búsqueda por vectores
es una operación distinta. Para escribirlo tú: `memories add DOC_ID 'Your fact' --scope work`.

## Examinar revisiones o actividad opcional

```sh
drive personal documents history DOC_ID --json
drive personal comments list DOC_ID --json
```

Estas lecturas consultan Google. Revisiones/comentarios usan Drive API. Para eventos y actores,
habilita Drive Activity API y vuelve a conectar con su permiso:

```sh
drive personal session start --client-file /path/to/desktop-client.json --activity
drive personal documents history DOC_ID --activity --json
```

Continúa con el token devuelto y `--page-token` en el mismo comando. Las revisiones/eventos visibles
pueden estar incompletos; no son un historial carácter por carácter. Los comentarios pueden
consultarse aquí, pero no se incluyen en la búsqueda de documentos.

## Dar un archivo Markdown a otra herramienta

```sh
drive personal documents export DOC_ID --out ./decision.md
```

Abre el archivo o entrega su ruta a una herramienta en el mismo ordenador. Exporta Markdown local:
sincroniza primero si necesitas actualidad. No sube el archivo a un agente remoto. Puedes eliminar
esa exportación extra al acabar; la caché administrada permanece.

## Crear un Doc nativo e incluirlo en búsqueda

Hazlo solo cuando quieras cambiar Google Drive. Conecta de nuevo con `--write`, crea el Doc
y muévelo a una carpeta seleccionada:

```sh
drive personal session start --client-file /path/to/desktop-client.json --write
drive personal documents create --title 'Project review'
drive personal documents update NEW_DOC_ID --body '{"requests":[{"insertText":{"endOfSegmentLocation":{},"text":"Review notes\n"}}]}'
drive personal files get NEW_DOC_ID --json
drive personal files move NEW_DOC_ID --to FOLDER_ID --from OLD_PARENT_ID
drive personal sync --json
```

Sustituye `NEW_DOC_ID` por el `documentId` de la respuesta. Docs lo crea en la raíz de My Drive.
Consulta `parents` con `files get` y sustituye `OLD_PARENT_ID` por ese ID; `--from` quita el padre
anterior al añadir el nuevo. Los archivos Google tienen un padre: consulta
[la guía oficial para mover archivos](https://developers.google.com/workspace/drive/api/guides/folder#move-files-between-folders).
Comprueba que está en la carpeta elegida
y que el texto aparece en búsqueda local. Para editar documentos existentes, usa el control de
revisión Docs `writeControl` expuesto en [el esquema de actualización](./commands.md#drive-documents-update).
Se puede crear un Doc nativo con texto; no hay flujo de subida de PDF/Office/multimedia arbitrarios
ni conversión de Markdown local a un Doc con formato.

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
