---
title: "El servidor MCP"
---

Esta página te ayuda a conectar Memo a una aplicación de IA que no tiene terminal, como Claude Desktop
o Cursor. MCP (Model Context Protocol) es la forma en que estas aplicaciones usan un programa de tu
ordenador. Una vez conectada, la aplicación puede leer tus mensajes, tu correo, tus notas y tus reuniones archivadas, y lo que
Memo sabe de una persona. También puede guardar recuerdos, registrar hechos y proponer acciones. Las nuevas sugerencias esperan revisión; las propuestas de proyecto tienen permisos de decisión
propios, descritos más abajo.

## Comandos y permisos

MCP ofrece los comandos de Memo, incluidas las escrituras. Sus nombres separan palabras con guiones bajos:
`notes_show`, `notes_edit`, `memories_confirm`, `tasks_add`, `mail_trash` y `mail_restore`. Los nombres existentes
`person_context`, `project_evidence` y `meeting_passage` conservan sus argumentos y la forma de respuesta.

Configura `permissions` en la [configuración](./configuration.md#permissions) para limitar las acciones.
La clave es una ruta con puntos, como `notes.edit`; una clave superior como `notes` cubre sus comandos.
`deny` oculta herramientas, `readonly` permite leer y `ask` o `allow` permiten escribir. En MCP `ask` se ejecuta
sin pregunta en el terminal; la aplicación obtiene la aprobación del propietario. Las escrituras sin nivel
guardado usan `ask`. `mail_trash` y `mail_restore` también necesitan `yes: true`, como `--yes` en CLI.

Cambiar carpetas de origen o reglas de correo requiere `mcp.authority`, cuyo valor predeterminado es `deny`.
Las decisiones de hallazgos (`meetings.actions.confirm` y `meetings.actions.reject`) y
`projects.annotations.restore` también tienen `deny`: el propietario debe permitir cada operación explícitamente.
Configura el permiso y reconecta para descubrir herramientas recién permitidas. Cada llamada vuelve a comprobar
los permisos y el límite compartido de lectura de WireCat.

`memo mcp --permission notes.edit=deny` restringe un permiso para ese servidor; repite la opción para otras claves.
No puede relajar los permisos guardados, incluidas claves más específicas. `MEMO_READ_ONLY=1` oculta todas las
herramientas de escritura y rechaza escrituras en conexiones existentes.

Las exclusiones reservadas a CLI son `mcp`, `upgrade`, `skill install`, `auto start` y `auto stop`: inician otro
servidor, sustituyen el programa, instalan instrucciones en otras aplicaciones o gestionan un temporizador.

`memories_add`, `facts_add`, `actions_add`, `meeting_actions_add` y `project_actions_add` guardan propuestas.
Por defecto, `project_actions_confirm` y `project_actions_reject` pueden decidir propuestas de proyecto con un
motivo registrado. [`agent_decisions: false`](./configuration.md#agent_decisions) exige decisiones del propietario
tanto en los nombres existentes como en los comandos generados. Memo nunca envía mensajes ni correo.

## Abrir una fuente citada

Pasa el `ref` del resultado a `notes_show` como `note`, o una referencia de mensaje o correo a `messages_show`
como `message`. `notes_show` devuelve la nota completa; `messages_show`, el mensaje o correo guardado, y con
`full: true` todo el texto de los adjuntos. `mail_inspect` lee cabeceras de una cuenta explícita y `tags_list`
lista etiquetas. Los mensajes usan la cuenta y el chat de la referencia; no se consulta al proveedor.

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
Usa las herramientas de memo para mostrar los recuerdos que esperan mi revisión.
```

## Nombres de herramientas existentes

Estos nombres siguen disponibles junto a las herramientas de [todos los comandos](./commands.md), según los permisos.

| Herramienta | Función |
|---|---|
| `search_all` | Buscar mensajes de todos los servicios, correo y notas; solo lectura |
| `search_messages`, `search_mail`, `search_notes` | Buscar un tipo con todos sus campos; solo lectura |
| `search_meetings`, `meeting_passage` | Buscar en reuniones guardadas de una cuenta de origen elegida explícitamente y leer pasajes citados de la transcripción |
| `meeting_prepare` | Reunir el historial guardado de la serie y el contexto enlazado, opcionalmente con cuentas de mensajes o correo elegidas explícitamente; no verifica la hora de la próxima reunión |
| `project_context` | Documentos clave, relaciones, hechos y hallazgos de reuniones pendientes, junto con las tareas numeradas abiertas |
| `project_evidence` | Referencias citadas sobre un proyecto en mensajes, correo, transcripciones de reuniones y carpetas de notas guardados, buscadas por sus nombres, palabras adicionales y personas; solo lectura |
| `project_actions_add`, `project_actions_list`, `project_actions_confirm`, `project_actions_reject` | Preparar hechos y seguimientos citados sobre un proyecto, revisarlos con la evidencia y su contexto, y decidir los que tengas claros con un motivo |
| `project_annotations_snapshot`, `project_annotations_preview` | Leer anotaciones o comprobar correspondencias; `projects_annotations_restore` necesita su permiso explícito |
| `meeting_actions_add`, `meeting_actions_show`, `meeting_actions_list` | Proponer e inspeccionar hallazgos de reuniones; las decisiones necesitan permisos explícitos |
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

`meeting_actions_show` y `meeting_actions_list` reciben un `source` explícito. El propietario revisa los
lotes con `memo meetings actions confirm` o `reject`, o permite explícitamente las herramientas MCP correspondientes. Preparar un lote no crea hechos ni tareas numeradas.

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
que los textos mencionan, con referencias; un nombre no establece pertenencia. También se lee cada mensaje de un chat
confirmado como del proyecto (`memo relationships add
chat:<provider>/<account>/<chat> project:<id>`) cuando `source`
incluye su cuenta: esos elementos tienen `context: "linked-chat"` y no nombran nada, su línea tiene `query: null` y
`chat`, y un chat vinculado fuera de `source` aparece en `unread_sources` y nunca se lee. Un elemento encontrado solo
por el nombre de un contacto lleva `context: "person-only"`. Un contacto `person:<id>` lee lo que escribieron las
identidades guardadas de esa persona en `source` (línea `kinds: ["sender"]`, `query: null`, `senders`; elementos con
`context: "sender"`, que pueden no nombrar nada) y busca solo los alias que el propietario les dio, no su nombre
visible en el mensajero. Las fuentes que fallaron o no se leyeron se listan, y `completeness`
sigue en `unknown`. Si devuelve un `checkpoint`, vuelve a llamar con los mismos argumentos y `cursor` igual a ese valor.
No crea hechos, tareas ni vínculos con proyectos; la actualización del índice descrita arriba puede modificar los índices de búsqueda locales.

Usa `project_context` con la clave, el nombre exacto o un alias de un proyecto para revisar juntos los hallazgos pendientes.
Las vistas previas de reuniones leen como máximo cinco lotes de cada una de ocho cuentas de reuniones enlazadas; los
comandos de cobertura y continuación identifican registros adicionales o ausentes. Una vista previa incluye solo los
hallazgos sin decidir de este proyecto. Lee el lote completo antes de revisarlo: también puede contener hallazgos de otro proyecto.

`project_annotations_snapshot` devuelve un `snapshot` de versión 2, su `fingerprint`, cobertura y
contadores acotados para un proyecto existente. Omite el cuerpo de las fuentes y conserva el estado
propuesto. Pasa la instantánea a `project_annotations_preview` con `target_store` explícito, el proyecto
de destino `project:<id>` y `bindings` que asocien cada referencia externa y el proyecto. `max_read_bytes`
puede reducir el presupuesto de lectura de 4 MiB. El destino debe existir con fuentes, clave y nombre
del proyecto coincidentes. La herramienta informa de conflictos y devuelve una huella sin restaurar.
Ambas rechazan argumentos desconocidos; tras validar el esquema se comprueban el grafo y su contenido.

Se omiten notas, vínculos específicos entre reuniones y proyectos, tareas, recuerdos, etiquetas y hallazgos: es
un formato de anotaciones seleccionadas, no una copia completa. El propietario usa el [recorrido de anotaciones seleccionadas](./recipes.md#keep-selected-project-annotations)
o permite explícitamente `projects.annotations.restore` para la herramienta generada.
Las lecturas siguen disponibles con `MEMO_READ_ONLY=1`; las llamadas conservan su entrada normal de auditoría.

Siguiente: [revisar lo que guardó la aplicación](./memories.md).
