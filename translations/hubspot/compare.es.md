---
title: "Comparado con otras herramientas"
---

<!-- cspell:words Composio PKCE baryhuang -->

`hubspot` es una línea de comandos y un servidor MCP para los datos de ventas de una cuenta de HubSpot: negociaciones,
contactos, empresas, embudos, leads, actividades y propietarios. Esta página lo pone junto a las otras herramientas
que permiten a un agente de IA leer y cambiar el CRM de HubSpot, para que veas cuál encaja con tu tarea. Las marcas de
`hubspot` salen de su versión actual, sus comandos y su código, revisados el 18 de noviembre de 2026, y se revisan de
nuevo en cada versión. Las marcas de las otras herramientas salen de su propia documentación y su código, enlazados en
la tabla, revisados el 18 de noviembre de 2026. No se inició sesión en ninguna ni se probó nada en vivo, y una
herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **hubspot**: esta herramienta. Guarda una copia de tus negociaciones con sus contactos y empresas en tu ordenador, y
  decide para cada acción qué puede hacer un agente. Inicia sesión con una clave de servicio o con el token de una app
  privada antigua de la cuenta.
- **[HubSpot MCP](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)**:
  el servidor MCP alojado de la propia HubSpot, disponible para todos desde el 13 de abril de 2026, con 36
  herramientas para el CRM, el marketing y el contenido.
- **[HubSpot Agent CLI](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide)**:
  la línea de comandos de la propia HubSpot para agentes, en beta. Su comando también se llama `hubspot`, así que las
  dos herramientas no pueden compartir un `PATH` con el mismo nombre.
- **[mcp-hubspot](https://github.com/baryhuang/mcp-hubspot)**: el servidor MCP de código abierto para HubSpot con más
  estrellas (129 estrellas, último cambio el 11 de noviembre de 2025), con 16 herramientas para contactos, empresas,
  tickets y conversaciones. No tiene ninguna herramienta para negociaciones ni embudos.
- **[Composio](https://composio.dev/toolkits/hubspot)**: el servidor MCP alojado de Composio, con 354 herramientas para
  HubSpot.

El propio servidor MCP de HubSpot
[lee y escribe](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#supported-data-and-permissions)
contactos, empresas, negociaciones, tickets, leads y actividades. Actúa como el usuario de HubSpot que inicia sesión,
con OAuth 2.1 y PKCE, a través de una app de autenticación MCP que alguien crea antes en la cuenta. Ninguna de sus
herramientas borra un registro del CRM. En una cuenta con Sensitive Data activado, la página actual dice que bloquea
los datos de conversaciones, y el
[anuncio](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available) de abril de
2026 decía que bloquea llamadas, correos, reuniones, notas y tareas. Una clave de servicio, la que usa `hubspot`, actúa
para toda la cuenta y no para una persona
([HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)).

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | hubspot | [HubSpot MCP](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) | [HubSpot Agent CLI](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide) | [mcp-hubspot](https://github.com/baryhuang/mcp-hubspot) | [Composio](https://composio.dev/toolkits/hubspot) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | |
| Las negociaciones abiertas de una etapa o un embudo | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#filter-and-search) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Encontrar un contacto por nombre, teléfono o correo | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#filter-and-search) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L218-L238) | [🟡](https://composio.dev/toolkits/hubspot) |
| Listar las tareas abiertas y vencidas | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#read-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Leer negociaciones sin internet | ✅ | [❌](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#implementation-overview) | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [❌](https://composio.dev/toolkits/hubspot) |
| Una sola búsqueda en negociaciones y en los mensajes y notas de tus otras herramientas | ✅ | ➖ | ➖ | ➖ | ➖ |
| Leer y cambiar tickets | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [🟡](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L247-L258) | [✅](https://composio.dev/toolkits/hubspot) |
| **Cambiar el CRM** | | | | | |
| Crear y actualizar contactos y empresas | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [✅](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L191-L238) | [✅](https://composio.dev/toolkits/hubspot) |
| Mover una negociación a una etapa por el nombre de la etapa | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#properties) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Cerrar una negociación como perdida, con su motivo, en un solo paso | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#properties) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Poner una tarea o añadir una nota en una negociación | ✅ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#write-access) | [✅](https://developers.hubspot.com/docs/build-with-ai/agent-cli#when-to-use-the-agent-cli) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [✅](https://composio.dev/toolkits/hubspot) |
| Llamar a cualquier otra operación de la API del CRM de HubSpot | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| **Resúmenes y cambios** | | | | | |
| Embudo: cuántas negociaciones llegaron a cada etapa | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Proporción de negociaciones ganadas en un periodo | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#core-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Negociaciones abiertas sin cambios durante más de N días | ✅ | [🟡](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/build-with-ai/agent-cli#when-to-use-the-agent-cli) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Qué cambió en un día: negociaciones nuevas, cambios de etapa, ganadas y perdidas | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | [🟡](https://composio.dev/toolkits/hubspot) |
| Un resumen programado del CRM cada mañana en Telegram o por correo | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | |
| Dejar que un agente solo lea | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Elegir para cada acción: permitir, preguntar o rechazar | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Una escritura espera tu confirmación | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | [🟡](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#auth-sensitive-commands) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L186-L281) | ➖ |
| Dar un registro a otro propietario se rechaza hasta que lo permitas | ✅ | ➖ | ➖ | ➖ | ➖ |
| Ver qué haría una escritura sin hacerla | 🟡 | ➖ | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#using-the-dry-run-flag) | ➖ | ➖ |
| Una escritura no se envía dos veces cuando se pierde su respuesta | ✅ | ➖ | ➖ | [🟡](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/handlers/contact_handler.py#L110-L146) | ➖ |
| La clave se guarda en el llavero del sistema | ✅ | n/a | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | n/a |
| Un agente en una terminal trabaja con comandos, sin MCP | ✅ | n/a | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#run-commands) | n/a | n/a |
| **Configuración** | | | | | |
| Iniciar sesión como tú, con los permisos de tu propio usuario de HubSpot | ❌ | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#supported-data-and-permissions) | [✅](https://developers.hubspot.com/docs/developer-tooling/local-development/agent-cli/guide#standard-mode-via-oauth-login) | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | [✅](https://composio.dev/toolkits/hubspot) |
| Varias cuentas, cada una nombrada en el comando | ✅ | ➖ | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/hubspot_client.py#L62-L65) | [✅](https://composio.dev/toolkits/hubspot) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [✅](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server#available-tools) | ➖ | [❌](https://github.com/baryhuang/mcp-hubspot/blob/4a8345f2507b4159fc84eb500c74669329076f53/src/mcp_server_hubspot/server.py#L62-L63) | [✅](https://composio.dev/toolkits/hubspot) |

| | hubspot | HubSpot MCP | HubSpot Agent CLI | mcp-hubspot | Composio |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | ninguna: alojado, después de crear una app de autenticación MCP en la cuenta | el script de instalación de HubSpot, que se actualiza solo | Docker o Smithery | ninguna: alojado |
| Licencia | Apache-2.0 | servicio cerrado | [términos de beta para desarrolladores de HubSpot](https://legal.hubspot.com/developerbetaterms) | MIT | servicio cerrado |
| Precio | gratis | ➖, disponible para cualquier cuenta de HubSpot | ➖ | gratis | 100.000 llamadas al mes gratis, 20.000 de ellas a través de apps como HubSpot, de pago por encima |

Notas sobre la columna de `hubspot`:

- **Inicio de sesión.** Una clave de servicio o el token de una app privada antigua pertenece a la cuenta, no a una
  persona, y lee y cambia lo que permiten sus scopes. `hubspot` comprueba a qué cuenta pertenece la clave y la guarda
  en el llavero del sistema, o en un archivo privado en un ordenador sin llavero. Todavía no tiene inicio de sesión en
  el navegador, así que esta fila es no. Consulta [inicia sesión](./installation.md#sign-in).
- **Solo lectura.** `WCHUBSPOT_READ_ONLY=1` rechaza cada escritura, digan lo que digan los ajustes. El nivel
  `readonly` hace lo mismo para una clave. Sin ninguno de los dos, un perfil nuevo deja que un agente cree, actualice,
  mueva y cierre negociaciones, y cree y actualice contactos y empresas, hasta donde lo permitan los scopes de la
  clave.
- **Permitir, preguntar o rechazar.** Cada comando y cada operación de la API tiene su clave, como `deals.update` o
  `api.deals-search`, puesta en `allow`, `ask`, `readonly` o `deny` en [los ajustes](./permissions.md).
  `mcp serve --permission` hace una clave más estricta solo para un servidor. Un agente por MCP puede hacerlas más
  estrictas, nunca más flojas.
- **Confirmación.** `ask` pregunta en una terminal. Por MCP no hay nadie para responder, así que `ask` deja seguir al
  agente, y esta fila es en parte. Para impedir que un agente escriba, pon la clave en `deny` o `readonly`.
- **Otro propietario.** La clave no nombra a ninguna persona, así que `hubspot` no distingue tus registros de los de
  un compañero. Poner un propietario en cualquier registro, con un comando o con `api`, se rechaza hasta que pongas
  `crm.assign-others` en `allow`.
- **Tareas, notas y tickets.** `activities create` añade una nota o una tarea a una negociación, un contacto o una
  empresa, y `activities close` marca una tarea como hecha. Los tickets no tienen comando propio: se escriben con
  `api`, como `api tickets-create`, con un cuerpo JSON, así que esa fila es en parte. Una escritura con la API pregunta
  antes en una terminal, y por MCP `ask` la deja pasar. Las notas, llamadas, correos, reuniones y tareas de tus
  negociaciones se leen con `activities list`, cuando activas el ajuste de actividades.
- **Toda la API.** `api list` muestra todas las operaciones de la API del CRM de HubSpot, 157 en total, cada una un
  comando con su propia clave de permiso. También llegan a un agente por MCP.
- **Sin internet.** `sync` copia los embudos, las negociaciones con sus contactos y empresas, y los leads, y después
  solo pide lo que cambió. `deals`, `pipelines`, `stages`, `activities` y `changes` leen esta copia, también con
  `--offline`. `people`, `organizations` y `users` siempre preguntan a HubSpot.
- **Una sola búsqueda.** `search all` encuentra negociaciones junto a los mensajes, notas y reuniones que otras
  herramientas de WireCat guardaron en el mismo ordenador, sin internet.
- **Embudo.** `pipelines show` muestra un embudo como tablero: cuántas negociaciones hay en cada etapa,
  cuántas llegaron a ella y siguieron, y la tasa de éxito en un periodo.
- **Qué cambió y el resumen.** `changes list` muestra negociaciones nuevas, cambios de etapa, ganadas, perdidas, nuevos
  propietarios, actividades añadidas y hechas, y contactos nuevos.
  `schedule command … changes list --format report --deliver-to` envía un resumen cada mañana a Telegram o por correo
  a través de las herramientas de WireCat `tg` o `mail`.
- **Una vista previa.** `--dry-run` muestra cómo entendió un comando sus palabras y qué claves de permiso comprueba, y
  no envía nada. No muestra los valores que cambiaría una escritura, así que esta fila es en parte.
- **Una escritura se envía una vez.** Una escritura que no obtuvo respuesta no se envía de nuevo. Termina como
  `outcome_unknown` con su `operation_id`. Revisa HubSpot antes de escribirla otra vez, porque HubSpot no tiene una
  clave que descarte una repetición.
- **Ritmo.** `hubspot` envía como mucho 4 peticiones por segundo para cada cuenta, por debajo de los límites de HubSpot.
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta tras un túnel que montas y mantienes en
  marcha tú, así que esta fila es en parte. Consulta [MCP](./mcp.md).
- **Velocidad y coste frente a un agente de navegador.** `hubspot` llama a la API de HubSpot, lee su propia copia y no
  abre ningún navegador. No hay ninguna medición publicada frente a un agente de navegador, así que esta página no
  afirma nada.

## Cuándo encaja mejor otra herramienta

- **HubSpot MCP**: quieres HubSpot en ChatGPT o Claude en el navegador, con tu propio inicio de sesión y tus propios
  permisos, y que cada escritura se te muestre para que digas sí antes. También llega al marketing, el contenido y las
  publicaciones en redes sociales.
- **HubSpot Agent CLI**: un agente en una terminal debe trabajar como tú, con una vista previa de los registros y
  valores que tocaría un cambio masivo, o con objetos fuera del CRM como flujos de trabajo, informes y vistas
  guardadas.
- **Composio**: ya usas Composio para otras apps y quieres HubSpot junto a ellas, sin ejecutar nada en tu ordenador.

Si `hubspot` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, consulta el
[uso](./usage.md).
