---
title: "Seguridad"
---

Deja que un agente trabaje con tu espacio de trabajo de Attio mientras el token de acceso se queda fuera de sus
respuestas y de tus registros. El token lee todo el espacio de trabajo, así que quien lo tenga puede hacer lo que
permiten sus ámbitos.

Sabes dónde guarda `attio` el token, qué llega a Attio y nada más, y qué límites se mantienen para un agente le digan
lo que le digan.

Lo que comparten las herramientas de WireCat, como el llavero, los permisos, MCP y lo que nunca llega a un registro,
está en la [página de seguridad común](https://wirecat.dev/en/docs/security). Esta página solo recoge lo propio de
`attio`.

**En esta página:**

1. [Dónde guarda cada cosa y con quién habla](#where-it-keeps-what-and-whom-it-talks-to)
2. [Hasta dónde llega el token](#the-tokens-reach)
3. [Qué guarda la copia](#what-the-copy-holds)
4. [MCP en el navegador](#mcp-in-the-browser)
5. [Registros de ejecución](#run-records)
6. [Permisos de los archivos](#file-modes)

## Dónde guarda cada cosa y con quién habla

`attio` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `attio doctor`. Solo envía
peticiones a `api.attio.com`, por HTTPS. `app.attio.com`, la página de inicio de sesión de Attio, también está
permitida, para un inicio de sesión en el navegador que esta versión todavía no usa.

`session start` lee el token por stdin o con una pregunta oculta, nunca de un argumento. Lo guarda en el llavero del
sistema, o en un archivo privado con `--credential-storage file`. El token solo va en la cabecera `Authorization` de
una petición a Attio. Nunca llega a una dirección, la salida, un error, un registro ni un registro de ejecución.
`session end` lo olvida en este ordenador. Para que deje de funcionar en todas partes, bórralo en Attio: Workspace
settings → Developers.

## Hasta dónde llega el token

Un token de acceso de Attio pertenece al espacio de trabajo, no a una persona, y solo un administrador del espacio de
trabajo puede crear uno. Lee cada registro que permiten sus ámbitos, no solo los tuyos. Dale solo los tres ámbitos
de lectura de [instala](./installation.md#make-an-access-token-in-attio): entonces Attio rechaza toda escritura hecha
con él, le pida lo que le pida un agente. Los tokens de Attio no caducan, así que borra el que ya no uses.

## Qué guarda la copia

`sync` guarda las negociaciones del espacio de trabajo, y las personas y empresas que aparecen en ellas, en el almacén
local de WireCat de este ordenador, donde cualquier herramienta de WireCat puede leerlas: la etapa, el importe, la
empresa, las personas y el responsable de una negociación, y el nombre, los correos, los teléfonos y el cargo de una
persona. Cada registro guarda solo sus valores actuales. `people` y `organizations` leen Attio en directo y no añaden
nada a la copia.

El texto de Attio, como los títulos de negociaciones, los nombres y los valores de atributos, llega a un agente
marcado como `untrusted`, así que el agente lo lee como datos, no como una instrucción.

## MCP en el navegador

`attio work mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él por tu
propio túnel. Cada aplicación entra con un código de un solo uso, y el servidor guarda un hash de cada acceso que da,
en la carpeta de estado, que solo tú puedes leer. `attio work mcp revoke` los olvida todos.

## Registros de ejecución

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `attio runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o contraseña, una contraseña
en un enlace, una cadena larga y opaca. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra que
escribiste: uno escrito con su "+" y el prefijo del país, o de 11 a 15 dígitos seguidos, así que un id largo de esa
longitud también se oculta. Para no guardar ninguna de las palabras que escribes, ejecuta
`attio work config set record_input false`.

Un secreto también se reconoce por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
en un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 o más caracteres, y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o un hash de commit completo. El valor después del nombre de un secreto también
se oculta, vaya tras `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras tras el nombre de un secreto y un espacio
(`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una contraseña
corta escrita sin nombre de secreto delante, y un secreto dentro de un enlace o una ruta de archivo, salvo que tenga
un formato conocido o vaya tras el nombre de un secreto.

## Permisos de los archivos

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `attio doctor` los
lista en `files.problems` e imprime el `chmod` que lo arregla. Windows no se comprueba. Informa de una vulnerabilidad
como dice [SECURITY.md](https://github.com/WireCatLabs/attio-cli/blob/main/SECURITY.md).
