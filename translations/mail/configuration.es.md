---
title: "Ajustes"
---

Los ajustes viven en un solo archivo, `config.json`, en la carpeta que muestra `mail doctor`. Cada perfil tiene su propia parte,
y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
mail personal config show
mail personal config set limit 50
mail personal config unset limit
```

Un perfil creado por `session start` guarda también el buzón: `address`, `login` (cuando no es la dirección), `imap_host`,
`imap_port`, `imap_security` (`tls` o `starttls`), `auth` (`app-password`; un perfil guardado sin ella también inicia
sesión con una contraseña de aplicación) y `folders` (las carpetas que lee `sync`). `smtp_host`, `smtp_port` y
`smtp_security` indican el servidor al que envía `messages send`; fíjalos solo para un proveedor que la
[lista integrada](./providers.md) no conozca. La contraseña de aplicación no es
un ajuste: vive en el llavero, o en `MAIL_PASSWORD` para una ejecución sin llavero. Tampoco lo es un inicio de sesión con
OAuth: sus tokens también viven en el llavero.

`read_attachments` (por defecto `true`) y `max_attachment_mb` (por defecto 10) deciden si `sync` lee el texto de los adjuntos en el
índice de búsqueda y el archivo más grande que lee. No se guarda ningún archivo. `sync --no-attachments`, `--attachments` y
`--max-attachment-mb` los reemplazan en una ejecución; `messages show` lee los adjuntos de un correo sea lo que sea que digan.

`microsoft_client_id` es la aplicación de Microsoft con la que se inicia sesión en Outlook.com y Microsoft 365, cuando usas la
tuya en lugar de la de WireCat. Fíjalo una vez para todos los perfiles con `config set --defaults microsoft_client_id` y el id de la aplicación.
Cómo conseguir un id está en [registrar una aplicación de Microsoft](./oauth-microsoft.md). Un perfil que ya inició sesión sigue
`google_client_id` hace lo mismo para Gmail con OAuth; su secreto sale de `MAIL_GOOGLE_CLIENT_SECRET`, nunca del archivo.
`MAIL_MICROSOFT_CLIENT_ID` y `MAIL_GOOGLE_CLIENT_ID` prevalecen sobre ambos ajustes en una ejecución, y `--client-file`
prevalece sobre todo para Gmail. Un perfil que ya inició sesión sigue renovando con la aplicación con la que lo hizo.
`mail doctor` muestra la aplicación de cada perfil en `oauth_client`.

`config show` lista cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

`config set` también lista ajustes de búsqueda, voz y embeddings (`embedding_*`, `speech_model`, `picture_search` y
otros). Todas las CLI de WireCat comparten esa lista. `mail` los ignora.

Un agente por MCP que tenga `mcp.authority` puede cambiar ajustes con `config set`, pero nunca estos: los ajustes del
buzón de arriba, que deciden adónde va la contraseña de aplicación, `microsoft_client_id` y `google_client_id`, que deciden en qué
aplicación inicias sesión, y `permissions.messages.send.others`, que permite a un agente escribir a otras personas. Solo tú los cambias, en una terminal.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por cada clave
de permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja ejecutar el comando. `MAIL_READ_ONLY=1` rechaza toda escritura, diga lo que diga
`permissions`, salvo una: `rules add --sender` o `--list-id` con `--do envelope`, para un remitente o una lista que aún
no tiene regla, que ejecuta la revisión programada del correo en memo. Queda registrada con `source: agent`
(`rules list source:agent`). Una regla reemplazada, `--domain`, `--filter`, `--kind`, cualquier otra acción y una
etiqueta siguen rechazadas, igual que `rules remove`, `rules import` y `rules apply`.

La clave de un comando es su ruta: `messages.move`, `folders.delete`. De fábrica, un cambio que se puede deshacer sigue
adelante (marcas, movimientos, copias, carpetas creadas o renombradas, borradores guardados), y estos preguntan:
`messages.delete`, `folders.delete`, `drafts.delete` y `messages.bulk`, por la que pasa además todo cambio de más de 20
mensajes o elegido con `--filter`. En una terminal
`ask` es una pregunta s/N, y la respuesta por defecto es no. Un flag la responde en su lugar: `--allow-dangerous` para
`drafts delete`, porque un borrador eliminado no vuelve, y `--yes` para cualquier otro cambio, incluido `messages delete`,
porque la papelera y `messages restore` devuelven el correo. Sin terminal y sin flag el comando se detiene con
`confirmation_required` (código de salida 7) y no cambia nada.

El envío tiene dos claves. `messages.send` y `messages.forward` son los comandos mismos y siguen adelante cuando el
correo va solo a ti. El correo que llega a cualquier otra persona pasa también por `messages.send.others`, que por
defecto pregunta; ponla en `allow` para enviar sin la pregunta, o en `readonly` para que este perfil escriba solo a ti.
Un agente por MCP, donde nadie puede responder la pregunta, escribe solo a ti hasta que fijes tú mismo
`messages.send.others` en la configuración (`ask` o `allow`); un `mcp serve --permission` no puede abrirla. Cada
destinatario cuenta para `sends_per_hour` (30 por defecto).

```sh
mail personal config set permissions.messages readonly      # no flag, move, deletion or send on this profile
mail personal config set permissions.messages.bulk deny     # one message at a time only
mail personal config set permissions.messages.send.others allow   # send to others without the question, agents too
```

Cada intento de cambiar el buzón o de enviar va al diario de envíos del perfil con su clave, el número y el resultado,
nunca un asunto, una dirección ni el texto.

## Registros de ejecución

Un comando que falla se guarda como una ejecución, para `mail runs list` y `runs show`. `record_input` decide si una ejecución
guarda las palabras que escribiste; es `true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos; consulta
[Seguridad](./security.md).
