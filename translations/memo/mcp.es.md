---
title: "El servidor MCP"
---

Esta página te ayuda a conectar Memo a una aplicación de IA que no tiene terminal, como Claude Desktop
o Cursor. MCP (Model Context Protocol) es la forma en que estas aplicaciones usan un programa de tu
ordenador. Una vez conectada, la aplicación puede guardar recuerdos, registrar hechos, proponer
acciones y leer el registro de agentes. Lo que guarda espera tu revisión.

## Qué puede hacer la aplicación a través de MCP

| La aplicación puede | La aplicación no puede |
|---|---|
| Añadir, listar, mostrar y buscar recuerdos | Confirmar un recuerdo |
| Añadir, listar y mostrar hechos | Aceptar un hecho |
| Proponer acciones y listarlas | Aprobar o rechazar una acción |
| Leer el registro de agentes | Cambiar tus notas, tu correo o tus mensajes |
| Buscar proyectos, etiquetas y temas por su nombre, y ver qué tareas están listas | Crear o vincular tareas |

La búsqueda, el contexto de una persona y las notas no forman parte del servidor MCP de Memo. Una
aplicación llega a ellos a través del servidor MCP de tg o de max (consulta
[el servidor MCP de tg](https://wirecat.dev/en/docs/tg/mcp)), o un agente con terminal ejecuta `memo`
con `--json`.

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

| Herramienta | Qué hace |
|---|---|
| `memories_add`, `memories_list`, `memories_show`, `memories_search` | Guarda y lee recuerdos |
| `facts_add`, `facts_list`, `facts_show` | Registra y lee hechos |
| `actions_propose`, `actions_list`, `actions_show` | Propone acciones y las lee |
| `agents_log` | Lee el registro de agentes |
| `vocabulary_list`, `vocabulary_resolve`, `vocabulary_preflight` | Busca proyectos, etiquetas y temas, solo lectura |
| `task_relations`, `task_readiness`, `tasks_ready` | Muestra cómo dependen las tareas unas de otras, solo lectura |

Todo lo que añade la aplicación se guarda con el nombre de agente `memo-mcp` y espera como propuesto. Lo revisas
con `memo memories list --status proposed` y los comandos de [Recuerdos y hechos](./memories.md).

## El registro de agentes

Cada llamada que hace la aplicación se escribe en el registro de agentes:

```sh
memo agents log --agent memo-mcp --limit 20
```

El registro muestra la herramienta, el resultado y la hora, nunca lo que envió la aplicación.

Siguiente: [revisar lo que guardó la aplicación](./memories.md).
