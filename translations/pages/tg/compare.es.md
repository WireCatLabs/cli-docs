---
title: "Comparado con otras herramientas"
---

<a id="what-each-tool-does" />
<a id="setup" />
<a id="where-another-tool-fits-better" />
<a id="where-the-marks-come-from" />

<a id="login-profiles-and-the-background-service" />

Las marcas reflejan el catálogo de comandos revisado de la versión publicada y la documentación enlazada de cada
proyecto, leída el 24 de octubre de 2026. El envío de álbumes ya está publicado. Las fuentes de las demás herramientas
están fijadas [debajo de las tablas](#where-the-marks-come-from). Una herramienta puede hacer más de lo que dice su
documentación. Son comparaciones de documentación y código, no mediciones comparativas en ejecución.

<a id="sending" />

<a id="groups-and-folders" />

<a id="your-own-notes-on-chats-and-people" />

Varias herramientas abiertas conectan una cuenta personal de Telegram a una terminal o a un agente de IA. Esta página
pone `tg` junto a cinco de ellas, fila por fila, según los trabajos que hace la gente: ponerse al día, responder,
encontrar, organizar, cuidar un grupo y dejar la cuenta en manos de un agente. Úsala para elegir la herramienta que
encaja con tu trabajo.

Cada marca se comprobó el 24 de octubre de 2026. Nuestras marcas salen de la rama `main` de `tg` y de ejecutarlo. Una
marca de otra herramienta sale de su propia
documentación o de su código, enlazados [debajo de la tabla](#where-the-marks-come-from). Una herramienta puede hacer
más de lo que dice su documentación.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación

Las herramientas:

- **tg**: esta herramienta. Una línea de comandos y un servidor MCP para tu cuenta, con una copia local de tus chats
  en la que puedes buscar.
- **[tgcli](https://github.com/dapi/tgcli)**: una línea de comandos con sincronización en segundo plano, un archivo
  local y un servidor MCP (el fork con desarrollo activo de [kfastov/tgcli](https://github.com/kfastov/tgcli)).
- **[tlgr](https://github.com/tlgrcli/tlgr)**: una línea de comandos y un servicio en segundo plano, con una skill para
  agentes.
- **[telegram-mcp](https://github.com/chigwell/telegram-mcp)**: un servidor MCP en Python para Claude Desktop, Cursor
  y otros clientes MCP.
- **[mcp-telegram](https://github.com/mcp-telegram/mcp-telegram)**: un servidor MCP que se inicia con `npx`.
- **[tdl](https://github.com/iyear/tdl)**: un programa rápido para descargar y subir archivos y contenido multimedia.

<a id="features" />

<a id="функции" />

<a id="características" />

## Qué hace cada herramienta

| Tarea | tg | tgcli | tlgr | telegram-mcp | mcp-telegram | tdl |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Ponerse al día** | | | | | | |
| Ver los chats sin leer sin que nadie sepa que los leíste | ✅ | ❌ | ✅ | 🟡 | 🟡 | ❌ |
| Ver lo que debes a la gente y lo que te deben a ti | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Leer un mensaje de voz como texto | ✅ | ➖ | ✅ | ✅ | ✅ | ➖ |
| **Responder y enviar** | | | | | | |
| Enviar un mensaje o una respuesta, ahora o a una hora fijada | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Editar, borrar, reenviar y fijar mensajes | ✅ | ❌ | ✅ | ✅ | ✅ | 🟡 |
| Enviar fotos, archivos y mensajes de voz | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Enviar varias fotos como un solo álbum | ✅ | ❌ | ✅ | ✅ | ✅ | ➖ |
| Guardar un borrador que aparece en tu aplicación de Telegram | ✅ | ❌ | ✅ | ✅ | ✅ | ➖ |
| **Encontrar** | | | | | | |
| Buscar mensajes en el servidor de Telegram | ✅ | 🟡 | 🟡 | ✅ | ✅ | ❌ |
| Buscar en tus mensajes guardados sin internet | ✅ | ✅ | ➖ | ❌ | ➖ | ➖ |
| Encontrar un mensaje por lo que significa, no solo por sus palabras | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Encontrar un archivo o una foto que alguien envió, en cualquier chat | ✅ | ➖ | ✅ | ➖ | ➖ | ➖ |
| Buscar dentro de los archivos que recibiste, y por lo que muestra una imagen | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Descargar todos los archivos de un chat y seguir después de una parada | 🟡 | 🟡 | ✅ | 🟡 | 🟡 | ✅ |
| **Organizar** | | | | | | |
| Archivar, fijar, silenciar o marcar un chat como no leído | ✅ | ➖ | ✅ | 🟡 | ✅ | ➖ |
| Tener los chats en carpetas | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Vista de un grupo** | | | | | | |
| Crear un grupo y gestionar administradores, miembros, temas y solicitudes para unirse | ✅ | 🟡 | ✅ | ✅ | ✅ | 🟡 |
| Ver quién entró, quién salió y quién los añadió | ✅ | ➖ | ➖ | ➖ | 🟡 | 🟡 |
| Ver las cifras de un grupo: mensajes, miembros activos, preguntas respondidas | ✅ | 🟡 | 🟡 | ➖ | 🟡 | ➖ |
| **Bot** | | | | | | |
| Usar tu propio bot a través de la Bot API | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ |
| Pulsar los botones de un bot | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Agentes y seguridad** | | | | | | |
| Funciona con un agente que tiene terminal, con una skill que le enseña | ✅ | ✅ | ✅ | 🟡 | ➖ | ➖ |
| Herramientas MCP para leer y escribir | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Configurar un agente con acceso de solo lectura | ✅ | ➖ | 🟡 | ✅ | ➖ | ➖ |
| Configurar en la CLI un permiso que pide confirmar el envío | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Limitar los envíos a una lista de chats y a un número por hora | ✅ | ➖ | 🟡 | 🟡 | 🟡 | 🟡 |
| Reutilizar un ID de operación al reintentar un envío no programado | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Ocultar a MCP por defecto los cambios de permisos | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| El inicio de sesión se guarda en el llavero del sistema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exigir una cuenta explícita para cada acción | ✅ | ❌ | 🟡 | ➖ | ➖ | ❌ |

Qué puede hacer un agente sin preguntar, cómo se detiene un envío equivocado y qué puedes ver después.

Aclaraciones sobre estas filas:

- **Leer pero no enviar.** tg permite que un perfil sea de solo lectura para la terminal y para MCP. telegram-mcp
  puede exponer solo sus herramientas de lectura. tlgr puede permitir solo los comandos que indiques.
- **Aprobación del envío.** Pon `messages.send: ask` para pedir confirmación en la terminal. A través de MCP, la
  aprobación la controla el cliente, que puede permitir una llamada sin volver a preguntar. Para bloquear la escritura,
  usa los permisos deny o read-only. `reply` y `review` presentan borradores para revisarlos. tg exige elegir la
  cuenta de forma explícita. tgcli admite perfiles con uno por defecto, y tlgr puede exigir una cuenta elegida con su
  ajuste strict-account.
- **Límites.** tg tiene una lista de chats a los que puede enviar y 30 envíos por hora por defecto. telegram-mcp
  limita los chats, mcp-telegram limita su ritmo de peticiones, tdl tiene una pausa entre peticiones y tlgr limita los
  comandos.
- **Identidad del reintento.** Reutiliza el mismo ID de operación al reintentar un envío no programado. Si el
  resultado es desconocido, revisa el registro de envíos y Telegram. Los envíos programados hay que comprobarlos, no
  repetirlos a ciegas. tlgr documenta un código de salida propio para los resultados desconocidos.
- **Relajar sus propios límites.** A través de MCP, tg lista los comandos que cambian lo que podrá hacer una ejecución
  posterior (ajustes, listas de destinatarios, programaciones), los marca como no disponibles y nombra el permiso que
  hay que poner desde una terminal.

<a id="install-and-licence" />

<a id="установка-и-лицензия" />

<a id="instalar-y-licenciar" />

## Configuración

| | tg | tgcli | tlgr | telegram-mcp | mcp-telegram | tdl |
|---|---|---|---|---|---|---|
| Instalación | npm, pnpm, Bun | npm | pipx | git y uv, Docker, extensión de Claude Desktop | npx, binarios | un solo binario, Homebrew, Scoop, AUR, Nix, Docker |
| Licencia y precio | Apache-2.0, gratis | MIT, gratis | MIT, gratis | Apache-2.0, gratis | MIT, gratis | AGPL-3.0, gratis |
| MCP | stdio, y HTTP con su propio inicio de sesión para aplicaciones de navegador y móvil | HTTP | ninguno | stdio | stdio | ninguno |

**Comparado con un agente de navegador.** Un agente que maneja la aplicación web de Telegram hace clic en una página
pensada para personas. `tg` y las demás herramientas de esta página llaman a la interfaz propia de Telegram. Así el
agente recibe la misma respuesta que recibiría un script, con una forma fija, y un comando o funciona o dice por qué
no. Esta página no afirma que ninguna de las dos formas sea más rápida: no hay ninguna medición publicada.

<a id="when-another-tool-fits-better" />

<a id="когда-другой-инструмент-подходит-лучше" />

<a id="cuando-otra-herramienta-encaja-mejor" />

## Cuándo encaja mejor otra herramienta

- **tdl**: sobre todo mueves archivos. Descarga, subida y reenvío masivos a toda velocidad, desde un solo binario
  que instalan la mayoría de los gestores de paquetes.
- **tlgr**: quieres descargas en paralelo que se reanudan, desde una línea de comandos, y no necesitas una copia local
  para buscar.
- **telegram-mcp**: quieres el conjunto más amplio de acciones de agente en Claude Desktop, instalado en un solo paso,
  con una gran comunidad detrás.
- **mcp-telegram**: quieres un conjunto grande de herramientas MCP que se inicia con un solo comando `npx`, sin
  Python.
- **tgcli**: quieres el servidor MCP dentro del servicio de sincronización, o guardar notas sobre los chats.

## De dónde salen las marcas

Fijadas al commit leído el 24 de octubre de 2026.

- **tgcli** ([`4f7fbc5`](https://github.com/dapi/tgcli/tree/4f7fbc5)): el
  [README](https://github.com/dapi/tgcli/blob/4f7fbc5/README.md), los
  [comandos](https://github.com/dapi/tgcli/blob/4f7fbc5/docs/cli.md), la
  [skill para agentes](https://github.com/dapi/tgcli/blob/4f7fbc5/SKILL.md) (que manda las ediciones y los borrados a
  otro sitio y los borradores a través de Saved Messages) y el
  [servidor MCP](https://github.com/dapi/tgcli/blob/4f7fbc5/mcp-server.js).
- **tlgr** ([`9b441f2`](https://github.com/tlgrcli/tlgr/tree/9b441f2)): el
  [README](https://github.com/tlgrcli/tlgr/blob/9b441f2/README.md) lista `catchup`, `--no-read`, `draft`, álbumes,
  carpetas, `chat stats get`, `media search`, `--enable-commands` y los códigos de salida.
- **telegram-mcp** ([`686d587`](https://github.com/chigwell/telegram-mcp/tree/686d587)): el
  [README](https://github.com/chigwell/telegram-mcp/blob/686d587/README.md) lista borradores, carpetas, álbumes,
  `TELEGRAM_EXPOSED_TOOLS=read-only` y `TELEGRAM_ALLOWED_CHAT_IDS`.
- **mcp-telegram** ([`a11e9a9`](https://github.com/mcp-telegram/mcp-telegram/tree/a11e9a9)): el
  [README](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/README.md) lista borradores, carpetas, álbumes,
  el registro de administración y las
  [estadísticas del grupo](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/src/tools/chats.ts). El
  [limitador de ritmo](https://github.com/mcp-telegram/mcp-telegram/blob/a11e9a9/src/rate-limiter.ts) es su único
  límite de envío.
- **tdl** ([`70c561c`](https://github.com/iyear/tdl/tree/70c561c)): el
  [README](https://github.com/iyear/tdl/blob/70c561c/README.md), la
  [guía de descarga](https://github.com/iyear/tdl/blob/70c561c/docs/content/en/guide/download.md) y la
  [guía de reenvío](https://github.com/iyear/tdl/blob/70c561c/docs/content/en/guide/forward.md), que mantiene juntos
  los álbumes pero no dice cómo se agrupa una subida.
- **tg**: [búsqueda](./search.md), [archivos adjuntos](./attachments.md), [grupos que administras](./groups.md),
  [permisos](./permissions.md), [seguridad](./security.md) y [el servidor MCP](./mcp.md).

Si `tg` encaja, empieza por la [instalación](./installation.md). Para conectar un agente sin terminal, consulta
[el servidor MCP](./mcp.md).
