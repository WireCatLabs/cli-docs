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
`search --backend server`. `calendars busy` muestra cuándo están ocupadas las personas y los huecos libres para todas.
Tras `session start --grant write` crea, cambia y borra eventos, también los periódicos, pasa un evento de tener hora a
durar todo el día y al revés, y responde invitaciones; cada escritura pregunta antes. `gcal api` llega a cualquier
método de la API de Google Calendar por su nombre. Todos los comandos están en la
[referencia de comandos](./commands.md).

## Siguiente

- **Mover un evento a otro calendario.** Hoy: créalo en el otro calendario y borra el antiguo.
- **Cambiar «este y los siguientes» casos de un evento periódico.** Hoy un cambio afecta a un solo caso o a toda la
  serie (`--series`).
- **Iniciar sesión sin un cliente de Google propio.** `gcal` usará la aplicación de Google compartida de WireCat en
  cuanto Google la haya revisado para Calendar. Hasta entonces, [crea tu propio cliente](./configuration.md#your-own-google-client).

Lo que cambió en cada versión publicada está en el [historial de cambios](./changelog.md).
