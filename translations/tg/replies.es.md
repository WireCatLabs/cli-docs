---
title: "Respuestas automáticas"
---

Esta página trata sobre cómo responder mensajes de Telegram automáticamente cuando no puedes responder personalmente; por ejemplo, un breve "Responderé por la mañana" a las personas que escriben fuera del horario laboral. Al final, tienes una respuesta automática funcional: una regla con tu texto de respuesta, una opción de quién puede recibirlo, una forma de verificar qué respondería antes de enviar algo y textos listos para usar de [Borradores y plantillas de respuesta](https://wirecat.dev/en/docs/drafts-and-templates).

Algunas palabras utilizadas a continuación:

- Una **regla** dice qué mensajes entrantes responder y qué hacer: responder, abrir una tarea o ambas cosas.
- Una **plantilla** es el texto de respuesta. Puede incluir el nombre del remitente y la hora.
- La **audiencia** es la lista de personas y chats que pueden obtener una respuesta, independientemente de lo que diga una regla.
- `tg serve` es el proceso en segundo plano que recibe nuevos mensajes y aplica las reglas.

Quién recibe una respuesta y cuándo se envía algo:

- **Las respuestas van a todas las personas que coincidan con tus reglas, a menos que limites la audiencia.** Responde solo a personas seleccionadas con `tg replies audience --reply listed --allow-people …`, o omite algunas con `--deny-people` y `--deny-chats`.
- **No se envía nada hasta que activas el envío.** `permissions.replies.send` debe ser `allow`. `ask` cuenta como no, porque un servidor en segundo plano no tiene a quién preguntar. Las reglas nuevas permanecen desactivadas hasta que las activas.

Las listas de opciones completas se encuentran en [los comandos de respuesta automática](./commands.md#tg-replies).

## Crear y activar una regla

```sh
tg replies add away
tg replies edit away --template 'Thanks, {{ sender.firstName | default: "there" }}! I will answer in the morning.'
tg replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
tg replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` crea una regla que está desactivada, con cada configuración escrita. Las reglas se encuentran en `<profile>.replies.json`, en la misma carpeta que el `configFile` que nombra `tg config show --json`. Por defecto, las reglas responden a todas las personas con las que coinciden. Para responder solo a personas seleccionadas, indique sus ID de Telegram, separados por comas; `tg contacts show <name> --json` imprime la identificación de una persona como `id`:

```sh
tg replies audience --reply listed --allow-people 1000001
```

Para responder a todos excepto a algunas personas o chats, mantén `--reply all` y niégalos:

```sh
tg replies audience --deny-people 1000002 --deny-chats -1002000002
```

Después del primer comando, el archivo contiene:

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

Los ID de reglas usan letras minúsculas, dígitos y `-`, y cada uno es único. Una regla que responde no se puede activar con una plantilla vacía.

Después, consulta qué habría respondido, actívala e inicia el servidor:

```sh
tg replies test --since-time 7d
tg replies on away
tg config set permissions.replies.send allow
tg serve
```

`replies test` lee solo mensajes ya guardados en tu almacén local. No envía ni cambia nada y nunca se conecta. `tg replies off away` desactiva una regla.

## Condiciones y audiencia

`replies edit` cambia solo los campos que indiques. Una lista separada por comas sustituye toda la lista; una cadena vacía la borra.

| Qué | Opciones |
|---|---|
| Acción | `--do reply,task` — una respuesta, una tarea o ambas |
| Chats | `--kinds dialog,group`, `--chats`, `--not-chats` |
| Condiciones | `--words`, `--question` / `--no-question`, `--mentions-me` / `--no-mentions-me` |
| Remitentes | `--people`, `--not-people`, `--contacts-only` / `--no-contacts-only` |
| Respuesta | `--template`, `--as-reply` / `--no-as-reply` |
| Límites | `--per-chat`, `--per-person`, como `1/12h` |
| Horario de trabajo | `--outside`, `--days`, `--timezone`, `--no-hours` |

La primera vez que establezcas el horario laboral, indica la ventana, los días y la zona horaria juntos; después de eso puedes cambiar uno. Una edición incorrecta no sobrescribe el archivo y las demás reglas, la audiencia y el registro de lo respondido permanecen como estaban.

`tg replies audience` muestra a quién pueden responder todas las reglas del archivo. Un nuevo archivo es `--reply all`: responde a cualquiera que coincida con una regla. `--reply listed` responde sólo a las personas y chats permitidos. `--allow-people`, `--allow-chats`, `--deny-people` y `--deny-chats` reemplazan esas listas, y una denegación prevalece sobre una asignación. Una acción `task` abre una tarea en esta computadora y no está limitada por la audiencia.

## Plantillas y un modelo

En [Borradores y plantillas de respuesta](https://wirecat.dev/en/docs/drafts-and-templates) se encuentran ejemplos de textos de respuesta para casos comunes y cuándo conservar un borrador.

Una plantilla puede usar `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` y `now` (en la zona horaria de la regla, o UTC sin horario de trabajo), con filtros como `{{ now | date: "%H:%M" }}`. El texto del mensaje entrante no es una variable de plantilla. Se rechazan las variables y filtros desconocidos.

El modelo solo puede escribir el bloque `ai`; todo lo que quede fuera es tu texto:

```liquid
Thanks, {{ sender.firstName | default: "there" }}!
{% ai %}Briefly confirm you got the message; I will answer tomorrow.{% else %}I will answer tomorrow.{% endai %}
```

El cuerpo del bloque es una instrucción para el modelo. El texto entrante se le pasa por separado, como datos. Si no hay modelo configurado, falta consentimiento o falla la llamada, se envía el texto de `else`; sin `else`, no se responde al mensaje y se registra el motivo.

Elige el modelo con `models.replies.provider` (`openai` o `anthropic`), `models.replies.model` y, para tu propio servidor, `models.replies.baseUrl`; `models.default` completa lo que no se haya definido. Guarda la clave con `tg models text key set`.

Usar un modelo exige un consentimiento propio, independiente del permiso para enviar:

```sh
tg replies consents show
tg replies consents grant
tg replies consents revoke
tg replies consents deny -1002000002
tg replies consents allow -1002000002
```

`grant` permite enviar datos de mensajes entrantes al proveedor elegido para todo el perfil. `deny` impide que los mensajes de un chat lleguen al modelo; `allow` levanta esa prohibición sin conceder consentimiento. Un proveedor o endpoint nuevo necesita consentimiento de nuevo. `tg replies test --ai` envía mensajes guardados al modelo para que veas su texto; sigue sin enviar nada a Telegram.

## A qué nunca responde una regla

- Cualquiera que la audiencia no permita.
- Tus propios mensajes, canales, bots y mensajes enviados en nombre de un chat.
- Un mensaje editado, un mensaje ya manejado y cualquier cosa que haya llegado antes de que comenzara `serve`.
- En un grupo, un mensaje que no te menciona ni te responde, a menos que la regla nombre ese grupo en `chats`.

Cada regla debe tener límites `perChat` y `perPerson`, de modo que dos sistemas de respuesta automática que se respondan entre sí se detengan al alcanzar el primer límite.

## Detener y revisar

```sh
tg replies pause
tg replies resume
tg replies status
tg sends list
```

`pause` detiene todas las reglas a la vez, incluido un `serve` en ejecución, sin reiniciar; `resume` deshace la pausa. `status` indica si se permite enviar, qué reglas están activas y a quién pueden responder. `sends list` muestra cada respuesta con la regla que la envió.
