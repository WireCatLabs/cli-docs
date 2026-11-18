---
title: "MCP"
---

Da tu CRM de amoCRM o Kommo a un agente de IA que no puede ejecutar comandos, como Claude Desktop, o ChatGPT y Claude
en el navegador. MCP (Model Context Protocol) es la forma en que un agente así pregunta a un programa qué sabe hacer y
luego lo llama, y `amo` ofrece sus comandos de esa forma.

Después el agente lee tus negociaciones, contactos y empresas, y los cambia hasta donde lo permiten los permisos del
perfil.

`amo work mcp add` añade el servidor a Claude Code o Codex, y `amo work mcp config` imprime la entrada para cualquier
otro cliente. A un agente con terminal, como Claude Code o Codex, le van mejor los comandos y la skill
(`amo skill install`). Necesitas un perfil con sesión iniciada, y antes mirar [Permisos](./permissions.md): por MCP
una escritura en `ask` sigue adelante.

**En esta página:**

1. [Añade amo a un agente](#add-amo-to-an-agent)
2. [Lo que ve el agente](#what-the-agent-sees)
3. [Las escrituras siguen siendo tuyas](#keep-writes-yours)
4. [ChatGPT y Claude en el navegador](#chatgpt-and-claude-in-the-browser)

## Añade amo a un agente

```sh
amo work mcp add claude-code --allow-writes   # or codex
amo work mcp check                            # the handshake and the tool list, as the client sees them
```

`--allow-writes` dice que sabes que el perfil ofrece herramientas que escriben. Para cualquier otro cliente,
`amo work mcp config` imprime la entrada que hay que pegar en sus ajustes. A mano, para Claude Code:

```sh
claude mcp add amo -- amo work mcp serve
```

Un servidor puede atender varios perfiles: `amo mcp serve --profiles work,sales`, o `--profiles all`. Entonces cada
llamada nombra su perfil, y el agente te pregunta si no dijiste cuál.

## Lo que ve el agente

El servidor tiene tres herramientas:

- `amo_tools_search` encuentra un comando por palabras, con sus argumentos y la forma de su respuesta.
- `amo_read` ejecuta un comando que solo lee: `{ "command": "deals list", "arguments": { "query": "status:open" } }`.
- `amo_write` ejecuta un comando que escribe: `{ "command": "deals move", "arguments": { "deal": "deal:12", ... } }`.

Un comando se nombra como en la línea de comandos, sin el perfil, y comprueba la misma clave de permiso. Estos nunca se
ofrecen por MCP: `api call`, `session start` y `session end`. El agente te pide que los ejecutes tú.

El texto de la cuenta llega marcado como `untrusted`: los nombres de negociaciones, contactos y empresas, los nombres
de embudos y etapas, los nombres de usuarios, los valores de campos personalizados, las notas y etiquetas, los
teléfonos, correos y enlaces. Al agente se le dice que son datos, nunca instrucciones.

## Las escrituras siguen siendo tuyas

Por MCP no hay nadie en una terminal para responder a `ask`, así que la escritura sigue adelante. De todos modos, mover,
cerrar y cambiar negociaciones, contactos y empresas está en `allow` en un perfil nuevo, y una negociación movida puede
poner en marcha los disparadores del embudo digital de amoCRM y su Salesbot, que pueden escribir a un cliente real.

Elige una opción antes de añadir el servidor:

- Pon `readonly` o `deny` en cada escritura que el agente no debe hacer:
  `amo work config set permissions.deals.move readonly`. La lista completa está en
  [Permisos](./permissions.md#what-a-new-profile-allows).
- O activa la aprobación de la herramienta `amo_write` en el cliente de tu agente, para que el cliente te pregunte
  antes de cada escritura.

Para que un servidor sea más estricto que el perfil, dale sus propios niveles. Nunca aflojan el perfil:

```sh
amo work mcp add claude-code --allow-writes --permission deals.close=deny
amo work mcp serve --permission deals=readonly
```

## ChatGPT y Claude en el navegador

Una aplicación del navegador llega al servidor por HTTP a través de tu propio túnel, como Tailscale Funnel. El comando
de abajo usa la dirección de ejemplo `https://laptop.example.ts.net`. Pon en su lugar la dirección de tu túnel:

```sh
amo work mcp serve --http --public-url https://laptop.example.ts.net
```

El servidor escucha solo en `127.0.0.1`, puerto 8765 (`--port` lo cambia). Una aplicación del navegador inicia sesión
con un código de un solo uso que imprime el comando. `amo work mcp revoke` termina todos los inicios de sesión.

`amo work mcp server start` ejecuta el mismo servidor en segundo plano. `mcp server status` muestra su puerto, el código
de inicio de sesión y las aplicaciones conectadas, y `mcp server stop` lo detiene.

Más: [permisos](./permissions.md), [seguridad](./security.md), [la referencia de comandos](./commands.md#amo-mcp).
