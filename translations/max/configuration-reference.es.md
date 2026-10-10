---
title: "Referencia de configuración"
---

<a id="prioridad-de-los-ajustes" />
<a id="comprobar-el-resultado" />
<a id="порядок-в-котором-решается-настройка" />
<a id="посмотреть-что-получилось" />

Esta página es necesaria cuando necesita el nombre exacto, el tipo, el valor predeterminado o el alcance de una configuración, o el nombre de una variable de entorno. Esto enumera todas las configuraciones que lee `max`, todas las formas de anularlas y qué valor gana. Para cambios regulares y un archivo de ejemplo, comience con [guía de configuración](./configuration.md). El comportamiento de los comandos, códigos de salida y retorno se describe en [contrato CLI](./cli-contract.md).

Palabras que aparecen en la página:

- **Sección** — parte del archivo de configuración. `defaults` es válido para todos los perfiles, `profiles.<имя>` - para un perfil, `personal.*` - sólo para comandos de cuenta personal, `bot.*` - sólo para comandos de bot.
- **Alcance**: secciones donde la configuración es válida. Configurar fuera de su alcance es un error.
- **Fuente**: de dónde proviene el valor actual: parámetro, variable de entorno, sección de archivo o valor integrado.

Los ajustes no deben contener secretos: el archivo no tiene campos para tokens, números de teléfono ni identificadores de chat.

Un breve ejemplo de archivo y uno completo, con todos los apartados y una explicación de cada parte, lo puedes encontrar en [guía de configuración](./configuration.md#пример-файла-настроек).

## Qué valor tiene prioridad

**Opción → variable de entorno → archivo → valor integrado.** El mismo orden se aplica en todo el programa, sin que cada comando lo decida por separado.

Dentro del archivo prevalece la **entrada más específica**. Para un comando de cuenta personal en el perfil `work`: `personal.profiles.work` → `profiles.work` → `personal.defaults` → `defaults`. Para `max work bot …`, es lo mismo con `bot` en vez de `personal`. El perfil tiene prioridad sobre la sección: la entrada de una cuenta prevalece sobre la de todas.

```sh
max chats list --limit 5          # флаг: 5
MAX_PROFILE=personal max chats list   # переменная выбирает профиль
# "limit": 50 у профиля в файле — когда флага нет
# "limit": 30 в "defaults" — когда и у профиля нет
# 20 — когда нет ничего
```

No todas las configuraciones tienen todos los métodos. [La tabla de configuración](#файл) le indica cuáles hay.

Dos excepciones son superiores a este orden:

- **`MAX_TOKEN` prevalece sobre el llavero**, para CI.
- **`MAX_CONFIG_DIR` y `MAX_STATE_DIR` cambian configuración y acceso de `max`**, incluida la entrada del llavero correspondiente al perfil.

## Ajustes efectivos

```sh
max config show            # профиль, какие профили есть, файл и каждая настройка
max work config show       # то же для профиля work
max shop config show --bot # то же для команд бота shop
max config show --json     # то же одним объектом
```

El comando imprime el perfil seleccionado **y de dónde vino**, la ruta al archivo de configuración y si existe, los perfiles y valores efectivos de todas las configuraciones con el origen de cada uno.

Cada ajuste indica su origen: `flag`, `default` o `config file:` con la clave, como `config file: bot.profiles.test`. El perfil muestra `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK`, `config file: defaultProfile` o `default`.

Con `--json`, la respuesta también incluye `storeSettings`: los ajustes del archivo compartido (`searchStemmers.*`) y su origen, `store` o `default`.

`--bot` muestra las configuraciones tal como las recibirá `max <имя> bot …`: el bot tiene su propia sección y su propio límite de envío. Si el archivo no existe, al cargar la configuración primero se crea uno con los valores predeterminados habituales. El archivo existente no se sobrescribe. Si se configura una de las variables `MAX_*_DIR`, el comando lo dirá en stderr: con ellas, el perfil tiene una entrada diferente en el llavero, y un inicio de sesión realizado sin ellas parece "sin sesión".

⚠ **Incluye todos los perfiles locales:** configurados, cuentas personales con sesión y bots; cada uno marcado como personal, bot o ambos.

⚠ **Esto no es una verificación de estado.** El comando lee archivos: no abre el caché, no toca el llavero y no contacta a MAX. `max doctor` comprueba si la sesión está activa ([el primer paso en caso de problemas](./troubleshooting.md)).

No aparecen secretos: el archivo no dispone de campos para guardarlos.

## Archivo

`~/.config/max-cli/config.json` en Linux; rutas en otros sistemas - en [guía de configuración](./configuration.md#где-лежит-файл). El primer comando para leer la configuración lo crea con `limit`, `keepRunsForDays`, `sendsPerHour`, `updateCheck` y `skillHint` en `defaults`. El archivo se crea con derechos `0600` y `max config set` lo escribe con derechos `0644`: no contiene secretos.

```json
{
  "defaultProfile": "personal",
  "defaults": { "keepRunsForDays": 14 },
  "profiles": {
    "personal": { "limit": 50, "timeoutMs": 20000, "color": true },
    "work": { "limit": 10 }
  },
  "personal": {
    "defaults": { "sendsPerHour": 30 }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": { "shop": { "sendsPerHour": 200 } }
  }
}
```

- `defaults`: todos los perfiles, personales y bots.
- `profiles.<имя>`: un perfil, cualquiera que sea su función.
- `personal.defaults`, `personal.profiles.<имя>`: cuentas personales.
- `bot.defaults`, `bot.profiles.<имя>`: comandos `max <имя> bot …`.

|Campo|¿Qué hace?|Qué se superpone para un ejecución|Por defecto|
|---|---|---|---|
| `defaultProfile` |¿Qué perfil si la primera palabra no es nada y no se especifica `MAX_PROFILE`?|primera palabra (`max work …`), `MAX_PROFILE`| `default` |
| `limit` |¿Cuántos registros mostrar cuando no se transmite `--limit`?| `--limit` | `20` |
| `timeoutMs` |cuánto tiempo esperar para recibir una respuesta a **una solicitud**|— (`--timeout` — otro, ver más abajo)|tomado del transporte|
| `color` |color en terminal; sin un campo se decide en función de si es una terminal|—; sin color de campo se apaga `NO_COLOR`|por terminal|
| `senderColors` |en `max messages` cada autor tiene su propio color; `вы` - siempre azul. Sin `color` no funciona. Solo para cuenta personal| — | `false` |
| `catchUpMarksRead` |`max inbox` y `max review` marcan cada chat mostrado como leído, hasta el último mensaje mostrado. El interlocutor ve la marca. Solo para cuenta personal| `--mark-read`, `--no-mark-read` | `false` |
| `searchCatchUp` |después de `store fetch` o reparación de roturas, prepara el gráfico y establece los vectores locales de este chat dentro de límites especificados. Los modelos no se descargan, no se llama a proveedores remotos. Solo para cuenta personal| `--catch-up`, `--no-catch-up` | `false` |
| `record` |si se debe registrar cada inicio como si se transfiriera `--record` ([diagnóstico](./diagnostics.md))| `--record`, `--no-record` | `false` |
| `keepRunsForDays` |¿Cuántos días se almacenan los registros de ejecución?| — | `30` |
| `permissions` |niveles de derechos para recursos y comandos: `deny`, `readonly`, `ask`, `allow`; la clave más precisa tiene prioridad ([abajo](#права-доступа))|—; `--yes` y `--allow-dangerous` solo responden a `ask`, `deny` no eliminan|todo `allow`, excepto: eliminación, terminación de otras sesiones y algunos cambios irreversibles más - `ask`; respuestas automáticas `replies.send` – `deny`|
| `sendsPerHour` |cuántos mensajes puede enviar un perfil en una hora, junto con reenvíos, ediciones, pines con notificaciones, mensajes eliminados, personas agregadas a grupos y solicitudes aceptadas de membresía; over - falla con código `8`. **El límite de bot** se establece solo en la sección `bot`; sin él el bot no está limitado ([enviar protección](./security.md#защита-от-отправки-не-туда))| — |`30`, el bot no lo tiene|
| `requestsPerMinute` |cuántas solicitudes por minuto realiza el perfil a MAX, después de las primeras 10 seguidas, juntas en todos los procesos de este perfil; `0` - sin limitación ([límites y esperas](./limits.md))| `MAX_REQUESTS_PER_MINUTE` | `20` |
| `serve` |¿Debo ejecutar `max serve` en segundo plano cuando el comando necesita MAX y no hay servidor? El servidor no comienza con `MAX_TOKEN`. Solo para cuenta personal| `--serve`, `--no-serve` | `true` |
| `transcribeModel` |qué modelo `max messages transcribe` reconoce el habla. **Solo en `defaults`**|`--model` en `messages transcribe` y al lado de `--transcribe`| `gigaam-v3` |
| `readOtherBots` |¿Puede el bot leer copias de otros bots cuando el comando lo solicita? `--all-bots` o `--bots`: `false`, `true`: todos o una lista de perfiles de bot. **Solo en la sección `bot`** ([bots](./bot.md))|—; `--all-bots` y `--bots` preguntan, el campo permite| `false` |
| `updateCheck` |Una vez al día pregunte a npm si hay una nueva versión e infórmelo en la terminal. **Solo en `defaults`**: la versión del programa es la misma para todos los perfiles|—; apagar `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI`| `true` |
| `skillHint` |una vez al día decirle al agente en stderr que no tiene la habilidad `max` o que es anterior al programa y que está asignada por `max skill install`. Reconocemos al agente por la variable `AI_AGENT` o `CLAUDECODE`. **Solo en `defaults`**| — | `true` |
| `readOnly`, `allow`, `mcpTools` |configuraciones antiguas, lea para comprobar la compatibilidad; `config migrate` los convierte a `permissions`| — |no se pueden cambiar después de la migración|
| `embeddingProvider` |modelo local (`local`) o `openai`| `--provider` | `local` |
| `embeddingModel` |modelo vectorial| `--model` |por servicio|
| `embeddingBaseUrl` |Dirección API de vectores| `--base-url` |por servicio|
| `embeddingDims` |tamaño del vector, número entero 1–65 536| `--dims` |por modelo|
| `analysisProvider` |agente (`agent`), `openai` o `anthropic`| `build --provider` | `agent` |
| `analysisModel` |modelo de análisis| `build --model` |No; para `--analyze` configurado explícitamente|
| `analysisBaseUrl` |dirección API de análisis| `build --base-url` |por servicio|
| `models` |modelos externos por propósito ([abajo](#модели-по-назначению))|variables `MAX_MODELS_*`|No|
| `searchStemmers.cyrillic`, `searchStemmers.latin` |Lenguajes de raíces de palabras para buscar en todo el archivo general ([abajo](#языки-поиска))| — | `russian`, `english,spanish` |

⚠ **`timeoutMs` y `--timeout` son distintos.** `timeoutMs` limita la espera de **una respuesta** de MAX. `--timeout` limita **todo el comando**. Una lectura incluye conexión, INIT, LOGIN, resolución del nombre del chat y la propia petición, por lo que su duración puede ser varias veces `timeoutMs`.

Los formatos difieren deliberadamente: `timeoutMs` es un número de milisegundos en el archivo; `--timeout` exige una unidad (`30s`, `2m`, `500ms`). `--timeout 30` se rechaza para evitar confundir segundos y milisegundos, con errores de hasta treinta veces.

No hay campo para `--timeout`: el presupuesto corresponde a una ejecución, no a una preferencia duradera.

**`--page` y `--all` no tienen campos de configuración.** Guardar una página sirve una vez y molesta después. Tampoco `--order` de `max contacts list` tiene un duplicado `contactOrder`. `--limit` sí, porque es una preferencia estable.

## Permisos de acceso

`permissions` es un objeto: cada tecla es una ruta de comando, cada valor es un nivel.

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.delete": "allow" } } } }
```

| Nivel | Qué ocurre |
|---|---|
| `deny` | Nada, ni siquiera lectura: código `5` antes de conectar |
| `readonly` | Permite leer; los cambios fallan con código `5` |
| `ask` | Pide confirmación en el terminal, con «no» por defecto ([más abajo](#вопрос-перед-изменением)) |
| `allow` | Ejecuta la acción sin preguntar |

**La clave es la ruta del comando**: `messages`, `messages.delete`, `messages.send`, `reactions`, `chats.members`, `contacts`, `account.sessions.end`. Comienza con el recurso: `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` o `metadata`. Las claves del bot comienzan con `bot`, por ejemplo `bot.messages.send`. `config set` rechaza una clave de comando desconocida, incluso dentro de un objeto `permissions` completo, con el código 2. `config unset` le permite eliminar una clave desconocida antigua. La lectura de un archivo existente con dicha clave advierte en stderr y continúa funcionando.

**Una clave más específica anula el recurso.** El ejemplo anterior permite leer y eliminar mensajes sin confirmación y desactiva otras escrituras en mensajes. Los contactos, chats, reacciones y otros recursos no se limitan a este ejemplo. `config show` muestra los derechos actuales y su fuente.

Los permisos de distintas secciones se combinan, pero **primero cuenta la sección más cercana y después la longitud de la clave**. Una clave del perfil sustituye esa clave y todas sus descendientes en `personal.defaults`, `bot.defaults` y `defaults`. El perfil `agent` del ejemplo no elimina mensajes: su `messages` sustituye `messages.delete` de `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Funciona en ambos sentidos: `messages: allow` en el perfil también anula `messages.delete: deny` de `defaults`, y entonces eliminar vuelve a preguntar, como por defecto. Los antiguos `readOnly` y `allow` se aplican en la sección donde están escritos.

**De forma predeterminada, todo está permitido excepto algunos cambios que son difíciles de deshacer.** Preguntado por: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete` y `account.sessions.end`. Las respuestas automáticas no se envían hasta que usted permita: `replies.send` - `deny`.

```sh
max config set permissions.messages.delete allow     # удалять без вопроса
max config set permissions.messages.send ask         # спрашивать перед каждой отправкой
max config unset permissions.messages.delete         # вернуть значение по умолчанию
```

### Pregunta antes del cambio

Con `ask`, el terminal pide confirmación con «no» por defecto. `--allow-dangerous` responde para eliminaciones irreversibles de mensajes, chats, historial o temas; `--yes`, para los demás cambios. En modo JSON no hay pregunta interactiva: se requiere una de estas opciones.

### A través de MCP

MCP no muestra formularios de confirmación: `ask` permite la escritura invocada; `deny` y `readonly` siguen bloqueándola. `--permission ключ=уровень` modifica temporalmente los permisos del proceso. Las antiguas opciones de confirmación ya no determinan el acceso. En la CLI, `ask` sigue requiriendo una respuesta o una opción explícita. Consulta la conexión en la [guía MCP](./mcp.md).

### Configuraciones antiguas que aún funcionan

`readOnly: true` se lee como `readonly` para cada recurso. La lista en `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) dice `allow` para estas acciones y `readonly` para el resto; todavía pide eliminación. La clave en `permissions` de la misma partición es más importante que ambas. `mcpTools` es legible, pero el acceso ya no cambia.

### Traducción de configuraciones antiguas

Puedes ver los cambios antes de convertir un archivo antiguo:

```sh
max config migrate --dry-run
max config migrate
```

La migración conserva los permisos efectivos, los ajustes MAX y los puntos de moderación. Los niveles antiguos `forbid/flag/confirm` pasan a `deny/ask/ask`. `--dry-run` no escribe. Una vez existe `permissions`, cambiar `readOnly`, `allow` o `mcpTools` se rechaza indicando el nuevo ajuste. `MAX_PROFILE_LOCK` impide migrar el archivo completo; permite la vista previa.

## Cambiar sin abrir el archivo

```sh
max config set limit 50                 # профилю по умолчанию
max work config set record true         # профилю work
max config set keepRunsForDays 7 --defaults   # всем профилям сразу
max work config unset limit             # убрать; снова решает defaults или встроенное
max agent config set permissions.messages readonly  # чтение сообщений без записи
max shop config set --bot sendsPerHour 200    # только боту shop
max config set --personal --defaults limit 30 # всем личным аккаунтам
max config set defaultProfile work      # какой профиль без первого слова
```

Los valores se comprueban con el mismo esquema usado para leer, **antes de escribir**: `max config set limit 0` se rechaza y el archivo queda igual. `serve`, `senderColors`, `catchUpMarksRead`, `searchCatchUp` y `mcpTools` no se admiten con `--bot`: los bots no tienen servidor, colores de autores ni estado de no leído, y el antiguo `mcpTools` solo se aplica a cuentas personales.

### Idiomas de búsqueda

`searchStemmers.cyrillic` (`russian` o `none`) y `searchStemmers.latin` (`english`, `spanish`, ambos separados por comas (este es el valor predeterminado) o `none`) no se almacenan en el archivo de configuración, sino en el archivo general de mensajes: son los mismos para todos los perfiles y para ambos servicios de mensajería. Por lo tanto, `--defaults`, `--personal` y `--bot` no se aceptan con ellos y no se pueden cambiar en `MAX_PROFILE_LOCK`. `config unset` devuelve el valor incorporado. Después del cambio, realice `max store reindex`; consulte [mantenimiento de archivos](./archive.md#обслуживание-архива).

## Las erratas son errores

Un campo desconocido se rechaza con su nombre y `configuration_error`, código `3`:

```json
{"error":{"code":"configuration_error","message":"/home/you/.config/max-cli/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, senderColors, serve, mcpTools"}}
```

Un tipo incorrecto identifica el campo y lo admitido: `profiles.default.limit: has to be a
whole number, 1 or more, not "20"`.

Ignorar campos desconocidos ocultaría erratas y haría perder tiempo buscando por qué no funciona un ajuste.

Un archivo inexistente no es un error: simplemente no has configurado la aplicación.

## Variables de entorno

|Variable|¿Qué hace?|
|---|---|
| `MAX_PROFILE` |perfil para toda la sesión de shell; igual que la primera palabra|
| `MAX_PROFILE_LOCK` |bloquea el proceso en un perfil: otro perfil - con la primera palabra o mediante `MAX_PROFILE` - y `config set --defaults` son rechazados. Se conserva solo donde el agente no puede cambiar el entorno en sí: en la configuración del cliente MCP o en el script contenedor. Un agente con acceso de shell eliminará la variable misma|
| `MAX_TIMEOUT` |restricción en todo el comando, para toda la sesión de shell; igual que `--timeout`|
| `MAX_REQUESTS_PER_MINUTE` |Igual que `requestsPerMinute` y más fuerte que el archivo.|
| `MAX_TOKEN` |token directamente, sin pasar por el llavero, para CI y ejecucións únicos|
| `MAX_BOT_TOKEN` |token de bot para `max bot`, sin pasar por el llavero|
| `MAX_CONFIG_DIR` |donde están `config.json` y, en ausencia de un llavero, un archivo con un token|
| `MAX_STATE_DIR` |donde estan el estado de los perfiles y el catalogo `runs/`|
| `MAX_CACHE_DIR` |sólo el caché antiguo: `max doctor` buscal archivo restante allí. Por compatibilidad, aún cambia la entrada en el llavero; para una copia compartida utilice `MESSAGING_STORE`|
| `MESSAGING_STORE` |archivo para archivo local compartida de chats, mensajes y transcripciones|
| `NO_COLOR` |apaga el color, como en cualquier otro programa|
| `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` |no preguntes a npm sobre una nueva versión; `CI` funciona de la misma manera|
| `MAX_EMBEDDING_*`, `MAX_ANALYSIS_*`, `MAX_MODELS_*` |configuración del modelo ([abajo](#переменные-для-настроек-моделей))|

Una cadena vacía equivale a no definida: `MAX_PROFILE=` es como no establecer `MAX_PROFILE`.

**No hay ninguna variable para `--json` o para el color, y esto es intencional.** Si se olvida en el shell, cambiaría la salida de un comando que no lo solicitó, y encontrarlo más tarde es más difícil que escribir una bandera.

## Configuración temporal separada

Las variables de directorios separan configuración y estado de acceso para pruebas u otra cuenta. No afectan al almacén compartido con `tg`: su archivo se elige mediante `MESSAGING_STORE`. Los modelos de voz siguen compartidos.

```sh
export MAX_CONFIG_DIR=/tmp/max-try/config
export MAX_STATE_DIR=/tmp/max-try/state
export MESSAGING_STORE=/tmp/max-try/messages.db

max setup            # этот токен не виден обычной установке
max chats list
```

> ⚠ Y viceversa: **la instalación normal no ve esta sesión**. Si las variables se configuran en una ventana de terminal y no se configuran en otra, la segunda ventana dirá "sin sesión" cuando el token esté activo.

## Tipos y ámbitos de las claves

El área de "perfil" incluye `defaults`, `profiles.<имя>`, `personal.defaults`, `personal.profiles.<имя>`, `bot.defaults` y `bot.profiles.<имя>`, a menos que una cadena la limite. Se rechazan las claves desconocidas y los valores del tipo incorrecto. Los valores predeterminados se dan [arriba](#файл).

|Llave|Tipo o valor válido|Región|
|---|---|---|
| `defaultProfile` |línea con nombre de perfil|raíz del archivo|
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` |entero ≥ 1|perfil|
| `requestsPerMinute` |entero ≥ 0|perfil|
| `color`, `record`, `readOnly` | boolean |perfil|
| `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `serve` | boolean |cuenta personal|
| `permissions` |objeto de rutas y niveles de comando `deny`, `readonly`, `ask`, `allow`|perfil|
| `allow` |variedad de acciones permitidas; formato antiguo|perfil|
| `mcpTools` |matriz `contacts`, `polls`, `groups`, `profile`; formato antiguo|cuenta personal|
| `readOtherBots` |booleano o conjunto de nombres de perfil|sólo `bot`|
| `updateCheck`, `skillHint` | boolean |solo `defaults`|
| `transcribeModel` |ID de cadena de `max models audio list`|solo `defaults`|
| `embeddingProvider` |`local` o `openai`|perfil|
| `embeddingModel`, `analysisModel` |cadena no vacía, no más de 200 caracteres|perfil|
| `embeddingBaseUrl`, `analysisBaseUrl` |URL HTTP(S) sin credenciales, consulta y fragmento|perfil|
| `embeddingDims` |entero 1–65 536|perfil|
| `analysisProvider` | `agent`, `openai`, `anthropic` |perfil|
| `models` |objeto de asignación de modelo; Los campos se describen a continuación.|perfil|
| `searchStemmers.cyrillic` | `russian`, `none` |archivo general, vía `config set`|
| `searchStemmers.latin` |`english`, `spanish`, ambos separados por comas, `none`|archivo general, vía `config set`|

### Modelos por tarea

`models.<назначение>` solo contiene `provider`, `model` y `baseUrl`. Los nombres de tarea usan letras latinas minúsculas, cifras y guiones y empiezan por una letra. `default` define valores comunes; `analysis` y `replies` los sobrescriben campo a campo. Puedes guardar otros nombres válidos de antemano; eso no activa un caso de uso sin implementar. Sin proveedor o con `off`, las llamadas externas están desactivadas.

| Clave | Valor permitido | Predeterminado |
|---|---|---|
| `models.<назначение>.provider` | `off`, `openai`, `anthropic` | Sin configurar; no hay llamada externa |
| `models.<назначение>.model` | Cadena no vacía, de hasta 200 caracteres | Sin configurar; un proveedor activo necesita un identificador explícito |
| `models.<назначение>.baseUrl` | URL HTTP(S) sin credenciales, consulta ni fragmento | Endpoint del proveedor |

Para cada campo, el orden es `MAX_MODELS_<НАЗНАЧЕНИЕ>_PROVIDER`, `_MODEL` o `_BASE_URL`, después la entrada más específica del archivo para la tarea, luego los campos antiguos `analysis*` explícitos para `analysis` y después las variables y entradas de `models.default`. Los guiones del nombre de tarea se convierten en `_` en la variable de entorno. Los tokens del proveedor no forman parte de este objeto.

Las configuraciones de vectores y análisis son independientes y pueden variar según los perfiles. La dirección es HTTP/S sin contraseña, consulta ni fragmento integrados. El servicio de vectores externo también recibe la pregunta de la búsqueda MCP. Las claves se especifican a través de `models text key set openai|anthropic` y no se escriben en `config.json`. El `build` habitual no desencadena un análisis externo: se necesita un `--analyze` explícito. Los proveedores y ejemplos se encuentran en [manual de modelos externos](./external-models.md).

### Variables para configurar modelos

Siete campos antiguos admiten `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL`, `MAX_ANALYSIS_BASE_URL`. Actúan antes que los valores del archivo; Los parámetros del comando son más fuertes que ellos. `MAX_MODELS_DEFAULT_PROVIDER`, `MAX_MODELS_DEFAULT_MODEL`, `MAX_MODELS_DEFAULT_BASE_URL` configuran los campos generales del nuevo formato; En lugar de `DEFAULT`, puede especificar el destino, por ejemplo `ANALYSIS`. Una variable vacía no anula la configuración. `configuration_error` devuelve un valor incorrecto.

## Siguiente paso

- [Seguridad](./security.md): qué protege `permissions`, lista de destinatarios y `sendsPerHour`
- [Perfiles e inicio de sesión](./sessions.md): cómo se estructuran los perfiles y dónde está el token
- [Todos los comandos](./commands.md): cada comando y opción y tabla completa de códigos de retorno
- [Resolución de problemas](./troubleshooting.md): qué hacer cuando no funciona
