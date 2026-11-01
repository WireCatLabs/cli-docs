---
title: "Ajustes"
---

Los ajustes viven en un solo archivo, `config.json`, en la carpeta que muestra `mail doctor`. Cada perfil tiene su propia parte,
y `defaults` se aplica a todos los perfiles. Esta página explica cómo verlos y cambiarlos.

```sh
mail ya config show
mail ya config set limit 50
mail ya config unset limit
```

Un perfil creado por `session start` guarda también el buzón: `address`, `login` (cuando no es la dirección), `imap_host`,
`imap_port`, `imap_security` (`tls` o `starttls`), `auth` (`app-password`; un perfil guardado sin ella también inicia
sesión con una contraseña de aplicación) y `folders` (las carpetas que lee `sync`). `smtp_host`, `smtp_port` y
`smtp_security` indican el servidor al que envía `messages send`; fíjalos solo para un proveedor que la
[lista integrada](./providers.md) no conozca. La contraseña de aplicación no es
un ajuste: vive en el llavero, o en `MAIL_PASSWORD` para una ejecución sin llavero.

`config show` lista cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

`config set` también lista ajustes de búsqueda, voz y embeddings (`embedding_*`, `speech_model`, `picture_search` y
otros). Todas las CLI de WireCat comparten esa lista. `mail` los ignora.

Un agente por MCP que tenga `mcp.authority` puede cambiar ajustes con `config set`, pero nunca estos: los ajustes del
buzón de arriba, que deciden adónde va la contraseña de aplicación, y `permissions.messages.send.others`, que permite a
un agente escribir a otras personas. Solo tú los cambias, en una terminal.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil: `allow`, `ask`, `readonly` o `deny`, por cada clave
de permiso. Por MCP no hay nadie a quien preguntar, así que `ask` deja ejecutar el comando. `MAIL_READ_ONLY=1` rechaza toda escritura, diga lo que diga
`permissions`.

La clave de un comando es su ruta: `messages.move`, `folders.delete`. De fábrica, un cambio que se puede deshacer sigue
adelante (marcas, movimientos, copias, carpetas creadas o renombradas, borradores guardados), y estos preguntan:
`messages.delete`, `folders.delete`, `drafts.delete` y `messages.bulk`, por la que pasa además todo cambio de más de 20
mensajes o elegido con `--filter`. En una terminal
`ask` es una pregunta s/N; `--yes` la responde.

El envío tiene dos claves. `messages.send` y `messages.forward` son los comandos mismos y siguen adelante cuando el
correo va solo a ti. El correo que llega a cualquier otra persona pasa también por `messages.send.others`, que por
defecto pregunta; ponla en `allow` para enviar sin la pregunta, o en `readonly` para que este perfil escriba solo a ti.
Un agente por MCP, donde nadie puede responder la pregunta, escribe solo a ti hasta que fijes tú mismo
`messages.send.others` en la configuración (`ask` o `allow`); un `mcp serve --permission` no puede abrirla. Cada
destinatario cuenta para `sends_per_hour` (30 por defecto).

```sh
mail ya config set permissions.messages readonly      # no flag, move, deletion or send on this profile
mail ya config set permissions.messages.bulk deny     # one message at a time only
mail ya config set permissions.messages.send.others allow   # send to others without the question, agents too
```

Cada intento de cambiar el buzón o de enviar va al diario de envíos del perfil con su clave, el número y el resultado,
nunca un asunto, una dirección ni el texto.

## Registros de ejecución

Un comando que falla se guarda como una ejecución, para `mail runs list` y `runs show`. `record_input` decide si una ejecución
guarda las palabras que escribiste; es `true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos; consulta
[Seguridad](./security.md).
