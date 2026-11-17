---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`amo` es una línea de comandos y un servidor MCP para los datos de ventas de una cuenta de amoCRM o Kommo:
negociaciones, contactos, empresas, embudos, tareas y usuarios. Esta página lo pone junto a las otras herramientas con
las que un agente de IA lee y cambia amoCRM, para que veas cuál encaja con tu trabajo. Las marcas de `amo` salen de su
primera versión, sus comandos y su código, revisados el 16 de noviembre de 2026 con una cuenta de prueba hecha
a partir de la referencia OpenAPI de Kommo, no con una cuenta real. Se revisan de nuevo en cada versión. Las marcas de
las demás herramientas salen de su propia documentación y su código, enlazados en la tabla, revisados el 16 de
noviembre de 2026. No se inició sesión en ninguna ni se probó en vivo, y una herramienta puede hacer más de lo que
dicen sus páginas.

Las herramientas:

- **amo**: esta herramienta. Guarda en tu ordenador una copia de tus negociaciones y sus clientes, y decide para cada
  acción qué puede hacer un agente. Inicia sesión con un token de larga duración de una integración privada, o con tu
  propia integración en el navegador.
- **[Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP)**: el servidor MCP de código abierto para Kommo con más
  estrellas (16 estrellas, cambiado el 16 de noviembre de 2026), con 23 herramientas.
- **[amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp)**: un servidor MCP para amoCRM y Kommo con
  informes para un responsable de ventas: el embudo, las negociaciones paradas y un ranking de comerciales. Existe una
  versión alojada de pago.
- **[amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm)**:
  un servidor MCP en npm (`@theyahia/amocrm-mcp` 2.0.2), con 19 herramientas. Lo menciona un repaso de servidores MCP
  para servicios rusos en [sostav.ru](https://www.sostav.ru/blogs/289407/104725).
- **[Composio](https://composio.dev/toolkits/kommo)**: el servidor MCP alojado de Composio, con 53 herramientas para
  Kommo.
- **[amocrm-cli](https://github.com/polza-ai/amocrm-cli)**: otra línea de comandos para amoCRM y Kommo, para personas y
  agentes (npm `@polza-ai/amocrm-cli` 0.1.0, 27 de junio de 2026).

amoCRM y Kommo no tienen un servidor MCP propio para los datos del CRM. Su
[API de IA](https://developers.kommo.com/reference/ai-api-methods) alimenta su propio asistente de IA y no da
negociaciones a un agente. Un token de larga duración lo crea el administrador de la cuenta en una integración privada,
y actúa con los permisos de ese administrador ([Kommo](https://developers.kommo.com/docs/long-lived-token)). Todas las
herramientas de esta página salvo Composio inician sesión así o con OAuth.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | amo | [Kommo-MCP](https://github.com/Miguelgbastos/Kommo-MCP) | [amocrm-kommo-mcp](https://github.com/penmadebykisss/amocrm-kommo-mcp) | [amocrm-mcp](https://github.com/theYahia/WWmcp/tree/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm) | [Composio](https://composio.dev/toolkits/kommo) | [amocrm-cli](https://github.com/polza-ai/amocrm-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | | |
| Las negociaciones abiertas de una etapa o un embudo | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L79-L106) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/leads.ts#L9-L13) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L46-L62) |
| Encontrar un contacto por nombre, teléfono o correo | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L162) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L195-L200) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/contacts.ts#L6) | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L39) |
| Listar las tareas abiertas y vencidas | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L174-L182) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L224-L228) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/tools/tasks.ts#L13) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L27-L28) |
| Leer negociaciones sin internet | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L59-L67) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | ➖ | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L11) |
| Una búsqueda en las negociaciones y en los mensajes y notas de tus otras herramientas | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Cambiar el CRM** | | | | | | |
| Crear y cambiar contactos y empresas | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L154-L173) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L135-L160) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L93-L122) | [✅](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/contacts.ts#L95-L131) |
| Pasar una negociación a una etapa por el nombre de la etapa | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L105-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Cerrar una negociación como perdida, con su motivo, en un paso | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L87-L117) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L169-L178) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L64-L73) | ➖ | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L162) |
| Poner una tarea o añadir una nota a una negociación | 🟡 | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L184-L257) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L209-L290) | [✅](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L144-L194) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/tasks.ts#L80-L120) |
| **Resúmenes y cambios** | | | | | | |
| El embudo: cuántas negociaciones llegaron a cada etapa | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L800) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L310-L318) | ➖ | ➖ | ➖ |
| Parte de negociaciones ganadas en un periodo | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L687-L760) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L332) | ➖ | ➖ | ➖ |
| Negociaciones abiertas sin cambios desde hace más de N días | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L22-L50) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L341) | ➖ | ➖ | ➖ |
| Qué cambió en un día: negociaciones nuevas, cambios de etapa, ganadas y perdidas | ✅ | ➖ | ➖ | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L206) | [🟡](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| Un resumen del CRM cada mañana, programado, a Telegram o por correo | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | | |
| Dejar al agente solo lectura | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| Elegir para cada acción: permitir, preguntar o negar | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L22-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L26-L27) | ➖ | ➖ | ➖ |
| Una escritura espera tu confirmación | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/server.ts#L84-L95) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/server.js#L17-L27) | ➖ | ➖ | ➖ |
| Las acciones que escriben a clientes o inician un Salesbot se niegan hasta que las permitas | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/mcp/tool-definitions.ts#L286-L315) | n/a | n/a | n/a | n/a |
| Ver qué haría una escritura, sin hacerla | ✅ | ➖ | ➖ | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/commands/leads.ts#L120-L140) |
| Una escritura no se envía dos veces si se pierde la respuesta | ✅ | [✅](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/kommo-api.ts#L397-L411) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L79-L82) | ➖ | ➖ | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/client/http.ts#L20-L22) |
| El token se guarda en el llavero del sistema | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [❌](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | n/a | [❌](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76) |
| Un agente en una terminal trabaja con comandos, sin MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/README.md) |
| **Configuración** | | | | | | |
| Varias cuentas, cada una nombrada en el comando | ✅ | [❌](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/stdio.ts#L10-L23) | [🟡](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/http.js#L5-L18) | [❌](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L12-L18) | [✅](https://composio.dev/toolkits/kommo) | [🟡](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L76-L79) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/src/http-streamable.ts#L111-L113) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/README.md) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/index.ts#L10) | [✅](https://composio.dev/toolkits/kommo) | ➖ |
| Funciona con amoCRM.ru y con Kommo | ✅ | [🟡](https://github.com/Miguelgbastos/Kommo-MCP/blob/97eaab686ad6a19c10b074cdad2d57cdaa74d915/README.md) | [✅](https://github.com/penmadebykisss/amocrm-kommo-mcp/blob/020c1e47f0982201e6ac47213ccf198f7202fdcd/src/api.js#L22-L30) | [🟡](https://github.com/theYahia/WWmcp/blob/7b62c90e1fe74324605dc28d76f195200bb97252/servers/amocrm/src/client.ts#L155) | [🟡](https://composio.dev/toolkits/kommo) | [✅](https://github.com/polza-ai/amocrm-cli/blob/24dd75fce6032b90b523291196c76ab80883a6ad/src/config/config.ts#L77) |

| | amo | Kommo-MCP | amocrm-kommo-mcp | amocrm-mcp | Composio | amocrm-cli |
|---|---|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | desde el código fuente, Node 22.13+ | `npx` desde GitHub, Node 18+ | npm | ninguna: alojado | npm |
| Licencia | Apache-2.0 | MIT | MIT | MIT | servicio cerrado | MIT |
| Precio | gratis | gratis | gratis, la versión alojada por suscripción | gratis | 100.000 llamadas al mes gratis, de pago por encima | gratis |

Notas sobre la columna de `amo`:

- **Inicio de sesión.** Un token de larga duración de una integración privada actúa con los permisos del administrador
  que lo creó. Iniciar sesión con tu propia integración en el navegador actúa como el usuario que entra, y `amo`
  renueva los tokens por sí mismo. Los dos se guardan en el llavero del sistema, o en un archivo privado en un
  ordenador sin llavero. Mira [úsalo](./usage.md#sign-in).
- **Solo lectura.** `AMO_READ_ONLY=1` rechaza todas las escrituras, digan lo que digan los ajustes. El nivel
  `readonly` hace lo mismo para una clave. Sin ninguno de los dos, un perfil nuevo deja que un agente cree, cambie,
  mueva y cierre negociaciones, y cree y cambie contactos y empresas.
- **Permitir, preguntar o negar.** Cada comando y cada operación de la API tiene su clave, como `deals.update` o
  `api.leads.patch`, con `allow`, `ask`, `readonly` o `deny` en [los ajustes](./permissions.md).
  `mcp serve --permission` hace una clave más estricta solo para un servidor. Un agente por MCP no puede cambiar estos
  ajustes.
- **Confirmación.** `ask` pregunta en una terminal. Por MCP no hay nadie para responder, así que `ask` deja seguir al
  agente, y esta fila es en parte. Para que un agente no escriba, pon la clave en `deny` o `readonly`.
- **Mensajes y Salesbots.** Conversaciones, chats, Salesbots, webhooks, widgets y activar o desactivar usuarios están
  negados, también para leer, hasta que los permitas. Lo mismo las escrituras de tareas, roles y fuentes de
  prospectos. Dar una negociación, una tarea o un contacto a otro usuario se niega hasta que pongas
  `crm.assign-others` en `allow`.
- **Tareas y notas.** No tienen un comando propio. Una tarea o una nota solo se escribe con `api call` en una
  terminal, después de permitir su clave, así que esta fila es en parte. Ninguna herramienta MCP ofrece `api call`.
  Las tareas, comentarios y llamadas de tus negociaciones de los últimos 90 días se leen con `activities list`, cuando
  activas el ajuste `activities`.
- **Sin internet.** `sync` copia los embudos y las negociaciones asignadas a ti y a los compañeros que elijas, con sus
  contactos y empresas. `deals`, `pipelines`, `stages`, `activities` y `changes` leen esta copia, también con
  `--offline`. `people`, `organizations` y `users` siempre preguntan a amoCRM. Ninguna sincronización copia todo el
  CRM.
- **Una búsqueda.** `search all` encuentra negociaciones junto a los mensajes, notas y reuniones que guardaron otras
  herramientas de WireCat en el mismo ordenador, sin internet.
- **Un contacto por teléfono o correo.** `people list` pasa tus palabras a la búsqueda propia de amoCRM. Un usuario que
  no es administrador y entró con su propia integración ve los teléfonos y correos solo de sus propios clientes, y como
  mucho de otros 100 contactos al día.
- **Embudo.** `pipelines show` cuenta cuántas negociaciones llegaron a cada etapa y siguieron, a partir del historial
  de etapas que `sync` lee de los eventos de amoCRM, y la parte ganada en un periodo. No tiene desglose por
  comercial.
- **Qué cambió y el resumen.** `changes list` muestra negociaciones nuevas, cambios de etapa, ganadas, perdidas,
  nuevos responsables, y tareas añadidas y hechas. `schedule command … changes list --format report --deliver-to`
  envía un resumen cada mañana a Telegram o por correo con las herramientas de WireCat `tg` o `mail`. Los teléfonos y
  correos van ocultos, y no entra el texto de ninguna nota.
- **Una escritura se envía una vez.** Una escritura que no recibió respuesta no se envía otra vez. Termina como
  `outcome_unknown` con su `operation_id`. Revisa amoCRM antes de volver a escribirla, porque amoCRM no tiene una
  clave que descarte una repetición.
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta detrás de un túnel que montas y
  mantienes tú, así que esta fila es en parte.
- **Velocidad y coste frente a un agente de navegador.** `amo` llama a la API de amoCRM, lee su propia copia y no abre
  ningún navegador. No hay ninguna medición publicada frente a un agente de navegador, así que esta página no afirma
  nada.

## Cuándo encaja mejor otra herramienta

- **Composio**: quieres Kommo en ChatGPT o Claude en el navegador, sin nada que ejecutar en tu ordenador.
- **amocrm-kommo-mcp**: un responsable de ventas quiere un informe con un ranking de comerciales, la negociación media
  y la duración del ciclo de venta, o una versión alojada sin nada que instalar.
- **amocrm-mcp** o **amocrm-cli**: el agente debe poner tareas y escribir notas por sí mismo, sin un permiso aparte.

Si `amo` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, mira [úsalo](./usage.md).
