---
title: "Comparado con otras herramientas"
---

<a id="what-each-tool-does" />
<a id="setup-licence-and-price" />
<a id="where-another-tool-fits-better" />
<a id="compared-with-an-agent-driving-whatsapp-web" />
<a id="where-the-marks-come-from" />

Varias herramientas abiertas conectan una cuenta personal de WhatsApp a un terminal o a un agente de IA, y Meta tiene
una API oficial para números de empresa. Esta página pone `wa` junto a cinco de ellas, según las tareas que hace la
gente: ponerse al día, responder, enviar archivos, encontrar cosas, cuidar de los grupos y dejar la cuenta a un agente.
Úsala para elegir la herramienta que encaja con tu trabajo.

Cada marca se revisó el 24 de octubre de 2026. Nuestras marcas salen de la rama `main` de `wa` y de ejecutar una
compilación suya. Algunos comandos no se probaron en una cuenta real, y [usar wa](./usage.md#not-in-wa-yet) enumera
lo que `wa` no hace. La marca de otra herramienta sale de su propia documentación o código, enlazados
[debajo de la tabla](#where-the-marks-come-from). Una herramienta puede hacer más de lo que dice su documentación.

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

Las herramientas:

- **wa**: esta herramienta. Una línea de comandos y un servidor MCP para tu propia cuenta de WhatsApp, con una copia
  local de tus chats en la que puedes buscar.
- **[wacli](https://github.com/openclaw/wacli)**: una línea de comandos con una copia local de tus chats, búsqueda y
  sincronización en segundo plano. No tiene servidor MCP.
- **[whatsapp-mcp](https://github.com/verygoodplugins/whatsapp-mcp)**: un servidor MCP de WhatsApp con una copia local
  de tus chats, mantenido por Very Good Plugins. Es un fork de
  [lharries/whatsapp-mcp](https://github.com/lharries/whatsapp-mcp). Su último cambio fue el 20 de octubre de 2026.
- **[mudslide](https://github.com/robvanderleek/mudslide)**: una línea de comandos que envía mensajes desde scripts.
  Su README dice que sirve solo para enviar.
- **[WhatsApp Channel](https://github.com/Rich627/whatsapp-claude-plugin)**: un plugin para Claude Code que deja al
  agente responder chats desde tu cuenta. También funciona como un servidor MCP normal.
- **[WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/overview)**: la API oficial de Meta.
  Funciona con números de teléfono de empresa, no con una cuenta personal.

## Qué hace cada herramienta

| Tarea | wa | wacli | whatsapp-mcp (fork) | mudslide | WhatsApp Channel | Cloud API |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| | **Ponerse al día** | | | | | |
| Ver los mensajes sin leer de otras personas sin avisar a nadie de que los leíste | ✅ | 🟡¹ | ✅³⁰ | ❌ | 🟡² | ➖ |
| Listar los chats donde alguien espera tu respuesta | ✅ | ➖ | ➖ | ❌ | ✅ | ➖ |
| | **Responder y enviar** | | | | | |
| Responder a un mensaje concreto | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ |
| Editar o borrar un mensaje que enviaste | ✅ | ✅ | ➖ | ➖ | 🟡³ | ➖ |
| | **Archivos y multimedia** | | | | | |
| Enviar una foto, un archivo o una nota de voz | ✅ | ✅ | ✅ | 🟡⁴ | ✅ | ✅ |
| Enviar una foto y un vídeo como un solo álbum | 🟡⁵ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Guardar una foto o un archivo que alguien te envió | ✅ | ✅ | ✅ | ❌ | 🟡⁶ | ➖ |
| Pasar una nota de voz a texto en tu ordenador | ✅ | ➖ | ✅³¹ | ❌ | ✅⁷ | ➖ |
| | **Encontrar** | | | | | |
| Encontrar un chat o una persona por su nombre | ✅ | ✅ | ✅ | 🟡⁸ | 🟡⁸ | ➖ |
| Encontrar un mensaje por palabras, persona o fecha, sin internet | ✅ | ✅ | ✅ | ❌ | ➖ | ❌⁹ |
| Encontrar un archivo que alguien envió, en cualquier chat, incluido el texto que contiene | ✅¹⁰ | 🟡¹¹ | ➖ | ❌ | ➖ | ➖ |
| | **Grupos y personas** | | | | | |
| Añadir o quitar miembros, nombrar administradores, gestionar enlaces de invitación y solicitudes para unirse | ✅ | ✅ | ➖ | 🟡¹² | ➖ | ➖ |
| Ver quién está activo en un grupo y qué preguntas no respondió nadie | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Guardar notas y etiquetas sobre una persona o un chat | ✅ | 🟡¹³ | ➖ | ➖ | ➖ | ➖ |
| | **Agentes y seguridad** | | | | | |
| Cada comando de la herramienta está disponible por MCP | ✅ | ❌¹⁴ | 🟡¹⁵ | ❌ | 🟡¹⁵ | 🟡¹⁶ |
| Un agente lee pero no puede escribir hasta que permites cada tipo de acción | ✅ | 🟡¹⁷ | ➖ | ➖ | ➖ | ➖ |
| Limitar los envíos a una lista de chats que elegiste | ✅ | ➖ | ➖ | ➖ | ✅¹⁸ | ➖ |
| Dejar de enviar tras un número de mensajes en una hora | ✅ | 🟡¹⁹ | ➖ | ➖ | ➖ | ➖ |
| Guardar un registro de cada envío y no repetir nunca uno que pudo haber llegado | ✅ | 🟡²⁰ | ➖ | ➖ | 🟡²¹ | ➖ |
| Al leer apareces desconectado y no se envía confirmación de lectura | ✅ | 🟡²² | 🟡³² | ➖ | 🟡²³ | n/a |
| Retener todos los envíos cuando WhatsApp pide a la cuenta que vaya más despacio | ✅ | ➖ | ➖ | ➖ | ➖ | n/a |
| Trabajar con varias cuentas y no elegir nunca una por ti | ✅ | 🟡²⁴ | ➖ | ➖ | 🟡²⁵ | ✅²⁶ |
| | **Configuración** | | | | | |
| Vincular escaneando un código QR en «Dispositivos vinculados» del teléfono | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| MCP por stdio, y por HTTP para ChatGPT o Claude en el navegador | ✅ | ❌¹⁴ | ✅³³ | ❌ | 🟡²⁷ | 🟡¹⁶ |
| Instalar con un solo comando, en macOS, Linux y Windows | ✅ | ✅ | ❌²⁸ | ✅ | 🟡²⁹ | n/a |

¹ `chats list --unread` los lista. Marcar un chat como leído es un comando aparte.
² `catch_up` cuenta los mensajes en espera de cada chat. `mark_read` es una herramienta aparte.
³ Puede editar un mensaje. No tiene herramienta para borrar.
⁴ Fotos y archivos, y con `--type` el audio y el vídeo se reproducen en el chat. El README no dice que envíe notas de
voz.
⁵ Una foto y un vídeo van como un solo álbum. Más que eso aún no está hecho.
⁶ La herramienta guarda en memoria solo los últimos 500 mensajes (`WHATSAPP_MAX_STORE`), así que un archivo más
antiguo puede no descargarse.
⁷ Con un modelo en tu ordenador, o con Groq u OpenAI si configuras una clave.
⁸ Lista grupos, no todos los chats. WhatsApp Channel lista solo los grupos que permitiste.
⁹ La API envía los mensajes a tu servidor a medida que llegan. No te da un historial guardado en el que buscar.
¹⁰ Ejecuta antes `attachments extract`. Después la búsqueda encuentra el texto en PDF, Word, hojas de cálculo y otros
archivos.
¹¹ `messages search --has-media --type document` encuentra mensajes con un archivo. No lee dentro del archivo.
¹² Añade y quita miembros. No enumera comandos para administradores, enlaces ni solicitudes para unirse.
¹³ Tiene alias y etiquetas para contactos. No tiene notas.
¹⁴ Su documentación dice que no tiene servidor MCP y muestra cómo envolver sus comandos en uno propio.
¹⁵ whatsapp-mcp tiene 17 herramientas y WhatsApp Channel una docena más o menos: lectura, envío, archivos. Cubren menos
que el conjunto completo de comandos.
¹⁶ El servidor MCP de WhatsApp Business Tools lo aloja Meta. Configura cuentas, gestiona plantillas y webhooks, y envía
mensajes.
¹⁷ `--read-only` bloquea todas las escrituras a la vez. No puede permitir un tipo y rechazar otro.
¹⁸ `reply` rechaza un chat que no está en la lista de permitidos.
¹⁹ `--send-spacing` espacia los envíos. No tiene un límite por hora.
²⁰ En algunos fallos reintenta una vez tras reconectar. Su diario de mensajes enumera cambios, no envíos.
²¹ Guarda el id y la hora de sus propios envíos durante 24 horas, así que un mensaje que WhatsApp entrega de nuevo no
se envía dos veces.
²² `--presence-mode quiet` para `sync`.
²³ Las confirmaciones de lectura están desactivadas salvo que configures `WHATSAPP_READ_RECEIPTS=1`. No se describe el
resto del comportamiento de presencia.
²⁴ Cuentas con nombre. Si `default_account` está configurado, los comandos lo usan cuando no nombras ninguna.
²⁵ Carpetas de estado separadas para números distintos, un número por servidor.
²⁶ Cada petición nombra el número de empresa que usa.
²⁷ Solo stdio.
²⁸ Necesita Go, Python y `uv`, y en Windows MSYS2 con CGO activado.
²⁹ Necesita Bun y los comandos de plugins de Claude Code.
³⁰ `list_chats` devuelve una marca `unread` por chat, y el README dice que leer o buscar mensajes nunca envía una
confirmación de lectura. `mark_messages_read` es una herramienta aparte.
³¹ `transcribe_audio` ejecuta whisper.cpp en tu ordenador, o envía el audio a una dirección que configuras.
³² Leer y buscar nunca envían confirmaciones de lectura. El README no dice si apareces desconectado.
³³ stdio por defecto, y `http` o `sse` con `WHATSAPP_MCP_TRANSPORT`. El README no nombra ChatGPT ni clientes de
navegador.

## Instalación, licencia y precio

| | Instalación | Licencia | Precio |
|---|---|---|---|
| wa | `npm install -g @wirecat/whatsapp-cli` | Apache-2.0 (la CLI), GPL-3.0-only (el motor) | gratis |
| wacli | `brew install openclaw/tap/wacli`, o un archivo de versión | MIT | gratis |
| whatsapp-mcp | clonar y después ejecutar el puente en Go y el servidor en Python | MIT | gratis |
| mudslide | `npm install -g mudslide`, o `npx mudslide` | ISC | gratis |
| WhatsApp Channel | `claude plugin install` | Apache-2.0 | gratis |
| Cloud API | cuenta de desarrollador de Meta y un número de empresa | condiciones oficiales | Meta cobra por mensaje, consulta su [página de precios](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) |

Todas las herramientas salvo la Cloud API se vinculan a tu cuenta igual que WhatsApp Web. Las condiciones de WhatsApp
prohíben los clientes no oficiales y pueden bloquear una cuenta que use uno. Lee los [límites](./limits.md) antes de
dejar que un agente envíe mensajes.

## Cuándo encaja mejor otra herramienta

- **Una empresa que responde a clientes**: la Cloud API. Es oficial, usa un número de empresa y el número no corre
  riesgo de bloqueo. `wa` funciona con tu cuenta personal.
- **Guardar un contacto en la agenda del teléfono**: wacli. Tiene `contacts save`. WhatsApp guarda los cambios de la
  agenda en el teléfono, así que `wa` lee la agenda sincronizada y no la cambia.
- **Mensajes antiguos**: wacli. `history backfill` pide al teléfono los mensajes antiguos de un chat.
  `wa messages sync` hace lo mismo, de 50 en 50, y `wa` es más nuevo, así que ha pasado menos tiempo en cuentas reales
  que wacli.
- **Un script que solo envía**: mudslide. Es pequeño, envía con un solo comando y lo configuras en un minuto.
- **Una sesión de Claude Code que se despierta con cada mensaje entrante**: WhatsApp Channel. Está hecho para eso.
  `wa` nunca responde por su cuenta.

## Comparado con un agente que maneja WhatsApp Web

Un agente de navegador abre WhatsApp Web y hace clic. Necesita un navegador que mantenga la sesión iniciada, lee la
pantalla y no tiene forma de limitar lo que envía. `wa` y las demás herramientas de esta página hablan con WhatsApp
como un dispositivo vinculado, sin navegador, y devuelven datos, no pantallas. No hemos medido la velocidad ni el coste
frente a un agente de navegador, así que esta página no afirma nada sobre ninguno de los dos.

## De dónde salen las marcas

Revisado el 24 de octubre de 2026.

- **wa**: la rama `main` de [whatsapp-cli](https://github.com/WireCatLabs/whatsapp-cli), su lista de comandos
  (`wa commands --json`), el valor por defecto de `sends_per_hour`, 30, que muestra `wa config show`, y las páginas
  de [MCP](./mcp.md), [permisos](./permissions.md), [límites](./limits.md) y [búsqueda](./search.md).
- **wacli**: [README](https://github.com/openclaw/wacli/blob/main/README.md),
  [send](https://github.com/openclaw/wacli/blob/main/docs/send.md),
  [messages](https://github.com/openclaw/wacli/blob/main/docs/messages.md),
  [chats](https://github.com/openclaw/wacli/blob/main/docs/chats.md),
  [groups](https://github.com/openclaw/wacli/blob/main/docs/groups.md),
  [contacts](https://github.com/openclaw/wacli/blob/main/docs/contacts.md),
  [history](https://github.com/openclaw/wacli/blob/main/docs/history.md),
  [sync](https://github.com/openclaw/wacli/blob/main/docs/sync.md),
  [accounts](https://github.com/openclaw/wacli/blob/main/docs/accounts.md) e
  [integrations](https://github.com/openclaw/wacli/blob/main/docs/integrations.md).
- **whatsapp-mcp** (fork de verygoodplugins, commit 2ccf384):
  [README](https://github.com/verygoodplugins/whatsapp-mcp/blob/2ccf384/README.md) y la lista de herramientas en
  [main.py](https://github.com/verygoodplugins/whatsapp-mcp/blob/2ccf384/whatsapp-mcp-server/main.py).
- **mudslide**: [README](https://github.com/robvanderleek/mudslide/blob/main/README.md), incluida la pregunta de su
  FAQ «How can I read messages?».
- **WhatsApp Channel**: [README](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/README.md),
  [USAGE](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/USAGE.md) y la comprobación de la lista de
  permitidos en [server.ts](https://github.com/Rich627/whatsapp-claude-plugin/blob/main/server.ts)
  (`assertAllowedChat`).
- **Cloud API**: [resumen](https://developers.facebook.com/docs/whatsapp/cloud-api/overview) y la
  [página de MCP](https://developers.facebook.com/documentation/mcp) de Meta.

Si una marca de aquí está mal, avísanos en un
[issue](https://github.com/WireCatLabs/whatsapp-cli/issues).
