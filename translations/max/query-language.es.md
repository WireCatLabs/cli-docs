---
title: "Lenguaje de consulta de la búsqueda"
---

<a id="en-mcp" />
<a id="los-modos-anteriores" />
<a id="в-mcp" />
<a id="прежние-режимы" />

Si trabaja con `max` a través de un agente de IA, no necesita aprender este idioma: diga con palabras comunes lo que está buscando y el agente creará la solicitud. Esta página es para quienes escriben la búsqueda ellos mismos y para quienes necesitan todos los filtros: operadores exactos, todos los campos, ajustes preestablecidos, reglas de fecha y límites.

Esta es una ayuda para las consultas `max search messages`, `max search all`, `max stats messages show`, búsquedas guardadas y `--filter` [búsqueda por tema](./topic-search.md). Ejemplos para todos los días: en [búsqueda de mensajes](./search.md).

Términos de esta página:

- **Consulta**: texto de búsqueda, como `счёт from:me date:7d`.
- **Campo**: nombre con dos puntos que filtra una propiedad: `from:` (remitente), `date:` (fecha). Las palabras sin campo buscan en el texto del mensaje.
- **Operador**: palabra o signo que combina condiciones: `AND`, `OR`, `NOT`.
- **Formas de palabra**: distintas terminaciones, como «casa» y «casas».

Idioma: un perfil estricto de la sintaxis de Apache Lucene: palabras, frases, Y/O/NO, grupos, campos, rangos, patrones limitados y expresiones regulares. "Estricto" significa que cualquier cosa que no sea compatible es un error, no una parte que se omite silenciosamente. [La ayuda completa](https://github.com/leemour/cli-messaging/blob/v0.212.0/docs/search/query-language.md) contiene tablas generadas de campos, operadores, ajustes preestablecidos y límites y ejemplos verificables; [La especificación técnica](https://github.com/leemour/cli-messaging/blob/v0.212.0/docs/search/query-language-spec.md) describe la gramática y el compilador.

## Qué puede hacer el idioma

|Necesito|Escribir|
|---|---|
|mensajes con todas estas palabras, en cualquier forma| `счёт оплачен` |
|estas palabras seguidas, en este orden| `"счёт оплачен"` |
|una palabra u otra, sin tercera| `(кафе OR библиотека) NOT шумно` |
|solo esta forma de la palabra|`exact:квартира` o `--exact` para todas las palabras sin campo|
|palabras que empiezan con algo| `квартир*` |
|remitente, chat, tipo de chat| `from:me`, `chat:"Книжный клуб"`, `kind:private` |
|período| `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
|archivos por nombre o tamaño| `filename:*.pdf`, `size>10MB` |
|texto similar a una contraseña, tarjeta o teléfono| `preset:secret`, `preset:card` |
|tus propias etiquetas| `tag:work` |
|muestra| `text:/pass(port)?/` |

Las palabras y frases sin campo buscan distintas formas de palabra. `--exact` selecciona formas exactas para las palabras sin campo; `text:` explícito sigue buscando formas. Las coincidencias dependen del idioma configurado en el archivo ([formas de palabra](./archive.md#обслуживание-архива)).

## Operadores

| Operador | Ejemplo | Significado |
|---|---|---|
| palabras | `счёт оплачен` | las dos palabras |
| frase | `"счёт оплачен"` | las palabras en este orden |
| `AND`, `&&` | `alpha AND beta` | las dos |
| `OR`, `\|\|` | `alpha OR beta` | cualquiera de las dos |
| `NOT`, `!`, `-` | `alpha NOT beta` | la primera sin la segunda |
| `+` | `+alpha OR beta` | alpha obligatoria, beta opcional |
| grupo | `(alpha OR beta) gamma` | los paréntesis fijan el orden |
| grupo de campo | `from:(alice OR bob)` | el campo se aplica a cada valor |
| intervalo | `date:[2026-01-01 TO 2026-02-01}` | `[ ]` incluyen, `{ }` excluyen, `*` abierto |
| comparación | `size>10MB`, `date>=7d` | un intervalo abierto |
| comodín | `квартир*`, `т?кст` | `*` cualquier número de caracteres, `?` uno |
| expresión regular | `text:/pass(port)?/` | una expresión regular de Lucene con límites |

`alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` - `alpha OR (beta AND gamma)`. Utilice paréntesis para mayor claridad. `and`, `or`, `not` en minúsculas: palabras comunes. La consulta desde un `NOT` no encuentra nada: agregue una condición positiva, por ejemplo `kind:group NOT preset:secret`. La búsqueda difusa `~`, la proximidad de palabras, los pesos y los intervalos dan un error en lugar de omitirse. Los errores tipográficos no se pueden corregir: para captar diferentes finales, escriba un patrón como `квартир*`.

## Campos

| Campo | Encuentra | Ejemplo |
|---|---|---|
| `text` | palabras del mensaje (campo predeterminado) | `text:счёт` |
| `exact` | Forma exacta de una palabra o frase | `exact:квартира`, `exact:"счёт оплачен"` |
| `body` | todo el texto original, distinguiendo mayúsculas | `body:/.*счёт.*/` |
| `from` | remitente por nombre, @username o id; `me` eres tú | `from:"Алиса Тестова"` |
| `chat` | chat por título, @username o id | `chat:"Книжный клуб"` |
| `date` | cuándo se envió | `date:today`, `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| `kind` | tipo de chat: `private`, `group`, `channel`, `saved`, `bot`, `service`, `unknown` | `kind:private` |
| `has` | `attachment`, `link`, `file`, `photo`, `image`, `video`, `audio`, `voice`, `sticker`, `contact`, `location`, `poll` | `has:file` |
| `topic` | un hilo de conversación; requiere un chat | `chat:"Книжный клуб" AND topic:42` |
| `in` | qué cuentas: proveedor o `bots` | `in:bots` |
| `preset` | texto parecido a un secreto o contacto | `preset:secret` |
| `content` | texto guardado del adjunto | `content:договор` |
| `filename` | nombre completo del archivo adjunto | `filename:*.pdf` |
| `mime` | tipo del adjunto; MAX no lo indica | `mime:image` |
| `size` | tamaño en bytes o KB/MB/GB de 1024 | `size>10MB` |
| `tag` | tu etiqueta local en el mensaje, su chat o su remitente | `tag:work` |

Los nombres de campo distinguen mayúsculas. Un campo, valor o combinación desconocidos son un error, nunca una respuesta vacía ni texto normal. Un nombre que el archivo local no conoce no se busca en MAX.

`kind:bot` selecciona un chat con un bot; `in:bots` selecciona los archivos de `max bot`. `topic:` requiere exactamente un chat en `chat:` o `--chat`: los números de tema se repiten entre chats. `filename`, `mime` y `size` coinciden con un mensaje si coincide al menos uno de sus archivos. MAX no indica los tipos de archivo, así que `mime:` no encuentra nada aquí: busca por extensión.

## Filtros preparados

Preset busca texto según su tipo. Con él podrás encontrar una contraseña, código o número de tarjeta que alguien envió.

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

`--timezone` acepta una zona IANA como `Europe/Madrid`; sin ella se usa la zona del comando, que se devuelve en la respuesta. Una fecha sin hora es un día natural completo. Un límite superior inclusivo incluye todo ese día; uno exclusivo lo excluye; un día con cambio de hora puede durar 23 o 25 horas.

`date:today` y `date:yesterday` son días naturales. `date:7d` significa desde hace 7 días hasta ahora (también `30m`, `2h`); `date>=7d` y `date:[30d TO 7d}` funcionan en comparaciones e intervalos, contados desde el momento en que se ejecuta la consulta. Una hora exacta va entre comillas, con segundos y desplazamiento horario: `date>="2026-01-01T10:00:00+02:00"`.

## Palabras, comodines y expresiones regulares

Antes de indexarlo y buscarlo, el texto se convierte a minúsculas y pierde los acentos; `ё` pasa a `е`, y `й` a `и`. Por eso coinciden algunas palabras distintas: `мой` también encuentra «мои». Las expresiones regulares y los comodines de `text:` se normalizan igual.

`text:/счёт/` coincide con la palabra completa «счёт», pero no con «счётом». `body:/счёт/` coincide solo con un mensaje cuyo texto completo es «счёт», distinguiendo mayúsculas; para encontrarla en cualquier posición, usa `body:/.*счёт.*/`, y para el comienzo de una frase, `body:/.*[Сс]чёт.*/`. Es la sintaxis de expresiones regulares de Lucene, sin lookaround, referencias inversas, anclas ni indicadores de JavaScript.

En un archivo grande, un prefijo corto como `к*` puede abarcar más de 10 000 palabras y se rechaza; alárgalo. Las consultas largas, el anidamiento profundo, los patrones grandes y los recorridos lentos se rechazan con `query_limit`, no se recortan: limita el chat, las fechas o el patrón.

### Expresión regular de JavaScript: `--regex`

```sh
max search messages --regex 'invoice\s+\d+' --json
```

`--regex` - modo separado. Las palabras después del comando son una única expresión regular de JavaScript, no una consulta en ese idioma. No distingue entre mayúsculas y minúsculas, se compara con el texto completo de cada mensaje almacenado y se ejecuta en un proceso aislado con límites de tiempo y tamaño. Una búsqueda guardada almacena su `--regex`; no puede agregar `--regex` al comenzar desde `--saved`.

## La respuesta

`--json` devuelve `{ items, page, limit, hasMore, corrections, completeness, wordsReady, query, coverage }`, aunque no haya coincidencias. `--jsonl` emite solo los elementos.

- `query`: la versión del lenguaje, la zona horaria y el orden usados.
- `coverage`: en qué cuentas y chats se buscó. `lastSyncedAt` es el momento más antiguo en que `store fetch` descargó un chat del ámbito, o `null` si alguno no se descargó nunca. `inventoryComplete` significa que cada cuenta del ámbito ha listado alguna vez todos sus chats; no garantiza un historial completo.
- `completeness`: por chat, si su historial guardado llega al principio y si tiene huecos.
- `wordsReady`: si el índice de palabras está completo. Cuando es `false`, una consulta con palabras falla con `index_not_ready` y el comando que lo termina, `max store migrate`; una consulta sin palabras se ejecuta.
- `hasMore` se refiere a la página, no a si MAX tiene más.

Un error incluye la posición del problema en la consulta y una pista.

## A través de MCP

Mediante MCP, `max_read` (`command: "search messages"`) acepta la consulta como `text` o como árbol de sintaxis con versión en `ast`, nunca ambos; `timezone` elige la zona del calendario. `chat` acepta ID o nombre guardado; `source`, `newest`, `context` y `limit` corresponden a las opciones del comando. `saved` ejecuta una búsqueda guardada. `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` y `sync_first` corresponden a `--thread…` y `--sync-first`; `sync_first` requiere `messages.sync-first: allow`. Devuelve los mismos campos que `--json`. `max_read` (`command: "stats messages show"`) cuenta las mismas consultas. `record: false` evita registrar la llamada en el historial.

## Más

- [Búsqueda de mensajes](./search.md): busca todos los días, búsquedas guardadas y contando.
- [Buscar por tema](./topic-search.md): encuentre una discusión por significado cuando no recuerde las palabras.
