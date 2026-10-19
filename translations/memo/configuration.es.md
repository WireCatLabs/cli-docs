---
title: "Configuración"
---

Esta página muestra cada ajuste del archivo de configuración de Memo y cada variable de entorno que
lee Memo. Úsala para consultar un ajuste; rara vez necesitas editar el archivo a mano.
`memo folders add` añade una carpeta y `memo auto start` activa el temporizador por ti. Edita tú el
archivo para indicar los archivos que se omiten, las cuentas de correo y dónde van las notas
exportadas.

El archivo es `~/.config/cli-memo/config.json`. Es un archivo JSON: mantén las comillas, las comas y
las llaves como en el ejemplo.

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

`accounts` muestra las cuentas de correo que se importan. Cada cuenta tiene:

| Clave | Significado |
|---|---|
| `name` | Nombre de la cuenta en Himalaya; lo acepta `memo sync --source email:<name>`. |
| `address` | Dirección de correo. |
| `mode` | `gmail` (predeterminado), `imap` o `mbox` para un archivo de Google Takeout. |
| `path` | Para `mbox`: archivo Takeout, como `~/Takeout/Mail/All mail Including Spam and Trash.mbox`. |
| `folders` | Para `imap`: carpetas que se leerán, como `["INBOX", "Archive"]`. |
| `embed` | `false` excluye el correo de esta cuenta de la búsqueda por significado. |
| `rules` | Solo se lee para mover las reglas al almacén: desde 0.32.0 se guardan allí y se gestionan con `memo mail rules`. Véase [Correo](./mail.md#choose-what-to-import). |

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
| `places` | Variables de ubicación de memo y del almacén (`MEMO_CONFIG_DIR`, `MESSAGING_STORE`…) guardadas al ejecutar `memo auto start`; se pasan a cada ejecución del temporizador. |

`memo auto start` y `memo auto stop` escriben estos valores. Si los editas a mano, el temporizador los
sigue en su siguiente ejecución. Consulta [importar con un temporizador](./archive.md#import-on-a-timer-linux).

## `update_check`

`false` desactiva la comprobación diaria de nuevas versiones de memo. `MEMO_NO_UPDATE_CHECK=1` hace lo mismo para una sesión de terminal.

## Variables de entorno

| Variable | Significado |
|---|---|
| `MEMO_CONFIG_DIR` | La carpeta que contiene `config.json`. |
| `MEMO_STATE_DIR` | La carpeta de estado de Memo: cómo era cada carpeta en la última importación. |
| `MEMO_MODELS_ANALYSIS_PROVIDER`, `MEMO_MODELS_ANALYSIS_MODEL` | El proveedor de IA y el identificador del modelo (el nombre que usa el proveedor para él) a los que llama `memo ask --analyze`. |
| `MEMO_MODELS_ANALYSIS_BASE_URL` | Opcional: la dirección del proveedor. |
| `MEMO_MODEL_API_KEY` | La clave del proveedor. |
| `MEMO_READ_ONLY` | Cualquier valor salvo `0` rechaza todo cambio con `permission_error` (código de salida 5): escrituras en el almacén, en tus archivos, en el correo del proveedor, en el temporizador y en los archivos de la skill, además de `upgrade` y `ask --allow-remote`. Las lecturas y `memo sync` siguen funcionando; `memo mcp` deja fuera sus herramientas de escritura. |

Memo llama a un proveedor fuera de tu ordenador solo cuando `memo ask` tiene a la vez `--analyze` y
`--allow-remote`. Consulta [dar las fuentes a tu agente](./search.md#give-your-agent-the-sources).
