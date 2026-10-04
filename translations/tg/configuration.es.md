---
title: "Configuración"
---
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

⚠ **No es una comprobación de funcionamiento.** Solo lee archivos: no abre la base de datos, consulta el almacén de claves ni se conecta. Para comprobar la sesión, utiliza `tg doctor --online` ([solución de problemas](./troubleshooting.md#first-tg-doctor)).

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

| Ajuste | Valor predeterminado | Qué hace |
|---|---|---|
| `limit` | `20` | filas por página; `--limit` tiene prioridad |
| `timeoutMs` | ninguno | tiempo máximo de **una** petición a Telegram en milisegundos. Un comando puede hacer varias; usa `--timeout` para limitar todo el comando |
| `color` | según la terminal | colores en las tablas; `NO_COLOR` también los desactiva |
| `senderColors` | `false` | un color por remitente en las tablas de mensajes |
| `record` | `false` | guardar todas las ejecuciones ([diagnóstico](./diagnostics.md)); `--record` y `--no-record` tienen prioridad |
| `keepRunsForDays` | `30` | los registros más antiguos se eliminan al guardar el siguiente |
| `permissions` | todo permitido; pide confirmación para eliminar y cerrar otras sesiones | permisos del perfil por comando ([más abajo](#what-a-profile-may-do)) |
| `sendsPerHour` | `30` | máximo de envíos en cualquier intervalo de una hora ([seguridad](./security.md#the-send-guard)) |
| `transcribeWith` | `auto` | quién transcribe la voz: `auto` (Telegram o un modelo local), `messenger` o `local` |
| `speechModel` | ninguno | modelo descargado para `--local` (`tg models audio list`) |
| `updateCheck` | `true` | aviso diario de nueva versión; solo en `defaults` |
| `skillHint` | `true` | aviso, como máximo diario, para agentes cuya skill de tg falta o es anterior al comando; solo en `defaults` |
| `readOtherBots` | `false` | solo perfiles de bot: si `tg bot` puede leer lo guardado por otros bots en este equipo; `true` o una lista de perfiles ([bots](./bot.md)) |

`defaultProfile`, en el nivel superior, indica el perfil utilizado cuando ni la primera palabra ni `TG_PROFILE` especifican uno.

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

**Cada clave es una ruta de comando:** `messages`, `messages.delete`, `messages.send`, `reactions`, `polls.vote`, `chats.mark-read`, `chats.members.remove`, `contacts`, `account.sessions.end`. Debe comenzar por un recurso: `messages`, `reactions`, `polls`, `topics`, `chats`, `contacts`, `account` o `bot`; de lo contrario se rechaza. **La clave más específica tiene prioridad:** en el ejemplo anterior se permite `messages.send` y se rechazan los demás cambios de mensajes. No hay comodines: `messages: readonly` no afecta a `reactions`, `polls` ni `chats`.

`inbox`, `review`, `watch`, `serve` y `store fetch`, `export` y `search` muestran mensajes, por lo que cuentan como `messages`: `messages: deny` también los bloquea. `config`, `session`, `doctor`, `recipients`, `mcp` y el mantenimiento del archivo local nunca se restringen.

**Por defecto se permite todo salvo dos acciones irreversibles:** `messages.delete` y `account.sessions.end` tienen nivel `ask`. Un valor predeterminado solo puede hacer más estricta la regla: `messages: readonly` sigue rechazando eliminaciones y `messages: allow` conserva la confirmación hasta que configures `messages.delete` expresamente.

```sh
tg config set permissions.messages.delete allow     # delete without the question
tg config set permissions.messages.send ask         # ask before every send
tg config unset permissions.messages.delete         # back to the default
```

Para hacer un perfil de solo lectura —aquí, `agent`— configura cada recurso:

```sh
for key in messages reactions polls topics chats contacts account; do
  tg agent config set permissions.$key readonly
done
```

### Confirmación antes de cambiar algo

Con `ask`, `tg` muestra el cambio y pregunta `go ahead? [y/N]`. Cualquier respuesta distinta de `y` no cambia nada y finaliza con código `130`. Puedes aprobar mediante una opción: `--allow-dangerous` para eliminar y `--yes` para cualquier otro cambio. Sin terminal, o con `--json` o `--jsonl`, nadie puede responder: se rechaza con código `7`, `confirmation_required`, y el error indica la opción necesaria.

### Ajustes anteriores que siguen funcionando

`readOnly: true` equivale a `readonly` en todos los recursos. Una lista en `allow` (`send`, `forward`, `reaction`, `edit`, `pin`, `read`, `delete`, `groups`, `contacts`, `profile`, `folders`, `sessions`) permite esas acciones con `allow` y deja las demás en `readonly`; las eliminaciones siguen pidiendo confirmación. Una clave de `permissions` tiene prioridad sobre ambos.

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

## Variables de entorno

| Variable | Qué hace |
|---|---|
| `TG_PROFILE` | elige el perfil si la primera palabra no especifica uno |
| `TG_PROFILE_LOCK` | limita el proceso a un perfil; rechaza cualquier otro ([sesiones](./sessions.md#profiles)) |
| `TG_TIMEOUT` | igual que `--timeout`: `500ms`, `30s` o `2m` para todo el comando |
| `TG_API_ID`, `TG_API_HASH` | aplicación en lugar del almacén de claves, para CI; define ambas o ninguna |
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

## Siguientes pasos

- [Seguridad](./security.md): protección mediante `permissions`, destinatarios permitidos y `sendsPerHour`.
- [Diagnóstico](./diagnostics.md): `record` y `keepRunsForDays`.

## Migrar los ajustes de acceso antiguos

`tg config migrate --dry-run --json` muestra la sustitución de `readOnly` y `allow` por
`permissions` canónicos, conservando los niveles efectivos del archivo para perfiles personales y bots.
No escribe el archivo ni se conecta a Telegram. `tg config migrate --json` aplica la migración
explícitamente; un proceso limitado a un perfil no puede aplicar un cambio que afecte a todos los perfiles.
Los demás ajustes se conservan. Los archivos canónicos no necesitan migración. Cuando ya existe
`permissions`, `config set` rechaza cambios en los antiguos `readOnly` y `allow`; cambia las claves de permisos correspondientes.
