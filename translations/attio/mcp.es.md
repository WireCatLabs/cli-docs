---
title: "MCP"
---

Da tus negociaciones, personas y empresas de Attio a un agente de IA que no puede ejecutar comandos, como Claude
Desktop, Cursor, o ChatGPT y Claude en el navegador. MCP (Model Context Protocol) es la forma en que un agente así
pregunta a un programa qué sabe hacer y luego lo llama, y `attio` ofrece sus comandos de esa forma.

Después el agente lee tus negociaciones, tu embudo y los cambios desde la copia de tu ordenador, y busca personas y
empresas en Attio, hasta donde lo permiten los permisos del perfil.

A un agente con terminal, como Claude Code o Codex, le van igual de bien los comandos y la skill
(`attio skill install`). Necesitas un perfil con sesión iniciada ([instala](./installation.md)), y antes mirar los
[permisos](./permissions.md): por MCP una escritura en `ask` sigue adelante.

**En esta página:**

1. [Añade attio a un agente](#add-attio-to-an-agent)
2. [Lo que ve el agente](#what-the-agent-sees)
3. [Las escrituras siguen siendo tuyas](#keep-writes-yours)
4. [ChatGPT y Claude en el navegador](#chatgpt-and-claude-in-the-browser)

## Añade attio a un agente

```sh
attio work mcp add claude-code --allow-writes   # or codex
attio work mcp check                            # the handshake and the tool list, as the client sees them
```

`--allow-writes` dice que sabes que el perfil ofrece herramientas que escriben: las escrituras de negociaciones y
personas y las del grupo `api`. Para Claude Desktop, Cursor o cualquier otro cliente, `attio work mcp config` imprime
la entrada que hay que pegar en sus ajustes, con rutas completas. A mano, para Claude Code:

```sh
claude mcp add attio -- attio work mcp serve
```

Un servidor puede atender varios perfiles: `attio mcp serve --profiles work,client`, o `--profiles all`. Entonces cada
llamada nombra su perfil, y el agente te pregunta si no dijiste cuál.

## Lo que ve el agente

El servidor tiene tres herramientas:

- `attio_tools_search` encuentra un comando por palabras, con sus argumentos y la forma de su respuesta.
- `attio_read` ejecuta un comando que solo lee: `{ "command": "deals list", "arguments": { "query": "status:open" } }`.
- `attio_write` ejecuta un comando que escribe, como una operación de `api` que crea o borra un registro.

Un comando se nombra como en la línea de comandos, sin el perfil, y comprueba la misma clave de permiso.

El texto de Attio llega marcado como `untrusted`: los nombres de personas, empresas y negociaciones, los nombres de
embudos y etapas, los nombres de los miembros del espacio de trabajo, los valores de atributos, las direcciones de
correo, los teléfonos y los enlaces, las notas, correos, comentarios y transcripciones que leen los comandos `api`, y
lo que encuentra `search all`. Al agente se le dice que son datos, nunca instrucciones.

## Las escrituras siguen siendo tuyas

Los comandos de negociaciones y personas escriben, y el grupo `api` llega a cada operación de Attio. Cada escritura
está en `ask` por defecto. Por MCP no hay nadie en una terminal para responder a `ask`, así que toda escritura sigue
adelante, y quien te pregunta es tu cliente MCP.

Dos cosas detienen una escritura. Usa al menos una antes de añadir el servidor:

- **Los ámbitos del token.** Un token con solo los tres ámbitos de lectura de [instala](./installation.md) no puede
  escribir: Attio lo rechaza.
- **Los permisos del perfil.** Esta línea aleja toda escritura de `api` de cualquier agente de este perfil, y las
  lecturas siguen funcionando:

  ```sh
  attio work config set permissions.api readonly
  ```

Para que un servidor sea más estricto que el perfil, dale sus propios niveles. Nunca aflojan el perfil:

```sh
attio work mcp add claude-code --allow-writes --permission api=readonly
attio work mcp serve --permission api.objects-records-delete=deny
```

O activa la aprobación de la herramienta `attio_write` en el cliente de tu agente, para que el cliente te pregunte
antes de cada escritura.

## ChatGPT y Claude en el navegador

Una aplicación del navegador llega al servidor por HTTP a través de tu propio túnel, como Tailscale Funnel:

```sh
attio work mcp serve --http --public-url https://laptop.example.ts.net
```

El servidor escucha solo en `127.0.0.1`, puerto 8765 (`--port` lo cambia). Una aplicación del navegador inicia sesión
con un código de un solo uso que imprime el comando. `attio work mcp revoke` termina todos los inicios de sesión.

`attio work mcp server start` ejecuta el mismo servidor en segundo plano. `mcp server status` muestra su puerto, el
código de inicio de sesión y las aplicaciones conectadas, y `mcp server stop` lo detiene.

Más: [permisos](./permissions.md), [seguridad](./security.md), [la referencia de comandos](./commands.md#attio-mcp).
