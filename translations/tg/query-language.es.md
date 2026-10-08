---
title: "Lenguaje de consulta de la búsqueda"
---

La referencia de consultas de `tg messages search`, `tg stats messages show` y búsquedas guardadas. Para ejemplos cotidianos, empieza por la [búsqueda de mensajes](./search.md).

El lenguaje es un perfil estricto de la sintaxis de consultas de Apache Lucene: palabras, frases, AND/OR/NOT, grupos, campos, intervalos, comodines con límites y expresiones regulares. La [referencia completa](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language.md) (en ruso) contiene las tablas generadas de campos, operadores, filtros preparados y límites, y ejemplos ejecutables; la [especificación técnica](https://github.com/leemour/cli-messaging/blob/v0.164.0/docs/search/query-language-spec.md) describe la gramática y el compilador.

Las palabras y frases sin campo coinciden con formas de las palabras. `--exact` selecciona formas exactas para palabras sin campo; `text:` explícito sigue buscando formas. Los ajustes de idioma del archivo afectan a las coincidencias.

## Operadores

| Operador | Ejemplo | Significado |
|---|---|---|
| palabras | `invoice paid` | las dos palabras |
| frase | `"invoice paid"` | las palabras en este orden |
| `AND`, `&&` | `alpha AND beta` | las dos |
| `OR`, `\|\|` | `alpha OR beta` | cualquiera de las dos |
| `NOT`, `!`, `-` | `alpha NOT beta` | la primera sin la segunda |
| `+` | `+alpha OR beta` | alpha obligatoria, beta opcional |
| grupo | `(alpha OR beta) gamma` | los paréntesis fijan el orden |
| grupo de campo | `from:(alice OR bob)` | el campo se aplica a cada valor |
| intervalo | `date:[2026-01-01 TO 2026-02-01}` | `[ ]` incluyen, `{ }` excluyen, `*` abierto |
| comparación | `size>10MB`, `date>=7d` | un intervalo abierto |
| comodín | `invo*`, `te?t` | `*` cualquier número de caracteres, `?` uno |
| expresión regular | `text:/pass(port)?/` | una expresión regular de Lucene con límites |

`alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` significa `alpha OR (beta AND gamma)`. Usa paréntesis para evitar dudas. `and`, `or` y `not` en minúsculas son palabras normales. Una consulta con solo `NOT` no encuentra nada: añade una condición positiva, por ejemplo `kind:group NOT preset:secret`. La coincidencia difusa `~`, la proximidad, la relevancia ponderada y los intervalos se rechazan con un error; no se ignoran.

## Campos

| Campo | Encuentra | Ejemplo |
|---|---|---|
| `text` | palabras del mensaje (el campo predeterminado) | `text:invoice` |
| `exact` | la forma exacta de una palabra o frase | `exact:piso`, `exact:"invoice paid"` |
| `body` | todo el texto original, distinguiendo mayúsculas | `body:/.*invoice.*/` |
| `from` | el remitente, por nombre, @usuario o id; `me` eres tú | `from:"Alice Synthetic"` |
| `chat` | el chat, por título, @usuario o id | `chat:"Book club"` |
| `date` | cuándo se envió | `date:today`, `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| `kind` | el tipo de chat: `private`, `group`, `channel`, `saved`, `bot`, `service`, `unknown` | `kind:private` |
| `has` | `attachment`, `link`, `file`, `photo`, `image`, `video`, `audio`, `voice`, `sticker`, `contact`, `location`, `poll` | `has:file` |
| `topic` | un tema de foro; necesita un chat | `chat:"Book club" AND topic:42` |
| `in` | qué cuentas: un proveedor o `bots` | `in:bots` |
| `preset` | texto con forma de secreto o de dato de contacto | `preset:secret` |
| `content` | texto indexado de los adjuntos | `content:invoice` |
| `filename` | el nombre completo de un archivo adjunto | `filename:*.pdf` |
| `mime` | el tipo de un archivo adjunto; un valor sin `/` coincide con la primera parte | `mime:image` |
| `size` | el tamaño de un archivo adjunto, en bytes o en KB/MB/GB de 1024 | `size>10MB` |
| `tag` | tu propia etiqueta local en el mensaje, su chat o su remitente | `tag:work` |

Los nombres de campo distinguen mayúsculas. Un campo, valor o combinación desconocidos son un error, nunca una respuesta vacía ni texto normal. Un nombre que el archivo local no conoce no se busca en Telegram.

`kind:bot` selecciona un chat con un bot; `in:bots` selecciona los archivos de las cuentas de `tg bot`. `topic:` necesita exactamente un chat en `chat:` o `--chat`, porque los números de tema se repiten entre grupos. `filename`, `mime` y `size` coinciden con un mensaje cuando al menos uno de sus archivos coincide. `/` inicia una expresión regular, así que pon un tipo completo entre comillas: `mime:"application/pdf"`.

## Filtros preparados

| Filtro | Un candidato es |
|---|---|
| `password` | una etiqueta de contraseña seguida de un valor |
| `code` | una etiqueta de código de verificación y de 4 a 8 cifras |
| `api-key` | una etiqueta de clave de API y un valor |
| `secret` | una etiqueta de contraseña, secreto, token o clave de API y un valor |
| `card` | de 13 a 19 cifras, con espacios o guiones opcionales |
| `bank` | un valor con forma de IBAN |
| `passport` | un valor de pasaporte con etiqueta o la forma rusa de 4+6 cifras |
| `phone` | un teléfono internacional con prefijo + |
| `email` | una forma de dirección de correo electrónico |
| `telegram-link` | un enlace t.me o telegram.me |
| `url` | un enlace HTTP(S) |
| `contact` | un contacto adjunto, o un correo electrónico o un teléfono |
| `location` | una ubicación adjunta o un enlace geo: |

Un filtro preparado señala un candidato por su forma. No verifica una contraseña, una tarjeta ni un documento, y puede coincidir con algo inofensivo. No borres ni reenvíes mensajes de forma automática solo por su resultado.

## Fechas

`--timezone` acepta una zona IANA como `Europe/Madrid`; sin ella se usa la zona del equipo, que se devuelve en la respuesta. Una fecha sin hora es un día natural completo. Un límite superior inclusivo incluye todo ese día; uno exclusivo lo excluye; un día con cambio de hora puede durar 23 o 25 horas.

`date:today` y `date:yesterday` son días naturales. `date:7d` significa desde hace 7 días hasta ahora (también `30m`, `2h`); `date>=7d` y `date:[30d TO 7d}` funcionan en comparaciones e intervalos, contados desde el momento en que se ejecuta la consulta. Una hora exacta va entre comillas, con segundos y desplazamiento horario: `date>="2026-01-01T10:00:00+02:00"`.

## Palabras, comodines y expresiones regulares

El texto se normaliza antes de indexarlo y buscarlo: minúsculas y sin tildes. Un efecto secundario: algunas palabras distintas pasan a ser iguales, como `año` y `ano`. Las expresiones regulares y los comodines de `text:` se normalizan del mismo modo.

`text:/pay/` coincide con la palabra completa pay, no con payment. `body:/pay/` coincide solo con un mensaje cuyo texto entero es pay, distinguiendo mayúsculas; para encontrarla en cualquier parte, usa `body:/.*pay.*/`. Es la sintaxis de expresiones regulares de Lucene, sin anticipaciones de JavaScript, referencias hacia atrás, anclas ni opciones.

En un archivo grande, un prefijo corto como `a*` puede abarcar más de 10 000 palabras y se rechaza; alárgalo. Las consultas largas, el anidamiento profundo, los patrones grandes y los recorridos lentos se rechazan con `query_limit`, no se recortan: limita el chat, las fechas o el patrón.

## La respuesta

`--json` devuelve `{ items, page, limit, hasMore, corrections, completeness, wordsReady, query, coverage }`, aunque no haya coincidencias. `--jsonl` emite solo los elementos.

- `query`: la versión del lenguaje, la zona horaria y el orden usados.
- `coverage`: en qué cuentas y chats se buscó. `lastSyncedAt` es el momento más antiguo en que `store fetch` descargó un chat del ámbito, o `null` si alguno no se descargó nunca. `inventoryComplete` significa que cada cuenta del ámbito ha listado alguna vez todos sus chats; no garantiza un historial completo.
- `completeness`: por chat, si su historial guardado llega al principio y si tiene huecos.
- `wordsReady`: si el índice de palabras está completo. Cuando es `false`, una consulta con palabras falla con `index_not_ready` y el comando que lo termina, `tg store migrate`; una consulta sin palabras se ejecuta.
- `hasMore` se refiere a la página, no a si Telegram tiene más.

Un error incluye la posición del problema en la consulta y una pista.

## En MCP

`tg_read` (`command: "messages search"`) acepta la consulta como `text` o como un árbol sintáctico versionado en `ast` (no ambos); `language` elige `lucene` o `legacy`, y `timezone` la zona horaria del calendario. `chat` acepta un ID o nombre guardado; `source`, `newest`, `context` y `limit` funcionan como las opciones del comando; `saved` ejecuta una búsqueda guardada. El historial de consultas sigue al servidor: `tg mcp --no-record`, o `record` definido como `false`, deja sus llamadas fuera. La respuesta tiene los mismos campos que `--json`. `tg_read` (`command: "stats messages show"`) cuenta las mismas consultas.

## Los modos anteriores

```sh
tg messages search 'from:alice after:7d invoice -draft' --language legacy --json
tg messages search --regex 'invoice\s+\d+' --json
```

`--language legacy` conserva los filtros anteriores y su corrección de erratas. `--regex` es un modo aparte: una expresión regular de JavaScript, sin distinguir mayúsculas, sobre el texto completo, en un proceso aislado con límites de tiempo y tamaño. `--regex` no se puede combinar con `--language lucene`.

| Anterior | Estricto |
|---|---|
| `after:2026-01-01` | `date:[2026-01-01 TO *]` |
| `before:2026-02-01` | `date:[* TO 2026-02-01}` |
| `after:7d` | `date:7d` |
| prefijo y corrección de erratas automáticos | `invo*` de forma explícita; erratas solo en `--language legacy` |

`--thread` sigue el grafo de respuestas guardado; en `messages context` sustituye a los mensajes vecinos en orden cronológico. Los valores predeterminados son 8 saltos, 50 mensajes, 65 536 bytes y un día alrededor de cada resultado. Cámbialos con `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin grafo, vuelve al contexto cronológico; los enlaces desactualizados se marcan y no se recorren.

La búsqueda por palabras consulta Telegram y el archivo local de forma predeterminada; `--backend archive` la limita a los datos locales.
`--sync-first` descarga explícitamente los mensajes nuevos antes de buscar y
no marca ninguno como leído: como máximo 5 chats, 500 mensajes y 30 segundos. Cambia estos límites con `--max-chats`,
`--max-messages`, `--sync-time`. Una actualización fallida o incompleta conserva los resultados locales con información sobre la cobertura desactualizada y
los detalles de la actualización.

MCP usa `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` y `sync_first`. `sync_first` solo está disponible con `messages.sync-first: allow`. Un `messages_context` normal con `offline: true` lee los mensajes guardados.
