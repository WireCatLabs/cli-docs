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
memo tasks add note:12 --provider telegram --account 1 --type promise
memo tasks list --provider telegram --account 1
```

Una tarea creada a partir de una fuente tiene un tipo: `request` (el predeterminado), `question`,
`mention` o `promise`. Pertenece a una cuenta de un servicio de mensajería. Una referencia de mensaje
ya indica su cuenta; para una nota o un archivo, añade `--provider` y `--account`. Si añades la misma
tarea dos veces, obtienes la que ya existe.

## Tareas en un proyecto

Una tarea en un proyecto no necesita fuente. Recibe una clave formada por la clave del proyecto y un
número, como `HRB-1`:

```sh
memo tasks add --project HRB --title 'Book the venue' --priority 1
memo tasks add --project HRB --title 'Export drops the last row' --type bug
memo tasks list --project HRB
memo tasks update HRB-1 --priority 0 --description 'Call before Friday'
```

| Opción | Significado |
|---|---|
| `--type` | `chore` (el predeterminado), `bug` o `feature` |
| `--priority` | un número de 0 (urgente) a 4 (baja) |
| `--parent` | una tarea más grande de la que esta forma parte, en el mismo proyecto |
| `--description` | más detalles, en Markdown |
| `--assignee` | quién la hace, por el ID de la persona |

Para crear antes el proyecto, consulta [organizaciones y proyectos](./people.md#organizations-and-projects).

## Quién trabaja en ella

```sh
memo tasks assign HRB-1 PERSON_UID
memo tasks assign HRB-1 PERSON_UID --role reviewer
```

El rol es `assignee` (el predeterminado), `reviewer` o `watcher`. El ID de una persona sale de su
contexto (`memo context … --json`). Las tareas asignadas a alguien aparecen en
[su contexto](./people.md#everything-about-a-person).

## Cerrar una tarea

```sh
memo tasks close HRB-1 --reason booked
memo tasks close 7 --provider telegram --account 1 --as dismissed
```

Cierra una tarea con `--as done` (el predeterminado) o `--as dismissed`. `memo tasks list --state done`
muestra las tareas cerradas. Cada cambio de estado, prioridad o responsable queda registrado con la tarea.

## Qué hacer primero

Una tarea puede esperar a otra. Vincúlalas y luego pregunta a Memo qué tareas pueden empezar:

```sh
memo tasks link HRB-2 HRB-1 --kind blocked-by     # HRB-2 waits for HRB-1
memo tasks ready --project HRB                    # tasks with nothing left to wait for
memo tasks readiness HRB-2                        # why HRB-2 can or cannot start
memo tasks relations HRB-2
memo tasks unlink HRB-2 HRB-1 --kind blocked-by
```

Una tarea solo está lista cuando todas las tareas a las que espera están hechas. Si una de las tareas
a las que espera se descartó, Memo te pide que revises el vínculo. Los vínculos `follow-up-of` y `related-to` son
informativos y no bloquean nada.

## Recordatorios

Un recordatorio es un momento en el que una tarea debe llamar tu atención. Memo lo guarda en tu
ordenador; otro programa que tú eliges, como tu agente o un script, pide a Memo los recordatorios
pendientes y te los muestra.

```sh
memo reminders schedule 7 --at 2026-10-20T09:00:00+02:00 --timezone Europe/Madrid --provider telegram --account 1
memo reminders list --provider telegram --account 1
memo reminders snooze 3 --revision 1 --at 2026-10-21T09:00:00+02:00 --provider telegram --account 1
memo reminders cancel 3 --provider telegram --account 1
```

Escribe la hora con su diferencia respecto a UTC, como `+02:00` para Madrid en verano. Un recordatorio
pertenece a una cuenta, así que necesita `--provider` y `--account`. Al cerrar una tarea se cancelan
sus recordatorios.

Para el programa que muestra los recordatorios:

```sh
memo reminders poll --provider telegram --account 1 --json
memo reminders ack REMINDER_ID RECEIPT --provider telegram --account 1
```

`poll` entrega los recordatorios pendientes, cada uno con un recibo. `ack` con ese recibo confirma que
el recordatorio se mostró. Un recordatorio que no se confirma a tiempo se entrega de nuevo con un
recibo nuevo, así que un fallo no lo pierde. Usa el `deliveryId` de la respuesta para no mostrar el
mismo recordatorio dos veces. El temporizador de importación no entrega recordatorios.

Siguiente: [etiquetar tareas](./tags.md) o [ver lo que propuso tu agente](./memories.md#proposed-actions).
