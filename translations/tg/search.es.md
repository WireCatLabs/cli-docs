---
title: "Búsqueda"
---

<a id="para-scripts-y-agentes" />
<a id="archivos-preparación-y-lagunas-del-archivo" />
<a id="for-scripts-and-agents" />

Necesitas encontrar algo que esté escrito: un mensaje, un acuerdo, un archivo que alguien envió, un código de hace meses. Esta página muestra cómo buscar todo lo que tg ha guardado en esta computadora (mensajes de Telegram y el correo y las notas que [memo](https://github.com/leemour/cli-memo) importó) y cómo realizar la búsqueda propia de Telegram al mismo tiempo.

Después de leerlo, puede encontrar mensajes por palabras, personas, chats, fechas, archivos y enlaces, guardar una búsqueda y ejecutarla nuevamente, contar coincidencias y distinguir un "no encontrado" real de un espacio en el historial guardado. La búsqueda no marca nada leído.

Términos utilizados en esta página:

- **Almacén local** (también llamado archivo): la base de datos en esta computadora donde tg guarda cada mensaje que ha leído o descargado ([el almacén local](./archive.md)). La mayoría de las búsquedas solo dicen esto.
- **Consulta**: lo que buscas. Pueden ser palabras simples o palabras con campos como `from:` y `date:`. Su agente de IA escribe consultas por usted; el idioma completo se encuentra en la [referencia del idioma de consulta](./query-language.md).
- **Cobertura**: lo que se pudo ver en una búsqueda: cuántos chats y mensajes se guardaron, y qué chats nunca se descargaron o están atrasados.

## Qué puedes hacer

Cada búsqueda se realiza bajo un grupo de comandos, `tg search`. Cuando no sepa dónde se escribió algo, comience con `search all`.

| Tarea | Comando |
|---|---|
| Busque mensajes, correo y notas en una sola respuesta | `tg search all '<query>'` |
| Buscar solo mensajes de Telegram, también en el servidor de Telegram | `tg search messages '<query>'` |
| Buscar sólo la nota de correo importada | `tg search mail '<query>'` |
| Buscar notas escritas en memo o importadas desde una carpeta | `tg search notes '<query>'` |
| Encuentre una discusión según de qué se trata | `tg search conversations '<question>'` ([búsqueda de tema](./topic-search.md)) |
| Buscar un tema en un grupo del foro por su título | `tg search topics <chat> '<words>'` |
| Contar coincidencias por chat, remitente, día u hora | `tg stats messages show '<query>'` |
| Guarde una búsqueda y ejecútela nuevamente más tarde | `tg searches create`, `tg search messages --saved <name>` |

```sh
tg search all 'lease agreement'                   # messages, mail and notes, best match first
```

```sh
tg search all 'lease' --only messages,notes       # without mail
```

```sh
tg search messages 'lease' --chat "Book club"     # Telegram messages only, never mail
```

```sh
tg search mail 'invoice'                          # only the mail memo mail import brought in
```

```sh
tg search notes 'budget' --type internal          # only notes written in memo
```

```sh
tg search conversations 'moving to the country'   # conversations close in meaning
```

```sh
tg search topics "Hiking" "gear"                  # topic titles in one forum group
```

`search all` dice qué es cada resultado: un mensaje (`msg:…`) o una nota (`note:…`). `search messages` nunca devuelve correo y `search mail` nunca devuelve mensajes de Telegram; sólo `search all` cubre ambos. `--type` limita `search messages` a texto, voz o archivos (`text|voice|file`) y `search notes` a notas escritas en notas o importadas desde una carpeta (`internal|file`). Cuando una consulta utiliza un campo correo o notas que no tiene (`chat:`, `from:`), `search all` los omite y lo dice.

El correo y las notas llegan al archivo local mediante memo: `memo mail import` y `memo import`. Sin ellos, `search all` busca únicamente mensajes.

El resto de esta página trata sobre la búsqueda de mensajes, `tg search messages`. Lee el archivo local y también solicita la búsqueda propia de Telegram ([abajo](#asking-telegram-too---backend)).

## Prueba una búsqueda concreta

Empieza por una frase y un chat. Este ejemplo busca en el historial guardado sin consultar el servicio de mensajería.

**Tu petición:**

> Usa tg CLI. Encuentra el mensaje que dice «invoice paid» en Book club. Muestra la coincidencia y las lagunas del historial.

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

Una buena búsqueda necesita que se descarguen sus chats. La búsqueda de Telegram encuentra un mensaje por sus palabras incluso si tg nunca lo encontró, pero todo lo demás solo lee el archivo local: contando con `stats`, búsqueda de temas, `has:`, `filename:`, expresiones regulares, ajustes preestablecidos, etiquetas y clasificación de formas de palabras. Comience descargando todos los chats:

```sh
tg store fetch --all --background     # the last 90 days of every chat, as a background job
```

```sh
tg store jobs show                    # how far it got
```

Cada ejecución recupera como máximo 1000 mensajes por chat de forma predeterminada; repítalo para continuar con las conversaciones ocupadas. Agregue `--since-time 365d` para ir más atrás o busque un chat con `tg store fetch "Book club"` ([descargar el historial de un chat](./archive.md#fetch-a-chats-history)). Después de eso, `tg serve` mantiene el archivo local actualizado.

Cada búsqueda dice lo que buscó. En la terminal, cuando el archivo local podía contener más o no se encontró nada, una línea dice cuántos mensajes y chats se buscaron, cuántos chats nunca se recuperaron o están atrasados ​​y el comando que lo soluciona:

```text
searched 12,430 messages in 37 chats — 5 never fetched; `tg store fetch --all --background` fetches them
```

Con `--json`, `coverage` lleva lo mismo: `messages`, `chats`, hasta diez chats `attention` y `next`. Cuando no se encuentre nada y esté configurado `next`, ejecute ese comando o pídale a su agente que lo haga antes de decidir que el mensaje no existe.

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

Todas las palabras una al lado de la otra deben estar en el mensaje. La búsqueda incluye formas de palabras, según la configuración de idioma del archivo local: `piso` puede encontrar `pisos`. Las citas mantienen unidas las palabras y también permiten formas de palabras. Utilice `exact:piso` o agregue `--exact` para palabras sin un campo explícito. Un `text:` explícito sigue buscando formas de palabra. Se ignoran las mayúsculas y las tildes. Los errores tipográficos no se corrigen automáticamente.

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

`kind:` toma `private`, `group`, `channel`, `saved` (mensajes guardados) y `bot`. `topic:` se centra en un tema del foro de un grupo; necesita ese grupo en `chat:` o `--chat`. Para buscar en todas las cuentas del archivo local, agregue `--source all`.

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

<a id="files-preparation-and-archive-gaps"></a>

## Texto dentro de archivos

`content:` busca el texto dentro de los archivos adjuntos: un PDF, un archivo de Word, un escaneo. El texto primero debe ser extraído en el archivo local, por tg o por su agente. Más información sobre archivos: [archivos adjuntos](./attachments.md).

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

`attachments extract` lee texto sin formato, archivos de Word y PDF con una capa de texto en esta computadora. `--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos ya guardados. Con varios archivos adjuntos en un mensaje, elija uno con `--attachment`, comenzando en 1.

La extracción local también lee UTF-16 con marca BOM, codificaciones heredadas de alta confianza, ODT, ODS, XLSX, PPTX y EPUB sin modelo ni instalación adicional. Mantiene el orden de hojas, diapositivas y capítulos y los valores de celda guardados; no calcula fórmulas ni lee texto dentro de imágenes. Las codificaciones ambiguas necesitan que su agente las inspeccione o convierta. Los archivos fuente permanecen sin cambios. ODT, ODS, XLSX, PPTX y EPUB están limitados a 1000 partes de archivo y 50 MiB expandidos, con un máximo de 10 MiB por parte de texto XML/HTML; Los resultados parciales o con formato incorrecto no se indexan como texto completo. Se puede volver a intentar una lectura local fallida; Los textos que escribió su agente y los textos indexados anteriormente permanecen protegidos.

La extracción de PDF necesita el paquete opcional `unpdf`; Word necesita `mammoth`, instalado donde está `tg`. Para una instalación global de npm: `npm install -g unpdf mammoth`. Se informa que falta un paquete; su agente puede proporcionarle el texto en su lugar.

**Las fotos y los escaneos** no tienen capa de texto. Su agente normalmente los lee con su propio OCR o herramientas de visión y escribe el texto con `attachments text set`. `attachments list --needs-text` le proporciona la ruta guardada, el localizador de mensajes y el número del archivo adjunto; muestra rutas y estado del texto, nunca el texto en sí. Verifique el resultado con una búsqueda `content:`. Una ruta en un servidor MCP no mueve el archivo a un agente en otra computadora: el agente necesita acceso al archivo. Dicho agente puede recibir los bytes del archivo guardado en partes delimitadas y verificar su hash a través de [mostrar archivos adjuntos](./attachments.md); La entrega del archivo no reconoce ni indexa el texto, por lo que aún escribe el texto con `attachments text set`.

**Muchos escaneos a la vez** pueden ir al servicio modelo que usted elija. Configure un modelo de visión en `models.ocr` y mantenga su clave con el `models text key set` habitual. Reemplace `your-vision-model` con el nombre de su modelo.

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

`--ocr` envía imágenes a ese servicio; sin él no se llama ningún modelo. La simultaneidad es 1–8, por defecto 4; el límite de archivos es de 1 a 500, el valor predeterminado es 100. Pase el cursor devuelto para continuar con una exploración limitada. Los PDF escaneados necesitan los `unpdf` y `@napi-rs/canvas` opcionales, con un máximo de 20 páginas por documento; las páginas con una capa de texto permanecen locales. Una repetición reutiliza el hash del archivo y la identidad del modelo. El texto que escribió su agente y el texto indexado anteriormente sobreviven a una ejecución de OCR fallida o cancelada. Verifique el recuento fallido y el estado de cada archivo; un límite de tarifa del proveedor detiene las llamadas posteriores en esa ejecución. `--offline` no se puede combinar con `--ocr`.

**Archivos que ya tienes.** `tg attachments extract --chat <chat> --from-dir ./files` lee una carpeta, sin sus subcarpetas. Un archivo necesita un nombre original único o un conjunto completo de nombres de descarga. No combine `--from-dir` con `--download` o `--output-dir`. `tg messages download <chat> <id> --extract` extrae solo los archivos descargados por esta ejecución; `--all --extract` hace lo mismo para todo el lote. La extracción detecta archivos modificados mediante su hash y conservan el texto que escribió su agente. A través de MCP, una extracción limitada devuelve una continuación `cursor` y metadatos, sin texto de archivo.

## Contraseñas, códigos y tarjetas

```sh
tg search messages 'preset:secret kind:saved'    # something that looks like a password or token
```

```sh
tg search messages 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de inicio de sesión, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#presets).

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

Una etiqueta es tu propia etiqueta en un chat, una persona o un mensaje (`--message <id> --chat <chat>`). Se guarda únicamente en el archivo local y nunca se envía a Telegram. `tag:work` busca mensajes etiquetados como `work`, mensajes en un chat etiquetados como `work` y mensajes de una persona etiquetada como `work`. Una etiqueta tiene entre 1 y 32 letras de la a a la z, dígitos y guiones.

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

Cada búsqueda y recuento exitoso se escribe en el historial: la consulta y sus opciones, nunca los mensajes que encontró. Se conservan las 1.000 ejecuciones más recientes. `--no-record` mantiene una ejecución sin él; para MCP, `tg mcp --no-record` o `record` configurado en `false` mantiene fuera las llamadas del servidor. `searches clear` vacía el historial y mantiene las búsquedas guardadas. Este historial es independiente de los registros de ejecución de `tg runs`.

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

Telegram puede buscar su propia copia de tus chats, incluidos los mensajes que nunca recuperaste. Por defecto, tg pregunta a Telegram y al archivo local en una sola ejecución (`--backend both`). `--backend server` muestra solo los resultados de Telegram y `--backend archive` busca solo en el archivo local.

```sh
tg search messages 'invoice' --backend both
```

```sh
tg search messages 'invoice chat:"Book club" from:Olga' --backend both
```

```sh
tg search messages 'invoice date:2026-09' --backend server --server-time 10s
```

Telegram decide por sí solo qué coincide con una palabra y no la documenta. Entonces tg trata su respuesta como candidatos: los guarda en el archivo local y ejecuta su consulta sobre ellos con las propias reglas del archivo local. `exact:`, `-word`, las comillas y la clasificación significan lo mismo que sin `--backend`, y un mensaje nunca aparece dos veces. Un mensaje devuelto por Telegram que no coincide con tu consulta no se muestra, pero se conserva en el archivo local.

Telegram recibe solo las palabras que exige tu consulta, un chat, un remitente junto con un chat y las fechas.
`OR` genera hasta tres búsquedas. tg aplica después las negaciones, los comodines, `has:`, `tag:` y las búsquedas predefinidas.
Una consulta sin palabras no consulta Telegram. tg espera como máximo 5 segundos (`--server-time`,
hasta 60 s) y obtiene hasta 100 mensajes por búsqueda; descarta las respuestas posteriores. No se marca ningún mensaje como leído.

Con `--json`, cada mensaje dice de dónde vino (`source`: `archive`, `server` o `both`) y un bloque `server` dice qué devolvió Telegram y qué falló. `--backend both` nunca falla por culpa de Telegram: sin conexión, sin permiso o sin palabras contesta desde el archivo local y dice por qué. `--backend server` se niega en cambio. El permiso es `messages.server-search`; un perfil de solo lectura responde desde el archivo local. `stats messages show` cuenta solo el archivo local: los recuentos de Telegram siguen sus propias reglas, no tu consulta.

## Obtener mensajes nuevos primero: `--sync-first`

```sh
tg search messages 'invoice' --chat "Book club" --sync-first
```

`--sync-first` descarga mensajes nuevos antes de buscar y no marca nada como leído. Se necesitan como máximo 5 chats, 500 mensajes y 30 segundos; cambie estos límites con `--max-chats`, `--max-messages` y `--sync-time`. Cuando la descarga falla o se detiene antes de tiempo, aún obtienes los resultados del archivo local, marcados con cobertura obsoleta y los detalles de la descarga.

## Mensajes sobre un resultado

`--newest` ordena por tiempo en lugar de por relevancia, y `--context 2` muestra dos mensajes antes y después de cada uno encontrado (2 en el terminal, 0 en caso contrario por defecto).

`--thread` muestra la cadena de respuestas y las respuestas alrededor de cada resultado en lugar de sus vecinos en el tiempo. Sigue los enlaces de respuesta guardados en el archivo local y en `messages context` también reemplaza a los vecinos a tiempo. Los valores predeterminados son 8 enlaces del hit, 50 mensajes, 65.536 bytes y un día en cada lado; cámbielos por `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin enlaces guardados, vuelve a los vecinos en el tiempo; Los enlaces que están desactualizados se marcan y no se siguen. `messages context` con `--offline` lee solo mensajes guardados.

## Resultados como JSON

En una terminal, tg imprime una transcripción legible. `--json` devuelve un objeto con los mensajes y lo buscado; `--jsonl` transmite solo los mensajes, uno por línea. Los campos de la respuesta se encuentran en la [referencia del lenguaje de consulta](./query-language.md#the-answer).

## Si no se encuentra nada

Una respuesta vacía significa "no en el archivo local en la que buscó", no "nunca envió". Verifique lo que está almacenado con `tg store status` y obtenga más con `tg store fetch`. Con `--json` la respuesta dice qué chats se buscaron y qué tan completos están, incluso cuando no hay nada que coincida. Si tg solicita `tg store migrate`, el índice de palabras aún se está construyendo; Las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

**Huecos en el historial de un chat.** `tg store gaps plan <chat>` busca, en esta computadora, espacios entre los tramos del historial que tiene el archivo local. Los ID de mensajes faltantes y los períodos de silencio por sí solos no prueban que falte el historial; los bordes del historial guardado permanecen `unknown`. Verifique el plan, luego ejecute `tg store gaps repair <chat> --fingerprint <hash>` para descargar los espacios. Los valores predeterminados son cinco espacios, 500 mensajes y 30 segundos; `--max-gaps`, `--limit`, `--repair-time`, `--page-size` y `--pause` marcan los límites. Una repetición repara los espacios restantes y nunca elimina un mensaje porque Telegram no lo devolvió. Las páginas donde varios mensajes comparten una marca de tiempo permanecen pendientes. `--background` lo ejecuta como un trabajo que siguen `store jobs show`, `store jobs list` y `store jobs cancel`. La reparación necesita permiso de escritura `store.gaps.repair` y permiso para leer mensajes. A través de MCP, los mismos comandos se encuentran a través de `tg_tools_search` y se ejecutan a través de `tg_read` o `tg_write`; Los trabajos pertenecen a un perfil.

**Prepara la búsqueda por temas durante la descarga.** `tg store fetch <chat> --catch-up` crea las conversaciones de ese chat y calcula sus vectores locales inmediatamente después de descargar el historial, para [búsqueda de tema](./topic-search.md). Está desactivado de forma predeterminada; la configuración del perfil `searchCatchUp: true` lo activa y `--no-catch-up` lo desactiva para una ejecución. Los límites son `--catch-up-chunks 500 --catch-up-messages 10000 --catch-up-time 30s`. Nunca descarga un modelo ni llama a un servicio remoto. Un resultado `prepared` separado informa cuando la preparación está incompleta; el historial obtenido se guarda de cualquier manera. Durante una reparación de brechas, la recuperación comparte el presupuesto de tiempo de la reparación.

## Próximo

- [Búsqueda de tema](./topic-search.md): busca una discusión según de qué trata, cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): cada campo, operador, límite y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture): la página técnica: el índice de palabras, el gráfico de conversación, los vectores y cómo se clasifican los resultados.
