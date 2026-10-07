---
title: "MCP y documentación"
description: "Qué aporta MCP, cómo conectar cada agente y cómo leer la documentación de WireCat."
---

> **¿Usas ChatGPT o Claude en el navegador? [Configura la conexión →](./browser-apps.mdx)**
> Aquí tienes el inicio del servidor, el acceso y ejemplos de uso.

**MCP ofrece herramientas para tu cuenta al agente:** listar chats, leer mensajes entrantes,
buscar, preparar respuestas y ejecutar acciones permitidas por el perfil. El cliente descubre
nombres, parámetros y resultados estructurados. El servidor viene incluido en `tg` y `max`.

**MCP (Model Context Protocol)** permite a una aplicación de IA descubrir y ejecutar herramientas. Aquí el **cliente** es tu aplicación de IA y el **servidor** es el proceso local `tg mcp` o `max mcp` que ofrece las herramientas. Conectar MCP no registra una cuenta ni inicia sesión; completa el acceso al mensajero primero.

## ¿CLI, skill o MCP?

| Conexión | Qué ofrece | Cuándo elegirla |
|---|---|---|
| CLI | Comandos de terminal con resultados JSON | Tu agente ya tiene una terminal local |
| Skill + CLI | Instrucciones de comandos y flujos de trabajo | Usas Codex, Cursor Agent, Claude Code, Gemini CLI o Hermes |
| MCP | Herramientas con parámetros directamente en el cliente | Usas Claude Desktop o prefieres su interfaz de herramientas |
| MCP por HTTP | Las mismas herramientas para ChatGPT o Claude en el navegador, tras tu propio túnel | Chateas en el navegador — [ChatGPT y Claude en el navegador](./browser-apps.mdx) |
| Markdown | Explicaciones y referencia de comandos | El agente necesita consultar cómo funciona algo |

Con una terminal, empieza con [un skill](./agents.md). MCP es opcional y respeta los mismos
permisos del perfil que el CLI. El inicio de sesión y la descarga del archivo se hacen por separado.

## Antes de conectar

[Instala e inicia sesión](./installation.mdx). `tg mcp config` o `max mcp config`
muestra la configuración con las rutas reales de Node y del CLI. No edita el cliente.
El PATH de una aplicación de escritorio puede ser diferente del de la terminal.

### Codex

En una terminal donde ya funcione el comando:

```sh
codex mcp add tg -- tg mcp
codex mcp add max -- max mcp
codex mcp list
```

Conecta solo los mensajeros que uses. Codex guarda MCP en `~/.codex/config.toml`.
Para Windows o un IDE con otro PATH, toma `command`, `args` y `env` de `mcp config` y añádelos
en `[mcp_servers.tg]` o `[mcp_servers.max]`. Codex utiliza TOML.
[Guía oficial de Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

### Claude Code

```sh
claude mcp add --scope user tg -- tg mcp
claude mcp add --scope user max -- max mcp
claude mcp list
```

Comprueba el estado con `/mcp` en la sesión. Para rutas completas, usa los valores de `mcp config`.
[Guía oficial de Claude Code MCP](https://code.claude.com/docs/en/mcp).

### Cursor y Claude Desktop

Copia la entrada de `tg mcp config` o `max mcp config` en `mcpServers`, conservando las rutas
y el entorno. Combínala con los servidores que ya tengas.

| Cliente | Archivo |
|---|---|
| Cursor, personal | `~/.cursor/mcp.json` |
| Cursor, proyecto | `.cursor/mcp.json` |
| Claude Desktop, macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop, Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

Reinicia el cliente y comprueba las herramientas disponibles.
[Guía oficial de Cursor MCP](https://cursor.com/help/customization/mcp).

### Gemini CLI

```sh
gemini mcp add --scope user tg tg mcp
gemini mcp add --scope user max max mcp
gemini mcp list
```

Para rutas completas y variables de entorno, añade la entrada generada en `mcpServers` de
`~/.gemini/settings.json`. [Guía oficial de Gemini MCP](https://geminicli.com/docs/tools/mcp-server/).

### Hermes

Hermes usa `mcp_servers` en `~/.hermes/config.yaml`. Añade `tg` o `max` con `command`, `args`
y `env` de la configuración generada, conservando tus ajustes. Utiliza YAML: no pegues el objeto
JSON `mcpServers` entero. Reinicia Hermes.
[Inicio oficial de Hermes](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart/).

## Qué puede hacer el agente

Las acciones dependen de los permisos del perfil. La aplicación gestiona sus aprobaciones;
el servidor comprueba prohibiciones, destinatarios y límites. Consulta [Permisos](./permissions.md), los perfiles
de lectura y la lista completa de herramientas en [Telegram MCP](./tg/mcp.md) o [MAX MCP](./max/mcp.md).
Pide listar cinco chats como primera comprobación.

## Documentación para tu agente

El MCP del mensajero accede a tu cuenta. La documentación se consulta por separado:

| Recurso | Qué compartir |
|---|---|
| [Índice](/llms.txt) | `https://wirecat.dev/llms.txt` — buscar una página y seguir su enlace Markdown |
| [Todas las páginas](/llms-full.txt) | `https://wirecat.dev/llms-full.txt` — referencia completa para herramientas que admitan documentos grandes |
| Una página | **Copiar Markdown** o **Abrir** en la cabecera |

Prueba: **«Lee https://wirecat.dev/llms.txt, busca la documentación de los mensajes entrantes
de Telegram y úsala para resumir mis mensajes sin leer».** Si no puede abrir URL, pega el Markdown
de la página en el chat.

WireCat ofrece estos recursos Markdown; todavía no tiene un servidor MCP de documentación
publicado. No necesitas otro servidor para leer las páginas. Un MCP de documentación añadiría
búsqueda y lectura como herramientas, en un servicio separado de `tg mcp` y `max mcp`.

Si falla la conexión, comprueba las rutas, Node y que cliente y terminal usan el mismo perfil
y los mismos directorios. Los detalles están en la referencia MCP de [Telegram](./tg/mcp.md)
y [MAX](./max/mcp.md).
