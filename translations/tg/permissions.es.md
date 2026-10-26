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
tg support config set sends_per_hour 30 --bot
```

## Restringe los destinatarios y los envíos repetidos

Una lista de destinatarios limita a qué chats puede enviar el perfil. Un límite de envío por hora ayuda a detener un bucle. Estas comprobaciones permanecen activas cuando se permite un comando en particular. Los comandos para gestionarlos están en [el control de envío](./security.md#the-send-guard).

## Un cambio temporal para un servidor MCP

Añade `--permission messages.send=deny` al comando de inicio del servidor para rechazar los envíos de ese
proceso. Los ajustes guardados no cambian. La opción solo endurece: una anulación que aflojaría el nivel del perfil se rechaza al iniciar. Mediante MCP, `ask` no exige un formulario del servidor: la aplicación controla
sus propias aprobaciones y puede permitir una llamada sin volver a preguntar. Usa `deny` o `readonly` para rechazar los cambios. [Configuración en el navegador](./remote.md) explica la conexión completa.

## Permitir que un agente cambie sus propios límites

MCP conserva visibles los comandos que cambian lo que podrá hacer una ejecución posterior, pero los marca como no disponibles por defecto: `config set|unset`,
listas de destinatarios, reglas de chat y respuesta, consentimientos, horarios, `server install`, `skill install`,
claves de modelos, temporizadores del archivo de adjuntos y `flood clear`. Una clave los habilita:

```sh
tg work config set permissions.mcp.authority allow
```

Para el servidor de un bot, añade `--bot`: `tg support config set permissions.mcp.authority allow --bot`.
El valor por defecto es `deny`; tanto `allow` como `ask` permiten ejecutar esos comandos. Mantén `deny` en el perfil
que entregues a un agente: al habilitarlo, el agente podrá aflojar sus propios permisos. No puede cambiar
la clave mediante `config set`, porque esa misma clave controla el comando. Consulta el [servidor MCP](./mcp.md#commands-that-change-what-a-later-run-may-do).

## Llamadas directas a Bot API

Las llamadas `bot api <operation>` eluden la protección de envío y la lista de destinatarios del bot.
MCP las muestra como no disponibles salvo que `permissions.bot.api` sea `allow` o `ask`; el valor por defecto es `deny`, y un permiso
más general `permissions.bot: allow` no las habilita. Establece este permiso aparte desde una terminal:

```sh
tg support config set --bot permissions.bot.api allow
```

Vuelve a `deny` para impedir su ejecución; las herramientas seguirán visibles. El agente no puede cambiar esta clave mediante MCP.

## Límites y reglas detalladas

Un agente que pueda editar archivos de configuración o ejecutar comandos de terminal sin restricciones puede cambiar estas configuraciones. Lea [seguridad](./security.md) antes de otorgar ese acceso. Para permisos anidados y claves de comando exactas, consulte [qué puede hacer un perfil](./configuration-reference.md#what-a-profile-may-do).

## Guardar un borrador

`messages send --draft` usa el permiso independiente `drafts`. Guardar cambia el borrador de Telegram de ese chat o tema, no envía ningún mensaje y no registra el texto del borrador en el diario. `deny` o `readonly` impide guardar; `ask` solicita confirmación en la CLI y sigue el flujo de aprobación del cliente MCP.

En MCP, el permiso del comando también debe permitir `messages send`. Configurar `drafts: allow` no anula `messages.send: deny` ni `readonly`.

