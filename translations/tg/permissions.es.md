---
title: "Permisos"
---

Los permisos pertenecen a un perfil: un conjunto de ajustes para una cuenta o un bot. Empieza por permitir la lectura
y permite cambios solo cuando los necesites. Consulta [perfiles y bots](./profiles.md).

## Elige un nivel de acceso

| Nivel | Resultado |
|---|---|
| `deny` | Se rechaza la acción, incluida la lectura. |
| `readonly` | Se permite la lectura; se rechazan los cambios. |
| `ask` | Se pide confirmación en el terminal antes de un cambio. |
| `allow` | La acción puede ejecutarse sin otra pregunta. |

Una negativa indica que debes revisar la acción solicitada y los ajustes. No significa que la conexión de tu cuenta
esté averiada. No pidas a un asistente que elimine una restricción solo para terminar una tarea.

## Permite una acción

```sh
tg work config set permissions.messages.send ask
```

Sustituye `work` por tu perfil. Para permitir la lectura de mensajes y rechazar los cambios de forma predeterminada:

```sh
tg work config set permissions.messages readonly
```

Las claves más específicas tienen prioridad: `permissions.messages.send ask` sigue permitiendo enviar, con una pregunta
en el terminal y sin un formulario del servidor mediante MCP. Establece esa clave en `readonly` para rechazar los envíos.
Revisa otras excepciones con `config show`.

Esto controla los mensajes. Otras acciones, como las reacciones o la administración de chats, tienen sus propias
claves de permisos. Usa los ejemplos completos de perfiles de solo lectura de la
[referencia de ajustes](./configuration-reference.md).

## Permisos para un bot

Los permisos y límites del bot pertenecen a la sección del bot. Para pedir confirmación en el terminal antes de enviar:

```sh
tg support config set permissions.bot.messages.send ask --bot
tg support config set sendsPerHour 30 --bot
```

## Restringe los destinatarios y los envíos repetidos

Una lista de destinatarios limita los chats a los que el perfil puede enviar mensajes. Un límite de envíos por hora ayuda a detener un
bucle. Estas comprobaciones siguen activas aunque se permita un comando concreto.
Consulta [Seguridad](./security.md)
para ver los comandos que gestionan estos controles.

## Un cambio temporal para un servidor MCP

Añade `--permission messages.send=allow` al comando de inicio del servidor para permitir los envíos de ese
proceso. Los ajustes guardados no cambian. Mediante MCP, `ask` no exige un formulario del servidor: la aplicación controla
sus propias aprobaciones y puede permitir una llamada sin volver a preguntar. Usa `deny` o `readonly` para rechazar los cambios. [Configuración en el navegador](./remote.md) explica la conexión completa.

## Límites y reglas detalladas

Un asistente que puede editar archivos de configuración o ejecutar comandos del terminal sin restricciones puede
cambiar estos ajustes. Lee [Seguridad](./security.md) antes de darle ese acceso.
Para los permisos anidados y las claves exactas de los comandos, consulta la referencia de configuración del servicio de mensajería.
