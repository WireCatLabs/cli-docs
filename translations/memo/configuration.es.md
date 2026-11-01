---
title: "Configuración"
---

Usa esta referencia para consultar los ajustes y variables de entorno propios de Memo.
Rara vez necesitas editar el archivo a mano.
`memo folders add` añade una carpeta y `memo jobs start` activa el temporizador por ti. `memo mail add` añade una cuenta explícita de la importación de correo antigua con Himalaya. Edita el
archivo para indicar qué archivos se omiten y dónde van las notas exportadas.

El archivo es `~/.config/cli-memo/config.json`. Es un archivo JSON: mantén las comillas, las comas y
las llaves como en el ejemplo.

Un archivo con un problema detiene todos los comandos excepto `memo doctor` y `memo config unset`. El rechazo nombra el
primer problema y el comando que lo elimina; `memo doctor` los enumera todos, cada uno con su línea o su `memo config unset
<key>`. `config unset` elimina un ajuste por su ruta con puntos, también uno que Memo no conoce, como
`memo config unset mail.accounts.0.colour` o `memo config unset permissions.notes.edit`. Un archivo que no es JSON
válido se corrige a mano en la línea y la columna que indica `memo doctor`.

```json
{
  "notes": {
    "folders": [{ "id": "1", "path": "/path/to/vault", "format": "obsidian" }],
    "ignore": ["Journal/Private.md", "Archive", "**/Private*"],
    "embed": true,
    "export": { "dir": "/path/to/vault/memo", "format": "obsidian" }
  },
  "mail": {
    "accounts": [{ "name": "work", "address": "you@example.com" }],
    "max_body_chars": 1000000,
    "max_attachment_chars": 200000
  },
  "auto": { "enabled": true, "every": "5m" }
}
```

## `notes`

| Clave | Significado |
|---|---|
| `folders` | Tus carpetas de notas. Cada una tiene el `id` que le dio el almacén local, su `path` en este ordenador y su `format`: `obsidian` (el predeterminado) o `markdown`. `memo folders add` escribe una entrada; la importación rechaza una entrada sin `id`. Consulta [Markdown u Obsidian](./notes.md#markdown-or-obsidian). |
| `ignore` | Archivos y carpetas que la importación omite: una ruta dentro de la carpeta, una carpeta o un patrón como `**/Private*`. `--ignore` añade reglas para una sola ejecución. |
| `embed` | `false` deja las notas fuera de la búsqueda por significado. |
| `export` | `dir` y `format` para `memo notes export` y `--export` cuando no indicas ninguna carpeta. |

El `id` de la carpeta es el mismo en todos los ordenadores; el `path` es distinto en cada uno.
Consulta [usar las mismas notas en otro ordenador](./notes.md#use-the-same-notes-on-another-computer).

## `mail`

`accounts` muestra las cuentas de correo de la importación antigua con Himalaya, que se eliminará en una versión posterior.
El correo sincronizado con [mail](./mail.md#bring-mail-in-with-mail) no necesita una entrada aquí. Cada cuenta tiene:

| Clave | Significado |
|---|---|
| `name` | Nombre de la cuenta en Himalaya; lo acepta `memo sync --source email:<name>`. |
| `address` | Dirección de correo. |
| `mode` | `gmail` (predeterminado), `imap` o `mbox` para un archivo de Google Takeout. |
| `path` | Para `mbox`: archivo Takeout, como `~/Takeout/Mail/All mail Including Spam and Trash.mbox`. |
| `folders` | Para `imap`: carpetas que se leerán, como `["INBOX", "Archive"]`. |
| `embed` | `false` excluye el correo de esta cuenta de la búsqueda por significado. |
| `rules` | Solo se lee para mover las reglas al almacén: se guardan allí y se gestionan con `memo mail rules`. Véase [Correo](./mail.md#choose-what-to-import). |

Junto a `accounts`:

| Clave | Significado |
|---|---|
| `max_body_chars` | Cuántos caracteres de cada correo se guardan. Valor predeterminado: 1.000.000. |
| `max_attachment_chars` | Cuántos caracteres del texto de cada adjunto se guardan. Valor predeterminado: 200.000. |

Los ajustes usan snake_case; se rechazan los nombres en camelCase.

Consulta [Correo](./mail.md).

## `auto`

| Clave | Significado |
|---|---|
| `enabled` | `true` si el temporizador de importación está activo. |
| `every` | Frecuencia: `90s`, `5m`, `1h`; un minuto como mínimo. |
| `places` | Variables de ubicación de memo y del almacén (`MEMO_CONFIG_DIR`, `MESSAGING_STORE`…) guardadas al ejecutar `memo jobs start`; se pasan a cada ejecución del temporizador. |

`memo jobs start` y `memo jobs stop` escriben estos valores. Si los editas a mano, el temporizador los
sigue en su siguiente ejecución. Consulta [importar con un temporizador](./archive.md#import-on-a-timer-linux).

## `update_check`

`false` desactiva la comprobación diaria de nuevas versiones de memo. `MEMO_NO_UPDATE_CHECK=1` hace lo mismo para una sesión de terminal.

## `record`, `record_input` y `keep_runs_for_days`

Memo guarda un registro de ejecución de cada comando: el comando tal como lo escribiste, cómo terminó y las peticiones
de correo y RDAP que hizo, con sus tiempos, códigos de estado y, en una lectura de correo repetida, el intento y la espera antes de él.
Un secreto en el comando (una opción con nombre de token, contraseña o clave de API, una contraseña en una URL, una cadena larga y opaca) y un número de teléfono se escriben como `[redacted]`.
Lo que el comando leyó o escribió nunca se guarda: ni una nota, ni el texto de un correo, ni el nombre de una carpeta a la que llegó.
`memo runs list` los muestra, `memo runs show <run-id>` muestra uno.

| Clave | Significado |
|---|---|
| `record` | `false` guarda solo las ejecuciones fallidas. Sin definir o `true`: todas las ejecuciones. `--record` guarda de todos modos la ejecución de un comando, `--no-record` no guarda nada para él. `memo mcp serve` y otros comandos que se ejecutan hasta que los detienes guardan una ejecución correcta solo con `--record`. |
| `record_input` | `false` escribe como `[redacted]` cada valor escrito que pueda ser contenido y conserva solo las palabras del comando, los nombres de opciones, los números, las fechas y las opciones elegidas. `"failed"` hace eso en una ejecución correcta y conserva las palabras en una fallida. Sin definir: el comando se guarda tal como se escribió, con los secretos ocultos. |
| `keep_runs_for_days` | Cuántos días se guarda una ejecución fallida. Por defecto, 30. |
| `keep_successful_runs_for_days` | Cuántos días se guarda una ejecución correcta. Por defecto, 7. |
| `runs_size_limit_mb` | Lo máximo que puede ocupar la carpeta de ejecuciones; las ejecuciones correctas más antiguas salen primero. Por defecto, 200. |

Añade las claves a `config.json` a mano; `memo config unset <key>` elimina una.

## `agent_decisions`

De forma predeterminada, un agente puede confirmar o rechazar [propuestas de proyecto](./recipes.md#review-project-facts-and-follow-ups)
por ti, con un motivo registrado en la decisión. Establece la clave `agent_decisions` en `false`
en el nivel superior para exigir decisiones del propietario en este recorrido:

```json
{
  "agent_decisions": false
}
```

Añade la clave a tu configuración existente en vez de sustituir tus ajustes de notas, correo y temporizador
por este breve ejemplo. Tanto CLI como MCP rechazan entonces `projects actions confirm` y `reject` del agente;
leer y preparar propuestas sigue disponible. Las decisiones del propietario siguen disponibles en el terminal.
El ajuste controla el modo de agente de Memo; el acceso al terminal conserva los permisos de su usuario.
`--as-owner` etiqueta un comando como del propietario y el agente no debe usarlo para eludir este ajuste.
El ajuste se aplica a propuestas de proyecto; no cambia el permiso separado para confirmar hallazgos de reuniones ni sustituye las demás comprobaciones de permisos de la herramienta.

## Variables de entorno

| Variable | Significado |
|---|---|
| `MEMO_CONFIG_DIR` | La carpeta que contiene `config.json`. |
| `MEMO_STATE_DIR` | La carpeta de estado de Memo: cómo era cada carpeta en la última importación. |
| `MEMO_MODELS_ANALYSIS_PROVIDER`, `MEMO_MODELS_ANALYSIS_MODEL` | El proveedor de IA y el identificador del modelo (el nombre que usa el proveedor para él) a los que llama `memo answers create --analyze`. |
| `MEMO_MODELS_ANALYSIS_BASE_URL` | Opcional: la dirección del proveedor. |
| `MEMO_MODEL_API_KEY` | La clave del proveedor. |
| `MEMO_READ_ONLY` | Cualquier valor salvo `0` rechaza todo cambio con `permission_error` (código de salida 5): escrituras en el almacén, en tus archivos, en el correo del proveedor, en el temporizador y en los archivos de la skill, además de `upgrade` y `answers create --allow-remote`. Las lecturas, `memo sync`, `tasks link` siguen funcionando (el vínculo solo se propone y se rechaza vincular dos tareas); `reminders claim` se rechaza; `memo mcp serve` mantiene visibles los comandos de escritura, pero rechaza ejecutarlos. |

Memo llama a un proveedor fuera de tu ordenador solo cuando `memo answers create` tiene a la vez `--analyze` y
`--allow-remote`. Consulta [dar las fuentes a tu agente](./search.md#give-your-agent-the-sources).

## `permissions`

Las rutas de comandos con puntos limitan las herramientas MCP. Una clave cubre el comando y sus subcomandos;
gana la clave guardada más específica. `deny` marca los comandos como no disponibles, `readonly` permite leer y `ask` o `allow`
permiten escribir. En MCP, `ask` se ejecuta sin pregunta en el terminal; la aplicación cliente determina las solicitudes de aprobación.
Las escrituras sin un nivel guardado usan `ask`.

```json
{
  "permissions": {
    "notes": "readonly",
    "mail.delete": "deny",
    "mcp.authority": "deny"
  }
}
```

`mcp.authority` tiene `deny` por defecto para cambiar carpetas de origen y reglas de correo.
`meetings.actions.confirm`, `meetings.actions.reject` y `projects.annotations.restore` también tienen `deny`;
configura explícitamente la clave correspondiente como `ask` o `allow` para delegar una de esas operaciones.
`agent_decisions: false` sigue rechazando decisiones sobre propuestas de proyecto. El límite compartido de lectura
de WireCat y `MEMO_READ_ONLY` restringen todos los permisos.

Los permisos cambiados se aplican en la siguiente búsqueda de comandos y llamada, también en las
conexiones abiertas. `memo mcp serve --permission notes.edit=deny` restringe una clave para ese servidor sin cambiar
el archivo; se rechaza cualquier modificación que relaje una clave guardada.
