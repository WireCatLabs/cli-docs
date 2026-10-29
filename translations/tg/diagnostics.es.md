---
title: "Diagnóstico: qué hizo un comando"
---

<a id="descubrir-comandos-desde-scripts" />

Utilice esta página cuando un comando falle, se cuelgue o tarde demasiado y quiera ver por qué. Al final, puede observar las solicitudes de un comando a medida que ocurren, mantener un registro de una ejecución, verificar su instalación y enviar un informe de problema que no contenga ningún mensaje de texto.

Algunas palabras que utiliza esta página:

- Una **ejecución** es una llamada de `tg`, desde el inicio hasta la salida.
- Un **registro de ejecución** es una carpeta que guarda lo que hizo una ejecución: su línea de comandos, su resultado y una línea por solicitud a Telegram. Esas líneas nunca contienen texto de mensajes, nombres ni títulos. Lo que guarda de la línea de comandos que escribiste está en [Lo que escribiste](#what-you-typed).
- **`tg personal doctor`** comprueba la instalación: la versión, el inicio de sesión, la configuración y el archivo local.
- Un **informe de problema** es un archivo JSON creado a partir de `tg personal doctor` y una ejecución fallida. Lo adjuntas a un problema.

## Qué puedes hacer

| Tarea | Comando | ¿Guarda algo? |
|---|---|---|
| Vea cada solicitud a medida que sucede | `tg personal --trace …` | no, imprime solo en stderr |
| Encuentra una ejecución más tarde | `tg personal runs list` | cada ejecución se mantiene sola |
| Deja fuera una ejecución | `tg personal --no-record …` | nada |
| Mantén solo las ejecuciones fallidas | `tg personal config set record false` | las ejecuciones fallidas |
| Verifique la instalación | `tg personal doctor`, `tg personal doctor --online` | no |
| Hacer un informe de problema | `tg personal doctor reports create` | sí, un archivo que envías |

## Ver las operaciones: `--trace`

```sh
tg personal --trace messages list "Book club" --limit 5
```

`--trace` imprime cada operación por stderr mientras ocurre: `→` indica lo solicitado y `←` la respuesta, con identificadores, cantidades, duración y código de error si lo hay.

```text
→ messages.list    chat -1001234567890
← messages.list    chat -1001234567890  118ms  5 messages
```

También pasa por las líneas de registro de la biblioteca de Telegram que se encuentran debajo. stdout no cambia, por lo que una tubería todavía obtiene solo datos.

## Guardar una ejecución: `--record`

Cada ejecución se mantiene sola. `--record` solo importa para un comando que sigue hasta que lo detienes (`watch`, `serve`,
`mcp serve`) y para un comando que WireCat Desktop ejecuta por su cuenta: esos mantienen una ejecución que funcionó solo con `--record`.

```sh
tg personal runs list        # recorded runs, newest first
tg personal runs show <run-id>  # one run: its outcome, and one line per request
tg personal runs path <run-id>  # the folder that holds it
```

`runs show` enumera cada solicitud a Telegram: su método (`messages.getHistory`, o `sendMessage` de la Bot API), cuánto
tardó y cómo terminó. Cuando Telegram pide esperar (`FLOOD_WAIT`, o un `429` de la Bot API) y `tg` espera y vuelve a
intentarlo, la solicitud rechazada va seguida del reintento como intento 2, con el tiempo de espera. Una ejecución guarda como máximo 2.000 líneas o 1 MB de ellas, y
después cuenta el resto.

Un registro de ejecución es una carpeta en `runs/<day>/` en la carpeta de estado (`~/.local/share/tg-cli/runs/` en Linux). Su nombre es la hora y el comando. Contiene dos archivos:

- `run.json`: comando, perfil, versiones de `tg`, Node y sistema, hora de inicio y fin, número de peticiones, resultado y código de error.
- `events.jsonl`: las mismas operaciones que muestra `--trace`, y cada solicitud dentro de ellas, una por línea.

Una ejecución que funcionó y no registró solicitudes no deja carpeta: es una línea en el índice del día, y `runs show` la sigue
encontrando.

## Las ejecuciones fallidas siempre se guardan

Cuando un comando termina con un error, su ejecución se mantiene, incluso con `record` configurado en `false`; `run.json` entonces tiene `"kept_because_failed": true`. Esto es cierto para cada comando y cada error: una mala opción, un comando desconocido, una verificación antes de cualquier trabajo y comandos que nunca se conectan (`models`, `server`, `upgrade`). Un error antes de que se iniciara el comando, como un archivo de configuración que no se carga, se mantiene como una ejecución denominada `tg`. Lo que el registro guarda de la línea de comandos está en [Lo que escribiste](#what-you-typed); una ejecución cuya configuración no se cargó oculta cada valor escrito que pueda ser texto.

Por lo tanto, un informe de problema siempre tiene un error que adjuntar. Solo `--no-record` deja fuera una ejecución fallida.

Las búsquedas y consultas de estadísticas exitosas mantienen su propio historial, además de los registros de ejecución. Tiene sus propios controles: ver [búsquedas guardadas e historial](./search.md#saved-searches-and-history).

## Cuándo mantener solo las ejecuciones fallidas

```sh
tg personal config set record false         # profile "personal": failed runs only
tg personal --no-record chats list          # this run: nothing at all
```

Una ejecución que funcionó contiene los identificadores de los chats que leíste y, con `record_input` activado, lo que escribiste (un mensaje que
enviaste, un chat nombrado por su título). Se guarda solo en esta computadora, solo tú puedes leerla, durante 7 días. Configura `record`
en `false` si prefieres no guardarla en absoluto.

## Cuánto se conservan

Una ejecución que funcionó se conserva **7 días** (`keep_successful_runs_for_days`), una fallida **30 días** (`keep_runs_for_days`).
La carpeta de ejecuciones además se mantiene por debajo de **200 MB** (`runs_size_limit_mb`): al superarlo, se eliminan primero las ejecuciones más antiguas que funcionaron.
Los registros antiguos solo se eliminan al guardar uno nuevo, se comprueba una vez al día, por días completos y según el nombre de la carpeta,
sin abrir nada para decidir.

## Qué nunca contiene un registro

Los eventos de una ejecución y `--trace` contienen el nombre, los identificadores, los recuentos, las duraciones y los códigos de error de una operación. Nunca llevan:

- texto ni leyendas de mensajes;
- títulos de chats, nombres de personas ni nombres de usuario;
- números de teléfono, códigos de inicio de sesión, contraseñas 2FA, sesiones ni hash de la aplicación.

### Lo que escribiste

`run.json` también guarda la línea de comandos. Lo que guarda depende de tu versión de `tg`:

- **Una versión que muestra `record_input` en `tg personal config show`** guarda la línea de comandos tal como la
  escribiste (el título de un chat, una búsqueda, el texto de un mensaje), para que puedas releer lo que ejecutaste. Un secreto
  siempre es `[redacted]`: el valor de una opción cuyo nombre indica un token, contraseña, frase de contraseña, secreto,
  credencial, cookie, autorización o clave de API; un valor que `tg` marca como secreto, como `bot api --body`; una
  contraseña dentro de una URL; una cadena larga que parece un token. Para volver a ocultar cada valor escrito que pueda ser
  texto:

  ```sh
  tg personal config set record_input false     # everywhere
  tg personal config set record_input failed    # kept only in a run that failed
  ```

- **Una versión anterior** guarda las palabras del comando y los nombres de las opciones, como `messages list --limit`.
  Cada valor que pueda ser texto, como lo que escribiste como `<chat>`, es `[redacted]`.

Un informe de problema hecho a partir de una ejecución oculta esos valores escritos en todas las versiones.

## Comprobar la instalación: `tg personal doctor`

```sh
tg personal doctor     # connects to nothing
tg personal doctor --online  # also connects once and reads the account; sends nothing to Telegram
```

Muestra versión, entorno de ejecución, perfil, configuración, existencia de sesión y credenciales (nunca sus valores), si `TG_*_DIR` ha cambiado la entrada del llavero, el archivo local (ruta, versión, número de chats y mensajes), los envíos de la última hora y las ejecuciones guardadas.

- **`config.issues`** enumera todos los problemas del archivo de configuración: JSON no válido (con la línea y la
  columna donde se detuvo la lectura), un ajuste o una clave de permiso que `tg` no conoce, un valor del tipo
  incorrecto. Cada problema dice qué tiene que ser el valor, nunca el valor en sí. Todos menos el JSON no válido
  traen el comando `config unset` que los elimina (`fix`). `doctor` sigue respondiendo, con código de salida `0`.
- **`login`** es `not checked` sin `--online`. Un archivo de sesión en el disco no significa que Telegram todavía lo acepte. Con `--online` es `ok` o `failed`, con una pista.
- **`files`** y **`telegram.session.files`** nombran cada archivo o carpeta privada que otros usuarios de esta máquina pueden leer: el archivo de configuración (necesita `0600`) y su carpeta (`0700`), la sesión, el almacén, sus archivos SQLite `-wal` y `-shm`, el diario de envío y la carpeta de ejecuciones. Cada problema es `{ path, mode, want }`, y stderr imprime el `chmod` que lo soluciona: `to make it private: chmod 600
  '<path>'`. Sin un perfil nombrado, o cuando se rechazan los ajustes, `files` revisa solo el archivo de configuración y su carpeta. `doctor` nunca cambia el modo de un archivo. En Windows no se comprueban los permisos Unix.
- **`online.clock`** (con `--online`) compara el reloj de esta computadora con el de Telegram.   `skew_ms` es positivo cuando esta computadora está por delante. Avisa (`ok: false`) a los 10 segundos. Telegram rechaza una solicitud enviada más de 30 segundos antes de su propio reloj.
- **`online.standing`** (con `--online`) es `active`, `frozen`, `banned`, `deactivated` o `revoked`, o `unknown` cuando la respuesta de Telegram no pudo decirlo. Una cuenta congelada puede leer pero no escribir. Cuando Telegram los proporciona, incluye la fecha en que se congeló la cuenta, la fecha en que Telegram la eliminará y el enlace de apelación. Iniciar sesión nuevamente no vuelve a abrir una cuenta cerrada de Telegram.
- **`flood`** enumera las esperas que Telegram le pidió a este perfil que mantuviera (`deadlines`) y una retención en sus envíos (`send_block`). `doctor` solo lee, con una excepción: **`doctor --online` escribe la retención congelada.** Cuando lee la cuenta como congelada, retiene los envíos hasta la fecha de Telegram. Cuando lo lee como activo, levanta esa retención. Nunca elimina la retención de un límite de spam: `tg personal flood clear` lo hace.

## Crear un informe de problema

```sh
tg personal doctor reports create          # about the newest failed run
tg personal doctor reports create --run <run-id>  # about this one
```

Escribe un archivo JSON (lo que muestra `tg personal doctor` más la ejecución) y dice dónde enviarlo: una nueva incidencia en [github.com/WireCatLabs/tg-cli/issues](https://github.com/WireCatLabs/tg-cli/issues/new). Léelo antes de enviarlo. No contiene ningún texto de mensaje y cada identificación aparece como una etiqueta, no como un número de Telegram. [Cómo informar un problema](./troubleshooting.md#report-a-problem) enumera todo lo que contiene el archivo.

Si no hay ejecuciones fallidas guardadas, vuelve a ejecutar el comando que falla; el fallo se guardará automáticamente.

## Consultar los registros

Los registros son JSON, así que puedes analizarlos con `jq`. `tg personal runs list --json` devuelve `{ items, page: { limit, has_more }, meta }`; `items` contiene los archivos `run.json`, del más reciente al más antiguo:

```sh
tg personal runs list --limit 100 --json | jq '[.items[] | select(.status == "failed") | {command, error_code}]'
tg personal runs list --limit 100 --json | jq '[.items[] | .duration_ms] | add / length'  # average duration
tg personal runs list --limit 100 --json | jq '[.items[] | select(.requests > 10) | {command, requests}]'
```

`tg personal runs show <run-id>` muestra los mismos eventos como tabla, sin los campos repetidos en cada línea. El archivo completo está en la carpeta que indica `tg personal runs path <run-id>`.

## Siguiente paso

- [Qué significa un error y qué hacer](./troubleshooting.md)
- [Lo que llega al disco](./security.md)

## Buscar errores y ejecuciones parciales

```sh
tg personal search runs error_code:rate_limited --json
tg personal search runs status:partial 'started_at>=2026-10-01' --json
```

`search runs` busca texto literal en metadatos y eventos de diagnóstico seguros.
Los términos `status:`, `error_code:`, `operation:`, `profile:` y las comparaciones o rangos de `started_at:`, junto con `--limit` y `--page`, acotan la búsqueda. Cada página admite hasta 100 ejecuciones;
cada ejecución devuelve hasta 100 eventos coincidentes, con `events_truncated` si hay más.
El fallo de un archivo o una página de historial genera `status: "partial"` con ID fallidos, etapas y códigos.
El registro no copia el contenido de mensajes ni las respuestas de error del proveedor.
Las ejecuciones parciales se conservan por defecto salvo que se desactive explícitamente el registro. La búsqueda no se registra a sí misma.

En MCP llama a `tg_read` con `command: "search runs"`; `arguments` acepta `query` (incluidas las condiciones de tiempo), `limit` y `page`.
Solo lee registros del perfil activo, no conecta con Telegram ni abre los logs sin filtrar de trabajos en segundo plano.
El resultado parcial original contiene acciones de recuperación; el registro conserva solo identificadores y códigos seguros.
