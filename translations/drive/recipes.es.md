---
title: "Recetas"
---

Después de conectar una cuenta, estos flujos ayudan a importar un proyecto, encontrar evidencia
y guardar contexto útil. Cada comando usa `personal`: cámbialo por tu perfil. Indícalo también
en las solicitudes al agente. [Importación y almacenamiento](./usage.md) explica los formatos
compatibles y las copias locales que conservan estas recetas.

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

Abre los enlaces Google citados para comprobar las decisiones. El resumen no cubre fuentes
incompatibles o sin importar. `documents get` lee un Doc accesible directamente de Google sin
importarlo; imprime JSON Docs y no lo añade a la búsqueda.

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
drive personal files move NEW_DOC_ID --to FOLDER_ID
drive personal sync --json
```

Sustituye `NEW_DOC_ID` por el `documentId` de la respuesta. Comprueba que está en la carpeta elegida
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
