---
title: "Búsqueda por tema"
---

`tg conversations` encuentra una conversación por su tema. Úsalo cuando recuerdas el asunto pero no las palabras: «¿dónde hablamos de alquilar un piso?» encuentra una conversación que dice «apartamento», «arrendamiento» y «fianza». Para palabras exactas, personas, fechas y archivos, usa [buscar mensajes](./search.md).

No es el campo de búsqueda `topic:`, que se limita a un tema del foro de un grupo de Telegram. Aquí una conversación es algo que tg encuentra por sí mismo, en cualquier chat.

La búsqueda usa los mensajes que tg ya ha guardado. Los grafos y los vectores se calculan en local por defecto; los proveedores remotos se eligen de forma explícita. Descarga antes el historial: `tg store fetch <chat>` ([archivo local](./archive.md)).

## Qué es una conversación

En un grupo con mucha actividad se mantienen varias conversaciones a la vez y sus mensajes se mezclan. tg las separa a partir de los mensajes guardados, sin preguntar a Telegram y sin ninguna IA:

- una respuesta pertenece al mensaje al que responde;
- un mensaje que menciona a alguien, por @usuario o por nombre, va con el mensaje reciente de esa persona;
- el siguiente mensaje de una persona, en pocos minutos, continúa el anterior.

Cada conversación es una lista de mensajes, del más antiguo al más reciente. Puede saltarse los mensajes intermedios que pertenecen a otras conversaciones. Las reglas hacen una estimación; pueden partir una conversación en dos o unir dos. Tu propio agente de IA puede enlazar lo que las reglas dejan abierto ([más abajo](#let-your-ai-agent-link-messages)).

## Construir, vectorizar, buscar

```sh
tg conversations build --chat "Book club"        # find the conversations; again after fetching more
tg models text download e5-small                 # once: 135 MB, shared with max
tg conversations embed --chat "Book club"        # resumes where it stopped
tg conversations search "where do we meet" --chat "Book club"
tg conversations search "renting a flat"         # every chat you built
```

1. **Construir** (build) encuentra las conversaciones de un chat. Una nueva construcción sustituye a la anterior, así que toma el número de una conversación de un `list` reciente en lugar de guardarlo.
2. **Vectorizar** (embed) convierte cada conversación, o cada fragmento de una larga, en un *vector*: una lista de números que representa lo que significa el texto. Los textos sobre lo mismo obtienen vectores parecidos, aunque usen otras palabras u otro idioma.
3. **Buscar** (search) convierte también tu pregunta en un vector y encuentra las conversaciones más cercanas. Además busca las palabras de la pregunta y pone primero las conversaciones encontradas de las dos formas. Cada resultado indica cómo se encontró: `"by": ["meaning"]`, `["words"]` o ambos.

Sin un modelo descargado, la búsqueda sigue funcionando y encuentra conversaciones por sus palabras; la respuesta indica `"meaning": "unavailable"`. Un chat que nunca se construyó no se busca: constrúyelo primero.

La consulta por significado sigue siendo texto libre. `--filter 'from:me date:7d'` limita las conversaciones antes de ordenarlas: un solo mensaje debe cumplir todo el filtro estricto de Lucene. El ámbito predeterminado es la cuenta activa; `--source
personal|bots|all|<provider>` lo amplía de forma explícita. Los resultados incluyen origen y localizador; `--timezone` elige la zona del calendario. El filtro y el origen no pueden acompañar a `--refresh`: construye e indexa antes los chats que quieras. Con el modelo local `e5-small`, los resultados por significado requieren una similitud del coseno mayor que 0,80; las coincidencias exactas de palabras pueden aparecer por debajo de ese umbral. `--sync-first` descarga mensajes; `--refresh` construye y vectoriza en local.

## Leer lo encontrado

```sh
tg conversations list --chat "Book club" --since-time 7d
tg conversations show 91                         # one conversation, oldest first
tg conversations show "Book club" 204            # the conversation message 204 is in
tg conversations related "Book club" 204         # other conversations about the same thing, in every chat
tg messages links "Book club" 204                # why that message is where it is
```

`related` usa los vectores que guardó `embed` y no ejecuta ningún modelo, así que responde rápido. Un resultado de búsqueda es una pista, no una respuesta: abre la conversación y lee los mensajes antes de fiarte de él.

## Mantenerlo al día

Los mensajes nuevos llegan a una conversación solo tras la siguiente construcción, y a un vector solo tras la siguiente vectorización.

```sh
tg conversations status                          # what is behind, chat by chat
tg conversations build                           # every chat that changed, and groups never built
tg conversations embed                           # every built chat with pieces left
tg conversations search "renting a flat" --refresh   # catch up first, then search
```

`status` cuenta, para cada chat construido, los mensajes que la construcción no ha visto (nuevos, editados, eliminados) y los fragmentos cuyo vector está al día, desactualizado o falta, y cuántos grupos no se construyeron nunca. Sin `--chat`, `build`, `embed` y `search --refresh` toman como máximo 20 chats por ejecución (`--max-chats`) y vectorizan como máximo 2000 fragmentos por ejecución (`--max-chunks`); vuelve a ejecutarlos para continuar. Nunca descargan un modelo.

Cuando las reglas cambian en una nueva versión, `status` y `tg store check` indican los chats construidos con las anteriores; vuelve a construirlos.

Un resultado marcado con `"stale": true` procede de un texto que se editó después de vectorizarlo: su puntuación corresponde al texto antiguo. Cuando se elimina un mensaje, su texto también sale de los vectores.

## Deja que tu agente de IA enlace mensajes

Las reglas pasan por alto enlaces que solo muestra el significado. Tu propio agente de IA, el que ya usas con tg, puede añadirlos:

```sh
tg skill show link-conversations                 # the agent's instructions
tg conversations batches status --chat "Book club"   # how many messages and batches, how much text
```

El agente lee las instrucciones, te dice cuánto texto leería y espera tu sí. Después recorre el chat por lotes (`tg conversations batches next`), decide a qué mensaje anterior responde cada uno y guarda su respuesta (`tg conversations links add`). La siguiente construcción las usa. Primero van las respuestas propias de Telegram, después los enlaces del agente y por último las reglas. `tg conversations links clear --chat "Book club"` descarta las respuestas del agente. En este flujo dirigido por el agente, tg no llama por sí mismo a ningún modelo. El permiso de perfil `conversations.links` decide si se pueden guardar las respuestas.

Un `build` normal usa las reglas y los enlaces guardados. `tg conversations build --chat <chat> --analyze` envía lotes limitados a servicios compatibles con OpenAI o de Anthropic que hayas configurado. Se requiere un `--chat` explícito. Indica el volumen, el servicio y el límite de tokens, y después pide consentimiento; el consentimiento se recuerda para esa combinación de cuenta, chat y proveedor hasta que se revoque. Por defecto son 50 mensajes por lote y una reserva máxima de 100 000 tokens por ejecución; `--yes` da el consentimiento en scripts. `tg conversations consents list` muestra los consentimientos; `consents revoke --chat <chat>` revoca uno. El análisis integrado solo está en la CLI; las claves se guardan fuera de la configuración.

## Privacidad y coste

Por defecto nada sale de tu equipo. El modelo se ejecuta aquí, y un modelo solo se descarga cuando lo pides:

```sh
tg models text list                              # the models, and which are downloaded
tg models text download embeddinggemma --accept-terms
```

`e5-small` es el predeterminado: pequeño y rápido, con unos 100 idiomas. `embeddinggemma` encuentra más pero es unas siete veces más lento, y solo se descarga con `--accept-terms`, porque está sujeto a las condiciones de Gemma de Google. Los vectores de dos modelos nunca se mezclan: busca con el modelo con el que vectorizaste.

En un portátil reciente, `e5-small` vectoriza unos 30 fragmentos por segundo; un grupo de 100 000 mensajes tarda algo más de 20 minutos, una sola vez. Las ejecuciones siguientes vectorizan solo lo que ha cambiado.

Un servicio puede calcular los vectores en su lugar, con tu propia clave:

```sh
tg models text key set openai
tg conversations embed --chat "Book club" --provider openai
tg conversations search "renting a flat" --provider openai
```

En ese caso, el texto de las conversaciones del chat va a ese servicio, y cada búsqueda envía tu pregunta. Antes de enviar nada, `embed` indica cuántos fragmentos, cuántos tokens como máximo y qué precio como máximo, y espera tu sí (`--yes` en scripts; `--max-tokens` fija un límite). `--base-url` acepta cualquier servidor con la API de embeddings de OpenAI, como Ollama o LM Studio en tu propio equipo, con `--model` y `--dims`. `tg models text key remove openai` olvida la clave.

## Para agentes

En MCP, `tg_read` (`command: "conversations list"`), `tg_read` (`command: "conversations show"`), `tg_read` (`command: "conversations search"`), `tg_read` (`command: "conversations related"`) y `tg_read` (`command: "conversations status"`) leen los datos preparados; `tg_write` (`command: "conversations refresh"`) los pone al día en este ordenador. MCP ofrece `tg_read` (`command: "conversations batches status"`), `tg_read` (`command: "conversations batches next"`), `tg_write` (`command: "conversations links add"`), `tg_write` (`command: "conversations links clear"`) y `tg_write` (`command: "conversations build"`), además del prompt `link-conversations`. Informa del coste del lote y obtén el consentimiento del propietario antes de leer lotes. Los vínculos guardados requieren `conversations.links`; reconstruye después, también tras borrar vínculos. Los ajustes de embeddings remotos afectan también a las búsquedas MCP y pueden enviar el texto de consulta. La parte técnica — reglas, fragmentos, vectores y clasificación — está en [cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture).
