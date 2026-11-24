---
title: "Slack: por dónde empezar"
description: "Una CLI de Slack y un servidor MCP de Slack: tu agente de IA lee y busca en tus canales, mensajes directos e hilos de Slack como tú, y envía solo cuando se lo pides."
---

Ponte al día en Slack con una sola respuesta, sin abrir cada canal. `slk` conecta tu propia cuenta de Slack con el
agente de IA que ya usas, como Claude Code, Codex o Cursor. El agente ve los canales, mensajes directos e hilos que
ves tú en Slack, y nada más.

Tu agente te dice qué mensajes directos esperan tu respuesta, qué decidió el equipo en un hilo y dónde compartió Ana
el contrato. Responde con los mensajes que encontró, y envía, edita o reacciona solo cuando tú lo dices.

`slk` es una CLI de Slack para tu terminal y un servidor MCP de Slack para apps como Claude Desktop. Inicia sesión con
una pequeña app de Slack que creas tú en tu propio espacio de trabajo en unos tres minutos. La app es tuya, así que
Slack la deja leer el historial a velocidad completa. Necesitas permiso para instalar apps en el
espacio de trabajo, o un administrador que la apruebe.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que un recién llegado no adivinaría](#lo-que-un-recién-llegado-no-adivinaría)
3. [Cómo se ve](#cómo-se-ve)
4. [Cómo funciona](#cómo-funciona)
5. [Empieza en diez minutos](#empieza-en-diez-minutos)
6. [Lo que todavía no hace](#lo-que-todavía-no-hace)
7. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Todo lo nuevo en una respuesta.** `inbox` muestra los mensajes directos y grupales sin leer, los canales que
  sigues y cualquier otro canal donde alguien te mencionó o escribió @here, @channel o @everyone.
- **Encuentra lo que se dijo.** "¿Dónde compartió Ana el contrato?" da el mensaje y su canal. La búsqueda pregunta
  a la búsqueda de Slack y a la copia en tu ordenador a la vez.
- **Hilos completos.** Tu agente lee un hilo desde el primer mensaje hasta la última respuesta, así que un resumen no
  pierde la decisión del final.
- **Leer no deja rastro.** Nada se marca como leído, y nadie ve que miraste.
- **Tú decides qué puede cambiar el agente.** Cada perfil permite, pregunta o rechaza cada tipo de escritura, y un
  perfil puede ser de solo lectura. Por MCP no hay nadie para responder, así que una escritura configurada como ask se
  ejecuta. Más en [ajustes](./configuration.md#permissions).
- **El resto de la API de Slack.** Cada método de la Slack Web API es un comando propio en el grupo `api`, para lo
  que no cubren los comandos de cada día.

## Lo que un recién llegado no adivinaría

- **La app de Slack la creas tú.** Slack deja a un programa leer mensajes solo a través de una app instalada en el
  espacio de trabajo. Una app que otra empresa publica fuera del Slack Marketplace recibe
  [una lectura de 15 mensajes por minuto](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps).
  Una app que creas en tu propio espacio de trabajo conserva los límites normales. Un enlace rellena todos sus
  ajustes, así que solo haces clic en **Create**, **Install** y **Copy**.
- **`personal` es un nombre que eliges tú** para un espacio de trabajo, y la primera palabra de cada comando. Ningún
  comando elige un espacio de trabajo por ti, ni siquiera el único.
- **Los canales entran en la bandeja solo si tú lo dices.** Slack no da a un canal un contador de no leídos. Por eso
  `inbox` lee cada canal que nombras en `inbox_channels`, o todos con `inbox_all_channels true`. Cualquier otro canal
  aparece solo cuando un mensaje posterior a tu última lectura te menciona o usa @here, @channel o @everyone. La
  bandeja pregunta a tus chats durante 15 segundos como mucho, y su campo `missing` dice a qué chats no llegó y por
  qué.
- **No cuenta las respuestas dentro de hilos, las menciones a grupos ni los canales silenciados.** La bandeja no lee
  respuestas en hilos ni menciones a un grupo como @design. Slack guarda tus canales silenciados en tu configuración
  personal, y el token de una app no puede leerla, así que un canal silenciado que nombras en `inbox_channels` sigue
  contando.
- **La búsqueda de Slack encuentra palabras, no menciones.** La búsqueda propia de Slack no encuentra un mensaje por
  @Ana ni por su id de usuario, solo por las palabras que contiene. Para ver las menciones nuevas, pregunta a `inbox`.
- **Las lecturas siguen el ritmo de Slack.** El historial y los hilos se leen a 50 llamadas por minuto y el resto a
  20 por minuto, los límites de los [niveles de Slack](https://docs.slack.dev/apis/web-api/rate-limits/). La primera
  sincronización de un canal con mucho movimiento tarda minutos.
- **La copia local guarda lo que sincronizas.** `messages sync` guarda un chat en tu ordenador, con las respuestas
  nuevas de hilos de hasta 14 días. Un mensaje que luego se borra en Slack sigue en la copia, porque Slack no avisa
  de que se borró.

## Cómo se ve

```text
Tú:     ¿Qué me perdí en Slack esta mañana?
Agente: (ejecuta slk personal inbox 'date>8h': 2 mensajes directos, 1 canal)
        · Ana Ejemplo preguntó por mensaje directo si el contrato está firmado, 09:12
        · #release: Bruno Muestra escribió @here, el despliegue pasa al jueves
Tú:     Dile a Ana: sí, lo envío hoy.
Agente: Borrador para Ana Ejemplo: "Sí, lo envío hoy." ¿Lo envío?
Tú:     Sí.
```

## Cómo funciona

- **Tu propio token.** La app te da un User OAuth Token, que empieza por `xoxp-`. Con él `slk` actúa como tú, así que
  ve solo las conversaciones en las que estás. El token se guarda en el llavero del sistema, o en un archivo privado
  donde no hay llavero. Más en [seguridad](./security.md).
- **La búsqueda de Slack y una copia en tu ordenador.** Una búsqueda pregunta a Slack y al almacén local juntos. El
  almacén local es un archivo en tu ordenador que comparten todas las herramientas de WireCat, así que `search all` también encuentra tus notas y otros servicios de mensajería.
- **Un perfil para cada espacio de trabajo.** Cada comando que usa una cuenta nombra primero su perfil:
  `slk work chats list`.
- **Los mismos comandos para ti y para tu agente.** Un agente en la terminal usa los comandos con la skill de la
  herramienta. Una app que se conecta a servidores MCP recibe los mismos comandos como herramientas.

## Empieza en diez minutos

Pega esto en un chat con tu agente:

```text prompt
Usa slk CLI. Instálalo con npm install -g @wirecat/slack-cli, ayúdame con slk personal setup y luego muéstrame qué tengo sin leer en Slack.
```

O en una terminal:

```sh
npm install -g @wirecat/slack-cli
slk personal setup
slk personal inbox
```

`setup` muestra los pasos para crear la app y pide el token sin mostrarlo. Necesitas Node.js 22.16 o posterior.
[Instalación](./installation.md) tiene cada paso con los nombres de los botones de Slack.

## Lo que todavía no hace

- La bandeja deja fuera las respuestas dentro de hilos, las menciones a un grupo de usuarios y la marca de canal
  silenciado.
- `chats list` no muestra contadores de no leídos. Pídeselos a `inbox`.
- Solo inicia sesión con el token de tu propia app de Slack, no desde el navegador.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Crear la app de Slack, instalar e iniciar sesión | [Instalación](./installation.md) |
| Ver cómo se forma un comando y conectar un agente | [Uso](./usage.md) |
| Encontrar un comando o una opción | [Comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Arreglar un error | [Cuando algo falla](./troubleshooting.md) |
| Saber qué guarda y envía la herramienta | [Seguridad](./security.md) |
| Compararla con otras herramientas de Slack | [Comparación con otras herramientas](./compare.md) |
