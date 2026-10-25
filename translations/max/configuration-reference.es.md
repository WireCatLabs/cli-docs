---
title: "Referencia de configuración"
---

<a id="prioridad-de-los-ajustes" />
<a id="comprobar-el-resultado" />

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
max personal chats list --limit 5          # флаг: 5
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

Cada ajuste indica su origen: `flag`, `default` o `config file:` con la clave, como `config file: bot.profiles.test`. El perfil muestra `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK` o `none named`: no se nombró ningún perfil, y entonces `profile` es `null`.

Con `--json`, la respuesta también incluye `store_settings`: los ajustes del archivo compartido (`search_stemmers.*`, `task_agent_close*`) y su origen, `store` o `default`.

`--bot` muestra las configuraciones tal como las recibirá `max <имя> bot …`: el bot tiene su propia sección y su propio límite de envío. Si el archivo no existe, `config show` primero crea uno con los valores predeterminados habituales. El archivo existente no se sobrescribe. Si se configura una de las variables `MAX_*_DIR`, el comando lo dirá en stderr: con ellas, el perfil tiene una entrada diferente en el llavero, y un inicio de sesión realizado sin ellas parece "sin sesión".

⚠ **Incluye todos los perfiles locales:** configurados, cuentas personales con sesión y bots; cada uno marcado como personal, bot o ambos.

⚠ **Esto no es una verificación de estado.** El comando lee archivos: no abre el caché, no toca el llavero y no contacta a MAX. `max personal doctor` comprueba si la sesión está activa ([el primer paso en caso de problemas](./troubleshooting.md)).

No aparecen secretos: el archivo no dispone de campos para guardarlos.

## Archivo

`~/.config/max-cli/config.json` en Linux; rutas en otros sistemas - en [guía de configuración](./configuration.md#где-лежит-файл). El primer comando que lee la configuración, por ejemplo `config show`, `account list` o `chats list`, lo crea con `limit`, `keep_runs_for_days`, `sends_per_hour`, `update_check` y `skill_hint` en `defaults`. El archivo se crea y `max personal config set` lo escribe con permisos `0600`; su carpeta, con `0700`. `max personal doctor` nombra en `files.problems` el archivo o la carpeta que otros usuarios pueden leer e imprime el `chmod` que lo corrige. `max personal doctor` solo lee el archivo: si no existe, responde `config.found: false` y no lo crea.

Los nombres de los ajustes se escriben en snake_case: `sends_per_hour`, `keep_runs_for_days`, `models.<назначение>.base_url`.

```json
{
  "defaults": { "keep_runs_for_days": 14 },
  "profiles": {
    "personal": { "limit": 50, "timeout_ms": 20000, "color": true },
    "work": { "limit": 10 }
  },
  "personal": {
    "defaults": { "sends_per_hour": 30 }
  },
  "bot": {
    "defaults": { "permissions": { "bot": "readonly", "bot.messages.send": "allow" } },
    "profiles": { "shop": { "sends_per_hour": 200 } }
  }
}
```

- `defaults`: todos los perfiles, personales y bots.
- `profiles.<имя>`: un perfil, cualquiera que sea su función.
- `personal.defaults`, `personal.profiles.<имя>`: cuentas personales.
- `bot.defaults`, `bot.profiles.<имя>`: comandos `max <имя> bot …`.

|Campo|¿Qué hace?|Qué se superpone para un ejecución|Por defecto|
|---|---|---|---|
| `limit` |¿Cuántos registros mostrar cuando no se transmite `--limit`?| `--limit` | `20` |
| `timeout_ms` |cuánto tiempo esperar para recibir una respuesta a **una solicitud**|— (`--timeout` — otro, ver más abajo)|tomado del transporte|
| `color` |color en terminal; sin un campo se decide en función de si es una terminal|—; sin color de campo se apaga `NO_COLOR`|por terminal|
| `sender_colors` |en `max personal messages` cada autor tiene su propio color; `вы` - siempre azul. Sin `color` no funciona. Solo para cuenta personal| — | `false` |
| `search_catch_up` |después de `messages sync` o reparación de roturas, prepara el gráfico y establece los vectores locales de este chat dentro de límites especificados. Los modelos no se descargan, no se llama a proveedores remotos. Solo para cuenta personal| `--catch-up`, `--no-catch-up` | `false` |
| `record` |si se debe registrar cada inicio como si se transfiriera `--record` ([diagnóstico](./diagnostics.md))| `--record`, `--no-record` | `false` |
| `keep_runs_for_days` |¿Cuántos días se almacenan los registros de ejecución?| — | `30` |
| `permissions` |niveles de derechos para recursos y comandos: `deny`, `readonly`, `ask`, `allow`; la clave más precisa tiene prioridad ([abajo](#права-доступа))|—; `--yes` y `--allow-dangerous` solo responden a `ask`, `deny` no eliminan|todo `allow`, excepto: eliminación, terminación de otras sesiones y algunos cambios irreversibles más - `ask`; respuestas automáticas `replies.send` – `deny`|
| `sends_per_hour` |cuántos mensajes puede enviar un perfil en una hora, junto con reenvíos, ediciones, pines con notificaciones, mensajes eliminados, personas agregadas a grupos y solicitudes aceptadas de membresía; over - falla con código `8`. **El límite de bot** se establece solo en la sección `bot`; sin él el bot no está limitado ([enviar protección](./security.md#защита-от-отправки-не-туда))| — |`30`, el bot no lo tiene|
| `requests_per_minute` |cuántas solicitudes por minuto realiza el perfil a MAX, después de las primeras 10 seguidas, juntas en todos los procesos de este perfil; `0` - sin limitación ([límites y esperas](./limits.md))| `MAX_REQUESTS_PER_MINUTE` | `20` |
| `serve` |¿Debo ejecutar `max personal serve` en segundo plano cuando el comando necesita MAX y no hay servidor? El servidor no comienza con `MAX_TOKEN`. Solo para cuenta personal| `--serve`, `--no-serve` | `true` |
| `transcribe_model` |con qué modelo `max personal messages transcribe` reconoce el habla. **Solo en `defaults`**|`--model` en `messages transcribe` y al lado de `--transcribe`| `gigaam-v3` |
| `read_other_bots` |¿Puede el bot leer copias de otros bots cuando el comando lo solicita? `--all-bots` o `--bots`: `false`, `true`: todos o una lista de perfiles de bot. **Solo en la sección `bot`** ([bots](./bot.md))|—; `--all-bots` y `--bots` preguntan, el campo permite| `false` |
| `update_check` |Una vez al día pregunte a npm si hay una nueva versión e infórmelo en la terminal. **Solo en `defaults`**: la versión del programa es la misma para todos los perfiles|—; apagar `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI`| `true` |
| `skill_hint` |una vez al día decirle al agente en stderr que no tiene la habilidad `max` o que es anterior al programa y que está asignada por `max skill install`. Reconocemos al agente por la variable `AI_AGENT` o `CLAUDECODE`. **Solo en `defaults`**| — | `true` |
| `embedding_provider` |modelo local (`local`) o `openai`| `--provider` | `local` |
| `embedding_model` |modelo vectorial| `--model` |por servicio|
| `embedding_base_url` |Dirección API de vectores| `--base-url` |por servicio|
| `embedding_dims` |tamaño del vector, número entero 1–65 536| `--dims` |por modelo|
| `models` |modelos externos por propósito ([abajo](#модели-по-назначению))|variables `MAX_MODELS_*`|No|
| `search_stemmers.cyrillic`, `search_stemmers.latin` |Lenguajes de raíces de palabras para buscar en todo el archivo general ([abajo](#языки-поиска))| — | `russian`, `english,spanish` |
| `task_first_pass_per_chat` | Cuántas tareas pueden abrir las reglas en cada chat a partir del historial en la primera sincronización de la cuenta; un número entero de 0 a 1000. Después solo se leen los mensajes nuevos, y `tasks scan <чат>` crea tareas a partir del historial cuando lo pides. Compartido por todo el archivo | — | `0` |
| `task_agent_close`, `task_agent_close_min` | Si un agente cierra tareas y con qué confianza de `--certainty`; por debajo del umbral queda abierta con una sugerencia de cierre ([tareas](./groups.md#что-ждёт-вашего-ответа)). Compartidos por todo el archivo | — | `on`, `0.8` |

⚠ **`timeout_ms` y `--timeout` son distintos.** `timeout_ms` limita la espera de **una respuesta** de MAX. `--timeout` limita **todo el comando**. Una lectura incluye conexión, INIT, LOGIN, resolución del nombre del chat y la propia petición, por lo que su duración puede ser varias veces `timeout_ms`.

Los formatos difieren deliberadamente: `timeout_ms` es un número de milisegundos en el archivo; `--timeout` exige una unidad (`30s`, `2m`, `500ms`). `--timeout 30` se rechaza para evitar confundir segundos y milisegundos, con errores de hasta treinta veces.

No hay campo para `--timeout`: el presupuesto corresponde a una ejecución, no a una preferencia duradera.

**`--page` y `--all` no tienen campos de configuración.** Guardar una página sirve una vez y molesta después. Tampoco `--order` de `max personal contacts list` tiene un duplicado `contactOrder`. `--limit` sí, porque es una preferencia estable.

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

**La clave es la ruta del comando**: `messages`, `messages.delete`, `messages.send`, `reactions`, `chats.members`, `contacts`, `account.sessions.end`. Comienza con el recurso: `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account`, `bot`, `conversations`, `tags`, `mentions`, `search`, `searches`, `tasks`, `replies`, `attachments`, `stats`, `store` o `metadata`. `calls` y `stickers` solo tienen lectura y no tienen clave de permiso: `config set` responde con el código 2. Las claves del bot comienzan con `bot`, por ejemplo `bot.messages.send`. `config set` rechaza una clave de comando desconocida, incluso dentro de un objeto `permissions` completo, con el código 2. Si esa clave ya está escrita en el archivo, los comandos no se ejecutan: el `configuration_error` nombra la clave y el comando `config unset` que la quita. `config show`, `set` y `unset` siguen funcionando para que puedas reparar el archivo.

**Una clave más específica anula el recurso.** El ejemplo anterior permite leer y eliminar mensajes sin confirmación y desactiva otras escrituras en mensajes. Los contactos, chats, reacciones y otros recursos no se limitan a este ejemplo. `config show` muestra los derechos actuales y su fuente.

Los permisos de distintas secciones se combinan, pero **primero cuenta la sección más cercana y después la longitud de la clave**. Una clave del perfil sustituye esa clave y todas sus descendientes en `personal.defaults`, `bot.defaults` y `defaults`. El perfil `agent` del ejemplo no elimina mensajes: su `messages` sustituye `messages.delete` de `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Funciona en ambos sentidos: `messages: allow` en el perfil también anula `messages.delete: deny` de `defaults`, y entonces eliminar vuelve a preguntar, como por defecto.

**De forma predeterminada, todo está permitido excepto algunos cambios que son difíciles de deshacer.** Preguntado por: `messages.delete`, `bot.messages.delete`, `chats.delete`, `chats.clear`, `topics.enable`, `topics.delete` y `account.sessions.end`. Las respuestas automáticas no se envían hasta que usted permita: `replies.send` - `deny`.

```sh
max personal config set permissions.messages.delete allow     # удалять без вопроса
max personal config set permissions.messages.send ask         # спрашивать перед каждой отправкой
max personal config unset permissions.messages.delete         # вернуть значение по умолчанию
```

### Pregunta antes del cambio

Con `ask`, el terminal pide confirmación con «no» por defecto. `--allow-dangerous` responde para eliminaciones irreversibles de mensajes, chats, historial o temas; `--yes`, para los demás cambios. En modo JSON no hay pregunta interactiva: se requiere una de estas opciones.

### A través de MCP

MCP no muestra formularios de confirmación: `ask` permite la escritura invocada; `deny` y `readonly` siguen bloqueándola. `--permission ключ=уровень` endurece temporalmente los permisos del proceso, pero no los relaja. En la CLI, `ask` sigue requiriendo una respuesta o una opción explícita. Consulta la conexión en la [guía MCP](./mcp.md).

`mcp.authority` controla los cambios de ajustes, reglas, destinatarios y otras condiciones de futuras ejecuciones; su valor predeterminado es `deny`. Los comandos siguen en el catálogo; para ejecutarlos, el propietario elige `allow` o `ask`. Las operaciones directas del bot requieren aparte un `bot.api: allow` o `ask` explícito; un `bot: allow` general no las habilita. El agente no puede cambiar estas claves ni sustituir todo el objeto `permissions`; puede cambiar otras claves individuales si lo permite `mcp.authority`.

El mantenimiento del archivo, el control del servidor, las descargas de modelos y la creación de informes tienen claves propias, por ejemplo `store.backup`, `server.start`, `models.download`, `doctor.reports.create`. Su nivel predeterminado es `ask`.

Elegir solo lectura en el primer inicio limita todos los perfiles de todas las herramientas WireCat, incluido MCP. Un `allow` más específico del perfil no elimina ese límite. Cambia la respuesta mediante `max setup` en el terminal.

## Cambiar sin abrir el archivo

```sh
max personal config set limit 50        # профилю personal
max work config set record true         # профилю work
max config set keep_runs_for_days 7 --defaults   # всем профилям сразу
max work config unset limit             # убрать; снова решает defaults или встроенное
max agent config set permissions.messages readonly  # чтение сообщений без записи
max shop config set --bot sends_per_hour 200    # только боту shop
max config set --personal --defaults limit 30 # всем личным аккаунтам
```

Los valores se comprueban con el mismo esquema usado para leer, **antes de escribir**: `max personal config set limit 0` se rechaza y el archivo queda igual. `serve`, `sender_colors` y `search_catch_up` no se admiten con `--bot`: los bots no tienen servidor, colores de autores ni estado de no leído.

### Idiomas de búsqueda

`search_stemmers.cyrillic` (`russian` o `none`) y `search_stemmers.latin` (`english`, `spanish`, ambos separados por comas (este es el valor predeterminado) o `none`) no se almacenan en el archivo de configuración, sino en el archivo general de mensajes: son los mismos para todos los perfiles y para ambos servicios de mensajería. Por lo tanto, `--defaults`, `--personal` y `--bot` no se aceptan con ellos y no se pueden cambiar en `MAX_PROFILE_LOCK`. `config unset` devuelve el valor incorporado. Después del cambio, realice `max personal store rebuild`; consulte [mantenimiento de archivos](./archive.md#обслуживание-архива).

## Las erratas son errores

Un campo desconocido se rechaza con su nombre y `configuration_error`, código `3`:

```json
{"error":{"code":"configuration_error","reason":"config.invalid","message":"/home/you/.config/max-cli/config.json: profiles.default.limitt is an unknown setting","retry":{"safe":false}}}
```

Un tipo incorrecto identifica el campo sin repetir su valor, que podría contener un token: `profiles.default.limit has the wrong type`. Si hay varios campos incorrectos, el error nombra el primero y cuenta los demás: `(and 2 more problems)`.

Ignorar campos desconocidos ocultaría erratas y haría perder tiempo buscando por qué no funciona un ajuste.

Un archivo inexistente no es un error: simplemente no has configurado la aplicación.

## Variables de entorno

|Variable|¿Qué hace?|
|---|---|
| `MAX_PROFILE` |perfil para toda la sesión de shell; igual que la primera palabra|
| `MAX_PROFILE_LOCK` |bloquea el proceso en un perfil: otro perfil - con la primera palabra o mediante `MAX_PROFILE` - y `config set --defaults` son rechazados. Se conserva solo donde el agente no puede cambiar el entorno en sí: en la configuración del cliente MCP o en el script contenedor. Un agente con acceso de shell eliminará la variable misma|
| `MAX_TIMEOUT` |restricción en todo el comando, para toda la sesión de shell; igual que `--timeout`|
| `MAX_REQUESTS_PER_MINUTE` |Igual que `requests_per_minute` y más fuerte que el archivo.|
| `MAX_TOKEN` |token directamente, sin pasar por el llavero, para CI y ejecucións únicos|
| `MAX_BOT_TOKEN` |token de bot para `max sales bot`, sin pasar por el llavero|
| `MAX_CONFIG_DIR` |donde están `config.json` y, en ausencia de un llavero, un archivo con un token|
| `MAX_STATE_DIR` |donde estan el estado de los perfiles y el catalogo `runs/`|
| `MAX_CACHE_DIR` |sólo el caché antiguo: `max personal doctor` buscal archivo restante allí. Por compatibilidad, aún cambia la entrada en el llavero; para una copia compartida utilice `MESSAGING_STORE`|
| `MESSAGING_STORE` |archivo para archivo local compartida de chats, mensajes y transcripciones|
| `WIRECAT_STATE_DIR` | la carpeta WireCat, compartida por todas las CLI: el archivo local y los modelos de voz |
| `NO_COLOR` |apaga el color, como en cualquier otro programa|
| `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` |no preguntes a npm sobre una nueva versión; `CI` funciona de la misma manera|
| `MAX_EMBEDDING_*`, `MAX_MODELS_*` |configuración del modelo ([abajo](#переменные-для-настроек-моделей))|

Una cadena vacía equivale a no definida: `MAX_PROFILE=` es como no establecer `MAX_PROFILE`.

**No hay ninguna variable para `--json` o para el color, y esto es intencional.** Si se olvida en el shell, cambiaría la salida de un comando que no lo solicitó, y encontrarlo más tarde es más difícil que escribir una bandera.

## Configuración temporal separada

Las variables de directorios separan configuración y estado de acceso para pruebas u otra cuenta. No afectan al almacén compartido con `tg`: su archivo se elige mediante `MESSAGING_STORE`. Los modelos de voz siguen compartidos.

```sh
export MAX_CONFIG_DIR=/tmp/max-try/config
export MAX_STATE_DIR=/tmp/max-try/state
export MESSAGING_STORE=/tmp/max-try/wirecat.db

max personal setup            # этот токен не виден обычной установке
max personal chats list
```

> ⚠ Y viceversa: **la instalación normal no ve esta sesión**. Si las variables se configuran en una ventana de terminal y no se configuran en otra, la segunda ventana dirá "sin sesión" cuando el token esté activo.

## Tipos y ámbitos de las claves

El área de "perfil" incluye `defaults`, `profiles.<имя>`, `personal.defaults`, `personal.profiles.<имя>`, `bot.defaults` y `bot.profiles.<имя>`, a menos que una cadena la limite. Se rechazan las claves desconocidas y los valores del tipo incorrecto. Los valores predeterminados se dan [arriba](#файл).

|Llave|Tipo o valor válido|Región|
|---|---|---|
| `limit`, `timeout_ms`, `keep_runs_for_days`, `sends_per_hour` |entero ≥ 1|perfil|
| `requests_per_minute` |entero ≥ 0|perfil|
| `color`, `record` | boolean |perfil|
| `sender_colors`, `search_catch_up`, `serve` | boolean |cuenta personal|
| `permissions` |objeto de rutas y niveles de comando `deny`, `readonly`, `ask`, `allow`|perfil|
| `read_other_bots` |booleano o conjunto de nombres de perfil|sólo `bot`|
| `update_check`, `skill_hint` | boolean |solo `defaults`|
| `transcribe_model` |ID de cadena de `max personal models list kind:audio`|solo `defaults`|
| `embedding_provider` |`local` o `openai`|perfil|
| `embedding_model` |cadena no vacía, no más de 200 caracteres|perfil|
| `embedding_base_url` |URL HTTP(S) sin credenciales, consulta y fragmento|perfil|
| `embedding_dims` |entero 1–65 536|perfil|
| `models` |objeto de asignación de modelo; Los campos se describen a continuación.|perfil|
| `search_stemmers.cyrillic` | `russian`, `none` |archivo general, vía `config set`|
| `search_stemmers.latin` |`english`, `spanish`, ambos separados por comas, `none`|archivo general, vía `config set`|
| `task_agent_close` | `on`, `off` | archivo compartido, mediante `config set` |
| `task_agent_close_min` | un número de 0 a 1 | archivo compartido, mediante `config set` |
| `task_first_pass_per_chat` | un número entero de 0 a 1000 | archivo compartido, mediante `config set` |

### Modelos por tarea

`models.<назначение>` solo contiene `provider`, `model` y `base_url`. Los nombres de tarea usan letras latinas minúsculas, cifras y guiones y empiezan por una letra. `default` define valores comunes; `analysis` y `replies` los sobrescriben campo a campo. Puedes guardar otros nombres válidos de antemano; eso no activa un caso de uso sin implementar. Sin proveedor o con `off`, las llamadas externas están desactivadas.

| Clave | Valor permitido | Predeterminado |
|---|---|---|
| `models.<назначение>.provider` | `off`, `openai`, `anthropic` | Sin configurar; no hay llamada externa |
| `models.<назначение>.model` | Cadena no vacía, de hasta 200 caracteres | Sin configurar; un proveedor activo necesita un identificador explícito |
| `models.<назначение>.base_url` | URL HTTP(S) sin credenciales, consulta ni fragmento | Endpoint del proveedor |

Para cada campo, el orden es `MAX_MODELS_<НАЗНАЧЕНИЕ>_PROVIDER`, `_MODEL` o `_BASE_URL`, después la entrada más específica del archivo para la tarea y después las variables y entradas de `models.default`. Los guiones del nombre de tarea se convierten en `_` en la variable de entorno. Los tokens del proveedor no forman parte de este objeto.

Las configuraciones de vectores y análisis son independientes y pueden variar según los perfiles. La dirección es HTTP/S sin contraseña, consulta ni fragmento integrados. El servicio de vectores externo también recibe la pregunta de la búsqueda MCP. Las claves se especifican a través de `models keys set openai|anthropic` y no se escriben en `config.json`. El `build` habitual no desencadena un análisis externo: se necesita un `--analyze` explícito. Los proveedores y ejemplos se encuentran en [manual de modelos externos](./external-models.md).

### Variables para configurar modelos

Los ajustes de vectores también leen `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL` y `MAX_EMBEDDING_DIMS`. Actúan antes que los valores del archivo; Los parámetros del comando son más fuertes que ellos. `MAX_MODELS_DEFAULT_PROVIDER`, `MAX_MODELS_DEFAULT_MODEL`, `MAX_MODELS_DEFAULT_BASE_URL` configuran los campos generales del nuevo formato; En lugar de `DEFAULT`, puede especificar el destino, por ejemplo `ANALYSIS`. Una variable vacía no anula la configuración. `configuration_error` devuelve un valor incorrecto.

## Siguiente paso

- [Seguridad](./security.md): qué protege `permissions`, lista de destinatarios y `sends_per_hour`
- [Perfiles e inicio de sesión](./sessions.md): cómo se estructuran los perfiles y dónde está el token
- [Todos los comandos](./commands.md): cada comando y opción y tabla completa de códigos de retorno
- [Resolución de problemas](./troubleshooting.md): qué hacer cuando no funciona
