---
title: "MCP y skills"
---

Da al agente las reuniones guardadas: una skill, instrucciones que puede cargar al ejecutar comandos,
o un servidor MCP de solo lectura para aplicaciones sin terminal.

## La skill del agente

`zm skill show` muestra las instrucciones del paquete. `zm skill install` escribe explícitamente
una copia con su versión en `~/.claude/skills/zoom-cli/` para Claude Code y en `~/.agents/skills/zoom-cli/`
para Codex y Gemini CLI. `--for claude` o `--for agents` elige un grupo; ambos por defecto.
La instalación no ocurre al iniciar un comando normal.

## El servidor MCP

`zm serve --mcp` usa stdio y ofrece siete herramientas de solo lectura: lista y detalles de reuniones,
transcripciones, resúmenes, exportaciones, búsqueda de texto y participantes. Descubrir herramientas
no abre la base. Cada lectura usa la cuenta elegida y cierra su conexión antes de responder; el cliente
no puede cambiar la cuenta. No se exponen escritura de archivos exportados ni cambios remotos.

Un cliente MCP ejecuta `zm` con `["serve", "--mcp"]`. En el formato `mcpServers` de
[Claude Desktop](https://modelcontextprotocol.io/docs/develop/connect-local-servers):

```json
{
  "mcpServers": {
    "zoom": { "command": "zm", "args": ["serve", "--mcp"] }
  }
}
```

Una app puede no ver el `PATH` de la terminal; un servidor stdio hereda parte del entorno
([depurar MCP](https://modelcontextprotocol.io/docs/tools/debugging)). Si no inicia, usa la ruta
completa de `which zm`. Si configuraste `ZM_CONFIG_DIR` o `MESSAGING_STORE`, pasa los mismos valores
en `env`; de lo contrario leerá otro perfil o base.

Reserva stdout para el protocolo: omite `--json`, `--jsonl` y `--fields`. `--max-output-bytes`
limita cada resultado; cero elimina el límite. Elige un perfil e importa o descarga sus datos antes
de leerlos. El descubrimiento funciona sin datos guardados.

## Herramientas opcionales

Los indicadores amplían el conjunto: `--meeting-context` añade fuentes, contexto personal y propuestas
de tareas; `--unified-search`, búsqueda compartida solo de reuniones; `--semantic --model <id>`, una
consulta de vectores. Los componentes remotos necesitan `--base-url` y `--dims`. El servidor fija el
componente al iniciar y el perfil al leer por primera vez. Reinícialo para cambiar la selección;
los clientes no pueden hacerlo. Generar vectores y crear tareas no son herramientas MCP.
