---
title: "Referencia de configuración"
---


Lista completa de claves, valores predeterminados, ámbitos y variables de entorno. Para la configuración habitual, empieza por la [guía](./configuration.md); consulta el [contrato de la CLI](./cli-contract.md) para las reglas de ejecución y salida.


No necesitas configurar nada: sin archivo ni variables funcionan los valores iniciales. El archivo sirve para evitar repetir opciones.

## Prioridad de los ajustes

**Opción → variable de entorno → archivo → valor integrado.** El mismo orden para todo el programa, definido en un solo lugar para que ningún comando pueda elegir otro.


Dentro del archivo prevalece la **entrada más específica**. Para un comando de cuenta personal en el perfil `work`: `personal.profiles.work` → `profiles.work` → `personal.defaults` → `defaults`. Para `max work bot …`, es lo mismo con `bot` en vez de `personal`. El perfil tiene prioridad sobre la sección: la entrada de una cuenta prevalece sobre la de todas.


```sh
max chats list --limit 5          # флаг: 5
MAX_PROFILE=personal max chats list   # переменная выбирает профиль
# "limit": 50 у профиля в файле — когда флага нет
# "limit": 30 в "defaults" — когда и у профиля нет
# 20 — когда нет ничего
```

Hay dos excepciones que tienen prioridad sobre ese orden. Están documentadas:


- **`MAX_TOKEN` prevalece sobre el llavero**, para CI.
- **`MAX_CONFIG_DIR` y `MAX_STATE_DIR` cambian configuración y acceso de `max`**, incluida la entrada del llavero correspondiente al perfil.

## Ajustes efectivos

```sh
max config show            # профиль, какие профили есть, файл и каждая настройка
max work config show       # то же для профиля work
max config show --json     # то же одним объектом
```

Cada ajuste indica su origen: `flag`, `default` o `config file:` con la clave, como `config file: bot.profiles.test`. El perfil muestra `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK`, `config file: defaultProfile` o `default`.

Con `--json`, la respuesta también incluye `storeSettings`: los ajustes del archivo compartido (`searchStemmers.*`) y su origen, `store` o `default`.

`max test config show --bot` muestra los ajustes tal como los recibirá `max test bot …`: los bots tienen su propia sección y límite de envío. Si falta el archivo, al cargar la configuración se crea con los valores predeterminados habituales. No se sobrescribe un archivo existente. Si está configurada una variable `MAX_*_DIR`, el comando lo indica en stderr: esas variables dan al perfil una entrada distinta en el llavero, por lo que un inicio de sesión realizado sin ellas aparece como «sin sesión».


No aparecen secretos: el archivo no dispone de campos para guardarlos.

## Permisos de acceso

`deny` bloquea lectura y escritura; `readonly` permite lectura; `ask` requiere confirmación; `allow` realiza la acción sin preguntar. En un terminal, `ask` muestra una pregunta con «no» por defecto. En modo JSON no hay pregunta: usa `--yes`, o `--allow-dangerous` para borrar mensajes. MCP no tiene formularios de confirmación: `ask` permite la escritura solicitada, mientras `deny` y `readonly` siguen bloqueándola. `--permission ключ=уровень` sobrescribe temporalmente los permisos del proceso. Las opciones antiguas de confirmación ya no determinan el acceso; en la CLI, los niveles `ask` siguen requiriendo una respuesta o una opción explícita. Consulta [MCP](./mcp.md) para la conexión.


Una clave más específica tiene prioridad sobre su recurso. Este ejemplo permite leer mensajes y eliminarlos sin confirmación, pero prohíbe las demás escrituras en mensajes:

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.delete": "allow" } } } }
```

Este ejemplo no limita contactos, chats, reacciones ni otros recursos. Las claves de bots empiezan por `bot`, como `bot.messages.send`. `config show` muestra los permisos efectivos y su origen. `config set` rechaza una clave de orden desconocida, también dentro de un objeto `permissions` completo, con el código 2. `config unset` permite eliminar una clave desconocida antigua. Al leer un archivo existente con una clave así, se avisa en stderr y se continúa.

Los permisos de distintas secciones del archivo se combinan, pero **primero decide la sección más cercana y después la longitud de la clave**. Una clave definida en el perfil anula la misma clave y todas las que cuelgan de ella en `personal.defaults` y `defaults`. Aquí el perfil `agent` no elimina mensajes: su `messages` anula `messages.delete` de `defaults`.

```json
{
  "defaults": { "permissions": { "messages.delete": "allow" } },
  "profiles": { "agent": { "permissions": { "messages": "readonly" } } }
}
```

Funciona en ambos sentidos: `messages: allow` en el perfil también anula `messages.delete: deny` de `defaults`, y entonces eliminar vuelve a preguntar, como por defecto. Los antiguos `readOnly` y `allow` se aplican en la sección donde están escritos.

Puedes ver los cambios antes de convertir un archivo antiguo:

```sh
max config migrate --dry-run
max config migrate
```

La migración conserva los permisos efectivos, los ajustes MAX y los puntos de moderación. Los niveles antiguos `forbid/flag/confirm` pasan a `deny/ask/ask`. `--dry-run` no escribe. Una vez existe `permissions`, cambiar `readOnly`, `allow` o `mcpTools` se rechaza indicando el nuevo ajuste. `MAX_PROFILE_LOCK` impide migrar el archivo completo; permite la vista previa.

## Archivo

`~/.config/max-cli/config.json`, permisos `0644`. Lo escribe `max config set` o puedes editarlo.

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

| Campo | Función | Qué lo sobrescribe en una ejecución | Predeterminado |
|---|---|---|---|
| `defaultProfile` | Perfil sin primera palabra ni `MAX_PROFILE` | La primera palabra (`max work …`), `MAX_PROFILE` | `default` |
| `embeddingProvider` | Modelo local (`local`, por defecto) u `openai` | `--provider` | `local` |
| `embeddingModel` | Modelo de vectores | `--model` | Según el servicio |
| `embeddingBaseUrl` | Dirección de la API de vectores | `--base-url` | Según el servicio |
| `embeddingDims` | Tamaño del vector, entero de 1 a 65 536 | `--dims` | Según el modelo |
| `analysisProvider` | Agente (`agent`), `openai` o `anthropic` | `build --provider` | `agent` |
| `analysisModel` | Modelo de análisis | `build --model` | Ninguno; indicar explícitamente para `--analyze` |
| `analysisBaseUrl` | Dirección de la API de análisis | `build --base-url` | Según el servicio |
| `limit` | Registros que mostrar sin `--limit` | `--limit` | `20` |
| `timeoutMs` | Espera para **una solicitud** | — (`--timeout` es otra cosa, ver abajo) | La del transporte |
| `color` | Color; si falta, se detecta si es un terminal | —; si falta el campo, `NO_COLOR` desactiva el color | Detección del terminal |
| `senderColors` | Color por autor en `max messages`; `вы` siempre cian. Requiere `color`. Solo cuenta personal | — | `false` |
| `searchCatchUp` | Tras `store fetch` o reparar huecos, prepara el grafo y los vectores locales instalados del chat dentro de los límites indicados. No descarga modelos ni llama a proveedores remotos | `--catch-up`, `--no-catch-up` | `false` |
| `catchUpMarksRead` | `max inbox` y `max review` marcan como leído cada chat mostrado, hasta el último mensaje mostrado. El interlocutor ve la marca. Solo cuenta personal | `--mark-read`, `--no-mark-read` | `false` |
| `record` | Registrar cada ejecución como con `--record` | `--record`, `--no-record` | `false` |
| `permissions` | niveles por recurso y comando: `deny`, `readonly`, `ask`, `allow`; una clave más específica tiene prioridad | —; `--yes` y `--allow-dangerous` solo responden a `ask`, no anulan `deny` | casi todo `allow`; eliminar mensajes y cerrar otras sesiones `ask`; respuestas automáticas `replies.send` `deny` |
| `serve` | Iniciar `max serve` si se necesita y no existe. No inicia con `MAX_TOKEN`. Solo personal | `--serve`, `--no-serve` | `true` |
| `keepRunsForDays` | Días de conservación de ejecuciones | — | `30` |
| `readOnly`, `allow`, `mcpTools` | ajustes antiguos compatibles; `config migrate` los convierte en `permissions` | — | no se pueden cambiar tras migrar |
| `sendsPerHour` | Límite horario, incluidos reenvíos, ediciones, fijados con aviso, borrados, personas añadidas y solicitudes de entrada aceptadas; superar devuelve `8`. **Bots** solo usan la sección `bot`; sin ella no tienen límite | — | `30`; sin límite para bots |
| `requestsPerMinute` | Peticiones por minuto del perfil a MAX, tras las primeras 10 seguidas, compartidas entre todos los procesos de ese perfil; `0` significa sin límite. `MAX_REQUESTS_PER_MINUTE` prevalece sobre el archivo ([limits.md](./limits.md)) | `MAX_REQUESTS_PER_MINUTE` | `20` |
| `readOtherBots` | Leer copias de otros bots al pedir `--all-bots` o `--bots`: `false`, `true` para todos o lista de perfiles. **Solo `bot`** | —; `--all-bots` y `--bots` lo piden, el campo lo permite | `false` |
| `updateCheck` | Consultar npm una vez al día y avisar en el terminal. **Solo `defaults`**, la versión es común | —; lo desactivan `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER`, `CI` | `true` |
| `skillHint` | Avisar al agente en stderr una vez al día si falta la skill de `max` o es antigua; sugiere `max skill install`. Detecta `AI_AGENT` o `CLAUDECODE`. **Solo `defaults`** | — | `true` |
| `transcribeModel` | Modelo de `max messages transcribe`. **Solo `defaults`** | `--model` en `messages transcribe` y junto a `--transcribe` | `gigaam-v3` |

⚠ **`timeoutMs` y `--timeout` son distintos, y confundirlos sale caro.** `timeoutMs` es cuánto esperar **una respuesta** de MAX. `--timeout` es el tiempo para **todo el comando**. Una lectura incluye conexión, INIT, LOGIN, resolución del nombre del chat y la propia petición, por lo que su duración es un múltiplo de `timeoutMs` y nunca equivale a él.


Los formatos difieren deliberadamente: `timeoutMs` es un número de milisegundos en el archivo; `--timeout` exige una unidad (`30s`, `2m`, `500ms`). `--timeout 30` se rechaza para evitar confundir segundos y milisegundos, con errores de hasta treinta veces.

No hay campo para `--timeout`: el presupuesto corresponde a una ejecución, no a una preferencia duradera.

**`--page` y `--all` no tienen campos de configuración.** Guardar una página sirve una vez y molesta después. Tampoco `--order` de `max contacts list` tiene un duplicado `contactOrder`. `--limit` sí, porque es una preferencia estable.

**Este archivo no tiene sitio para secretos.** El esquema no incluye campos para tokens, teléfonos ni identificadores de chat: un esquema sin sitio para un secreto es más fiable que la regla «no pongas secretos aquí».


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


`searchStemmers.cyrillic` (`russian` o `none`) y `searchStemmers.latin` (`english`, `spanish`, ambos por defecto separados por coma, o `none`) se guardan en el archivo compartido, no en la configuración. Afectan a todos los perfiles y ambos mensajeros. No se aplican `--defaults`, `--personal` ni `--bot`; `MAX_PROFILE_LOCK` impide cambiarlos. `config unset` restablece el valor integrado. Después ejecuta `max store reindex`; consulta [mantenimiento del archivo](./archive.md#обслуживание-архива).

## Las erratas son errores

Un campo desconocido se rechaza con su nombre y `configuration_error`, código `3`:

```json
{"error":{"code":"configuration_error","message":"/home/you/.config/max-cli/config.json is not a valid config:\n  profiles.default.limitt: unknown setting — the known ones are limit, timeoutMs, color, record, keepRunsForDays, readOnly, allow, permissions, sendsPerHour, senderColors, serve, mcpTools"}}
```

Un tipo incorrecto identifica el campo y lo admitido: `profiles.default.limit: has to be a
whole number, 1 or more, not "20"`.

Ignorar campos desconocidos ocultaría erratas y haría perder tiempo buscando por qué no funciona un ajuste.

Un archivo inexistente no es un error: simplemente no has configurado la aplicación.

## Comprobar el resultado

Las capas pueden dificultar saber qué valor prevaleció. Esta orden lo explica:

```sh
max config show
max config show --json
```

Muestra perfil **y origen**, ruta y existencia del archivo, perfiles disponibles y valores efectivos con su fuente.

⚠ **Incluye todos los perfiles locales:** configurados, cuentas personales con sesión y bots; cada uno marcado como personal, bot o ambos.

⚠ **No comprueba la conexión.** Lee archivos sin abrir la caché, consultar el llavero ni contactar con MAX. Validar una sesión requiere acceso y pertenece a otra orden.

## Variables de entorno

| Variable | Función |
|---|---|
| `MAX_PROFILE` | Perfil para la sesión del terminal, equivalente a la primera palabra |
| `MAX_PROFILE_LOCK` | Fija un perfil; rechaza otro mediante primera palabra o `MAX_PROFILE`, y `config set --defaults`. Solo eficaz si el agente no puede cambiar el entorno, como en MCP o un script envoltorio. Con terminal puede quitarla |
| `MAX_TIMEOUT` | Límite de toda la orden, como `--timeout` |
| `MAX_TOKEN` | Token directo, sin llavero, para CI y usos puntuales |
| `MAX_BOT_TOKEN` | Token directo de `max bot` |
| `MAX_CONFIG_DIR` | Directorio de `config.json` y token si no hay llavero |
| `MESSAGING_STORE` | Archivo compartido de chats, mensajes y transcripciones |
| `MAX_STATE_DIR` | Estado de perfiles y `runs/` |
| `NO_COLOR` | Desactivar color, según la convención habitual |
| `MAX_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` | No consultar versiones npm; `CI` hace lo mismo |

Una cadena vacía equivale a no definida: `MAX_PROFILE=` es como no establecer `MAX_PROFILE`.

**Solo perfil y tiempo límite tienen variables equivalentes.** Son decisiones del proceso. No habrá variables para `--json` o color: olvidarlas en el terminal cambiaría salidas sin que el comando lo pidiera.

## Configuración temporal separada

Las variables de directorios separan configuración y estado de acceso para pruebas u otra cuenta. No afectan al almacén compartido con `tg`: su archivo se elige mediante `MESSAGING_STORE`. Los modelos de voz siguen compartidos.

```sh
export MAX_CONFIG_DIR=/tmp/max-try/config
export MAX_STATE_DIR=/tmp/max-try/state
export MESSAGING_STORE=/tmp/max-try/messages.db

max setup            # этот токен не виден обычной установке
max chats list
```

> ⚠ También a la inversa: **la instalación habitual no ve esta sesión**. Una hora se perdió buscando una sesión válida porque las variables estaban establecidas en una ventana y no en otra.

## Siguiente paso

- [Referencia](./commands.md): comandos, opciones y códigos.
- [Sesiones y perfiles](./sessions.md): acceso y llavero.
- [Solución de problemas](./troubleshooting.md): qué hacer ante errores.

`MAX_CACHE_DIR` solo corresponde a la caché antigua: `max doctor` busca allí el archivo restante. Por compatibilidad, todavía cambia la entrada del llavero; para la copia compartida nueva, usa `MESSAGING_STORE`.

Los ajustes de vectores y análisis son independientes y pueden variar por perfil. `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL` y `MAX_ANALYSIS_BASE_URL` sustituyen la configuración; las opciones sustituyen los ajustes. La dirección debe ser HTTP/S sin contraseña integrada, query ni fragment. El servicio externo de vectores también recibe la pregunta de una búsqueda MCP. Las claves se establecen con `models text key set openai|anthropic` y no se escriben en `config.json`. Un `build` normal no ejecuta análisis externo: requiere `--analyze` explícito.

## Tipos y ámbitos de las claves


El ámbito «perfil» incluye `defaults`, `profiles.<имя>`, `personal.defaults`, `personal.profiles.<имя>`, `bot.defaults` y `bot.profiles.<имя>`, salvo que una fila lo restrinja. Se rechazan claves desconocidas y valores de tipo incorrecto. Los valores predeterminados se indican arriba.


| Clave | Tipo o valor permitido | Ámbito |
|---|---|---|
| `defaultProfile` | Cadena con el nombre de un perfil | Raíz del archivo |
| `limit`, `timeoutMs`, `keepRunsForDays`, `sendsPerHour` | Entero ≥ 1 | Perfil |
| `requestsPerMinute` | Entero ≥ 0 | Perfil |
| `color`, `record`, `readOnly` | Booleano | Perfil |
| `senderColors`, `catchUpMarksRead`, `searchCatchUp`, `serve` | Booleano | Cuenta personal |
| `permissions` | Objeto que asigna niveles `deny`, `readonly`, `ask`, `allow` a rutas de comandos | Perfil |
| `allow` | Matriz de acciones permitidas; formato antiguo | Perfil |
| `mcpTools` | Matriz de `contacts`, `polls`, `groups`, `profile`; formato antiguo | Cuenta personal |
| `readOtherBots` | Booleano o matriz de nombres de perfiles | Solo `bot` |
| `updateCheck`, `skillHint` | Booleano | Solo `defaults` |
| `transcribeModel` | Identificador de texto de `max models audio list` | Solo `defaults` |
| `embeddingProvider` | `local` u `openai` | Perfil |
| `embeddingModel`, `analysisModel` | Cadena no vacía, de hasta 200 caracteres | Perfil |
| `embeddingBaseUrl`, `analysisBaseUrl` | URL HTTP(S) sin credenciales, consulta ni fragmento | Perfil |
| `embeddingDims` | Entero de 1–65 536 | Perfil |
| `analysisProvider` | `agent`, `openai`, `anthropic` | Perfil |
| `models` | Objeto de tareas de modelos; campos descritos abajo | Perfil |

### Modelos por tarea


`models.<назначение>` solo contiene `provider`, `model` y `baseUrl`. Los nombres de tarea usan letras latinas minúsculas, cifras y guiones y empiezan por una letra. `default` define valores comunes; `analysis` y `replies` los sobrescriben campo a campo. Puedes guardar otros nombres válidos de antemano; eso no activa un caso de uso sin implementar. Sin proveedor o con `off`, las llamadas externas están desactivadas.


| Clave | Valor permitido | Predeterminado |
|---|---|---|
| `models.<назначение>.provider` | `off`, `openai`, `anthropic` | Sin configurar; no hay llamada externa |
| `models.<назначение>.model` | Cadena no vacía, de hasta 200 caracteres | Sin configurar; un proveedor activo necesita un identificador explícito |
| `models.<назначение>.baseUrl` | URL HTTP(S) sin credenciales, consulta ni fragmento | Endpoint del proveedor |

Para cada campo, el orden es `MAX_MODELS_<НАЗНАЧЕНИЕ>_PROVIDER`, `_MODEL` o `_BASE_URL`, después la entrada más específica del archivo para la tarea, luego los campos antiguos `analysis*` explícitos para `analysis` y después las variables y entradas de `models.default`. Los guiones del nombre de tarea se convierten en `_` en la variable de entorno. Los tokens del proveedor no forman parte de este objeto.


### Variables para configurar modelos


Los siete campos antiguos admiten `MAX_EMBEDDING_PROVIDER`, `MAX_EMBEDDING_MODEL`, `MAX_EMBEDDING_BASE_URL`, `MAX_EMBEDDING_DIMS`, `MAX_ANALYSIS_PROVIDER`, `MAX_ANALYSIS_MODEL` y `MAX_ANALYSIS_BASE_URL`. Prevalecen sobre los valores del archivo. `MAX_MODELS_DEFAULT_PROVIDER`, `MAX_MODELS_DEFAULT_MODEL` y `MAX_MODELS_DEFAULT_BASE_URL` configuran los campos comunes del nuevo formato; sustituye `DEFAULT` por una tarea como `ANALYSIS`. Una variable vacía no sobrescribe ajustes. Un valor inválido devuelve configuration_error.
