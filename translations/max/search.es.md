---
title: "Búsqueda"
---

Todo el texto se busca desde `max search`. Si no recuerdas dónde estaba, empieza por `search all`: busca los mensajes, correos y notas guardados en este equipo e indica el tipo de cada resultado: mensaje (`msg:…`) o nota (`note:…`). No marca nada como leído.

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

`search messages` nunca devuelve correos, y `search mail` nunca devuelve mensajes del mensajero; solo `search all` reúne ambos. `--type` limita `search messages` a texto, voz o archivos (`text|voice|file`), y `search notes` a notas escritas en memo o importadas de una carpeta (`internal|file`). Si usas un campo que los correos o notas no tienen (`chat:`, `from:`), `search all` los omite y lo indica.

Los correos y notas entran mediante [memo](https://github.com/leemour/cli-memo): `memo mail import` y `memo import`. Sin ellos, `search all` busca solo mensajes.

El resto de esta página explica cómo buscar mensajes con `max search messages`. También puede consultar el servidor del mensajero ([más abajo](#поиск-на-сервере-max---backend)).
## Prueba una búsqueda concreta

Empieza por una frase y un chat. Este ejemplo busca en el historial guardado sin consultar el mensajero.

**Tu petición:**

> Encuentra el mensaje que dice «счёт оплачен» en Книжный клуб. Muestra la coincidencia y las lagunas del historial.

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

Usa `--since-time 365d` para retroceder más en el historial, o `max store fetch Друзья` para un solo chat ([archivo](./archive.md)). Cada ejecución descarga como máximo 1200 mensajes por chat de forma predeterminada; repite el comando para continuar. Después, `max serve` mantiene el archivo actualizado.

Cada búsqueda indica qué ha consultado. Si al archivo le puede faltar historial o no se encuentra nada, una línea en el terminal muestra cuántos mensajes y chats se han consultado, cuántos chats no se han descargado o están desactualizados y el comando para solucionarlo:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `max store fetch --all --background` fetches them
```

Con `--json`, la misma información aparece en `coverage`: `messages`, `chats`, hasta diez chats en `attention` y `next`. Si un agente no encuentra nada y hay un comando en `next`, debe ejecutarlo (o preguntarte) antes de afirmar que el mensaje no existe.

Esta página trata las búsquedas del día a día. Otras tres páginas van más allá:

- [Búsqueda por tema](./topic-search.md): encuentra una conversación por su tema cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): todos los campos, operadores y límites, y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture): la página técnica: el índice de palabras, el grafo de conversaciones, los vectores y cómo se ordenan los resultados.

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

## Búsqueda en el servidor de MAX: `--backend`

```sh
max search messages 'счёт' --chat "Книжный клуб"                    # архив и сервер MAX
```

```sh
max search messages 'счёт' --chat "Книжный клуб" --backend server   # только то, что нашёл сервер
```

```sh
max search messages 'счёт' --backend archive                        # только архив
```

El servidor de MAX solo busca en un chat. Cuando la consulta especifica un chat (`--chat` o `chat:`) e incluye palabras, `max` consulta tanto al servidor como al archivo de forma predeterminada (`--backend both`). Si no se especifica un chat, no consulta al servidor; los resultados proceden del archivo.

El servidor también busca por el comienzo de una palabra, pero no reconoce otras formas: `книгу` no encuentra «книга». Por eso, `max` trata sus resultados como candidatos: los guarda en el archivo y los comprueba con tu consulta según las reglas del archivo. `exact:`, `-слово`, las comillas y el orden de los resultados funcionan igual que sin el servidor, y los mensajes no se duplican. `max` espera al servidor como máximo 5 segundos (`--server-time`, hasta 60 segundos) y no marca nada como leído.

Con `--json`, cada mensaje tiene un `source` (`archive`, `server` o `both`), y el bloque `server` indica qué ha devuelto el servidor. Al buscar en ambas fuentes, si el servidor no está disponible o el perfil es de solo lectura, se mantienen los resultados del archivo. Un `--backend server` explícito falla si el perfil no permite buscar en el servidor. El permiso necesario es `messages.server-search`.

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

`kind:` admite `private` (chats privados), `group`, `channel`, `saved` (Mensajes guardados) y `bot`.

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

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu equipo; `--timezone` elige otra. En un intervalo, `[` y `]` incluyen ese día; `{` y `}` lo excluyen.

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

## Contraseñas, códigos y tarjetas

```sh
max search messages 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
```

```sh
max search messages 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de acceso, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#preset).

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

## Si no se encuentra nada

Una respuesta vacía significa «no está en el archivo en el que buscaste», no «nunca se envió». `max store status` muestra lo guardado; `max store fetch` añade historial. Con `--json`, la respuesta indica los chats examinados y su integridad incluso sin coincidencias. Si `max` pide `max store migrate`, el índice de palabras aún se está construyendo; las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

Para buscar en todas las cuentas del archivo local, añade `--source all`. `--newest` ordena por fecha en lugar de por relevancia, y `--context 2` muestra dos mensajes alrededor de cada resultado.

## Scripts y agentes

`--json` devuelve un objeto con los mensajes y la cobertura de la búsqueda; `--jsonl` devuelve solo mensajes, uno por línea. En MCP, `max_read` (`command: "search all"` o `"search messages"`) y `max_read` (`command: "stats messages show"`) aceptan las mismas consultas. Los comandos `tags` y `searches`, mediante `max_read`/`max_write`, gestionan las etiquetas y las búsquedas guardadas. Consulta el [lenguaje de consultas](./query-language.md) para ver los campos de respuesta, el modo anterior `--language legacy` y `--regex`.

La búsqueda de palabras en un chat concreto consulta tanto al archivo como al servidor de MAX de forma predeterminada; sin un chat concreto, solo consulta al archivo. `--backend archive` mantiene la búsqueda local. `--sync-first` descarga primero los mensajes nuevos, sin marcar nada como leído: como máximo 5 chats, 500 mensajes y 30 segundos. Ajusta estos límites con `--max-chats`, `--max-messages` y `--sync-time`. Una actualización incompleta o fallida conserva los resultados locales e informa de la cobertura desactualizada y del resultado de la actualización.

`content:договор` busca palabras en el texto guardado de un adjunto. La extracción admite archivos de texto, DOCX y PDF con capa de texto. Tu agente lee fotos y escaneos y guarda su texto mediante `attachments text set`. Si hay varios adjuntos, indica `--attachment`, numerado desde 1.

De forma predeterminada, el agente lee fotos y documentos escaneados con sus propias herramientas de OCR o visión y después escribe el texto en este índice. `attachments list --needs-text` devuelve la ruta guardada, el localizador del mensaje y el número de adjunto. Comprueba la entrada con una búsqueda `content:`. Si el agente funciona en remoto, una ruta en el servidor MCP no le proporciona el archivo: necesita acceso al archivo para leerlo.

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

`--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos conservados. `list` muestra las rutas conservadas y el estado del texto, no su contenido.

Para procesar archivos en lote, puedes elegir explícitamente una API mediante la pasarela compartida de modelos. Indica el proveedor y un modelo de visión disponible en `models.ocr`; guarda la clave con el comando habitual `models text key set`. En el ejemplo, sustituye `your-vision-model` por el nombre de tu modelo.

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

`--ocr` envía imágenes a la API elegida; sin esta opción, no se llama a ningún modelo. Puedes configurar entre 1 y 8 solicitudes simultáneas, con 4 de forma predeterminada. El límite de archivos es de 1 a 500, con 100 de forma predeterminada; `cursor` permite continuar un recorrido limitado. Los PDF escaneados requieren los paquetes opcionales `unpdf` y `@napi-rs/canvas`; se procesan como máximo 20 páginas por documento. Las páginas con una capa de texto se procesan localmente. Las ejecuciones posteriores utilizan el hash del archivo y el modelo elegido. Si el OCR falla o se cancela, se conservan el texto escrito por el agente y el índice anterior. Comprueba `failed` y los estados de cada archivo; al alcanzar un límite del proveedor, esta ejecución deja de realizar nuevas solicitudes a la API. `--offline` no se puede combinar con `--ocr`.

`--thread` sigue el grafo de respuestas guardado; en `messages context` sustituye a los mensajes vecinos en orden cronológico. Los valores predeterminados son 8 saltos, 50 mensajes, 65 536 bytes y un día alrededor de cada resultado. Cámbialos con `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin grafo, vuelve al contexto cronológico; los enlaces desactualizados se marcan y no se recorren.

La extracción de PDF necesita el paquete opcional `unpdf`; DOCX necesita `mammoth`, instalado junto a `max`. Para una instalación global con npm: `npm install -g unpdf mammoth`. Si falta un paquete, la orden lo indica; un agente puede aportar el texto.
## Preparar los archivos y el historial local

`max attachments extract --chat <чат> --from-dir ./files` lee archivos de la carpeta indicada sin recorrer otras carpetas. Necesita una coincidencia inequívoca con el archivo original o un conjunto completo de archivos con los nombres asignados por el descargador. No combines `--from-dir` con `--download` ni con `--output-dir`. `max messages download <чат> <id> --extract` extrae inmediatamente el texto solo de los archivos que ha descargado; `--all --extract` hace lo mismo para todos los archivos descargados en esa ejecución. Mediante `max_write`, `attachments extract` devuelve los resultados del procesamiento sin el texto de los archivos; usa `cursor` para continuar un recorrido limitado. Los cambios en los bytes se detectan mediante el hash, y se conserva el texto escrito por el agente.

Después de descargar, `max store fetch <чат> --catch-up` prepara el grafo y los vectores locales únicamente de ese chat. La preparación está desactivada de forma predeterminada; la configuración del perfil `searchCatchUp: true` la activa, y `--no-catch-up` la desactiva para una ejecución. Límites: `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. El modelo no se descarga automáticamente y no se llama a ningún proveedor remoto. El campo `prepared` indica por separado si la preparación ha terminado: el historial descargado se conserva aunque la preparación esté incompleta.

`max store gaps plan <чат>` muestra localmente los huecos entre los intervalos de cobertura registrados. Los saltos en los números de mensaje y los periodos sin actividad no implican por sí solos que falte historial. Los límites desconocidos del archivo permanecen en `unknown`. Después de revisar el plan, `max store gaps repair <чат> --fingerprint <хеш>` descarga explícitamente los huecos internos. Los límites predeterminados son 5 huecos, 500 mensajes y 30 segundos; ajústalos con `--max-gaps`, `--limit`, `--repair-time`, `--page-size` y `--pause`. Al repetir el comando, se comprueban los huecos restantes sin eliminar mensajes por su mera ausencia en la respuesta. Las páginas ambiguas con mensajes de la misma marca de tiempo quedan incompletas. `--background` inicia un trabajo que puedes consultar o cancelar con `store jobs show`, `store jobs list` y `store jobs cancel`. En MCP, encuentra estos comandos con `max_tools_search`, ejecuta el plan y consulta los trabajos mediante `max_read`, y realiza las reparaciones mediante `max_write`. La reparación requiere el permiso `store.gaps.repair` y permiso para leer mensajes; la planificación no se conecta al servidor.
