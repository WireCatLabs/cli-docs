---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`wordpress` es una línea de comandos y un servidor MCP para un sitio WordPress autoalojado: entradas y páginas,
etiquetas y categorías, y los usuarios que escriben. Esta página lo pone junto a las otras herramientas con las que un
agente de IA lee y escribe en WordPress, para que veas cuál encaja con tu trabajo. Las marcas de `wordpress` salen de
su primera versión, sus comandos y su código, comprobados el 19 de noviembre de 2026 con WordPress 6.9.4 en Docker, no
con un sitio real. Se comprueban otra vez en cada versión. Las marcas de las otras herramientas salen de su propia
documentación y su código, enlazados en la tabla, comprobados el 19 de noviembre de 2026. No se inició sesión en
ninguna ni se probó nada en vivo, y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **wordpress**: esta herramienta. Guarda una copia de tus entradas y páginas en tu ordenador, escribe borradores en
  tu sitio y decide para cada acción qué puede hacer un agente. Inicia sesión con una contraseña de aplicación.
- **[WP-CLI](https://github.com/wp-cli/wp-cli)**: la línea de comandos oficial de WordPress, el comando `wp` (5182
  estrellas). Funciona en el servidor, o en tu ordenador contra un servidor por SSH.
- **[MCP Adapter](https://github.com/WordPress/mcp-adapter)**: el plugin oficial de WordPress que convierte las
  capacidades del sitio en herramientas MCP (1926 estrellas). Necesita WordPress 6.9 o posterior, donde la Abilities
  API forma parte de WordPress. Lo que puede hacer un agente depende de las capacidades que publiquen tus plugins.
- **[WordPress.com MCP](https://developer.wordpress.com/docs/mcp/)**: el servidor MCP integrado en WordPress.com.
  También sirve a sitios autoalojados conectados con Jetpack.
- **[claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp)**: el servidor MCP de código abierto con más
  estrellas entre los que llaman a la API REST del sitio con una contraseña de aplicación (161 estrellas, cambiado el
  16 de marzo de 2026), con 145 herramientas.
- **[mcp-wp](https://github.com/InstaWP/mcp-wp)**: el servidor MCP de InstaWP sobre la API REST con contraseñas de
  aplicación (100 estrellas, cambiado el 10 de septiembre de 2026), en npm como `@instawp/mcp-wp`.

WordPress deja entrar a un programa con una
[contraseña de aplicación](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/), creada
en el perfil del usuario en un sitio servido por https. Actúa con los permisos de ese usuario. Todas las herramientas de
esta página salvo WP-CLI y WordPress.com MCP inician sesión así. El plugin anterior de Automattic,
[wordpress-mcp](https://github.com/Automattic/wordpress-mcp/blob/7510accc8460b1b8f568c00860e1cc29e87f1b4f/Readme.md?plain=1#L1-L12),
está archivado y remite a MCP Adapter y WordPress.com MCP, así que no está en la tabla. Tampoco los plugins que añaden
su propio servidor MCP al sitio, como EMCP Tools for Elementor.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | wordpress | [WP-CLI](https://github.com/wp-cli/wp-cli) | [MCP Adapter](https://github.com/WordPress/mcp-adapter) | [WordPress.com MCP](https://developer.wordpress.com/docs/mcp/) | [claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp) | [mcp-wp](https://github.com/InstaWP/mcp-wp) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | | |
| Leer entradas y borradores sin conexión | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L11) | [❌](https://developer.wordpress.com/docs/mcp/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/config/site-config.ts#L30-L39) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| Encontrar una entrada por las palabras de su título y su texto | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L797-L798) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/search/index.ts#L4-L8) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L701-L706) |
| Una búsqueda sobre las entradas y los mensajes y notas de tus otras herramientas | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Escribir y publicar** | | | | | | |
| Escribir un borrador desde un archivo Markdown | ✅ | [🟡](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L137-L142) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L18-L31) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L728-L742) |
| Publicar un borrador o devolver una entrada a borrador | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L395-L396) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Programar una entrada para más tarde | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L159-L161) | ➖ | ➖ | ➖ | ➖ |
| Cambiar una entrada y conservar los bloques que Markdown no puede guardar | ✅ | n/a | ➖ | ➖ | n/a | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L756-L775) |
| Una escritura se detiene si la entrada cambió en el sitio desde que la leíste | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Subir una imagen o un archivo | ❌ | [✅](https://github.com/wp-cli/media-command/blob/136c6ea8a5939c2c6760c62554ff07a931340ce1/src/Media_Command.php#L377-L385) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/media/index.ts#L19-L38) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L58-L66) |
| **Agentes y seguridad** | | | | | | |
| Dejar que un agente solo lea | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Dejar que un agente escriba borradores pero no publique | ✅ | ➖ | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12-L13) | ➖ | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Elegir para cada acción: permitir, preguntar o rechazar | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Una escritura espera tu confirmación | 🟡 | n/a | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/security/UserConsentManager.ts#L33-L36) | ➖ |
| La contraseña se guarda en el llavero del sistema | ✅ | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | n/a | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| Un agente en una terminal trabaja con comandos, sin MCP | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L1000-L1002) | n/a | n/a | n/a | n/a |
| **Configuración** | | | | | | |
| Funciona sin instalar nada en el sitio | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L21) | [🟡](https://developer.wordpress.com/docs/mcp/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L13) |
| Funciona con un sitio de WordPress.com | ❌ | [🟡](https://developer.wordpress.com/docs/developer-tools/wp-cli/) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Varios sitios, cada uno nombrado en el comando | ✅ | [✅](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L147-L152) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | [✅](https://developer.wordpress.com/docs/mcp/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/schemas/common.ts#L10-L14) | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L390-L399) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L81-L83) | [✅](https://wordpress.com/support/mcp/connect-claude/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/index.ts#L109-L120) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/server.ts#L69-L72) |

| | wordpress | WP-CLI | MCP Adapter | WordPress.com MCP | claudeus-wp-mcp | mcp-wp |
|---|---|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | un archivo PHP en el servidor | un plugin en WordPress 6.9+ y `npx` en tu ordenador para la mayoría de las apps | ninguna: integrado en WordPress.com | npm o `npx`, Node 22+ | `npx`, Node 18+ |
| Licencia | Apache-2.0 | MIT | GPL-2.0-or-later | servicio cerrado | MIT | GPL-3.0-or-later |
| Precio | gratis | gratis | gratis | en todos los planes de pago de WordPress.com. Los sitios gratuitos, y los de Jetpack sin un plan Jetpack AI o Complete, solo hasta el 30 de noviembre de 2026 | gratis | gratis |

Notas sobre la columna de `wordpress`:

- **Inicio de sesión.** Una contraseña de aplicación actúa con los permisos del usuario de WordPress que la creó.
  `session start` la lee de stdin o de una pregunta oculta, nunca de un argumento. Se guarda con su sitio en el llavero
  del sistema, o en un archivo privado en un ordenador sin llavero. Consulta [la instalación](./installation.md).
- **Sin conexión.** `sync` copia las entradas y páginas con cualquier estado, también la papelera, con sus etiquetas,
  categorías y usuarios, en el almacén local de WireCat. El texto se guarda en Markdown. `posts list`, `posts search` y
  `posts show` leen esta copia, también con `--offline`. Tu rol en WordPress decide cuánto se copia. Un Administrador
  obtiene todo. Un Editor obtiene todas las entradas y páginas, pero no los usuarios. Un Autor o un Colaborador obtiene
  parte de las entradas y ninguna página, y un Colaborador solo ve sus propias entradas.
- **Una búsqueda.** Las entradas están en el mismo almacén local que los mensajes, las notas y las reuniones de las
  otras herramientas de WireCat del mismo ordenador. `posts search` solo encuentra entradas, así que esta fila es en
  parte.
- **Borradores y publicación.** `posts create` siempre crea un borrador, desde un archivo Markdown o desde stdin.
  `posts publish` publica ahora, o más tarde con `--at-time`. `posts unpublish` devuelve una entrada a borrador.
  `posts delete` mueve una entrada a la papelera, y `--allow-delete` la borra para siempre. Estos comandos escriben
  entradas. Una página se lee desde la copia y solo se cambia con el grupo `api`.
- **Solo lectura.** `WCWP_READ_ONLY=1` rechaza cualquier escritura, digan lo que digan los ajustes. El nivel
  `readonly` hace lo mismo para una clave, como `posts` o `api`.
- **Permitir, preguntar o rechazar.** Cada comando y cada operación de la API tiene su clave, como `posts.publish` o
  `api.media-delete`, con el valor `allow`, `ask`, `readonly` o `deny` en [los ajustes](./permissions.md).
  `mcp serve --permission` hace una clave más estricta solo para un servidor. Un agente no puede aflojar estos ajustes.
- **Confirmación y publicación por MCP.** Cada escritura de `posts` está en `ask` por defecto, y `ask` pregunta en una
  terminal. Por MCP nadie está ahí para responder, así que `ask` deja seguir al agente, y esta fila es en parte. Por eso,
  por defecto, un agente por MCP puede publicar. `config set permissions.posts.publish deny` deja la publicación en tus
  manos, y el agente sigue escribiendo borradores. `runs list` muestra cada escritura que hizo un agente.
- **La entrada cambió en el sitio.** Antes de escribir, `wordpress` compara la entrada con la copia. Si alguien la
  cambió en el sitio desde la última sincronización, la escritura se detiene con `content.conflict`.
- **Bloques.** Las galerías, las columnas, los contenidos incrustados y los iframes no sobreviven al paso por Markdown.
  `posts update` cambia el título, el extracto, las etiquetas y el estado de esa entrada, y conserva su texto. Solo
  `--replace-body` escribe el texto de todos modos.
- **Subir un archivo.** El grupo `api` lista los medios con `api media-list` y cambia sus datos con `api media-update`.
  Solo acepta el cuerpo de la petición en JSON, así que no puede enviar el archivo en sí.
- **El grupo api.** `wordpress blog api` ejecuta cualquiera de las 147 operaciones `wp/v2` de WordPress 6.9.4, con las
  mismas claves de publicar y borrar. Instalar un plugin, cambiar los ajustes del sitio, los usuarios y los
  comentarios, y los cambios en plantillas, widgets, menús y navegación preguntan por defecto. La ruta por lotes de
  WordPress nunca se ofrece, porque una llamada por lotes haría escrituras sin pasar por sus claves. Crear una
  contraseña de aplicación tampoco se ofrece, porque WordPress responde con la nueva contraseña en claro.
- **WordPress.com.** Solo WordPress autoalojado 5.7 o posterior con https. Los sitios de WordPress.com inician sesión
  con OAuth y no son compatibles. El comando es `wordpress`, no `wp`, así que convive con WP-CLI en un mismo ordenador.
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta detrás de un túnel que tú configuras y
  mantienes en marcha, así que esta fila es en parte.

## Cuándo encaja mejor otra herramienta

- **WP-CLI**: tienes una terminal en el servidor y administras el sitio en sí: plugins, temas, usuarios, la base de
  datos, importar archivos de medios. También funciona en un sitio de WordPress.com con un plan de pago.
- **MCP Adapter**: tus plugins ofrecen capacidades que quieres que use un agente, y prefieres que la conexión viva en el
  sitio. Claude Code llega a él por HTTP sin un programa propio en tu ordenador.
- **WordPress.com MCP**: tu sitio está en WordPress.com, o quieres ChatGPT o Claude en el navegador sin nada que
  ejecutar en tu ordenador.
- **mcp-wp** o **claudeus-wp-mcp**: el agente debe subir imágenes, responder comentarios o cambiar menús y plugins por
  MCP, con una herramienta para cada tarea.

Si `wordpress` encaja, empieza por [la instalación](./installation.md). Para usarlo con un agente, consulta
[el uso](./usage.md).
