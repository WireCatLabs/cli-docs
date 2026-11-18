---
title: "Conecta tu agente"
---

Dale a tu agente de IA tu Yandex Disk, para que encuentre un documento, lo cite y archive tus ficheros cuando se lo
pidas. Un agente con terminal ejecuta `ydisk` por sí mismo después de que instales el skill de la herramienta. Una
aplicación sin terminal, como Claude Desktop o Cursor, llega a los mismos comandos por MCP, el Model Context Protocol
que usan las aplicaciones de IA para llamar a herramientas. Tú decides qué puede cambiar el agente.

**En esta página:**

1. [Agentes con terminal](#agents-with-a-terminal)
2. [Claude Code y Codex por MCP](#claude-code-and-codex-over-mcp)
3. [Claude Desktop, Cursor y otras aplicaciones MCP](#claude-desktop-cursor-and-other-mcp-apps)
4. [ChatGPT y Claude en el navegador](#chatgpt-and-claude-in-the-browser)
5. [Decide qué puede cambiar el agente](#decide-what-the-agent-may-change)

## Agentes con terminal

Claude Code, Codex, Gemini CLI, OpenClaw y otros agentes que ejecutan comandos solo necesitan el skill: un archivo
corto que enseña al agente los comandos y las reglas de la herramienta.

```sh
ydisk skill install
```

Lo deja donde lo buscan Claude Code (`~/.claude/skills/`) y Codex, Gemini CLI y OpenClaw (`~/.agents/skills/`).
`ydisk skill install --for hermes` añade además esa carpeta a los ajustes propios de Hermes Agent, algo que un
`skill install` normal no hace. Vuelve a ejecutarlo después de una actualización. `ydisk skill status` te dice si el
skill instalado coincide con esta versión.

Luego pide lo que quieras con palabras normales y nombra el perfil:

```text prompt
Use ydisk CLI with profile personal. What did I upload to /Documents/Invoices this month?
List the files with their dates. Do not change anything.
```

## Claude Code y Codex por MCP

Para darle la herramienta a Claude Code o a Codex como servidor MCP, añádela con un solo comando:

```sh
ydisk personal mcp add claude-code --allow-writes
ydisk personal mcp add codex --allow-writes
```

`--allow-writes` confirma que sabes que el servidor ofrece los comandos que cambian el Disco. Los permisos del perfil
siguen decidiendo qué se ejecuta. Mira [Decide qué puede cambiar el agente](#decide-what-the-agent-may-change).

## Claude Desktop, Cursor y otras aplicaciones MCP

```sh
ydisk personal mcp config
```

Imprime la entrada `mcpServers` con rutas completas. Pégala en los ajustes MCP de la aplicación y reinicia la
aplicación. Dónde guarda cada aplicación sus ajustes está en la [página de agentes](https://wirecat.dev/en/docs/agents).
Vuelve a imprimir la entrada después de cambiar o actualizar Node.js, porque nombra una sola ruta de Node.js.

`ydisk personal mcp check` arranca el servidor como lo haría una aplicación y lista las herramientas que ofrece.
Ejecútalo cuando una aplicación no muestre herramientas de `ydisk`.

Un servidor puede atender varios perfiles: `ydisk mcp config --profiles personal,work`. Entonces cada herramienta
pregunta qué perfil usar.

## ChatGPT y Claude en el navegador

Una aplicación del navegador no puede arrancar un programa en tu ordenador, así que `ydisk` sirve MCP por HTTP en tu
ordenador, y tu propio túnel, como Tailscale Funnel o Cloudflare Tunnel, le da una dirección `https`:

```sh
ydisk personal mcp server start --public-url https://laptop.example.ts.net
ydisk personal mcp server status
```

La dirección de arriba es un ejemplo. Usa la de tu túnel. El servidor escucha en `127.0.0.1`, puerto 8765 (`--port`
lo cambia), y se ejecuta en segundo plano hasta que ejecutes `ydisk personal mcp server stop`. Una aplicación del
navegador inicia sesión con un código de un solo uso que imprimen `server start` y `server status`.
`ydisk personal mcp revoke` termina todas las sesiones. Cómo configurar el túnel y la aplicación está en la
[página de aplicaciones del navegador](https://wirecat.dev/en/docs/browser-apps).

## Decide qué puede cambiar el agente

El servidor MCP ofrece todos los comandos, también los que cambian el Disco. En un terminal la herramienta pregunta
antes de borrar, sobrescribir o crear un enlace público, pero por MCP no hay nadie a quien preguntar, así que se
ejecutan. Elige una de estas opciones para un agente:

- **Solo lectura.** `YDISK_READ_ONLY=1` en el entorno del servidor rechaza cualquier cambio.
- **Sin borrar y sin enlaces públicos.** Fija los dos permisos del perfil:

  ```sh
  ydisk personal config set permissions.files.delete deny
  ydisk personal config set permissions.files.share deny
  ```

- **Más estricto solo para un servidor.** `--permission` en `mcp serve`, `mcp add`, `mcp config` o
  `mcp server start` hace un permiso más estricto para ese servidor, nunca más laxo:
  `ydisk personal mcp add claude-code --allow-writes --permission files.delete=deny`.

Por MCP un agente lee el texto de un archivo con `files download`, pero no puede guardar un archivo en una ruta de tu
ordenador. Todas las claves de permisos están en los [ajustes](./configuration.md#permissions), y lo que llega a tu
disco y a la red está en [seguridad](./security.md).

Siguiente: [peticiones para probar](./recipes.md).
