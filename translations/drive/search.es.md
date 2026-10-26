---
title: "Encontrar un documento"
---

Encuentra una decisión, un fragmento o un seguimiento entre los documentos importados. Esta
guía explica cómo buscar palabras o significado, filtrar con etiquetas locales y leer evidencia
sin abrir cada archivo de Google. La búsqueda usa la copia local; sincroniza para ver cambios recientes.

El resultado es un fragmento indexado con su referencia, título y enlace original. La **búsqueda
por palabras** compara términos; la **búsqueda por significado** usa embeddings locales para
formulaciones relacionadas. Ninguna amplía el alcance importado ni descarga archivos de Google.

```text prompt
Use drive CLI with profile personal to find the budget decision in my imported project documents.
Show the matching passage and original Google link. Tell me which selected sources were skipped.
```

## Elegir una búsqueda

| Qué recuerdas | Cómo buscar |
| --- | --- |
| Una palabra distintiva | `drive personal search 'budget' --exact --json` |
| Una de dos cuestiones | `drive personal search 'budget OR launch' --exact --json` |
| Un seguimiento etiquetado | `drive personal search 'budget AND tag:follow-up' --exact --json` |
| La pregunta, no su formulación | Prepara embeddings locales y busca con una pregunta natural |
| Una persona vinculada a la fuente | Usa `documents list person:PERSON_UID` y revisa las fuentes |

Los metadatos están en detalles y listados; no son una API universal de búsqueda por campos.
Usa etiquetas y filtros de personas/listados compatibles, sin inventar campos de Google en
el texto. La búsqueda no indexa comentarios, permisos ni historial de revisiones en Google.

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

## Qué resultado aparece primero

Un archivo cuyo título coincide con tus palabras aparece primero. El orden es: título igual a
la consulta, título que contiene la frase y título con todas las palabras en cualquier orden.
Ese resultado incluye `title` en `found_by`, aunque el texto sea largo y mencione las palabras
solo una vez o no las contenga.

Esto se aplica a consultas de palabras como `budget decision`. Una consulta con un campo
(`tag:follow-up`), `OR`, `NOT`, un comodín o una expresión regular conserva el orden de las
coincidencias del texto.

## Buscar por significado

Drive utiliza la caché compartida del componente de búsqueda local. Descarga el componente una vez
(no necesita perfil ni inicio de sesión) y genera los vectores del texto importado:

```sh
drive models download e5-small
drive personal sync --embed
drive personal search 'what did we agree to spend?' --json
```

La descarga utiliza internet; la generación de vectores es local. Drive no descarga automáticamente
un componente ausente. La generación procesa notas y documentos pendientes de toda la base
compartida, incluidos otros perfiles; la búsqueda Drive sigue leyendo solo la cuenta Google
seleccionada. La búsqueda por palabras funciona sin él. Cero resultados significa que
no hubo coincidencias en lo importado, no que el documento no exista en Google Drive; antes de la primera
importación, `not_imported` lo indica. Consulta [problemas de sincronización](./troubleshooting.md).

## Comprobar qué se buscó

`--limit` limita resultados y `--page` elige la página; no amplían la cobertura. La búsqueda
no descarga de Google. Para actualidad, ejecuta `drive personal sync` y revisa
`drive personal status --json`. Para leer la caché sin red:

```sh
drive personal --offline search 'budget' --exact --limit 10 --page 1 --json
drive personal --offline documents show DOC_ID --json
```

Lee el fragmento y metadatos guardados antes de interpretarlos como una decisión. Abre el enlace
Google para comprobar la versión actual. Si aparece `meaning_skipped`, revisa la razón: la búsqueda
semántica puede no haberse ejecutado. PDF escaneados, Slides, imágenes y otros formatos ilegibles
no tienen texto; se encuentran por nombre y `not_read` indica la razón (es `null` en uno leído).
Abre `url`, sin citar texto ausente. Consulta [formatos](./usage.md#which-document-types-are-searchable)
y [recetas](./recipes.md#refresh-a-project-and-prepare-a-meeting-brief).

## Reunir contexto de distintas fuentes

Para encontrar evidencia del proyecto en los documentos importados junto con otras fuentes elegidas,
usa Memo con la misma base compartida. La [receta de Drive y Memo](./recipes.md#gather-project-context-with-memo)
explica cómo elegir carpetas, limitar la sincronización y seleccionar la fuente `drive:personal`.
Leer un archivo Google mediante una aplicación conectada no basta para añadirlo a esa búsqueda local.
Las coincidencias conservan las fechas y enlaces de sus fuentes; revisar las relaciones con el proyecto
sigue siendo un paso separado.

## Buscar imágenes por lo que muestran

Con `picture_search` activado en el perfil, `drive personal search "cat on a sofa"` también
ofrece `pictures`: imágenes más cercanas al contenido del texto, con `ref`, `score`, `title` y
`url`. Es una lista separada de `hits`. Con la opción desactivada no hay `pictures`.

Escribe consultas de imágenes en inglés: el modelo solo entiende inglés y el agente traduce
primero otras preguntas. Si el modelo no está descargado, `pictures_skipped` informa de que falta el modelo; los `hits` habituales no se ven afectados.

Antes de activar la opción, sigue la [preparación compartida del modelo](./configuration.md#change-and-check-a-value).
