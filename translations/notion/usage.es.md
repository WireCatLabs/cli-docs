---
title: "Úsalo"
---

Lee y cambia tus páginas de Notion desde un terminal, o deja que lo haga tu agente, siempre en el espacio de trabajo que
nombras. Cada comando empieza por un perfil, así que nada va a la cuenta equivocada.

Tú o tu agente podéis rellenar filas de bases de datos, cambiar una parte de una página sin volver a enviarla entera,
recuperar una versión anterior y leer tus notas de reuniones. Un script recibe JSON, con un código de error para decidir
qué hacer.

**En esta página:**

1. [Primero el perfil](#the-profile-comes-first)
2. [Salida para scripts](#output-for-scripts)
3. [Filas de bases de datos](#database-rows)
4. [Cambiar una parte de una página](#changing-part-of-a-page)
5. [Versiones anteriores y registro de cambios](#earlier-versions-and-the-change-log)
6. [Notas de reuniones](#meeting-notes)
7. [Agentes](#agents)

## Primero el perfil

Un perfil es un nombre que eliges para una cuenta. Es la primera palabra de cada comando que usa una cuenta:

```sh
notion personal config show
```

`WCNOTION_PROFILE=personal` hace lo mismo durante una sesión de la shell. Nunca se supone un perfil, ni siquiera el
único: un comando sin perfil se detiene con el código de salida 2 y muestra los perfiles de este ordenador.

## Salida para scripts

Todos los comandos salvo `mcp serve` sobre stdin y stdout admiten `--json` e imprimen un único valor JSON en stdout.
Los errores salen en JSON por stderr, con un código para decidir qué hacer. La
[referencia de comandos](./commands.md) lista los códigos.

## Filas de bases de datos

Las filas de una base de datos son páginas con valores de tipo fijo. Lee primero los nombres de las propiedades, las
opciones y las plantillas, y después escribe:

```sh
notion personal databases show DATABASE_ID
notion personal documents create --into DATABASE_ID --title "Write the plan" --field Status=Open --field Owner=me
notion personal documents update ROW_ID --field Status=Done
notion personal rows list DATABASE_ID --filter Status=Open --filter "Due<2026-12-01"
```

Cada `--field` se comprueba con el tipo de la propiedad antes de enviar nada. Una lista (selección múltiple, personas,
relaciones) recibe valores separados por comas, una fecha recibe `2026-12-01` o un rango `2026-12-01/2026-12-05`, y un
valor vacío la borra. `--from-template default`, o el nombre de una plantilla de `databases show`, rellena la fila con
una plantilla.

## Cambiar una parte de una página

Lee la página y envía solo las partes que cambian, con la huella que dio la lectura:

```sh
notion personal documents get PAGE_ID --json
notion personal documents update PAGE_ID --payload '[{"old": "Due Friday", "new": "Due Monday"}]' \
  --expected-fingerprint SHA256
```

La página se vuelve a leer justo antes de escribir. Si cambió desde tu lectura, no se escribe nada y el error pide que
la leas de nuevo. Notion no tiene escritura condicional, así que una edición que alguien haga en el segundo entre esa
comprobación y la escritura no se detecta. El texto que la escritura sustituyó se guarda en tus versiones locales, y la
respuesta dice dónde.

## Versiones anteriores y registro de cambios

```sh
notion personal documents history PAGE_ID
notion personal documents history PAGE_ID --revision 2
notion personal changes --since 7d --event deleted,unavailable
```

Cada sincronización guarda el texto de una página antes de que cambie o salga de la copia, durante
`keep_versions_for_days` días (365 por defecto). Una página en la papelera de Notion queda como `deleted`. Una página a
la que Notion responde 404 queda como `unavailable`: se borró para siempre o ya no está compartida con el token.
Conserva su texto y vuelve cuando Notion la muestre otra vez.

## Mantener iguales una carpeta de archivos Markdown y las páginas de Notion

Un espejo empareja una carpeta local con una página de Notion. Cada página bajo esa página es un archivo Markdown con
su título, y las páginas que tiene debajo están en una carpeta con el mismo nombre. Edita los archivos en cualquier
editor, o las páginas en Notion, y una sincronización copia cada cambio al otro lado.

```sh
notion personal mirrors add https://www.notion.so/Notes-0123456789abcdef0123456789abcdef ~/Notes
notion personal mirrors preview
notion personal mirrors sync
```

`mirrors add` comprueba la página y guarda el par. No se copia nada hasta `mirrors sync`. `mirrors preview` muestra lo
que haría una sincronización y no cambia nada.

Lo que hace una sincronización:

- **Un archivo nuevo o cambiado** se convierte en una página nueva o cambiada, y una página cambiada en Notion se
  escribe en su archivo. Notion guarda una página en su propio Markdown, así que después de enviar una página, su
  archivo recibe la forma del texto de Notion. Tu texto anterior se guarda como versión.
- **Un archivo borrado en un lado** va a la papelera del otro: la papelera de Notion para una página, y
  `.wirecat-trash/<date>/` dentro de la carpeta espejo para un archivo. Solo cuenta como borrada una página en la
  papelera de Notion. Una página que moviste a otro sitio, o que la conexión ya no ve, deja su archivo en paz.
- **Un archivo cambiado en los dos lados** se une línea a línea cuando los cambios están en sitios distintos. Cuando
  tocan las mismas líneas, la sincronización deja los dos como están y anota un conflicto. `mirrors conflicts list`
  los muestra, `mirrors conflicts show <id> <path>` muestra las tres versiones y `mirrors conflicts resolve <id> <path> --keep
  local`, `--keep notion`, `--keep both` o `--file <final>` resuelve uno.
- **Cada sobrescritura y cada borrado** guardan antes el texto anterior en este equipo, durante
  `keep_versions_for_days` días (365 por defecto). `mirrors versions list <id> <path>` las muestra y
  `mirrors versions restore <id> <path> <sha256>` recupera una.

Una sincronización que borraría más de 10 archivos o sobrescribiría más de 50 se detiene antes de cambiar nada y dice
qué opción la deja seguir. Ejecuta `mirrors preview` y luego `mirrors sync <id> --allow-deletions <count>` o
`--allow-replacements <count>`. `mirrors watch` sigue sincronizando hasta Ctrl-C. Notion no tiene un flujo de cambios,
así que en cada comprobación lee todas las páginas espejo, cada 5 minutos por defecto.

Límites:

- Solo los archivos `.md` se convierten en páginas. Deja fuera los demás con `mirrors update <id> --ignore <path>`.
- Una sincronización lee cada página espejo, unas dos solicitudes por página. Notion responde a unas tres solicitudes
  por segundo, así que 300 páginas tardan unos 3 minutos.
- Renombrar un archivo manda la página a la papelera y crea una nueva, así que la página pierde sus comentarios, los
  enlaces a ella y su forma de compartir. Renombra la página en Notion.
- Una página con páginas debajo solo va a la papelera cuando sus archivos también han desaparecido, así que borrar una
  carpeta de páginas lleva dos sincronizaciones.
- Dos páginas con el mismo título en el mismo sitio quedan fuera hasta que se renombra una.

Los permisos `api.post-page`, `api.update-page-markdown` y `api.patch-page` se aplican a una sincronización igual que a
`documents`, y un borrado en cualquier lado pide `documents.delete`.

## Notas de reuniones

```sh
notion personal meetings sync --since-time 2026-11-01
notion personal meetings list
notion personal meetings transcript 12
```

`meetings sync` copia las notas de reuniones de Notion AI de las reuniones a las que asististe, con sus asistentes, el
resumen de IA, tus notas y la transcripción. Usa un token de acceso personal: una conexión interna no asiste a
reuniones. Un espacio de trabajo sin notas de reuniones de Notion AI recibe un error con el motivo
`notion.meeting-notes-unavailable`.

## Agentes

`notion skill install` pone la skill de la herramienta donde la buscan Claude Code, Codex, Gemini CLI y OpenClaw.
`notion skill install --for hermes` además añade esa carpeta a los ajustes de Hermes Agent, así que un
`skill install` sin más deja fuera a Hermes. `notion personal mcp serve` sirve los comandos del perfil por MCP, sobre
stdin y stdout:

```sh
claude mcp add notion -- notion personal mcp serve
```

El servidor ofrece todos los comandos, también los que escriben. Los permisos del perfil deciden qué se ejecuta.
Consulta los [ajustes](./configuration.md#permissions).

Para ChatGPT y Claude en el navegador,
`notion personal mcp serve --http --public-url https://laptop.example.ts.net` escucha en `127.0.0.1` (puerto 8765, o
`--port`) detrás de tu propio túnel. Una aplicación del navegador inicia sesión con un código de un solo uso que
imprime el comando. `notion personal mcp revoke` cierra todas las sesiones. `notion personal mcp server start` ejecuta
el mismo servidor en segundo plano, `mcp server status` muestra su puerto, el código de inicio de sesión y las
aplicaciones conectadas, y `mcp server stop` lo detiene.
