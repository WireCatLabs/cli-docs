---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `tg guide` los enumera y `tg guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `tg <profile> …`.

<a id="agent-without-send" />

## Dar al agente tu cuenta, nunca el botón de enviar

Un agente lee tu Telegram y prepara borradores mientras se rechaza cualquier envío.

1. ```sh
   tg mcp setup claude-code --permission messages.send=deny --allow-writes
   ```

   añade este perfil a Claude Code; su servidor rechaza messages send aunque el perfil lo permita, y --allow-writes reconoce las otras herramientas que pueden escribir

2. ```sh
   tg schedule agent morning claude "run the daily follow-up review: tg skill show follow-ups" --at 08:00
   ```

   una revisión cada mañana de un agente que se ejecuta con TG_READ_ONLY=1, así que prepara borradores y nunca envía

3. ```sh
   tg sends list
   ```

   cada intento de envío, también los rechazados, para ver qué intentó el agente

Qué mirar:

- las líneas rechazadas en sends list y qué comando las pidió
- la última ejecución del horario en tg schedule list

En la terminal: `tg guide agent-without-send`

<a id="catch-up" />

## Ponerse al día tras un día fuera

Sabe qué cambió, quién espera tu respuesta y qué prometiste, sin abrir cada chat.

1. ```sh
   tg review 'date>1d' --transcribe
   ```

   todos los mensajes desde ayer en los chats que cambiaron, también los tuyos, con las notas de voz como texto

2. ```sh
   tg review --unanswered 4h
   ```

   preguntas para ti que nadie respondió en cuatro horas o más

3. ```sh
   tg tasks agenda
   ```

   tareas para hoy, respuestas que debes y respuestas que esperas

Qué mirar:

- quién preguntó primero y hace cuánto
- promesas en tus propios mensajes que aún no tienen tarea

`review` lee el almacén local y los chats que cambiaron; por defecto no marca nada como leído; `--mark-read` lo pide.

En la terminal: `tg guide catch-up`

<a id="find-what-was-said" />

## Encontrar lo que alguien dijo

Encuentra un mensaje que recuerdas a medias, léelo en contexto y comparte un enlace.

1. ```sh
   tg search all invoice
   ```

   mensajes y notas en una sola búsqueda, la mejor coincidencia primero; añade --offline para no salir de este ordenador

2. ```sh
   tg messages context Team 1234
   ```

   el mensaje y lo que hay antes y después, a partir del chat y el id del resultado

3. ```sh
   tg messages link Team 1234
   ```

   un enlace al mensaje para pegarlo en una nota o una tarea

Qué mirar:

- el chat y la hora de cada resultado
- el ref del resultado que quieres, que usan los comandos siguientes

En la terminal: `tg guide find-what-was-said`

<a id="searchable-files" />

## Hacer que los archivos de un chat se puedan buscar

Busca palabras dentro de los PDF y documentos que te enviaron, no solo en los mensajes.

1. ```sh
   tg messages sync Team
   ```

   pone al día el historial del chat en el almacén local

2. ```sh
   tg attachments extract --chat Team --download --output-dir tg-files
   ```

   guarda los archivos aún no descargados y conserva su texto en el almacén local

3. ```sh
   tg search all invoice --offline
   ```

   el texto de los archivos ya aparece con los mensajes, sin consultar a Telegram

Qué mirar:

- archivos cuyo texto no se pudo leer; los escaneos necesitan --ocr
- el cursor de la respuesta cuando quedan más archivos por leer

En la terminal: `tg guide searchable-files`

## Con otras herramientas

Estos escenarios de Memo también usan `tg`:

- [Una persona en todas las herramientas](https://wirecat.dev/en/docs/memo/scenarios#person-brief): `memo guide person-brief`
