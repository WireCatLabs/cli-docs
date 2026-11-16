---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/notion-cli`. Una sección por versión, la más reciente primero.

## 0.2.0 — 16.11.2026

### Novedades

- `notion <profile> sync` copia las páginas de Notion, las páginas dentro de páginas, las bases de datos y sus filas
  al almacén compartido de WireCat, con el proveedor `notion`. Sin una carpeta elegida copia todo lo que ve el token.
  `--limit` acota una ejecución y `--rescan` vuelve a recorrerlo todo. Una página o base de datos que Notion no entregó
  se nombra en `meta.issues` y en los `warnings` de la respuesta. Entonces la respuesta indica `meta.complete: false` y
  sale con 0. Un recorrido demasiado largo para una ejecución se detiene a tiempo y la siguiente sincronización
  continúa. El tamaño de las carpetas elegidas no tiene límite. Un bloque dentro de una página cuyos hijos Notion no
  entrega (un bloque sincronizado cuyo original no está compartido) se omite con un aviso. Una página o base de datos
  a la que Notion responde 403 se queda como estaba. Solo un 404 o la papelera la eliminan. Un bloque que Notion
  rechaza en el Markdown de una página, o una fuente de datos que no deja consultar, se omite con un aviso y el resto
  se sincroniza. Consulta [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/SYNC.md).
- Una sincronización dura hasta 15 minutos en una terminal y 45 segundos por MCP, salvo que `--timeout` fije otro
  tiempo (cli-core 0.671.0). Se detiene antes de su plazo, tanto en la pasada de cada hora como en el recorrido
  diario, petición a petición. Guarda dónde se detuvo, responde `complete: false` y nombra `sync` como el siguiente
  paso. Las páginas hijas de una página salen de su listado, 100 por petición. Un `--timeout` demasiado corto para
  guardar algo falla con `timeout` y el motivo `notion.timeout-too-short`. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/SYNC.md).
- Una conexión de Notion es un perfil. `session start` y `sync` rechazan una conexión que usa otro perfil con la
  sesión iniciada, y un perfil sincronizado desde una conexión rechaza el token de otra. Un perfil que inició sesión
  con `WCNOTION_TOKEN` también cuenta. Consulta
  [el inicio de sesión](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/DESIGN.md).
- Las páginas dentro de páginas, y una página como carpeta elegida, ya se sincronizan. La 0.1.0 decía que aún no
  estaban hechas.
- `folders add|list|browse|remove` acotan la sincronización a las páginas y bases de datos elegidas. `folders browse`
  lista un nivel en directo desde Notion. Al quitar la última carpeta, el comando avisa de que la siguiente
  sincronización vuelve a copiar todo el espacio de trabajo. Por MCP, `folders add` pasa por la herramienta de
  escritura.
- `status`, `documents list|show|export|context|add`, `search` (sintaxis de Lucene, sin conexión), `catalog`, `tags`,
  `relationships`, `notes`, `memories`, `facts` e `identities`: los comandos de documentos compartidos de cli-core
  sobre la copia local. `documents add` guarda una página, leída en directo, entre las fuentes añadidas a mano.

### Corregido

- Una primera sincronización de una base de datos grande, o de una página con muchas páginas hijas, avanza en cada
  ejecución, también dentro de los 45 segundos de MCP. La sincronización lista una carpeta página a página y continúa
  donde se detuvo (`childrenPage` de cli-core). Antes, una base de datos de más de unas 12.000 filas detenía la primera
  sincronización por MCP en el mismo paso en cada ejecución. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/SYNC.md).
- Las consultas a bases de datos se ajustan al límite documentado de Notion, unas 3 peticiones por segundo, no 60 por
  minuto. Consulta [el diseño](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/DESIGN.md).
- `folders browse --parent` y la copia sincronizada dan a una página dentro de otra su enlace, en la forma propia de
  Notion `https://app.notion.com/p/{page-id}`, en lugar de un `url` vacío. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/SYNC.md).

## 0.1.0 — 15.11.2026

### Novedades

- Creado a partir de `@wirecat/cli-template` 0.24.0.
- **`api`: toda la API pública de Notion, un comando por operación.** Las 61 operaciones del
  [documento OpenAPI](https://developers.notion.com/openapi.json) de Notion son comandos, `notion personal api retrieve-a-page
  --page-id …`, cada uno con su propia clave de permiso, `api.<operation>`. `api list` y `api show <operation>` leen el
  documento guardado sin llamar a Notion. Cada petición lleva `Notion-Version` 2026-03-11, así que ningún comando la
  pide. Una operación que borra pregunta antes en una terminal. Por MCP, `ask` la deja pasar, así que pon su clave en
  `deny` para frenar a un agente. `--dry-run` no envía nada. No se ofrecen las operaciones de tokens OAuth ni las dos
  subidas de archivos. Las primeras inician sesión con el secreto de cliente de la conexión y llevan tokens, las
  segundas envían cuerpos multipart. Las comprobaciones aceptan algo más que Notion: cualquier valor JSON queda sin
  tipo, y tres límites (`exclusiveMinimum`, `exclusiveMaximum`, `maxProperties`) se omiten en seis sitios, así que es
  Notion quien rechaza lo que los incumple.
  [Cobertura](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/API_COVERAGE.md).
- `session start | status | end | list` con un token de acceso personal de Notion o el token de una conexión interna.
  Se comprueba con Notion y se guarda en el llavero como `token:<profile>`. La cuenta es el espacio de trabajo y el bot
  del token.
- `documents get` lee una página en directo como Markdown, completa las partes que faltan de una página larga y quita
  la firma de los enlaces firmados de Notion a archivos. Una página que sigue incompleta responde
  `meta.complete: false` y sale con un código distinto de cero.
- `databases list` y `databases show`: las bases de datos que ve el token, y el id y las propiedades de cada fuente de
  datos.
- Las peticiones van por debajo del límite de Notion, más despacio aún para las consultas a fuentes de datos. Tras un
  rechazo, la herramienta espera lo que indica el `Retry-After` de Notion. No se vuelve a intentar con una conexión que
  Notion ha bloqueado.
- Las variables de entorno empiezan por `WCNOTION_` (`WCNOTION_TOKEN`, `WCNOTION_PROFILE`), no por `NOTION_`. El propio
  servidor MCP de Notion lee `NOTION_TOKEN`, y un token definido para él no debe iniciar sesión en esta herramienta.
- Una fuente de sincronización incremental para Notion, lista para el motor de sincronización de cli-core. Lee los
  cambios desde una marca de tiempo con solapamiento, consulta cada base de datos del alcance, lo recorre todo una vez
  al día y solo elimina una página cuando Notion confirma que ya no existe. Las bases de datos grandes se leen
  enteras, más allá del tope de 10.000 filas por consulta de Notion. Un elemento que Notion rechaza se omite con un
  aviso, y una sincronización interrumpida continúa la próxima vez. Aún no: las páginas dentro de páginas, y una página
  como carpeta elegida, que esperan a cli-core. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.2.0/docs/dev/SYNC.md).
