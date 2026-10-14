---
title: "Búsqueda y fuentes"
---

Encuentra lo dicho en reuniones guardadas, lee el pasaje exacto con una referencia, recupera el
contexto de una persona, vincula eventos y personas y revisa una tarea basada en su fuente.

<a id="search-stored-meetings" />

## Empieza con una pregunta

```text prompt
Busca discusiones de Research Example en reuniones guardadas. Muestra fechas y pasajes sobre la decisión de lanzamiento. Incluye referencias e indica texto o periodos ausentes.
```

El agente debe identificar la reunión, abrir el pasaje y distinguir un participante registrado de
una persona solo mencionada. Lee las intervenciones cercanas antes de aceptar una decisión o promesa.
Una búsqueda vacía no demuestra que no hubo discusión.

Busca en las reuniones guardadas:

```sh
zm search meetings "example plan" --json
zm search meetings "example plan" --limit 20 --cursor <next_cursor> --json
```

La búsqueda lee el perfil guardado, no el historial actual de Zoom. Primero [descarga o importa las reuniones que faltan](./archive.md).
`search meetings` indexa las nuevas entradas antes de leer; no hay un paso separado de indexación.
Todas las palabras deben coincidir por prefijos literales o formas guardadas. Por defecto se usan raíces
inglesas, rusas y españolas; pueden cambiarse o desactivarse. La consulta usa palabras normales, sin operadores.
`--meeting-id`, `--event-id`, `--series-id`, `--since-time` y `--until-time` limitan la cuenta elegida.
El cursor opaco pertenece a la cuenta, consulta y filtros, y continúa dentro de una transcripción larga.
JSONL conserva toda la página, incluidos `next_cursor` y `coverage`.

## Buscar por significado o en un archivo

`--model <model>` busca por significado en vez de palabras y genera primero los vectores que faltan;
consulta la [búsqueda por temas](./topic-search.md). `--archive <directory>` busca transcripciones en una
carpeta descargada antes de importarlas, sin base de datos, configuración ni inicio de sesión:

```sh
zm search meetings "example plan" --archive ./zoom-archive --limit 100 --offline --json
```

Los filtros del almacén no se aplican al archivo ni a la búsqueda por significado.

## Buscar por personas y proyectos

Combina la identidad de un participante o una persona vinculada explícitamente con un proyecto
y un intervalo de fechas:

```sh
zm meetings people "Alice Example" --json
zm search meetings "launch" --identity-id 12 --project RES --since-time 2026-09-12 --until-time 2026-10-12 --json
zm search meetings "budget" --person-id 7 --topic costs --since-time 2026-09-12 --json
zm search meetings "launch" --tag planning --limit 20 --json
```

Los IDs y las etiquetas del ejemplo son ficticios: sustitúyelos por registros de tu almacén local.
Usa el `identityId` de los resultados de participantes para `--identity-id`; `--person-id` acepta
el ID numérico de una persona vinculada explícitamente. Un mismo nombre puede representar
identidades distintas. Revisa los registros antes de vincularlos: estos filtros seleccionan
reuniones y no atribuyen una intervención sin autor a una persona.

`--project` acepta el nombre canónico de un proyecto existente, su clave o un alias explícito.
Solo cuenta una pertenencia confirmada; una propuesta del agente o una palabra coincidente
en la transcripción no establece esa pertenencia. `--tag` y `--topic` aceptan nombres canónicos
o alias explícitos de etiquetas ya asociadas a la reunión; elige un solo filtro de etiqueta.
Un nombre inexistente o ambiguo produce un error en vez de ampliar la búsqueda. `selection`
muestra los registros resueltos para los filtros por nombre. Una fecha sin hora significa
medianoche UTC; usa una hora con desplazamiento explícito para delimitar un día local.
Se mantienen las reglas de continuación y cobertura.

Si una reunión aún no está vinculada a un proyecto ni etiquetada, busca palabras y revisa
las fuentes antes de organizarla con [los registros compartidos de Memo](https://wirecat.dev/en/docs/memo/usage).
La herramienta MCP de solo lectura `search_meetings` ofrece los mismos filtros en la cuenta
seleccionada por el servidor: `identity_id`, `person_id`, `event_id`, `series_id`, `project`, `tag`, `topic`, `since_time`, `until_time` y `cursor`.
Sus fechas se expresan en milisegundos desde la época Unix.

`meetings people <query>` busca por nombre o correo. `search all` usa el servicio común y busca solo reuniones por defecto:

```sh
zm search all "example plan" --limit 100 --max-meetings 100 --json
zm meetings evidence meeting:3/15/20/0 --cues 100 --bytes 65536 --json
zm meetings context person:7 --meetings 10 --scan-limit 1000 --json
zm meetings task-proposal meeting:3/15/20/0 --type promise --json
```

Para otras fuentes indica `--only messages,mail,notes,meetings`. Los mensajes pertenecen a la cuenta
elegida, el correo incluye cuentas guardadas y las notas son globales. Las reuniones usan prefijos;
la sintaxis no admitida y consultas exactas se marcan como omitidas. Para continuar solo reuniones,
pasa `meetings.next_cursor` mediante `--meeting-cursor '<json>'`, vinculado a cuenta y consulta.
JSONL conserva el informe completo, con omisiones, cobertura y cursores.

## Leer fuentes

Las referencias son `meeting:<account>/<meeting>[/<transcript>[/<cue-position>]]` y están limitadas
a la cuenta elegida. Retienen la identidad de revisiones históricas. Se limitan tanto resultados
como lecturas; continúa con `--cursor` para un pasaje o `--after-transcript-id` para una revisión.
Son opciones excluyentes. `--max-read-bytes` usa 4 MiB por defecto y `--max-transcript-pages` limita
el examen de revisiones, incluso vacías. Consulta los campos de continuación e integridad.

## Leer el contexto de una coincidencia

Usa el `ref` de una coincidencia de transcripción para comprobar lo dicho justo antes y después:

```sh
zm meetings passage meeting:3/15/20/4 --before-n 3 --after-n 4 --format markdown
zm meetings passage meeting:3/15/20/4 --before-n 0 --after-n 0 --json
```

Sustituye la referencia ficticia por una de tus resultados. El pasaje muestra tiempos, nombres de
hablantes y una referencia por línea. Lee la transcripción guardada sin contactar con Zoom. Las
coincidencias en resúmenes o chat incluyen una referencia de reunión; usa `meetings show` o
`meetings evidence` para ellas, porque `passage` requiere una línea de transcripción.

`--before-n` y `--after-n` cuentan líneas aunque haya huecos entre sus posiciones guardadas. Ambos
usan 3 por defecto; el máximo combinado es 999. `--bytes` limita el JSON de las líneas incluidas
(64 KiB por defecto), y `--max-read-bytes` limita el texto guardado seleccionado (4 MiB por defecto).
Si la propia línea de referencia no cabe en el presupuesto, la operación falla en vez de devolver
un pasaje vacío. El límite global `--max-output-bytes` también limita el resultado final.

Comprueba `coverage.has_before`, `has_after` y `truncated_by` antes de considerar completo el pasaje.
Para ampliarlo, abre `before_ref` con más líneas anteriores o `after_ref` con más posteriores.
La línea del límite se incluye de nuevo; el agente puede deduplicarla mediante `ref`.
`archive_completeness: "unknown"` describe el archivo incluso cuando la ventana local está completa.

Una transcripción corregida conserva la referencia anterior, marcada `superseded`, sin cambiar
silenciosamente a la nueva versión. Para rechazar una línea modificada, pasa el `target_fingerprint`
anterior con `--expected-fingerprint`. JSON conserva las líneas estructuradas y sus huellas; Markdown
cita el texto de la transcripción. Usa `--json` al seleccionar campos mediante `--fields`.

Con `zm serve --mcp --meeting-context`, `meeting_passage` ofrece la misma lectura con `reference`,
`before`, `after`, `bytes`, `max_read_bytes`, `expected_fingerprint` y `format` (`json`, `text`
o `markdown`). El servidor fija la cuenta. Pide al agente que cite el contexto antes de sugerir
un hecho o una tarea de seguimiento.

## Contexto de una persona

Usa identidades vinculadas y presencia en la cuenta, sin identificar por nombres de hablantes.
Una persona vinculada no necesariamente habló. Índices pendientes y límites pueden dejar contexto
incompleto. Vincula al participante explícitamente con `meetings link`.

## Vincular eventos y personas

La referencia principal es `meeting:<accountId>/<meetingId>`; se añaden revisión y posición del
pasaje para más detalle. Los vínculos de evento y persona usan la principal:

```sh
zm meetings update meeting:1/1 --event-id 1 --expected-event-id none --json
zm meetings update meeting:1/1 --event-id 1 --expected-event-id none --yes --json
zm meetings link meeting:1/1 --participant-id 1 --person 1 --expected-person none --yes --json
```

Primero aparece un plan; `--yes` aplica una vez y `--dry-run` prevalece. Los valores esperados rechazan
una decisión obsoleta. `--event-id none` quita el evento. Solo se mueve la identidad del participante
elegido, sin adivinar por nombre. La persona necesita observaciones autorizadas; `--target-accounts <ids>`
añade cuentas explícitas para buscar. Las etiquetas locales no autentican una identidad remota.

## Notas, etiquetas y recuerdos con memo

[Memo](https://github.com/WireCatLabs/cli-memo) guarda notas, etiquetas y recuerdos comunes. Si cambias
la ruta, usa el mismo `MESSAGING_STORE`. Para el perfil de Zoom `AliceExample`, la cuenta es `zm-profile:AliceExample`:

```sh
memo tags add planning --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo tags remove planning --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo notes add --text "Alice Example follow-up" --meeting 1 --provider zoom --account zm-profile:AliceExample --json
memo notes list --about meeting:1/1 --json
memo facts add "Alice Example will review" --type promise --scope work --subject meeting:1/1 --evidence meeting:1/1/1/0 --json
memo facts list --subject meeting:1/1 --json
```

Añadir y quitar en Memo escribe directamente. Los hechos del dueño se aceptan; los enviados mediante
MCP del agente quedan propuestos para revisión. Los recuerdos guardan resúmenes, recopilaciones y
preferencias aparte. Las referencias a revisiones y pasajes siguen disponibles tras correcciones.
Los ejemplos son ficticios: usa los identificadores de tus reuniones y cuenta.

## Propuestas de tareas

Se admiten pregunta, petición, mención y promesa. `applied: false` y `persistence: "proposal-only"`
indican que no se creó una tarea. `zm` no extrae compromisos por sí solo: el agente lee las fuentes
y propone una tarea para el pasaje elegido.

Antes de guardar notas, etiquetas o hechos, pide al agente los alias existentes del proyecto y las
etiquetas actuales, y después sus propuestas de vínculos. Revisa posibles sinónimos antes de crear otra
etiqueta para el mismo tema. Memo se instala por separado y debe usar la misma ruta de base de datos.

La búsqueda por significado se explica en [su guía](./topic-search.md). Para preparar una llamada,
combina los pasajes citados con [el calendario de Zoom](./remote-meetings.md).
