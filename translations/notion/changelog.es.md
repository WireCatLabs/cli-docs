---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/notion-cli`. Una sección por versión, la más reciente primero.

## 0.5.0 — 17.11.2026

### Corregido

- **Un resultado de búsqueda de Notion nombra `notion` y el perfil.** `memo search` y `search all` mostraban una página
  de Notion como `provider: notes` con el número de cuenta del almacén, y la etiqueta del árbol mostraba ids sin
  procesar, porque notion nunca decía cuál es la cuenta de su perfil. Ahora una sincronización la registra mediante el
  motor de documentos de cli-core.
- **La raíz del espacio de trabajo y las bases de datos quedan fuera de la búsqueda.** Son entradas del catálogo, no
  páginas. La búsqueda por palabras, la búsqueda por significado y el resumen de memo las mostraban con un extracto
  vacío, y `documents show` no podía abrirlas.
- **Se guarda el `relationships add` de un agente.** La relación se escribe sin confirmar para el propietario,
  que la confirma añadiendo la misma relación o la rechaza quitándola. Antes no se escribía nada.
- **Una sincronización cortada dentro de la pasada propia de Notion dice que se sincronice de nuevo.** Cuando un
  listado lento llegaba al plazo, su cursor esperaba en el plan pendiente de la sincronización, donde notion no
  miraba. La respuesta decía `complete: false` sin ningún paso siguiente, y `status` daba un total como si la pasada
  estuviera planificada. Ahora notion lee también ese cursor.
- cli-core 0.687.0 (antes 0.680.0), cli-base 0.109.0 (antes 0.106.0).
- La sincronización guarda ahora al creador de una página y a quien la editó por última vez como personas en el
  almacén compartido, con sus nombres y direcciones de correo de Notion, y enlaza la página con ellas como `owner` y
  `last-editor`. Una dirección de correo las une a la persona que ya la tiene, así que el contexto de una persona
  muestra las páginas de Notion que escribió o editó. Para esto la conexión necesita la capacidad de leer la
  información de los usuarios con sus direcciones de correo. Sin ella, los autores se guardan por su id de Notion, y
  `sync` y `doctor` lo dicen. Una página sincronizada antes de esto recibe sus autores la próxima vez que cambie.
- `identities link <page> <notion-id> person:<uid>` funciona. Ya no falla porque el usuario de Notion no esté en el
  almacén, y mueve a la persona el enlace de cada página sincronizada que apuntaba a ese usuario.

## 0.4.0 — 16.11.2026

### Novedades

- `comments list`, `comments create` y `comments reply` leen y escriben los comentarios de una página de Notion, en
  directo. `comments list` muestra solo los comentarios sin resolver, porque la API de Notion no da otros. El texto de
  un comentario nunca llega a un registro de ejecución. Consulta
  [Comments and files](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/DESIGN.md#comments-and-files).
- `files upload <file> --parent <page>` sube un archivo y lo añade al final de una página como bloque de imagen,
  vídeo, audio, PDF o archivo. Un archivo de más de 20 MB se envía en partes de 10 MB. Solo se envía un archivo
  normal, igual que con `--file`.
- Cada escritura comprueba su propio permiso (`comments.create`, `files.upload`) y las operaciones `api` que envía, y
  acepta `--dry-run`.

### Cambios — pueden romper scripts

- `folders browse` pagina: `--limit` (100 por defecto) y `--cursor` desde `page.next_cursor`. En la raíz del espacio
  de trabajo lee la búsqueda de Notion una página cada vez en lugar de entera, así que un espacio de trabajo grande
  responde en menos de un minuto. Cada elemento dice ahora dónde está (`parent`, null en la raíz) y si la
  sincronización ya lo copia, como `added`, el campo que usa `folders browse` de drive, en lugar de `chosen`. Una base
  de datos no lista nada dentro, ya que sus filas no son carpetas. Cuando la búsqueda de Notion se cortó en 10 000
  resultados, la respuesta lo dice en `missing`.

### Corregido

- En Windows, `files upload` y `--file` también rechazan un enlace a un archivo. Windows no tiene `O_NOFOLLOW`, así
  que allí se seguía el enlace.

## 0.3.0 — 16.11.2026

### Novedades

- `documents create`, `documents update`, `documents delete` y `documents restore` escriben páginas de Notion.
  `create` crea una página dentro de otra página a partir de Markdown, `update` sustituye el texto de una página,
  `delete` mueve una página a la papelera de Notion y pregunta antes, y `restore` la recupera. Una actualización que
  borraría una página hija o una base de datos se rechaza salvo que se indique `--allow-deleting-content`, y entonces
  pregunta como un borrado. Cada escritura pasa por los permisos del perfil y el diario de escrituras, responde con un
  `operation_id` y se previsualiza con `--dry-run`. Una llamada `api` que borra, manda a la papelera, elimina o
  archiva contenido, o que quita una propiedad de una base de datos, ahora pregunta como `documents delete`, así que
  `documents.delete` en `deny` también la detiene, incluso dentro de una llamada `agent-batch` que contiene un
  borrado. `--file` solo lee un archivo normal, nunca un enlace, uno bajo `/proc`, `/sys` o `/dev`, ni un archivo de
  credenciales. Consulta
  [Writes](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/DESIGN.md#writes).

### Corregido

- La [página de instalación](./installation.md#sign-in) muestra cómo iniciar sesión con `session start`.
- `bin/notion-live` lee el token del servicio del llavero que nombra `NOTION_LIVE_KEYRING_SERVICE`. Si no está
  definida, el servicio sigue siendo `notion-live`.
- Un `sync` normal elimina las filas de una fuente de datos que se quitó de su base de datos. Antes se quedaban en la
  copia local hasta `sync --rescan`. Cuando Notion no muestra la base de datos (403), las filas se quedan.

### Seguridad

- cli-core 0.680.0 y cli-base 0.106.0. Ahora cli-core rechaza por sí mismo los archivos bajo `/proc`, `/sys` y
  `/dev`, así que `--file` usa su comprobación en lugar de la propia de notion. `--file` sigue abriendo el archivo una
  sola vez, nunca a través de un enlace, y comprueba el archivo que abrió.

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
  se sincroniza. Consulta [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/SYNC.md).
- Una sincronización dura hasta 15 minutos en una terminal y 45 segundos por MCP, salvo que `--timeout` fije otro
  tiempo (cli-core 0.671.0). Se detiene antes de su plazo, tanto en la pasada de cada hora como en el recorrido
  diario, petición a petición. Guarda dónde se detuvo, responde `complete: false` y nombra `sync` como el siguiente
  paso. Las páginas hijas de una página salen de su listado, 100 por petición. Un `--timeout` demasiado corto para
  guardar algo falla con `timeout` y el motivo `notion.timeout-too-short`. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/SYNC.md).
- Una conexión de Notion es un perfil. `session start` y `sync` rechazan una conexión que usa otro perfil con la
  sesión iniciada, y un perfil sincronizado desde una conexión rechaza el token de otra. Un perfil que inició sesión
  con `WCNOTION_TOKEN` también cuenta. Consulta
  [el inicio de sesión](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/DESIGN.md).
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
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/SYNC.md).
- Las consultas a bases de datos se ajustan al límite documentado de Notion, unas 3 peticiones por segundo, no 60 por
  minuto. Consulta [el diseño](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/DESIGN.md).
- `folders browse --parent` y la copia sincronizada dan a una página dentro de otra su enlace, en la forma propia de
  Notion `https://app.notion.com/p/{page-id}`, en lugar de un `url` vacío. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/SYNC.md).

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
  [Cobertura](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/API_COVERAGE.md).
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
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.5.0/docs/dev/SYNC.md).
