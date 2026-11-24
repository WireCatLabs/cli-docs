---
title: "Seguridad"
---

Lo que comparten las CLI de WireCat, como el llavero, los permisos, MCP y lo que nunca llega a un registro, está en la
[página de seguridad común](https://wirecat.dev/en/docs/security). Esta página recoge solo lo propio de `slk`.

`slk` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `slk doctor`. Solo se conecta a
`slack.com`. `session start` guarda el token de usuario de Slack en el llavero del sistema, o en un archivo privado
donde no hay llavero. El token va solo en la cabecera Authorization de la petición, nunca en una dirección, una
respuesta, un registro de ejecución ni el diario de envíos.

`slk personal mcp serve --http` escucha solo en `127.0.0.1`, para las aplicaciones del navegador que llegan a él a
través de tu propio túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de
cada sesión que concede, en la carpeta de estado, legible solo por ti. `slk personal mcp revoke` las olvida todas.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `slk runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o contraseña, una contraseña
en un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra que
escribiste, también en el texto de un mensaje: uno escrito con su "+" y el prefijo del país, o de 11 a 15 dígitos
seguidos, así que un id largo de esa longitud también se oculta. Para no guardar ninguna de las palabras que escribes,
ejecuta `slk personal config set record_input false`.

Un secreto también se reconoce por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
de formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 caracteres o más y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o un hash de commit completo. También se oculta el valor que sigue al nombre de
un secreto, venga después de `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras tras el nombre de un secreto y un espacio
(`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una contraseña
corta escrita sin nombre de secreto delante, y un secreto dentro de un enlace o una ruta de archivo, salvo que tenga un
formato conocido o vaya tras el nombre de un secreto.

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `slk doctor` enumera
cada uno en `files.problems` e imprime el `chmod` que lo arregla. En Windows no se comprueba. Informa de una
vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/slack-cli/blob/main/SECURITY.md).
