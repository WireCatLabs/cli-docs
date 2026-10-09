---
title: "Personas"
description: "Recuerda quién te escribió y qué hablasteis antes de responder, usando tu historial de Telegram o MAX."
---

Recuerda quién te escribió y qué hablasteis antes de responder. Pide a tu agente que explique de qué conoces a esa persona, qué acordasteis y qué datos de la cuenta están disponibles, con los mensajes que respaldan cada respuesta. También puedes unir las cuentas de Telegram y MAX de una misma persona.

## Qué es una persona aquí

Una persona es alguien que tu cuenta ha visto en un chat: en un chat privado o en un grupo que
compartís. Las herramientas la reconocen por su cuenta del mensajero —su ID y, en Telegram, su
`@username`— y por lo que guarda de ella el historial de tu ordenador.

Una persona no tiene que estar en tus contactos. Los contactos son la agenda del mensajero: las
personas que añadiste, a menudo por número de teléfono. Alguien que escribió en un grupo común es una
persona aquí aunque nunca la añadieras. `contacts list` muestra las personas con las que tienes un chat
privado. Añadir, renombrar o eliminar un contacto es otra acción y cambia tu cuenta del mensajero.

También puedes guardar contexto privado sobre una persona. Se queda en tu ordenador y nunca llega al
mensajero:

- **Tu propio nombre para ella.** Los comandos podrán encontrarla por ese nombre. Se aplica a la
  cuenta seleccionada y no cambia su nombre en tus contactos.
- **Notas.** Texto libre sobre la persona en el que tú o tu agente podréis buscar después.

Los comandos están en la [guía de personas de Telegram](./tg/people.md#your-own-names-and-notes-contacts-alias-contacts-notes)
y en la [referencia de MAX](./max/commands.md#max-contacts-alias).

La misma persona suele tener una cuenta en Telegram y otra en MAX. Las herramientas las tratan como
dos personas hasta que las **vinculas**: registras en tu ordenador que ambas cuentas son de la misma
persona. Después, el resumen de lo que escribió incluye sus mensajes de los dos mensajeros.
Consulta [la misma persona en los dos mensajeros](#link-your-accounts).

<a id="pídeselo-a-tu-agente" />

## Pide al agente

```text prompt
Antes de responder a @example_user, recuérdame quién es y qué hablamos en el último mes. Muestra los chats y mensajes de origen. Separa acuerdos confirmados de preguntas sin respuesta. Solo lee: no respondas ni marques mensajes como leídos.
```

Sustituye el usuario por un nombre o ID. Si aparecen varias personas, elige la correcta antes
de leer más. Espera un resumen breve de su identidad, las conversaciones y las preguntas pendientes.
El agente debe indicar qué historial estaba disponible.

## Quién es

Ambos mensajeros ofrecen un perfil con la identidad y conversaciones compartidas:

```sh
tg contacts profile @example_user
max contacts profile 20000002
```

Usa `contacts show` para una consulta breve. Indica a la persona por su ID o parte de su nombre;
en Telegram también sirve su `@username`. Si parte de un nombre coincide con varias personas, el
comando las lista y se detiene. Estas lecturas usan tu cuenta y los mensajes guardados en tu
ordenador. No se envía nada a la persona y nada se marca como leído.

Los campos del perfil dependen de lo que el mensajero comparte con tu cuenta:

- **Teléfono:** solo las cuatro últimas cifras, y solo si el mensajero te muestra el número.
  `--show-phone` lo imprime entero. Un agente conectado por MCP nunca recibe el número completo.
- **Fecha de registro:** siempre indica su origen. Telegram envía el mes cuando alguien te escribe
  por primera vez; si no, `tg` la calcula a partir del ID de la cuenta y la marca como `estimate`.
  El cálculo cubre cuentas creadas hasta agosto de 2026; las más nuevas no reciben fecha antes que
  una equivocada. MAX da el día exacto, así que `max` lo muestra para todos.
- **Nombres anteriores:** nombres y usuarios que vio tu historial guardado, en `aliases`, del más
  antiguo al más nuevo, con un enlace `t.me` para un usuario antiguo de Telegram. Un nombre tomado
  de mensajes guardados indica `source: messages` y es aproximado: un mensaje descargado de nuevo
  lleva el nombre más reciente.
- **Chats compartidos:** cuántos de sus mensajes tiene tu copia local en cada chat, y el primero y
  el último. Si un chat no está guardado desde el principio (`complete: false`), la cifra es un
  mínimo; `store fetch <chat>` lo completa.

## Qué escribió

Ambos mensajeros reúnen contexto de mensajes ya guardados en tu ordenador:

```sh
tg contacts context @example_user --since-time 30d --limit 20
max contacts context 20000002 --since-time 30d --limit 20
```

Sin `--chat` obtienes un resumen: los chats compartidos, el último mensaje en cada sentido, sus
mensajes recientes y dónde lo mencionaron otros. Nombra los chats que importan para obtener sus
mensajes más nuevos en cada uno, del más antiguo al más reciente, 20 por chat de forma predeterminada:

```sh
tg contacts context @example_user --chat "Club de lectura" --chat "Trabajo" --limit 10
max contacts context 20000002 --chat "Club de lectura" --chat "Trabajo" --limit 10
```

Cada mensaje es solo su hora y su texto, para que un agente lea muchos a la vez y los resuma.
`-v` añade ids y enlaces de los mensajes; `-vv`, el mensaje completo.

La respuesta sale del historial guardado y no se conecta al mensajero. Que falten mensajes no
demuestra que nunca hablarais de algo. Con `--chat`, `--refresh` pregunta antes al mensajero:
Telegram busca en cada chat los mensajes de esa persona; MAX lee la página más reciente de cada
chat, porque no puede buscar por remitente. Para más historial, consulta
[el archivo de Telegram](./tg/archive.md) o [el de MAX](./max/archive.md).

<a id="si-la-cuenta-parece-un-bot" />

## Parece un bot

Ambos mensajeros admiten comprobar una cuenta:

```sh
tg contacts check @example_user
max contacts check 20000002
```

La respuesta es una puntuación y todos los motivos, cada uno con su origen: las marcas del propio
mensajero, un perfil vacío, una cuenta nueva, solo fotos recientes, un enlace como primer mensaje o
el mismo texto en varios chats. La puntuación es una pista, no una prueba: muchas personas reales no
tienen foto ni biografía. `unknown` enumera las señales que no se pudieron juzgar, así que una
puntuación baja con una lista `unknown` larga significa poco. La lista completa de motivos está en
las guías de [Telegram](./tg/people.md) y [MAX](./max/people.md).

En Telegram, `tg` también consulta dos listas públicas de spam, [Combot Anti-Spam](https://cas.chat/api)
y [lols.bot](https://lols.bot). **Se les envía el ID de Telegram de la persona.** Usa
`--no-registries` para omitir esas consultas. Las listas solo cubren cuentas de Telegram, así que
`max` nunca les envía nada.

Para revisar un grupo entero, `chats members audit` puntúa a cada miembro a partir de la lista de
miembros y tu historial guardado, y lista a quienes tienen algún motivo. `--deep 10` hace después la
comprobación completa de los diez con más puntos, una persona por segundo. El propietario y los
administradores quedan fuera, y no se elimina a nadie:

```sh
tg chats members audit "Club de lectura" --deep 10
max chats members audit "Club de lectura" --deep 10
```

<a id="link-your-accounts" />

## La misma persona en los dos mensajeros

Si sabes que dos cuentas pertenecen a la misma persona, puedes guardar el vínculo localmente:

```sh
tg contacts link @example_user max:"Example User"
```

Las dos cuentas deben estar ya en el historial de este ordenador, así que usa `tg` y `max` en el
mismo ordenador. Después, `contacts context` sin `--chat` reúne las identidades vinculadas.
`contacts context --chat` y `contacts profile` muestran solo la identidad seleccionada del mensajero.
Un nombre igual no basta; solo cuenta lo que registras tú. `contacts unlink` elimina esa asociación
local.

### Vincula una dirección de correo

[Importa el correo](./email.mdx) primero y vincula una dirección conocida al contacto almacenado:

```sh
tg contacts link @example_user email:rin@example.test
```

Sustituye el usuario y la dirección por las identidades reales de la persona. Comprueba las
identidades devueltas: coincidir en el nombre no basta. Vincular cambia el registro local de la
persona, no los inicios de sesión ni los buzones. `contacts unlink` separa la identidad indicada si el enlace es incorrecto.

Para guardar contexto propio sobre la persona, consulta [crear notas](./memo.mdx#create-your-own-notes).
La [guía de notas y etiquetas](./memo.mdx#tag-your-sources) explica etiquetas sobre contactos,
personas vinculadas y mensajes. Las órdenes de notas del mensajero se describen en
[Telegram](./tg/commands.md#tg-contacts-notes) y [MAX](./max/commands.md#max-contacts-notes).

## Qué cambia en MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Fecha de registro | el mes de Telegram tras un primer contacto; si no, un cálculo | el día exacto, de MAX |
| Marcas como estafa, falsa, verificada, premium | se muestran | MAX no las envía para cuentas personales |
| `--refresh` | busca en cada chat los mensajes de la persona | lee la página más reciente de cada chat |
| Listas públicas de spam | se consultan, salvo con `--no-registries` | no se consultan |
| Peticiones extra por perfil | ninguna aparte de las de `contacts show` | una por persona |

Las opciones exactas están en la [referencia de Telegram](./tg/commands.md) y la [de MAX](./max/commands.md).

## Cuando un agente lee estas respuestas

Con el [servidor MCP](./mcp.mdx) conectado, el agente obtiene el mismo perfil, contexto y comprobación.
El texto de los mensajes en estas respuestas lo escribieron otras personas. Tu agente lo resume y
no obedece peticiones que haya dentro.

<a id="respuestas-automáticas-con-tus-reglas" />

## Respuestas automáticas por tus reglas

Las respuestas automáticas son una tarea aparte que puede enviar mensajes; leer el historial de
una persona no las activa. [Borradores y plantillas](./drafts-and-templates.mdx) explica en qué se
diferencian de un borrador que te muestra el agente. La configuración está en
[las respuestas automáticas de Telegram](./tg/replies.md) y [las de MAX](./max/replies.md).

Cuando conozcas el contexto, pide [un borrador](./prompting.mdx#revisar-compromisos-y-preparar-respuestas)
y revisa el texto antes de autorizar el envío.
