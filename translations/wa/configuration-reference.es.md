---
title: "Referencia de configuración"
---

Usa esta página cuando necesite el nombre exacto, el valor predeterminado o el alcance de una configuración, o el nombre de una variable de entorno. Enumera todas las configuraciones que lee `wa` y qué valor gana.

Ninguna configuración puede contener un secreto: el archivo no tiene campos para las claves del dispositivo, un número de teléfono o una identificación de chat.

## ¿Qué valor gana?

Para cada configuración, la primera de estas que se establece:

1. una opción en la línea de comando (`--limit 50`, `--record`, `--timeout 30s`)
2. una variable de entorno (`WA_PROFILE`, `WA_TIMEOUT`)
3. la propia entrada del perfil en el archivo de configuración
4. `defaults` en el archivo de configuración, compartido por cada perfil.
Cinco, el valor predeterminado incorporado

`wa <profile> config show` imprime cada configuración vigente y de dónde proviene.

## El archivo

`~/.config/whatsapp-cli/config.json`. Ninguna configuración elige un perfil: la primera palabra (`wa work …`) o `WA_PROFILE` lo nombra. Sin ninguno de los dos, un comando que usa una cuenta se detiene con el código de salida `2` y enumera los perfiles en esta computadora.

| Configuración | Predeterminado | Qué hace | Anulado por uno ejecutado por |
|---|---|---|---|
| `limit` | `20` | filas por página de una lista | `--limit` |
| `timeout_ms` | ninguno | cuánto tiempo puede esperar **una** solicitud, en milisegundos; para todo el comando utilice `--timeout` | ninguno |
| `color` | desde la terminal | color en la vista de tabla | ninguno; sin configuración, `NO_COLOR` lo apaga |
| `sender_colors` | `false` | un color por remitente en la vista de tabla de mensajes | ninguno |
| `search_catch_up` | `false` | preparar chats recién almacenados para búsqueda local: su gráfico y, cuando estén instalados, sus vectores | `--catch-up`, `--no-catch-up` |
| `picture_search` | `false` | buscar imágenes almacenadas por lo que muestran, una vez descargado el modelo | ninguno |
| `record` | `false` | mantener cada carrera | `--record`, `--no-record` |
| `keep_runs_for_days` | `30` | las ejecuciones registradas anteriores a esta se eliminan cuando se conserva la siguiente | ninguno |
| `permissions` | todo permitido, excepto eliminar y algunos otros cambios preguntar | qué puede hacer el perfil, por comando | ninguno; `--yes` solo responde `ask`, nunca levanta `deny` |
| `sends_per_hour` | `30` | la mayor cantidad de envíos en cualquier hora | ninguno |
| `requests_per_minute` | el ritmo del CLI | solicita un minuto, compartido por cada proceso del perfil; `0` lo apaga | `WA_REQUESTS_PER_MINUTE` |
| `transcribe_with` | `auto` | quién convierte la voz en texto: `auto`, `messenger` o `local` | `--local` o `--model` |
| `speech_model` | ninguno | que utiliza el modelo de voz descargado `--local` | `--model` |
| `read_other_bots` | `false` | aceptar mensajes identificados como provenientes de otros bots; Sólo perfiles de bots | ninguno |
| `update_check` | `true` | la línea diaria "existe una versión más nueva"; sólo bajo `defaults` | ninguno; `WA_NO_UPDATE_CHECK`, `NO_UPDATE_NOTIFIER` o `CI` apágalo |
| `skill_hint` | `true` | una línea, como máximo una vez al día, para un agente cuya copia de el skill falta o es anterior; sólo bajo `defaults` | ninguno |
| `embedding_provider` | `local` | modelo local o `openai` | `--embedding-provider` |
| `embedding_model` | predeterminado del proveedor | modelo de incrustación | `--model` |
| `embedding_base_url` | predeterminado del proveedor | incorporación de punto final API | `--base-url` |
| `embedding_dims` | modelo predeterminado | entero 1–65,536 | `--dims` |
| `models` | ninguno | modelos externos por finalidad | Variables `WA_MODELS_*` |

Las configuraciones para la raíz de búsqueda, los países telefónicos, las tareas y los grupos de cuentas (`search_stemmers.*`, `phone_countries`, `task_*`, `account_groups.*`) se enumeran en [`wa config set`](./commands.md#wa-config-set).

El archivo se escribe con permisos `0600`, legible solo por ti, en una carpeta `0700`, y `config set` lo mantiene así. No guarda ningún secreto. `wa doctor` señala el archivo o su carpeta cuando otros usuarios pueden leerlos ([diagnóstico](./diagnostics.md#check-the-installation-wa-doctor)).

Una configuración que el archivo no conoce, una clave de permiso que no nombra ningún comando, un valor de tipo incorrecto o un archivo que no es JSON válido detienen todos los comandos excepto `config` y `doctor`, con el código de salida `3`. El mensaje nombra el primer problema y el `config unset` que lo elimina. `wa personal doctor` enumera todos los problemas del archivo
([diagnóstico](./diagnostics.md#check-the-installation-wa-doctor)).

## Un perfil de bot

Un número de WhatsApp Business en la Cloud API de Meta (`wa <profile> bot …`) mantiene tu configuración en `bot` en el archivo: `wa <profile> config set --bot <setting> <value>`. Son identificadores de la página de configuración de API del Panel de aplicaciones, no secretos; el token de acceso se encuentra en el llavero del sistema ([un número de WhatsApp Business como bot](./bot.md)).

| Configuración | Predeterminado | Qué hace | Anulado por uno ejecutado por |
|---|---|---|---|
| `phone_number_id` | ninguno | el número de empresa del que habla cada comando `bot` | Comandos `--phone-number-id` en `bot api` |
| `waba_id` | ninguno | la cuenta de WhatsApp Business que contiene las plantillas del número | `--waba-id` en comandos `bot api` |
| `graph_version` | `v23.0` | la versión Graph API en cada solicitud | ninguno |

## Variables de entorno

| Variables | Qué hace |
|---|---|
| `WA_PROFILE` | el perfil, cuando la primera palabra no nombra a nadie |
| `WA_PROFILE_LOCK` | fija el proceso a un perfil; cualquier otro se rechaza |
| `WA_TIMEOUT` | lo mismo que `--timeout`: `500ms`, `30s` o `2m` para todo el comando |
| `WA_REQUESTS_PER_MINUTE` | igual que `requests_per_minute`, y lo supera |
| `WA_CONFIG_DIR`, `WA_STATE_DIR`, `WA_CACHE_DIR` | mover los tres directorios |
| `MESSAGING_STORE` | la ruta del archivo de almacén local |
| `WIRECAT_STATE_DIR` | la carpeta WireCat que comparte cada CLI: el almacén local y los modelos de voz |
| `WA_READ_ONLY` | `1` hace que este proceso sea de solo lectura: todo cambio, vinculación y desvinculación del dispositivo incluido, se rechaza |
| `WA_ENGINE` | la ruta de un programa de motor a ejecutar en lugar del instalado |
| `WA_ENGINE_LOG` | un archivo al que el motor añade sus advertencias, números de teléfono enmascarados; desarmado, no registra nada |
| `WA_NO_UPDATE_CHECK` | `1` desactiva la línea diaria "Existe una versión más nueva" |
| `NO_COLOR` | sin color en la vista de tabla |
| `WA_EMBEDDING_*`, `WA_MODELS_*` | configuración del modelo |
