---
title: "Próximas mejoras"
---

Esta página reúne lo que está previsto para `mail` y todavía no tiene. Léela antes de montar una solución alternativa
para algo que falta: puede que ya esté en camino. El orden es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/mail-cli/issues).

## Qué funciona hoy

`mail` lee un buzón por IMAP en el almacén compartido de WireCat y lo ordena en el servidor: marcas, movimientos,
copias, borrado a la papelera y carpetas, y cada cambio se puede deshacer con `messages restore`. Guarda borradores en
el servidor, envía, responde y reenvía por SMTP con una comprobación de destinatarios y un límite por hora, y lista y
descarga archivos adjuntos. Las reglas de correo del propietario y la limpieza de sobres pasaron aquí desde memo.
Encuentra por sí mismo el servidor de una dirección nueva: una tabla incorporada, el registro MX, el ISPDB de
Thunderbird y el archivo autoconfig del dominio. Inicia sesión con una contraseña de aplicación guardada en el llavero
del sistema, lo que sirve para Yandex, Gmail, iCloud, Mail.ru, Fastmail y otros proveedores que ofrecen contraseñas de
aplicación. Busca y lee el correo guardado de un perfil (`search messages`, `messages show`, `conversations`); `memo`
busca en todos los buzones junto con mensajes y notas. Un servidor MCP da a los agentes de IA los mismos comandos.
Todos los comandos están en la [referencia de comandos](./commands.md).

## Siguiente

- **Inicio de sesión con OAuth para Outlook, Microsoft 365 y Google Workspace.** Microsoft solo acepta OAuth para IMAP,
  así que estos buzones todavía no se pueden añadir; lo necesita también un dominio de Workspace que desactive las
  contraseñas de aplicación.

Lo que cambió cada versión publicada está en el [historial de cambios](./changelog.md).
