---
title: "Diagnóstico"
---

Usa esta página cuando un comando falle, se cuelgue o tarde demasiado y quiera ver por qué. Al final, puede observar las operaciones de un comando a medida que ocurren, mantener un registro de una ejecución, verificar su instalación y enviar un informe de problema que no contenga ningún mensaje de texto.

Algunas palabras que utiliza esta página:

- Una **ejecución** es una llamada de `wa`, desde el inicio hasta la salida.
- Un **registro de ejecución** es una carpeta que guarda lo que hizo una ejecución: su línea de comando, su resultado y una línea por operación. Esas líneas nunca contienen texto de mensajes, nombres o títulos de chat. Lo que guarda de la línea de comando que escribiste está en [Lo que escribiste](#what-you-typed).
- **`wa personal doctor`** comprueba la instalación: la versión, el perfil, la configuración, el almacén local y las partes propias de WhatsApp: el motor, las claves del dispositivo y la cerradura.
- Un **informe de problema** es un archivo JSON creado a partir de `wa personal doctor` y una ejecución fallida. Lo adjuntas a un problema.

## Qué puedes hacer

| Tarea | Comando | ¿Guarda algo? |
|---|---|---|
| Vea cada operación tal como sucede | `wa --trace …` | no, imprime solo en stderr |
| Ver el fracaso completo | `wa --debug …` | no, imprime solo en stderr |
| Encuentra una ejecución más tarde | `wa personal runs list` | cada ejecución se mantiene sola |
| Deja una ejecución fuera | `wa personal --no-record …` | nada |
| Mantén solo las ejecuciones fallidas | `wa personal config set record false` | las ejecuciones fallidas |
| Verifique la instalación | `wa personal doctor`, `wa personal doctor --online` | no |
| Hacer un informe de problema | `wa personal doctor reports create` | sí, un archivo que envías |

## Muéstralo: `--trace` y `--debug`

```sh
wa personal --trace messages send 100000000000001@lid "test"
wa personal --debug chats mark-read 100000000000001@lid
```

`--trace` imprime cada operación en stderr a medida que sucede: qué se preguntó, qué respondió, con identificadores, recuentos, duración y un código de error, si lo hubiera. stdout no cambia, por lo que una tubería todavía obtiene solo datos. El propio registro del motor permanece apagado incluso entonces: nombra los identificadores de WhatsApp y un identificador de número de teléfono es un número de teléfono.

`--debug` reemplaza el error de una línea con el registro completo de la falla (su causa y pila) en stderr.

## Guárdalo: `--record`

```sh
wa personal --record chats list
wa personal runs list              # recorded runs, newest first
wa personal runs show 20261001T080000Z-process-000001     # one run: its outcome, and one line per operation
wa personal runs path 20261001T080000Z-process-000001     # the folder that holds it
```

La identificación de ejecución anterior está inventada; `runs list` muestra los reales.

Un registro de ejecución es una carpeta bajo `runs/<day>/` en la carpeta de estado. Su nombre es la hora y el comando. Contiene dos archivos:

- `run.json`: el comando, el perfil, la versión de `wa`, el nodo y el sistema, cuándo comenzó y finalizó, el resultado y el código de error;
- `events.jsonl`: las mismas operaciones que muestra `--trace`, una por línea. Bajo cada operación están las solicitudes que hizo, marcadas `"level": "wire"`: al motor de WhatsApp (`"transport": "wa-engine"`, el nombre de la solicitud del motor, como `send` u `older`) o a la Graph API de Meta para los comandos `bot` (`"transport": "http"`, el método y la ruta con los identificadores como `:id`). Cada una tiene su duración, resultado y código de error. Una solicitud al motor guarda el identificador de un mensaje cuando lo tiene y nunca el de un chat: el identificador de un chat contiene un número de teléfono. Una descarga de medios no guarda ninguna dirección.

## Se mantiene cada ejecución

Cada ejecución se mantiene sin `--record`, también la que funcionó. Una ejecución fallida se mantiene para cada comando y cada error: una mala opción, un comando desconocido, una verificación antes de cualquier trabajo, un rechazo porque otro comando retiene el dispositivo. Lo que el registro guarda de la línea de comando está en [Lo que escribiste](#what-you-typed); una ejecución cuya configuración no cargó oculta todo valor escrito que pueda ser texto.

Cada ejecución se registra, también las que funcionaron, por lo que un informe de problema siempre tiene la ejecución que adjuntar. `--no-record` no guarda nada en una ejecución; `"record": false` en la configuración guarda solo las ejecuciones fallidas.

Las búsquedas exitosas mantienen su propio historial, aparte de los registros de ejecución: consulte [búsqueda](./search.md).

## Cuándo mantener solo las ejecuciones fallidas

```sh
wa personal config set record false         # profile "personal": failed runs only
wa personal --no-record chats list          # this run: nothing at all
```

Una ejecución que funcionó guarda los identificadores de los chats que leíste y, con `record_input` activado, lo que escribiste (un mensaje que enviaste, un chat nombrado por su título). Se guarda solo en este ordenador, legible solo por ti, durante 7 días. Pon `record` en `false` si prefieres no guardarla en absoluto.

## ¿Cuánto tiempo vive?

Una ejecución que funcionó vive **7 días** (`keep_successful_runs_for_days`), una fallida **30 días** (`keep_runs_for_days`). La carpeta de ejecuciones también se mantiene por debajo de **200 MB** (`runs_size_limit_mb`): al superarlo, las ejecuciones más antiguas que funcionaron se eliminan primero. Las ejecuciones antiguas se eliminan sólo cuando se guarda una nueva, un día entero a la vez, por el nombre de la carpeta, por lo que no es necesario abrir nada para decidir.

## Lo que nunca está en un registro

Los eventos de una ejecución y `--trace` contienen el nombre, los identificadores, los recuentos, las duraciones y los códigos de error de una operación. Nunca llevan:

- el texto de un mensaje;
- un título de chat o el nombre de una persona;
- un número de teléfono, un código de emparejamiento o las claves del dispositivo.

### Lo que escribiste

`run.json` también guarda la línea de comando. Lo que guarda depende de tu versión de `wa`:

- **Una versión que lista `record_input` en `wa personal config show`** guarda la línea de comando tal como la escribiste (el nombre de un chat, una búsqueda, el texto de un mensaje) para que puedas leer lo que ejecutaste. Un secreto siempre es `[redacted]`: el valor de una opción llamada token, password, passphrase, secret, credential, cookie, authorization o API key; una contraseña dentro de una URL; una cadena larga que parece un token. Para volver a ocultar todo valor escrito que pueda ser texto:

  ```sh
  wa personal config set record_input false
  ```

- **Una versión anterior** guarda las palabras del comando y los nombres de las opciones, como `messages send --md`. Todo valor que pueda ser texto, como lo que escribiste como `<chat>`, es `[redacted]`.

Un informe de problema hecho a partir de una ejecución oculta esos valores escritos en todas las versiones.

## Verifique la instalación: `wa doctor`

```sh
wa personal doctor            # connects to nothing
wa personal doctor --online   # also connects once and reads the account; sends nothing
```

Además de la versión, el tiempo de ejecución, el perfil, el archivo de configuración y el almacén local, `doctor` lee tres cosas de WhatsApp desde el disco, sin iniciar nada:

- **`engine`**: si el programa del motor está ahí para iniciarse y su ruta. Cuando falta, la sugerencia dice qué hacer: reinstalar `wa` con los paquetes opcionales activados, configurar `WA_ENGINE` o, en una verificación de código fuente, ejecutar `pnpm engine:build`.
- **`device`**: si las claves del dispositivo existen y si otros usuarios de esta máquina pueden leer `private.db`, sus archivos `-wal` y `-shm` o su carpeta. Cada uno de estos archivos viene con el comando `chmod` que lo soluciona. `doctor` nunca abre las claves y nunca cambia el modo de un archivo. Windows no está marcado.
- **`lock`**: quién mantuvo la última conexión del dispositivo (`serve (pid 4242)`) y si ese proceso aún se ejecuta. El motor nunca borra el nombre, por lo que un titular cuenta como en funcionamiento sólo mientras su proceso lo hace.

**`config.issues`** enumera todos los problemas del archivo de configuración: JSON no válido (con la línea y la columna donde se detuvo la lectura), una configuración o una clave de permiso que `wa` no conoce, un valor de tipo incorrecto. Cada uno dice qué debe ser el valor, nunca el valor en sí. Todos menos el JSON no válido vienen con el comando `config unset` que los elimina (`fix`). `doctor` sigue respondiendo, con el código de salida `0`.

**`files`** nombra cada archivo o carpeta privados que otros usuarios de esta máquina pueden leer: el archivo de configuración (quiere `0600`) y su carpeta (`0700`), el almacén con sus archivos `-wal` y `-shm`, el diario de envíos y la carpeta de ejecuciones. Cada problema es `{ path, mode, want }`, y stderr imprime el `chmod` que lo corrige: `to make it private: chmod 600
'<path>'`. Sin un perfil nombrado, o cuando la configuración se rechaza, `files` comprueba solo el archivo de configuración y su carpeta. `doctor` nunca cambia el modo de un archivo por sí mismo. Windows no se comprueba.

`--online` se conecta una vez. Mientras se ejecuta `serve`, utiliza la conexión de `serve` ([una conexión por dispositivo](./sessions.md#one-connection-per-device)).

## Un informe de problema

```sh
wa personal doctor reports create              # about the newest failed run
wa personal doctor reports create --run 20261001T080000Z-process-000001   # a made-up run id
```

Escribe un archivo JSON (lo que muestra `wa personal doctor` más la ejecución) y dice dónde enviarlo: un nuevo problema en [github.com/WireCatLabs/whatsapp-cli/issues](https://github.com/WireCatLabs/whatsapp-cli/issues/new). Léelo antes de enviarlo. No contiene ningún texto de mensaje. `wa doctor reports show` por sí solo muestra lo que contendría un informe y no escribe nada.

Si no se mantiene ninguna ejecución fallida, vuelva a ejecutar el comando fallido; su fracaso se mantiene solo.

## Qué hacer con las carreras

Los registros son JSON, por lo que `jq` responde preguntas sobre ellos. `wa personal runs list --json` responde a `{ items, page, meta }` y `items` son los `run.json` de las ejecuciones, el más nuevo primero:

```sh
wa personal runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, error_code}]'
wa personal runs list --limit 100 --json | jq '[.items[] | .duration_ms] | add / length'
```

## Errores de búsqueda y ejecuciones parciales

```sh
wa personal search runs error_code:authentication_error --json
wa personal search runs status:partial 'started_at>=2026-10-01' --json
```

`search runs` busca texto de diagnóstico literal en los registros. Términos de consulta como `operation:messages.download`, `profile:work`, `error_code:timeout`, `status:failed` y comparaciones o rangos de `started_at:` lo acotan, junto con `--limit` y `--page`; cada página tiene hasta 100 ejecuciones. Solo lee los registros y nunca se conecta.

## Siguiente

- [Qué significa un error y qué hacer](./troubleshooting.md)
- [Lo que llega al disco](./security.md)
