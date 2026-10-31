---
title: "Buscar mensajes"
---

Necesitas encontrar algo que estuvo escrito: un mensaje, un acuerdo, una dirección de hace meses. Esta página muestra cómo buscar todo lo que `wa` ha guardado en esta computadora: mensajes de WhatsApp y las notas que [memo](https://github.com/WireCatLabs/cli-memo) importó.

Después de leerlo, puedes encontrar mensajes por palabras, personas, chats y fechas, guardar una búsqueda y ejecutarla nuevamente, contar coincidencias y distinguir un "no encontrado" real de un espacio en el historial guardado. Al buscar nunca se conecta a WhatsApp y no marca nada leído.

Términos utilizados en esta página:

- **Almacenamiento local** (también llamado archivo): la base de datos en esta computadora donde `wa` guarda cada mensaje que el teléfono envió y recibió `serve` ([el almacén local](./archive.md)). Cada búsqueda lee sólo esto.
- **Consulta**: lo que buscas. Pueden ser palabras simples o palabras con campos como `from:` y `date:`. Su agente de IA escribe consultas por ti; el idioma completo se encuentra en la [referencia del idioma de consulta](./query-language.md).
- **Cobertura**: qué se pudo ver en una búsqueda: cuántos chats y mensajes se guardaron.

## Cuando recuerdas la pregunta en lugar de su redacción

Pídale a tu agente que busque mensajes que respondan una pregunta y le muestre los mensajes de apoyo. Por ejemplo: "Busque cuándo se ejecuta la exportación diaria de Helix en el chat del proyecto y verifique si el cronograma cambió". El agente puede utilizar el descubrimiento de archivos para encontrar coincidencias parciales de palabras y respuestas directas, y luego inspeccionar esos mensajes antes de responder. No descarga un modelo.

Para control de línea de comando:

```sh
wa personal search messages 'What time does Helix export run? chat:120363000000000001@g.us' --discover --json
```

Se siguen aplicando filtros de chat, remitente y fecha. A través de MCP, pase `discover: true` a `wa_read` (`command: "search messages"`). El `discovery` de cada elemento indica qué parte de la consulta coincidió: `missing_terms` nombra términos no coincidentes y `parent` vincula una respuesta a su elemento principal coincidente. Una puntuación alta no implica confianza en la respuesta: una pregunta, propuesta o decisión anterior puede ocupar el primer lugar. Lee la evidencia y verifique [lo que contiene el almacén local](./archive.md#how-much-is-kept) antes de concluir que falta un hecho.

Sin `--discover`, se mantiene la estricta búsqueda habitual. La sintaxis booleana, las frases entre comillas, los comodines, `--exact` y `--newest` mantienen un comportamiento estricto.

## Qué puedes hacer

Cada búsqueda se realiza bajo un grupo de comandos, `wa personal search`. Cuando no sepa dónde se escribió algo, comience con `search all`.

| Tarea | Comando |
|---|---|
| Busca mensajes y notas en una sola respuesta | `wa personal search all '<query>'` |
| Buscar solo mensajes de WhatsApp | `wa personal search messages '<query>'` |
| Buscar correo | notas: instale @wirecat/cli-memo, luego `memo search mail '<query>'` |
| Buscar notas escritas en memo o importadas desde una carpeta | `wa personal search notes '<query>'` |
| Contar coincidencias por chat, remitente, día u hora | `wa personal stats messages show '<query>'` |
| Guarde una búsqueda y ejecútela nuevamente más tarde | `wa personal searches create`, `wa personal search messages --saved <name>` |

```sh
wa personal search all 'lease agreement'          # messages and notes, best match first
```

```sh
wa personal search all 'lease' --only notes       # notes only
```

```sh
wa personal search messages 'lease chat:"Book club"'  # WhatsApp messages only, never mail
```

```sh
wa personal search notes 'budget source:internal'  # only notes written in memo
```

`search all` dice qué es cada visita: un mensaje (`msg:…`) o una nota (`note:…`). `wa` nunca busca correo: `memo search mail` sí. Cuando un campo no se aplica (`chat:`/`from:` para notas), `search all` omite ese recurso y explica por qué. El correo y las notas llegan a el almacén local mediante memo: `memo sync --mail` y `memo import`. Sin ellos, `search all` busca únicamente mensajes.

Las notas coinciden con cualquier parte de una palabra, en cualquier caso de letra, y también se buscan sus títulos. Una búsqueda de uno o dos caracteres se rechaza con "search needs at least three characters".

El resto de esta página trata sobre la búsqueda de mensajes, `wa personal search messages`.

## Pruebe una búsqueda enfocada

Comienza con una frase y un chat.

**Tu petición:**

> Busque el mensaje que dice "factura pagada" en el Club de lectura. Muestra el partido y cualquier laguna en el historial.

**Comando:**

```sh
wa personal search messages '"invoice paid" chat:"Book club"' --json
```

**Ejemplo de respuesta del agente:**

> **Un mensaje coincidente en el historial guardado.**
>
> 

| Persona | Mensaje |
> 

| --- | --- |
> 

| Alicia Sintética | Factura pagada ayer. |
>
> La tienda mantiene este chat solo desde que se vinculó el dispositivo. Puedo abrir este mensaje y sus alrededores.
> conversación.

Un resultado vacío no es prueba de que el mensaje nunca existió. Los ejemplos de esta página son ficticios.

## Qué puede responder el almacén local

La búsqueda solo ve lo que contiene el almacén local: el historial que el teléfono envió cuando se vinculó el dispositivo, lo que recibió `serve` mientras se ejecutaba y los mensajes más antiguos que `messages sync` le pidió al teléfono ([historial anterior](./archive.md#older-history-from-your-phone)). No se puede llenar un espacio entre el envío del historial y el día en que comenzó `serve`. Mantén actualizada el almacén local con `wa personal server install` ([manteniéndola actualizada](./archive.md#keeping-it-current-serve)).

Cada búsqueda dice lo que buscó. Con `--json`, `coverage` lleva el número de `messages` y `chats` buscados. Coloque la consulta entre comillas simples, de modo que el shell deje las comillas y los corchetes como están. Los nombres siguientes son ejemplos; Usa tus propios chats y personas.

## Palabras y frases

```sh
wa personal search messages invoice
```

```sh
wa personal search messages '"invoice paid"'     # words together
```

```sh
wa personal search messages 'cafe OR library'
```

```sh
wa personal search messages '(cafe OR library) NOT loud'
```

```sh
wa personal search messages 'invoic*'            # every word that starts with "invoic"
```

Todas las palabras una al lado de la otra deben estar en el mensaje. La búsqueda incluye formas de palabras, según la configuración de idioma del almacén local: `piso` puede encontrar `pisos`. Las citas mantienen unidas las palabras y también permiten formas de palabras. Usa `exact:piso` o agregue `--exact` para palabras sin un campo explícito. Un `text:` explícito todavía coincide con los formularios. Se ignoran las mayúsculas y las tildes. El texto del mensaje escrito no se corrige por errores tipográficos.

Palabras desnudas y `transcript:` también buscan transcripciones de notas de voz guardadas, incluidas formas de palabras y ortografías de palabras individuales que el reconocimiento de voz puede haber alterado. `text:` busca únicamente texto escrito; `exact:` o `--exact` para palabras simples mantiene esas palabras exactas sin ampliar la ortografía de la transcripción.

## Personas y chats

```sh
wa personal search messages 'from:"Alice Synthetic" invoice'
```

```sh
wa personal search messages 'from:("Alice Synthetic" OR "Bob Synthetic") library'
```

```sh
wa personal search messages 'from:me date:7d'    # what you wrote this week
```

```sh
wa personal search messages 'chat:"Book club" library'
```

```sh
wa personal search messages 'chat:120363000000000001@g.us library'  # a chat by its id
```

```sh
wa personal search messages 'passport kind:private'  # one-to-one chats only
```

En WhatsApp, `kind:private` es un chat uno a uno, `kind:group` un grupo, `kind:saved` el chat contigo mismo y `kind:channel` un canal de WhatsApp. La identificación de una persona suele ser `…@lid`, la de un grupo `…@g.us`. Para buscar todas las cuentas en el almacén local, agregue `--source all`.

## Fechas

```sh
wa personal search messages 'date:today'
```

```sh
wa personal search messages 'library date:yesterday'
```

```sh
wa personal search messages 'invoice date:7d'    # from 7 days ago until now; also 30m, 2h
```

```sh
wa personal search messages 'invoice date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid
```

`today`, `yesterday` y las fechas del calendario son días en la zona horaria de tu ordenador; `--timezone` elige otro. En un rango, `[` y `]` incluyen ese día, `{` y `}` lo excluyen.

## Enlaces, teléfonos y direcciones

```sh
wa personal search messages 'has:link AND "github.com"'  # a link to a site
```

```sh
wa personal search messages 'domain:docs.google.com'
```

Un enlace cuenta cuando está en el texto. Para encontrar un teléfono, una dirección de correo electrónico, un sitio de enlace o una persona confirmada mencionada en el texto, utilice `phone:`, `email:`, `url:`, `domain:` y `mentions:`; ver [Menciones](./query-language.md#mentions).

## Archivos

```sh
wa personal search messages 'has:file chat:"Book club"'
wa personal search messages 'filename:agenda.pdf'
wa personal search messages 'mime:"application/pdf"'
wa personal search messages 'content:"reading list"'
```

El almacén mantiene el nombre, tamaño y tipo de cada archivo, por lo que `has:file`, `filename:` y `mime:` trabajan en cada mensaje almacenado desde que `wa` manejó los archivos. `content:` encuentra el texto dentro de un archivo una vez que se lee ese texto ([leer el texto de los archivos](./attachments.md#read-the-text-of-files)).

## Contraseñas, códigos y tarjetas

```sh
wa personal search messages 'preset:secret kind:saved'  # something that looks like a password or token
```

```sh
wa personal search messages 'preset:card'
```

Un ajuste preestablecido encuentra mensajes que *parecen* una contraseña, un código de inicio de sesión, una clave API, una tarjeta o número IBAN, un pasaporte, un teléfono, un correo electrónico o un enlace. Sólo comprueba la forma: no prueba que una contraseña funcione o que una tarjeta sea real. La lista completa está en [lenguaje de consulta](./query-language.md#presets).

## Etiquetas

```sh
wa personal tags add work --chat "Book club"
```

```sh
wa personal tags add work --contact 100000000000001@lid
```

```sh
wa personal tags list tag:work type:chat
```

```sh
wa personal search messages 'tag:work invoice'
```

```sh
wa personal search messages 'invoice NOT tag:work'
```

```sh
wa personal tags remove work --chat "Book club"
```

Una etiqueta es tu propia etiqueta en un chat, una persona, un mensaje (`--message <id> --chat <chat>`) o una tarea (`--task <id-or-key>`). Se guarda únicamente en el almacén local y nunca se envía a WhatsApp. `tag:work` encuentra mensajes etiquetados como `work`, mensajes en un chat etiquetados como `work` y mensajes de una persona etiquetada como `work`. Una etiqueta tiene entre 1 y 32 letras de la a a la z, dígitos y scripts.

Los grupos se pueden etiquetar automáticamente, a partir de su título y descripción, sin mensajes ni modelo:

```sh
wa personal metadata sync --chat "Book club"  # read the group's description from WhatsApp; the group is not changed
```

```sh
wa personal metadata sync --only-missing  # every stored group with no description read yet
```

```sh
wa personal tags rebuild --dry-run          # what it would tag, without writing
```

```sh
wa personal tags rebuild                    # write the automatic tags
```

`metadata show --chat "Book club"` muestra lo leído del almacén local. Los canales aún no se leen: un canal de la lista responde con un error propio y los demás continúan.

## Búsquedas guardadas e historial

```sh
wa personal searches create meetings 'library OR cafe' --chat "Book club"
```

```sh
wa personal search messages --saved meetings
```

```sh
wa personal search messages --saved meetings 'date:today'  # extra words are added with AND
```

```sh
wa personal stats messages show --saved meetings --by day
```

```sh
wa personal searches list
```

```sh
wa personal searches history --limit 10
```

```sh
wa personal search messages --saved 42           # a row of the history, by its number
```

`searches create` guarda una consulta con sus opciones y no ejecuta nada; un nombre existente necesita `--replace`. Las opciones que escribe con `--saved` reemplazan las guardadas. El texto guardado se lee nuevamente en cada ejecución, por lo que `date:7d` siempre significa los últimos 7 días. `searches show` imprime uno, `searches delete` elimina uno.

Cada búsqueda y recuento exitoso se escribe en el historial: la consulta y sus opciones, nunca los mensajes que encontró. Se conservan las 1.000 ejecuciones más recientes. `--no-record` mantiene una ejecución sin él. `searches clear` vacía el historial y mantiene las búsquedas guardadas. Este historial es independiente de los registros de ejecución de `wa personal runs`.

Las búsquedas guardadas y el historial viven en el almacén local que comparte cada CLI de WireCat: `tg` y `max` ven los mismos, y `delete` o `clear` en uno cambian los demás. Las etiquetas permanecen en tu cuenta.

## Contando: `stats messages show`

```sh
wa personal stats messages show invoice               # how many in each chat
```

```sh
wa personal stats messages show 'date:7d' --by sender
```

```sh
wa personal stats messages show 'from:me' --by day --timezone Europe/Madrid
```

```sh
wa personal stats messages show --by hour             # every stored message
```

`stats messages show` cuenta los mensajes que `search messages` encontraría con la misma consulta, cada uno una vez. `--by chat` (el valor predeterminado) y `--by sender` colocan el más grande primero; `--by day` y `--by hour` van en orden. Los números cuentan lo que contiene el almacén local, por lo que para un chat que se mantiene solo desde el enlace, son un límite inferior.

## Mensajes sobre un hit

`--newest` ordena por tiempo en lugar de por relevancia, y `--context 2` muestra dos mensajes antes y después de cada uno encontrado (2 en el terminal, 0 en caso contrario por defecto).`--thread` muestra la cadena de respuestas y las respuestas alrededor de cada visita en lugar de sus vecinos en el tiempo. Sigue los enlaces de respuesta guardados en el almacén local y en `messages context` también reemplaza a los vecinos a tiempo. Los valores predeterminados son 8 enlaces del hit, 50 mensajes, 65.536 bytes y un día en cada lado; cámbielos por `--thread-hops`, `--thread-messages`, `--thread-bytes` y `--thread-within`. Sin enlaces guardados, vuelve a los vecinos en el tiempo.

## Resultados como JSON

En una terminal `wa` imprime una transcripción legible. `--json` devuelve un objeto con los mensajes y lo buscado; `--jsonl` transmite solo los mensajes, uno por línea. Los campos de la respuesta se encuentran en la [referencia del lenguaje de consulta](./query-language.md#the-answer).

## Cuando no se encuentra nada

Una respuesta vacía significa "no en el almacén local", no "nunca enviada". Verifique lo que está almacenado con `wa personal store status`. Con `--json` la respuesta dice qué chats se buscaron, incluso cuando no hay nada que coincida. Si `wa` solicita `wa personal store migrate`, el índice de palabras aún se está construyendo; Las búsquedas sin palabras (`date:today`, `kind:group`) ya funcionan.

Un mensaje anterior a la vinculación del dispositivo, que el teléfono no envió, no está en el almacén local. `messages sync` solicita al teléfono los mensajes más antiguos de un chat ([historial anterior](./archive.md#older-history-from-your-phone)); De lo contrario búscalo por teléfono.

## Siguiente

- [Lenguaje de consulta](./query-language.md): cada campo, operador, límite y la respuesta JSON.
- [El almacén local](./archive.md): qué contiene y cómo mantenerla actualizada.
- [Cómo funciona la búsqueda](https://wirecat.dev/en/docs/search-architecture): la página técnica: el índice de palabras, el gráfico de conversación y cómo se clasifican los resultados.
