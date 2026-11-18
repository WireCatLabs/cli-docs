---
title: "Ajustes"
---

Cambia cómo se comporta `ydisk` para un perfil o para todos: qué puede cambiar un agente en tu Disk, cuánto tiempo se
guardan los registros de ejecución y cómo ordena la búsqueda sus resultados. Los ajustes están en un solo archivo,
`config.json`, en la carpeta que muestra `ydisk doctor`. Cada perfil tiene su propia parte, y `defaults` valen para
todos los perfiles.

```sh
ydisk personal config show
ydisk personal config set limit 50
ydisk personal config unset limit
```

`config show` lista cada ajuste y de dónde viene: del archivo, de una variable o del valor por defecto.

## Permisos

`permissions` decide qué puede hacer un comando para este perfil. Cada comando tiene su propia clave, con su nombre,
como `files.move` o `files.upload`, y cada clave tiene uno de cuatro niveles:

| Nivel | Qué pasa |
| --- | --- |
| `allow` | El comando se ejecuta. |
| `ask` | En un terminal la herramienta pregunta antes. Por MCP no hay nadie a quien preguntar, así que el comando se ejecuta. |
| `readonly` | Una lectura se ejecuta. Un cambio se rechaza. |
| `deny` | El comando se rechaza, con código de salida 5. |

Dos claves protegen los cambios que cuesta deshacer. Están en `ask` hasta que las cambies. Las demás claves de `files`
están en `allow`:

| Clave | Qué protege |
| --- | --- |
| `files.delete` | `files delete`, y una subida, una copia o un movimiento con `--replace`, que sobrescribe un archivo. En el grupo `api`: un borrado, vaciar la papelera y cualquier sobrescritura. |
| `files.share` | `files publish` y `files unpublish`: un enlace que abre cualquiera que lo tenga. En el grupo `api`: las operaciones de enlace público. |

```sh
ydisk personal config set permissions.files.delete deny
ydisk personal config set permissions.files.share deny
ydisk personal config set permissions.files.upload deny
```

Un comando de `api` que hace lo que hace un comando de `files` comprueba también la clave de ese comando: con
`files.move` en `deny` se detiene también `api resources-move`. `--dry-run` en cualquier cambio muestra cada clave que
comprueba y su nivel, sin hacer el cambio.

`YDISK_READ_ONLY=1` rechaza cualquier cambio, digan lo que digan los permisos. Solo para un servidor MCP,
`--permission
files.delete=deny` hace una clave más estricta. Mira [la conexión del agente](./mcp.md#decide-what-the-agent-may-change).

## Registros de ejecución

Un comando que falla se guarda como una ejecución, para `ydisk runs list` y `runs show`. Un comando que llega a Yandex
Disk, como `files list`, `sync` o `session status --check`, se guarda también cuando tiene éxito, salvo que `record`
sea `false` (entonces solo los fallos) o que se ejecutara con `--no-record`. `record_input` decide si una ejecución
guarda las palabras que escribiste. Es `true` salvo que lo pongas en `false`. Los secretos se ocultan en ambos casos.
Mira [Seguridad](./security.md).

| Ajuste | Por defecto | Qué hace |
| --- | --- | --- |
| `record` | `true` | Guarda cada ejecución. `false` guarda solo las que fallan. |
| `record_input` | `true` | Guarda las palabras escritas en la línea de comandos: `true`, `false` o `failed`. |
| `keep_runs_for_days` | `30` | Días que se guarda una ejecución. |
| `keep_successful_runs_for_days` | `7` | Días que se guarda una ejecución correcta. |
| `runs_size_limit_mb` | `200` | Los megabytes máximos que pueden ocupar todas las ejecuciones. |

## Otros ajustes

| Ajuste | Por defecto | Qué hace |
| --- | --- | --- |
| `limit` | `20` | Cuántos elementos muestra una lista a la vez. |
| `search_reranker` | `mmarco` | El modelo que ordena los primeros resultados de la búsqueda, o `off`. |
| `embedding_provider` | `local` | `local` u `openai`: lo que convierte el texto en vectores para la búsqueda por significado. `openai` envía el texto a OpenAI. |
| `update_check` | `true` | Comprueba una vez al día si hay una versión nueva. |
| `skill_hint` | `true` | Avisa a un agente una vez al día de que `skill install` le daría el skill de esta herramienta. |

## Variables de entorno

| Variable | Qué hace |
| --- | --- |
| `YDISK_PROFILE` | El perfil para los comandos que no nombran ninguno. |
| `YDISK_READ_ONLY` | `1` rechaza cualquier cambio. |
