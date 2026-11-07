---
title: "Uso"
---

Esta página explica cómo se construye un comando y cómo usa la herramienta un agente. Léela antes de tu primer comando.

## El perfil va primero

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
b24 personal config show
```

`B24_PROFILE=personal` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera si
es el único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Iniciar sesión

Crea un webhook entrante en Bitrix24 (Developer resources → Other → Incoming webhook) con los permisos de acceso `crm`
y `user`, y copia su dirección. Luego:

```sh
b24 work session start
```

`b24` pide la dirección sin mostrarla, o la lee de stdin, la comprueba contra el portal y la guarda en el llavero del
sistema. `--credential-storage file` la guarda en un archivo privado, para un ordenador sin llavero. `B24_TOKEN` con
la dirección se usa antes que cualquiera de los dos. La dirección es la contraseña: quien la tenga puede hacer lo mismo
que el empleado del webhook.

`b24 work session status --check` muestra el empleado con el que actúa el webhook y si es administrador.
`b24 work session end` olvida la dirección en este ordenador; el webhook sigue en Bitrix24 hasta que lo borres allí.
`b24 session list` muestra los perfiles de este ordenador.

## Sincronizar

Las negociaciones, los prospectos, los embudos y las etapas se leen del almacén local de WireCat, el mismo en el que
buscan todas las herramientas de WireCat. `sync` lo pone al día:

```sh
b24 work sync                    # what changed since the last sync; everything on the first one
b24 work sync --rescan           # everything again, every id too
b24 work store status            # how far each kind is, and how many are stored
```

Una sincronización lee por la hora de cambio de cada elemento, con un solapamiento, así que un elemento que cambió
mientras se ejecutaba vuelve a llegar la próxima vez. Una vez al día también lista todos los ids y marca como borrados
los que el portal ya no tiene; una lista que marcaría más de la mitad se retiene, porque un webhook que perdió sus
derechos no lista ninguno. Una sincronización se detiene antes de su plazo o de `--max-pages`, y la siguiente sigue
desde ahí.

## Leer

```sh
b24 work deals list status:open                 # open, won or lost
b24 work deals list stage:"Quote sent" pipeline:Sales
b24 work leads list --json
b24 work deals show deal:12                     # by the ref a list prints
b24 work pipelines show Sales                   # its funnel: how many reached each stage
b24 work stages list kind:lead                  # each stage with its outcome: open, won or lost
b24 work people show "Anna Ivanova"             # contacts and companies by id, or by the exact name
```

`deals`, `leads`, `pipelines` y `stages` son los comandos de CRM que comparte WireCat: las mismas palabras, consulta y
respuesta en todas las herramientas de CRM. Una negociación o un prospecto responde su `pipeline`, `stage`, `status`,
`close_date`, y `amount` como decimal en su `currency`; `--offline` lee lo mismo. Los prospectos de Bitrix24 no tienen
embudos, así que están en un único embudo llamado `Leads`.

`people` y `organizations` leen el propio portal. Su `show` da los campos propios del portal en
`provider_metadata`, cada uno por su código con su etiqueta; un campo de lista da la etiqueta de su opción, y el id de
la opción como `option_id`. `b24 work fields list deals` muestra esos campos con su tipo y sus opciones, tal como los
guardó el último `sync`; `leads`, `people` y `organizations` funcionan igual. Sus listas también filtran por esos
campos, por código o por etiqueta, cuando el portal puede filtrar por ellos, y `--json` puede añadirlos:

```sh
b24 work organizations list industry:IT
b24 work organizations list --json=id,name,provider_metadata.UF_CRM_1745512486047
```

Una lista muestra primero lo más reciente: `--limit`, `--page` y, para `people` y `organizations`, `--all` lo cambian.
Los campos por los que puede filtrar una lista están en su ayuda, `b24 help deals list`.

## Escribir

```sh
b24 work deals create --title "Kitchen for Example" --pipeline Sales --amount 15000 --currency EUR
b24 work deals update deal:12 --amount 18000 --close-date 2026-12-24
b24 work deals move deal:12 "Contract signed"
b24 work deals close deal:12 won
b24 work deals delete deal:12                   # asks first
b24 work leads update lead:7 --field UF_CRM_SOURCE=Website
b24 work people create --first-name Anna --last-name Ivanova
b24 work organizations update 9 --field "Lead source=Fair" --body '{"revenue":1000}'
```

Una escritura de negociación o prospecto envía una petición y luego vuelve a leer el elemento en el almacén. `--stage`
recibe una etapa del propio embudo del elemento por nombre o id, y también comprueba la clave `move`; una etapa ganada o
perdida comprueba además la clave `close`. `close` lo mueve a la primera etapa ganada o perdida de su embudo.
`--field <label or code>=<value>` fija uno de los campos propios del portal, como los nombra `fields list`; un campo
de lista recibe la etiqueta o el id de su opción, y un valor vacío vacía el campo. Se rechaza un campo que nombra una
etapa, un embudo o un responsable: esos tienen sus propias opciones.

Para `people` y `organizations`, `--field "<label or code>=<value>"` también recibe la etiqueta, y un campo con varios
valores recibe `--field` una vez por valor; `--body` recibe los demás campos con los nombres de la REST 3.0 de
Bitrix24.

Cada escritura responde un `operation_id`, que guarda el diario de la ejecución. Una escritura se envía una vez. Si
termina con `outcome_unknown`, puede que el portal la hiciera: mira primero el elemento (`sync` y luego `show`) y
repítela solo si no está, porque Bitrix24 haría la repetición por segunda vez. `--dry-run` no envía nada y nombra cada clave de permiso que
comprueba el comando, con la opción que añade cada una: las claves de mover y cerrar de una etapa, y
`crm.assign-others` para otro responsable. Asignar un elemento a otro empleado se rechaza hasta que lo permitas,
porque Bitrix24 avisa a ese empleado: `b24 work config set permissions.crm.assign-others allow`.

`b24 work api call crm.deal.get --body '{"id":12}'` llama a cualquier otro método de Bitrix24, aquí una lectura de la negociación 12. Comprueba los mismos permisos
que el comando que hace lo mismo, y rechaza las escrituras que envían mensajes, ponen en marcha la automatización del
portal o crean tareas hasta que las permitas. `b24 api list` y `b24 api show crm.deal.update` muestran qué comprueba cada
método.

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un único valor JSON en stdout. Los
errores son JSON en stderr, con un código para decidir qué hacer. La [referencia de comandos](./commands.md) muestra
los códigos.

## Agentes

`b24 skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`b24 skill install --for hermes` añade además esa carpeta a los ajustes propios de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes. `b24 personal mcp serve` sirve los comandos del perfil por MCP, en stdin
y stdout:

```sh
claude mcp add b24 -- b24 personal mcp serve
```

El servidor ofrece todos los comandos, también los que escriben. Los permisos del perfil deciden qué se ejecuta;
consulta los [ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`b24 personal mcp serve --http --public-url https://laptop.example.ts.net` sirve en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que imprime
el comando; `b24 personal mcp revoke` termina todos los inicios de sesión. `b24 personal mcp server start` ejecuta el
mismo servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las
aplicaciones conectadas, y `mcp server stop` lo detiene.
