---
title: "Historial de cambios"
---

Cambios notables en `@wirecat/yandex-disk-cli`. Una sección por versión, las más nuevas arriba.

## 0.7.1 — 25.11.2026

### Corregido

- **Ahora se lee el escaneo de una página tumbada de lado.** El OCR local (`read_scans: local`) gira antes la página,
  así que la búsqueda encuentra su texto en lugar de que salga ilegible. Los escaneos leídos antes se leen otra vez,
  una sola vez, en la siguiente sincronización. Sin los datos de orientación de tesseract
  (`apt install tesseract-ocr-osd`) un escaneo se lee como antes, y la sincronización avisa con
  `document.scan-unturned` (cli-core 0.750.0, antes 0.742.0, consulta
  [escaneos e imágenes](./usage.md#scans-and-pictures)).
- **En la ejecución de un agente programado, todo el texto de una respuesta de `api` se marca como no fiable**,
  también los ids, no solo los nombres y las rutas (cli-core 0.746.0). Un id marcado que un agente copia en su
  siguiente comando sigue funcionando: la ejecución le quita la marca.

## 0.7.0 — 24.11.2026

### Añadido

- **Una sincronización lee el texto de escaneos e imágenes** (cli-core 0.742.0, antes 0.739.0). Un PDF sin capa de
  texto y una imagen JPEG, PNG o WebP se leen con OCR, elegido por el `read_scans` del perfil: `local` por defecto
  (el programa `tesseract` en tu ordenador, ruso e inglés, sin descargar nada), `anthropic` u `openai` (el modelo de
  `ai set` en la dirección propia de ese proveedor, con imágenes permitidas, cada página se le envía y se paga por
  página) u `off`. Como mucho 20 páginas por archivo y 100 por sincronización. Un escaneo que un ydisk anterior
  guardaba por su nombre se lee en la siguiente sincronización, y una sincronización sin `tesseract` dice cómo
  instalarlo ([escaneos e imágenes](./usage.md#scans-and-pictures)).
- **Se leen más formatos** (cli-core 0.739.0, antes 0.737.0): Word 97–2003 `.doc`, PowerPoint `.pptx`, OpenDocument
  `.odt`, `.ods` y `.odp`, RTF, HTML y EPUB, además de PDF, `.docx`, `.xlsx`, CSV, TSV, texto plano y Markdown. Un
  archivo que una versión anterior guardaba solo por su nombre se lee en la siguiente sincronización
  ([el uso](./usage.md#what-the-copy-holds)).
- **Una sincronización lista cuatro carpetas del Disk a la vez**, así que sincronizar muchas carpetas tarda menos.
  Se mantiene dentro de las 120 peticiones por minuto que ydisk envía a Yandex.
- **`files sheets create` crea varias hojas, fórmulas y celdas en negrita.** `--values` también acepta
  `[{"name": "Budget", "header": true, "rows": [...]}]`, y una celda puede ser `{"formula": "SUM(B2:B3)"}` o
  `{"value": "Total", "bold": true}`. Un texto que empieza por `=` sigue siendo texto. Las filas como antes siguen
  funcionando ([comandos](./commands.md)).
- **`files documents create` crea texto en negrita y cursiva y tablas.** `--payload` también acepta
  `{"text", "bold", "italic"}`, `{"runs": [...]}` y `{"table": [["Item", "Cost"], ["Rent", "950"]], "header": true}`.
  `[{"text", "style"}]` sigue funcionando ([comandos](./commands.md)).

### Cambiado — puede romper llamadas

- **Un archivo sin enlace público se reemplaza bajo la propia comprobación del Disk.** `files update`,
  `files sheets update`, `files documents update`, `files restore <path> <version>` y el envío de un archivo cambiado
  por un espejo suben el contenido nuevo a un archivo oculto junto a él, mueven el archivo viejo a la papelera del
  Disk con el contenido que se leyó (el Disk lo rechaza con 409 si el archivo cambió desde entonces) y dan al archivo
  oculto su nombre. Antes, el archivo se leía justo antes de la subida, y un cambio en ese momento se sobrescribía.
  Ahora el archivo recibe un `resource_id` nuevo, y el historial de versiones propio del Disk para él empieza de
  nuevo. El contenido viejo queda en la papelera del Disk, que según la ayuda de Yandex ocupa espacio durante 30 días.
  Su copia sincronizada pasa al id nuevo, así que sus etiquetas, las notas sobre él y sus enlaces lo siguen. Si no se
  puede llegar al almacén local, la escritura se hace igual, con un aviso. Un archivo con enlace público se sigue
  sobrescribiendo en su sitio después de leerlo, así que su enlace se mantiene ([el uso](./usage.md#edit-a-file-on-the-disk), [espejos](./mirrors.md#how-a-file-on-the-disk-is-replaced)).

### Corregido

- **Un agente programado lee marcados los nombres, rutas y textos del Disk de otras personas.** En una ejecución
  bloqueada en solo lectura con una marca (`YDISK_READ_ONLY=1` y `YDISK_UNTRUSTED_MARK`), `files list`, `files show`
  y `files download` marcan cada nombre, ruta y texto leído, `mirrors preview` cada ruta planeada y destino de
  renombrado, y las operaciones del grupo `api` los nombres y rutas de la respuesta en bruto. Los archivos de una
  carpeta compartida los nombra y escribe quien la comparte. Los comandos compartidos de cli-core (`documents`,
  `search`, `folders list|browse`, `catalog`, `files sheets|documents show`, `mirrors
  conflicts show`) ya marcaban los suyos. Fuera de una ejecución así ninguna respuesta cambia. Una ruta marcada se
  pasa de vuelta a un comando `files` sin las marcas. Aún sin marcar: `mirrors conflicts list` (de cli-core) y
  `files serve`, que muestra el Disk como una carpeta y no como una respuesta.
- Requiere `@wirecat/cli-core` 0.742.0 y `@wirecat/cli-base` 0.132.0.

## 0.6.0 — 24.11.2026

### Añadido

- **Archivos nuevos de Excel y Word** (cli-core 0.737.0, antes 0.724.0). `files sheets create <path> --values <json rows>`
  crea un `.xlsx` nuevo, y `files documents create <path> --payload <json paragraphs>` un `.docx` nuevo. Cada uno
  escribe solo un archivo nuevo, rechaza una ruta que ya existe (`office.file-exists`) y responde el `sha256` que
  `update` toma después ([edita un archivo en el Disk](./usage.md#edit-a-file-on-the-disk)).

### Corregido

- **`mirrors conflicts resolve` se ejecuta dentro de la ejecución del comando.** Ahora `--timeout` lo limita,
  `--record` guarda una ejecución para él y sus peticiones al Disk están en esa ejecución. Antes llegaba al Disk
  fuera de toda ejecución.
- **Los archivos sincronizados y editados guardan sus versiones anteriores durante `keep_versions_for_days`.** Los
  almacenes de versiones de los espejos, y el que usan `files update`, `history` y `restore`, borraban las versiones
  a los 30 días, dijera lo que dijera el ajuste. Ahora las guardan durante el `keep_versions_for_days` del perfil, un
  año por defecto, como dicen los [ajustes](./configuration.md#other-settings).
- **Una edición de Office rechazada dice por qué.** Una celda con fórmula, un formato equivocado o una hoja que falta
  ahora responden con su propio motivo, como `office.formula-cell`, en lugar de `input.invalid`.
- **La documentación dice dónde revocar el token de Yandex.** `session end` quita el token solo de este ordenador, y
  sigue siendo válido en Yandex. [La seguridad](./security.md#revoke-the-token-at-yandex), la
  [guía de instalación](./installation.md) y [la solución de problemas](./troubleshooting.md) ahora nombran la
  página de acceso a datos ([«Доступ к данным»](https://id.yandex.ru/personal/data-access)) de Yandex ID, donde
  quitas la aplicación para revocarlo.
- **`changes --since <time>` y `--until <time>` en la ayuda** (cli-core 0.724.0, antes 0.722.0, y cli-base 0.130.0,
  antes 0.128.0). `--until` decía `<when>`. Los flags aceptan los mismos valores que antes. El vocabulario ahora
  conoce `changes`, `--since` y `--event`, así que la revisión de comandos ya no necesita excepciones para ellos.
- **`session end` dice dónde revocar el token.** Su ayuda decía que el token sigue siendo válido en Yandex, pero no
  dónde revocarlo. Ahora nombra la página de acceso a datos
  ([«Доступ к данным»](https://id.yandex.ru/personal/data-access)) de Yandex ID, donde quitas la aplicación para la que se emitió el token.

## 0.5.0 — 23.11.2026

### Añadido

- **Versiones anteriores de cada archivo sincronizado y un registro de cambios** (cli-core 0.722.0, antes 0.711.0;
  cli-base 0.128.0, antes 0.122.0). La sincronización guarda el texto, el título y el front matter de un documento
  antes de cada cambio y antes de que salga de la copia. `documents history <document>` lista las versiones y
  `--revision <n>` muestra una. `changes --since 1d` lista lo que se añadió, cambió, dejó de estar visible o volvió.
  Ambos leen la copia, así que los agentes también los tienen por MCP ([el uso](./usage.md#earlier-versions-and-what-changed)).
- **`keep_versions_for_days`, 365 por defecto**, para un perfil o `defaults`. Una sincronización que termina su pasada
  borra las versiones y las filas del registro de cambios más antiguas ([ajustes](./configuration.md#other-settings)).
- **Edita un archivo en el Disk, donde está.** `files update` reemplaza todo el texto de un archivo de texto,
  `files sheets show` y `files sheets update` leen y escriben las celdas de un `.xlsx`, y `files documents show` y
  `files documents update` leen y cambian los párrafos de un `.docx`, sin tocar el resto del archivo. Cada edición
  toma el `sha256` del archivo como `--expected-fingerprint` y pregunta igual que `files.delete`. El archivo se
  comprueba justo antes de escribir, y lo que se reemplazó se guarda en este ordenador; un archivo que cambió desde
  que se leyó es un `conflict`, y no se sube nada. `files history` lista lo que reemplazaron las ediciones, y
  `files restore <path> <version>` devuelve una versión. Consulta
  [edita un archivo en el Disk](./usage.md#edit-a-file-on-the-disk) y
  [edita un archivo con tu agente](./recipes.md#edit-a-file-with-your-agent).
- **Un espejo fusiona un archivo de texto cambiado en los dos lados.** Un archivo `.md`, `.markdown`, `.txt`, `.csv` o `.tsv` de
  hasta 1 MB editado aquí y en el Disk en sitios distintos se fusiona línea a línea y se escribe en los dos lados; la
  respuesta lo incluye en `merged`. Los cambios en la misma línea o en líneas vecinas siguen siendo un conflicto.
  Consulta [un archivo cambiado en los dos lados](./mirrors.md#a-file-changed-on-both-sides).
- **`mirrors conflicts list|show|resolve`.** Muestra cada conflicto que dejó una sincronización, sus tres versiones y
  las líneas en conflicto, y lo resuelve en los dos lados a la vez con `--keep local|disk|both` o con el archivo final
  (`--file`, solo para ti). Si un lado cambió desde entonces, se rechaza sin escribir nada.
- **`mirrors sync --allow-replacements <count>`** permite que una ejecución reemplace hasta ese número de archivos
  existentes cuando la protección la detiene; `--replace` sigue permitiendo cualquier número.
- **La sincronización de todo el Disk sigue la lista donde se detuvo la ejecución anterior.** Un Disk demasiado grande
  para listarlo en una ejecución se lista en varias, así que cada ejecución dura lo habitual; la respuesta de una
  ejecución detenida dice que la vuelvas a ejecutar en lugar de pedir más tiempo, y `listed` muestra `resumed` y
  `so_far`. El espejo de una carpeta sigue listando desde el principio en cada ejecución.
- **`files restore`** acepta una versión de `files history`, además de una ruta en la papelera.
- Requiere `@wirecat/cli-core` 0.722.0 y `@wirecat/cli-base` 0.127.0.
- **`files show` y `files list` dan el `md5` y el `sha256` de cada archivo**, para que un agente sepa si un archivo
  cambió desde que lo leyó. `files download` da el `sha256` solo junto al texto completo del archivo: un texto que
  cortó o que extrajo de un PDF, un docx o un xlsx tiene `sha256: null`, así que no se puede escribir de vuelta sobre
  el archivo.
- **Un texto cortado lo dice en la ayuda y en el terminal.** `files download` sin `--output` sigue respondiendo con
  200 000 caracteres como mucho y `truncated: true`; su ayuda, [el uso](./usage.md) y un aviso en el terminal ahora
  dicen que nunca escribas un texto cortado sobre el archivo.

### Corregido

- **Un archivo que la sincronización ya no encuentra conserva su texto.** Sale de las listas y de la búsqueda, se
  marca como ya no visible y vuelve tal como estaba cuando el Disk lo muestra de nuevo. Antes, la sincronización
  vaciaba su texto como si se hubiera borrado, aunque el Disk no puede decirle si fue un borrado, un traslado o un
  recurso compartido perdido.

## 0.4.0 — 19.11.2026

### Añadido

- **Espejo de todo el Disk.** `mirrors add / ~/YandexDisk` guarda todo el Disk en una carpeta propia, leído con la
  lista plana de archivos de Yandex, hasta 100 000 archivos. Consulta [todo el Disk](./mirrors.md#the-whole-disk).
- **Dejar carpetas fuera de un espejo.** `mirrors add --ignore <path>` (repetido, una ruta o un patrón) y
  `mirrors update <id> --ignore <path>…` amplían la lista, y `--clear` la vacía primero. Una ruta ignorada nunca se
  borra en ningún lado: ignorarla no manda nada a la papelera, y una que deja de ignorarse se sincroniza como una
  carpeta nueva. Consulta [deja carpetas fuera](./mirrors.md#leave-folders-out).
- **Una sincronización comprueba primero el espacio libre.** Se detiene con `mirror.no-space` cuando sus descargas y
  las versiones que guarda dejarían demasiado poco libre: una décima parte de lo que escribe, al menos 100 MB y como
  mucho 1 GB.
- **`ydisk <profile> files serve [path]` muestra una carpeta del Disk, o todo el Disk, como una carpeta de solo
  lectura en este ordenador.** Sirve la carpeta por WebDAV en 127.0.0.1 tras una dirección aleatoria creada en cada
  ejecución, y el cliente propio del sistema la monta: `gio mount` en Linux, Finder en macOS, `net use` en Windows. A
  través de ella nada puede escribir, renombrar ni borrar en el Disk. Funciona hasta Ctrl-C, nunca se ofrece a los
  agentes por MCP y se rechaza donde `files.download` está denegado ([montar](./mount.md)).

### Cambiado — puede romper llamadas

- **Muchos cambios a la vez siempre esperan tu aprobación.** Una sincronización se detiene antes de más de 10 borrados
  o más de 50 reemplazos de archivos existentes, sea cual sea el tamaño del espejo (antes pasaban 40 borrados de 1000
  archivos). El error nombra las cifras y el comando exacto; `--replace` se une a `--allow-deletions`, los dos solo
  para ti, nunca para un agente por MCP, y los dos necesitan el id del espejo cuando tienes más de uno. Un espejo
  detenido ya no frena a los demás, y `mirrors watch` informa de la parada en cada ciclo que sincroniza el espejo.
  Consulta [muchos cambios a la vez](./mirrors.md#many-changes-at-once).
- **Un borrado en un Disk con actividad sigue demostrándose.** Un archivo que falta en la lista se borra aquí solo
  cuando el Disk, al que se pide por su ruta después de la lista, no tiene nada allí. La lista ya no se lee hasta tres
  veces mientras el Disk cambia, así que un móvil que sube fotos ya no bloquea todos los borrados.
- **La carpeta personal nunca se sincroniza con un espejo**, aunque las carpetas propias de la CLI estén fuera de ella.
- Requiere `@wirecat/cli-core` 0.711.0.

### Corregido

- `mirrors add` rechaza la raíz de una unidad en Windows, como `D:\`, incluso en una unidad sin carpeta personal.
- `mirrors sync` ya no falla a los 30 segundos en un Disk grande. Puede durar 15 minutos en una terminal y 45 segundos
  para un agente, se detiene antes por su cuenta, conserva lo hecho y responde parcial: cada espejo dice cuántos
  archivos del Disk listó y si la lista estaba completa, y `next` nombra la ejecución que sigue. Una lista cortada no
  borra nada: los archivos del Disk a los que no llegó se cuentan en `unlisted`.
- `mirrors preview` puede listar 5 minutos en una terminal y 45 segundos para un agente, y falla con `timeout` y el
  plan cortado cuando la lista no cabe.
- Una página de la lista de todo el Disk puede tardar 2 minutos en vez de 30 segundos.

## 0.3.0 — 19.11.2026

### Añadido

- **Espejos: una carpeta local y una del Disk iguales, en ambos sentidos.** `mirrors add <disk folder> <local folder>`,
  y luego `mirrors sync`, o `mirrors watch` para seguir sincronizando. Un cambio en un lado se copia al otro; un
  archivo cambiado en los dos lados se informa y se resuelve con `--keep local|disk|both`. Un borrado va a la papelera
  del otro lado, la del Disk o `.wirecat-trash/` en la carpeta, y solo cuando la sincronización puede demostrarlo: un
  archivo que falta en una lista incompleta, o en una carpeta que se reemplazó, nunca se borra. `mirrors preview`
  muestra el plan, y una ejecución que borraría muchos archivos espera a `--allow-deletions`. Consulta
  [espejos](./mirrors.md).
- `mirrors versions list|restore`: la versión que una sincronización reemplazó o borró, en tu ordenador o en el Disk,
  se guarda 30 días y se puede devolver.

### Corregido

- `folders list` nombra cada carpeta elegida y da su ruta en el Disk, no solo su id.
- `api public-settings-update` ya no informa de una escritura que no pudo confirmar cuando el Disk responde sin cuerpo.
- Los pasos del token sugieren un nombre de aplicación como `My laptop`.

## 0.2.0 — 18.11.2026

### Añadido

- `ydisk store info` muestra el archivo del almacén compartido, su tamaño, su formato y el número de filas, así que
  WireCat Desktop puede decir si Yandex Disk lo lee.
- `ydisk <profile> account remove --keep-data|--delete-data` cierra la sesión del perfil y lo olvida en este
  ordenador. Conserva o borra las carpetas elegidas y los archivos sincronizados, según lo que elijas.
- `folders browse` da a cada carpeta un `kind` y un `has_children`. Yandex no da el número de elementos hijos, así que
  se mira dentro de cada carpeta, con una petición cada una, cuando el nivel tiene 20 carpetas o menos. Con más,
  `has_children` es `null`.

### Corregido

- Publicado desde GitHub Actions con la procedencia de npm (provenance), así que WireCat Desktop lo instala: Desktop se
  niega a instalar una versión de una herramienta integrada que no compiló el workflow de su propio repositorio, y la
  0.1.0 se publicó desde un ordenador.
- **Las guías cubren lo que hace la herramienta, paso a paso.** Páginas nuevas: [búsqueda de documentos](./search.md)
  (palabras, formas de las palabras, significado, nombres de archivo), [conexión del agente](./mcp.md) (el skill,
  `mcp add`, `mcp config`, aplicaciones del navegador y qué puede cambiar un agente), [recetas](./recipes.md) y
  [comparación con otras herramientas](./compare.md). [Instala e inicia sesión](./installation.md) explica cómo
  conseguir el token de Yandex con los nombres que usa el propio Yandex, [la solución de problemas](./troubleshooting.md)
  va por síntomas e incluye los códigos de salida, y [la seguridad](./security.md) dice qué se queda en tu ordenador y
  cómo quitarlo. Los pasos del token ahora nombran el tipo de aplicación "For API access or debugging", como las
  páginas de Yandex.
- La ayuda y el error de `--cursor` en `folders browse` y `files list` nombran `page.next_cursor`, la clave que tiene la
  respuesta, y no `page.next`.

## 0.1.0 — 17.11.2026

### Añadido

- Se empezó desde `@wirecat/cli-template` 0.25.0.
- **Inicio de sesión con un token OAuth de Yandex** pegado una sola vez: `session start` lo lee oculto o desde stdin,
  lo comprueba con `GET /v1/disk` y lo guarda en el llavero del sistema. `session status --check` y `doctor --online`
  dicen de quién es.
- **Carpetas elegidas del Disk como texto en el que buscar**: `folders add <path>`, `sync`, `status`,
  `documents list|show|export`, `search`, `catalog`, etiquetas, notas y recuerdos, los comandos compartidos de
  documentos de cli-core. Cada sincronización recorre de nuevo las carpetas elegidas (la API del Disk no tiene un
  registro de cambios) y lee solo los archivos cuyo MD5 cambió. Un archivo movido conserva su id, sus etiquetas y sus
  notas. El texto sale de PDF, docx, xlsx, CSV, TSV, texto y Markdown. Las horas se guardan y se responden en UTC.
- **Los archivos en vivo**: `files list|show|download|upload|copy|move|create|delete|restore|publish|unpublish`, por
  ruta del Disk. `files delete` envía a la papelera. `--replace` y `files delete` preguntan como lo hace
  `files.delete`, `files publish` como lo hace `files.share`, y `--dry-run` muestra cada clave que comprueba la
  escritura. `files publish` responde con el enlace público, o deja fuera `public_url` cuando no puede leerlo de
  vuelta. Las descargas y las subidas van a la dirección que da Yandex, sin el token.
- **`api`**: un comando por cada operación de la descripción Swagger 1.2 de Yandex, 20 en total. Se dejan fuera las
  tres que responden con un enlace de descarga o de subida, y los enlaces `file`, `preview` y `sizes` de un recurso se
  quitan de cada respuesta. `--all` pasa las páginas donde la API las pagina. Un borrado permanente, `overwrite=true` y
  un enlace público preguntan según `files.delete` y `files.share`. Una operación que hace lo que hace un comando de
  `files` comprueba también la clave de ese comando: `files.move: deny` detiene también `api resources-move`, en la
  ejecución y en `--dry-run`.
