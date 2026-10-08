---
title: "Respuestas automáticas"
---

`max serve` responde según las reglas del perfil. Solo se permiten respuestas a las cuentas de `testers` y únicamente con `permissions.replies.send allow`. Un archivo nuevo tiene la lista `testers` vacía: nadie recibe respuestas hasta que añadas tu cuenta de prueba.

Consulta la referencia completa en [commands.md](./commands.md#max-replies).

## Crear y activar una regla

```sh
max replies add away
max replies edit away --template 'Спасибо, {{ sender.firstName | default: "вам" }}! Отвечу утром.'
max replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
max replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` crea una regla desactivada con todos los ajustes actuales. El archivo `<профиль>.replies.json` está junto al `configFile` mostrado por `max config show --json`. Añade el ID de tu cuenta de prueba a su lista `testers`. Los nombres de reglas contienen letras minúsculas, dígitos y guiones; se rechazan los ID duplicados. Una regla con la acción `reply` no se puede activar sin texto de plantilla. El texto vacío se permite para reglas desactivadas y para la acción `task`.

```sh
max replies test --since-time 7d
max replies on away
max config set permissions.replies.send allow
max serve
```

Preview solo lee mensajes guardados. Sin permiso de envío, el servidor no responde; `ask` también prohíbe enviar porque un servidor en segundo plano no tiene a quién preguntar. `max replies off away` desactiva una regla.

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

La primera vez que establezcas un horario, proporciona juntos la franja horaria, los días y la zona horaria; después puedes cambiar un solo campo. `--no-hours` borra la franja y no se puede combinar con sus campos. Antes de escribir, se validan el archivo original y el resultado completo. Una edición no válida no sobrescribe el archivo; se conservan las demás reglas, `testers`, su orden y el historial de respuestas.

`max replies audience` muestra la audiencia común del archivo. `--reply all` permite cualquier audiencia; `--reply listed` permite solo las listas autorizadas. `--allow-people`, `--allow-chats`, `--deny-people` y `--deny-chats` sustituyen sus respectivas listas. La prohibición tiene prioridad sobre el permiso. Con `listed` y una lista de permitidos vacía, nadie recibe respuestas; el comando avisa de ello. La restricción `testers` se aplica además de la audiencia. La acción `task` abre una tarea local y no está limitada por la audiencia de respuestas.

## Plantillas Liquid y modelos

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

`max replies test` muestra las instrucciones y el texto alternativo sin llamar a un modelo. `max replies test --ai` permite explícitamente enviar mensajes guardados al modelo configurado con consentimiento vigente. No envía respuestas al mensajero ni cambia el historial de respuestas; `--ai` no se puede combinar con `--offline`. Los antiguos `{firstName}`, `{name}` y `model: may-reword` se leen con un aviso: la plantilla original con sus valores sustituidos sigue siendo el texto alternativo. Los archivos nuevos no necesitan el campo `model`.

## Qué omiten las reglas

- Tus propios mensajes, canales, bots y mensajes enviados en nombre de un chat.
- Mensajes editados, ya procesados o recibidos antes de iniciar `serve`.
- En grupos, los mensajes que no te mencionan ni te responden, salvo que la regla incluya el grupo en `chats`.

Los límites `perChat` y `perPerson` son obligatorios. Dos sistemas de respuesta automática se detienen al alcanzar el primer límite.

`max replies pause` detiene inmediatamente todas las reglas; `resume` levanta la pausa sin reiniciar. `status` muestra el permiso de envío, las reglas activadas y la audiencia. `max sends list` muestra las respuestas enviadas con la regla correspondiente.
