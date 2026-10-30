---
title: "Contexto de una persona"
---

Usa esta página cuando quiera saber más sobre una persona: qué chats comparte, qué le escribieron a ti o en sus grupos, y sus propios nombres y notas sobre ella. Aprenderá a leer lo que contiene el almacén local sobre una persona, recopilar sus mensajes para obtener un resumen y mantener nombres y notas privados.

Algunas palabras en esta página:

- **El almacén local** es la copia de tus mensajes que `wa` guarda en esta computadora, completada por el historial del teléfono y por `serve`. Todo lo que aparece en esta página proviene de él, por lo que muestra solo lo que llegó.
- **Una persona** se nombra por su ID de WhatsApp o parte de su nombre. WhatsApp nombra a la mayoría de las personas mediante una identificación oculta que termina en `@lid` (`100000000000001@lid`), no por su número de teléfono. Cuando parte de un nombre coincide con más de una persona, el comando se detiene y las enumera; ejecútelo nuevamente con el id.

Los siguientes comandos agregan `--offline` donde el comando podría preguntar a WhatsApp: los mantiene en el almacén local, por lo que nunca se conectan ni funcionan mientras se ejecuta `serve`.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Ver una persona y los chats que comparte | `wa personal contacts show` |
| Lee lo que dijeron, en cada chat o en los chats que nombras | `wa personal contacts context` |
| Registra que una cuenta de WhatsApp y una cuenta de Telegram o MAX son una sola persona | `wa personal contacts link` |
| Mantén su propio nombre y notas para una persona | `wa personal contacts aliases`, `wa personal contacts notes` |

Cada opción de estos comandos se encuentra en la [referencia de comando](./commands.md).

## Quiénes son: `contacts show`

```sh
wa personal contacts show 100000000000001@lid --offline
wa personal contacts show 100000000000001@lid --offline --with-notes --json
```

Responde a la persona tal como la conoce el almacén local y los chats que compartes con ella. `--with-notes` agrega tus notas privadas. A la persona no se le dice que miraste.

## Lo que dijeron: `contacts context`

Sin `--chat`, brinda una descripción general del almacén local: los chats que comparte, el último mensaje en cada sentido, sus mensajes recientes en su chat individual y en grupos, y dónde otros los mencionaron. Nunca se conecta.

```sh
wa personal contacts context 100000000000001@lid
```

Con `--chat`, muestra los mensajes más recientes en cada chat que nombre, los más antiguos primero, 20 por chat:

```sh
wa personal contacts context 100000000000001@lid --chat 120363000000000001@g.us --limit 10 --offline
```

- Cada mensaje tiene sólo su hora y texto, por lo que un agente puede leer muchos de ellos a la vez. `-v` agrega la identificación del mensaje, el remitente y a qué responde; `-vv` da el mensaje completo.
- `more: true` significa que hay mensajes más antiguos que el límite; `complete: false` significa que el almacén local no retiene el chat desde su inicio, por lo que la respuesta es mínima. `messages sync` solicita al teléfono la parte más antigua ([historial anterior](./archive.md#older-history-from-your-phone)).

## Una persona en dos mensajeros: `contacts link`

WhatsApp, Telegram y MAX comparten un almacén local en esta computadora. Cuando sepas que una cuenta de WhatsApp y una cuenta de otro messenger son de la misma persona, regístralo:

```sh
wa personal contacts link 100000000000001@lid max:"Example User"
wa personal contacts unlink 100000000000001@lid
```

Después de eso, `contacts context` sin `--chat` reúne ambas cuentas. `contacts context --chat` todavía muestra solo la cuenta que nombraste. El enlace es sólo lo que registras: el mismo nombre en dos mensajeros nunca se toma como la misma persona.

## Sus propios nombres y notas: `contacts aliases`, `contacts notes`

```sh
wa personal contacts aliases set 100000000000001@lid Ana    # your own name for a person, on this computer only
wa personal contacts aliases remove 100000000000001@lid
wa personal contacts notes add 100000000000001@lid --text-file note.txt  # or the text from stdin
wa personal contacts notes list 100000000000001@lid
```

`contacts notes edit` y `contacts notes remove` toman la persona, luego la identificación de la nota, que muestra `notes list`.

Los alias y notas permanecen en el almacén local y nunca llegan a WhatsApp ni al teléfono de la persona. Un alias se aplica sólo en la cuenta que usas ahora; Se muestra una nota sobre una persona en cada perfil de esta computadora que la ve. Un comando busca a una persona por su alias a menos que coincida con el nombre de otra persona; entonces necesita la identificación. `--revision` detiene la edición de una nota que cambió desde que la leyó.

## Preguntar por WhatsApp sobre una persona

Estos se conectan; Mientras se ejecuta `serve`, pasan por la conexión de `serve`.

```sh
wa personal contacts show 100000000000001@lid        # their name, about line and whether they show a photo
wa personal contacts block 100000000000001@lid
wa personal contacts unblock 100000000000001@lid
wa personal contacts lookup < number.txt                # whether this number has WhatsApp, and its id
wa personal contacts sync                                # the phone's address book into the local store
```

Para `contacts lookup`, primero escriba el número a `number.txt`, en una línea, en formato internacional.

- `contacts show` no le dice nada a la persona. No muestra ningún número de teléfono, así que `--hide-phone` no cambia nada aquí. `--offline` responde solo desde el almacén local.
- `contacts lookup` lee el número desde la entrada estándar, nunca desde la línea de comando, y no le envía nada. Se necesita un número, como máximo uno cada 10 segundos para el perfil: muchas búsquedas seguidas son el motivo por el que WhatsApp prohíbe los scrapers.
- WhatsApp mantiene su libreta de direcciones en el teléfono, por lo que se rechazan `contacts add`, `remove`, `rename` y `import`.

## Siguiente paso

Para ver qué está haciendo todo un grupo y quién espera una respuesta allí, lea [grupos](./groups.md). Un agente de IA puede ejecutar todos los comandos de esta página por ti; para conectar uno, consulte [el servidor MCP](./mcp.md).
