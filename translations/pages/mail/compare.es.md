---
title: "Comparado con otras herramientas"
---

<a id="features" />
<a id="when-another-tool-fits-better" />

`mail` es una línea de comandos y un servidor MCP que copia tu buzón por IMAP en el almacén compartido de WireCat en tu
ordenador, busca en él y organiza el buzón en el servidor. Esta página lo pone junto a otras líneas de comandos y
servidores MCP de correo para que veas cuál se ajusta a tu trabajo. Las marcas de `mail` provienen de su documentación
y su código fuente para la versión 0.10.0, revisadas el 2 de noviembre de 2026. Las marcas de las demás herramientas
provienen de sus propios README y documentación, revisadas el 28 de octubre de 2026. El inicio de sesión, la
sincronización y el envío de `mail` también se probaron con un buzón real de Outlook.com el 2 de noviembre de 2026. En
ningún otro buzón real se inició sesión ni se probó nada, y una herramienta puede hacer más de lo que dicen sus páginas.

Las herramientas:

- **mail**: esta herramienta. Copia un buzón por IMAP en el almacén compartido, busca y lee, organiza el buzón en el
  servidor (marcas, mover, papelera, carpetas, borradores) y envía correo por SMTP.
  [memo](../memo/mail.md) busca en el mismo correo junto con tus chats y notas.
- **[Himalaya](https://github.com/pimalaya/himalaya)**: una línea de comandos en Rust para correo por IMAP, SMTP, JMAP,
  Gmail, Microsoft Graph, Maildir y mbox (v2.2.1, 2 de octubre de 2026).
- **[mu](https://github.com/djcb/mu)**: indexa un Maildir en una base de búsqueda, con una línea de comandos de búsqueda
  rápida (v1.14.4, 14 de octubre de 2026).
- **[gog](https://github.com/openclaw/gogcli)**: una línea de comandos para Gmail, Calendar, Drive y más, pensada para
  agentes, con un servidor MCP (v0.47.1, 27 de octubre de 2026).
- **[Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)**: un servidor MCP para 12 servicios de
  Google, 15 de sus herramientas para Gmail (v2.2.1, 27 de octubre de 2026).
- **[Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server)**: un servidor MCP para Microsoft Graph, con el
  correo de Outlook entre más de 300 herramientas (v0.176.0, 28 de octubre de 2026).

[NeoMutt](https://github.com/neomutt/neomutt) no está en la tabla: es un programa de correo para una persona en un
terminal, y sus páginas dicen poco sobre agentes. Se nombra más abajo.

✅ sí · 🟡 en parte · ❌ no · ➖ no figura en su documentación · n/a no aplica

## Funciones


| Tarea | mail | [Himalaya](https://github.com/pimalaya/himalaya#usage) | [mu](https://github.com/djcb/mu#readme) | [gog](https://github.com/openclaw/gogcli#readme) | [Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [Microsoft 365 MCP](https://github.com/Softeria/ms-365-mcp-server#readme) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Leer y buscar** | | | | | | |
| Buscar por remitente, fecha y palabras en una sola consulta | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-query.7.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Buscar en el servidor de correo mensajes que aún no se han copiado | ✅¹ | [✅](https://github.com/pimalaya/himalaya#usage) | [❌](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | ➖ |
| Leer una conversación entera de una vez | ✅ | ➖ | [✅](https://github.com/djcb/mu/blob/master/man/mu-find.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Leer y buscar sin internet | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | [✅](https://github.com/djcb/mu#readme) | ➖ | ➖ | ➖ |
| Encontrar un mensaje con adjunto y guardar el archivo | ✅² | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-extract.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Guardar una copia** | | | | | | |
| Guardar el correo en un solo almacén con chats, reuniones y notas, y buscar en todo a la vez | ✅³ | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Organizar** | | | | | | |
| Mover, archivar, marcar o eliminar un mensaje | ✅⁴ | [✅](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-move.1.org) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Deshacer un cambio hecho por la herramienta | ✅⁴ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Crear, renombrar y eliminar carpetas | ✅ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | ➖ | ➖ | ➖ |
| Etiquetar mensajes | 🟡⁵ | [🟡](https://github.com/pimalaya/himalaya#usage) | [✅](https://github.com/djcb/mu/blob/master/man/mu-labels.1.org) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | ➖ |
| Clasificar el correo nuevo con reglas que puedes exportar y revisar | ✅ | [🟡](https://github.com/pimalaya/himalaya#features) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Responder y enviar** | | | | | | |
| Guardar un borrador sin enviarlo | ✅⁶ | [✅](https://github.com/pimalaya/himalaya#usage) | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| Enviar, responder o reenviar | ✅⁷ | [✅](https://github.com/pimalaya/himalaya#features) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli/blob/main/docs/gmail-workflows.md) | [✅](https://workspacemcp.com/gmail) | [✅](https://github.com/Softeria/ms-365-mcp-server/blob/main/src/endpoints.json) |
| **Buzones y proveedores** | | | | | | |
| Cualquier buzón IMAP que ofrezca contraseñas de aplicación (Yandex, iCloud, Fastmail, tu propio servidor) | ✅ | [✅](https://github.com/pimalaya/himalaya#features) | [❌](https://github.com/djcb/mu#readme) | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [❌](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Gmail con sus etiquetas | ✅⁸ | [✅](https://github.com/pimalaya/himalaya#configuration) | [🟡](https://github.com/djcb/mu#readme) | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | n/a |
| Outlook y Microsoft 365 | ✅⁹ | [🟡](https://github.com/pimalaya/himalaya#outlook) | ➖ | n/a | n/a | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Usar JMAP o Microsoft Graph en lugar de IMAP | ❌¹² | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | n/a | n/a | n/a |
| **Agentes y seguridad** | | | | | | |
| Un agente puede leer el correo pero no enviarlo ni cambiarlo | ✅¹⁰ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/safety-profiles.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Permitir o denegar comandos concretos a un agente | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Mostrar qué afectaría una eliminación o un cambio grande y preguntar antes de ejecutarlo | ✅¹¹ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| Decirle al agente que el texto del correo son datos, no instrucciones | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | ➖ | ➖ |
| Servidor MCP | ✅ | ➖ | ➖ | [✅](https://github.com/openclaw/gogcli/blob/main/docs/mcp.md) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| **Configuración** | | | | | | |
| Empezar solo con una dirección, sin registrar antes una aplicación en la nube | ✅⁹ | [✅](https://github.com/pimalaya/himalaya#features) | ➖ | [❌](https://github.com/openclaw/gogcli#readme) | [❌](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Iniciar sesión con OAuth | ✅⁹ | [🟡](https://github.com/pimalaya/himalaya#faq) | ➖ | [✅](https://github.com/openclaw/gogcli#readme) | [✅](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [✅](https://github.com/Softeria/ms-365-mcp-server#readme) |

| | mail | Himalaya | mu | gog | Workspace MCP | Microsoft 365 MCP |
|---|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o posterior | [brew, cargo o un archivo de versión](https://github.com/pimalaya/himalaya#installation) | [paquete de la distribución o compilación con meson](https://github.com/djcb/mu#readme) | [brew o go install](https://github.com/openclaw/gogcli#readme) | [uvx](https://github.com/taylorwilsdon/google_workspace_mcp#readme) | [npx](https://github.com/Softeria/ms-365-mcp-server#readme) |
| Licencia | Apache-2.0 | Apache-2.0 | GPL-3.0 | MIT | MIT | MIT |

¹ `search messages` también consulta al servidor de correo (`--backend archive|server|both`, por defecto `both`). Gmail
se busca en «Todos los mensajes» con la sintaxis propia de Gmail. Los demás servidores se buscan con IMAP `SEARCH` en
INBOX, Sent y Archive, o en las carpetas del perfil. Lo que encuentra el servidor se guarda, y cada resultado indica
dónde se encontró. `--offline` se queda en el almacén.

² `attachments list` y `attachments download` leen los archivos de un correo desde el servidor y los guardan legibles
solo por ti. `mail` también encuentra correos por el texto dentro de los adjuntos.

³ El almacén es compartido con las demás herramientas de WireCat. `mail` busca en su propio buzón; [memo](../memo/mail.md)
busca en todos los buzones junto con chats y notas.

⁴ Las marcas, los movimientos, las copias y las carpetas cambian el buzón en el servidor. Una eliminación mueve el
correo a la papelera y nunca lo borra definitivamente. `messages restore --run <id>` deshace una ejecución, empezando por
el último paso, mientras el proveedor no haya vaciado la papelera; `mail doctor` avisa cuando eso está cerca en Gmail.
Una eliminación, un cambio elegido por una consulta y un cambio de más de 20 mensajes se muestran primero como vista
previa y se ejecutan solo con `--yes`.

⁵ `mail` etiqueta el correo y las conversaciones guardados con tus propias etiquetas. Se quedan en el almacén local y
nunca llegan al servidor. Las marcas y palabras clave del servidor se cambian con `messages update --flag`, y las
etiquetas de Gmail con `messages move` y `copy`.

⁶ Los borradores se guardan en la carpeta Borradores del propio buzón, así que puedes revisar y enviar uno desde
cualquier aplicación de correo. No hay plantillas. `drafts send` envía un borrador guardado.

⁷ `messages send`, `messages forward` y `--reply-to` envían por el servidor SMTP del proveedor con el mismo inicio de
sesión. El correo a cualquiera que no seas tú pregunta primero, cada destinatario cuenta para un límite por hora (30 por
defecto), y una copia va a Enviados y al almacén. `--file` rechaza carpetas de credenciales y de WireCat salvo que el
propietario pase `--allow-any-file`.

⁸ Por defecto `mail` inicia sesión en Gmail con una contraseña de aplicación y lee «Todos los mensajes». Un dominio de
Google Workspace que desactiva las contraseñas de aplicación, o una cuenta sin verificación en dos pasos, inicia sesión
con OAuth mediante una aplicación de Google que creas tú
([pasos](https://github.com/WireCatLabs/mail-cli/blob/main/docs/oauth-google.md)); `mail` no incluye ninguna aplicación
de Google propia para el correo.

⁹ Outlook.com y Microsoft 365 aceptan solo OAuth para IMAP y SMTP. `mail session start` abre el navegador, inicias
sesión y apruebas el acceso, sin escribir ninguna contraseña. La aplicación de Microsoft de WireCat viene incluida, así
que no hay nada que registrar ([pasos](https://github.com/WireCatLabs/mail-cli/blob/main/docs/outlook.md)). El inicio de
sesión, la sincronización y el envío se probaron con un buzón real de Outlook.com. No se probó una cuenta de trabajo de
Microsoft 365: su administrador puede tener que permitir la aplicación, y para enviar hace falta «Authenticated SMTP»
activado en el buzón. Outlook.com además necesita IMAP activado en su configuración. Gmail con OAuth necesita tu propia
aplicación de Google.

¹⁰ Por MCP, `mail` cambia el buzón solo si el servidor se inicia con `--allow-writes`, y entonces solo dentro de los
permisos del perfil. Un agente por MCP escribe solo a ti hasta que el propietario fije `permissions.messages.send.others`,
y no puede cambiar los servidores de correo, el inicio de sesión ni esa clave. `MAIL_READ_ONLY=1` rechaza todo cambio.

¹¹ Una eliminación, borrar una carpeta con correo y un cambio de muchos mensajes preguntan por defecto, y `deny` los
prohíbe. Sin `--yes` responden con una vista previa y el comando para repetir. Por MCP no hay nadie que responda a un
`ask`, así que `ask` deja que el comando se ejecute; `deny` sigue rechazando. `--dry-run` muestra cualquier comando antes.

¹² `mail` solo lee IMAP: ni JMAP, ni Microsoft Graph, ni filtros Sieve en el servidor, ni PGP.

Notas sobre la columna de Himalaya: sus marcas provienen de su README y de la ayuda `--help`, de solo lectura, de la
v2.2.1. No se ejecutó nada contra un buzón. No tiene inicio de sesión OAuth propio: su README dice que v2 «ships no OAuth
flow» y remite a un asistente de tokens aparte (ortie), que aporta el token para Outlook, Microsoft Graph y Gmail, por
eso esas marcas son 🟡. Sus páginas no nombran ningún modo de solo lectura, ninguna lista de comandos permitidos ni
ningún servidor MCP. Su compatibilidad con mbox y Maildir es un backend; sus páginas no nombran ningún comando que
exporte un buzón a ellos.

Notas sobre la columna de `mail`:

- **Cambios.** Cada ejecución con cambios guarda, en un archivo privado, lo que necesita para deshacerse: la carpeta,
  el UID, las marcas, las etiquetas de Gmail y el Message-ID de cada mensaje, nunca un asunto ni un cuerpo. Cada intento
  va al registro de envíos.
- **Sincronización programada.** `schedule command <name> --every 5m -- sync` mantiene el almacén al día con el
  temporizador del sistema. `sync` lee INBOX y Sent por defecto.
- **Exportación.** `messages export` escribe los mensajes originales que coinciden con una consulta en archivos mbox o en
  un árbol Maildir, para copia de seguridad o para mu y notmuch.
- **Permisos.** Cada perfil fija `allow`, `ask`, `readonly` o `deny` por comando. `--permission` en `mcp serve` solo
  puede hacer el perfil más estricto. Consulta [la configuración](./configuration.md#permissions).
- **Velocidad y coste frente a un agente de navegador.** `mail` lee el servidor de correo por IMAP y no abre ningún
  navegador. No se ha publicado ninguna medición frente a un agente de navegador, así que esta página no afirma nada.

## Cuándo encaja mejor otra herramienta

- **Himalaya**: usas un proveedor que no es IMAP, como JMAP o Microsoft Graph, o quieres filtros Sieve en el servidor.
- **gog**: usas solo Gmail y quieres comandos compilados para que el agente no pueda ampliarlos, o sus comandos de
  Calendar y Drive junto a Gmail.
- **Microsoft 365 MCP**: tu organización desactiva IMAP o Authenticated SMTP en tu buzón, o quieres Microsoft Graph más
  allá del correo. `mail` llega a Outlook y Microsoft 365 solo por IMAP y SMTP.
- **mu**: ya tienes un Maildir y quieres una búsqueda rápida sobre él con adjuntos e hilos.

Si `mail` te sirve, empieza por la [instalación](./installation.md). Para conectar un agente, consulta [uso](./usage.md).
