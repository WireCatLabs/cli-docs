---
title: "Encontrar un documento"
---

Encuentra una decisión entre documentos importados sin abrir cada archivo. La búsqueda utiliza
la copia local: sincroniza para obtener cambios recientes y comprueba el enlace antes de actuar.

```text prompt
Use drive CLI to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

Para uso manual:

```sh
drive search 'budget decision' --exact --json
drive search 'budget AND tag:follow-up' --exact --json
drive documents show DOC_ID --json
drive tags list DOC_ID --json
```

Sustituye `DOC_ID` por el ID de Google del resultado. `--exact` busca palabras. El detalle incluye
IDs, títulos y texto de pestañas. Incluye tablas y notas al pie; encabezados, pies, comentarios,
imágenes y sugerencias no están en el texto indexado. Busca etiquetas locales con `tag:follow-up`, solas o junto a palabras.
`drive search` no tiene indicador `--tag`; los campos exclusivos de mensajes no se admiten.

## Buscar por significado

Drive utiliza la caché local compartida del componente de búsqueda. Si también usas Telegram
o MAX, prepáralo con esa herramienta y genera los vectores del texto importado:

```sh
tg models text download e5-small
drive sync --embed
drive search 'what did we agree to spend?' --json
```

La descarga utiliza la red; la generación de vectores es local. Drive no descarga un componente
ausente automáticamente. La búsqueda por palabras funciona sin él. Un resultado vacío indica
que no hay coincidencias en las fuentes importadas, no que el documento no exista en Google Drive.
Consulta [problemas de sincronización](./troubleshooting.md).
