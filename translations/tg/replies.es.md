---
title: "Respuestas automáticas"
---

`tg serve` puede responder a mensajes entrantes según las reglas que escribas. Dos condiciones evitan que escriba a personas a las que no querías responder:

- **Solo responde a cuentas de prueba.** La respuesta se envía solo a un remitente incluido en `testers` del archivo de reglas. Un archivo nuevo tiene `testers` vacío, así que nadie recibe respuestas hasta que añadas tu cuenta de prueba.
- **El envío está desactivado hasta que lo actives.** `permissions.replies.send` debe ser `allow`. `ask` equivale a un no, porque un servidor en segundo plano no tiene a quién preguntar.

Las listas completas de opciones están en [commands.md](./commands.md#tg-replies).

## Crear y activar una regla

```sh
tg replies add away
tg replies edit away --template 'Thanks, {{ sender.firstName | default: "there" }}! I will answer in the morning.'
tg replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
tg replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` crea una regla desactivada con todos los ajustes escritos. Las reglas están en `<profile>.replies.json`, en la misma carpeta que el `configFile` indicado por `tg config show --json`. Añade el ID de tu cuenta de prueba a `testers`:

```json
{ "testers": [{ "id": "1000001" }], "rules": [ … ] }
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

La primera vez que definas el horario de trabajo, indica juntos la franja, los días y la zona horaria; después puedes cambiar uno solo. Una edición incorrecta no sobrescribe el archivo; las demás reglas, `testers` y el registro de respuestas se conservan.

`tg replies audience` muestra a quién puede responder el archivo completo. `--reply all` permite a cualquiera; `--reply listed`, solo a las listas permitidas. `--allow-people`, `--allow-chats`, `--deny-people` y `--deny-chats` sustituyen esas listas, y una prohibición prevalece sobre un permiso. `testers` sigue aplicándose además de la audiencia. La acción `task` abre una tarea en este ordenador y no está limitada por la audiencia.

## Plantillas y un modelo

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

- Tus propios mensajes, canales, bots y mensajes enviados en nombre de un chat.
- Un mensaje editado, uno ya procesado y todo lo que llegó antes de iniciar `serve`.
- En un grupo, un mensaje que no te menciona ni te responde, salvo que la regla incluya ese grupo en `chats`.

Cada regla debe tener límites `perChat` y `perPerson`, de modo que dos sistemas de respuesta automática que se respondan entre sí se detengan al alcanzar el primer límite.

## Detener y revisar

```sh
tg replies pause
tg replies resume
tg replies status
tg sends list
```

`pause` detiene todas las reglas a la vez, incluido un `serve` en ejecución, sin reiniciar; `resume` deshace la pausa. `status` indica si se permite enviar, qué reglas están activas y a quién pueden responder. `sends list` muestra cada respuesta con la regla que la envió.
