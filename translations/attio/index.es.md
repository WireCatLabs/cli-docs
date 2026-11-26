---
title: "Attio"
---

Sabe en qué punto está cada negociación sin abrir Attio. `attio` da al agente de IA que ya usas, como Claude Code,
Codex o Claude Desktop, una copia de tus negociaciones de Attio en tu ordenador, así que responde desde esa copia,
también sin conexión. Busca personas y empresas en Attio cuando preguntas por ellas.

Pregunta qué negociaciones están atascadas en una etapa, qué se ganó o se perdió esta semana o cómo está hoy tu
embudo. El agente responde con la negociación, su importe, su empresa y su responsable. Necesitas un espacio de
trabajo de Attio y un administrador que pueda crear un token de acceso.

**En esta página:**

1. [Lo que obtienes](#what-you-get)
2. [Lo que un recién llegado no adivinaría](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué attio](#why-attio)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra una guía para tu tarea](#find-a-guide-for-your-task)

## Lo que obtienes

- **La respuesta, no la búsqueda.** Pregunta por una negociación con tus propias palabras. El agente la encuentra con
  su etapa, su importe, su empresa y sus personas, leída de tu ordenador, sin ir haciendo clic por Attio.
- **Tu embudo de un vistazo.** Cuántas negociaciones hay en cada etapa, su suma por moneda, cuántas pasaron a la
  siguiente etapa y tu proporción de ganadas.
- **Qué cambió desde ayer.** Negociaciones creadas, movidas, ganadas y perdidas, como lista o como un resumen
  matutino corto.
- **Personas y empresas cuando las pides.** "¿Quién es Anna en Example LLC?" lee Attio en ese momento, con correos,
  teléfonos y la empresa.
- **Una exportación de negociaciones en una línea.** Cualquier lista de negociaciones, personas o empresas se
  convierte en un archivo CSV para una hoja de cálculo.
- **Tu CRM junto a tus chats.** Una sola búsqueda encuentra una negociación junto a los mensajes, el correo y las
  reuniones sobre ella que las otras herramientas de WireCat guardan en tu ordenador.

## Lo que un recién llegado no adivinaría

- **Un token de acceso es tu llave.** Attio deja entrar a un programa con un token que crea un administrador del
  espacio de trabajo en Workspace settings → Developers. Lee todo el espacio de trabajo, no solo tus propios
  registros. [Instala](./installation.md) muestra dónde hacer clic y qué ámbitos marcar.
- **`work` es un nombre que eliges tú.** Nombra un espacio de trabajo de Attio, y es la primera palabra de cada
  comando. Ningún comando elige un espacio de trabajo por ti.
- **Los comandos de negociaciones leen una copia, los de personas leen Attio.** `sync` copia las negociaciones del
  espacio de trabajo y las personas y empresas que nombran, con las etapas del embudo de negociaciones. `deals`, `pipelines` y
  `changes` responden desde esa copia. `people`, `organizations` y `users` preguntan a Attio cada vez, así que siempre
  muestran los datos más nuevos y necesitan internet.
- **Cada cambio te pregunta antes en una terminal.** `deals create`, `update`, `move`, `close` y `delete`,
  `people create` y `update`, y `activities create` y `close` para notas y tareas, cambian Attio y guardan su
  respuesta. En una terminal cada uno pregunta sí o no antes, y también cada escritura por `api`. Una negociación
  nueva sin `--owner` es tuya. Las empresas van por `attio work api …`, que llega a cada operación de la API de Attio, hasta
  donde lo permiten los ámbitos del token y tus [permisos](./permissions.md).
- **Por MCP, "ask" sigue adelante.** MCP es la forma en que aplicaciones como Claude Desktop llaman a una herramienta,
  y ahí nadie está en una terminal para responder a una pregunta. Bloquea el grupo `api` antes de conectar una
  aplicación así: [MCP](./mcp.md).

## Cómo se ve

```text
You:    Which deals are in Negotiation?
Agent:  (runs attio work deals list stage:Negotiation status:open)
        · "Example LLC renewal", 24 000 USD, owner Anna Example
        · "Sample Inc pilot", 6 500 USD, owner Bob Sample
You:    What did we win this week?
Agent:  (runs attio work changes list change:won "at>=7d")
        One deal: "Example Corp expansion", 12 000 USD, won on Tuesday.
```

*Negociaciones inventadas, salida de ejemplo.*

## Por qué attio

- **Una copia de tus negociaciones en tu ordenador.** Las listas, el tablero del embudo y la búsqueda responden desde
  ella sin ninguna petición a Attio, también sin conexión.
- **Seguro para dárselo a un agente.** Cada cambio en Attio te pregunta antes en una terminal. Cada comando y cada
  operación de la API de Attio tiene su propio permiso: permitir, preguntar, solo lectura o rechazar. Una línea aleja
  toda escritura de un agente.
- **El token se queda en el llavero del sistema.** Nunca aparece en la salida, los errores ni los registros.
- **Respetuoso con Attio.** La mayoría de las respuestas no necesitan ninguna petición, así que el límite de
  peticiones de tu espacio de trabajo queda para tus otras aplicaciones.
- **Listo para cualquier agente.** Una skill para agentes con terminal, un servidor MCP para Claude Desktop y Cursor, y
  un enlace seguro para ChatGPT y Claude en el navegador.
- **Gratis y de código abierto.** Apache 2.0.

## Qué puede hacer

- **Negociaciones:** listarlas por etapa, estado o empresa, mostrar una con sus personas y su empresa, exportar una
  página a CSV. [Úsalo](./usage.md#deals)
- **El embudo:** cada etapa del embudo de negociaciones de Attio con su número y su suma, y la proporción de ganadas
  en el periodo que elijas. [Úsalo](./usage.md#the-pipeline)
- **Qué cambió:** negociaciones creadas, movidas, ganadas y perdidas, y un resumen matutino.
  [Úsalo](./usage.md#what-changed)
- **Personas, empresas y miembros:** buscar en Attio por nombre o correo, mostrar uno, exportar una lista.
  [Úsalo](./usage.md#people-companies-and-members)
- **Tus atributos propios:** los atributos personalizados del espacio de trabajo en negociaciones, personas y
  empresas, con sus valores. [Úsalo](./usage.md#your-own-attributes)
- **Búsqueda en todas tus herramientas:** negociaciones junto a mensajes, notas, eventos y reuniones de otras
  herramientas de WireCat. [Úsalo](./usage.md#search-everything)
- **Cualquier operación de la API de Attio** desde una terminal, con las mismas comprobaciones de permisos.
  [Úsalo](./usage.md#the-attio-api)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` pone tus negociaciones, y las personas y empresas que aparecen en ellas, en el
  almacén local de WireCat, el único archivo de tu ordenador que comparten todas las herramientas de WireCat. Las
  listas, el embudo y la búsqueda lo leen, también sin conexión.
- **Inicio de sesión con un token de acceso.** Se guarda en el llavero del sistema, o en un archivo privado en un
  ordenador sin llavero.
- **Hecho para scripts y agentes.** `--json` da una respuesta en JSON, y un error llega con un código para decidir qué
  hacer. [MCP](./mcp.md)
- **Qué se guarda y qué va por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

En WireCat Desktop, instala Attio en la página **Herramientas** e inicia sesión en **Gestionar**, como
muestra [la instalación](./installation.md#in-wirecat-desktop). O pega esto en tu
agente:

```text prompt
Instala attio con npm install -g @wirecat/attio-cli. Ayúdame a crear un token de acceso de Attio y a ejecutar attio work session start para conectar mi espacio de trabajo, y luego sincroniza y muéstrame mis negociaciones abiertas.
```

O en una terminal:

```sh
npm install -g @wirecat/attio-cli
attio skill install          # teaches Claude Code, Codex and Gemini CLI to use attio
attio work session start     # paste the Attio access token when it asks
attio work sync              # copy your deals and their people and companies
attio work deals list status:open
```

Necesitas Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. [Instala](./installation.md) muestra cómo
crear el token.

## Límites

- Las empresas se leen, no se escriben: una empresa de Attio no tiene atributo de correo ni de teléfono que escribir.
  Cambia una por `api`.
- Las notas, las tareas y las reuniones se listan y se muestran en una negociación cuando activas el ajuste
  `activities`. Una llamada grabada se guarda hasta sus primeros 20.000 caracteres. Las listas y los objetos personalizados todavía no tienen comandos propios. `attio work api` llega a ellos.
- Las personas, las empresas y los miembros del espacio de trabajo se leen de Attio cada vez, así que necesitan
  internet.
- Attio no puede listar solo lo que cambió desde un momento dado, así que cada sincronización vuelve a listar todas
  las negociaciones. Un espacio de trabajo grande tarda más en sincronizarse.
- Solo un administrador del espacio de trabajo puede crear el token, y el token lee todo el espacio de trabajo.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar un espacio de trabajo | [Instala](./installation.md) |
| Leer negociaciones, el embudo, qué cambió | [Úsalo](./usage.md) |
| Conectar una aplicación que usa MCP | [MCP](./mcp.md) |
| Decidir qué puede cambiar un agente | [Permisos](./permissions.md) |
| Un comando o una opción exactos | [Comandos](./commands.md) |
| Cambiar un ajuste | [Ajustes](./configuration.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| Qué se guarda y qué se envía | [Seguridad](./security.md) |
| Qué viene después | [Próximas mejoras](./roadmap.md) |
