---
title: "Comparado con otras herramientas"
---

<a id="inicio-de-sesión-perfiles-y-servicio-en-segundo-plano" />
<a id="lectura-y-búsqueda" />
<a id="enviar" />
<a id="grupos-y-carpetas" />
<a id="tus-propias-notas-sobre-chats-y-personas" />
<a id="login-profiles-and-the-background-service" />
<a id="reading-and-searching" />
<a id="sending" />
<a id="groups-and-folders" />
<a id="your-own-notes-on-chats-and-people" />

Varias herramientas abiertas ya conectan una cuenta personal de Telegram a una terminal o a un agente de IA. Esta página coloca `tg` junto a tres de ellos, para que pueda ver de un vistazo qué herramienta hace qué y elegir la que se adapta a su trabajo. Las notas provienen de la documentación propia de cada proyecto; una herramienta puede hacer más de lo que dice su documentación.

Las herramientas:

- **tg** — esta herramienta: una línea de comando y un servidor MCP para su cuenta, con un archivo local.
- **[tgcli](https://github.com/kfastov/tgcli)**: una línea de comando con sincronización en segundo plano y un servidor MCP.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)**: un servidor MCP que proporciona al agente un gran conjunto de acciones de Telegram.
- **[tdl](https://github.com/iyear/tdl)**: un descargador y cargador rápido de archivos y medios.

✅ sí · 🟡 parcialmente · ❌ no · ➖ no en su documentación

## Características

| Característica | tg | [tgcli](https://github.com/kfastov/tgcli) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [tdl](https://github.com/iyear/tdl) |
|---|:-:|:-:|:-:|:-:|
| Tu cuenta personal | ✅ | ✅ | ✅ | ✅ |
| Un bot a través de la API de Bot | ✅ | ❌ | ➖ | ➖ |
| Leer chats e historial | ✅ | ✅ | ✅ | 🟡 |
| Enviar mensajes | ✅ | ✅ | ✅ | 🟡 |
| Archivos y medios | ✅ | ✅ | ✅ | ✅ |
| Un archivo local actualizado | ✅ | ✅ | ➖ | ➖ |
| Buscar en el archivo sin conectarse | ✅ | ✅ | ➖ | ➖ |
| Buscar en el servidor de Telegram | ✅ | ✅ | ✅ | ➖ |
| Buscar por significado | ✅ | ➖ | ➖ | ➖ |
| Servidor MCP | ✅ | ✅ | ✅ | ➖ |
| MCP remoto con su propio inicio de sesión | ✅ | 🟡 | 🟡 | ➖ |
| Habilidad para agentes con terminal | ✅ | ✅ | 🟡 | ➖ |
| Salida JSON | ✅ | ✅ | 🟡 | ✅ |
| Varias cuentas | ✅ | ➖ | ✅ | ✅ |
| Límites para un agente: solo lectura, chats permitidos, límite por hora | ✅ | ➖ | 🟡 | ➖ |
| Ejecutar un grupo o canal | ✅ | 🟡 | ✅ | 🟡 |
| Mensajes programados | ✅ | ✅ | ✅ | ➖ |
| Temas del foro | ✅ | ✅ | ✅ | 🟡 |
| Contactos con nombres privados y notas | ✅ | ✅ | ✅ | ➖ |
| Servicio en segundo plano | ✅ | ✅ | 🟡 | ➖ |
| Exportar chats | ✅ | ➖ | 🟡 | ✅ |

## Instalar y licenciar

| | tg | [tgcli](https://github.com/kfastov/tgcli) | [telegram-mcp](https://github.com/chigwell/telegram-mcp) | [tdl](https://github.com/iyear/tdl) |
|---|---|---|---|---|
| Instalar | npm, pnpm, Bun | npm, Homebrew | git y uv, Docker, extensión de escritorio Claude | un binario, Homebrew, Scoop, AUR, Nix, Docker |
| Escrito en | TypeScript | JavaScript | Python | Go |
| Licencia | MIT | MIT | Apache-2.0 | AGPL-3.0 |

## Cuando otra herramienta encaja mejor

- **tdl**: principalmente mueves archivos: descargas masivas, cargas y reenvíos a toda velocidad, desde un binario que la mayoría de los administradores de paquetes pueden instalar.
- **telegram-mcp**: desea el conjunto más amplio de acciones de agente en Claude Desktop, instalado en un solo paso, con una gran comunidad detrás.
- **tgcli**: instala con Homebrew, desea que el servidor MCP esté dentro del servicio de sincronización, envía mensajes individuales con contenido protegido o toma notas en los chats.

Si `tg` encaja, comience con [instalación](./installation.md); para conectar un agente sin terminal, consulte [el servidor MCP](./mcp.md).
