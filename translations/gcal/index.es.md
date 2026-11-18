---
title: "Google Calendar"
---

Ves tu semana en todas las cuentas de Google que usas y vuelves a encontrar un evento pasado por palabras o por su
significado. `gcal` da al agente de IA que ya usas, como Claude Code o Codex, una copia de tus calendarios en tu
ordenador, así que la búsqueda no necesita conexión. Las transcripciones de tus llamadas de Google Meet también se
quedan contigo, después de que Google las borre.

Tu agente responde a "¿Qué tengo esta semana y qué se solapa?", "¿Cuándo puedo reunirme con Ana 30 minutos?" o "¿Qué
decidimos en la última llamada con ella?". `gcal` pide a Google acceso de solo lectura, y cambia tu calendario solo
después de que lo permitas.

**En esta página:**

1. [Qué obtienes](#what-you-get)
2. [Lo que no es obvio al principio](#things-a-newcomer-would-not-guess)
3. [Cómo se ve](#how-it-looks)
4. [Por qué gcal](#why-gcal)
5. [Qué puede hacer](#what-it-can-do)
6. [Cómo funciona](#how-it-works)
7. [Empieza en unos minutos](#start-in-a-few-minutes)
8. [Límites](#limits)
9. [Encuentra la guía para tu tarea](#find-a-guide-for-your-task)

## Qué obtienes

- **Tu semana de un vistazo.** Una sola lista con todas las cuentas de Google que usas, personal y de trabajo, con los
  solapamientos encontrados.
- **Una hora que le va bien a todos.** Pregunta cuándo están libres las personas y recibe los huecos que encajan para
  todas.
- **Reservas sin clics.** Crea, mueve y cancela eventos, con un enlace de Meet cuando lo quieras. Nadie recibe un
  correo salvo que lo permitas.
- **Llamadas a las que puedes volver.** Las llamadas de Meet pasadas con quién se unió y la transcripción, listas para
  buscar y resumir.
- **Preparado para la próxima reunión.** Una sola petición reúne el evento, sus asistentes y tus reuniones pasadas con
  ellos, y tus últimos mensajes con ellos cuando otra herramienta de WireCat como `tg` guarda tus chats.
- **Cualquier evento, encontrado.** "¿Cuándo planeamos la revisión de la hoja de ruta?" lo encuentra por palabras o
  por significado, sin conexión.

## Lo que no es obvio al principio

- **`personal` es un nombre que eliges tú.** Identifica una cuenta de Google, y es la primera palabra de cada comando
  que lee o cambia una cuenta. Añade `work` más adelante. Ningún comando elige una cuenta por ti.
- **En una terminal, borrar pregunta antes. Por MCP no.** MCP es la forma en que aplicaciones como Claude Desktop
  llaman a una herramienta, y nadie está ahí para responder. Antes de conectarla, marca como "solo lectura" o
  "rechazar" lo que un agente no debe hacer.
- **La copia abarca un año atrás y tres meses adelante.** Cada sincronización posterior pide a Google solo lo que
  cambió. La búsqueda propia de Google llega a eventos fuera de ese periodo.
- **Al principio solo se sincronizan los calendarios de los que eres propietario.** `calendars list` muestra el resto,
  y añades los que quieras.
- **Las cuentas personales de Google no tienen transcripciones de Meet**, y Google solo lista las llamadas que
  organizaste tú. Google borra el registro de una llamada 30 días después de que termine, así que sincroniza antes.

## Cómo se ve

```text
You:    When can I meet Ana for 30 minutes this week?
Agent:  (runs gcal personal calendars busy person:ana@example.com --duration-minutes 30)
        Going by both calendars, you are both free on Tuesday 10:00-10:30, Wednesday 14:00-15:00 and
        Thursday 10:00-12:00.
You:    Book Tuesday, 30 minutes, "Example planning", with a Meet link. Do not email her.
Agent:  Draft: "Example planning", Tuesday 10:00-10:30, with ana@example.com, a new Meet link, no email sent.
        Create it?
You:    Yes.
```

## Por qué gcal

- **Una búsqueda que las otras herramientas de calendario no documentan.** De las herramientas de la
  [comparativa](./compare.md), solo `gcal` documenta buscar en tus reuniones sin internet, encontrar una por su tema y
  saber que un asistente es la misma persona a la que escribes en Telegram, WhatsApp o por correo.
- **Solo lectura hasta que tú lo digas.** El primer inicio de sesión solo lee. Escribir eventos y leer Meet necesitan
  cada uno su propio permiso de Google.
- **Una escritura nunca sobrescribe un cambio hecho en Google** desde la última sincronización.
- **Sin servidor de WireCat.** `gcal` solo habla con Google. El código de acceso o el PIN de una reunión nunca se
  guarda ni se muestra.
- **Normalmente sin proyecto de Google Cloud que configurar.** Cada paquete lleva la propia aplicación de Google de
  WireCat.
- **Gratis y de código abierto.** Apache 2.0, en macOS, Linux y Windows.

Otra herramienta te conviene más si quieres una cuadrícula de calendario en la terminal, como una vista semanal
([gcalcli](https://github.com/insanum/gcalcli)), o ayuda en Claude en la web sin nada que instalar (el conector de
Google Calendar de Claude).

## Qué puede hacer

- **Leer:** eventos de todas las cuentas en una sola lista, los solapamientos, qué cambió desde una fecha, y un evento
  con sus asistentes y sus archivos de Drive. [Uso](./usage.md)
- **Buscar un hueco y reservar:** horas libres y ocupadas, crear, mover y cancelar eventos, responder invitaciones,
  añadir un enlace de Meet. [Uso](./usage.md)
- **Buscar:** por palabras, por significado o con la búsqueda propia de Google. [Uso](./usage.md)
- **Google Meet:** quién se unió y la transcripción, enlazadas al evento del calendario. [Uso](./usage.md)
- **Suscripciones y archivos:** sigue un calendario de festivos u otro calendario `.ics`, y exporta eventos a un
  archivo `.ics`. [Uso](./usage.md)
- **Desde cualquier sitio:** ChatGPT o Claude en el navegador o en el móvil, a través de tu propio túnel.
  [Conexión remota](./remote.md)

## Cómo funciona

- **Una copia en tu ordenador.** `sync` guarda tus eventos en el almacén local de WireCat, el único archivo de tu
  ordenador que comparten todas las herramientas de WireCat. Así una sola búsqueda encuentra una reunión junto a tus
  chats y notas.
- **Tu propio inicio de sesión.** `gcal` inicia sesión en Google en el navegador y guarda la sesión en el llavero del
  sistema.
- **Hecho para scripts y agentes.** `--json` da una respuesta JSON para scripts. Una skill enseña a los agentes con
  terminal, y `gcal personal mcp serve` sirve a Claude Desktop, Cursor y otras aplicaciones que usan MCP.
- **Qué se guarda y qué pasa por la red.** [Seguridad](./security.md)

## Empieza en unos minutos

Pega esto en el chat con tu agente:

```text prompt
Instala gcal con npm install -g @wirecat/gcal-cli. Ayúdame a iniciar sesión en solo lectura con gcal personal session start, sincronizar y mostrar qué se solapa esta semana.
```

O en una terminal:

```sh
npm install -g @wirecat/gcal-cli
gcal skill install                  # the agent skill, for Claude Code, Codex and Gemini CLI
gcal personal session start         # sign in to Google in the browser, read-only
gcal personal sync                  # copy your calendars, then only what changed
gcal personal events list           # your events from today on
```

Puede que Google rechace el inicio de sesión a través de la aplicación de WireCat. En ese caso,
[crea tu propia aplicación de Google](./installation.md), que no cuesta nada. Necesitas Node.js 22.16 o una versión
22.x posterior, o Node.js 24 o posterior, o Bun.

## Límites

- `calendars busy` muestra las horas ocupadas de una persona solo cuando su calendario está compartido contigo o con
  tu organización.
- La búsqueda por significado necesita un modelo pequeño que descargas una vez. La búsqueda por palabras funciona sin
  él.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Instalar e iniciar sesión | [Instalación](./installation.md) |
| Leer, buscar y reservar | [Uso](./usage.md) |
| Usarlo desde ChatGPT o Claude en el navegador | [Conexión remota](./remote.md) |
| Decidir qué puede hacer un agente | [Ajustes](./configuration.md) |
| Un comando exacto | [Comandos](./commands.md) |
| Algo no funciona | [Cuando algo falla](./troubleshooting.md) |
| Qué guarda y envía gcal | [Seguridad](./security.md) |
| En qué se diferencia gcal de otras herramientas de calendario | [Comparativa](./compare.md) |
