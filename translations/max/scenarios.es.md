---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `max guide` los enumera y `max guide <name>` muestra uno.

Los comandos que usan una cuenta empiezan por tu perfil, el nombre que diste a la cuenta al iniciar sesión: `max <profile> …`.

<a id="agent-on-a-timer" />

## Un agente lee MAX según un horario

Recibe cada mañana un resumen de lo que espera tu respuesta, de un agente que no puede enviar.

1. ```sh
   max schedule command sync-chats --every 2h -- messages sync --all
   ```

   mantiene al día el historial de cada chat en el almacén local, para que el agente lo lea sin conexión

2. ```sh
   max schedule agent morning claude "run the daily follow-up review: max skill show follow-ups" --at 08:30
   ```

   inicia el agente a las 08:30 con MAX_READ_ONLY=1, así que lee y prepara borradores y nunca envía

3. ```sh
   max schedule list
   ```

   cuándo se ejecuta cada horario y cómo fue su última ejecución

Qué mirar:

- el estado de la última ejecución de ambos horarios
- la respuesta guardada del agente y el aviso de que está lista

El agente se ejecuta con el bloqueo, así que cualquier envío que intente se rechaza antes de llegar a MAX. Elimina un horario con
`max schedule remove <name>`.

En la terminal: `max guide agent-on-a-timer`

<a id="catch-up" />

## Ponerse al día tras un día fuera

Sabe quién espera tu respuesta y qué prometiste, sin abrir cada chat.

1. ```sh
   max review date>1d --unanswered 4h
   ```

   preguntas para ti que nadie respondió en cuatro horas, en todos los chats

2. ```sh
   max inbox --new
   ```

   mensajes de otras personas llegados desde tu última comprobación, cada uno una vez

3. ```sh
   max tasks list
   ```

   preguntas, peticiones y promesas que guardó la revisión, las más antiguas primero

Qué mirar:

- quién preguntó primero y hace cuánto
- tareas cuyo mensaje de origen es una promesa tuya

`review` e `inbox` leen MAX y guardan lo que leen, así que `tasks list` y las búsquedas posteriores trabajan con el almacén
local. Añade `--offline` a cualquiera de ellos para leer solo lo ya guardado.

En la terminal: `max guide catch-up`

<a id="find-what-was-said" />

## Encontrar lo que alguien dijo

Recupera un mensaje, un archivo o una nota de voz cuando solo recuerdas una palabra o a la persona.

1. ```sh
   max search all "invoice"
   ```

   mensajes, notas, el texto de archivos y transcripciones de voz en una sola búsqueda, la mejor coincidencia primero

2. ```sh
   max contacts timeline Anna
   ```

   todo lo que una persona escribió o donde se la mencionó, lo más reciente primero, desde el almacén

3. ```sh
   max messages context Team 1234
   ```

   el mensaje al que apunta un resultado, con lo que hay antes y después

Qué mirar:

- el chat y la hora de cada resultado
- el localizador msg, para citarlo o abrir el mensaje

Una búsqueda solo encuentra lo que guarda el almacén. Ejecuta `max messages sync --all` una vez, o `max schedule command` con un temporizador,
para que el historial antiguo también se pueda encontrar.

En la terminal: `max guide find-what-was-said`

<a id="post-as-a-bot" />

## Publicar como tu bot

Envía un mensaje a un grupo como tu bot, mediante la Bot API oficial de MAX, no desde tu propia cuenta.

1. ```sh
   max bot auth set
   ```

   comprueba el token del bot con MAX y lo guarda; escríbelo en la solicitud oculta o pásalo por stdin

2. ```sh
   max bot chats list
   ```

   los chats que este bot ha visto en este equipo, para elegir a cuál escribir

3. ```sh
   max bot messages send Team "the release is out"
   ```

   envía el mensaje como el bot; sin el texto, se lee de stdin

Qué mirar:

- qué bot indica `bot auth set`, antes de enviar nada
- el id del mensaje que devuelve el envío, para editarlo o fijarlo después

Un bot necesita su propio token de MAX; no se usa tu inicio de sesión personal. `max bot recipients add` limita en qué chats
puede escribir el bot.

En la terminal: `max guide post-as-a-bot`

## Con otras herramientas

Estos escenarios de Memo también usan `max`:

- [Una persona en todas las herramientas](https://wirecat.dev/en/docs/memo/scenarios#person-brief): `memo guide person-brief`
