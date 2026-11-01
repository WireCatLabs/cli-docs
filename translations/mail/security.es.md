---
title: "Seguridad"
---

Lo que comparten las CLI de WireCat —el llavero, los permisos, MCP y lo que nunca llega a un registro— está en la
[página de seguridad común](https://wirecat.dev/en/docs/security). Esta página recoge solo lo propio de `mail`.

`mail` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `mail doctor`. Solo se comunica con el
servidor IMAP de cada perfil, por TLS o STARTTLS; una conexión sin cifrado se rechaza. No puede enviar correo y nunca cambia el buzón. Pero `memo` tiene
`memo mail delete`, que mueve el correo de Gmail a la papelera. Un agente con acceso de escritura a memo puede cambiar el correo; un
agente que solo tiene `mail` no puede.

`session start` en un perfil nuevo busca el servidor de una dirección cuyo dominio no está en su tabla integrada (Yandex,
Gmail, iCloud, Mail.ru, Fastmail, Outlook). Envía el dominio, nunca la dirección completa, a tres sitios: tu resolvedor
DNS, para el registro MX del dominio; la lista de servidores de correo de Thunderbird en `https://autoconfig.thunderbird.net`; y
`https://autoconfig.<domain>`, el servidor propio del dominio. Se detiene en la primera respuesta. `--provider` (un nombre
de la tabla) o `--host` omite toda búsqueda, y nada sale del ordenador antes del inicio de sesión en ese servidor.

La contraseña de aplicación se escribe en una terminal sin eco, o se fija en `MAIL_PASSWORD` para una ejecución sin terminal. Va al
llavero del sistema operativo (servicio
`mail-cli`, cuenta el nombre del perfil) solo después de que el servidor la acepte. Nunca es un argumento, nunca forma parte de una
dirección, nunca se escribe en `config.json`, en un registro ni en un registro de ejecución. Cuando el llavero falla, va en su lugar a `credentials.json` en la carpeta
de configuración de `mail`, con modo 600, y `mail` lo avisa una vez por stderr; `--credential-storage file` elige ese
archivo directamente, algo que no recomendamos. `session end` la borra. `mail` puede leer la antigua entrada de Himalaya; nunca la escribe.

Una ejecución con carpetas movidas (`MAIL_CONFIG_DIR` y sus vecinas, o un `HOME` o una carpeta XDG distintos de los tuyos)
lee tu entrada `mail-cli`, pero nunca la reemplaza ni la elimina; la contraseña que guarda va a una entrada temporal
propia. `session end` allí elimina solo esa entrada temporal; con tu contraseña no elimina nada y responde
`"kept": "owners-sign-in"`.

Todo lo que hay en un mensaje lo escribe otra persona: el asunto, el cuerpo, las cabeceras, el nombre del remitente, los nombres de
carpetas y de archivos. `sync` lo guarda como texto y nunca sigue un enlace ni ejecuta nada de lo que contiene. Los bytes de los adjuntos
no se guardan. Un agente que lee correo sincronizado debe tratarlo como datos, nunca como instrucciones.

`mail ya mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones de navegador que llegan a él a través de tu propio
túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de cada inicio de sesión que concede, en la carpeta
de estado, legible solo por ti. `mail ya mcp revoke` los olvida todos.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `mail runs show` te dice qué se ejecutó. Un
registro de ejecución y un mensaje de error sustituyen parte del texto por `[redacted]`: el valor de una opción o de un enlace que
contiene un token o una contraseña, un token con formato conocido, una cadena larga de aspecto aleatorio y un número de teléfono,
también dentro del texto de un mensaje. Un secreto con aspecto de palabra normal puede quedarse, así que no escribas uno. Para no
guardar ninguna de las palabras que escribes, ejecuta `mail personal config set record_input false`.

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `mail doctor` muestra cada uno en
`files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba. Informa de una vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/mail-cli/blob/main/SECURITY.md).
