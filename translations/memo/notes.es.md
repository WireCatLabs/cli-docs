---
title: "Notas y carpetas"
---

Esta página te ayuda a traer tus notas a Memo y a guardar ahí tus propias notas. Puedes añadir una
carpeta de archivos Markdown o una bóveda de Obsidian, buscar en sus documentos y escribir notas sobre
personas, mensajes y proyectos. Memo solo lee tus carpetas: escribe un archivo solo cuando exportas
tus notas.

Hay dos tipos de notas:

- **Notas de tus archivos.** Memo las lee de una carpeta que tú eliges. Para cambiar una, edita el
  archivo e impórtalo de nuevo. Sus referencias tienen esta forma: `document:3`.
- **Notas que escribes en Memo.** Viven en el almacén local y pueden tratar sobre una persona, un
  mensaje, un proyecto u otra nota. Sus referencias tienen esta forma: `note:12`.

## Añadir una carpeta

Una carpeta puede ser cualquier carpeta de notas de tu ordenador: notas de proyecto, una carpeta de
documentos o una bóveda de Obsidian. Memo lee la carpeta y todas las carpetas que contiene.

**Lo más fácil: pídeselo a tu agente.**

```text prompt
Use memo CLI to add my notes folder at /path/to/notes and import it.
Tell me how many notes it found and which files it could not read.
```

**O ejecuta tú los comandos.** Sustituye `/path/to/notes` por la ruta completa de tu carpeta.

Para una carpeta de archivos Markdown normales:

```sh
memo folders add /path/to/notes --format markdown
memo notes import --no-embed
```

Para una bóveda de Obsidian:

```sh
memo folders add /path/to/vault --format obsidian
memo notes import --no-embed
```

`memo folders add` muestra el ID de la carpeta, por ejemplo `1`. `memo notes import` lee las notas y
dice cuántas ha encontrado:

```text
/path/to/notes: 24 notes, 24 changed, 0 moved, 0 gone
```

`--no-embed` se salta la preparación para la búsqueda por significado, así que no necesitas el modelo
de búsqueda para empezar. Vuelve a ejecutar `memo notes import` después de añadir o editar archivos;
solo se leen los cambios.

Puedes añadir más de una carpeta. `memo folders list` las muestra todas.

### Markdown u Obsidian

El formato le dice a Memo cómo se escriben los enlaces y las etiquetas en tus notas. No necesitas
Obsidian para usar Memo, y Obsidian no tiene que estar abierto.

| | `markdown` | `obsidian` (el predeterminado) |
|---|---|---|
| Enlaces a otras notas | Enlaces Markdown al archivo (abajo) | `[[Other note]]`, `[[Other note\|label]]`, también con `#heading` |
| Etiquetas | el campo `tags:` al principio del archivo | el campo `tags:` y `#tags` en el texto |
| Otros nombres para una nota | | el campo `aliases:` |

Un enlace en una carpeta `markdown` tiene este aspecto:

```md
[label](other-note.md)
```

En una carpeta `markdown`, una `#word` en el texto no es una etiqueta. Los dos formatos entienden los
enlaces escritos como referencias, como `[Kai](person:7)` o un simple `msg:telegram/1/77/42`.

Una **bóveda de Obsidian** es una carpeta de notas Markdown que Obsidian abre como un solo espacio de
trabajo. Memo omite las carpetas ocultas, como `.obsidian`.

### Archivos que Memo puede leer

| Archivos | Extensiones | Qué guarda Memo |
|---|---|---|
| Texto y Markdown | `.txt`, `.md`, `.markdown` | El texto, los enlaces y las etiquetas |
| Tablas | `.csv`, `.tsv`, `.xlsx`, `.ods` | Los valores de las celdas, con la hoja, la fila y la columna |
| Documentos, presentaciones y libros electrónicos | `.odt`, `.pptx`, `.epub` | El texto, sin el diseño |
| PDF y Word | `.pdf`, `.docx` | El texto, con los números de página del PDF. Necesita los lectores opcionales de abajo |

Para leer archivos PDF y Word, instala los dos lectores opcionales junto a Memo:

```sh
npm install -g unpdf mammoth
```

Algunos archivos no se pueden leer: los PDF escaneados (imágenes de páginas, sin texto dentro), los
archivos antiguos `.doc` y `.xls`, y los archivos de más de 50 MB. Memo guarda hasta 200 000
caracteres de cada archivo. El informe de la importación muestra cada archivo que no pudo leer y el
motivo, así que un archivo que falta nunca queda fuera de la búsqueda sin aviso.

### Omitir algunos archivos

Para dejar algunos archivos fuera de Memo, ponlos en `notes.ignore` en el
[archivo de configuración](./configuration.md#notes). Una regla es una ruta dentro de la carpeta, una
carpeta (se omite todo lo que contiene) o un patrón:

```json
{ "notes": { "ignore": ["Journal/Private.md", "Archive", "**/Private*"] } }
```

`memo notes import --ignore Drafts` omite una carpeta solo en una importación.

## Encontrar tus notas

```sh
memo search notes 'budget'
memo search notes 'budget' --tag work
memo notes show document:3
```

Cada resultado muestra el archivo y la primera línea que coincide. `memo notes show` muestra una nota
con sus etiquetas, las notas a las que enlaza y las notas que enlazan a ella. Consulta
[Búsqueda](./search.md) para ver más palabras de búsqueda.

## Escribir tus propias notas

Una nota que escribes en Memo puede tratar sobre una persona, un mensaje, un proyecto u otra nota.
Escribirla no envía nada a nadie y no cambia el mensaje del que trata.

```text prompt
Use memo CLI to save a note that Kai Sample prefers morning meetings, linked to Kai on Telegram.
Show me the saved note.
```

O hazlo tú:

```sh
memo notes add 'Prefers morning meetings' --about telegram:'Kai Sample'
memo notes list --about telegram:'Kai Sample'
```

`--about` indica de qué trata la nota. Úsalo más de una vez para varios temas:

| Sobre | Escribe |
|---|---|
| Una persona en un servicio de mensajería | `telegram:'Kai Sample'`, `max:'Kai Sample'` o `email:kai@example.com` (un nombre o un ID) |
| Un mensaje | su referencia, como `msg:telegram/1/77/42` |
| Una nota o un archivo | `note:12` o `document:3` |
| Una persona, organización, proyecto o tarea | `person:…`, `organization:…`, `project:…`, `task:…` |

Copia las referencias de los resultados de búsqueda; no las escribas de memoria. La persona, el
mensaje o la nota ya tienen que estar en el almacén local.

### Leer, editar y quitar una nota

```sh
memo notes show note:12
memo notes edit 12 --revision 1 --text 'Prefers early morning meetings'
memo notes remove 12
```

Cada nota tiene un número de **revisión** que sube con cada edición. `memo notes edit` pide la
revisión actual, que te da `memo notes show note:12 --json`. Si alguien o algo editó la nota mientras
tanto, los números no coinciden y Memo rechaza la edición, así que no se pierde ningún cambio. Vuelve
a leer la nota e inténtalo otra vez.

Una nota que viene de un archivo se edita en el archivo, no con `memo notes edit`.

### Guardar tus notas como archivos

```sh
memo notes export --to /path/to/vault/memo --format obsidian
```

La exportación escribe las notas que escribiste en Memo como archivos Markdown en la carpeta que
elijas. Usa `--format markdown` para Markdown sencillo. Cada archivo lleva un `memo-id` y un
`memo-hash` al principio, así que importar esa carpeta no crea la misma nota dos veces. Si editaste
tú un archivo exportado, Memo no lo sobrescribe y te avisa. Para exportar una nota en el momento de
escribirla, añade `--export` a `memo notes add` o `memo notes edit`.

## La nota sobre una persona

Puedes decirle a Memo qué archivo es la nota principal sobre una persona, por ejemplo `People/Kai.md`
en tu bóveda:

```sh
memo note telegram:'Kai Sample' /path/to/vault/People/Kai.md
memo note telegram:'Kai Sample'           # shows which note it is
memo note telegram:'Kai Sample' --clear   # forgets it
```

Antes tienes que importar el archivo. Después, la nota y las notas que enlazan a ella aparecen en
[el contexto de la persona](./people.md#everything-about-a-person). Si dos personas comparten el
nombre, Memo se niega y muestra sus IDs para que elijas.

## Usar las mismas notas en otro ordenador

Si tus notas se sincronizan con otro ordenador, conecta allí el mismo ID de carpeta en lugar de añadir
una carpeta nueva:

```sh
memo folders list                                  # shows the folder IDs the local store has
memo folders attach 1 /other/path/to/notes
```

Con el mismo ID, las notas conservan sus enlaces y sus etiquetas en los dos ordenadores.

Siguiente: [etiqueta tus notas](./tags.md) o [busca en ellas](./search.md).
