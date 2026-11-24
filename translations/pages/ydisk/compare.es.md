---
title: "Comparación con otras herramientas"
---

Elige una herramienta para tu Yandex Disk según el trabajo que quieres hacer: encontrar un documento por lo que dice,
dejar que un agente de IA cambie una nota, una hoja de cálculo o un documento de Word sin tocar el resto, mantener una
carpeta igual en tu ordenador y en el Disk, o hacer copia de seguridad de carpetas enteras. Esta página reúne esos
trabajos y muestra qué herramienta hace cada uno. Las marcas de `ydisk` vienen de la versión 0.7.0, y las de las demás
herramientas vienen de su propia documentación y su código. Las filas de una edición que se rechaza si el archivo
cambió, de recuperar lo que reemplazó una edición y de leer el texto de los archivos se comprobaron el 24 de noviembre
de 2026. Las demás marcas de `ydisk` y las filas de edición de archivos y
de archivos cambiados en los dos lados se comprobaron el 23 de noviembre de 2026, las filas de todo el Disk, la carpeta
montada y muchos cambios a la vez el 21 de noviembre de 2026, las demás filas de sincronización de carpetas el 19 de noviembre de 2026, y el resto el 17
de noviembre de 2026. Una herramienta puede hacer más de lo que dicen sus páginas, y esas celdas llevan ➖.

**En esta página:**

1. [Qué hace cada herramienta](#what-each-tool-does)
2. [Cuándo encaja mejor otra herramienta](#where-another-tool-fits-better)
3. [Comparación con un agente que usa la web del Disk](#compared-with-a-browser-agent)
4. [Instalación y licencia](#install-and-licence)
5. [Cómo se comprobó cada marca](#how-each-mark-was-checked)

✅ sí · 🟡 en parte · ❌ no · ➖ no está en su documentación · n/a no aplica

Las herramientas:

- **ydisk**: esta herramienta. Una línea de comandos y un servidor MCP que copian en tu ordenador el texto de las
  carpetas del Disk que tú eliges, para buscar en él, mantienen iguales en tu ordenador y en el Disk las carpetas que
  elijas, y trabajan con los archivos del Disk en directo. El propio Disk comprueba la edición de un archivo en el
  momento de escribirla.
- **[MCP de Yandex Disk](https://yandex.ru/dev/yandex-360/mcp/ru/disk)**: el servidor MCP propio de Yandex, que
  funciona en Yandex. Su aplicación de IA se conecta a él por internet. Es una versión preliminar para cuentas con
  una suscripción de pago a Yandex 360.
- **[rclone](https://rclone.org/yandex/)**: una línea de comandos que copia, sincroniza y monta archivos entre tu
  ordenador y Yandex Disk u otros muchos almacenamientos.
- **[Yandex Disk para Linux](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)**: el cliente de consola
  oficial de Yandex. Mantiene una carpeta de tu ordenador sincronizada con el Disk.
- **[yandex-disk-mcp](https://github.com/gorokhovdenis/yandex-disk-mcp)**: un servidor MCP de código abierto que
  ejecutas en tu ordenador con tu propio token, pensado para subidas y descargas grandes.

No están en la tabla: la biblioteca de Python [yadisk](https://github.com/ivknv/yadisk), para quien escribe sus
propios scripts, y [yandex-workspace-mcp](https://github.com/denis-samatov/yandex-workspace-mcp), un servidor MCP nuevo
para Disk y Wiki que por defecto solo lee y cuyo README dice que una ejecución correcta de CI no demuestra una comprobación real, que es opcional.

Existen otros servidores MCP pequeños para Yandex Disk, como [Patr56/yadisk-mcp](https://github.com/Patr56/yadisk-mcp) y
[Antiloop-git/yandex-disk-mcp](https://github.com/Antiloop-git/yandex-disk-mcp). La línea de comandos
[ydcmd](https://github.com/abbat/ydcmd) lista, sube y sincroniza archivos, y un
[issue abierto](https://github.com/abbat/ydcmd/issues/59) cuenta que dejó de funcionar. El registro oficial de MCP no
listaba ningún servidor de Yandex Disk el 17 de noviembre de 2026.

<a id="what-each-tool-does"></a>

## Qué hace cada herramienta

| Trabajo | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|:-:|:-:|:-:|:-:|:-:|
| **Encontrar un documento** | | | | | |
| Encontrar un documento por las palabras que contiene | ✅ | ✅ | ❌ | ❌ | ❌ |
| Encontrar un documento por significado, no solo por sus palabras | ✅ | ➖ | ❌ | ❌ | ❌ |
| Buscar en tus documentos sin internet | ✅ | ❌ | 🟡¹ | 🟡¹ | ❌ |
| Encontrar un documento junto con tus chats, correo y notas de otros servicios | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leer un archivo** | | | | | |
| Un agente lee el texto de un archivo PDF, Word o Excel | ✅ | 🟡² | ❌ | ❌ | 🟡³ |
| **Trabajar con archivos en el Disk** | | | | | |
| Subir, copiar y mover archivos | ✅ | ✅ | ✅ | 🟡⁴ | ✅ |
| Borrar a la papelera y recuperar un archivo | ✅ | 🟡⁵ | 🟡⁵ | ➖ | 🟡⁵ |
| Crear y cerrar un enlace público | ✅ | ✅ | ✅ | ✅ | ❌ |
| Poner tus propias etiquetas y notas a los documentos | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Editar un archivo en el Disk** | | | | | |
| Un agente edita un archivo, y la edición se rechaza si alguien cambió el archivo desde que el agente lo leyó | ✅⁶ | ❌ | ➖ | ➖ | ❌⁷ |
| Cambiar celdas de un libro de Excel o párrafos de un documento de Word sin perder su formato | 🟡⁸ | ❌ | ❌ | ❌ | ❌ |
| Devolver lo que reemplazó una edición, desde la propia herramienta | ✅⁹ | ❌ | 🟡¹⁰ | ➖ | ❌ |
| **Tu Disk en tu ordenador** | | | | | |
| Guardar en tu ordenador una copia de los propios archivos | ✅¹¹ | ❌ | ✅ | ✅ | 🟡¹² |
| Abrir archivos del Disk en tu gestor de archivos sin descargarlos antes (un montaje) | 🟡¹³ | ❌ | ✅¹⁴ | ❌ | ❌ |
| Sincronizar una carpeta en ambos sentidos: un cambio en cualquier lado llega al otro | ✅ | ❌ | 🟡¹⁵ | ✅ | ❌ |
| Sincronizar todo el Disk, dejando fuera las carpetas que elijas | ✅¹⁶ | ❌ | 🟡¹⁷ | ✅ | ❌ |
| Borrar un archivo en el otro lado solo cuando seguro que se borró, y si no, no borrar nada | ✅ | n/a | 🟡¹⁸ | ➖ | n/a |
| Detenerse antes de muchos borrados o sobrescrituras a la vez, hasta que los permitas | ✅¹⁹ | n/a | 🟡²⁰ | ➖ | n/a |
| Guardar los archivos borrados y reemplazados, y recuperarlos | ✅ | n/a | 🟡²¹ | ➖ | n/a |
| Fusionar las ediciones hechas en los dos lados de un archivo de texto, para que queden las dos | ✅²² | n/a | ❌²³ | ➖ | n/a |
| Resolver un conflicto viendo las diferencias: las dos versiones y las líneas que chocan, y luego elegir una o escribir el texto final | ✅²⁴ | n/a | 🟡²³ | ➖ | n/a |
| **Agentes y seguridad** | | | | | |
| Una aplicación de IA trabaja con tu Disk por MCP | ✅ | ✅ | ❌ | ❌ | ✅ |
| Un agente con terminal lo ejecuta, con salida JSON y una skill | ✅ | n/a | 🟡²⁵ | ❌ | n/a |
| Un agente solo lee hasta que tú permitas cambios | 🟡²⁶ | ➖ | ➖ | n/a | ➖ |
| Permitir o rechazar por separado los borrados y los enlaces públicos | ✅ | 🟡²⁷ | ➖ | n/a | ➖ |
| Un agente sincroniza una carpeta, pero no borra ni reemplaza archivos | ✅²⁸ | n/a | ➖ | n/a | n/a |
| Ver qué haría un cambio antes de hacerlo | ✅ | ➖ | ✅ | ➖ | ➖ |
| Usarlo desde Claude o ChatGPT en el navegador | ✅ | ➖ | ❌ | ❌ | ❌ |
| **Instalación** | | | | | |
| Funciona con una cuenta gratuita de Yandex | ✅ | ❌ | ✅ | ✅ | ✅ |
| Entrar sin registrar tu propia aplicación en Yandex | ❌ | ✅ | ✅²⁹ | ✅ | ❌ |

¹ Los dos guardan los propios archivos en una carpeta de tu ordenador, así que la búsqueda del sistema los encuentra.
Ninguno tiene búsqueda propia.

² Da al agente un enlace de descarga, y luego el agente tiene que leer el archivo por su cuenta.

³ Descarga el archivo o la carpeta cuando se le pide, y luego el agente tiene que leer el archivo por su cuenta.

⁴ Sincroniza una carpeta: tú mueves archivos en esa carpeta y el cliente envía el cambio.

⁵ Un borrado va a la papelera, pero no hay ningún comando para recuperar el archivo.

⁶ Una edición pasa el `sha256` que leyó el agente. Un archivo que cambió desde la lectura se rechaza sin cambiar nada, y
el agente lo lee otra vez. Para un archivo sin enlace público, lo comprueba el propio Disk en el momento de escribir. El
contenido nuevo se sube a un archivo oculto a su lado, el archivo viejo pasa a la papelera solo con el `md5` que se leyó
(si no, [el Disk responde 409](https://yandex.ru/dev/disk-api/doc/ru/reference/delete)), y el archivo oculto toma su nombre. Después el archivo tiene un id nuevo en el
Disk, así que el historial de versiones del propio Disk empieza de cero. La copia vieja queda en la papelera del Disk,
donde los archivos, según la [ayuda de Yandex](https://yandex.ru/support/yandex-360/customers/disk/web/ru/actions-files/spec-folders/trash), siguen ocupando espacio en el Disk y se borran a los 30 días. Las
etiquetas y las notas pasan al archivo nuevo. Un archivo con enlace público se sobrescribe en su sitio, para que el
enlace siga funcionando. Se comprueba justo antes de escribir, así que un cambio en el instante entre esa comprobación y
la escritura no se detecta. Lo que reemplazó la edición se guarda igualmente en tu ordenador.

⁷ `upload` con `overwrite` reemplaza un archivo y solo compara su tamaño. Nada comprueba que el archivo no cambió
desde que se leyó.

⁸ `files sheets update` escribe celdas y conserva el formato, las fórmulas y las otras hojas. Solo reemplaza una
fórmula con `--replace`. `files documents update` reemplaza, inserta o borra párrafos y conserva su estilo. Rechaza un
párrafo con un cambio controlado, un campo, una imagen, un comentario, un enlace o una nota al pie, y dice por qué. Un
párrafo reemplazado toma el formato de su primer fragmento, así que una palabra en negrita o cursiva dentro de él
queda sin formato.

⁹ Lo que reemplazó una edición se guarda en tu ordenador: `files history` lo lista y `files restore` lo devuelve.
El propio Disk también guarda el historial de un archivo en su versión web, 14 días, o 90 días con Yandex 360
([ayuda de Yandex](https://yandex.ru/support/disk/version-control.html)). Después de editar un archivo sin enlace
público, ese historial empieza de cero, y la versión anterior queda 30 días en la papelera del Disk (ver la nota 6).

¹⁰ `--backup-dir` guarda un archivo que `copy`, `sync` o `move` sobrescribiría o borraría, y no hay ningún comando
para recuperarlo.

¹¹ Para las carpetas que [sincronizas en ambos sentidos](./mirrors.md). Para las demás carpetas elegidas, `ydisk` guarda
solo el texto de los archivos para buscar: PDF, Word, Excel, PowerPoint, OpenDocument, RTF, HTML, EPUB, CSV y archivos
de texto. Los PDF escaneados y las imágenes JPEG, PNG o WebP se leen por OCR: por defecto con el programa `tesseract`
de tu ordenador, en ruso e inglés, sin enviar nada a ningún sitio. El ajuste `read_scans` puede enviar las páginas a
Anthropic u OpenAI, que cobran por página, o apagar el OCR. De un archivo se leen hasta 20 páginas, y en una
sincronización como mucho 100.

¹² Descarga un archivo o una carpeta cuando se le pide, pero no mantiene esa copia al día.

¹³ `files serve` muestra una carpeta del Disk, o todo el Disk, con el cliente WebDAV propio del sistema: GNOME Files,
Finder o `net use`. Es de solo lectura a propósito: una carpeta con escritura se saltaría la papelera, las versiones y
la parada ante cambios masivos que tiene un [espejo](./mirrors.md). Los cambios van por los comandos `files` o por un
espejo. Consulta [abre el Disk como una carpeta](./mount.md).

¹⁴ `rclone mount` lee y escribe. Necesita FUSE: macFUSE o FUSE-T en macOS y WinFsp en Windows. Su página dice que
muchos programas necesitan `--vfs-cache-mode writes` para guardar archivos ahí.

¹⁵ `rclone sync` va en un solo sentido. `rclone bisync` sincroniza en ambos sentidos, y su página lo llama «an advanced
command, so use with care» («un comando avanzado, úsalo con cuidado»). Cada ejecución la lanzas tú o un programador de
tareas, y la primera necesita `--resync`.

¹⁶ Un espejo de `/` con `--ignore` para las rutas que dejas fuera, hasta 100 000 archivos. Un Disk demasiado grande
para listarlo en una ejecución se lista en varias, y cada ejecución sigue donde se detuvo la anterior.

¹⁷ rclone trabaja con todo el Disk (`yandex:`) y deja rutas fuera con opciones de filtro como `--exclude`. En ambos
sentidos solo con `rclone bisync`, que su página llama «an advanced command».

¹⁸ `rclone bisync` rechaza una ejecución cuando una de las carpetas está vacía, y se detiene sin cambios cuando se
borraría más del 50% de los archivos (`--max-delete`). Su documentación no describe una comprobación de que cada borrado
fue intencionado.

¹⁹ Una sincronización se detiene antes de borrar más de 10 archivos o reemplazar más de 50 archivos existentes, sea
cual sea el tamaño del espejo. Solo tú puedes permitir más, con `--allow-deletions`, `--allow-replacements` o `--replace`,
nunca un agente por MCP. Cada archivo reemplazado se guarda antes como versión.

²⁰ `rclone bisync` se detiene sin cambios cuando se borraría más del 50% de los archivos (`--max-delete`).
`rclone sync` limita los borrados solo si indicas `--max-delete`, y entonces detiene la operación en curso. Sus páginas
no describen ninguna parada antes de muchas sobrescrituras.

²¹ Un archivo cambiado en los dos lados se guarda dos veces, con los nombres `.conflict1` y `.conflict2`. Un archivo
borrado o reemplazado se guarda solo si indicas `--backup-dir1` y `--backup-dir2`, y no hay ningún comando para
recuperarlo. En Yandex Disk, los borrados de rclone van a la papelera salvo con `--yandex-hard-delete`.

²² Un archivo `.md`, `.txt`, `.csv` o `.tsv` de hasta 1 MB se fusiona línea a línea, como fusiona Git. Las
ediciones en la misma línea o en líneas vecinas siguen siendo un conflicto. Las tres versiones de cada fusión y su
resultado se guardan para siempre. Consulta [un archivo cambiado en los dos lados](./mirrors.md#a-file-changed-on-both-sides).

²³ `rclone bisync` conserva o elige un archivo entero: por defecto se quedan las dos copias, con los nombres
`.conflict1` y `.conflict2`, y `--conflict-resolve` puede quedarse en su lugar con la más nueva, la más antigua, la más
grande o la más pequeña. Su página no describe ninguna fusión del contenido ni ningún comando que muestre la
diferencia, así que comparas tú las dos copias.

²⁴ `mirrors conflicts show` da las tres versiones y cada tramo de líneas en conflicto, con los marcadores de
conflicto de Git. `mirrors conflicts resolve` escribe tu elección (`--keep local`, `disk` o `both`) o tu archivo final
en los dos lados a la vez, y se niega sin escribir nada si algún lado cambió desde entonces.

²⁵ `rclone lsjson` y otros comandos responden en JSON, pero no hay skill para agentes.

²⁶ El servidor MCP ofrece todos los comandos que cambian el Disk, y un permiso en `ask` se ejecuta sin preguntar por MCP. Para un agente que solo lee, pon `YDISK_READ_ONLY=1` o los permisos en `deny`. `mcp add` pide `--allow-writes` antes de conectar un agente.

²⁷ Por defecto el agente te pregunta antes de cada cambio, también antes de un borrado o un enlace público.

²⁸ Pon `files.delete` en `deny` para el agente. Sus sincronizaciones envían y traen entonces los archivos nuevos, y
enumeran cada reemplazo o borrado que se saltaron. Por MCP un permiso en `ask` deja pasar el cambio, y un agente no
puede pasar `--allow-deletions`, `--allow-replacements`, `--replace` ni `--repin`.

²⁹ rclone entra con su propia aplicación de Yandex si no le das tu propio `client_id` ([página de rclone sobre Yandex](https://rclone.org/yandex/)). En octubre de 2026 hubo usuarios con errores que desaparecían con su
propia aplicación ([issue 10067](https://github.com/rclone/rclone/issues/10067)).

<a id="where-another-tool-fits-better"></a>

## Cuándo encaja mejor otra herramienta

- **El Disk montado como una unidad en la que los programas también pueden guardar**: `rclone mount`. `ydisk` monta
  en solo lectura a propósito, para que un programa o un `rm -rf` equivocado no borren archivos del Disk a través de la
  carpeta.
- **Una copia de seguridad en un solo sentido de carpetas enteras, con fotos y vídeos**: `rclone sync` o `copy`.
- **Rehacer el diseño, las imágenes, los comentarios o los cambios controlados de un documento**: una aplicación de
  oficina, sobre un archivo de la carpeta sincronizada de Yandex Disk para Linux, o el editor web del Disk. `ydisk`
  cambia celdas y el texto de los párrafos, y rechaza un párrafo que no puede cambiar sin pérdida.
- **Todo un Disk de más de 100 000 archivos en tu ordenador, sincronizado por un servicio en segundo plano**: Yandex
  Disk para Linux. Un espejo de `ydisk` admite hasta 100 000 archivos, sin contar los que dejas fuera, y sincroniza
  cuando lo ejecutas o mientras funciona `mirrors watch`. A cambio guarda las versiones que reemplaza y se detiene
  antes de muchos borrados o sobrescrituras a la vez.
- **Sin instalar nada ni registrar una aplicación, si ya pagas Yandex 360**: el MCP de Yandex Disk. Tu aplicación de
  IA se conecta al servidor de Yandex con un enlace de acceso ya preparado.
- **Subir vídeos o carpetas de muchos gigabytes desde un agente**: yandex-disk-mcp. Hace las subidas largas en
  segundo plano, las reanuda y comprueba el MD5 de cada archivo.
- **Su propio programa en Python**: la biblioteca yadisk, un cliente de la API REST del Disk ([README](https://github.com/ivknv/yadisk)).

<a id="compared-with-a-browser-agent"></a>

## Comparación con un agente que usa la web del Disk

Un agente de navegador abre disk.yandex.ru y hace clic. `ydisk` y las demás herramientas de esta página llaman a la API
de Yandex. Esta página no afirma cuál es más rápido, más barato o más fiable, porque no hay una medición publicada.

<a id="install-and-licence"></a>

## Instalación y licencia

| | ydisk | MCP de Yandex Disk | rclone | Yandex Disk para Linux | yandex-disk-mcp |
|---|---|---|---|---|---|
| Instalación | npm, Node 22.16 o un 22.x posterior, o Node 24 o posterior | nada: tu aplicación de IA se conecta al servidor de Yandex | un binario, la mayoría de gestores de paquetes | paquetes deb y rpm | npm |
| Sistemas | macOS, Linux, Windows | cualquier aplicación MCP con HTTP | macOS, Linux, Windows y más | Linux | donde funcione Node.js |
| Licencia | Apache-2.0 | servicio de Yandex, suscripción de pago a Yandex 360 | MIT | no se indica en su página | MIT |
| Acceso | un token de tu propia aplicación de Yandex, guardado en el llavero del sistema | un token del enlace preparado por Yandex | la aplicación de rclone en el navegador, o la tuya | un código que escribes en el navegador | un token de tu propia aplicación de Yandex, en la configuración MCP |

Si `ydisk` te encaja, empieza por la [instalación](./installation.md).

<a id="how-each-mark-was-checked"></a>

## Cómo se comprobó cada marca

Las marcas de `ydisk` se comprobaron con la versión 0.5.0, con una carpeta personal vacía y sin iniciar sesión:
`ydisk commands`, el `--help` de cada comando y `--dry-run` en cada cambio para ver el permiso que comprueba. Para las
filas de edición, el `--help` de `files update`, `files sheets update`, `files documents update`, `files history` y
`files restore` dice qué escribe, guarda y rechaza cada uno. Para las filas de archivos cambiados en los dos lados,
`mirrors sync --help` dice que un archivo de texto cambiado en sitios distintos se fusiona, y
`mirrors conflicts resolve --help` da `--keep` y `--file`. Las reglas de fusión vienen de
[espejos](./mirrors.md#a-file-changed-on-both-sides).
La búsqueda por significado necesita descargar una vez un modelo de texto, y el uso desde el navegador necesita tu
propio túnel. Para las filas de sincronización de carpetas, `mirrors sync --dry-run` nombra los permisos que comprueba
una sincronización: `files.upload` para cada archivo que envía y `files.delete` para cada archivo que reemplaza o mueve
a una papelera. Sin iniciar sesión, el servidor MCP ofrece solo unas pocas herramientas, así que lo que un agente puede
ejecutar por MCP se leyó en el código de
[mirrors.ts](https://github.com/WireCatLabs/ydisk-cli/blob/v0.3.0/src/commands/mirrors.ts): añadir, quitar y
`versions` no se ofrecen, y `--allow-deletions`, `--replace` y `--repin` son solo del propietario. El mismo `--help`
muestra `mirrors add --ignore` y `files serve`. `files serve` funciona hasta que se detiene, como `mirrors watch`, así
que no se ofrece por MCP ([mount.ts](https://github.com/WireCatLabs/ydisk-cli/blob/v0.4.0/src/commands/mount.ts)). Los
límites de 10 borrados, 50 reemplazos y 100 000 archivos vienen del registro de cambios de 0.4.0 y de la ayuda, y el
límite de 1 MB para fusionar, del registro de cambios de 0.5.0.

Las filas sobre la edición que rechaza el propio Disk y sobre recuperar lo que reemplazó se comprobaron con la versión
0.7.0. El borrado del archivo viejo pasa al Disk el `md5` que se leyó
([writes.ts](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/src/yandex/writes.ts#L31)), y el orden del reemplazo, el id nuevo y la excepción para los archivos con
enlace público están en
[mirrors.md](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/docs/mirrors.md#how-a-file-on-the-disk-is-replaced).
La lista de archivos que se leen viene de
[usage.md](https://github.com/WireCatLabs/ydisk-cli/blob/75cccfb/docs/usage.md#what-the-copy-holds).

Las marcas de las demás herramientas vienen de sus propias páginas. Si en esas páginas no aparece nada, la marca es ➖,
nunca ❌, salvo cuando la lista de comandos o herramientas está completa.

- **MCP de Yandex Disk** ([servidor del Disk](https://yandex.ru/dev/yandex-360/mcp/ru/disk),
  [quién puede usarlo](https://yandex.ru/dev/yandex-360/mcp/ru/)). Su lista completa de herramientas:
  `disk.search_items` busca archivos «по имени, содержимому, типу и дате» (por nombre, contenido, tipo y fecha).
  `disk.get_download_url` da un enlace, y ninguna herramienta lee el texto de un archivo. `disk.delete_item` mueve a la
  papelera y `disk.list_trash_items` la muestra, sin recuperación. Los enlaces se gestionan con
  `disk.create_public_link` y `disk.update_public_item_permissions`. Acceso: cuentas personales con una suscripción
  de pago a Yandex 360 activa. El agente pregunta antes de un cambio «por defecto». `disk.create_file` sube un archivo nuevo, y
  ninguna herramienta cambia el contenido de un archivo que ya existe ni lista sus versiones. La página describe la configuración
  para Codex y Claude Code, no para aplicaciones de navegador, así que esa fila es ➖. Funciona en los servidores de
  Yandex, así que no busca sin internet.
- **rclone** ([página de Yandex](https://rclone.org/yandex/), [comandos](https://rclone.org/commands/),
  [bisync](https://rclone.org/bisync/), [mount](https://rclone.org/commands/rclone_mount/),
  [filtros](https://rclone.org/filtering/), [opciones](https://rclone.org/docs/)). Ningún comando busca dentro de los archivos. Tiene `copy`, `move`, `sync` y
  `mount`. `rclone link` crea un enlace público. `delete` va a la papelera salvo con `--yandex-hard-delete`, y
  `cleanup` la vacía, sin recuperación. Todo cambio admite `--dry-run`. No hay comando MCP. Entra con la aplicación
  propia de rclone salvo que indiques `client_id`. `bisync` es «an advanced command, so use with care». Rechaza una
  ejecución cuando una de las carpetas está vacía, se detiene por encima de `--max-delete` (50% por defecto) «without
  making any changes», renombra las dos copias de un conflicto o elige una con `--conflict-resolve` (`newer`, `older`,
  `larger`, `smaller`, `path1`, `path2`), y guarda los archivos borrados solo con `--backup-dir1` y `--backup-dir2`.
  Ningún comando edita el contenido de un archivo, y ninguna opción rechaza una sobrescritura cuando el archivo ya no
  tiene el hash que tú indicas. `--backup-dir` guarda lo que `copy`, `sync` o `move` sobrescribe. Ninguna de las dos páginas menciona versiones de archivos. `mount` lista `--read-only` como
  opción, así que por defecto escribe. `--max-delete` para los demás comandos: «not to delete more than N files», y
  luego «stop the operation in progress».
- **Yandex Disk para Linux** ([comandos de consola](https://yandex.ru/support/disk-desktop-linux/cli-commands.html)).
  Su lista completa de comandos: `start`, `stop`, `status`, `sync`, `publish`, `unpublish`, `token` y opciones de
  configuración. No hay comandos de búsqueda, mover, borrar ni papelera, y los cambios se hacen en la carpeta
  sincronizada. `start` y `sync` sincronizan «все папки, кроме указанных в списке исключений» (todas las carpetas salvo
  las de `exclude-dirs`). Por defecto sincroniza en ambos sentidos: `--read-only` es la opción que impide cambios en el
  lado del Disk. Sus páginas no dicen nada de archivos borrados, papelera ni versiones, así que esas filas son ➖. No
  hay comando de montaje, y no describe ningún límite de archivos ni parada antes de muchos borrados.
- **yandex-disk-mcp** ([README](https://github.com/gorokhovdenis/yandex-disk-mcp/blob/main/README.md)). Su lista
  completa de herramientas: información, listado, metadatos, comparación, crear carpeta, subir, descargar, borrar,
  copiar, mover, últimos subidos. No hay búsqueda ni enlace público. `yandex_disk_delete` mueve a la papelera salvo
  con `permanently`, sin recuperación. `yandex_disk_upload` solo sobrescribe con `overwrite`, decidido solo por el
  tamaño, y ninguna herramienta edita el contenido de un archivo ni lista versiones. Funciona por stdio, con el token en su configuración.

Las listas completas de herramientas del MCP de Yandex Disk y de yandex-disk-mcp no tienen sincronización (comprobado
el 19 de noviembre de 2026), así que las filas de sincronización que dependen de ella son n/a para ellos.
`yandex_disk_compare` de yandex-disk-mcp solo muestra en qué se diferencian una carpeta local y una del Disk.
