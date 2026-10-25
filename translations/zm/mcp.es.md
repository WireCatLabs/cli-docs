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
| App local compatible con MCP | Añadir entrada del servidor y reiniciar | Los mismos comandos, como tres herramientas |

Ambos llegan a los mismos comandos, con los mismos [permisos](./configuration.md#permissions) del perfil.

## La skill del agente

`zm skill show` muestra las instrucciones del paquete. `zm skill install` escribe explícitamente
una copia con su versión en `~/.claude/skills/zoom-cli/` para Claude Code y en `~/.agents/skills/zoom-cli/`
para Codex y Gemini CLI. `--for claude` o `--for agents` elige un grupo; ambos por defecto.
La instalación no ocurre al iniciar un comando normal.

## El servidor MCP

`zm personal mcp` ofrece los comandos de zm por el protocolo stdio de MCP como tres herramientas, las mismas tres que
ofrecen todas las CLI de WireCat:

| Herramienta | Qué hace |
|---|---|
| `zm_tools_search` | encuentra el comando para una tarea ("meetings list", "search", "prepare") con sus argumentos |
| `zm_read` | ejecuta un comando que no cambia nada: `{ "command": "meetings list", "arguments": {} }` |
| `zm_write` | ejecuta un comando que cambia algo, como `remote-meetings create`, o `search meetings`, que primero actualiza el índice de palabras |

Una llamada ejecuta la propia línea de comandos, así que responde y falla exactamente como
`zm personal <command> --json`. El servidor habla por el perfil nombrado en sus `args`; el cliente no
puede cambiarlo. `watch`, `complete` y el propio servidor no se ofrecen. El inventario compartido
(`meetings scheduled`), el examen de proyectos y la actualización están disponibles según los permisos
del perfil. El acceso interactivo (`session start`) se hace en la terminal.

Los cambios de ajustes, instalación de skills, actualización y temporizadores del archivo necesitan
`mcp.authority` en `allow` o `ask`; los permisos del perfil solo se cambian desde una terminal.
Para permitirlo, ejecuta `zm personal config set permissions '{"mcp.authority":"allow"}'` y vuelve a
conectar la app si hace falta. Esto sustituye el mapa de permisos del perfil: incluye las restricciones
que ya quieras conservar.

Los comandos denegados permanecen en el listado completo y las búsquedas, con
`availability.available: false`, un motivo y la clave de permiso. `readonly` marca las escrituras como
no disponibles. La ayuda CLI y el catálogo con un perfil explícito muestran la misma información actual.
Cada llamada vuelve a comprobar los permisos antes de ejecutarse. En MCP, `ask` permite la escritura
sin una pregunta en la terminal: el `ask` de fábrica de `remote-meetings` deja que el agente cree,
modifique y cancele reuniones. Para impedirlo, asigna `{"remote-meetings": "readonly"}` al perfil.

En el formato `mcpServers` de
[Claude Desktop](https://modelcontextprotocol.io/docs/develop/connect-local-servers):

```json
{
  "mcpServers": {
    "zoom": { "command": "zm", "args": ["personal", "mcp"] }
  }
}
```

Una app puede no ver el `PATH` de la terminal; un servidor stdio hereda parte del entorno
([depurar MCP](https://modelcontextprotocol.io/docs/tools/debugging)). Si no inicia, usa la ruta
completa de `command -v zm` en Linux/macOS o `where.exe zm` en Windows como comando. Si configuraste
`ZM_CONFIG_DIR` o `MESSAGING_STORE`, pasa los mismos valores en `env` de la entrada; de lo contrario el servidor
leerá otro perfil o base. Reserva stdout para el protocolo: omite `--json` y `--jsonl`.

## Prueba la conexión

Tras instalar instrucciones, inicia otra sesión si el agente no las detectó. Después de configurar
MCP, reinicia la app y comprueba que sus herramientas Zoom aparecen. Pide:

```text prompt
Lista las reuniones guardadas. Abre la última y muestra fecha, texto disponible y un pasaje que apoye su decisión principal. Indica si los datos son incompletos.
```

Compara la reunión con `zm personal meetings list --json` en el terminal. Si hay herramientas pero no datos,
comprueba perfil/ruta e importa o descarga. Un chat web no ejecuta esta orden local sin una conexión compatible
al equipo.

## Fuentes elegidas para preparar una reunión

`meetings prepare` lee las fuentes de mensajes, correo y documentos configuradas para el perfil
([selección de fuentes](./configuration.md#select-communications-for-preparation)); por MCP es el mismo comando,
así que valen las mismas fuentes y una fuente no configurada se rechaza. Consulta
[límites y continuación](./usage.md#include-selected-messages-mail-and-documents).
