---
title: "Cómo se vincula todo"
description: "Qué registros conectan las herramientas (mensajes, personas, chats, archivos, menciones, notas, tareas, hechos, documentos de Drive, etiquetas), quién crea cada vínculo y qué ejecutar cuando falta uno."
---

Puedes pedirle a tu agente todo sobre una persona, o los mensajes que respaldan una decisión, porque las herramientas guardan vínculos entre registros. Esta página explica qué vínculos existen, quién crea cada uno (la herramienta, tú o tu agente) y cómo seguirlos. Después podrás saber por qué falta un vínculo y qué comando lo añade. La búsqueda y los vínculos trabajan con lo que ya está en el almacén local, así que descarga antes el historial: [Buscar](./search.mdx#descarga-primero-el-historial-de-los-chats-pertinentes).

## La idea

`tg`, `max`, `memo` y `drive` pueden compartir registros cuando se configuran explícitamente para usar la misma base local compatible. Drive usa por defecto la base compartida (consulta [dónde están los archivos](./drive/configuration.md#where-the-files-live)), así que sus registros se pueden vincular con las demás herramientas salvo que la hayas movido. Un vínculo es una de dos cosas:

- **Parte del propio registro.** Un mensaje tiene un chat y un remitente.
- **Un vínculo guardado entre dos registros.** Una nota trata de una persona. Un hecho se respalda con mensajes.

Las identidades nunca se unen por adivinar a partir de los nombres. Cada vínculo guardado anota quién lo creó.

## Una referencia nombra cualquier registro

Cada resultado lleva una referencia: un nombre corto y con tipo del registro. Úsala en el siguiente comando.

| Referencia | A qué apunta |
| --- | --- |
| `msg:telegram/1/77/42` | Un mensaje: mensajería, cuenta, chat, mensaje |
| `chat:telegram/1/77` | Un chat de una cuenta |
| `contact:telegram/501` | Un contacto de una mensajería |
| `person:7` | Una persona, con todas las cuentas que vinculaste a ella |
| `organization:3`, `project:4`, `task:5` | Tus organizaciones, proyectos y tareas |
| `note:12`, `document:3` | Una nota, o un archivo de una carpeta de notas o de Drive |
| `meeting:1/7/3/4` | Un fragmento de transcripción conservado: cuenta, reunión, transcripción y posición |
| `memory:8`, `fact:9` | Un recuerdo o un hecho |

Una referencia de mensaje incluye la cuenta, así que el mismo número en otra cuenta es otro mensaje. El campo que contiene la referencia se llama `ref` en la mayoría de las respuestas. Algunas lo llaman `locator`, y una lista de Drive lo llama `reference`. Copia el valor, no el nombre del campo.

```sh
tg personal messages context "msg:telegram/1/77/42" --thread
```

## Mensajes, chats y personas

Un mensaje pertenece a un chat y tiene un remitente. El remitente es una identidad: una cuenta en una mensajería. Una persona es una o varias identidades.

Solo tú unes identidades en una misma persona. El mismo nombre o el mismo dominio de correo nunca bastan.

```sh
tg personal contacts link "Kai Sample" max:Kai
```

Después, `contacts events` sigue a la persona entre mensajerías. Muestra lo que escribió, dónde la mencionaron, y sus chats, correos, reuniones y tareas, de lo más reciente a lo más antiguo, solo desde el almacén.

```sh
tg personal contacts events "Kai Sample" 'at>=2026-10-01' --limit 20
```

La herramienta también anota quién participó en qué (remitente, destinatario, participante, responsable, autor, mencionado, vinculado). Por eso «todo sobre Kai» es una sola consulta y no un recorrido por todos los mensajes.

La cronología de una persona sigue la participación guardada y los vínculos explícitos de mensajes. Confirmar una mención de teléfono, correo o nombre permite buscarla con `mentions:`, pero no añade por sí solo una entrada a la cronología.

## Respuestas y conversaciones

Cada mensaje puede apuntar al mensaje anterior al que responde. Cada puntero dice de dónde viene:

- **La mensajería.** Una respuesta explícita. Gana sobre todo lo demás.
- **Una regla de la herramienta.** Un mensaje que menciona a alguien, o que continúa al mismo remitente.
- **Tu agente.** Una respuesta que guardó tras leer el chat. Guardarla requiere el permiso de perfil `conversations.links`.

`conversations rebuild` une esos punteros en conversaciones de un chat. `messages context` con `--thread` sigue la cadena desde un mensaje en lugar de mostrar sus vecinos en el tiempo. Un vínculo que quedó desactualizado tras una edición o un borrado se muestra, pero no se sigue. Al reconstruir, las conversaciones reciben ids nuevos, así que conserva la referencia `msg:` del mensaje, no el id de la conversación. Cómo se construye el grafo: [Cómo funciona la búsqueda](./search-architecture.mdx#3-reconstruir-conversaciones-con-un-grafo-de-mensajes).

## Archivos, notas de voz e imágenes

- Un archivo pertenece a un mensaje, un correo o una reunión. Su texto extraído se queda con él, así que `content:` encuentra el mensaje que llevaba el archivo.
- La transcripción de una nota de voz pertenece al mensaje, así que `transcript:` encuentra ese mensaje.
- Una imagen se encuentra por el chat que la rodea o por lo que muestra. Ambas vías se explican en [Qué se indexa](./what-is-indexed.md#imágenes).

## Transcripciones de reuniones

Un fragmento de transcripción tiene una referencia `meeting:` que conserva su reunión y revisión. Úsala para leer el contexto y conservar la cobertura. Un participante puede vincularse explícitamente a una persona y una reunión puede pertenecer a un proyecto confirmado; coincidir en el nombre no crea esos vínculos. Vincular un participante no demuestra quién pronunció un fragmento. [Evidencia y vínculos de reuniones](./zm/meetings.md) explica cómo comprobar esas asociaciones antes de guardar un hallazgo con fuentes.

## Menciones

Una mención es un teléfono, una dirección de correo, un enlace, un enlace a un documento de Google o el nombre de una persona que conoces, encontrados con reglas en el texto de mensajes, archivos y transcripciones. Cada mención empieza como `found`. Después la confirmas (`linked`) o la rechazas (`dismissed`).

- `mentions list` muestra lo encontrado. `mentions show <id>` muestra el texto alrededor de una.
- `mentions confirm <id> person:7` indica a quién pertenece un teléfono o una dirección, o a qué persona se refiere un nombre. Para un teléfono o una dirección sirven tanto `person:` como `organization:`. Un documento de Google guardado no necesita argumento.
- `mentions reject <id>` descarta ese valor en todas partes y en las sincronizaciones posteriores. Un enlace normal no se puede confirmar, solo rechazar.
- `mentions rebuild` lee los mensajes guardados antes de que existieran las menciones. `mentions rebuild person-name` vuelve a buscar nombres cuando añades o renombras personas.

Ambas anotan quién decidió. Si las ejecuta un agente, la decisión se guarda a nombre del agente; `--as-owner` la guarda como tuya.

La búsqueda encuentra las menciones como se hayan escrito: `phone:`, `email:`, `url:` y `domain:` miran el valor, y `mentions:"person:7"` encuentra los mensajes que mencionan a una persona, organización o documento confirmados. Estos comandos están en las últimas versiones de `tg` y `max`; comprueba las tuyas con `mentions --help`. Más: [Qué se indexa](./what-is-indexed.md#teléfonos-correos-y-enlaces).

## Notas, tareas, hechos y recuerdos

`memo` guarda los registros sobre todo lo anterior que escribes tú o escribe tu agente.

- Una **nota** trata de una persona, un chat, una tarea o un documento. Un enlace `[[Kai Sample]]` en una nota se convierte en un vínculo con esa persona en cuanto hay en el almacén alguien con ese nombre o nombre de usuario. Un nombre en texto normal no es un vínculo.
- Una **tarea** puede nacer de un mensaje. Una tarea de pregunta se vincula con el mensaje que la respondió.
- Un **hecho** (una afirmación, una pregunta, una decisión o una promesa) guarda vínculos con su evidencia: los mensajes, notas o documentos que lo respaldan. Una decisión nueva puede reemplazar a una anterior. Un hecho que añade tu agente queda como propuesto hasta que lo aceptes.
- Un **recuerdo** es una conclusión con evidencia y un estado de revisión. Un cambio en la fuente puede dejarlo obsoleto.

## Etiquetas

Una etiqueta se pone en cualquier registro: un mensaje, un chat, una persona, un documento, una nota, una tarea. `tag:work` encuentra un mensaje que tiene la etiqueta, un mensaje en un chat que la tiene y un mensaje de una persona que la tiene. Una etiqueta en una carpeta de Drive se aplica a esa carpeta; etiqueta sus documentos por separado.

```sh
tg personal tags add work --chat "Book club"
```

## Documentos de Drive

`drive` importa documentos a su almacén local configurado. Un documento puede llevar etiquetas, notas, hechos y recuerdos, y vincularse con una persona (`drive personal relationships`, `drive personal tags`). `drive personal documents list person:7` lista los documentos vinculados a esa persona.

## Relaciones de negocio

Una relación de negocio dice qué son dos de tus registros el uno para el otro: Alice es un contacto de Acme Ltd, Emma
depende de Dana, Acme Ltd le compra a tu empresa. `memo` y una herramienta de CRM como `b24` guardan estas relaciones
en el almacén compartido. Así tu agente y `memo` leen la misma respuesta, con la fuente de cada relación.

### Tipos y roles

| Tipo | Desde → hacia | Roles | Leída desde el otro extremo |
| --- | --- | --- | --- |
| `member-of` | una persona → una organización o un proyecto | en una organización `employee`, `contractor`, `founder`, `owner`, `manager`, `adviser`, `contact`. En un proyecto `owner`, `manager`, `contributor`, `client-contact`, `approver` | las personas de la organización o del proyecto |
| `reports-to` | una persona → una persona | ninguno | `manages` |
| `customer-of` | una persona o una organización → una organización | ninguno | proveedor (supplier of) |
| `partner-of` | una organización ↔ una organización | ninguno | igual en los dos sentidos |
| `related-to` | una negociación o un prospecto → una persona | `owner`, `contact`, `decision-maker`, `influencer` | las negociaciones y prospectos de la persona |

Cada relación tiene un solo nombre. El almacén guarda un sentido, y una respuesta leída desde el otro extremo muestra
el nombre inverso, como `manages` para `reports-to`. No hay un segundo nombre que guardar, así que una relación no
puede estar dos veces con dos nombres. Un chat también puede ser `member-of` de un proyecto, y `related-to` une
personas, organizaciones, proyectos y tareas cuando ningún otro tipo encaja.

Un rol dice qué es la persona en ese sitio, y sale de la lista de arriba. El cargo es otra cosa: se guarda junto al
rol, por ejemplo `--position "Procurement manager"`, y nunca es un rol. Una persona puede tener varios roles en la
misma organización. `memo` rechaza un rol que no está en la lista y muestra la lista. Un rol guardado antes de que
existieran las listas se queda como estaba, y `relationships list` lo marca como `custom`.

Las listas son tuyas. Añade un rol propio cuando los de serie no encajen, y quítalo mientras ninguna relación lo
tenga. Un rol de serie no se puede quitar, y solo tú cambias las listas, nunca tu agente:

```sh
memo relationships roles list list:organization
memo relationships roles add organization board-member --label 'Board member'
memo relationships roles remove organization board-member
```

```text
$ memo relationships roles list list:organization
organization  employee
organization  contractor
organization  founder
organization  owner
organization  manager
organization  adviser
organization  contact
organization  board-member  Board member  (yours)
```

### Qué tan segura es una relación

Cada relación de una respuesta tiene un estado (standing):

| Estado | Significa |
| --- | --- |
| `confirmed` | La escribiste tú o la confirmaste. |
| `reported` | Lo dice una cuenta de CRM y nadie lo confirmó. La respuesta nombra la cuenta. |
| `proposed` | La sugirió tu agente, un análisis del almacén o una cuenta de CRM con sus vínculos en `review`. Te espera en `memo review`. |
| `ended` | Existió y ya no existe. La terminaste tú, o la fuente dejó de informarla. |

Tu palabra manda. Una sincronización del CRM nunca cambia ni termina una relación que tú creaste o confirmaste, y
nunca vuelve a escribir una que quitaste o rechazaste. Si el CRM informa otro rol para el mismo par, es una segunda
relación junto a la tuya, con su propio estado. Del mismo modo, cuando cambias el rol de una relación que informó el CRM, tienes tu propia
relación `confirmed` junto a la del CRM, y la del CRM sigue `reported`. Bob, de los [ejemplos](./people.md#ejemplos),
es un contacto de Acme Ltd en el CRM, y lo haces su manager:

```text
$ memo relationships update 2 --role manager --position CEO
...
$ memo relationships list 'about:"person:5"' kind:member-of
2  Person «Bob» → Organization «Acme Ltd»  member-of as contact  reported by bitrix24:example.bitrix24.com
11  Person «Bob» → Organization «Acme Ltd»  member-of as manager (CEO)  confirmed
```

Cuando el CRM deja de informar una relación, por ejemplo porque un
contacto dejó una empresa, la sincronización la termina. Se queda en el almacén como `ended` y nunca se borra. El
almacén también guarda cada cambio de una relación: cuándo se añadió, cambió, terminó, se confirmó, se rechazó, la
retiró su fuente, se volvió a informar o se quitó.

### Del CRM a personas y organizaciones

Una sincronización del CRM convierte sus registros en las personas y organizaciones que ya tienes:

- **Una empresa** pasa a ser una organización. Una empresa con el mismo nombre que una tuya sigue siendo otra
  organización, porque los nombres nunca se comparan.
- **Un contacto** pasa a ser una persona. Se une a una persona que ya tienes solo cuando la dirección de correo es
  exactamente la misma. Un nombre nunca basta. Si separaste dos identidades, siguen separadas tras cada
  sincronización.
- **Tu propia empresa** en el CRM queda marcada como tuya. Una empresa que es `customer-of` tu empresa es un
  `client`, y una de la que tu empresa es `customer-of` es un `supplier`. Estas categorías se calculan a partir de
  las relaciones cada vez que preguntas. Un tipo de empresa del CRM, como `CUSTOMER`, hace cliente a una empresa solo
  cuando tú dices qué significa ese tipo.
- **Un empleado** de la cuenta del CRM pasa a ser una persona, miembro de tu empresa con el rol `employee`.
- **Las líneas de mando** salen de los departamentos: cada empleado depende del jefe de su departamento, y un jefe
  del jefe del departamento superior. La respuesta dice que esta línea se dedujo de los jefes de departamento.

Hay cosas que un CRM no puede decir, así que solo vienen de ti. En Bitrix24 son el papel de un contacto en una
negociación (quien decide o quien influye), de quién depende un contacto, la empresa matriz de una empresa y las
fechas en que una relación empezó o terminó. La sección «Quién es quién» de la [guía de Bitrix24](./b24/usage.md)
dice qué lee `b24` y qué ajustes lo cambian, por ejemplo para que cada nueva relación del CRM espere tu revisión.

Para ver las relaciones de una persona, una empresa o una negociación, con ejemplos: [Clientes, colegas y
negociaciones](./people.md#clientes-colegas-y-negociaciones).

## Quién crea un vínculo

| Vínculo | Lo crea |
| --- | --- |
| Un mensaje en su chat, con su remitente | La herramienta, al guardar el mensaje |
| Una respuesta | La mensajería |
| Una respuesta supuesta (mención, mismo remitente) | Una regla de la herramienta |
| Una respuesta elegida | Tu agente, con `conversations.links` |
| Un teléfono, correo, enlace, documento o nombre en un texto | Una regla de la herramienta, como `found` |
| Una mención confirmada o rechazada | Tú o tu agente, con su nombre anotado |
| Dos identidades, una persona | Tú, con `contacts link` |
| Una etiqueta | Tú, con `tags add` |
| Una nota, tarea o hecho sobre un registro | Tú o tu agente mediante `memo` |
| Un hecho de un agente | Tu agente, como propuesto; tú lo aceptas |

Cada vínculo guardado anota su origen: `file` (escrito en un archivo de notas), `owner` (añadido por ti), `suggested` (propuesto, aún sin confirmar) o `message` (escrito en un mensaje guardado).

El vínculo entre una identidad y su persona también guarda cómo se hizo, qué seguridad tiene y quién lo hizo, y cada
paso de una identidad de una persona a otra queda registrado, así que un vínculo equivocado se puede deshacer. La regla
para todas las herramientas es que un vínculo que hiciste tú nunca se sustituye por uno automático, y dos candidatos
igual de buenos no producen ningún vínculo ([el estándar del modelo de datos](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md)).
**Llega en la próxima versión de cli-core:** el mismo registro para eventos y documentos, y una lista de revisión
donde decides los pares que las herramientas no pudieron distinguir.

## Usar los vínculos en una pregunta

Cuatro peticiones que un agente puede responder gracias a los vínculos. Sustituye los nombres por los tuyos.

```text prompt
Usa tg CLI. Encuentra el mensaje donde acordamos la fecha de entrega y muestra los mensajes de alrededor como una sola conversación.
```

```text prompt
Usa tg CLI. ¿De quién es el teléfono +1 555 010 0100? Muestra dónde aparece y propón una persona.
```

```text prompt
Usa tg CLI. Muestra todo sobre Kai Sample del último mes, en todas las mensajerías que vinculé a esa persona.
```

```text prompt
Usa memo. ¿Qué tarea nació del mensaje sobre la factura y qué mensaje la respondió?
```

## Si falta un vínculo

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| La cronología de una persona muestra una sola mensajería | Las identidades no están vinculadas | `contacts link`, y vuelve a preguntar |
| `--thread` solo muestra vecinos en el tiempo | No hay conversaciones construidas para el chat | `conversations rebuild --chat "Book club"` |
| No se encuentra un teléfono o correo de un mensaje antiguo | El mensaje se guardó antes de que existieran las menciones | `mentions rebuild` |
| No se encuentra el nombre de un contacto nuevo | Las menciones se construyeron antes de que existiera la persona | `mentions rebuild person-name` |
| No se encuentran palabras dentro de un archivo | No se extrajo el texto del archivo | `attachments extract` |
| Un chat no tiene mensajes | Nunca se descargó el historial | `messages sync` |

Siguiente: [Busca con eficacia](./search.mdx) muestra cómo elegir el comando y acotar una búsqueda. Las columnas del almacén que sostienen estos vínculos están en [el modelo de datos](./data-model.mdx#cómo-se-conectan).
