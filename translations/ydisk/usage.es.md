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
6. [Trabaja con archivos en vivo](#work-with-files-live)
7. [Salida para scripts](#output-for-scripts)

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
borrado en el Disk sale de la copia. Un archivo movido dentro de las carpetas elegidas conserva sus etiquetas y notas.

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
ydisk personal files publish /Documents/plan.pdf
ydisk personal files unpublish /Documents/plan.pdf
```

- `files download` sin `--output` responde con el texto del archivo, hasta 200 000 caracteres, para que un agente lea
  un archivo fuera de las carpetas elegidas sin guardarlo.
- `files delete` mueve un archivo a la papelera del Disk y `files restore` lo devuelve por su ruta en la papelera.
- `files publish` crea un enlace público que puede abrir cualquiera que lo tenga. `files unpublish` lo cierra.
- `--replace` en una subida, una copia o un movimiento sobrescribe un archivo que ya está en esa ruta.

En un terminal, la herramienta pregunta antes de borrar, sobrescribir o crear un enlace público. Por MCP no hay nadie
a quien preguntar, así que define esos permisos para un agente. Consulta los [ajustes](./configuration.md#permissions).
Añade `--dry-run` a cualquier cambio para ver qué haría sin hacerlo.

Cada operación de la API de Disk de Yandex es también un comando: `ydisk personal api list` las lista y
`ydisk personal api show resources-list` muestra los parámetros de una operación sin llamar a Yandex.

## Salida para scripts

Todos los comandos salvo `mcp serve` aceptan `--json` e imprimen un único valor JSON en stdout. Los errores salen en
JSON por stderr, con un `code` para ramificar, y cada tipo de fallo tiene su propio código de salida. La
[referencia de comandos](./commands.md) los lista.

Siguiente: [búsqueda de documentos](./search.md) o [conexión del agente](./mcp.md).
