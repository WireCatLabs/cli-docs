---
title: "WireCat con modelos locales: qué funciona dónde, cómo configurarlo y cuánto cuesta"
description: Qué es WireCat, qué funciones necesitan un modelo de IA, cómo pasarlas todas a un modelo en tu propio ordenador y cuánto cuesta en velocidad y memoria. Con cifras de nuestras mediciones y los sitios por donde los datos aún salen.
date: 2026-11-10
tags: [ai-agents, search, benchmarks]
author: viacheslav-ptsarev
draft: false
---

Los agentes como Claude Code o Codex programan bien, pero no saben qué acordaste con un proveedor la semana pasada, porque eso está en Telegram, en el correo y en la grabación de una llamada. Hago [WireCat](https://wirecat.dev/es), un conjunto de herramientas open source que dan al agente acceso a todo eso, y una app donde lo conectas todo sin terminal.

Como por WireCat pasan mensajes privados, la pregunta de adónde van es de las principales para nosotros (por qué, lo conté [en el post sobre privacidad](/es/blog/privacy-and-ai-agents)). Hace poco hice que WireCat pudiera funcionar entero con modelos locales, y por el camino encontré varios sitios por donde los datos salían cuando no debían.

## Cómo funciona WireCat

Cada herramienta conecta una fuente, Telegram, WhatsApp, MAX, correo, notas, Zoom, Google Drive, etc., y guarda una copia de los datos en una base de datos en tu ordenador. Los servicios de mensajería se conectan con tu propia cuenta, así que el agente ve lo mismo que tú. El agente sigue siendo el tuyo, WireCat no tiene modelo propio.

La búsqueda en esa base tiene 2 capas. La búsqueda por palabras encuentra mensajes aunque la palabra esté escrita un poco distinta. Y la búsqueda por significado funciona con embeddings (huellas numéricas del significado de un texto) y encuentra un mensaje cuando preguntas con otras palabras. Las dos funcionan en tu ordenador. El modelo para el significado lo descarga WireCat solo, ahora es EmbeddingGemma 300M. Comparé varios modelos gratuitos, y con nuestros datos salió el mejor, y eso que es de los más pequeños.

Y de tiempo va bien. Memo (la herramienta para notas, correo y memoria) indexó en mi portátil un conjunto de prueba de 10.000 registros en unos 2.5 minutos. Eso era aún con el modelo anterior, e5-small, con Gemma salen 4-7 minutos. Para comparar, Mem0 en su plan gratuito procesó 6.500 registros en 19 horas, aunque eso es su cola en el servidor, no la velocidad del modelo.

## Qué funciones necesitan un modelo

La búsqueda es la base, pero alrededor hay un montón de funciones que necesitan un modelo de IA. Aquí están todas, y dónde funciona cada una por defecto:

| Función | Qué hace | Por defecto | Puede ser local |
| --- | --- | --- | --- |
| Búsqueda por significado y por imágenes | encuentra registros e imágenes por significado | en tu ordenador | ya lo es |
| Transcripción de reuniones | saca el texto de la grabación de una llamada | en tu ordenador | ya lo es |
| Mensajes de voz | saca el texto de un mensaje de voz | en tu ordenador si el modelo está descargado, si no el servicio de mensajería | sí, con --local |
| Reconocimiento de imágenes | lee el texto de las imágenes que añadiste a la memoria | apagado | sí, Ollama o tu propio servidor |
| Lectura de hechos | saca de un documento hechos, decisiones y tareas | tu agente | sí, Ollama o el modelo de IA |
| Buscar a fondo | reordena los 30 primeros resultados cuando pulsas el botón | apagado | sí, por dirección |
| Reescribir registros para buscar mejor | añade otras palabras a notas y correos para que se encuentren | apagado | sí, por dirección |
| Enlazar chats, borradores de respuesta, texto de los adjuntos | lo que dice el nombre | apagado | sí, con el modelo de IA |
| Resúmenes y el agente de correo | escribe un resumen cada mañana, ordena el correo nuevo | el agente que elegiste | depende del agente |
| Tu agente | todo lo demás | su modelo | depende del agente |

Todo lo que está apagado lo activas tú, y en los ajustes se ve adónde envía datos cada función.

## Cómo busqué por dónde se escapaban los datos

Repasé todas las funciones en las que WireCat llama a un modelo, salieron 13, y para cada una apunté qué sale y si se puede quedar en tu ordenador.

Lo peor fue un fallo mío. Reescribir registros, Buscar a fondo, enlazar chats y un par de funciones más aceptaban sin problema una dirección http:// en otro ordenador. O sea, si tienes Ollama en un servidor de casa y pusiste su dirección, tus notas y correos iban por la red sin cifrar. El ajuste del modelo de IA ya lo prohibía, pero los demás por algún motivo no. Ahora hay una sola regla, http normal solo a este ordenador, a otro solo https.

Además, un modelo local pedía una clave. Para conectar LM Studio o llama.cpp en tu ordenador había que escribir alguna clave de API, aunque ahí no hace falta ninguna. Es una tontería, pero en ese momento uno piensa que si hay clave, será la nube. La quité.

Con los mensajes de voz, por defecto el texto lo hacía el propio servicio de mensajería, por ejemplo Telegram si tienes Premium. Cambié el orden, ahora primero va el modelo descargado, y el servicio de mensajería solo si no lo hay.

Y un conflicto no lo he resuelto. Los resúmenes y el correo los hace el agente de programación que elegiste en los ajustes. Claude Code y Codex los arrancamos para estas tareas sin tus propios ajustes, a propósito. Un resumen lee correos ajenos, y en ellos puede haber texto que intenta que el agente haga algo. Por eso Claude Code recibe solo los comandos de WireCat, y Codex funciona en un sandbox sin red, y tus ajustes, que podrían ampliar esto, no se leen. Por eso el modelo local que pusiste en los ajustes de Codex tampoco llega a los resúmenes. Tuve que elegir entre seguridad y privacidad, y de momento elegí la seguridad. OpenCode, en teoría, lee sus propios ajustes, así que con él debería funcionar, pero aún no lo he comprobado.

Luego está Ollama. No todos sus modelos son locales, algunos, los que llevan cloud en el nombre, funcionan en los servidores de Ollama, y su búsqueda en internet también sale fuera. O sea, puedes instalar Ollama en tu ordenador de buena fe y aun así mandarlo todo a la nube.

## Cómo configurarlo

Hay una guía paso a paso en la web, [Usar WireCat con modelos locales](/es/docs/desktop/local-models). En resumen:

1. Instalas Ollama (o LM Studio, o cualquier otro servidor con una API como la de OpenAI) y descargas un modelo. Para imágenes necesitas un modelo que las vea, por ejemplo llava. Los modelos en la nube de Ollama se apagan con una línea en los ajustes de Ollama.
2. En WireCat Desktop, en Ajustes, Modelo de IA, eliges Ollama en este ordenador. No hace falta clave.
3. En Lectura de hechos eliges este modelo u Ollama.
4. Si quieres, apuntas a él también Buscar a fondo y la reescritura de registros, en los dos puedes poner la dirección de tu servidor.
5. Los mensajes de voz los transcribes con --local.
6. Usas tu propio agente con un modelo local. Ollama sabe abrir Codex, Claude Code, OpenCode y un par más con un solo comando, ollama launch. Anthropic, eso sí, no da soporte oficial a Claude Code con otros modelos, y para Cursor y Gemini CLI no encontré ese ajuste en su documentación.
7. Activas Solo este ordenador.

El último paso es el principal. Es un interruptor, y con él las herramientas de WireCat se niegan a llamar a un modelo en una dirección que no sea localhost, 127.x.x.x o [::1], y se niegan antes de enviar, no después. Un agente puede activarlo, pero solo tú puedes desactivarlo. Debajo hay una lista de funciones marcadas con adónde envía datos cada una ahora, así que se ve qué queda por arreglar.

Pero hay unos cuantos sitios que el interruptor no cubre, y tienes que vigilarlos tú. Son tu agente, los resúmenes con Claude Code o Codex, y leer imágenes a través del agente (un ajuste aparte que envía la imagen a Claude Code o Codex, mejor déjalo en Nunca).

## Cuánto cuesta

Un modelo local es gratis, pero gasta tiempo y memoria. Medí en mi portátil, AMD Ryzen AI 9 HX 470, 30 GB de memoria, sin tarjeta gráfica, y a la vez tenía otros agentes funcionando en él, así que las cifras tienen ruido.

Donde mejor se ve es en Buscar a fondo. Pasé 2 conjuntos, nuestro sintético v3 (10.444 registros cortos, 46 preguntas) y un trozo de LifeBench (datos sintéticos del móvil de una persona durante un año, 59 preguntas). La cifra es la parte de los registros correctos entre los diez primeros. Todas las filas reordenan los mismos resultados, que antes ya habían traído 2 llamadas pequeñas a Haiku, así que esto compara solo el reordenado, no toda la búsqueda:

| Con qué se reordenó | v3 | LifeBench | Tiempo por pregunta | Memoria | Precio por pregunta |
| --- | ---: | ---: | ---: | ---: | ---: |
| Con nada | 0.94 | 0.47 | 0 | | 0 |
| jina-reranker-v2, un modelo local pequeño | 0.94 | 0.48 | 1.4 s / 9 s | 5.7 GB junto con toda la prueba | 0 |
| qwen3.5:9b en Ollama, en el procesador | 0.94 | no lo lancé | 25 s | 7.7 GB el propio modelo | 0 |
| Claude Haiku 5.5, en la nube | 0.94 | 0.55 | alrededor de 1 s | | alrededor de $0.0004 |

En v3 el qwen local hizo lo mismo que Haiku, pero en 25 segundos por pregunta en vez de uno. A LifeBench no llegó. Tuve que parar la prueba en las preguntas hechas con otras palabras (le dio tiempo a 2 de 17), porque el modelo ocupó 7.7 GB, y junto con las tareas de al lado al ordenador dejó de llegarle la memoria. Por eso ahora Buscar a fondo espera a un modelo local hasta 60 segundos, y a uno en la nube 5.

Los modelos pequeños de reordenado como jina van más rápido, pero por sí solos pierden las preguntas hechas con otras palabras y añaden como mucho +0.01. Así que para buscar yo dejaría en local lo que ya hay, y conectaría un modelo donde no importe esperar medio minuto.

Con reescribir registros es al revés, la nube es barata pero se lo lleva todo. Con gpt-4o-mini todo el conjunto de prueba, 9.840 registros, costó unos $0.49, y con EmbeddingGemma las preguntas hechas con otras palabras se encontraban bastante más a menudo, 0.94 entre los diez primeros en vez de 0.78. Pero son todas tus notas y correos enviados a OpenAI. En local es gratis, pero en el procesador serán horas, no minutos (esto no lo medí, solo lo calculé a ojo por la velocidad de arriba).

Para agentes, Ollama pide un contexto de al menos 64.000 tokens, y el modelo tiene que saber llamar a herramientas. Un modelo pequeño en un portátil responde despacio y se equivoca más en los comandos que uno en la nube. Así que para un agente con modelo local me gustaría mucho tener tarjeta gráfica.

## Qué no comprobé

- La calidad en ruso. Todas las mediciones de arriba son con datos sintéticos en inglés.
- Una tarjeta gráfica. Todas las cifras locales son en el procesador.
- El reordenado de qwen3.5:9b en LifeBench y en la mayoría de las preguntas hechas con otras palabras.
- Reescribir registros con un modelo local entero, solo un cálculo a ojo.
- Agentes con modelo local contra WireCat en tareas reales.
- Si zoom trae las transcripciones en la nube del propio Zoom.

Y las cifras tienen ruido. Una pregunta en un conjunto de 17 mueve el resultado 0.06, y Haiku en una segunda pasada bajó solo de 1.00 a 0.94.

En resumen, la búsqueda en WireCat ya es local y gratis. Todo lo demás se puede pasar a tu propio modelo, pero cuesta tiempo y memoria, y unos cuantos sitios los tienes que vigilar tú.

Guía paso a paso: [Usar WireCat con modelos locales](/es/docs/desktop/local-models). Las mediciones con datos y scripts están en [cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/knowledge-graph-memory/search-lab). Puedes descargar WireCat Desktop [en la web](/es/docs/desktop).

Si lo configuras y algo no arranca, escribe en el tema Ayuda en Telegram o en #help en Discord, te ayudo. Y si pruebas lo mismo con tarjeta gráfica, me alegrará ver las cifras.
