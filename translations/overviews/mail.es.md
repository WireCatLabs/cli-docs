---
title: "Correo: empieza aquí"
description: "Conecta tu buzón a un agente: búscalo sin conexión, mira qué espera respuesta, ordénalo con deshacer y prepara respuestas."
---

`mail` es una herramienta de línea de comandos que copia tu buzón a un almacén local en tu ordenador. Después, tu agente
de IA puede buscar en tu correo, leer hilos y adjuntos y decirte qué espera respuesta, incluso sin conexión a internet.
También puede ordenar el buzón en el servidor y redactar respuestas para que las revises. Tú mismo puedes usarla con
comandos en la terminal.

**En esta página**

- [Qué obtienes](#qué-obtienes)
- [Proveedores compatibles](#proveedores-compatibles)
- [Qué puedes hacer](#qué-puedes-hacer)
- [Empieza aquí](#empieza-aquí)
- [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Correo que tu agente puede usar.** Pídele la factura de la primavera pasada, el hilo donde se acordó un precio o lo
  que dice un PDF adjunto. El agente busca en la copia local y te muestra el correo que encontró.
- **Una lista corta de lo que te espera.** Pregunta qué hilos tienen correo nuevo, a qué correos debes respuesta y
  cuáles esperan respuesta de otra persona.
- **Menos boletines y alertas.** Eliges qué remitentes, listas o tipos de correo omitir o guardar solo como un breve
  registro, y puedes ver un buzón por remitente antes de copiarlo.
- **Un buzón más ordenado, con deshacer.** Los movimientos, las marcas y el borrado se hacen primero en el servidor de
  correo. El correo borrado va a la papelera y cada cambio se puede deshacer.
- **Borradores y respuestas que apruebas tú.** Tu agente puede guardar un borrador en tu carpeta Borradores. Un correo
  a cualquiera que no seas tú te pregunta antes; un agente por MCP solo puede escribirte a ti, salvo que permitas más.
- **Un solo lugar para todos tus mensajes.** El mismo almacén guarda tu historial de Telegram, MAX y WhatsApp, así que
  [Memo](/es/docs/memo/mail) puede buscar en el correo junto con tus chats y notas.

Tu contraseña de aplicación se queda en el llavero de tu ordenador. `mail` lee el correo solo del servidor IMAP de tu
proveedor y lo envía solo por su servidor SMTP, ambos cifrados. Consulta [acceso y seguridad](/es/docs/mail/security).

## Proveedores compatibles

`mail` lee el correo por IMAP y lo envía por SMTP. Son protocolos de correo estándar que ofrecen la mayoría de los proveedores.

| Proveedor | Cómo inicias sesión | Guía |
|---|---|---|
| Gmail | Contraseña de aplicación (por defecto) u OAuth con una app de Google que creas tú | [Preparar el buzón](/es/docs/mail/providers), [Gmail con tu propia app de Google](/es/docs/mail/oauth-google) |
| Outlook.com, Hotmail, Microsoft 365 | Solo OAuth: inicias sesión en Microsoft desde el navegador | [Conectar Outlook](/es/docs/mail/outlook), [Registrar una app de Microsoft](/es/docs/mail/oauth-microsoft) |
| Yandex | Contraseña de aplicación | [Preparar el buzón](/es/docs/mail/providers) |
| iCloud, Mail.ru, Fastmail | Contraseña de aplicación | [Preparar el buzón](/es/docs/mail/providers) |
| Cualquier otro servidor IMAP | Contraseña de aplicación, si el proveedor la ofrece; `mail` encuentra el servidor a partir de tu dirección, o indicas el host y el puerto | [Cualquier otro proveedor](/es/docs/mail/providers) |

Una contraseña de aplicación es una contraseña creada para un solo programa, que puedes revocar. Cada proveedor necesita
IMAP activado y, en la mayoría, una contraseña de aplicación antes: los pasos de cada uno están en
[Preparar el buzón](/es/docs/mail/providers). Gmail por OAuth necesita una app de Google propia; desde mail 0.15 `mail` usa la app de WireCat si no indicas otra, pero Google aún no la ha revisado y puede rechazar el inicio de sesión.

Desde mail 0.15, un perfil de Gmail también puede añadir un archivo de Google Takeout (un fichero `.mbox`) al correo
guardado; consulta [mira antes de sincronizar y trae un archivo, en GitHub](https://github.com/WireCatLabs/mail-cli/blob/main/docs/usage.md#look-before-you-sync-and-bring-in-an-archive).

## Qué puedes hacer

- **Leer el buzón sin conexión.** `sync` copia el correo nuevo al almacén local, el más reciente primero, y omite lo que
  ya tiene. Un buzón grande se lee por partes: vuelve a ejecutarlo hasta que `status` indique que terminó. Guarda texto y
  cabeceras, y el texto de los adjuntos, no los archivos.
  [Conectar un buzón](/es/docs/mail/usage#connect-a-mailbox)
- **Mantenerlo al día solo.** Pon `sync` en un temporizador, por ejemplo cada cinco minutos; `schedule list` muestra
  cómo fue cada ejecución. [Conectar un buzón](/es/docs/mail/usage#connect-a-mailbox)
- **Buscar.** Por palabras, remitente, lista de correo, asunto, fecha, tamaño, adjuntos y el texto que contienen, con el
  lenguaje de consultas de todas las herramientas de WireCat. La búsqueda también pregunta al servidor de correo por el
  correo aún no sincronizado; `--backend archive` la limita al almacén local.
  [Buscar en tu correo](/es/docs/mail/usage#search-your-mail)
- **Revisar.** Qué hay de nuevo desde la última vez, a qué correos debes respuesta y cuáles esperan una.
  [Revisión](/es/docs/mail/usage#review-what-is-new-what-you-owe-what-waits)
- **Mirar antes de sincronizar** (mail 0.15). `account inspect` agrupa el buzón por remitente y lista, con tamaño,
  proporción de no leídos y una puntuación de spam o estafa, y no guarda nada.
  [Mirar antes de sincronizar, en GitHub](https://github.com/WireCatLabs/mail-cli/blob/main/docs/usage.md#look-before-you-sync-and-bring-in-an-archive)
- **Reglas.** Omitir un remitente o una lista, guardar solo el sobre (remitente, fecha y tamaño), guardarlo entero o
  protegerlo de cualquier limpieza. [Ordenar el buzón](/es/docs/mail/usage#organise-the-mailbox)
- **Ordenar en el servidor.** Marcar como leído, destacar, mover, copiar y crear o renombrar carpetas. En Gmail las
  carpetas son etiquetas. [Ordenar el buzón](/es/docs/mail/usage#organise-the-mailbox)
- **Limpiar y deshacer.** Un borrado, o un cambio de más de 20 mensajes, es una vista previa hasta que lo confirmes. Lo
  borrado va a la papelera y `messages restore` devuelve lo que cambió una ejecución.
  [Ordenar el buzón](/es/docs/mail/usage#organise-the-mailbox)
- **Adjuntos.** Su texto se puede buscar; `attachments list` y `attachments download` guardan los archivos.
  [Enviar, responder y reenviar](/es/docs/mail/usage#send-reply-and-forward)
- **Borradores, envío, respuesta y reenvío.** [Borradores](/es/docs/mail/usage#drafts) ·
  [Enviar, responder y reenviar](/es/docs/mail/usage#send-reply-and-forward)
- **Etiquetas, exportación y recuentos.** Tus etiquetas se quedan en tu ordenador. `messages export` escribe archivos mbox
  o Maildir; `stats messages top` clasifica remitentes, listas y dominios. [Tus etiquetas](/es/docs/mail/usage#your-own-tags) · [Exportar correo](/es/docs/mail/usage#export-mail)
- **Dejar que un agente clasifique el correo nuevo.** Con [Memo](/es/docs/memo/mail), un agente `mail-triage`
  programado lee el correo nuevo y propone tareas, datos y cambios para que los confirmes. Solo propone: no envía
  correo ni cambia tu buzón.

## Empieza aquí

### Conectar desde tu agente

Sigue [la guía de tu agente](/es/docs/agents) y abre la [guía de instalación de Mail](/es/docs/mail/installation).
Tu agente instala la herramienta; tú creas la contraseña de aplicación o apruebas el inicio de sesión en Microsoft.

### Empezar desde la terminal

1. [Instala `mail`](/es/docs/mail/installation) desde npm.
2. [Prepara el buzón](/es/docs/mail/providers): activa IMAP y crea una contraseña de aplicación. Para Outlook o
   Microsoft 365, [conecta Outlook](/es/docs/mail/outlook) en su lugar.
3. Crea un perfil, comprueba el acceso, lee tu correo y búscalo. `ya` es un nombre de perfil que eliges para un buzón.

```sh
mail ya session start --address me@example.com
mail ya account check
mail ya sync
mail ya search messages invoice
```

`session start` encuentra el servidor de correo, pide la contraseña de aplicación y la guarda en el llavero del sistema.
`sync` lee por defecto los últimos 30 días; añade `--since-time 2026-01-01` para ir más atrás.

4. Opcional: instala las instrucciones de la herramienta para tu agente.

```sh
mail skill install
```

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Conectar un buzón y leer correo | [Uso diario](/es/docs/mail/usage) |
| Preparar Gmail, Yandex, iCloud, Mail.ru, Fastmail u otro servidor | [Preparar el buzón](/es/docs/mail/providers) |
| Conectar Outlook.com o Microsoft 365 | [Conectar Outlook](/es/docs/mail/outlook) |
| Usar Gmail sin contraseña de aplicación | [Gmail con tu propia app de Google](/es/docs/mail/oauth-google) |
| Buscar correo con tu agente, vincular remitentes con personas y detectar estafas | [Correo en Memo](/es/docs/mail/email) |
| Que un agente clasifique el correo nuevo | [Correo en Memo](/es/docs/memo/mail) |
| Consultar un comando u opción | [Referencia de comandos](/es/docs/mail/commands) |
| Cambiar un ajuste o un permiso | [Ajustes](/es/docs/mail/configuration) |
| Resolver un error | [Solución de problemas](/es/docs/mail/troubleshooting) |
| Ver qué guarda, envía y nunca envía `mail` | [Acceso y seguridad](/es/docs/mail/security), [privacidad](/es/privacy) |
| Comparar `mail` con otras herramientas de correo | [Comparación](/es/docs/mail/compare) |
| Ver qué está planeado | [Hoja de ruta](/es/docs/mail/roadmap) |

`mail` sigue los mismos estándares que las demás herramientas de WireCat, con un almacén y un lenguaje de consultas
comunes: consulta los [estándares de las CLI de WireCat](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md).
