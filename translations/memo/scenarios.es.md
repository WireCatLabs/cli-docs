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
   drive personal search venue
   ```

   documentos de Drive sobre ello

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
   tg personal contacts context Kai
   ```

   chats de Telegram compartidos, los últimos mensajes en cada sentido y dónde la mencionaron otros

6. ```sh
   max personal contacts context Kai
   ```

   lo mismo para MAX

7. ```sh
   zm personal meetings context person:42
   ```

   lo que dicen de ella las reuniones de Zoom guardadas, mediante las identidades vinculadas a esa persona

8. ```sh
   drive personal search Kai
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

<a id="project-state" />

## En qué punto está este proyecto

Responde quién debe qué, a quién le toca en cada chat y qué se ha quedado en silencio, a partir del almacén, y después prepara lo que confirmaste para el propietario.

1. ```sh
   memo projects context HRB
   ```

   documentos clave, chats y personas enlazados, y lo que ya espera la revisión del propietario

2. ```sh
   memo projects status HRB --context-query 1C
   ```

   por cada chat, el último mensaje, a quién le toca, las preguntas abiertas, los importes con su sentido y qué chats leer después

3. ```sh
   memo projects status HRB --compact
   ```

   la misma respuesta, una línea por fila, cuando va al contexto de un agente

4. ```sh
   max personal messages list --compact -- -900 "date>=2026-10-19"
   ```

   lee solo los chats que nombra next, desde la fecha que da, una línea por mensaje

5. ```sh
   memo projects evidence HRB --source all --context-query "1 200"
   ```

   la huella de cada mensaje que vas a citar, que la preparación necesita

6. ```sh
   memo projects actions add -
   ```

   prepara los pagos y las promesas que leíste, cada uno citando su mensaje, por stdin. Uno pagado nombra en supersedes la factura que liquida

Qué mirar:

- el dinero marcado como pattern es una coincidencia de palabras. Lee el mensaje citado antes de prepararlo
- un chat guardado solo en parte. Sincronízalo con la línea que da next antes de fiarte de "nada abierto"
- next nombra como mucho dos chats. Lee esos, no todos los chats
- el texto de los mensajes se queda en la respuesta. Nunca lo escribas en un archivo

`projects status` lee cada cuenta en la que están sus chats enlazados y las muestra en `meta.accounts`. No elige ningún
perfil de mensajería: cuando hay varios con sesión iniciada en la cuenta de un chat, el paso dice `<profile>` y `missing` los
nombra. `--sync-profile max=<profile>` elige uno. Todos los pasos leen, salvo el último, que solo propone.

En la terminal: `memo guide project-state`

<a id="set-up" />

## Configurar memo

Lleva tus notas al almacén local, mantenlo al día y deja que tu agente las lea junto con el correo que sincroniza el CLI mail.

1. ```sh
   memo folders add ~/notes
   ```

   da un id a tu carpeta de notas; memo nunca cambia los archivos

2. ```sh
   memo sync --only notes
   ```

   importa las notas ahora. El CLI mail sincroniza el correo en el mismo almacén (mail &lt;profile> sync)

3. ```sh
   memo jobs start
   ```

   sincroniza las notas y prepara el correo nuevo para la búsqueda cada 5 minutos a partir de ahora

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
