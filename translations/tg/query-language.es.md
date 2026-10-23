---
title: "Lenguaje de consulta de la búsqueda"
---

<a id="en-mcp" />
<a id="los-modos-anteriores" />
<a id="in-mcp" />
<a id="the-older-modes" />

Si utilizas un agente de IA con tg, no necesitas aprender este lenguaje: describe lo que quieres con palabras sencillas y el agente escribe la consulta. Esta página es para personas que escriben búsquedas por sí mismas y para cualquiera que desee todos los filtros: operadores exactos, todos los campos, ajustes preestablecidos, reglas de fecha y límites.

Es la referencia para las consultas de `tg personal search messages`, `tg personal search all`, `tg personal stats messages show`, búsquedas guardadas y el `--filter` de [búsqueda de tema](./topic-search.md). Para ejemplos cotidianos, comience con [búsqueda de mensajes](./search.md).

Términos utilizados en esta página:

- **Consulta**: el texto que buscas, por ejemplo `invoice from:me date:7d`.
- **Campo**: un nombre y dos puntos que limitan una parte de la consulta a una propiedad de un mensaje, como `from:` (el remitente) o `date:` (cuando se envió). Las palabras sin campo buscan en el texto del mensaje.
- **Operador**: palabra o signo que une condiciones, como `AND`, `OR` y `NOT`.
- **Formas de palabras**: la misma palabra con diferentes terminaciones. `piso` y `pisos` son formas de una palabra.

El lenguaje es un perfil estricto de la sintaxis de consulta de Apache Lucene: palabras, frases, Y/O/NO, grupos, campos, rangos, comodines acotados y expresiones regulares. "Estricto" significa que cualquier cosa que no admita es un error y nunca se ignora silenciosamente. La [referencia completa](https://github.com/WireCatLabs/cli-core/blob/v0.350.0/docs/search/query-language.md) (por ahora solo en ruso) tiene las tablas generadas de campos, operadores, ajustes preestablecidos y límites, y ejemplos ejecutables; la [especificación técnica](https://github.com/WireCatLabs/cli-core/blob/v0.350.0/docs/search/query-language-spec.md) describe la gramática y el compilador.

En el correo, `chat:` selecciona una cadena de correos por id o asunto; `from:` selecciona el remitente. El correo no tiene `kind:` ni `topic:`.

## Qué puede hacer

| Quieres | Escribir |
|---|---|
| mensajes con todas estas palabras, en cualquier forma | `invoice paid` |
| estas palabras juntas, en este orden | `"invoice paid"` |
| una palabra u otra, sin tercera | `(cafe OR library) NOT loud` |
| sólo esta forma exacta de una palabra | `exact:piso` o `--exact` para cada palabra sin campo |
| palabras que empiezan con algo | `invo*` |
| un remitente, un chat, una especie de chat | `from:me`, `chat:"Book club"`, `kind:private` |
| un período | `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| archivos por nombre, tipo o tamaño | `filename:*.pdf`, `mime:image`, `size>10MB` |
| texto que parece una contraseña, una tarjeta o un teléfono | `preset:secret`, `preset:card` |
| tus propias etiquetas | `tag:work` |
| un patrón | `text:/pass(port)?/` |

Las palabras y frases sin campo coinciden con las formas de las palabras. `--exact` selecciona formas exactas para palabras sin campo; un `text:` explícito sigue buscando formas de palabra. La configuración de idioma del archivo local decide qué formas coinciden ([formas de palabra](./archive.md#repair-and-index-maintenance)).

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
| comparación | `size>10MB`, `date>=7d`, `date:>=7d` | un intervalo abierto; la forma con dos puntos es equivalente |
| comodín | `invo*`, `te?t` | `*` cualquier número de caracteres, `?` uno |
| expresión regular | `text:/pass(port)?/` | una expresión regular de Lucene con límites |

`alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` significa `alpha OR (beta AND gamma)`. Usa paréntesis para dejar claro el orden. Las minúsculas `and`, `or`, `not` son palabras sencillas. Una consulta con solo `NOT` no encuentra nada: proporcione una condición positiva, por ejemplo `kind:group NOT preset:secret`. La búsqueda difusa `~`, la proximidad, los pesos y los intervalos se rechazan con un error, no se ignoran. Los errores tipográficos no se corrigen: para detectar varias terminaciones, utilice un comodín como `invo*`.

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
| `phone` | un número de teléfono en el texto, escrito de cualquier forma | `phone:"+34 600 000 000"` |
| `email` | una dirección de correo en el texto | `email:ana@example.com` |
| `url` | un enlace en el texto, sin parámetros de seguimiento | `url:"https://example.com/a"` |
| `domain` | el sitio de un enlace o de una dirección en el texto | `domain:example.com` |
| `mentions` | una persona, organización o documento al que vinculaste una mención encontrada | `mentions:"person:12"` |

Los nombres de los campos distinguen entre mayúsculas y minúsculas. Un campo, valor o combinación desconocidos es un error, nunca una respuesta vacía y nunca texto sin formato. Un nombre que el archivo local no conoce no se busca en Telegram.

`kind:bot` selecciona un chat con un bot; `in:bots` selecciona los archivos de las cuentas de `tg personal bot`. `topic:` necesita exactamente un chat en `chat:`, porque los números de tema se repiten entre grupos. `filename`, `mime` y `size` coinciden con un mensaje cuando al menos uno de sus archivos coincide. `/` inicia una expresión regular, así que pon un tipo completo entre comillas: `mime:"application/pdf"`.

## Menciones

`tg` encuentra teléfonos, direcciones de correo, enlaces, documentos y nombres de personas en los mensajes
guardados. Usa estos campos para encontrar los mensajes que los contienen. Los hallazgos en sí los lista
`tg personal mentions list`.

```sh
tg personal search messages 'phone:"+34 600 000 000"'
tg personal search messages 'email:ana@example.com OR domain:example.com'
tg personal search messages 'mentions:"person:12"'
```

Pon entre comillas un valor con `+` o `@`, porque ambos son operadores. Un teléfono se encuentra se escriba
como se escriba: `+34 600 000 000` y `600000000` son un mismo teléfono, y un número sin `+` se lee con los
países del ajuste `phone_countries`. `domain:` trata `docs.example.com` como `example.com`. `mentions:` toma la
referencia de una persona, una organización o un documento, y encuentra los mensajes cuyas menciones
vinculaste con ella mediante `tg mentions confirm`.

## Filtros preparados

Un ajuste preestablecido busca texto por su forma. Úselo para encontrar una contraseña, un código o un número de tarjeta que alguien envió.

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

En un archivo grande, un prefijo corto como `a*` puede ampliarse a más de 10.000 palabras y se rechaza; alargarlo. Las consultas largas, el anidamiento profundo, los patrones grandes y los escaneos lentos se rechazan con `query_limit`, no se acortan: limita el chat, las fechas o el patrón.

## La respuesta

`--json` devuelve `{ items, page: { limit, has_more }, next?, missing?, meta }`, aunque no haya coincidencias.
`--jsonl` emite solo los elementos.

- `items`: los resultados, los mejores primero (o los más nuevos primero con `--newest`), cada uno con su `ref` (`msg:…`), `timestamp`,
  `sender_name`, `excerpt` y `matched_in`.
- `meta.accounts`: qué cuentas se buscaron.
- `missing`: lo que la respuesta no pudo ver, cada cosa con el paso que lo completa. `coverage` significa que algunos chats del alcance
  nunca se descargaron o que la descarga previa a la búsqueda se detuvo antes de tiempo (paso `messages.sync`); `text` significa que el índice
  de palabras aún se está construyendo (paso `store.migrate`, `tg personal store migrate`).
- `next`: los pasos que hay que ejecutar. `page.next` repite la consulta para la página siguiente.
- `page.has_more` se refiere a la página, no a si Telegram tiene más.

Un error incluye la posición del problema en la consulta y una pista.

## Sobre MCP

Cuando un agente busca en el servidor MCP de tg, `tg_read` (`command: "search messages"`) toma la consulta en `query`, y `timezone` para la zona del calendario. `chat` toma una identificación o un nombre almacenado; `source`, `newest`, `context` y `limit` funcionan como lo hacen las opciones del comando; `saved` ejecuta una búsqueda guardada. `thread`, `thread_hops`, `thread_messages`, `thread_bytes`, `thread_within` y `sync_first` coinciden con las opciones `--thread…` y `--sync-first`; `sync_first` se ofrece únicamente con `messages.sync-first: allow`. La respuesta tiene los mismos campos que `--json`. `tg_read` (`command: "stats messages show"`) cuenta las mismas consultas. El historial de consultas sigue al servidor: `tg personal mcp --no-record`, o `record` configurado en `false`, mantiene sus llamadas fuera.

## Próximo

- [Búsqueda de mensajes](./search.md): búsquedas diarias, búsquedas guardadas y conteo.
- [Búsqueda de tema](./topic-search.md): busca una discusión por su significado cuando no conoces sus palabras.
