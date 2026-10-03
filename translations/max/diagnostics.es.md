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

Esta es la garantía principal del diagnóstico.

| Registrado | Nunca registrado |
|---|---|
| Operación, código, número de solicitud | Título del chat |
| ID del chat, envío (`send`) y mensaje | Nombre de una persona |
| Bytes enviados y recibidos | Texto del mensaje |
| Milisegundos de respuesta | Teléfono |
| Cantidades de chats, contactos y mensajes | Token |
| Código y clave corta MAX como `login.token` | Texto del error de MAX |
| Código de aviso como `reactions_unread` | Texto del aviso |
| En un fallo: tipo y ubicación del código | Texto del error del fallo |
| Versión, entorno (`node` o `bun`), sistema | Ruta personal del usuario |

**Ni recortado ni como hash.** Los eventos se construyen con campos explícitos, no filtrando una copia de la solicitud; un campo inesperado no puede entrar en el registro. Ninguna rama de registro accede al `token` de `session.login`.

Los IDs sí se incluyen deliberadamente: un ID de chat es un número opaco sin utilidad fuera de su sesión, pero necesario para investigar una conversación concreta.

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

Un fallo se guarda incluso sin `--record`, con `"keptBecauseFailed": true` en `run.json`. Incluye opciones inválidas, comandos desconocidos, comprobaciones previas y comandos sin red (`models`, `server`, `watch`, `upgrade`). Solo se guardan palabras del comando, como `messages list`, sin argumentos. Una ejecución correcta sin `--record` no deja registro. Así los informes tienen pruebas sin acumular tu historial de lectura. `--no-record` o `"record": false` también desactiva esta conservación.

## Registrar cada ejecución

```json
{ "profiles": { "default": { "record": true } } }
```

Este ajuste registra todo; `--no-record` lo desactiva para una llamada. Por defecto, los éxitos no se guardan sin pedirlo y los fallos se guardan sin contenido para informar del problema. No se acumula automáticamente un historial de a quién leíste y cuándo.

## Siguiente paso

- [Seguridad](./security.md): todo lo que se escribe en disco.
- [Solución de problemas](./troubleshooting.md): usar el diagnóstico ante un fallo.
