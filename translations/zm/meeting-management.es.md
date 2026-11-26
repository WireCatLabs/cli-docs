---
title: "Gestionar reuniones de Zoom"
---

Crea, cambia o cancela una reunión de Zoom y lee su invitación con los mismos comandos `meetings` que leen las
reuniones guardadas. Estos comandos llegan a la cuenta de Zoom con la que iniciaste sesión; el archivo de reuniones
guardadas no cambia.

## Leer la invitación de una reunión

```sh
zm personal meetings invitation 123456789 --json
```

El id es el número de reunión de Zoom. La invitación necesita el permiso `meeting:read:invitation` de
[la guía de la app](./zoom-app.md#add-archive-or-management-access). Para encontrar una serie próxima, usa
[`meetings scheduled`](./usage.md#find-a-scheduled-meeting-series) y luego
[`meetings prepare <series-id>`](./usage.md#prepare-for-an-upcoming-meeting) para su contexto guardado.

## Crear, actualizar o cancelar

Crear, actualizar y cancelar preguntan primero: en una terminal zm pregunta y/N (por defecto no); sin terminal, el
comando se detiene con `confirmation_required` (código 7) salvo que `--yes` lo aplique una vez. `--dry-run`
muestra el comando y su permiso sin llegar a Zoom, también cuando está `--yes`. Un perfil cuyos
[permisos](./configuration.md#permissions) permiten `meetings.create`, `meetings.update` o `meetings.cancel` lo aplica
sin preguntar; `readonly` o `deny` lo rechazan incluso con `--yes`.

```sh
zm personal meetings create --title "Example planning" --start-time 2026-10-20T10:00:00Z --duration-minutes 30 --json
zm personal meetings update 123456789 --title "Example review" --yes --json
zm personal meetings cancel 123456789 --occurrence-id 1760954400000 --dry-run --json
```

Crear necesita `--start-time`: Zoom programa una reunión, y zm no inicia una instantánea. Un cambio que zm no puede
enviar se rechaza antes de la pregunta. Las escrituras nunca se reintentan. Si se envió una escritura y su resultado es
incierto, el comando sale con el código 14: comprueba Zoom antes de repetirla.

Una cancelación se aplica a la reunión en Zoom, no solo a su registro guardado. Después de aplicar un cambio, comprueba
la reunión en Zoom. Usa [la búsqueda y las fuentes guardadas](./search.md) para el material de preparación.

## Reuniones que ya se celebraron

`meetings list` también pide a Zoom las reuniones que ya se celebraron y aún no están guardadas. Lee la ventana de
`started_at` de mes en mes, de la más reciente a la más antigua, como mucho 20 reuniones por solicitud; sin
`started_at` empieza hoy. Cuando se detiene antes del final de la ventana, la respuesta dice que no está completa y
pide un `started_at` más estrecho. `--backend archive` solo lee las reuniones guardadas.

`meetings show <id>` vuelve a leer desde Zoom una reunión que ya se celebró, con sus personas y su transcripción. El id
es el uuid de la instancia que guarda `meetings sync`, o un número de reunión, que responde con su instancia más
reciente. Necesita el permiso opcional `meeting:read:past_meeting`.
