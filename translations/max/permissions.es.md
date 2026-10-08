---
title: "Permisos"
---

Los permisos se aplican a un perfil: un conjunto de ajustes para una cuenta o un bot. Empieza con acceso de lectura y permite cambios según los necesites. Consulta [Perfiles y bots](./profiles.md).

## Elegir un nivel de acceso

| Nivel | Comportamiento |
|---|---|
| `deny` | La acción está prohibida, incluida la lectura. |
| `readonly` | Se permite leer; se prohíben los cambios. |
| `ask` | Los cambios piden confirmación en el terminal. |
| `allow` | La acción puede ejecutarse sin otra confirmación. |

Si se deniega una acción, revisa la acción y los ajustes. No significa que haya un problema de conexión. No pidas al asistente que elimine la restricción solo para completar la tarea.

## Permitir una acción

```sh
max work config set permissions.messages.send ask
```

Sustituye `work` por el nombre de tu perfil. Para permitir la lectura de mensajes y prohibir los cambios de forma predeterminada:

```sh
max work config set permissions.messages readonly
```

Una clave más específica tiene prioridad: `permissions.messages.send ask` mantiene la confirmación antes de enviar en el terminal y permite enviar mediante MCP. Para prohibir el envío, establece esta clave en `readonly`. Comprueba las demás excepciones con `config show`.

Estos permisos se aplican a los mensajes. Las reacciones y la gestión de chats tienen claves independientes. Consulta ejemplos completos de perfiles de solo lectura en la [referencia de configuración](./configuration-reference.md).

## Permisos del bot

Los permisos y límites del bot se establecen en la sección del bot. Para pedir confirmación antes de enviar en el terminal:

```sh
max support config set permissions.bot.messages.send ask --bot
max support config set sendsPerHour 30 --bot
```

## Limitar los destinatarios y los envíos repetidos

La lista de destinatarios limita los chats a los que puede enviar el perfil. El límite por hora ayuda a detener bucles de envío. Estas comprobaciones se aplican incluso si el comando está permitido. Consulta los comandos para gestionarlas en [Seguridad](./security.md).

## Cambiar temporalmente los permisos del servidor MCP

Añade `--permission messages.send=allow` al iniciar el servidor para permitir que ese proceso envíe mensajes. Los ajustes guardados no cambian. Mediante MCP, `ask` no exige un formulario de confirmación del servidor: la aplicación gestiona sus propias confirmaciones y puede permitir una llamada sin volver a preguntar. Para prohibir cambios, usa `deny` o `readonly`. [Configuración para el navegador](./remote.md) explica todo el proceso de conexión.

## Limitaciones y reglas detalladas

Un asistente con acceso a los archivos de configuración o a un terminal sin restricciones puede cambiar estos permisos. Lee [Seguridad](./security.md) antes de darle ese acceso. La referencia de configuración del mensajero describe los permisos anidados y las claves exactas de los comandos.
