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
JSON incluye `page.next_cursor`, `next` e información `missing` del índice. JSONL emite registros de resultados seguidos de un registro end con la página y si el resultado está completo.
Cada coincidencia contiene `ref`, referencia de reunión `meeting`, `excerpt` y `offset_ms`.
Cuando están guardados, source incluye título, `started_at`, referencia de evidencia `ref` y
documento url. Un URL null indica que no hay enlace al documento; el enlace para entrar a Zoom
no lo sustituye. Abre una línea con `meetings passage`.

## Buscar por significado o en un archivo

`--model <model>` busca por significado en vez de palabras y genera primero los vectores que faltan;
consulta la [búsqueda por temas](./topic-search.md). `search recordings <directory> <query>` busca transcripciones en una
carpeta descargada antes de importarlas, sin base de datos, configuración ni inicio de sesión:

```sh
zm search recordings ./zoom-archive "example plan" --limit 100 --offline --json
```

Las coincidencias tienen el formato de `search all`: `ref` (`recording:<file id>/<cue position>`),
`title`, `timestamp`, `excerpt`, `sender_name` y `offset_ms`; `account` es la carpeta del archivo.


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
Usa el `identity_id` de los resultados de participantes para `--identity-id`; `--person-id` acepta
el ID numérico de una persona vinculada explícitamente. Un mismo nombre puede representar
identidades distintas. Revisa los registros antes de vincularlos: estos filtros seleccionan
reuniones y no atribuyen una intervención sin autor a una persona.

`--project` acepta el nombre canónico de un proyecto existente, su clave o un alias explícito.
Solo cuenta una pertenencia confirmada; una propuesta del agente o una palabra coincidente
en la transcripción no establece esa pertenencia. `--tag` y `--topic` aceptan nombres canónicos
o alias explícitos de etiquetas ya asociadas a la reunión; elige un solo filtro de etiqueta.
Un nombre inexistente o ambiguo produce un error en vez de ampliar la búsqueda. Una fecha sin hora significa
medianoche UTC; usa una hora con desplazamiento explícito para delimitar un día local.
Se mantienen las reglas de continuación y cobertura.

Si una reunión aún no está vinculada a un proyecto ni etiquetada, busca palabras y revisa
las fuentes antes de organizarla con [los registros compartidos de Memo](https://wirecat.dev/en/docs/memo/usage).
La herramienta MCP de solo lectura `search_meetings` ofrece los mismos filtros en la cuenta
seleccionada por el servidor: `identity_id`, `person_id`, `event_id`, `series_id`, `project`, `tag`, `topic`, `since_time`, `until_time` y `cursor`.
Sus fechas se expresan en milisegundos desde la época Unix.

`meetings people <query>` busca observaciones guardadas de participantes por nombre o correo en la cuenta elegida.
Compara Unicode de forma literal; no traduce nombres ni deduce que dos registros son la misma persona.
`--limit` (50 por defecto), `--scan-limit` (1000) y `--max-read-bytes` (1048576)
limitan coincidencias, observaciones examinadas y bytes de nombres/correos leídos por llamada.
La respuesta JSON conserva `item.page.has_more`, `item.page.next_cursor`, cobertura y ambigüedad de identidades de la página. JSONL conserva ese informe en `data` del registro item, seguido de un registro end.
Sigue el paso `item.next` o repite la misma consulta con `--cursor`. Una página vacía puede tener continuación.
Los IDs distintos son candidatos para revisar, nunca vínculos automáticos con personas. No se sabe si el archivo está completo.

`meetings list` filtra metadatos con una consulta, por ejemplo
`zm meetings list 'started_at:[2026-09-12 TO 2026-10-12]' --json`.
JSON devuelve `items`, `page` y pasos `next` opcionales. JSONL emite cada reunión en un registro item,
seguido de un registro end con la página y si el resultado está completo. Continúa con `--page`.
La consulta por fecha sustituye los antiguos parámetros del listado `--since-time` y `--until-time`;
esos parámetros siguen disponibles en la búsqueda de transcripciones y la importación de reuniones.
`search all` usa el servicio común y busca solo reuniones por defecto:

```sh
zm search all "example plan" --limit 100 --max-meetings 100 --json
zm meetings evidence meeting:3/15/20/0 --cues 100 --bytes 65536 --json
zm meetings context person:7 --meetings 10 --scan-limit 1000 --json
zm meetings task-proposal meeting:3/15/20/0 --type promise --json
```

Para otras fuentes indica `--only messages,mail,notes,meetings`. Los mensajes pertenecen a la cuenta
elegida, el correo incluye cuentas guardadas y las notas son globales. Las reuniones usan prefijos;
la sintaxis no admitida y consultas exactas se marcan como omitidas. Para continuar solo reuniones,
pasa `item.meetings.next_cursor` mediante `--meeting-cursor '<json>'`, vinculado a cuenta y consulta.
JSONL conserva el informe en un registro item, con omisiones, cobertura y cursores, seguido de un registro end.
Las fuentes omitidas dejan `complete` en false y aparecen en `issues`; la búsqueda termina con código cero.

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

Dentro de `item`, comprueba `coverage.has_before`, `has_after` y `truncated_by` antes de considerar completo el pasaje.
Para ampliarlo, abre `before_ref` con más líneas anteriores o `after_ref` con más posteriores.
La línea del límite se incluye de nuevo; el agente puede deduplicarla mediante `ref`.
`archive_completeness: "unknown"` describe el archivo incluso cuando la ventana local está completa.

Una transcripción corregida conserva la referencia anterior, marcada `superseded`, sin cambiar
silenciosamente a la nueva versión. Para rechazar una línea modificada, pasa el `target_fingerprint`
anterior con `--expected-fingerprint`. JSON conserva las líneas estructuradas y sus huellas; Markdown
cita el texto de la transcripción. `--json=items.ref,items.start_ms,items.speaker_name,items.text` conserva solo esos campos.

Con `zm serve --mcp --meeting-context`, `meeting_passage` ofrece la misma lectura con `reference`,
`before`, `after`, `bytes`, `max_read_bytes`, `expected_fingerprint` y `format` (`json`, `text`
o `markdown`). El servidor fija la cuenta. Pide al agente que cite el contexto antes de sugerir
un hecho o una tarea de seguimiento.

## Leer varias consultas o pasajes juntos

Al comprobar varios nombres o citas, el agente puede agrupar las lecturas y conservar por separado
cada respuesta y su continuación. Usa el perfil elegido y las reuniones guardadas, con una sola pasada
limitada de indexación antes de buscar palabras. No consulta Zoom ni ejecuta un modelo.

Guarda un JSON como `requests.json`, sustituyendo la referencia ficticia por una línea de tus resultados:

```json
{
  "requests": [
    {"id": "name", "command": ["search", "meetings"], "args": ["Research Example", "--limit", "10"]},
    {"id": "alias", "command": ["search", "meetings"], "args": ["RES", "--limit", "10"]},
    {"id": "passage", "command": ["meetings", "passage"], "args": ["meeting:3/15/20/4", "--before-n", "2"]}
  ]
}
```

```sh
zm batch requests.json --json
zm batch requests.json --format markdown
cat requests.json | zm batch - --jsonl
```

Cada resultado conserva `id`, `command`, `status` y `complete`. Si tiene éxito, la respuesta habitual está
en `answer`; si falla, lleva `error`. Las consultas repetidas y los pasajes solapados siguen separados.
Para continuar, pasa el cursor de búsqueda o la huella esperada del pasaje en los `args` de esa petición.
Solo admite `search meetings` por palabras y `meetings passage`; las opciones de modelo, perfil y escritura
no pueden anidarse en el lote.

Admite hasta 32 peticiones y 256 KiB de entrada UTF-8. El presupuesto predeterminado de texto guardado
es 64 MiB: reserva todo el límite `--max-read-bytes` de cada petición y 4 MiB una vez para indexar, sin
devolver bytes no usados. Son límites conservadores, no medidas de entrada/salida de la base. Reduce
los límites de cada petición o divide el lote. El `--max-read-bytes` del lote puede reducir el total.
La salida se limita a 4 MiB y el `--max-output-bytes` global puede reducirlo; si no cabe ni la estructura
de resultados, falla antes de leer el almacén.

Comprueba cada estado y el `meta.complete` exterior: un rechazo por presupuesto es `not_run`; una petición
ejecutada cuya respuesta excede el límite de salida es `error`, y las siguientes quedan como `not_run`.
Los resultados parciales terminan con código cero y conservan todos los ID. Una entrada incorrecta sale
con código 2 antes de abrir el almacén. JSONL emite un elemento por petición y un registro final con
completitud y problemas. La cancelación y los fallos de salida final hacen fallar toda la invocación
sin imprimir stdout parcial.

Para JSON compacto, `--json=ref,excerpt,source.title,source.started_at,source.url` selecciona campos dentro
de cada respuesta y conserva ID, errores y cobertura. Los pasajes usan campos de líneas como
`items.ref,items.start_ms,items.speaker_name,items.text`. Texto y Markdown incluyen tiempos, hablantes
y referencias, con cobertura una vez por resultado. Revisa los datos ausentes y la continuación antes
de conservar una conclusión.

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
elegido, sin adivinar por nombre. La persona necesita observaciones autorizadas; `--source <accounts>`
añade cuentas explícitas para buscar. Las etiquetas locales no autentican una identidad remota.

## Encontrar un proyecto antes de vincularlo

El filtro de pertenencia confirmada puede omitir una reunión pertinente que todavía no está vinculada.
Usa un proyecto existente del catálogo compartido para buscar su nombre canónico, clave y alias explícitos:

```sh
zm meetings people "Alice Example" --limit 50 --json
zm meetings projects evidence RES 'identity_id:12 started_at:[2026-09-14 TO 2026-10-14]' --limit 20 --json
```

La clave del proyecto y el ID de identidad son ficticios. Revisa las páginas de participantes antes de
elegir la identidad correcta; un nombre coincidente no establece un vínculo con una persona. Si el
proyecto no existe o es ambiguo, revisa primero el catálogo de proyectos de Memo. El comando solo
resuelve nombres existentes; no inventa alias ni crea proyectos, etiquetas, vínculos con personas o pertenencia.

La respuesta contiene un `item`, con el `project` canónico, el nombre coincidente `term`, los
`hits` con fuentes, `selection`, límites, `page` y `coverage` explícita, además de metadatos de
ejecución. Cada llamada lee una página de un nombre del índice local de palabras existente, sin
actualizarlo. Tras importar reuniones, ejecuta una búsqueda normal de palabras para indexar los
pasajes nuevos. La lectura usa por defecto 4 MiB y como máximo 100 coincidencias; `--max-read-bytes`
y `--limit` cambian esos límites. La resolución del catálogo tiene otro límite de 1 MiB y 32 nombres.
Un vocabulario excesivo produce un error explícito. La integridad del archivo y del índice sigue siendo desconocida.

Continúa con el paso `next` de la raíz, incluso si `item.hits` está vacío. El cursor está en `item.page.next_cursor`. Sus argumentos
repiten proyecto, selección, cursor y límites. Se terminan las páginas de un nombre antes de pasar al
siguiente alias. Las fechas relativas se fijan como límites absolutos en la consulta devuelta; úsala
con `--cursor` para que otro día no cambie la selección. Cambiar el vocabulario o la selección puede invalidar el cursor.

La consulta opcional de selección acepta valores exactos de `meeting_id`, `identity_id`, `person_id`,
`tag_id`, `event_id` y `series_id`, una vez cada uno y unidos por AND, además de fechas/rangos de
`started_at`. Los rangos incluyen días naturales completos en UTC; las marcas ISO entre comillas
fijan límites exactos. Se rechazan OR, negación y filtros de pertenencia confirmada a un proyecto.
La herramienta MCP `meeting_project_evidence` recibe `project` y, opcionalmente, `query`, `limit`,
`cursor` y `max_read_bytes`; la cuenta queda fijada por el servidor.

Para cada pasaje conservado pertinente, abre `zm meetings passage <ref> --format markdown` y revisa
las palabras cercanas. `association: "unconfirmed-word-evidence"` significa evidencia candidata: una
clave puede ser incidental y las referencias repetidas entre nombres son la misma evidencia. Propón
asociaciones tras revisar el pasaje. Si aún no existe el proyecto, sigue disponible la búsqueda normal
sin `--project`: repite manualmente los nombres conocidos con la misma selección.

<a id="suggest-projects-for-one-meeting" />

## Sugerir proyectos para una reunión

Si encontraste una reunión pero no sabes a qué proyecto guardado corresponde, pide al agente
que la compare con los nombres, claves y alias de tus proyectos existentes:

```text prompt
Revisa esta reunión y sugiere con cuáles de mis proyectos guardados puede estar relacionada.
Muestra los pasajes que respaldan cada sugerencia, distingue una pista del título de la evidencia
en la transcripción y deja los vínculos con proyectos pendientes de revisión.
```

La revisión lee la reunión local del perfil elegido y el catálogo compartido de nombres de
proyectos. No contacta con Zoom ni necesita un componente de búsqueda por significado. Toma
la referencia `ref` de la reunión principal de un resultado de búsqueda. Ejemplo ficticio:

```sh
zm meetings projects scan meeting:1/2 --cues 20 --json
```

La respuesta conserva la referencia canónica del proyecto, el nombre/clave/alias coincidente y
su fuente. Las coincidencias del título llevan `metadata-title`; las de transcripción incluyen
la referencia del pasaje retenido, su huella y revisión. Abre el pasaje antes de proponer un
vínculo. Un alias compartido sigue siendo ambiguo aunque el límite oculte otro proyecto. La
revisión no guarda asociaciones ni considera una coincidencia existente o repetida como prueba
adicional de pertenencia al proyecto.

Cada llamada lee una página acotada de transcripción y hasta 128 proyectos con 64 KiB de nombres
de catálogo. Los valores predeterminados son veinte pasajes y diez candidatos. `--cues` admite
1–100; `--limit`, 1–10; `--max-read-bytes` limita cada lectura del almacén hasta 64 KiB; y `--bytes`
limita el objeto de respuesta a 2–64 KiB. El paquete de pasajes tiene un límite fijo de 32 KiB.
Si el catálogo excede su límite, elige un proyecto conocido mediante
[la búsqueda de evidencia](#find-a-project-before-linking-it): la revisión rechaza el exceso en
lugar de omitir proyectos silenciosamente.

Comprueba `coverage` y `evidence.coverage`. Para leer más transcripción, pasa
`evidence.coverage.next_cursor` con la misma referencia de reunión mediante `--cursor`. Un título
o proyecto puede repetirse. Las huellas describen lecturas actuales, no una instantánea fija.
Los límites de candidatos son independientes: aumenta `--limit` o `--bytes` si faltaron candidatos.
Una página sin pasajes ni cursor, truncada por bytes, indica que un pasaje no cabía; no demuestra
que no hubiera discusión relevante. No se sabe si el archivo local contiene todas las reuniones.

Tras comprobar las fuentes, `memo projects meetings link` puede guardar la asociación local
confirmada con el ID exacto de la reunión guardada y su cuenta, por ejemplo
`--account zoom:zm-profile:AliceExample`. Es una escritura separada de la revisión. Para confirmar
una propuesta ya guardada, utiliza su propia huella de Memo: la revisión de proyectos no crea
esa propuesta, y la huella del vocabulario no sustituye el recibo de pertenencia. Consulta los
argumentos en [la referencia de proyectos de Memo](https://wirecat.dev/en/docs/memo/commands#memo-projects-meetings-link).
El proyecto sugerido sigue sin confirmar hasta aplicar esa escritura revisada.

## Notas, etiquetas y recuerdos con memo

[Memo](https://github.com/WireCatLabs/cli-memo) guarda notas, etiquetas y recuerdos comunes. Si cambias
la ruta, usa el mismo `MESSAGING_STORE`. Para el perfil de Zoom `AliceExample`, la cuenta es `zm-profile:AliceExample`:

```sh
memo tags add planning --meeting 1 --account zoom:zm-profile:AliceExample --json
memo tags remove planning --meeting 1 --account zoom:zm-profile:AliceExample --json
memo notes add --text "Alice Example follow-up" --meeting 1 --account zoom:zm-profile:AliceExample --json
memo notes list --about meeting:1/1 --json
memo facts add "Alice Example will review" --type promise --scope work --subject meeting:1/1 --evidence meeting:1/1/1/0 --json
memo facts list --subject meeting:1/1 --json
```

Añadir y quitar en Memo escribe directamente. Los hechos del dueño se aceptan; los enviados mediante
MCP del agente quedan propuestos para revisión. Los recuerdos guardan resúmenes, recopilaciones y
preferencias aparte. Las referencias a revisiones y pasajes siguen disponibles tras correcciones.
Los ejemplos son ficticios: usa los identificadores de tus reuniones y cuenta.

<a id="suggest-labels-without-creating-synonyms" />

### Sugerir etiquetas sin crear sinónimos

El agente puede leer los metadatos y pasajes citados de la reunión y comparar las etiquetas
propuestas con el vocabulario compartido de Memo. Pide primero una propuesta:

```text prompt
Sugiere un conjunto pequeño de etiquetas para esta reunión. Reutiliza nuestros nombres y alias,
muestra los pasajes que respaldan cada sugerencia y señala posibles sinónimos para revisar.
No crees ni fusiones etiquetas al preparar la propuesta.
```

Memo ya ofrece las comprobaciones; Zoom no mantiene un segundo catálogo de etiquetas:

```sh
memo vocabulary list 'kind:tag' --max-entries 128 --max-read-bytes 65536 --json
memo vocabulary check planning --kind tag --max-entries 128 --max-read-bytes 65536 --json
memo vocabulary check --kind tag --max-entries 128 --max-read-bytes 65536 --max-comparisons 1000 --limit 20 --json
```

La primera orden lista nombres canónicos y alias. La segunda comprueba un nombre propuesto frente
a etiquetas existentes o nombres parecidos antes de crearlo, entre tipos de etiquetas para no
ocultar un conflicto con un tema. La última audita posibles sinónimos entre las etiquetas. Estas
lecturas no crean ni fusionan nada. Los límites de catálogo y comparaciones acotan el trabajo;
un rechazo o una auditoría incompleta no demuestran que el nombre sea único.

Si el resultado dice `reuse`, utiliza el nombre canónico existente. Con `review`, comprueba las
alternativas y la evidencia de la reunión antes de elegir una etiqueta o un alias revisado por el
propietario. `create` significa que no se encontró un candidato léxico, no que el concepto sea
nuevo. La similitud conserva los acentos y no descubre todas las traducciones o sinónimos. Deja
las propuestas dudosas pendientes de revisión. Memo protege la creación frente a nombres parecidos
a duplicados y huellas caducadas; una huella es una condición de la vista previa, no permiso para
aceptar automáticamente una propuesta.

Tras la revisión, aplica la etiqueta existente con los argumentos de reunión y cuenta de Memo
mostrados arriba, y busca reuniones por esa etiqueta. Consulta
[la guía de etiquetas de Memo](https://wirecat.dev/en/docs/memo/tags) para el proceso compartido.
La preparación y la revisión de proyectos de Zoom no guardan etiquetas ni fusiones.

## Propuestas de tareas

Se admiten pregunta, petición, mención y promesa. `applied: false` y `persistence: "proposal-only"`
indican que no se creó una tarea. `zm` no extrae compromisos por sí solo: el agente lee las fuentes
y propone una tarea para el pasaje elegido.

Antes de guardar notas, etiquetas o hechos, pide al agente los alias existentes del proyecto y las
etiquetas actuales, y después sus propuestas de vínculos. Revisa posibles sinónimos antes de crear otra
etiqueta para el mismo tema. Memo se instala por separado y debe usar la misma ruta de base de datos.

La búsqueda por significado se explica en [su guía](./topic-search.md).
Para una próxima llamada, selecciona la serie del proveedor en [el calendario de Zoom](./remote-meetings.md)
y [prepara su contexto](./usage.md#prepare-for-an-upcoming-meeting). Añade `--project RES` para un proyecto
existente e incluye candidatos citados por nombre/alias separados de los vínculos confirmados;
revisa la continuación y la cobertura antes de considerar completo el resultado.
