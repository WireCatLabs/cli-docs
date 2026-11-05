---
title: "Correo: empieza aquí"
description: "Conecta tu buzón a un agente: búscalo sin conexión, mira qué espera respuesta, ordénalo con deshacer y prepara respuestas."
---

Esta página explica qué es `mail`, qué obtienes con él, con qué buzones funciona y por dónde empezar.

**En esta página**

- [Qué es mail](#qué-es-mail)
- [Qué obtienes](#qué-obtienes)
- [Proveedores compatibles](#proveedores-compatibles)
- [Funciones](#funciones)
- [Empieza aquí](#empieza-aquí)
- [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué es mail

`mail` es una herramienta de línea de comandos que guarda una copia de tu buzón en tu ordenador. Tu agente de IA, o
tú mismo, puede buscar y trabajar con esa copia, incluso sin conexión a internet. Forma parte de WireCat, el conjunto de
herramientas que dan a tu agente acceso a tus mensajes. Funciona en Windows, macOS y Linux.

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
| Gmail | Contraseña de aplicación (por defecto) u OAuth, con la app de Google de WireCat o la tuya | [Preparar el buzón](/es/docs/mail/providers), [Gmail con tu propia app de Google](/es/docs/mail/oauth-google) |
| Outlook.com, Hotmail, Microsoft 365 | Solo OAuth: inicias sesión en Microsoft desde el navegador | [Conectar Outlook](/es/docs/mail/outlook), [Registrar una app de Microsoft](/es/docs/mail/oauth-microsoft) |
| iCloud, Fastmail | Contraseña de aplicación | [Preparar el buzón](/es/docs/mail/providers) |
| Cualquier otro servidor IMAP | Contraseña de aplicación, si el proveedor la ofrece; `mail` encuentra el servidor a partir de tu dirección, o indicas el host y el puerto | [Cualquier otro proveedor](/es/docs/mail/providers) |
| Yandex | Contraseña de aplicación | [Preparar el buzón](/es/docs/mail/providers) |

Una contraseña de aplicación es una contraseña creada para un solo programa, que puedes revocar. Cada proveedor necesita
IMAP activado y, en la mayoría, una contraseña de aplicación antes: los pasos de cada uno están en
[Preparar el buzón](/es/docs/mail/providers). Gmail por OAuth usa la app de Google de WireCat si no indicas otra. Hacer pública una app de Google compartida para correo es complejo, así que Google puede rechazar el inicio de sesión; si lo hace, usa tu propia app de Google o una contraseña de aplicación.

Un perfil de Gmail también puede añadir un archivo de Google Takeout (un fichero `.mbox`) al correo
guardado; consulta [mira antes de sincronizar y trae un archivo](/es/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive).

## Funciones

- Leer el buzón sin conexión y mantenerlo al día con un temporizador. [Conectar un buzón](/es/docs/mail/usage#connect-a-mailbox)
- Buscar por palabras, remitente, fecha, tamaño y el texto dentro de los adjuntos. [Buscar en tu correo](/es/docs/mail/usage#search-your-mail)
- Ver qué hay de nuevo, a qué correos debes respuesta y cuáles esperan respuesta. [Revisión](/es/docs/mail/usage#review-what-is-new-what-you-owe-what-waits)
- Ver un buzón por remitente antes de copiarlo e incorporar un archivo de Google Takeout. [Mirar antes de sincronizar](/es/docs/mail/usage#look-before-you-sync-and-bring-in-an-archive)
- Fijar reglas: omitir un remitente o lista, guardar solo su sobre o protegerlo de la limpieza. [Ordenar el buzón](/es/docs/mail/usage#organise-the-mailbox)
- Ordenar el buzón en el servidor, con vista previa antes de cambios grandes y deshacer. [Ordenar el buzón](/es/docs/mail/usage#organise-the-mailbox)
- Guardar borradores, enviar, responder y reenviar, también con adjuntos. [Enviar, responder y reenviar](/es/docs/mail/usage#send-reply-and-forward)
- Añadir tus propias etiquetas, exportar el correo y contarlo por día, semana o remitente. [Tus etiquetas](/es/docs/mail/usage#your-own-tags)
- Dejar que un agente programado clasifique el correo nuevo y proponga tareas y datos para que los confirmes, con Memo. [Correo en Memo](/es/docs/memo/mail)

## Empieza aquí

### Conectar desde tu agente

Sigue [la guía de tu agente](/es/docs/agents) y abre la [guía de instalación de Mail](/es/docs/mail/installation).
Tu agente instala la herramienta; tú creas la contraseña de aplicación o apruebas el inicio de sesión en Microsoft.

### Empezar desde la terminal

1. [Instala `mail`](/es/docs/mail/installation) desde npm.
2. [Prepara el buzón](/es/docs/mail/providers): activa IMAP y crea una contraseña de aplicación. Para Outlook o
   Microsoft 365, [conecta Outlook](/es/docs/mail/outlook) en su lugar.
3. Crea un perfil, comprueba el acceso, lee tu correo y búscalo. `personal` es un nombre de perfil que eliges para un buzón.

```sh
mail personal session start --address me@example.com
mail personal account check
mail personal sync
mail personal search messages invoice
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
| Preparar Gmail, iCloud, Fastmail, Yandex u otro servidor | [Preparar el buzón](/es/docs/mail/providers) |
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
