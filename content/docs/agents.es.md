---
title: "Conectar tu agente"
description: "Configura Codex, Cursor, Claude Code, Gemini CLI o Hermes para Telegram y MAX."
---

**Normalmente no necesitas esta página.** [`tg setup` y `max setup`](./installation.mdx) ya
instalan el skill para el agente que elegiste. Usa los comandos de abajo si tu agente no conoce el
comando `tg` o `max`, si usas otro agente o después de una actualización. [MCP](./mcp.md) es otra
forma de dar herramientas al agente.

La instalación global con npm instala el skill antes de iniciar sesión si se permiten los scripts de instalación. El instalador opcional de Windows también lo instala. Lee `tg skill show` o `max skill show` y comprueba que el agente ha cargado el skill. Los comandos siguientes lo actualizan o lo instalan por separado si npm omitió ese paso.

**CLI** es el programa instalado de terminal (`tg` o `max`). Un **agente** es tu asistente de IA, por ejemplo en el editor o terminal. Un **skill** es un archivo de instrucciones que enseña al agente a usar el CLI; no guarda tu acceso a Telegram/MAX. **PATH** es la lista de carpetas donde se buscan comandos: si `tg --version` o `max --version` funciona en la terminal del agente, puede encontrar el CLI.

## Elige tu agente

Ejecuta el comando del mensajero instalado. Si usas ambos, ejecuta los dos.

| Agente | Telegram | MAX | Ubicación del skill |
|---|---|---|---|
| Codex | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Cursor Agent | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Claude Code | `tg skill install --for claude` | `max skill install --for claude` | `~/.claude/skills/<tool>-cli/SKILL.md` |
| Gemini CLI | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Hermes | Guarda `tg skill show` como se indica abajo | Guarda `max skill show` como se indica abajo | `~/.hermes/skills/<tool>-cli/SKILL.md` |

`<tool>-cli` significa `tg-cli` o `max-cli`. `~` es tu directorio personal, también en Windows.
Sin `--for`, `skill install` instala en `.claude/skills` y `.agents/skills`.

### Codex

Usa Codex localmente en el CLI o IDE. Descubre skills en `~/.agents/skills`.
Selecciona `$tg-cli` o `$max-cli` en la conversación. Reinicia Codex si no aparece el nuevo skill.
El comando debe estar en el PATH del agente.
[Guía oficial de Codex](https://learn.chatgpt.com/docs/build-skills).

### Cursor

Usa **Agent** con acceso a la terminal. Cursor lee `~/.agents/skills`; busca `tg-cli` o `max-cli`
con `/` en el chat. Reinicia Cursor si no descubre el nuevo skill. También puedes
[conectar MCP](./mcp.md#cursor-y-claude-desktop).
[Guía oficial de Cursor](https://cursor.com/help/customization/skills).

### Claude Code

Invoca `/tg-cli` o `/max-cli` en tu sesión local. Los skills personales se guardan en
`~/.claude/skills`. MCP es opcional si ya funciona la terminal.
[Guía oficial de Claude Code](https://code.claude.com/docs/en/skills).

### Gemini CLI

Comprueba `tg-cli` o `max-cli` con `gemini skills list`. En una sesión abierta, usa `/skills reload`.
Gemini admite el directorio compartido `~/.agents/skills`.
[Guía oficial de Gemini](https://geminicli.com/docs/cli/skills/).

### Hermes

Hermes usa su propio directorio. Pídele que cree `~/.hermes/skills/tg-cli/SKILL.md` con la
**salida exacta** de `tg skill show`, o `~/.hermes/skills/max-cli/SKILL.md` con `max skill show`.
Conserva el frontmatter y UTF-8. Para Telegram en macOS o Linux:

```sh
mkdir -p ~/.hermes/skills/tg-cli
tg skill show > ~/.hermes/skills/tg-cli/SKILL.md
```

Para MAX, usa `max-cli` en la ruta y `max skill show`. Abre una nueva sesión de Hermes e invoca
`/tg-cli` o `/max-cli`. Su entorno debe tener el CLI y la misma sesión de tu cuenta.
[Guía oficial de Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/).

## Comprueba la conexión

Pídele: **«Usa tg-cli / max-cli para comprobar mi cuenta y mostrar cinco chats. Después resume
los mensajes sin leer por chat e indica a quién debo responder. Solo lee para esta tarea».**

Debe ejecutar `account show`, `chats list --limit 5` e `inbox --limit 5`, o las herramientas MCP
equivalentes. Si no encuentra el comando, vuelve a abrir el editor tras instalar Node/npm;
consulta [Windows y PATH](./installation.mdx#what-the-windows-installer-changes). Si falta la sesión, inicia sesión en el mismo
entorno y perfil que usa el agente.

## El CLI ya sugiere instalar el skill

Con `AI_AGENT` o `CLAUDECODE`, ambos CLI sugieren `skill install` si falta el skill o es anterior
al CLI. El aviso va a stderr una vez al día como máximo; stdout conserva el JSON.
Tras actualizar el CLI, repite la instalación. Para Hermes, actualiza el archivo desde `skill show`.

## Otros clientes

Para **Claude Desktop**, usa [MCP](./mcp.md#cursor-y-claude-desktop).
Para agentes sin skills, comparte [la documentación Markdown](./mcp.md#documentación-para-tu-agente).
Para un agente en la nube, instala e inicia sesión en su entorno: tu sesión local no se transfiere
automáticamente.

Continúa con [las primeras tareas](./first-tasks.md): encontrar un acuerdo, preparar una reunión
y redactar una respuesta. En [cómo formular peticiones](./prompting.md) tienes ejemplos para copiar y límites útiles.
