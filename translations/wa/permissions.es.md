---
title: "Permisos"
---

Usa esta página antes de permitir que un agente de IA, un script u otra persona trabaje con tu cuenta de WhatsApp a través de `wa`. Muestra cómo decidir, para cada perfil, qué solo se puede leer, qué se le pregunta primero y qué puede seguir adelante sin hacer preguntas. Al final, puede hacer que un perfil sea de solo lectura, permitir una acción como enviar y saber qué otras comprobaciones aún se aplican.

Palabras que utiliza esta página:

- **Perfil**: un conjunto de configuraciones con nombre para una cuenta vinculada, como `work` ([perfiles](./profiles.md)).
- **Clave de permiso**: el nombre de un comando o un grupo de comandos, como `messages` o `messages.send`. Una clave más larga es más específica.
- **Nivel de acceso**: qué sucede cuando se ejecuta ese comando: `deny`, `readonly`, `ask` o `allow`.

Empieza leyendo y permite cambios solo cuando los necesites.

## Elige un nivel de acceso

| Nivel | Qué ocurre |
|---|---|
| `deny` | Se rechaza la acción, incluida la lectura. |
| `readonly` | Se permite leer; los cambios se rechazan. |
| `ask` | Los cambios piden confirmación en el terminal. |
| `allow` | La acción puede ejecutarse sin otra pregunta. |

Sin ningún `permissions` configurado, todo está permitido, excepto eliminar y algunos otros cambios, que se solicitan. Un rechazo sale con el código `5` y nombra la clave de permiso. No significa que el enlace a WhatsApp esté roto. No pidas a un agente que elimine una restricción sólo para finalizar una tarea.

## Permitir una acción

```sh
wa work config set permissions.messages.send ask
```

Sustituye `work` con tu perfil. Para un valor predeterminado que permite leer mensajes y rechaza cambios:

```sh
wa work config set permissions.messages readonly
```

Las claves más específicas tienen prioridad: `permissions.messages.send ask` aún permite el envío, con una pregunta en el terminal y sin formulario de servidor sobre MCP. Establece esa clave en `readonly` para rechazar envíos. Consulta otras excepciones con `wa work config show`.

Esto controla los mensajes. Otras acciones tienen sus propias claves: `reactions` para reacciones, `polls` para encuestas y votos, `chats.mark-read` para recibos de lectura. El otro lado ve los tres, así que dales el mismo cuidado que al enviar. `chats.mute` y `chats.unmute` cubren `chats mute` y `chats unmute`, que nadie más ve; una configuración para `chats.mute` por sí sola aún cubre ambos. `messages.star` y `messages.unstar` controlan la estrella de un mensaje, que tampoco ven los demás. `chats.archive`, `chats.unarchive`, `chats.pin`, `chats.unpin` y `chats.mark-unread` cubren los comandos de esos nombres, que nadie más ve; cada clave es independiente, por lo que `chats.archive readonly` aún deja pasar a `chats unarchive`. `account.update` cubre `account update`: otras personas pueden ver el nuevo nombre, información y foto. `chats.delete` y `chats.clear` cubren la eliminación de un chat o sus mensajes desde tus propios dispositivos; preguntan de forma predeterminada, ya que nada devuelve los mensajes.

## Confirmaciones en scripts

Se solicita una escritura en el nivel `ask` en la terminal. Con `--json`, `--no-input` o sin terminal no hay nadie que responda, por lo que se rechaza la escritura con el código de salida `7` a menos que agregue `--yes`; una eliminación necesita `--allow-dangerous`. Estas banderas sólo responden a la pregunta. No anulan las restricciones `deny` ni `readonly`.

## Restringir destinatarios y envíos repetidos

Una lista de destinatarios limita a qué chats puede enviar el perfil. El primer `recipients add` enciende la lista; un envío a cualquier otro chat se rechaza con el código de salida `7`:

```sh
wa work recipients add 100000000000001@lid
wa work recipients list
wa work recipients remove 100000000000001@lid
```

Un chat agregado por su número de teléfono (`…@s.whatsapp.net`) se guarda bajo su LID cuando WhatsApp ya ha dado uno, porque un envío a ese número va al LID. Una entrada guardada anteriormente bajo el número de teléfono se mueve al LID por sí sola una vez que este dispositivo conoce el LID del número: cuando el almacén local mantiene el chat bajo el número, el primer comando que lo nombra por el número mueve el chat y la entrada antes de que actúe; de lo contrario, el siguiente inicio de `serve` o `watch` mueve la entrada. Para ello nunca se consulta el número a WhatsApp. Hasta que la entrada se mueva, se rechaza un envío al LID con el código de salida `7` y el mensaje indica la identificación que se debe agregar. `recipients remove` con el número elimina la entrada anterior.

Dos cambios en la lista al mismo tiempo no se pueden deshacer entre sí. Cuando otro proceso retiene la lista durante 5 s, el cambio se rechaza con el código de salida `9` y la lista permanece como estaba.

Un límite de envío por hora, `sends_per_hour` (30 de forma predeterminada), ayuda a detener un bucle. `wa work sends list` muestra todos los intentos de envío (enviados, rechazados, fallidos o desconocidos) sin el texto. Estas comprobaciones permanecen activas cuando se permite un comando ([límites](./limits.md)).

## Un cambio temporal para un servidor MCP

Añade `--permission messages.send=readonly` al comando de inicio del servidor para detener el envío de ese proceso. La configuración guardada permanece igual. `--permission` solo se estrecha: uno que aflojaría el perfil (de `readonly` a `allow`, un `deny` a cualquier cosa) detiene el servidor al inicio y `validation_error` nombra la clave. Para permitir que un agente haga más, establezca el nivel en el propio perfil. A través de MCP, `ask` no requiere un formulario de servidor: la aplicación controla sus propias aprobaciones y puede permitir una llamada sin volver a preguntar. Usa `deny` o `readonly` para rechazar cambios. [El servidor MCP](./mcp.md) y [la configuración del navegador](./remote.md) explican la conexión completa.

## Límites y reglas detalladas

Un agente que pueda editar archivos de configuración o ejecutar comandos de terminal sin restricciones puede cambiar estas configuraciones. Limítalo a un perfil con `WA_PROFILE_LOCK` ([perfiles en el enlace](./sessions.md#profiles)) y lea [seguridad](./security.md) antes de otorgar ese acceso. Cada configuración se encuentra en la [referencia de configuración](./configuration-reference.md).
