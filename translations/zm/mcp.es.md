---
title: "MCP y skills"
---

Permite al agente leer reuniones guardadas y responder con fuentes. Elige instrucciones para
un agente de terminal o MCP para una app que ejecuta herramientas locales. Una skill es un archivo
de instrucciones; MCP es su protocolo. Ninguno inicia sesión ni descarga reuniones.
[Importa o descarga al menos una](./installation.md#first-run) antes de preguntar por su texto.

## Elige la conexión

| Agente | Conexión | Resultado |
|---|---|---|
| Codex o Gemini CLI en este equipo | `zm skill install --for agents` | Instrucciones para órdenes CLI |
| Claude Code en este equipo | `zm skill install --for claude` | Sus instrucciones CLI |
| App local compatible con MCP | Añadir entrada del servidor y reiniciar | Herramientas de lectura |

Un agente de terminal puede usar la CLI más amplia, incluidas escrituras si las solicitas.
MCP da un conjunto más reducido de lectura. Son elecciones de acceso diferentes.

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
completa de `command -v zm` en Linux/macOS o `where.exe zm` en Windows. Si configuraste `ZM_CONFIG_DIR` o `MESSAGING_STORE`, pasa los mismos valores
en `env`; de lo contrario leerá otro perfil o base.

Reserva stdout para el protocolo: omite `--json`, `--jsonl` y `--fields`. `--max-output-bytes`
limita cada resultado; cero elimina el límite. Elige un perfil e importa o descarga sus datos antes
de leerlos. El descubrimiento funciona sin datos guardados.

`meeting_people` busca nombres/correos guardados de participantes en la cuenta fijada por el servidor.
Usa `limit`, `scan_limit`, `max_read_bytes` y `cursor` para acotar la lectura. El `item.page` del informe
y el paso `item.next` conservan la continuación aunque la página actual no tenga coincidencias.
`identity_id` identifica una identidad observada; los nombres repetidos no crean vínculos con personas.
`meetings_list` acepta una consulta de metadatos `query` (por ejemplo, `started_at:[2026-09-12 TO 2026-10-12]`)
en lugar de los antiguos `since` y `until`, y devuelve la entidad de reunión y el sobre de lista comunes.

## Prueba la conexión

Tras instalar instrucciones, inicia otra sesión si el agente no las detectó. Después de configurar
MCP, reinicia la app y comprueba que sus herramientas Zoom aparecen. Pide:

```text prompt
Lista las reuniones guardadas. Abre la última y muestra fecha, texto disponible y un pasaje que apoye su decisión principal. Indica si los datos son incompletos.
```

Compara la reunión con `zm meetings list --json` en el terminal. Si hay herramientas pero no datos,
comprueba perfil/ruta e importa o descarga. Si no se inicia, usa `where.exe zm` en Windows o
`command -v zm` en Linux/macOS y pon la ruta completa en la entrada. Un chat web no ejecuta esta
orden local sin una conexión compatible al equipo.

## Formato de respuesta

Las respuestas correctas usan los mismos sobres de elemento/lista que la CLI, con claves
snake_case y `meta.run_id` / `meta.duration_ms`. Los informes detallados de contexto,
participantes y búsqueda semántica están en `item`; las listas de reuniones, transcripciones,
resúmenes y coincidencias de palabras usan `items` y `page`. El contenido de texto y el
estructurado contienen la misma respuesta completa. Cada herramienta declara un esquema estricto
de éxito/error. El manejador rechaza argumentos desconocidos antes de abrir el almacén, con
`validation_error` que nombra el campo. El servidor selecciona la cuenta.

## Herramientas opcionales

Los indicadores amplían el conjunto: `--meeting-context` añade pasajes citados, fuentes, contexto personal y propuestas
de tareas; `--unified-search`, búsqueda compartida solo de reuniones; `--semantic --model <model>`, la búsqueda `search_meetings` en vectores existentes mediante `by_meaning`. Los componentes remotos necesitan `--base-url` y `--dims`. El servidor fija el
componente al iniciar y el perfil al leer por primera vez. Reinícialo para cambiar la selección;
los clientes no pueden hacerlo. Generar vectores y crear tareas no son herramientas MCP.

Para contexto entre proyectos, notas y documentos, continúa con
[búsqueda y fuentes](./search.md#notes-tags-and-memories-with-memo); conecta Memo por separado cuando haga falta.
