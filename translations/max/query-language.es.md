---
title: "Lenguaje de consulta de la búsqueda"
---

<a id="en-mcp" />
<a id="los-modos-anteriores" />
<a id="упоминания" />
<a id="в-mcp" />
<a id="прежние-режимы" />

Si trabaja con `max` a través de un agente de IA, no necesita aprender este idioma: diga con palabras comunes lo que está buscando y el agente creará la solicitud. Esta página es para quienes escriben la búsqueda ellos mismos y para quienes necesitan todos los filtros: operadores exactos, todos los campos, ajustes preestablecidos, reglas de fecha y límites.

Esta es una ayuda para las consultas `max personal search messages`, `max personal search all`, `max personal stats messages show`, búsquedas guardadas y `--filter` [búsqueda por tema](./topic-search.md). Ejemplos para todos los días: en [búsqueda de mensajes](./search.md).

Términos de esta página:

- **Consulta**: texto de búsqueda, como `счёт from:me date:7d`.
- **Campo**: nombre con dos puntos que filtra una propiedad: `from:` (remitente), `date:` (fecha). Las palabras sin campo buscan en el texto del mensaje.
- **Operador**: palabra o signo que combina condiciones: `AND`, `OR`, `NOT`.
- **Formas de palabra**: distintas terminaciones, como «casa» y «casas».

Idioma: un perfil estricto de la sintaxis de Apache Lucene: palabras, frases, Y/O/NO, grupos, campos, rangos, patrones limitados y expresiones regulares. "Estricto" significa que cualquier cosa que no sea compatible es un error, no una parte que se omite silenciosamente. [La ayuda completa](https://github.com/WireCatLabs/cli-core/blob/v0.212.0/docs/search/query-language.md) contiene tablas generadas de campos, operadores, ajustes preestablecidos y límites y ejemplos verificables; [La especificación técnica](https://github.com/WireCatLabs/cli-core/blob/v0.212.0/docs/search/query-language-spec.md) describe la gramática y el compilador.

`max` no busca en el correo: para eso está `memo search mail`.

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
| comparación | `size>10MB`, `date>=7d`, `date:>=7d` | un intervalo abierto; la forma con dos puntos significa lo mismo |
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
| `phone` | teléfono encontrado en el texto, como sea que esté escrito | `phone:"+34 600 000 000"` |
| `email` | dirección de correo encontrada en el texto | `email:"ana@example.com"` |
| `url` | enlace encontrado en el texto, sin parámetros de seguimiento | `url:"https://example.com/a"` |
| `domain` | sitio de un enlace o de una dirección encontrados en el texto | `domain:example.com` |
| `mentions` | persona, organización o documento a los que está vinculada la mención encontrada | `mentions:"person:12"` |

Los nombres de campo distinguen mayúsculas. Un campo, valor o combinación desconocidos son un error, nunca una respuesta vacía ni texto normal. Un nombre que el archivo local no conoce no se busca en MAX.

`kind:bot` selecciona un chat con un bot; `in:bots` selecciona los archivos de `max sales bot`. `topic:` requiere exactamente un chat en `chat:`: los números de tema se repiten entre chats. `filename`, `mime` y `size` coinciden con un mensaje si coincide al menos uno de sus archivos. MAX no indica los tipos de archivo, así que `mime:` no encuentra nada aquí: busca por extensión.

## Menciones

`max` encuentra en los mensajes guardados teléfonos, direcciones de correo, enlaces, documentos y nombres de personas.
Estos campos buscan los mensajes que los contienen. Los hallazgos en sí los muestra `max mentions list`.

```sh
max personal search messages 'phone:"+34 600 000 000"'
max personal search messages 'email:"ana@example.com" OR domain:example.com'
max personal search messages 'mentions:"person:12"'
```

Pon entre comillas el valor con `+` o `@`: ambos signos son operadores. Un teléfono se encuentra como sea que esté
escrito: `+34 600 000 000` y `600000000` son el mismo teléfono, y un número sin `+` se lee según los países del ajuste
`phone_countries`. `domain:` considera `docs.example.com` como el sitio `example.com`. En `mentions:` se escribe una
referencia a una persona, organización o documento; el campo encuentra los mensajes cuyas menciones vinculaste a ella
con `max mentions confirm`.

`max mentions list --new` muestra lo pendiente desde el último `--new`, y `max mentions domains`, los sitios a los que llevan los enlaces, los más frecuentes primero. `confirm` y `reject` con `--all-in-chat` resuelven un nombre en todo el chat a la vez.

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

## La respuesta

`--json` devuelve `{ items, page, next, missing, meta }`, aunque no haya coincidencias. `--jsonl` emite solo los mensajes, uno por línea.

- `missing`: lo que la búsqueda no vio y por qué: una entrada `coverage` si parte de los chats no se descargó o está atrasada, `text` mientras se construye el índice de palabras, `pictures` si el modelo de imágenes no está descargado.
- `next`: los comandos que lo corrigen (`messages.sync`, `store.migrate`, `models.download-image`) y `page.next`, la página siguiente con la misma consulta.
- `meta.accounts`: en qué cuentas se buscó.
- `page.has_more` se refiere a la página, no a si MAX tiene más.

Un error incluye la posición del problema en la consulta y una pista.

## A través de MCP

Mediante MCP, `max_read` (`command: "search messages"`) acepta la consulta como `text` o como árbol de sintaxis con versión en `ast`, nunca ambos; `timezone` elige la zona del calendario. `chat:` se escribe en la propia consulta; `source`, `newest`, `context` y `limit` corresponden a las opciones del comando. `saved` ejecuta una búsqueda guardada. `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` y `sync_first` corresponden a `--thread…` y `--sync-first`; `sync_first` requiere `messages.sync-first: allow`. Devuelve el mismo objeto que `--json`. `max_read` (`command: "stats messages show"`) cuenta las mismas consultas. `record: false` evita registrar la llamada en el historial.

## Más

- [Búsqueda de mensajes](./search.md): busca todos los días, búsquedas guardadas y contando.
- [Buscar por tema](./topic-search.md): encuentre una discusión por significado cuando no recuerde las palabras.
