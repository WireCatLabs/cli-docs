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
de duplicados ya están en el núcleo común de las herramientas (cli-core). `tg` y `max` las tienen
todas; `memo` aún no tiene la reserva ni la revisión de duplicados. Los cierres que te esperan cuando
un agente no está seguro, las tareas de seguimiento, la lista de 59 categorías y la detección de
duplicados que lee los mensajes vinculados están en `tg` y `max`; `memo` aún no los tiene. Por ahora
solo `tg` lee la lista de categorías del archivo de ajustes compartido.
[Cómo funcionan las tareas](./tasks-architecture.mdx) da el detalle técnico.

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
Usa tg CLI. Muéstrame las tareas que un agente sugirió cerrar, con su motivo y su certeza. No cierres ni rechaces nada todavía.
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

Ver los cierres que sugirió un agente y confirmar o rechazar uno:

```sh
tg personal tasks list close:suggested
tg personal tasks close <task>
tg personal tasks reject <task>
```

`<task>` es la clave de la tarea, tal como la imprime `tasks agenda`, o su id completo. `max` tiene los mismos comandos, incluidos los cierres sugeridos.

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
  `tasks unmerge` vuelve a abrir una tarea, y solo una que cerró una fusión. El cierre de un agente
  puede esperarte; consulta [Cuando un agente cierra una tarea](#cuando-un-agente-cierra-una-tarea).
- **reject** rechaza un cierre que sugirió un agente. La tarea sigue abierta.

## Vínculos entre tareas

Una tarea de proyecto puede esperar a otra (`blocked-by`), continuar otra (`follow-up-of`) o
simplemente estar relacionada con ella (`related-to`). Solo tú aplicas estos vínculos; un agente
puede proponerlos. Funcionan entre tareas de proyecto en `memo`: consulta
[Qué hacer primero](./memo/tasks.md#qué-hacer-primero).

La herramienta también escribe `follow-up-of` por sí misma entre tareas encontradas en mensajes: una
tarea nueva sobre una tarea cerrada en los últimos 14 días se vincula a ella como seguimiento
(consulta [Sin tareas duplicadas](#sin-tareas-duplicadas)).

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
   cierra lo que está hecho. Si no está seguro de que una tarea esté hecha, su cierre te espera.
4. Revisa la lista de posibles duplicados (ver abajo).
5. Te muestra lo que cambió y pregunta antes de que algo salga de tu ordenador.

## Cuando un agente cierra una tarea

Lo admiten `tg` y `max`. En `memo`, el cierre de un agente sigue cerrando la tarea.

Un agente que cierra una tarea indica su certeza de que no hace falta nada más, con un número de 0 a 1
(`--certainty`). Si llega al umbral del almacén (0.8 por defecto), la tarea se cierra. Por debajo, la
tarea sigue abierta con una sugerencia de cierre: qué agente la hizo, qué certeza tenía y por qué. La
agenda muestra estas tareas, y `tasks list close:suggested` las encuentra. Confirmas una sugerencia
con `tasks close <task>` o la rechazas con `tasks reject <task>`; más tarde el agente puede volver a
sugerir el cierre. Un cierre no se puede deshacer, así que uno dudoso te espera.

Dos ajustes de todo el almacén lo controlan: `task_agent_close` (`on` por defecto; `off` convierte
cada cierre de un agente en una sugerencia) y `task_agent_close_min` (0.8 por defecto).

La herramienta sabe que la ejecuta un agente por la variable de entorno `AI_AGENT` o `CLAUDECODE`. El
cierre de un agente sin `--certainty` se rechaza con `task.certainty-required`. Cuando tú le pediste
cerrar la tarea, el agente la cierra en tu nombre con `--as-owner`. Una regla que cierra una pregunta
que respondiste en el chat no es un cierre de agente y no necesita certeza.

```text
tasks close REQ-22 --as done --certainty 0.9 --reason "invoice sent"
tasks list close:suggested
tasks close REQ-22
tasks reject REQ-22
config set task_agent_close_min 0.9
config set task_agent_close off
```

## Sin tareas duplicadas

La misma petición llega a menudo en varios mensajes: «¿me mandas la factura?», luego «la factura de
15 000, por favor», y un recordatorio dos días después. Debe seguir siendo una sola tarea. La
herramienta comprueba cada tarea nueva antes de crearla:

- **Segura de que es la misma tarea:** solo ocurre cuando el mismo mensaje ya tiene una tarea de ese
  tipo. Una regla tampoco abre nada para un mensaje vinculado a una tarea como `evidence`. No se crea
  nada nuevo, y la respuesta muestra esa tarea.
- **No está segura:** la herramienta no adivina. Si la tarea la añade tu agente, `tasks add` se niega
  y lista hasta cinco tareas parecidas con los motivos («misma persona, mismo importe»). El agente
  repite el comando con `--into <task>` para unir el mensaje a una de ellas, o con `--new` para crear
  una tarea nueva. Si la tarea la encontró una regla, la tarea se crea y los pares parecidos van a una
  lista de revisión.
- **Claramente distinta:** se crea una tarea nueva.
- **Parecida a una tarea cerrada en los últimos 14 días:** se crea una tarea nueva, vinculada
  `follow-up-of` a la cerrada. La cerrada sigue cerrada. `tasks add` se niega solo mientras una tarea
  abierta pueda ser el mismo trabajo.

La comprobación compara las palabras (también otras formas de una palabra y errores de escritura), la
persona, el importe, la fecha límite, la categoría, las respuestas y el tiempo. Lee el título y la
descripción de cada tarea, su mensaje de origen y sus 5 mensajes vinculados más recientes, así que una
tarea que una regla abrió con el título vacío se compara por su mensaje. Lee fechas límite en inglés,
ruso y español, como `by Friday`, `до пятницы` o `el viernes`. Compartir un chat no
basta nunca para que dos tareas sean «la misma». **La herramienta nunca fusiona tareas solo por una
puntuación.** Algunas tareas parecidas, como un regalo para mamá y otro para papá por el mismo importe,
se distinguen por el sentido de una palabra, así que decide un agente o tú.

**Quién decide.** El agente que revisa tus chats después de sincronizar recorre la lista de revisión.
Fusiona los pares que son el mismo trabajo y rechaza los que no lo son. Cuando no puede decidir, marca
el par como dudoso. Tú ves solo los pares dudosos, con `tasks duplicates decision:unsure`.

Cuando se vincula un mensaje a una tarea (`tasks link`, `tasks add --into` o `tasks merge`), la
comprobación se repite para esa tarea. Los nuevos pares posibles van a la lista de
revisión. El vínculo se mantiene siempre.

Una fusión vincula todos los mensajes del duplicado a la tarea que se queda y cierra el duplicado como
`dismissed`, con un vínculo `duplicate-of`. **Una fusión se puede deshacer**, y no se borra nada. Un
par rechazado no vuelve.

```text
tasks related REQ-23
tasks duplicates
tasks merge REQ-23 --into REQ-22
tasks duplicates reject REQ-23 REQ-22
tasks duplicates defer REQ-23 REQ-22
tasks duplicates decision:unsure
tasks unmerge REQ-23
```

`tasks related` muestra las tareas que pueden ser el mismo trabajo que una tarea, las mejores
primero, cada una con una banda (`likely`, `maybe` o `different`) y los motivos. No cambia nada.

## Categorías, etiquetas y claves

- **Una categoría** dice de qué trata una tarea. La lista por defecto tiene 59 categorías: primero
  las concretas, como `taxes`, `bills`, `health`, `travel` y `fitness`; después las amplias, como
  `money`, `documents` y `meeting`; y al final `work`, `personal` y `other`. `tasks categories` muestra
  cada una con su significado y sus palabras. `tasks add` necesita una categoría y rechaza un nombre
  que no está en la lista. Una regla elige la categoría por las palabras del mensaje, la más concreta
  si encajan dos (una factura de suministros es `bills`, no `money`), u `other` si ninguna coincide; tu
  agente la corrige con `tasks plan --category`.
- **Una lista en un archivo de ajustes compartido.** `tg` lee tus cambios a la lista de
  `~/.config/WireCat/config.json`, sección `task_categories`. No es el archivo de ajustes de un perfil,
  así que la lista es la misma en todos los perfiles, y «finanzas» y «pagos» nunca conviven. `max` y
  `memo` aún no leen este archivo. Usan una lista guardada en el almacén o su propia lista por defecto:
  `max` tiene las mismas 59 categorías, y `memo` aún tiene las siete anteriores (`money`, `documents`,
  `meeting`, `delivery`, `access`, `personal` y `other`).
- **Puedes cambiar la lista.** Cada categoría tiene un significado y las palabras por las que la elige
  una regla. Una palabra coincide también con sus otras formas; una palabra puede indicar su idioma,
  como `es:vuelo`, y entonces una palabra española como `es:pagar` coincide también con `pagues` en un
  mensaje en español. Puedes añadir o cambiar una categoría, quitar una o volver a la lista por
  defecto; una lista admite hasta 80 categorías. `other` no se puede quitar. El archivo solo guarda tus
  cambios, así que las categorías que añada una versión posterior siguen llegando. `tasks categories`
  indica el archivo en `file`, y `config show` marca las categorías que vienen de él. Un archivo que no
  es JSON válido o que nombra una categoría incorrecta se rechaza indicando su ruta.
- **Una lista guardada en el almacén pasa al archivo.** Una lista que `tg` guardó en el almacén antes de
  usar el archivo sigue valiendo. El siguiente `config set` o `config unset` de una categoría la pasa
  al archivo y la quita del almacén; desde entonces, `max` y `memo` vuelven a usar su propia lista por
  defecto. `config unset task_categories` quita la sección del archivo y da la lista por defecto actual.
- **Una categoría que salió de la lista.** Las tareas conservan su categoría cuando sale de la lista.
  `tasks categories` nombra esas categorías en `unlisted`, con sus tareas abiertas y el total, y
  `tasks agenda` nombra las que aún llevan tareas abiertas (`unlisted_categories`). Encuentra sus
  tareas con `tasks list category:<name>` y mueve una con `tasks plan <task> --category <name>`.
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
tasks agenda category:money tag:urgent
tasks list category:money
tasks plan REQ-22 --category bills
config set task_categories.travel "trips and tickets | flight, hotel, es:vuelo"
config unset task_categories.travel
config unset task_categories
config show
```

En `tg` también puedes editar el archivo a mano. Un nombre con su significado y sus palabras añade o
sustituye una categoría, y `null` quita una de la lista por defecto:

```json
{
  "task_categories": {
    "garden": "plants | seedling, es:planta",
    "religion": null
  }
}
```

Los comandos `config set task_categories…` y `config unset task_categories…` escriben en el mismo
archivo y conservan sus otras secciones. Ningún comando `config` de esta página cambia un perfil: los
ajustes de [Cuando un agente cierra una tarea](#cuando-un-agente-cierra-una-tarea) siguen en el
almacén.

## Reservar una tarea

Cuando trabajan a la vez dos agentes, o un agente y tú, uno de ellos reserva antes la tarea. La
reserva termina sola a los 30 minutos, así que un agente detenido nunca bloquea una tarea. Reservar
otra vez alarga tu propia reserva. Cerrar una tarea termina su reserva. La agenda muestra quién tiene
cada tarea y oculta las que ha reservado otro; `tasks agenda claimed:any` las muestra también. Tú, como
propietario, puedes liberar cualquier reserva.

Quien reserva es una sesión de agente. La herramienta toma lo primero que esté definido:

1. `--holder <name>`
2. la variable de entorno `WIRECAT_HOLDER`
3. `claude-code:<session id>`, de la variable `CLAUDE_CODE_SESSION_ID` que define Claude Code
4. el nombre del agente, de la variable `AI_AGENT`
5. `owner`

Un agente sin variable de sesión, como un agente web, pasa el id de su chat con `--holder`.

```text
tasks claim REQ-22 --lease 30m
tasks release REQ-22
tasks agenda claimed:any
```

Los agentes que usan el servidor MCP tienen las mismas herramientas, como `tasks_claim`,
`tasks_release`, `tasks_categories`, `tasks_related`, `tasks_duplicates`, `tasks_merge` y `tasks_unmerge`.
En `tg`, `tasks_close` necesita `certainty`, igual que el `tasks close` de un agente.

## Aún no está hecho

- **Ajustar los pesos con tus respuestas.** Cada fusión, rechazo, `--into` y `--new` se guarda,
  pero todavía nada los usa para cambiar los pesos.

## Páginas relacionadas

- [Cómo funcionan las tareas](./tasks-architecture.mdx): los datos, las claves, la reserva y la
  detección de duplicados paso a paso.
- [Tareas y recordatorios en Memo](./memo/tasks.md): tareas de proyecto, responsables y recordatorios.
- [Búsqueda](./search.md): encuentra los mensajes de los que trata una tarea.
