---
title: "Gestionar reuniones de Zoom"
---

Lee próximas reuniones e invitaciones y crea, modifica o cancela una reunión simple,
revisando primero cada cambio.

## Leer próximas reuniones

```sh
zm remote-meetings list --json
zm remote-meetings show 123456789 --json
zm remote-meetings invitation 123456789 --json
```

Los identificadores remotos son IDs numéricos de Zoom; `meetings` usa IDs de la base local.
La lista requiere `meeting:read:list_meetings` del manifiesto; detalles e invitaciones necesitan
permisos opcionales de [la guía](./zoom-app.md#add-archive-or-management-access).

## Crear, modificar o cancelar

Primero se muestra la petición. `--yes` la aplica una vez; `--dry-run` mantiene siempre la vista
previa, incluso junto a `--yes`.

```sh
zm remote-meetings create --topic "Example planning" --start-time 2026-10-20T10:00:00Z --duration-minutes 30 --json
zm remote-meetings update 123456789 --topic "Example review" --yes --json
zm remote-meetings cancel 123456789 --dry-run --json
```

Se admite crear reuniones instantáneas o programadas y cambios básicos. Las escrituras remotas no
se reintentan automáticamente. Si se envió la petición pero el resultado es incierto, comprueba
Zoom antes de repetirla; la herramienta devuelve el código de salida 14.
