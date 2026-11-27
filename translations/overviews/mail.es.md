---
title: "Correo: empieza aquí"
description: "Tu agente busca en tu correo sin conexión, te dice qué correos debes responder y prepara borradores que apruebas. Mover y borrar se puede deshacer."
---

Encuentras la factura de la primavera pasada, o el hilo donde se acordó un precio, con solo preguntar. `mail` guarda una
copia de tu buzón en tu ordenador, así que el agente de IA que ya usas, como Claude Code o Codex, busca ahí, incluso
sin internet. Funciona con Gmail, Outlook, iCloud, Fastmail, Yandex y cualquier otro servidor de correo con IMAP.

Tu agente te dice qué correos debes responder, qué dice un PDF adjunto, y archiva por ti los boletines de esta semana.
Mover y borrar se puede deshacer, y un correo a cualquiera que no seas tú espera tu sí.

**En esta página:**

1. [Qué obtienes](#qué-obtienes)
2. [Lo que no es obvio al principio](#lo-que-no-es-obvio-al-principio)
3. [Cómo se ve](#cómo-se-ve)
4. [Por qué mail](#por-qué-mail)
5. [Qué puede hacer](#qué-puede-hacer)
6. [Cómo funciona](#cómo-funciona)
7. [Empieza](#empieza)
8. [Límites](#límites)
9. [Encuentra la guía para tu tarea](#encuentra-la-guía-para-tu-tarea)

## Qué obtienes

- **Correo que tu agente puede usar.** Pide un correo por lo que decía, quién lo envió o qué hay en su adjunto. El
  agente te enseña el correo que encontró.
- **Una lista corta de lo que te necesita.** Qué hilos tienen correo nuevo, qué correos debes responder, cuáles esperan
  a otra persona.
- **Menos boletines y avisos.** Elige qué remitentes, listas o tipos de correo omitir o guardar solo como un registro
  breve. Mira un buzón por remitente antes de copiarlo.
- **Un buzón ordenado, con deshacer.** Mover, marcar y borrar ocurren en el servidor de correo. Lo borrado va a la
  papelera, y un movimiento o un borrado se puede deshacer mientras siga ahí.
- **Borradores y respuestas que apruebas.** Tu agente guarda un borrador en tu propia carpeta de Borradores, así que
  lo ves en cualquier aplicación de correo. Un correo a cualquiera que no seas tú te pregunta antes.
- **Correo junto a tus chats.** El mismo almacén guarda tu historial de Telegram, MAX y WhatsApp, así que
  [Memo](/es/docs/memo/mail) busca en el correo junto con tus chats y notas.

## Lo que no es obvio al principio

- **La mayoría de proveedores pide una contraseña de aplicación.** Es una contraseña para un solo programa, que puedes
  revocar. Outlook y Microsoft 365 usan en su lugar un inicio de sesión en el navegador.
  [Preparar el buzón](./providers.md)
- **La primera sincronización lee los últimos 30 días.** Fija `sync_since` (como `1y`) para ir más atrás, o trae un
  archivo de Google Takeout.
- **`personal` es un nombre que eliges tú** para un buzón. Ningún comando elige un buzón por ti.
- **El texto de un correo lo escribió otra persona.** Tu agente lo trata como datos, nunca como una instrucción.

## Cómo se ve

```text
Tú:     ¿Qué correos de esta semana aún debo responder?
Agente: (ejecuta mail personal review --unanswered 1d y luego mail personal messages show en cada uno)
        · Ana Ejemplo preguntó el martes si la factura puede pasar a diciembre.
        · Bruno Muestra envió el contrato el miércoles y pide comentarios antes del viernes.
Tú:     Prepara una respuesta a Ana: sí, diciembre está bien.
Agente: Guardé un borrador en tu carpeta de Borradores, en el hilo de Ana. No se ha enviado nada.
```

## Por qué mail

- **Un solo almacén con tus chats.** De las herramientas de correo de la [comparativa](./compare.md) (Himalaya, mu,
  gog, Google Workspace MCP, Microsoft 365 MCP), ninguna documenta guardar el correo en un almacén con chats, reuniones
  y notas y buscar en todo a la vez.
- **Deshacer lo que cambió.** Ninguna otra herramienta de la comparativa documenta cómo deshacer lo que cambió en el
  servidor.
- **Un agente por MCP solo te escribe a ti** hasta que permitas más. En una terminal, un borrado o un cambio de
  muchos correos te pregunta antes. Por MCP nadie puede responder, así que se ejecuta: fija
  `permissions.messages.delete deny` (o `readonly`) antes de conectar un agente.
- **Tu contraseña queda en el llavero del sistema.** `mail` solo habla con los servidores de correo de tu proveedor,
  con conexiones cifradas.
- **Gratis y de código abierto.** Apache 2.0.

Otra herramienta te conviene más si tu organización desactiva IMAP (Microsoft 365 MCP), o si solo usas Gmail y quieres
Calendar y Drive en la misma herramienta ([gog](https://github.com/openclaw/gogcli)).

## Qué puede hacer

- **Leer y buscar:** sin conexión, por palabras, remitente, fecha, tamaño y texto de los adjuntos.
  [Buscar en tu correo](./usage.md#search-your-mail)
- **Repasar:** qué hay de nuevo, qué debes, qué espera. [Repaso](./usage.md#review-what-is-new-what-you-owe-what-waits)
- **Ordenar:** reglas de qué guardar, marcas, carpetas, papelera, con deshacer.
  [Ordenar el buzón](./usage.md#organise-the-mailbox)
- **Escribir:** borradores, enviar, responder y reenviar con adjuntos.
  [Enviar, responder y reenviar](./usage.md#send-reply-and-forward)
- **Guardar:** exportar a mbox o Maildir, contar correos por día o remitente, añadir tus propias etiquetas.
  [Tus etiquetas](./usage.md#your-own-tags)
- **Dejar la clasificación a un agente:** con Memo, un agente programado propone tareas y hechos para que los
  confirmes. [Correo en Memo](/es/docs/memo/mail)

| Proveedor | Cómo entras | Guía |
|---|---|---|
| Gmail | Una contraseña de aplicación o un inicio de sesión de Google | [Preparar el buzón](./providers.md) |
| Outlook.com, Hotmail, Microsoft 365 | Un inicio de sesión de Microsoft en el navegador | [Conectar Outlook](./outlook.md) |
| iCloud, Fastmail, Yandex | Una contraseña de aplicación | [Preparar el buzón](./providers.md) |
| Cualquier otro servidor IMAP | Una contraseña de aplicación, si el proveedor la tiene | [Preparar el buzón](./providers.md) |

## Cómo funciona

- **Una copia en tu ordenador.** `sync` lee tu correo al almacén local que comparten las herramientas de WireCat. La
  búsqueda y la lectura responden desde ahí. Un temporizador lo mantiene al día. [Uso diario](./usage.md)
- **Los cambios ocurren en el servidor.** Mover o borrar cambia tu buzón real, así que lo ve cualquier aplicación de
  correo. Cada cambio guarda lo que necesita para deshacerse.
- **Hecho para scripts y agentes.** Una operación por llamada, una respuesta JSON con `--json`, una skill para
  agentes de terminal y un servidor MCP.
- **Qué se guarda y qué se envía.** [Acceso y seguridad](./security.md)

## Empieza

Pega esto en el chat con tu agente:

```text prompt
Usa mail CLI. Instálalo con npm install -g @wirecat/mail-cli, ayúdame a preparar mi buzón, entrar con mail personal session start, sincronizar los últimos 30 días y mostrar qué correos debo responder.
```

O en una terminal. Activa IMAP y crea una contraseña de aplicación primero ([pasos por proveedor](./providers.md)):

```sh
npm install -g @wirecat/mail-cli
mail personal session start          # pide la dirección, encuentra el servidor, pide la contraseña de aplicación
mail personal sync                   # los últimos 30 días
mail personal search messages factura
mail skill install                   # opcional: instrucciones para tu agente
```

Necesitas Node.js 22.16 o posterior en 22.x, o 24 o posterior. [Instalación](./installation.md)

## Límites

- `mail` lee el correo por IMAP. Un buzón al que solo se llega por JMAP o Microsoft Graph necesita otra herramienta.
- Un borrador borrado no vuelve, y Gmail vacía la papelera a los 30 días, así que deshacer solo funciona hasta entonces.

## Encuentra la guía para tu tarea

| Tarea | Guía |
|---|---|
| Conectar un buzón y leer el correo | [Uso diario](./usage.md) |
| Preparar Gmail, iCloud, Fastmail, Yandex u otro servidor | [Preparar el buzón](./providers.md) |
| Conectar Outlook o Microsoft 365 | [Conectar Outlook](./outlook.md) |
| Buscar correo junto con tus chats, detectar estafas | [Correo con Memo](./email.md) |
| Un comando exacto | [Referencia de comandos](./commands.md) |
| Cambiar un ajuste o un permiso | [Ajustes](./configuration.md) |
| Algo no funciona | [Solución de problemas](./troubleshooting.md) |
| Qué guarda y envía mail | [Acceso y seguridad](./security.md) |
| En qué se diferencia mail de otras herramientas de correo | [Comparativa](./compare.md) |
