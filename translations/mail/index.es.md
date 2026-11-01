---
title: "Mail"
---

`mail` es una herramienta de línea de comandos de WireCat que lee un buzón por IMAP hacia el almacén común, para la terminal, para scripts y para agentes de IA. Inicia sesión con una contraseña de aplicación guardada en el llavero del sistema operativo. Ordena el buzón en el servidor, guarda borradores, y envía, responde y reenvía por SMTP con la misma contraseña de aplicación.

Comandos: `session` (start: crea el perfil, comprueba y guarda la contraseña de aplicación; status; end; list),
`account check`, `folders list`, `sync` y `status` (cuánto lleva una sincronización), `search messages`, `messages show` y
`conversations list|show` (leen lo que guardó sync), `messages mark-read|move|copy|delete|restore|send|forward`,
`folders create|rename|delete`, `drafts`, `attachments`, `rules` y `tags`, además de los comandos que comparten
todas las CLI de WireCat: `doctor`, `commands`, `config`, `skill`, `mcp`, `runs` y `upgrade`.
Empieza por [la instalación](./installation.md) y sigue con [el uso](./usage.md). Antes del primer inicio de sesión, prepara el buzón:
[los pasos de cada proveedor](./providers.md).

## Buscar en tu correo

`mail` busca y lee el correo que sincronizó su perfil, en el almacén local, y pregunta al servidor de correo por lo que
`sync` aún no ha leído (`--backend archive` se queda en el almacén):

```sh
mail ya search messages invoice                                  # best match first, any form of the word
mail ya search messages 'from:ann@example.com has:attachment date>30d'
mail ya search messages 'list:github.com is:unread' --newest     # a mailing list, newest first
mail ya messages show '<ref from a search>'                      # the whole email and its attachments' text
mail ya conversations list emails_count>1                        # threads, newest first
mail ya conversations show '<chat:email/… ref>'                  # one thread, oldest first
```

El lenguaje de consulta es el que usan todas las CLI de WireCat ([guía de búsqueda](https://github.com/WireCatLabs/cli-core/blob/main/docs/search/query-language.md)):
`from:`, `to:`, `cc:`, `subject:`, `mailbox:` o `label:`, `list:` (un List-Id o su dominio), `is:unread`,
`has:attachment`, `filename:`, `content:` (el texto de los adjuntos), `size>` y `date:`. Cada comando lee solo el buzón
de su perfil; [memo](https://github.com/WireCatLabs/cli-memo) busca en todos los buzones junto con tus mensajes y notas
(`memo search mail`, `memo search all`). El almacén guarda texto, no el mensaje original, así que no hay código fuente
en bruto que mostrar.
