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

Para una consulta breve en la versión revisada de Telegram, usa `contacts show`. MAX también
ofrece un perfil más completo:

```sh
tg contacts show @example_user
max contacts profile 20000002
```

Son comandos distintos. Telegram v0.28.0 no ofrece `contacts profile` ni `contacts check`;
MAX v0.29.0 sí. Usa el comando de tu mensajero: que exista en una versión nueva no significa
que tu versión instalada lo admita.

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

Telegram v0.28.0 no tiene la opción `--chat` en este comando. Pide al agente que lea ese chat
por separado; [leer mensajes](./tg/usage.md#reading) explica ese camino.

## Parece un bot

Esta comprobación está disponible en la versión revisada de MAX:

```sh
max contacts check 20000002
```

Lee los motivos y los datos que faltan junto con la puntuación. Una señal es una pista, no una
prueba de fraude. Telegram v0.28.0 no tiene un comando equivalente; no inventes una llamada.

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
