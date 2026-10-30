---
title: "gcal"
---

`gcal` lee tu Google Calendar desde la terminal, desde scripts y desde agentes de IA. Solo pide a Google acceso de
lectura, salvo que inicies sesión con `--grant write` para crear, cambiar y borrar eventos.

Inicia sesión en Google (`session start`, `session status`, `session end`), sincroniza tus calendarios con el almacén
local de WireCat (`sync`, `status`, `calendars`) y los lee desde ahí: `events`, `search`, `people` y `links`.
`calendars busy` pregunta a Google cuándo están libres otras personas. Con el permiso de escritura,
`events create | update | delete | respond` cambian Google Calendar. También tiene los comandos que comparten todas las
CLI de WireCat: `doctor`, `commands`, `guide`, `config`, `skill`, `mcp`, `runs` y `upgrade`. Empieza por la
[instalación](./installation.md) y sigue con el [uso](./usage.md).
