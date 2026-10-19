---
title: "Búsqueda por tema"
---

<a id="qué-es-una-conversación" />
<a id="construir-vectorizar-buscar" />
<a id="para-agentes" />
<a id="что-такое-разговор" />
<a id="построить-посчитать-векторы-искать" />
<a id="для-агентов" />

Recuerdas que discutiste algo en el chat, pero no recuerdas con qué palabras. Una búsqueda por tema encuentra dicha discusión por tema. Pregunte "¿dónde hablamos sobre alquilar un apartamento?" - y encontrará una conversación en la que estaban "alquiler", "depósito" y "arrendadora", aunque nadie escribió las palabras "alquilar un apartamento". También funciona entre idiomas: una pregunta en ruso se discute en inglés o español.

Después de leer esta página, puede preparar su chat para búsquedas de temas, hacer preguntas con sus propias palabras, leer los resultados y comprender cuándo es mejor realizar una búsqueda de palabras normal. La búsqueda de temas solo utiliza mensajes que `max` ya ha guardado en esta computadora, así que primero descargue el historial: `max personal messages sync <чат>` ([descargar historial de chat](./archive.md#скачать-историю)).

Términos de esta página:

- **Conversación**: discusión dentro de un chat. En un grupo activo, los mensajes de varias discusiones se intercalan. `max` las separa en listas de mensajes relacionados, del más antiguo al reciente.
- **Fragmento**: parte de una conversación de unos 1200 caracteres. Las largas se dividen para que cada parte trate un tema.
- **Vector**: números que representan el significado. Textos del mismo tema tienen vectores cercanos aunque cambien palabras o idioma.
- **Modelo de búsqueda**: programa que transforma texto en vectores. Por defecto funciona en tu ordenador.

La búsqueda por tema no es un campo `topic:` [búsqueda de mensajes](./search.md). `topic:` deja un hilo de discusión. La conversación aquí es la que se encuentra `max`, en cualquier chat.

## ¿Qué se puede hacer?

|Tarea|Comando|
|---|---|
|Encuentre una discusión sobre un tema, en un chat o en todos los preparados| `max personal search conversations "<вопрос>"` |
|Ver conversaciones de chat, las nuevas en la parte superior| `max personal conversations list <чат>` |
|Leer una conversación de principio a fin| `max personal conversations show <id>` |
|Abrir toda la conversación que contiene un mensaje.| `max personal conversations show <чат> <сообщение>` |
|Encuentra otras conversaciones sobre lo mismo en todos los chats| `max personal conversations related <чат> <сообщение>` |
|Limitar el resultado a una persona, punto o palabra| `max personal search conversations "<вопрос>" --filter '<запрос>'` |
|Descubra qué está desactualizado y póngase al día| `max personal conversations status`, `max personal search conversations "<вопрос>" --catch-up` |
|Pídale a su agente de IA que vincule mensajes con mayor precisión| `max skill show link-conversations` |

## ¿Buscar por tema o buscar por palabra?

| |[Búsqueda por palabras](./search.md) (`max personal search messages`)|Buscar por tema (`max personal search conversations`)|
|---|---|---|
|¿Qué recuerdas?|palabras exactas, nombre, fecha, archivo|justo lo que se discutio|
|lo que encuentra|mensajes individuales con tus palabras|conversaciones completas sobre tu pregunta|
|Otras palabras sobre lo mismo|no: “apartamento” no encontrará “vivienda”|Sí|
|Otros idiomas|No|sí, el modelo predeterminado tiene alrededor de 100 idiomas|
|Condiciones exactas (remitente, fecha, archivo, enlace)|sí, todo el [lenguaje de consulta](./query-language.md)|sí, a través de `--filter`|
|Preparación|descargar historia|historial de descargas, luego `build` y `embed`|
|Se refiere a MAX|sí, al buscar en un chat con nombre|no, solo esta computadora lo lee|

Búsqueda de palabras: cuando recuerda una palabra, número, nombre o archivo. Busque por tema: cuando recuerde el tema, pero no el texto, cuando la discusión se extienda a muchos mensajes cortos o cuando haya escrito en otro idioma. Si no está seguro, comience buscando por tema: también busca sus palabras, por lo que las conversaciones con ellas terminarán en la parte superior.

## Pruébalo

Prepara el chat una vez y luego haz tantas preguntas como quieras.

**Su solicitud al agente de IA:**

> En el Club de lectura, busca dónde hablamos para encontrarnos en otro lugar. Muestra la conversación.

**Qué sucede paso a paso:**

```sh
max personal messages sync "Книжный клуб"                  # 1. скачать историю, если её ещё нет
max personal conversations build --chat "Книжный клуб"   # 2. разделить чат на разговоры
max personal models text download e5-small               # 3. один раз: скачать модель, 135 МБ, общая с tg
max personal conversations embed --chat "Книжный клуб"   # 4. посчитать вектор каждого куска
max personal search conversations "где встречаемся" --chat "Книжный клуб"   # 5. спросить
max personal conversations show 91                       # 6. прочитать найденный разговор
```

Los pasos 2 a 4 se realizan en su computadora y no se accede a MAX. `embed` continúa donde lo dejó. Las siguientes preguntas sólo necesitan el paso 5; cuándo repetir los pasos 2 y 4 se indica en la sección [Frescura](#свежесть).

**Resultado de ejemplo** (ficticio):

```text
0.874  91  2026-09-14 18:02–18:40  23 messages · 4 people · from message 4180  (messages 4185–4192)  msg:max/500/7/4185
0.851  64  2026-08-02 10:15–10:31  9 messages · 3 people · from message 3302  (messages 3302–3310)  msg:max/500/7/3302
```

Lo que encuentras es una pista, no una respuesta: abre la conversación y lee los mensajes antes de confiar en ella.

## Cómo funciona

Hay tres etapas para buscar por tema. Los dos primeros preparan el chat una vez; el tercero se realiza para cada pregunta.

### 1. Compilación: dividir el chat en conversaciones

`max personal conversations build` lee los mensajes de chat guardados del antiguo al nuevo y para cada uno decide qué mensaje anterior continúa. No se utiliza AI, el comando no accede a MAX. Las conexiones se toman en este orden:

1. **Respuestas de MAX.** Un mensaje enviado como respuesta enlaza con el mensaje respondido.
2. **Relaciones del agente**, si le pediste que conectara los mensajes ([más abajo](#связать-сообщения-поможет-ваш-агент)).
3. **Menciones.** El mensaje enlaza con el último de la persona mencionada mediante `@username`, una mención del servicio o un nombre al principio seguido de dos puntos o coma (`anna: согласна`). Se revisan hasta 50 mensajes anteriores.
4. **La misma persona vuelve a escribir.** Enlaza con su mensaje anterior si llegó hace menos de 5 minutos y está entre los últimos 10.

Un mensaje sin conexión inicia una nueva conversación. Una conversación puede omitir mensajes entre sí si son de otras conversaciones. Las reglas se adivinan: pueden dividir una discusión en dos o unir dos en una. El nuevo `build` reemplaza al anterior, así que tome el número de conversación del nuevo `list` y no lo almacene.

### 2. Incrustar: convierte cada pieza en un vector

`max personal conversations embed` corta cada conversación en partes de unos 1200 caracteres, a lo largo de los límites de los mensajes. Cada línea del fragmento es "remitente: texto". Un mensaje más largo que una pieza se divide en partes superpuestas para que el modelo lea el mensaje largo completo, y no solo el principio. Los mensajes sin texto no añaden nada. Luego, el modelo convierte cada pieza en un vector y `max` lo almacena. El texto de la pieza en sí no se guarda por segunda vez, sólo el vector y la huella digital, lo que muestra que el texto ha cambiado.

### 3. Búsqueda: por significado y por palabras al mismo tiempo

`max personal search conversations` busca su pregunta de dos maneras y combina los resultados:

- **Por significado.** Convierte también la pregunta en un vector, lo compara con los fragmentos y puntúa cada conversación por el más cercano. Con `e5-small`, exige similitud superior a 0,80 en una escala donde 1 es significado idéntico.
- **Por palabras.** Busca cada palabra de la pregunta. Con tres letras o más también encuentra palabras que empiezan por ella (`встреч` encuentra «встреча»). No corrige erratas.

Una conversación encontrada usando ambos métodos tiene un valor más alto que una conversación encontrada usando un método. Cada resultado dice cómo se encontró: `"by": ["meaning"]` (por significado), `["words"]` (por palabras) o ambos. Sin el modelo descargado, la búsqueda aún funciona, solo por palabras, y luego la respuesta es `"meaning": "unavailable"`. No se visualiza un chat que nunca se ha construido: primero `build`.

**¿Por qué esto encuentra más que una búsqueda de palabras?** una búsqueda de palabras necesita la misma palabra en el mensaje. La búsqueda por significado compara de qué tratan los textos y lee un fragmento de conversación, no solo un mensaje. Por lo tanto, “¿dónde nos encontramos” puede encontrarse en una discusión en la que uno pregunta “¿la biblioteca o un café?” y otro respondió “el café de la esquina es más tranquilo”. La mitad por palabras evita que pierdas nombres exactos y palabras raras.

El aspecto técnico (reglas, piezas, vectores y orden de resultados) en la página [cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture).

## Leer lo encontrado

En la terminal, cada resultado es una línea:

- evaluación de similitud, o `—`, si se encuentra únicamente mediante palabras;
- el número de la conversación, cuándo empezó y terminó, cuántos mensajes y personas, su primer mensaje;
- `(messages 4185–4192)` - la pieza que mejor coincida (o el mensaje, si lo encontraste sólo por palabras): empieza a leer desde allí;
- enlace al mensaje (`msg:…`), aceptado por `max personal messages show` y `max personal messages context`;
- `stale`, si el texto fue modificado después de calcular el vector: la puntuación es para el texto antiguo.

Con `--json`, lo que la búsqueda no pudo ver por significado son entradas en `missing`: el modelo no está descargado, los vectores están desactualizados, el chat nunca se construyó o no se descargó. Junto a ellas, en `next`, está el comando que lo arreglará, por ejemplo `conversations embed --chat <чат>`; las cuentas están en `meta.accounts`.

```sh
max personal conversations list "Книжный клуб" started_at>=7d
max personal conversations show 91                       # один разговор, от старых к новым
max personal conversations show "Книжный клуб" 204       # разговор, в котором сообщение 204
max personal conversations related "Книжный клуб" 204    # другие разговоры о том же, во всех чатах
max personal messages links "Книжный клуб" 204           # почему сообщение там, где оно есть
```

`related` toma los vectores que guardó `embed` y no ejecuta el modelo, por lo que responde rápidamente. Esta es una búsqueda únicamente de significado.

## Ejemplos

**Recuerda el tema, no las palabras.**

```sh
max personal search conversations "кто берёт еду на пикник"
```

La búsqueda se realiza en todos los chats preparados. Puede encontrar una conversación en la que escribieron "Tomaré sándwiches" y "Bori toma unas copas"; una búsqueda por palabras no la encontraría.

**Discutido en otro idioma.**

```sh
max personal search conversations "аренда квартиры" --chat "Клуб Пример"
```

Con el modelo predeterminado, esto también ocurre en español, sobre “piso”.

**Restringido por persona y período.** `--filter` acepta estricto [lenguaje de consulta](./query-language.md). Una conversación es adecuada si al menos uno de sus mensajes cumple todas las condiciones. Todavía se busca el significado de la pregunta misma.

```sh
max personal search conversations "бюджет поездки" --filter 'from:"Алиса Тестова" date:30d'
```

```sh
max personal search conversations "условия договора" --filter 'has:file' --timezone Europe/Madrid
```

**Comienza con un mensaje.** Encontraste un mensaje usando una búsqueda de palabras y quieres todo lo demás sobre este tema:

```sh
max personal search messages '"вернули залог" chat:"Клуб Пример"'
max personal conversations related "Клуб Пример" 5120
```

**Busca también en chats de bots.** Por defecto, la búsqueda de temas se realiza en la cuenta actual. `--source personal`, `bots`, `all` o el nombre del servicio de mensajería amplía el alcance; luego cada resultado dice de qué cuenta proviene.

```sh
max personal search conversations "задержка доставки" --source all
```

**Descargar mensajes nuevos antes de preguntar.** `--sync-first` descarga primero los mensajes nuevos, dentro del chat, la hora y la cantidad de mensajes, como la búsqueda de mensajes.

```sh
max personal search conversations "где встречаемся" --chat "Книжный клуб" --sync-first
```

## Mantenerlo al día

Los mensajes nuevos se incorporan a una conversación solo tras el siguiente `build`, y a los vectores solo tras el siguiente `embed`.

```sh
max personal conversations status                         # что отстало, по чатам
max personal conversations build                          # все изменившиеся чаты и группы, ни разу не построенные
max personal conversations embed                          # все построенные чаты, где остались куски
max personal search conversations "аренда квартиры" --catch-up  # сначала догнать, потом искать
```

`status` cuenta para cada mensaje de chat creado que `build` aún no ha visto (nuevo, modificado, eliminado), piezas con un vector actual, desactualizado o faltante, y cuántos grupos nunca se han creado. Sin `--chat`, los comandos `build`, `embed` y `search conversations --catch-up` no toman más de 20 chats a la vez (`--max-chats`) y no cuentan más de 2000 piezas (`--max-chunks`); ejecutar de nuevo para continuar. No descargan el modelo. `--catch-up` no se puede combinar con `--filter` y `--source`: primero cree y cuente los chats necesarios.

Cuando las reglas cambian en la nueva versión, `status` y `max personal store check` llaman a los chats creados según los antiguos; constrúyanlos nuevamente.

Cuando se elimina un mensaje, su texto también desaparece de los vectores.

`max personal messages sync <чат> --catch-up` puede inmediatamente después de la descarga crear conversaciones de chat y calcular vectores ([descargar el historial de chat](./archive.md#скачать-историю)).

## Deja que tu agente de IA enlace mensajes

Las reglas no ven conexiones que sean comprensibles sólo por el significado. Su propio agente de IA puede agregarlos (por ejemplo, Claude Code, Codex, Cursor o Gemini CLI):

```sh
max skill show link-conversations                     # инструкция для агента
max personal conversations batches status --chat "Книжный клуб"   # сколько сообщений и пачек, сколько текста
```

El agente lee instrucciones, estima cuánto texto procesará y espera tu aprobación. Lee lotes (`max personal conversations batches next`), decide a qué mensaje anterior responde cada uno y guarda los enlaces (`max personal conversations links add`). El siguiente `build` los incorpora después de las respuestas de MAX y antes de las reglas. `max personal conversations links clear --chat "Книжный клуб"` los elimina; reconstruye después el chat. En este flujo, `max` no llama a un modelo directamente. El permiso `conversations.links` permite guardar enlaces.

`max` puede enviar él mismo los paquetes al servicio de modelos. Normal `build` utiliza reglas y conexiones guardadas; `max personal conversations build --chat <чат> --analyze` transfiere paquetes limitados a un servicio personalizado compatible con OpenAI o Anthropic. Se necesita un `--chat` explícito. Antes de la primera transferencia, el comando muestra el volumen, la dirección y el límite de tokens y solicita consentimiento; se guarda para la cuenta, el chat y el servicio seleccionado hasta su revocación. De forma predeterminada, el paquete es de 50 mensajes (`--size`), el límite de reserva es de 100.000 tokens por ejecución (`--max-tokens`); `--yes` da consentimiento en los guiones. `max personal conversations consents list` muestra su consentimiento, `consents revoke --chat <чат>` los retira. El análisis integrado sólo está disponible desde la línea de comandos, no a través de MCP; las claves no se escriben en el archivo de configuración.

## Privacidad y coste

De forma predeterminada, nada sale de la computadora. El modelo funciona aquí y se descarga solo con su comando:

```sh
max personal models text list                             # модели и какие скачаны
max personal models text download embeddinggemma --accept-terms
```

`e5-small` es el predeterminado: pequeño, rápido y con unos 100 idiomas. `embeddinggemma` encuentra más, pero es unas siete veces más lento y requiere `--accept-terms` para aceptar las condiciones de Google Gemma. No se mezclan sus vectores: busca con el modelo usado para calcularlos. stderr indica los chats calculados solo con otro modelo.

En un portátil reciente, `e5-small` vectoriza unos 30 fragmentos por segundo; un grupo de 100 000 mensajes tarda algo más de 20 minutos, una sola vez. Las ejecuciones siguientes vectorizan solo lo que ha cambiado.

Un servicio puede calcular los vectores en su lugar, con tu propia clave:

```sh
max personal models text key set openai
max personal conversations embed --chat "Книжный клуб" --provider openai
max personal search conversations "аренда квартиры" --provider openai
```

Luego, el texto de las conversaciones de chat va a este servicio, y cada búsqueda le envía su pregunta. Antes de enviar algo, `embed` indica el número de piezas, el mayor número de tokens y el precio más alto y espera "sí" (`--yes` en los scripts; `--max-tokens` establece el límite). `--base-url` acepta cualquier servidor con OpenAI Vectors API (`/v1/embeddings`), como Ollama o LM Studio en su computadora, junto con `--model` y `--dims`. `max personal models text key remove openai` olvida la clave. La configuración de vectores externos también afecta la búsqueda que realiza su agente a través de MCP: sus preguntas también van a este servicio.

## Más

- [Buscar mensajes](./search.md) - palabras exactas, personas, fechas y archivos.
- [Cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture): el aspecto técnico de las reglas, piezas, vectores y orden de los resultados.
