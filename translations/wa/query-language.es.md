---
title: "Lenguaje de consultas"
---

Si utilizas un agente de IA con `wa`, no necesitas aprender este lenguaje: describe lo que quieres con palabras sencillas y el agente escribe la consulta. Esta página es para personas que escriben búsquedas por sí mismas y para cualquiera que desee todos los filtros: operadores exactos, todos los campos, ajustes preestablecidos, reglas de fecha y límites.

Es la referencia para las consultas de `wa personal search messages`, `wa personal search all`, `wa personal stats messages show` y búsquedas guardadas. Para ejemplos cotidianos, comience con [búsqueda](./search.md).

Términos utilizados en esta página:

- **Consulta**: el texto que buscas, por ejemplo `invoice from:me date:7d`.
- **Campo**: un nombre y dos puntos que limitan una parte de la consulta a una propiedad de un mensaje, como `from:` (el remitente) o `date:` (cuando se envió). Las palabras sin campo buscan en el texto del mensaje.
- **Operador**: palabra o signo que une condiciones, como `AND`, `OR` y `NOT`.
- **Formas de palabras**: la misma palabra con diferentes terminaciones. `piso` y `pisos` son formas de una palabra.

El idioma es compartido por cada CLI de WireCat. Es un perfil estricto de la sintaxis de consulta de Apache Lucene: palabras, frases, Y/O/NO, grupos, campos, rangos, comodines acotados y expresiones regulares. "Estricto" significa que cualquier cosa que no admita es un error y nunca se ignora silenciosamente. La [referencia completa](https://github.com/WireCatLabs/cli-core/blob/main/docs/search/query-language.md) (en ruso) tiene las tablas generadas de campos, operadores, ajustes preestablecidos y límites, y ejemplos ejecutables.

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
| texto que parece una contraseña, una tarjeta o un teléfono | `preset:secret`, `preset:card` |
| tus propias etiquetas | `tag:work` |
| un patrón | `text:/pass(port)?/` |

Las palabras y frases sin campo coinciden con las formas de las palabras. `--exact` selecciona formas exactas para palabras sin campo; un `text:` explícito todavía coincide con los formularios. La configuración de idioma de la tienda decide qué formularios coinciden ([formularios de palabras](./archive.md#repair-and-index-maintenance)).

## Operadores

| Operador | Ejemplo | Significado |
|---|---|---|
| palabras | `invoice paid` | ambas palabras |
| frase | `"invoice paid"` | las palabras en este orden |
| `AND`, `&&` | `alpha AND beta` | ambos |
| `OR`, `\|\|` | `alpha OR beta` | ya sea |
| `NOT`, `!`, `-` | `alpha NOT beta` | el primero sin el segundo |
| `+` | `+alpha OR beta` | alfa requerida, beta opcional |
| grupo | `(alpha OR beta) gamma` | corchetes establecen el orden |
| grupo de campos | `from:(alice OR bob)` | el campo se aplica a cada valor |
| gama | `date:[2026-01-01 TO 2026-02-01}` | `[ ]` incluye, `{ }` excluye, `*` abre |
| comparación | `date>=7d`, `date:>=7d` | un campo abierto; la forma de dos puntos es la misma |
| comodín | `invo*`, `te?t` | `*` cualquier carácter, `?` uno |
| expresión regular | `text:/pass(port)?/` | una expresión regular de Lucene limitada |

`alpha OR beta gamma` significa `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` significa `alpha OR (beta AND gamma)`. Usa corchetes para mayor claridad. Las minúsculas `and`, `or`, `not` son palabras sencillas. Una consulta con solo `NOT` no encuentra nada: proporcione una condición positiva, por ejemplo `kind:group NOT preset:secret`. Fuzzy `~`, proximidad, impulsos e intervalos se rechazan con un error, no se ignoran. Los errores tipográficos no se corrigen: para detectar varias terminaciones, utilice un comodín como `invo*`.

## Campos

| Campo | Hallazgos | Ejemplo |
|---|---|---|
| `text` | palabras del mensaje (el campo predeterminado) | `text:invoice` |
| `exact` | la forma exacta de la palabra o frase | `exact:piso`, `exact:"invoice paid"` |
| `body` | todo el texto original, distinguiendo entre mayúsculas y minúsculas | `body:/.*invoice.*/` |
| `from` | el remitente, por nombre o id; `me` eres tú | `from:"Alice Synthetic"`, `from:"100000000000001@lid"` |
| `chat` | el chat, por nombre o id | `chat:"Book club"`, `chat:120363000000000001@g.us` |
| `date` | cuando fue enviado | `date:today`, `date:7d`, `date:[2026-01-01 TO 2026-02-01}` |
| `kind` | el tipo de chat: `private`, `group`, `channel`, `saved` y el resto compartido | `kind:private` |
| `has` | `link` y los tipos de archivos del idioma compartido | `has:link` |
| `in` | que cuentas: un proveedor | `in:whatsapp` |
| `preset` | texto con forma de secreto o de contacto | `preset:secret` |
| `tag` | tu propia etiqueta local en el mensaje, su chat o su remitente | `tag:work` |
| `phone` | un número de teléfono que se encuentra en el texto, como esté escrito | `phone:"<phone>"` |
| `email` | una dirección de correo electrónico encontrada en el texto | `email:"ana@example.com"` |
| `url` | un enlace encontrado en el texto, sin parámetros de seguimiento | `url:"https://example.com/a"` |
| `domain` | el sitio de un enlace o una dirección encontrada en el texto | `domain:example.com` |
| `mentions` | una persona, organización o documento al que está vinculada una mención encontrada | `mentions:"person:12"` |

Los nombres de los campos distinguen entre mayúsculas y minúsculas. Un campo, valor o combinación desconocidos es un error, nunca una respuesta vacía y nunca texto sin formato. Un nombre que el almacén local no conoce no se busca en WhatsApp.

En WhatsApp, `kind:private` es un chat uno a uno, `kind:group` un grupo, `kind:saved` el chat contigo mismo y `kind:channel` un canal de WhatsApp. Cite una identificación: `@` es un operador. Los campos de archivo (`content`, `filename`, `mime`, `size` y `has:` con `file`, `photo`, `voice` y otros tipos de archivos adjuntos) coinciden con los archivos de mensajes almacenados desde que se manejó `wa`. archivos; `content:` necesita leer primero el texto del archivo ([archivos adjuntos](./attachments.md)). `topic:` no tiene nada que igualar: WhatsApp no ​​tiene temas en el foro.

## Menciones

`wa` encuentra teléfonos, direcciones de correo electrónico, enlaces, documentos y nombres de personas en mensajes almacenados. Usa estos campos para encontrar los mensajes que los contienen. Los hallazgos en sí están listados como `wa personal mentions list`. Para buscar un teléfono, primero escriba el número a `number.txt`, en una línea.

```sh
wa personal search messages "phone:\"$(cat number.txt)\""
wa personal search messages 'email:"ana@example.com" OR domain:example.com'
wa personal search messages 'mentions:"person:12"'
```

En la tabla, `<phone>` representa el número: estas páginas no muestran ninguno real. Cite un valor que tenga `+` o `@`, ya que ambos son operadores. Se encuentra un teléfono como esté escrito: con o sin espacios, scripts y el código de país, es un teléfono, y se lee un número sin `+` con los países de la configuración `phone_countries`. `domain:` trata a `docs.example.com` como `example.com`. `mentions:` toma la referencia de una persona, una organización o un documento, y encuentra los mensajes cuyas menciones vinculaste con `wa personal mentions confirm`.

## Preajustes

Un ajuste preestablecido busca texto por su forma. Úselo para encontrar una contraseña, un código o un número de tarjeta que alguien envió.

| Preestablecido | Un candidato es |
|---|---|
| `password` | una etiqueta de contraseña seguida de un valor |
| `code` | una etiqueta con el código de verificación y entre 4 y 8 dígitos |
| `api-key` | una etiqueta de clave API y un valor |
| `secret` | una contraseña, secreto, token o etiqueta de clave API y un valor |
| `card` | 13 a 19 dígitos con espacios o scripts opcionales |
| `bank` | un valor en forma de IBAN |
| `passport` | un valor de pasaporte etiquetado o una forma rusa de 4+6 dígitos |
| `phone` | una forma de teléfono internacional con prefijo más |
| `email` | una forma de dirección de correo electrónico |
| `url` | un enlace HTTP(S) |
| `contact` | un archivo adjunto de contacto, o un correo electrónico o teléfono |
| `location` | un archivo adjunto de ubicación o un geo: enlace |

Un ajuste preestablecido informa a un candidato por su forma. No verifica una contraseña, una tarjeta o un documento, y puede coincidir con algo inofensivo. No elimine ni reenvíe mensajes automáticamente en su palabra.

## Fechas

`--timezone` toma una zona de la IANA como `Europe/Madrid`; sin él, la zona de la computadora se usa y se devuelve en la respuesta. Una fecha sin hora es un día calendario completo. Un día superior inclusivo incluye ese día completo, uno exclusivo lo excluye; un día en el que cambian los relojes puede durar 23 o 25 horas.

`date:today` y `date:yesterday` son días naturales. `date:7d` significa desde hace 7 días hasta ahora (también `30m`, `2h`); `date>=7d` y `date:[30d TO 7d}` funcionan en comparaciones y rangos, contados desde el momento en que se ejecuta la consulta. Se cita una hora exacta, con segundos y un desplazamiento: `date>="2026-01-01T10:00:00+02:00"`.

## Palabras, comodines y expresiones regulares

El texto se pliega antes de indexarlo y buscarlo: minúsculas, sin acentos. Un efecto secundario: algunas palabras diferentes se vuelven iguales, como `año` y `ano`. `text:` Las expresiones regulares y los comodines se pliegan de la misma manera.

`text:/pay/` coincide con la palabra pago completa, no pago. `body:/pay/` coincide sólo con un mensaje cuyo texto completo es pago, distingue entre mayúsculas y minúsculas; para encontrarlo en cualquier lugar utilice `body:/.*pay.*/`. Esta es la sintaxis de expresión regular de Lucene, sin búsquedas de JavaScript, referencias inversas, anclajes o banderas.

En una tienda grande, un prefijo corto como `a*` puede ampliarse a más de 10.000 palabras y se rechaza; alargarlo. Las consultas largas, el anidamiento profundo, los patrones grandes y los escaneos lentos se rechazan con `validation_error`, motivo `query.too-large`, no se acorta: limita el chat, las fechas o el patrón.

## La respuesta

`--json` devuelve `{ items, page: { limit, has_more }, next?, missing?, meta }`, incluso cuando no hay nada que coincida. `--jsonl` transmite solo los elementos.

- `items`: los éxitos, los mejores primero (o los más nuevos primero con `--newest`), cada uno con su `ref` (`msg:…`), `timestamp`,
  `sender_name`, `excerpt` y `matched_in`.
- `meta.accounts`: qué cuentas se buscaron.
- `missing`: lo que la respuesta no pudo ver, cada uno con el paso que lo llena. `text` significa que el índice de palabras aún se está creando (paso `store.migrate`, `wa personal store migrate`).
- `next`: los pasos a ejecutar. `page.next` repite la consulta para la página siguiente.
- `page.has_more` se trata de la página, no de si el teléfono tiene capacidad para más.

Un error conlleva la posición del problema en la consulta y una pista.

## Sobre MCP

Cuando un agente busca en el servidor MCP de `wa`, `wa_read` (`command: "search messages"`) toma la consulta como `query` y `timezone` para la zona del calendario. `chat` toma una identificación o un nombre almacenado; `source`, `newest`, `context` y `limit` funcionan como lo hacen las opciones de comando; `saved` ejecuta una búsqueda guardada. `thread`, `thread_hops`, `thread_messages`, `thread_bytes` y `thread_within` coinciden con las opciones `--thread…`. La respuesta tiene los mismos campos que `--json`. `wa_read` (`command: "stats messages show"`) cuenta las mismas consultas. `wa personal mcp --no-record`, o `record` configurado en `false`, mantiene las llamadas del servidor fuera del historial de consultas ([MCP](./mcp.md)).

## Siguiente

- [Buscar](./search.md): búsquedas diarias, búsquedas guardadas y conteo.
- [El almacén local](./archive.md): qué contiene el almacén local y por qué es posible que una búsqueda no muestre un mensaje.
