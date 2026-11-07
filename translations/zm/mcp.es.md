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

`zm personal mcp serve` ofrece los comandos de zm por el protocolo stdio de MCP como tres herramientas, las mismas tres que
ofrecen todas las CLI de WireCat:

| Herramienta | Qué hace |
|---|---|
| `zm_tools_search` | encuentra el comando para una tarea ("meetings list", "search", "prepare") con sus argumentos |
| `zm_read` | ejecuta un comando que no cambia nada: `{ "command": "meetings list", "arguments": {} }` |
| `zm_write` | ejecuta un comando que cambia algo, como `remote-meetings create` |

Una llamada ejecuta la propia línea de comandos, así que responde y falla exactamente como
`zm personal <command> --json`. El servidor habla por el perfil nombrado en sus `args`; el cliente no
puede cambiarlo. `watch` y el propio servidor no se ofrecen. El inventario compartido
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
    "zoom": { "command": "zm", "args": ["personal", "mcp", "serve"] }
  }
}
```

Una app puede no ver el `PATH` de la terminal; un servidor stdio hereda parte del entorno
([depurar MCP](https://modelcontextprotocol.io/docs/tools/debugging)). Si no inicia, usa la ruta
completa de `command -v zm` en Linux/macOS o `where.exe zm` en Windows como comando. Si configuraste
`ZM_CONFIG_DIR` o `MESSAGING_STORE`, pasa los mismos valores en `env` de la entrada; de lo contrario el servidor
leerá otro perfil o base. Reserva stdout para el protocolo: omite `--json` y `--jsonl`.

### Hacer más estricto un servidor

`zm personal mcp serve --permission meetings=deny` hace más estricto un permiso solo para ese servidor, y se repite
para más claves. Nunca relaja el perfil: un valor que lo haría se rechaza al iniciar el servidor, igual que una clave
que no nombra ningún comando. `zm personal mcp config` y `zm personal mcp add` aceptan la misma opción, y `mcp add` y
`mcp check` configuran y prueban la entrada para Codex o Claude Code.

### Apps de navegador por HTTP

`zm personal mcp serve --http --public-url https://<name>.ts.net` sirve en `127.0.0.1` para apps de IA en un
navegador, detrás de tu propio túnel; `--port` cambia el puerto local (8765 por defecto). Las escrituras siguen los
permisos del perfil, igual que por stdio. Una app de navegador inicia sesión una vez con un código que el servidor
imprime en stderr (`mcp server status` lo vuelve a mostrar); su acceso dura una hora y su renovación 30 días.
`zm personal mcp revoke` cierra todas las sesiones. `zm personal mcp server start`, `stop` y `status` ejecutan ese
servidor en segundo plano, y `--profiles` funciona con todos ellos.

### Varios perfiles desde un servidor

`zm mcp serve --profiles work,personal` sirve los perfiles que nombra desde un servidor, y `zm mcp serve --profiles
all` sirve todos los perfiles de este equipo, así que una app de IA necesita una sola entrada de Zoom, no una por
perfil. Cada herramienta pide entonces un `profile` obligatorio, y se indica al agente que pregunte si no nombraste
ninguno. Una llamada se ejecuta en el propio `zm <profile> mcp serve` de ese perfil, con sus permisos. El servidor
nombra en stderr los perfiles que sirve al iniciar.

Un servidor siempre nombra lo que sirve: `zm mcp serve` sin perfil y sin `--profiles` se detiene y enumera los
perfiles de este equipo, y lo mismo hacen un perfil junto con `--profiles` y un nombre que no es un perfil de aquí.
Con `ZM_PROFILE_LOCK`, `--profiles` solo puede nombrar el perfil bloqueado.

```json
{
  "mcpServers": {
    "zoom": { "command": "zm", "args": ["mcp", "serve", "--profiles", "all"] }
  }
}
```

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
