---
title: "Personas"
description: "Recuerda quién te escribió y qué hablasteis antes de responder, usando tu historial de Telegram o MAX."
---

Alguien te escribe, pero no recuerdas dónde os conocisteis ni qué acordasteis. Pide al agente
que encuentre a la persona, reúna las conversaciones anteriores y muestre los mensajes de origen.
Necesitas una [cuenta conectada](./installation.mdx) y un [agente](./agents.md).


<a id="si-la-cuenta-parece-un-bot" />

<a id="pídeselo-a-tu-agente" />

<a id="respuestas-automáticas-con-tus-reglas" />

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

Usa `contacts show` para una consulta breve. Los campos del perfil dependen de lo que el mensajero comparte con tu cuenta.

## Qué escribió

Ambos mensajeros reúnen contexto de mensajes ya guardados en tu ordenador:

```sh
tg contacts context @example_user --since-time 30d --limit 20
max contacts context 20000002 --since-time 30d --limit 20
```

El resultado puede incluir chats compartidos, mensajes recientes y menciones. Depende del historial
guardado; que falten mensajes no demuestra que nunca hablarais de algo. Para más historial, consulta
[el archivo de Telegram](./tg/archive.md) o [el de MAX](./max/archive.md).

MAX también permite limitar el contexto a un chat:

```sh
max contacts context 20000002 --chat "Team" --limit 10
```

Telegram también admite `contacts context --chat` en la versión revisada. Indica los chats pertinentes para centrar la respuesta.

## Parece un bot

Ambos mensajeros admiten comprobar una cuenta:

```sh
tg contacts check @example_user
max contacts check 20000002
```

Lee los motivos y los datos que faltan junto con la puntuación. Una señal es una pista, no una
prueba de fraude. Telegram también puede consultar listas públicas de spam, enviándoles el ID de la persona. Usa `--no-registries` para omitir esas consultas.

## La misma persona en los dos mensajeros

Si sabes que dos cuentas pertenecen a la misma persona, puedes guardar el vínculo localmente:

```sh
tg contacts link @example_user max:"Example User"
```

Las identidades vinculadas pueden aportar contexto a `contacts context`. Un nombre igual no basta.
Vincula solo cuentas identificadas; `contacts unlink` elimina esa asociación local.

## Qué cambia en MAX

Para las opciones exactas, consulta [Telegram](./tg/commands.md) o [MAX](./max/commands.md).
Las diferencias anteriores corresponden a las versiones revisadas de este sitio.

## Respuestas automáticas por tus reglas

Las respuestas automáticas son una tarea aparte que puede enviar mensajes. Empieza por
[las respuestas automáticas de MAX](./max/replies.md) para configurarlas; leer el historial no las activa.

Cuando conozcas el contexto, pide [un borrador](./prompting.md#revisar-compromisos-y-preparar-respuestas)
y revisa el texto antes de autorizar el envío.
