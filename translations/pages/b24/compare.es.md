---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`b24` es una línea de comandos y un servidor MCP para los datos de ventas de un portal de Bitrix24: negociaciones,
prospectos, contactos, empresas, embudos, productos y empleados. Esta página lo pone junto a las otras herramientas
con las que un agente de IA lee y cambia un CRM de Bitrix24, para que veas cuál encaja con tu trabajo. Las marcas de
`b24` salen de su versión 0.7.0, sus comandos y su código, revisados el 8 de noviembre de 2026; se revisan de nuevo en
cada versión. Las marcas de las demás herramientas salen de su propia documentación, sus fichas en catálogos y su
código, revisados el 7 de noviembre de 2026, y la exportación a CSV el 8 de noviembre de 2026. No se inició sesión en
ninguna ni se probó en vivo, y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **b24**: esta herramienta. Guarda una copia de negociaciones, prospectos y embudos en tu ordenador, y decide para cada
  acción qué puede hacer un agente. Inicia sesión con un webhook entrante del portal.
- **[Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md)**: el servidor MCP propio de Bitrix24, sobre
  su API Vibecode, con 53 herramientas para toda la plataforma (npm `@bitrix24/mcp-vibecode-api`, versión 3.4.1 del
  6 de noviembre de 2026).
- **[Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new)**: el servidor MCP alojado de Zapier, con la app Bitrix24
  CRM. Cada llamada a una herramienta usa dos tareas de Zapier.
- **[MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/)**: un conector
  MCP alojado del Bitrix24 Market, hecho por una empresa socia (604 instalaciones el 7 de noviembre de 2026).
- **[bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server)**: el servidor MCP de código abierto con
  más estrellas que cubre todo el CRM (35 estrellas, último cambio en julio de 2025).

`b24`, Vibecode MCP y bitrix24-mcp-server llaman a la API REST del portal, que un portal en la nube tiene solo con un
plan de pago ([la página de Bitrix24](https://apidocs.bitrix24.com/first-steps/access-to-rest-api.html)).
La app de Zapier también funciona solo con planes de pago ([su ficha](https://www.bitrix24.pl/apps/app/integrations24.zapierbitrix24crm/)).

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

## Funciones

| Tarea | b24 | [Vibecode MCP](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [Zapier MCP](https://zapier.com/mcp/bitrix24-crm-new) | [MCP Bridge](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [bitrix24-mcp-server](https://github.com/gunnit/bitrix24-mcp-server) |
|---|:-:|:-:|:-:|:-:|:-:|
| **Buscar y leer** | | | | | |
| Las negociaciones abiertas de una etapa o un embudo | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L470-L500) |
| El embudo: cuántas negociaciones llegaron a cada etapa | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| Leer negociaciones y prospectos sin internet | ✅ | ➖ | ➖ | ➖ | ➖ |
| Encontrar una negociación o un prospecto por una palabra del título | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://zapier.com/mcp/bitrix24-crm-new) | ➖ | ➖ |
| Una búsqueda en las negociaciones y en los mensajes y notas de tus otras herramientas | ✅ | ➖ | ➖ | ➖ | ➖ |
| Los campos propios del portal, con sus nombres y opciones | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [🟡](https://www.bitrix24.pl/apps/app/integrations24.zapierbitrix24crm/) | ➖ | ➖ |
| Leer productos y empleados | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L805) |
| Exportar negociaciones, prospectos, contactos o empresas a un archivo CSV para una hoja de cálculo | ✅ | ➖ | ➖ | ➖ | ➖ |
| **Cambiar el CRM** | | | | | |
| Crear y cambiar una negociación o un prospecto | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L79-L147) |
| Crear y cambiar contactos y empresas | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/apps/bitrix24-crm-new/integrations) | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [✅](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L6-L78) |
| Pasar una negociación a una etapa por el nombre de la etapa | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Cerrar una negociación como ganada o perdida en un paso | ✅ | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts#L142) |
| Borrar una negociación o un prospecto | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | [🟡](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [❌](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/src/tools/index.ts) |
| Rellenar un campo personalizado por su nombre | ✅ | ➖ | ➖ | ➖ | ➖ |
| Llamar a cualquier otro método de Bitrix24 | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | ➖ | ➖ | ➖ |
| **Agentes y seguridad** | | | | | |
| Dejar al agente solo lectura | ✅ | [✅](https://vibecode.bitrix24.com/docs-content-en/keys-auth/access-mode.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| Elegir para cada acción: permitir, preguntar antes o negar | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | [🟡](https://zapier.com/mcp) | ➖ | ➖ |
| Pregunta antes de borrar | 🟡 | [🟡](https://unpkg.com/@bitrix24/mcp-vibecode-api@3.4.1/dist/tools/entities.js) | ➖ | ➖ | n/a |
| Los métodos que escriben a personas o inician flujos de trabajo se niegan hasta que los permitas | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Dar un registro a otro empleado se niega hasta que lo permitas | ✅ | ➖ | ➖ | ➖ | ➖ |
| Ver qué haría una escritura, sin hacerla | ✅ | ➖ | ➖ | ➖ | ➖ |
| Una escritura nunca se envía dos veces tras perder la respuesta | ✅ | ➖ | ➖ | ➖ | ➖ |
| El webhook o la clave se guarda en el llavero del sistema | ✅ | ➖ | n/a | n/a | ➖ |
| **Configuración** | | | | | |
| Varios portales, cada uno nombrado en el comando | ✅ | [🟡](https://vibecode.bitrix24.com/docs-content-en/keys-auth.md) | ➖ | ➖ | ➖ |
| Funciona desde ChatGPT o Claude en el navegador | 🟡 | [🟡](https://vibecode.bitrix24.com/docs-content-en/mcp.md) | [✅](https://zapier.com/mcp) | [✅](https://www.bitrix24.com/apps/app/hub_despachos_y_pyme.mcp_bridge_ai_for_bitrix24/) | [🟡](https://github.com/gunnit/bitrix24-mcp-server/blob/2544df3b1c6db12ff6e34a819638dff1a3550b92/server.js#L91) |

| | b24 | Vibecode MCP | Zapier MCP | MCP Bridge | bitrix24-mcp-server |
|---|---|---|---|---|---|
| Instalar | npm, Node 22.16+ o 24+ | npm, Node 18+ | nada: alojado | desde el Bitrix24 Market | desde el código |
| Licencia | Apache-2.0 | MIT | servicio cerrado | servicio cerrado | MIT en `package.json`, sin archivo de licencia |
| Precio | gratis, con un plan de pago de Bitrix24 | gratis, con un plan de pago de Bitrix24 | dos tareas de Zapier por llamada, con un plan de pago de Bitrix24 | gratis, con extras de pago | gratis, con un plan de pago de Bitrix24 |

Notas sobre la columna de `b24`:

- **Solo lectura.** `B24_READ_ONLY=1` niega toda escritura, digan lo que digan los ajustes. El nivel `readonly` hace
  lo mismo para una clave. Sin ninguno de los dos, un perfil nuevo deja a un agente crear, cambiar, mover y cerrar
  negociaciones y prospectos.
- **Permitir, preguntar o negar.** Cada comando tiene su clave de permiso, como `deals.delete` o `leads.move`, con el
  valor `allow`, `ask`, `readonly` o `deny` en [los ajustes](./configuration.md#permissions). `mcp serve --permission`
  hace una clave más estricta solo para un servidor. Un agente por MCP no puede cambiar estos ajustes.
- **Pregunta antes de borrar** en una terminal. Por MCP no hay nadie que responda, así que `ask` deja seguir al
  agente. Para que un agente no borre, pon `deals.delete` y `leads.delete` en `deny`. Por eso esta fila es en parte.
- **Mensajes y flujos de trabajo.** `api call` niega los métodos que escriben a personas, publican, inician flujos de
  trabajo o crean tareas, hasta que los permitas. Un cambio de etapa aún puede iniciar los robots del portal, que
  pueden escribir a tus clientes: pon `deals.move` y `leads.move` en `ask` o `deny` si tu portal tiene esos robots.
  Consulta la [seguridad](./security.md).
- **Otro empleado.** Bitrix24 avisa a un empleado cuando le dan un registro, así que `--owner` con otra persona se
  niega hasta que pongas `crm.assign-others` en `allow`.
- **Sin internet.** `sync` copia embudos, negociaciones, prospectos, contactos y empresas al almacén local, y `deals`,
  `leads`, `pipelines` y `stages` lo leen, también con `--offline`. `people`, `organizations`, `products` y `users`
  siempre preguntan al portal.
- **Una búsqueda.** `search all` encuentra negociaciones y prospectos por las palabras del título, junto a los mensajes,
  notas y eventos que otras herramientas de WireCat guardaron en el mismo ordenador, sin internet. Con
  `deals.list: deny` deja fuera las negociaciones, con `leads.list: deny` los prospectos, y nombra lo que dejó fuera.
- **CSV.** `deals`, `leads`, `people` y `organizations list --format csv` imprimen una página como tabla para una hoja
  de cálculo, con cada campo personalizado bajo su nombre; `--json=a,b` elige las columnas. Es para ti en una terminal:
  ninguna herramienta MCP lo ofrece, y un agente lee la respuesta JSON.
- **Campos personalizados por nombre.** Negociaciones, prospectos, contactos y empresas aceptan un campo personalizado
  por su nombre o su código, y la opción de una lista por su nombre. Negociaciones y prospectos leen los nombres que
  guardó el último `sync`.
- **Una escritura se envía una vez.** Una escritura sin respuesta no se envía de nuevo: termina como
  `outcome_unknown` con su `operation_id`. Revisa el portal antes de repetirla: Bitrix24 hace una escritura repetida
  por segunda vez.
- **Solo una llamada.** `api call` queda para ti en una terminal; ninguna herramienta MCP la ofrece.
- **ChatGPT o Claude en el navegador.** `mcp serve --http` sirve la herramienta detrás de un túnel HTTPS que tú
  configuras y mantienes, así que esta fila es en parte. Consulta el [uso](./usage.md#agents).
- **Velocidad y coste frente a un agente de navegador.** `b24` llama a la API REST del portal y lee su propia copia;
  no abre ningún navegador. No hay ninguna medición publicada frente a un agente de navegador, así que esta página no
  afirma nada.

## Cuándo encaja mejor otra herramienta

- **Zapier MCP**: quieres Bitrix24 en ChatGPT o Claude en el navegador, sin ejecutar nada en tu ordenador.
- **MCP Bridge**: tu equipo quiere un solo conector instalado desde el Bitrix24 Market, para el CRM y para las tareas.
- **Vibecode MCP**: necesitas más de Bitrix24 que los datos de ventas, como tareas, chats y flujos de trabajo, desde
  el servidor propio de Bitrix24.

Si `b24` encaja, empieza por la [instalación](./installation.md). Para usarlo con un agente, consulta el
[uso](./usage.md).
