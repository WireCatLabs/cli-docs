---
title: "Permisos"
---

Utilice esta página antes de permitir que un agente de IA, un script u otra persona trabaje con su cuenta de Telegram a través de `tg`. Muestra cómo decidir, para cada perfil, qué solo se puede leer, qué se le pregunta primero y qué puede seguir adelante sin hacer preguntas. Al final, puede hacer que un perfil sea de solo lectura, permitir una acción como enviar y saber qué otras comprobaciones aún se aplican.

Palabras que utiliza esta página:

- **Perfil**: un conjunto de configuraciones con nombre para una cuenta o bot, como `work` ([perfiles y bots](./profiles.md)).
- **Clave de permiso**: el nombre de un comando o un grupo de comandos, como `messages` o `messages.send`. Una clave más larga es más específica.
- **Nivel de acceso**: qué sucede cuando se ejecuta ese comando: `deny`, `readonly`, `ask` o `allow`.

Comience leyendo y permita cambios solo cuando los necesite.

## Elige un nivel de acceso

| Nivel | Resultado |
|---|---|
| `deny` | Se rechaza la acción, incluida la lectura. |
| `readonly` | Se permite la lectura; se rechazan los cambios. |
| `ask` | Se pide confirmación en el terminal antes de un cambio. |
| `allow` | La acción puede ejecutarse sin otra pregunta. |

Una negativa indica que debes revisar la acción solicitada y los ajustes. No significa que la conexión de tu cuenta
esté averiada. No pidas a un agente que elimine una restricción solo para terminar una tarea.

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

Esto controla los mensajes. Otras acciones, como reacciones o administración del chat, tienen sus propias claves de permiso. Un perfil completo de solo lectura y todas las claves se encuentran en [lo que puede hacer un perfil](./configuration-reference.md#what-a-profile-may-do).

## Permisos para un bot

Los permisos y límites del bot pertenecen a la sección del bot. Para pedir confirmación en el terminal antes de enviar:

```sh
tg support config set permissions.bot.messages.send ask --bot
tg support config set sendsPerHour 30 --bot
```

## Restringe los destinatarios y los envíos repetidos

Una lista de destinatarios limita a qué chats puede enviar el perfil. Un límite de envío por hora ayuda a detener un bucle. Estas comprobaciones permanecen activas cuando se permite un comando en particular. Los comandos para gestionarlos están en [el control de envío](./security.md#the-send-guard).

## Un cambio temporal para un servidor MCP

Añade `--permission messages.send=allow` al comando de inicio del servidor para permitir los envíos de ese
proceso. Los ajustes guardados no cambian. Mediante MCP, `ask` no exige un formulario del servidor: la aplicación controla
sus propias aprobaciones y puede permitir una llamada sin volver a preguntar. Usa `deny` o `readonly` para rechazar los cambios. [Configuración en el navegador](./remote.md) explica la conexión completa.

## Límites y reglas detalladas

Un agente que pueda editar archivos de configuración o ejecutar comandos de terminal sin restricciones puede cambiar estas configuraciones. Lea [seguridad](./security.md) antes de otorgar ese acceso. Para permisos anidados y claves de comando exactas, consulte [qué puede hacer un perfil](./configuration-reference.md#what-a-profile-may-do).
