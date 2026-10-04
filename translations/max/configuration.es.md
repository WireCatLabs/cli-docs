---
title: "Configuración"
---
No necesitas configurar nada: sin archivo ni variables funcionan los valores iniciales. El archivo sirve para evitar repetir opciones.

## Prioridad de los ajustes

**Opción → variable de entorno → archivo → valor inicial.** Toda la aplicación utiliza el mismo orden.

Dentro del archivo prevalece **la entrada más específica**. Para una cuenta personal en `work`: `personal.profiles.work` → `profiles.work` → `personal.defaults` → `defaults`. Para `max work bot …`, se sustituye `personal` por `bot`. Un ajuste específico del perfil prevalece sobre uno para todas las cuentas.

```sh
max chats list --limit 5          # флаг: 5
MAX_PROFILE=personal max chats list   # переменная выбирает профиль
# "limit": 50 у профиля в файле — когда флага нет
# "limit": 30 в "defaults" — когда и у профиля нет
# 20 — когда нет ничего
```

Dos excepciones explícitas:

- **`MAX_TOKEN` prevalece sobre el llavero**, para CI.
- **`MAX_CONFIG_DIR` y `MAX_STATE_DIR` cambian configuración y acceso de `max`**, incluida la entrada del llavero correspondiente al perfil.

## Ajustes efectivos

```sh
max config show            # профиль, какие профили есть, файл и каждая настройка
max work config show       # то же для профиля work
max config show --json     # то же одним объектом
```

Cada ajuste indica su origen: `flag`, `default` o `config file:` con la clave, como `config file: bot.profiles.test`. El perfil muestra `first word`, `MAX_PROFILE`, `MAX_PROFILE_LOCK`, `config file: defaultProfile` o `default`.

`max test config show --bot` muestra lo usado por `max test bot …`, con sección y límite propios. `configFound: false` indica que no hay archivo y se aplican valores iniciales. Si hay variables `MAX_*_DIR`, aparece un aviso en stderr: al cambiar la entrada del llavero, una sesión creada sin ellas puede parecer inexistente.

No aparecen secretos: el archivo no dispone de campos para guardarlos.

## Permisos de acceso

`deny` prohíbe leer y escribir; `readonly` permite leer; `ask` exige confirmación; `allow` ejecuta la acción sin preguntar. En la terminal, `ask` muestra una pregunta con «no» como respuesta predeterminada. En JSON no hay pregunta: usa `--yes`, o `--allow-dangerous` para eliminar mensajes. MCP obtiene la confirmación mediante un formulario del cliente. `--confirm-send` exige un formulario antes de cada escritura.

Una clave más específica tiene prioridad sobre su recurso. Este ejemplo permite leer mensajes y eliminarlos sin confirmación, pero prohíbe las demás escrituras en mensajes:

```json
{ "profiles": { "work": { "permissions": { "messages": "readonly", "messages.delete": "allow" } } } }
```

Este ejemplo no limita contactos, chats, reacciones ni otros recursos. Las claves de bots empiezan por `bot`, como `bot.messages.send`. `config show` muestra los permisos efectivos y su origen.

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

| Campo | Función | Valor inicial |
|---|---|---|
| `defaultProfile` | Perfil sin primera palabra ni `MAX_PROFILE` | `default` |
| `limit` | Registros que mostrar sin `--limit` | `20` |
| `timeoutMs` | Espera para **una solicitud** | La del transporte |
| `color` | Color; si falta, se detecta si es un terminal | Detección del terminal |
| `senderColors` | Color por autor en `max messages`; `вы` siempre cian. Requiere `color`. Solo cuenta personal | `false` |
| `record` | Registrar cada ejecución como con `--record` | `false` |
| `permissions` | niveles por recurso y comando: `deny`, `readonly`, `ask`, `allow`; una clave más específica tiene prioridad | casi todo `allow`; eliminar mensajes y cerrar otras sesiones `ask` |
| `serve` | Iniciar `max serve` si se necesita y no existe; `--no-serve` evita una vez. No inicia con `MAX_TOKEN`. Solo personal | `true` |
| `keepRunsForDays` | Días de conservación de ejecuciones | `30` |
| `readOnly`, `allow`, `mcpTools` | ajustes antiguos compatibles; `config migrate` los convierte en `permissions` | no se pueden cambiar tras migrar |
| `sendsPerHour` | Límite horario, incluidos reenvíos, ediciones, fijados con aviso, borrados y personas añadidas; superar devuelve `8`. **Bots** solo usan la sección `bot`; sin ella no tienen límite | `30`; sin límite para bots |
| `readOtherBots` | Leer copias de otros bots al pedir `--all-bots` o `--bots`: `false`, `true` para todos o lista de perfiles. **Solo `bot`** | `false` |
| `updateCheck` | Consultar npm una vez al día y avisar en el terminal. **Solo `defaults`**, la versión es común | `true` |
| `skillHint` | Avisar al agente en stderr una vez al día si falta la skill de `max` o es antigua; sugiere `max skill install`. Detecta `AI_AGENT` o `CLAUDECODE`. **Solo `defaults`** | `true` |
| `transcribeModel` | Modelo de `max messages transcribe`. **Solo `defaults`** | `gigaam-v3` |

⚠ **`timeoutMs` y `--timeout` son distintos.** El primero limita **una respuesta** de MAX; el segundo **toda la orden**. Conexión, INIT, LOGIN, resolución del chat y solicitud requieren varias esperas, por lo que la duración total puede multiplicar `timeoutMs`.

Los formatos difieren deliberadamente: `timeoutMs` es un número de milisegundos en el archivo; `--timeout` exige una unidad (`30s`, `2m`, `500ms`). `--timeout 30` se rechaza para evitar confundir segundos y milisegundos, con errores de hasta treinta veces.

No hay campo para `--timeout`: el presupuesto corresponde a una ejecución, no a una preferencia duradera.

**`--page` y `--all` no tienen campos de configuración.** Guardar una página sirve una vez y molesta después. Tampoco `--order` de `max contacts list` tiene un duplicado `contactOrder`. `--limit` sí, porque es una preferencia estable.

**No hay dónde guardar un secreto.** Sin campos de token, teléfono ni ID de chat, el esquema impide almacenarlos en lugar de depender de una advertencia.

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

El valor se valida con el mismo esquema que al leer, **antes de escribir**: `max config set limit 0` se rechaza y deja el archivo intacto. `serve`, `senderColors` y `mcpTools` no se aceptan con `--bot`: un bot no tiene servidor ni colores de autores y el antiguo `mcpTools` pertenece solo a cuentas personales.

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
