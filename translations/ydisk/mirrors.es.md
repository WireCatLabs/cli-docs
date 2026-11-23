---
title: "Una carpeta igual en tu ordenador y en el Disk"
---

Trabaja con tus archivos en tus propios programas, y Yandex Disk se pone al día solo. Un espejo mantiene iguales una
carpeta de tu ordenador y una carpeta de Yandex Disk, en ambos sentidos. Editas un archivo en tu editor, y la siguiente
sincronización lo sube al Disk. Lo cambias en el Disk, desde el móvil o el navegador, y la sincronización lo baja. Un
archivo borrado va a una papelera, nunca desaparece, y se guarda la versión que una sincronización reemplaza, en
cualquiera de los dos lados. Un archivo de texto cambiado en los dos lados en sitios distintos se fusiona; cualquier
otro archivo cambiado en los dos lados nunca se sobrescribe sin ti.

Usa un espejo cuando trabajas con archivos con herramientas locales, como un editor, un script o un agente, y los
quieres también en el Disk, sin instalar la aplicación de Yandex Disk. Los archivos quedan como son: un PDF sigue siendo
un PDF y una nota sigue siendo un archivo Markdown. Un espejo también puede guardar todo tu Disk, como hace la
aplicación de Yandex Disk, sin las carpetas que elijas dejar fuera.

**En esta página:**

1. [Conecta una carpeta](#connect-a-folder)
2. [Todo el Disk](#the-whole-disk)
3. [Deja carpetas fuera](#leave-folders-out)
4. [La primera sincronización](#the-first-sync)
5. [Las sincronizaciones de cada día](#everyday-syncs)
6. [Un archivo cambiado en los dos lados](#a-file-changed-on-both-sides)
7. [Borrado o solo ausente](#deleted-or-only-missing)
8. [Muchos cambios a la vez](#many-changes-at-once)
9. [Adónde van los archivos borrados](#where-deleted-files-go)
10. [Versiones anteriores de un archivo](#earlier-versions-of-a-file)
11. [Una carpeta que se reemplazó](#a-folder-that-was-replaced)
12. [Sincronizar en segundo plano](#keep-syncing-in-the-background)
13. [Qué puede hacer un agente](#what-an-agent-may-do)
14. [Qué no se sincroniza](#what-is-not-synced)

## Conecta una carpeta

Indica primero la carpeta del Disk y después la local:

```sh
ydisk personal mirrors add /Notes ~/notes
```

La herramienta comprueba que las dos son carpetas y guarda el par. Todavía no copia nada. `mirrors list` muestra tus
espejos con sus id; los comandos de esta página aceptan un id cuando tienes más de un espejo.

Algunas carpetas nunca se sincronizan, porque una sincronización enviaría al Disk cada archivo que contienen: tu propia
carpeta personal, carpetas de credenciales como `~/.ssh`, `~/.gnupg` y los llaveros, perfiles de navegador, las
carpetas de las aplicaciones de WireCat y cualquier carpeta que guarde los ajustes o el estado del propio `ydisk`.
`files upload` rechaza los mismos lugares. Sincroniza una carpeta propia, como `~/notes`.

Un espejo pertenece a la cuenta con la que el perfil había iniciado sesión cuando lo añadiste. Una sincronización con
otra cuenta se rechaza.

## Todo el Disk

Indica `/` como carpeta del Disk, y una carpeta propia en tu ordenador:

```sh
ydisk personal mirrors add / ~/YandexDisk --ignore Photos --ignore "*.iso"
ydisk personal mirrors preview
ydisk personal mirrors sync
```

La sincronización lee todo el Disk con la lista plana de archivos de Yandex, más o menos una petición por cada mil
archivos. Un espejo de todo el Disk funciona como cualquier otro: todo lo de esta página vale para él. En un Disk
grande pesan más dos cosas:

- **Espacio libre.** Cada sincronización, de cualquier espejo, suma primero lo que va a descargar y las versiones
  anteriores que va a guardar. Se detiene con `mirror.no-space` cuando eso dejaría demasiado poco libre en la unidad
  (una décima parte de lo que escribe, al menos 100 MB y como mucho 1 GB), y dice cuánto necesita. Deja fuera las
  carpetas grandes para que quepa. Las versiones anteriores se guardan 30 días.
- **Tamaño.** Un espejo admite hasta 100 000 archivos, sin contar los que dejas fuera.
- **Tiempo.** Una sincronización dura hasta 15 minutos en una terminal y 45 segundos cuando la ejecuta un agente. Se
  detiene antes por su cuenta, conserva lo hecho y dice hasta dónde llegó. Ejecuta `mirrors sync` otra vez para
  seguir: la siguiente ejecución lista el Disk desde donde se detuvo la anterior, no desde el principio, así que la
  primera sincronización de un Disk grande termina en varias ejecuciones de cualquier duración. `listed` de cada
  espejo muestra cuántos archivos del Disk listó esta ejecución (`files`), si la lista está completa, si siguió desde
  una ejecución anterior (`resumed`) y cuántos archivos han listado todas las ejecuciones hasta ahora (`so_far`). Los
  archivos listados hasta ahora se sincronizan enseguida; un borrado espera a que todo el Disk esté listado. Una lista
  cortada no borra nada: los archivos del Disk a los que aún no llegó solo se cuentan, en `unlisted`. Un punto de
  partida guardado más de 7 días hace que la lista empiece de nuevo.

## Deja carpetas fuera

Una ruta ignorada se deja en paz en los dos lados: no se envía, no se baja y nunca se borra. Indica las rutas al
añadir el espejo (`--ignore`, repetido), o añade más después. `mirrors list` muestra la lista. `--clear` la vacía
primero, así que `--clear` con `--ignore` conserva solo las rutas que indicas: así deja de ignorarse una ruta.

```sh
ydisk personal mirrors update 1a2b3c4d --ignore Photos --ignore "*.iso"
ydisk personal mirrors update 1a2b3c4d --clear --ignore "*.iso"
```

- Un patrón sin `/` es un nombre a cualquier profundidad: `node_modules`, `*.iso`, `Backups`.
- Un patrón con `/` es una ruta desde la carpeta del espejo: `/Photos` (solo la de arriba), `Work/2019`,
  `Work/**/build`.
- `*` y `?` coinciden dentro de un nombre. `**` coincide con cualquier número de carpetas.

Añadir una exclusión no borra nada en ningún lado, ni ahora ni después: los archivos se quedan donde están y la
sincronización deja de mirarlos. Quitar una exclusión sincroniza la ruta como una carpeta nueva: los archivos de un
solo lado se copian, los idénticos se dan por sincronizados y los distintos son conflictos. No se borra nada.
`mirrors list` muestra las exclusiones de cada espejo.

Un archivo ya sincronizado que luego se mueve en el Disk a una carpeta excluida se mueve también aquí, y después se
deja en paz. Un archivo movido aquí a una carpeta excluida parece borrado para la sincronización: la copia del Disk va
a la papelera del Disk.

## La primera sincronización

```sh
ydisk personal mirrors preview
ydisk personal mirrors sync
```

`mirrors preview` lee la carpeta del Disk y muestra lo que haría la sincronización, sin cambiar nada. `mirrors sync
--dry-run` muestra los permisos que comprueba la sincronización, sin preguntar al Disk.

En la primera sincronización:

- Un archivo que existe solo en un lado se copia al otro.
- Un archivo con el mismo contenido en los dos lados se da por sincronizado. No se copia nada.
- Un archivo con contenido distinto en los dos lados es un conflicto. Ninguna copia cambia; consulta
  [un archivo cambiado en los dos lados](#a-file-changed-on-both-sides).
- No se borra nada.

## Las sincronizaciones de cada día

Cada sincronización compara cada archivo de tres formas: cómo está aquí ahora, cómo está en el Disk ahora y cómo estaba
en la última sincronización. Un archivo cambiado en un lado se copia al otro. Un archivo cambiado en los dos lados con
el mismo contenido se queda como está. Los archivos se comparan por su hash SHA-256, así que un archivo que solo se tocó,
con el mismo contenido, no se vuelve a enviar.

`mirrors status` muestra qué archivos locales enviaría o borraría en el Disk la siguiente sincronización. No pregunta al
Disk, así que funciona sin conexión.

## Un archivo cambiado en los dos lados

Un archivo de texto (`.md`, `.markdown`, `.txt`, `.csv` o `.tsv`, de hasta 1 MB) que cambió aquí y en el Disk se
fusiona línea a línea, como fusiona Git: tu edición de una sección y una edición de otra sección desde el móvil
quedan las dos, en los dos lados. La respuesta incluye el archivo en `merged`, y `mirrors preview` lo muestra como un
paso `merge`. Dos cambios necesitan al menos una línea sin cambiar entre ellos. Los cambios en la misma línea o en
líneas vecinas son un conflicto, porque dos ediciones que se leen bien por separado pueden leerse mal juntas. Marcar
una casilla de una lista de Markdown y editar el texto del mismo elemento sí se fusionan. Los tres contenidos de cada
fusión (el de la última sincronización, el tuyo y el del Disk) y el resultado se guardan en este ordenador para
siempre; [`versions list`](#earlier-versions-of-a-file) indica el papel de cada uno.

Cualquier otro archivo cambiado en los dos lados, y una fusión con conflicto, se deja intacto en los dos lados y
aparece en `conflicts`, con la hora y el tamaño de cada lado. Después la sincronización termina con un error, para
que un script lo note. Revisa y resuelve cada conflicto:

```sh
ydisk personal mirrors conflicts list
ydisk personal mirrors conflicts show 1a2b3c4d notes/plan.md
ydisk personal mirrors conflicts resolve 1a2b3c4d notes/plan.md --keep disk
ydisk personal mirrors conflicts resolve 1a2b3c4d notes/plan.md --file ~/plan-final.md
```

`conflicts show` da las tres versiones y cada tramo de líneas en conflicto. Su `merged` es el archivo entero con los
marcadores de conflicto de Git: edítalo hasta tener el texto final y pásalo a `resolve --file`. `resolve` escribe un
único contenido final en los dos lados a la vez: `--keep local`, `--keep disk`, `--keep both` (la copia del Disk junto
a la tuya) o `--file`. Se niega, sin escribir nada, si algún lado cambió desde que la sincronización encontró el
conflicto; sincroniza otra vez y mira el conflicto nuevo. Cada versión reemplazada se guarda.

También puedes resolver todos los conflictos de un espejo con la siguiente ejecución:

| Comando | Qué ocurre |
| --- | --- |
| `mirrors sync --keep local` | Tu copia reemplaza la del Disk. La del Disk se guarda como [versión anterior](#earlier-versions-of-a-file). |
| `mirrors sync --keep disk` | La copia del Disk reemplaza la tuya. La tuya se guarda como [versión anterior](#earlier-versions-of-a-file). |
| `mirrors sync --keep both` | La copia del Disk baja junto a la tuya como `name (conflict 2026-11-19 disk).ext`, y las dos van al Disk. |

Un archivo borrado en un lado y cambiado en el otro también es un conflicto. `--keep` lo resuelve igual.

## Borrado o solo ausente

Una sincronización borra un archivo en un lado solo cuando puede demostrar que lo borraste en el otro. Un archivo cuenta
como borrado solo si se cumple todo esto:

- La última sincronización vio el archivo.
- El lado donde falta se leyó entero. Una carpeta del Disk que el token no puede leer, o más de 100 000 archivos,
  dejan la lista incompleta.
- En el lado del Disk, el archivo sigue sin estar cuando la sincronización lo pide por su ruta, después de la lista.
  Una lista leída página a página puede saltarse un archivo cuando otra cosa cambia en el Disk mientras tanto, como
  hace todo el rato un móvil que sube fotos. Pedir el archivo directamente no puede saltárselo, así que un archivo que
  solo falta en una lista nunca se borra. Así los borrados siguen funcionando en un Disk que nunca está quieto.
- La carpeta de ese lado sigue siendo la misma: la carpeta del Disk tiene el mismo id que en la primera sincronización,
  y la carpeta local existe, es la misma y no está vacía. Una carpeta local vacía puede ser una unidad sin montar.

Un archivo que solo falta, por cualquier otro motivo, aparece en `unknown`, y no se borra nada por él. Si falta la
carpeta del Disk, todo el espejo se detiene con un error y no se borra nada.

Un archivo renombrado o movido en el Disk también se renombra aquí: el Disk conserva el id de un archivo al moverlo. Un
archivo renombrado aquí se envía como archivo nuevo, y el nombre antiguo va a la papelera del Disk.

## Muchos cambios a la vez

Una sincronización se detiene antes de cambiar nada, en cualquier lado, cuando:

- borraría más de 10 archivos, o
- reemplazaría más de 50 archivos que ya existen, como haría un editor que reescribe todos los archivos o un ransomware
  que cifra la carpeta.

Esto vale sea cual sea el tamaño del espejo. El error nombra las cifras y el comando exacto que las permite. Revisa
antes la lista:

```sh
ydisk personal mirrors preview 1a2b3c4d
ydisk personal mirrors sync 1a2b3c4d --allow-deletions 40 --allow-replacements 120
```

`--allow-deletions` permite hasta ese número de borrados y `--allow-replacements` hasta ese número de reemplazos, para
esa ejecución. `--replace` permite cualquier número de reemplazos. Una fusión cuenta como reemplazo. Cada archivo
reemplazado se guarda antes como versión. Con más de un espejo, los dos necesitan el id del
espejo, así que una aprobación nunca cubre otro espejo. Un espejo detenido no frena a los demás: se sincronizan como
siempre. `mirrors watch` vuelve a informar de la parada en cada ciclo que sincroniza el espejo, hasta que permitas la
ejecución o devuelvas los archivos.

## Adónde van los archivos borrados

| Borrado en | La sincronización mueve la copia del otro lado a | Cómo recuperarlo |
| --- | --- | --- |
| Tu ordenador | La papelera del Disk | `ydisk personal files restore trash:/name.ext`, o la papelera en la web del Disk |
| El Disk | `.wirecat-trash/YYYY-MM-DD/` dentro de la carpeta local | Muévelo de vuelta; la siguiente sincronización lo envía |

El Disk rechaza el borrado cuando su copia cambió después de que la sincronización la listara, así que un archivo que
alguien acaba de editar nunca se borra: aparece como conflicto. La carpeta de papelera local está oculta, así que nunca
se sincroniza.

## Versiones anteriores de un archivo

Antes de que una sincronización reemplace o borre un archivo en tu ordenador, o reemplace uno en el Disk, guarda el
contenido del archivo en la carpeta de estado del perfil, fuera de la carpeta sincronizada. El contenido antiguo del
Disk se descarga primero; si no se puede guardar, o cambió desde la lectura, ese archivo no se reemplaza. Un archivo
borrado en el Disk está en la papelera del Disk. La sincronización también registra cada cambio que hace, en ambos
sentidos.

```sh
ydisk personal mirrors versions list 1a2b3c4d notes/plan.md
ydisk personal mirrors versions restore 1a2b3c4d notes/plan.md <sha256>
```

`versions list` muestra cada cambio, del más antiguo al más nuevo: cuándo, en qué sentido, el hash del contenido antes
(`old`) y después (`new`), y de qué lado venía el contenido antiguo (`from`: `local`, o `remote` para el Disk). Una
fusión, un conflicto y una resolución (`event` `merged`, `conflict` o `resolved`, sentido `both`) listan sus contenidos
en `versions`, cada uno con su papel: `base` (el de la última sincronización), `local`, `remote` (el del Disk) y
`result`. `available` dice si ese contenido sigue guardado. Cuando el contenido antiguo del Disk no se guardó porque el archivo
fue a la papelera del Disk, `old_in` es `remote-trash`: recupéralo de la papelera del Disk. `versions restore` devuelve
una versión guardada a la carpeta local; el archivo que hay allí ahora se guarda primero. La siguiente sincronización
envía el archivo recuperado al Disk.

Una versión se guarda 30 días. La última versión de un archivo borrado, los contenidos de cada fusión y cada
conflicto, y el último contenido sincronizado de cada archivo de texto (el punto de partida de la siguiente fusión) se
guardan para siempre. Una versión del Disk
también se recupera en la carpeta local, y la siguiente sincronización la devuelve.

## Una carpeta que se reemplazó

Si la carpeta del Disk se borró y se volvió a crear, o la carpeta local ahora es otra (una unidad nueva, una carpeta
recuperada de una copia de seguridad), la sincronización se detiene con `confirmation_required` y nombra `--repin`.
Cuando la carpeta nueva es la correcta:

```sh
ydisk personal mirrors sync 1a2b3c4d --repin
```

La sincronización registra la carpeta nueva y se ejecuta como una primera sincronización: los archivos idénticos se dan
por buenos, los que están en un solo lado se copian y los distintos son conflictos. Esa ejecución no borra nada.

## Sincronizar en segundo plano

```sh
ydisk personal mirrors watch
```

`watch` sincroniza al empezar, luego otra vez unos segundos después de que guardes un archivo, y cuando el Disk cambió.
Pregunta al Disk su revisión cada 60 segundos (`--every` para cambiarlo, al menos 10 s): una petición pequeña, y la
carpeta solo se vuelve a leer cuando la revisión cambió. Detenlo con Ctrl-C, o dale un `--timeout`. Un espejo
que la protección detuvo (consulta [muchos cambios a la vez](#many-changes-at-once)) aparece en cada ciclo que lo
sincroniza, nunca se salta en silencio.

Un reemplazo o un borrado pide primero `files.delete`. Un `watch` que queda en marcha sin terminal no puede
responder, así que inícialo con `--yes` o permite `files.delete` para el perfil.

## Qué puede hacer un agente

Cada escritura de una sincronización comprueba el permiso del propio comando, `mirrors.sync` o `mirrors.watch`, y
además:

- `files.upload` para cada archivo que pone en el Disk;
- `files.delete` para cada archivo que reemplaza o mueve a una papelera, en cualquier lado. Por defecto pregunta en una
  terminal, una vez por ejecución.

Con `files.delete` en `deny`, una sincronización sigue enviando y bajando archivos nuevos, y enumera en `errors` cada
reemplazo o borrado que se saltó. `YDISK_READ_ONLY=1` rechaza una sincronización; `mirrors preview` y `mirrors status`
siguen funcionando.

Por MCP un agente puede ejecutar `mirrors list`, `mirrors status`, `mirrors preview`, `mirrors sync` y
`mirrors conflicts list`, `show` y `resolve --keep`, pero no `--allow-deletions`, `--allow-replacements`, `--replace`, `--repin` ni `resolve --file`: solo tú apruebas muchos cambios a la vez, y solo tú das un archivo de este ordenador.
`mirrors conflicts resolve` comprueba las mismas claves que una sincronización. Por MCP nadie puede responder una pregunta, así que un nivel en `ask` deja pasar la
escritura: pon `files.delete` en `deny` para un agente que no deba reemplazar ni borrar archivos. Añadir, cambiar o quitar un
espejo, `versions` y `watch` son solo para ti. Consulta [conecta tu agente](./mcp.md#decide-what-the-agent-may-change).

## Qué no se sincroniza

- Archivos y carpetas ocultos (un nombre que empieza por `.`), `node_modules` y restos de editores (`~$name`, nombres
  que terminan en `~`, `.swp` o `.tmp`), en los dos lados. Una carpeta así del Disk ni siquiera se lista.
- Enlaces simbólicos. Un archivo bajo un enlace nunca se borra por su causa.
- Las rutas que [dejaste fuera](#leave-folders-out).
- Un espejo de más de 100 000 archivos.
- Carpetas vacías.

`mirrors remove <id>` olvida el par. No cambia nada en el Disk ni en la carpeta local, y las versiones guardadas se
quedan. Si lo vuelves a añadir, el par empieza con una primera sincronización.

Siguiente: [peticiones para probar](./recipes.md).
