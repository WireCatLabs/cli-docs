---
title: "Comparado con otras herramientas"
---

Guarda tus páginas de Notion en tu ordenador y deja que tu agente de IA las encuentre por su significado, sin
internet, junto a tus chats y tu correo. Las herramientas propias de Notion para agentes funcionan en línea, dentro de
Notion, y no guardan ninguna copia en tu ordenador. `notion` guarda esa copia, y tu agente también puede comentar una
página o añadirle un archivo. Puedes desactivar cada una de estas acciones.

Tu agente puede decirte quién escribió una página y mostrarte junto a ella los mensajes y el correo de esa persona.
Encuentra una página aunque tus palabras no estén en ella. Verás lado a lado lo que dan `notion` y otras cuatro
herramientas, para elegir la que encaja con tu tarea.

`notion` copia las páginas que eliges al almacén local que comparten todas las herramientas de WireCat, y `memo` busca
en ese almacén y muestra lo que tienes sobre una persona. Solo necesitas un token de Notion: un token de acceso
personal o el token de una conexión. Las herramientas comparadas:

- **notion**: esta herramienta. Copia tus páginas y bases de datos a tu ordenador, busca en ellas sin internet y se
  las da a un agente en la terminal o por MCP. Lo que viene después está en su [hoja de ruta](./roadmap.md).
- **[Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp)**: el servidor MCP propio de Notion,
  alojado por Notion, en el que entra tu aplicación de IA.
- **[ntn](https://developers.notion.com/cli/get-started/overview)**: la línea de comandos propia de Notion, para
  páginas en Markdown y para Notion Workers.
- **[notion-mcp-server](https://github.com/makenotion/notion-mcp-server)**: el servidor MCP de código abierto de
  Notion, que ejecutas tú con un token. Su README dice que
  [ya no se mantiene](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L6-L7).
- **[notion-exporter](https://github.com/yannbolliger/notion-exporter)**: una línea de comandos que descarga una
  página o una base de datos como archivos Markdown o CSV mediante la exportación de la aplicación web de Notion
  (193 estrellas, actualizado el 23 de octubre de 2026).

Las marcas de `notion` salen de su código, revisado el 17 de noviembre de 2026. Las de las demás herramientas salen de
su propia documentación y su código fuente, revisados el 16 de noviembre de 2026, y el 17 de noviembre de 2026 para
comentarios, archivos y personas. Una herramienta puede hacer más de lo que dicen sus páginas.

**En esta página:**

1. [Funciones](#features)
2. [Notas sobre las marcas](#notes-on-the-marks)
3. [Cuándo encaja mejor otra herramienta](#when-another-tool-fits-better)

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

<a id="features" />

## Funciones

| Tarea | notion | [Notion MCP](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [ntn](https://developers.notion.com/cli/reference/commands) | [notion-mcp-server](https://github.com/makenotion/notion-mcp-server) | [notion-exporter](https://github.com/yannbolliger/notion-exporter) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Encontrar una página** | | | | | |
| Encontrar una página por palabras de su texto | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/reference/post-search) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar una página por su significado, no solo por palabras exactas | ✅ | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L11) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L22) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Buscar en tus páginas sin internet | ✅ | [❌](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L39) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar una página junto a tus chats, tu correo y tus archivos de otros servicios | ✅ | [🟡](https://developers.notion.com/guides/mcp/get-started-with-mcp) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Ver las páginas que una persona escribió o editó por última vez, junto a sus chats y su correo | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-search-reference) | [❌](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L23) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Encontrar filas de una base de datos por el valor de una propiedad, como Status es Done | 🟡 | [✅](https://developers.notion.com/guides/mcp/tools-databases-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [✅](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L59) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| **Copia y exportación** | | | | | |
| Tener en tu ordenador una copia de las páginas y bases de datos elegidas, que cada sincronización actualiza | ✅ | ➖ | [❌](https://developers.notion.com/cli/reference/commands) | ➖ | [🟡](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| Exportar una página y las páginas que tiene dentro como archivos Markdown | 🟡 | ➖ | [🟡](https://developers.notion.com/cli/reference/commands) | ➖ | [✅](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L76) |
| **Escribir** | | | | | |
| Crear una página o cambiar su texto desde Markdown | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-pages-reference) | [✅](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/README.md?plain=1#L24) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Leer los comentarios de una página y responderlos | ✅ | [✅](https://developers.notion.com/guides/mcp/tools-comments-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [🟡](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json?plain=1#L1512-L1565) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
| Añadir a una página un archivo de tu ordenador | ✅ | [🟡](https://developers.notion.com/guides/mcp/tools-files-reference) | [🟡](https://developers.notion.com/cli/reference/commands) | [❌](https://github.com/makenotion/notion-mcp-server/blob/cf16e5c/scripts/notion-openapi.json) | [❌](https://github.com/yannbolliger/notion-exporter/blob/ee112e9/src/cli.ts#L60-L89) |
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

<a id="notes-on-the-marks" />

## Notas sobre las marcas

- **Encontrar una página por palabras.** `notion search` busca en la copia de tu ordenador, en el texto de cada
  página y cada fila. La búsqueda de la API de Notion, que usan `ntn api v1/search` y notion-mcp-server, encuentra las
  páginas por su título.
  Notion MCP usa la búsqueda propia de Notion en el espacio de trabajo. Las bases de datos y el propio espacio de
  trabajo no salen en los resultados de `notion`, solo las páginas y las filas.
- **Por significado.** `notion sync --embed` indexa el texto con un modelo ya descargado en tu ordenador, y después
  `notion search` encuentra una página también por su significado. Notion MCP busca por significado en el lado de
  Notion.
- **Con tus chats y tu correo.** La copia está en el almacén local que comparten las herramientas de WireCat, así
  que `memo search` y `memo search all` encuentran una página junto a tus mensajes, tu correo y tus archivos de las
  otras herramientas de WireCat. Cada resultado nombra `notion` y el perfil del que viene. Notion MCP busca en
  servicios conectados como Slack y Google Drive en los planes Business y Enterprise con Notion AI.
- **Las páginas de una persona.** Cada sincronización guarda a quien creó una página y a quien la editó por última
  vez como personas en el almacén local, con los nombres y las direcciones de correo que da Notion. Una dirección de
  correo los une con la misma persona de tu correo, tus chats u otras herramientas, así que `memo context` muestra las
  páginas de Notion entre los archivos de esa persona. Notion solo da las direcciones de correo si la conexión puede
  leer la información de los usuarios con sus direcciones de correo. Sin ellas, los autores no se unen con
  nadie, y `notion sync` y `notion doctor` lo dicen. Una relación que tu agente añade a una página espera a que la
  confirmes. Notion MCP encuentra las páginas que un usuario creó en Notion, pero no lo une con nadie de tus otros
  servicios.
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
- **Comentarios.** `notion comments list` lee en directo los comentarios abiertos de una página, porque la API de
  Notion no da los resueltos. `notion comments create` abre una discusión y `notion comments reply` responde en ella.
  Notion MCP lee también las discusiones resueltas. ntn no tiene un comando de comentarios, así que un script llama a
  la API de comentarios de Notion con `ntn api`. notion-mcp-server lee los comentarios abiertos y añade otros nuevos
  con herramientas hechas a partir de la API de Notion, pero no puede responder en una discusión.
- **Archivos.** `notion files upload` añade un archivo de tu ordenador al final de una página como imagen, vídeo,
  audio, PDF o archivo, y envía por partes un archivo de más de 20 MB. Notion MCP le da a la aplicación de IA una
  dirección de subida, y la aplicación envía el archivo ella misma, en una sola parte de hasta 20 MiB.
  `ntn files create` sube un archivo a Notion, y su referencia de comandos no muestra ningún comando que lo añada a
  una página. notion-mcp-server no tiene ninguna herramienta para subir archivos.
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

<a id="when-another-tool-fits-better" />

## Cuándo encaja mejor otra herramienta

- **Notion MCP**: quieres que Claude o ChatGPT busque, escriba y ordene tu espacio de trabajo sin instalar nada, y tus
  páginas no tienen que estar en tu ordenador.
- **ntn**: creas Notion Workers, o quieres la línea de comandos propia de Notion con inicio de sesión en el navegador.
- **notion-exporter**: quieres una vez un árbol de páginas o una base de datos como archivos Markdown y CSV, por
  ejemplo para un sitio estático o una copia de seguridad.

Si `notion` encaja, empieza por la [instalación](./installation.md).
