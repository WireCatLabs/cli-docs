---
title: "amo"
---

Sabe en qué punto está cada negociación y qué cambió durante la noche, sin abrir amoCRM ni Kommo. `amo` da al agente
de IA que ya usas, como Claude Code o Codex, una copia de tus negociaciones en tu ordenador, así que responde desde esa
copia, también sin conexión. También mueve y cierra negociaciones por ti, hasta donde lo permitas.

Pregunta qué negociaciones están atascadas en "Quote sent", qué cambió en el CRM desde ayer o cómo fue el embudo Sales
en los últimos 30 días. El agente responde con la negociación, su importe y su responsable. amoCRM y Kommo no tienen
un servidor MCP propio para estos datos. Necesitas una integración privada en la cuenta, que un administrador crea una
vez.

**En esta página:**

1. [Lo que obtienes](#what-you-get)
2. [Lo que un recién llegado no adivinaría](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué amo](#why-amo)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra una guía para tu tarea](#find-a-guide-for-your-task)

## Lo que obtienes

- **La respuesta, no la búsqueda.** Pregunta por una negociación o un cliente con tus propias palabras. El agente
  encuentra la negociación con su importe y su responsable, leída de tu ordenador, sin ir haciendo clic por el CRM.
- **El embudo de un vistazo.** Cuántas negociaciones hay en cada etapa y su suma, cuántas llegaron a ella y siguieron
  adelante, y la proporción de ganadas en un periodo.
- **Mañanas que empiezan con lo que cambió.** Las negociaciones nuevas, ganadas, perdidas y movidas de ayer llegan
  como un resumen corto a la hora que elijas, como un aviso en tu escritorio, o en tu Telegram o tu buzón de correo a
  través de `tg` o `mail` de WireCat.
- **Cambios con solo pedirlos.** Basta con "Mueve Example kitchen a Negotiation". El agente encuentra la etapa por su
  nombre, y puedes comprobar qué permisos necesita un cambio antes de hacerlo.
- **Tu CRM junto a tus chats.** Una sola búsqueda encuentra una negociación junto a los mensajes, el correo y las
  reuniones sobre ella que las otras herramientas de WireCat guardan en tu ordenador.

## Lo que un recién llegado no adivinaría

- **amoCRM no tiene prospectos aparte de las negociaciones.** Lo que su API llama lead es una negociación, así que
  `amo` tiene `deals` y no `leads`.
- **La clave es un token de una integración privada.** Un administrador de la cuenta crea la integración una vez y
  genera su token de larga duración, que actúa con los permisos de ese administrador. En una cuenta de amoCRM que no
  está marcada como técnica, amoCRM pide primero una renuncia al soporte técnico, que no se puede retirar. Kommo no
  pide ninguna. [Instala y conecta](./installation.md#create-the-integration) muestra cada clic.
- **`work` es un nombre que eliges tú.** Nombra una cuenta, y es la primera palabra de cada comando. Ningún comando
  elige una cuenta por ti.
- **La copia tiene tus negociaciones, no el CRM entero.** Una sincronización copia las negociaciones asignadas a ti, o
  a los compañeros que elija un administrador, con sus contactos y empresas. Cualquier otro cliente se lee de la
  cuenta cada vez.
- **Una negociación no se puede borrar.** La API v4 de amoCRM no tiene ninguna llamada para eso. Cierra la negociación
  como perdida.
- **Por MCP, "ask" sigue adelante.** MCP es la forma en que aplicaciones como Claude Desktop llaman a una herramienta,
  y ahí nadie está en una terminal para responder a una pregunta. Pon en solo lectura o en rechazo las escrituras que
  un agente no debe hacer antes de conectarlo.
- **Un cambio de etapa puede poner en marcha la automatización propia de la cuenta**, como un Salesbot que escribe a
  un cliente. Decide quién puede mover una negociación antes de que un agente reciba el perfil.

## Cómo se ve

```text
You:    What changed in the CRM since yesterday?
Agent:  (runs amo work changes list "at>=1d")
        · New deal "Example kitchen", 15 000 EUR, in Quote sent
        · "Example office" won, 8 200 EUR
        · Task "Call back about the quote" added on "Example kitchen"
You:    Move Example kitchen to Negotiation.
Agent:  (runs amo work deals move deal:12 "Negotiation")
        Done. "Example kitchen" (deal 12) is in Negotiation now.
```

## Por qué amo

- **Una copia de tus negociaciones en tu ordenador.** De las herramientas de la
  [comparación](https://wirecat.dev/en/docs/amo/compare), ninguna otra documenta que lea tus negociaciones sin
  internet. La siguiente sincronización solo trae los cambios.
- **Un permiso en cada acción.** Permitir, preguntar, solo lectura o rechazar, para cada comando y cada operación de la
  API de amoCRM. Los mensajes a clientes, los Salesbots y los webhooks, y dar una negociación a un compañero, se
  rechazan hasta que los permitas.
- **Escrituras que puedes comprobar antes.** `--dry-run` no envía nada y muestra qué permisos necesita la escritura.
  Una escritura que perdió su respuesta nunca se vuelve a enviar sola, así que una conexión cortada no crea una
  segunda negociación.
- **Respetuoso con amoCRM.** `amo` se mantiene por debajo del límite de peticiones por segundo de amoCRM, y la mayoría
  de las respuestas no necesitan ninguna petición.
- **El token se queda en el llavero del sistema.** Nunca aparece en la salida, los errores ni los registros.
- **amoCRM y Kommo, tantas cuentas como necesites.** Cada cuenta es un perfil que nombras en el comando.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta encaja mejor cuando un agente debe crear tareas y escribir notas por sí mismo. `amo` solo las escribe
con `api call`, que ejecutas tú después de permitirlo.

## Qué puede hacer

- **Negociaciones:** listarlas por etapa, embudo, responsable o estado, mostrar una con sus contactos y su historial de
  etapas, crear, actualizar, mover, cerrar como ganada o perdida con el motivo, y poner los campos propios de la cuenta
  por su etiqueta. [Úsalo](./usage.md#read-your-deals)
- **El embudo:** cada etapa de un embudo con su número y su suma, cuántas siguieron adelante y la proporción de
  ganadas en un periodo. [Úsalo](./usage.md#read-your-deals)
- **Contactos y empresas:** encontrarlos, leerlos, crearlos y actualizarlos, y exportar una lista a un archivo CSV para
  una hoja de cálculo. Se pueden leer los usuarios de la cuenta. [Úsalo](./usage.md#read-your-deals)
- **Tareas, comentarios y llamadas** de tus negociaciones, una vez que los activas, y una tarea en tu ordenador cada
  vez que una negociación entra en una etapa que nombras. [Úsalo](./usage.md#tasks-and-what-changed)
- **Qué cambió:** negociaciones creadas, movidas, ganadas, perdidas y pasadas a otro responsable, tareas añadidas y
  hechas, y un resumen programado. [Úsalo](./usage.md#tasks-and-what-changed)
- **Cualquier operación de la API v4 de amoCRM**, con las mismas comprobaciones de permisos.
  [Úsalo](./usage.md#call-the-api)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` pone tus negociaciones y sus clientes en el almacén local de WireCat, el único
  archivo de tu ordenador que comparten todas las herramientas de WireCat. Las listas, el embudo y la búsqueda lo
  leen, también sin conexión.
- **Inicio de sesión con un token o con la integración.** Los dos se guardan en el llavero del sistema, o en un archivo
  privado en un ordenador sin llavero. [Instala y conecta](./installation.md)
- **Hecho para scripts y agentes.** `--json` da una respuesta en JSON, y un error llega con un código para decidir qué
  hacer. [MCP](./mcp.md)
- **Qué se guarda y qué va por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en tu agente:

```text prompt
Instala amo con npm install -g @wirecat/amo-cli. Ayúdame a ejecutar amo work setup para conectar mi cuenta de amoCRM, y luego sincroniza y muéstrame mis negociaciones abiertas.
```

O ejecútalo tú:

```sh
npm install -g @wirecat/amo-cli
amo skill install            # teaches Claude Code, Codex and Gemini CLI to use amo
amo work setup               # the account's address and the integration's token, step by step
amo work sync                # copy your deals and their clients
amo work deals list status:open
```

Necesitas Node.js 22.16 o un 22.x posterior, o Node.js 24 o posterior. [Instala y conecta](./installation.md)

## Límites

- Las listas de contactos y empresas solo filtran por responsable o por fecha con el complemento de pago de filtros de
  la API de amoCRM. Una búsqueda por palabras funciona sin él.
- Los contactos, las empresas y los usuarios se leen de la cuenta cada vez, así que necesitan internet.
- Los archivos de negociaciones y contactos todavía no están soportados.
- La API de chats, Drive y la API del agente de IA de amoCRM están en otros hosts, y `amo` no llega a ellos.

## Encuentra una guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar y conectar una cuenta | [Instala y conecta](./installation.md) |
| Leer y cambiar negociaciones, tareas, el resumen | [Úsalo](./usage.md) |
| Conectar una aplicación que usa MCP | [MCP](./mcp.md) |
| Decidir qué puede cambiar un agente | [Permisos](./permissions.md) |
| De quién son las negociaciones que copia una sincronización, y otros ajustes | [Ajustes](./configuration.md) |
| Un comando o una opción exactos | [Comandos](./commands.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| En qué se diferencia amo de otras herramientas de amoCRM | [Comparación](https://wirecat.dev/en/docs/amo/compare) |
