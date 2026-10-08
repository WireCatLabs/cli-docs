---
title: "Referencia de configuración"
---

Todas las claves, sus valores predeterminados y ámbitos, y las variables de entorno. Empieza por la
[guía de configuración](./configuration.md) para los cambios habituales. La invocación, la salida y el comportamiento del agente
se describen en el [contrato de la CLI](./cli-contract.md). Las credenciales se guardan fuera
del archivo de ajustes.

Todos los ajustes, variables y prioridades. La configuración no admite secretos: no tiene campos para sesiones, hash de aplicación, teléfonos ni identificadores de chats.

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

No todos los ajustes tienen las cinco fuentes. La tabla siguiente indica cuáles existen.

## Consultar la configuración efectiva

```sh
tg config show
tg work config show
```

Muestra el perfil, de dónde procede su nombre, los perfiles definidos en el archivo, su ruta y si existe, y cada ajuste con su valor y **de dónde procede**: `flag`, una variable de entorno, `config file`, `config defaults` o `default`. `--json` devuelve lo mismo como objeto para scripts.

La lista termina con `commandTimeoutMs`: el límite de duración de todo el comando, indicado por `--timeout` o `TG_TIMEOUT`. No es un ajuste del archivo.

Si se define `TG_CONFIG_DIR`, `TG_STATE_DIR` o `TG_CACHE_DIR`, se avisa por stderr porque también cambia qué sesión se encuentra ([sesiones](./sessions.md#where-the-parts-are-kept)).

⚠ **No es una comprobación de funcionamiento.** Crea la configuración inicial si falta y después lee archivos. No abre el almacenamiento, no consulta el llavero ni
se conecta. Para comprobar si la sesión sigue funcionando, usa `tg doctor --online`
([troubleshooting.md](./troubleshooting.md#first-tg-doctor)).

La salida de ajustes efectivos incluye `commandTimeoutMs`, definido por `--timeout` o `TG_TIMEOUT`.
Limita todo el comando y no es una clave del archivo de configuración; `timeoutMs` limita una solicitud.

## El archivo

`config.json` está en el directorio de configuración (`~/.config/tg-cli/config.json` en Linux; consulta los demás sistemas en [instalación](./installation.md#where-files-go)).

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
  }
}
```

| Ajuste | Valor predeterminado | Qué hace | Se sustituye en una ejecución con |
|---|---|---|---|
| `embeddingProvider` | `local` | modelo local u `openai` | `--provider` |
| `embeddingModel` | el del proveedor | modelo de vectores semánticos | `--model` |
| `embeddingBaseUrl` | el del proveedor | dirección de la API de vectores semánticos | `--base-url` |
| `embeddingDims` | el del modelo | entero de 1 a 65 536 | `--dims` |
| `analysisProvider` | `agent` | `agent`, `openai` o `anthropic` | `build --provider` |
| `analysisModel` | ninguno; obligatorio para `--analyze` | modelo de análisis | `build --model` |
| `analysisBaseUrl` | el del proveedor | dirección de la API de análisis | `build --base-url` |
| `limit` | `20` | filas por página | `--limit` |
| `timeoutMs` | ninguno | tiempo máximo de **una** petición a Telegram en milisegundos. Un comando puede hacer varias; usa `--timeout` para limitar todo el comando | ninguna (`--timeout` es otra cosa) |
| `color` | según la terminal | colores en las tablas | ninguna; sin el ajuste, `NO_COLOR` los desactiva |
| `senderColors` | `false` | un color por remitente en las tablas de mensajes | ninguna |
| `searchCatchUp` | `false` | preparar el grafo del chat descargado o reparado y los vectores locales instalados dentro de límites explícitos; nunca descargar modelos ni llamar a proveedores remotos | `--catch-up`, `--no-catch-up` |
| `catchUpMarksRead` | `false` | `inbox` y `review` marcan como leído cada chat que muestran, hasta el mensaje más reciente mostrado. La otra persona lo ve | `--mark-read`, `--no-mark-read` |
| `searchCatchUp` | `false` | `store fetch` y `store gaps repair` también preparan el chat descargado para la búsqueda local: su grafo y, donde estén instalados, sus vectores | `--catch-up`, `--no-catch-up` |
| `record` | `false` | guardar todas las ejecuciones ([diagnóstico](./diagnostics.md)) | `--record`, `--no-record` |
| `keepRunsForDays` | `30` | los registros más antiguos se eliminan al guardar el siguiente | ninguna |
| `permissions` | todo permitido salvo el envío de las reglas de respuesta; pide confirmación para eliminar y cerrar otras sesiones | permisos del perfil por comando ([más abajo](#what-a-profile-may-do)) | ninguna; `--yes` y `--allow-dangerous` solo responden a `ask`, nunca levantan `deny` |
| `sendsPerHour` | `30` | máximo de envíos en cualquier intervalo de una hora ([seguridad](./security.md#the-send-guard)) | ninguna |
| `requestsPerMinute` | `60` | solicitudes por minuto después de una ráfaga de 20, compartidas por todos los procesos del perfil; `0` desactiva el límite ([limits.md](./limits.md)) | `TG_REQUESTS_PER_MINUTE` |
| `transcribeWith` | `auto` | quién transcribe la voz: `auto` (Telegram o un modelo local), `messenger` o `local` | `--local`, o `--model`, que lo implica |
| `speechModel` | ninguno | modelo descargado para `--local` (`tg models audio list`) | `--model` |
| `updateCheck` | `true` | aviso diario de nueva versión; solo en `defaults` | ninguna; `TG_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` o `CI` lo desactivan |
| `skillHint` | `true` | aviso, como máximo diario, para agentes cuya skill de tg falta o es anterior al comando; solo en `defaults` | ninguna |
| `readOtherBots` | `false` | solo perfiles de bot: si `tg bot` puede leer lo guardado por otros bots en este equipo; `true` o una lista de perfiles ([bots](./bot.md)) | ninguna; `--all-bots` y `--bots` lo solicitan, el ajuste lo permite |
| `proxy` | ninguno | el servidor SOCKS5, HTTP `CONNECT` o MTProxy a través del cual se llega a Telegram ([más abajo](#through-a-proxy)) | `TG_PROXY` |
| `searchStemmers.cyrillic`, `searchStemmers.latin` | `russian`, `spanish` | los idiomas de raíces de palabras de todo el almacén, para ambos CLI y todos los perfiles: `russian` o `none`; `spanish`, `english` o `none` ([archivo local](./archive.md#repair-and-index-maintenance)) | ninguna |

`defaultProfile`, en el nivel superior, indica el perfil utilizado cuando ni la primera palabra ni `TG_PROFILE` especifican uno. La primera palabra (`tg work …`) y `TG_PROFILE` tienen prioridad sobre él.

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

**Cada clave es una ruta de comando:** `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Debe comenzar por un recurso (`messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `conversations`, `tags`, `searches`, `replies`, `attachments` o `bot`) y nombrar un comando conocido o una escritura comprobada. `config set` rechaza las claves de comandos desconocidos con código 2, también dentro de un objeto `permissions` completo. `config unset` puede eliminar una clave desconocida antigua. Al leer un archivo existente que contenga una, se avisa por stderr y se continúa. **La clave más específica tiene prioridad:** en el ejemplo anterior se permite `messages.send` y se rechazan los demás cambios de mensajes. No hay comodines: `messages: readonly` no afecta a `reactions`, `polls` ni `chats`.

Las claves de distintas secciones del archivo se suman, pero **decide primero la sección más cercana y después la clave más larga**. Una clave definida en un perfil oculta esa misma clave y todas las que cuelgan de ella en `personal.defaults`, `bot.defaults` y `defaults`. Aquí el perfil `agent` no puede eliminar: su `messages` oculta `messages.delete` de `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Funciona en ambos sentidos: `messages: allow` en un perfil también oculta `messages.delete: deny` de `defaults`, y eliminar vuelve a pedir confirmación, como por defecto. Los antiguos `readOnly` y `allow` cuentan en la sección en la que están escritos.

`inbox`, `review`, `watch`, `serve` y `store fetch`, `export` y `search` muestran mensajes, por lo que cuentan como `messages`: `messages: deny` también los bloquea. `config`, `session`, `doctor`, `recipients`, `mcp` y el mantenimiento del archivo local nunca se restringen.

**Por defecto se permite todo salvo dos acciones irreversibles:** `messages.delete` y `account.sessions.end` tienen nivel `ask`. Las reglas de respuesta no pueden enviar hasta que lo permitas: `replies.send` es `deny`. Un valor predeterminado solo puede hacer más estricta la regla: `messages: readonly` sigue rechazando eliminaciones y `messages: allow` conserva la confirmación hasta que configures `messages.delete` expresamente.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Para hacer un perfil de solo lectura —aquí, `agent`— configura cada recurso:

```sh
for key in messages reactions polls topics chats contacts account conversations tags searches replies attachments bot; do
  tg agent config set permissions.$key readonly
done
```

### Confirmación antes de cambiar algo

Con `ask`, `tg` muestra el cambio y pregunta `go ahead? [y/N]`. Cualquier respuesta distinta de `y` no cambia nada y finaliza con código `130`. Puedes aprobar mediante una opción: `--allow-dangerous` para eliminar y `--yes` para cualquier otro cambio. Sin terminal, o con `--json` o `--jsonl`, nadie puede responder: se rechaza con código `7`, `confirmation_required`, y el error indica la opción necesaria.

### Ajustes anteriores que siguen funcionando

`readOnly: true` equivale a `readonly` en todos los recursos. Una lista en `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) permite esas acciones con `allow` y deja las demás en `readonly`; las eliminaciones siguen pidiendo confirmación. Una clave de `permissions` de la misma sección tiene prioridad sobre ambos.

## Cambiar ajustes sin abrir el archivo

```sh
tg config set limit 50                        # this profile
tg work config set permissions.contacts readonly   # profile "work"; one key at a time
tg config set sendsPerHour 10 --defaults      # every profile
tg config set updateCheck false --defaults    # a setting that exists only under defaults
tg config unset sendsPerHour                  # back to the default
```

`config set` valida el valor con las mismas reglas que el lector, por lo que no genera un archivo que los siguientes comandos rechacen.

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

**Una contraseña o un secreto de MTProxy nunca llegan al archivo de configuración.** `config set proxy -` lee la URL sin mostrarla, o desde una tubería, guarda el secreto en el almacén de claves del sistema (uno por perfil, y otro para `--defaults` que un perfil usa solo con el proxy de los valores predeterminados) y escribe la URL sin él; `config show`, `doctor` y los errores la muestran de la misma forma. Se rechaza una URL con un secreto en la línea de comandos, porque `ps` y el historial de la shell lo conservarían.

`TG_PROXY` acepta la URL completa, secreto incluido, y tiene prioridad sobre el ajuste: para CI o para una prueba puntual. `config show` muestra el ajuste del archivo; `tg doctor` muestra el proxy que se usa realmente. No se leen `ALL_PROXY` ni `HTTPS_PROXY`: suelen definirse para otras herramientas, y el proxy es algo que eliges para esta cuenta.

La Bot API (`tg bot …`) y el registro de la aplicación de `session start --app auto` pasan por el mismo proxy SOCKS5 o HTTP. Un MTProxy solo transporta el protocolo propio de Telegram, así que con uno se conectan directamente; `tg doctor` indica cuál. `--app browser` abre my.telegram.org en tu navegador, que usa su propia configuración de proxy.

## Variables de entorno

| Variable | Qué hace |
|---|---|
| `TG_PROFILE` | elige el perfil si la primera palabra no especifica uno |
| `TG_PROFILE_LOCK` | limita el proceso a un perfil; rechaza cualquier otro ([sesiones](./sessions.md#profiles)) |
| `TG_TIMEOUT` | igual que `--timeout`: `500ms`, `30s` o `2m` para todo el comando |
| `TG_API_ID`, `TG_API_HASH` | aplicación en lugar del almacén de claves, para CI; define ambas o ninguna |
| `TG_PROXY` | la URL del proxy, con contraseña o secreto incluidos; tiene prioridad sobre el ajuste `proxy` ([más arriba](#through-a-proxy)) |
| `TG_CONFIG_DIR`, `TG_STATE_DIR`, `TG_CACHE_DIR` | cambian los tres directorios y la entrada del almacén de claves |
| `MESSAGING_STORE` | ruta del archivo de la base de datos local |
| `CLI_COMMON_CACHE_DIR` | ubicación de los modelos de voz |
| `TG_NO_UPDATE_CHECK` | `1` desactiva el aviso diario de nueva versión |
| `NO_COLOR` | desactiva colores en las tablas |
| `XDG_RUNTIME_DIR` | acceso al almacén de claves en Linux; cron y ssh suelen omitirla |

## Configuración temporal independiente

Apunta los tres directorios a otra ubicación: `tg` tendrá allí una configuración, sesión y registros nuevos. No verá tu sesión habitual porque también cambia la entrada del almacén de claves:

```sh
export TG_CONFIG_DIR=/tmp/tg-try/config TG_STATE_DIR=/tmp/tg-try/state TG_CACHE_DIR=/tmp/tg-try/cache
export MESSAGING_STORE=/tmp/tg-try/messages.db
tg setup
```

Sin `MESSAGING_STORE`, lo que lea esa sesión seguirá guardándose en tu archivo local habitual.

## Siguiente paso

- [Seguridad](./security.md): protección mediante `permissions`, destinatarios permitidos y `sendsPerHour`.
- [Diagnóstico](./diagnostics.md): `record` y `keepRunsForDays`.

## Migrar los ajustes de acceso antiguos

`tg config migrate --dry-run --json` muestra la sustitución de `readOnly` y `allow` por
`permissions` canónicos, conservando los niveles efectivos del archivo para perfiles personales y bots.
No escribe el archivo ni se conecta a Telegram. `tg config migrate --json` aplica la migración
explícitamente; un proceso limitado a un perfil no puede aplicar un cambio que afecte a todos los perfiles.
Los demás ajustes se conservan. Los archivos canónicos no necesitan migración. Cuando ya existe
`permissions`, `config set` rechaza cambios en los antiguos `readOnly` y `allow`; cambia las claves de permisos correspondientes.

MCP no tiene formularios de confirmación del servidor. `deny` y `readonly` bloquean las escrituras; `ask` y `allow`
permiten la escritura solicitada. Repite `--permission key=level` para los permisos temporales del servidor
([configuración en el navegador](./remote.md)). La confirmación en la CLI con `ask` sigue aplicándose.

`replies.send` es `deny` por defecto; activar una regla no basta para permitir el envío. La lista de probadores es un requisito aparte.

Los ajustes de vectores semánticos y de análisis son independientes y pueden variar por perfil. Las variables de entorno `TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`, `TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`, `TG_ANALYSIS_PROVIDER`, `TG_ANALYSIS_MODEL` y `TG_ANALYSIS_BASE_URL` tienen prioridad sobre la configuración; las opciones del comando tienen prioridad sobre los ajustes resueltos. Las direcciones deben ser HTTP/S, sin credenciales incrustadas, consulta ni fragmento. Los vectores semánticos remotos también envían el texto de las consultas de búsqueda de MCP. Las claves se configuran con `models text key set openai|anthropic` y quedan fuera de `config.json`. Un `build` normal no inicia el análisis remoto: se requiere `--analyze` explícitamente.

## Tipos y ámbitos de todas las claves

«Perfil» incluye `defaults` en la raíz, `profiles.<name>`, `personal.defaults`,
`personal.profiles.<name>`, `bot.defaults` y `bot.profiles.<name>`, salvo las restricciones indicadas abajo.
Las claves desconocidas y los tipos inválidos son errores. Los valores predeterminados y los efectos se enumeran arriba.

| Clave | Tipo/valor aceptado | Ámbito |
|---|---|---|
| `defaultProfile` | cadena con el nombre del perfil | raíz del archivo |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | entero ≥ 1 | perfil |
| `color`, `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `record`, `readOnly` | booleano | perfil |
| `permissions` | objeto con rutas de comandos y niveles `deny`, `readonly`, `ask`, `allow` | perfil |
| `allow` | lista de acciones permitidas; formato antiguo | perfil |
| `readOtherBots` | booleano o lista de nombres de perfiles | solo bot |
| `updateCheck`, `skillHint` | booleano | solo `defaults` en la raíz |
| `transcribeWith` | `auto`, `messenger`, `local` | perfil |
| `speechModel` | identificador del modelo descargado como cadena | perfil |
| `proxy` | URL de proxy admitida como cadena | perfil |
| `embeddingProvider` | `local`, `openai` | perfil |
| `embeddingModel`, `analysisModel` | cadena no vacía, como máximo 200 caracteres | perfil |
| `embeddingBaseUrl`, `analysisBaseUrl` | URL HTTP(S) sin credenciales, consulta ni fragmento | perfil |
| `embeddingDims` | entero 1–65,536 | perfil |
| `analysisProvider` | `agent`, `openai`, `anthropic` | perfil |
| `models` | objetos por propósito descritos abajo | perfil |
| `searchStemmers.cyrillic` | `russian`, `none` | almacenamiento compartido, mediante `config set` |
| `searchStemmers.latin` | `spanish`, `english`, `none` | almacenamiento compartido, mediante `config set` |

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

### Variables de entorno de modelos

Los campos antiguos aceptan `TG_EMBEDDING_PROVIDER`, `TG_EMBEDDING_MODEL`,
`TG_EMBEDDING_BASE_URL`, `TG_EMBEDDING_DIMS`, `TG_ANALYSIS_PROVIDER`,
`TG_ANALYSIS_MODEL` y `TG_ANALYSIS_BASE_URL` antes de los valores del archivo.
`TG_MODELS_DEFAULT_PROVIDER`, `TG_MODELS_DEFAULT_MODEL` y `TG_MODELS_DEFAULT_BASE_URL`
proporcionan campos comunes en el formato nuevo; sustituye `DEFAULT` por un propósito, como `ANALYSIS`.
Una variable vacía no sobrescribe un ajuste. Los valores inválidos devuelven configuration_error.
