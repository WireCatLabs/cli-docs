---
title: "Buscar mensajes"
---

`tg messages search` encuentra mensajes en el archivo local: la copia de tus chats que tg guarda en este equipo. Por defecto nunca se conecta a Telegram ni marca nada como leído. Un mensaje que tg no ha descargado no se puede encontrar, así que descarga antes el historial: `tg store fetch <chat>` ([archivo local](./archive.md)).

Esta página trata las búsquedas del día a día. Otras tres páginas van más allá:

- [Búsqueda por tema](./topic-search.md): encuentra una conversación por su tema cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): todos los campos, operadores y límites, y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture): la página técnica: el índice de palabras, el grafo de conversaciones, los vectores y cómo se ordenan los resultados.

Escribe la consulta entre comillas simples para que la terminal no toque sus comillas ni sus corchetes. Los nombres de abajo son ejemplos; usa tus propios chats y personas.

## Palabras y frases

```sh
tg messages search invoice
tg messages search '"invoice paid"'              # the exact phrase
tg messages search 'cafe OR library'
tg messages search '(cafe OR library) NOT loud'
tg messages search 'invoic*'                     # every word that starts with "invoic"
```

Las palabras escritas una junto a otra deben estar todas en el mensaje. Una palabra encuentra esa palabra, en mayúsculas o minúsculas y con o sin tildes. Otra forma de la palabra es otra palabra: `flat` no encuentra `flats`; un prefijo como `flat*` encuentra ambas. No se adivina nada: no corrige erratas ni busca palabras parecidas.

## Personas y chats

```sh
tg messages search 'from:"Alice Synthetic" invoice'
tg messages search 'from:("Alice Synthetic" OR "Bob Synthetic") library'
tg messages search 'from:me date:7d'             # what you wrote this week
tg messages search 'chat:"Book club" library'
tg messages search library --chat "Book club"    # the same, as an option
tg messages search 'passport kind:private'       # one-to-one chats only
```

`kind:` admite `private`, `group`, `channel`, `saved` (Mensajes guardados) y `bot`. `topic:` se limita a un tema del foro de un grupo; necesita ese grupo en `chat:` o `--chat`.

## Fechas

```sh
tg messages search 'date:today'
tg messages search 'library date:yesterday'
tg messages search 'invoice date:7d'             # from 7 days ago until now; also 30m, 2h
tg messages search 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu equipo; `--timezone` elige otra. En un intervalo, `[` y `]` incluyen ese día; `{` y `}` lo excluyen.

## Archivos y enlaces

```sh
tg messages search 'has:file'
tg messages search 'filename:*.pdf'
tg messages search 'filename:*contract*'         # part of the name
tg messages search 'size>10MB'
tg messages search 'mime:image'                  # any picture sent as a file
tg messages search 'mime:"application/pdf"'      # quote a full type
tg messages search 'has:photo chat:"Book club"'
tg messages search 'has:link AND "github.com"'   # a link to a site
```

Un archivo se encuentra por su nombre, tamaño y tipo aunque el mensaje no tenga texto. `filename:` compara el nombre completo, sin distinguir mayúsculas ni tildes. Los tamaños usan KB, MB y GB de 1024. `has:` también admite `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` y `poll`. Un enlace cuenta tanto si está en el texto como si solo aparece en su vista previa.

## Contraseñas, códigos y tarjetas

```sh
tg messages search 'preset:secret kind:saved'    # something that looks like a password or token
tg messages search 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de acceso, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#presets).

## Etiquetas

```sh
tg tags add work --chat "Book club"
tg tags add work --contact "Bob Synthetic"
tg tags list --tag work --type chat
tg messages search 'tag:work invoice'
tg messages search 'invoice NOT tag:work'
tg tags remove work --chat "Book club"
```

Una etiqueta es tu propia marca en un chat, una persona o un mensaje (`--message <id> --chat <chat>`). Se guarda solo en el archivo local y nunca se envía a Telegram. `tag:work` encuentra los mensajes etiquetados `work`, los mensajes de un chat etiquetado `work` y los mensajes de una persona etiquetada `work`. Una etiqueta tiene de 1 a 32 caracteres: letras de la a a la z, cifras y guiones.

## Búsquedas guardadas e historial

```sh
tg searches create meetings 'library OR cafe' --chat "Book club"
tg messages search --saved meetings
tg messages search --saved meetings 'date:today'  # extra words are added with AND
tg messages stats --saved meetings --by day
tg searches list
tg searches history --limit 10
tg messages search --saved 42                    # a row of the history, by its number
```

`searches create` guarda una consulta con sus opciones y no ejecuta nada; un nombre que ya existe necesita `--replace`. Las opciones que escribes con `--saved` sustituyen a las guardadas. El texto guardado se vuelve a leer en cada ejecución, así que `date:7d` siempre significa los últimos 7 días. `searches show` muestra una y `searches delete` elimina una.

Cada búsqueda y recuento que termina bien se escribe en el historial: la consulta y sus opciones, nunca los mensajes encontrados. Se conservan las 1000 ejecuciones más recientes. `--no-record` deja fuera una ejecución; en MCP, `tg mcp --no-record` o `record` con valor `false` dejan fuera las llamadas del servidor; `searches clear` vacía el historial y conserva las búsquedas guardadas. Este historial es independiente de los registros de ejecución de `tg runs`.

Las búsquedas guardadas y el historial están en el archivo local que comparten tg y max: ambos ven las mismas, y `delete` o `clear` en uno cambia el otro. Las etiquetas se quedan con su cuenta.

## Contar: `messages stats`

```sh
tg messages stats invoice                        # how many in each chat
tg messages stats 'date:7d' --by sender
tg messages stats 'from:me' --by day --timezone Europe/Madrid
tg messages stats --by hour                      # every stored message
```

`messages stats` cuenta los mensajes que `messages search` encontraría con la misma consulta, cada uno una vez. `--by chat` (el valor predeterminado) y `--by sender` ponen primero los mayores; `--by day` y `--by hour` van en orden. Si algunos chats no están guardados enteros, los números son un mínimo, y stderr indica cuántos chats son.

## Si no se encuentra nada

Una respuesta vacía significa «no está en el archivo en el que buscaste», no «nunca se envió». Comprueba lo guardado con `tg store status` y descarga más con `tg store fetch`. Con `--json`, la respuesta indica en qué chats se buscó y lo completos que están, aunque no haya coincidencias. Si tg pide `tg store migrate`, el índice de palabras aún se está creando; las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

Para buscar en todas las cuentas del archivo local, añade `--source all`. `--newest` ordena por fecha en lugar de por relevancia, y `--context 2` muestra dos mensajes alrededor de cada resultado.

## Para scripts y agentes

`--json` devuelve un objeto con los mensajes y lo que se buscó; `--jsonl` emite solo los mensajes. En MCP, `tg_messages_search` y `tg_messages_stats` aceptan las mismas consultas, y `tg_tags_*` y `tg_searches_*` gestionan etiquetas y búsquedas guardadas. Los campos de la respuesta, el modo anterior `--language legacy` y `--regex` están en el [lenguaje de consulta](./query-language.md).

Por defecto, la búsqueda lee el archivo local. `--sync-first` descarga de forma explícita los mensajes nuevos antes de buscar y no marca nada como leído: como máximo 5 chats, 500 mensajes y 30 segundos. Cambia estos límites con `--max-chats`, `--max-messages` y `--sync-time`. Si la actualización falla o queda incompleta, se conservan los resultados locales, con la cobertura desactualizada y los detalles de la actualización.

`content:invoice` busca en el texto indexado que se extrajo de los adjuntos o que aportó un agente. La extracción admite texto plano, Word y PDF con capa de texto; los escaneos y las fotos necesitan texto aportado por un agente. Con varios adjuntos, elige uno con `--attachment`, empezando por 1.

```sh
tg attachments extract --chat "Book club" --download --output-dir ./files
tg messages search 'content:invoice'
tg attachments list --chat "Book club" --needs-text
tg attachments text set "Book club" 204 --text-file ./scan.txt
```

`--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos conservados. `list` muestra las rutas conservadas y el estado del texto, no su contenido.

`--thread` sigue el grafo de respuestas guardado; en `messages context` sustituye a los mensajes vecinos en orden cronológico. Los valores predeterminados son 8 saltos, 50 mensajes, 65 536 bytes y un día alrededor de cada resultado. Cámbialos con `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin grafo, vuelve al contexto cronológico; los enlaces desactualizados se marcan y no se recorren.

La extracción de PDF necesita `unpdf`, que es opcional; Word necesita `mammoth`, también opcional, instalados donde esté `tg`. Para una instalación global con npm: `npm install -g unpdf mammoth`. Si falta algún motor, se indica; un agente puede aportar el texto en su lugar.
