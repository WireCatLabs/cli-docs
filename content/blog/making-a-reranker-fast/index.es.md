---
title: Cómo hice más rápido un reranker en mi propio ordenador
description: Cuando activé el reranker por defecto, la búsqueda por significado de WireCat pasó de 1.9 a 5.1 segundos. Los lotes casi no ayudaron y cambiaron las puntuaciones, ONNX Runtime nativo puntuó 2 veces más rápido, no 10, y la DLL para Windows solo estaba dentro de un archivo npm.
date: 2026-11-18
tags: [search, benchmarks, cli]
cover: ./cover.jpg
coverAlt: "Un montón de 50 mensajes impresos con la etiqueta top 50, uno leído con una lupa, 5 ordenados con el primero marcado en verde, un cronómetro en 3.2 segundos"
author: viacheslav-ptsarev
series: laptop-search
glance:
  - value: "4.6 s → 3.2 s"
    label: "--discover en un archivo real, con WebAssembly y en nativo"
    href: "#en-nativo-puntuó-2-veces-más-rápido-no-10"
  - value: "≤ 15%"
    label: "lo máximo que ahorraron los lotes, y las puntuaciones se movieron"
    href: "#los-lotes-ahorraron-un-15-y-movieron-las-puntuaciones"
  - value: "113.5 MB"
    label: "el archivo npm del que saco una DLL para Windows"
    href: "#en-windows-la-dll-tuvo-que-salir-de-un-archivo-npm"
  - value: "5 + Alpine"
    label: "sistemas donde CI ejecuta los modelos en nativo, Alpine sigue en WebAssembly"
    href: "#en-windows-la-dll-tuvo-que-salir-de-un-archivo-npm"
draft: false
---

Cuando activé el reranker por defecto en la búsqueda de WireCat, `search messages --discover` en mi archivo pasó de 1.9 a 5.1 segundos. Probé las 2 cosas obvias: lotes, y ONNX Runtime nativo en lugar de WebAssembly. Los lotes casi no ayudaron y encima cambiaron las puntuaciones, y en nativo la puntuación fue 2 veces más rápida, cuando mi estimación decía 4-10. Y en Windows la DLL que necesitaba solo estaba dentro de un archivo npm de 113.5 MB, así que tuve que sacarla de ahí.

`--discover` busca candidatos por significado y por palabras, y luego un modelo pequeño, mMARCO (8 bits), lee los 50 primeros y los ordena, eso es el reranker. Todo corre en local, en la máquina del usuario, sin nube.

## Los lotes ahorraron un 15% y movieron las puntuaciones

Primero probé no ejecutar el modelo 50 veces, una pareja (pregunta y mensaje) cada vez, sino darle las parejas en lotes. En WebAssembly eso ahorró un 15% como mucho, y solo con las parejas ordenadas por longitud. Con parejas de longitudes distintas en un lote iba incluso más lento, porque cada pareja se rellena hasta la más larga y el relleno cuesta lo mismo que el texto real.

Y las puntuaciones cambiaron. La misma pareja sacó 0.04 sola, 0.48 rellenada hasta 200 tokens y 0.34 junto a otra pareja. Creo que el modelo de 8 bits ajusta su rango de valores a toda la entrada de cada ejecución (cuantización dinámica), así que los vecinos del lote mueven la puntuación. Es una hipótesis, no lo investigué más. Pero aunque la causa sea otra, el orden de los resultados dependería de qué mensajes cayeron por azar en el mismo lote, así que me quedé con una pareja por ejecución.

| 50 parejas de longitudes distintas | Tiempo | Mayor cambio de puntuación |
| --- | ---: | ---: |
| Una a una | 1.54 s | |
| Lotes de 5, ordenados por longitud | 1.33 s | 1.01 |
| Lotes de 5, en orden de llegada | 2.12 s | 0.78 |
| Un lote de 50 | 2.37 s | 0.85 |

El texto de esta medición es sintético, las puntuaciones están en logits. La opción más rápida además mueve las puntuaciones más que las demás de la tabla, y los lotes de 25 las movían hasta 1.34. Solo medí en WebAssembly, si los lotes en nativo se comportan igual no lo comprobé.

## En nativo puntuó 2 veces más rápido, no 10

Después ejecuté los mismos modelos con la biblioteca nativa de ONNX Runtime en lugar de WebAssembly. Esperaba 4-10 veces, porque la versión de Python puntuaba 50 parejas sintéticas cortas en 0.2 segundos, y WebAssembly tardaba 0.9-1.7 en mi caso. Pero estaba comparando runtimes distintos de ejecuciones distintas. Cuando ejecuté Node con la biblioteca nativa y WebAssembly con las mismas parejas, salió 0.25-0.30 segundos contra 0.60, o sea 2-2.4 veces.

En un archivo real salió igual. El reranker no lee solo el mensaje, también recibe el chat, el autor y el mensaje al que responde, así que la mediana fue de 153 tokens contra 48 en el conjunto sintético, y una de cada diez parejas pasaba de 762. Por pareja, nativo es 2-2.5 veces más rápido, pero el `--discover` entero pasó de 4.58 a 3.20 segundos (mediana de 18 llamadas), o sea un 30%. El resto se va en cargar los modelos y los tokenizadores (17 MB de JSON, igual en los dos runtimes), la recolección de basura y la búsqueda en sí.

Las respuestas siguieron siendo las mismas. En mis 6 preguntas de control la respuesta directa estaba entre los 5 primeros en los dos casos, y de los 30 resultados del top 5 coincidieron 29. Los casi empates a veces cambian de sitio, porque los runtimes puntúan la misma pareja de forma un poco distinta. El punto de partida aquí es 4.58 y no 5.1 porque es otra build y otra carga en la máquina, así que la comparación con 5.1 es solo aproximada.

También vi que el reranker a veces ni siquiera veía el mensaje encontrado. Esto lo medí aparte, en un solo chat. Ahí, en 18 de 119 parejas con respuesta, el mensaje al que respondía ocupaba los 512 tokens del modelo. Lo recorté a 300 caracteres, de eso escribiré aparte. Con los dos cambios, `--discover` en max 0.81.0 tardaba 2.91 segundos en nativo y 4.10 con WebAssembly.

## Distribuir lo nativo sin paquetes nuevos

Lo habitual para distribuir una biblioteca nativa por npm es un paquete aparte por plataforma. No quería más paquetes ni una instalación más pesada para quien nunca descarga modelos. `onnxruntime-node` ocupa 288 MB descomprimido, porque lleva las bibliotecas de todos los sistemas.

Para cada plataforma tiene 2 partes: un binding de 0.3-0.4 MB y la biblioteca. El binding busca la biblioteca en su propia carpeta, y eso es lo que aproveché - los bindings van en `@wirecat/cli-core-onnx`, que ya se publica, y la biblioteca se descarga con los modelos desde la release oficial de Microsoft y se comprueba contra un sha256 fijo. La búsqueda nunca descarga nada, la biblioteca aparece solo después de `models download`, y si falta o no carga, todo funciona con WebAssembly como antes. Comprobé las puntuaciones en 450 parejas, con la biblioteca de la release de Microsoft coincidieron bit a bit con la de npm.

## En Windows la DLL tuvo que salir de un archivo npm

En Windows ese truco no funcionó. El binding de Windows toma una función de `onnxruntime.dll` no por nombre sino por el número 4, y es la función de DirectML (la capa de Windows para la tarjeta gráfica). La release de Microsoft trae la build normal para CPU sin ella, y Windows respondía a la carga solo con "The operating system cannot run %1", sin una palabra sobre lo que faltaba.

El único sitio donde encontré la build con DirectML de la 1.30.0 fue dentro del propio archivo npm de `onnxruntime-node`, que pesa 113.5 MB. NuGet también la tiene, pero solo hasta la 1.24.4. Así que en Windows `models download` descarga ese archivo una vez, saca una DLL y la comprueba contra un sha256 fijo. DirectML.dll solo se carga si hace falta, así que en CPU todo funciona sin él. Un apaño, sí, pero sin paquetes nuevos.

Antes de esto, CI solo ejecutaba un modelo de prueba diminuto a través del paquete npm, y nada comprobaba `models download` ni lo que de verdad corre para el usuario después. Ahora un workflow aparte descarga la biblioteca y ejecuta 2 modelos de prueba diminutos en nativo en 5 sistemas: Linux y Windows en x64 y arm64, más macOS en Apple silicon. En Alpine, que no tiene build, comprueba que ni siquiera se ofrece lo nativo y que todo va por WebAssembly. Los Mac Intel también se quedan en WebAssembly, el paquete no trae biblioteca para ellos (y CI tampoco los cubre).

## Qué haría distinto

- Compararía los runtimes con las mismas parejas y con la longitud real de la entrada. Mis 4-10 veces salieron de comparar ejecuciones distintas.
- No usaría lotes con un modelo cuantizado si las puntuaciones de parejas distintas se comparan entre sí.
- Una biblioteca nativa se puede descargar bajo demanda, con un hash fijo y WebAssembly para cuando no carga. Al final no necesité un paquete por plataforma.
- Que los archivos estén en un paquete no significa que la biblioteca cargue. Ahora eso lo comprueba CI, que de verdad ejecuta un modelo en cada uno de los 5 sistemas.

## Qué no medí

- La velocidad en nativo en Windows, macOS y Linux arm64. CI comprueba que funciona ahí, pero no mide el tiempo.
- El servidor MCP, donde los modelos ya están cargados y solo se acelera la puntuación.
- Un modelo sin cuantizar (fp32), que no debería depender de sus vecinos de lote, pero es más grande y más lento.

Las mediciones sintéticas, su configuración y los scripts están en [cli-testing](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md), se pueden repetir. De mi archivo real solo hay totales, las preguntas y las filas por pregunta son privadas. Si a ti lo nativo te salió más rápido con textos largos, cuéntame con qué mediste y lo comparo con mis números.

P.D. Mientras este post esperaba a publicarse, el 17 de noviembre a las 22:20 UTC `github.com/microsoft/onnxruntime` empezó a responder 404, descargas de releases incluidas, y `models download` volvió a WebAssembly para todos. Así que al final sí necesito paquetes por plataforma: estoy pasando la biblioteca a mis propios paquetes npm, y de paso Windows descargará unos 11 MB en lugar de 113. Los paquetes aún no están publicados, lo contaré aparte.
