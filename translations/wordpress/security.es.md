---
title: "Seguridad"
---

Deja que un agente trabaje con tu sitio WordPress mientras la contraseña de aplicación queda fuera de sus respuestas y
de tus registros. La contraseña puede hacer lo que puede tu usuario de WordPress, así que quien la tenga puede hacer
lo mismo.

Sabes dónde guarda `wordpress` la contraseña, que solo tu sitio recibe sus peticiones y qué límites se mantienen para
un agente le digan lo que le digan.

Lo que comparten las herramientas de WireCat, como el llavero, los permisos, MCP y lo que nunca llega a un registro,
está en la [página de seguridad común](https://wirecat.dev/en/docs/security). Esta guía recoge solo lo propio de
`wordpress`.

**En esta página:**

1. [Dónde guarda cada cosa y con quién habla](#where-it-keeps-what-and-whom-it-talks-to)
2. [El alcance de la contraseña](#the-passwords-reach)
3. [Lo que tiene la copia](#what-the-copy-holds)
4. [MCP en el navegador](#mcp-in-the-browser)
5. [Registros de ejecución](#run-records)
6. [Modos de archivo](#file-modes)

## Dónde guarda cada cosa y con quién habla

`wordpress` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `wordpress doctor`. Envía
peticiones solo al sitio que nombraste en `session start`. La contraseña va solo a ese sitio, nunca a otro sitio del
mismo host.

`session start` lee la contraseña de aplicación de stdin o de una pregunta oculta, nunca de un argumento. La guarda
con su sitio en el llavero del sistema, o en un archivo privado con `--credential-storage file`. La contraseña va solo
en la cabecera `Authorization` de una petición a tu sitio. Nunca llega a una dirección, la salida, un error, un
registro ni un registro de ejecución. `session end` la olvida en este ordenador. Para que deje de funcionar en todas
partes, anúlala en WordPress: Usuarios → Perfil → Contraseñas de aplicación.

## El alcance de la contraseña

Una contraseña de aplicación pertenece a un usuario de WordPress y puede hacer lo que puede ese usuario, nada más. La
contraseña de un Administrador puede cambiar todo el sitio a través del grupo `api`, también los plugins, los usuarios
y los ajustes. Inicia sesión con el rol que necesita el trabajo, y limita lo que puede cambiar un agente con los
[permisos](./permissions.md). Las contraseñas de aplicación no caducan, así que anula la que ya no uses.

## Lo que tiene la copia

`sync` guarda tus entradas y páginas, con todos sus estados y la papelera, sus etiquetas y categorías, y los usuarios
que escriben, en el almacén local de WireCat de este ordenador, donde cualquier herramienta de WireCat puede leerlos.
De un usuario se guardan su nombre, su correo y su slug. Los borradores y las entradas privadas también están en la
copia, así que protege este ordenador como proteges tu acceso a wp-admin.

El texto de WordPress, como los títulos, el texto y los extractos de entradas y páginas, y los nombres de etiquetas,
categorías y autores, llega a un agente marcado como `untrusted`. El agente lo lee como datos, no como una
instrucción. Las entradas que escriben otros pueden tener texto dirigido a un agente.

## MCP en el navegador

`wordpress blog mcp serve --http` escucha solo en `127.0.0.1`, para apps del navegador que llegan a él a través de tu
propio túnel. Cada app inicia sesión con un código de un solo uso, y el servidor guarda un hash de cada inicio de
sesión que da, en la carpeta de estado, legible solo por ti. `wordpress blog mcp revoke` los olvida todos.

## Registros de ejecución

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `wordpress runs show` te dice qué
se ejecutó. Un secreto se guarda igualmente como `[redacted]`: una opción con nombre de token o contraseña, una
contraseña dentro de un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de
la palabra que escribiste: uno escrito con su "+" y su código de país, o de 11 a 15 dígitos seguidos, así que un id
largo de esa longitud también se oculta. Para no guardar ninguna de las palabras que escribes, ejecuta
`wordpress blog config set record_input false`.

Un secreto también se detecta por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
con un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 caracteres o más, y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o un hash de commit completo. También se oculta el valor que sigue al nombre de
un secreto, venga después de `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras después del nombre de un secreto y un espacio
(`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una contraseña
corta escrita sin el nombre de un secreto delante, y un secreto dentro de un enlace o una ruta de archivo, salvo que
tenga un formato conocido o siga al nombre de un secreto.

## Modos de archivo

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta que creó una versión anterior puede estar abierto a otros usuarios del ordenador: `wordpress doctor` muestra
cada uno en `files.problems` e imprime el `chmod` que lo corrige. Windows no se comprueba. Informa de una
vulnerabilidad como indica
[SECURITY.md](https://github.com/WireCatLabs/wordpress-cli/blob/main/SECURITY.md).
