---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`notion` es una línea de comandos y un servidor MCP que guarda una copia de tus páginas y bases de datos de Notion en
tu ordenador, busca en ella sin internet y se la da a tu agente de IA. Aquí aparece junto a las otras herramientas que
se usan para que un agente o un script lea y cambie Notion, para que veas cuál encaja con tu tarea. Las marcas de
`notion` salen de la versión 0.2.0, y las de las demás herramientas salen de su propia documentación y su código
fuente. Todo se revisó el 16 de noviembre de 2026. Una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **notion**: esta herramienta. Entra con tu propio token de Notion, copia a tu ordenador las páginas y bases de datos
  que eliges, las encuentra por palabras y por significado, y se las da a un agente en la terminal o por MCP. Está en
  desarrollo: todavía no tiene comandos listos para escribir páginas, una búsqueda por una propiedad de la base de
  datos ni una carpeta de Markdown que se mantenga al día con Notion.
- **[Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp)**: el servidor MCP propio de Notion,
  alojado por Notion. Tu aplicación de IA se conecta a él y entra en tu espacio de trabajo.
- **[ntn](https://developers.notion.com/cli/get-started/overview)**: la línea de comandos propia de Notion. Lee
  y escribe páginas en Markdown, consulta bases de datos, sube archivos y gestiona Notion Workers.
- **[notion-mcp-server](https://github.com/makenotion/notion-mcp-server)**: el servidor MCP de código abierto de
  Notion, que ejecutas tú con un token. Su README dice que
  [ya no se mantiene](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7).
- **[notion-exporter](https://github.com/yannbolliger/notion-exporter)**: una línea de comandos que descarga una
  página o una base de datos como archivos Markdown o CSV mediante la exportación de la aplicación web de Notion
  (193 estrellas, actualizado el 23 de octubre de 2026).

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | notion | [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [ntn](https://developers.notion.com/cli/reference/commands) | [notion-mcp-server](https://github.com/makenotion/notion-mcp-server) | [notion-exporter](https://github.com/yannbolliger/notion-exporter) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Encontrar una página** | | | | | |
| Encontrar una página por palabras de su texto | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/reference/post-search) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar una página por su significado, no solo por palabras exactas | ✅ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L11) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Buscar en tus páginas sin internet | ✅ | [❌](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L39) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar una página junto a tus chats, tu correo y tus archivos de otros servicios | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar filas de una base de datos por el valor de una propiedad, como Status es Done | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-databases-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L59) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Copia y exportación** | | | | | |
| Tener en tu ordenador una copia de las páginas y bases de datos elegidas, que cada sincronización actualiza | ✅ | ➖ | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| Exportar una página y las páginas que tiene dentro como archivos Markdown | 🟡 | ➖ | [🟡](https://developers.notion.com/cli/reference/commands) | ➖ | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| **Escribir** | | | | | |
| Crear una página o cambiar su texto desde Markdown | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-pages-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L24) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Agentes y seguridad** | | | | | |
| Una aplicación de IA trabaja con tus páginas por MCP | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L333) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Usarla desde Claude o ChatGPT en la web | ✅ | [✅](https://www.notion.com/help/notion-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L345) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Un agente con terminal la ejecuta, con salida JSON y una skill | ✅ | n/a | [🟡](https://developers.notion.com/cli/reference/commands) | n/a | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Se puede dejar al agente solo con lectura | ✅ | [🟡](https://www.notion.com/help/notion-mcp) | ➖ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L112) | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L3-L6) |
| Permitir o denegar comandos sueltos a un agente | ✅ | ➖ | ➖ | ➖ | n/a |
| Ver un cambio antes de que se haga | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-faqs) | ➖ | ➖ | n/a |
| El texto de una página llega al agente como datos, nunca como instrucciones | 🟡 | ➖ | ➖ | ➖ | ➖ |
| **Instalación** | | | | | |
| Funciona con un agente sin navegador | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/authentication) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L138) | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L78-L92) |
| Se apoya solo en lo que Notion documenta y mantiene | ✅ | [✅](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [✅](https://developers.notion.com/cli/get-started/overview) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/README.md?plain=1#L119-L125) |

| | notion | Notion MCP | ntn | notion-mcp-server | notion-exporter |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o un 22.x posterior, o Node 24 o posterior | nada: tu aplicación de IA se conecta al servidor de Notion | script de instalación, WinGet o npm | npx o Docker | npm |
| Licencia | Apache-2.0 | un servicio de Notion, en cualquier plan | [MIT](https://www.npmjs.com/package/ntn) | MIT | MIT |
| Inicio de sesión | un token de acceso personal o el token de una conexión, guardado en el llavero del sistema | OAuth en el navegador, o un token MCP en los planes Business y Enterprise | en el navegador, o un token de acceso personal | el token de una conexión | las cookies `token_v2` y `file_token` de tu navegador |

Notas sobre las marcas:

- **Encontrar una página por palabras.** `notion search` busca en la copia de tu ordenador, en el texto de cada
  página y cada fila. La búsqueda de la API de Notion, que usan `ntn api v1/search` y notion-mcp-server, encuentra las
  páginas por su título. Notion MCP usa la búsqueda propia de Notion en el espacio de trabajo.
- **Por significado.** `notion sync --embed` indexa el texto con un modelo ya descargado en tu ordenador, y después
  `notion search` encuentra una página también por su significado. Notion MCP busca por significado en el lado de
  Notion.
- **Con tus chats y tu correo.** La copia está en el almacén local que comparten las herramientas de WireCat, así que `memo search` y
  `memo search all` encuentran una página junto a tus mensajes, tu correo y tus archivos de las otras herramientas de
  WireCat. Notion MCP busca en servicios conectados como Slack y Google Drive en los planes Business y Enterprise con
  Notion AI.
- **Filas por propiedad.** `notion` guarda las propiedades de cada fila en la copia como líneas del tipo
  `Status: Done`, así que `notion search` las encuentra como palabras, no como un campo. Hoy un filtro por propiedad
  solo funciona con el comando de la API directa `notion <profile> api post-database-query`, con un cuerpo JSON. Una
  búsqueda lista por propiedad, como `status:Done`, está prevista. En Notion MCP las consultas por propiedad gastan un
  cupo limitado del espacio de trabajo si no tienes el plan Business o Enterprise con Notion AI.
- **Una copia en tu ordenador.** `notion sync` copia las páginas elegidas, las páginas que tienen dentro, las bases
  de datos y sus filas, y cada sincronización siguiente trae solo lo que cambió. notion-exporter descarga un árbol de
  páginas una vez (`-r <folder>`) y no recuerda qué cambió.
- **Exportar.** `notion documents export` escribe una página de la copia en un archivo Markdown. `ntn pages get`
  muestra una página en Markdown. notion-exporter escribe todo el árbol de páginas, y una base de datos como archivo
  CSV. Ninguna herramienta de esta página mantiene una carpeta de archivos Markdown al día con Notion en los dos
  sentidos. `notion` lo tiene previsto.
- **Escribir.** `notion documents create` crea una página desde Markdown dentro de otra página, y
  `notion documents update` reemplaza el texto de una página. Cada escritura tiene su propio permiso y `--dry-run`. Un
  cambio que borraría una página o una base de datos interior se rechaza hasta que lo permitas. notion-mcp-server
  escribe con herramientas hechas a partir de la API de Notion, y el agente escribe él mismo el cuerpo JSON.
- **Solo lectura.** El ajuste `permissions` da a un comando el nivel `readonly` o `deny`, y `WCNOTION_READ_ONLY=1`
  rechaza cualquier escritura. Por defecto el servidor MCP también ofrece las escrituras, y por MCP el nivel `ask`
  deja pasar el comando. Mira los [ajustes](./configuration.md#permissions). notion-mcp-server solo lee con un token
  que tenga únicamente la capacidad "Read content". En Notion MCP, desactivar la edición en los clientes MCP y bloquear
  las aplicaciones de IA no aprobadas son controles de administrador de MCP Governance, solo en el plan Enterprise.
- **Ver un cambio.** `--dry-run` muestra lo que haría un comando y no envía nada. Notion MCP puede proponer una
  edición de página que alguien revisa antes de aplicarla, en los planes Business y Enterprise.
- **Texto como datos.** El servidor MCP de `notion` le dice al agente que el texto de las páginas, los títulos y los
  nombres de las propiedades los escriben otras personas y son datos, nunca instrucciones. El texto en sí no va
  marcado dentro de cada respuesta.
- **Sin navegador.** Notion MCP acepta un token sin navegador solo si lo crea el propietario de un espacio de trabajo
  en el plan Business o Enterprise. notion-exporter necesita dos cookies que copias a mano de un navegador donde has
  entrado en Notion.
- **Lo que Notion mantiene.** notion-exporter usa la exportación de la aplicación web de Notion, una API interna que,
  según su README, "may break anytime". notion-mcp-server llama a la API pública, pero Notion ya no lo mantiene.

## Cuándo encaja mejor otra herramienta

- **Notion MCP**: quieres que Claude o ChatGPT busque, escriba y ordene tu espacio de trabajo sin instalar nada, y tus
  páginas no tienen que estar en tu ordenador.
- **ntn**: hoy mismo quieres comandos listos para crear y editar páginas desde Markdown en un script, o creas Notion
  Workers.
- **notion-exporter**: quieres una vez un árbol de páginas o una base de datos como archivos Markdown y CSV, por
  ejemplo para un sitio estático o una copia de seguridad.

Si `notion` encaja, empieza por la [instalación](./installation.md).
