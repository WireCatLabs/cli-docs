---
title: "Clasificaciones de mensajes y autores"
---

Las estadísticas siguen `stats → ресурс → вид`: `stats messages top` y `stats contacts top`. Estos comandos leen el archivo local sin conectarse. Descarga primero el historial necesario; los resultados describen los datos guardados, no todo tu historial de conversaciones de MAX.

```sh
max stats messages top 'chat:Работа date:[2026-10-01 TO 2026-10-08}' --measure reactions --limit 10 --json
max stats contacts top --chat Работа --score helpful --min-messages 3 --json
max stats contacts top --weights '{"messages":0.4,"active-days":0.6}' --timezone Europe/Madrid --json
```

## Métricas y puntuaciones

Las métricas de mensajes son `views`, `reactions` (predeterminada), `forwards`, `comments`, `replies` y `thread-size`. Las de autores son `messages` (predeterminada), `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads` y `active-days`. La mediana de `answer-time` se mide en milisegundos y se ordena de menor a mayor; las demás métricas, de mayor a menor.

`helpful` pondera las respuestas a preguntas con 0,5, las respuestas de otras personas con 0,25 y las reacciones con 0,25. `active` pondera los días activos con 0,6 y los mensajes con 0,4. `engaging` pondera por igual las reacciones y las respuestas de otras personas; para autores, son valores por mensaje, con un mínimo de cinco mensajes salvo que se establezca `--min-messages`. `--weights` sustituye todos los pesos; `--measure` no se puede combinar con score/weights.

Puntuación v1: `100 × sum(weight × value / maximum) / sum(weight)`. Los máximos se calculan sobre toda la selección válida antes de `--limit`. Un máximo de cero aporta cero. Los valores desconocidos de componentes con peso positivo excluyen la fila de la puntuación; un peso de cero ignora el componente. La respuesta muestra componentes, máximos, exclusiones y calidad de los datos.

## Selección y calidad

`--message-kind posts|comments` selecciona un tipo de mensaje confirmado antes del recuento. Las filas antiguas sin información de relaciones siguen siendo desconocidas. Las consultas usan Lucene estricto; funcionan `--chat`, `--source`, `--exact` y `--timezone`. El límite es de 1 a 100 filas. Las métricas de respuestas requieren un intervalo de fechas positivo común; se rechazan las ramas de fechas ambiguas.

Los contadores de vistas, reacciones y reenvíos son instantáneas acumuladas cuya actualidad se desconoce. Los filtros de fechas seleccionan mensajes, no las reacciones del periodo. Un valor desconocido es distinto de cero. El total de reacciones de un autor puede ser parcial: la respuesta muestra cuántas instantáneas son conocidas y desconocidas. `--sync-first` comprueba permisos y descarga mensajes nuevos dentro de los límites indicados, pero no actualiza los contadores de mensajes antiguos. Se devuelve explícitamente la cobertura del archivo y del grafo de relaciones.

Una «respuesta a una pregunta» es una heurística: la pregunta contiene `?` después de eliminar las URL, y cuenta la primera respuesta directa de otra persona conocida. No cuentan las respuestas a uno mismo ni las identidades de canales. Las palabras son secuencias de letras o dígitos sin URL; los días activos usan la zona horaria elegida.

## Mensajes originales

Cada fila incluye `drilldown.selection` y los argumentos exactos del comando evidence. Pasa selection como JSON y el identificador de la fila:

```sh
max stats messages evidence msg:max/fixture/room/101 --selection "$selection" --component replies --limit 20 --json
max stats contacts evidence 42 --selection "$selection" --component answers --limit 20 --json
max searches create weekly --selection "$selection"
max stats contacts top --saved weekly --limit 20 --json
```

Evidence muestra mensajes y pares de pregunta y respuesta. Las instantáneas de contadores no se convierten en listas de personas que vieron el mensaje o reaccionaron. El componente `messages` de un autor muestra todos los mensajes seleccionados incluso al clasificar por puntuación. La evidencia de días activos contiene los mensajes originales, por lo que sus aportaciones individuales no suman el número de días distintos.

Para continuar, usa los mismos argumentos y añade `--cursor` de `nextCursor`. Si los datos cambian, empieza de nuevo sin cursor. La respuesta incluye `total`, `included` y `hasMore`. El presupuesto de items es de 64 KiB y conserva filas completas; usa `messages show` para una fila demasiado grande. Fingerprint está limitado a 50 000 filas y 8 MiB de entrada; reduce el chat o el intervalo de fechas si se supera. Selection está limitado a 64 KiB.

## Clasificaciones guardadas

Una selection guardada fija los ID y las fechas permitidos; las palabras nuevas reducen la selección. Los parámetros explícitos de clasificación sustituyen a los guardados. `--sync-first` no está disponible para selecciones fijadas. El historial guarda parámetros, no resultados; evidence no se registra en el historial. MCP usa las mismas rutas mediante `max_read`, pasando selection como objeto.

[Especificación compartida detallada](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) y [estándar de CLI](https://github.com/leemour/cli-messaging/blob/main/docs/dev/STANDARD.md).
