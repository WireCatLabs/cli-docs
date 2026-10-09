---
title: "Búsqueda por tema"
---

<a id="qué-es-una-conversación" />
<a id="construir-vectorizar-buscar" />
<a id="leer-lo-encontrado" />
<a id="mantenerlo-al-día" />
<a id="para-agentes" />
<a id="what-a-conversation-is" />
<a id="build-embed-search" />
<a id="read-what-was-found" />
<a id="keeping-it-current" />
<a id="for-agents" />

Recuerdas que en un chat se discutió algo, pero no las palabras que usaba la gente. La búsqueda de temas encuentra esa discusión por su significado. Pregunta "¿dónde hablamos de alquilar un piso?" y encuentra una conversación que dice "departamento", "arrendamiento" y "fianza", aunque nadie haya escrito "alquilar piso". También funciona en todos los idiomas: una pregunta en inglés encuentra una discusión en español o ruso.

Después de leer esta página, puede preparar un chat para la búsqueda de temas, hacer preguntas con sus propias palabras, leer los resultados y decidir cuándo la búsqueda de palabras ordinaria es la mejor herramienta. La búsqueda de temas utiliza solo los mensajes que tg ya ha guardado en esta computadora, así que descargue primero el historial: `tg store fetch <chat>` ([descargar el historial de un chat](./archive.md#fetch-a-chats-history)).

Términos utilizados en esta página:

- **Conversación**: una discusión dentro de un chat. En un grupo ocupado se desarrollan varias conversaciones al mismo tiempo y sus mensajes se mezclan. tg los separa; una conversación es la lista de mensajes que van juntos, los más antiguos primero.
- **Pieza**: una parte breve de una conversación, de unos 1.200 caracteres. Las conversaciones largas se dividen en partes para que cada parte trate sobre una cosa.
- **Vector**: una lista de números que representan lo que significa un texto. Los textos sobre un mismo tema obtienen vectores similares, incluso cuando las palabras o el idioma difieren.
- **Model**: el pequeño programa que convierte texto en vector. Se ejecuta en su computadora de forma predeterminada.

La búsqueda de tema no es el campo `topic:` de [búsqueda de mensajes](./search.md). `topic:` mantiene un tema de foro de un grupo de Telegram. Una conversación aquí es algo que tg encuentra por sí solo, en cualquier chat.

## Qué puedes hacer

| Tarea | Comando |
|---|---|
| Encuentre una discusión por tema, en un chat o en cada chat preparado | `tg search conversations "<question>"` |
| Ver las conversaciones de un chat, las más nuevas primero | `tg conversations list --chat <chat>` |
| Lea una conversación de principio a fin | `tg conversations show <id>` |
| Abrir toda la conversación a la que pertenece un mensaje | `tg conversations show <chat> <message>` |
| Encuentra otras conversaciones sobre lo mismo, en cada chat | `tg conversations related <chat> <message>` |
| Limitar resultados a una persona, un punto o una palabra | `tg search conversations "<question>" --filter '<query>'` |
| Vea lo que está desactualizado y póngase al día | `tg conversations status`, `tg search conversations "<question>" --refresh` |
| Deje que su propio agente de IA mejore la forma en que se agrupan los mensajes | `tg skill show link-conversations` |

## ¿Búsqueda de tema o búsqueda de palabras?

| | [Búsqueda de palabras](./search.md) (`tg search messages`) | Búsqueda de tema (`tg search conversations`) |
|---|---|---|
| Ya sabes | las palabras exactas, un nombre, una fecha, un archivo | sólo de qué se trataba |
| Se encuentra | mensajes individuales que contienen tus palabras | conversaciones completas sobre tu pregunta |
| Otras palabras para lo mismo | no: "piso" no encuentra "apartamento" | si |
| Otros idiomas | no | sí, unos 100 idiomas con el modelo predeterminado |
| Filtros exactos (remitente, fecha, archivo, enlace) | sí, el [lenguaje de consulta completo](./query-language.md) | sí, a través de `--filter` |
| Preparación | descargar la historia | descargar el historial, luego `build` y `embed` |
| Pregunta Telegram | sí, por defecto | no, solo lee esta computadora |

Utilice la búsqueda de palabras cuando recuerde una palabra, un número, un nombre o un archivo. Utilice la búsqueda de temas cuando recuerde el tema pero no la redacción, cuando una discusión se extienda en muchos mensajes cortos o cuando las personas escribieron en otro idioma. Si no está seguro, intente primero la búsqueda de temas: también coincide con sus palabras, por lo que una conversación que las utilice aún se ubicará en la parte superior.

## Pruébalo

Prepare un chat una vez y luego haga tantas preguntas como desee.

**Su solicitud a su agente de IA:**

> En Club de lectura, busque dónde discutimos trasladar las reuniones a otro lugar. Muestra la conversación.

**Qué pasa, paso a paso:**

```sh
tg store fetch "Book club"                       # 1. download the history, if it is not saved yet
tg conversations build --chat "Book club"        # 2. separate the chat into conversations
tg models text download e5-small                 # 3. once: download the model, 135 MB, shared with max
tg conversations embed --chat "Book club"        # 4. compute a vector for each piece
tg search conversations "where do we meet" --chat "Book club"   # 5. ask
tg conversations show 91                         # 6. read the conversation that was found
```

Los pasos 2 a 4 se ejecutan en su computadora y nunca consultan Telegram. `embed` continúa donde se detuvo si lo interrumpes. Las preguntas posteriores sólo necesitan el paso 5; [manténgalo actualizado](#keep-it-current) explica cuándo repetir los pasos 2 y 4.

**Resultado de ejemplo** (ficticio):

```text
0.874  91  2026-09-14 18:02–18:40  23 messages · 4 people · from message 4180  (messages 4185–4192)  msg:telegram/500/7/4185
0.851  64  2026-08-02 10:15–10:31  9 messages · 3 people · from message 3302  (messages 3302–3310)  msg:telegram/500/7/3302
```

Un resultado es una pista, no una respuesta: abre la conversación y lee los mensajes antes de confiar en ella.

## Cómo funciona

La búsqueda de temas tiene tres etapas. Los dos primeros preparan una charla una vez; el tercero se ejecuta para cada pregunta.

### 1. Construir: separar el chat en conversaciones

`tg conversations build` lee los mensajes guardados de un chat, los más antiguos primero, y decide para cada mensaje cuál mensaje anterior continúa. No utiliza IA y no solicita Telegram. Los enlaces provienen, en este orden:

1. **Respuestas propias de Telegram.** Un mensaje enviado como respuesta pertenece al mensaje que responde.
2. **Las respuestas de su agente**, si le pidió a su agente que vincule el chat ([abajo](#let-your-ai-agent-link-messages)).
3. **Una mención.** Un mensaje que menciona a alguien pertenece al último mensaje de esa persona. Una mención es un `@username`, una mención marca Telegram o un mensaje que comienza con el nombre de usuario de la persona y dos puntos o una coma (`anna: agreed`). tg revisa como máximo 50 mensajes, y solo en el mismo tema del foro.
4. **La misma persona escribiendo nuevamente.** El siguiente mensaje de una persona continúa con el anterior si llega dentro de los 5 minutos y dentro de los últimos 10 mensajes.

Un mensaje sin enlace inicia una nueva conversación. Una conversación puede omitir los mensajes intermedios que pertenecen a otras conversaciones. Las reglas adivinan: pueden dividir una discusión en dos o unir dos discusiones en una. Una nueva compilación reemplaza a la anterior, así que tome el número de una conversación de un `list` nuevo en lugar de conservarlo.

### 2. Incrustar: convierte cada pieza en un vector

`tg conversations embed` corta cada conversación en partes de aproximadamente 1200 caracteres, en los límites del mensaje. Cada línea de una pieza es "remitente: texto". Un mensaje más largo que una pieza se divide en partes superpuestas, por lo que el modelo lee todo un mensaje largo, no solo su comienzo. Los mensajes sin texto no añaden nada. Luego, el modelo convierte cada pieza en un vector y tg lo guarda. El texto de la pieza no se vuelve a guardar; solo su vector y una huella digital que muestra cuando cambia el texto.

### 3. Búsqueda: por significado y por palabras al mismo tiempo

`tg search conversations` busca tu pregunta de dos maneras y une los resultados:

- **Por significado.** La pregunta también se convierte en un vector. tg lo compara con los vectores de todas las piezas y clasifica cada conversación según su pieza más cercana. Con el modelo predeterminado `e5-small`, una coincidencia por significado debe ser lo suficientemente cercana: su puntuación de similitud debe ser superior a 0,80, en una escala donde 1 significa el mismo significado.
- **Por palabras.** tg también busca cada palabra de tu pregunta en los mensajes guardados. Una palabra de tres o más letras también coincide con palabras más largas que comienzan con ella (`meet` busca `meeting`). Los errores tipográficos no se corrigen.

Una conversación que se encuentra en ambos sentidos está por encima de una que se encuentra en un solo sentido. Cada resultado dice cómo se encontró: `"by": ["meaning"]`, `["words"]` o ambos. Sin un modelo descargado, la búsqueda aún se realiza solo por palabras y la respuesta dice `"meaning": "unavailable"`. Un chat que nunca se creó no se busca: constrúyalo primero.

**Por qué esto encuentra más que una búsqueda de palabras:** la búsqueda de palabras necesita la misma palabra en el mensaje. La búsqueda de significado compara de qué tratan los textos y lee una parte de la conversación, no un mensaje. Entonces, "¿dónde nos encontramos?" se puede encontrar una discusión en la que una persona pregunta "¿biblioteca o cafetería?" y otro responde "el café de Main Street es más tranquilo". La palabra mitad evita que se pierdan nombres exactos y palabras raras.

Los detalles técnicos (las reglas medidas, las piezas, los vectores y la clasificación) se encuentran en [cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture).

## Leer los resultados

En la terminal cada resultado es una línea:

- la puntuación de similitud, o `—` cuando solo se encontraron palabras;
- el número de la conversación, cuándo empezó y terminó, cuántos mensajes y personas, su primer mensaje;
- `(messages 4185–4192)`: la pieza que mejor coincidió (o el mensaje, cuando solo se encontraron palabras), para que sepas por dónde empezar a leer;
- el localizador de mensajes (`msg:…`), que aceptan `tg messages show` y `tg messages context`;
- `stale` cuando el texto cambió después de calcular su vector: la puntuación es para el texto antiguo.

Con `--json`, la respuesta también tiene `meaning` (`searched` o `unavailable`), el `model` utilizado y `readiness`: qué chats se buscaron por significado, cuáles solo por palabras, cuáles están desactualizados y cuáles nunca se construyeron. Cuando algo limita la búsqueda, stderr nombra los chats y el comando que lo soluciona, por ejemplo `conversations embed --chat <chat>`.

```sh
tg conversations list --chat "Book club" --since-time 7d
tg conversations show 91                         # one conversation, oldest first
tg conversations show "Book club" 204            # the conversation message 204 is in
tg conversations related "Book club" 204         # other conversations about the same thing, in every chat
tg messages links "Book club" 204                # why that message is where it is
```

`related` utiliza los vectores que `embed` guardó y no ejecuta ningún modelo, por lo que responde rápidamente. Es una búsqueda únicamente por significado.

## Ejemplos resueltos

**Recuerdas el tema, no las palabras.**

```sh
tg search conversations "who is bringing food to the picnic"
```

Esto busca en todos los chats preparados. Puede encontrar una conversación en la que la gente escribió "Tomaré sándwiches" y "Bob tiene las bebidas", algo que la búsqueda de palabras omitiría.

**La discusión fue en otro idioma.**

```sh
tg search conversations "renting a flat" --chat "Valencia expats"
```

Con el modelo predeterminado, este puede encontrar una discusión escrita en español sobre un "piso".

**Restringido por persona y período.** `--filter` utiliza el estricto [lenguaje de consulta](./query-language.md). Una conversación califica cuando al menos uno de sus mensajes coincide con todo el filtro. Su pregunta todavía coincide con el significado.

```sh
tg search conversations "budget for the trip" --filter 'from:"Alice Synthetic" date:30d'
```

```sh
tg search conversations "contract terms" --filter 'has:file' --timezone Europe/Madrid
```

**Comienza desde un mensaje.** Encontraste un mensaje con búsqueda de palabras y quieres todo lo demás sobre ese tema:

```sh
tg search messages '"deposit back"' --chat "Valencia expats"
tg conversations related "Valencia expats" 5120
```

**Busca también en los chats de tus bots.** De forma predeterminada, la búsqueda de temas utiliza la cuenta activa. `--source personal`, `bots`, `all` o un nombre de messenger lo amplía; Luego, cada resultado dice de qué cuenta proviene.

```sh
tg search conversations "delivery delayed" --source all
```

**Busca mensajes nuevos antes de preguntar.** `--sync-first` descarga los mensajes nuevos primero, dentro de los límites de chat, tiempo y mensajes de la búsqueda de mensajes.

```sh
tg search conversations "where do we meet" --chat "Book club" --sync-first
```

## Mantenlo actualizado

Los mensajes nuevos llegan a una conversación solo tras la siguiente construcción, y a un vector solo tras la siguiente vectorización.

```sh
tg conversations status                          # what is behind, chat by chat
tg conversations build                           # every chat that changed, and groups never built
tg conversations embed                           # every built chat with pieces left
tg search conversations "renting a flat" --refresh   # catch up first, then search
```

`status` cuenta, para cada chat creado, los mensajes que la compilación no ha visto (nuevos, editados, eliminados), las piezas cuyo vector está actual, obsoleto o faltante, y cuántos grupos nunca se crearon. Sin `--chat`, `build`, `embed` y `search --refresh` aceptan como máximo 20 chats por ejecución (`--max-chats`) e incrustan como máximo 2000 piezas por ejecución (`--max-chunks`); ejecútelos nuevamente para continuar. Nunca descargan un modelo. `--refresh` no se puede combinar con `--filter` o `--source`: primero cree e incruste los chats que desee.

Cuando las reglas cambian en una nueva versión, `status` y `tg store check` nombran los chats creados con las reglas anteriores; construirlos de nuevo.

Cuando se elimina un mensaje, su texto también abandona los vectores.

`tg store fetch <chat> --catch-up` también puede crear e incrustar un chat inmediatamente después de descargarlo ([descargar el historial de un chat](./archive.md#fetch-a-chats-history)).

## Deja que tu agente de IA enlace mensajes

Las reglas omiten enlaces que solo muestran el significado. Su propio agente de IA (por ejemplo Claude Code, Codex, Cursor o Gemini CLI) puede agregarlos:

```sh
tg skill show link-conversations                 # the agent's instructions
tg conversations batches status --chat "Book club"   # how many messages and batches, how much text
```

El agente lee las instrucciones, te dice cuánto texto leerá y espera tu sí. Luego toma el chat por lotes a la vez (`tg conversations batches next`), decide qué mensaje anterior responde cada uno y guarda su respuesta (`tg conversations links add`). La siguiente versión los utiliza: las respuestas de Telegram vienen primero, luego los enlaces del agente y luego las reglas. `tg conversations links clear --chat "Book club"` descarta las respuestas del agente; construir de nuevo después. En este flujo de trabajo, tg en sí no llama a un modelo. El permiso de perfil `conversations.links` decide si se pueden guardar las respuestas.

tg también puede enviar los lotes a un servicio modelo. El habitual `build` utiliza reglas y enlaces guardados; `tg conversations build --chat <chat> --analyze` envía lotes limitados a un punto final Anthropic o compatible con OpenAI configurado. Se requiere un `--chat` explícito. Antes del primer lote, muestra el volumen, el punto final y el límite del token, y solicita consentimiento. El consentimiento se recuerda para esa cuenta, chat y proveedor hasta que lo revoques. Los valores predeterminados son 50 mensajes por lote (`--size`) y como máximo 100.000 tokens reservados por ejecución (`--max-tokens`); `--yes` otorga consentimiento en scripts. `tg conversations consents list` enumera los consentimientos; `consents revoke --chat <chat>` los revoca. El análisis integrado funciona sólo desde la línea de comandos, no a través de MCP, y las claves nunca van al archivo de configuración.

## Privacidad y coste

Por defecto nada sale de tu equipo. El modelo se ejecuta aquí, y un modelo solo se descarga cuando lo pides:

```sh
tg models text list                              # the models, and which are downloaded
tg models text download embeddinggemma --accept-terms
```

`e5-small` es el predeterminado: pequeño y rápido, alrededor de 100 idiomas. `embeddinggemma` encuentra más, pero se ejecuta aproximadamente siete veces más lento y se descarga solo con `--accept-terms`, ya que está bajo los términos Gemma de Google. Los vectores de dos modelos nunca se mezclan: busque con el modelo con el que incrustó. Un chat integrado solo con otro modelo se nombra en stderr.

En un portátil reciente, `e5-small` vectoriza unos 30 fragmentos por segundo; un grupo de 100 000 mensajes tarda algo más de 20 minutos, una sola vez. Las ejecuciones siguientes vectorizan solo lo que ha cambiado.

Un servicio puede calcular los vectores en su lugar, con tu propia clave:

```sh
tg models text key set openai
tg conversations embed --chat "Book club" --provider openai
tg search conversations "renting a flat" --provider openai
```

Luego el texto de las conversaciones del chat pasa a ese servicio, y cada búsqueda envía tu pregunta. Antes de enviar cualquier cosa, `embed` dice cuántas piezas, como máximo cuántos tokens y como máximo qué precio, y espera su sí (`--yes` en scripts; `--max-tokens` establece un límite). `--base-url` toma cualquier servidor con la API integrada de OpenAI, como Ollama o LM Studio en su propia computadora, con `--model` y `--dims`. `tg models text key remove openai` olvida la clave. La configuración de incrustación remota también se aplica a las búsquedas que su agente realiza en MCP, por lo que sus preguntas también se dirigen a ese servicio.

## Próximo

- [Búsqueda de mensajes](./search.md): palabras exactas, personas, fechas y archivos.
- [Cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture): la parte técnica de las reglas, piezas, vectores y ranking.
