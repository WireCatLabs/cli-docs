---
title: "Uso"
---

Lee una reunión guardada, abre su transcripción y exporta lo necesario. Esta guía ayuda a elegir
la orden y saber si lee datos locales, contacta con Zoom o modifica algo. Si todavía no hay reuniones,
empieza por [instalar y conectar](./installation.md).

## Lee tu primera reunión

```sh
zm meetings list --json
zm meetings show <meeting-id> --json
zm meetings transcript <meeting-id> --json
zm meetings summary <meeting-id> --json
```

Sustituye `<meeting-id>` por un ID de la lista. Comprueba la fecha y el título antes de usar el texto.
Si falta el resumen o la transcripción, esa parte no se obtuvo; no significa que no se habló.
La lectura usa el perfil local elegido y no descarga datos nuevos de Zoom. La [guía del archivo](./archive.md)
explica cómo recuperar periodos o importar archivos.

Para obtener una copia portable del contenido disponible:

```sh
zm meetings export <meeting-id> --format markdown --json
```

Lee el resultado antes de guardarlo en un archivo. MCP devuelve exportaciones como texto, pero no
escribe archivos. [Búsqueda y fuentes](./search.md) conserva referencias exactas para citar pasajes.

<a id="find-a-scheduled-meeting-series" />

## Encontrar una serie programada

Si conoces el tema de la próxima llamada pero no su ID de serie, pide al agente que busque
candidatas. Lee las reuniones programadas de la cuenta de Zoom elegida, sin importar
transcripciones ni abrir la base local.

```text prompt
Busca posibles series para mi próxima reunión de proyecto. Muestra títulos e ID, explica fechas
antiguas o inciertas y verifica la próxima ocurrencia de la serie que elija antes de preparar contexto.
```

```sh
zm meetings scheduled --limit 20 --json
```

La respuesta conserva cuenta, títulos, ID `meeting_id`, ventana absoluta y cobertura. Por defecto,
la ventana va desde ahora hasta siete días después. Una fecha inicial antigua de una serie
recurrente o la ausencia de fecha son pistas, no pruebas de una llamada futura. Conserva
`calendar_completeness: unknown` y `occurrence_proof: not-read`: no demuestra que se hayan revisado todos los calendarios.

Con `item.page.has_more`, repite `item.after`/`item.until` como `--since-time`/`--before-time` y
`item.page.next_cursor` como `--cursor`. El cursor pertenece a esa cuenta y ventana. Cada llamada
lee una página con hasta 100 candidatas y 64 KiB de lectura/salida por defecto. `--max-read-bytes`
y `--bytes` permiten límites hasta 1 MiB; una página demasiado grande se rechaza entera, sin
omitir series silenciosamente. Requiere `meeting:read:list_meetings` y red; `--offline` rechaza
antes de leer credenciales. Elige un ID del proveedor y sigue con
[la preparación](#prepare-for-an-upcoming-meeting) para verificar la próxima ocurrencia y reunir
contexto. El ID local de una reunión guardada es distinto.

## Prepara una próxima reunión

Tienes una próxima llamada en Zoom y quieres tener a mano la conversación anterior. Pide al agente:

```text prompt
Prepárame para la próxima llamada de Research Example en Zoom. Identifica primero la serie correcta.
Muestra la próxima hora, pasajes citados de llamadas anteriores, vínculos confirmados al proyecto,
decisiones guardadas, notas sobre llamadas anteriores y personas/proyectos vinculados, y tareas con origen directo en esas reuniones. Si encajan varias series,
muestra candidatas. Indica qué falta o no está confirmado. No cambies nada.
```

Usa el ID de serie del propio Zoom que aparece en [la agenda](./remote-meetings.md), con dígitos
sin espacios, en lugar del ID interno de `meetings list`. En el terminal:

```sh
zm meetings prepare 123456789 --json
```

La orden lee la serie elegida en Zoom y la une al historial del perfil local seleccionado.
Necesita el permiso opcional `meeting:read:meeting` en [la aplicación Zoom](./zoom-app.md#add-archive-or-management-access).
No descarga transcripciones ausentes, cambia permisos ni inicia sesión. La ventana predeterminada
mira siete días hacia delante y treinta hacia atrás, con un máximo de cinco reuniones anteriores,
cinco reuniones relacionadas y diez pasajes citados por reunión.

Comprueba `item.upcoming.candidate` y `verified_next`: una hora candidata puede ser útil aunque
no demuestre que es la próxima reunión. La fecha inicial de una serie recurrente no lo demuestra.
`meetings` conserva referencias a reuniones, pasajes y huellas de contenido, nombres observados
con vínculos existentes a personas, proyectos confirmados, hechos aceptados sobre la reunión y
tareas de origen directo. La asistencia anterior no predice quién acudirá a la próxima llamada.

`related.items` añade reuniones fuera de la serie mediante vínculos existentes a personas o proyectos
confirmados compartidos con el historial incluido. Cada una conserva referencia, citas e indicadores
`shared_person`/`shared_project`; `related.anchors` muestra las llamadas anteriores que establecen
esas conexiones. La búsqueda se limita al perfil y periodo elegidos, usa vínculos actuales y excluye
asociaciones propuestas a proyectos. Coincidir nombres o palabras nunca crea un vínculo.

`knowledge.items` añade hechos aceptados sobre personas vinculadas explícitamente y proyectos
globales confirmados, incluidas decisiones registradas fuera de estas reuniones. Cada uno conserva
referencia `fact:`, referencias al sujeto/proyecto, fecha de actualización e indicadores
`shared_person`/`shared_project`. Usa las llamadas anteriores incluidas como anclas y excluye hechos
propuestos, revocados, eliminados o actualizados después del inicio de la preparación. La referencia
permite recuperar el registro completo y su evidencia mediante Memo antes de usarlo. Esta sección
contiene hechos aceptados; `knowledge.coverage` conserva `fact_evidence: not-revalidated`
y `other_sources: not-queried`.
Si se piden fuentes explícitamente, `other_sources: see-communications` señala su cobertura separada.

`notes.items` añade notas y anotaciones escritas por el dueño sobre las llamadas anteriores incluidas,
las personas vinculadas explícitamente a ellas y los proyectos globales confirmados. Cada una incluye
referencia `note:`, título/texto, revisión, fecha de actualización y una referencia a la reunión/persona/proyecto
que la relaciona. Son comentarios guardados, separados de los hechos aceptados. Usa revisiones actuales
y vínculos confirmados. Una nota sobre una reunión debe enlazar una llamada incluida de este perfil;
compartir un proyecto no basta para incluir notas de otras reuniones. Excluye notas eliminadas, notas
de bots, personas/proyectos limitados a una cuenta y revisiones actualizadas después del inicio de la
preparación. Recupera la nota por su referencia en Memo para ver todas sus asociaciones.

Comprueba `notes.coverage.has_more` y `notes.coverage.output_limited` para saber si hay notas adicionales u omitidas.
`source_evidence: not-revalidated` indica que no se han vuelto a comprobar sus fuentes;
`other_sources: not-queried` deja fuera de la cobertura los documentos importados, el correo y los
mensajes, salvo que los pidas explícitamente. Entonces `other_sources: see-communications` señala
su cobertura separada; esos pasajes no se convierten en notas del dueño. Seleccionar `--json=notes.items.ref` conserva esa cobertura junto a las referencias.

Si sabes qué proyecto existente quieres investigar, pide al agente que lo seleccione por su nombre,
clave o alias guardado. Por ejemplo:

```text prompt
Prepara la próxima llamada de planificación de Research Example. Busca también menciones citadas
de nuestro proyecto existente Research Example y sus alias guardados en reuniones anteriores de
este perfil. Separa las coincidencias de palabras de los vínculos confirmados e indica dónde quedan resultados.
```

En el terminal, añade `--project`:

```sh
zm meetings prepare 123456789 --project RES --json
```

`project_evidence.pages` conserva cada nombre o alias coincidente junto a los pasajes citados,
los desplazamientos y los títulos de las reuniones de origen. Busca en el mismo perfil y periodo,
incluidas llamadas sin vínculo al proyecto. Una coincidencia es una candidata para revisar; no
demuestra que una reunión pertenezca al proyecto. Un pasaje puede coincidir con varios nombres,
lo que no aporta corroboración adicional.

Se incluyen como máximo cuatro páginas de búsqueda. Una página vacía puede llevar a un alias con
coincidencias. Si aparece `project_evidence.continuation`, usa su proyecto, consulta fijada, límite
y presupuesto de lectura con `meetings projects evidence`; pasa el cursor cuando no sea null.
Un cursor null significa empezar sin `--cursor`. Así continúas la búsqueda guardada sin volver a
leer la agenda próxima de Zoom. Revisa la indexación pendiente y la cobertura desconocida aunque
las páginas estén vacías. Los cambios de vocabulario o ámbito invalidan el cursor; reinicia la
búsqueda del proyecto elegido en vez de inventar otro cursor.

Si aparece la próxima hora sin reuniones anteriores, descarga el periodo pertinente mediante la
API de Zoom para guardar sus vínculos exactos a la serie. Un archivo de transcripción importado
puede carecer de ese ID del proveedor. La preparación no une llamadas por títulos o nombres parecidos.

La cobertura distingue historial ausente, reuniones sin fecha, filas adicionales y límites de salida.
No se conoce si el archivo incluye todo el historial. Los documentos, el correo y los mensajes
no se consultan salvo que pidas fuentes configuradas explícitamente. Los proyectos no elegidos
quedan sin consultar; sin reuniones anteriores
utilizables, tampoco se consulta el historial relacionado. La evidencia de los hechos guardados
no se vuelve a comprobar. Usa [búsqueda y fuentes](./search.md) para investigar esas lagunas.
La preparación no genera un resumen, acepta hallazgos ni crea tareas.

Para una ventana fija, usa tiempos ISO con zona en `--since-time`, `--before-time` y
`--history-since-time`. `--meetings` limita por separado el historial de la serie y el relacionado;
`--cues` y `--context-limit` acotan el contexto. `--max-read-bytes` acota cada lectura y `--bytes`
el elemento completo. Las fuentes de la serie tienen prioridad; `related.has_more` y
`related.output_limited` indican contexto relacionado adicional u omitido.
Los hechos aceptados tienen indicadores independientes `knowledge.coverage.has_more` y `knowledge.coverage.output_limited`;
se devuelven hasta veinte (o un `--context-limit` menor), cediendo bytes a las fuentes de reuniones.
Las páginas opcionales de coincidencias del proyecto ceden espacio primero, antes que notas, hechos aceptados y fuentes de reuniones.
Cada una de las cuatro páginas como máximo lee vocabulario y palabras por separado, con
`--max-read-bytes` para cada lectura; estos límites no acotan el escaneo y ordenación en la base.
Las notas tienen sus propios indicadores de más filas y límites de salida, con hasta veinte entradas
(o un `--context-limit` menor). Usan el espacio restante tras los hechos aceptados y las fuentes de
reuniones. Pueden quedar filas fuera del límite. Las fuentes omitidas dan `meta.complete=false`: revisa sus referencias antes de
usar el informe. Si la cobertura señala un recorte, aumenta el límite correspondiente.

## Incluye mensajes, correo y documentos elegidos

Primero [elige las cuentas o carpetas](./configuration.md#select-communications-for-preparation).
Después pide al agente que incluya esas fuentes:

```text prompt
Prepara la próxima reunión de planificación de Research Example con las fuentes de mensajes,
correo y documentos que configuré para este perfil. Busca la palabra "launch". Conserva la fecha
y fuente de cada afirmación, muestra los desacuerdos e indica qué fuentes o índices estaban incompletos.
```

En el terminal, indica cada fuente y una consulta de palabras literales:

```sh
zm meetings prepare 123456789 --context-source project-notes --context-query "launch" --json
```

Repite `--context-source` para otros ID configurados. La consulta admite hasta dieciséis palabras
literales; no busca por significado ni deduce un proyecto. La ventana predeterminada cubre los
catorce días anteriores al inicio de la preparación. Usa `--context-since-time` y
`--context-before-time` con horas ISO y zona para otra ventana: como máximo noventa días y sin
terminar después del inicio de preparación. Las filas sin fecha no se consultan.

`communications.items` contiene hasta veinte pasajes citados, repartidos entre las fuentes.
Cada afirmación conserva fecha y referencia: la posterior no sustituye automáticamente a la anterior,
y una palabra coincidente no confirma un vínculo con un proyecto o una persona.
`communications.coverage` conserva consulta, ventana, identidades, estado de índices, avisos de
filas sin fecha, uso de lectura y continuación, incluso al seleccionar campos JSON. Compruébalo
cuando no haya pasajes: una respuesta vacía o limitada no demuestra que no se habló del tema.

Cada fuente lee una página acotada. Si su cobertura incluye `next_cursor`, repite la petición con
`--context-source ID=CURSOR` para ella. Conserva consulta, ventana e identidad. Copia
`coverage.window.after` y `coverage.window.before` a `--context-since-time` y `--context-before-time`
explícitos: una nueva ventana predeterminada usa la hora actual y no corresponde al cursor anterior.
Si `restart_required` es true o se rechaza el cursor, reinicia esa fuente sin él; un pasaje omitido
no cuenta como leído. Los errores y límites aparecen en cobertura, con `meta.complete=false` cuando
corresponda. Se desconoce si el archivo incluye todo el historial.

Las fuentes comparten un presupuesto de 512 KiB y dieciséis consultas, limitado además por
`--max-read-bytes`. El límite de respuesta puede quitar pasajes conservando la cobertura.
La preparación abre un almacén existente compatible en modo de solo lectura: no completa índices,
no migra una versión antigua del esquema, no importa registros ausentes ni guarda hallazgos.
Si faltan índices, ejecuta por separado la importación o indexación del programa de origen.
Si el esquema es demasiado antiguo, actualízalo normalmente antes de repetir la preparación.

## Elige datos locales o remotos

| Necesidad | Familia de órdenes | Dónde trabaja |
|---|---|---|
| Leer transcripciones y fuentes | `meetings`, `events`, `search` | Base local compartida |
| Obtener reuniones del anfitrión | `meetings sync`, API `watch` | De Zoom a la base local |
| Importar transcripciones | `meetings import`, carpeta `watch` | De archivos a la base |
| Guardar grabaciones disponibles | `recordings` | De Zoom al destino indicado |
| Preparar una serie elegida | `meetings prepare` | Calendario Zoom y base local |
| Leer agenda o modificar una reunión | `remote-meetings` | Cuenta de Zoom |

Una lectura local correcta no demuestra que Zoom conserve el mismo contenido. Descargar un archivo
no importa su transcripción en la base hasta que solicites la importación del archivo.

## Comandos

| Comando | Función |
|---|---|
| `config show` | mostrar configuración local |
| `config set <key> <value>` | configurar cliente público u origen de archivos |
| `session start [--browser <program>]` | autorizar acceso en el navegador |
| `commands --json` | descubrir argumentos, opciones y ejemplos |
| `complete -- <words...>` | responder a autocompletado |
| `doctor` | inspeccionar entorno y configuración sin acceso ni base |
| `session status` | comprobar OAuth aparte de perfiles locales |
| `meetings import <folder>` | importar transcripciones al perfil elegido |
| `meetings sync [--since-time <time>]` | descargar reuniones del origen configurado |
| `meetings list`, `meetings show <meeting>` | leer reuniones guardadas |
| `meetings transcript <meeting>` | leer transcripciones actuales |
| `meetings summary <meeting>` | leer resúmenes guardados |
| `meetings export <meeting> --format markdown\|vtt` | exportar contenido guardado |
| `search meetings <query>`, `meetings people <query>` | buscar texto o participantes |
| `meetings scheduled` | una página acotada de posibles series; fechas sin verificar |
| `meetings prepare <series-id>` | reunir la próxima cita y el contexto guardado con fuentes de una serie elegida |
| `meetings projects scan <ref>` | sugerir proyectos existentes a partir de una página acotada de evidencia local; no guarda vínculos |
| `meetings projects evidence <project> [query...]` | leer evidencia acotada del nombre, clave y alias de un proyecto existente |
| `meetings update <reference>`, `meetings link <reference>` | revisar o aplicar vínculos elegidos |
| `meetings transcribe <meeting> <file> --model <model>` | revisar o reconocer un WAV como transcripción independiente |
| `meetings passage <reference>`, `meetings evidence <reference>`, `meetings context <person>` | leer fuentes limitadas o contexto personal vinculado |
| `meetings task-proposal <reference> --type <type>` | revisar una tarea con su fuente |
| `search meetings <query> --model <model>` | buscar por significado, generando primero los vectores que faltan |
| `meetings embeddings --model <model>` | revisar generación; `--yes` aplica un lote |
| `search all <query>` | buscar reuniones o recursos elegidos explícitamente |
| `events list` | leer eventos guardados |
| `watch [api\|files] [folder] --jsonl` | importar repetidamente en primer plano |
| `recordings list`, `recordings show <meeting>` | descubrir grabaciones y metadatos |
| `recordings download <meeting> --output-dir <dir>` | archivar archivos disponibles |
| `recordings sync --since-time <date> --until-time <date> --output-dir <dir> --jsonl` | archivar historial por meses |
| `recordings schedule create\|list\|show\|run\|disable` | gestionar trabajos diarios de archivo |
| `recordings archive show\|check\|locks <directory>` | inspeccionar manifiestos, sumas o bloqueos |
| `recordings archive recover <directory>` | revisar recuperación de bloqueos obsoletos |
| `recordings archive transcript <directory>` | leer WebVTT verificado sin base de datos |
| `search recordings <directory> <query>` | buscar texto verificado sin base |
| `recordings archive import <directory>` | verificar VTT y añadirlo a reuniones guardadas |
| `remote-meetings list\|show\|invitation` | leer próximas reuniones e invitaciones |
| `remote-meetings create\|update\|cancel` | revisar o aplicar un cambio simple en Zoom |
| `serve --mcp` | servir lecturas de reuniones por MCP stdio |
| `skill show`, `skill install --for agents` | mostrar o instalar instrucciones del agente |

`meetings` usa IDs locales; `remote-meetings`, IDs numéricos de Zoom.
[Gestionar reuniones](./remote-meetings.md) explica las escrituras.

## Salida para scripts y agentes

Usa `--json` para una respuesta completa. Un resultado lleva `item`; una lista, `items` y
`page` (`mode`, `limit`, `has_more` y `next_cursor` opcional). Ambos incluyen `meta.run_id`,
`meta.duration_ms` y `meta.complete`, con pasos `next` e información `missing` opcionales. Las claves usan snake_case.

Los informes detallados de participantes, fuentes, búsqueda semántica y búsqueda unificada
conservan cobertura y continuación dentro de `item`. La búsqueda de palabras en reuniones
guardadas devuelve elementos con `ref`, `meeting`, `excerpt` y `offset_ms`. Si están guardados,
`source` añade título, `started_at`, referencia de evidencia `ref` y documento `url`. Un URL null
indica que no hay enlace al documento; el enlace para entrar a la llamada no es un enlace a evidencia.
Los detalles están
en `item`; transcripciones y resúmenes, en `items`. Los detalles cuentan transcripciones actuales;
`meetings transcript <meeting> --history` lee revisiones anteriores conservadas.

`--jsonl` emite registros con tipo: cada resultado es `{"type":"item","data":...}`, seguido de
`{"type":"end","complete":true,"page":...}`. Las listas vacías también emiten el registro end.
Cada informe permanece en un registro item; cada confirmación continua tiene su propio registro end.
Lee `complete` e `issues` opcional en el registro end. Usa `--json` cuando necesites `next`,
`missing` y los metadatos de ejecución de la respuesta completa. La lista de comandos usa el
contrato compartido 3 con declaraciones separadas `effects.remote` y `effects.local`; ayuda,
versión y autocompletado mantienen sus protocolos.

Una fuente omitida deja `meta.complete` en false y añade un problema de esa fuente.
`search all` acepta resultados parciales y termina con código cero; revisa sus omisiones antes de
considerar completo el resultado. Otras respuestas parciales imprimen lo disponible y después
terminan con el código del primer problema. Una página limitada con más resultados es paginación
normal, en vez de un fallo de fuente.

Los errores van a stderr; `--quiet` omite otros diagnósticos.
Las tuberías reciben JSON por defecto; la terminal, salida legible. El autocompletado emite
el protocolo de la shell salvo que pidas JSON.

`--json=id,title` elige campos. Las rutas con puntos seleccionan objetos y matrices anidados, por
ejemplo `--json=ref,excerpt,source.title,source.started_at,source.url` para resultados de reuniones.
Las rutas parten del contenido del resultado; páginas, cobertura, pasos siguientes, datos ausentes
y metadatos de ejecución permanecen. La proyección reduce lo impreso, no el trabajo de búsqueda.
`--offline` rechaza la red. Los comandos finitos conservan la salida
hasta liberar recursos; el límite predeterminado es 4 MiB. `--max-output-bytes 0` lo elimina.

## Plazos y cancelación

`--timeout <milliseconds>` establece un plazo positivo para todo el comando. También acepta `30s`,
`5m` y `1h`. Lecturas: 30 segundos; acceso: cinco minutos; descargas, sincronización y verificación:
una hora. El seguimiento y MCP no tienen plazo predeterminado. La cancelación espera operaciones
y limpieza; una operación inyectada que ignore la señal puede retrasar la salida.
