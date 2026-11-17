---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/asterisk-cli`. Una sección por versión, la más reciente primero.

## 0.7.2 — 16.11.2026

### Corregido

- **Una llamada muestra su dirección, el empleado y el número de quien llama en `memo context` y WireCat Desktop.**
  `pbx` los guardaba solo en los detalles de la llamada, así que otras herramientas mostraban la llamada como un
  título sin más. Una llamada sincronizada antes de esta versión los recibe en una sincronización que la vuelve a
  leer: `pbx office meetings sync --since-time <the first call's date>` (la fecha de la primera llamada). Una llamada
  interna, entre dos extensiones, no tiene ninguno. Consulta [lo que obtienes de cada
  llamada](./usage.md#what-you-get-from-each-call).

## 0.7.1 — 16.11.2026

### Corregido

- **Una sincronización ya no imprime el aviso sobre `asterisk.users`.** Cuando el usuario de una base de datos MySQL
  no puede leer la tabla `asterisk.users` de FreePBX, como en un Asterisk sin FreePBX, cada sincronización decía que
  no se leyeron los nombres de las extensiones, también la programada (cron). Ahora la comprobación de
  `pbx office setup`, `session start` y `session status --check` imprime el aviso una vez, donde estás mirando, y la
  sincronización no dice nada. Si das el permiso más tarde, la siguiente sincronización lee los nombres. Consulta
  [nombres de las extensiones](./installation.md#names-of-the-extensions).
- **La documentación dice que WireCat Desktop reproduce la grabación de una llamada.** Desktop la reproduce en la
  ficha de la llamada cuando la carpeta de grabaciones está en este ordenador, y el enlace que imprime
  `meetings show` abre la llamada. Una grabación que `pbx` lee por SFTP se queda en la centralita.

## 0.7.0 — 16.11.2026

### Añadido

- **`pbx office setup` conecta un perfil pregunta a pregunta, y WireCat Desktop muestra las mismas preguntas.**
  Pregunta dónde están los registros de llamadas (Master.csv, MySQL o MariaDB, PostgreSQL), si los archivos están en
  este ordenador o en la centralita por SFTP, la base de datos a través del servidor SSH de la centralita cuando solo
  escucha allí, la carpeta de grabaciones y los países de las líneas telefónicas. Lee la última hora de llamadas para
  comprobar las respuestas, la misma comprobación que `session start`, y guarda los ajustes y las contraseñas solo
  cuando funciona. Una contraseña o un ajuste rechazados lo devuelven al paso que los tiene. `setup show --json`,
  `setup apply --dry-run` y `setup run apply --answer-stdin` dan las mismas preguntas a WireCat Desktop, en inglés,
  ruso y español. Consulta [instalar y conectar](./installation.md#connect-from-the-terminal).
- **Un servidor cambiado nunca recibe la contraseña antigua.** Cuando `setup` cambia un servidor de base de datos,
  SSH o SFTP, su puerto, su usuario o la fuente, una contraseña vacía se rechaza (`validation_error`, `param` nombra
  el campo) en lugar de probar la guardada en el sitio nuevo.
- **Un perfil sin conectar señala `setup`.** El mensaje de un perfil que nunca se conectó, y la primera pantalla de
  `pbx`, nombran `pbx <profile> setup`.
- **`extension_names` da nombre a los empleados que nunca hacen una llamada.** Se define como
  `101=Anna Smirnova,103=Vera Orlova`, o en `pbx office setup` y WireCat Desktop. Antes, una extensión solo recibía
  nombre del identificador de llamada de una llamada que hizo, así que `stats calls show` mostraba como un simple
  número a un empleado que solo atiende. Un nombre de aquí gana. Consulta
  [nombres de las extensiones](./installation.md#names-of-the-extensions).
- **Los nombres de las extensiones del propio FreePBX.** En el MySQL de FreePBX, `pbx` lee `asterisk.users` con el
  mismo usuario de la base de datos, solo las dos columnas `extension` y `name`, así que el administrador da permiso
  sobre esas columnas y nunca sobre las contraseñas de los teléfonos de la misma tabla. Un usuario sin ese permiso
  sincroniza como antes; cada sincronización imprime un aviso. El orden: `extension_names`, después FreePBX, después
  el identificador de llamada.

### Cambios — pueden romper scripts

- **`phone_region` también acepta una lista.** El flujo de configuración guarda los países elegidos como lista
  (`["RU","ES"]`), y `config set phone_region es,ru` ahora también. Un texto separado por comas definido antes se lee
  como antes.

### Corregido

- **Una sincronización ya no pierde el nombre de una extensión en una llamada que vuelve a leer.** Si los registros
  leídos esta vez no tenían ninguna llamada que nombrara la extensión, la llamada se quedaba sin nombre para ella;
  ahora conserva el nombre con el que se guardó.

## 0.6.1 — 16.11.2026

### Corregido

- **`session start` ya no espera para siempre ante una tubería que sigue abierta.** Lee una línea por cada contraseña
  que necesita y se detiene ahí, así que un programa que deja stdin abierto tras la última contraseña, como hacía
  antes WireCat Desktop, recibe su respuesta. Una tubería que no envía nada se rinde a los 30 segundos con «no
  password was given».
- **Un perfil que nunca se conectó lo dice.** `meetings sync` y los demás comandos que leen la centralita ya no piden
  `cdr_csv_path` a un perfil sin ajustes de fuente propios. Dicen que el perfil no está conectado, señalan
  [instalar y conectar](./installation.md) y listan los perfiles de este ordenador. Un perfil que eligió
  `cdr_source csv` sigue recibiendo el nombre del ajuste que falta. El motivo sigue siendo `source.not-configured`.
- **La documentación:** la página de problemas nombra el motivo `network.failed`, como lo da el error; las páginas de
  ajustes y de seguridad tienen índice; el servidor MCP, el registro de ejecución y los archivos de este ordenador
  tienen sus propias secciones en la página de seguridad, fuera de «Grabaciones y consentimiento»; dos fragmentos de
  código ya no se parten entre dos líneas.

## 0.6.0 — 15.11.2026

### Añadido

- **`stats calls show` cuenta las llamadas guardadas.** Da las llamadas por dirección y resultado, por empleado, por
  hora y por día. También da las llamadas entrantes perdidas, si se devolvió la llamada al cliente, y las llamadas
  cortas. Solo lee el almacén local. Consulta [un informe de la semana](./usage.md#a-report-of-the-week).
- **`search meetings` encuentra una llamada por lo que se dijo.** Busca por palabras, y con `--model embeddinggemma`
  también por significado, con un modelo de texto en este ordenador (un programa que compara el significado de las
  frases). `meetings embed --yes` prepara antes los datos de
  búsqueda, un lote por ejecución. `models list` y `models download` ahora también ofrecen los modelos de texto.
  Consulta [encuentra llamadas por su significado](./usage.md#find-calls-by-what-was-meant).
- **`tags add`, `tags remove` y `tags list` etiquetan llamadas.**
  `tags add complaint --matching "refund OR complaint"` etiqueta cada llamada que encuentra la búsqueda. Una nueva
  ejecución etiqueta solo las nuevas. `--meeting <id>` etiqueta una llamada. Consulta
  [etiqueta todas las llamadas sobre devoluciones](./usage.md#mark-every-call-about-refunds).
- **Una base de datos que solo escucha en la centralita se alcanza por el SSH de la centralita.** Define
  `db_ssh_host`, `db_ssh_user` y un archivo de clave en `db_ssh_key_path`, o una contraseña. Antes, la clave del
  servidor se fija en `db_ssh_host_key`. `pbx` abre el túnel SSH (una conexión a la base de datos a través del acceso
  SSH del servidor) en cada comando y lo cierra después. Consulta
  [una base de datos detrás del SSH de la centralita](./installation.md#a-database-behind-the-phone-systems-ssh).
- **Un perfil puede guardar más de una contraseña.** Un perfil es el nombre que das a la conexión con la centralita.
  Un perfil de base de datos también puede entrar con contraseña en SFTP (transferencia segura de archivos por SSH) o
  en SSH. `session start` pide cada contraseña que necesita. Si se pasan por una tubería, van una por línea. Se
  guardan en la única entrada del perfil en el llavero (donde el sistema guarda las contraseñas).
- **Transcripción en la nube, de perfil en perfil.** `config set transcribe_engine openai` envía la voz de las
  grabaciones a OpenAI en lugar del modelo local, con la clave en `OPENAI_API_KEY`. Antes de que salga el primer
  fragmento, la ejecución dice adónde va el audio. Sigue desactivada salvo que la activen los ajustes del propio
  perfil. Consulta [transcripción en la nube](./installation.md#cloud-transcription).
- **`meetings show` imprime en la terminal un enlace de WireCat Desktop a la llamada**, `wirecat://open/v1/meeting/…`.
  Abrirá la llamada cuando Desktop admita enlaces a llamadas.
- **`meetings show` nombra el archivo de cada grabación en este ordenador** en `local_path`, para que WireCat Desktop
  pueda reproducirla. Es `null` cuando la grabación se lee por SFTP. Esto llega con cli-core 0.668.0.
- **Master.csv y las grabaciones de cualquier tamaño por SFTP.** Se leen por partes, y una conexión que se corta se
  vuelve a abrir donde se paró. Una grabación de la centralita se copia en un archivo temporal privado mientras se lee,
  y se borra después. Una grabación WAV, GSM o M4A de cualquier tamaño se transcribe, hasta una hora de audio.
- **Una grabación estéreo WAV, GSM o M4A conserva sus dos canales.** Así `recordings_channels` nombra a quien llama y
  al empleado en cada línea también en estos formatos.

### Cambios — pueden romper scripts

- **Una llamada estéreo WAV, GSM o M4A se transcribe como dos canales.** Sus líneas dicen `Channel 1` y `Channel 2`,
  o los nombres que da `recordings_channels`. Antes eran un solo texto mezclado. `meetings transcribe --replace` lo
  hace con las llamadas ya transcritas.
- **Una grabación MP3, Ogg o FLAC puede ocupar hasta 64 MB,** no 256 MB. Eso es más de una hora con la calidad
  telefónica habitual, y una grabación de más de una hora nunca se transcribía.
- **El registro de ejecución nombra las peticiones a la base de datos `sql.connect`, `sql.columns` y `sql.rows`,** no
  `cdr.connect`, `cdr.columns` y `cdr.rows`. Si la base de datos no responde a tiempo, el motivo ahora es
  `db.timeout`, y si no se puede alcanzar, `network.failed`.

## 0.5.0 — 14.11.2026

### Añadido

- **Una transcripción puede nombrar quién dijo cada línea.** Define `recordings_channels` como `caller,employee` o
  `employee,caller`, según cómo graba los dos lados tu plan de marcación (las reglas que dirigen las llamadas). Así
  cada línea de una grabación estéreo MP3, Ogg o FLAC nombra a quien llama por nombre y número, o al empleado por
  extensión y nombre. Sin el ajuste, las líneas dicen `Channel 1` y `Channel 2`, como antes.
  `meetings transcribe --replace` pone los nombres en las llamadas ya transcritas. Una llamada importada por una
  versión anterior recibe el número de quien llama en sus líneas solo cuando una sincronización la vuelve a leer. Por
  eso, antes de `--replace`, ejecuta `meetings sync` con `--since-time` en tu primera llamada. Una grabación WAV, GSM
  o M4A sigue siendo una sola pista mezclada. Consulta [transcribe](./installation.md#transcribe).
- **Master.csv de cualquier tamaño.** Un `Master.csv` en este ordenador o en una carpeta montada se lee línea a
  línea. Así un archivo de más de 512 MB ya no se rechaza, y solo quedan en memoria las llamadas que necesita una
  sincronización. Por SFTP se sigue leyendo entero, hasta 512 MB.
- **Grabaciones de una hora en WAV, GSM y M4A.** Estas grabaciones pueden ocupar hasta 2 GB, en lugar de 256 MB, así
  que se transcribe una hora de WAV estéreo a 48 kHz. Toda grabación sigue pudiendo durar hasta una hora, y MP3, Ogg
  y FLAC ocupar hasta 256 MB.
- Los metadatos de una llamada guardan el número de quien llama como `client`, con la misma forma que en su título.

### Cambios — pueden romper scripts

- **`meetings list` y `meetings show` admiten `--backend archive|server|both`** (cli-core 0.663.0, antes 0.656.0).
  pbx no consulta a Asterisk desde estos comandos, así que ambos responden desde el almacén y lo dicen en `missing`.
  `meetings show` admite el número de la llamada, su referencia `meeting:` o el id propio de Asterisk.
- **Los comandos `meetings` y `events` admiten los `--json [fields]` y `--jsonl` del programa.** Ya no tienen
  opciones propias de activar y desactivar, así que `meetings list --json id,title` conserva esos campos.
- **Una lista sin `--limit` muestra el `defaults.limit` del perfil, 20 si no se define.** Vale para `meetings list`,
  `events list`, `search meetings` y `runs list`. Antes las listas de reuniones mostraban 100.
- **Las fechas de una consulta de lista se leen en la zona del ordenador, no en UTC** (`started_at:today`).
- **Un nivel `readonly` ya no detiene `meetings sync`.** La sincronización solo copia registros de llamadas al almacén
  local. `deny` la sigue rechazando.
- **Todas las opciones de tiempo admiten los mismos valores** (cli-base 0.100.0, antes 0.98.0): ISO con o sin
  segundos y zona, una fecha sola, `today`, `yesterday`, o `30m`, `2h`, `7d` atrás. Ahora funciona
  `meetings sync --since-time 2h`.

### Corregido

- Los límites del README y el apartado «Lo que todavía no hace» de la introducción dicen primero lo que puedes hacer y
  luego lo que no, con palabras sencillas. Cubren las tres fuentes de registros de llamadas que lee `pbx`, SFTP y la
  única contraseña guardada, quién dijo qué en grabaciones mono y estéreo, y los tamaños.
  [Instala y conecta](./installation.md#connect-in-wirecat-desktop) nombra el campo **Countries of your phone lines**
  del formulario de conexión de WireCat Desktop.

## 0.4.0 — 14.11.2026

### Añadido

- La descripción de cada llamada dice cómo terminó, para `meetings show`, WireCat Desktop y un agente: `Incoming
  call to 600: answered by 101 Анна Смирнова after 0:03, talk 0:24. 102 Борис Кузнецов did not answer.`
- `phone_region` acepta varios países, `es,ru`, para una oficina cuyas líneas telefónicas atienden más de uno. Un
  número escrito sin `+` se lee en el país al que corresponde; uno que corresponde a dos de ellos se guarda tal como
  está escrito, sin enlazar a nadie, y `meetings sync` dice cuántas personas que llamaron quedaron así. Consulta
  [números, direcciones y personas](./installation.md#numbers-directions-and-people).

### Cambios — pueden romper scripts

- Una llamada es una reunión. Todas las filas del CDR (el registro de llamadas) de una llamada (los miembros de un grupo
  de timbrado, una cola, una transferencia) se unen por su `linkedid`, y el id de la reunión es ese `linkedid`. Sus
  personas son quien llamó, el empleado que la hizo y cada uno que contestó; sus metadatos dicen cómo terminó
  (`outcome`: answered, voicemail, busy, no_answer, failed), quién la hizo (`placedBy`), quién contestó (`answeredBy`),
  a quién le sonó sin contestar (`rang`), qué se marcó, la espera hasta la primera respuesta (`waitMs`), el tiempo de
  conversación (`talkMs`) y cada tramo. Las reuniones de una sola fila de 0.3.0 y anteriores se marcan como borradas en
  cuanto una sincronización vuelve a leer sus filas en una llamada; `meetings sync --since-time <first call>` las lee
  todas. Una transcripción hecha de una reunión de una sola fila se vuelve a hacer con `meetings transcribe`.
- La identidad de un empleado ahora es `extension:<profile>/<number>` (antes `extension:<number>`), así que la
  extensión 101 de un perfil y la 101 de otro son dos personas, no una. Un script que buscaba personas por
  `extension:101` añade el perfil: `extension:office/101`.
- El miembro de un grupo de timbrado o de una cola que contestó se nombra por el canal que llegó a él (`Local/101@…`),
  no por el número del grupo (`600`), y los empleados se nombran a partir del identificador de llamada de las
  llamadas que hacen.
- `meetings show --json` responde `{ "item": { … } }`; 0.3.0 envolvía la reunión dos veces, como `item.item`.
- **Construido sobre cli-core 0.656.0** (antes 0.648.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- WireCat Desktop y el README enlazan a la guía en [wirecat.dev](https://wirecat.dev/en/docs/pbx), ahora que está
  publicada, en lugar del README en GitHub.
- Quien llama se enlaza con el contacto del CRM o la persona de mensajería que tiene el mismo número móvil, como
  ocurre con las llamadas de Beeline: el participante de quien llama ahora lleva su número de teléfono.
- Una grabación que no tiene más que su cabecera, la que deja MixMonitor cuando nadie habló, ya no se enlaza ni se
  envía a transcribir.
- Una compilación empieza con un `dist/` vacío, así que un archivo renombrado ya no se publica: 0.3.0 llevaba un
  `dist/bin/asterisk.js` sin usar.
- **La sincronización funciona en una instalación nueva.** Una configuración compartida de WireCat
  (`~/.config/WireCat/config.json`) que no se podía leer (una marca de orden de bytes, un JSON roto, una carpeta en su
  lugar, una forma antigua de `setup`) dejaba todas las herramientas de WireCat en solo lectura y rechazaba `sync`.
  Ahora solo la respuesta «solo lectura» del propio dueño limita una herramienta, y aun así una sincronización
  funciona: solo lee el servicio en el almacén local (cli-core 0.656.0).
- La guía empieza por lo que obtienes de tus llamadas y el trabajo que un agente puede asumir: la introducción dice
  qué hace `pbx` y qué no hace todavía, [instala y conecta](./installation.md) es una sola página desde la instalación
  hasta la primera sincronización, en WireCat Desktop o en una terminal, y [úsalo](./usage.md) se organiza en torno a
  las tareas diarias de un equipo, con peticiones para copiar y una programación.

## 0.3.0 — 13.11.2026

### Cambios — pueden romper scripts

- El comando ahora es `pbx`, también instalado como `wcat-pbx`. `asterisk` tapaba el programa propio de la centralita en
  un servidor que tiene los dos. Las variables empiezan por `PBX_` (`PBX_PROFILE`, `PBX_READ_ONLY`). La entrada MCP (la
  forma en que las aplicaciones conectan herramientas) es `pbx-<profile>` y sus herramientas son `pbx_read`, `pbx_write`
  y `pbx_tools_search`. El paquete, sus ajustes y las contraseñas guardadas mantienen el nombre `asterisk-cli`, así que
  no hay que configurar nada de nuevo.

## 0.2.0 — 13.11.2026

### Añadido

- `files_from sftp` lee `Master.csv` y las grabaciones en la centralita por SFTP, en solo lectura, con el cliente SFTP
  de cli-core: reintentos si se corta la conexión, tiempos de espera y cada petición en la traza de la ejecución. La
  clave del servidor se fija con `sftp_host_key` antes de enviar ninguna contraseña o clave, y el primer
  `session start` muestra la huella para comprobarla. Consulta
  [conecta tu Asterisk](https://github.com/WireCatLabs/asterisk-cli/blob/v0.7.2/docs/asterisk.md#files-on-the-pbx-over-sftp).

### Corregido

- `phone_region` ahora pasa los números a formato internacional para cualquier país, no solo `ru`: las reglas son las
  de cli-core (0.648.0).

## 0.1.0 — 13.11.2026

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.23.0.
- Los registros de llamadas de Asterisk como reuniones en el almacén de WireCat: `meetings sync` lee `Master.csv` o
  una tabla de CDR de MySQL, MariaDB o PostgreSQL, en solo lectura, una reunión por fila del CDR, así que los tramos de
  una llamada transferida quedan separados.
- La grabación de una llamada se encuentra por el `recordingfile` de FreePBX o por su `uniqueid`, y se enlaza por su
  ruta. Un archivo que aún se está escribiendo espera a la siguiente sincronización.
- `meetings transcribe` convierte las grabaciones en texto con un modelo de voz local, una vez por archivo sin cambios.
- `session start` comprueba la fuente y guarda la contraseña de la base de datos en el llavero. Un `Master.csv` local
  no necesita ninguna.
- Los números externos se guardan en formato internacional con `phone_region`, como los guardan las demás
  herramientas de WireCat.
- `examples/` contiene un Master.csv inventado y dos grabaciones cortas.
