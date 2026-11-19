---
title: "Úsalo"
---

Encuentra una entrada, escribe un borrador o prográmalo con un comando corto, el mismo que ejecuta tu agente. La API
de WordPress habla con ids numéricos, marcado de bloques sin procesar y códigos de estado, y `wordpress` te da en su
lugar Markdown y palabras de estado sencillas.

Encuentras las entradas del mes pasado, un borrador olvidado o el texto de una página en una línea. Un agente hace lo
mismo a partir de tu petición.

Cada comando empieza con un perfil, el nombre que diste al inicio de sesión de un sitio. `sync` copia tus entradas y
páginas en el almacén local de WireCat, donde las encuentran los comandos de lectura. Necesitas un perfil con la sesión
iniciada: [instala](./installation.md) prepara uno.

**En esta página:**

1. [Primero el perfil](#the-profile-comes-first)
2. [Sincroniza](#sync)
3. [Lee entradas y páginas](#read-posts-and-pages)
4. [Etiquetas y autores](#tags-and-authors)
5. [Escribe un borrador](#write-a-draft)
6. [Publica](#publish)
7. [Cuando una escritura se detiene](#when-a-write-stops)
8. [La API de WordPress](#the-wordpress-api)
9. [Salida para scripts](#output-for-scripts)
10. [Agentes](#agents)

## Primero el perfil

Un perfil es un nombre que eliges para un sitio y un usuario. Es la primera palabra de cada comando que usa una
cuenta:

```sh
wordpress blog config show
```

`WCWP_PROFILE=blog` hace lo mismo para una sesión de la terminal. Nunca se da un perfil por supuesto, ni siquiera el
único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador. Dos sitios
son dos perfiles, cada uno con su propia contraseña.

## Sincroniza

Los comandos de lectura responden desde el almacén local de WireCat. `sync` lo pone al día:

```sh
wordpress blog sync              # what changed since the last sync
wordpress blog sync --rescan     # everything again, dropping a sync that stopped half way
```

`sync` copia entradas y páginas con todos sus estados (publicadas, programadas, borradores, pendientes, privadas y en
la papelera), etiquetas y categorías, y los usuarios que escriben. El texto de una entrada se guarda en Markdown. La
primera sincronización lo lee todo. Las siguientes piden a WordPress solo las entradas que cambiaron desde entonces.
Una vez al día, una sincronización encuentra también las entradas que el sitio borró para siempre. Una entrada en la
papelera sigue en la copia, con su estado.

Una sincronización puede terminar parcial y aun así salir bien: nombra cada hueco. Con un inicio de sesión de Autor o
Colaborador, WordPress niega la lista de páginas, así que las entradas quedan parciales y los cambios en el sitio no
llegan a la copia. Un Colaborador además ve solo sus propias entradas. Solo un Administrador obtiene la lista de
usuarios, así que la copia de un Editor tiene todas las entradas y páginas, pero ningún usuario. Inicia sesión como
Administrador para tener una copia completa.

`--max-pages` limita las peticiones de una ejecución. La siguiente sincronización sigue donde se detuvo.

## Lee entradas y páginas

```sh
wordpress blog posts list status:draft
wordpress blog posts list type:page
wordpress blog posts list status:published "published:[2026-10-01 TO 2026-10-31]"
wordpress blog posts list tag:12 author:3
wordpress blog posts search "pricing change"
wordpress blog posts show 41
```

`posts list` muestra primero el cambio más reciente. Filtra por estos campos:

| Campo | Valores | Ejemplo |
|---|---|---|
| `status` | `draft`, `pending`, `scheduled`, `published`, `private`, `trashed` | `status:scheduled` |
| `type` | `post` o `page` | `type:page` |
| `tag` | el id de una etiqueta o categoría, como lo muestra `tags list` | `tag:12` |
| `author` | el id de un usuario, como lo muestra `users list` | `author:3` |
| `published` | una hora, un rango, o `>`, `>=`, `<`, `<=` una hora | `published:>=2026-01-01` |

Los términos se unen con AND. `--limit` y `--page` recorren una lista larga.

`posts search` encuentra entradas por las palabras de su título y su texto. Todas las palabras deben coincidir, y
también coincide un comienzo de tres letras o más. `posts show` da una entrada con su texto en Markdown, sus autores y
etiquetas por nombre, y sus versiones anteriores.

`posts stats` muestra las cifras de una entrada tal como las leyó cada sincronización. WordPress no guarda recuentos
de visitas, así que muestra poco para un sitio WordPress.

`--offline` responde desde la copia y nunca se conecta.

## Etiquetas y autores

```sh
wordpress blog tags list       # tags and categories, with their ids
wordpress blog users list      # the users who write
wordpress blog channels list   # the site this profile copies
```

`posts create --tags` y el filtro `tag:` usan los ids que muestra `tags list`. `users list` también nombra a la
persona que el almacén conoce por el mismo correo, de tus otras herramientas de WireCat.

## Escribe un borrador

```sh
wordpress blog posts create --title "Version 3" --text-file notes.md --description "What changed" --tags 12,14
cat notes.md | wordpress blog posts create --title "Version 3" --text-file -
wordpress blog posts update 63 --title "Version 3 is out"
wordpress blog posts update 63 --text-file notes-v2.md --slug version-3
```

`posts create` siempre crea un borrador. Publicar es un paso aparte. El texto es Markdown, de un archivo o de stdin con
`--text-file -`. `--description` pone el extracto, el texto corto que muestran las listas. `--tags` toma ids de
etiquetas y categorías y sustituye los que tenía la entrada. `--slug` es la última parte de la dirección de la
entrada.

`posts update` cambia los campos que nombras. Un cambio en una entrada publicada o programada es público, así que
comprueba también `posts.publish`.

## Publica

```sh
wordpress blog posts publish 63                                # now
wordpress blog posts publish 63 --at-time 2026-12-01T09:00:00Z  # at that time
wordpress blog posts publish 63 --at-time 3d                    # in three days
wordpress blog posts unpublish 63                              # back to a draft
wordpress blog posts delete 63                                 # to the trash
wordpress blog posts delete 63 --allow-delete                  # for good, past the trash
```

`--at-time` toma una hora ISO 8601, un día o un plazo desde ahora, como `3d`. Debe estar en el futuro. Una entrada que
ya está publicada no se puede programar: despublícala primero. Una entrada movida a la papelera se recupera desde la
papelera en wp-admin. `--allow-delete` la borra para siempre y comprueba la clave `posts.delete.force`.

Cada escritura pregunta antes en una terminal. Consulta los [permisos](./permissions.md).

## Cuando una escritura se detiene

- **La entrada cambió en el sitio.** Antes de escribir, `wordpress` compara la versión de la entrada con la copia. Si
  alguien la cambió en el sitio desde la última sincronización, la escritura se detiene con `content.conflict`.
  Ejecuta `sync`, mira la entrada de nuevo y vuelve a intentarlo.
- **La entrada tiene bloques que Markdown no puede conservar.** Las galerías, las columnas, el contenido incrustado y
  los iframes no sobreviven a un paso por Markdown. Una entrada así se marca con pérdida, y `posts update` se niega a
  escribir su cuerpo, con `content.lossy-body`. El título, el extracto, las etiquetas y el estado se pueden cambiar
  igualmente. Para escribir el cuerpo de todos modos, aplanando esos bloques, añade `--replace-body`.

## La API de WordPress

`wordpress blog api` ejecuta cualquier operación de la API REST de WordPress (`wp/v2`), un comando por operación, con
sus propias opciones y su ayuda. Alcanza lo que no tiene comando propio: medios, comentarios, menús, usuarios, ajustes
y más. Tiene 150 operaciones, de un WordPress 6.9.4 sin cambios.

```sh
wordpress blog api list                               # every operation, without calling WordPress
wordpress blog api show postWpV2PostsById             # one operation's parameters and body
wordpress blog api media-list                         # the media library
wordpress blog api posts-update --id 63 --body '{"sticky":true}'
```

Una escritura toma el cuerpo de la petición como JSON en `--body`, o de un archivo con `--body-file`. Los campos de
plugins, como los de un plugin de SEO o de campos personalizados, no están en la descripción de la API, así que los
envías en un `--body` sin procesar. La ruta de lotes de WordPress nunca se ofrece. Lo que necesita cada escritura está
en [permisos](./permissions.md).

## Salida para scripts

Todos los comandos salvo `mcp serve` por stdin y stdout aceptan `--json` e imprimen un valor JSON en stdout.
`--json=external_id,title` conserva solo esos campos. Los errores salen en JSON por stderr, con un código y un motivo
con los que decidir qué hacer. La [referencia de comandos](./commands.md) enumera los códigos de salida.

## Agentes

`wordpress skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`wordpress skill install --for hermes` además añade esa carpeta a los ajustes propios de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes.

Un agente con terminal ejecuta entonces `wordpress` por sí mismo. Pide con palabras normales:

> *"Usa wordpress. ¿Qué borradores no he tocado en un mes?"*
> *"Usa wordpress. Haz un borrador a partir de notes.md, con la etiqueta release."*
> *"Usa wordpress. ¿Qué dice nuestra página Acerca de sobre los precios?"*

Para Claude Desktop, Cursor, ChatGPT y otras apps que no pueden ejecutar comandos, `wordpress blog mcp serve` ofrece
los mismos comandos por MCP. Por MCP, una escritura en `ask` sigue adelante, también una publicación. Consulta
[MCP](./mcp.md).
