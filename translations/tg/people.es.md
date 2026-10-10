---
title: "Personas"
---

<a id="para-agentes" />
<a id="for-agents" />

Utilice esta página cuando quiera saber más sobre una persona: quién es, qué le escribió a usted o a sus grupos, y si su cuenta parece un bot o un spammer. Aprenderá a leer el perfil de una persona, recopilar sus mensajes para obtener un resumen, verificar una cuenta antes de confiar en ella y conservar sus propios nombres y notas sobre las personas.

Algunas palabras en esta página:

- **El archivo local** es la copia de tus mensajes que `tg` guarda en esta computadora. Los recuentos y mensajes de esta página provienen de ella, por lo que solo muestran lo que se descargó.
- **Un perfil** es lo que dice Telegram sobre una persona: nombre, nombre de usuario, biografía, foto y banderas.   No es un perfil de inicio de sesión `tg`.
- **Una persona** se nombra por su id, su `@username` o parte de su nombre. Cuando parte de un nombre coincide con más de una persona, el comando se detiene y las enumera; ejecútelo nuevamente con la identificación o el nombre de usuario.

## Qué puedes hacer

| Tarea | Comando |
| --- | --- |
| Ver quién es una persona y dónde hablas con ella | `tg contacts profile` |
| Lee lo que dijeron, en cada chat o en los chats que nombras | `tg contacts context` |
| Compruebe si la cuenta parece un bot, una falsificación o un spammer | `tg contacts check` |
| Consulta los miembros más sospechosos de un grupo | `tg chats members audit --deep` |
| Registra que una cuenta de Telegram y una cuenta MAX son la misma persona | `tg contacts link` |
| Mantenga su propio nombre y notas para una persona | `tg contacts alias`, `tg contacts notes` |

Cada opción de estos comandos se encuentra en la [referencia de comando para contactos](./commands.md#tg-contacts).

## Quién es: `contacts profile`

```sh
tg contacts profile @example_user
tg contacts profile @example_user --json
```

Muestra todo lo que Telegram dice de la persona y cuántos mensajes suyos contiene tu almacén local en cada chat compartido:

```json
{
  "id": "1000001",
  "name": "Example User",
  "usernames": ["example_user"],
  "bio": "Coffee and maps",
  "phone": "***0123",
  "flags": { "bot": false, "verified": false, "premium": true, "scam": false, "fake": false,
             "restricted": false, "deleted": false, "support": false },
  "seen": "recently",
  "contact": true,
  "mutualContact": true,
  "commonChatsCount": 2,
  "registered": { "at": "2019-04-01T00:00:00.000Z", "source": "estimate", "precision": "month" },
  "hasPhoto": true,
  "chats": [
    { "id": "1000001", "title": "Example User", "kind": "dialog", "theirMessages": 412,
      "firstAt": "2023-02-11T09:14:00.000Z", "lastAt": "2026-10-05T18:02:00.000Z", "complete": true },
    { "id": "-1002000002", "title": "Book club", "kind": "group", "theirMessages": 37,
      "firstAt": "2025-06-01T10:00:00.000Z", "lastAt": "2026-09-30T20:41:00.000Z", "complete": false }
  ],
  "aliases": [
    { "name": "Example U.", "username": "example_old", "link": "https://t.me/example_old",
      "firstSeenAt": "2024-03-02T08:00:00.000Z", "lastSeenAt": "2024-03-02T08:00:00.000Z", "source": "profile" }
  ]
}
```

- **`phone`** muestra solo las cuatro últimas cifras y solo si Telegram te muestra su número. `--show-phone` lo imprime completo. La herramienta MCP siempre oculta el número completo.
- **`flags`** son las marcas de Telegram. `scam` y `fake` significan que el propio Telegram etiquetó la cuenta.
- **`seen`** es `online`, `recently`, `week`, `month`, `hidden` o una hora exacta si sus ajustes de privacidad te la muestran.
- **`registered`** siempre indica de dónde procede la fecha:
  - `telegram`: el mes que Telegram envía cuando alguien te escribe por primera vez;
  - `estimate`: una estimación a partir del ID de cuenta, con una tabla que termina en agosto de 2026. Los ID posteriores no reciben estimación, en lugar de una fecha que podría desviarse años.
- **`hasPhoto`** cuenta su foto propia y la pública, nunca una foto que tú le hayas asignado.
- **`chats`** enumera todos los chats compartidos y cualquier otro donde el almacén contenga mensajes suyos.
- **`aliases`** son nombres y nombres de usuario anteriores que vio el almacén, de más antiguo a más nuevo, cada uno con un enlace `t.me` para un nombre de usuario anterior. `source: profile`: el perfil cambió mientras el almacén lo observaba; `source: messages`: el nombre de los mensajes guardados, aproximado, ya que un mensaje descargado de nuevo lleva el nombre más reciente. Queda vacío hasta que el almacén haya visto un cambio.

### Los recuentos reflejan lo que contiene tu almacén

`theirMessages`, `firstAt` y `lastAt` proceden de tu almacén local, nunca de Telegram. Cuando `complete` es `false`, el almacén no contiene el chat desde el principio, así que el recuento es un mínimo y `firstAt` puede ser posterior al primer mensaje real de la persona. Descarga el chat para completar el historial:

```sh
tg store fetch "Book club"
```

El perfil no requiere solicitudes adicionales: utiliza las mismas tres llamadas que `contacts show`. A la persona no se le dice que miraste.

## Qué dijo: `contacts context`

Sin `--chat`, ofrece un resumen desde el almacén: chats compartidos, el último mensaje en cada dirección, sus mensajes recientes en vuestro chat privado y en grupos, y dónde lo mencionaron otros. Nunca se conecta.

```sh
tg contacts context @example_user
```

Con `--chat`, muestra sus mensajes más recientes en cada chat indicado, de más antiguo a más nuevo, 20 por chat:

```sh
tg contacts context @example_user --chat "Book club" --chat "Team" --limit 10
tg contacts context @example_user --chat "Book club" --refresh
```

```json
{
  "person": { "uid": "p_7", "provider": "telegram", "id": "1000001", "name": "Example User" },
  "chats": [
    {
      "chat": { "id": "-1002000002", "title": "Book club", "kind": "group" },
      "messages": [
        { "at": "2026-09-29T19:02:00.000Z", "text": "Next one is the short story collection" },
        { "at": "2026-09-30T20:41:00.000Z", "text": "I can host on Thursday" }
      ],
      "complete": false,
      "more": true
    }
  ],
  "limits": { "messages": 10 }
}
```

- Cada mensaje contiene solo hora y texto para que un agente pueda leer muchos a la vez. `-v` añade el ID del mensaje, un enlace, el remitente y a qué responde; `-vv` muestra el mensaje completo.
- `--refresh` consulta primero Telegram: una búsqueda por chat de los mensajes de esa persona. Sin él, la respuesta procede del almacén y nunca se conecta.
- `more: true` indica que hay mensajes más antiguos que los del límite; `complete: false`, que el almacén no contiene el chat desde el principio.
- Un mensaje de voz incluye `transcript` una vez convertido en texto.

## Bot, cuenta falsa o spammer: `contacts check`

```sh
tg contacts check @example_user
tg contacts check @example_user --no-registries
```

```json
{
  "person": { "id": "1000001", "name": "Example User", "username": "example_user", "provider": "telegram" },
  "score": 3,
  "reasons": [
    { "reason": "no_bio", "weight": 1, "source": "messenger" },
    { "reason": "link_first", "weight": 2, "source": "store" }
  ],
  "registries": [
    { "name": "cas", "answer": "clean", "checkedAt": "2026-10-07T08:00:00.000Z" },
    { "name": "lols", "answer": "clean", "checkedAt": "2026-10-07T08:00:00.000Z" }
  ],
  "unknown": ["new_account"],
  "checkedAt": "2026-10-07T08:00:00.000Z"
}
```

La puntuación suma los pesos de todos los motivos encontrados. Es una pista, nunca un veredicto: muchas personas reales no tienen foto, nombre de usuario o biografía, por eso estos motivos pesan poco.

| Motivo | Peso | Significado |
|---|---|---|
| `bot`, `scam`, `fake` | 3 | el propio Telegram marcó la cuenta |
| `cas_banned`, `lols_banned`, `lols_scammer` | 3 | aparece en una lista pública de spam |
| `new_account` | 2 | registro de hace menos de 30 días, según el mes de Telegram o la estimación por ID |
| `link_first` | 2 | su primer mensaje guardado es un enlace |
| `same_text` | 2 | el mismo texto en varios chats |
| `photo_recent` | 1 | su foto visible más antigua tiene menos de 30 días |
| `no_photo`, `no_username`, `no_bio` | 1 | esa parte del perfil está vacía |
| `odd_name` | 1 | sin nombre, una secuencia larga de dígitos o un enlace en el nombre |
| `never_wrote` | 1 | el almacén no contiene mensajes suyos |
| `deleted` | 1 | la cuenta fue eliminada |

`unknown` enumera las señales para las que no había datos, así que una puntuación baja con una lista larga de `unknown` significa poco.

### Qué sale de tu ordenador

`contacts check` consulta dos listas públicas de spam, [Combot Anti-Spam (CAS)](https://cas.chat/api) y [lols.bot](https://lols.bot), para saber si incluyen a la persona. **Su ID de Telegram se envía a ambas.** `--no-registries` las omite; el perfil y las fotos se siguen consultando a Telegram salvo que añadas `--offline`. Una lista que no responda aparece como `unknown`, y el resto de la comprobación continúa.

Por ahora, la clave de CAS es opcional. Si Combot te proporciona una, guárdala en el llavero del sistema como la cuenta `registries:cas` del servicio `tg-cli`, o en `TG_CAS_API_KEY`. `tg` la envía solo en una cabecera de solicitud, nunca en la dirección, y nunca la imprime.

## Miembros de un grupo: `chats members audit --deep`

```sh
tg chats members audit "Book club"
tg chats members audit "Book club" --deep 10
```

`chats members audit` puntúa a cada miembro con la lista de miembros y el almacén, sin una solicitud por persona, y enumera a quienes tienen algún motivo, de mayor a menor puntuación. `--deep 10` ejecuta después el `contacts check` completo para los diez primeros, a una persona por segundo, incluidas las listas de spam. No elimina a nadie. Se excluyen el propietario y los administradores.

<a id="una-persona-en-dos-mensajeros-contacts-link" />

## Una persona en dos servicios de mensajería: `contacts link`

Telegram y MAX comparten un almacén local en este ordenador. Cuando sepas que una cuenta de Telegram y una de MAX son de la misma persona, regístralo:

```sh
tg contacts link @example_user max:"Example User"
tg contacts unlink @example_user
```

Después de eso, `contacts context` sin `--chat` reúne ambas cuentas: los chats que compartes y los mensajes de la cuenta de Telegram y de la cuenta MAX. `contacts profile` y `contacts context --chat` aún muestran solo la cuenta que nombraste. El enlace es sólo lo que registras: el mismo nombre en ambos servicios de mensajería nunca se toma como la misma persona.

## Tus propios nombres y notas: `contacts alias`, `contacts notes`

```sh
tg contacts alias set "Bob Synthetic" Bobby            # your own name for a person, on this computer only
tg contacts alias rm "Bob Synthetic"
tg contacts notes add "Bob Synthetic" --file note.txt  # or the text from stdin
tg contacts notes list "Bob Synthetic"
tg contacts notes edit "Bob Synthetic" <id> --revision 1 --file note.txt
tg contacts notes remove "Bob Synthetic" <id>
tg contacts show "Bob Synthetic" --with-notes
tg contacts list --search-notes flat                   # people whose notes contain this text
```

Los alias y notas permanecen en el archivo local y nunca llegan a Telegram. Un alias se aplica sólo en la cuenta que usas ahora; Se muestra una nota sobre una persona en cada perfil de inicio de sesión `tg` en esta computadora que la ve. `contacts rename` cambia el nombre de tus contactos de Telegram, algo diferente. Un comando busca a una persona por su alias a menos que coincida con el nombre de otra persona; entonces necesita la identificación. `--revision` detiene la edición de una nota que cambió desde que la leyó.

## Siguiente paso

Para ver qué está haciendo todo un grupo y quién espera una respuesta allí, lea [grupos que ejecuta](./groups.md). Un agente de IA puede ejecutar todos los comandos de esta página por usted; para conectar uno, consulte [conectar un agente a través de MCP](./mcp.md).
