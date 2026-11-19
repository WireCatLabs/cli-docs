---
title: "Seguridad"
---

Descubre qué guarda `ydisk` en tu ordenador, qué envía y a quién, y cómo quitarlo. Lo que comparten todas las CLI de
WireCat, como el llavero, los permisos, MCP y lo que nunca llega a un registro, está en la
[página de seguridad común](https://wirecat.dev/en/docs/security). Esta página recoge solo lo propio de `ydisk`.

**En esta página:**

1. [Qué se queda en tu ordenador](#what-stays-on-your-computer)
2. [Qué sale por la red](#what-goes-over-the-network)
3. [Agentes y MCP](#agents-and-mcp)
4. [Registros de ejecución](#run-records)
5. [Permisos de archivos](#file-permissions)

## Qué se queda en tu ordenador

| Qué | Dónde | Cómo quitarlo |
| --- | --- | --- |
| El token de Yandex | El llavero del sistema, o un archivo privado donde no lo hay | `ydisk personal session end` |
| El texto de los archivos de las carpetas elegidas, con sus nombres, rutas, tamaños, fechas y sumas MD5 | El almacén local, `wirecat.db`, compartido con las demás herramientas de WireCat | `folders remove` con el id de la carpeta de `folders list`, y luego `sync` |
| Tus etiquetas, notas y recuerdos sobre documentos | El almacén local | `tags remove`, `notes remove` |
| El par de carpetas de cada espejo, su última sincronización y las versiones que una sincronización reemplazó o borró aquí | `profiles/<profile>/mirrors.json` y `profiles/<profile>/mirrors/` en la carpeta de estado, legibles solo por ti | `mirrors remove <id>` olvida el par; las versiones se quedan hasta que caducan ([espejos](./mirrors.md#earlier-versions-of-a-file)) |
| Archivos que un espejo quitó de este ordenador porque se borraron en el Disk | `.wirecat-trash/` dentro de la carpeta sincronizada | Borra esa carpeta cuando ya no los necesites |
| Ajustes y registros de ejecución | Las carpetas que muestra `ydisk doctor` | `ydisk runs list` los muestra. Caducan tras los días indicados en los [ajustes](./configuration.md#run-records) |

Los archivos en sí se quedan en el Disk. Solo se guarda una copia de un archivo cuando ejecutas
`files download --output`, o en una carpeta que [sincronizas con un espejo](./mirrors.md). La sincronización no guarda los enlaces públicos (`public_url`). Nada va a WireCat: no hay
servidor de WireCat ni una cuenta con nosotros.

## Qué sale por la red

`ydisk` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `ydisk doctor`. Habla con un solo
servicio, la API de Yandex Disk en `cloud-api.yandex.net`. `session start` guarda el token OAuth de Yandex en el
llavero del sistema, o en un archivo privado donde no funciona ningún llavero. El token va solo en la cabecera
Authorization de una petición a `cloud-api.yandex.net`, nunca en una dirección, una respuesta, un registro de ejecución
ni el diario de envíos. Las descargas y las subidas van al enlace que da Yandex (`downloader.disk.yandex.ru`,
`*.disk.yandex.net`, `*.storage.yandex.net`) sin el token, y esos enlaces nunca se imprimen.

Además de a Yandex, `ydisk` pregunta una vez al día al registro de npm si hay una versión más nueva, salvo que
`update_check` sea `false`. El texto va a un proveedor de IA solo cuando tú configuras uno, como `embedding_provider`
con el valor `openai` o `memories extract`. Por defecto la búsqueda por significado se ejecuta en tu ordenador.

## Agentes y MCP

Por MCP un agente lee el texto de un archivo con `files download`, pero no puede guardarlo en una ruta: `--output` es
solo del propietario. `files upload` rechaza los archivos de credenciales, los perfiles de navegador y las carpetas de
WireCat salvo que el propietario añada `--allow-any-file`. `files delete`, `--replace` y los comandos de enlaces
públicos preguntan primero en una terminal. Una [sincronización de espejo](./mirrors.md#what-an-agent-may-do) comprueba
`files.upload` para cada archivo que envía y `files.delete` para cada archivo que reemplaza o mueve a una papelera, en
cualquier lado; un agente no puede añadir ni quitar un espejo. Por MCP solo los detiene `deny`, así que define `files.delete=deny` y
`files.share=deny` para un agente que no deba hacerlo, y `files.upload=deny` para uno que no deba poner ningún archivo
local en el Disk.

`ydisk personal mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él por tu
propio túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de cada inicio
de sesión que da, en la carpeta de estado, legible solo por ti. `ydisk personal mcp revoke` los olvida todos.

## Registros de ejecución

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `ydisk runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o contraseña, una contraseña
en un enlace, una cadena larga y opaca. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra que
escribiste, texto de mensajes incluido: uno escrito con su "+" y el prefijo del país, o de 11 a 15 dígitos seguidos,
así que un id largo de esa longitud también se oculta. Para no guardar ninguna de las palabras que escribes, ejecuta
`ydisk personal config set record_input false`.

Un secreto también se detecta por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
en un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 o más caracteres y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o un hash completo de commit. El valor que sigue al nombre de un secreto también
se oculta, ya vaya tras `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras tras un nombre de secreto y un espacio (`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash corto de commit o un UUID, una contraseña corta
escrita sin un nombre de secreto delante, y un secreto dentro de un enlace o una ruta de archivo salvo que tenga un
formato conocido o vaya tras un nombre de secreto.

## Permisos de archivos

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `ydisk doctor` lista
cada uno en `files.problems` e imprime el `chmod` que lo arregla. Windows no se comprueba. Informa de una
vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/ydisk-cli/blob/main/SECURITY.md).
