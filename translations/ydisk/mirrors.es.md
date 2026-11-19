---
title: "Una carpeta igual en tu ordenador y en el Disk"
---

Trabaja con tus archivos en tus propios programas, y Yandex Disk se pone al día solo. Un espejo mantiene iguales una
carpeta de tu ordenador y una carpeta de Yandex Disk, en ambos sentidos. Editas un archivo en tu editor, y la siguiente
sincronización lo sube al Disk. Lo cambias en el Disk, desde el móvil o el navegador, y la sincronización lo baja. Un
archivo borrado va a una papelera, nunca desaparece, y se guarda la versión que una sincronización reemplaza, en
cualquiera de los dos lados. Un archivo cambiado en los dos lados nunca se sobrescribe sin ti.

Usa un espejo cuando trabajas con archivos con herramientas locales, como un editor, un script o un agente, y los
quieres también en el Disk, sin instalar la aplicación de Yandex Disk. Los archivos quedan como son: un PDF sigue siendo
un PDF y una nota sigue siendo un archivo Markdown.

**En esta página:**

1. [Conecta una carpeta](#connect-a-folder)
2. [La primera sincronización](#the-first-sync)
3. [Las sincronizaciones de cada día](#everyday-syncs)
4. [Un archivo cambiado en los dos lados](#a-file-changed-on-both-sides)
5. [Borrado o solo ausente](#deleted-or-only-missing)
6. [Adónde van los archivos borrados](#where-deleted-files-go)
7. [Versiones anteriores de un archivo](#earlier-versions-of-a-file)
8. [Una carpeta que se reemplazó](#a-folder-that-was-replaced)
9. [Sincronizar en segundo plano](#keep-syncing-in-the-background)
10. [Qué puede hacer un agente](#what-an-agent-may-do)
11. [Qué no se sincroniza](#what-is-not-synced)

## Conecta una carpeta

Indica primero la carpeta del Disk y después la local:

```sh
ydisk personal mirrors add /Notes ~/notes
```

La herramienta comprueba que las dos son carpetas y guarda el par. Todavía no copia nada. `mirrors list` muestra tus
espejos con sus id; los comandos de esta página aceptan un id cuando tienes más de un espejo.

Algunas carpetas nunca se sincronizan, porque una sincronización enviaría al Disk cada archivo que contienen: carpetas
de credenciales como `~/.ssh`, `~/.gnupg` y los llaveros, perfiles de navegador, las carpetas de las aplicaciones de
WireCat y cualquier carpeta que guarde los ajustes o el estado del propio `ydisk`. `files upload` rechaza los mismos
lugares.

Un espejo pertenece a la cuenta con la que el perfil había iniciado sesión cuando lo añadiste. Una sincronización con
otra cuenta se rechaza.

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

Cuando un archivo cambió aquí y en el Disk desde la última sincronización, la sincronización no toca ninguna de las dos
copias e informa del archivo en `conflicts`, con la hora y el tamaño de cada lado. Después la sincronización termina con
un error, para que un script lo note. Resuelve los conflictos con otra ejecución:

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
- El lado donde falta se leyó entero. Una carpeta del Disk que el token no puede leer, más de 10 000 archivos o un Disk
  que cambia mientras se lista dejan la lista incompleta. La lista se vuelve a leer, hasta tres veces, cuando algo
  cambió en el Disk durante la lectura.
- La carpeta de ese lado sigue siendo la misma: la carpeta del Disk tiene el mismo id que en la primera sincronización,
  y la carpeta local existe, es la misma y no está vacía. Una carpeta local vacía puede ser una unidad sin montar.

Un archivo que solo falta, por cualquier otro motivo, aparece en `unknown`, y no se borra nada por él. Si falta la
carpeta del Disk, todo el espejo se detiene con un error y no se borra nada.

Una sincronización se detiene antes de cambiar nada cuando borraría más de 50 archivos, o más de una cuarta parte de
ellos (a partir de 3 archivos). Revisa la lista con `mirrors preview` y luego permite ese número:

```sh
ydisk personal mirrors sync 1a2b3c4d --allow-deletions 60
```

Un archivo renombrado o movido en el Disk también se renombra aquí: el Disk conserva el id de un archivo al moverlo. Un
archivo renombrado aquí se envía como archivo nuevo, y el nombre antiguo va a la papelera del Disk.

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
(`old`) y después (`new`), y de qué lado venía el contenido antiguo (`from`: `local`, o `remote` para el Disk).
`available` dice si ese contenido sigue guardado. Cuando el contenido antiguo del Disk no se guardó porque el archivo
fue a la papelera del Disk, `old_in` es `remote-trash`: recupéralo de la papelera del Disk. `versions restore` devuelve
una versión guardada a la carpeta local; el archivo que hay allí ahora se guarda primero. La siguiente sincronización
envía el archivo recuperado al Disk.

Una versión se guarda 30 días. La última versión de un archivo borrado se guarda para siempre. Una versión del Disk
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
carpeta solo se vuelve a leer cuando la revisión cambió. Detenlo con Ctrl-C, o dale un `--timeout`.

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

Por MCP un agente puede ejecutar `mirrors list`, `mirrors status`, `mirrors preview` y `mirrors sync`, pero no
`--allow-deletions` ni `--repin`. Por MCP nadie puede responder una pregunta, así que un nivel en `ask` deja pasar la
escritura: pon `files.delete` en `deny` para un agente que no deba reemplazar ni borrar archivos. Añadir o quitar un
espejo, `versions` y `watch` son solo para ti. Consulta [conecta tu agente](./mcp.md#decide-what-the-agent-may-change).

## Qué no se sincroniza

- Archivos y carpetas ocultos (un nombre que empieza por `.`), `node_modules` y restos de editores (`~$name`, nombres
  que terminan en `~`, `.swp` o `.tmp`), en los dos lados. Una carpeta así del Disk ni siquiera se lista.
- Enlaces simbólicos. Un archivo bajo un enlace nunca se borra por su causa.
- Un espejo de más de 10 000 archivos.
- Carpetas vacías.

`mirrors remove <id>` olvida el par. No cambia nada en el Disk ni en la carpeta local, y las versiones guardadas se
quedan. Si lo vuelves a añadir, el par empieza con una primera sincronización.

Siguiente: [peticiones para probar](./recipes.md).
