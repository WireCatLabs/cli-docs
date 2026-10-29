---
title: "WireCat: tus mensajes y notas, en tu ordenador, para el agente que ya usas"
description: Qué es WireCat, por qué sus herramientas funcionan en local y qué funciona hoy en Telegram, MAX, WhatsApp, notas, correo, Zoom y Google Drive.
date: 2026-10-27
tags: [ai-agents, cli, release-notes]
cover: ./cover.jpg
coverAlt: "Un raíl modular negro en un escritorio oscuro con seis cartuchos etiquetados tg, max, wa, memo, zm y drive, tg el más gastado, y una séptima ranura vacía junto a una tarjeta que dice + your CLI; detrás, un teléfono, un sobre, un cuaderno y unos auriculares"
author: viacheslav-ptsarev
draft: true
---

Un documento en un chat, la pregunta de un cliente en otro, una promesa que hiciste la semana pasada. Tu
agente de IA puede escribir código, planificar una migración y revisar un pull request, pero no ve nada de
eso. El contexto que necesita vive en tus mensajerías, tu correo, tus notas y las transcripciones de tus
reuniones, y nada de eso está en el repositorio.

WireCat es un conjunto de herramientas de línea de comandos de código abierto que le dan ese contexto a tu
agente. Cada herramienta conecta una fuente, guarda una copia en tu ordenador y responde a tu agente con una
forma en la que puede confiar. Sigues con el agente que ya usas: Claude Code, Codex, Cursor, Gemini CLI,
Hermes, OpenClaw o una aplicación de chat a través de MCP. Este artículo cuenta cómo empezó, qué son las
herramientas, por qué funcionan en local y qué funciona hoy.

## Cómo empezó

Empecé por una sola cosa: la herramienta de línea de comandos para Telegram más cómoda que pudiera hacer, con
toda la cuenta dentro y una búsqueda agradable de usar. Después seguí mejorando esa búsqueda: indexar chats
grandes, encontrar un mensaje aunque sus palabras no sean exactamente las que escribiste y, luego, embeddings
para buscar por significado.

Después quise lo mismo para las demás herramientas que uso y añadí MAX, WhatsApp, correo y notas, Zoom y
Google Drive. Cada herramienta nueva planteaba la misma pregunta: cómo hacer que la siguiente fuera fácil de
añadir, para mí y para cualquiera. Así WireCat se convirtió en una plataforma y no en un conjunto de
herramientas. Lo que necesita cualquier herramienta de línea de comandos vive en
[cli-base](https://github.com/WireCatLabs/cli-base); los mensajes, el almacén local, la búsqueda y MCP, en
[cli-core](https://github.com/WireCatLabs/cli-core); y un conector nuevo empieza desde
[cli-template](https://github.com/WireCatLabs/cli-template).

## Qué es WireCat

Seis herramientas, todas publicadas en npm con licencia Apache 2.0:

| Herramienta | Qué conecta |
| --- | --- |
| [`tg`](/es/docs/tg) | Tu propia cuenta de Telegram y bots de Telegram |
| [`max`](/es/docs/max) | Tu propia cuenta de MAX y bots de MAX a través de la Bot API oficial |
| [`wa`](/es/docs/wa) | Tu propia cuenta de WhatsApp, vinculada como dispositivo, igual que WhatsApp Web |
| [`memo`](/es/docs/memo) | Notas, bóvedas de Obsidian, carpetas de documentos, correo, personas, tareas y recuerdos |
| [`zm`](/es/docs/zm) | Transcripciones, resúmenes y grabaciones de reuniones de Zoom |
| [`drive`](/es/docs/drive) | Las carpetas de Google Drive que elijas importar |

Las herramientas de mensajería trabajan con tu propia cuenta, no con un bot que está en el chat. Tu agente ve
lo que ves tú: todos los chats, el historial y tus contactos. Esa es la idea. Cuando preguntas «¿qué fecha de
entrega acordamos con Atlas?», la respuesta está en un chat privado, y un bot no puede leer chats privados.

WireCat no incluye un agente ni un modelo. La [página de funciones](/es/docs/features) lo dice claramente:
WireCat aporta las herramientas y el acceso, y tu agente interpreta la petición. Puedes cambiar de agente sin
volver a descargar tu archivo ni perder tus notas.

## Por qué en local

Las herramientas funcionan en el ordenador o servidor donde las instalas. Cada una guarda un almacén local:
en `tg`, [un único archivo SQLite](/es/docs/tg/archive) con los chats, mensajes y contactos que ha visto.
`memo`, `tg` y `max` [leen y escriben el mismo archivo](/es/docs/memo), así que una búsqueda puede abarcar un
chat de Telegram, un grupo de MAX, un hilo de correo y la nota que escribiste sobre esa persona.

Esto aporta tres cosas prácticas:

1. **Búsqueda sin red.** La búsqueda, la exportación y las lecturas con `--offline` [responden desde el
   almacén local](/es/docs/tg/archive) sin preguntar a Telegram. La búsqueda por palabras funciona en local
   sin ningún proveedor de IA; la búsqueda por significado necesita [configuración
   adicional](/es/docs/search).
2. **Un historial que sobrevive a la aplicación.** Puedes descargar el historial antiguo de un chat, mantener
   el almacén al día con un proceso en segundo plano, exportar un chat a JSON lines o Markdown y hacer copias
   de seguridad del almacén, cifradas con contraseña si quieres.
3. **Tu agente es sustituible.** Los datos se quedan donde están cuando cambias de agente.

Local no significa privado por arte de magia, y la documentación lo dice. Tu agente recibe los mensajes que
recupera, y si ese agente usa un modelo en línea, el proveedor ve ese contenido. Las herramientas [no cifran
el almacén local](/es/docs/security), así que importan el bloqueo de pantalla, una cuenta de usuario
protegida y el cifrado del disco. La [página de seguridad](/es/docs/security) enumera lo que los controles no
pueden proteger.

## Pensadas primero para agentes

La mayoría de las herramientas de línea de comandos se escriben para personas y después se adaptan para
agentes. Estas están diseñadas al revés. Según la [descripción de `tg`](/es/docs/tg): cada comando hace una
sola cosa, devuelve siempre la misma forma de respuesta y tiene un código de salida fijo para cada tipo de
fallo. Los scripts y los agentes pueden confiar en ello.

Hay dos formas de conectar un agente ([la guía](/es/docs/agents)):

- **Una skill.** `tg skill install` añade un breve archivo de instrucciones que enseña los comandos a un
  agente de terminal. No tienes que memorizarlos.
- **MCP.** Las aplicaciones que no pueden ejecutar comandos, como Claude Desktop, se conectan a través del
  [servidor MCP](/es/docs/mcp). Usa los mismos perfiles y permisos que la línea de comandos.

El tamaño de la salida importa cuando un agente paga por cada token que lee. Lo medimos con 5000 mensajes
sintéticos: pedir solo los campos que necesitas con `--json=<fields>` hizo las respuestas [entre un 31 % y un
64 % más pequeñas](/es/docs/search-efficiently) que el `--json` completo. La [configuración y el
script](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/output-size) son públicos.

## Tú decides qué puede hacer el agente

Cada perfil tiene [permisos](/es/docs/permissions) por acción: `deny`, `readonly`, `ask` (confirmar en la
terminal) o `allow`. También puedes limitar los destinatarios y fijar un límite de envíos por hora. Algunos
valores por defecto que conviene conocer:

- Leer un chat no lo marca como leído. Es una acción aparte.
- Un agente iniciado por una programación de `tg` o `max` funciona en solo lectura a través de esa
  herramienta. Puede leer y redactar borradores, pero no enviar ni cambiar la configuración.
- Enviar un archivo local rechaza las ubicaciones conocidas de credenciales, como las claves SSH y de la
  nube, salvo que añadas `--allow-any-file`.

La inyección de instrucciones es un riesgo real aquí: un mensaje de otra persona puede contener
instrucciones. Las herramientas marcan el contenido de los mensajes como datos, pero la [página de
seguridad](/es/docs/security) reconoce que eso no garantiza que un agente ignore toda petición engañosa.
Mantén los permisos de envío acotados y revisa las respuestas importantes.

## Qué funciona hoy

**Telegram.** Instala, inicia sesión y obtén la skill para el agente en unos cinco minutos:

```sh
npm install -g @wirecat/tg-cli
tg personal setup
tg personal inbox
```

`inbox` muestra los mensajes no leídos de otras personas en todos los chats, y no marca nada como leído. A
partir de ahí, [la documentación](/es/docs/tg/usage) cubre la búsqueda por palabras, personas, fechas,
archivos o tema; un almacén local que puedes exportar; respuestas dentro de tus límites; notas de voz a texto
con un [modelo en tu propio ordenador](/es/docs/tg/usage) (`messages transcribe --local`); y envíos
programados con `--at-time 2h`, que Telegram entrega aunque tu ordenador esté apagado. Para bots,
`tg <bot> bot api` expone [los 185 métodos](/es/docs/tg/bot) del esquema fijado de la Telegram Bot API. Si
administras grupos, `tg` muestra [qué preguntas nadie respondió](/es/docs/tg/groups) y quién se unió.

**MAX.** La misma forma para MAX: cuenta personal, búsqueda, almacén local, grupos y bots a través de la Bot
API oficial. Una nota honesta de [su documentación](/es/docs/max): la parte de la cuenta personal usa la API
interna no oficial de MAX, que puede cambiar sin aviso. Los bots usan la API oficial.

**WhatsApp.** [`wa`](/es/docs/wa) vincula tu cuenta como dispositivo. Lee, busca y guarda un almacén local,
envía, guarda y reenvía fotos y archivos, y convierte las notas de voz en texto.

**Notas, correo, personas.** [Memo](/es/docs/memo) importa carpetas de notas, incluidas bóvedas de Obsidian,
y el correo de las cuentas que configures. Mantiene junto todo lo que tiene que ver con una persona:
mensajes, correo y notas. También registra lo que debes a otros y guarda los recuerdos que tu agente
aprendió, y tú decides qué se queda.

**Reuniones.** [`zm`](/es/docs/zm) guarda en local las transcripciones y resúmenes de Zoom y permite a tu
agente encontrar una decisión con su fragmento original. No se une a llamadas ni crea transcripciones que
Zoom no hizo.

**Documentos.** [Drive](/es/docs/drive) importa las carpetas de Google Drive que elijas y las busca sin
conexión, devolviendo el fragmento y el enlace original de Google.

Una primera petición, de la [página de inicio](/es/docs):

```text
Use tg CLI: encuentra la fecha de entrega que acordamos en el chat de Atlas la semana pasada.
Muestra el mensaje que lo confirma y el contexto de alrededor. Dime si ese periodo falta en el historial.
```

La última línea importa. Una búsqueda vacía no demuestra que algo nunca se hablara, y una buena respuesta
dice qué parte del historial revisó.

## Lo que aún no está

Los calendarios, Notion, Slack, Google Meet, Microsoft Teams, GitHub y los gestores de tareas están en la
[hoja de ruta](/es/docs/roadmap). No hay fechas prometidas, y algo planificado no es una función.

## Pruébalo y cuéntanos

Empieza con una fuente; no necesitas todas las herramientas. La [guía de instalación](/es/docs/installation)
cubre Windows, macOS y Linux con Node 22.16+ o 24+, o Bun.

¿Qué debería venir después? Propón una fuente o una función en el [chat de WireCat en
Telegram](https://t.me/wirecatdev). Los errores y los pull requests van al
[repositorio de GitHub](https://github.com/WireCatLabs) de cada herramienta.
