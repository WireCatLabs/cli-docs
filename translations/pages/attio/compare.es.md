---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />
<a id="how-an-agent-answers-through-each" />

`attio` es una línea de comandos y un servidor MCP para los datos de ventas de un espacio de trabajo de Attio:
negociaciones, personas, empresas, el embudo de negociaciones y los miembros del espacio de trabajo. Esta página lo
pone junto a las otras herramientas con las que un agente de IA lee y cambia Attio, para que veas cuál encaja con tu
trabajo. Las marcas de `attio` salen de su versión actual, sus comandos y su código, revisados el 26 de noviembre de
2026. Sus pruebas usan un Attio falso hecho a partir de la descripción de la API de Attio, y cada versión pasa además
una revisión con un espacio de trabajo real. Las marcas se revisan de nuevo en cada versión. Las marcas de las demás
herramientas salen de su propia documentación y su código, enlazados en la tabla, revisados el 19 de noviembre de
2026. Attio MCP y attio-mcp también se probaron en vivo en una
[prueba con un agente](#how-an-agent-answers-through-each). En las demás no se inició sesión, y una herramienta puede
hacer más de lo que dicen sus páginas.

Las herramientas:

- **attio**: esta herramienta. Guarda en tu ordenador una copia de tus negociaciones y de las personas y empresas que
  nombran, y decide para cada acción qué puede hacer un agente. Inicia sesión con un token de acceso que crea un
  administrador del espacio de trabajo. WireCat Desktop lo instala y pide el token.
- **[Attio MCP](https://docs.attio.com/mcp/overview)**: el servidor MCP propio de Attio, alojado por Attio, con 53
  herramientas. Inicias sesión con tu cuenta de Attio, y actúa con tus propios permisos.
- **[attio-mcp](https://github.com/kesslerio/attio-mcp-server)**: el servidor MCP de código abierto para Attio con más
  estrellas y descargas (68 estrellas, cambiado el 10 de noviembre de 2026, npm `attio-mcp` 1.7.0 con 9.326 descargas
  en el mes hasta el 17 de noviembre de 2026). Tiene 19 herramientas universales y otras para listas, notas y miembros.
- **[Composio](https://composio.dev/toolkits/attio)**: el servidor MCP alojado de Composio, con 105 herramientas para
  Attio.
- **[Zapier MCP](https://zapier.com/mcp/attio)**: el servidor MCP alojado de Zapier con la app de Attio. Cada
  llamada a una herramienta usa dos tareas de Zapier.
- **[FroeMic/attio-cli](https://github.com/FroeMic/attio-cli)**: la línea de comandos de código abierto para Attio con
  más estrellas (21 estrellas, cambiada el 5 de febrero de 2026). Su comando también se llama `attio`.

Cómo se eligieron las rivales: el servidor propio de Attio, el servidor MCP y la línea de comandos de código abierto con
más estrellas en GitHub, y los dos servicios alojados que muestran sus herramientas para Attio. El siguiente servidor
MCP tiene 16 estrellas y 257 descargas al mes, y la siguiente línea de comandos tiene 18 estrellas. Pipedream también
tiene un servidor MCP para Attio, con 9 acciones. Queda fuera para dejar la tabla en cinco herramientas.

El servidor MCP propio de Attio no necesita token: inicias sesión con tu cuenta de Attio, y ve lo que ve tu usuario. Un
token de acceso lo crea un administrador del espacio de trabajo en Workspace settings → Developers. Lee, y con ámbitos
de escritura cambia, todo el espacio de trabajo, lo use quien lo use. `attio`, attio-mcp y FroeMic/attio-cli inician
sesión con un token así. attio-mcp también acepta un token de OAuth a través de un Cloudflare Worker que alojas tú.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | attio | [Attio MCP](https://docs.attio.com/mcp/overview) | [attio-mcp](https://github.com/kesslerio/attio-mcp-server) | [Composio](https://composio.dev/toolkits/attio) | [Zapier MCP](https://zapier.com/mcp/attio) | [FroeMic/attio-cli](https://github.com/FroeMic/attio-cli) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | | |
| Listar las negociaciones abiertas de una etapa | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [🟡](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Encontrar a una persona por nombre o correo | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L924-L970) |
| Leer las notas y tareas de una negociación | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | ➖ | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| Buscar en los correos y grabaciones de llamadas que guarda Attio | 🟡 | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Leer negociaciones sin internet | ✅ | [❌](https://docs.attio.com/mcp/overview) | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/api/client-config.ts#L79) | ➖ | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/src/utils/config.ts#L6) |
| Una búsqueda sobre negociaciones y los mensajes y notas de tus otras herramientas | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Cambiar el CRM** | | | | | | |
| Crear y cambiar personas y empresas | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L49-L50) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Mover una negociación a otra etapa | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L51) | [✅](https://composio.dev/toolkits/attio) | [🟡](https://zapier.com/mcp/attio) | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L408-L431) |
| Añadir una nota o una tarea a una negociación | ✅ | [✅](https://docs.attio.com/mcp/overview) | [✅](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L52-L54) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp/attio) | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L630-L746) |
| **Resúmenes y cambios** | | | | | | |
| Cuántas negociaciones hay en cada etapa y su total | ✅ | [✅](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Parte de negociaciones ganadas en un periodo | ✅ | [🟡](https://docs.attio.com/mcp/overview) | ➖ | ➖ | ➖ | ➖ |
| Qué cambió en un día: negociaciones nuevas, cambios de etapa, ganadas y perdidas | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/docs/universal-tools/api-reference.md#L526-L535) | ➖ | ➖ | ➖ |
| Un resumen corto de la mañana con lo que cambió | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | | |
| Un interruptor en la propia herramienta que deja al agente solo leer | ✅ | ➖ | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/src/config/tool-mode.ts#L1-L28) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Elegir para cada acción: permitir, preguntar o negar | ✅ | [🟡](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | [🟡](https://zapier.com/mcp) | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Una escritura espera tu confirmación | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L215) | ➖ | ➖ | ➖ |
| Ver qué permisos revisa un comando, sin ejecutarlo | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| El token se guarda en el llavero del sistema | ✅ | n/a | [❌](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L560-L586) | n/a | n/a | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L140-L170) |
| Iniciar sesión con tu propia cuenta de Attio, sin un token de un administrador | ❌ | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | ➖ | [❌](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L96-L123) |
| Un agente en una terminal trabaja con comandos, sin MCP | ✅ | n/a | n/a | n/a | n/a | [✅](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md) |
| **Configuración** | | | | | | |
| Varios espacios de trabajo, cada uno nombrado en el comando | ✅ | ➖ | ➖ | ➖ | ➖ | [🟡](https://github.com/FroeMic/attio-cli/blob/d75f885ec2627c6927b7c0a6bbee9ad9547b23fc/README.md#L162-L168) |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [✅](https://docs.attio.com/mcp/overview) | [🟡](https://github.com/kesslerio/attio-mcp-server/blob/8828ecab74903c8cd85cc12a2a2f60b213f37b5b/README.md#L446-L450) | [✅](https://composio.dev/toolkits/attio) | [✅](https://zapier.com/mcp) | ➖ |

| | attio | Attio MCP | attio-mcp | Composio | Zapier MCP | FroeMic/attio-cli |
|---|---|---|---|---|---|---|
| Instalación | npm, Node 22.16+ o 24+ | ninguna: alojado por Attio | npm, Node 20+ | ninguna: alojado | ninguna: alojado | desde el código fuente, Node 18+ |
| Licencia | Apache-2.0 | servicio cerrado | Apache-2.0 | servicio cerrado | servicio cerrado | MIT |
| Precio | gratis | su página no da precio | gratis | 100.000 llamadas al mes gratis, hasta 20.000 de ellas con apps como Attio, de pago por encima | [dos tareas de Zapier por llamada](https://docs.zapier.com/mcp/usage) | gratis |

Notas sobre la columna de `attio`:

- **Inicio de sesión.** Un administrador del espacio de trabajo crea el token de acceso en Workspace settings →
  Developers. Con los tres ámbitos de lectura lee todo el espacio de trabajo. `attio` lo guarda en el llavero del
  sistema, o en un archivo privado en un ordenador sin llavero, y nunca lo muestra. Iniciar sesión con Attio en el
  navegador está en la [hoja de ruta](./roadmap.md). Mira la [instalación](./installation.md).
- **Solo lectura.** `WCATTIO_READ_ONLY=1` rechaza todas las escrituras, digan lo que digan los ajustes.
  `permissions.api` en `readonly` hace lo mismo para un perfil. Con un token que solo tiene ámbitos de lectura, el
  propio Attio rechaza toda escritura, y eso sirve con cualquier herramienta de esta página que use un token.
- **Permitir, preguntar o negar.** Cada comando y cada operación de la API tiene su clave, como `deals.list` o
  `api.notes-create`, con `allow`, `ask`, `readonly` o `deny` en [los permisos](./permissions.md).
  `mcp serve --permission` hace una clave más estricta solo para un servidor. Un agente no puede aflojar un permiso.
- **Escrituras por MCP.** La herramienta `attio_write` ejecuta los comandos que escriben: negociaciones, personas,
  notas y tareas, y el grupo `api`. Cada escritura empieza en `ask`. Por MCP no hay nadie en una terminal para responder, así que `ask` deja seguir al agente, y
  con un token con ámbitos de escritura puede escribir y borrar. Por eso la fila de confirmación es en parte. Pon
  `permissions.api` en `readonly`, o activa la aprobación de `attio_write` en la app de tu agente. Mira
  [MCP](./mcp.md).
- **Cambios en el CRM.** `deals` crea, cambia, mueve y cierra negociaciones, `people` crea y cambia personas, y
  `activities` añade una nota o una tarea y marca una tarea como hecha. Cada uno te pregunta antes en una terminal.
  Ningún comando escribe empresas: una empresa de Attio no tiene atributo de correo ni de teléfono que escribir, así
  que un cambio en una pasa por una operación de `api`, como `api objects-records-update`. Por eso la fila de personas
  y empresas es en parte.
- **Sin internet.** `sync` copia las negociaciones y las personas y empresas que nombran, con las etapas del embudo de
  negociaciones. `deals`, `pipelines`, `stages`, `changes`, `fields` y `search all` leen esta copia, también con
  `--offline`. `people`, `organizations` y `users` siempre preguntan a Attio. Attio no sabe listar solo lo que cambió,
  así que cada sincronización lee todos los registros. Con el ajuste `activities` la copia guarda también las notas,
  las tareas y las reuniones de esos registros.
- **Llamadas y correos.** Con el ajuste `activities`, `sync` copia también las reuniones de Attio con las
  transcripciones de sus llamadas grabadas, y `search all` encuentra una negociación por una palabra dicha en una
  llamada. Los correos que guarda Attio no se copian. Por eso la fila de correos y grabaciones de llamadas es en parte.
- **Una búsqueda.** `search all` encuentra negociaciones junto a los mensajes, notas y reuniones que guardaron otras
  herramientas de WireCat en el mismo ordenador, sin internet.
- **Etapas y parte ganada.** `pipelines show` da para cada etapa el número de negociaciones y su suma por moneda, sin
  convertir. Con `--since-time` añade la parte ganada. Ganada es la etapa que Attio celebra, y perdida es una etapa
  cuyo título empieza por "Lost". Attio MCP saca números y totales con su herramienta `run-basic-report`, y el agente
  calcula la parte a partir de ellos.
- **Qué cambió y el resumen.** `changes list` muestra lo que vieron las sincronizaciones: negociaciones creadas,
  movidas, ganadas, perdidas y con otro responsable. Un cambio solo se ve tras una sincronización. `--format report`
  convierte la ventana en un resumen corto de la mañana.
- **Toda la API de Attio.** `api list` muestra todas las operaciones de la API de Attio, y cada una es un comando con
  su propia ayuda, para lo que aún no tiene un comando propio.
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta detrás de un túnel que montas y
  mantienes tú, así que esta fila es en parte.
- **Velocidad y coste frente a un agente de navegador.** `attio` llama a la API de Attio, lee su propia copia y no abre
  ningún navegador. No hay ninguna medición publicada frente a un agente de navegador, así que esta página no afirma
  nada.

## Cómo responde un agente con cada una

Le hicimos a un agente 30 preguntas de un vendedor sobre negociaciones y clientes, en un espacio de trabajo de Attio
inventado con 123 negociaciones y unas 380 personas. Las preguntas suenan como se hacen de verdad: un nombre con una
errata, sin nombrar al cliente, un detalle mal recordado. El agente fue siempre el mismo (Claude Code con Claude
Sonnet) y solo cambió la herramienta. Otro agente puntuó las respuestas sin saber qué herramienta las dio. La
preparación, las preguntas y los scripts están en los [resultados de la prueba](https://github.com/WireCatLabs/cli-testing/blob/main/performance/crm/attio-agents/README.md).

| | attio | Attio MCP | attio-mcp |
|---|---|---|---|
| Respuestas correctas de 30 | 27,5 | 28 | 23,5 |
| Tiempo para 30 preguntas | 10 minutos | 8 minutos | 21 minutos |
| Coste del modelo para 30 preguntas | 2,74 $ | 2,74 $ | 5,38 $ |

- **attio y Attio MCP respondieron igual de bien** con estos datos, en un tiempo parecido y por el mismo coste. Medio
  punto de diferencia está dentro de la variación de una pasada.
- **Con `attio` el agente encuentra las notas por sus palabras.** Con el ajuste `activities`, `sync` copia las notas y
  las tareas, y el agente respondió a todas las preguntas hechas solo con palabras clave. Attio MCP busca en las notas
  por significado.
- **Solo attio encontró a un cliente cuyo nombre tenía una letra equivocada.** Los dos servidores MCP no lo
  encontraron.
- **attio-mcp no ve la fecha límite de una tarea**, así que no pudo responder a las preguntas sobre tareas vencidas y
  tareas de la semana.

Composio, Zapier MCP y FroeMic/attio-cli no participaron en esta prueba.

## Cuándo encaja mejor otra herramienta

- **Attio MCP**: quieres Attio en Claude, ChatGPT o Cursor sin instalar nada, no eres administrador del espacio de
  trabajo, o el agente debe leer los correos que guarda Attio y escribir con tu confirmación.
- **Composio** o **Zapier MCP**: quieres Attio junto a muchas otras apps en un solo servidor alojado.
- **attio-mcp**: el agente debe crear y cambiar negociaciones, notas y tareas con herramientas listas en tu ordenador.
- **FroeMic/attio-cli**: un script debe gestionar objetos, atributos, listas y entradas en una terminal, sin una capa
  de permisos.

Si `attio` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, mira [úsalo](./usage.md).
