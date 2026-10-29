---
title: "Diagnóstico: qué hizo un comando"
---

<a id="mostrar-eventos" />
<a id="guardar-eventos" />
<a id="usar-los-registros" />
<a id="referencia-para-scripts" />

Esta página es necesaria cuando un comando falla, se congela o tarda demasiado y desea comprender por qué. Una vez que lo haya leído, podrá ver las solicitudes del comando mientras funcionan, guardar un registro de ejecución, probar la instalación y enviar un informe de problemas que no incluya ningún texto de mensaje.

Palabras que aparecen aquí:

- **Ejecución** - una llamada `max`, desde el inicio hasta la salida.
- **Registro de ejecución**: el directorio donde se almacena lo que hizo un ejecución: comando, total y una línea para cada solicitud a MAX. Las líneas de las solicitudes nunca contienen textos de mensajes, nombres ni títulos. La línea de comandos el registro puede guardarla tal como la escribiste, pero sin secretos ([más detalles](#что-вы-набрали)).
- **`max personal doctor`** comprueba la instalación: versión, entrada, configuración y archivo local.
- **Informe de problema**: un archivo JSON de la respuesta `max personal doctor` y un inicio fallido. Está adjunto a un problema en GitHub.

## ¿Qué se puede hacer?

| Tarea | Comando | Qué guarda |
|---|---|---|
| Ver peticiones durante la ejecución | `max … --trace` | Nada; solo stderr |
| Guardar una ejecución | `max … --record` | Registro de ejecución |
| Encontrar una ejecución más tarde | `max personal runs list` | Cada ejecución se guarda automáticamente |
| Guardar solo las ejecuciones fallidas | `max personal config set record false` | Registro de la ejecución fallida |
| Comprobar la instalación | `max personal doctor`, `max personal doctor --online` | Nada |
| Crear un informe de problemas | `max personal doctor reports create` | Un archivo que tú envías |

## Mostrar: `--trace`

```sh
max personal chats list --trace
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

Todo esto va **a stderr**, por lo que nada se rompe junto a `--json`:

```sh
max personal chats list --json --trace > chats.json    # данные в файл, диагностика на экран
```

En la terminal, las líneas de arriba. En la tubería, un objeto JSON por línea, siguiendo la misma regla que para los datos:

```sh
max personal chats list --json --trace 2>&1 >/dev/null | jq -c 'select(.event == "response")'
```

`--trace` es más fuerte que `--quiet`: la bandera que agregaste tú mismo siempre funciona.

### Comandos del bot

En `max <имя> bot …`, cada solicitud HTTP muestra operación, IDs de la dirección (chat, mensaje, persona, comentario), estado HTTP, duración y tamaño.

```sh
max shop bot messages list -100 --trace
```

```text
→ getMyInfo        GET /me
← getMyInfo        GET /me  200  143ms  211 B
→ getMessages      GET /messages  chat -100
← getMessages      GET /messages  200  chat -100  187ms  6.2 kB
```

Los rechazos muestran código y clave MAX, como `404  not_found  not.found`, nunca el texto de la respuesta. Las cargas (`--file`, `uploads put`) tienen dos líneas propias, `upload.image`, `upload.video`, etc., con tamaño, estado y tiempo. No incluyen URL ni nombre: la URL concede acceso por sí misma.

## Guardar: `--record`

```sh
max personal chats list --record
max personal runs list                 # что делалось, новое сверху
max personal runs show <id>            # один запуск: чем кончился и куда ходил
max personal runs path <id>            # каталог, для jq и grep
```

Directorio de ejecución:

```text
~/.local/share/max-cli/runs/2026-09-19/20260919T234428Z-chats-list-9df39e/
  run.json       что это было, когда, какой профиль, сколько длилось, чем кончилось
  events.jsonl   по объекту JSON на запрос, без единого управляющего символа
```

Cada solicitud en `events.jsonl` lleva `"level": "wire"` y su transporte: `"transport": "max-ws"` para una trama del protocolo personal (con `opcode` y `seq`), `"transport": "http"` para la Bot API (método y ruta con `:id` en lugar del id, sin la cadena de consulta). Una solicitud de la Bot API tiene `attempt`: `1` para el primer intento, `2` y siguientes para un reintento. Tras un rechazo `429` o un fallo de lectura, el registro muestra primero la respuesta con `"outcome": "error"` y luego el reintento con `"attempt": 2` y `"wait_ms"`: cuántos milisegundos esperó el cliente antes (`Retry-After` de MAX o su propia pausa). Igual se marcan los reintentos de `messages send` mientras MAX responde `attachment.not.ready`: la trama de cada reintento lleva `attempt` y `"wait_ms": 1000`.

El directorio tiene permisos `0700` y ambos archivos, `0600`. `run.json` se escribe **dos veces**: al iniciar con estado `running`, y al terminar con el resultado. Así no queda un directorio con eventos sin una descripción de la ejecución.

El resultado se escribe **en cualquier salida**, incluso si falla antes de conectar:

```json
{ "run_id": "…", "command": "chats list", "profile": "personal", "status": "failed",
  "requests": 0, "error_code": "authentication_error", "duration_ms": 12 }
```

## Cada ejecución se guarda sola

La ejecución se guarda incluso sin `--record`, también la correcta. Una fallida se guarda con cualquier error: indicador incorrecto, comando desconocido, verificación antes de empezar, comandos que no van a MAX (`models`, `server`, `watch`, `upgrade`). En `run.json` de ese registro está `argv`: la línea de comandos tal como la escribiste, con el nombre del chat, la consulta de búsqueda o el texto del mensaje. Los secretos siempre se ocultan, y lo escrito se puede ocultar con el ajuste `record_input` ([más detalles](#что-вы-набрали)).

Una ejecución correcta que no registró ningún evento es una línea en la lista del día, sin carpeta; `runs show` la encuentra ahí. Los comandos que funcionan hasta que los detienes (`watch`, `serve`, `mcp serve`) y los que WireCat Desktop ejecuta para sí mismo guardan una ejecución correcta solo con `--record`. `--no-record` no guarda nada, ni siquiera una ejecución fallida.

Las búsquedas y estadísticas exitosas mantienen su historial, separado de los registros de ejecución. Contiene parámetros de consulta, pero no se encontraron mensajes. Cómo gestionarlo - en la sección [búsquedas guardadas e historial](./search.md#сохранённые-поиски-и-история).

## Cómo registrar menos

```sh
max personal config set record false         # этот профиль: только неудачные запуски
max personal chats list --no-record          # этот запуск: ничего
```

Lo mismo en el archivo de configuración:

```json
{ "profiles": { "personal": { "record": false } } }
```

Con `"record": false` no se registran las ejecuciones correctas; las fallidas, sí. Una ejecución correcta guarda la línea de comandos escrita, por ejemplo el texto de un mensaje enviado; `record_input` decide si se guarda ([más detalles](#что-вы-набрали)). `--no-record` o `"record": false` también desactivan el historial de búsqueda.

## Conservación

Una ejecución fallida, **30 días** (`keep_runs_for_days`); una correcta, **7 días** (`keep_successful_runs_for_days`), en [ajustes](./configuration.md). La carpeta de ejecuciones no crece más de `runs_size_limit_mb` (200 MB): primero se borran las correctas más antiguas. Lo antiguo sólo se elimina cuando se escribe algo: una herramienta que no escribe nada no tiene por qué pasar por este directorio. Se elimina durante días en su totalidad, por nombre de directorio, por lo que no es necesario abrir nada para solucionarlo.

## Lo que escribiste

En `run.json` de un registro de ejecución puede estar `argv`: las palabras después de `max`, tal como las escribiste. Muestran qué se ejecutó exactamente:

```json
{ "command": "messages list", "argv": ["personal", "messages", "list", "Семья", "--token=[redacted]"] }
```

En lugar de un secreto siempre aparece `[redacted]`, sea cual sea la configuración. Un secreto es el valor de un indicador cuyo nombre contiene token, password, secret, credential, cookie, authorization o API key; una contraseña dentro de una dirección; una cadena larga sin espacios que parece una clave; el cuerpo de `bot api … --body`. `max` no acepta un número de teléfono en la línea de comandos: si aun así lo escribes después de `contacts lookup`, el comando lo rechaza y el registro tendrá `[redacted]`.

Para que lo escrito no llegue a los registros de ejecución:

```sh
max personal config set record_input false   # этот профиль
max config set record_input false --defaults  # все профили
```

Entonces en `argv` quedan las palabras del comando, los nombres de los indicadores, el nombre del perfil y los valores que no pueden ser palabras de nadie: números cortos, fechas, duraciones, `true` y `false`. Todo lo demás se sustituye por `[redacted]`. Si el archivo de configuración no se puede leer, lo escrito también se oculta: quizá justo en él estaba desactivado `record_input`.

## Lo que nunca se registra

| Se registra | Nunca se registra |
|---|---|
| Operación, código de operación y número de petición | Nombre del chat |
| ID de chat, número de envío (`send`) e ID de mensaje | Nombre de la persona |
| Bytes enviados y recibidos | Texto de mensajes |
| Milisegundos de respuesta | Teléfono |
| Cantidad de chats, contactos y mensajes devueltos | Token |
| Código y clave breve de error MAX, como `login.token` | Texto de error de MAX |
| Código de aviso, como `reactions_unread` | Texto del aviso |
| Tipo de error y líneas de código del fallo | Texto del error de caída |
| Versión, entorno (`node` o `bun`) y sistema | Ruta del directorio de ejecuciones |

La tabla trata de las líneas de eventos y del resultado de la ejecución. La línea de comandos en `argv` es aparte, [arriba](#что-вы-набрали).

**Ni truncado ni como hash.** El evento se construye con campos nombrados explícitamente, en lugar de filtrar una copia de la solicitud: un campo no previsto no puede llegar al registro. `session.login` tiene un campo `token`, y ninguna rama del código accede a él.

Por el contrario, existen identificadores en el registro. El ID del chat es un número que no sirve de nada sin la sesión a la que pertenece. Y sólo él hace que el diagnóstico sea útil: cualquier queja real se refiere a una conversación concreta.

No se registra el texto de error de MAX: el servidor podría citar lo enviado, incluido un mensaje. Solo se guarda la clave con minúsculas latinas, cifras, puntos y guiones, como `proto.payload`. Si MAX devuelve otra cosa, no se registra.

Lo mismo ocurre con un informe recopilado de una ejecución.

## Verificar instalación: `max personal doctor`

```sh
max personal doctor              # никуда не подключается
max personal doctor --online     # ещё и входит в MAX один раз; ничего не отправляет
```

Sin `--online` imprime, **sin conectarse a MAX**, de qué depende cualquier comando:

- si hay un token y de dónde viene, qué entrada hay en el llavero y si las variables de entorno lo han movido (el token en sí nunca se imprime, solo "es" y "de");

- almacenamiento general: en la respuesta `--json` el campo `item.store` es la ruta, esquema y número de chats y mensajes guardados. La comprobación no crea ni actualiza el almacenamiento;
- directorio de inicio;

- qué está ejecutando `max` (Node o Bun, y dónde), qué administrador de paquetes está instalado, qué comando `max` encontrará en el nuevo terminal, si el llavero y SQLite están cargados, si el modelo de voz está descargado. Si el directorio con el comando `max` no está en `PATH`, `max personal doctor` imprime los comandos exactos que lo agregarán allí: en Windows - para PowerShell, en Linux y macOS - la línea `export`;
- pausa de inicio de sesión después de una falla MAX para inicios de sesión demasiado frecuentes, si corresponde.

Para un bot, `max <имя> doctor` indica de dónde viene el token, cuántos chats ha visto y dónde están sus archivos: estado, caché, registros, archivo del bot, registro de envíos y almacén común de mensajes. No muestra el token.

**`--online`**: una entrada, un chat de la lista, luego el servidor MCP se inicia cuando el cliente lo inicia y responde con una lista de herramientas. No envía nada y no marca nada como leído. La entrada cuenta para el límite MAX de entradas, por lo que si hay un error no se repetirá. Si alguna pieza falla, el código de retorno no es `0`. Si el perfil tiene un token de bot, `--online` también pregunta a la API del bot de quién es el token e imprime el nombre y la identificación del bot. Si no hay token personal, no se realiza el ingreso a MAX.

## Informe de problemas

```sh
max personal doctor reports create              # о последнем неудачном запуске
max personal doctor reports create --run <id>   # об этом запуске
```

Si no se puede leer la configuración, ejecuta primero `max doctor --json`. En `config.issues` enumera cada error del archivo: el tipo, la clave, la línea y la columna si el JSON no es válido, y el comando `config unset` que quita la clave. Los valores de los ajustes no aparecen en la respuesta. Aunque el archivo tenga errores, `doctor` responde y termina con el código `0`. En `files.problems` nombra el archivo de ajustes y su carpeta si otros usuarios pueden leerlos, y en stderr imprime el `chmod` que lo corrige. Crear un archivo de informe requiere comprobar los permisos de escritura, así que corrige antes el ajuste inválido.

El comando escribe un archivo JSON (lo que muestra y ejecuta `max personal doctor`) e imprime un enlace al nuevo problema en [github.com/WireCatLabs/max-cli/issues](https://github.com/WireCatLabs/max-cli/issues). Leal archivo antes de enviarlo. No contiene textos de mensajes y los números de chats y mensajes se reemplazan por etiquetas. ¿Qué más contiene? En la sección [cómo informar un problema](./troubleshooting.md#как-сообщить-о-проблеме).

Si no se realiza ningún inicio fallido, vuelva a ejecutar el comando fallido: el error persistirá.

## Qué hacer con los registros

Los registros son JSON, por lo que `jq` responde las preguntas sobre ellos. `max personal runs list --json` corresponde a `{ items, page: { limit, has_more } }`, y `items` es el ejecución de `run.json`, nuevos en la parte superior:

```sh
# какие запуски закончились плохо
max personal runs list --json | jq '.items[] | select(.status=="failed") | {run_id, command, error_code}'

# сколько времени ушло на вход в последних запусках
for id in $(max personal runs list --json | jq -r '.items[].run_id'); do
  jq -r 'select(.operation=="session.login" and .event=="response") | "\(.duration_ms)ms"' \
    "$(max personal runs path "$id" --json | jq -r .item.path)/events.jsonl"
done
```

`max personal runs show` imprime los mismos eventos en una tabla, sin campos de servicio, que se repiten en cada línea; de lo contrario, la tabla se sale del borde derecho de la pantalla antes de alcanzar las duraciones. El archivo completo, con los campos de servicio, se encuentra en el directorio que imprime `max personal runs path`.

## Siguiente paso

- [Qué significa el error y qué hacer](./troubleshooting.md)
- [Lo que generalmente termina en el disco](./security.md)

## Buscar errores y ejecuciones parciales

```sh
max personal search runs error_code:rate_limited --json
max personal search runs status:partial 'started_at>=2026-10-01' --json
```

`search runs` busca texto literal en metadatos y eventos de diagnóstico seguros.
Las condiciones `status:`, `error_code:`, `operation:`, `profile:` y las comparaciones o rangos de `started_at:` van en la consulta. `--limit` y `--page` eligen la página. Cada página admite hasta 100 ejecuciones;
cada ejecución devuelve hasta 100 eventos coincidentes, con `events_truncated` si hay más.
El fallo de un archivo o una página de historial genera `status: "partial"` con ID fallidos, etapas y códigos.
El registro no copia el contenido de mensajes ni las respuestas de error del proveedor.
Las ejecuciones parciales se conservan por defecto salvo que se desactive explícitamente el registro. La búsqueda no se registra a sí misma.

En MCP llama a `max_read` con `command: "search runs"`; `arguments` acepta `query` (con las condiciones y los límites de tiempo), `limit` y `page`.
Solo lee registros del perfil activo, no conecta con MAX ni abre los logs sin filtrar de trabajos en segundo plano.
El resultado completo del comando parcial nombra los elementos fallidos y sus códigos de error; el registro conserva solo identificadores y códigos seguros.
