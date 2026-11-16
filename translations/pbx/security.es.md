---
title: "Seguridad"
---

En las llamadas hay números, nombres y la propia conversación. Antes de conectar la centralita, conviene saber qué
hace `pbx` con ella, qué guarda en tu ordenador y qué puede salir fuera. Aquí solo queda lo propio de `pbx`. Lo que
comparten todas las CLI de WireCat está en la
[página de seguridad común](https://wirecat.dev/en/docs/security): el llavero, los permisos, MCP (el protocolo con el
que un agente llama a los comandos) y lo que nunca llega a un registro.

Sabrás qué lee `pbx` en la centralita, dónde guarda las contraseñas, qué hay en el almacén y cuándo la voz de una
llamada va a la nube.

`pbx` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `pbx doctor`. Lee la centralita y
nunca escribe en ella. Abre Master.csv y las grabaciones solo para lectura. La sesión de base de datos también se abre
en solo lectura y envía un `SELECT` de la tabla del CDR (los registros de llamadas), con los valores como parámetros.
Dale un usuario que no pueda hacer nada más, como muestra [conecta tu Asterisk](./installation.md#a-cdr-database).
No expongas a internet la base de datos ni AMI (la interfaz con la que los programas controlan Asterisk).

**En esta página:**

1. [Qué guarda el almacén](#what-the-store-holds)
2. [Grabaciones y consentimiento](#recordings-and-consent)
3. [El servidor MCP](#the-mcp-server)
4. [Qué oculta un registro de ejecución](#what-a-run-record-hides)
5. [Archivos en este ordenador](#files-on-this-computer)

`session start` guarda las contraseñas que necesita un perfil (el nombre que diste a la conexión con una
centralita). Las guarda en el llavero del sistema (el lugar donde el sistema guarda las contraseñas), o en un
archivo privado donde no funciona ningún llavero. Son la contraseña del usuario de la base de datos y, si no hay archivo de
clave, la del usuario SSH o SFTP. Se guardan juntas, en una sola entrada del llavero para ese perfil. Cada una se lee
oculta o desde stdin, nunca desde la línea de comandos. Se comprueba antes de guardarla. Solo va al controlador de la
base de datos o a la conexión SSH. Nunca llega a una respuesta, un error, un registro de ejecución o un log. Un
perfil con un Master.csv local no guarda ninguna.

`pbx` usa un servidor SFTP o SSH solo después de que fijaste su clave. A un servidor cuya clave no coincide, `pbx` no
le envía ninguna contraseña ni archivo de clave. El túnel SSH a una base de datos (una conexión a ella a través del
acceso SSH de la centralita) solo lleva los datos hasta ella. No ejecuta ningún comando en la centralita y no abre
ningún puerto en tu ordenador.

<a id="what-the-store-holds"></a>

## Qué guarda el almacén

El almacén de WireCat guarda los números de quienes llaman y sus nombres del identificador de llamada (el nombre de
quien llama que pasó la centralita), las extensiones, las horas de las llamadas, las rutas de las grabaciones y, una
vez transcritas, lo que se dijo. No guarda una copia de la grabación. Trata el almacén como las propias llamadas:
está en este ordenador y solo tu usuario puede leerlo. Las transcripciones, los nombres y los números llegan al
agente marcados como datos no fiables, nunca como instrucciones.

La voz se reconoce en este ordenador. Ninguna grabación ni transcripción va a un servicio externo, salvo que pongas
`transcribe_engine openai` en un perfil. Entonces la voz de cada grabación va a OpenAI, o a la dirección del modelo
de IA común de WireCat compatible con OpenAI. La ejecución dice adónde va antes de que salga el primer trozo. El
número de la llamada, los nombres y las horas no se envían; consulta
[transcripción en la nube](./installation.md#cloud-transcription). Una grabación leída por SFTP se copia a un archivo
temporal privado (`0600`) mientras se lee, y después se borra.

<a id="recordings-and-consent"></a>

## Grabaciones y consentimiento

Grabar una llamada, guardarla y convertirla en texto puede requerir el consentimiento de las personas que participan.
La ley de tu país decide cómo (en Rusia, por ejemplo, la ley 152-FZ de datos personales). Avisar a quien llama de que
la llamada se graba, y guardar las grabaciones solo el tiempo permitido, son deberes del titular de la centralita.
`pbx` solo lee las grabaciones que la centralita ya hizo, y no borra ninguna.

<a id="the-mcp-server"></a>

## El servidor MCP

`pbx personal mcp serve --http` escucha solo en `127.0.0.1`. Sirve a aplicaciones del navegador que llegan a él a
través de tu propio túnel. Cada aplicación inicia sesión con un código de un solo uso. El servidor guarda un hash de
cada inicio de sesión que concede, en la carpeta de estado, que solo tú puedes leer. `pbx personal mcp revoke` los
olvida todos.

<a id="what-a-run-record-hides"></a>

## Qué oculta un registro de ejecución

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `pbx runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o de contraseña, una
contraseña en un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de la
palabra que escribiste, también en el texto de un mensaje. Así se oculta un número escrito con su "+" y el código de
país, o de 11 a 15 dígitos seguidos. Por eso también se oculta un id largo de esa longitud. Para no guardar ninguna de
las palabras que escribes, ejecuta `pbx personal config set record_input false`.

Un secreto también se reconoce por su aspecto, en un registro de ejecución y en un mensaje de error guardado. Es un
token con un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer` o una
cadena de aspecto aleatorio de 20 caracteres o más. También es una serie de aspecto aleatorio de 20 o más caracteres
hexadecimales en minúscula, como una clave hexadecimal o el hash completo de un commit. También se oculta el valor que
sigue al nombre de un secreto, venga después de `=`, de `:` o de un espacio: `password=`, `API_TOKEN=`,
`password hunter2`, `pin 1234`. Algunos secretos parecen palabras normales y se quedan en el registro:

- un valor solo de letras tras el nombre de un secreto y un espacio (`pin this message` se queda);
- una clave hexadecimal en mayúsculas;
- un hash de commit corto o un UUID;
- una contraseña corta escrita sin el nombre de un secreto delante;
- un secreto dentro de un enlace o de una ruta de archivo, salvo que tenga un formato conocido o vaya tras el nombre
  de un secreto.

<a id="files-on-this-computer"></a>

## Archivos en este ordenador

`config.json` se guarda de modo que solo tú puedas leerlo (`0600`), y su carpeta se crea solo para ti (`0700`). Un
archivo o una carpeta que creó una versión anterior puede estar abierto a otros usuarios del ordenador. `pbx doctor`
muestra cada uno en `files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba. Informa de una
vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/asterisk-cli/blob/main/SECURITY.md).
