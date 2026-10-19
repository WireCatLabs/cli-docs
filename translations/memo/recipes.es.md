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

Si tienes reuniones archivadas de la misma serie periódica, pide a tu agente que las incluya:

```text prompt
Prepare for my next Harbour meeting. Find the exact meeting series in my selected Zoom account,
then gather its archived discussions, linked people and projects, notes and open tasks.
Also search the stored messages in my personal Telegram profile for Harbour over the last month.
Suggest an agenda with sources. Separate proposals from agreed actions and say what history is missing.
Do not claim that a future time is verified from the local archive.
```

El agente usa `memo meetings prepare <series-id> --source <provider>:<account>` con el ID exacto de la serie
en el proveedor, que puede mostrar la lista de reuniones de Zoom. El ID no es un número de reunión local. Esto
solo lee el historial guardado: no necesita ningún permiso nuevo de Zoom y no consulta el calendario. Usa el
calendario del proveedor para verificar una sesión futura. Una serie no archivada puede tener igualmente contexto
de mensajes seleccionados, pero Memo no puede inventar las transcripciones que faltan.

Los mensajes y el correo se incluyen solo si se seleccionan. `--context-source tg.personal` significa el perfil
`personal` guardado de `tg`; `max.personal` funciona igual. `email.work` significa un buzón llamado `work` en los
ajustes de correo de Memo. El perfil o el buzón ya deben estar guardados. Repite la opción para hasta ocho cuentas
e indica `--context-query Harbour`. Cada palabra literal debe coincidir; `OR` no es un operador de alias. Usa
consultas separadas para los nombres alternativos. Esta selección no incluye notas de archivos ni documentos;
léelos por separado con el [contexto del proyecto](./people.md#organizations-and-projects) y la [búsqueda](./search.md).

Para un periodo fijo, indica marcas de tiempo con zona horaria en `--context-since-time` y en
`--context-before-time`, que es exclusivo. Por defecto se cubren los catorce días anteriores al inicio de la
preparación; una ventana de comunicaciones no puede superar los noventa días. `--history-since-time` controla por
separado las reuniones anteriores. Añade `--json` para obtener la evidencia citada, el contexto enlazado y la
cobertura. Cada fuente de comunicaciones informa del estado de su índice y, cuando es posible, de `next_cursor`;
continúa con `--context-source tg.personal=<cursor>` con la misma consulta y la misma ventana explícita. Si
`restart_required` es true, aumenta `--bytes` y empieza de nuevo; no supongas que los extractos mostrados cubren
todas las coincidencias. La preparación no acepta ni asigna nada.

## Revisar las decisiones y los seguimientos de una reunión

Úsalo cuando tus transcripciones de reuniones ya estén archivadas. Tu agente puede leer la evidencia en Memo,
sugerir qué importa y dejar el resultado para tu decisión:

```text prompt
Review the recent Harbour meetings in my selected Zoom account. Look up the project's existing
aliases and tags first. Search the stored transcripts and read the surrounding passages.
Show observed attendees separately from people merely mentioned. Propose decisions, key statements
and follow-up tasks, citing each exact passage. Leave unknown dates and assignees blank, distinguish
explicit commitments from inferred tasks, and leave everything proposed for my review.
```

Para las listas de asistentes, el agente lee los metadatos archivados de la reunión con `zm meetings show`; las
etiquetas de hablante de la transcripción por sí solas no son una lista de asistencia. El agente usa
`memo search meetings` y `memo meetings passage`, y luego prepara un lote con `memo meetings actions add` usando
las referencias de intervención y las huellas. Esto crea una propuesta de revisión; no crea de inmediato hechos ni
tareas aceptados. Los vínculos confirmados entre reuniones y proyectos deben existir ya para los hallazgos del
proyecto. Si faltan, el agente debe mostrar los vínculos candidatos para revisarlos. Usa etiquetas existentes en
lugar de crear sinónimos; `memo vocabulary check` puede sugerir nombres parecidos, pero la similitud no establece
que dos etiquetas signifiquen lo mismo.

Revisa el lote con `memo meetings actions list status:proposed` y `memo meetings actions show`. Comprueba cada
afirmación con su fuente antes de confirmar los identificadores de hallazgo elegidos con la huella actual del lote.
Solo tú puedes confirmar o rechazar un lote de hallazgos de reunión; un agente no puede aprobar su propio trabajo.
Las tareas aceptadas usan las claves numeradas del proyecto. Repetir una clave de lote idéntica lo reintenta sin
duplicar la propuesta; cambiar el contenido requiere una clave nueva.

Para preparar, pide al agente que combine los pasajes de reuniones anteriores con los hechos aceptados y las
tareas abiertas del proyecto (`memo projects context`) y con los mensajes, el correo y las notas de los
participantes (`memo context`). `memo meetings prepare` reúne un historial guardado y acotado de la serie y el
contexto enlazado; no localiza un evento de calendario próximo ni deduce la pertenencia a un proyecto. La respuesta debe mostrar sus fuentes y el historial que falta antes de
sugerir una agenda.

Si no aparece ningún pasaje, comprueba la cuenta seleccionada y la cobertura del archivo, y prueba los alias del
proyecto sin filtro de proyecto. La [búsqueda de reuniones](./search.md#search-stored-meetings) explica estos límites.

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
