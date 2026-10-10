---
title: "Búsqueda"
---

<a id="prueba-una-búsqueda-concreta" />
<a id="scripts-y-agentes" />
<a id="preparar-los-archivos-y-el-historial-local" />
<a id="для-скриптов-и-агентов" />
<a id="подготовка-файлов-и-архива" />

Esta página te ayuda a encontrar mensajes, acuerdos, archivos o códigos antiguos. Explica cómo buscar en lo que `max` conserva en este ordenador: mensajes MAX, correo y notas importados por [memo](https://github.com/WireCatLabs/cli-memo), y cómo consultar el servidor MAX.

Después de leerlo, podrás encontrar mensajes por palabras, personas, chats, fechas, archivos y enlaces, guardar la búsqueda y ejecutarla nuevamente, contar coincidencias y distinguir entre un “no encontrado” real y un vacío en el historial guardado. La búsqueda no marca nada como leído.

Términos de esta página:

- **Archivo local** (también llamada archivo) es una base de datos en esta computadora donde `max` almacena cada mensaje leído o descargado ([archivo local](./archive.md)). La mayoría de las búsquedas solo leen esto.
- **Consulta**: lo que busca: palabras normales o palabras con campos como `from:` y `date:`. Un agente de IA escribe solicitudes por usted; todo el idioma está en [referencia del idioma de consulta](./query-language.md).
- **Cobertura** (`coverage`): qué pudo ver la búsqueda: cuántos chats y mensajes están guardados y qué chats nunca se descargaron o se quedaron atrás.

## Cuando recuerdas la pregunta y no las palabras exactas

Pide a tu agente de IA que encuentre mensajes que respondan a una pregunta y muestre la evidencia. Por ejemplo: «Encuentra a qué hora se ejecuta la exportación diaria del proyecto Mayak en su chat y comprueba si cambió el horario». Puede encontrar coincidencias parciales y respuestas directas, y después leer los mensajes. Necesita historial descargado; no requiere descargar un modelo.

Para controlar la búsqueda desde la línea de comandos:

```sh
max search messages 'Во сколько ежедневная выгрузка проекта Маяк?' --discover --chat 990 --json
```

Busca solo en el archivo local. Conserva las restricciones de chat, autor y fecha. En MCP, pasa `discover: true` a la herramienta de búsqueda de mensajes. `query.discovery` describe el conjunto limitado; `items[].discovery.missingTerms` indica palabras ausentes y `parent` enlaza una respuesta con el mensaje padre correspondiente. Una puntuación alta no mide la confianza en la respuesta: puede aparecer primero una pregunta, propuesta o decisión antigua. Lee la evidencia y comprueba la [cobertura del archivo](./archive.md) antes de concluir que falta un hecho.

Sin `--discover`, la búsqueda estricta sigue siendo la predeterminada. Sintaxis booleana, frases entre comillas, comodines, AST, `--exact` y `--newest` conservan sus reglas estrictas. No combina con legacy, expresiones regulares ni `--backend server`. La búsqueda semántica de conversaciones permanece como [búsqueda por temas](./topic-search.md) aparte.

## ¿Qué se puede hacer?

Toda la búsqueda se realiza en un grupo de comandos, `max search`. Si no sabes dónde fue escrito, comienza con `search all`.

|Tarea|Comando|
|---|---|
|Busque inmediatamente en mensajes, correo y notas.| `max search all '<запрос>'` |
|Buscar solo mensajes del servicio; sin `--discover`, también en el servidor MAX en un chat| `max search messages '<запрос>'` |
|Buscar solo correo importado mediante memo| `max search mail '<запрос>'` |
|Buscar notas desde una nota o carpeta| `max search notes '<запрос>'` |
|Encuentre una discusión basada en su tema.|`max search conversations '<вопрос>'` ([búsqueda por temas](./topic-search.md))|
|Contar coincidencias por chats, personas, días u horas| `max stats messages show '<запрос>'` |
|Guarde la búsqueda y ejecútela nuevamente.| `max searches create`, `max search messages --saved <имя>` |

```sh
max search all 'договор аренды'                 # сообщения, почта и заметки, лучшее первым
```

```sh
max search all 'договор' --only messages,notes  # без почты
```

```sh
max search messages 'договор' --chat Друзья     # только сообщения мессенджеров, без почты
```

```sh
max search mail 'счёт'                          # только почта, которую привёл memo mail import
```

```sh
max search notes 'бюджет' --type internal       # только заметки, написанные в memo
```

```sh
max search conversations 'переезд на дачу'      # разговоры, близкие по смыслу
```

`search all` escribe para cada hallazgo que se trata de un mensaje (`msg:…`) o una nota (`note:…`). `search messages` nunca devuelve correo y `search mail` nunca devuelve mensajes de mensajería instantánea; juntos solo `search all` los busca. `--type` para `search messages` deja solo texto, voz o archivos (`text|voice|file`), para `search notes` deja notas desde memo o desde una carpeta (`internal|file`). Si la solicitud tiene un campo que el correo o las notas no tienen (`chat:`, `from:`), `search all` los omite y lo dice.

memo importa correo y notas al archivo: `memo mail import` y `memo import`. Sin esas importaciones, `search all` solo busca mensajes.

Más adelante en esta página, busque mensajes, `max search messages`. Sin `--discover`, una búsqueda en un chat también solicita el servidor MAX ([a continuación](#поиск-на-сервере-max---backend)).

## Intenta buscar en un chat

Empieza por una frase y un chat. Este ejemplo busca en el historial guardado sin consultar el servicio de mensajería.

**Tu petición:**

> Usa max CLI. Encuentra el mensaje que dice «счёт оплачен» en Книжный клуб. Muestra la coincidencia y las lagunas del historial.

**Comando:**

```sh
max search messages '"счёт оплачен"' --chat "Книжный клуб" --backend archive --json
```

**Ejemplo de respuesta del agente:**

> **Un mensaje coincide en el historial guardado.**
>
> | Persona | Mensaje |
> | --- | --- |
> | Алиса Тестова | Счёт оплачен вчера. |
>
> El historial está incompleto: pueden faltar otras coincidencias. Puedo abrir el mensaje y la conversación que lo rodea.

Un resultado vacío no demuestra que el mensaje nunca existiera. Revisa las lagunas del historial antes de ampliar la búsqueda. Los ejemplos de esta página son ficticios.

## Primero, prepara el archivo

Para obtener buenos resultados, necesitas descargar los chats. El servidor de MAX solo busca en un chat concreto. Todo lo demás utiliza únicamente el archivo: buscar en todos los chats, contar con `stats`, buscar por temas, `has:`, `filename:`, regex, presets, etiquetas y formas de palabras. Empieza por descargar todos los chats:

```sh
max store fetch --all --background     # последние 90 дней каждого чата, в фоне
```

```sh
max store jobs show                    # сколько уже скачано
```

Un inicio descarga no más de 1200 mensajes por chat de forma predeterminada; repita el comando para continuar. `--since-time 365d` - más en el pasado; un chat: `max store fetch Друзья` ([descargar historial de chat](./archive.md#скачать-историю)). Además, `max serve` mantiene actualizado el archivo.

Cada búsqueda indica qué ha consultado. Si al archivo le puede faltar historial o no se encuentra nada, una línea en el terminal muestra cuántos mensajes y chats se han consultado, cuántos chats no se han descargado o están desactualizados y el comando para solucionarlo:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `max store fetch --all --background` fetches them
```

Con `--json` lo mismo en `coverage`: `messages`, `chats`, hasta diez chats en `attention` y `next`. Si no se encuentra nada y se especifica `next`, ejecute este comando (o pregunte al agente) antes de decidir que no hay ningún mensaje.

Escribe la consulta entre comillas simples para que la terminal no toque sus comillas ni sus corchetes. Los nombres de abajo son ejemplos; usa tus propios chats y personas.

## Palabras y frases

```sh
max search messages счёт
```

```sh
max search messages '"счёт оплачен"'             # слова подряд
```

```sh
max search messages 'кафе OR библиотека'
```

```sh
max search messages '(кафе OR библиотека) NOT шумно'
```

```sh
max search messages 'квартир*'                   # все слова, которые начинаются на «квартир»
```

Todas las palabras consecutivas de la consulta deben aparecer en el mensaje. La búsqueda reconoce formas de palabras: `квартира` encuentra «квартиру». Las comillas conservan el orden de las palabras, pero también permiten otras formas. Para buscar una forma exacta, usa `exact:квартира` o añade `--exact` para las palabras sin un campo explícito. Un `text:` explícito sigue buscando formas de palabras. No se distingue entre mayúsculas y minúsculas, marcas de acento, `ё` y `е`. Las erratas no se corrigen automáticamente. Las formas dependen de la configuración de idioma del archivo.

## Personas y chats

```sh
max search messages 'from:"Алиса Тестова" счёт'
```

```sh
max search messages 'from:("Алиса Тестова" OR "Борис Тестов") библиотека'
```

```sh
max search messages 'from:me date:7d'            # что вы писали за неделю
```

```sh
max search messages 'chat:"Книжный клуб" библиотека'
```

```sh
max search messages библиотека --chat "Книжный клуб"   # то же, опцией
```

```sh
max search messages 'паспорт kind:private'       # только личные переписки
```

`kind:` acepta `private` (Personal), `group`, `channel`, `saved` (Favoritos) y `bot`. Buscar todas las cuentas de archivo: `--source all`.

## Fechas

```sh
max search messages 'date:today'
```

```sh
max search messages 'библиотека date:yesterday'
```

```sh
max search messages 'счёт date:7d'               # от 7 дней назад до сейчас; также 30m, 2h
```

```sh
max search messages 'счёт date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu comando; `--timezone` elige otra. En un intervalo, `[` y `]` incluyen ese día; `{` y `}` lo excluyen.

## Archivos y enlaces

```sh
max search messages 'has:file'
```

```sh
max search messages 'filename:*.pdf'
```

```sh
max search messages 'filename:*договор*'         # часть имени
```

```sh
max search messages 'size>10MB'
```

```sh
max search messages 'size:[1KB TO 300KB]'
```

```sh
max search messages 'has:photo chat:"Книжный клуб"'
```

```sh
max search messages 'has:link AND "github.com"'  # ссылка на сайт
```

Un archivo se encuentra por su nombre y tamaño aunque el mensaje no tenga texto. `filename:` compara el nombre completo sin distinguir mayúsculas, acentos ni `ё`. Los tamaños usan KB, MB y GB de 1024. MAX no indica el tipo de archivo, así que busca por extensión: `filename:*.pdf`, en vez de `mime:`. `has:` también admite `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` y `poll`. Un enlace cuenta tanto si aparece en el texto como si solo está en su tarjeta.

## Texto dentro de archivos

`content:` busca texto dentro de archivos adjuntos: PDF, documento de Word, escaneo. Primero, el texto debe extraerse en el archivo; esto lo hace `max` o su agente. Más información sobre los archivos - [adjuntos](./attachments.md).

```sh
max attachments extract --chat "Книжный клуб" --download --output-dir ./files
```

```sh
max search messages 'content:договор'
```

```sh
max attachments list --chat "Книжный клуб" --needs-text
```

```sh
max attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

`attachments extract` lee archivos de texto sin formato, DOCX y PDF con una capa de texto en esta computadora. `--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos ya descargados. Si hay varios archivos adjuntos en el mensaje, indique uno hasta `--attachment`, comenzando por 1.

La extracción local también lee UTF-16 con BOM, codificaciones antiguas definidas con seguridad, ODT, ODS, XLSX, PPTX y EPUB, sin modelo y sin instalación adicional. Se conserva el orden de las hojas, diapositivas y capítulos, al igual que los valores de celda guardados; las fórmulas no se calculan, el texto dentro de las imágenes no es legible. Su agente debe verificar o traducir la codificación ambigua. Los archivos fuente no cambian. Para DOCX, ODT, ODS, XLSX, PPTX y EPUB, el límite es 1000 partes del archivo y 50 MiB en formato descomprimido, no más de 10 MiB por una parte de texto XML/HTML; los resultados corruptos o incompletos no se indexan como texto completo. Se puede volver a intentar una lectura local fallida; El texto del agente y el índice bueno anterior están protegidos.

Para PDF necesita el paquete opcional `unpdf`, para DOCX - `mammoth`, instalado en el mismo lugar que `max`. Al instalar npm globalmente: `npm install -g unpdf mammoth`. Si el paquete no está presente, el comando lo informa; el texto puede ser grabado por un agente.

**Las fotos y los escaneos** no tienen una capa de texto. El agente los lee de forma predeterminada con su OCR o herramientas de visión y escribe el texto a través de `attachments text set`. `attachments list --needs-text` le proporciona la ruta guardada, un enlace al mensaje y el número del archivo adjunto; El comando muestra las rutas y el estado del texto, pero no el texto en sí. Verifique la entrada buscando `content:`. Si el agente se ejecuta en otra computadora, la ruta en el servidor MCP no le transfiere el archivo: se requiere acceso al archivo para leerlo. Un agente de este tipo puede recibir los bytes del archivo almacenado en partes y verificar su hash a través de [attachments show](./attachments.md); La transmisión en sí no reconoce ni indexa el texto, por lo que el texto aún se graba a través de `attachments text set`.

**Muchos escaneos a la vez** se pueden transferir al servicio modelo de su elección. Especificar proveedor y modelo con visión en `models.ocr`; la clave se almacena mediante el comando habitual `models text key set`. En el ejemplo, reemplace `your-vision-model` con el nombre de su modelo.

```sh
max config set models.ocr.provider openai
```

```sh
max config set models.ocr.model your-vision-model
```

```sh
max models text key set openai
```

```sh
max attachments extract --chat "Книжный клуб" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` transfiere imágenes al servicio seleccionado; sin él, el modelo no se llama. Simultáneamente: de 1 a 8 solicitudes, por defecto 4. Límite de archivos: de 1 a 500, por defecto 100; `cursor` de la respuesta continúa con el bypass limitado. Los escaneos de PDF requieren `unpdf` y `@napi-rs/canvas` opcionales; no se procesan más de 20 páginas por documento. Las páginas con una capa de texto siguen siendo locales. La repetición utiliza el hash del archivo y el modelo seleccionado. El texto del agente y el índice anterior se conservan en caso de error o cancelación del OCR. Verifique `failed` y los estados de archivos individuales; Una vez que el proveedor está limitado, se detienen las nuevas solicitudes de esa ejecución. `--offline` no es compatible con `--ocr`.

**Archivos que ya tienes.** `max attachments extract --chat <чат> --from-dir ./files` lee una carpeta, sin subcarpetas. Necesita un archivo fuente que coincida de forma única o un conjunto completo de archivos con nombres de cargador. No combine `--from-dir` con `--download` o `--output-dir`. `max messages download <чат> <id> --extract` solo extrae texto de los archivos descargados en esta ejecución; `--all --extract` hace lo mismo durante todo el ejecución. Los archivos modificados son visibles mediante hash y el texto registrado por el agente se guarda. A través de MCP, la recuperación limitada devuelve `cursor` para continuación e información sobre los archivos, sin su texto.

`--from-dir` rechaza archivos y carpetas ocultos, las carpetas de la CLI y el almacén de mensajes. Las descargas de extracción por MCP requieren `output_dir` fuera de esos lugares. La extracción local de texto PDF admite hasta 20 páginas y 30 segundos.

## Contraseñas, códigos y tarjetas

```sh
max search messages 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
```

```sh
max search messages 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de inicio de sesión, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#preset).

## Etiquetas

```sh
max tags add work --chat "Книжный клуб"
```

```sh
max tags add work --contact "Борис Тестов"
```

```sh
max tags list --tag work --type chat
```

```sh
max search messages 'tag:work счёт'
```

```sh
max search messages 'счёт NOT tag:work'
```

```sh
max tags remove work --chat "Книжный клуб"
```

Una etiqueta es tu propia marca en un chat, una persona o un mensaje (`--message <id> --chat <чат>`). Se guarda en el archivo local y nunca se envía a MAX. `tag:work` encuentra los mensajes con la etiqueta `work`, los mensajes de un chat con esa etiqueta y los mensajes de una persona con esa etiqueta. Tiene entre 1 y 32 caracteres: letras latinas a–z, números y guiones.

Puedes generar etiquetas de grupos y canales automáticamente a partir de su título, nombre de usuario y descripción, sin leer mensajes ni utilizar un modelo:

```sh
max metadata refresh --chat "Книжный клуб"   # прочитать описание чата из MAX (сам чат не меняется)
```

```sh
max metadata refresh --only-missing          # все сохранённые группы и каналы, у которых описание ещё не читалось
```

```sh
max tags auto --dry-run                      # что получилось бы, без записи
```

```sh
max tags auto                                # записать автоматические метки
```

```sh
max tags list --source auto                  # только автоматические
```

El etiquetado automático conserva tus etiquetas: al repetirlo, solo elimina las etiquetas automáticas obsoletas. Si añades manualmente una etiqueta que ya se había añadido de forma automática, pasa a ser tuya.

## Búsquedas guardadas e historial

```sh
max searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
```

```sh
max search messages --saved meetings
```

```sh
max search messages --saved meetings 'date:today'   # слова добавляются через AND
```

```sh
max stats messages show --saved meetings --by day
```

```sh
max searches list
```

```sh
max searches history --limit 10
```

```sh
max search messages --saved 42                   # строка истории, по её номеру
```

`searches create` guarda una consulta con sus opciones y no ejecuta nada; un nombre que ya existe necesita `--replace`. Las opciones que escribes con `--saved` sustituyen a las guardadas. El texto guardado se vuelve a leer en cada ejecución, así que `date:7d` siempre significa los últimos 7 días. `searches show` muestra una y `searches delete` elimina una.

Cada búsqueda y recuento que termina bien se guarda en el historial: la consulta y las opciones, nunca los mensajes encontrados. Se conservan las últimas 1000 ejecuciones. `--no-record` excluye una ejecución; en MCP, usa `record: false`. `searches clear` borra el historial sin eliminar las búsquedas guardadas. Este historial es independiente de `max runs`.

Las búsquedas guardadas y el historial están en el archivo compartido por `max` y `tg`: ambos ven las mismas entradas, y `delete` o `clear` en uno las cambia también en el otro. Las etiquetas permanecen vinculadas a su cuenta.

## Contar mensajes: `stats messages show`

```sh
max stats messages show счёт                          # сколько в каждом чате
```

```sh
max stats messages show 'date:7d' --by sender
```

```sh
max stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
max stats messages show --by hour                     # все сохранённые сообщения
```

`stats messages show` cuenta una sola vez cada mensaje que encontraría `search messages` con la misma consulta. `--by chat` (la opción predeterminada) y `--by sender` muestran primero los recuentos más altos; `--by day` y `--by hour` usan el orden cronológico. Si algunos chats solo están guardados en parte, las cifras son un límite inferior, y stderr indica cuántos chats están incompletos.

## Búsqueda en el servidor de MAX: `--backend`

El servidor de MAX solo busca en un chat. Cuando la consulta especifica un chat (`--chat` o `chat:`) e incluye palabras sin `--discover`, `max` consulta tanto al servidor como al archivo de forma predeterminada (`--backend both`). Si no se especifica un chat, no consulta al servidor; los resultados proceden del archivo. `--discover` siempre usa solo el archivo, incluso con `--backend both`.

```sh
max search messages 'счёт' --chat "Книжный клуб"                    # архив и сервер MAX
```

```sh
max search messages 'счёт' --chat "Книжный клуб" --backend server   # только то, что нашёл сервер
```

```sh
max search messages 'счёт' --backend archive                        # только архив
```

El servidor también busca por el comienzo de una palabra, pero no reconoce otras formas: `книгу` no encuentra «книга». Por eso, `max` trata sus resultados como candidatos: los guarda en el archivo y los comprueba con tu consulta según las reglas del archivo. `exact:`, `-слово`, las comillas y el orden de los resultados funcionan igual que sin el servidor, y los mensajes no se duplican. `max` espera al servidor como máximo 5 segundos (`--server-time`, hasta 60 segundos) y no marca nada como leído.

Con `--json`, cada mensaje tiene un `source` (`archive`, `server` o `both`), y el bloque `server` indica qué ha devuelto el servidor. Al buscar en ambas fuentes, si el servidor no está disponible o el perfil es de solo lectura, se mantienen los resultados del archivo. Un `--backend server` explícito falla si el perfil no permite buscar en el servidor. El permiso necesario es `messages.server-search`.

## Primera descarga nueva: `--sync-first`

```sh
max search messages 'счёт' --chat "Книжный клуб" --sync-first
```

`--sync-first` primero descarga mensajes nuevos sin marcar nada como leído: no más de 5 chats, 500 mensajes y 30 segundos. Los límites cambian `--max-chats`, `--max-messages`, `--sync-time`. Si la descarga falló o finalizó antes de tiempo, aún obtendrá el resultado del archivo, con una marca sobre cobertura obsoleta e información sobre la descarga.

## Mensajes alrededor del resultado

`--newest` ordena por tiempo en lugar de por proximidad, y `--context 2` muestra dos mensajes antes y después de cada uno encontrado (por defecto 2 en terminal y 0 en otros modos).

`--thread` muestra una cadena de respuestas alrededor de cada hallazgo y las respuestas en lugar de vecinos en el tiempo. Sigue los enlaces de respuestas guardadas en el archivo y para `messages context` también reemplaza a los vecinos de tiempo. Límites: 8 transiciones, 50 mensajes, 65.536 bytes y un día en ambos lados. Se cambian por `--thread-hops`, `--thread-messages`, `--thread-bytes`, `--thread-within`. Si no hay conexiones, se utiliza el contexto de tiempo; Las relaciones obsoletas se señalan y no se pasan por alto. `messages context` con `--offline` lee solo lo guardado.

## Resultado en JSON

En la terminal, `max` imprime una cinta de lectura. `--json` devuelve un objeto con mensajes y dónde se buscó; `--jsonl`: solo mensajes, línea por línea. Los campos de respuesta están en [ayuda del lenguaje de consulta](./query-language.md#ответ).

## Si no se encuentra nada

Una respuesta vacía significa «no está en el archivo en el que buscaste», no «nunca se envió». `max store status` muestra lo guardado; `max store fetch` añade historial. Con `--json`, la respuesta indica los chats examinados y su integridad incluso sin coincidencias. Si `max` pide `max store migrate`, el índice de palabras aún se está construyendo; las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

**Huecos en el historial.** `max store gaps plan <чат>` muestra localmente los huecos entre períodos guardados. La falta de números consecutivos o el silencio no prueban que falten mensajes; los extremos del historial siguen siendo `unknown`. Revisa el plan y usa `max store gaps repair <чат> --fingerprint <хеш>` para descargarlos. Por defecto procesa hasta 5 huecos, 500 mensajes y 30 segundos; ajusta `--max-gaps`, `--limit`, `--repair-time`, `--page-size` y `--pause`. Al repetir comprueba lo pendiente; no elimina un mensaje solo porque MAX no lo devolvió. Las páginas ambiguas con la misma fecha siguen incompletas. `--background` crea una tarea consultable con `store jobs show`, `store jobs list` y `store jobs cancel`. La reparación requiere `store.gaps.repair` y lectura de mensajes; el plan no se conecta. En MCP, encuentra los comandos con `max_tools_search`, lee planes y tareas con `max_read` y repara con `max_write`.

**Prepare una búsqueda por tema al descargar.** `max store fetch <чат> --catch-up` inmediatamente después de la descarga crea conversaciones y vectores locales solo de este chat - para [búsqueda por tema](./topic-search.md). Esto está deshabilitado de forma predeterminada; La configuración del perfil `searchCatchUp: true` se activa y `--no-catch-up` se desactiva para una ejecución. Fronteras: `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. El modelo no se descarga automáticamente y no se llama al servicio remoto. El campo `prepared` informa por separado si se ha completado la preparación; el historial descargado se guarda en cualquier caso.

## Más

- [Búsqueda por tema](./topic-search.md): encuentra una conversación por su tema cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): todos los campos, operadores y límites, y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture): la página técnica: el índice de palabras, el grafo de conversaciones, los vectores y cómo se ordenan los resultados.
