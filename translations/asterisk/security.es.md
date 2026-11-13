---
title: "Seguridad"
---

Lo que comparten todas las CLI de WireCat (el llavero, los permisos, MCP y lo que nunca llega a un registro) está en
la [página de seguridad común](https://wirecat.dev/en/docs/security). Aquí solo queda lo propio de `asterisk`.

`asterisk` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `asterisk doctor`. Lee la
centralita y nunca escribe en ella: Master.csv y las grabaciones se abren solo para lectura, y una sesión de base de
datos se abre en solo lectura y envía un `SELECT` de la tabla del CDR, con los valores como parámetros. Dale un usuario
que no pueda hacer nada más, como muestra [conecta tu Asterisk](./asterisk.md#a-cdr-database), y no expongas la base de
datos ni AMI a internet.

`session start` guarda la contraseña de la base de datos en el llavero del sistema, o en un archivo privado donde no
funciona ningún llavero. La contraseña se lee oculta o desde stdin, nunca desde la línea de comandos, y se comprueba
antes de guardarla. Solo va al controlador de la base de datos, nunca a una respuesta, un error, un registro de
ejecución o un log. Un perfil con un Master.csv local no guarda ninguna.

## Qué guarda el almacén

El almacén de WireCat guarda los números de quienes llaman y sus nombres del identificador de llamada, las
extensiones, las horas de las llamadas, las rutas de las grabaciones y, una vez transcritas, lo que se dijo. No guarda
una copia de la grabación. Trata el almacén como las propias llamadas: está en este ordenador y solo tu usuario puede
leerlo. Las transcripciones, los nombres y los números llegan al agente marcados como datos no fiables, nunca como
instrucciones.

La voz se reconoce en este ordenador. Ninguna grabación ni transcripción va a un servicio externo.

## Grabaciones y consentimiento

Grabar una llamada, guardarla y convertirla en texto puede requerir el consentimiento de las personas que participan,
y la ley de tu país decide cómo (en Rusia, por ejemplo, la ley 152-FZ de datos personales). Avisar a quien llama de
que la llamada se graba, y guardar las grabaciones solo el tiempo permitido, son deberes del titular de la
centralita. `asterisk` solo lee las grabaciones que la centralita ya hizo, y no borra ninguna.

`asterisk personal mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él a
través de tu propio túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de
cada inicio de sesión que concede, en la carpeta de estado, legible solo por ti. `asterisk personal mcp revoke` los
olvida todos.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `asterisk runs show` te dice qué
se ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o de contraseña, una
contraseña en un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de la
palabra que escribiste, también en el texto de un mensaje: uno escrito con su "+" y el código de país, o de 11 a 15
dígitos seguidos, así que también se oculta un id largo de esa longitud. Para no guardar ninguna de las palabras que
escribes, ejecuta `asterisk personal config set record_input false`.

Un secreto también se reconoce por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
con un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 caracteres o más, y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o el hash completo de un commit. También se oculta el valor que sigue al nombre
de un secreto, venga después de `=`, de `:` o de un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`.
Algunos secretos parecen palabras normales y se quedan: un valor solo de letras tras el nombre de un secreto y un
espacio (`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una
contraseña corta escrita sin el nombre de un secreto delante, y un secreto dentro de un enlace o de una ruta de archivo,
salvo que tenga un formato conocido o vaya tras el nombre de un secreto.

`config.json` se guarda de modo que solo tú puedas leerlo (`0600`), y su carpeta se crea solo para ti (`0700`). Un
archivo o una carpeta que creó una versión anterior puede estar abierto a otros usuarios del ordenador:
`asterisk doctor` muestra cada uno en `files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba.
Informa de una vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/asterisk-cli/blob/main/SECURITY.md).
