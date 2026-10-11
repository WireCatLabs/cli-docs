---
title: "Encontrar un documento"
---

Encuentra una decisión sin abrir cada archivo. La búsqueda usa la copia local: sincroniza antes
si necesitas cambios recientes y revisa el enlace original antes de actuar.

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

Para uso manual:

```sh
drive personal search 'budget decision' --exact --json
drive personal search 'budget AND tag:follow-up' --exact --json
drive personal documents show DOC_ID --json
drive personal tags list DOC_ID --json
```

Sustituye `DOC_ID` por el ID Google de un resultado. `--exact` busca palabras. El detalle incluye
IDs, títulos y texto de pestañas, tablas y notas al pie. Encabezados, pies, comentarios, imágenes
y sugerencias no forman parte del texto indexado. Usa `tag:follow-up` solo o con palabras para
buscar etiquetas locales. `drive personal search` no tiene opción `--tag`; no admite campos
exclusivos de mensajes.

## Buscar por significado

Drive utiliza la caché compartida del componente de búsqueda local. Si usas Telegram o MAX,
prepara el componente con esa herramienta y genera los vectores del texto importado:

```sh
tg personal models text download e5-small
drive personal sync --embed
drive personal search 'what did we agree to spend?' --json
```

La descarga utiliza internet; la generación de vectores es local. Drive no descarga automáticamente
un componente ausente. La búsqueda por palabras funciona sin él. Cero resultados significa que
no hubo coincidencias en lo importado, no que el documento no exista en Google Drive.
Consulta [problemas de sincronización](./troubleshooting.md).

## Comprobar qué se buscó

`--limit` limita resultados y `--offset` salta esa cantidad; no amplían la cobertura. La búsqueda
no descarga de Google. Para actualidad, ejecuta `drive personal sync` y revisa
`drive personal status --json`. Para leer la caché sin red:

```sh
drive personal --offline search 'budget' --exact --limit 10 --offset 0 --json
drive personal --offline documents show DOC_ID --json
```

Lee el pasaje y la fuente antes de tratarlo como una decisión. Si aparece `meaningSkipped`, revisa
la explicación; no supongas que se ejecutó búsqueda semántica. PDF, Sheets y otros formatos
incompatibles se omiten tanto en búsqueda exacta como semántica. Consulta
[cobertura por formato](./usage.md#which-document-types-are-searchable) y
[recetas](./recipes.md#refresh-a-project-and-prepare-a-meeting-brief).
