---
title: "Tareas"
description: "Preguntas, peticiones y promesas de tus chats, las tuyas y las que otros te deben, guardadas como tareas que tu agente planifica, vincula y cierra."
---

Una tarea es algo que tienes que hacer, o algo que alguien te debe: una pregunta que no respondiste,
una petición, una promesa que hiciste o una promesa que te hicieron. Esta página te ayuda a no perder
esas cosas entre tus chats. Al terminar, podrás pedir a tu agente la agenda del día, convertir un
mensaje en una tarea, decir quién debe hacerla, vincularle los mensajes que le corresponden y
cerrarla cuando esté hecha. Las tareas se quedan en tu ordenador, en el almacén local de `tg`, `max`
y `memo`. Nada de esta página envía mensajes.

Las categorías, las etiquetas en las tareas, las claves por tipo, la reserva de tareas y la detección
de duplicados ya están en el núcleo común de las herramientas (cli-core). `tg` y `max` las tienen
todas; `memo` aún no tiene la reserva ni la revisión de duplicados. Los cierres que te esperan cuando
un agente no está seguro, las tareas de seguimiento, la lista de 59 categorías y la detección de
duplicados que lee los mensajes vinculados están en `tg` y `max`; `memo` aún no los tiene. `tg` y
`max` leen la lista de categorías del archivo de ajustes compartido. En ellos la primera
sincronización no abre tareas de tu historial, y las tareas de un chat se crean cuando lo pides
(`tasks scan`). Abren tareas en un grupo únicamente por lo que te preguntan a ti, y registran quién
debe hacer una tarea encontrada en un mensaje.
[Cómo funcionan las tareas](./tasks-architecture.mdx) da el detalle técnico.

## De dónde salen las tareas

- **Las reglas las encuentran en los mensajes, donde se te pide algo.** En `tg` y `max` decide el tipo de chat:
  - **Un chat individual:** cada pregunta que no respondiste se convierte en una tarea de tipo
    `question`.
  - **Un grupo:** solo una pregunta que responde a tu mensaje. Las preguntas de otras personas no
    son tus tareas.
  - **Un canal, o Mensajes guardados en Telegram:** nada.

  Un mensaje que te menciona se convierte en una tarea `mention`, en un chat individual o en un grupo;
  la mención la debe marcar el servicio de mensajería, un nombre escrito sin más no cuenta. Un chat
  cuyo tipo la herramienta no conoce cuenta como grupo. Una regla de
  respuesta automática con la acción `task` abre una tarea `request` por cada mensaje que coincide
  ([Telegram](./tg/replies.md), [MAX](./max/replies.md)). Las reglas se ejecutan cuando tu agente
  sincroniza o revisa tus chats y mientras la herramienta funciona en segundo plano (`messages sync`,
  `review` y `serve`). En `max`, `serve` abre solo las tareas de las reglas de respuesta automática; las
  demás reglas se ejecutan en la siguiente sincronización o revisión. Una regla elige la categoría de la tarea por las palabras del mensaje.
- **Un grupo vigilado te da todas las preguntas.** Si quieres como tarea cada pregunta sin respuesta de
  un grupo, sea para quien sea, ponle al grupo la etiqueta `watch-tasks` (consulta
  [Todas las preguntas de un grupo](#todas-las-preguntas-de-un-grupo)).
- **Tus mensajes antiguos esperan tu decisión.** En `tg` y `max`, la primera sincronización de una
  cuenta no abre tareas de tu historial. Las sincronizaciones siguientes abren tareas a partir de mensajes nuevos.
  Si quieres las tareas del historial de un chat, tu agente te muestra primero lo que se abriría y lo
  abre cuando estés de acuerdo; consulta [Tareas del historial de un chat](#tareas-del-historial-de-un-chat).
- **Las añade tu agente o tú.** Una promesa («te mando el contrato el lunes») o una petición que
  ninguna regla detectó se añade a mano, con el tipo `promise` o `request` y una categoría. Una promesa
  que alguien te hizo se añade igual, con esa persona como responsable; consulta
  [Lo que otros te deben](#lo-que-otros-te-deben).
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
Usa tg CLI. En mi chat con Bob Sample, él prometió enviarme la factura firmada antes del viernes. Añádelo como tarea suya, con fecha límite el viernes. Luego muéstrame todo lo que otros me deben.
```

```text prompt
Usa tg CLI. Muéstrame qué tareas se abrirían con los últimos 300 mensajes de mi chat con Bob Sample. No abras nada todavía.
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

Un chat puede tener muchas tareas. Tres preguntas distintas que Alice Example te hace en un chat son
tres tareas. Una tarea trata de una cosa, no de un chat ni de una persona.

## Lo que otros te deben

Una tarea no es solo lo que tienes que hacer tú. Cuando alguien te promete algo, como «mañana te mando
las fotos», guárdalo también como tarea, con esa persona como su **responsable**: quien debe hacerla.
Así puedes preguntar a tu agente qué te deben otros y reclamar lo que se retrasa. En `tg` y `max`, una
tarea encontrada en un mensaje puede tener responsables; las tareas de proyecto de `memo` tienen los suyos.

`tasks add` y `tasks plan` aceptan `--assignee`:

- `--assignee sender`: quien envió el mensaje de la tarea.
- `--assignee person:<id>`: una persona que nombras. Varios valores nombran a varias personas.
- `--assignee none`: quita los responsables.

Una tarea sin responsable está bien: es mejor que una tarea perdida. Si la herramienta no conoce a la
persona que envió el mensaje, la tarea se añade igualmente, sin responsable.

`tasks agenda` lista las tareas abiertas que otros te deben en "assigned", primero las más antiguas;
`tasks list "assignee:any state:open"` también las lista. `assignee:none`
encuentra las tareas sin responsable, y `assignee:person:<id>` las de una persona. Los agentes que usan
el servidor MCP pasan `assignee` a `tasks_add` y `tasks_plan`.

```text
tasks add msg:telegram/1/77/42 --type promise --category documents --assignee sender
tasks plan PR-4 --assignee person:12
tasks plan PR-4 --assignee none
tasks list "assignee:any state:open"
```

## Todas las preguntas de un grupo

En un grupo, las reglas abren una tarea solo por una pregunta que te responde a ti y por una mención
tuya. En un grupo pequeño donde respondes de todo, como un grupo con un cliente o el de la familia,
quizá quieras todas las preguntas. Ponle a ese grupo la etiqueta `watch-tasks`:

```sh
tg personal tags add --chat "Renovation" watch-tasks
tg personal tags remove --chat "Renovation" watch-tasks
```

La etiqueta funciona en `tg` y `max`, y solo en grupos; un canal nunca abre tareas. Lo que cambia:

- **Cada pregunta que no respondiste abre una tarea, sea para quien sea.** Una regla reconoce una
  pregunta por su signo de interrogación o por una respuesta a tu mensaje.
- **Solo mensajes nuevos.** Las tareas se abren después de cada sincronización, en `review` y, en
  `tg`, mientras `serve` está en marcha. Para los mensajes antiguos del grupo, usa
  [`tasks scan`](#tareas-del-historial-de-un-chat).
- **Preguntas, no todos los mensajes.** Una petición o una promesa sin signo de interrogación, como
  «mándame el archivo» o «lo hago mañana», no es tarea de una regla. Tu agente la añade con
  `tasks add`, con `--assignee sender` cuando es una promesa del propio remitente.
- **La respuesta de cualquier miembro cierra una pregunta.** La cierra tu respuesta y también una
  respuesta a la pregunta de cualquier miembro que no sea quien preguntó. Un mensaje posterior que no
  responde a la pregunta no cierra nada: cierra esa tarea tú o deja que tu agente la cierre indicando su
  certeza; consulta [Cuando un agente cierra una tarea](#cuando-un-agente-cierra-una-tarea).
- **Sin responsable.** Una tarea que abre una regla no tiene responsable; tu agente puede añadirlo con
  `tasks plan`.

Pon la etiqueta solo en grupos donde las respuestas te tocan a ti. Un grupo muy activo con la etiqueta
te da muchas tareas.

## Usar las tareas de forma fiable

**Para recibir pocas tareas que no necesitas:**

- Las reglas abren tareas solo donde te piden algo: en los chats uno a uno y, en los grupos, solo una
  respuesta a ti o una mención tuya. Los canales no abren nada.
- La primera sincronización no abre tareas de tu historial. Revisa el historial de un chat solo
  cuando tú lo decidas, y lee la lista antes de añadir `--yes`.
- Pon la etiqueta `watch-tasks` solo en grupos pequeños de los que te encargas.
- La comprobación de duplicados frena una tarea que puede ser el mismo trabajo que una abierta; tu
  agente vincula el mensaje a esa tarea.

**Para no perder nada:**

- La agenda (`tasks agenda`) muestra los chats donde otra persona escribió la última y no
  respondiste, y los chats donde escribiste tú la última y nadie respondió. Aparecen aunque no haya
  tarea.
- Pide a tu agente que lea los mensajes nuevos de cada día y añada lo que las reglas no ven: peticiones
  y promesas sin signo de interrogación, tuyas y de otras personas.
- Guarda lo que otros te deben como tareas con responsable. La agenda las lista en "assigned", primero
  las más antiguas.

```text prompt
Usa tg CLI. Sincroniza mis chats y muéstrame la agenda de tareas. Después lee los mensajes nuevos de hoy en mis chats uno a uno y en los grupos con la etiqueta watch-tasks, y añade una tarea por cada petición o promesa que las reglas no detectaron, con el remitente como responsable cuando sea su promesa. Muéstrame la lista antes de añadir nada. No envíes nada.
```

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
tg personal tasks update <task> --description "Done when Bob confirms he has it." --remind-time 2d
```

Vincular más mensajes y verlo todo en un sitio:

```sh
tg personal tasks link <task> msg:telegram/1/77/45 msg:telegram/1/77/51 --kind evidence
tg personal tasks show <task>
```

Ver qué tareas abriría el historial de un chat y abrirlas:

```sh
tg personal tasks scan "Renovation"
tg personal tasks scan "Renovation" --last 300 --yes
```

Guarda una promesa que te hicieron como tarea de quien la envió, y luego lista lo que otros te deben:

```sh
tg personal tasks add msg:telegram/1/77/48 --type promise --category documents --assignee sender
tg personal tasks list "assignee:any state:open"
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

`<task>` es la clave de la tarea, tal como la imprime `tasks agenda`, o su id completo. `max` tiene los mismos comandos, incluidos los cierres sugeridos y `--assignee`.

</details>

- **agenda** lista las tareas vencidas, las que vencen pronto o toca revisar, y después los chats
  donde debes una respuesta y los chats donde la esperas tú, y por último lo que otros te deben: las
  tareas abiertas con responsable, primero las más antiguas. Avisa si el almacén lleva tiempo sin
  guardar nada.
- **add** necesita un tipo. También necesita una categoría
  (`--category`), y se niega si ya existe una tarea parecida; consulta
  [Sin tareas duplicadas](#sin-tareas-duplicadas).
- **plan** fija el título, la descripción, la fecha límite, la próxima revisión y los
  responsables. La próxima revisión
  es cuándo tu agente debe volver a mirar la tarea; no te avisa a ti.
- **link** añade a una tarea mensajes, chats, personas, documentos, notas o direcciones.
- **show** muestra una tarea con su plan y todo lo vinculado.
- **scan** ejecuta las reglas de tareas sobre los mensajes guardados más recientes de un chat y lista
  las tareas que abrirían. Solo las abre con `--yes`. Consulta
  [Tareas del historial de un chat](#tareas-del-historial-de-un-chat).
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
(consulta [Sin tareas duplicadas](#sin-tareas-duplicadas)). En `tg` y `max`, `tasks show` sobre la tarea cerrada
también nombra la tarea que le da seguimiento.

Hay dos tipos más. `duplicate-of` dice que una tarea es el mismo trabajo que otra. Lo escribe una
fusión, y une tareas encontradas en mensajes de una misma cuenta. `discovered-from` dice que una tarea
apareció mientras se trabajaba en otra.

## Cómo trabaja tu agente con las tareas después de sincronizar

1. Tu agente descarga los mensajes nuevos (`messages sync`). La sincronización ejecuta las reglas de
   tareas sobre lo que guardó, desde donde se detuvo la vez anterior. La primera vez lee solo los
   chats con algún mensaje de los últimos 14 días. En `tg` y `max`, además, la primera vez no abre
   ninguna tarea de esos mensajes: la respuesta cuenta las tareas que dejó sin abrir y nombra
   `tasks scan`. Una sincronización posterior se salta un chat en el que no se envió nada nuevo, así que los mensajes
   antiguos que descarga no abren tareas. La respuesta dice cuántas tareas se abrieron, cuántas se
   cerraron y cuántas fueron a la lista de revisión.
2. Lee la agenda y contrasta cada tarea nueva con sus mensajes.
3. Pone un título, una fecha límite y la categoría correcta, vincula los mensajes que van juntos y
   cierra lo que está hecho. Si no está seguro de que una tarea esté hecha, su cierre te espera.
4. Revisa la lista de posibles duplicados (ver abajo).
5. Te muestra lo que cambió y pregunta antes de que algo salga de tu ordenador.

## Tareas del historial de un chat

La primera sincronización de una cuenta en `tg` y `max` lee tu historial, pero no abre tareas a partir de él:
las preguntas antiguas a menudo ya se respondieron en otro sitio, o ya no importan. Tú decides qué
chats merecen el trabajo.

1. Pregunta a tu agente qué tareas abriría el historial de un chat. Ejecuta `tasks scan` con ese
   chat, que lee los 50 mensajes guardados más recientes (`--last` lee hasta 1000). La respuesta
   lista el tipo, la categoría y el mensaje de cada tarea. No cambia nada.
2. Revisa la lista. Si estás de acuerdo, el agente ejecuta el mismo comando con `--yes`. Las tareas se
   abren pasando por la comprobación de duplicados, como en una sincronización, y se cierra la tarea
   abierta de una pregunta que ya respondiste.

La revisión usa las mismas reglas que una sincronización: un canal no abre nada, y un grupo
solo lo que te preguntan a ti, salvo que le pusieras la etiqueta `watch-tasks`. `tasks scan` lee solo
los mensajes guardados en tu ordenador y no envía nada. Los agentes que usan el servidor MCP tienen la
misma herramienta, `tasks_scan`, con `yes` en lugar de `--yes`.

Si quieres que la primera sincronización abra tareas del historial,
`config set task_first_pass_per_chat <n>` le permite abrir hasta n tareas por chat, primero las más
recientes (0 por defecto, como mucho 1000). Este ajuste vale para todo el almacén, como los ajustes de
[Cuando un agente cierra una tarea](#cuando-un-agente-cierra-una-tarea).

```text
tasks scan "Renovation"
tasks scan "Renovation" --last 300 --yes
config set task_first_pass_per_chat 20
config unset task_first_pass_per_chat
```

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
persona, el importe, la fecha límite, la categoría, las respuestas y el tiempo. En `tg` y `max`, el
tiempo es cuándo se enviaron los mensajes de las tareas, no cuándo se escribieron las tareas, así que
las tareas escritas de una vez a partir del historial no parecen iguales. En `tg` y `max`, dos tareas sacadas
de un mismo mensaje, como una promesa y una petición en un mensaje largo, se comparan solo por su
título y su descripción: el mensaje compartido no dice si son el mismo trabajo. Lee el título y la
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
- **Una lista en un archivo de ajustes compartido.** `tg` y `max` leen tus cambios a la lista de
  `~/.config/WireCat/config.json`, sección `task_categories`. No es el archivo de ajustes de un perfil,
  así que la lista es la misma en todos los perfiles, y «finanzas» y «pagos» nunca conviven. `memo`
  aún no lee este archivo. Usa una lista guardada en el almacén o su propia lista por defecto, que aún
  tiene las siete categorías anteriores (`money`, `documents`, `meeting`, `delivery`, `access`,
  `personal` y `other`).
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
  al archivo y la quita del almacén; desde entonces, `memo` vuelve a usar su propia lista por
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

En `tg` y `max` también puedes editar el archivo a mano. Un nombre con su significado y sus palabras añade o
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
ajustes de [Cuando un agente cierra una tarea](#cuando-un-agente-cierra-una-tarea) y
`task_first_pass_per_chat` siguen en el almacén.

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
En `tg` y `max`, `tasks_close` necesita `certainty`, igual que el `tasks close` de un agente.
`tasks_scan` crea las tareas de un chat a partir de su historial.

## Aún no está hecho

- **Ajustar los pesos con tus respuestas.** Cada fusión, rechazo, `--into` y `--new` se guarda,
  pero todavía nada los usa para cambiar los pesos.

## Páginas relacionadas

- [Cómo funcionan las tareas](./tasks-architecture.mdx): los datos, las claves, la reserva y la
  detección de duplicados paso a paso.
- [Tareas y recordatorios en Memo](./memo/tasks.md): tareas de proyecto, responsables y recordatorios.
- [Búsqueda](./search.md): encuentra los mensajes de los que trata una tarea.
