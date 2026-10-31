---
title: "Seguridad"
---

Lo que comparten las CLI de WireCat —el llavero, los permisos, MCP y lo que nunca llega a un registro— está en la
[página de seguridad común](https://wirecat.dev/en/docs/security). Esta página recoge solo lo propio de `gcal`.

`gcal` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `gcal doctor`. Solo se comunica con
Google, y pide acceso de lectura a Calendar y a tu dirección de correo. `session start --grant write` añade los
eventos, y `--grant sharing` añade quién puede ver un calendario: nada más.

Un agente conectado con `gcal <profile> mcp serve` puede cambiar quién ve tu calendario sin preguntarte. Tras
`--grant sharing` puede compartir un calendario con cualquier dirección, hacerlo público o quitarle el acceso a alguien.
También puede llamar al método que cede un calendario a otra cuenta; ese solo funciona para un administrador de Google
Workspace, y solo si la sesión tiene un permiso que `gcal` no pide. Por MCP no hay nadie que responda a una pregunta,
así que `ask` deja que todo esto se ejecute. Un agente no puede hacer que Google envíe un correo a la persona con quien
comparte: eso necesita `sharing.notify`, que está en `deny`. Aun así puede compartir sin avisar, con
`--send-notifications false`. Para reservarte la compartición, ejecuta
`gcal personal config set permissions.api.calendar.acl deny`, o inicia sesión sin `--grant sharing`. Vaciar un
calendario nunca se ofrece a un agente.

La sesión de Google se guarda en el llavero del sistema, con el servicio `gcal-cli`, una entrada por perfil. Esa entrada
también guarda el ID y el secreto de tu cliente de OAuth, así que renovar la sesión no vuelve a necesitar el archivo del
cliente. Google dice que el secreto de cliente de una aplicación de escritorio no es confidencial, pero `gcal` nunca lo
muestra. Ningún comando, error, registro ni registro de ejecución muestra un token ni el secreto del cliente; la
dirección de la página de inicio de sesión no contiene ninguno de los dos. `session end` borra la entrada. Una
ejecución con carpetas movidas (`GCAL_CONFIG_DIR`, `GCAL_STATE_DIR` u otro `HOME`) lee esa entrada pero nunca la
cambia: su propio inicio de sesión va a una entrada aparte, `gcal-cli:<config folder>`, y su `session end` borra solo
esa.

Cuando el llavero falla, o con `session start --credential-storage file`, esa misma entrada va a `credentials.json`
en la carpeta de estado de `gcal`, con modo 600: cualquiera que pueda leer tus archivos como tú puede leer la sesión.
`gcal` lo avisa una vez en stderr y nunca pregunta. Elige el archivo solo donde no funcione ningún llavero.

`gcal` rechaza un archivo de cliente de OAuth que puedan leer otros usuarios del ordenador. La dirección de correo de
la cuenta se guarda en la carpeta de estado de `gcal`, legible solo por ti, para que `session status` pueda responder
sin red.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así `gcal runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o contraseña, una contraseña
dentro de un enlace, una cadena larga y opaca. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra
que escribiste, también en el texto de un mensaje: uno escrito con su "+" y el código de país, o de 11 a 15 dígitos
seguidos, así que también se oculta un id largo de esa longitud. Para no guardar ninguna de las palabras que escribes,
ejecuta `gcal personal config set record_input false`.

Un secreto también se detecta por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
con un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 caracteres o más, y una secuencia de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o el hash completo de un commit. También se oculta el valor que sigue al nombre de
un secreto, tanto si va tras `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras tras el nombre de un secreto y un espacio
(`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una contraseña
corta escrita sin nombre de secreto delante, y un secreto dentro de un enlace o de una ruta de archivo, salvo que tenga
un formato conocido o vaya tras el nombre de un secreto.

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `gcal doctor` muestra
cada uno en `files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba. Informa de una
vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/gcal-cli/blob/main/SECURITY.md).
