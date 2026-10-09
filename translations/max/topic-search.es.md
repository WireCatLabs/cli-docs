---
title: "Búsqueda por tema"
---

`max conversations` encuentra una conversación por su tema. Úsalo cuando recuerdas el asunto pero no las palabras: «¿dónde hablamos de alquilar un piso?» encuentra una conversación que dice «apartamento», «arrendamiento» y «fianza». Para palabras exactas, personas, fechas y archivos, usa [buscar mensajes](./search.md).

No es el campo de búsqueda `topic:`, que limita los resultados a un hilo de conversación. Aquí una conversación es lo que `max` identifica por sí mismo, en cualquier chat.

La búsqueda usa los mensajes que `max` ya ha guardado. Por defecto, el grafo y los vectores se construyen en tu equipo; un servicio externo se elige explícitamente. Descarga antes el historial: `max store fetch <чат>` ([archivo local](./archive.md)).

## Qué es una conversación

En un grupo activo hay varias conversaciones a la vez y sus mensajes se entremezclan. `max` los separa usando los mensajes guardados, sin consultar a MAX ni usar IA:

- una respuesta pertenece al mensaje al que responde;
- un mensaje que menciona a alguien, por @usuario o por nombre, va con el mensaje reciente de esa persona;
- el siguiente mensaje de una persona, en pocos minutos, continúa el anterior.

Cada conversación es una lista de mensajes, del más antiguo al más reciente. Puede saltarse los mensajes intermedios que pertenecen a otras conversaciones. Las reglas hacen una estimación; pueden partir una conversación en dos o unir dos. Tu propio agente de IA puede enlazar lo que las reglas dejan abierto ([más abajo](#связать-сообщения-поможет-ваш-агент)).

## Construir, vectorizar, buscar

```sh
max conversations build --chat "Книжный клуб"   # найти разговоры; ещё раз — после того, как скачано больше
max models text download e5-small               # один раз: 135 МБ, общая папка с tg
max conversations embed --chat "Книжный клуб"   # продолжает с места, где остановился
max search conversations "где встречаемся" --chat "Книжный клуб"
max search conversations "аренда квартиры"      # во всех построенных чатах
```

1. **Build** identifica las conversaciones del chat. Un nuevo `build` sustituye al anterior: toma el número de conversación de un `list` reciente, en vez de conservarlo.
2. **Embed** convierte cada conversación, o cada fragmento de una larga, en un *vector*: números que representan el significado del texto. Los textos sobre el mismo tema tienen vectores parecidos, aunque cambien las palabras o el idioma.
3. **Search** convierte tu pregunta en un vector y encuentra las conversaciones más cercanas. También busca las palabras de la pregunta y coloca más arriba las conversaciones encontradas por ambos métodos. Cada resultado indica cómo se encontró: `"by": ["meaning"]` (por significado), `["words"]` (por palabras), o ambos.

Sin un modelo descargado, la búsqueda sigue funcionando y encuentra conversaciones por palabras; la respuesta indica `"meaning": "unavailable"`. No se examina un chat que nunca se haya construido: ejecuta antes `build`.

La pregunta sigue siendo texto normal. `--filter 'from:me date:7d'` limita por separado las conversaciones con una consulta estricta: al menos un mensaje debe cumplir toda la condición. Por defecto solo se busca en la cuenta activa; `--source
personal|bots|all|<провайдер>` amplía el alcance explícitamente. Los resultados incluyen su origen y un localizador `msg:`. `--timezone` elige la zona horaria del calendario. `--filter` y `--source` no se pueden combinar con `--refresh`: construye e indexa antes los chats correspondientes. Con `e5-small` local, una coincidencia por significado exige una similitud coseno superior a 0,80; las coincidencias por palabras se mantienen. `--sync-first` descarga mensajes nuevos, mientras que `--refresh` construye el grafo y los vectores localmente.

## Leer lo encontrado

```sh
max conversations list --chat "Книжный клуб" --since-time 7d
max conversations show 91                       # один разговор, от старых к новым
max conversations show "Книжный клуб" 204       # разговор, в котором сообщение 204
max conversations related "Книжный клуб" 204    # другие разговоры о том же, во всех чатах
max messages links "Книжный клуб" 204           # почему сообщение там, где оно есть
```

`related` usa los vectores que guardó `embed` y no ejecuta ningún modelo, así que responde rápido. Un resultado de búsqueda es una pista, no una respuesta: abre la conversación y lee los mensajes antes de fiarte de él.

## Mantenerlo al día

Los mensajes nuevos se incorporan a una conversación solo tras el siguiente `build`, y a los vectores solo tras el siguiente `embed`.

```sh
max conversations status                         # что отстало, по чатам
max conversations build                          # все изменившиеся чаты и группы, ни разу не построенные
max conversations embed                          # все построенные чаты, где остались куски
max search conversations "аренда квартиры" --refresh   # сначала догнать, потом искать
```

`status` cuenta, para cada chat construido, los mensajes que `build` aún no ha visto (nuevos, editados o eliminados), los fragmentos con vectores actuales, obsoletos o ausentes y los grupos nunca construidos. Si cambian las reglas en una versión nueva, `status` y `max store check` identifican los chats construidos con reglas anteriores: vuelve a construirlos. Sin `--chat`, `build`, `embed` y `search --refresh` procesan como máximo 20 chats (`--max-chats`) y calculan como máximo 2000 fragmentos (`--max-chunks`) por ejecución; repite para continuar. Nunca descargan un modelo.

Un resultado marcado con `"stale": true` procede de un texto que se editó después de vectorizarlo: su puntuación corresponde al texto antiguo. Cuando se elimina un mensaje, su texto también sale de los vectores.

## Deja que tu agente de IA enlace mensajes

Las reglas no ven las conexiones que solo se entienden por su significado. Puede añadirlas tu propio agente de IA, el que ya usas con `max`:

```sh
max skill show link-conversations                     # инструкция для агента
max conversations batches status --chat "Книжный клуб"   # сколько сообщений и пачек, сколько текста
```

El agente lee las instrucciones, te dice cuánto texto leerá y espera tu consentimiento. Después lee el chat por lotes (`max conversations batches next`), decide a qué mensaje anterior responde cada uno y guarda la respuesta (`max conversations links add`). El siguiente `build` la tiene en cuenta. Tienen prioridad las respuestas de MAX, después las conexiones del agente y, por último, las reglas. `max conversations links clear --chat "Книжный клуб"` elimina las respuestas del agente. En este proceso con agente, `max` no llama por sí mismo a un modelo.

El `build` normal usa reglas y conexiones guardadas. `max conversations build --chat <чат> --analyze` envía lotes limitados al servicio compatible con OpenAI configurado o a Anthropic. Hace falta un `--chat` explícito. Antes del primer envío, la orden muestra el volumen, la dirección y el límite de tokens, y solicita consentimiento; este se guarda para esa cuenta, chat y servicio seleccionado hasta que se revoque. Por defecto hay 50 mensajes por lote y una reserva máxima de 100 000 tokens; `--yes` da consentimiento en scripts. `max conversations consents list` enumera los consentimientos; `consents revoke --chat
<чат>` los revoca. El análisis integrado solo está disponible en CLI; las claves no se escriben en la configuración.

## Privacidad y coste

Por defecto nada sale de tu equipo. El modelo se ejecuta aquí, y un modelo solo se descarga cuando lo pides:

```sh
max models text list                             # модели и какие скачаны
max models text download embeddinggemma --accept-terms
```

`e5-small` es el predeterminado: pequeño y rápido, con unos 100 idiomas. `embeddinggemma` encuentra más pero es unas siete veces más lento, y solo se descarga con `--accept-terms`, porque está sujeto a las condiciones de Gemma de Google. Los vectores de dos modelos nunca se mezclan: busca con el modelo con el que vectorizaste.

En un portátil reciente, `e5-small` vectoriza unos 30 fragmentos por segundo; un grupo de 100 000 mensajes tarda algo más de 20 minutos, una sola vez. Las ejecuciones siguientes vectorizan solo lo que ha cambiado.

Un servicio puede calcular los vectores en su lugar, con tu propia clave:

```sh
max models text key set openai
max conversations embed --chat "Книжный клуб" --provider openai
max search conversations "аренда квартиры" --provider openai
```

El texto de las conversaciones del chat se envía entonces a ese servicio, y cada búsqueda le envía tu pregunta. Antes de enviar nada, `embed` indica el número de fragmentos, el máximo de tokens y el coste máximo, y espera tu consentimiento (`--yes` en scripts; `--max-tokens` fija un límite). `--base-url` admite cualquier servidor con la API de vectores de OpenAI (`/v1/embeddings`), como Ollama o LM Studio en tu equipo, junto con `--model` y `--dims`. `max models text key remove openai` elimina la clave.

## Para agentes

En MCP, `max_read` (`command: "conversations list"`), `max_read` (`command: "conversations show"`), `max_read` (`command: "search conversations"`), `max_read` (`command: "conversations related"`) y `max_read` (`command: "conversations status"`) leen el índice construido; `max_write` (`command: "conversations refresh"`) lo actualiza en este ordenador. Mediante MCP, el agente obtiene las instrucciones `link-conversations`, estima el trabajo con `max_read` (`command: "conversations batches status"`) y espera el consentimiento del propietario para ese chat. Después lee `max_read` (`command: "conversations batches next"`), guarda las respuestas mediante `max_write` (`command: "conversations links add"`) y reconstruye el grafo mediante `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) elimina las respuestas del agente; después también hay que reconstruir el grafo. Las operaciones de escritura requieren `conversations.links`. La configuración de vectores externos también se aplica a la búsqueda MCP: la pregunta se envía al servicio elegido. Consulta los detalles técnicos —reglas, fragmentos, vectores y orden de resultados— en [cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture).
