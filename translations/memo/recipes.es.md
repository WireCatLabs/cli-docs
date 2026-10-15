---
title: "Recetas"
---

Esta página te da tareas completas para encargar a tu agente de IA cuando Memo ya tiene tus notas, tu
correo o tus mensajes. Copia una petición en tu agente y cambia los nombres y temas por los tuyos.
Cada una termina con algo que puedes comprobar: fuentes que puedes abrir o una lista que espera tu
decisión. Ninguna envía un mensaje ni cambia tus archivos.

## Prepararte para una reunión con alguien

```text prompt
Use memo CLI to prepare me for a meeting with Kai Sample tomorrow.
Show our recent messages and mail, my notes about Kai and the open tasks between us.
Give me three points to raise, each with its source.
```

Tu agente ejecuta `memo context` para la persona y lee las fuentes. Comprueba los puntos con las
fuentes que muestra. Si una parte está vacía, puede que los chats no estén descargados o que las
cuentas no estén vinculadas ([personas](./people.md)).

## Encontrar dónde se decidió algo

```text prompt
Use memo CLI to find where we decided the launch date for the Harbour project.
Search my notes, mail and messages. Quote the text and show the source of each result.
If you find nothing, tell me what you searched.
```

Tu agente usa `memo search all` y, si hace falta, la búsqueda para un solo tipo de fuente. Una
respuesta vacía solo significa que el almacén local no tiene ninguna coincidencia
([búsqueda](./search.md)).

## Convertir peticiones en tareas

```text prompt
Use memo CLI to find messages and emails from the last week where someone asked me to do something.
List them with their sources. Create a task only for the ones I choose.
```

Tu agente busca, te muestra las peticiones y ejecuta `memo tasks add` para las que eliges. Consulta
tus tareas con `memo tasks list` ([tareas](./tasks.md)).

## Reunir las notas de un proyecto

```text prompt
Use memo CLI to find my notes, emails and messages about the Harbour project.
Tag the ones I confirm with harbour, then show everything tagged harbour.
```

Después, `memo search all 'tag:harbour'` los encuentra, y una etiqueta en una carpeta también cubre
las notas nuevas ([etiquetas](./tags.md)).

## Recordar una preferencia, con su fuente

```text prompt
Use memo CLI to find what Kai Sample said about meeting times.
Show me the memory you would save and the message it is based on.
Save it with the message as evidence only after I agree.
```

Un recuerdo añadido con el comando `memo` se confirma al momento, así que la petición pide a tu agente
que primero te lo muestre. Más adelante, `memo memories stale` lo marca cuando ya no es válido
([recuerdos](./memories.md)).

## Registrar una decisión de un chat

```text prompt
Use memo CLI to find the decision about the venue in the Harbour chat.
Show me the decision and the message first. After I agree, record it as a decision fact
with the message as evidence, in the Harbour project.
```

Un hecho añadido con el comando `memo` se acepta al momento, así que la petición pide a tu agente que
primero te lo muestre. Si sustituye a una decisión anterior, pide a tu agente que lo indique con
`--supersedes`.

## Revisión semanal

```text prompt
Use memo CLI to give me a weekly review: open tasks by project, tasks that are ready to start,
and the memories, facts and actions waiting for my review. Do not approve or confirm anything.
```

Tu agente combina `memo tasks list`, `memo tasks list project:HRB ready:true` y las listas de revisión de
[Recuerdos y hechos](./memories.md). Decide tú cada elemento.

## Escribir un resumen en tu bóveda

```text prompt
Use memo CLI to write a short note about the Harbour project that summarises what I know,
with the sources it is based on. Show me the note, then export it to my vault.
```

Tu agente escribe la nota con `memo notes add --subject project:…` y la exporta con
`memo notes export` ([notas](./notes.md#save-your-notes-as-files)). Memo nunca sobrescribe un archivo
que editaste.

## Preguntar solo con fuentes

```text prompt
Use memo CLI to collect the sources about the Harbour budget with memo ask, using the key words
"Harbour budget". Answer only from those sources and cite each one.
```

`memo ask` reúne las fuentes; tu agente responde. Memo no envía nada a un proveedor de IA a menos que
configures uno y lo permitas ([búsqueda](./search.md#give-your-agent-the-sources)).

## Ejecutarlo de forma programada

En Linux, `memo auto start` mantiene al día tus notas y tu correo. Para ejecutar una receta cada mañana,
usa la programación propia de tu agente o un programador de tareas de tu ordenador que inicie tu
agente con la petición.
