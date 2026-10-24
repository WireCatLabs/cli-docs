---
title: "El servidor MCP"
---

Esta página te ayuda a conectar Memo a una aplicación de IA que no tiene terminal, como Claude Desktop
o Cursor. MCP (Model Context Protocol) es la forma en que estas aplicaciones usan un programa de tu
ordenador. Una vez conectada, la aplicación puede leer tus mensajes, tu correo, tus notas y tus reuniones archivadas, y lo que
Memo sabe de una persona. También puede guardar recuerdos, registrar hechos y proponer acciones. Las nuevas sugerencias esperan revisión; las propuestas de proyecto tienen permisos de decisión
propios, descritos más abajo.

## Comandos y permisos

Memo usa la interfaz MCP compartida de cli-core. Presenta tres herramientas:

| Herramienta | Función |
|---|---|
| `memo_tools_search` | Buscar comandos por palabras y consultar sus argumentos y respuesta; sin consulta muestra el catálogo completo con su disponibilidad actual |
| `memo_read` | Ejecutar un comando de lectura por su ruta CLI |
| `memo_write` | Ejecutar un comando de escritura por su ruta CLI; comprueba los permisos antes de ejecutarlo |

Por ejemplo, busca cómo leer una nota con `memo_tools_search {"query":"notes show"}` y llama después a
`memo_read {"command":"notes show","arguments":{"note":"note:12"}}`.
Los argumentos usan los nombres posicionales del CLI y sus opciones en snake_case. Se rechazan los argumentos desconocidos.
Los comandos ejecutan el propio CLI en el mismo proceso, con los mismos servicios, respuestas y errores.

Configura `permissions` en la [configuración](./configuration.md#permissions) para limitar lo que hace la aplicación.
La clave es una ruta con puntos, como `notes.edit`; una clave superior como `notes` cubre sus comandos.
`deny` marca el comando como no disponible, `readonly` permite lecturas y `ask` o `allow` permite escrituras.
Por MCP, `ask` se ejecuta sin una pregunta en el terminal; las preguntas de aprobación dependen de la aplicación cliente. Las escrituras sin nivel guardado usan `ask`.
`mail delete` y `mail restore` también necesitan `yes: true`, igual que sus comandos CLI necesitan `--yes`.

Los cambios en carpetas de origen o reglas de correo necesitan `mcp.authority`, cuyo valor inicial es `deny`.
Las decisiones sobre hallazgos de reuniones (`meetings.actions.confirm` y `meetings.actions.reject`) y
`projects.annotations.restore` también tienen `deny`: el propietario debe permitir expresamente cada operación.
Guarda los permisos en la configuración; la búsqueda y la siguiente llamada leen los niveles actuales.
Los permisos y el límite compartido de WireCat de solo lectura se comprueban en cada llamada.

`memo mcp --permission notes.edit=deny` restringe un permiso para ese servidor; repite la opción para más claves.
No puede ampliar los permisos guardados, incluidas las claves más específicas.
`MEMO_READ_ONLY=1` marca todos los comandos de escritura como no disponibles y los rechaza en una conexión abierta.
La búsqueda conserva los comandos bloqueados con su `availability` actual y el motivo, como hace cli-core.

Las exclusiones reservadas a CLI son `mcp`, `upgrade`, `skill install`, `jobs start` y `jobs stop`: inician otro
servidor, sustituyen el programa, instalan instrucciones en otras aplicaciones o gestionan un temporizador.

`memories add`, `facts add`, `actions add`, `meetings actions add` y `projects actions add` guardan propuestas.
Por defecto, `projects actions confirm` y `projects actions reject` pueden decidir propuestas de proyecto con un
motivo registrado. [`agent_decisions: false`](./configuration.md#agent_decisions) exige decisiones del propietario
tanto por CLI como por MCP. Memo nunca envía mensajes ni correo.

## Abrir una fuente citada

Pasa el `ref` del resultado a `notes show` como `note`, o una referencia de mensaje o correo a `messages show`
como `message`. `notes show` devuelve la nota completa; `messages show`, el mensaje o correo guardado, y con
`full: true` todo el texto de los adjuntos. `mail inspect` lee cabeceras de una cuenta explícita y `tags list`
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

<a id="existing-tool-names"></a>

## Actualizar una conexión guardada

Vuelve a conectar después de actualizar para que la aplicación recargue su lista de herramientas. Sustituye las herramientas individuales
por `memo_read` o `memo_write`, pasando la ruta CLI en `command`. Por ejemplo, `notes_show` pasa a ser
`memo_read {"command":"notes show","arguments":{"note":"note:12"}}`.
Los nombres anteriores ya no están registrados. Busca el comando para obtener su esquema de argumentos actual.

| Llamada anterior | Comando y argumentos actuales |
|---|---|
| `person_context` | `context`; conserva `person` y un `source` explícito |
| `project_context`, `project_evidence` | `projects context`, `projects evidence`; la evidencia usa `no_catch_up: true` en vez de `catch_up: false` |
| `search_notes`, `search_messages`, `search_mail`, `search_all` | `search notes`, `search messages`, `search mail`, `search all`; usa `query` en vez de `text` |
| `facts_add` | `facts add`; usa `statement` en vez de `text` |
| `search_memories` | `search memories`; usa `query` en vez de `text` |
| `meeting_passage`, `meeting_prepare` | `meetings passage`, `meetings prepare`; busca los argumentos actuales del CLI |
| `meeting_actions_add`, `project_actions_add` | `meetings actions add`, `projects actions add`; `input` lleva la propuesta JSON sin leer stdin de MCP |
| `meeting_actions_list` | `meetings actions list`; usa `query: "status:proposed"` en vez de un campo `status` |
| `project_annotations_snapshot` | `projects annotations show`; lee sin crear un archivo |
| `project_annotations_preview` | `projects annotations check`; `file` y `bindings` indican archivos JSON locales existentes |
| Otros nombres con guiones bajos | Sus rutas CLI, como `memories add`, `actions list`, `vocabulary check` y `tasks status` |

Las claves de permisos siguen siendo rutas CLI con puntos, como `projects.evidence`, no los nombres de herramientas anteriores.
Los argumentos de presupuesto del vocabulario usan snake_case, como `max_comparisons`.

Las sugerencias se guardan con el nombre de agente `memo-mcp`. Revisa los recuerdos y hechos propuestos
con `memo memories list status:proposed` y los comandos de [Recuerdos y hechos](./memories.md).

## El registro de agentes

Cada comando que llega al ejecutor de Memo queda en el registro de agentes, incluidos los rechazos por permisos o validación:

```sh
memo agents list agent:memo-mcp --limit 20
```

El registro muestra el comando con guiones bajos, el resultado y la hora, nunca sus argumentos.
La búsqueda y los rechazos del protocolo compartido ocurren antes del ejecutor de comandos.

Para la evidencia de reuniones, consulta la [búsqueda de reuniones](./search.md#search-stored-meetings). Pide a tu agente que lea
pasajes con `meetings passage` y que después prepare un lote con `meetings actions add`. Indica una `account` como
`example:work` y un objeto `input` con `schema_version: 1`, `key`, `extractor` y `findings`, con los mismos campos
que `memo meetings actions add --help`. Cada hallazgo necesita referencias exactas a fragmentos de la transcripción
y sus huellas, y un vínculo confirmado con el proyecto. Las fechas y responsables desconocidos se dejan vacíos; los
seguimientos deducidos se marcan como tales. Un reintento idéntico reutiliza la clave; una entrada distinta necesita una clave nueva.

`meetings actions show` y `meetings actions list` reciben un `source` explícito. El propietario revisa los
lotes con `memo meetings actions confirm` o `reject`, o permite explícitamente las herramientas MCP correspondientes. Preparar un lote no crea hechos ni tareas numeradas.

`projects actions add` prepara hechos y seguimientos citados sobre un proyecto: cada referencia es una referencia
`msg:` o `document:` con el `fingerprint` que dio `projects evidence`, y un texto que cambió desde entonces se rechaza
por obsoleto. `projects actions list` recorre por páginas las propuestas de un proyecto —documentos clave sugeridos
(`key:<n>`) y lotes de hallazgos—, cada una con su evidencia: si el texto cambió (`state`), el texto y los mensajes
de alrededor salvo con `brief`; los documentos citados incluyen párrafos cercanos. Si un texto cambió desde que se preparó el lote, solo impide confirmar los hallazgos que lo citan. Decide los que tengas claros con `projects actions confirm` (los ID de hallazgos que
crear) o `projects actions reject`, siempre con un `reason`, que se guarda con la decisión; pregunta al propietario por
el resto. Un lote necesita su `fingerprint`. Si el propietario fija `agent_decisions: false`, las decisiones se
rechazan y solo decide el propietario, con `memo projects actions confirm` o `reject`.

Las sugerencias de documentos clave no tienen una huella de texto guardada y devuelven `state: "untracked"`;
vuelve a leerlas antes de decidir. Los hallazgos conservan sus propias huellas para detectar cambios en las fuentes.

`projects evidence` acepta las opciones de `memo projects evidence` en snake_case y necesita `source`: entradas de
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
El correo y los documentos nuevos se indexan antes de buscar; `no_catch_up: true` lee el índice como está.
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

Usa `projects context` con la clave, el nombre exacto o un alias de un proyecto para revisar juntos los hallazgos pendientes.
Las vistas previas de reuniones leen como máximo cinco lotes de cada una de ocho cuentas de reuniones enlazadas; los
comandos de cobertura y continuación identifican registros adicionales o ausentes. Una vista previa incluye solo los
hallazgos sin decidir de este proyecto. Lee el lote completo antes de revisarlo: también puede contener hallazgos de otro proyecto.

`projects annotations show` devuelve un `snapshot` de versión 2, su `fingerprint`, cobertura y contadores de lectura acotados
para un proyecto existente. Omite los cuerpos originales y conserva el estado propuesto. Guarda el snapshot en un archivo JSON local privado,
y llama a `projects annotations check` con ese `file`, un `target_store` explícito, el destino `project:<id>` y un archivo JSON `bindings`
que asocie cada referencia externa y el proyecto. `max_read_bytes` puede reducir el presupuesto de lectura de 4 MiB.
El destino debe existir y tener fuentes y clave/nombre de proyecto coincidentes. El comando informa de conflictos y una huella sin restaurar anotaciones.
Ambos comandos rechazan argumentos desconocidos. La validación del esquema va seguida de las comprobaciones compartidas del grafo y el contenido.

Se omiten notas, vínculos específicos entre reuniones y proyectos, tareas, recuerdos, etiquetas y hallazgos: es
un formato de anotaciones seleccionadas, no una copia completa. El propietario usa el [recorrido de anotaciones seleccionadas](./recipes.md#keep-selected-project-annotations)
o permite explícitamente `projects.annotations.restore` para la herramienta generada.
Las lecturas siguen disponibles con `MEMO_READ_ONLY=1`; las llamadas conservan su entrada normal de auditoría.

Siguiente: [revisar lo que guardó la aplicación](./memories.md).
