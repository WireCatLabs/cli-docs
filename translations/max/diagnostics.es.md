---
title: "Diagnóstico: qué hizo un comando"
---

Cada solicitud genera un evento, con dos destinos posibles. `--trace` lo muestra sin guardarlo; `--record` lo guarda sin mostrarlo. Por defecto no se muestra nada y solo se guardan ejecuciones fallidas (véase «Las ejecuciones fallidas siempre se guardan»).

## Mostrar eventos

```sh
max chats list --trace
```

```text
→ session.init      op 6   seq 1  432 B
← session.init      op 6   seq 1  89ms  335 B  38 reg-country-code
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  202ms  48.0 kB  25 chats  6 contacts
→ contacts.info     op 32  seq 3  154 B  3 contacts
← contacts.info     op 32  seq 3  91ms  6.5 kB  10 contacts
```

`→` es una solicitud, `←` una respuesta y `•` una respuesta sin acceso a la red. La línea incluye operación, código de protocolo, número de solicitud, IDs, duración, tamaño y cantidades devueltas.

Todo va **a stderr**, compatible con `--json`:

```sh
max chats list --json --trace > chats.json    # данные в файл, диагностика на экран
```

En el terminal aparecen líneas como las anteriores; en una tubería, un objeto JSON por línea:

```sh
max chats list --json --trace 2>&1 >/dev/null | jq -c 'select(.event == "response")'
```

`--trace` prevalece sobre `--quiet`: una opción explícita siempre se aplica.

### Comandos del bot

En `max <имя> bot …`, cada solicitud HTTP muestra operación, IDs de la dirección (chat, mensaje, persona, comentario), estado HTTP, duración y tamaño.

```sh
max shop bot messages list -100 --trace
```

```text
→ getMyInfo        
← getMyInfo        200  143ms  211 B
→ getMessages      chat -100
← getMessages      200  chat -100  187ms  6.2 kB
```

Los rechazos muestran código y clave MAX, como `404  not_found  not.found`, nunca el texto de la respuesta. Las cargas (`--file`, `uploads put`) tienen dos líneas propias, `upload.image`, `upload.video`, etc., con tamaño, estado y tiempo. No incluyen URL ni nombre: la URL concede acceso por sí misma.

## Guardar eventos

```sh
max chats list --record
max runs list                 # что делалось, новое сверху
max runs show <id>            # один запуск: чем кончился и куда ходил
max runs path <id>            # каталог, для jq и grep
```

Directorio de ejecución:

```text
~/.local/share/max-cli/runs/2026-09-19/20260919T234428Z-chats-list-9df39e/
  run.json       что это было, когда, какой профиль, сколько длилось, чем кончилось
  events.jsonl   по объекту JSON на запрос, без единого управляющего символа
```

El directorio tiene `0700` y ambos archivos `0600`. `run.json` se escribe **dos veces**: al iniciar con `running`, y al terminar con el resultado. Así no quedan directorios de eventos sin metadatos como casos especiales permanentes en `max runs list`.

El resultado se escribe **en cualquier salida**, incluso si falla antes de conectar:

```json
{ "runId": "…", "command": "chats list", "profile": "default", "status": "failed",
  "requests": 0, "errorCode": "authentication_error", "durationMs": 12 }
```

## Lo que nunca se registra

Este es el objetivo principal de esta página.

| Se registra | Nunca se registra |
|---|---|
| Operación, código de operación, número de solicitud | Nombre del chat |
| ID del chat, envío (`send`) y mensaje | Nombre de una persona |
| Número de bytes enviados y recibidos | Texto del mensaje |
| Milisegundos que tardó la respuesta | Número de teléfono |
| Número de chats, contactos y mensajes devueltos | Token |
| Código y clave corta MAX como `login.token` | Texto del error de MAX |
| Código de aviso como `reactions_unread` | Texto del aviso |
| En caso de fallo: tipo de error y líneas de código donde ocurrió | Texto del error en caso de fallo |
| Versión, entorno (`node` o `bun`), sistema | Ruta personal del usuario |

**Ni truncado ni como hash.** El evento se construye con campos nombrados explícitamente, en lugar de filtrar una copia de la solicitud: un campo no previsto no puede llegar al registro. `session.login` tiene un campo `token`, y ninguna rama del código accede a él.

Los identificadores, en cambio, se incluyen deliberadamente: el ID del chat es un número opaco, inútil sin la sesión a la que pertenece. Es lo que hace útil el diagnóstico, porque un problema real suele referirse a una conversación concreta.

El texto de error MAX puede citar lo enviado, incluido el mensaje. Solo se registra una clave con letras latinas minúsculas, números, puntos y guiones, como `proto.payload`; otros valores se omiten.

## Usar los registros

```sh
# сколько времени ушло на вход в последних запусках
for id in $(max runs list --json | jq -r '.items[].runId'); do
  jq -r 'select(.operation=="session.login" and .event=="response") | "\(.durationMs)ms"' \
    "$(max runs path "$id" --json | jq -r .path)/events.jsonl"
done

# какие запуски закончились плохо
max runs list --json | jq '.items[] | select(.status=="failed") | {runId, command, errorCode}'
```

`max runs show` oculta los campos de servicio repetidos por Pino para que la tabla quepa en pantalla. `max runs path` permite acceder al archivo completo.

## Conservación

**30 días.** La limpieza ocurre únicamente cuando se escribe un registro. Cambia el plazo con `keepRunsForDays` en [Configuración](./configuration.md).

Se eliminan días enteros según el nombre del directorio, sin abrir archivos.

## Las ejecuciones fallidas siempre se guardan

Un comando que termina con error se guarda incluso sin `--record`, con `"keptBecauseFailed": true` en `run.json`. Se aplica a todo comando y error: opciones incorrectas, comandos desconocidos, comprobaciones previas y comandos que no contactan con MAX (`models`, `server`, `watch`, `upgrade`). El registro solo contiene las palabras del comando, como `messages list`, sin los argumentos posteriores. Una ejecución correcta sin `--record` no deja registro de diagnóstico; las consultas de búsqueda se guardan aparte. Así hay algo que adjuntar a un informe de problema. El historial de búsqueda contiene parámetros, no los mensajes encontrados. `--no-record` o `"record": false` en los ajustes también desactiva esto.

## Registrar cada ejecución

```json
{ "profiles": { "default": { "record": true } } }
```

Entonces se registra cada ejecución, y `--no-record` lo desactiva para una invocación. Por defecto es al revés: las ejecuciones correctas no se registran salvo que lo pidas; las fallidas siempre se guardan sin textos para adjuntarlas a un informe. Los parámetros de búsquedas correctas se guardan aparte de los diagnósticos; `--no-record` o `"record": false` desactiva ambos registros.

## Siguiente paso

- [Seguridad](./security.md): todo lo que se escribe en disco.
- [Solución de problemas](./troubleshooting.md): usar el diagnóstico ante un fallo.

## Referencia para scripts

`max commands --json` enumera comandos, opciones globales y códigos de salida sin conectar a una cuenta. Usa `max commands search messages --json` para un comando y `max commands messages --json` para un grupo; ambos conservan las opciones globales y códigos de salida. Las palabras tras `commands` indican una ruta; consulta grupos distintos en llamadas separadas. `cli` es el nombre de la herramienta, `version` la versión instalada y `contract` la versión del contrato JSON compartido (`0`). Cambia cuando los campos de respuesta dejan de ser compatibles; actualizar el paquete no cambia por sí solo `contract`. Un script puede leer campos concretos sin comparar todo el JSON con una cadena guardada.

La búsqueda y los recuentos guardan consultas aparte de las ejecuciones; consulta el historial y --no-record en [búsqueda](./search.md).
