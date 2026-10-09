---
title: "Personas: perfiles, mensajes y comprobación de bots"
---

<a id="para-agentes" />
<a id="для-агентов" />

Esta página es necesaria cuando desea obtener más información sobre una persona: quién es, qué le escribió a usted o en sus grupos, y si su cuenta parece un bot o un spammer. Aprenderá cómo mirar el perfil de una persona, recopilar sus mensajes para volver a contarlos, verificar una cuenta antes de confiar en ella y conservar sus nombres y notas sobre las personas.

Unas palabras que aparecerán a continuación:

- **Archivo local**: mensajes que `max` almacena en esta computadora. Los números y mensajes de esta página están tomados de ella, por lo que solo muestran lo que se ha descargado.
- **Perfil** esto es lo que MAX informa sobre una persona: nombre, descripción, foto, marcas. Este no es el perfil de inicio de sesión de `max`.
- **Persona** se indica por su id o parte de su nombre. Si parte del nombre coincide con más de una persona, el comando se detiene y las enumera; repítelo con id.

## ¿Qué se puede hacer?

|Tarea|Comando|
| --- | --- |
|Descubra quién es y dónde se corresponde con él.| `max contacts profile` |
|Lea lo que escribió en todos los chats o en los nombrados.| `max contacts context` |
|Comprueba si la cuenta parece un bot, una falsificación o un spammer| `max contacts check` |
|Comprueba los miembros del grupo más sospechosos| `max chats members audit --deep` |
|Anota que la cuenta MAX y la cuenta Telegram son la misma persona| `max contacts link` |
|Guarde su nombre y notas sobre la persona.| `max contacts alias`, `max contacts notes` |

Todas las opciones para estos comandos están en [referencia de comandos para contactos](./commands.md#max-contacts).

## Quién es: `contacts profile`

```sh
max contacts profile 20000002
max contacts profile 20000002 --json
```

El comando muestra lo que MAX informa sobre la persona y cuántos mensajes suyos están guardados localmente en cada chat compartido:

```json
{
  "id": "20000002",
  "name": "Пример Примеров",
  "usernames": [],
  "bio": "Книги и велосипед",
  "phone": "***0123",
  "flags": { "bot": false },
  "registered": { "at": "2021-03-14T00:00:00.000Z", "source": "max", "precision": "day" },
  "hasPhoto": true,
  "seen": "2026-10-08T07:12:00.000Z",
  "chats": [
    { "id": "30000003", "title": "Пример Примеров", "kind": "dialog", "theirMessages": 128,
      "firstAt": "2024-02-11T09:14:00.000Z", "lastAt": "2026-10-05T18:02:00.000Z", "complete": true },
    { "id": "-40000004", "title": "Книжный клуб", "kind": "group", "theirMessages": 37,
      "firstAt": "2025-06-01T10:00:00.000Z", "lastAt": "2026-09-30T20:41:00.000Z", "complete": false }
  ],
  "aliases": [
    { "name": "Пример П.", "firstSeenAt": "2024-03-02T08:00:00.000Z",
      "lastSeenAt": "2024-03-02T08:00:00.000Z", "source": "profile" }
  ]
}
```

- **`registered`**: la fecha de creación de la cuenta según el propio MAX (`source: max`). No es una estimación.
- **`flags`**: `bot: true` identifica un bot. MAX no proporciona marcas de estafador o verificado para cuentas personales.
- **`hasPhoto`**: si la persona tiene foto de perfil.
- **`seen`**: cuándo estuvo la persona en MAX por última vez, o `online`. Se consulta MAX aparte en cada llamada; el campo no aparece si MAX no comunica presencia.
- **`phone`**: solo los últimos cuatro dígitos, y únicamente si MAX te muestra el número. `--show-phone` imprime el número completo. La herramienta MCP siempre lo oculta.
- **`chats`**: todos los chats compartidos y cualquier otro chat donde el archivo local contenga mensajes de esa persona.
- **`aliases`**: nombres anteriores observados por el archivo local, del más antiguo al más reciente. `source: profile` indica que el nombre cambió mientras la copia lo seguía; `source: messages` indica un nombre encontrado en mensajes guardados. Este último es aproximado: al descargar de nuevo un mensaje, lleva el nombre actual. Está vacío hasta que el archivo local observe un cambio de nombre.

El comando realiza una solicitud adicional a MAX respecto a `contacts show` y no avisa a la persona. Con `--offline`, prepara la respuesta a partir de el archivo local.

### Los recuentos describen la copia guardada

`theirMessages`, `firstAt` y `lastAt` se calculan a partir de el archivo local, no se solicitan a MAX. Si `complete: false`, el chat no está guardado desde el principio: el recuento es un mínimo y `firstAt` puede ser posterior al primer mensaje real de esa persona. Descarga el chat para completarlo:

```sh
max store fetch "Книжный клуб"
```

## Qué escribió: `contacts context`

Sin `--chat`, el comando prepara un resumen de el archivo local: chats compartidos, el último mensaje en cada dirección, mensajes recientes de la persona en el chat privado y en grupos donde otros la mencionaron. No se conecta a MAX ni marca nada como leído.

```sh
max contacts context 20000002
```

Con `--chat`, muestra los últimos mensajes de la persona en cada chat indicado, del más antiguo al más reciente, 20 por chat:

```sh
max contacts context 20000002 --chat "Книжный клуб" --chat "Работа" --limit 10
max contacts context 20000002 --chat "Книжный клуб" --refresh
```

```json
{
  "person": { "uid": "p_7", "provider": "max", "id": "20000002", "name": "Пример Примеров" },
  "chats": [
    {
      "chat": { "id": "-40000004", "title": "Книжный клуб", "kind": "group" },
      "messages": [
        { "at": "2026-09-29T19:02:00.000Z", "text": "Следующим берём сборник рассказов" },
        { "at": "2026-09-30T20:41:00.000Z", "text": "В четверг могу у себя" }
      ],
      "complete": false,
      "more": true
    }
  ],
  "limits": { "messages": 10 }
}
```

- De forma predeterminada, los mensajes solo incluyen fecha y texto para que un agente pueda leer muchos a la vez. `-v` añade el ID, el enlace, el remitente y a qué mensaje responde; `-vv` añade todo.
- `--refresh` obtiene primero de MAX la última página de cada chat y selecciona de ella los mensajes de la persona: MAX no puede buscar por remitente. Sin `--refresh`, los resultados proceden de el archivo local.
- `more: true` indica que hay mensajes más antiguos que los incluidos por el límite; `complete: false` indica que el archivo local no contiene el chat desde el principio.
- Un mensaje de voz incluye `transcript` cuando se ha transcrito.

## Bot, cuenta falsa o spam: `contacts check`

```sh
max contacts check 20000002
```

```json
{
  "person": { "id": "20000002", "name": "Пример Примеров", "username": null, "provider": "max" },
  "score": 3,
  "reasons": [
    { "reason": "no_bio", "weight": 1, "source": "messenger" },
    { "reason": "link_first", "weight": 2, "source": "store" }
  ],
  "registries": [
    { "name": "cas", "answer": "unknown", "checkedAt": "2026-10-07T08:00:00.000Z",
      "detail": "lists Telegram accounts only, not max" },
    { "name": "lols", "answer": "unknown", "checkedAt": "2026-10-07T08:00:00.000Z",
      "detail": "lists Telegram accounts only, not max" }
  ],
  "unknown": [],
  "checkedAt": "2026-10-07T08:00:00.000Z"
}
```

La puntuación suma los pesos de los motivos detectados. Es una pista, no una conclusión: muchas personas reales no tienen foto o descripción, por lo que esos motivos pesan poco.

| Motivo | Peso | Significado |
|---|---|---|
| `new_account` | 2 | Cuenta creada hace menos de 30 días, según la fecha de MAX |
| `link_first` | 2 | Su primer mensaje guardado es un enlace |
| `same_text` | 2 | El mismo texto en varios chats |
| `no_photo`, `no_username`, `no_bio` | 1 | El perfil carece de esa información |
| `odd_name` | 1 | Sin nombre, una larga secuencia de dígitos o un enlace en el nombre |
| `never_wrote` | 1 | El archivo local no contiene ningún mensaje suyo |
| `deleted` | 1 | La cuenta está eliminada |

`unknown` enumera las señales que no se pudieron evaluar. Una puntuación baja con una lista `unknown` larga dice poco.

### Qué sale de tu ordenador

Nada. Las listas públicas de spam (Combot CAS y lols.bot) solo cubren cuentas de Telegram, por lo que `max` no las consulta y las marca como `unknown`. No se envía el ID de la persona a ningún sitio. `--offline` solo lee los datos guardados.

## Miembros del grupo: `chats members audit --deep`

```sh
max chats members audit "Книжный клуб"
max chats members audit "Книжный клуб" --deep 10
```

`chats members audit` evalúa a todos los miembros con la lista de miembros y el archivo local, sin una solicitud independiente por persona, y muestra a quienes tengan algún motivo, de mayor a menor puntuación. Después, `--deep 10` ejecuta una comprobación completa de `contacts check` para las diez personas con mayor puntuación, una por segundo. No elimina a nadie; se excluyen el propietario y los administradores.

<a id="una-persona-en-dos-mensajeros-contacts-link" />

## Una persona en dos servicios de mensajería: `contacts link`

`max` y `tg` en el mismo ordenador usan una archivo local compartida. Si sabes que una cuenta de MAX y una de Telegram pertenecen a la misma persona, registra el vínculo:

```sh
max contacts link 20000002 telegram:1000001
max contacts unlink 20000002
```

Luego de esto, `contacts context` sin `--chat` recopila ambas cuentas: chats generales y mensajes de MAX y de Telegram. `contacts profile` y `contacts context --chat` todavía solo muestran la cuenta que nombraste. La conexión es solo lo que anotaste: el mismo nombre en dos servicios de mensajería nunca se considera una sola persona. Esta entrada no cambia la libreta de direcciones MAX.

## Sus nombres y notas: `contacts alias`, `contacts notes`

```sh
max contacts alias set "Борис Пример" Боря            # ваше имя для человека, только на этом компьютере
max contacts alias rm "Борис Пример"
max contacts notes add "Борис Пример" --file note.txt  # или текст из stdin
max contacts notes list "Борис Пример"
max contacts notes edit "Борис Пример" <id> --revision 1 --file note.txt
max contacts notes remove "Борис Пример" <id>
max contacts show "Борис Пример" --with-notes
max contacts list --search-notes квартира             # люди, в чьих заметках есть этот текст
```

Los apodos y las notas se guardan en una archivo local y nunca van a MAX. El apodo es válido sólo en la cuenta con la que estás trabajando; una nota sobre una persona es visible en cada perfil de inicio de sesión `max` en esa computadora donde aparece esa persona. `contacts rename` cambia el nombre en la libreta de direcciones MAX, eso es diferente. El comando busca una persona que usa su apodo si el apodo no coincide con el nombre de otra persona; de lo contrario necesitas una identificación. `--revision` no le permite cambiar una nota si se cambió después de leerla.

## ¿Qué sigue?

Para ver qué está sucediendo en todo el grupo y quién está esperando una respuesta allí, abra [grupos que usted lidera](./groups.md). Todos los comandos de esta página los puede ejecutar un agente de IA; cómo conectarlo - en [conectar un agente a través de MCP](./mcp.md).
