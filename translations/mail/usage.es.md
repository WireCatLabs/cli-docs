---
title: "Uso"
---

Esta página explica cómo se construye un comando y cómo usa la herramienta un agente. Léela antes de tu primer comando.

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
mail ya folders list
```

`MAIL_PROFILE=ya` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera el único: un
comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Conectar un buzón

Primero prepara el buzón: activa IMAP y crea una contraseña de aplicación. [Preparar el buzón](./providers.md) tiene los pasos
de cada proveedor, y `session start` también los imprime.

```sh
mail ya session start --address me@example.com # new profile: finds the server, shows the steps, asks for the app password
mail ya session start                 # an existing profile: asks for the app password again (checked, kept in the keyring)
mail ya account check                 # logs in and lists what the server supports
mail ya folders list                  # folders with role and counts
mail ya sync --since-time 2026-10-01  # reads new mail into the shared store; stored mail is skipped
```

`session start` en un perfil nuevo busca la dirección en una tabla integrada (Yandex, Gmail, iCloud, Mail.ru, Fastmail,
Outlook), después el registro MX, después el ISPDB de Thunderbird y el archivo autoconfig del propio dominio. Da `--host`, `--port`
y `--security` para fijar un servidor a mano, o `--provider yandex` (cualquier nombre de la tabla) cuando la detección no encuentra nada;
en una terminal pregunta en su lugar qué proveedor es, y pide la dirección cuando falta `--address`. El perfil se
guarda solo después de que el servidor acepte la contraseña de aplicación. Sin terminal no se pregunta nada: la falta de `--address` o de
la contraseña es un error de validación, y la contraseña se lee de `MAIL_PASSWORD`. Outlook solo acepta OAuth para IMAP, así que
`session start` lo rechaza por ahora. Un perfil existente solo vuelve a pedir su contraseña; para cambiar su servidor, usa
`config set` o un nombre de perfil nuevo.

`session start` toma la contraseña de la terminal o de `MAIL_PASSWORD`, nunca de una opción ni de una dirección. Solo se guarda cuando el
servidor la ha aceptado, en el llavero; si el llavero falla, en un archivo privado, se avisa una vez por stderr y nunca se pregunta
(`--credential-storage file` elige el archivo, no recomendado). Cuando ninguno la tiene, `mail` lee la entrada que dejó Himalaya (`secret-tool`, servicio
`himalaya`, cuenta el nombre del perfil), así que una configuración existente no necesita una contraseña nueva.

`sync` lee INBOX y la carpeta Sent salvo que `--folder` o el `folders` del perfil digan otra cosa, de las más nuevas a las más antiguas,
y acepta `--limit` por ejecución, y `--rescan` para listar de nuevo toda la ventana. Guarda solo texto y cabeceras: los adjuntos no se guardan.

La sincronización de un buzón grande no cabe en una sola ejecución. Gasta un presupuesto de peticiones acorde con su plazo (15 minutos en una
terminal, 45 segundos por MCP; `--timeout` lo cambia, `--max-pages` reduce el presupuesto), guarda tras cada parte y
responde `state: partial` con el mismo comando en `next`; ejecútalo otra vez para continuar. `mail <profile> status` dice cuánto
lleva. En un servidor que no da identificador de mensaje (Yandex) el listado es solo UID, indicadores, fecha y tamaño, y cada mensaje nuevo
se descarga una vez: el correo guardado se omite por UID, así que una nueva ejecución no vuelve a leer nada. Una ejecución así no detecta el correo borrado
en el servidor ni los indicadores cambiados en el correo que omite; `--rescan` lista todo con cabeceras y hace ambas cosas. Un mensaje en el que el servidor falla (Yandex responde `NO [UNAVAILABLE]` a algunos) se pide una vez más al final de
la ejecución, y si sigue fallando se cuenta en `unreadable` y se deja para la siguiente ejecución. Cuando el servidor cierra la
conexión, la sincronización se reconecta tras 1, 3 y 10 segundos (con variación aleatoria), comprueba que UIDVALIDITY es el mismo y continúa desde
la petición fallida, mientras lo permitan el presupuesto y el plazo; un fallo conserva el código propio del transporte como
`cause_code`, y `mail runs show` lo muestra.

## Salida para scripts

Todo comando salvo `mcp serve` en stdin y stdout acepta `--json`, e imprime un único valor JSON en stdout. Los errores son JSON en stderr, con un código por el que
bifurcar. La [referencia de comandos](./commands.md) lista los códigos.

## Agentes

`mail skill install` coloca la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`mail skill install --for hermes` añade además esa carpeta a los ajustes propios de Hermes Agent, así que un `skill install` sin más
deja fuera a Hermes. `mail personal mcp serve` sirve los comandos del perfil por MCP, en stdin y stdout:

```sh
claude mcp add mail -- mail personal mcp serve
```

El servidor ofrece todos los comandos, incluidos los que escriben. Los permisos del perfil deciden qué se ejecuta; consulta
[los ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`mail personal mcp serve --http --public-url https://laptop.example.ts.net` sirve en `127.0.0.1` (puerto 8765, o
`--port`) tras tu propio túnel. Una aplicación de navegador inicia sesión con un código de un solo uso que imprime el comando;
`mail personal mcp revoke` termina todos los inicios de sesión. `mail personal mcp server start` ejecuta el mismo
servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las aplicaciones conectadas,
y `mcp server stop` lo termina.
