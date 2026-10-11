---
title: "Usar Memo"
---

Esta página muestra cómo es un día normal con Memo una vez instalado: traer lo que ha cambiado,
encontrar algo, prepararte para una conversación y guardar lo que has aprendido. Cada paso enlaza a
la página con los detalles. Casi siempre se lo pides a tu agente y él ejecuta los comandos; los
comandos están aquí para que puedas comprobar lo que hace.

## Traer lo que ha cambiado

Memo lee tus carpetas y buzones cuando se lo pides, no todo el tiempo. Un comando trae todo lo que
ha cambiado desde la última vez:

```sh
memo import
```

Solo se leen los archivos cambiados y el correo nuevo, así que una segunda ejecución es rápida. En
Linux, `memo auto on` lo ejecuta por ti cada pocos minutos ([mantener Memo al día](./archive.md)).
Los mensajes de Telegram y MAX llegan a través de tg y max, no a través de Memo.

## Encontrar algo

```text prompt
Use memo CLI to find what I wrote or received about the venue for the Harbour project.
Show the matching text and the source of each result.
```

Tu agente busca en tus notas, tu correo y tus mensajes a la vez y muestra de dónde viene cada
resultado. Cuando sabes dónde está algo, busca solo ahí:

```sh
memo search all 'venue'               # messages, mail and notes together
memo search notes 'venue'             # notes only
memo search mail 'from:kai invoice'   # mail only
```

[Búsqueda](./search.md) explica las palabras de búsqueda y cómo dar las fuentes a tu agente.

## Prepararte para una conversación

```text prompt
Use memo CLI to show what I know about Kai Sample on Telegram: recent messages, mail and my notes.
Summarise what is still open between us.
```

`memo context telegram:"Kai Sample"` reúne los mensajes recientes de la persona, su correo y las
notas enlazadas a ella, cada cosa con su fuente. Consulta [Personas y proyectos](./people.md).

## Guardar lo que has aprendido

```sh
memo notes add 'Prefers calls in the morning' --about telegram:'Kai Sample'
memo tags add follow-up --note note:NOTE_ID
memo tasks add --project HRB --title 'Book the venue'
```

Una nota guarda tus propias palabras sobre una persona, un mensaje o un proyecto
([notas](./notes.md#write-your-own-notes)). Una etiqueta es un rótulo que te ayuda a encontrar las
cosas de nuevo ([etiquetas](./tags.md)). Una tarea es algo que hacer ([tareas](./tasks.md)).

## Revisar lo que sugirió tu agente

Un agente puede proponer una acción, como una respuesta. Una aplicación conectada a través de MCP
también puede guardar recuerdos y hechos. Todo esto te espera:

```text prompt
Use memo CLI to show the memories, facts and actions waiting for my review, with their evidence.
Do not confirm or approve anything; I will decide.
```

[Recuerdos y hechos](./memories.md) explica cómo confirmarlos o rechazarlos. Aprobar una acción la
convierte en una tarea para ti; Memo nunca envía nada. Un recuerdo o un hecho añadido con el comando
`memo` queda confirmado en el acto. Pide a un agente con terminal que primero te muestre el texto, y que lo
añada solo después de que estés de acuerdo.

## Respuestas para scripts y agentes

Añade `--json` a la mayoría de los comandos para obtener una respuesta que un programa pueda leer.
La respuesta en texto es para personas; los agentes y los scripts deben pedir JSON.

Cada resultado nombra su fuente con una **referencia**, como `note:12`, `document:3` o
`msg:telegram/1/77/42`. Puedes pasar una referencia a otros comandos: para etiquetarla, escribir una
nota sobre ella o usarla como evidencia. [Cómo funciona Memo](./how-it-works.md#references) explica
cada tipo.

## Elegir una cuenta

Cuando tienes varias cuentas de Telegram, MAX o correo, Memo no elige una por ti. Los comandos que
trabajan en una sola cuenta la piden con `--provider` y `--account`, y te dicen qué cuentas existen
cuando falta. Una búsqueda sin cuenta busca en todas y lo indica.
