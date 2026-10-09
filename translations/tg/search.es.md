---
title: "Buscar mensajes"
---

`tg search messages` encuentra mensajes en el archivo local, la copia de tus chats que tg guarda en este
ordenador, y también consulta la búsqueda de Telegram ([más abajo](#asking-telegram-too---backend)). No marca ningún mensaje como leído.

## Prueba una búsqueda concreta

Empieza por una frase y un chat. Este ejemplo busca en el historial guardado sin consultar el mensajero.

**Tu petición:**

> Encuentra el mensaje que dice «invoice paid» en Book club. Muestra la coincidencia y las lagunas del historial.

**Comando:**

```sh
tg search messages '"invoice paid"' --chat "Book club" --backend archive --json
```

**Ejemplo de respuesta del agente:**

> **Un mensaje coincide en el historial guardado.**
>
> | Persona | Mensaje |
> | --- | --- |
> | Alice Synthetic | Invoice paid yesterday. |
>
> El historial está incompleto: pueden faltar otras coincidencias. Puedo abrir el mensaje y la conversación que lo rodea.

Un resultado vacío no demuestra que el mensaje nunca existiera. Revisa las lagunas del historial antes de ampliar la búsqueda. Los ejemplos de esta página son ficticios.

## Prepara primero tu archivo

Para buscar bien, necesitas descargar tus chats. La búsqueda de Telegram encuentra un mensaje por sus palabras aunque tg nunca
lo haya descargado, pero todo lo demás consulta solo el archivo: los recuentos con `stats`, la búsqueda por temas, `has:`,
`filename:`, las expresiones regulares, las búsquedas predefinidas, las etiquetas y la clasificación de formas de palabras. Empieza descargando todos los chats:

```sh
tg store fetch --all --background     # the last 90 days of every chat, as a background job
```

```sh
tg store jobs show                    # how far it got
```

Cada ejecución descarga como máximo 1.000 mensajes por chat de forma predeterminada; repítela para continuar con los chats más activos.
Añade `--since-time 365d` para descargar mensajes más antiguos, o descarga un chat con `tg store fetch "Book club"`
([archivo](./archive.md)). Después, `tg serve` mantiene el archivo actualizado.

Cada búsqueda indica qué datos ha consultado. En el terminal, cuando el archivo podría contener más datos o no se ha
encontrado nada, una línea indica cuántos mensajes y chats se han consultado, cuántos chats nunca se han descargado o
están desactualizados, y el comando para solucionarlo:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `tg store fetch --all --background` fetches them
```

Con `--json`, `coverage` contiene los mismos datos: `messages`, `chats`, hasta diez chats en `attention` y `next`.
Si un agente no encuentra nada y `next` tiene un valor, debe ejecutar ese comando o preguntarte antes de afirmar que el mensaje
no existe.

Esta página trata las búsquedas del día a día. Otras tres páginas van más allá:

- [Búsqueda por tema](./topic-search.md): encuentra una conversación por su tema cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): todos los campos, operadores y límites, y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture): la página técnica: el índice de palabras, el grafo de conversaciones, los vectores y cómo se ordenan los resultados.

Escribe la consulta entre comillas simples para que la terminal no toque sus comillas ni sus corchetes. Los nombres de abajo son ejemplos; usa tus propios chats y personas.

## Palabras y frases

```sh
tg search messages invoice
```

```sh
tg search messages '"invoice paid"'              # words together
```

```sh
tg search messages 'cafe OR library'
```

```sh
tg search messages '(cafe OR library) NOT loud'
```

```sh
tg search messages 'invoic*'                     # every word that starts with "invoic"
```

Todas las palabras consecutivas de la consulta deben estar en el mensaje. La búsqueda incluye formas de palabras según
la configuración de idioma del archivo: `piso` puede encontrar `pisos`. Las comillas mantienen las palabras juntas y también admiten
formas de palabras. Usa `exact:piso` o añade `--exact` para las palabras sin un campo explícito. Un
`text:` explícito sigue admitiendo formas de palabras. Se ignoran las mayúsculas, las minúsculas y los acentos.
Los errores tipográficos no se corrigen automáticamente.

## Personas y chats

```sh
tg search messages 'from:"Alice Synthetic" invoice'
```

```sh
tg search messages 'from:("Alice Synthetic" OR "Bob Synthetic") library'
```

```sh
tg search messages 'from:me date:7d'             # what you wrote this week
```

```sh
tg search messages 'chat:"Book club" library'
```

```sh
tg search messages library --chat "Book club"    # the same, as an option
```

```sh
tg search messages 'passport kind:private'       # one-to-one chats only
```

`kind:` admite `private`, `group`, `channel`, `saved` (Mensajes guardados) y `bot`. `topic:` se limita a un tema del foro de un grupo; necesita ese grupo en `chat:` o `--chat`.

## Fechas

```sh
tg search messages 'date:today'
```

```sh
tg search messages 'library date:yesterday'
```

```sh
tg search messages 'invoice date:7d'             # from 7 days ago until now; also 30m, 2h
```

```sh
tg search messages 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu equipo; `--timezone` elige otra. En un intervalo, `[` y `]` incluyen ese día; `{` y `}` lo excluyen.

## Archivos y enlaces

```sh
tg search messages 'has:file'
```

```sh
tg search messages 'filename:*.pdf'
```

```sh
tg search messages 'filename:*contract*'         # part of the name
```

```sh
tg search messages 'size>10MB'
```

```sh
tg search messages 'mime:image'                  # any picture sent as a file
```

```sh
tg search messages 'mime:"application/pdf"'      # quote a full type
```

```sh
tg search messages 'has:photo chat:"Book club"'
```

```sh
tg search messages 'has:link AND "github.com"'   # a link to a site
```

Un archivo se encuentra por su nombre, tamaño y tipo aunque el mensaje no tenga texto. `filename:` compara el nombre completo, sin distinguir mayúsculas ni tildes. Los tamaños usan KB, MB y GB de 1024. `has:` también admite `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` y `poll`. Un enlace cuenta tanto si está en el texto como si solo aparece en su vista previa.

## Contraseñas, códigos y tarjetas

```sh
tg search messages 'preset:secret kind:saved'    # something that looks like a password or token
```

```sh
tg search messages 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de acceso, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#presets).

## Etiquetas

```sh
tg tags add work --chat "Book club"
```

```sh
tg tags add work --contact "Bob Synthetic"
```

```sh
tg tags list --tag work --type chat
```

```sh
tg search messages 'tag:work invoice'
```

```sh
tg search messages 'invoice NOT tag:work'
```

```sh
tg tags remove work --chat "Book club"
```

Una etiqueta es tu propia marca en un chat, una persona o un mensaje (`--message <id> --chat <chat>`). Se guarda solo en el archivo local y nunca se envía a Telegram. `tag:work` encuentra los mensajes etiquetados `work`, los mensajes de un chat etiquetado `work` y los mensajes de una persona etiquetada `work`. Una etiqueta tiene de 1 a 32 caracteres: letras de la a a la z, cifras y guiones.

Los grupos y canales pueden etiquetarse automáticamente a partir de su título, nombre de usuario y descripción, sin consultar mensajes
ni usar un modelo:

```sh
tg metadata refresh --chat "Book club"   # read the chat's description from Telegram; the chat is not changed
```

```sh
tg metadata refresh --only-missing       # every stored group and channel with no description read yet
```

```sh
tg tags auto --dry-run                   # what it would tag, without writing
```

```sh
tg tags auto                             # write the automatic tags
```

```sh
tg tags list --source auto               # only the automatic ones
```

Las etiquetas automáticas nunca modifican las tuyas: una nueva ejecución elimina solo las etiquetas automáticas obsoletas. Si añades una etiqueta
que ya se asignó automáticamente, pasa a ser tuya.

## Búsquedas guardadas e historial

```sh
tg searches create meetings 'library OR cafe' --chat "Book club"
```

```sh
tg search messages --saved meetings
```

```sh
tg search messages --saved meetings 'date:today'  # extra words are added with AND
```

```sh
tg stats messages show --saved meetings --by day
```

```sh
tg searches list
```

```sh
tg searches history --limit 10
```

```sh
tg search messages --saved 42                    # a row of the history, by its number
```

`searches create` guarda una consulta con sus opciones y no ejecuta nada; un nombre que ya existe necesita `--replace`. Las opciones que escribes con `--saved` sustituyen a las guardadas. El texto guardado se vuelve a leer en cada ejecución, así que `date:7d` siempre significa los últimos 7 días. `searches show` muestra una y `searches delete` elimina una.

Cada búsqueda y recuento que termina bien se escribe en el historial: la consulta y sus opciones, nunca los mensajes encontrados. Se conservan las 1000 ejecuciones más recientes. `--no-record` deja fuera una ejecución; en MCP, `tg mcp --no-record` o `record` con valor `false` dejan fuera las llamadas del servidor; `searches clear` vacía el historial y conserva las búsquedas guardadas. Este historial es independiente de los registros de ejecución de `tg runs`.

Las búsquedas guardadas y el historial están en el archivo local que comparten tg y max: ambos ven las mismas, y `delete` o `clear` en uno cambia el otro. Las etiquetas se quedan con su cuenta.

## Recuentos: `stats messages show`

```sh
tg stats messages show invoice                        # how many in each chat
```

```sh
tg stats messages show 'date:7d' --by sender
```

```sh
tg stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
tg stats messages show --by hour                      # every stored message
```

`stats messages show` cuenta los mensajes que encontraría `search messages` con la misma consulta, cada uno una sola vez.
`--by chat` (la opción predeterminada) y `--by sender` muestran primero los recuentos más altos; `--by day` y `--by hour` siguen
el orden cronológico. Si algunos chats no están almacenados por completo, las cifras son un límite inferior y stderr indica
cuántos chats están incompletos.

## Consulta también Telegram: `--backend`

Telegram puede buscar en su propia copia de tus chats, incluidos los mensajes que tg nunca ha descargado. De forma predeterminada, tg consulta
Telegram y el archivo en una sola ejecución (`--backend both`). `--backend server` muestra solo los resultados de Telegram y
`--backend archive` busca únicamente en el archivo.

```sh
tg search messages 'invoice' --backend both
```

```sh
tg search messages 'invoice chat:"Book club" from:Olga' --backend both
```

```sh
tg search messages 'invoice date:2026-09' --backend server --server-time 10s
```

Telegram decide por su cuenta qué coincide con una palabra y no documenta sus reglas. Por eso tg trata su respuesta como
candidatos: los guarda en el archivo y les aplica tu consulta según las reglas del propio archivo.
`exact:`, `-word`, las comillas y la clasificación significan lo mismo que sin `--backend`, y ningún mensaje
aparece dos veces. Si Telegram devuelve un mensaje que tu consulta rechaza, no se muestra, pero permanece en el archivo.

Telegram recibe solo las palabras que exige tu consulta, un chat, un remitente junto con un chat y las fechas.
`OR` genera hasta tres búsquedas. tg aplica después las negaciones, los comodines, `has:`, `tag:` y las búsquedas predefinidas.
Una consulta sin palabras no consulta Telegram. tg espera como máximo 5 segundos (`--server-time`,
hasta 60 s) y obtiene hasta 100 mensajes por búsqueda; descarta las respuestas posteriores. No se marca ningún mensaje como leído.

Con `--json`, cada mensaje indica su origen (`source`: `archive`, `server` o `both`) y un
bloque `server` indica qué devolvió Telegram y qué falló. `--backend both` nunca falla por problemas con
Telegram: sin conexión, sin permiso o sin palabras, responde desde el archivo y explica el motivo.
`--backend server` rechaza la búsqueda en esos casos. El permiso es `messages.server-search`; un perfil de solo lectura
responde desde el archivo. `stats messages show` cuenta solo el archivo: los recuentos de Telegram siguen sus
propias reglas, no tu consulta.

## Si no se encuentra nada

Una respuesta vacía significa «no está en el archivo en el que buscaste», no «nunca se envió». Comprueba lo guardado con `tg store status` y descarga más con `tg store fetch`. Con `--json`, la respuesta indica en qué chats se buscó y lo completos que están, aunque no haya coincidencias. Si tg pide `tg store migrate`, el índice de palabras aún se está creando; las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

Para buscar en todas las cuentas del archivo local, añade `--source all`. `--newest` ordena por fecha en lugar de por relevancia, y `--context 2` muestra dos mensajes alrededor de cada resultado.

## Para scripts y agentes

`--json` devuelve un objeto con los mensajes y los datos consultados; `--jsonl` transmite
solo los mensajes. En MCP, `tg_read` (`command: "search messages"`) y `tg_read` (`command: "stats messages show"`) aceptan las mismas consultas, y los comandos `tags` y
`searches` mediante `tg_read`/`tg_write` gestionan las etiquetas y las búsquedas guardadas. Los campos de la respuesta,
el modo antiguo `--language legacy` y `--regex` se describen en el [lenguaje de consultas](./query-language.md).

La búsqueda por palabras consulta Telegram y el archivo local de forma predeterminada; `--backend archive` la limita a los datos locales.
`--sync-first` descarga explícitamente los mensajes nuevos antes de buscar y
no marca ninguno como leído: como máximo 5 chats, 500 mensajes y 30 segundos. Cambia estos límites con `--max-chats`,
`--max-messages`, `--sync-time`. Una actualización fallida o incompleta conserva los resultados locales con información sobre la cobertura desactualizada y
los detalles de la actualización.

`content:invoice` busca en el texto indexado que se extrajo de los adjuntos o que aportó un agente. La extracción admite texto plano, Word y PDF con capa de texto; los escaneos y las fotos necesitan texto aportado por un agente. Con varios adjuntos, elige uno con `--attachment`, empezando por 1.

El agente suele leer las imágenes y los documentos escaneados con sus propias herramientas de OCR o visión y escribe el texto en este
índice. `attachments list --needs-text` devuelve la ruta guardada, el localizador del mensaje y el número del adjunto.
Comprueba que el texto se ha guardado con una búsqueda `content:`. Una ruta en un servidor MCP no transfiere el archivo a un
agente remoto; el agente necesita acceso al archivo para leerlo.

```sh
tg attachments extract --chat "Book club" --download --output-dir ./files
```

```sh
tg search messages 'content:invoice'
```

```sh
tg attachments list --chat "Book club" --needs-text
```

```sh
tg attachments text set "Book club" 204 --text-file ./scan.txt
```

`--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos conservados. `list` muestra las rutas conservadas y el estado del texto, no su contenido.

Para procesar muchos archivos, selecciona explícitamente la API estándar de la pasarela de modelos. Configura un modelo de visión disponible
en `models.ocr` y usa el comando habitual de credenciales `models text key set`. Sustituye
`your-vision-model` en el ejemplo por el nombre de tu modelo.

```sh
tg config set models.ocr.provider openai
```

```sh
tg config set models.ocr.model your-vision-model
```

```sh
tg models text key set openai
```

```sh
tg attachments extract --chat "Book club" --ocr --concurrency 4 --limit 100 --json
```

`--ocr` envía las imágenes a esa API; sin esta opción no se llama a ningún modelo. La concurrencia es de 1–8, con 4 como valor predeterminado;
el límite de archivos es de 1–500, con 100 como valor predeterminado. Pasa el cursor devuelto para continuar el escaneo con límites.
La extracción local también lee UTF-16 con BOM, codificaciones antiguas detectadas con confianza, ODT, ODS, XLSX, PPTX y EPUB sin modelo ni instalación adicional. Conserva el orden de hojas, diapositivas, capítulos y valores de celdas guardados; no calcula fórmulas ni lee texto en imágenes. El agente revisa o convierte codificaciones ambiguas. Los bytes originales no cambian. Límites: 1000 partes, 50 MiB descomprimidos y 10 MiB por parte XML/HTML de texto. Los resultados dañados o parciales no se indexan como completos. Las lecturas fallidas pueden repetirse; se protege el texto del agente y el texto anterior correctamente indexado.

Los PDF escaneados necesitan las dependencias opcionales `unpdf` y `@napi-rs/canvas`, con un máximo de 20 páginas por documento;
las páginas con una capa de texto se procesan localmente. Las ejecuciones repetidas reutilizan el hash del archivo y la identidad del modelo. El texto del agente y el texto
indexado anteriormente se conservan si el OCR falla o se cancela. Revisa el número de errores y los estados de cada archivo;
un límite de solicitudes del proveedor detiene las siguientes llamadas a la API en esa ejecución. `--offline` es incompatible con `--ocr`.

`--thread` sigue el grafo de respuestas guardado; en `messages context` sustituye a los mensajes vecinos en orden cronológico. Los valores predeterminados son 8 saltos, 50 mensajes, 65 536 bytes y un día alrededor de cada resultado. Cámbialos con `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin grafo, vuelve al contexto cronológico; los enlaces desactualizados se marcan y no se recorren.

La extracción de PDF necesita `unpdf`, que es opcional; Word necesita `mammoth`, también opcional, instalados donde esté `tg`. Para una instalación global con npm: `npm install -g unpdf mammoth`. Si falta algún motor, se indica; un agente puede aportar el texto en su lugar.

## Archivos, preparación y lagunas del archivo

`tg attachments extract --chat <chat> --from-dir ./files` lee un directorio indicado explícitamente sin
entrar en los subdirectorios. Un archivo necesita un nombre original único o un conjunto completo de nombres asignados por el descargador.
No combines `--from-dir` con `--download` ni con `--output-dir`.
`tg messages download <chat> <id> --extract` extrae texto solo de los archivos descargados por esa invocación;
`--all --extract` aplica la misma regla al lote. La extracción comprueba los cambios en los bytes mediante un hash y
conserva el texto escrito por el agente. La extracción con límites mediante MCP devuelve un `cursor` de continuación y metadatos,
sin el texto de los archivos. Descubre `attachments extract` mediante `tg_tools_search` y ejecútalo mediante `tg_write`.

`tg store fetch <chat> --catch-up` prepara solo el grafo de ese chat y los vectores locales instalados después
de descargar los mensajes. La preparación está desactivada de forma predeterminada; `searchCatchUp: true` en el perfil la activa, y
`--no-catch-up` anula ese ajuste durante una ejecución. Los límites son
`--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. Nunca descarga un modelo
ni llama a un proveedor remoto. El resultado separado `prepared` informa de una preparación incompleta, mientras
que el historial descargado sigue guardado.

`tg store gaps plan <chat>` inspecciona localmente las lagunas entre los intervalos de cobertura registrados, que incluyen ambos extremos.
Los identificadores de mensajes ausentes y los periodos sin actividad no demuestran por sí solos que falte historial; los extremos del archivo permanecen
en `unknown`. Revisa el plan y después ejecuta explícitamente `tg store gaps repair <chat> --fingerprint <hash>`.
Los límites predeterminados son cinco lagunas, 500 mensajes y 30 segundos; usa `--max-gaps`, `--limit`, `--repair-time`,
`--page-size` y `--pause` para establecerlos. Una nueva ejecución repara las lagunas restantes sin eliminar los mensajes que no se hayan encontrado.
Las páginas con marcas de tiempo ambiguas quedan pendientes. `--background` usa `store jobs show`, `store jobs list` y `store jobs cancel`.
Los mismos comandos están disponibles mediante el descubrimiento de herramientas MCP y `tg_read` o `tg_write`; los metadatos de los trabajos
están limitados al perfil. La reparación exige el permiso de escritura `store.gaps.repair` y acceso de lectura a los mensajes.
La preparación opcional comparte el tiempo que le queda a la reparación.

Un agente remoto puede recibir bytes guardados, ensamblar porciones limitadas y verificar su hash mediante [attachments show](./attachments.md). La entrega no reconoce ni indexa texto: lee todas las páginas con tus herramientas, guarda el texto con attachments text set y comprueba la búsqueda de contenido.
