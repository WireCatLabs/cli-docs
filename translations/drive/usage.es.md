---
title: "Importar y organizar"
---

Elige una carpeta del proyecto, importa sus documentos compatibles y guarda contexto local
junto a las fuentes. Cada resultado enlaza a Google para comprobar el original.

## Importar una carpeta

Copia la URL de la carpeta en Google Drive y sustituye `FOLDER_ID`:

```sh
drive folders add https://drive.google.com/drive/folders/FOLDER_ID
drive sync --json
drive status --json
drive documents list --json
```

La sincronización incluye subcarpetas. Revisa los archivos omitidos y errores: una carpeta con PDF
u hojas de cálculo no queda completamente disponible para búsqueda. Ejecuta `drive sync` tras
cambios. El trabajo interrumpido se reanuda; no hay un observador automático en segundo plano.

`drive folders list` muestra las raíces elegidas, no un árbol interactivo. Inspecciona el contenido
remoto con `drive files list --parent FOLDER_ID`. Los nombres pueden repetirse: usa los IDs devueltos.

## Añadir contexto local

Sustituye `DOC_ID` por el ID de Google de un documento importado:

```sh
drive tags add DOC_ID budget follow-up
drive notes add DOC_ID 'Ask Rin to confirm the revised totals'
drive search 'tag:follow-up' --exact --json
drive documents context DOC_ID --json
```

Las etiquetas y notas no editan el documento de Google. Se conservan durante los renombrados y
sincronizaciones habituales. `documents context` reúne etiquetas, notas, vínculos, recuerdos y
editores observados.

Para un dato reutilizable, crea un recuerdo propuesto y revísalo antes de confirmarlo:

```sh
drive memories add DOC_ID 'The launch budget is approved' --scope work
drive memories list DOC_ID --json
drive memories confirm DOC_ID memory:MEMORY_ID
```

Sustituye `MEMORY_ID` por la referencia devuelta. Si la fuente cambia o se elimina, sus recuerdos
activos quedan obsoletos. Guardar un recuerdo no prueba que la fuente sea correcta; conserva
el documento que lo respalda.

## Exportar o dejar de importar

```sh
drive documents export DOC_ID --out ./decision.md
drive folders remove FOLDER_ID
drive sync --json
```

La exportación escribe el Markdown local y no sobrescribe un archivo existente. Eliminar una raíz
actualiza la copia local en la siguiente sincronización; los archivos incluidos por otra raíz
siguen dentro del alcance. Los originales de Google no se eliminan. Sigue con [búsqueda](./search.md)
o [recetas](./recipes.md).
