---
title: "Busca con eficacia"
description: "Cómo elegir el comando de búsqueda, acotar antes de buscar, paginar los resultados y mantener la salida corta, con una tabla de filtros habituales y los errores que cuestan una búsqueda."
---

Tienes mucho guardado, y un agente paga por cada resultado que lee. Esta página muestra cómo obtener los registros adecuados con el menor número de pasos: elegir el comando, acotar antes de buscar, paginar los resultados y recortar la salida. Después podrás convertir una pregunta vaga en una búsqueda precisa y comprobar qué cubrió. Supone que el historial que necesitas ya está descargado: [Buscar](./search.md#descarga-primero-el-historial-de-los-chats-pertinentes).

## Elige el comando

Pon delante de cada comando el nombre de la herramienta y el de tu perfil, como en `tg personal search messages`.

| Quieres | Ejecuta | Notas |
| --- | --- | --- |
| Palabras en tus mensajes de Telegram o MAX | `search messages` en `tg` o `max` | Lee el archivo local y, por defecto, también el servidor de la mensajería |
| Un teléfono, correo, enlace o nombre de persona escritos en mensajes | `search messages` con `phone:`, `email:`, `domain:` o `mentions:`, o `mentions list` | Se encuentra por reglas, como esté escrito |
| Todo sobre una persona, en todas las mensajerías | `contacts timeline` | Necesita las identidades unidas con `contacts link` |
| Una conversación, cuando recuerdas el tema y no las palabras | `search conversations` | Necesita `conversations build` y `conversations embed` una vez para el chat |
| Una imagen por lo que muestra | `search messages "dog on a beach"` | Solo en inglés, y el ajuste de imágenes debe estar activado: [Qué se indexa](./what-is-indexed.md#imágenes) |
| Correo, notas, o no sabes dónde se escribió | `memo search all`, `memo search mail`, `memo search notes` | La respuesta lista las fuentes omitidas y el motivo |
| Mensajes de todas las mensajerías a la vez | `memo search messages` | Solo mensajes |
| Una decisión o una promesa | `memo facts list` | Cada hecho enlaza con su evidencia |
| Un documento de Drive, por palabras o por significado | `drive search` | `--exact` solo para palabras |
| Un archivo de Drive, por nombre, tipo, carpeta, persona o etiqueta | `drive catalog list` o `drive catalog search` | Solo metadatos, funciona sin conexión |

## Acota primero, busca después

Una búsqueda que nombra un chat, un remitente y un periodo lee menos registros y devuelve menos sobrantes. Añade filtros en este orden: chat, remitente, fecha, tipo, adjunto y, al final, las palabras.

| Filtro | Encuentra | Ejemplo |
| --- | --- | --- |
| `chat:` | Un chat, por nombre o id | `chat:"Book club"` |
| `from:` | Un remitente | `from:"Kai Sample"` |
| `date:` | Un periodo, o todo desde un día | `date:[2026-01-01 TO 2026-02-01}`, `date>=2026-10-01` |
| `kind:` | Chats privados, grupos, canales, bots | `kind:group` |
| `has:` | Mensajes con archivo, foto, nota de voz, enlace o texto | `has:file` |
| `filename:` | Un archivo por su nombre | `filename:*.pdf` |
| `mime:` | Un archivo por su tipo (solo Telegram) | `mime:"application/pdf"` |
| `size:` | Archivos por tamaño | `size>10MB` |
| `content:` | Palabras dentro de un archivo | `content:invoice` |
| `transcript:` | Palabras dichas en una nota de voz | `transcript:invoice` |
| `tag:` | Tus propias etiquetas | `tag:work` |
| `phone:`, `email:`, `url:`, `domain:`, `mentions:` | Un valor encontrado en el texto | `phone:"+1 555 010 0100"`, `mentions:"person:7"` |

Los nombres de campo distinguen mayúsculas y un campo desconocido da error, no una respuesta vacía. La lista completa de campos está en el lenguaje de consulta de [Telegram](./tg/query-language.md) y de [MAX](./max/query-language.md). La última fila está en las últimas versiones de `tg` y `max`.

```sh
tg personal search messages 'chat:"Book club" from:"Kai Sample" date>=2026-10-01 delivery' --limit 10
```

Cuando también se consulta el servidor de la mensajería, solo le llegan las palabras, un chat, un remitente y las fechas. `has:`, `tag:`, las negaciones y los comodines se aplican en local. Detalles: [Cómo funciona la búsqueda](./search-architecture.mdx#búsqueda-en-el-servidor-junto-al-archivo).

## Los operadores

| Escribe | Significado |
| --- | --- |
| `invoice paid` | Ambas palabras, en cualquier orden (AND por defecto) |
| `alpha OR beta` | Cualquiera de las palabras |
| `alpha NOT beta`, `alpha -beta` | La primera palabra sin la segunda |
| `+alpha` | La palabra debe estar |
| `(alpha OR beta) gamma` | Un grupo |
| `from:(alice OR bob)` | Un campo con varios valores |
| `date:[2026-01-01 TO 2026-02-01}` | Un rango: `[ ]` incluye el extremo, `{ }` lo excluye |
| `invo*` | Cualquier terminación |
| `text:/pass(port)?/` | Una expresión regular, comparada con palabras completas |

Tres reglas evitan la mayoría de las sorpresas:

- Una consulta que es solo una negación no selecciona nada. Acompáñala de una condición positiva: `has:photo NOT has:text`.
- Un `AND` explícito une más fuerte que `OR`. `alpha OR beta gamma` significa `(alpha OR beta) AND gamma`.
- `and`, `or` y `not` en minúsculas son palabras normales. Las erratas como `invoice~1` y los refuerzos como `invoice^2` dan error.

## Palabras, formas y significado

Una palabra normal encuentra sus otras formas: «invoice» encuentra «invoices». Para la forma exacta, usa `exact:invoice`. La búsqueda no corrige erratas: usa la parte de la que estás seguro (`invoi*`) o añade `--discover` para probar también escrituras parecidas en el archivo local. Las palabras de archivos y transcripciones solo coinciden en su forma exacta.

Usa `search conversations` cuando recuerdas de qué trataba una conversación y no con qué palabras. Pregunta con tus propias palabras, en cualquier idioma que lea el modelo. Siempre devuelve las conversaciones más cercanas, aunque ninguna responda, así que abre los mensajes antes de fiarte de una. Para un nombre, número o id exactos, usa una búsqueda por campos. Más: [Búsqueda por tema](./tg/topic-search.md).

## Pagina los resultados

La respuesta indica si hay más resultados (`has_more`). Eso describe la página, no si la mensajería guarda más. Repite el mismo comando con los mismos filtros y pide la página siguiente. Qué opción lo hace depende del comando:

| Comando | Página siguiente |
| --- | --- |
| `search messages` en `tg` y `max` | `--page <n>`, contando desde 1 |
| `contacts timeline` | `--cursor <cursor>`, con el cursor de `page.next` de la respuesta |
| `mentions list`, `drive catalog list`, `drive catalog search` | `--page <n>` |
| `memo search notes`, `drive search` | `--offset <n>` |
| `memo search all`, `memo search mail`, `memo search messages` | Solo `--limit`, hasta 100: acota la consulta |

## Mantén la salida corta

- `--limit <n>` limita los resultados.
- `--json=<campos>` conserva solo los campos que nombras, por ejemplo `--json=ref,date,text`. Es la única opción
  que reduce cualquier respuesta: entre un 31% y un 64% menos que `--json` completo en [nuestra medición](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/output-size).
- `--jsonl` imprime un resultado por línea. No es más corto que `--json`. `--full` devuelve los textos completos.
- `--max-output-bytes` limita por defecto la salida automática a 4 MiB. Un resultado que supera el límite falla de forma visible en lugar de recortarse.
- `--context <n>` añade `n` mensajes vecinos a cada lado de un resultado. Vale 0 cuando la salida no es un terminal.

## Lee la evidencia y luego amplía

Abre un resultado con sus vecinos, o sigue su cadena de respuestas:

```sh
tg personal messages context "msg:telegram/1/77/42" --before-n 3 --after-n 3
tg personal messages context "msg:telegram/1/77/42" --thread
```

Si una respuesta parece escasa, lee su entrada `missing`. Indica qué no se buscó y el paso que lo arregla, como descargar un chat. Cada resultado dice dónde coincidió (`matched_in`: `text`, `transcript`, `filename` o `file`). Para comparar la cuenta con lo que esperas, `stats messages show` (en las últimas versiones) cuenta coincidencias por chat, remitente, día u hora.

## Recetas

Sustituye los nombres por los tuyos.

| Objetivo | Comando |
| --- | --- |
| Un acuerdo y su fuente | `tg personal search messages 'chat:"Book club" agreed date>=2026-10-01' --limit 5` |
| Todo sobre una persona este mes | `tg personal contacts events "Kai Sample" --since-time 2026-10-01` |
| Dónde aparece un número de teléfono | `tg personal search messages 'phone:"+1 555 010 0100"'` |
| Archivos enviados a un chat la semana pasada | `tg personal search messages 'chat:"Book club" has:file date>=2026-10-07'` |
| Qué dice un documento de Drive sobre un tema | `drive personal search 'budget' --exact --limit 5` |

Para recetas más largas: [Telegram](./tg/recipes.md) y [MAX](./max/recipes.md).

## Errores habituales

| Error | Qué pasa | Qué hacer |
| --- | --- | --- |
| Buscar antes de descargar el historial | Pocos resultados o ninguno | Descarga el chat; lee `missing` en la respuesta |
| Leer una respuesta vacía como «nunca se envió» | El archivo puede estar incompleto | Comprueba lo que la respuesta dice haber cubierto |
| Entrecomillar una frase para obtener la forma exacta | Las comillas aceptan cualquier forma de las palabras | `exact:"final invoice"` |
| `mime:application/pdf` sin comillas | La `/` inicia una expresión regular | `mime:"application/pdf"` o `filename:*.pdf` |
| `mime:` en MAX | MAX no informa del tipo de archivo | `filename:*.pdf` |
| `has:photo` para buscar lo que muestra una imagen | Solo dice que hay una foto adjunta | Búsqueda de imágenes, en inglés |
| Un campo de mensajes en una búsqueda de Drive | Drive tiene sus propios filtros | `tag:` y `--exact`, o `catalog list` |
| `From:` en lugar de `from:` | Un error | Los nombres de campo van en minúsculas |
| Preguntar en otro idioma a la búsqueda de imágenes | El modelo solo conoce el inglés | Que tu agente traduzca primero |

## Comprueba el resultado

Abre la fuente del mejor resultado y compárala con lo que recordabas. Si un tipo de contenido nunca aparece, comprueba el único paso que necesita: [Qué se indexa](./what-is-indexed.md#qué-necesita-cada-tipo). Si falta un vínculo entre registros, consulta [Cómo se vincula todo](./how-things-are-linked.md#si-falta-un-vínculo).

Siguiente: el lenguaje de consulta de [Telegram](./tg/query-language.md) o de [MAX](./max/query-language.md) lista todos los campos, ajustes preestablecidos y formas de fecha.
