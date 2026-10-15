---
title: "Tareas"
description: "Preguntas, peticiones y promesas de tus chats, guardadas como tareas que tu agente planifica, vincula y cierra."
---

Una tarea es algo que te espera: una pregunta sin respuesta, una petición, una promesa que hiciste.
Esta página te ayuda a no perder esas cosas entre tus chats. Al terminar, podrás pedir a tu agente la
agenda del día, convertir un mensaje en una tarea, vincularle los mensajes que le corresponden y
cerrarla cuando esté hecha. Las tareas se quedan en tu ordenador, en el almacén local de `tg`, `max`
y `memo`. Nada de esta página envía mensajes.

Las categorías, las etiquetas en las tareas, las claves por tipo, la reserva de tareas y la detección
de duplicados ya están en el núcleo común de las herramientas (cli-core). Las tienen `tg`, `max`
y `memo`. [Cómo funcionan las tareas](./tasks-architecture.mdx)
da el detalle técnico.

## De dónde salen las tareas

- **Las reglas las encuentran en los mensajes.** Una pregunta que nadie respondió se convierte en una
  tarea de tipo `question`. Un mensaje que te menciona se convierte en una tarea `mention`; la mención
  la debe marcar el servicio de mensajería, un nombre escrito sin más no cuenta. Una regla de
  respuesta automática con la acción `task` abre una tarea `request` por cada mensaje que coincide
  ([Telegram](./tg/replies.md), [MAX](./max/replies.md)). Las reglas se ejecutan cuando tu agente
  sincroniza o revisa tus chats y mientras la herramienta funciona en segundo plano (`messages sync`,
  `review` y `serve`). Una regla elige la categoría de la tarea por las palabras del mensaje.
- **Las añade tu agente o tú.** Una promesa («te mando el contrato el lunes») o una petición que
  ninguna regla detectó se añade a mano, con el tipo `promise` o `request` y una categoría.
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

```text prompt
Usa tg CLI. Revisa la lista de tareas que pueden ser duplicados. Fusiona los pares que claramente son el mismo trabajo, rechaza los que claramente son distintos y marca el resto como dudosos. Después muéstrame solo los pares dudosos.
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
tg personal tasks add msg:telegram/1/77/42 --type promise --category documents --title "Send Bob Sample the signed contract" --due 3d
tg personal tasks plan <task> --description "Done when Bob confirms he has it." --remind-time 2d
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
- **add** necesita un tipo. También necesita una categoría
  (`--category`), y se niega si ya existe una tarea parecida; consulta
  [Sin tareas duplicadas](#sin-tareas-duplicadas).
- **plan** fija el título, la descripción, la fecha límite y la próxima revisión. La próxima revisión
  es cuándo tu agente debe volver a mirar la tarea; no te avisa a ti.
- **link** añade a una tarea mensajes, chats, personas, documentos, notas o direcciones.
- **show** muestra una tarea con su plan y todo lo vinculado.
- **close** cierra una tarea como `done` o `dismissed`. Una tarea cerrada se queda cerrada. Solo
  `tasks unmerge` vuelve a abrir una tarea, y solo una que cerró una fusión.

## Vínculos entre tareas

Una tarea de proyecto puede esperar a otra (`blocked-by`), continuar otra (`follow-up-of`) o
simplemente estar relacionada con ella (`related-to`). Solo tú aplicas estos vínculos; un agente
puede proponerlos. Funcionan entre tareas de proyecto en `memo`: consulta
[Qué hacer primero](./memo/tasks.md#qué-hacer-primero).

Hay dos tipos más. `duplicate-of` dice que una tarea es el mismo trabajo que otra. Lo escribe una
fusión, y une tareas encontradas en mensajes de una misma cuenta. `discovered-from` dice que una tarea
apareció mientras se trabajaba en otra.

## Cómo trabaja tu agente con las tareas después de sincronizar

1. Tu agente descarga los mensajes nuevos (`messages sync`). La sincronización ejecuta las reglas de
   tareas sobre lo que guardó, desde donde se detuvo la vez anterior. La primera vez lee solo los
   chats con algún mensaje de los últimos 14 días, así que las preguntas antiguas no se convierten en
   tareas. La respuesta dice cuántas tareas se abrieron, cuántas se cerraron y cuántas fueron a la
   lista de revisión.
2. Lee la agenda y contrasta cada tarea nueva con sus mensajes.
3. Pone un título, una fecha límite y la categoría correcta, vincula los mensajes que van juntos y
   cierra lo que está hecho.
4. Revisa la lista de posibles duplicados (ver abajo).
5. Te muestra lo que cambió y pregunta antes de que algo salga de tu ordenador.

## Sin tareas duplicadas

La misma petición llega a menudo en varios mensajes: «¿me mandas la factura?», luego «la factura de
15 000, por favor», y un recordatorio dos días después. Debe seguir siendo una sola tarea. La
herramienta comprueba cada tarea nueva antes de crearla:

- **Segura de que es la misma tarea:** solo ocurre cuando el mismo mensaje ya tiene una tarea de ese
  tipo. Una regla tampoco abre nada para un mensaje vinculado a una tarea como `evidence`. No se crea
  nada nuevo, y la respuesta muestra esa tarea.
- **No está segura:** la herramienta no adivina. Si la tarea la añade tu agente, `tasks add` se niega
  y lista hasta cinco tareas parecidas con los motivos («misma persona, mismo importe»). El agente
  repite el comando con `--attach <task>` para unir el mensaje a una de ellas, o con `--new` para crear
  una tarea nueva. Si la tarea la encontró una regla, la tarea se crea y los pares parecidos van a una
  lista de revisión.
- **Claramente distinta:** se crea una tarea nueva.

La comprobación compara las palabras (también otras formas de una palabra y errores de escritura), la
persona, el importe, la fecha límite, la categoría, las respuestas y el tiempo. Compartir un chat no
basta nunca para que dos tareas sean «la misma». **La herramienta nunca fusiona tareas solo por una
puntuación.** Algunas tareas parecidas, como un regalo para mamá y otro para papá por el mismo importe,
se distinguen por el sentido de una palabra, así que decide un agente o tú.

**Quién decide.** El agente que revisa tus chats después de sincronizar recorre la lista de revisión.
Fusiona los pares que son el mismo trabajo y rechaza los que no lo son. Cuando no puede decidir, marca
el par como dudoso. Tú ves solo los pares dudosos, con `tasks duplicates --unsure`.

Una fusión vincula todos los mensajes del duplicado a la tarea que se queda y cierra el duplicado como
`dismissed`, con un vínculo `duplicate-of`. **Una fusión se puede deshacer**, y no se borra nada. Un
par rechazado no vuelve.

```text
tasks similar REQ-23
tasks duplicates
tasks merge REQ-23 --into REQ-22
tasks duplicates reject REQ-23 REQ-22
tasks duplicates unsure REQ-23 REQ-22
tasks duplicates --unsure
tasks unmerge REQ-23
```

`tasks similar` muestra las tareas que pueden ser el mismo trabajo que una tarea, las mejores
primero, cada una con una banda (`likely`, `maybe` o `different`) y los motivos. No cambia nada.

## Categorías, etiquetas y claves

- **Una categoría** dice de qué trata una tarea. La lista por defecto es `money`, `documents`,
  `meeting`, `delivery`, `access`, `personal` y `other`. Hay una sola lista para todo el almacén,
  común a `tg`, `max` y `memo`, así que «finanzas» y «pagos» nunca conviven. `tasks add` necesita una
  categoría y rechaza un nombre que no está en la lista. Una regla elige la categoría por las palabras
  del mensaje, u `other` si ninguna coincide; tu agente la corrige con `tasks plan --category`.
- **Puedes cambiar la lista.** Cada categoría tiene un significado y las palabras por las que la elige
  una regla. Una palabra puede indicar su idioma, como `es:vuelo`. Puedes añadir o cambiar una
  categoría, quitar una o volver a la lista por defecto. `other` no se puede quitar. Las tareas
  conservan la categoría que ya tienen.
- **Las etiquetas**, como `urgent` o `waiting-for-them`, también sirven en las tareas:
  `tags add urgent --task REQ-22`. Las etiquetas solo sirven para filtrar; la detección de duplicados
  no las tiene en cuenta.
- **Claves por tipo:** una tarea encontrada en un mensaje recibe una clave corta, como `Q-15` para una
  pregunta, `REQ-22` para una petición, `M-7` para una mención o `PR-4` para una promesa. Una clave no
  cambia nunca, así que puedes citarla en un chat o una nota. Las tareas anteriores conservan su
  clave, como `IN1A2B3C4D-17`; siguen funcionando los dos tipos de clave y el id completo.

```text
tasks add msg:telegram/1/77/42 --type request --category money
tasks categories
tasks agenda --category money --tag urgent
tasks list category:money
config set task_categories.travel "trips and tickets | flight, hotel, es:vuelo"
config unset task_categories.travel
config unset task_categories
config show
```

Los comandos `config` cambian el almacén, no un perfil: la lista es la misma en todos los perfiles.

## Reservar una tarea

Cuando trabajan a la vez dos agentes, o un agente y tú, uno de ellos reserva antes la tarea. La
reserva termina sola a los 30 minutos, así que un agente detenido nunca bloquea una tarea. Reservar
otra vez alarga tu propia reserva. Cerrar una tarea termina su reserva. La agenda muestra quién tiene
cada tarea y oculta las que ha reservado otro; `tasks agenda --claimed` las muestra también. Tú, como
propietario, puedes liberar cualquier reserva.

Quien reserva es una sesión de agente. La herramienta toma lo primero que esté definido:

1. `--holder <name>`
2. la variable de entorno `WIRECAT_HOLDER`
3. `claude-code:<session id>`, de la variable `CLAUDE_CODE_SESSION_ID` que define Claude Code
4. el nombre del agente, de la variable `AI_AGENT`
5. `owner`

Un agente sin variable de sesión, como un agente web, pasa el id de su chat con `--holder`.

```text
tasks claim REQ-22 --for 30m
tasks release REQ-22
tasks agenda --claimed
```

Los agentes que usan el servidor MCP tienen las mismas herramientas, como `tasks_claim`,
`tasks_release`, `tasks_categories`, `tasks_similar`, `tasks_duplicates`, `tasks_merge` y `tasks_unmerge`.

## Aún no está hecho

- **Una comprobación cuando un mensaje se vincula a una tarea existente.** La comprobación lee solo el
  título, la descripción y el mensaje de origen de una tarea. Primero tiene que aprender a leer
  también los mensajes vinculados.
- **Ajustar los pesos con tus respuestas.** Cada fusión, rechazo, `--attach` y `--new` se guarda,
  pero todavía nada los usa para cambiar los pesos.

## Páginas relacionadas

- [Cómo funcionan las tareas](./tasks-architecture.mdx): los datos, las claves, la reserva y la
  detección de duplicados paso a paso.
- [Tareas y recordatorios en Memo](./memo/tasks.md): tareas de proyecto, responsables y recordatorios.
- [Búsqueda](./search.md): encuentra los mensajes de los que trata una tarea.
