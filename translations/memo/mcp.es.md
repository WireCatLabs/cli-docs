---
title: "El servidor MCP"
---

Esta página te ayuda a conectar Memo a una aplicación de IA que no tiene terminal, como Claude Desktop
o Cursor. MCP (Model Context Protocol) es la forma en que estas aplicaciones usan un programa de tu
ordenador. Una vez conectada, la aplicación puede leer tus mensajes, tu correo, tus notas y tus reuniones archivadas, y lo que
Memo sabe de una persona. También puede guardar recuerdos, registrar hechos y proponer acciones. Lo
que guarda espera tu revisión.

## Qué puede hacer la aplicación a través de MCP

| La aplicación puede | La aplicación no puede |
|---|---|
| Buscar y leer tus mensajes, correo y notas guardados | Enviar un mensaje o un correo |
| Leer el contexto de una persona en los mensajeros y el correo | Cambiar tus notas, tu correo o tus mensajes |
| Añadir, listar, mostrar y buscar recuerdos | Confirmar un recuerdo |
| Añadir, listar y mostrar hechos | Aceptar un hecho |
| Proponer acciones y listarlas | Aprobar o rechazar una acción |
| Leer el registro de agentes | Borrar nada |
| Buscar proyectos, etiquetas y temas por su nombre, y ver qué tareas están listas | Crear o vincular tareas |

Solo tres herramientas escriben: `memories_add`, `facts_add` y `actions_add`. Lo que añaden queda
como propuesta hasta que lo confirmas, y una acción nunca se envía. Las demás herramientas no modifican los registros de origen; la búsqueda de reuniones puede actualizar su índice de texto local. Conecta Memo solo a una aplicación en la que confíes para leer tus mensajes, tu correo y tus notas.

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
| `person_context` | Una persona entre servicios y correo, con notas y tareas enlazadas; solo lectura |
| `memories_add`, `memories_list`, `memories_show`, `search_memories` | Guardar y leer recuerdos |
| `facts_add`, `facts_list`, `facts_show` | Registrar y leer hechos |
| `actions_add`, `actions_list`, `actions_show` | Proponer y leer acciones |
| `agents_log` | Leer el registro del agente |
| `vocabulary_list`, `vocabulary_show`, `vocabulary_check` | Consultar proyectos, etiquetas y temas; solo lectura |
| `vocabulary_inspect` | Examinar dos etiquetas elegidas antes de unirlas: recuentos, coincidencias y muestras limitadas; no fusiona nada |
| `tasks_relations`, `tasks_status`, `tasks_list` | Consultar dependencias entre tareas; solo lectura |

Todo lo que añade la aplicación se guarda con el nombre de agente `memo-mcp` y espera como propuesto. Lo revisas
con `memo memories list status:proposed` y los comandos de [Recuerdos y hechos](./memories.md).

## El registro de agentes

Cada llamada que hace la aplicación se escribe en el registro de agentes:

```sh
memo agents log agent:memo-mcp --limit 20
```

El registro muestra la herramienta, el resultado y la hora, nunca lo que envió la aplicación.

Para la evidencia de reuniones, consulta la [búsqueda de reuniones](./search.md#search-stored-meetings). Los lotes de
hallazgos de reuniones se crean por ahora desde la línea de comandos (`memo meetings actions add`), no con una herramienta MCP por lotes.

Siguiente: [revisar lo que guardó la aplicación](./memories.md).
