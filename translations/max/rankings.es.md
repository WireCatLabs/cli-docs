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

Los contadores de vistas, reacciones y reenvíos son instantáneas acumuladas. Vistas, reacciones y comentarios indican frescura por campo; registros antiguos quedan unknown y reenvíos no tienen observación propia. Los filtros de fechas seleccionan mensajes, no las reacciones del periodo. Un valor desconocido es distinto de cero. El total de reacciones de un autor puede ser parcial: la respuesta muestra cuántas instantáneas son conocidas y desconocidas. `--sync-first` comprueba permisos y descarga mensajes nuevos dentro de los límites indicados, pero no actualiza los contadores de mensajes antiguos. Se devuelve explícitamente la cobertura del archivo y del grafo de relaciones.

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
su frescura se indica por campo; sin hora de observación es unknown. No se sustituyen por cero los contadores o enlaces ausentes.
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

## Retención a partir de listas observadas

Pide al agente que muestre qué recién llegados de Club seguían observados tras uno, siete y treinta días y quiénes escribieron en su primera semana. Se necesitan fechas de incorporación conocidas y listas guardadas; la primera aparición no sustituye la fecha de entrada. Los registros antiguos no reciben listas inventadas.

```sh
max stats chats retention Клуб --checkpoints 1d,7d,30d --within 7d --timezone Europe/Madrid --json
```

Por defecto se agrupan las entradas de los últimos 90 días por semanas desde el lunes. `--by day`, `--since-time` y `--until-time` cambian las cohortes. Elige hasta diez duraciones de control positivas y crecientes. Cada control usa la primera lista guardada en la fecha objetivo o después, dentro de las siguientes 24 horas; las pruebas muestran hora y demora. Una lista parcial puede demostrar presencia, pero solo una lista completa demuestra ausencia. Sin observación válida el resultado es unknown; un control futuro es pending. La tasa usa el denominador observable y muestra eligible, unknown y pending aparte. Estos controles no prueban una pertenencia ininterrumpida.

La salida ocurre después de la última presencia observada y como máximo en la primera ausencia completa. Si el intervalo cruza el fin de la primera semana, se desconoce la salida temprana. Una reincorporación inicia otra estancia. Un mensaje guardado demuestra actividad observada; sin mensaje solo hay no-observed-message. `archiveCovered` indica la cobertura del período; datos incompletos no permiten deducir el porcentaje de miembros silenciosos de todo el grupo. Copia el `drilldown` de una cohorte en `stats messages evidence --component report`. Las páginas de pruebas se limitan a 64 KiB; la selección fija la fecha de cálculo y nuevas observaciones requieren otro informe.

## Comprobar y actualizar contadores

Pide al agente que compruebe la edad de vistas y reacciones, muestre una vista previa de hasta veinte mensajes y actualice esos objetivos exactos. Las fechas de envío y guardado no establecen la fecha de observación del contador.

```sh
max stats messages counters show --chat Клуб --counters views,reactions --max-age 24h --limit 20 --json
max stats messages counters refresh --chat Клуб --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

`show` lee el archivo localmente. Cada campo indica valor, observedAt, origen, edad y freshness: fresh, stale o unknown; el umbral predeterminado es de 24 horas. Un valor ausente no es cero y actualizar vistas no renueva reacciones. La selección devuelta fija ubicaciones exactas; pasa su JSON con `--selection`, sin otra consulta ni opciones de ámbito.

`refresh` lee el mensajero y guarda observaciones localmente. Requiere un `--chat` explícito o una selección y usa solo la cuenta activa. Por defecto: veinte mensajes y 30 segundos; máximo: 100 mensajes y cinco minutos. Dry-run muestra objetivos exactos y campos admitidos sin conectar. Requiere permiso de lectura de mensajes y escritura `stats.messages.counters.refresh`. MAX admite views y reactions; comments no está admitido. Los campos ausentes y errores parciales quedan explícitos. No envía mensajes, no marca lecturas, no incrementa vistas y conserva textos, respuestas, adjuntos y mensajes eliminados. Un escritor antiguo que cambie un valor sin observación deja su frescura en unknown.

Tras actualizar, repite show para la selección devuelta y revisa las fechas de cada campo. Los contadores acumulados siguen sin indicar las vistas o reacciones recibidas durante el período del filtro de fechas.
