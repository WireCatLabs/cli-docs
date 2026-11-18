---
title: "MCP"
---

Da tu CRM de HubSpot a un agente de IA que no puede ejecutar comandos, como Claude Desktop o Cursor, o ChatGPT y Claude
en el navegador. MCP (Model Context Protocol) es la forma en que un agente así pregunta a un programa qué sabe hacer y
luego lo llama, y `hubspot` sirve sus comandos de esa forma.

Así el agente lee tus negociaciones, contactos y empresas, y los cambia hasta donde lo permiten los permisos del
perfil y los scopes de la clave.

`hubspot work mcp add` añade el servidor a Claude Code o Codex, y `hubspot work mcp config` imprime la entrada para
cualquier otro cliente. A un agente con terminal, como Claude Code o Codex, le van mejor los comandos y la skill
(`hubspot skill install`). Necesitas un perfil con sesión iniciada, y antes un vistazo a [Permisos](./permissions.md):
por MCP una escritura en `ask` sigue adelante.

**En esta página:**

1. [Agentes con terminal](#agents-with-a-terminal)
2. [Añade hubspot a un cliente MCP](#add-hubspot-to-an-mcp-client)
3. [Qué ve el agente](#what-the-agent-sees)
4. [Que las escrituras sigan siendo tuyas](#keep-writes-yours)
5. [ChatGPT y Claude en el navegador](#chatgpt-and-claude-in-the-browser)

## Agentes con terminal

`hubspot skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw. Una
skill es un archivo de instrucciones que enseña los comandos a un agente. `hubspot skill install --for hermes` añade
además esa carpeta a los ajustes propios de Hermes Agent, así que un `skill install` sin más deja fuera a Hermes.

## Añade hubspot a un cliente MCP

```sh
hubspot work mcp add claude-code --allow-writes   # or codex
hubspot work mcp check                            # the handshake and the tool list, as the client sees them
```

`--allow-writes` indica que sabes que el perfil ofrece herramientas que escriben: `sync` y las programaciones en este
ordenador, y las escrituras en HubSpot, que solo puede hacer una clave con scopes de escritura. Para cualquier otro
cliente, `hubspot work mcp config` imprime la entrada que hay que pegar en sus ajustes. A mano, para Claude Code:

```sh
claude mcp add hubspot -- hubspot work mcp serve
```

Un servidor puede servir varios perfiles: `hubspot mcp serve --profiles work,sales`, o `--profiles all`. Cada llamada
nombra entonces su perfil, y el agente te pregunta si no dijiste cuál.

## Qué ve el agente

El servidor tiene tres herramientas:

- `hubspot_tools_search` encuentra un comando por palabras, con sus argumentos y la forma de su respuesta.
- `hubspot_read` ejecuta un comando que solo lee, como `deals list` o `changes list`.
- `hubspot_write` ejecuta un comando que cambia algo, como `deals move` o `api notes-create`.

Un comando se nombra como en la línea de comandos, sin el perfil, y comprueba la misma clave de permiso. También se
ofrecen todas las operaciones de la API de HubSpot, cada una tras su propia clave. Iniciar y cerrar sesión nunca se
ofrece por MCP: el agente te pide que ejecutes `hubspot work session start` en una terminal.

El texto de la cuenta llega marcado como no fiable: nombres de negociaciones, valores de propiedades, notas, nombres,
direcciones de correo, números de teléfono y enlaces, y lo que encuentra `search all`. Al agente se le dice que son
datos, nunca instrucciones.

## Que las escrituras sigan siendo tuyas

Por MCP no hay nadie en una terminal para responder `ask`, así que la escritura sigue adelante, también con los
niveles de serie:

- `deals.delete` es `ask` por defecto, así que un agente puede borrar una negociación. HubSpot guarda una negociación
  borrada durante 90 días, y puedes restaurarla allí.
- Cada escritura y cada borrado con `api` es `ask` por defecto, así que un agente puede añadir notas y tareas, fusionar
  registros o cambiar embudos, hasta donde lo permitan los scopes de la clave.

Elige una opción antes de añadir el servidor:

- Pon `readonly` o `deny` en cada escritura que el agente no debe hacer:
  `hubspot work config set permissions.deals.delete deny`. La lista completa está en
  [Permisos](./permissions.md#what-is-set-before-you-change-anything).
- O activa la aprobación de la herramienta `hubspot_write` en el cliente de tu agente, para que el cliente te pregunte
  antes de cada escritura.

Para que un servidor sea más estricto que el perfil, dale sus propios niveles. Nunca aflojan el perfil:

```sh
hubspot work mcp add claude-code --allow-writes --permission deals.delete=deny --permission api=readonly
hubspot work mcp serve --permission people.list=deny
```

## ChatGPT y Claude en el navegador

Una app del navegador llega al servidor por HTTP a través de tu propio túnel, como Tailscale Funnel. Pon la dirección
de tu túnel en lugar del ejemplo `https://laptop.example.ts.net`:

```sh
hubspot work mcp serve --http --public-url https://laptop.example.ts.net
```

El servidor escucha solo en `127.0.0.1`, en el puerto 8765 (`--port` lo cambia). Una app del navegador entra con un
código de un solo uso que imprime el comando. `hubspot work mcp revoke` cierra todas las entradas.

`hubspot work mcp server start` ejecuta el mismo servidor en segundo plano. `mcp server status` muestra su puerto, el
código de entrada y las apps conectadas, y `mcp server stop` lo detiene.

Más: [permisos](./permissions.md), [seguridad](./security.md), [la referencia de comandos](./commands.md#hubspot-mcp).
