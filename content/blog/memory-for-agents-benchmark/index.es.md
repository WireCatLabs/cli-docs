---
title: Comparé memorias para agentes de IA y los archivos normales no lo hicieron peor
description: "Motores de memoria de terceros, WireCat Memo y una simple carpeta con archivos sobre las mismas preguntas. Qué responde el agente, qué registro cita y cuánto cuesta, más el LifeBench público."
date: 2026-11-12
tags: [ai-agents, benchmarks, search]
cover: ./cover.jpg
coverAlt: "Cinco formas de guardar registros sobre una mesa oscura: un fichero de madera, una caja gris sellada, un corcho con hilo rojo, una libreta negra y una carpeta de cartón sencilla en el centro. Delante de cada una hay un montón de tarjetas de preguntas con una marca verde, y los montones más altos son los de la carpeta y el fichero."
author: viacheslav-ptsarev
draft: false
---

Últimamente han aparecido un montón de memorias para agentes de IA, y casi todas prometen que tu agente por fin dejará de olvidarse de las cosas. Necesitaba saber si mi idea de la memoria iba bien encaminada. Tomé las soluciones más populares, se las di a los mismos agentes e hice las mismas preguntas. Miré qué responde el agente, qué registro cita y cuánto cuesta.

Quién participó:

- [Mem0](https://mem0.ai) - un servicio en la nube, un modelo saca hechos de tus mensajes y guarda eso en lugar de los mensajes.
- [Supermemory](https://supermemory.ai) - también en la nube, corta los documentos en trozos para buscar y encima un modelo arma un grafo de hechos. Busca en los dos.
- [Honcho](https://honcho.dev) - open source, en segundo plano saca conclusiones sobre cada persona de la conversación y guarda esas conclusiones.
- [Hindsight](https://github.com/vectorize-io/hindsight) - open source, un modelo saca hechos, personas y cómo se relacionan, y busca a la vez por significado, por palabras, por el grafo y por tiempo.
- WireCat Memo - el nuestro, funciona en local, guarda los registros tal cual y busca por palabras y por significado.
- Y una carpeta con archivos normales, donde el agente busca solo con comandos de terminal.

Los agentes son los asistentes [OpenClaw](https://openclaw.ai) y [Hermes](https://github.com/NousResearch/hermes-agent) porque son lo primero que alguien instala cuando quiere un asistente personal de IA, así que es justo ahí donde hace falta memoria. Además, Hermes trae de serie plugins para los cuatro motores, así que cada uno está conectado a su manera, no con mis apaños.

Eso es lo que estuve corriendo a principios de noviembre. Hago WireCat como el contexto local de una persona para cualquier agente (chats, correo, notas, reuniones), así que para mí no es una pregunta académica - si nuestro Memo tiene sentido o al agente le basta con una carpeta de archivos.

Resulta que los archivos normales no lo hicieron peor. En la versión más difícil de mi conjunto, OpenClaw con Memo respondió 50 preguntas de 50 y citó el registro correcto en 46, y con archivos también 50 de 50 y 47 citas. Con Memo salió un poco más barato ($1.92 frente a $2.19), pero es 1 ejecución. En cambio, los motores que guardan un resumen hecho por un modelo en lugar de los registros pierden o los datos o la fuente.

En mi conjunto el agente funciona con Claude Sonnet 5.5 en todas las ejecuciones, solo cambié la memoria. Todos los datos son sintéticos, un equipo inventado con proyectos inventados.

## Primer intento: Memo no encontró casi nada

Empecé con un conjunto pequeño, 2.000 registros sobre 10 proyectos: mensajes, correos, notas, etc. Casi todo es ruido, y cada proyecto tiene unos pocos registros importantes, por ejemplo una fecha de entrega fijada en un chat y luego movida por correo. 50 preguntas, 5 por proyecto, y 10 de ellas sobre un presupuesto que no está en los registros, donde la respuesta correcta es "desconocido". Un script comprueba las respuestas con una clave, sin juez de IA.

Primero probé solo la búsqueda, sin agente, mandando cada pregunta tal cual, como la escribiría una persona. Así funcionan los otros motores, pero la búsqueda por palabras de Memo no encontró nada, 50 resultados vacíos de 50. Era un bug nuestro - quería que todas las palabras de la pregunta estuvieran en un mismo registro, y claro, no hay ningún registro con "what", "is", "current" y el nombre del proyecto a la vez. Con la búsqueda por significado, el registro correcto entraba en el top 10 solo en el 30% de las preguntas. Además, correo y notas salían por turnos, y la búsqueda por significado nunca devolvió un correo. OpenClaw, Supermemory y Mem0 manejaban las mismas preguntas sin problema.

Aun así, el agente con Memo respondió 50 de 50, porque el skill de memo le decía que buscara con un par de palabras clave, y Sonnet reescribía la pregunta él mismo. O sea, con 2.000 registros cortos un modelo fuerte lo saca todo sin nosotros. Y con WireCat costaba unas 1.8 veces más que con archivos, porque antes de cada pregunta el agente leía entera la instrucción de memo, y las respuestas de memo también eran largas.

Arreglé la búsqueda (la pregunta tal cual, una lista común para todas las fuentes, el correo por significado), pero el coste no bajó, incluso subió. Lo gracioso es que la mayor parte del dinero no se iba en la búsqueda sino en las instrucciones. El skill que el agente lee antes de trabajar con memo pesaba 22 KB, unos 8.100 tokens, y el agente lo leía entero antes de cada pregunta. Lo recorté a 3 KB, y el resto el agente lo pide si lo necesita (nunca lo pidió, por cierto).

| Agente | Coste de 50 respuestas antes | Después | Correctas antes / después |
| --- | ---: | ---: | ---: |
| OpenClaw + WireCat | $2.73 | $1.45 | 50 / 50 |
| Hermes + WireCat | $2.07 | $0.98 | 50 / 50 |

OpenClaw calcula su propio coste, el de Hermes está calculado por tokens, así que hay que comparar dentro de una fila, no entre agentes. Es el nivel de los archivos ($1.33 y $0.88 en las mismas preguntas), pero la diferencia está dentro del ruido de una ejecución, así que aquí no escribí "más barato que los archivos".

## 10.000 registros, y por qué Supermemory acertó 16 de 50

Con 2.000 registros el agente respondió las 50 preguntas tanto con archivos como con Memo, no se veía ninguna diferencia, así que después hice un conjunto más pesado: 10.000 registros, los mismos 10 proyectos más 2 parecidos para confundir. Cada fecha se mueve 2-4 veces, en los resúmenes de reuniones vuelve a salir la fecha vieja, y los nombres se parecen (Ari Vale y Ari Vail, Amber Kite y Amber Kitchen). Mem0 recibió 6.500 registros de 10.000, el plan gratuito no daba para todos, pero todos los registros con respuestas entraron en esa parte.

Primero solo la búsqueda, sin agente. Memo con búsqueda por palabras y por significado puso el registro correcto primero en el 72% de las preguntas y en el top 5 en las 40 preguntas que tienen ese registro. Supermemory 20% y 70%, Mem0 10% y 53%. Además, el tiempo de carga: Memo lo indexó todo en local en unos 2.5 minutos (con el modelo e5-small), Supermemory construyó su memoria durante unas 14 horas, Mem0 procesó sus 6.500 registros durante 19 horas. Son planes gratuitos, no comprobé si los de pago son más rápidos.

Luego corrí los agentes con las mismas 50 preguntas:

| Memoria | OpenClaw | Hermes |
| --- | ---: | ---: |
| Archivos normales | 50 | 49 |
| WireCat Memo | 50 | 45 |
| Mem0 (6.500 registros) | 42 | 35 |
| Supermemory | 16 | 16 |

En Hermes con WireCat, 4 de los 5 fallos son la respuesta correcta más una aclaración entre paréntesis, y la comprobación es exacta, así que cuentan como error. Los 16 de Supermemory hay que leerlos con más dureza: 10 son las preguntas de presupuesto donde la respuesta correcta es "desconocido", y esas las aciertan todos. O sea, en las otras 40 preguntas, 6 correctas.

Creo que aquí se ve bien el problema principal de una memoria que guarda un resumen del modelo y no los registros. De 10.051 documentos Supermemory se quedó con 1.585 recuerdos, y los plugins de los agentes buscan solo en ellos. Los agentes no encontraron al responsable del proyecto ni una vez de 10, aunque en 6 de ellos el responsable nunca cambió, así que no es solo cosa de fechas. Parece que simplemente no están entre los recuerdos (es mi conclusión, no lo comprobé aparte). Y la búsqueda del propio Supermemory sobre los documentos encontraba a todos los responsables en el top 10, solo que el agente no ve esa búsqueda.

Por cierto, la primera ejecución de OpenClaw con Mem0 ni siquiera llegó a Mem0. La memoria integrada de OpenClaw, marcada como desactivada, seguía ocupando los nombres de herramientas memory_search y memory_get, las herramientas del plugin se descartaban, y el aviso del conflicto de nombres solo salía por stderr. El agente buscó obedientemente en un índice vacío y respondió "desconocido" a cada pregunta sobre proyectos. Cualquiera que instale este plugin en la misma versión de OpenClaw tendrá lo mismo.

## Dinero, calendario y preguntas con otras palabras

Luego hice las preguntas más difíciles. La tercera versión tiene 10.444 registros y 50 preguntas de 21 tipos, ya con un precio después de una revisión, pagos parciales, una reunión que se canceló y luego volvió, etc. Y reescribí 18 preguntas para que no compartieran ni una frase con el registro ("servidores alquilados" en lugar de "contrato de hosting").

Corrí cada combinación de agente y memoria una vez. El coste de Hermes está calculado por tokens, OpenClaw da el suyo:

| Combinación | Correctas de 50 | Con la fuente correcta | Coste de 50 respuestas |
| --- | ---: | ---: | ---: |
| OpenClaw + WireCat Memo | 50 | 46 | $1.92 |
| OpenClaw, archivos | 50 | 47 | $2.19 |
| OpenClaw + Honcho | 50 | 4 | $2.29 |
| Hermes + Honcho | 50 | 4 | ~$3.19 |
| Hermes + WireCat Memo | 49 | 30 | ~$1.49 |
| Hermes, archivos | 49 | 35 | ~$2.41 |
| OpenClaw + Hindsight | 43 | 34 | $2.34 |
| Hermes + Hindsight | 37 | 8 | ~$4.56 |
| OpenClaw + Supermemory | 19 | 4 | $1.71 |
| Hermes + Supermemory | 18 | 4 | ~$3.70 |

Honcho responde a todo, pero sus conclusiones no guardan el nombre del registro, así que el agente solo puede citar una fuente donde la respuesta es "desconocido".

Hindsight sacó 4 de 50 en las primeras ejecuciones, porque los agentes nunca llegaron a la memoria. Hermes necesita exactamente una versión vieja del cliente de Hindsight y la nueva, que es la instalada, simplemente no la ve. Y el plugin de OpenClaw se negaba a funcionar en una sesión sin fuente de mensajes. En la tabla están las segundas ejecuciones.

Esta vez Mem0 no corrió en absoluto, respondía HTTP 429 a cada petición, creo que se acabó el límite mensual del plan gratuito. Y Cognee no logré montarlo: 3 construcciones del grafo seguidas fallaron, y la última, tras algo más de una hora, declaró que su almacenamiento había llegado al límite de 32 GiB, mientras su carpeta tenía unos 0.5 GB.

También hubo un fallo mío. Todos los agentes "fallaron" al principio las mismas 2 preguntas. Las respuestas estaban bien, la clave estaba mal: el generador a veces contaba una historia gemela sobre otro proyecto, y un mismo asunto acababa con 2 historias. Arreglé la clave, ahora el generador falla en ese caso, y todas las cifras de arriba usan la clave corregida.

Aparte miré la búsqueda sin agente en 17 de las 18 preguntas reescritas, las que tienen un registro fuente (la parte de preguntas con el registro correcto en el top 10). En cuanto las palabras no coinciden, la búsqueda por palabras cae de 0.91 a 0.14. Memo empezó el día en 0.48, Honcho 0.76, Supermemory 0.88, pero eso es su búsqueda sobre documentos, no lo que ven sus agentes. Y el mismo modelo e5-small que lleva Memo encontraba 0.71 por sí solo (eso sí, a precisión completa, en Memo está comprimido a 8 bits), o sea, la mayor parte se perdía no en el modelo sino en cómo Memo ordena y junta los resultados.

Y entonces salió otro fallo, otra vez en mi benchmark. El script de carga ponía a cada correo en Memo el remitente "Synthetic Sender" y el número de registro en lugar del asunto. Memo mete el remitente y el asunto en el vector junto con el texto, así que la misma línea estaba en cada correo, mientras los otros motores recibían el texto limpio. O sea, medía mi propio producto con una desventaja que yo mismo le había puesto. Las ejecuciones de agentes de la tabla de arriba, por cierto, todavía usaban las cabeceras viejas.

Así cambió paso a paso, en las mismas 17 preguntas:

| Qué cambié | En el top 10 |
| --- | ---: |
| Memo al empezar el día | 0.48 |
| cada correo con su propio remitente y asunto (arreglo del benchmark) | 0.53 |
| la búsqueda común ya no toma por turnos de cada fuente | 0.62 |
| los resultados solo por palabras reciben una puntuación comparable, para no perder coincidencias exactas | 0.59 |
| el texto del correo sin la línea del remitente delante | 0.65 |
| el modelo EmbeddingGemma 300M dentro de Memo | 0.79 |
| más la reescritura de registros con un modelo al guardarlos (se activa aparte) | 0.94 |

El paso de 0.62 a 0.59 empeoró las cosas, y aun así lo dejé, porque si no las coincidencias exactas por palabras se hundían. Las filas vienen de builds distintos, así que son pasos, no una serie limpia. El último paso tiene sus contras. Los registros los reescribe gpt-4o-mini, o sea, van a OpenAI (unos $0.60 por 10.000 registros), y una pregunta con las palabras del propio registro lo encuentra primero con menos frecuencia (0.41 en lugar de 0.54), aunque no lo pierde en el top 5 ni en el top 10.

EmbeddingGemma es ahora el modelo por defecto. Indexa 5 veces más lento que e5-small, y su licencia son los Gemma Terms, no MIT, que aceptas al descargarlo. Pero ninguno de los modelos gratuitos más grandes que probé lo superó, bge-m3 como mucho empató.

## LifeBench: un benchmark ajeno en lugar del mío

Mi conjunto lo inventé yo, y esto no se puede mostrar con tus propios chats, además no son representativos, así que fui a buscar benchmarks existentes y encontré [LifeBench 2.0](https://github.com/1754955896/LifeBench). Es 1 año de la vida de una persona, datos del móvil (SMS, calendario, fotos, etc.), 10 personas inventadas y 3.380 preguntas en total, y para cada pregunta se sabe en qué registros está la respuesta. Un dataset bastante relevante.

Primero le puse el mismo OpenClaw con Sonnet, 46 preguntas de una persona. Memo 93%, archivos 96%. Una pregunta de diferencia con ese volumen no significa nada, pero los archivos además fueron un 16% más baratos y un 30% más rápidos en mediana, y el agente con archivos nunca llamó a la búsqueda de memoria, solo lanzaba comandos de shell sobre 4.986 archivos pequeños con una fecha en cada uno. Además, Memo tiene una cola larga: una pregunta sin respuesta se comió 176 llamadas a herramientas, 4 minutos y $0.46 antes de que el agente se rindiera. Creo que con años de correo real este truco con archivos ya no funcionará, pero aquí funcionó.

Cuando el agente puede buscar todo lo que quiera, una búsqueda floja no se nota, así que después lo hice como en el leaderboard de LifeBench: una búsqueda de Memo, los primeros 20 registros van a 1 llamada al modelo, responde DeepSeek-V4-Flash y juzga deepseek-chat con el prompt del propio LifeBench. 2 personas, 700 preguntas, la búsqueda solo ve registros con fecha anterior a la pregunta.

| Sistema (responde DeepSeek-V4-Flash) | Micro | Macro (media de 9 tipos) |
| --- | ---: | ---: |
| Respuesta con los registros correctos (techo) | 97.6 | 96.5 |
| Memo + EmbeddingGemma | 77.7 | 74.5 |
| Memo + e5-small | 75.3 | 72.0 |
| Hindsight (publicado, las 10 personas) | 72.0 | 66.6 |
| Mem0 (publicado, las 10 personas) | 61.5 | 55.0 |

Mi techo salió 97.6 frente al 97.3 publicado, o sea, el esquema se reproduce. Pero no se puede comparar directamente con el leaderboard. Tengo 2 personas de 10, y el almacén tiene todo el año desde el principio (solo la búsqueda se corta por fecha, mientras el leaderboard carga los registros día a día), además hay pequeñas diferencias en el formato de los registros y el prompt del juez. Y Memo aquí es todavía un build viejo, anterior a los últimos arreglos de búsqueda.

Y una cosa que no me gusta mucho. Hindsight va por delante justo en las preguntas donde un dato cambió con el tiempo, 85.1 frente a 79.8. O sea, justo en el tema de todo este post, por ahora es mejor.

Aparte medí el ruido, en 70 preguntas de cada persona para cada modelo. La misma pregunta, los mismos 20 registros en el mismo orden, temperatura 0, responder y juzgar otra vez: cambian 49 veredictos de 280, más o menos 1 de cada 6. Solo 39 respuestas de 280 coincidieron palabra por palabra. Los cambios van en ambos sentidos y se compensan, así que el total sobre cientos de preguntas se mantiene en torno a 1 punto, pero un veredicto suelto no significa nada.

Se ve bien al elegir el modelo. En las primeras 46 preguntas (entonces todavía con 40 registros en el contexto) Gemma perdía contra e5-small, 37 frente a 39, y en las 700 ganó, 78% frente a 74% en la ejecución sobre todo el año (p = 0.045, en el límite de lo significativo). La ventaja probablemente es real pero pequeña, y no se puede elegir modelo con 46 preguntas.

Por cierto, en una pregunta donde el agente con archivos "se equivocó", el error parece estar en la propia clave: el agente encontró en los registros una carrera de 10 km más rápida que la que figura como récord personal.

## Lo que no medí

- **Mem0 en la tercera versión de preguntas, y Cognee.** Mem0 chocaba con el 429, Cognee no se montó. Graphiti lo medí solo con búsqueda, sin agente.
- **Más de una ejecución del agente.** Las diferencias de coste de decenas de céntimos entre combinaciones probablemente están dentro del ruido.
- **Ajustar los motores ajenos.** Los competidores corrieron casi con la configuración por defecto (en OpenClaw desactivé el autoguardado y la autoinserción en los plugins de memoria para que el almacén no cambiara entre preguntas, y Hermes con Mem0 seguía escribiendo en memoria en cada turno), mientras yo arreglaba y publicaba mi propio Memo durante la prueba.
- **Todo LifeBench.** 2 personas de 10, solo inglés, sin carga día a día.
- **Datos reales y ruso.** Todos los registros son inventados. Comparé modelos en ruso aparte, eso es otra historia.
- **Modelos débiles y locales como agente.** En mi conjunto respondía siempre el potente Sonnet, y con él una carpeta de archivos responde casi todo.

En general, con estos volúmenes un agente encuentra la respuesta también con archivos, la diferencia es cuánto cuesta y si puede mostrar de dónde salió la respuesta. Y una memoria que guarda un resumen en lugar del registro original pierde justo ahí.

Después quiero escribir sobre un par de cosas más de estas pruebas. Primero, la reescritura de registros con un modelo al cargarlos: subió la búsqueda con preguntas reformuladas de 0.79 a 0.94, pero tiene su precio, y no solo en dinero. Segundo, por qué un modelo de embeddings más grande no es mejor: EmbeddingGemma de 300M superó todo lo que probé, incluidos modelos del doble de tamaño. Y sobre todo quiero por fin correr la prueba con cien mil registros de varios años, donde creo que los archivos empezarán a quedarse atrás. Veremos si tengo razón.

Todos los datos, scripts y tablas están en el repositorio abierto [cli-testing](https://github.com/WireCatLabs/cli-testing): [memoria para agentes](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/knowledge-graph-memory) y [LifeBench](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/lifebench). WireCat está en [wirecat.dev](https://wirecat.dev). Si en tus datos las cifras salen distintas, escríbeme, de verdad quiero entender dónde miente mi benchmark.
