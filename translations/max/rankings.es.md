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

## Preguntas y publicaciones que necesitan atención

Estos informes están disponibles en MAX 0.35.0. Actualiza la CLI instalada si falta el comando.

Tras descargar el historial necesario, pide al agente las preguntas del club que llevan más de
un día esperando y que abra los mensajes originales. Los informes leen el archivo guardado;
un resultado vacío no demuestra que no hubiera preguntas si falta historial.

```sh
max stats messages unanswered --chat Клуб --older-than 24h --json
max stats contacts responses --chat Клуб --answerer 42 --answerer 73 --json
max stats chats newcomers Клуб --since-time 2026-10-01T00:00:00Z --within 7d --json
max stats messages discussion --chat Новости --min-views 100 --max-replies 0 --json
```

`unanswered` ordena las preguntas por edad. Una pregunta contiene `?` fuera de enlaces;
es una heurística. Solo cuenta una respuesta directa explícita de otra persona identificable.
Una respuesta posterior puede contar aunque su fecha/texto no coincida con el filtro de preguntas.
No cuentan las respuestas a uno mismo ni el siguiente hablante sin enlace de respuesta.
`no-observed-answer` indica que no hay respuesta válida en el historial guardado.

`responses` requiere `--answerer` repetido: personas elegidas por el usuario, sin verificar su
antiguo papel de administrador. Devuelve el número de respuestas y la mediana/p90 del tiempo
en milisegundos; sin respuestas, los tiempos son null. P90 usa el rango más próximo redondeado
hacia arriba. Sin `--answerer`, unanswered/newcomers aceptan cualquier otra persona identificable.
Los ids simples requieren una cuenta en el ámbito; para varias, usa `person:<provider>/<account>/<id>`.

`newcomers` toma por defecto las entradas de los últimos 30 días y las preguntas de los siete días
posteriores a una entrada conocida. `--until-time` cierra el período de entradas. La primera
observación no sustituye la fecha de entrada: esas personas figuran en `summary.unknownJoin`.
Una nueva entrada genera otra estancia. Se indican los plazos de ayuda pendientes y el historial
incompleto de miembros; no tener preguntas guardadas no significa que no hiciera falta ayuda.

`discussion` examina publicaciones guardadas de canales y compara vistas acumuladas conocidas
con respuestas directas guardadas. Las instantáneas de comments se muestran por separado;
su antigüedad es desconocida. No se sustituyen por cero los contadores o enlaces ausentes.
Una discusión enlazada necesita enlaces guardados y el historial de su grupo.

Cada fila incluye `drilldown.command` y argumentos exactos. Ejecuta el comando evidence
de messages/contacts indicado con `--component report` y la selección devuelta. Sigue
`nextCursor` con los mismos argumentos; se conserva la fecha límite de observación.
Si cambian los datos, genera otro informe. Las pruebas caben en64 KiB; reduce chats/fechas si
superas50 000 nodos u 8 MiB. Revisa `quality.archives` y `quality.graph`, y abre el locator con
`messages show` para comprobar el contexto.

Guarda la selección con `searches create waiting --selection "$selection"` y repite el mismo
informe con `--saved waiting`. Se mantienen cuentas, chat, fechas de preguntas y personas que
responden; las opciones explícitas sustituyen las guardadas. Cada ejecución toma una nueva fecha
límite de observación. Se rechaza otro tipo de informe. El historial guarda parámetros/selecciones,
nunca los mensajes resultantes; no registra las pruebas.

## Clasificaciones guardadas

Una selection guardada fija los ID y las fechas permitidos; las palabras nuevas reducen la selección. Los parámetros explícitos de clasificación sustituyen a los guardados. `--sync-first` no está disponible para selecciones fijadas. El historial guarda parámetros, no resultados; evidence no se registra en el historial. MCP usa las mismas rutas mediante `max_read`, pasando selection como objeto.

[Especificación compartida detallada](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) y [estándar de CLI](https://github.com/leemour/cli-messaging/blob/main/docs/dev/STANDARD.md).
