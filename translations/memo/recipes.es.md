---
title: "Recetas"
---

Esta página te da tareas completas para encargar a tu agente de IA cuando Memo ya tiene tus notas, tu
correo o tus mensajes. Copia una petición en tu agente y cambia los nombres y temas por los tuyos.
Cada una termina con algo que puedes comprobar: fuentes que puedes abrir o una lista que espera tu
decisión. Guardar un registro cambia el almacén local de Memo; exportar una nota crea un archivo.
Estas peticiones no piden al agente que envíe mensajes.

## Prepararte para una reunión con alguien

```text prompt
Usa memo CLI para prepararme para una reunión con Kai Sample mañana.
Muestra nuestros mensajes y correos recientes, mis notas sobre Kai y las tareas abiertas entre nosotros.
Dame tres puntos que tratar, cada uno con su fuente.
```

Tu agente ejecuta `memo context` para la persona y lee las fuentes. Comprueba los puntos con las
fuentes que muestra. Si una parte está vacía, puede que los chats no estén descargados o que las
cuentas no estén vinculadas ([personas](./people.md)).

Si tienes reuniones archivadas de la misma serie periódica, pide a tu agente que las incluya:

```text prompt
Prepárame para mi próxima reunión de Harbour. Encuentra la serie exacta en mi cuenta de Zoom elegida
y reúne sus conversaciones archivadas, las personas y proyectos vinculados, las notas y tareas abiertas.
Busca también mensajes guardados sobre Harbour en mi perfil personal de Telegram durante el último mes.
Sugiere una agenda con fuentes. Separa propuestas de acciones acordadas e indica qué historial falta.
No afirmes que el archivo local verifica la hora de una reunión futura.
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
Revisa las reuniones recientes de Harbour en mi cuenta de Zoom elegida. Busca primero los alias
y etiquetas existentes del proyecto. Busca en las transcripciones guardadas y lee los pasajes cercanos.
Muestra los asistentes observados separados de las personas solo mencionadas. Propón decisiones,
declaraciones clave y tareas de seguimiento citando cada pasaje exacto. Deja sin rellenar fechas
y responsables desconocidos, distingue compromisos explícitos de tareas inferidas y deja todo propuesto para mi revisión.
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

## Revisar hechos y seguimientos de un proyecto

Usa este recorrido cuando la información del proyecto esté repartida entre mensajes guardados,
correo importado y archivos. Memo conserva las sugerencias del agente con sus fuentes para revisar
documentos clave, hechos y seguimientos juntos. El proyecto debe existir;
[sus nombres y alias](./people.md#organizations-and-projects) ayudan al agente a reutilizarlo.
Los datos de las cuentas elegidas ya deben estar importados o sincronizados.

```text prompt
Usa memo CLI para recopilar información del proyecto Harbour de mi perfil personal de Telegram
y mi correo de trabajo. Lee primero los documentos clave y reutiliza los alias registrados del proyecto.
Busca los últimos 60 días, muestra las cuentas y fechas elegidas e indica qué historial falta o está incompleto.
Lee las fuentes citadas antes de sugerir hechos o seguimientos. Deja sin rellenar las fechas y responsables
desconocidos y distingue los compromisos explícitos de las posibles tareas inferidas.
Propón los documentos clave y los hallazgos para mi revisión. Muestra las propuestas con el contexto de sus fuentes.
No confirmes ni rechaces nada.
```

El agente empieza con `memo projects context` y recopila fuentes citadas con
[`memo projects evidence`](./search.md#gather-a-projects-meeting-context). Cada nombre, alias o consulta
adicional se busca por separado. Una coincidencia de nombre no establece pertenencia, identidad ni
un acuerdo. El agente prepara los hallazgos elegidos de mensajes y documentos con
`memo projects actions add`, usando las referencias exactas y huellas de las fuentes devueltas por
la recopilación. Las huellas son valores de comprobación para detectar cambios posteriores de la fuente.
Esto crea una propuesta, no hechos o tareas aceptados. Un reintento exacto reutiliza
la clave y los datos del lote; si los hallazgos cambian, hace falta una clave nueva.

Para hallazgos de transcripciones, usa la [revisión de reuniones](#review-a-meetings-decisions-and-follow-ups),
que acepta referencias a fragmentos y comprueba los vínculos confirmados entre reunión y proyecto.
Los hallazgos de proyecto aceptan referencias `msg:` y `document:`; `meeting:` y `note:` no son intercambiables.

Inspecciona las propuestas en tu terminal, sustituyendo `HRB` por la clave, nombre o alias del proyecto:

```sh
memo projects actions list HRB --limit 5 --page 1 --json
memo projects actions list HRB --brief
```

La vista normal incluye fragmentos citados y mensajes o párrafos de documentos cercanos. Lee la fuente completa cuando un
fragmento no baste para juzgar el hallazgo. `--brief` conserva referencias y estado de las fuentes sin
ese contexto. Las sugerencias de documentos clave no tienen una huella de texto guardada: su estado
es `untracked`, así que vuelve a leerlas antes de decidir. Un hallazgo sí conserva su propia huella
para comprobar el texto citado. `--limit` cuenta lotes de hallazgos; los documentos clave propuestos se añaden en la
primera página. Usa `--page 2` y las siguientes mientras el resultado indique que hay más.
La recopilación usa puntos de continuación; esta lista de revisión usa números de página.

Comprueba el significado, proyecto, fecha y responsable de cada hallazgo con su evidencia. Una cita
exacta o una huella sin cambios no demuestra que la conclusión se desprenda del texto. Si una fuente
cambió o desapareció, vuelve a leerla y prepara una propuesta nueva para los hallazgos afectados.
Puedes aceptar los hallazgos cuyo proyecto, responsable y texto citado no hayan cambiado. Algunos
lotes antiguos exigen que todas las citas sigan iguales; si uno no permite confirmar, prepara los
hallazgos que aún quieras en un lote nuevo. Puedes rechazar un lote obsoleto.

El propietario puede confirmar un documento clave como `key:12` o aceptar hallazgos elegidos de un lote.
En este ejemplo, sustituye `7`, ambos ID y `BATCH_FINGERPRINT` por los valores de la lista de revisión:

```sh
memo projects actions confirm HRB 7 launch-status draft-check --fingerprint BATCH_FINGERPRINT
```

Confirmar crea los hallazgos elegidos y rechaza los demás hallazgos nuevos del lote. Elige el conjunto
completo que quieres aceptar antes de confirmar; deja abierto un lote si quedan dudas.
`projects actions reject` rechaza todos los hallazgos nuevos del lote. Después de decidir,
`memo projects context HRB` muestra hechos aceptados, documentos clave y tareas numeradas abiertas;
`projects actions list HRB status:reviewed` muestra decisiones anteriores sobre lotes.

De forma predeterminada, un agente puede decidir propuestas del proyecto con un motivo registrado.
La petición anterior deja explícitamente esa decisión en tus manos. Para exigir decisiones del propietario
en este recorrido, establece [`agent_decisions` en `false`](./configuration.md#agent_decisions): rechaza
las confirmaciones y rechazos del agente por CLI y MCP. Leer y preparar propuestas sigue disponible.
El recorrido separado de reuniones sigue dejando la confirmación al propietario.

Después, [prepara una agenda con el contexto aceptado del proyecto](#prepare-for-a-meeting-with-someone).

## Conservar anotaciones seleccionadas de un proyecto

Usa una instantánea de anotaciones seleccionadas para inspeccionar o reconstruir los alias, hechos
y vínculos genéricos de un proyecto en otro almacén preparado. Obtendrás un archivo JSON privado y
una vista previa de los conflictos de destino. Se omiten notas, vínculos específicos entre reuniones y proyectos,
tareas, recuerdos, etiquetas y hallazgos; conserva tu copia habitual del archivo para esos datos.
Los documentos, mensajes y personas externos se referencian, sin copiarlos ni recrearlos.

```text prompt
Usa memo CLI para exportar las anotaciones seleccionadas del proyecto Harbour a un archivo nuevo que yo elija.
Muestra la cobertura y los recuentos. Ayúdame a preparar correspondencias explícitas con otro almacén de prueba existente,
comprueba después el traslado y explica las fuentes ausentes o los conflictos. Déjame la restauración a mí.
```

```sh
memo projects annotations export HRB --output harbour-annotations.json --json
memo projects annotations check harbour-annotations.json --target-store ./trial/wirecat.db --project project:2 --bindings bindings.json --json
```

La carpeta superior del archivo debe existir. La exportación rechaza archivos existentes y crea uno
nuevo con permisos privados. Conserva el estado propuesto y guarda hashes del texto de fuentes
externas. `coverage` enumera todos los aspectos omitidos. Nunca elimina ni reinicia el proyecto.

Prepara el destino por separado, con la clave y el nombre del proyecto iguales a los de la instantánea.
Las fuentes y autores que vincules deben existir allí, y los hashes de las fuentes de texto deben
coincidir. `project:2` es una referencia de destino inventada: usa la real de `MESSAGING_STORE=./trial/wirecat.db memo projects list --json`.
`bindings.json` asocia la referencia del proyecto y cada `external[].ref` de la instantánea con una
referencia de destino explícita. Por ejemplo:

```json
{"project:1":"project:2","bot:3":"bot:7","document:4":"document:9"}
```

Estos ID son ilustrativos. Leer una referencia no establece identidad: elige correspondencias entre
los registros que comprobaste. Los nombres nunca unen personas automáticamente. La comprobación debe
mostrar `ready: true`, sin correspondencias ausentes, texto cambiado ni conflictos de descripción,
nombre o alias de proyecto. Las anotaciones seleccionadas existentes son un conflicto aunque parezcan
iguales. Si se supera el presupuesto de lectura, se rechaza la operación en vez de revisar solo una
parte. Los contadores cubren la lectura seleccionada del SDK, no la E/S física del disco. Resolver
una clave, nombre o alias lee otro catálogo acotado; pasa `project:<id>` para leer el grafo directamente.

Después de comprobar la vista previa, el propietario puede ejecutar:

```sh
memo projects annotations restore harbour-annotations.json --target-store ./trial/wirecat.db --project project:2 --bindings bindings.json --fingerprint PREVIEW_FINGERPRINT --json
```

Sustituye `PREVIEW_FINGERPRINT` por la huella exacta de la comprobación correcta. La restauración
comprueba de nuevo, aplica los cambios juntos y los revierte por completo si falla. Una fuente o un
destino cambiado requiere otra comprobación. Repetir una restauración completada en un destino ocupado
se rechaza sin añadir duplicados. Los hechos históricos aceptados siguen aceptados y los propuestos
siguen propuestos. Memo rechaza la restauración cuando el entorno identifica al llamante como agente:
es una política del CLI, no una barrera de acceso del sistema operativo. MCP solo ofrece lecturas de
instantánea y vista previa; las llamadas siguen creando su entrada normal de auditoría.

Cuando la comprobación sea correcta y los recuentos coincidan con lo esperado, vuelve a la [revisión del proyecto](#review-project-facts-and-follow-ups)
para las propuestas actuales; la instantánea no decide sobre ellas.

## Encontrar dónde se decidió algo

```text prompt
Usa memo CLI para encontrar dónde decidimos la fecha de lanzamiento del proyecto Harbour.
Busca en mis notas, correo y mensajes. Cita el texto y muestra la fuente de cada resultado.
Si no encuentras nada, dime dónde y cómo buscaste.
```

Tu agente usa `memo search all` y, si hace falta, la búsqueda para un solo tipo de fuente. Una
respuesta vacía significa que esa búsqueda no devolvió coincidencias; comprueba su cobertura de
fuentes antes de concluir que no se decidió nada ([búsqueda](./search.md)).

## Convertir peticiones en tareas

```text prompt
Usa memo CLI para encontrar mensajes y correos de la última semana en los que me pidieron hacer algo.
Enuméralos con sus fuentes. Crea tareas solo para los que yo elija.
```

Tu agente busca, te muestra las peticiones y ejecuta `memo tasks add` para las que eliges. Consulta
tus tareas con `memo tasks list` ([tareas](./tasks.md)).

## Reunir las notas de un proyecto

```text prompt
Usa memo CLI para encontrar mis notas, correos y mensajes sobre el proyecto Harbour.
Etiqueta con harbour los que yo confirme y luego muestra todo lo que tenga esa etiqueta.
```

Después, `memo search all 'tag:harbour'` los encuentra, y una etiqueta en una carpeta también cubre
las notas nuevas ([etiquetas](./tags.md)).

## Recordar una preferencia, con su fuente

```text prompt
Usa memo CLI para encontrar lo que Kai Sample dijo sobre los horarios de reunión.
Muéstrame el recuerdo que guardarías y el mensaje en que se basa.
Guárdalo con el mensaje como evidencia solo después de que yo dé mi aprobación.
```

Un recuerdo que registras directamente queda confirmado; uno añadido por un agente sigue propuesto
para tu revisión. Comprueba la afirmación y su fuente antes de confirmarlo. Después,
`memo memories stale` marca recuerdos que ya no son válidos ([recuerdos](./memories.md)).

## Registrar una decisión de un chat

```text prompt
Usa memo CLI para encontrar la decisión sobre el lugar de la reunión en el chat de Harbour.
Muéstrame primero la decisión y el mensaje. Tras mi aprobación, regístrala como un hecho de decisión
con el mensaje como evidencia en el proyecto Harbour.
```

Un hecho que registras directamente queda aceptado; uno añadido por un agente sigue propuesto.
La [revisión del proyecto](#review-project-facts-and-follow-ups) reúne los hallazgos citados antes de
decidir. Si un hecho sustituye a una decisión anterior, pide al agente que lo indique con `--supersedes`.

## Revisión semanal

```text prompt
Usa memo CLI para darme una revisión semanal: tareas abiertas por proyecto, tareas listas para empezar
y los recuerdos, hechos y acciones que esperan mi revisión. No apruebes ni confirmes nada.
```

Tu agente combina `memo tasks list`, `memo tasks list project:HRB ready:true` y las listas de revisión de
[Recuerdos y hechos](./memories.md). Decide tú cada elemento.

## Escribir un resumen en tu bóveda

```text prompt
Usa memo CLI para escribir una nota breve del proyecto Harbour que resuma lo que sé
y cite las fuentes. Muéstrame la nota y luego expórtala a mi carpeta de notas.
```

Tu agente escribe la nota con `memo notes add --subject project:…` y la exporta con
`memo notes export` ([notas](./notes.md#save-your-notes-as-files)). Memo nunca sobrescribe un archivo
que editaste.

## Preguntar solo con fuentes

```text prompt
Usa memo CLI para recopilar las fuentes del presupuesto de Harbour con memo ask, usando las palabras clave
"Harbour budget". Responde solo con esas fuentes y cita cada una.
```

`memo ask` reúne las fuentes; tu agente responde. Memo no envía nada a un proveedor de IA a menos que
configures uno y lo permitas ([búsqueda](./search.md#give-your-agent-the-sources)).

## Ejecutarlo de forma programada

En Linux, `memo auto start` mantiene al día tus notas y tu correo. Para ejecutar una receta cada mañana,
usa la programación propia de tu agente o un programador de tareas de tu ordenador que inicie tu
agente con la petición.
