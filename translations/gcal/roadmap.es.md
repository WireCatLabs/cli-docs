---
title: "Próximas mejoras"
---

Esta página reúne lo que está previsto para `gcal` y todavía no tiene. Léela antes de montar una solución alternativa
para algo que falta: puede que ya esté en camino. El orden es aproximado y puede cambiar. Para proponer algo, abre una
[issue en GitHub](https://github.com/WireCatLabs/gcal-cli/issues).

## Qué funciona hoy

`gcal` inicia sesión en tu cuenta de Google y sincroniza los calendarios que son tuyos con el almacén local de WireCat,
desde un año atrás hasta tres meses por delante; después, solo lo que ha cambiado. Una sincronización grande continúa a
lo largo de varias ejecuciones. Puedes listar, ver y buscar eventos por palabras y por significado, ver a las personas
que participan y sus archivos de Drive, todo sin red, y buscar en el propio Google Calendar con
`search events --backend server`. `calendars busy` muestra cuándo están ocupadas las personas y los huecos libres para
todas, y `events list changed_at>=<date>` qué cambió desde una fecha. Tras
`session start --grant write` crea, cambia, mueve y borra eventos, también los periódicos: un caso, toda la serie o
«este y todos los siguientes»; mueve un evento a otro calendario, pasa un evento de tener hora a durar todo el día y al
revés, y responde invitaciones; un borrado pregunta antes. `events remind`, ejecutado por cron o un temporizador,
avisa una vez de cada reunión que empieza pronto, o ejecuta tu propio programa para ella, y `schedule` instala ese temporizador por ti.
`events list --source all` muestra los eventos de todas las cuentas con sesión iniciada en una sola lista, y
`overlapping:true` encuentra las reuniones que se solapan. `events prepare` reúne lo que necesitas para la siguiente
reunión, `events create --text` añade una a partir de una línea de texto, y `events export` y `events import` leen y
escriben archivos `.ics`. `calendars add <url>` sigue un calendario publicado como dirección `.ics`, solo para leer.
`search all` busca a la vez en reuniones, chats y notas guardados. `gcal api` llega a cualquier
método de la API de Google Calendar por su nombre. Todos los comandos están en la
[referencia de comandos](./commands.md).

Lo que cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
