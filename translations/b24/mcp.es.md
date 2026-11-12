---
title: "MCP"
---

Usa esta página para dar a un agente de IA tu CRM por MCP (Model Context Protocol), la forma en que un agente pregunta
a un programa qué sabe hacer y luego lo llama. A un agente con terminal, como Claude Code o Codex, le van mejor los
comandos y la skill (`b24 skill install`). MCP es para un cliente que no puede ejecutar comandos: una aplicación de
chat, un agente remoto, ChatGPT o Claude en el navegador.

Antes de empezar, inicia sesión en el perfil (`b24 work session start`, con un webhook o una aplicación local) y lee
[Permisos](./permissions.md), porque por MCP una escritura en `ask` sigue adelante.

## Añade b24 a un agente

```sh
b24 work mcp add claude-code --allow-writes   # or codex
b24 work mcp check                            # the handshake and the tool list, as the client sees them
```

`--allow-writes` dice que sabes que el perfil ofrece herramientas que escriben. Para cualquier otro cliente,
`b24 work mcp config` imprime la entrada que hay que pegar en sus ajustes. A mano, para Claude Code:

```sh
claude mcp add b24 -- b24 work mcp serve
```

Un servidor puede atender varios perfiles: `b24 mcp serve --profiles work,sales`, o `--profiles all`. Entonces cada
llamada nombra su perfil, y el agente te pregunta si no dijiste cuál.

## Lo que ve el agente

El servidor tiene tres herramientas:

- `b24_tools_search` encuentra un comando por palabras, con sus argumentos y la forma de su respuesta.
- `b24_read` ejecuta un comando que solo lee: `{ "command": "deals list", "arguments": { "query": "status:open" } }`.
- `b24_write` ejecuta un comando que escribe: `{ "command": "deals move", "arguments": { "deal": "deal:12", ... } }`.

Un comando se nombra como en la línea de comandos, sin el perfil, y comprueba la misma clave de permiso. Estos nunca se
ofrecen por MCP: `api call`, `schedule`, `session start` y `session end`. El agente te pide que los ejecutes en una
terminal.

El texto del portal llega marcado como `untrusted`: los títulos de negociaciones y prospectos, los nombres de embudos y
etapas, los nombres de contactos, empresas y empleados, los valores de campos personalizados, teléfonos, correos y
enlaces, y lo que encuentra `search all`. Al agente se le dice que son datos, nunca instrucciones.

## Las escrituras siguen siendo tuyas

Por MCP no hay nadie en una terminal para responder a `ask`, así que la escritura sigue adelante, también con los
niveles de serie:

- `deals.move=ask` no impide que un agente mueva una negociación, y un cambio de etapa puede poner en marcha los robots
  del portal, que pueden escribir a un cliente real.
- `deals.delete` y `leads.delete` están en `ask` de serie, así que un agente con el webhook de un administrador puede
  borrar.

Elige una opción antes de añadir el servidor:

- Pon `readonly` o `deny` en cada escritura que el agente no debe hacer:
  `b24 work config set permissions.deals.move readonly`. La lista completa está en
  [Permisos](./permissions.md#agents-and-mcp).
- O activa la aprobación de la herramienta `b24_write` en el cliente de tu agente, para que el cliente te pregunte
  antes de cada escritura.

Para que un servidor sea más estricto que el perfil, dale sus propios niveles. Nunca aflojan el perfil:

```sh
b24 work mcp add claude-code --allow-writes --permission deals.delete=deny --permission leads.delete=deny
b24 work mcp serve --permission deals=readonly
```

## ChatGPT y Claude en el navegador

Una aplicación del navegador llega al servidor por HTTP a través de tu propio túnel, como Tailscale Funnel:

```sh
b24 work mcp serve --http --public-url https://laptop.example.ts.net
```

El servidor escucha solo en `127.0.0.1`, puerto 8765 (`--port` lo cambia). Una aplicación del navegador inicia sesión
con un código de un solo uso que imprime el comando. `b24 work mcp revoke` termina todos los inicios de sesión.

`b24 work mcp server start` ejecuta el mismo servidor en segundo plano. `mcp server status` muestra su puerto, el código
de inicio de sesión y las aplicaciones conectadas, y `mcp server stop` lo detiene.

Más: [permisos](./permissions.md), [seguridad](./security.md), [la referencia de comandos](./commands.md#b24-mcp).
