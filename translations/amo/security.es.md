---
title: "Seguridad"
---

Da tu CRM a un agente de IA sin entregarle el token ni los teléfonos de tus clientes. El token actúa con los permisos
de un administrador, así que `amo` lo guarda donde ninguna salida, ningún registro y ningún agente pueden leerlo.

Tu agente trabaja con tus negociaciones y nunca ve el token. Cada ejecución se registra con los secretos y los números
de teléfono ocultos, así que después puedes comprobar qué hizo un agente.

El llavero, los permisos, MCP y los registros funcionan igual en todas las herramientas de WireCat, como describe la
[página de seguridad común](https://wirecat.dev/en/docs/security). `amo` añade lo que es suyo: el token de amoCRM,
los hosts a los que se conecta y el inicio de sesión del navegador por MCP.

**En esta página:**

1. [El token y la cuenta](#the-token-and-the-account)
2. [Teléfonos y correos de los clientes](#clients-phones-and-e-mails)
3. [api call](#api-call)
4. [MCP en el navegador](#mcp-in-the-browser)
5. [Registros de ejecución](#run-records)
6. [Archivos de ajustes](#settings-files)

## El token y la cuenta

`amo` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `amo doctor`. `session start`
guarda el token de larga duración y la dirección de la cuenta en el llavero del sistema (servicio `amo-cli`, cuenta
`token:<profile>`), o en un archivo privado donde no funciona ningún llavero. Un inicio de sesión con la integración se
guarda en el mismo sitio (cuenta `oauth:amocrm:<profile>`): el ID y la clave secreta de la integración, el token de
acceso y el refresh token. El token va solo en la cabecera Authorization de la petición, nunca en una dirección, una
respuesta, un registro de ejecución ni el diario de envíos. `amo` solo se conecta a la cuenta en la que iniciaste
sesión, un host bajo `amocrm.ru`, `amocrm.com` o `kommo.com`, y nunca sigue una redirección. amoCRM no tiene ninguna
llamada que retire un token: tras una filtración, retíralo en la pestaña «Выданные доступы» de la integración (en
Kommo, Authorization), como muestra [instala y conecta](./installation.md#sign-out-and-revoke-access).

## Teléfonos y correos de los clientes

Un contacto o una empresa de tus propias negociaciones viene con sus teléfonos y correos. Un usuario que no es
administrador ve los de como máximo 100 contactos y empresas más al día, contando juntos al usuario y a sus agentes.
La cuenta se lleva en este ordenador: detiene un accidente o a un agente, no a alguien que quiere llevarse la base.

Una llamada copiada con el ajuste de actividades solo guarda su dirección (entrante o saliente), nunca el número de
teléfono ni la grabación. El resumen matutino oculta los números de teléfono y las direcciones de correo, y nunca
imprime el texto de una nota.

## api call

`api call` llega a cualquier operación de la API v4 de amoCRM, así que lleva más comprobaciones que un comando.
Comprueba la clave de permiso propia de la operación y la clave del comando que hace lo mismo. Una lectura de
contactos, empresas, notas, eventos o no clasificados se rechaza a cualquiera que no sea administrador, porque
contienen teléfonos y correos de clientes. Un enlace con un token de acceso en una respuesta se quita antes de que lo
veas. `api call` nunca se ofrece por MCP.

## MCP en el navegador

`amo work mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él por tu
propio túnel. Cada aplicación entra con un código de un solo uso, y el servidor guarda un hash de cada acceso que da,
en la carpeta de estado, que solo tú puedes leer. `amo work mcp revoke` los olvida todos.

## Registros de ejecución

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `amo runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o contraseña, una contraseña
en un enlace, una cadena larga y opaca. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra que
escribiste, también en el texto de un mensaje: uno escrito con su "+" y el prefijo del país, o de 11 a 15 dígitos
seguidos, así que un id largo de esa longitud también se oculta. Para no guardar ninguna de las palabras que escribes,
ejecuta `amo work config set record_input false`.

Un secreto también se reconoce por su aspecto, en un registro de ejecución y en un mensaje de error guardado: un token
en un formato conocido (GitHub, OpenAI, Slack, AWS, Stripe, npm y similares), una credencial `Bearer`, una cadena de
aspecto aleatorio de 20 o más caracteres, y una serie de aspecto aleatorio de 20 o más caracteres hexadecimales en
minúscula, como una clave hexadecimal o un hash de commit completo. El valor después del nombre de un secreto también
se oculta, vaya tras `=`, `:` o un espacio: `password=`, `API_TOKEN=`, `password hunter2`, `pin 1234`. Algunos
secretos parecen palabras normales y se quedan: un valor solo de letras tras el nombre de un secreto y un espacio
(`pin this message` se queda), una clave hexadecimal en mayúsculas, un hash de commit corto o un UUID, una contraseña
corta escrita sin nombre de secreto delante, y un secreto dentro de un enlace o una ruta de archivo, salvo que tenga
un formato conocido o vaya tras el nombre de un secreto.

## Archivos de ajustes

`config.json` se guarda legible solo por ti (`0600`), y su carpeta se crea solo para ti (`0700`). Un archivo o una
carpeta creados por una versión anterior pueden estar abiertos a otros usuarios del ordenador: `amo doctor` los lista
en `files.problems` e imprime el `chmod` que lo arregla. Windows no se comprueba. Informa de una vulnerabilidad como
dice [SECURITY.md](https://github.com/WireCatLabs/amo-cli/blob/main/SECURITY.md).
