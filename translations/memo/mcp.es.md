---
title: "El servidor MCP"
---

Esta página te ayuda a conectar Memo a una aplicación de IA que no tiene terminal, como Claude Desktop
o Cursor. MCP (Model Context Protocol) es la forma en que estas aplicaciones usan un programa de tu
ordenador. Una vez conectada, la aplicación puede leer tus mensajes, tu correo, tus notas y tus reuniones archivadas, y lo que
Memo sabe de una persona. También puede guardar recuerdos, registrar hechos y proponer acciones. Las nuevas sugerencias esperan revisión; las propuestas de proyecto tienen permisos de decisión
propios, descritos más abajo.

## Qué puede hacer la aplicación a través de MCP

| La aplicación puede | La aplicación no puede |
|---|---|
| Buscar y leer tus mensajes, correo y notas guardados | Enviar un mensaje o un correo |
| Leer el contexto de una persona o revisar los hallazgos pendientes de un proyecto | Cambiar tus notas, tu correo o tus mensajes |
| Añadir, listar, mostrar y buscar recuerdos | Confirmar un recuerdo |
| Añadir, listar y mostrar hechos | Aceptar directamente un hecho ya propuesto |
| Proponer acciones y listarlas | Aprobar o rechazar una acción |
| Revisar propuestas de proyecto y, si está permitido, decidir hechos y seguimientos citados con un motivo | Confirmar un lote de hallazgos de reuniones |
| Leer el registro de agentes | Borrar mensajes, correo o notas de origen |
| Buscar proyectos, etiquetas y temas por su nombre, y ver qué tareas están listas | Crear o modificar tareas arbitrarias |

`memories_add`, `facts_add`, `actions_add`, `meeting_actions_add` y `project_actions_add` guardan propuestas.
Por defecto, `project_actions_confirm` y `project_actions_reject` pueden decidir propuestas de proyecto
por ti con un motivo guardado. Confirmar puede crear hechos aceptados y tareas numeradas, o confirmar
un documento clave. Fija [`agent_decisions: false`](./configuration.md#agent_decisions) para que solo
el propietario decida las propuestas de proyecto; leer y proponer siguen disponibles. Los hallazgos
de reuniones siguen necesitando al propietario. Memo nunca envía una acción propuesta con `actions_add`.

Las demás herramientas no modifican los registros de origen; la búsqueda de reuniones y la recopilación
de contexto de proyecto pueden actualizar índices de texto locales. Conecta Memo solo a una aplicación
en la que confíes para leer tus mensajes, tu correo y tus notas.

## Conectar una aplicación

Añade Memo a la configuración MCP de la aplicación. La mayoría de las aplicaciones usan un archivo
como este:

```json
{ "mcpServers": { "memo": { "command": "memo", "args": ["mcp"] } } }
```

Añade la entrada `memo` junto a los servidores que ya haya en el archivo:

| Aplicación | Archivo de configuración |
|---|---|
| Cursor | `~/.cursor/mcp.json` |
| Claude Desktop, macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop, Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

Reinicia la aplicación después de guardar el archivo. Memo debe estar instalado en el mismo ordenador
que la aplicación. Si la aplicación no encuentra `memo`, sustituye `"memo"` por su ruta completa, que
muestra `which memo` (macOS y Linux) o `where.exe memo` (Windows).

Después, pruébalo:

```text prompt
Use the memo tools to list the memories waiting for my review.
```

## Las herramientas

| Herramienta | Función |
|---|---|
| `search_all` | Buscar mensajes de todos los servicios, correo y notas; solo lectura |
| `search_messages`, `search_mail`, `search_notes` | Buscar un tipo con todos sus campos; solo lectura |
| `search_meetings`, `meeting_passage` | Buscar en reuniones guardadas de una cuenta de origen elegida explícitamente y leer pasajes citados de la transcripción |
| `meeting_prepare` | Reunir el historial guardado de la serie y el contexto enlazado, opcionalmente con cuentas de mensajes o correo elegidas explícitamente; no verifica la hora de la próxima reunión |
| `project_context` | Documentos clave, relaciones, hechos y hallazgos de reuniones pendientes, junto con las tareas numeradas abiertas |
| `project_evidence` | Referencias citadas sobre un proyecto en mensajes, correo, transcripciones de reuniones y carpetas de notas guardados, buscadas por sus nombres, palabras adicionales y personas; solo lectura |
| `project_actions_add`, `project_actions_list`, `project_actions_confirm`, `project_actions_reject` | Preparar hechos y seguimientos citados sobre un proyecto, revisarlos con la evidencia y su contexto, y decidir los que tengas claros con un motivo |
| `meeting_actions_add`, `meeting_actions_show`, `meeting_actions_list` | Proponer y examinar hechos y seguimientos citados de reuniones; nunca los confirma |
| `person_context` | Una persona entre servicios y correo, con notas y tareas enlazadas; solo lectura |
| `memories_add`, `memories_list`, `memories_show`, `search_memories` | Guardar y leer recuerdos |
| `facts_add`, `facts_list`, `facts_show` | Registrar y leer hechos |
| `actions_add`, `actions_list`, `actions_show` | Proponer y leer acciones |
| `agents_log` | Leer el registro del agente |
| `vocabulary_list`, `vocabulary_show`, `vocabulary_check` | Consultar proyectos, etiquetas y temas; solo lectura |
| `vocabulary_inspect` | Examinar dos etiquetas elegidas antes de unirlas: recuentos, coincidencias y muestras limitadas; no fusiona nada |
| `tasks_relations`, `tasks_status`, `tasks_list` | Consultar dependencias entre tareas; solo lectura |

Las sugerencias se guardan con el nombre de agente `memo-mcp`. Revisa los recuerdos y hechos propuestos
con `memo memories list status:proposed` y los comandos de [Recuerdos y hechos](./memories.md).

## El registro de agentes

Cada llamada que hace la aplicación se escribe en el registro de agentes:

```sh
memo agents log agent:memo-mcp --limit 20
```

El registro muestra la herramienta, el resultado y la hora, nunca lo que envió la aplicación.

Para la evidencia de reuniones, consulta la [búsqueda de reuniones](./search.md#search-stored-meetings). Pide a tu agente que lea
pasajes con `meeting_passage` y que después prepare un lote con `meeting_actions_add`. Indica una `account` como
`example:work` y un objeto `input` con `schema_version: 1`, `key`, `extractor` y `findings`, con los mismos campos
que `memo meetings actions add --help`. Cada hallazgo necesita referencias exactas a fragmentos de la transcripción
y sus huellas, y un vínculo confirmado con el proyecto. Las fechas y responsables desconocidos se dejan vacíos; los
seguimientos deducidos se marcan como tales. Un reintento idéntico reutiliza la clave; una entrada distinta necesita una clave nueva.

`meeting_actions_show` y `meeting_actions_list` reciben un `source` explícito. Solo el propietario revisa los
lotes con `memo meetings actions confirm` o `reject`. Preparar un lote no crea hechos ni tareas numeradas.

`project_actions_add` prepara hechos y seguimientos citados sobre un proyecto: cada referencia es una referencia
`msg:` o `document:` con el `fingerprint` que dio `project_evidence`, y un texto que cambió desde entonces se rechaza
por obsoleto. `project_actions_list` recorre por páginas las propuestas de un proyecto —documentos clave sugeridos
(`key:<n>`) y lotes de hallazgos—, cada una con su evidencia: si el texto cambió (`state`), el texto y los mensajes
de alrededor salvo con `brief`; los documentos citados incluyen párrafos cercanos. Si un texto cambió desde que se preparó el lote, solo impide confirmar los hallazgos que lo citan. Decide los que tengas claros con `project_actions_confirm` (los ID de hallazgos que
crear) o `project_actions_reject`, siempre con un `reason`, que se guarda con la decisión; pregunta al propietario por
el resto. Un lote necesita su `fingerprint`. Si el propietario fija `agent_decisions: false`, las decisiones se
rechazan y solo decide el propietario, con `memo projects actions confirm` o `reject`.

Las sugerencias de documentos clave no tienen una huella de texto guardada y devuelven `state: "untracked"`;
vuelve a leerlas antes de decidir. Los hallazgos conservan sus propias huellas para detectar cambios en las fuentes.

`project_evidence` acepta las opciones de `memo projects evidence` en snake_case y necesita `source`: entradas de
cuenta, un tipo, `group:<name>` o `all`. Busca por separado el nombre del proyecto, su clave, cada alias guardado y
cada `alias`, cada `context_query` y cada `contact`, y une los resultados; `since_time` vale `60d` por defecto.
El `before_time` opcional fija el final exclusivo en una marca de tiempo ISO 8601 con `Z` o un desfase UTC. Los días
hacia atrás se cuentan desde ese instante; una fecha de inicio explícita también lo usa como final. Mantén el mismo
valor al continuar. Fija la ventana, no los datos de origen ni los alias o cuentas registrados.
Admite cuentas de reuniones: un perfil registrado como `zm:work` selecciona los fragmentos guardados e
indexados de sus transcripciones. Los resultados conservan referencias exactas a fragmentos `meeting:`
y usan la fecha de inicio de la reunión (`time_kind: "meeting-start"`). Se excluyen transcripciones
sustituidas o eliminadas. Las transcripciones ausentes y los archivos incompletos siguen siendo
desconocidos; Memo no descarga grabaciones. La indexación de transcripciones usa el flujo existente
de la herramienta de reuniones; la actualización de correo y documentos descrita abajo no las indexa.
El correo y los documentos nuevos se indexan antes de buscar; `catch_up: false` lee el índice como está.
Cada resultado de mensaje contiene `around`: `before_n` y `after_n` mensajes vecinos del chat (2 por defecto),
como contexto, nunca como resultados adicionales. `mentions` enumera otros proyectos, etiquetas y temas
que los textos mencionan, con referencias; un nombre no establece pertenencia. Un elemento encontrado solo por el nombre
de un contacto lleva `context: "person-only"`. Las fuentes que fallaron o no se leyeron se listan, y `completeness`
sigue en `unknown`. Si devuelve un `checkpoint`, vuelve a llamar con los mismos argumentos y `cursor` igual a ese valor.
No crea hechos, tareas ni vínculos con proyectos; la actualización del índice descrita arriba puede modificar los índices de búsqueda locales.

Usa `project_context` con la clave, el nombre exacto o un alias de un proyecto para revisar juntos los hallazgos pendientes.
Las vistas previas de reuniones leen como máximo cinco lotes de cada una de ocho cuentas de reuniones enlazadas; los
comandos de cobertura y continuación identifican registros adicionales o ausentes. Una vista previa incluye solo los
hallazgos sin decidir de este proyecto. Lee el lote completo antes de revisarlo: también puede contener hallazgos de otro proyecto.

Siguiente: [revisar lo que guardó la aplicación](./memories.md).
