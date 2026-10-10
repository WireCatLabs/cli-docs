---
title: "Respuestas automáticas"
---

Las respuestas automáticas contestan en MAX cuando no puedes hacerlo, por ejemplo «Te responderé por la mañana» fuera del horario de trabajo. Esta página te ayuda a crear una regla con tu texto, elegir la audiencia y probar lo que respondería sin enviar nada. Encontrarás textos reutilizables en [Borradores y plantillas](https://wirecat.dev/ru/docs/drafts-and-templates).

Unas palabras que aparecerán a continuación:

- **Regla** indica a qué mensajes entrantes responder y qué hacer: responder, abrir una tarea o ambas cosas.
- **Plantilla** — texto de respuesta. Puede ingresar el nombre y la hora del remitente.
- **Audiencia**: personas y chats a los que generalmente puedes responder, sin importar lo que diga la regla.
- `max serve` es un proceso en segundo plano que recibe nuevos mensajes y aplica reglas.

Quién recibe la respuesta y cuándo se envía algo:

- **Todos los seleccionados según las reglas obtienen una respuesta, a menos que limites la audiencia.** Responder solo a personas seleccionadas: `max replies audience --reply listed --allow-people …`; excluir a alguien: `--deny-people` y `--deny-chats`.
- **No se envía nada hasta que habilites el envío.** Necesita `permissions.replies.send allow`; `ask` también prohíbe el envío, porque no hay nadie a quien preguntarle al servidor en segundo plano. La nueva regla también estará deshabilitada hasta que la habilites.

Ayuda completa: [comandos de respuesta automática](./commands.md#max-replies).

## Crear y activar una regla

```sh
max replies add away
max replies edit away --template 'Спасибо, {{ sender.firstName | default: "вам" }}! Отвечу утром.'
max replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
max replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` crea una regla desactivada con todos sus ajustes actuales. El archivo `<профиль>.replies.json` está junto al `configFile` que muestra `max config show --json`. Por defecto puede responder a cualquiera que coincida con la regla. Para limitarlo a personas elegidas, indica sus ID de MAX separados por comas; `max contacts show <имя> --json` muestra el ID en `id`:

```sh
max replies audience --reply listed --allow-people 1000001
```

Para responder a todos excepto a algunas personas o chats, deja `--reply all` y banéalos:

```sh
max replies audience --deny-people 1000002 --deny-chats 1000003
```

Después del primer comando en el archivo:

```json
{
  "audience": {
    "reply": "listed",
    "allow": { "people": ["1000001"], "chats": [] },
    "deny": { "people": [], "chats": [] }
  },
  "rules": [ … ]
}
```

Los nombres de las reglas son letras minúsculas, números y guiones; Se rechaza la identificación repetida. No se puede habilitar una regla con la acción `reply` sin texto de plantilla. Para una regla y acción deshabilitadas `task`, se acepta texto vacío.

```sh
max replies test --since-time 7d
max replies on away
max config set permissions.replies.send allow
max serve
```

`replies test` solo lee mensajes guardados: no envía nada, no cambia nada y no se conecta a MAX. Sin permiso para enviar, el servidor permanece en silencio. `max replies off away` deshabilita una regla.

## Editar las condiciones y la audiencia

`replies edit` cambia solo los campos proporcionados. Las listas separadas por comas se sustituyen por completo; una cadena vacía borra una lista. Los ID siguen siendo cadenas, incluidos los números grandes.

| Campos | Opciones |
|---|---|
| Acciones | `--do reply,task`: respuesta, tarea o ambas |
| Chats | `--kinds dialog,group`, `--chats`, `--not-chats` |
| Condiciones | `--words`, `--question` / `--no-question`, `--mentions-me` / `--no-mentions-me` |
| Remitentes | `--people`, `--not-people`, `--contacts-only` / `--no-contacts-only` |
| Respuesta | `--template`, `--as-reply` / `--no-as-reply` |
| Límites | `--per-chat`, `--per-person`, por ejemplo `1/12h` |
| Horario laboral | `--outside`, `--days`, `--timezone`, `--no-hours` |

La primera especificación horaria requiere ventana, días y zona horaria juntos; Puede cambiar un campo más tarde. `--no-hours` borra la ventana y es incompatible con sus campos. Antes de grabar, se verifican el archivo fuente y el resultado completo. Una edición incorrecta no sobrescribe el archivo; Se conservan otras reglas, audiencia, orden de reglas e historial de respuestas.

`max replies audience` muestra la audiencia total del archivo. El nuevo archivo es `--reply all`: coincide con quien seleccione la regla. `--reply listed` solo responde a personas y chats aprobados. Las opciones `--allow-people`, `--allow-chats`, `--deny-people`, `--deny-chats` reemplazan las listas correspondientes. La prohibición vence el permiso. Con `listed` con una lista vacía, nadie obtiene respuesta; El comando advierte sobre esto. La acción `task` abre una tarea local y no se limita a la audiencia de respuesta.

## Plantillas Liquid y modelos

Ejemplos de textos de respuesta para casos frecuentes y cuándo es mejor dejar un borrador se encuentran en la página [Borradores y plantillas de respuesta](https://wirecat.dev/ru/docs/drafts-and-templates).

Las variables disponibles son `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` y `now` en la zona horaria de la regla, o UTC si no hay franja horaria. Se admiten filtros, por ejemplo `{{ now | date: "%H:%M" }}`. El texto del mensaje entrante no es una variable de plantilla. Se rechazan las variables y los filtros desconocidos; `default` gestiona los valores ausentes. Las plantillas no pueden leer archivos y tienen límites de tiempo, memoria y longitud de salida.

Un modelo solo puede cambiar el bloque `ai`; el texto fuera de él sigue siendo tu texto con las sustituciones habituales:

```liquid
Спасибо, {{ sender.firstName | default: "вам" }}!
{% ai %}Коротко подтвердите получение; я отвечу завтра.{% else %}Отвечу завтра.{% endai %}
```

El cuerpo del bloque después de las sustituciones es la instrucción. El texto entrante se envía al modelo por separado como datos. Su respuesta no se ejecuta como Liquid; se rechaza una respuesta demasiado larga o que repita por completo el texto entrante. Si no hay proveedor configurado, falta consentimiento o falla la llamada, se utiliza `else`. Sin él, se omite la respuesta y se explica el motivo.

Configura `models.replies.provider` (`openai` o `anthropic`), el ID exacto del modelo en `models.replies.model` y, si lo necesitas, `models.replies.baseUrl`. Los valores compartidos proceden de `models.default`; `provider off` desactiva la asignación. `config set` y `config unset` admiten estas claves; `config show` muestra el origen de cada campo. Los antiguos `analysisProvider`, `analysisModel` y `analysisBaseUrl` siguen funcionando para el análisis. Guarda la clave con `max models text key set`; para un servidor propio, el nombre de la clave es su host con el puerto, y no se envía allí la clave del proveedor público.

El consentimiento para el modelo es independiente del permiso para enviar respuestas:

```sh
max replies consents show
max replies consents grant
max replies consents revoke
```

`grant` permite enviar los datos entrantes al proveedor elegido para todo el perfil. `replies consents deny` con un ID de chat prohíbe usar el modelo para ese chat; `allow` con un ID elimina esa prohibición, pero no otorga consentimiento al perfil. Las prohibiciones se conservan al aplicar grant/revoke. Cambiar de proveedor o endpoint requiere nuevo consentimiento. Antes de enviar el resultado, se comprueban los cambios en el consentimiento, los ajustes, la regla, la audiencia o pause que se hayan producido durante la llamada al modelo.

`max replies test` muestra las instrucciones y el texto alternativo sin llamar a un modelo. `max replies test --ai` permite explícitamente enviar mensajes guardados al modelo configurado con consentimiento vigente. No envía respuestas al servicio de mensajería ni cambia el historial de respuestas; `--ai` no se puede combinar con `--offline`. Los antiguos `{firstName}`, `{name}` y `model: may-reword` se leen con un aviso: la plantilla original con sus valores sustituidos sigue siendo el texto alternativo. Los archivos nuevos no necesitan el campo `model`.

## Qué omiten las reglas

- Destinatarios excluidos por la audiencia.
- Tus mensajes, canales, bots y mensajes en nombre de un chat.
- Mensajes editados, ya procesados o anteriores al inicio de `serve`.
- En grupos, mensajes sin mención ni respuesta a ti, salvo que la regla incluya el grupo en `chats`.

Los límites `perChat` y `perPerson` son obligatorios. Dos sistemas de respuesta automática se detienen al alcanzar el primer límite.

`max replies pause` detiene inmediatamente todas las reglas; `resume` levanta la pausa sin reiniciar. `status` muestra el permiso de envío, las reglas activadas y la audiencia. `max sends list` muestra las respuestas enviadas con la regla correspondiente.
