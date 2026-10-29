---
title: El reranker nunca vio el mensaje que estaba puntuando
description: En chats reales, una de cada siete respuestas tenía un mensaje original tan largo que el resultado quedaba fuera de la ventana del modelo. Recortar el original a 300 caracteres lo resolvió y ahorró un 40% del trabajo.
date: 2026-10-27
tags: [search, benchmarks]
cover: ./cover.jpg
coverAlt: "Un chat impreso bajo una máscara negra con la etiqueta 512 tokens: la ventana solo muestra un mensaje largo bajo una lupa, y una nota verde con la respuesta corta queda medio oculta bajo la máscara"
author: viacheslav-ptsarev
series: laptop-search
draft: true
---

`search messages --discover` es la búsqueda por significado en un archivo de mensajería. Encuentra
candidatos por significado y por palabras, y después un modelo pequeño, el reranker, lee los 50 primeros y
los ordena. El reranker lee una pregunta y un fragmento cada vez y le da una puntuación al par.

Un mensaje de chat suele ser demasiado corto para juzgarlo solo. «Sí, envíalo el viernes» no significa
nada sin el mensaje al que responde. Por eso cada fragmento se construía así: el chat, el autor y la
fecha, después el mensaje al que se responde y, al final, el resultado encontrado. El modelo lee como
mucho 512 tokens, y la entrada se recortaba para caber.

## La ventana terminaba antes del resultado

El mensaje original iba primero y el resultado, al final. Cuando el original era largo, el recorte se
llevaba el final de la entrada, y el final era el resultado.

En un chat real, 18 de los 119 pares con mensaje original estaban así: el original por sí solo era más
largo que la ventana. En esos pares el reranker puntuaba el mensaje al que se respondía. Nunca vio el
mensaje encontrado.

Nada parecía roto. Las respuestas a las preguntas conocidas seguían arriba, porque el original y la
respuesta suelen tratar de lo mismo. El fallo apareció solo al contar los tokens de cada par.

## Por qué el conjunto de prueba no lo detectó

Nuestro conjunto sintético de evaluación también tiene respuestas y originales, pero su par más largo no
llega a 256 tokens y su mediana es 38. Los pares reales tienen una mediana de 153 tokens, y uno de cada
diez supera los 762. Un conjunto de mensajes cortos y ordenados no puede fallar así.

## Nueve formas de recortar la entrada

Pasamos por ese chat las seis preguntas cuyas respuestas conocemos, con nueve formas de entrada; abajo se
muestran seis, las otras tres las combinan. Contamos las preguntas que mantienen una respuesta directa
entre las cinco primeras y el tiempo de CPU por llamada.

| Entrada | Respuesta directa entre las 5 primeras | CPU por llamada |
| --- | ---: | ---: |
| Original, luego resultado, recorte a 512 tokens (antes) | 6 de 6 | 27,1 s |
| Recorte a 256 tokens | 6 de 6 | 16,3 s |
| Recorte a 128 tokens | 6 de 6 | 12,9 s |
| Resultado, luego original | 6 de 6 | 22,6 s |
| **Original recortado a 300 caracteres, luego resultado** | **6 de 6** | **16,0 s** |
| Sin original | 5 de 6 | 14,9 s |

Sin el original se perdió una respuesta: el contexto importa. Un límite de tokens más corto también
mantuvo las respuestas, pero sigue recortando por el final, así que un original lo bastante largo vuelve
a empujar el resultado fuera. Recortar solo el original, a 300 caracteres, mantuvo todas las respuestas,
garantizó que el resultado siempre entra en la ventana, dejó la mayor cantidad de resultados pertinentes
entre los cinco primeros (26 de 30) y costó alrededor de un 40% menos de CPU.

## Qué cambió

Core ahora recorta el mensaje al que se responde a 300 caracteres antes de construir el par. El reranker
siempre lee el resultado, con lo suficiente del original para saber a qué responde.

Seis preguntas en un chat es una muestra pequeña. Lo importante no es la cifra exacta, sino la forma del
fallo: una entrada del modelo que se recorta por el final, con lo importante colocado al final.

## Notas

- Las mediciones, la configuración y los scripts:
  [velocidad del reranker, sección «Reranker input»](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md#reranker-input-how-much-of-the-replied-to-message).
- Los mensajes reales se usaron solo como totales; las preguntas y las filas por pregunta siguen siendo
  privadas.
