---
title: "Escenarios paso a paso"
---

Cada escenario es una tarea habitual en orden: los comandos que hay que ejecutar, para qué sirve cada uno y qué mirar en la respuesta. Los mismos escenarios están en la terminal: `memo guide` los enumera y `memo guide <name>` muestra uno.

<a id="decision-trail" />

## Qué decidimos sobre X, en todas las fuentes

Encuentra la decisión sobre un tema y su evidencia en notas, correo, mensajes, reuniones y documentos, y regístrala una vez.

1. ```sh
   memo facts list kind:decision project:HRB
   ```

   decisiones ya registradas para el proyecto, cada una con la evidencia que cita

2. ```sh
   memo search all venue
   ```

   mensajes, correo y notas que mencionan el tema, ordenados juntos

3. ```sh
   memo search meetings venue
   ```

   lo que se dijo sobre ello en reuniones, con el pasaje para citar

4. ```sh
   drive search venue
   ```

   documentos de Drive sobre ello; los comandos de drive empiezan por tu perfil, como en drive personal search venue

5. ```sh
   memo answers create "what did we decide about the venue?" --all
   ```

   la evidencia citada en un solo paquete, para que la leas tú o tu agente

6. ```sh
   memo facts add "The team day is at the harbour venue" --kind decision --evidence msg:telegram/1/77/42 --project HRB
   ```

   guarda la decisión con su fuente, para que la próxima búsqueda la encuentre primero

Qué mirar:

- la decisión más reciente y quién la tomó
- mensajes o reuniones posteriores que la revierten
- si la decisión registrada cita la fuente que encontraste

En la terminal: `memo guide decision-trail`

<a id="person-brief" />

## Una persona en todas las herramientas

Sabe todo sobre una persona antes de una llamada — mensajes en tg y MAX, correo, notas, reuniones y documentos de Drive — con una fuente para cada línea.

1. ```sh
   memo context telegram:Kai
   ```

   sus mensajes, correo, notas y tareas abiertas en una sola respuesta, cada uno con un enlace a su fuente; email:kai@example.com la encuentra por dirección

2. ```sh
   memo facts list subject:"person:42"
   ```

   decisiones, promesas y preguntas ya registradas sobre la persona; la referencia de la persona sale de la respuesta de context

3. ```sh
   memo memories list subject:"person:42"
   ```

   preferencias y resúmenes guardados sobre la persona

4. ```sh
   memo search meetings Kai
   ```

   reuniones que la mencionan, con el pasaje para citar

5. ```sh
   tg contacts context Kai
   ```

   chats de Telegram compartidos, los últimos mensajes en cada sentido y dónde la mencionaron otros; los comandos de tg, max y drive empiezan por tu perfil, como en tg personal contacts context Kai

6. ```sh
   max contacts context Kai
   ```

   lo mismo para MAX

7. ```sh
   zm meetings context person:42
   ```

   lo que dicen de ella las reuniones de Zoom guardadas, mediante las identidades vinculadas a esa persona

8. ```sh
   drive search Kai
   ```

   documentos de Drive que la nombran

9. ```sh
   memo answers create "what is open with Kai?" --all
   ```

   un paquete de evidencia citada de todas las cuentas y las notas, listo para dárselo a tu agente

Qué mirar:

- tareas y promesas abiertas, en ambos sentidos
- el último contacto en cada canal y quién escribió por última vez
- decisiones registradas sobre la persona y cualquier cosa más reciente que contradiga alguna
- documentos que vale la pena releer antes de la llamada

memo une lo que ya guarda el almacén; las otras herramientas añaden lo que solo ellas leen. Cada paso solo lee — no se
envía ni se cambia nada.

En la terminal: `memo guide person-brief`

<a id="prepare-meeting" />

## Preparar una reunión

Llega a una reunión periódica sabiendo qué se dijo la última vez, qué sigue abierto y qué dicen los documentos del proyecto.

1. ```sh
   memo meetings prepare 85012345678 --source zoom --project HRB
   ```

   reuniones anteriores, sus intervenciones y los mensajes y correos relacionados, cada uno con una fuente

2. ```sh
   memo meetings actions list status:proposed --source zoom
   ```

   seguimientos preparados a partir de reuniones anteriores que nadie revisó

3. ```sh
   memo projects context HRB
   ```

   primero los documentos clave del proyecto, luego sus notas, hallazgos y tareas abiertas

4. ```sh
   memo answers create "what is still open for the Harbour kickoff?" --all
   ```

   un paquete citado de todas las cuentas y las notas, para que tu agente redacte una agenda

Qué mirar:

- las promesas de la última reunión y si se cumplieron
- tareas abiertas sin responsable
- la hora de la próxima reunión, que la preparación no verifica

En la terminal: `memo guide prepare-meeting`

<a id="set-up" />

## Configurar memo

Lleva notas y correo al almacén local, mantenlo al día y deja que tu agente lo lea.

1. ```sh
   memo folders add ~/notes
   ```

   da un id a tu carpeta de notas; memo nunca cambia los archivos

2. ```sh
   memo sync --only notes
   ```

   importa las notas ahora; las cuentas de correo salen del ajuste mail.accounts

3. ```sh
   memo jobs start
   ```

   sincroniza notas y correo cada 5 minutos a partir de ahora

4. ```sh
   memo doctor
   ```

   dónde guarda memo sus archivos y qué necesita atención; no se conecta a nada

5. ```sh
   memo skill install --for all
   ```

   enseña a Claude Code, Codex y Gemini CLI a usar memo

Qué mirar:

- lo que doctor dice que necesita atención
- si la búsqueda por significado está activada o solo por palabras

En la terminal: `memo guide set-up`

<a id="start-the-day" />

## Empezar el día

Mira qué te necesita hoy y qué hicieron los agentes durante la noche, sin leer cada chat ni buzón.

1. ```sh
   memo jobs status
   ```

   si el temporizador sincronizó notas y correo hace poco; aquí aparece una ejecución fallida

2. ```sh
   memo tasks agenda
   ```

   tareas vencidas o pendientes, chats donde debes una respuesta y chats donde esperas una

3. ```sh
   memo actions list status:proposed
   ```

   respuestas e invitaciones que propusieron los agentes, a la espera de tu sí o no

4. ```sh
   memo facts list status:proposed
   ```

   hechos que registraron los agentes y que no has confirmado

5. ```sh
   memo agents list --limit 20
   ```

   cada llamada a herramienta que hizo un agente, nunca con sus argumentos

Qué mirar:

- el chat sin responder más antiguo
- tareas para hoy
- propuestas que confirmar o rechazar antes de que un agente se apoye en ellas

En la terminal: `memo guide start-the-day`
