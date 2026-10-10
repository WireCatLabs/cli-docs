---
title: "Diagnóstico: qué hizo un comando"
---

<a id="descubrir-comandos-desde-scripts" />
<a id="command-discovery-for-scripts" />

Utilice esta página cuando un comando falle, se cuelgue o tarde demasiado y quiera ver por qué. Al final, puede observar las solicitudes de un comando a medida que ocurren, mantener un registro de una ejecución, verificar su instalación y enviar un informe de problema que no contenga ningún mensaje de texto.

Algunas palabras que utiliza esta página:

- Una **ejecución** es una llamada de `tg`, desde el inicio hasta la salida.
- Un **registro de ejecución** es una carpeta que guarda lo que hizo una ejecución: su comando, su resultado y una línea por solicitud a Telegram. Nunca contiene texto, nombres o títulos de mensajes.
- **`tg doctor`** comprueba la instalación: la versión, el inicio de sesión, la configuración y el archivo local.
- Un **informe de problema** es un archivo JSON creado a partir de `tg doctor` y una ejecución fallida. Lo adjuntas a un problema.

## Qué puedes hacer

| Tarea | Comando | ¿Guarda algo? |
|---|---|---|
| Vea cada solicitud a medida que sucede | `tg --trace …` | no, imprime solo en stderr |
| Mantenga un registro de una ejecución | `tg --record …` | sí, un registro de ejecución |
| Encuentra una ejecución fallida más tarde | `tg runs list` | una ejecución fallida se mantiene sola |
| Mantenga un registro de cada ejecución | `tg config set record true` | sí, cada ejecución |
| Verifique la instalación | `tg doctor`, `tg doctor --online` | no |
| Hacer un informe de problema | `tg doctor report create` | sí, un archivo que envías |

## Ver las operaciones: `--trace`

```sh
tg --trace messages list "Book club" --limit 5
```

`--trace` imprime cada operación por stderr mientras ocurre: `→` indica lo solicitado y `←` la respuesta, con identificadores, cantidades, duración y código de error si lo hay.

```text
→ messages.list    chat -1001234567890
← messages.list    chat -1001234567890  118ms  5 messages
```

También pasa por las líneas de registro de la biblioteca de Telegram que se encuentran debajo. stdout no cambia, por lo que una tubería todavía obtiene solo datos.

## Guardar una ejecución: `--record`

```sh
tg --record chats list
tg runs list                 # recorded runs, newest first
tg runs show <run-id>        # one run: its outcome, and one line per operation
tg runs path <run-id>        # the folder that holds it
```

Un registro de ejecución es una carpeta en `runs/<day>/` en la carpeta de estado (`~/.local/share/tg-cli/runs/` en Linux). Su nombre es la hora y el comando. Contiene dos archivos:

- `run.json`: comando, perfil, versiones de `tg`, Node y sistema, hora de inicio y fin, número de peticiones, resultado y código de error.
- `events.jsonl`: las mismas operaciones que muestra `--trace`, una por línea.

## Las ejecuciones fallidas siempre se guardan

Cuando un comando termina con un error, su ejecución se mantiene incluso sin `--record`. `run.json` entonces tiene `"keptBecauseFailed": true`. Esto es cierto para cada comando y cada error: una mala opción, un comando desconocido, una verificación antes de cualquier trabajo y comandos que nunca se conectan (`models`, `server`, `upgrade`). Un error antes de que se iniciara el comando, como un archivo de configuración que no se carga, se mantiene como una ejecución denominada `tg`. El registro contiene sólo las palabras del comando, como `messages list`, nunca lo que siguió.

Una ejecución exitosa no deja registro a menos que usted lo solicite. Por lo tanto, un informe de problema siempre tiene un error al adjuntarlo. `--no-record`, o `"record": false` en la configuración, también desactiva esto.

Las búsquedas y consultas de estadísticas exitosas mantienen su propio historial, además de los registros de ejecución. Tiene sus propios controles: ver [búsquedas guardadas e historial](./search.md#saved-searches-and-history).

## Cuándo registrar todas las ejecuciones

```sh
tg config set record true          # this profile
tg --no-record chats list          # but not this one
```

Luego se mantiene cada ejecución. De forma predeterminada, una ejecución que funcionó no se escribe hasta que usted la solicita. Una herramienta de mensajería que guarda una carpeta de a quién lees y cuándo sería un diario de tu vida que nadie pidió.

## Cuánto se conservan

**30 días**, o el valor de `keepRunsForDays` en la configuración. Los registros antiguos solo se eliminan al guardar uno nuevo; si la herramienta no escribe nada, no recorre ese directorio. Se eliminan días completos según el nombre de la carpeta, sin abrir los archivos.

## Qué nunca contiene un registro

Un registro de ejecución y `--trace` contienen el nombre, los identificadores, los recuentos, las duraciones y los códigos de error de una operación. Nunca llevan:

- texto ni leyendas de mensajes;
- títulos de chats, nombres de personas ni nombres de usuario;
- **lo que introduces como `<chat>`**, ya que suele ser un título;
- números de teléfono, códigos de inicio de sesión, contraseñas 2FA, sesiones ni hash de la aplicación.

Lo mismo ocurre con un informe elaborado a partir de una ejecución.

## Comprobar la instalación: `tg doctor`

```sh
tg doctor              # connects to nothing
tg doctor --online     # also connects once and reads the account; sends nothing to Telegram
```

Muestra versión, entorno de ejecución, perfil, configuración, existencia de sesión y credenciales (nunca sus valores), si `TG_*_DIR` ha cambiado la entrada del llavero, el archivo local (ruta, versión, número de chats y mensajes), los envíos de la última hora y las ejecuciones guardadas.

- **`login`** es `not checked` sin `--online`. Un archivo de sesión en el disco no significa que Telegram todavía lo acepte. Con `--online` es `ok` o `failed`, con una pista.
- **`files`** y **`telegram.session.files`** nombran cada archivo o carpeta privada que otros usuarios de esta máquina pueden leer: la sesión, el almacén, sus archivos SQLite `-wal` y `-shm`, el diario de envío y la carpeta de ejecuciones. Cada uno tiene el comando `chmod` que lo soluciona. `doctor` nunca cambia el modo de un archivo. Windows no está marcado.
- **`online.clock`** (con `--online`) compara el reloj de esta computadora con el de Telegram.   `skewMs` es positivo cuando esta computadora está por delante. Avisa (`ok: false`) a los 10 segundos. Telegram rechaza una solicitud enviada más de 30 segundos antes de su propio reloj.
- **`online.standing`** (con `--online`) es `active`, `frozen`, `banned`, `deactivated` o `revoked`, o `unknown` cuando la respuesta de Telegram no pudo decirlo. Una cuenta congelada puede leer pero no escribir. Cuando Telegram los proporciona, incluye la fecha en que se congeló la cuenta, la fecha en que Telegram la eliminará y el enlace de apelación. Iniciar sesión nuevamente no vuelve a abrir una cuenta cerrada de Telegram.
- **`flood`** enumera las esperas que Telegram le pidió a este perfil que mantuviera (`deadlines`) y una retención en sus envíos (`sendBlock`). `doctor` solo lee, con una excepción: **`doctor --online` escribe la retención congelada.** Cuando lee la cuenta como congelada, retiene los envíos hasta la fecha de Telegram. Cuando lo lee como activo, levanta esa retención. Nunca elimina la retención de un límite de spam: `tg flood clear` lo hace.

## Crear un informe de problema

```sh
tg doctor report create                   # about the newest failed run
tg doctor report create --run <run-id>    # about this one
```

Escribe un archivo JSON (lo que muestra `tg doctor` más la ejecución) y dice dónde enviarlo: un nuevo número en [github.com/leemour/tg-cli/issues](https://github.com/leemour/tg-cli/issues/new). Léelo antes de enviarlo. No contiene ningún texto de mensaje y cada identificación aparece como una etiqueta, no como un número de Telegram. [Cómo informar un problema](./troubleshooting.md#report-a-problem) enumera todo lo que contiene el archivo.

Si no hay ejecuciones fallidas guardadas, vuelve a ejecutar el comando que falla; el fallo se guardará automáticamente.

## Consultar los registros

Los registros son JSON, así que puedes analizarlos con `jq`. `tg runs list --json` devuelve `{ items, page, limit, hasMore }`; `items` contiene los archivos `run.json`, del más reciente al más antiguo:

```sh
tg runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, errorCode}]'
tg runs list --limit 100 --json | jq '[.items[] | .durationMs] | add / length'    # average duration
tg runs list --limit 100 --json | jq '[.items[] | select(.requests > 10) | {command, requests}]'
```

`tg runs show <run-id>` muestra los mismos eventos como tabla, sin los campos repetidos en cada línea. El archivo completo está en la carpeta que indica `tg runs path <run-id>`.

## Siguiente paso

- [Qué significa un error y qué hacer](./troubleshooting.md)
- [Lo que llega al disco](./security.md)
