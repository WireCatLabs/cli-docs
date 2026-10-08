---
title: "Clasificar mensajes guardados y autores"
---

Las estadísticas usan `stats → resource → view`. El ejecutable es `tg`. Los comandos leen el almacén local y no se conectan por defecto. Descarga primero el historial pertinente; una clasificación describe los datos disponibles, no toda la actividad del mensajero.

```sh
tg stats messages top 'chat:room date:[2026-10-01 TO 2026-10-08}' --measure reactions --limit 10 --json
tg stats contacts top 'chat:room date:[2026-10-01 TO 2026-10-08}' --score helpful --min-messages 3 --json
tg stats contacts top --weights '{"messages":0.4,"active-days":0.6}' --timezone Europe/Madrid --json
```

## Métricas y puntuaciones

| Objeto | Métricas | Por defecto |
|---|---|---|
| Mensajes | views, reactions, forwards, comments, replies, thread-size | reactions |
| Autores humanos | messages, words, reactions, replies, answers, answer-time, threads, active-days | messages |

`answer-time` ordena de menor a mayor por la mediana en milisegundos; las demás métricas ordenan de mayor a menor. `--message-kind posts` o `comments` selecciona tipos confirmados antes de agregar. Los vínculos antiguos desconocidos se indican en lugar de suponerse. Los comentarios vinculados de un canal pueden estar en un grupo de discusión guardado; la respuesta enumera los chats de discusión incluidos adicionalmente y su cobertura.

`--score helpful` da pesos de 0,5 a las respuestas acreditadas, 0,25 a las respuestas de otros y 0,25 a las reacciones. `--score active` da pesos de 0,6 a los días activos y 0,4 a los mensajes. Ambos se aplican a autores. `--score engaging` da el mismo peso a reacciones y respuestas de otros; las puntuaciones de autores usan tasas por mensaje y exigen cinco mensajes seleccionados salvo que `--min-messages` cambie ese umbral. `--weights` sustituye todos los pesos del preajuste. Los nombres deben ser componentes admitidos para el objeto, los pesos finitos y no negativos, y al menos uno positivo. `--measure` es incompatible con las puntuaciones.

La versión 1 de la puntuación normaliza cada componente frente al máximo de todas las filas elegibles antes de `--limit`: `100 × sum(weight × value / maximum) / sum(weight)`. Un máximo cero aporta cero. Si faltan componentes con peso positivo, la fila queda excluida de la puntuación. Un peso cero ignora ese componente. La respuesta incluye máximos, valores de componentes, aportaciones y recuentos de exclusiones.

## Alcance y calidad

Las consultas usan Lucene estricto con `--chat`, `--source`, `--exact` y `--timezone`, como la búsqueda de mensajes. Una página de clasificación contiene de 1 a 100 filas. Las condiciones de texto y autor seleccionan los mensajes clasificados; el contexto de respuestas usa mensajes guardados autorizados del mismo periodo, sin esos filtros de texto o autor. Las métricas de grafo rechazan ramas de fechas ambiguas: usa un intervalo de fechas positivo común.

Los contadores de vistas, reacciones, reenvíos y comentarios son instantáneas acumulativas guardadas. Vistas, reacciones y comentarios indican hora y frescura por campo cuando proceden de una lectura autorizada; los reenvíos carecen de esa observación; un filtro de fechas selecciona mensajes, no reacciones recibidas durante ese periodo. Los contadores desconocidos se distinguen del cero. Los totales de reacciones de autores pueden ser parciales, con recuentos de mensajes conocidos y desconocidos. `--sync-first` está sujeto a comprobaciones y límites; descarga mensajes nuevos y no actualiza contadores antiguos.

Las respuestas se identifican mediante una heurística: una pregunta contiene `?` tras quitar las URL, y se acredita su primera respuesta directa de otro autor humano conocido. No cuentan las respuestas propias ni las identidades de canal. Las palabras usan secuencias de letras o dígitos de la versión 1, sin URL. Los días activos usan la zona horaria elegida. La cobertura y la calidad del grafo indican cuándo el historial disponible está incompleto. Ninguna métrica demuestra utilidad.

## Seguir las pruebas

Cada fila devuelve `drilldown.selection` y los `drilldown.evidence.arguments` exactos de su comando de pruebas. Pasa esa selección como JSON con el localizador de mensaje o el ID de persona en el servicio que se devuelve:

```sh
tg stats messages evidence msg:telegram/fixture/room/101 --selection "$selection" --component replies --limit 20 --json
tg stats contacts evidence 42 --selection "$selection" --component answers --limit 20 --json
```

Las respuestas incluyen el mensaje al que responden; las respuestas acreditadas incluyen la pregunta y su respuesta. Las métricas de instantáneas muestran mensajes medidos, no listas de lectores ni de personas que reaccionaron. Las pruebas `messages` de un autor muestran todos los mensajes seleccionados incluso al clasificar por puntuación. Las pruebas de días activos enumeran los mensajes subyacentes; sus aportaciones de una por mensaje no se suman como días distintos.

Las pruebas incluyen `total`, `included`, `hasMore` y `nextCursor`. Continúa con los mismos argumentos y `--cursor`. Si cambia una fila que contribuye al resultado, se rechaza el cursor; reinicia sin él. Cada página conserva filas completas dentro de un presupuesto de 64 KiB para items. Una fila demasiado grande remite a `messages show`. El cálculo de la huella está limitado a 50 000 filas y 8 MiB de entradas guardadas; reduce los chats o las fechas si la consulta supera el límite. El JSON de selección está limitado a 64 KiB.

## Preguntas y publicaciones que necesitan atención

Estos informes están disponibles en tg 0.36.0. Actualiza la CLI instalada si falta el comando.

Tras descargar el historial necesario, pide al agente las preguntas del club que llevan más de
un día esperando y que abra los mensajes originales. Los informes leen el archivo guardado;
un resultado vacío no demuestra que no hubiera preguntas si falta historial.

```sh
tg stats messages unanswered --chat Club --older-than 24h --json
tg stats contacts responses --chat Club --answerer 42 --answerer 73 --json
tg stats chats newcomers Club --since-time 2026-10-01T00:00:00Z --within 7d --json
tg stats messages discussion --chat News --min-views 100 --max-replies 0 --json
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
su frescura se indica por campo y los registros antiguos quedan unknown. No se sustituyen por cero los contadores o enlaces ausentes.
Una discusión enlazada necesita enlaces guardados y el historial de su grupo.

Cada fila incluye `drilldown.command` y argumentos exactos. Ejecuta el comando `evidence`
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

## Guardar una clasificación resuelta

```sh
tg searches create weekly --selection "$selection"
tg stats contacts top --saved weekly --limit 20 --json
```

Usa el objeto correspondiente de mensajes o contactos. Los ID resueltos y los límites de fecha quedan fijados; las palabras adicionales reducen el alcance guardado. Las opciones de clasificación que indiques sustituyen a las guardadas. Las selecciones fijadas leen los datos disponibles y rechazan `--sync-first`; ejecuta una consulta normal para actualizar. El historial guarda parámetros, no el contenido de los resultados. Las pruebas nunca se registran en el historial de búsqueda.

MCP descubre e invoca las mismas rutas mediante las tres herramientas existentes. Allí la selección es un objeto estructurado. Consulta el [contrato de comandos](https://github.com/leemour/cli-messaging/blob/main/docs/plans/2026-10-07-rankings-contract.md) y el [estándar de la CLI](https://github.com/leemour/cli-messaging/blob/main/docs/dev/STANDARD.md) para la interfaz pública y las referencias a estándares.

## Retención a partir de listas observadas

Pide al agente que muestre qué recién llegados de Club seguían observados tras uno, siete y treinta días y quiénes escribieron en su primera semana. Se necesitan fechas de incorporación conocidas y listas guardadas; la primera aparición no sustituye la fecha de entrada. Los registros antiguos no reciben listas inventadas.

```sh
tg stats chats retention Club --checkpoints 1d,7d,30d --within 7d --timezone Europe/Madrid --json
```

Por defecto se agrupan las entradas de los últimos 90 días por semanas desde el lunes. `--by day`, `--since-time` y `--until-time` cambian las cohortes. Elige hasta diez duraciones de control positivas y crecientes. Cada control usa la primera lista guardada en la fecha objetivo o después, dentro de las siguientes 24 horas; las pruebas muestran hora y demora. Una lista parcial puede demostrar presencia, pero solo una lista completa demuestra ausencia. Sin observación válida el resultado es unknown; un control futuro es pending. La tasa usa el denominador observable y muestra eligible, unknown y pending aparte. Estos controles no prueban una pertenencia ininterrumpida.

La salida ocurre después de la última presencia observada y como máximo en la primera ausencia completa. Si el intervalo cruza el fin de la primera semana, se desconoce la salida temprana. Una reincorporación inicia otra estancia. Un mensaje guardado demuestra actividad observada; sin mensaje solo hay no-observed-message. `archiveCovered` indica la cobertura del período; datos incompletos no permiten deducir el porcentaje de miembros silenciosos de todo el grupo. Copia el `drilldown` de una cohorte en `stats messages evidence --component report`. Las páginas de pruebas se limitan a 64 KiB; la selección fija la fecha de cálculo y nuevas observaciones requieren otro informe.

## Comprobar y actualizar contadores

Pide al agente que compruebe la edad de vistas y reacciones, muestre una vista previa de hasta veinte mensajes y actualice esos objetivos exactos. Las fechas de envío y guardado no establecen la fecha de observación del contador.

```sh
tg stats messages counters show --chat Club --counters views,reactions --max-age 24h --limit 20 --json
tg stats messages counters refresh --chat Club --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

`show` lee el archivo localmente. Cada campo indica valor, `observedAt`, origen, edad y `freshness`: `fresh`, `stale` o `unknown`; el umbral predeterminado es de 24 horas. Un valor ausente no es cero y actualizar vistas no renueva reacciones. La `selection` devuelta fija ubicaciones exactas; pasa su JSON con `--selection`, sin otra consulta ni opciones de ámbito.

`refresh` lee el mensajero y guarda observaciones localmente. Requiere un chat explícito o una selección y usa solo la cuenta activa. Por defecto: veinte mensajes y 30 segundos; máximo: 100 mensajes y cinco minutos. `--dry-run` muestra objetivos exactos y campos admitidos sin conectar. Requiere permiso de lectura de mensajes y escritura `stats.messages.counters.refresh`. Telegram admite views, reactions y comments cuando el mensaje remoto los proporciona; las lecturas son exactas y nunca incrementan vistas. Los campos ausentes y errores parciales quedan explícitos. No envía mensajes, no marca lecturas, no incrementa vistas y conserva textos, respuestas, adjuntos y mensajes eliminados. Un escritor antiguo que cambie un valor sin observación deja su frescura en unknown.

Tras actualizar, repite show para la selección devuelta y revisa las fechas de cada campo. Los contadores acumulados siguen sin indicar las vistas o reacciones recibidas durante el período del filtro de fechas.
