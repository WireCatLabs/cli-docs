---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `wa guide` los enumera y `wa guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `wa <profile> …`.

<a id="agent-without-send" />

## Dar al agente tu cuenta, nunca el botón de enviar

Un agente lee tu WhatsApp y prepara borradores mientras se rechaza cualquier envío.

1. ```sh
   wa mcp add claude-code --permission messages.send=deny --allow-writes
   ```

   añade este perfil a Claude Code; su servidor rechaza messages send aunque el perfil lo permita, y --allow-writes reconoce las otras herramientas que pueden escribir

2. ```sh
   wa sends list
   ```

   cada intento de envío, también los rechazados, para ver qué intentó el agente

Qué mirar:

- las líneas rechazadas en sends list y qué comando las pidió

WhatsApp bloquea los números que envían mensajes en masa o a desconocidos, así que enviar sigue siendo decisión tuya.
Para un script, `WA_READ_ONLY=1` hace lo mismo durante una ejecución: lee y sincroniza, y rechaza cualquier envío,
edición o borrado.

En la terminal: `wa guide agent-without-send`

<a id="catch-up" />

## Ponerse al día tras un día fuera

Sabe qué cambió, quién espera tu respuesta y qué prometiste, sin abrir cada chat.

1. ```sh
   wa review 'date>1d' --transcribe
   ```

   todos los mensajes desde ayer en los chats que cambiaron, también los tuyos, con las notas de voz como texto

2. ```sh
   wa review --unanswered 4h
   ```

   preguntas para ti que nadie respondió en cuatro horas o más

3. ```sh
   wa tasks agenda
   ```

   tareas para hoy, respuestas que debes y respuestas que esperas

Qué mirar:

- quién preguntó primero y hace cuánto
- promesas en tus propios mensajes que aún no tienen tarea

`review` lee lo que `serve` guardó en el almacén local y no marca nada como leído. Mantén
`wa personal server install` en marcha, para que el almacén tenga lo que llegó mientras no estabas.

En la terminal: `wa guide catch-up`

<a id="find-what-was-said" />

## Encontrar lo que alguien dijo

Recupera un mensaje, un archivo o una nota de voz cuando solo recuerdas una palabra o a la persona.

1. ```sh
   wa search all invoice
   ```

   mensajes y notas en una sola búsqueda, la mejor coincidencia primero; añade --offline para no salir de este equipo

2. ```sh
   wa contacts events Anna
   ```

   todo lo que una persona escribió o donde se la mencionó, lo más reciente primero, desde el almacén

3. ```sh
   wa messages context Team 1234
   ```

   el mensaje al que apunta un resultado, con lo que vino antes y después

Qué mirar:

- el chat y la hora de cada resultado
- el ref del resultado que quieres, que usan los comandos siguientes

Una búsqueda solo encuentra lo que tiene el almacén: el historial que el teléfono envió al vincular y lo que `serve`
guardó desde entonces. `wa personal messages sync <chat>` pide al teléfono los mensajes antiguos de un chat, página a
página; el teléfono solo responde con el historial reciente.

En la terminal: `wa guide find-what-was-said`
