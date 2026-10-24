---
title: "Límites"
---

Usa esta página cuando un comando espera, se detiene con un error de límite de velocidad o se rechaza porque otro comando `wa` retiene la cuenta. Explica qué tan rápido `wa` habla con WhatsApp, por qué a veces espera y qué hacer cuando se detiene. Al final sabrás qué esperas son normales, cómo cambiar el ritmo y cuándo volver a intentarlo.

Palabras que utiliza esta página:

- **Ritmo**: cuántas solicitudes puede enviar un perfil a WhatsApp por minuto. `wa` mantiene cada perfil dentro de ese límite.
- **Límite de envío**: cuántos mensajes puede enviar un perfil en cualquier hora.
- **La única conexión del dispositivo**: WhatsApp permite una conexión para cada dispositivo vinculado; `wa` permite que un comando mantenga esa conexión a la vez.

WhatsApp prohíbe cuentas que realicen envíos masivos o escriban a desconocidos. Estos límites están ahí para mantener un script o un agente alejado de eso.

## Una conexión por dispositivo

Sólo un comando `wa` a la vez puede conectar un perfil. `serve`, `watch`, el servidor MCP mientras mantiene una conexión, y cada escritura única toma primero el bloqueo del dispositivo. Se rechaza inmediatamente otro comando para el mismo perfil y el error nombra al titular:

```text
this WhatsApp login is in use by serve (pid 4242)
```

Esto no es una espera: `wa` no pone en cola el segundo comando. Detén el proceso que mantiene la conexión o espere a que finalice y ejecute el comando nuevamente. `serve` es la excepción: mientras se ejecuta, un envío, una edición o una reacción para el mismo perfil se ejecuta dentro de `serve`, en su conexión, y no es rechazado. En Windows se rechaza. Las lecturas consultan el almacén local sin conectarse y funcionan a la vez ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

## El ritmo

Cada solicitud que `wa` realiza para un perfil (desde un comando, `wa personal mcp` o `wa personal serve`) toma un turno en un ritmo para ese perfil. La cola se guarda en la carpeta de estado, por lo que dos terminales se alinean una detrás de la otra en lugar de ir cada una a toda velocidad. Los distintos perfiles tienen su propio ritmo cada uno.

Un comando que tiene que esperar más de 5 segundos para su turno lo dice en stderr. Un turno que tardaría más de 5 minutos se rechaza de inmediato con el código de salida `8` (`rate_limited`).

Cambia el ritmo en el archivo de configuración o en un shell con una variable de entorno:

```json
{ "defaults": { "requests_per_minute": 30 } }
```

```sh
WA_REQUESTS_PER_MINUTE=30 wa personal messages send 100000000000001@lid "on my way"
```

`0` apaga el ritmo. Hazlo sólo para un perfil que puedas permitirte tener limitado.

## Escrituras

- **30 envíos por hora** por perfil de forma predeterminada (`sends_per_hour`), contados en todos los procesos. Se rechaza uno más con el código de salida `8`; `wa personal sends list` muestra lo que se envió.
- **Una lista de destinatarios**, cuando está activada, rechaza un envío a cualquier otro chat con el código de salida `7` ([permisos](./permissions.md#restrict-recipients-and-repeated-sends)).
- **Una cuenta prohibida o restringida** retiene todas las escrituras con el código de salida `5`, reacciones y recibos de lectura también: hasta que finaliza la prohibición, cuando WhatsApp dice cuándo (el error indica la hora); de lo contrario, hasta que se levante, por
  `wa personal doctor --online` conectando nuevamente o mediante `wa personal flood clear`; ver el teléfono. Las lecturas del almacén local todavía funcionan.
- **Cuando WhatsApp solicita que la cuenta disminuya la velocidad**, cada escritura se retiene durante 15 minutos (código de salida `8`, luego `5` mientras dure la retención). Las lecturas continúan sin enviar recibos de lectura. `wa personal flood clear` levanta la retención una vez que sabes que ha terminado.
- **Una encuesta** tiene de 2 a 12 respuestas, cada una con su propio texto; cuenta como un envío.
- **Un pin** cuenta como un envío: WhatsApp informa a los miembros del chat sobre cada uno. Desanclar no cuenta, pero una suspensión también lo impide.
- Un envío que puede haber llegado o no (código de salida `14`) nunca se repite mediante `wa`. Comprueba `wa personal sends list` y el chat antes de volver a enviar ([cómo se comporta wa en los scripts](./cli-contract.md#previews-and-safe-retries)).

## Sin lecturas masivas

WhatsApp no guarda ningún historial en sus servidores, por lo que `wa` no realiza una descarga masiva de historial que deba regular. El teléfono envía tu historial reciente una vez, justo después de vincularlo, y `serve` sigue recibiendo después de eso ([el almacén local](./archive.md)). Cada lectura y búsqueda responde del almacén local y no envía nada a WhatsApp. Los mensajes más antiguos solo pueden solicitarse al teléfono, 50 a la vez, con al menos 2 segundos entre solicitudes, mediante `messages sync <chat>` ([cómo](./archive.md#older-history-from-your-phone)).
