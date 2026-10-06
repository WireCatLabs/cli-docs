---
title: "Buscar mensajes"
---

`max messages search` encuentra mensajes en el archivo local: la copia de tus chats que `max` guarda en este equipo. Por defecto no se conecta a MAX ni marca nada como leído. Un mensaje que `max` no ha descargado no se puede encontrar, así que descarga antes el historial: `max store fetch <чат>` ([archivo local](./archive.md)).

Esta página trata las búsquedas del día a día. Otras tres páginas van más allá:

- [Búsqueda por tema](./topic-search.md): encuentra una conversación por su tema cuando no recuerdas sus palabras.
- [Lenguaje de consulta](./query-language.md): todos los campos, operadores y límites, y la respuesta JSON.
- [Cómo funciona la búsqueda](https://wirecat.dev/ru/docs/search-architecture): la página técnica: el índice de palabras, el grafo de conversaciones, los vectores y cómo se ordenan los resultados.

Escribe la consulta entre comillas simples para que la terminal no toque sus comillas ni sus corchetes. Los nombres de abajo son ejemplos; usa tus propios chats y personas.

## Palabras y frases

```sh
max messages search счёт
max messages search '"счёт оплачен"'             # точная фраза
max messages search 'кафе OR библиотека'
max messages search '(кафе OR библиотека) NOT шумно'
max messages search 'квартир*'                   # все слова, которые начинаются на «квартир»
```

Las palabras escritas una junto a otra deben aparecer todas en el mensaje. Una palabra encuentra esa misma palabra sin distinguir mayúsculas ni acentos; `ё` y `е` se consideran iguales. Otra forma de una palabra es una palabra distinta: `квартира` no encuentra «квартиру»; el prefijo `квартир*` encuentra ambas. No se adivina nada: no se corrigen erratas ni se buscan palabras parecidas.

## Personas y chats

```sh
max messages search 'from:"Алиса Тестова" счёт'
max messages search 'from:("Алиса Тестова" OR "Борис Тестов") библиотека'
max messages search 'from:me date:7d'            # что вы писали за неделю
max messages search 'chat:"Книжный клуб" библиотека'
max messages search библиотека --chat "Книжный клуб"   # то же, опцией
max messages search 'паспорт kind:private'       # только личные переписки
```

`kind:` admite `private` (chats privados), `group`, `channel`, `saved` (Mensajes guardados) y `bot`.

## Fechas

```sh
max messages search 'date:today'
max messages search 'библиотека date:yesterday'
max messages search 'счёт date:7d'               # от 7 дней назад до сейчас; также 30m, 2h
max messages search 'счёт date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu equipo; `--timezone` elige otra. En un intervalo, `[` y `]` incluyen ese día; `{` y `}` lo excluyen.

## Archivos y enlaces

```sh
max messages search 'has:file'
max messages search 'filename:*.pdf'
max messages search 'filename:*договор*'         # часть имени
max messages search 'size>10MB'
max messages search 'size:[1KB TO 300KB]'
max messages search 'has:photo chat:"Книжный клуб"'
max messages search 'has:link AND "github.com"'  # ссылка на сайт
```

Un archivo se encuentra por su nombre y tamaño aunque el mensaje no tenga texto. `filename:` compara el nombre completo sin distinguir mayúsculas, acentos ni `ё`. Los tamaños usan KB, MB y GB de 1024. MAX no indica el tipo de archivo, así que busca por extensión: `filename:*.pdf`, en vez de `mime:`. `has:` también admite `attachment`, `video`, `audio`, `voice`, `sticker`, `contact`, `location` y `poll`. Un enlace cuenta tanto si aparece en el texto como si solo está en su tarjeta.

## Contraseñas, códigos y tarjetas

```sh
max messages search 'preset:secret kind:saved'   # что-то похожее на пароль или токен в Избранном
max messages search 'preset:card'
```

Un filtro preparado encuentra mensajes que *parecen* una contraseña, un código de acceso, una clave de API, un número de tarjeta o IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Solo comprueba la forma: no demuestra que una contraseña funcione ni que una tarjeta sea real. La lista completa está en el [lenguaje de consulta](./query-language.md#preset).

## Etiquetas

```sh
max tags add work --chat "Книжный клуб"
max tags add work --contact "Борис Тестов"
max tags list --tag work --type chat
max messages search 'tag:work счёт'
max messages search 'счёт NOT tag:work'
max tags remove work --chat "Книжный клуб"
```

Una etiqueta es tu propia marca en un chat, una persona o un mensaje (`--message <id> --chat <чат>`). Se guarda en el archivo local y nunca se envía a MAX. `tag:work` encuentra los mensajes con la etiqueta `work`, los mensajes de un chat con esa etiqueta y los mensajes de una persona con esa etiqueta. Tiene entre 1 y 32 caracteres: letras latinas a–z, números y guiones.

## Búsquedas guardadas e historial

```sh
max searches create meetings 'библиотека OR кафе' --chat "Книжный клуб"
max messages search --saved meetings
max messages search --saved meetings 'date:today'   # слова добавляются через AND
max messages stats --saved meetings --by day
max searches list
max searches history --limit 10
max messages search --saved 42                   # строка истории, по её номеру
```

`searches create` guarda una consulta con sus opciones y no ejecuta nada; un nombre que ya existe necesita `--replace`. Las opciones que escribes con `--saved` sustituyen a las guardadas. El texto guardado se vuelve a leer en cada ejecución, así que `date:7d` siempre significa los últimos 7 días. `searches show` muestra una y `searches delete` elimina una.

Cada búsqueda y recuento que termina bien se guarda en el historial: la consulta y las opciones, nunca los mensajes encontrados. Se conservan las últimas 1000 ejecuciones. `--no-record` excluye una ejecución; en MCP, usa `record: false`. `searches clear` borra el historial sin eliminar las búsquedas guardadas. Este historial es independiente de `max runs`.

Las búsquedas guardadas y el historial están en el archivo compartido por `max` y `tg`: ambos ven las mismas entradas, y `delete` o `clear` en uno las cambia también en el otro. Las etiquetas permanecen vinculadas a su cuenta.

## Contar: `messages stats`

```sh
max messages stats счёт                          # сколько в каждом чате
max messages stats 'date:7d' --by sender
max messages stats 'from:me' --by day --timezone Europe/Madrid
max messages stats --by hour                     # все сохранённые сообщения
```

`messages stats` cuenta los mensajes que `messages search` encontraría con la misma consulta, cada uno una vez. `--by chat` (el valor predeterminado) y `--by sender` ponen primero los mayores; `--by day` y `--by hour` van en orden. Si algunos chats no están guardados enteros, los números son un mínimo, y stderr indica cuántos chats son.

## Si no se encuentra nada

Una respuesta vacía significa «no está en el archivo en el que buscaste», no «nunca se envió». `max store status` muestra lo guardado; `max store fetch` añade historial. Con `--json`, la respuesta indica los chats examinados y su integridad incluso sin coincidencias. Si `max` pide `max store migrate`, el índice de palabras aún se está construyendo; las búsquedas sin palabras (`has:file`, `date:today`) ya funcionan.

Para buscar en todas las cuentas del archivo local, añade `--source all`. `--newest` ordena por fecha en lugar de por relevancia, y `--context 2` muestra dos mensajes alrededor de cada resultado.

## Para scripts y agentes

`--json` devuelve un objeto con los mensajes y lo que se buscó; `--jsonl` emite solo los mensajes. En MCP, `max_messages_search` y `max_messages_stats` aceptan las mismas consultas, y `max_tags_*` y `max_searches_*` gestionan etiquetas y búsquedas guardadas. Los campos de la respuesta, el modo anterior `--language legacy` y `--regex` están en el [lenguaje de consulta](./query-language.md).

Por defecto, la búsqueda lee el archivo local. `--sync-first` descarga de forma explícita los mensajes nuevos antes de buscar y no marca nada como leído: como máximo 5 chats, 500 mensajes y 30 segundos. Cambia estos límites con `--max-chats`, `--max-messages` y `--sync-time`. Si la actualización falla o queda incompleta, se conservan los resultados locales, con la cobertura desactualizada y los detalles de la actualización.

`content:договор` busca palabras en el texto guardado de un adjunto. La extracción admite archivos de texto, DOCX y PDF con capa de texto. Tu agente lee fotos y escaneos y guarda su texto mediante `attachments text set`. Si hay varios adjuntos, indica `--attachment`, numerado desde 1.

```sh
max attachments extract --chat "Книжный клуб" --download --output-dir ./files
max messages search 'content:договор'
max attachments list --chat "Книжный клуб" --needs-text
max attachments text set "Книжный клуб" 204 --text-file ./scan.txt
```

`--download` requiere `--output-dir`; sin ellos, la extracción lee los archivos conservados. `list` muestra las rutas conservadas y el estado del texto, no su contenido.

`--thread` sigue el grafo de respuestas guardado; en `messages context` sustituye a los mensajes vecinos en orden cronológico. Los valores predeterminados son 8 saltos, 50 mensajes, 65 536 bytes y un día alrededor de cada resultado. Cámbialos con `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin grafo, vuelve al contexto cronológico; los enlaces desactualizados se marcan y no se recorren.

La extracción de PDF necesita el paquete opcional `unpdf`; DOCX necesita `mammoth`, instalado junto a `max`. Para una instalación global con npm: `npm install -g unpdf mammoth`. Si falta un paquete, la orden lo indica; un agente puede aportar el texto.