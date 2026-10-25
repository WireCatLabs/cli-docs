---
title: "Comparado con otras herramientas"
---

<a id="inicio-de-sesión-perfiles-y-servicio-en-segundo-plano" />
<a id="lectura-y-búsqueda" />
<a id="enviar" />
<a id="grupos-y-carpetas" />
<a id="tus-propias-notas-sobre-chats-y-personas" />

Varias herramientas abiertas ya conectan una cuenta personal de Telegram a una terminal o a un agente de IA. Esta página coloca `tg` junto a cinco de ellos, para que pueda ver de un vistazo qué herramienta hace qué y elegir la que se adapta a su trabajo. Las notas provienen de la documentación y el código fuente de cada proyecto, comprobados el 23 de octubre de 2026; una herramienta puede hacer más de lo que dice su documentación.

Las herramientas:

- **tg** — esta herramienta: una línea de comando y un servidor MCP para su cuenta, con un archivo local.
- **[tgcli](https://github.com/dapi/tgcli)**: una línea de comando con sincronización en segundo plano, un archivo local y un servidor MCP (la bifurcación con desarrollo activo de [kfastov/tgcli](https://github.com/kfastov/tgcli)).
- **[tlgr](https://github.com/tlgrcli/tlgr)**: una línea de comando y un servicio en segundo plano que hacen casi todo en el servidor de Telegram, con una habilidad para agentes.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)**: el servidor MCP de Telegram más usado, con un gran conjunto de acciones.
- **[mcp-telegram](https://github.com/mcp-telegram/mcp-telegram)**: un servidor MCP con unas 180 herramientas, que se inicia con `npx`.
- **[tdl](https://github.com/iyear/tdl)**: un descargador y cargador rápido de archivos y medios.

✅ sí · 🟡 parcialmente · ❌ no · ➖ no en su documentación

## Características

| Característica | tg | [tgcli](https://github.com/dapi/tgcli) | [tlgr](https://github.com/tlgrcli/tlgr) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [mcp-telegram](https://github.com/mcp-telegram/mcp-telegram) | [tdl](https://github.com/iyear/tdl) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Tu cuenta personal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Un bot a través de la API de Bot | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ |
| Leer chats e historial | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 |
| Chats no leídos, sin marcarlos como leídos | ✅ | ❌ | ✅ | 🟡 | 🟡 | ❌ |
| Enviar mensajes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Editar, borrar, reenviar y fijar mensajes | ✅ | ❌ | ✅ | ✅ | ✅ | 🟡 |
| Archivos y medios | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ |
| Varias fotos como un álbum | ❌ | ❌ | ✅ | ✅ | ✅ | ➖ |
| Borradores | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Archivar, fijar, silenciar un chat o marcarlo como no leído | ✅ | ❌ | ✅ | 🟡 | ✅ | ❌ |
| Pulsar los botones de un bot | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Descargar muchos archivos, con reanudación | 🟡 | 🟡 | ✅ | 🟡 | 🟡 | ✅ |
| Un archivo local actualizado | ✅ | ✅ | 🟡 | ❌ | ❌ | 🟡 |
| Buscar en el archivo sin conectarse | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Buscar en el servidor de Telegram | ✅ | 🟡 | 🟡 | ✅ | ✅ | ❌ |
| Buscar por significado, en el texto de archivos y notas de voz | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notas de voz como texto | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Servidor MCP | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| MCP remoto con su propio inicio de sesión | ✅ | ➖ | ❌ | ➖ | ➖ | ❌ |
| Habilidad para agentes con terminal | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ |
| Salida JSON | ✅ | ✅ | ✅ | 🟡 | ➖ | 🟡 |
| Varias cuentas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Límites para un agente: solo lectura, chats permitidos, límite por hora | ✅ | ❌ | 🟡 | 🟡 | 🟡 | ❌ |
| Sesión guardada en el llavero del sistema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ejecutar un grupo o canal | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Mensajes programados | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Temas del foro | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Servicio en segundo plano | ✅ | ✅ | ✅ | 🟡 | 🟡 | ❌ |
| Exportar chats | ✅ | ❌ | 🟡 | 🟡 | ❌ | ✅ |

Sobre los límites para un agente: telegram-mcp puede exponer solo sus herramientas de lectura y solo los chats indicados; tlgr puede permitir solo los comandos indicados; mcp-telegram limita su frecuencia de solicitudes. tg tiene un perfil de solo lectura, una lista de destinatarios permitidos y un límite por hora de envíos.

## Instalar y licenciar

| | tg | [tgcli](https://github.com/dapi/tgcli) | [tlgr](https://github.com/tlgrcli/tlgr) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [mcp-telegram](https://github.com/mcp-telegram/mcp-telegram) | [tdl](https://github.com/iyear/tdl) |
|---|---|---|---|---|---|---|
| Instalar | npm, pnpm, Bun | npm | pipx | git y uv, Docker, extensión de escritorio Claude | npx, binarios | un binario, Homebrew, Scoop, AUR, Nix, Docker |
| Escrito en | TypeScript | JavaScript | Python | Python | TypeScript | Go |
| Licencia | Apache-2.0 | MIT | MIT | Apache-2.0 | MIT | AGPL-3.0 |

## Cuando otra herramienta encaja mejor

- **tdl**: principalmente mueves archivos: descargas masivas, cargas y reenvíos a toda velocidad, desde un binario que la mayoría de los administradores de paquetes pueden instalar.
- **tlgr**: desea borradores y álbumes desde una línea de comando hoy, o descargas en paralelo que se reanudan, y no necesita un archivo local.
- **telegram-mcp**: desea el conjunto más amplio de acciones de agente en Claude Desktop, instalado en un solo paso, con una gran comunidad detrás.
- **mcp-telegram**: desea un gran conjunto de herramientas MCP que se inicia con un solo comando `npx`, sin Python.
- **tgcli**: desea que el servidor MCP esté dentro del servicio de sincronización, o lleva notas sobre los chats.

Si `tg` encaja, comience con [instalación](./installation.md); para conectar un agente sin terminal, consulte [el servidor MCP](./mcp.md).
