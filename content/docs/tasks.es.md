---
title: "Tareas"
description: "Preguntas, peticiones y promesas de tus chats, guardadas como tareas que tu agente planifica, vincula y cierra."
---

Una tarea es algo que te espera: una pregunta sin respuesta, una petición, una promesa que hiciste.
Esta página te ayuda a no perder esas cosas entre tus chats. Al terminar, podrás pedir a tu agente la
agenda del día, convertir un mensaje en una tarea, vincularle los mensajes que le corresponden y
cerrarla cuando esté hecha. Las tareas se quedan en tu ordenador, en el almacén local de `tg`, `max`
y `memo`. Nada de esta página envía mensajes.

Las secciones marcadas como **Previsto** describen trabajo ya diseñado pero aún no disponible:
categorías, etiquetas en las tareas, claves por tipo, la reserva de tareas y la detección de duplicados.
[Cómo funcionan las tareas](./tasks-architecture.mdx) da el detalle técnico.

## De dónde salen las tareas

- **Las reglas las encuentran en los mensajes.** Una pregunta que nadie respondió se convierte en una
  tarea de tipo `question`. Un mensaje que te menciona se convierte en una tarea `mention`; la mención
  la debe marcar el servicio de mensajería, un nombre escrito sin más no cuenta. Una regla de
  respuesta automática con la acción `task` abre una tarea `request` por cada mensaje que coincide
  ([Telegram](./tg/replies.md), [MAX](./max/replies.md)). Las reglas se ejecutan cuando tu agente
  revisa tus chats y mientras la herramienta funciona en segundo plano (`review` y `serve`).
- **Las añade tu agente o tú.** Una promesa («te mando el contrato el lunes») o una petición que
  ninguna regla detectó se añade a mano, con el tipo `promise` o `request`.
- **Las tareas de proyecto** viven en un proyecto y tienen una clave: la clave del proyecto y un
  número, como `HRB-12`. Sus tipos son `chore`, `bug` y `feature`. Se crean con `memo`; consulta
  [Tareas y recordatorios en Memo](./memo/tasks.md).

Una regla cierra una tarea `question` o `mention` cuando respondes en el chat. Si un mensaje ya
tiene una tarea, añadirla otra vez devuelve la existente.

## Pídeselo a tu agente

```text prompt
Usa tg CLI. Sincroniza mis chats y muéstrame la agenda de tareas: qué está vencido, qué vence hoy y en qué chats esperan mi respuesta. Para cada tarea, muestra los mensajes de los que salió. No envíes nada.
```

Deberías recibir una lista corta: las tareas abiertas con su fecha límite y los chats donde la otra
persona escribió la última. Cada tarea apunta a sus mensajes, así que puedes ver por qué existe. Para
MAX, escribe «max CLI».

```text prompt
Usa tg CLI. En mi chat con Bob Sample prometí enviar el contrato firmado antes del viernes. Añade una tarea de promesa para ese mensaje, con fecha límite el viernes y un título claro. Vincula los mensajes anteriores donde acordamos el precio.
```

## Una tarea, muchos mensajes

Una tarea empieza con un mensaje, su fuente. Los mensajes posteriores sobre lo mismo se vinculan a
ella, así que la tarea guarda toda la historia. Un vínculo tiene un tipo: `related-to` (por defecto),
`evidence` (el mensaje demuestra que la tarea es real) o `created-from`. Una tarea también puede
apuntar a un chat, una persona, un documento, una nota o una dirección web.

Un chat puede tener muchas tareas. Tres preguntas distintas de Alice Example en un grupo son tres
tareas. Una tarea trata de una cosa, no de un chat ni de una persona.

## Comandos

<details>
<summary>Opcional: comandos para el terminal</summary>

Qué hay que mirar hoy:

```sh
tg personal tasks agenda
max personal tasks agenda
```

Tareas abiertas de un chat:

```sh
tg personal tasks list 'chat:"Renovation" state:open'
```

Añadir una tarea para un mensaje y planificarla:

```sh
tg personal tasks add msg:telegram/1/77/42 --type promise --title "Send Bob Sample the signed contract" --due 3d
tg personal tasks plan <task> --description "Done when Bob confirms he has it." --check 2d
```

Vincular más mensajes y verlo todo en un sitio:

```sh
tg personal tasks link <task> msg:telegram/1/77/45 msg:telegram/1/77/51 --kind evidence
tg personal tasks show <task>
```

Cerrarla:

```sh
tg personal tasks close <task> --as done --reason "contract sent"
tg personal tasks close <task> --as dismissed --reason no-reply-needed
```

`<task>` es la clave de la tarea, tal como la imprime `tasks agenda`, o su id completo. `max` tiene los mismos comandos.

</details>

- **agenda** lista las tareas vencidas, las que vencen pronto o toca revisar, y después los chats
  donde debes una respuesta y los chats donde la esperas tú. Avisa si el almacén lleva tiempo sin
  guardar nada.
- **plan** fija el título, la descripción, la fecha límite y la próxima revisión. La próxima revisión
  es cuándo tu agente debe volver a mirar la tarea; no te avisa a ti.
- **link** añade a una tarea mensajes, chats, personas, documentos, notas o direcciones.
- **show** muestra una tarea con su plan y todo lo vinculado.
- **close** cierra una tarea como `done` o `dismissed`. Una tarea cerrada se queda cerrada.

## Vínculos entre tareas de proyecto

Una tarea de proyecto puede esperar a otra (`blocked-by`), continuar otra (`follow-up-of`) o
simplemente estar relacionada con ella (`related-to`). Solo tú aplicas estos vínculos; un agente
puede proponerlos. Hoy funcionan entre tareas de proyecto en `memo`: consulta
[Qué hacer primero](./memo/tasks.md#qué-hacer-primero).

## Cómo trabaja tu agente con las tareas después de sincronizar

1. Tu agente descarga los mensajes nuevos (`messages sync`).
2. Ejecuta una revisión, y las reglas abren y cierran tareas.
3. Lee la agenda y contrasta cada tarea nueva con sus mensajes.
4. Pone un título y una fecha límite, vincula los mensajes que van juntos y cierra lo que está hecho.
5. Te muestra lo que cambió y pregunta antes de que algo salga de tu ordenador.

**Previsto:** el propio `sync` ejecutará las reglas desde donde se detuvo la vez anterior, e indicará
cuántas tareas abrió, cuántos mensajes unió a una tarea existente y cuántos pares envió a la lista de
revisión.

## Previsto: sin tareas duplicadas

La misma petición llega a menudo en varios mensajes: «¿me mandas la factura?», luego «la factura de
15 000, por favor», y un recordatorio dos días después. Debe seguir siendo una sola tarea. La
herramienta comprobará cada tarea nueva antes de crearla:

- **Segura de que es la misma tarea:** solo ocurre cuando la misma regla ya creó una tarea para el
  mismo mensaje. No se crea nada nuevo, y la respuesta dice a qué tarea y por qué.
- **No está segura:** la herramienta no adivina. Si la tarea la añade tu agente, la herramienta se
  niega y lista hasta cinco tareas parecidas con los motivos («misma persona, mismo importe»). El
  agente elige unir el mensaje a una de ellas o crear una tarea nueva. Si la tarea la encontró una
  regla, el par va a una lista de revisión para tu agente o para ti.
- **Claramente distinta:** se crea una tarea nueva.

La comprobación compara las palabras (también otras formas de una palabra y errores de escritura), la
persona, el importe, la fecha límite, la categoría, las respuestas y el tiempo. Compartir un chat no
basta nunca para que dos tareas sean «la misma». **La herramienta nunca fusiona tareas por su
cuenta.** Algunas tareas parecidas, como un regalo para mamá y otro para papá por el mismo importe, se
distinguen por el sentido de una palabra, así que decide tu agente o tú.

En la lista de revisión puedes fusionar un par o marcarlo como distinto. Una fusión pasa los mensajes a
la tarea que se queda y cierra la otra como duplicado. **Una fusión se puede deshacer**, y no se
borra nada.

```text
tasks duplicates
tasks merge REQ-23 --into REQ-22
tasks duplicates reject REQ-23 REQ-22
tasks unmerge REQ-23
```

## Previsto: categorías, etiquetas y claves

- **Una categoría** dice de qué trata una tarea: `money`, `documents`, `meeting`, `delivery`, `access`,
  `personal` u `other`. La lista está fijada en los ajustes, así que «finanzas» y «pagos» nunca
  conviven. Una regla elige la categoría por las palabras del mensaje; tu agente la corrige.
- **Las etiquetas**, como `urgent` o `waiting-for-them`, también sirven en las tareas: se aplican los
  comandos y filtros `tags` de siempre. Las etiquetas solo sirven para filtrar; la detección de
  duplicados no las tiene en cuenta.
- **Claves por tipo:** una tarea encontrada en un mensaje recibe una clave corta, como `Q-15` para una
  pregunta, `REQ-22` para una petición, `M-7` para una mención o `PR-4` para una promesa. Una clave no
  cambia nunca, así que puedes citarla en un chat o una nota. Las tareas anteriores conservan su
  clave actual, como `IN1A2B3C4D-17`; siguen funcionando los dos tipos de clave y el id completo.

```text
tasks add msg:telegram/1/77/42 --type request --category money
tasks categories
tasks agenda --category money
```

## Previsto: reservar una tarea

Cuando trabajan a la vez dos agentes, o un agente y tú, uno de ellos reserva antes la tarea. La
reserva termina sola a los 30 minutos, así que un agente detenido nunca bloquea una tarea. Cerrar una
tarea termina su reserva. La agenda oculta las tareas que ha reservado otro.

```text
tasks claim REQ-22 --for 30m
tasks release REQ-22
```

## Páginas relacionadas

- [Cómo funcionan las tareas](./tasks-architecture.mdx): los datos, las claves, la reserva y la
  detección de duplicados paso a paso.
- [Tareas y recordatorios en Memo](./memo/tasks.md): tareas de proyecto, responsables y recordatorios.
- [Búsqueda](./search.md): encuentra los mensajes de los que trata una tarea.
