---
title: "Tareas y recordatorios"
---

Esta página te ayuda a llevar el control de lo que tienes que hacer: una petición en un mensaje, una
promesa en una nota o trabajo en uno de tus proyectos. Una tarea creada a partir de un mensaje o una
nota apunta a esa fuente, así que siempre puedes ver por qué existe la tarea. Los recordatorios se
quedan en tu ordenador: Memo nunca los envía a un servicio de mensajería ni a un buzón de correo.

## Una tarea a partir de un mensaje o una nota

**La forma más fácil: pídeselo a tu agente.**

```text prompt
Use memo CLI to find the messages from this week where someone asked me for something.
Show them to me first. Make a task only for the ones I choose.
```

**O hazlo tú.** Copia la referencia del mensaje de un resultado de búsqueda:

```sh
memo tasks add 'msg:telegram/1/77/42' --type request
memo tasks add note:12 --account telegram:1 --type promise
memo tasks list --source telegram:1
```

Una tarea creada a partir de una fuente tiene un tipo: `request` (el predeterminado), `question`,
`mention` o `promise`. Pertenece a una cuenta. Una referencia de mensaje
ya indica su cuenta, y un archivo de una carpeta de notas (`document:<id>`) pertenece a esa carpeta. Para una nota
que escribiste con `memo notes add`, añade `--account`, como `--account telegram:1` o una carpeta de notas,
`--account notes:1`. Si añades la misma tarea dos veces, obtienes la que ya existe.

Una carpeta de notas también es una cuenta: la búsqueda da su número como `folder_id`, y Memo lo acepta como
`notes:<number>` o como el `obsidian:<id>` o `local:<id>` que muestran sus mensajes; `folder:<id>` también la nombra.
`--source notes` indica tu carpeta cuando
tienes una. `memo tasks list` y `memo reminders list` sin `--source` leen todas las cuentas y las nombran en
`meta.accounts`.

## Qué revisar hoy

La agenda, el plan y la ficha son los mismos comandos de tg y max. Cada uno lee una cuenta; indícala:

```sh
memo tasks agenda --source telegram:1           # overdue, due, owed and waiting chats
memo tasks update 1a2b3c4d --due 2d --remind-time 1d --title 'Send the revised budget' --account telegram:1
memo tasks show 1a2b3c4d --source telegram:1
memo stats tasks show --source telegram:1       # open tasks per chat
memo tasks agenda --source notes                # tasks from your notes folder
```

Usa `tasks update` para cambiar los campos de una tarea.

Sin `--source` ni `--account`, el comando enumera las cuentas guardadas. tg y max abren estas tareas al sincronizar; memo lee el mismo almacén.

## Tareas en un proyecto

Una tarea en un proyecto no necesita fuente. Recibe una clave formada por la clave del proyecto y un
número, como `HRB-1`:

```sh
memo tasks add --project HRB --title 'Book the venue' --priority high
memo tasks add --project HRB --title 'Export drops the last row' --type bug
memo tasks list project:HRB
memo tasks update HRB-1 --priority critical --description 'Call before Friday'
```

Un `memo tasks list` sin más muestra solo las tareas de tus cuentas; las tareas de un proyecto se listan con
`project:` y la clave del proyecto, su nombre o un alias, y las de todos los proyectos con `project:*`.

| Opción | Significado |
|---|---|
| `--type` | `chore` (el predeterminado), `bug` o `feature` |
| `--priority` | `low`, `medium`, `high` o `critical`; `none` la quita. 0 (urgente) a 4 (baja) siguen funcionando como antes |
| `--parent` | una tarea más grande de la que esta forma parte, en el mismo proyecto |
| `--description` | más detalles, en Markdown |
| `--assignee` | quién la hace, por el ID de la persona |

Para crear antes el proyecto, consulta [organizaciones y proyectos](./people.md#organizations-and-projects).

## Prioridad y orden

Una prioridad es un número de 0 a 1, de mayor a menor, y la ves como una de cuatro etiquetas por cuartos: `low`
(menos de 0,25), `medium`, `high` y `critical` (0,75 o más). `--json` da ambos, `priority` y
`priority_label`. El número también ordena las tareas de un proyecto, así que una columna del tablero conserva el orden que le des:

```sh
memo tasks move HRB-3 --before HRB-1                      # HRB-3 goes just above HRB-1
memo tasks move HRB-3 --after HRB-2                       # into HRB-2's column, below it
memo tasks move HRB-3 --status in_progress                # into an empty column
```

Junto a una tarea de otra columna, la tarea pasa a esa columna. `--status` con `--before` o `--after` debe nombrar la
columna del vecino; otra se rechaza con el motivo `task.column` (`HRB-2 is in in_progress, not todo: pick a task
in the todo column`). `--status` solo mueve la tarea a una columna vacía.

`tasks move` da a la tarea una prioridad entre sus nuevos vecinos. Cuando eso cruza un cuarto, su etiqueta cambia
y la respuesta lo indica (`label.changed`). Cuando dos vecinos no dejan espacio, Memo reparte ese cuarto de la
columna de forma uniforme y nombra las tareas que renumeró.

## Estados

Una tarea de proyecto es `open` (nueva), `todo` (decidida), `in_progress`, `done` o `dismissed`. Cámbiala con
`tasks update --status`, también de vuelta desde `done` o `dismissed`; cada cambio queda en su historial. `todo` y
`in_progress` cuentan como trabajo abierto en todas partes: una tarea que espera a una de ellas no está lista, y un agente puede reclamar una.
Una tarea de un mensaje es solo `open`, `done` o `dismissed`.

```sh
memo tasks update HRB-1 --status in_progress
memo tasks history HRB-1 --json      # who changed what, and when
```

## Buscar tareas de proyecto

`memo tasks list` con `project:` acepta una consulta: campos unidos con AND, OR dentro de un campo, NOT y palabras
sueltas, que buscan en el título y la descripción:

```sh
memo tasks list project:* 'assignee:"person:3"' priority:[high TO critical] invoice
memo tasks list project:(HRB OR OPS) state:(done OR dismissed) closed:>=14d
memo tasks list project:* overdue:true --sort due
memo tasks list project:* NOT due:* NOT priority:*
memo tasks counts project:* --json   # how many per project, assignee, priority and state
```

| Campo | Significado |
|---|---|
| `state:` | `open`, `todo`, `in_progress`, `done`, `dismissed`; sin él, los tres estados abiertos |
| `project:` | una clave, un nombre, `project:<id>` o `*` para todos los proyectos |
| `assignee:` | `any`, `none` o una persona: `"person:3"` entre comillas, o `3` |
| `priority:` | una etiqueta, `none` o un rango de etiquetas o números |
| `agent:` | el agente que trabaja en ella, `none` o `any` |
| `due:`, `closed:` | una fecha o un rango: `due:[today TO 2026-12-31]`, `closed:>=14d` |
| `overdue:`, `ready:` | `true` o `false` |

`--sort` acepta `priority` (el predeterminado), `due`, `created`, `updated`, `key` o `state`; `--desc` invierte el orden.
Una lista contiene como máximo 500 tareas; `page.next_cursor` y `--cursor` leen las siguientes, y `page.total` dice
cuántas coinciden. Cada tarea lleva sus `assignments`, `ready` y `blocked_by`, y su `revision`.

## Cambiada en otro sitio

Un agente puede editar una tarea mientras la miras. Pasa la `revision` que leíste y Memo rechaza la escritura si la
tarea cambió desde entonces, con el motivo `task.stale` y el código de salida 3:

```sh
memo tasks update HRB-1 --title 'Book the hall' --revision 4
```

`tasks update`, `close`, `assign` y `move` aceptan `--revision`.

La revisión sube cuando una persona podría sobrescribir algo: el título, la descripción, el estado, la prioridad, los
asignados, el agente, la fecha límite, el proyecto, el padre o las etiquetas. Un agente que toma, renueva o devuelve su
reclamación, o que fija cuándo vuelve a mirar (`--remind-time`), la deja como está, así que trabajar en una tarea no
vuelve obsoleta tu copia.

## Quién trabaja en ella

```sh
memo tasks assign HRB-1 PERSON_UID
memo tasks assign HRB-1 PERSON_UID --role reviewer
memo tasks assign HRB-1 PERSON_UID --clear     # take them off it
memo people list                               # you, and everyone tasks already name
memo tasks update HRB-1 --agent hermes         # the agent working on it; --agent none clears it
```

Un agente no es un asignado: `agent` nombra al agente que trabaja en ella hasta que alguien lo cambie, mientras que un claim
(`tasks claim`) es una cesión que caduca sola. El rol es `assignee` (el predeterminado), `reviewer` o `watcher`. El ID de una persona sale de su
contexto (`memo context … --json`). Las tareas asignadas a alguien aparecen en
[su contexto](./people.md#everything-about-a-person).

## Cerrar una tarea

```sh
memo tasks close HRB-1 --reason booked
memo tasks close 7 --account telegram:1 --as dismissed
```

Cierra una tarea con `--as done` (predeterminado) o `--as dismissed`. `memo tasks list state:done` muestra las cerradas; con `project:`, `kind:bug` filtra la clase. `source:"note:12"` conserva tareas de una cuenta procedentes de un mensaje, nota o documento: es el paso que propone `memo search all` para un resultado con tareas vinculadas. Cada cambio de estado, prioridad o responsable queda registrado.

## Qué hacer primero

Una tarea puede esperar a otra. Vincúlalas y luego pregunta a Memo qué tareas pueden empezar:

```sh
memo tasks link HRB-2 HRB-1 --kind blocked-by     # HRB-2 waits for HRB-1
memo tasks list project:HRB ready:true          # tasks with nothing left to wait for
memo tasks status HRB-2                           # why HRB-2 can or cannot start
memo tasks links HRB-2
memo tasks unlink HRB-2 HRB-1 --kind blocked-by
```

`tasks link` también acepta otra tarea como `task:HRB-1`. Un destino distinto —mensaje, chat, persona o URL— vincula la tarea de una cuenta con su tema y requiere `--account`:

```sh
memo tasks link 12 msg:telegram/500/7/101 --account telegram:500
```

Una tarea solo está lista cuando todas las tareas a las que espera están hechas. Si una de las tareas
a las que espera se descartó, Memo te pide que revises el vínculo. Los vínculos `follow-up-of` y `related-to` son
informativos y no bloquean nada.

## Recordatorios

Un recordatorio es un momento en el que una tarea debe llamar tu atención. Memo lo guarda en tu
ordenador; otro programa que tú eliges, como tu agente o un script, pide a Memo los recordatorios
pendientes y te los muestra.

```sh
memo reminders add 7 --at-time 2026-10-20T09:00:00+02:00 --timezone Europe/Madrid --account telegram:1
memo reminders list --source telegram:1
memo reminders update 3 --revision 1 --at-time 2026-10-21T09:00:00+02:00 --account telegram:1
memo reminders cancel 3 --account telegram:1
```

Escribe la hora con su diferencia respecto a UTC, como `+02:00` para Madrid en verano. Un recordatorio
pertenece a una cuenta, así que para añadir o cambiar uno necesitas `--account`; para una tarea de una carpeta de
notas, esa carpeta, como `--account notes:1`. Al cerrar una tarea se cancelan sus recordatorios.

Una tarea de un proyecto, como `HRB-1`, no pertenece a ninguna cuenta, así que todavía no puede tener un
recordatorio. Tampoco una tarea de una nota que escribiste con `memo notes add` cuando el almacén no tiene ninguna cuenta.

Para el programa que muestra los recordatorios:

```sh
memo reminders claim --account telegram:1 --json
memo reminders acknowledge REMINDER_ID RECEIPT --account telegram:1
```

`claim` entrega los recordatorios pendientes, cada uno con un recibo. `acknowledge` con ese recibo confirma que
el recordatorio se mostró. Un recordatorio que no se confirma a tiempo se entrega de nuevo con un
recibo nuevo, así que un fallo no lo pierde. Usa el `deliveryId` de la respuesta para no mostrar el
mismo recordatorio dos veces. El temporizador de importación no entrega recordatorios.

Siguiente: [etiquetar tareas](./tags.md) o [ver lo que propuso tu agente](./memories.md#proposed-actions).
