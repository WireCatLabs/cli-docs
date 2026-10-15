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

## Prepara una próxima reunión

Tienes una próxima llamada en Zoom y quieres tener a mano la conversación anterior. Pide al agente:

```text prompt
Prepárame para la próxima llamada de Research Example en Zoom. Identifica primero la serie correcta.
Muestra la próxima hora, pasajes citados de llamadas anteriores, vínculos confirmados al proyecto,
decisiones guardadas y tareas con origen directo en esas reuniones. Si encajan varias series,
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
permite recuperar el registro completo y su evidencia mediante Memo antes de usarlo. No busca notas,
correo ni mensajes: `knowledge.coverage` lo indica con `fact_evidence: not-revalidated`
y `other_sources: not-queried`.

Si aparece la próxima hora sin reuniones anteriores, descarga el periodo pertinente mediante la
API de Zoom para guardar sus vínculos exactos a la serie. Un archivo de transcripción importado
puede carecer de ese ID del proveedor. La preparación no une llamadas por títulos o nombres parecidos.

La cobertura distingue historial ausente, reuniones sin fecha, filas adicionales y límites de salida.
No se conoce si el archivo incluye todo el historial. Las notas de personas/proyectos, el correo,
los mensajes y las candidatas por nombre/alias quedan sin consultar; sin reuniones anteriores
utilizables, tampoco se consulta el historial relacionado. La evidencia de los hechos guardados
no se vuelve a comprobar. Usa [búsqueda y fuentes](./search.md) para investigar esas lagunas.
La preparación no genera un resumen, acepta hallazgos ni crea tareas.

Para una ventana fija, usa tiempos ISO con zona en `--since-time`, `--before-time` y
`--history-since-time`. `--meetings` limita por separado el historial de la serie y el relacionado;
`--cues` y `--context-limit` acotan el contexto. `--max-read-bytes` acota cada lectura y `--bytes`
el elemento completo. Las fuentes de la serie tienen prioridad; `related.has_more` y
`related.output_limited` indican contexto relacionado adicional u omitido.
Los hechos aceptados tienen indicadores independientes `knowledge.coverage.has_more` y `knowledge.coverage.output_limited`;
se devuelven hasta veinte (o un `--context-limit` menor), cediendo bytes a las fuentes de reuniones. Pueden quedar filas
fuera del límite. Las fuentes omitidas dan `meta.complete=false`: revisa sus referencias antes de
usar el informe. Si la cobertura señala un recorte, aumenta el límite correspondiente.

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
| `meetings prepare <series-id>` | reunir la próxima cita y el contexto guardado con fuentes de una serie elegida |
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
