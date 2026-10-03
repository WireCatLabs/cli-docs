---
title: "Diagnóstico: qué hizo un comando"
---

Si un comando falla o tarda demasiado, `tg` puede mostrar lo que hizo, guardar un registro y convertirlo en un informe para adjuntar a una incidencia. Ninguno de esos registros contiene texto de mensajes.

## Ver las operaciones: `--trace`

```sh
tg --trace messages list "Book club" --limit 5
```

`--trace` imprime cada operación por stderr mientras ocurre: `→` indica lo solicitado y `←` la respuesta, con identificadores, cantidades, duración y código de error si lo hay.

```text
→ messages.list    chat -1001234567890
← messages.list    chat -1001234567890  118ms  5 messages
```

También transmite los registros de la biblioteca de Telegram subyacente. stdout no cambia, por lo que una tubería sigue recibiendo solo datos.

## Guardar una ejecución: `--record`

```sh
tg --record chats list
tg runs list                 # recorded runs, newest first
tg runs show <run-id>        # one run: its outcome, and one line per operation
tg runs path <run-id>        # the directory that holds it
```

Cada ejecución es un directorio en `runs/<day>/` dentro del directorio de estado (`~/.local/share/tg-cli/runs/` en Linux), cuyo nombre incluye la hora y el comando. Contiene dos archivos:

- `run.json`: comando, perfil, versiones de `tg`, Node y sistema, hora de inicio y fin, número de peticiones, resultado y código de error.
- `events.jsonl`: las mismas operaciones que muestra `--trace`, una por línea.

## Las ejecuciones fallidas siempre se guardan

Si un comando termina con error, se guarda aunque no uses `--record`, con `"keptBecauseFailed": true` en `run.json`. Se aplica a todos los comandos y errores: opciones incorrectas, comandos desconocidos, comprobaciones previas y comandos que no se conectan (`models`, `server`, `upgrade`). Un fallo anterior al inicio del comando, como una configuración que no se puede cargar, se guarda con el nombre `tg`. Solo se conservan las palabras del comando, como `messages list`, nunca sus argumentos.

Las ejecuciones correctas no dejan registro salvo que lo solicites. Así siempre hay un fallo que adjuntar a un informe, sin crear un historial de lo que lees. `--no-record` o `"record": false` en la configuración también desactivan el registro de fallos.

## Cuándo registrar todas las ejecuciones

```sh
tg config set record true          # this profile
tg --no-record chats list          # but not this one
```

Con ese ajuste se guardan todas. El comportamiento predeterminado es intencional: una ejecución correcta no se registra sin pedirlo. Registrar a quién lees y cuándo crearía un diario personal que nadie ha solicitado.

## Cuánto se conservan

**30 días**, o el valor de `keepRunsForDays` en la configuración. Los registros antiguos solo se eliminan al guardar uno nuevo; si la herramienta no escribe nada, no recorre ese directorio. Se eliminan días completos según el nombre de la carpeta, sin abrir los archivos.

## Qué nunca contiene un registro

Un registro de ejecución y `--trace` incluyen nombres de operaciones, identificadores, cantidades, duraciones y códigos de error. Nunca incluyen:

- texto ni leyendas de mensajes;
- títulos de chats, nombres de personas ni nombres de usuario;
- **lo que introduces como `<chat>`**, ya que suele ser un título;
- números de teléfono, códigos de inicio de sesión, contraseñas 2FA, sesiones ni hash de la aplicación.

Lo mismo se aplica a los informes creados a partir de registros.

## Comprobar la instalación: `tg doctor`

```sh
tg doctor              # connects to nothing
tg doctor --online     # also connects once and reads the account; sends nothing
```

Muestra versión, entorno de ejecución, perfil, configuración, existencia de sesión y credenciales (nunca sus valores), si `TG_*_DIR` ha cambiado la entrada del almacén de claves, el archivo local (ruta, versión, número de chats y mensajes), los envíos de la última hora y las ejecuciones guardadas.

## Crear un informe de problema

```sh
tg doctor report create                   # about the newest failed run
tg doctor report create --run <run-id>    # about this one
```

Escribe un archivo JSON con lo que muestra `tg doctor` y la ejecución, e indica dónde enviarlo: una nueva incidencia en [GitHub](https://github.com/leemour/tg-cli/issues/new). Revísalo antes de enviarlo. No contiene texto de mensajes; los identificadores aparecen como etiquetas, no como números de Telegram.

Si no hay ejecuciones fallidas guardadas, vuelve a ejecutar el comando que falla; el fallo se guardará automáticamente.

## Consultar los registros

Los registros son JSON, así que puedes analizarlos con `jq`. `tg runs list --json` devuelve `{ items, page, limit, hasMore }`; `items` contiene los archivos `run.json`, del más reciente al más antiguo:

```sh
tg runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, errorCode}]'
tg runs list --limit 100 --json | jq '[.items[] | .durationMs] | add / length'    # average duration
tg runs list --limit 100 --json | jq '[.items[] | select(.requests > 10) | {command, requests}]'
```

`tg runs show <run-id>` muestra los mismos eventos como tabla, sin los campos repetidos en cada línea. El archivo completo está en la carpeta que indica `tg runs path <run-id>`.

## Siguientes pasos

- [Solución de problemas](./troubleshooting.md): qué significa cada error y cómo resolverlo.
- [Seguridad](./security.md): qué se guarda en disco.

## Descubrir comandos desde scripts

`tg commands --json` enumera comandos, opciones globales y códigos de salida sin conectar una cuenta. `cli` identifica la herramienta, `version` es la versión instalada del paquete y `contract` es la versión del contrato JSON compartido (`0`). Cambia cuando hay modificaciones incompatibles en los campos de respuesta; actualizar el paquete por sí solo no cambia `contract`. Los scripts pueden consultar campos individuales en vez de comparar todo el JSON con una cadena guardada.
