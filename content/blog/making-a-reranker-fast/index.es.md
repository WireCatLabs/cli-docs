---
title: Cómo acelerar un reranker en un portátil, en cuatro actos
description: Procesar por lotes un reranker cuantizado cambió sus respuestas, no su velocidad. Una biblioteca nativa lo hizo 2 veces más rápido, no 10. Distribuirla no necesitó paquetes npm nuevos, y para Windows la biblioteca que hacía falta solo estaba dentro de un archivo npm.
date: 2026-10-27
tags: [search, benchmarks, cli]
cover: ./cover.jpg
coverAlt: Un portátil ordena una lista de barras; a su lado suben cuatro fichas en escalera y hay cinco chips con marcas verdes
draft: true
---

Nuestras CLI buscan en un archivo de mensajería en el propio ordenador del dueño.
`search messages --discover` encuentra candidatos por significado y por palabras, y después un modelo
pequeño, el reranker (mMARCO, 8 bits), lee los 50 primeros y los ordena. Cuando el reranker pasó a estar
activado por defecto, `--discover` pasó de 1,9 a 5,1 s en un archivo real. Estas son las cuatro cosas que
hicimos y lo que nos enseñó cada una.

## Primer acto: los lotes cambiaron las respuestas, no la velocidad

La solución obvia es puntuar los 50 pares por lotes: una pasada del modelo para muchos pares en lugar de
una por par. En WebAssembly ahorró como mucho un 15%, y solo con los pares ordenados por longitud. Con
longitudes mezcladas fue más lento: cada par se rellena hasta el más largo, y el relleno cuesta tanto como
el texto.

Peor aún, las puntuaciones se movieron. El mismo par obtuvo 0,04 solo, 0,48 rellenado hasta 200 tokens y
0,34 junto a otro par. El modelo de 8 bits probablemente fija su rango a partir de toda la entrada de cada
pasada, así que los vecinos de lote cambian la puntuación de un par. Un orden que depende de qué
resultados comparten lote no es un orden. Mantuvimos un par por pasada.

| Puntuar 50 pares de longitud mixta | Tiempo | Mayor cambio de puntuación |
| --- | ---: | ---: |
| Uno a uno | 1,54 s | — |
| Lotes de 5, ordenados por longitud | 1,33 s | 1,01 |
| Un lote de 50 | 2,37 s | 0,85 |

## Segundo acto: lo nativo fue 2 veces más rápido, no 10

Después ejecutamos los mismos modelos con la biblioteca nativa de ONNX Runtime en lugar de su versión
para WebAssembly. Una prueba con textos cortos prometía de 4 a 10 veces. En el archivo real, `--discover`
pasó de 4,58 a 3,20 s, con una respuesta directa entre las cinco primeras en 6 de 6 preguntas conocidas en
ambos casos.

La diferencia está en la longitud de la entrada. La entrada real del reranker lleva el chat, el autor, la
fecha y el mensaje al que se responde: una mediana de 153 tokens, y una de cada diez supera los 762. La
mediana del conjunto sintético era 48. Por par, lo nativo fue de 2 a 2,5 veces más rápido. Las pruebas con
textos cortos exageran la ganancia para textos largos.

Más tarde recortamos el mensaje al que se responde a 300 caracteres (esa historia tiene su propio
artículo). Con ambos cambios, la CLI publicada ejecutó `--discover` en 2,91 s en nativo frente a 4,10 s
con WebAssembly.

## Tercer acto: sin paquetes nuevos

Lo habitual para llevar una biblioteca nativa a los usuarios de npm es un paquete por plataforma. No
queríamos publicar cinco paquetes nuevos ni agrandar la instalación de quien nunca descarga un modelo.

El paquete npm `onnxruntime-node` tiene dos partes por plataforma: un conector de 0,4 MB
(`onnxruntime_binding.node`) y la biblioteca. El conector busca la biblioteca en su propia carpeta. Así
que los conectores viajan dentro de un paquete que ya publicamos, y la biblioteca se descarga con los
modelos desde el archivo oficial de la versión de Microsoft, comprobada con un hash sha256 fijado. Una
búsqueda nunca descarga nada: la biblioteca llega solo cuando el usuario ejecuta `models download`. Si
falta o no carga, los modelos funcionan con WebAssembly como antes. En 450 pares las puntuaciones
coincidieron exactamente con las de la biblioteca del propio paquete npm.

## Cuarto acto: la biblioteca de Windows solo estaba dentro de un archivo npm

En Windows el mismo truco falló. El conector de Windows importa una función de `onnxruntime.dll` por
número, no por nombre: el ordinal 4, la función de configuración de DirectML, la capa de Windows para la
tarjeta gráfica. La DLL de la versión de Microsoft es la compilación normal, sin esa función, así que el
conector se negaba a cargarla.

La compilación con DirectML de la versión 1.30.0 no está en el archivo de la versión de Microsoft, y su
paquete NuGet se queda en una versión anterior. La encontramos en un solo sitio: dentro del propio
archivo npm de `onnxruntime-node`, de 113,5 MB. Por eso en Windows `models download` descarga ese
archivo una vez, conserva la única DLL y la comprueba con su propio hash fijado. La parte de DirectML solo
se carga si se usa.

Después lo comprobamos de verdad. Un nuevo flujo de CI descarga la biblioteca y ejecuta dos modelos de
prueba diminutos en nativo en Linux x64 y arm64, macOS con Apple silicon, Windows x64 y Windows arm64.
También comprueba que a Alpine Linux, que no tiene compilación, no se le ofrece nada y sigue con
WebAssembly. Los seis pasan; las tareas de Windows tardan entre 1,5 y 2 minutos.

## Lo que le diríamos a quien haga lo mismo

- Mide con la longitud real de tus entradas. El texto sintético corto hacía que la biblioteca nativa
  pareciera hasta cinco veces mejor de lo que es.
- No proceses por lotes un modelo con cuantización dinámica si las puntuaciones de distintos pares deben
  ser comparables.
- Una biblioteca nativa se puede descargar bajo demanda, fijada por hash, con WebAssembly como respaldo.
  Puede que no necesites un paquete por plataforma.
- Comprueba la biblioteca en cada sistema en CI. Leer la lista de archivos del paquete no es lo mismo que
  cargarla.

## Notas

Las mediciones, la configuración y los scripts son públicos:
[velocidad del reranker](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md).
Los mensajes reales se usaron solo como totales; las preguntas y las filas por pregunta siguen siendo
privadas.
