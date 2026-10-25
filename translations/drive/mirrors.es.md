---
title: "Sincronizar archivos locales con Google"
---

Un espejo vincula una carpeta local con una carpeta de Google: conservas Markdown o archivos con
tablas en tu ordenador y tus compañeros trabajan en Documentos u Hojas de cálculo de Google.
La sincronización envía cambios locales y recupera las ediciones compatibles de Google.
Si hay un conflicto, lo muestra antes de elegir entre los cambios.

## Cuándo basta un archivo Markdown en Drive

Documentos de Google ya abre archivos `.md` directamente: las personas los leen y editan en Documentos, y el
archivo sigue siendo Markdown. Pon el archivo en Drive con `drive personal files upload` o con la aplicación de
escritorio de Google, y `drive personal sync` lo lee como cualquier otro documento. No hace falta un espejo
cuando editan las personas y el archivo puede cambiar como lo escribe Documentos.

Usa un espejo cuando:

- un programa, o tú desde un editor local, sigue cambiando un documento mientras otras personas lo editan
  también en Google. Google solo permite a los programas cambiar un archivo Markdown sustituyéndolo entero,
  mientras que el Documento de Google de un espejo acepta ediciones pequeñas junto a las suyas;
- los comentarios deben quedar fuera del archivo. Documentos escribe cada comentario dentro del propio
  archivo `.md`, con el nombre y el texto de quien comenta, así que viaja adonde vaya el archivo, también a
  un repositorio git;
- un archivo CSV debe convertirse en una Hoja de cálculo.

Las pruebas en que se basa esto están en cli-testing:
[qué pueden hacer los programas con el archivo](https://github.com/WireCatLabs/cli-testing/tree/main/performance/documents/native-markdown)
y [qué escribe en él una edición en Documentos](https://github.com/WireCatLabs/cli-testing/blob/main/performance/documents/drive-push/README.md#google-docs-own-markdown-editing-2026-10-23).

## Conectar una carpeta

Inicia sesión en el perfil con permiso de escritura de Google y elige la carpeta local y su destino:

```sh
drive personal session start --grant write
drive personal mirrors add ./notes --parent FOLDER_ID
drive personal mirrors list
drive personal mirrors status
drive personal mirrors sync
```

Sustituye `personal` por tu perfil conectado. `FOLDER_ID` es un ID o URL de una carpeta de Google Drive.
Añadir el espejo comprueba el destino y guarda la conexión localmente. La primera sincronización crea
Documentos de Google para `.md` y `.markdown` y Hojas de cálculo para `.csv`, `.tsv` y `.xlsx`.
Las subcarpetas locales se convierten en carpetas de Google. Otros tipos se cuentan como no compatibles.

`mirrors status` examina los archivos locales y el estado guardado sin consultar Google. No puede decirte
si un compañero ha cambiado un documento en línea. `mirrors list` muestra los ID y carpetas de los espejos.
Pasa un ID a `status` o `sync` para elegir un espejo; omítelo para todos los del perfil.

## Sincronizar en ambos sentidos

Tras editar, ejecuta de nuevo `mirrors sync`. Para Markdown, Drive compara bloques con la última
sincronización: puede combinar cambios en partes distintas, y el texto intacto conserva sus comentarios
de Google. Las ediciones de celdas de Google pueden volver a CSV o TSV. Los cambios locales de XLSX
se envían a Hojas de cálculo, pero las ediciones de Google no se escriben de vuelta en XLSX.

Un espejo de una hoja controla el rango que escribió inicialmente. Lo actualiza y conserva las celdas
vecinas y otras pestañas. La primera fila se convierte en una cabecera en negrita y congelada.
Revisa el resultado si importan las fórmulas, el formato o la estructura del libro: el espejo no es
una copia de seguridad completa de documentos de Google.

## Imágenes locales

Una imagen local como `![chart](pics/chart.png)` queda como ese texto en el Documento; una imagen con un enlace
`https://` aparece como imagen. Documentos de Google solo inserta una imagen descargándola desde una dirección web
pública como visitante anónimo, así que un archivo privado, en tu ordenador o en tu Drive, no puede colocarse en
un Documento.

## Elegir un lado tras un conflicto

Si ambos lados cambian la misma parte, la sincronización informa del conflicto y termina con un
resultado parcial. Revisa el archivo local y el documento de Google antes de elegir:

```sh
drive personal mirrors sync MIRROR_ID --keep local
drive personal mirrors sync MIRROR_ID --keep google
drive personal mirrors sync MIRROR_ID --keep both
```

`--keep local` elige el contenido local en conflicto. `--keep google` elige el contenido de Google
cuando puede escribirse de vuelta: Markdown, CSV o TSV. Para Markdown, `--keep both` conserva ambas
versiones; revisa después el texto combinado. Hojas de cálculo no puede conservar dos versiones de
las mismas celdas: elige local o Google. Un espejo XLSX cuya hoja cambió exige `--keep local`.

Un Documento con sugerencias pendientes se rechaza incluso con `--keep`: acéptalas o recházalas
primero en Google y vuelve a intentarlo. Los cambios fuera de los bloques Markdown compatibles
pueden necesitar revisión manual.

## Borrado y detención

Borrar un archivo local no envía su copia de Google a la papelera. Borrar un archivo de Google
no elimina el origen local, y la sincronización no lo vuelve a crear en silencio.
Después de revisar lo que se borró, usa:

```sh
drive personal mirrors sync MIRROR_ID --replace
```

`--replace` elige el lado local y vuelve a crear los archivos que faltan en Google.
No puede combinarse con `--keep google` ni `--keep both`. Renombrar o mover puede dejar la copia
antigua de Google; revisa las copias huérfanas indicadas en vez de esperar que se propaguen los borrados.

Para dejar de sincronizar sin borrar archivos locales ni de Google:

```sh
drive personal mirrors remove MIRROR_ID
```

El espejo no importa el destino al buscador. Para buscar estos archivos de Google sin conexión,
elige por separado el destino con `folders add` y ejecuta `sync`, como explica [importar y organizar](./usage.md).
Para el acceso del agente de solo lectura, consulta [permisos](./security.md#google-access-and-command-permissions).
