---
title: "Instalar y conectar"
---

Encuentra cualquier llamada que grabó tu centralita y lee lo que se dijo en ella, sin escuchar la grabación.
Asterisk escribe una línea sobre cada llamada en su registro de llamadas y guarda cada grabación como un archivo de
sonido. Pero no le da a tu agente de IA ninguna forma de leerlos. Los servicios que convierten grabaciones en texto
suelen enviarlas a la nube. `pbx` es una herramienta de línea de comandos de WireCat. Lee el registro de llamadas y
las grabaciones donde Asterisk las guarda, y no cambia nada en la centralita. Convierte las grabaciones en texto en tu
ordenador. La transcripción en la nube la activas tú, perfil por perfil. Un perfil es el nombre que das a la conexión
con una centralita.

Cuando está conectado, puedes preguntar a tu agente quién llamó por un pedido la semana pasada y qué se acordó.
Encontrarás todas las llamadas de un número. Verás las llamadas de una persona junto a sus chats, su correo y su ficha
del CRM.

`pbx` guarda cada llamada en el almacén local de WireCat, en tu ordenador. Allí la encuentra la búsqueda de cada
herramienta de WireCat, junto con el resto de tus datos. También la encuentra Memo: con él, un agente pregunta por una
persona en llamadas, chats y correo a la vez. Conecta `pbx` una vez por centralita. Necesita permiso
de lectura sobre el registro de llamadas: sobre el archivo, o sobre la base de datos con un usuario que solo puede
leer. Si quieres el texto de las llamadas, necesita también permiso de lectura sobre la carpeta de grabaciones.
WireCat Desktop y `pbx office setup` en una terminal hacen las mismas preguntas. Un script define cada ajuste con
`config set`.

**En esta página:**

1. [Cómo guarda Asterisk las llamadas](#how-asterisk-keeps-calls)
2. [Qué necesitas](#what-you-need)
3. [Instalar](#install)
4. [Conectar en WireCat Desktop](#connect-in-wirecat-desktop)
5. [Conectar desde la terminal](#connect-from-the-terminal)
6. [Números, direcciones y personas](#numbers-directions-and-people)
7. [Importa el historial y mantenlo al día](#import-the-history-then-keep-it-current)
8. [Transcribir](#transcribe)
9. [Busca las llamadas junto con todo lo demás](#search-the-calls-with-everything-else)
10. [Quitar una centralita](#remove-a-phone-system)

<a id="how-asterisk-keeps-calls"></a>

## Cómo guarda Asterisk las llamadas

Asterisk es una centralita (PBX): los números de teléfono de la empresa y los teléfonos de sus empleados funcionan a
través de ella. FreePBX, Issabel y VitalPBX son Asterisk con un panel de administración web. Guardan las llamadas de
la misma forma.

- **Extensiones.** El teléfono de cada empleado tiene un número interno corto, como `101`. Un grupo de timbrado
  (`600`) hace sonar varios teléfonos a la vez. Una cola (`700`) mantiene a quien llama en espera hasta que alguien
  queda libre.
- **Registros de llamadas (CDR).** Cuando termina una llamada, Asterisk escribe un registro de ella: quién llamó a
  quién, cuándo, cuánto duró y si alguien contestó. Estos registros se llaman CDR (call detail records). Van al
  archivo `Master.csv`, a una tabla de base de datos o a los dos. FreePBX los guarda en su base de datos MySQL
  `asteriskcdrdb`.
- **Una llamada, varios registros.** Un grupo de timbrado escribe un registro por cada teléfono que hizo sonar. Una
  transferencia escribe uno por cada tramo. `pbx` los vuelve a unir en una sola llamada y dice cómo terminó:
  contestada, buzón de voz, ocupado o no contestada. También dice quién contestó, cuánto esperó quien llamó y cuánto
  habló.
- **Grabaciones.** Cuando la grabación está activa, Asterisk guarda un archivo de sonido por llamada, normalmente en
  `/var/spool/asterisk/monitor`. `pbx` encuentra el archivo de cada llamada por su nombre y lo enlaza con la llamada.
  Nunca copia, mueve ni cambia el archivo.

`pbx` solo lee. No hace falta cambiar el plan de marcación (las reglas que dirigen las llamadas). No hace falta una
cuenta de Asterisk Manager Interface (AMI) o REST Interface (ARI): son las interfaces con las que los programas
controlan Asterisk. No se instala nada en la centralita.

<a id="what-you-need"></a>

## Qué necesitas

- **Asterisk 1.8 o posterior**, o un sistema basado en él: FreePBX, Issabel, VitalPBX. Los campos de los registros son
  los de la [especificación del CDR](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/CDR-Specification/).
- **Los registros de llamadas**, que se puedan leer desde el ordenador donde funciona `pbx`:

  | Tienes | Registros en | Necesitas |
  |---|---|---|
  | Asterisk sin más, con `cdr_csv` activo | `Master.csv`, normalmente `/var/log/asterisk/cdr-csv/Master.csv` | permiso de lectura sobre el archivo |
  | FreePBX, Issabel, VitalPBX | MySQL o MariaDB (`cdr_mysql`, `cdr_adaptive_odbc`) | un usuario de base de datos de solo lectura |
  | Registros en PostgreSQL | PostgreSQL (`cdr_pgsql`) | un usuario de base de datos de solo lectura |

  ¿No lo sabes? Ejecuta `asterisk -rx "cdr show status"` en la centralita. Muestra los módulos que escriben
  registros.
- **Las grabaciones**, si quieres el texto de las llamadas. Sirve una carpeta que este ordenador pueda leer o una
  carpeta montada en solo lectura. También puedes leer la propia carpeta de la centralita por SFTP: así se leen
  archivos a través de SSH, el acceso remoto seguro al servidor. `pbx` encuentra archivos WAV, wav49 (`.WAV`), GSM,
  MP3, Ogg, Opus, FLAC y M4A.

<a id="install"></a>

## Instalar

WireCat Desktop instala `pbx` por ti. Pasa a [Conectar en WireCat Desktop](#connect-in-wirecat-desktop).

En una terminal, instala `pbx` una vez en cada ordenador donde lo uses tú o un agente. Necesita Node.js 22.16 o un
22.x posterior, o 24 o posterior. Node 23 no es compatible. Para convertir en texto las grabaciones WAV y GSM hace
falta también el programa de audio `ffmpeg` en el `PATH`.

```sh
npm install -g @wirecat/asterisk-cli
pbx --version
pbx doctor
```

El comando es `pbx`, y `wcat-pbx` es la misma herramienta. Ninguno de los dos se llama `asterisk`. Por eso `pbx`
también puede funcionar en la centralita sin tapar el programa propio de Asterisk. `pbx doctor` no usa la red ni abre
el llavero (el lugar donde el sistema guarda las contraseñas). Muestra la versión, la carpeta de los ajustes y los
perfiles. También muestra si otros usuarios del ordenador pueden leer los ajustes.

<a id="connect-in-wirecat-desktop"></a>

## Conectar en WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** junto a Asterisk y después **Gestionar**.
2. En **Cuentas**, añade una cuenta con un nombre para esta centralita, como `office`, y pulsa
   **Iniciar sesión aquí**.
3. En **¿Dónde están los registros de llamadas?**, elige **Archivo Master.csv**, **MySQL o MariaDB** o
   **PostgreSQL**. Después elige dónde están `Master.csv` y las grabaciones: **En este equipo** o
   **En la centralita, por SFTP**. SFTP es una forma de leer archivos de un servidor por SSH, el acceso seguro al
   servidor.
4. Por SFTP, rellena **Servidor**, **Usuario** y **Contraseña del usuario SFTP**. Deja vacía la **Clave del servidor**
   la primera vez. La comprobación se detiene entonces y muestra la clave del servidor. Compárala con la clave de la
   centralita (consulta [archivos de la centralita por SFTP](#files-on-the-pbx-over-sftp)), copia la clave en el
   campo y comprueba de nuevo.
5. Para **Archivo Master.csv**, indica su **Ruta de Master.csv**. En este equipo es una copia del archivo o una
   carpeta compartida que lo contiene. Por SFTP es su ruta en la centralita.
6. Para una base de datos, rellena **Servidor de la base de datos**, **Nombre de la base de datos**, **Usuario** y la
   **Contraseña del usuario de la base de datos**. Deja **Puerto (opcional)** vacío para el puerto habitual. Activa
   **Conexión cifrada** cuando la base de datos no esté en tu propia red. A veces la base de datos solo acepta
   conexiones desde la propia centralita, como en FreePBX. Entonces abre **Por un túnel SSH (opcional)** y rellena el
   servidor SSH, su usuario y su contraseña. Un túnel SSH lleva la conexión con la base de datos a través del acceso
   SSH de la centralita. El **Servidor de la base de datos** es entonces `127.0.0.1`: así ve la base de datos la
   propia centralita.
7. **Carpeta de grabaciones (opcional)** es la carpeta de las grabaciones de llamadas. Las llamadas llegan también sin
   ella. En **Países de tus líneas telefónicas**, elige los países. El formulario explica: «Las llamadas se enlazan
   con tus contactos por el número de teléfono. Asterisk suele escribir el número sin el prefijo del país, así que
   elige los países que atienden tus líneas. Las llamadas de otros países llegan igualmente con su prefijo +.»
   **Nombres de las extensiones (opcional)** da nombre a los empleados que nunca hacen una llamada (consulta
   [nombres de las extensiones](#names-of-the-extensions)).
8. `pbx` lee la última hora de llamadas para comprobar los ajustes y no cambia nada. Los ajustes y las contraseñas se
   guardan solo cuando esa comprobación funciona. Si rechaza una contraseña o un ajuste, el formulario vuelve al paso
   que lo tiene. Después, la sincronización trae las llamadas de los últimos 30 días, con sus grabaciones.

Estas preguntas vienen del propio `pbx`, así que WireCat Desktop y la terminal siempre hacen las mismas. Un WireCat
Desktop antiguo muestra su propio formulario, más corto, sin SFTP ni túnel SSH.

La zona horaria de los registros y los nombres de archivo de las grabaciones están en la página **Ajustes** de la
cuenta. Para convertir las grabaciones en texto, consulta [Transcribir](#transcribe).

<a id="connect-from-the-terminal"></a>

## Conectar desde la terminal

Un perfil es el nombre que das a una centralita, como `office`. Es la primera palabra de cada comando que lee las
llamadas de esa centralita. `pbx office setup` hace una a una las preguntas de WireCat Desktop y comprueba las
respuestas leyendo las llamadas más recientes. Guarda los ajustes y las contraseñas solo si eso funciona:

```sh
pbx office setup
```

Responde a una elección con su número, a los países con sus códigos separados por comas (`ru, es`), y escribe la
contraseña sin que se vea. Pulsa Intro para dejar el valor entre corchetes. Para cambiar un perfil, ejecútalo de
nuevo. Una contraseña guardada se mantiene salvo que pidas cambiarla, pero si cambia el servidor o el usuario hay que
escribir su contraseña otra vez. Si la comprobación rechaza una contraseña o un ajuste, `setup` vuelve al paso que lo
tiene.

Un script, o un ajuste que `setup` no pregunta, usa `config set` y `session start`. Hay ejemplos
en las secciones sobre Master.csv, la base de datos de CDR y las grabaciones.
`session start` comprueba los ajustes leyendo las llamadas más recientes y después guarda las contraseñas.

<a id="mastercsv"></a>

### Master.csv

```sh
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config set cdr_timezone Europe/Moscow
pbx office session start
```

`Master.csv` no tiene línea de cabecera con los nombres de las columnas. Sus columnas dependen de `loguniqueid`,
`loguserfield` y `newcdrcolumns` en `cdr.conf` (`[csv]`). `pbx` las distingue por el número de campos de cada línea.
Así, las líneas escritas después de activar una de ellas se leen junto a las anteriores. Activa `loguniqueid` y
`newcdrcolumns` si puedes. Sin el `uniqueid` no se puede encontrar una grabación por su nombre. Sin `linkedid` y
`sequence`, los registros de una llamada solo se unen por su contenido. Si `pbx` deduce mal las columnas, nómbralas
tú:

```sh
pbx office config set cdr_csv_columns "accountcode,src,dst,dcontext,clid,channel,dstchannel,lastapp,lastdata,start,answer,end,duration,billsec,disposition,amaflags,uniqueid"
```

Las horas de `Master.csv` son la hora local de la centralita, salvo con `usegmtime=yes`. Pon en `cdr_timezone` la
zona de la centralita. Si `usegmtime` está activo, pon `UTC`. Sin este ajuste se usa la zona de este ordenador.

Si `pbx` funciona en otro ordenador, lee `Master.csv` por [SFTP](#files-on-the-pbx-over-sftp). También puedes montar
la carpeta de registros en solo lectura, por ejemplo con `sshfs pbx:/var/log/asterisk/cdr-csv ~/pbx-cdr -o ro`.

<a id="a-cdr-database"></a>

### Una base de datos de CDR

Crea un usuario que solo pueda leer la tabla de registros. En MySQL o MariaDB:

```sql
CREATE USER 'wirecat_reader'@'10.0.0.%' IDENTIFIED BY 'a long random password';
GRANT SELECT ON asteriskcdrdb.cdr TO 'wirecat_reader'@'10.0.0.%';
```

En PostgreSQL:

```sql
CREATE ROLE wirecat_reader LOGIN PASSWORD 'a long random password';
GRANT SELECT ON cdr TO wirecat_reader;
```

Después configura el perfil e inicia sesión. `pbx` pide la contraseña sin mostrarla en pantalla y la comprueba antes
de guardarla:

```sh
pbx office config set cdr_source mysql
pbx office config set db_host 10.0.0.5
pbx office config set db_name asteriskcdrdb
pbx office config set db_user wirecat_reader
pbx office config set cdr_timezone Europe/Moscow
pbx office session start
```

`10.0.0.%` es la dirección del ordenador donde funciona `pbx`. Si la base de datos está en otro ordenador, también
debe aceptar esa dirección:

1. En MySQL o MariaDB, pon en los ajustes del servidor `bind-address`: una dirección a la que llega tu ordenador, no
   `127.0.0.1`. Después reinicia la base de datos. En PostgreSQL, añade esa dirección a `listen_addresses` en
   `postgresql.conf`, y una línea para el usuario en `pg_hba.conf`, como `host asteriskcdrdb wirecat_reader 10.0.0.0/24 scram-sha-256`.
2. Deja pasar por el cortafuegos hasta el puerto de la base de datos la dirección de tu ordenador y ninguna otra.
3. Activa `db_tls true` cuando la conexión cruce una red que no controlas.

¿Prefieres no abrir la base de datos a la red? Llega a ella
[por el SSH de la propia centralita](#a-database-behind-the-phone-systems-ssh).

`cdr_source postgres` lee PostgreSQL. `db_port` cambia el puerto (3306 para MySQL, 5432 para PostgreSQL), `db_table`
la tabla (`cdr`). `db_tls true` pide una conexión cifrada con el certificado comprobado. La sesión con la base de
datos se abre en solo lectura. La única consulta que se envía es un `SELECT` de los registros que empezaron después
de la última sincronización, en páginas de 5000.

<a id="a-database-behind-the-phone-systems-ssh"></a>

### Una base de datos detrás del SSH de la centralita

La base de datos de FreePBX solo escucha en la propia centralita. No la abras a la red. `pbx` llega a ella por un
túnel SSH: una conexión a la base de datos a través del acceso SSH de la centralita, su acceso remoto seguro. `pbx`
abre el túnel en cada comando y lo cierra al final. El túnel solo lleva los datos hasta la base de datos. No ejecuta
ningún comando en la centralita y no abre ningún puerto en tu ordenador.

En FreePBX, crea el usuario de la base de datos en la propia centralita, como en la sección anterior, pero para
`localhost`:

```sql
CREATE USER 'wirecat_reader'@'localhost' IDENTIFIED BY 'a long random password';
GRANT SELECT ON asteriskcdrdb.cdr TO 'wirecat_reader'@'localhost';
```

Después pon en `db_host` la dirección de la base de datos tal como la ve la centralita, y define el servidor SSH:

```sh
pbx office config set cdr_source mysql
pbx office config set db_host 127.0.0.1
pbx office config set db_name asteriskcdrdb
pbx office config set db_user wirecat_reader
pbx office config set db_ssh_host pbx.example.lan
pbx office config set db_ssh_user wirecat
pbx office config set db_ssh_key_path ~/.ssh/wirecat_pbx     # or leave it out to sign in with a password
pbx office session start
```

El usuario SSH no necesita un intérprete de comandos. Créalo antes del primer `session start`, en la centralita,
como root:

1. Crea el usuario sin intérprete y dale tu clave pública:

   ```sh
   useradd --create-home --shell /usr/sbin/nologin wirecat
   install -d -m 700 -o wirecat -g wirecat /home/wirecat/.ssh
   install -m 600 -o wirecat -g wirecat wirecat_pbx.pub /home/wirecat/.ssh/authorized_keys
   ```

2. Déjale reenviar solo hasta la base de datos. Añade esto al final de `/etc/ssh/sshd_config`, con el `db_host` y el
   `db_port` que pusiste (`127.0.0.1:5432` para PostgreSQL):

   ```text
   Match User wirecat
       AllowTcpForwarding local
       PermitOpen 127.0.0.1:3306
       PermitTTY no
       X11Forwarding no
       AllowAgentForwarding no
   ```

3. Comprueba el archivo con `sshd -t` y recarga el servidor SSH con `systemctl reload sshd`.

`pbx` solo pide al servidor SSH que reenvíe hasta la base de datos, así que este usuario no puede hacer nada más en la
centralita.

`db_ssh_port` cambia el puerto SSH (22). El usuario SSH no necesita un intérprete de comandos. Basta una cuenta que
solo pueda reenviar un puerto. El primer `session start` se conecta solo lo justo para ver la clave del servidor SSH
y se detiene. Imprime la huella de la clave (una cadena corta que identifica al servidor) y el comando que la fija
(`config set db_ssh_host_key SHA256:…`). Antes de ejecutar ese comando, compara la huella con la de la propia
centralita. La muestra `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` si lo ejecutas en la centralita.

Sin archivo de clave, `session start` pide dos contraseñas: primero la del usuario de la base de datos, después la del
usuario SSH. Si las pasas por una tubería, van una por línea, en ese orden:

```sh
printf '%s\n%s\n' "$DB_PASSWORD" "$SSH_PASSWORD" | pbx office session start
```

`pbx` comprueba las dos leyendo los registros de llamadas más recientes. Después las guarda en una sola entrada del
llavero para ese perfil.

<a id="recordings"></a>

### Grabaciones

```sh
pbx office config set recordings_path /var/spool/asterisk/monitor
```

La grabación de una llamada se busca en este orden:

1. la columna `recordingfile` del registro, que rellena FreePBX, dentro de la carpeta de fecha `YYYY/MM/DD` o en la
   propia carpeta; un nombre que lleva fuera de `recordings_path` se ignora;
2. un archivo cuyo nombre contiene el `uniqueid` de la llamada, primero en `{yyyy}/{mm}/{dd}/` y luego en la propia
   carpeta.

Si tu plan de marcación nombra los archivos de otra forma, define tu propio patrón con `{uniqueid}`, `{linkedid}`,
`{yyyy}`, `{mm}`, `{dd}` y `*`:

```sh
pbx office config set recordings_pattern "calls/{yyyy}-{mm}-{dd}/*{linkedid}*"
```

Un archivo modificado en los últimos dos minutos puede que aún se esté escribiendo. Por eso espera a la siguiente
sincronización. Una llamada sin grabación se importa igualmente. Si la carpeta está en la centralita, léela por
[SFTP](#files-on-the-pbx-over-sftp). También puedes montarla en solo lectura, por ejemplo
`sshfs pbx:/var/spool/asterisk/monitor ~/pbx-monitor -o ro`, y poner ese punto de montaje en `recordings_path`.

<a id="files-on-the-pbx-over-sftp"></a>

### Archivos de la centralita por SFTP

`files_from sftp` lee `Master.csv` y las grabaciones en la propia centralita, a través de su servidor SSH. No se copia
nada a una carpeta propia y no se escribe nada en la centralita. Crea un usuario que solo pueda leer esas carpetas,
por ejemplo uno del grupo `asterisk`, dueño de esas carpetas en la mayoría de los sistemas. Después configura el perfil:

```sh
pbx office config set files_from sftp
pbx office config set sftp_host pbx.example.lan
pbx office config set sftp_user wirecat
pbx office config set sftp_key_path ~/.ssh/wirecat_pbx      # or leave it out to sign in with a password
pbx office session start
```

El primer `session start` se conecta solo lo justo para ver la clave del servidor y se detiene. Imprime la huella de
la clave y el comando que la fija. Compara la huella con la de la propia centralita. La muestra
`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` si lo ejecutas en la centralita. Solo entonces ejecuta ese comando
(`config set sftp_host_key SHA256:…`). `pbx` nunca envía una contraseña o una clave a un servidor cuya clave no está
fijada. Si la clave de un servidor cambia, `pbx` lo rechaza. Después `session start` pide la contraseña de SFTP, si no
hay archivo de clave. La comprueba leyendo los registros de llamadas más recientes y la guarda en el llavero.

Las rutas son las de la centralita: `cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv`,
`recordings_path /var/spool/asterisk/monitor`. Un perfil puede leer sus registros de una base de datos y sus grabaciones por SFTP con
contraseña. Entonces pide las dos contraseñas, primero la de la base de datos. Si además hay un túnel SSH, el orden
es este: la de la base de datos, la del usuario SSH y la del usuario SFTP. Una conexión cortada se abre de nuevo, y el
archivo se sigue leyendo desde donde se quedó. Una contraseña incorrecta, una clave cambiada o un archivo que falta
no se reintentan.

<a id="numbers-directions-and-people"></a>

## Números, direcciones y personas

- `phone_region` es el país de los números escritos sin `+`, como `ru` para `89161234567`. Así los números se guardan
  como `+79161234567`. Es la forma que usan las demás herramientas de WireCat, así que quien llama es la misma
  persona en llamadas y chats. Sin este ajuste, solo los números escritos con `+` o `00` pasan a formato
  internacional.
- Si una oficina recibe llamadas de varios países, indícalos: `es,ru`. Un número se lee en el país al que
  corresponde. A veces un número corresponde a dos países: `612345678` corresponde a España, Alemania y Francia. Ese
  número se guarda tal como está escrito y no se enlaza con nadie, porque con un país equivocado acabaría en el
  contacto de un desconocido. `meetings sync` dice cuántas personas que llamaron quedaron así. Indica solo los países
  que atienden tus líneas. Una llamada desde cualquier otro país llega con su `+` o `00`.
- `extension_pattern` es una expresión regular (un patrón de texto) para tus extensiones internas. La de por defecto,
  `^\d{2,5}$`, toma números de dos a cinco cifras. Un lado de la llamada es interno cuando su canal (`PJSIP/101-…`) o
  su número encaja en el patrón.
- Una llamada es **entrante** cuando un número externo llegó a una extensión o entró por un contexto `from-trunk`,
  `from-pstn` o `from-did`. Es **saliente** cuando una extensión llamó a un número externo. Es **interna** cuando va
  entre dos extensiones. En los demás casos, su dirección queda vacía.
- Las personas de una llamada son el número externo como `client` y las extensiones como `manager`. El número
  externo lleva el nombre del identificador de llamada (el nombre de quien llama que pasó la centralita) cuando lo
  había. Las extensiones son la que hizo la llamada y cada una que contestó. Un número oculto (`anonymous`,
  `Restricted`) o un nombre interno del plan de marcación, como `s`, no es una persona.
- Un grupo de timbrado o una cola llega a sus miembros a través de canales `Local/<extension>@…`. La extensión de ese
  canal, y no el número del grupo, es el miembro que contestó.

<a id="names-of-the-extensions"></a>

### Nombres de las extensiones

Una extensión recibe su nombre de tres sitios. Gana el primero que tenga un nombre:

1. **`extension_names`**, que defines tú. Úsalo para los empleados que solo atienden llamadas y nunca hacen una:

   ```sh
   pbx office config set extension_names "101=Anna Smirnova,103=Vera Orlova"
   ```

   `pbx office setup` y WireCat Desktop también lo preguntan, en el paso de las grabaciones.
2. **La lista de extensiones del propio FreePBX**, la tabla `asterisk.users`, cuando los registros de llamadas están
   en el MySQL de FreePBX. `pbx` la lee con el mismo usuario de la base de datos, y solo lee dos columnas:
   `extension` (el número) y `name` (el nombre). Esa tabla guarda también la contraseña de cada teléfono, así que da
   al usuario solo esas dos columnas, nunca la tabla entera:

   ```sql
   GRANT SELECT (extension, name) ON asterisk.users TO 'wirecat_reader'@'10.0.0.%';
   ```

   Sin este permiso la sincronización funciona igual. La comprobación de `pbx office setup`, `session start` y
   `session status --check` imprime un aviso: los nombres no se leyeron de `asterisk.users`. Una sincronización no
   imprime ningún aviso, así que la sincronización programada (cron) no dice nada. Un Asterisk sin FreePBX no tiene
   esa tabla, y la comprobación muestra el mismo aviso. Si das el permiso más tarde, la siguiente sincronización lee
   los nombres.
3. **El identificador de llamada** (caller ID) de una llamada que hizo la extensión, como `"Oleg Petrov" <101>`. Es
   el nombre de quien llama que transmite la centralita. Un empleado que nunca llama no recibe nombre de aquí.

Cuando una sincronización vuelve a leer una llamada, la llamada conserva el nombre que ya tiene, aunque esta vez
ninguna llamada de esa extensión lo haya dado.

<a id="import-the-history-then-keep-it-current"></a>

## Importa el historial y mantenlo al día

```sh
pbx office meetings sync --since-time 2024-01-01T00:00:00Z   # once: everything since then
pbx office meetings sync                                     # later: what is new
```

Cada sincronización vuelve a leer las seis horas anteriores a la última. El motivo es que una llamada se escribe en
los registros solo al terminar. Una llamada ya importada se actualiza y nunca se duplica. Un registro que no se puede
leer se salta, y `pbx` cuenta esos registros en stderr (la salida de errores de la terminal). El resto se importa.
Lanza la sincronización a mano o de forma programada: desde cron o con un temporizador de systemd.

<a id="transcribe"></a>

## Transcribir

```sh
pbx models download gigaam-v3       # Russian; models list shows the others
pbx office meetings transcribe --max-meetings 50
```

El reconocimiento de voz se hace en este ordenador, y las grabaciones no se envían a ningún sitio. Una grabación ya
transcrita no se vuelve a leer salvo que el archivo cambie. `--replace` la transcribe de nuevo. Una grabación que está
en la centralita se copia por SFTP a un archivo temporal que solo tú puedes leer. Ese archivo existe mientras se lee
la grabación, y después se borra.

Una grabación puede durar hasta una hora. Un archivo WAV, GSM o M4A puede tener cualquier tamaño. Un archivo MP3, Ogg
o FLAC puede tener hasta 64 MB, que es más de una hora con la calidad telefónica habitual. Si una llamada no se puede
transcribir, `pbx` la muestra con el motivo y sigue con las demás. WAV, GSM y M4A necesitan `ffmpeg`.

Cada línea de una transcripción puede decir quién habló. Tu plan de marcación graba los dos lados de una llamada en
una sola pista mezclada (mono) o en dos canales (estéreo). Una grabación estéreo mantiene los canales separados, en
cualquier formato. Dile a `pbx` qué lado va en el primer canal:

```sh
pbx office config set recordings_channels employee,caller    # or caller,employee
pbx office meetings transcribe --replace
```

Entonces cada línea nombra a quien llama por su nombre y número, como `Ivan Testov +79000000001`, o al empleado por
su extensión y nombre, como `101 Oleg Operatorov`. Sin el ajuste, las líneas dicen `Channel 1` y `Channel 2`. Para
saber qué lado va en cada canal, transcribe una llamada y léela. Una grabación mono da el texto sin nombres. Una
llamada entre dos extensiones mantiene `Channel 1` y `Channel 2`, porque no tiene a nadie que llame desde fuera.

<a id="cloud-transcription"></a>

### Transcripción en la nube

Un perfil puede enviar sus grabaciones al servicio de OpenAI que convierte voz en texto, en lugar de usar el modelo
local. Está desactivada hasta que la activas para ese perfil. Un ajuste en los `defaults` comunes no la activa.

```sh
pbx office config set transcribe_engine openai
pbx office config set transcribe_model gpt-transcribe        # optional; gpt-transcribe when not set
OPENAI_API_KEY="$(secret-tool lookup service openai)" pbx office meetings transcribe
```

La clave de OpenAI se pasa solo para esa ejecución y se lee de tu llavero. Por eso nunca queda en el historial de la
terminal. En macOS, `security find-generic-password -s openai -w` la lee en lugar de `secret-tool`. Guárdala con el
nombre que use tu llavero.

De tu ordenador sale la voz de cada grabación, en trozos de diez minutos como máximo. Va a `api.openai.com`. Si
otra herramienta de WireCat definió la dirección del modelo de IA común de WireCat, compatible con OpenAI, la voz va
allí. El número de la llamada, los nombres, las horas y el nombre del archivo no se envían. Antes de que salga el
primer trozo, la ejecución dice en stderr adónde va el audio. El texto vuelve y se guarda en el almacén local, igual
que una transcripción local.

La ejecución sigue necesitando un modelo de voz local descargado (`pbx models download gigaam-v3`). Con él viene el
detector de voz que corta el habla en trozos. Sin la clave, la ejecución se detiene antes de leer una grabación.
`PBX_READ_ONLY=1` rechaza la transcripción en la nube. También la rechaza el interruptor común de WireCat «solo
local» cuando está activo. Grabar una llamada y enviarla a un servicio puede requerir el consentimiento de las
personas que participan; consulta [seguridad](./security.md#recordings-and-consent).
`config set transcribe_engine local` la vuelve a desactivar.

<a id="search-the-calls-with-everything-else"></a>

## Busca las llamadas junto con todo lo demás

Las llamadas están en el almacén de WireCat que lee cada herramienta de WireCat. Un agente con `memo` pregunta por una
persona en llamadas, chats y correo a la vez. `search all` en cualquier CLI de WireCat busca en todo junto. Siguiente
paso: [úsalo](./usage.md), cómo se construyen los comandos y cómo lee un agente las llamadas.

<a id="remove-a-phone-system"></a>

## Quitar una centralita

Para olvidar una centralita en este ordenador, elimina su perfil:

```sh
pbx office account remove --keep-data
```

Borra los ajustes del perfil y sus contraseñas guardadas. Los usuarios de la base de datos, SFTP y SSH conservan sus
contraseñas en la centralita: cámbialas o bórralas allí. `--keep-data` deja las llamadas y su texto en el almacén,
donde la búsqueda las sigue encontrando, y `--delete-data` las borra. En una terminal pregunta antes, `--yes` responde
por un script, y `--dry-run` muestra lo que quitaría sin quitar nada.
