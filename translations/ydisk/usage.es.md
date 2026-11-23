---
title: "Carpetas y sincronización"
---

Elige las carpetas del Disk cuyo texto quieres buscar, mantén su copia al día y trabaja en vivo con cualquier archivo
del Disk. Después de esta página tu agente responde desde las carpetas que elegiste y cambia archivos solo donde tú lo
permites. Da por hecho que ya [iniciaste sesión](./installation.md).

**En esta página:**

1. [Primero el perfil](#the-profile-comes-first)
2. [Elige carpetas](#choose-folders)
3. [Sincroniza](#sync)
4. [Qué guarda la copia](#what-the-copy-holds)
5. [Lee un documento sincronizado](#read-a-synced-document)
6. [Versiones anteriores y qué cambió](#earlier-versions-and-what-changed)
7. [Trabaja con archivos en vivo](#work-with-files-live)
8. [Edita un archivo en el Disk](#edit-a-file-on-the-disk)
9. [Salida para scripts](#output-for-scripts)

## Primero el perfil

Un perfil es el nombre que eliges para una cuenta. Es la primera palabra de todo comando que usa una cuenta:

```sh
ydisk personal status
```

`YDISK_PROFILE=personal` hace lo mismo durante una sesión de la shell. Nunca se supone un perfil, ni siquiera el único:
un comando sin perfil se detiene con el código de salida 2 y lista los perfiles de este ordenador.

## Elige carpetas

`folders browse` lista el Disk un nivel cada vez, en vivo, para que encuentres una carpeta por su ruta:

```sh
ydisk personal folders browse
ydisk personal folders browse --folder /Documents
ydisk personal folders add /Documents/Contracts
```

Una carpeta elegida incluye todo lo que hay debajo, subcarpetas incluidas. `folders list` muestra las carpetas que
elegiste y `folders remove` quita una. La siguiente sincronización retira sus documentos de la copia.

Elige unas pocas carpetas con documentos, no todo el Disk. Yandex Disk no avisa a la herramienta de lo que cambió, así
que cada sincronización vuelve a listar todas las carpetas elegidas y sus subcarpetas. Una carpeta de fotos añade
tiempo de listado y ningún texto en el que buscar.

## Sincroniza

```sh
ydisk personal sync
ydisk personal status
```

`sync` descarga los archivos nuevos o cuyo contenido cambió desde la última sincronización y lee su texto. Un archivo
movido dentro de las carpetas elegidas conserva sus etiquetas y notas.

Un archivo que la sincronización ya no encuentra en el Disk sale de las listas y de la búsqueda, pero su texto se
queda en la copia, marcado como ya no visible. El Disk no le dice a la sincronización si el archivo se borró, se movió
fuera o se perdió con un recurso compartido, así que la sincronización nunca lo trata como borrado. Cuando el archivo
vuelve a aparecer, regresa tal como estaba.

Una sincronización lee hasta 200 archivos (`--limit`) y lista hasta unas 10 000 entradas, y luego guarda dónde se
detuvo. Una carpeta grande necesita varias ejecuciones: ejecuta `sync` otra vez hasta que `status` no muestre trabajo
pendiente. Una parada no pierde nada y la siguiente sincronización sigue desde donde terminó la anterior.

Ejecuta `sync` cuando quieras que la copia se ponga al día, por ejemplo antes de preguntar a tu agente por archivos
recientes. Nada se ejecuta en segundo plano. `sync --rescan` lee todas las carpetas elegidas desde el principio.
Ejecútalo una vez y sigue después con un `sync` normal.

Una carpeta elegida que renombras o mueves en el Disk ya no se encuentra, y sus documentos salen de la copia. Añádela
de nuevo con su ruta nueva.

## Qué guarda la copia

| En el Disk | En la copia |
| --- | --- |
| PDF con capa de texto, Word `.docx`, Excel `.xlsx`, CSV, TSV, texto plano, Markdown | El texto, el nombre, la ruta, el tamaño y las fechas |
| Un PDF escaneado o una imagen | El nombre, la ruta y las fechas. No hay texto que leer |
| Cualquier otro archivo, y cualquier archivo de más de 50 MB | El nombre, la ruta y las fechas |

`status` lista cada archivo guardado solo por su nombre, con el motivo. Los archivos siguen en el Disk. La copia guarda
su texto. Las horas se guardan y se muestran en UTC.

## Lee un documento sincronizado

```sh
ydisk personal documents list
ydisk personal documents show 1a2b3c --json
ydisk personal documents export 1a2b3c --output ./contract.md
```

`documents show` imprime el texto completo de un documento, que encuentras por su id en `search` o `documents list`. El
id de arriba es un ejemplo. `documents export` lo escribe en un archivo Markdown nuevo. Las etiquetas, las notas y los
recuerdos se quedan con el documento y nunca llegan al Disk. Consulta [búsqueda de documentos](./search.md).

## Versiones anteriores y qué cambió

```sh
ydisk personal documents history 1a2b3c
ydisk personal documents history 1a2b3c --revision 2
ydisk personal changes --since 7d
ydisk personal changes --since 1d --event unavailable
```

Cada sincronización guarda el texto, el título y el front matter de un documento antes de que cambie o salga de la
copia. `documents history` lista esas versiones, y `--revision` muestra una. `changes` lista lo que se añadió, cambió,
dejó de estar visible, salió de las carpetas elegidas o volvió, lo más nuevo primero. Ambos leen solo la copia, así
que funcionan sin conexión y por MCP. Las versiones y el registro de cambios se guardan durante
`keep_versions_for_days`, un año por defecto.

## Trabaja con archivos en vivo

Los comandos `files` van directamente al Disk y no necesitan sincronización. Las rutas son rutas del Disk, como
`/Documents/plan.pdf`.

```sh
ydisk personal files list --folder /Documents
ydisk personal files show /Documents/plan.pdf
ydisk personal files download /Documents/plan.pdf --json
ydisk personal files download /Documents/plan.pdf --output ./plan.pdf
ydisk personal files upload ./notes.md --folder /Documents
ydisk personal files copy /Documents/plan.pdf --folder /Archive
ydisk personal files move /Documents/old.pdf --folder /Archive
ydisk personal files create /Projects/2026
ydisk personal files delete /Documents/old.pdf
ydisk personal files restore trash:/old.pdf
ydisk personal files update /Notes/plan.md --text "# Plan" --expected-fingerprint <sha256>
ydisk personal files sheets show /Work/budget.xlsx "Sheet1!A1:C10"
ydisk personal files documents show /Work/report.docx
ydisk personal files history /Notes/plan.md
ydisk personal files publish /Documents/plan.pdf
ydisk personal files unpublish /Documents/plan.pdf
```

- `files download` sin `--output` responde con el texto del archivo, hasta 200 000 caracteres, para que un agente lea
  un archivo fuera de las carpetas elegidas sin guardarlo. Un texto más largo se corta ahí y la respuesta dice
  `truncated: true`. Nunca escribas un texto cortado sobre el archivo: se perdería el resto.
- `files show` y `files list` dan el `md5` y el `sha256` de cada archivo, para que un agente sepa si un archivo cambió
  desde que lo leyó. `files download` da el `sha256` solo junto al texto completo del archivo: un texto cortado, o el
  texto extraído de un PDF, un .docx o un .xlsx, tiene `sha256: null`, así que el agente no tiene huella con la que
  escribirlo de vuelta.
- `files delete` mueve un archivo a la papelera del Disk y `files restore` lo devuelve por su ruta en la papelera.
- `files publish` crea un enlace público que puede abrir cualquiera que lo tenga. `files unpublish` lo cierra.
- `--replace` en una subida, una copia o un movimiento sobrescribe un archivo que ya está en esa ruta.

En un terminal, la herramienta pregunta antes de borrar, sobrescribir, editar o crear un enlace público. Por MCP no hay nadie
a quien preguntar, así que define esos permisos para un agente. Consulta los [ajustes](./configuration.md#permissions).
Añade `--dry-run` a cualquier cambio para ver qué haría sin hacerlo.

Cada operación de la API de Disk de Yandex es también un comando: `ydisk personal api list` las lista y
`ydisk personal api show resources-list` muestra los parámetros de una operación sin llamar a Yandex.

## Edita un archivo en el Disk

Una edición reemplaza un archivo solo si tiene el contenido con el que se leyó. Lee primero el `sha256` del archivo y
pásalo como `--expected-fingerprint`. El archivo se comprueba justo antes de escribir, y lo que se reemplazó se guarda
en este ordenador, en la carpeta de estado del perfil. Si el archivo cambió desde que se leyó, la respuesta es un
`conflict` que indica el comando para leerlo otra vez, y no se sube nada. El Disk no tiene subida condicional, así que
un cambio que llega en el instante entre esa última comprobación y la subida no se detecta; el contenido reemplazado
se guarda igualmente.

| Comando | Qué cambia |
| --- | --- |
| `files update <path> --text <text>` (o el texto por stdin) | todo el texto de un archivo de texto plano, como `.md`, `.txt` o `.csv`; un archivo nuevo no necesita huella |
| `files sheets update <path> <range> --values <json>` | celdas de un `.xlsx`, a partir de `files sheets show`; el resto del libro queda como está |
| `files documents update <path> --payload <json>` | párrafos de un `.docx`, por los índices que da `files documents show` |
| `files restore <path> <version>` | devuelve una versión que lista `files history` |

`files update` rechaza un `.pdf`, `.docx` o `.xlsx`: su texto es extraído, y escribirlo de vuelta reemplazaría el
documento. `sheets update` escribe un texto como texto, aunque empiece por `=`, y no sobrescribe una fórmula salvo con
`--replace`. `documents update` rechaza un párrafo con un cambio controlado, un campo, una imagen, un comentario, un
enlace o una nota al pie, y dice por qué. Cada edición pregunta igual que `files.delete`. `files history` lista lo que
reemplazaron las ediciones de este perfil, la más reciente al final; cada `version` es el sha256 del contenido
reemplazado, y `available` dice si aún se guarda. Consulta
[edita un archivo con tu agente](./recipes.md#edit-a-file-with-your-agent).

## Salida para scripts

Todos los comandos salvo `mcp serve` aceptan `--json` e imprimen un único valor JSON en stdout. Los errores salen en
JSON por stderr, con un `code` para ramificar, y cada tipo de fallo tiene su propio código de salida. La
[referencia de comandos](./commands.md) los lista.

Siguiente: [búsqueda de documentos](./search.md) o [conexión del agente](./mcp.md).
