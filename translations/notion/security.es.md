---
title: "Seguridad"
---

Lo que comparten todas las CLI de WireCat (el llavero, los permisos, MCP y lo que nunca llega a un registro) está en
la [página de seguridad común](https://wirecat.dev/en/docs/security). Aquí solo queda lo propio de `notion`.

`notion` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `notion doctor`. Solo se conecta
a `api.notion.com`. `session start` guarda tu token de Notion en el llavero del sistema, bajo `token:<profile>`, o en
un archivo privado donde no funciona ningún llavero. El token solo va en la cabecera Authorization de la petición,
nunca en una dirección, una respuesta, un registro de ejecución o el diario de envíos. Se lee de `WCNOTION_TOKEN`,
nunca de `NOTION_TOKEN`, que lee el propio servidor MCP de Notion. `session end` borra solo esa entrada. La CLI propia
de Notion guarda sus tokens bajo el mismo nombre en el llavero, `notion-cli`, y esos se quedan.

Los enlaces de Notion a archivos subidos van firmados y abren el archivo durante una hora. `documents get` quita la
firma de cada uno antes de imprimir la página, así que su salida nunca lleva un enlace que abra un archivo. El texto
de las páginas, los títulos y los nombres de las propiedades los escriben otros miembros del espacio de trabajo. Un
agente los lee como datos, nunca como instrucciones.

`notion personal mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él a
través de tu propio túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de
cada inicio de sesión que concede, en la carpeta de estado, legible solo por ti. `notion personal mcp revoke` los
olvida todos.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `notion runs show` te dice qué
se ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o de contraseña, una
contraseña en un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de la
palabra que escribiste, también en el texto de un mensaje: uno escrito con su "+" y el código de país, o de 11 a 15
dígitos seguidos, así que también se oculta un id largo de esa longitud. Para no guardar ninguna de las palabras que
escribes, ejecuta `notion personal config set record_input false`.

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
`notion doctor` muestra cada uno en `files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba.
Informa de una vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/notion-cli/blob/main/SECURITY.md).
