---
title: "Seguridad"
---

Lo que comparten las CLI de WireCat —el llavero, los permisos, MCP y lo que nunca llega a un registro— está en la
[página de seguridad común](https://wirecat.dev/en/docs/security). Esta página recoge solo lo propio de `b24`.

`b24` guarda sus ajustes en `config.json` y su estado en las carpetas que muestra `b24 doctor`. Solo se comunica con el
portal del webhook o de la aplicación local del perfil, y con `oauth.bitrix.info` para los tokens de la aplicación,
por HTTPS, y nunca sigue una redirección.

La dirección del webhook lleva su secreto en la ruta, así que la dirección entera es la contraseña. `b24` la guarda en
el llavero del sistema (servicio `bitrix24-cli`, cuenta `token:<profile>`), o en un archivo privado con
`--credential-storage file`, y nunca la escribe en la salida, en un error, en un registro ni en un registro de
ejecución: una ejecución guarda el método y `/rest/:user/:token/<method>`, nunca la dirección. Un error guarda el código
de error de Bitrix24 y los nombres de los campos que rechazó, nunca la descripción de Bitrix24, que puede citar lo que
se escribió.

El inicio de sesión de una aplicación local se guarda en el mismo sitio (cuenta `oauth:bitrix24:<profile>`): el
código y la clave de la aplicación, el token de acceso, que dura una hora, y el token de renovación, que dura 180 días
y cambia en cada renovación. La clave va solo a `oauth.bitrix.info`, como pide Bitrix24, nunca al portal. El token va
al portal en el cuerpo de cada llamada, nunca en su dirección. Ninguno llega a la salida, a un error, a un registro ni
a un registro de ejecución. El inicio de sesión vuelve por la página `https://wirecat.dev/webhooks/apps/b24-callback`,
que en tu navegador pasa el código de un solo uso a `b24` en este ordenador. El código vale 30 segundos y solo junto
con la clave. Bitrix24 no tiene ninguna llamada que revoque un token: `session end` olvida el inicio de sesión aquí, y
borrar la aplicación en el portal lo detiene.

El webhook actúa con los derechos del empleado que lo creó. Un webhook creado por un administrador deja que un agente
lea y cambie todo el CRM. `session status --check` dice de quién son los derechos que lleva; crea el webhook con un
empleado cuyos derechos se ajusten al trabajo, y solo con los permisos de acceso que necesita. `sync` usa `crm`,
`user_basic` para las direcciones de correo de los empleados y `department` para la estructura de la empresa.
`user_basic` basta: `sync` nunca cambia a un empleado, y el permiso completo `user` añade el derecho de invitarlos y
editarlos. La sincronización guarda el nombre, la dirección de correo, el cargo y el jefe de departamento de cada
empleado en el almacén local, donde cualquier herramienta de WireCat puede leerlos.

Salvo que el usuario del webhook sea administrador de Bitrix24, la sincronización copia solo sus propios clientes: los
contactos y las empresas asignados a él o nombrados en sus negociaciones y prospectos. Las listas muestran teléfonos y
correos solo de esos. `people
show` y `organizations show` los dan para los de otros, como mucho 100 al día entre el usuario y sus agentes. Esa
cuenta se lleva en este ordenador, así que frena un descuido o a un agente, no a alguien que quiera llevarse la base.
Eso lo hacen los propios derechos de acceso de Bitrix24.

Cada escritura se comprueba contra los permisos y se guarda en el diario de envíos. `B24_READ_ONLY=1` rechaza toda
escritura. Asignar un elemento a otro empleado se rechaza hasta que lo permitas. Un cambio de etapa aún puede poner en
marcha los robots del propio portal, que pueden escribir a tus clientes. Si tu portal tiene esos robots, pon
`permissions.deals.move` y `permissions.leads.move` en `readonly` o `deny` antes de que un agente reciba el perfil por
MCP, donde `ask` no pregunta
([permisos](./permissions.md#stage-changes-start-the-portals-robots)). Toda escritura que fija una etapa los
comprueba; una etapa ganada o perdida, y `close`, comprueban además `deals.close` o `leads.close`, y `api call` con un
`stageId` comprueba ambos. Se rechaza un `--field` de negociación o prospecto que nombra una etapa, un embudo o un
responsable. Borrar una negociación o un prospecto pregunta antes. `api.crm.deal.update: deny` también detiene
`deals update`, `move` y `close`, y en `ask` también preguntan.

`search all` lee lo que permiten las claves de las listas: con `deals.list: deny` deja fuera las negociaciones, con
`leads.list: deny` los prospectos, y nombra cada tipo que dejó fuera en `missing` y en stderr. Si se le niegan todos
los tipos que se le pidieron, se rechaza.

`api call` funciona con una lista de permitidos. Permite las lecturas de CRM, catálogo, usuarios y departamentos que
hace el propio `b24`, y las escrituras de negociaciones, prospectos, contactos y empresas. Las lecturas de contactos y
empresas son solo de un administrador, digan lo que digan los permisos. Tanto las lecturas como las escrituras
comprueban la clave del comando que lee o escribe los mismos elementos: `api call crm.deal.list` comprueba
`deals.list`, y `crm.item.update` con `entityTypeId` 2 comprueba `deals.update`.
`department.get` comprueba `users.list`, y `crm.mycompany.*` comprueba `organizations.list`. Se rechazan antes de enviar nada un
cuerpo que nombra un campo dos veces con cualquier grafía (`assignedById` y `ASSIGNED_BY_ID`, `fields` y `FIELDS`), un
`entityTypeId` que no es un número simple y un método con un sufijo distinto de un único `.json`. Un borrado pregunta.
Cualquier otro método también pregunta, y se rechaza sin terminal salvo que pases `--yes`. Los métodos que envían
mensajes a personas, publican o sacan datos se rechazan hasta que los permitas: `im`, `imopenlines`, `imbot`,
`imconnector`, `log.blogpost`, SMS, correo, telefonía, procesos de negocio, actividades del CRM, tareas, `user.add`,
enlaces públicos a archivos, `event.bind` y `batch`. También se rechazan sus lecturas, porque contienen mensajes,
correos y tareas. `api show <method>` indica el nivel de un método. `api call` no se ofrece por MCP.

`schedule command` instala un temporizador (systemd, launchd o el Programador de tareas) que ejecuta `b24` por su
cuenta, sin terminal. El temporizador ejecuta `b24 schedule exec <file>`, y el archivo de la programación, en la
carpeta de estado, guarda las palabras, el perfil, tu `PATH` y las carpetas que usa `b24` (`B24_CONFIG_DIR`,
`B24_STATE_DIR`, `MESSAGING_STORE`), nunca la dirección del webhook. Cada ejecución vuelve a comprobar los permisos.
`B24_READ_ONLY` rechaza `schedule command`, `remove`, `run` y `exec`, y ninguna herramienta MCP ofrece `schedule`.

Una escritura que no recibió respuesta no se vuelve a enviar: queda como `outcome_unknown` con su `operation_id`.
Comprueba el portal y repítela solo si el cambio no está: Bitrix24 haría la repetición por segunda vez.

`b24 work mcp serve --http` escucha solo en `127.0.0.1`, para aplicaciones del navegador que llegan a él a través
de tu propio túnel. Cada aplicación inicia sesión con un código de un solo uso, y el servidor guarda un hash de cada
inicio de sesión que concede, en la carpeta de estado, que solo tú puedes leer. `b24 work mcp revoke` los olvida
todos.

Un registro de ejecución guarda la línea de comandos tal como la escribiste, así que `b24 runs show` te dice qué se
ejecutó. Aun así, un secreto se guarda como `[redacted]`: una opción con nombre de token o de contraseña, una contraseña
en un enlace, una cadena opaca larga. Un número de teléfono se sustituye por `[redacted]` dentro de la palabra que
escribiste, también en el texto de un mensaje: uno escrito con su "+" y el código de país, o de 11 a 15 dígitos
seguidos, así que también se oculta un id largo de esa longitud. Para no guardar ninguna de las palabras que escribes,
ejecuta `b24 work config set record_input false`.

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
archivo o una carpeta que creó una versión anterior puede estar abierto a otros usuarios del ordenador: `b24 doctor`
muestra cada uno en `files.problems` e imprime el `chmod` que lo corrige. En Windows no se comprueba. Informa de una
vulnerabilidad como indica [SECURITY.md](https://github.com/WireCatLabs/bitrix24-cli/blob/main/SECURITY.md).
