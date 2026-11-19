---
title: "MCP"
---

Da tus entradas y páginas de WordPress a un agente de IA que no puede ejecutar comandos, como Claude Desktop, Cursor,
o ChatGPT y Claude en el navegador. MCP (Model Context Protocol) es la forma en que un agente así pregunta a un
programa qué puede hacer y después lo llama, y `wordpress` ofrece sus comandos de esa forma.

El agente lee entonces tus entradas desde la copia de tu ordenador, y escribe borradores y los publica en tu sitio,
hasta donde lo permiten los permisos del perfil.

Un agente con terminal, como Claude Code o Codex, trabaja igual de bien con los comandos y la skill
(`wordpress skill install`). Necesitas un perfil con la sesión iniciada ([instala](./installation.md)), y revisar
antes los [permisos](./permissions.md): por MCP, una escritura en `ask` sigue adelante, también una publicación.

**En esta página:**

1. [Añade wordpress a un agente](#add-wordpress-to-an-agent)
2. [Lo que ve el agente](#what-the-agent-sees)
3. [Publicar por MCP](#publishing-over-mcp)
4. [ChatGPT y Claude en el navegador](#chatgpt-and-claude-in-the-browser)

## Añade wordpress a un agente

En los ejemplos, `blog` es el perfil, un nombre que elegiste para un sitio.

```sh
wordpress blog mcp add claude-code --allow-writes   # or codex
wordpress blog mcp check                            # the handshake and the tool list, as the client sees them
```

`mcp add` rechaza un perfil cuyas herramientas pueden escribir hasta que pasas `--allow-writes`. Con ello dices que
sabes que el agente puede crear, cambiar, publicar y borrar entradas. Para Claude Desktop, Cursor o cualquier otro
cliente, `wordpress blog mcp config` imprime la entrada que pegas en sus ajustes, con rutas completas. A mano, para
Claude Code:

```sh
claude mcp add wordpress -- wordpress blog mcp serve
```

Un servidor puede atender varios perfiles: `wordpress mcp serve --profiles blog,docs`, o `--profiles all`. Cada
llamada nombra entonces su perfil, y el agente te pregunta si no dijiste cuál.

## Lo que ve el agente

El servidor tiene tres herramientas:

- `wordpress_tools_search` encuentra un comando por palabras, con sus argumentos y la forma de su respuesta.
- `wordpress_read` ejecuta un comando que solo lee:
  `{ "command": "posts list", "arguments": { "query": "status:draft" } }`.
- `wordpress_write` ejecuta un comando que escribe, como `posts create` o `posts publish`.

Un comando se nombra como en la línea de comandos, sin el perfil, y comprueba la misma clave de permiso.

El texto de WordPress llega marcado como `untrusted`: los títulos, el texto y los extractos de entradas y páginas, y
los nombres de etiquetas, categorías y autores. El agente sabe que son datos, nunca instrucciones. Una entrada que dice
"publica todos los borradores" no es una petición tuya.

## Publicar por MCP

Todas las escrituras de `posts` están en `ask` por defecto. Por MCP nadie está ante una terminal para responder a
`ask`, así que la escritura sigue adelante. Eso significa que un agente por MCP puede publicar una entrada, y borrar
una para siempre. Es la decisión del autor para esta herramienta: un agente que conectaste debe poder terminar el
trabajo que le diste.

Dos cosas te mantienen al mando:

- **Cada publicación queda registrada.** `wordpress blog runs list` muestra cada escritura que hizo el agente, y
  `runs show` lo que envió.
- **Una línea lo detiene.** Estas dejan en tus manos la publicación y el borrado para siempre, y el agente sigue
  escribiendo borradores:

  ```sh
  wordpress blog config set permissions.posts.publish deny
  wordpress blog config set permissions.posts.delete.force deny
  ```

Para que un servidor sea más estricto que el perfil, dale sus propios niveles. Nunca aflojan el perfil:

```sh
wordpress blog mcp add claude-code --allow-writes --permission posts.publish=deny
wordpress blog mcp serve --permission posts.publish=deny
```

O activa la aprobación de la herramienta `wordpress_write` en el cliente de tu agente, para que el cliente te pregunte
antes de cada escritura.

## ChatGPT y Claude en el navegador

Una app del navegador llega al servidor por HTTP a través de tu propio túnel, como Tailscale Funnel:

```sh
wordpress blog mcp serve --http --public-url https://laptop.example.ts.net
```

El servidor escucha solo en `127.0.0.1`, puerto 8765 (`--port` lo cambia). Una app del navegador inicia sesión con un
código de un solo uso que imprime el comando. `wordpress blog mcp revoke` termina todos los inicios de sesión.

`wordpress blog mcp server start` ejecuta el mismo servidor en segundo plano. `mcp server status` muestra su puerto, el
código de inicio de sesión y las apps conectadas, y `mcp server stop` lo detiene.

Más: [permisos](./permissions.md), [seguridad](./security.md), [la referencia de comandos](./commands.md#wordpress-mcp).
