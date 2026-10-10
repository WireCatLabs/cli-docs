---
title: "Diagnóstico: qué hizo un comando"
---

<a id="mostrar-eventos" />
<a id="guardar-eventos" />
<a id="usar-los-registros" />
<a id="referencia-para-scripts" />
<a id="показать" />
<a id="сохранить" />
<a id="что-можно-с-этим-делать" />
<a id="справочник-для-скриптов" />

Esta página es necesaria cuando un comando falla, se congela o tarda demasiado y desea comprender por qué. Una vez que lo haya leído, podrá ver las solicitudes del comando mientras funcionan, guardar un registro de ejecución, probar la instalación y enviar un informe de problemas que no incluya ningún texto de mensaje.

Palabras que aparecen aquí:

- **Ejecución** - una llamada `max`, desde el inicio hasta la salida.
- **Registro de ejecución**: el directorio donde se almacena lo que hizo un ejecución: comando, total y una línea para cada solicitud a MAX. Nunca contiene mensajes de texto, nombres o títulos.
- **`max doctor`** comprueba la instalación: versión, entrada, configuración y archivo local.
- **Informe de problema**: un archivo JSON de la respuesta `max doctor` y un inicio fallido. Está adjunto a un problema en GitHub.

## ¿Qué se puede hacer?

| Tarea | Comando | Qué guarda |
|---|---|---|
| Ver peticiones durante la ejecución | `max … --trace` | Nada; solo stderr |
| Guardar una ejecución | `max … --record` | Registro de ejecución |
| Encontrar una ejecución fallida | `max runs list` | Los fallos se guardan automáticamente |
| Guardar todas las ejecuciones | `max config set record true` | Cada registro |
| Comprobar la instalación | `max doctor`, `max doctor --online` | Nada |
| Crear un informe de problemas | `max doctor report create` | Un archivo que tú envías |

## Mostrar: `--trace`

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

Todo esto va **a stderr**, por lo que nada se rompe junto a `--json`:

```sh
max chats list --json --trace > chats.json    # данные в файл, диагностика на экран
```

En la terminal, las líneas de arriba. En la tubería, un objeto JSON por línea, siguiendo la misma regla que para los datos:

```sh
max chats list --json --trace 2>&1 >/dev/null | jq -c 'select(.event == "response")'
```

`--trace` es más fuerte que `--quiet`: la bandera que agregaste tú mismo siempre funciona.

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

## Guardar: `--record`

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

El directorio tiene permisos `0700` y ambos archivos, `0600`. `run.json` se escribe **dos veces**: al iniciar con estado `running`, y al terminar con el resultado. Así no queda un directorio con eventos sin una descripción de la ejecución.

El resultado se escribe **en cualquier salida**, incluso si falla antes de conectar:

```json
{ "runId": "…", "command": "chats list", "profile": "default", "status": "failed",
  "requests": 0, "errorCode": "authentication_error", "durationMs": 12 }
```

## Las ejecuciones fallidas siempre se guardan

Si el comando finaliza con un error, su ejecución se guarda sin `--record`, con la marca `"keptBecauseFailed": true` en `run.json`. Esto se aplica a cualquier comando y a cualquier error: indicador incorrecto, comando desconocido, verificación antes de comenzar a trabajar, comandos que no funcionan en MAX (`models`, `server`, `watch`, `upgrade`). La grabación contiene sólo las palabras del comando, por ejemplo `messages list`, sin lo que estaba escrito después de ellas.

Un ejecución exitoso sin `--record` no deja constancia. Por lo tanto, un informe de problema siempre tiene algo que adjuntar. `--no-record` o `"record": false` en la configuración también lo desactiva.

Las búsquedas y estadísticas exitosas mantienen su historial, separado de los registros de ejecución. Contiene parámetros de consulta, pero no se encontraron mensajes. Cómo gestionarlo - en la sección [búsquedas guardadas e historial](./search.md#сохранённые-поиски-и-история).

## Registrar cada ejecución

```sh
max config set record true          # этот профиль
max chats list --no-record          # но не этот запуск
```

Lo mismo en el archivo de configuración:

```json
{ "profiles": { "default": { "record": true } } }
```

Luego se escribe cada ejecución. Por defecto, un ejecución exitoso no se registra a menos que se lo soliciten: un directorio de quién lee y cuándo sería un diario de su vida que nadie solicitó. `--no-record` o `"record": false` desactivan tanto la grabación de ejecución como el historial de búsqueda.

## Conservación

**30 días**, o `keepRunsForDays` en [ajustes](./configuration.md). Lo antiguo sólo se elimina cuando se escribe algo: una herramienta que no escribe nada no tiene por qué pasar por este directorio. Se elimina durante días en su totalidad, por nombre de directorio, por lo que no es necesario abrir nada para solucionarlo.

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

**Ni truncado ni como hash.** El evento se construye con campos nombrados explícitamente, en lugar de filtrar una copia de la solicitud: un campo no previsto no puede llegar al registro. `session.login` tiene un campo `token`, y ninguna rama del código accede a él.

Por el contrario, existen identificadores en el registro. El ID del chat es un número que no sirve de nada sin la sesión a la que pertenece. Y sólo él hace que el diagnóstico sea útil: cualquier queja real se refiere a una conversación concreta.

No se registra el texto de error de MAX: el servidor podría citar lo enviado, incluido un mensaje. Solo se guarda la clave con minúsculas latinas, cifras, puntos y guiones, como `proto.payload`. Si MAX devuelve otra cosa, no se registra.

Lo mismo ocurre con un informe recopilado de una ejecución.

## Verificar instalación: `max doctor`

```sh
max doctor              # никуда не подключается
max doctor --online     # ещё и входит в MAX один раз; ничего не отправляет
```

Sin `--online` imprime, **sin conectarse a MAX**, de qué depende cualquier comando:

- si hay un token y de dónde viene, qué entrada hay en el llavero y si las variables de entorno lo han movido (el token en sí nunca se imprime, solo "es" y "de");

- almacenamiento general: en la respuesta `--json` el campo `store` es la ruta, esquema y número de chats y mensajes guardados. El cheque no crea ni actualizal archivo. `legacyCache` solo indica si existe un archivo de archivo local antiguo; si es así, `doctor` sugiere la ruta para la eliminación manual;
- directorio de inicio;

- qué está ejecutando `max` (Node o Bun, y dónde), qué administrador de paquetes está instalado, qué comando `max` encontrará en el nuevo terminal, si el llavero y SQLite están cargados, si el modelo de voz está descargado. Si el directorio con el comando `max` no está en `PATH`, `max doctor` imprime los comandos exactos que lo agregarán allí: en Windows - para PowerShell, en Linux y macOS - la línea `export`;
- pausa de inicio de sesión después de una falla MAX para inicios de sesión demasiado frecuentes, si corresponde.

Para un bot, `max <имя> doctor` indica de dónde viene el token, cuántos chats ha visto y dónde están sus archivos: estado, caché, registros, archivo del bot, registro de envíos y almacén común de mensajes. No muestra el token.

**`--online`**: una entrada, un chat de la lista, luego el servidor MCP se inicia cuando el cliente lo inicia y responde con una lista de herramientas. No envía nada y no marca nada como leído. La entrada cuenta para el límite MAX de entradas, por lo que si hay un error no se repetirá. Si alguna pieza falla, el código de retorno no es `0`. Si el perfil tiene un token de bot, `--online` también pregunta a la API del bot de quién es el token e imprime el nombre y la identificación del bot. Si no hay token personal, no se realiza el ingreso a MAX.

## Informe de problemas

```sh
max doctor report create              # о последнем неудачном запуске
max doctor report create --run <id>   # об этом запуске
```

El comando escribe un archivo JSON (lo que muestra y ejecuta `max doctor`) e imprime un enlace al nuevo problema en [github.com/WireCatLabs/max-cli/issues](https://github.com/WireCatLabs/max-cli/issues). Leal archivo antes de enviarlo. No contiene textos de mensajes y los números de chats y mensajes se reemplazan por etiquetas. ¿Qué más contiene? En la sección [cómo informar un problema](./troubleshooting.md#как-сообщить-о-проблеме).

Si no se realiza ningún inicio fallido, vuelva a ejecutar el comando fallido: el error persistirá.

## Qué hacer con los registros

Los registros son JSON, por lo que `jq` responde las preguntas sobre ellos. `max runs list --json` corresponde a `{ items, page, limit, hasMore }`, y `items` es el ejecución de `run.json`, nuevos en la parte superior:

```sh
# какие запуски закончились плохо
max runs list --json | jq '.items[] | select(.status=="failed") | {runId, command, errorCode}'

# сколько времени ушло на вход в последних запусках
for id in $(max runs list --json | jq -r '.items[].runId'); do
  jq -r 'select(.operation=="session.login" and .event=="response") | "\(.durationMs)ms"' \
    "$(max runs path "$id" --json | jq -r .path)/events.jsonl"
done
```

`max runs show` imprime los mismos eventos en una tabla, sin campos de servicio, que se repiten en cada línea; de lo contrario, la tabla se sale del borde derecho de la pantalla antes de alcanzar las duraciones. El archivo completo, con los campos de servicio, se encuentra en el directorio que imprime `max runs path`.

## Siguiente paso

- [Qué significa el error y qué hacer](./troubleshooting.md)
- [Lo que generalmente termina en el disco](./security.md)
