---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/notion-cli`. Una sección por versión, la más reciente primero.

## 0.10.0 — 26.11.2026

### Cambios — pueden romper scripts

- **`session start | status | end | list` son ahora los comandos de sesión compartidos de cli-core** (cli-core 1.3.0).
  Un perfil que ya había iniciado sesión conserva su token, sin un nuevo inicio de sesión: la entrada del llavero es la
  misma. `session list` da a cada fila un `state` (`saved`, `missing` o `unknown`). Un perfil cuyo inicio de sesión no
  se puede leer, por ejemplo porque esta ejecución no llega al llavero, aparece en la lista con `signed_in: null` y
  `state: "unknown"` y un aviso, cuando antes fallaba toda la lista. `session status --check` rechaza primero una
  ejecución sin conexión, como hace `session start`.
- **Construido sobre cli-core 1.3.0.**

## 0.9.0 — 25.11.2026

### Novedades

- **Mantén iguales una carpeta local de archivos Markdown y las páginas de Notion, en ambos sentidos.**
  `mirrors add <page> <folder>` empareja una carpeta con las páginas que hay bajo una página de Notion: cada página es
  un archivo con el nombre de su título, y las páginas que tiene debajo están en una carpeta con el mismo nombre.
  `mirrors sync` copia cada cambio al otro lado. Un borrado va a la papelera del otro lado, y solo una página en la
  papelera de Notion cuenta como borrada. Cada sobrescritura conserva el texto anterior durante
  `keep_versions_for_days` (365 por defecto). Un archivo cambiado en los dos lados se fusiona línea a línea, o se
  lista para `mirrors conflicts resolve`. También están `mirrors preview`, `status`, `watch`, `update`, `remove` y
  `versions list|restore`. Son los comandos compartidos de cli-core, los mismos que en ydisk. Consulta
  [uso](./usage.md).

### Cambios — pueden romper scripts

- **Construido sobre cli-core 1.0.0 y cli-base 1.0.0.** Los archivos de API generados leen sus tipos de
  `@wirecat/cli-base/codegen/runtime`, y los tipos del almacén de `@wirecat/cli-core/store/areas`. La versión 73 del
  almacén llega con cli-core 1.0: en cuanto una herramienta 1.0 abre el almacén, una herramienta 0.x lo rechaza, así
  que actualiza todos los WireCat CLI a la vez.
- **Por MCP, una llamada que indica un archivo de credenciales o una carpeta de WireCat responde ahora
  `permission_error`** (`access.denied`), algo que cli-core comprueba antes de ejecutar el comando. Antes respondía
  `validation_error`.

### Corregido

- **El texto que sustituye `documents update` se conserva tanto como las versiones sincronizadas.** Antes se quedaba
  30 días. Ahora sigue el `keep_versions_for_days` del perfil, 365 días por defecto, el mismo plazo que
  `documents history`.
- **Un agente programado lee marcado el texto de Notion de otras personas.** En una ejecución bloqueada en solo
  lectura con una marca (`WCNOTION_READ_ONLY=1` y `WCNOTION_UNTRUSTED_MARK`), `documents get` marca el Markdown de la
  página, `folders browse` los nombres, `databases list|show` los títulos, descripciones, nombres de propiedades,
  opciones de selección y nombres de plantillas, `rows
  list` los títulos de las filas, `comments list` el texto del comentario y su autor, y las operaciones del grupo
  `api` cada cadena de la respuesta sin procesar, dejando sus claves como están. Los comandos compartidos de cli-core
  ya marcaban los suyos, entre ellos `mirrors preview` y `mirrors conflicts list|show`. Fuera de una ejecución así no
  cambia ninguna respuesta. Un nombre de propiedad marcado se devuelve a `rows list --filter` sin las marcas. Aún sin
  marcar: los valores de `properties` en `rows list`, cuyas claves cambian en cada base de datos.
- **Un `--rescan` quita como borrada una página o fila encontrada en la papelera de Notion.** Un recorrido completo que
  leía directamente una página o fila guardada y la encontraba en la papelera la dejaba fuera, así que seguía como ya
  no visible con su texto conservado. Ahora sale como borrada, como ya hacía el flujo de cambios. Una página que Notion
  ya no encuentra sigue como ya no visible. Lo que había bajo una página o base de datos en la papelera no se lee, y
  sale como ya no visible, como antes.

## 0.8.0 — 23.11.2026

### Novedades

- **El texto de una página se edita en el sitio, en la versión que leyó un agente.** `documents get` responde
  `sha256`, y `documents check <page> --expected-fingerprint <sha256>` dice si cambió desde entonces.
  `documents update
  <page> --payload '[{"old": "Due Friday", "new": "Due Monday"}]' --expected-fingerprint <sha256>` cambia solo esas
  partes, con el `update_content` de Notion. Un `--text` o `--file` completo también acepta `--expected-fingerprint`.
  La página se vuelve a leer justo antes de la escritura, y la escritura se rechaza si cambió
  (`mirror.remote-changed`). Notion no tiene escritura condicional, así que una edición que llega después de esa
  lectura no se detecta. Una parte cuyo texto antiguo no aparece exactamente una vez en la página se rechaza sin enviar
  nada, y una parte que Notion sigue dando como no encontrada deja la respuesta incompleta. Por qué: un agente solo
  podía reescribir una página entera, por encima de la edición más reciente de cualquiera
  ([docs/dev/DESIGN.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#writes)).
- **Cada escritura de texto conserva el texto que sustituyó.** Lo guardan las versiones locales del perfil, y la
  respuesta lo nombra (`replaced.sha256`, `replaced.kept_at`).
- **Versiones anteriores de cada página sincronizada y un registro de cambios.** `documents history <page>` enumera
  las versiones que guardaron las sincronizaciones, y `--revision <n>` muestra una. `changes --since 1d` enumera las
  páginas añadidas, cambiadas, borradas o ya no visibles. `keep_versions_for_days` (365 por defecto) fija cuánto
  tiempo se guardan. Ambas son lecturas locales, así que un agente también las obtiene por MCP
  ([docs/dev/SYNC.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md)).
- **Las notas de reuniones de Notion AI en las reuniones de WireCat.** `notion <profile> meetings sync` copia las
  notas de las reuniones a las que asistió el usuario del token, con los asistentes, el resumen de IA, las notas y la
  transcripción, al almacén compartido junto a las llamadas de Zoom. `meetings list`, `show`, `transcript`, `summary`,
  `export` y `people` las leen sin conexión, y `search all` las encuentra. Un resumen que Notion escribe después de la
  reunión se lee en la siguiente sincronización. Notion no documenta ningún formato de línea para una transcripción,
  así que sus líneas se guardan tal como se escribieron, sin hablante ni hora. Por qué: las reuniones del propietario
  en Notion no estaban con las demás ([docs/dev/DESIGN.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#meeting-notes)).
- **Una fila de base de datos se crea y se cambia con valores tipados.** `documents create --into <database>` añade
  una fila con `--title` y `--field Name=Value`. Cada valor se comprueba con las propiedades de la base de datos y se
  envía como lo acepta su tipo: texto, número, select, status, multi-select, fecha o intervalo, casilla, enlace,
  correo, teléfono, personas y relaciones. Una persona es una dirección de correo, un id de usuario o `me`.
  `--from-template default`, el id de una plantilla o su nombre rellena la fila desde una plantilla, y la respuesta
  dice `template_pending: true`, ya que Notion añade el texto de la plantilla después de responder.
  `documents update <row> --field Status=Done` cambia los valores indicados y conserva el resto. `rows list
  <database> --filter Status=Open --filter "Due<2026-12-01"` enumera filas en directo con sus valores.
  `databases show` ahora enumera las plantillas de cada fuente de datos. Por qué: un agente solo podía añadir una tarea
  a una base de datos de Notion con llamadas `api` sin procesar, sin comprobar sus valores ([docs/dev/DESIGN.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#rows)).
- **`notion <profile> documents move` y `documents rename` colocan y nombran páginas.** `move` pone una página
  bajo otra (`--parent`) o en una base de datos (`--into`). `rename` fija el título de una página o fila.
  `documents update
  --emoji` y `--cover` fijan el icono y la portada, o los quitan con `none`. Por qué: mover una página necesitaba una
  llamada `api` sin procesar ([docs/dev/DESIGN.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#moving-and-renaming)).
- **Los comentarios están en la copia local y en la búsqueda, y los comentarios propios de la conexión se pueden
  corregir.** La sincronización lee los comentarios abiertos de una página junto con su texto y los añade al texto de
  búsqueda de la página, nunca a su Markdown. Una página sincronizada antes de esta versión se lee una vez más para
  añadirlos. Una conexión sin la capacidad «Read comments» recibe un solo aviso y el resto de la sincronización sigue.
  `comments edit` y `comments delete` cambian o borran un comentario que publicó esta conexión. Notion no conserva
  ningún comentario borrado, así que `comments delete` pregunta antes, como hace `documents delete`, y ambos
  devuelven el texto anterior del comentario en `previous_text`
  ([docs/dev/SYNC.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md#comments)).

### Cambios — pueden romper scripts

- **Usa `@wirecat/cli-core` 0.724.0 y `@wirecat/cli-base` 0.130.0**, cuyo vocabulario incluye las palabras del
  comando compartido `changes` y las vistas `summary` y `people` de los comandos de reuniones compartidos.

### Corregido

- **Una página que responde con 404 pasa a ya no visible, no a borrada.** Notion da un 404 para una página borrada y
  para una que ya no se comparte con la conexión. Una página así sale de las listas y de la búsqueda, conserva su
  texto en la copia local y vuelve tal como estaba cuando Notion la muestra de nuevo. Solo una página en la papelera
  de Notion cuenta como borrada.
- cli-core 0.720.0 (antes 0.718.0), cli-base 0.126.1 (antes 0.125.0).

## 0.7.0 — 21.11.2026

### Novedades

- **`wirecat.config.ts` describe la fuente de la sincronización.** La configuración nombra la cuenta, cada llamada a
  Notion que envía la sincronización, la versión de la API y los dos ritmos. cli-core lee las llamadas por la misma
  ruta de peticiones que `notion api`. Antes, esto era código sobre el SDK de Notion. Una página sincronizada antes de
  que se guardaran los autores ahora la vuelve a leer el motor de cli-core, como máximo 50 por sincronización, y no
  mediante una versión marcada. Se leen las mismas páginas, con los mismos límites. Cambió un error: un token cuya
  respuesta no nombra ningún espacio de trabajo ahora falla con `source.no-account` de cli-core, no con
  `notion.no-workspace`. Por qué: attio y linear ya construyen sus fuentes desde una configuración, y un nuevo CLI de
  documentos ahora puede hacer lo mismo ([docs/dev/SYNC.md](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md#where-the-requests-come-from)).

## 0.6.0 — 19.11.2026

### Novedades

- **`notion <profile> account remove` cierra la sesión de un perfil y lo olvida en este equipo.** Olvida el token de
  Notion, los ajustes del perfil, sus páginas elegidas y su punto de sincronización. `--keep-data` deja las páginas
  copiadas en el almacén, donde la búsqueda aún las encuentra; `--delete-data` las borra. Pregunta antes, o acepta
  `--yes`; `--dry-run` enumera lo que quitaría. Por qué: WireCat Desktop quita una cuenta con este comando, y notion
  solo podía cerrar sesión con `session end`. El token en sí sigue siendo válido en Notion: revócalo en la página de
  integraciones de Notion.

### Cambios — pueden romper scripts

- **La entrada del MCP Registry pregunta qué perfiles servir.** Antes iniciaba `mcp serve --profiles all`, así que un
  cliente que instalaba el servidor desde el registro llegaba a todas las cuentas del equipo sin que el propietario
  eligiera. Ahora `--profiles` es un argumento obligatorio con el ejemplo `personal`: el cliente pide un perfil, una
  lista separada por comas o `all`. Por qué: un CLI nunca elige una cuenta por el propietario
  ([WC-MCP-9](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/mcp.md#wc-mcp-9--a-server-serves-the-profiles-it-is-told-with-one-connection-for-each)).
  Ten en cuenta: un cliente configurado con la entrada antigua conserva `--profiles all` hasta que se configure de
  nuevo; un servidor añadido a mano o con `mcp config` no cambia.

### Corregido

- **Las páginas sincronizadas antes de 0.5.0 reciben sus autores y últimos editores como personas sin un nuevo
  escaneo.** Un `sync` normal ahora vuelve a leer esas páginas, 50 por ejecución, y las enlaza con las personas que las
  escribieron y las editaron por última vez. También lo hace con las páginas leídas antes de que la conexión pudiera
  leer direcciones de correo, en cuanto una sincronización ve que ya puede. No vuelve a leer ninguna otra página.
  Antes, una página recibía sus personas solo cuando alguien la editaba.
- **Una primera sincronización lee cada página de Notion una vez en lugar de tres.** El recorrido preguntaba a Notion
  el tipo de cada página, y cada lectura de página volvía a preguntar por su página padre. notion ahora guarda lo que
  una ejecución ya vio, también del recorrido y del plan que guardó una ejecución anterior. Una página con 60 páginas
  debajo necesitaba 182 peticiones de página y ahora necesita 61, algo que importa con el límite de Notion de unas tres
  peticiones por segundo.
- **`api` es el grupo compartido de cli-core, como en attio, linear y hubspot.** Los comandos, sus nombres y sus
  claves siguen igual: cada escritura pregunta o se niega según `api.<operation>`, y una llamada que borra, por su
  método o por su cuerpo, también según `documents.delete`. Qué llamadas borran sale ahora del manifiesto generado,
  más cuatro reglas sobre el cuerpo que notion mantiene por su cuenta. Una corrección del grupo en cli-core llega ahora
  a notion con un cambio de versión.
- cli-core 0.707.0 (antes 0.687.0), cli-base 0.124.0 (antes 0.109.0).

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
  [Comments and files](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#comments-and-files).
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
  [Writes](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md#writes).

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
  se sincroniza. Consulta [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md).
- Una sincronización dura hasta 15 minutos en una terminal y 45 segundos por MCP, salvo que `--timeout` fije otro
  tiempo (cli-core 0.671.0). Se detiene antes de su plazo, tanto en la pasada de cada hora como en el recorrido
  diario, petición a petición. Guarda dónde se detuvo, responde `complete: false` y nombra `sync` como el siguiente
  paso. Las páginas hijas de una página salen de su listado, 100 por petición. Un `--timeout` demasiado corto para
  guardar algo falla con `timeout` y el motivo `notion.timeout-too-short`. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md).
- Una conexión de Notion es un perfil. `session start` y `sync` rechazan una conexión que usa otro perfil con la
  sesión iniciada, y un perfil sincronizado desde una conexión rechaza el token de otra. Un perfil que inició sesión
  con `WCNOTION_TOKEN` también cuenta. Consulta
  [el inicio de sesión](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md).
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
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md).
- Las consultas a bases de datos se ajustan al límite documentado de Notion, unas 3 peticiones por segundo, no 60 por
  minuto. Consulta [el diseño](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/DESIGN.md).
- `folders browse --parent` y la copia sincronizada dan a una página dentro de otra su enlace, en la forma propia de
  Notion `https://app.notion.com/p/{page-id}`, en lugar de un `url` vacío. Consulta
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md).

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
  [Cobertura](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/API_COVERAGE.md).
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
  [la sincronización](https://github.com/WireCatLabs/notion-cli/blob/v0.10.0/docs/dev/SYNC.md).
