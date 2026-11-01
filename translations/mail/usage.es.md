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

`session start` en un perfil nuevo debe encontrar el servidor de correo. Primero mira en una tabla integrada (Yandex, Gmail,
iCloud, Mail.ru, Fastmail, Outlook). Después mira el registro MX del dominio. Después consulta la lista de servidores de correo de
Thunderbird y el archivo de ajustes del propio dominio. Si ninguno conoce el servidor, fíjalo tú con `--host`, `--port` y
`--security`, o nombra un proveedor de la tabla: `--provider yandex`.

En una terminal, `session start` pregunta lo que falta: el proveedor y la dirección. Sin terminal no pregunta nada. Entonces la
falta de `--address` o de la contraseña es un error, y lee la contraseña de `MAIL_PASSWORD`. El perfil se guarda solo después
de que el servidor acepte la contraseña de aplicación. Outlook solo acepta OAuth para IMAP, así que `session start` lo rechaza
por ahora. Para cambiar el servidor de un perfil existente, usa `config set` o un nombre de perfil nuevo.

`session start` toma la contraseña de la terminal o de `MAIL_PASSWORD`. Nunca la toma de una opción ni de una dirección. Cuando
el servidor la acepta, `mail` la guarda en el llavero del sistema operativo. Si el llavero falla, `mail` la guarda en un archivo
privado y lo avisa una vez por stderr. `--credential-storage file` elige el archivo; no lo recomendamos. Si `mail` no tiene
contraseña, lee la que dejó Himalaya (`secret-tool`, servicio `himalaya`, cuenta el nombre del perfil). Así una configuración
existente de Himalaya no necesita una contraseña nueva.

`sync` lee INBOX y la carpeta Sent. `--folder` o el ajuste `folders` del perfil indican otras carpetas. Lee primero el correo más
nuevo. `--limit` limita el correo nuevo de una ejecución. `--rescan` lista de nuevo toda la ventana. Guarda solo texto y
cabeceras. No guarda los adjuntos.

Un buzón grande no cabe en una sola ejecución. `sync` tiene un presupuesto de peticiones al servidor, fijado por su plazo: 15
minutos en una terminal, 45 segundos por MCP. `--timeout` cambia el plazo. `--max-pages` reduce el presupuesto. La ejecución
guarda lo que leyó, responde `state: partial` y da el mismo comando en `next`. Ejecútalo otra vez para continuar.
`mail <profile> status` muestra cuánto lleva la sincronización.

Yandex no da identificador de mensaje. Con un servidor así, `sync` lista solo el número, los indicadores, la fecha y el tamaño de
cada mensaje, y descarga cada mensaje nuevo una vez. Omite el correo guardado por ese número, así que una nueva ejecución no lee
nada dos veces. No detecta el correo borrado en el servidor ni los indicadores cambiados en el correo que omite. `--rescan` hace
ambas cosas.

A veces el servidor no puede responder por un mensaje (Yandex responde `NO [UNAVAILABLE]` a algunos). `sync` lo pide otra vez al
final de la ejecución. Si sigue fallando, `sync` lo cuenta en `unreadable` y lo deja para la siguiente ejecución.

A veces el servidor cierra la conexión. `sync` espera 1, luego 3, luego 10 segundos, con una pequeña variación aleatoria para que
muchas ejecuciones no reintenten a la vez. Después se reconecta. Comprueba que el servidor sigue numerando el correo de la
carpeta igual, y continúa desde la petición fallida mientras lo permitan el presupuesto y el plazo. Si sigue fallando, la
respuesta conserva el código propio del error de red como `cause_code`, y `mail runs show` lo muestra.

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

El servidor ofrece todos los comandos. Un comando que escribe escribe solo en el almacén local, nunca en el buzón.
Los permisos del perfil deciden qué se ejecuta; consulta
[los ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`mail personal mcp serve --http --public-url https://laptop.example.ts.net` sirve en `127.0.0.1` (puerto 8765, o
`--port`) tras tu propio túnel. Una aplicación de navegador inicia sesión con un código de un solo uso que imprime el comando;
`mail personal mcp revoke` termina todos los inicios de sesión. `mail personal mcp server start` ejecuta el mismo
servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las aplicaciones conectadas,
y `mcp server stop` lo termina.

## Buscar en tu correo

`mail` llena el almacén común. [memo](https://github.com/WireCatLabs/cli-memo) busca en él y muestra lo que contiene:

```sh
memo search mail "invoice"
```

Las palabras de la consulta están en [memo search](https://github.com/WireCatLabs/cli-memo/blob/main/docs/search.md).
