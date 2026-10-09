---
title: "Permisos"
---

Esta página es necesaria antes de permitir que un agente de IA, script u otra persona trabaje con su cuenta MAX a través de `max`. Te muestra cómo decidir para cada perfil qué sólo se puede leer, qué se puede preguntar antes y qué se puede hacer sin que te lo pregunten. Después de leerlo, puedes hacer que el perfil sea de solo lectura, permitir una acción, como enviar, y sabrás qué controles siguen vigentes.

Palabras que aparecen en la página:

- **Perfil** es un conjunto de configuraciones con nombre para una cuenta o bot, por ejemplo `work` ([perfiles y bots](./profiles.md)).
- **Clave de permiso**: el nombre de un comando o grupo de comandos, por ejemplo `messages` o `messages.send`. Cuanto más larga sea la clave, más precisa será.
- **Nivel de acceso** - qué sucede cuando se ejecuta el comando: `deny`, `readonly`, `ask` o `allow`.

Comience leyendo y permita cambios según sea necesario.

## Elegir un nivel de acceso

| Nivel | Comportamiento |
|---|---|
| `deny` | La acción está prohibida, incluida la lectura. |
| `readonly` | Se permite leer; se prohíben los cambios. |
| `ask` | Los cambios piden confirmación en el terminal. |
| `allow` | La acción puede ejecutarse sin otra confirmación. |

Si se deniega una acción, revisa la acción y los ajustes. No significa que haya un problema de conexión. No pidas al agente que elimine la restricción solo para completar la tarea.

## Permitir una acción

```sh
max work config set permissions.messages.send ask
```

Sustituye `work` por el nombre de tu perfil. Para permitir la lectura de mensajes y prohibir los cambios de forma predeterminada:

```sh
max work config set permissions.messages readonly
```

Una clave más específica tiene prioridad: `permissions.messages.send ask` mantiene la confirmación antes de enviar en el terminal y permite enviar mediante MCP. Para prohibir el envío, establece esta clave en `readonly`. Comprueba las demás excepciones con `config show`.

Estos son derechos de mensajes. Las reacciones y la gestión del chat tienen claves independientes. Todas las claves y un perfil de solo lectura de ejemplo se encuentran en [directorio de derechos de acceso](./configuration-reference.md#права-доступа).

## Permisos del bot

Los permisos y límites del bot se establecen en la sección del bot. Para pedir confirmación antes de enviar en el terminal:

```sh
max support config set permissions.bot.messages.send ask --bot
max support config set sendsPerHour 30 --bot
```

## Limitar los destinatarios y los envíos repetidos

La lista de destinatarios limita los chats a los que puede enviar un perfil. El límite horario ayuda a detener el ciclo de envío. Estas comprobaciones también se aplican a un comando permitido. Comandos de control: en la sección [protección contra envío al lugar equivocado](./security.md#защита-от-отправки-не-туда).

## Cambiar temporalmente los permisos del servidor MCP

Añade `--permission messages.send=allow` al iniciar el servidor para permitir que ese proceso envíe mensajes. Los ajustes guardados no cambian. Mediante MCP, `ask` no exige un formulario de confirmación del servidor: la aplicación gestiona sus propias confirmaciones y puede permitir una llamada sin volver a preguntar. Para prohibir cambios, usa `deny` o `readonly`. [Configuración para el navegador](./remote.md) explica todo el proceso de conexión.

## Limitaciones y reglas detalladas

Un agente con acceso a los archivos de configuración o a un terminal sin restricciones puede cambiar estos permisos. Antes de dar ese acceso, consulta [seguridad](./security.md). Los permisos anidados y las claves exactas se explican en la [referencia de permisos](./configuration-reference.md#права-доступа).
