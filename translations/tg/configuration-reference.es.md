---
title: "Referencia de configuración"
---

<a id="migrar-los-ajustes-de-acceso-antiguos" />

Utilice esta página cuando necesite el nombre exacto, el tipo, el valor predeterminado o el alcance de una configuración, o el nombre de una variable de entorno. Enumera todas las configuraciones que lee `tg`, todas las formas de anularlas y qué valor gana. Para cambios cotidianos y un archivo de ejemplo, comience con la [guía de configuración](./configuration.md). El comportamiento de los comandos, salidas y códigos de salida se encuentra en el [contrato CLI](./cli-contract.md).

Palabras que utiliza esta página:

- **Sección**: una parte del archivo de configuración. `defaults` se aplica a todos los perfiles, `profiles.<name>` a un perfil, `personal.*` solo a comandos de cuenta personal y `bot.*` solo a comandos de bot.
- **Alcance**: las secciones donde se permite una configuración. Una configuración fuera de su alcance es un error.
- **Fuente**: de donde proviene el valor vigente: una opción, una variable de entorno, una sección del archivo o el valor predeterminado integrado.

Ninguna configuración puede contener un secreto: el archivo no tiene ningún campo para una sesión, un hash de aplicación, un número de teléfono o una identificación de chat.

Un breve archivo de ejemplo y uno completo con cada sección, cada parte explicada, se encuentran en la [guía de configuración](./configuration.md#an-example-settings-file).

## Qué valor tiene prioridad

Para cada ajuste se utiliza el primero que esté definido:

1. Una opción del comando (`--limit 50`, `--record`, `--timeout 30s`).
2. Una variable de entorno (`TG_PROFILE`, `TG_TIMEOUT`).
3. La entrada del perfil en la configuración.
4. `defaults` en la configuración, compartido por todos los perfiles.
5. El valor predeterminado del programa.

```sh
tg chats list --limit 5     # 5: the option
# "limit": 50 in the profile's entry — when there is no option
# "limit": 30 in "defaults" — when the profile has none either
# 20 — when nothing is set
```

Dentro del archivo, gana la sección más específica. Para un comando de cuenta personal en el perfil `work`: `personal.profiles.work`, luego `profiles.work`, luego `personal.defaults`, luego `defaults`. Para `tg work bot …` lo mismo, con `bot` en lugar de `personal`.

No todos los entornos tienen las cinco formas. La [tabla de configuraciones](#the-file) dice cuáles existen.

## Consultar la configuración efectiva

```sh
tg config show
tg work config show
tg shop config show --bot
```

Enumera el perfil, de dónde vino el nombre del perfil, los perfiles, los nombres de los archivos, la ruta del archivo y si existe, y cada configuración con su valor y **de dónde vino ese valor**: `flag`, una variable de entorno, `config file`, `config defaults` o `default`. `--bot` muestra la configuración a medida que la obtiene un comando de bot de ese perfil. `--json` da lo mismo que un objeto, para un script.

La lista termina con `commandTimeoutMs`: el límite de un comando completo, desde `--timeout` o `TG_TIMEOUT`. No es una configuración del archivo; `timeoutMs` limita una solicitud.

Cuando se configura `TG_CONFIG_DIR`, `TG_STATE_DIR` o `TG_CACHE_DIR`, lo dice en stderr, ya que eso también cambia qué inicio de sesión se encuentra ([donde se guardan las partes del inicio de sesión](./sessions.md#where-the-parts-are-kept)).

⚠ **No es una verificación de estado.** Crea la configuración inicial si está ausente y luego lee los archivos. No abre ningún archivo local, no pide llavero y no se conecta. Si la sesión aún funciona es una pregunta para `tg doctor --online` ([solución de problemas con tg doctor](./troubleshooting.md#first-tg-doctor)).

## El archivo

`config.json` en el directorio de configuración (`~/.config/tg-cli/config.json` en Linux; otros sistemas se enumeran en [dónde van los archivos](./installation.md#where-files-go)). El primer comando que lee la configuración lo crea con `limit`, `keepRunsForDays`, `sendsPerHour`, `updateCheck` y `skillHint` bajo `defaults`; un archivo existente nunca se reemplaza.

```json
{
  "defaultProfile": "default",
  "defaults": {
    "sendsPerHour": 10,
    "updateCheck": false
  },
  "profiles": {
    "default": { "limit": 50 },
    "work": { "permissions": { "messages": "readonly", "messages.send": "allow" }, "record": true }
  },
  "personal": { "defaults": { "catchUpMarksRead": true } },
  "bot": { "profiles": { "shop": { "sendsPerHour": 200 } } }
}
```

- `defaults`: todos los perfiles, cuentas personales y bots.
- `profiles.<name>`: un perfil, cualquiera que sea su uso.
- `personal.defaults`, `personal.profiles.<name>`: solo comandos de cuenta personal.
- `bot.defaults`, `bot.profiles.<name>`: sólo comandos `tg <name> bot …`.

`defaultProfile` en la parte superior nombra el perfil utilizado cuando ni la primera palabra ni `TG_PROFILE` nombran uno. La primera palabra (`tg work …`) y `TG_PROFILE` la anulan. Sin él, el perfil es `default`.

| Configuración | Predeterminado | Qué hace | Anulado por uno ejecutado por |
|---|---|---|---|
| `limit` | `20` | filas por página de una lista | `--limit` |
| `timeoutMs` | ninguno | cuánto tiempo puede esperar **una** solicitud a Telegram, en milisegundos. Un comando genera varios, por lo que para limitar el comando completo use `--timeout` | ninguno (`--timeout` es otra cosa) |
| `color` | desde la terminal | color en la vista de tabla | ninguno; sin configuración, `NO_COLOR` lo apaga |
| `senderColors` | `false` | un color por remitente en la vista de tabla de mensajes | ninguno |
| `catchUpMarksRead` | `false` | `inbox` y `review` marcan cada chat que muestran como leído, hasta el mensaje más reciente mostrado. El otro lado lo ve | `--mark-read`, `--no-mark-read` |
| `searchCatchUp` | `false` | `store fetch` y `store gaps repair` también preparan el chat recuperado para búsqueda local: su gráfico y, si está instalado, sus vectores. Nunca descarga modelos ni llama a proveedores remotos | `--catch-up`, `--no-catch-up` |
| `record` | `false` | mantener cada ejecución ([diagnóstico](./diagnostics.md)) | `--record`, `--no-record` |
| `keepRunsForDays` | `30` | las ejecuciones registradas anteriores a esta se eliminan cuando se conserva la siguiente | ninguno |
| `permissions` | todo está permitido, excepto: eliminar, finalizar sesiones y algunos otros cambios solicitados; las reglas de respuesta pueden no enviarse | qué puede hacer el perfil, por comando ([abajo](#what-a-profile-may-do)) | ninguno; `--yes` y `--allow-dangerous` solo responden `ask`, nunca levantan `deny` |
| `sendsPerHour` | `30`; un bot no tiene ninguno hasta que se configura en la sección `bot` | la mayor cantidad de envíos en cualquier hora ([el control de envío](./security.md#the-send-guard)) | ninguno |
| `requestsPerMinute` | `60` | solicitudes un minuto después de una ráfaga de 20, compartida por todos los procesos del perfil; `0` lo apaga ([límites y esperas](./limits.md)) | `TG_REQUESTS_PER_MINUTE` |
| `transcribeWith` | `auto` | quién convierte la voz en texto: `auto` (Telegram, si no, un modelo local), `messenger` o `local` | `--local`, o `--model`, lo que lo implica |
| `speechModel` | ninguno | qué modelo descargado utiliza `--local` (`tg models audio list`) | `--model` |
| `proxy` | ninguno | el servidor SOCKS5, HTTP `CONNECT` o MTProxy para llegar a Telegram a través de ([abajo](#through-a-proxy)) | `TG_PROXY` |
| `readOtherBots` | `false` | solo un bot: si `tg bot` puede leer lo que otros bots en esta máquina guardan: `true`, o una lista de nombres de perfiles ([bots](./bot.md)) | ninguno; `--all-bots` y `--bots` preguntan, la configuración permite |
| `updateCheck` | `true` | la línea diaria "existe una versión más nueva"; sólo bajo `defaults` | ninguno; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` o `CI` apágalo |
| `skillHint` | `true` | una línea, como máximo una vez al día, para un agente cuya copia de la skill de tg falta o es anterior a tg; sólo bajo `defaults` | ninguno |
| `embeddingProvider` | `local` | modelo local o `openai` | `--provider` |
| `embeddingModel` | predeterminado del proveedor | modelo de incrustación | `--model` |
| `embeddingBaseUrl` | predeterminado del proveedor | incorporación de punto final API | `--base-url` |
| `embeddingDims` | modelo predeterminado | entero 1–65,536 | `--dims` |
| `analysisProvider` | `agent` | `agent`, `openai` o `anthropic` | `build --provider` |
| `analysisModel` | ninguno; requerido para `--analyze` | modelo de análisis | `build --model` |
| `analysisBaseUrl` | predeterminado del proveedor | punto final API de análisis | `build --base-url` |
| `models` | ninguno | modelos externos por finalidad ([abajo](#models-by-purpose)) | Variables `TG_MODELS_*` |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | `russian`, `english,spanish` | los idiomas de raíz de palabras para buscar en todal archivo local ([abajo](#search-languages)) | ninguno |

El archivo se escribe `0600` cuando se creó por primera vez y `0644` por `config set`. No guarda ningún secreto.

## Permisos de un perfil

`permissions` es un objeto: cada clave es una ruta de comando y cada valor es un nivel.

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.send": "allow" } } } }
```

| Nivel | Resultado |
|---|---|
| `deny` | no permite ni leer: rechaza con código de salida `5` antes de conectarse |
| `readonly` | permite leer; rechaza cambios con código de salida `5` |
| `ask` | pregunta y/N en la terminal; la respuesta predeterminada es no ([más abajo](#a-question-before-a-change)) |
| `allow` | ejecuta la operación sin preguntar |

**Una clave es una ruta de comando**: `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Comienza con un recurso: `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `search`. `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` o `metadata`, y debe nombrar un comando conocido o una escritura comprobada. `config set` rechaza las claves de comando desconocidas con el código de salida 2, incluidas las claves dentro de un objeto `permissions` completo. `config unset` puede eliminar una antigua clave desconocida. Al leer un archivo existente con uno, se advierte en stderr y continúa.

**La clave más específica que establezcas gana**: con el ejemplo anterior, se permite `messages.send` y se rechaza cualquier otro cambio en los mensajes. No hay comodín: `messages: readonly` no toca a `reactions`, `polls` o `chats`.

Las claves de distintas secciones del archivo se suman, pero **decide primero la sección más cercana y después la clave más larga**. Una clave definida en un perfil oculta esa misma clave y todas las que cuelgan de ella en `personal.defaults`, `bot.defaults` y `defaults`. Aquí el perfil `agent` no puede eliminar: su `messages` oculta `messages.delete` de `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Funciona en ambos sentidos: `messages: allow` en un perfil también oculta `messages.delete: deny` de `defaults`, y eliminar vuelve a pedir confirmación, como por defecto. Los antiguos `readOnly` y `allow` cuentan en la sección en la que están escritos.

`inbox`, `review`, `watch`, `serve` y `store fetch`, `export` y `search` muestran mensajes, por lo que cuentan como `messages`: `messages: deny` también los bloquea. `config`, `session`, `doctor`, `recipients`, `mcp` y el mantenimiento del archivo local nunca se restringen.

**Los valores predeterminados permiten todo excepto algunos cambios que son difíciles de revertir.** Estos preguntan: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete` y `account.sessions.end`. Es posible que las reglas de respuesta no se envíen hasta que usted lo permita: `replies.send` es `deny`. Un valor predeterminado incorporado solo endurece: `messages: readonly` aún rechaza una eliminación, y `messages: allow` mantiene la pregunta antes de una eliminación hasta que usted configure `messages.delete`.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Para rechazar cada cambio en Telegram desde un perfil (aquí el perfil `agent`), configure cada recurso:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

Los cambios que se guardan únicamente en esta computadora (`tasks`, `store` y `metadata`) tienen sus propias claves.

### Confirmación antes de cambiar algo

En el nivel `ask`, `tg` muestra qué cambiará y pregunta `go ahead? [y/N]`. Una respuesta distinta de `y` no hace nada y termina con el código de salida `130`. Una bandera te responde que sí: `--allow-dangerous` para una eliminación que no se puede deshacer (mensajes, un chat, su historial o un tema), la `--yes` global para cualquier otro cambio. Sin terminal, o bajo `--json` o `--jsonl`, nadie puede responder: el cambio se rechaza con el código de salida `7`, `confirmation_required`, y el error nombra la bandera.

### Sobre MCP

MCP no tiene formularios de confirmación del servidor. `deny` y `readonly` bloquean las escrituras; `ask` y `allow`
permiten la escritura solicitada. Repite `--permission key=level` para los permisos temporales del servidor
([configuración en el navegador](./remote.md)). La confirmación en la CLI con `ask` sigue aplicándose.

`replies.send` por defecto es `deny`; habilitar una regla de respuesta por sí sola no permite el envío. `tg replies audience` puede limitar las respuestas a personas seleccionadas o excluir algunas.

### Ajustes anteriores que siguen funcionando

`readOnly: true` equivale a `readonly` en todos los recursos. Una lista en `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) permite esas acciones con `allow` y deja las demás en `readonly`; las eliminaciones siguen pidiendo confirmación. Una clave de `permissions` de la misma sección tiene prioridad sobre ambos.

### Migrar la configuración de acceso heredada

`tg config migrate --dry-run --json` muestra una vista previa del reemplazo de `readOnly` y `allow` por `permissions`, manteniendo los niveles que proporcionó el archivo para perfiles personales y de bot. No escribe el archivo ni se conecta a Telegram. `tg config migrate --json` aplica esa migración; un proceso bloqueado en un perfil no puede aplicar un cambio que afecte a todos los perfiles. Se mantienen otras configuraciones. Un archivo que ya utiliza únicamente `permissions` no necesita migración. Una vez que `permissions` está presente, `config set` rechaza los cambios en `readOnly` y `allow`; cambie las claves de permiso correspondientes.

## Cambiar ajustes sin abrir el archivo

```sh
tg config set limit 50                        # this profile
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sendsPerHour 10 --defaults      # every profile
tg config set limit 30 --personal --defaults  # every personal account
tg shop config set sendsPerHour 200 --bot     # only the bot "shop"
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset sendsPerHour                  # back to the default
```

`config set` valida el valor con las mismas reglas que el lector, por lo que no genera un archivo que los siguientes comandos rechacen.

### Idiomas de búsqueda

`searchStemmers.cyrillic` (`russian` o `none`) y `searchStemmers.latin` (`english`, `spanish`, ambos separados por comas (el valor predeterminado) o `none`) se mantienen en el almacén local compartido, no en el archivo de configuración: un valor para cada perfil y para ambas CLI. Por lo tanto, `--defaults`, `--personal` y `--bot` no se aceptan con ellos, y un proceso bajo `TG_PROFILE_LOCK` no puede cambiarlos. `config unset` restaura el valor incorporado. Después de un cambio, reconstruya el índice de búsqueda ([mantenimiento del índice](./archive.md#repair-and-index-maintenance)).

## Los errores de escritura no se ignoran

Un ajuste desconocido en el archivo detiene todos los comandos con código de salida `3`:

```text
config.json is not a valid config:
  profiles.default.limt: unknown setting — the known ones are limit, timeoutMs, …
```

Si se ignorase un ajuste mal escrito, el programa usaría el valor predeterminado sin explicar por qué. Lo mismo se aplica a claves de `permissions` que no empiezan por un recurso.

## A través de un proxy

Donde Telegram está bloqueado, `tg` puede llegar a él a través de un proxy: SOCKS5, un proxy HTTP que admita `CONNECT` o un MTProxy. Un ajuste `proxy` por perfil, o para todos los perfiles con `--defaults`. Configúralo antes de `tg setup`: el inicio de sesión también pasa por él.

```sh
tg config set proxy socks5://proxy.example:1080       # no password: on the command line
tg config set proxy http://alice@proxy.example:3128   # a user without a password
tg config set proxy -                                 # with a password or an MTProxy secret
proxy URL, hidden as you type: tg://proxy?server=mt.example&port=443&secret=ee…
tg config unset proxy
```

| Forma | Tipo |
|---|---|
| `socks5://[user:password@]host[:port]` | SOCKS5; puerto 1080 si no se indica ninguno; `socks5h://` se interpreta igual |
| `http://[user:password@]host[:port]` | un proxy HTTP, mediante `CONNECT`; `https://` se conecta al propio proxy por TLS |
| `tg://proxy?server=…&port=…&secret=…` o `https://t.me/proxy?…` | un MTProxy, tal como lo comparte Telegram; funcionan los secretos FakeTLS (`ee…`) |
| `tg://socks?server=…&port=…&user=…&pass=…` | el enlace de Telegram para compartir un proxy SOCKS5 |

**Una contraseña o un secreto de MTProxy nunca llegan al archivo de configuración.** `config set proxy -` lee la URL sin mostrarla, o desde una tubería, guarda el secreto en el llavero del sistema (uno por perfil, y otro para `--defaults` que un perfil usa solo con el proxy de los valores predeterminados) y escribe la URL sin él; `config show`, `doctor` y los errores la muestran de la misma forma. Se rechaza una URL con un secreto en la línea de comandos, porque `ps` y el historial de la shell lo conservarían.

`TG_PROXY` acepta la URL completa, secreto incluido, y tiene prioridad sobre el ajuste: para CI o para una prueba puntual. `config show` muestra el ajuste del archivo; `tg doctor` muestra el proxy que se usa realmente. No se leen `ALL_PROXY` ni `HTTPS_PROXY`: suelen definirse para otras herramientas, y el proxy es algo que eliges para esta cuenta.

La Bot API (`tg bot …`) y el registro de la aplicación de `session start --app auto` pasan por el mismo proxy SOCKS5 o HTTP. Un MTProxy solo transporta el protocolo propio de Telegram, así que con uno se conectan directamente; `tg doctor` indica cuál. `--app browser` abre my.telegram.org en tu navegador, que usa su propia configuración de proxy.

## Variables de entorno

| Variables | Qué hace |
|---|---|
| `TG_PROFILE` | el perfil, cuando la primera palabra no nombra a nadie |
| `TG_PROFILE_LOCK` | fija el proceso a un perfil; cualquier otro es rechazado ([perfiles](./sessions.md#profiles)) |
| `TG_TIMEOUT` | lo mismo que `--timeout`: `500ms`, `30s` o `2m` para todo el comando |
| `TG_REQUESTS_PER_MINUTE` | igual que `requestsPerMinute`, y lo supera |
| `TG_API_ID`, `TG_API_HASH` | la aplicación, en lugar del llavero, para CI; ambos o ninguno |
| `TG_PROXY` | la URL del proxy, la contraseña o el secreto incluidos; gana sobre la configuración `proxy` ([arriba](#through-a-proxy)) |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | mueve los tres directorios y la entrada del llavero con ellos |
| `MESSAGING_STORE` | la ruta del archivo del archivo local |
| `CLI_COMMON_CACHE_DIR` | donde se guardan los modelos de habla |
| `TG_NO_UPDATE_CHECK` | `1` desactiva la línea diaria "Existe una versión más nueva" |
| `NO_COLOR` | sin color en la vista de tabla |
| `XDG_RUNTIME_DIR` | en Linux, cómo se llega al llavero; cron y ssh a menudo lo omiten |
| `TG_EMBEDDING_*`, `TG_ANALYSIS_*`, `TG_MODELS_*` | configuración del modelo ([abajo](#model-environment-variables)) |

## Configuración temporal independiente

Apunta los tres directorios a otra ubicación: `tg` tendrá allí una configuración, sesión y registros nuevos. No verá tu sesión habitual porque también cambia la entrada del llavero:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/wirecat.db
tg setup
```

Sin `MESSAGING_STORE`, lo que lea esa sesión seguirá guardándose en tu archivo local habitual.

## Tipos y ámbitos de todas las claves

“Perfil” incluye raíz `defaults`, `profiles.<name>`, `personal.defaults`, `personal.profiles.<name>`, `bot.defaults` y `bot.profiles.<name>` a menos que se restrinja a continuación. Las claves desconocidas y los tipos no válidos son errores. Los valores predeterminados y los efectos se enumeran [arriba](#the-file).

| Clave | Tipo/valor aceptado | Alcance |
|---|---|---|
| `defaultProfile` | cadena de nombre de perfil | raíz del archivo |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | entero ≥ 1 | perfil |
| `requestsPerMinute` | entero ≥ 0 | perfil |
| `color`, `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `record`, `readOnly` | booleano | perfil |
| `permissions` | objeto de rutas de comando y niveles `deny`, `readonly`, `ask`, `allow` | perfil |
| `allow` | variedad de acciones permitidas; formato heredado | perfil |
| `readOtherBots` | booleano o conjunto de nombres de perfil | solo bot |
| `updateCheck`, `skillHint` | booleano | raíz `defaults` solamente |
| `transcribeWith` | `auto`, `messenger`, `local` | perfil |
| `speechModel` | ID del modelo descargado como una cadena | perfil |
| `proxy` | URL de proxy compatible como una cadena | perfil |
| `embeddingProvider` | `local`, `openai` | perfil |
| `embeddingModel`, `analysisModel` | cadena no vacía, como máximo 200 caracteres | perfil |
| `embeddingBaseUrl`, `analysisBaseUrl` | URL HTTP(S) sin credenciales, consulta o fragmento | perfil |
| `embeddingDims` | entero 1–65,536 | perfil |
| `analysisProvider` | `agent`, `openai`, `anthropic` | perfil |
| `models` | objetos de propósito descritos a continuación | perfil |
| `searchStemmers.cyrillic` | `russian`, `none` | archivo compartido, a través de `config set` |
| `searchStemmers.latin` | `english`, `spanish`, ambos separados por comas, `none` | archivo compartido, a través de `config set` |

### Modelos por finalidad

`models.<purpose>` acepta solo `provider`, `model` y `baseUrl`. Los nombres de propósito empiezan
por una letra minúscula y contienen letras minúsculas, dígitos y guiones.
`default` proporciona campos comunes; `analysis` y `replies` los sobrescriben campo por campo.
Se pueden guardar otros nombres de propósito válidos por adelantado; esto no habilita un caso de uso inexistente.
La ausencia de proveedor o `off` desactiva las llamadas a modelos externos.

| Campo | Valor admitido | Predeterminado |
|---|---|---|
| `models.<purpose>.provider` | `off`, `openai`, `anthropic` | ausente; sin llamadas externas |
| `models.<purpose>.model` | cadena no vacía, como máximo 200 caracteres | ausente; un proveedor activado necesita un identificador de modelo explícito |
| `models.<purpose>.baseUrl` | URL HTTP(S) sin credenciales, consulta ni fragmento | endpoint del proveedor |

Para cada campo, el orden de prioridad es `TG_MODELS_<PURPOSE>_PROVIDER`, `_MODEL` o `_BASE_URL`,
después el campo de propósito configurado más cercano, los campos antiguos `analysis*` explícitos para `analysis`
y, por último, los campos de entorno y configuración de `models.default`. Los guiones del propósito
se convierten en guiones bajos en el nombre de su variable de entorno. Las credenciales no forman parte de este objeto.

Las configuraciones de incrustación y análisis son independientes y pueden diferir según el perfil. Los puntos finales deben ser HTTP/S sin credenciales, consultas o fragmentos integrados. Los embeddings remotos también reciben el texto de consulta de las búsquedas de MCP. Las claves se configuran con `models text key set openai|anthropic` y permanecen fuera de `config.json`. El `build` ordinario no inicia el análisis remoto: se requiere `--analyze` explícito.

### Variables de entorno de modelos

Los campos heredados aceptan `TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`, `TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL` y `TG_ANALYSIS_BASE_URL` antes de los valores de archivo; las opciones de comando los ganan. `TG_MODELS_DEFAULT_PROVIDER`, `TG_MODELS_DEFAULT_MODEL` y `TG_MODELS_DEFAULT_BASE_URL` proporcionan campos comunes en el nuevo formato; reemplace `DEFAULT` con un propósito, como `ANALYSIS`. Una variable vacía no anula una configuración. Los valores no válidos devuelven `configuration_error`.

## Siguiente paso

- [Seguridad](./security.md): qué protegen `permissions`, la lista de destinatarios y `sendsPerHour`
- [Diagnóstico](./diagnostics.md): qué mantiene el `record` y cuánto tiempo lo mantiene el `keepRunsForDays`
