---
title: "Instalar y conectar"
---

Asterisk escribe una línea sobre cada llamada en su registro de llamadas y guarda cada grabación como un archivo de
sonido, pero no le da a tu agente de IA ninguna forma de leerlos. Los servicios que convierten grabaciones en texto
suelen enviarlas a la nube. `pbx`, una herramienta de línea de comandos de WireCat, lee el registro de llamadas y las
grabaciones donde Asterisk las guarda, no cambia nada en la centralita y convierte las grabaciones en texto en tu
ordenador.

Cuando está conectado, puedes preguntar a tu agente quién llamó por un pedido la semana pasada y qué se acordó,
encontrar todas las llamadas de un número o ver las llamadas de una persona junto a sus chats, su correo y su ficha del
CRM. `pbx` guarda cada llamada en el almacén local de WireCat, y Memo y la búsqueda de cada herramienta de WireCat la
encuentran allí junto con el resto de tus datos.

Conectas `pbx` una vez por centralita. Necesita permiso de lectura sobre el registro de llamadas, como archivo o con
un usuario de base de datos que solo puede leer, y sobre la carpeta de grabaciones si quieres el texto de las llamadas.
WireCat Desktop lo hace con un formulario; desde una terminal bastan unos pocos comandos.

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

<a id="how-asterisk-keeps-calls"></a>

## Cómo guarda Asterisk las llamadas

Asterisk es una centralita (PBX): los números de teléfono de la empresa y los teléfonos de sus empleados funcionan a
través de ella. FreePBX, Issabel y VitalPBX son Asterisk con un panel de administración web, y guardan las llamadas de
la misma forma.

- **Extensiones.** El teléfono de cada empleado tiene un número interno corto, como `101`. Un grupo de timbrado
  (`600`) hace sonar varios teléfonos a la vez, y una cola (`700`) mantiene a quien llama en espera hasta que alguien
  queda libre.
- **Registros de llamadas (CDR).** Cuando termina una llamada, Asterisk escribe un registro de ella: quién llamó a
  quién, cuándo, cuánto duró y si alguien contestó. Los registros van al archivo `Master.csv`, a una tabla de base de
  datos o a los dos. FreePBX los guarda en su base de datos MySQL `asteriskcdrdb`.
- **Una llamada, varios registros.** Un grupo de timbrado escribe un registro por cada teléfono que hizo sonar, y una
  transferencia uno por cada tramo. `pbx` los vuelve a unir en una sola llamada y dice cómo terminó: contestada, buzón
  de voz, ocupado o no contestada, quién contestó, cuánto esperó quien llamó y cuánto habló.
- **Grabaciones.** Cuando la grabación está activa, Asterisk guarda un archivo de sonido por llamada, normalmente en
  `/var/spool/asterisk/monitor`. `pbx` encuentra el archivo de cada llamada por su nombre y lo enlaza con la llamada.
  Nunca copia, mueve ni cambia el archivo.

`pbx` solo lee. No hace falta cambiar el plan de marcación (las reglas que dirigen las llamadas), ni una cuenta de
Asterisk Manager Interface (AMI) o REST Interface (ARI), ni instalar nada en la centralita.

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

  ¿No lo sabes? En la centralita, `asterisk -rx "cdr show status"` muestra los módulos que escriben registros.
- **Las grabaciones**, si quieres el texto de las llamadas: una carpeta que este ordenador pueda leer, una carpeta
  montada en solo lectura o la propia carpeta de la centralita por SFTP. Se encuentran WAV, wav49 (`.WAV`), GSM, MP3,
  Ogg, Opus, FLAC y M4A.

<a id="install"></a>

## Instalar

WireCat Desktop instala `pbx` por ti: pasa a [Conectar en WireCat Desktop](#connect-in-wirecat-desktop).

En una terminal, instálalo una vez en cada ordenador donde lo uses tú o un agente. Necesita Node.js 22.16 o un 22.x
posterior, o 24 o posterior. Node 23 no es compatible. Para convertir en texto las grabaciones WAV y GSM hace falta
también `ffmpeg` en el `PATH`.

```sh
npm install -g @wirecat/asterisk-cli
pbx --version
pbx doctor
```

El comando es `pbx`, y `wcat-pbx` es la misma herramienta. Ninguno de los dos se llama `asterisk`, así que también
puede funcionar en la centralita sin tapar el programa propio de Asterisk. `pbx doctor` no usa la red ni abre el
llavero: muestra la versión, dónde están los ajustes, qué perfiles existen y si otros usuarios del ordenador pueden
leer los ajustes.

<a id="connect-in-wirecat-desktop"></a>

## Conectar en WireCat Desktop

1. En la página **Herramientas**, pulsa **Instalar** junto a Asterisk y después **Gestionar**.
2. En **Cuentas**, añade una cuenta con un nombre para esta centralita, como `office`, y pulsa
   **Iniciar sesión aquí**.
3. En **¿Dónde están los registros de llamadas?**, elige **Archivo Master.csv**, **MySQL o MariaDB** o
   **PostgreSQL**:
   - para **Archivo Master.csv**, escribe su **Ruta de Master.csv** en este ordenador: una copia del archivo o una
     carpeta compartida que lo contenga;
   - para una base de datos, rellena **Servidor de la base de datos**, **Nombre de la base de datos**, **Usuario** y la
     **Contraseña del usuario de la base de datos**. Deja **Puerto (opcional)** vacío para el puerto habitual. Activa
     **Conexión cifrada** cuando la base de datos no esté en tu propia red.
4. **Carpeta de grabaciones (opcional)** es la carpeta de las grabaciones de llamadas en este ordenador. Las llamadas
   llegan también sin ella.
5. Empieza el inicio de sesión. `pbx` lee la última hora de llamadas para comprobar los ajustes y no cambia nada. La
   contraseña de una base de datos se guarda solo cuando esa comprobación funciona. Después, la sincronización trae
   las llamadas de los últimos 30 días, con sus grabaciones.

La zona horaria de los registros, el país de los números locales y los nombres de archivo de las grabaciones están en
los **Ajustes** de la cuenta. Para convertir las grabaciones en texto, consulta [Transcribir](#transcribe).

<a id="connect-from-the-terminal"></a>

## Conectar desde la terminal

Un perfil es el nombre que das a una centralita, como `office`. Es la primera palabra de cada comando que lee las
llamadas de esa centralita. Elige dónde están los registros, configura el perfil y ejecuta `session start`, que
comprueba los ajustes leyendo las llamadas más recientes.

<a id="mastercsv"></a>

### Master.csv

```sh
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config set cdr_timezone Europe/Moscow
pbx office session start
```

`Master.csv` no tiene línea de cabecera. Sus columnas dependen de `loguniqueid`, `loguserfield` y `newcdrcolumns` en
`cdr.conf` (`[csv]`), y `pbx` las distingue por el número de campos de cada línea. Así, las líneas escritas después
de activar una de ellas se leen junto a las anteriores. Activa `loguniqueid` y `newcdrcolumns` si puedes: sin el
`uniqueid` no se puede encontrar una grabación por su nombre, y sin `linkedid` y `sequence` los registros de una
llamada solo se unen por su contenido. Si la deducción falla, nombra las columnas:

```sh
pbx office config set cdr_csv_columns "accountcode,src,dst,dcontext,clid,channel,dstchannel,lastapp,lastdata,start,answer,end,duration,billsec,disposition,amaflags,uniqueid"
```

Las horas de `Master.csv` son la hora local de la centralita salvo con `usegmtime=yes`. Pon en `cdr_timezone` su
zona, o `UTC` cuando `usegmtime` está activo. Sin este ajuste se usa la zona de este ordenador.

Si `pbx` funciona en otro ordenador, lee `Master.csv` por [SFTP](#files-on-the-pbx-over-sftp) o monta la carpeta de
registros en solo lectura, por ejemplo con `sshfs pbx:/var/log/asterisk/cdr-csv ~/pbx-cdr -o ro`.

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

Después configura el perfil e inicia sesión. La contraseña se pide oculta y se comprueba antes de guardarla:

```sh
pbx office config set cdr_source mysql
pbx office config set db_host 10.0.0.5
pbx office config set db_name asteriskcdrdb
pbx office config set db_user wirecat_reader
pbx office config set cdr_timezone Europe/Moscow
pbx office session start
```

`cdr_source postgres` lee PostgreSQL. `db_port` cambia el puerto (3306 para MySQL, 5432 para PostgreSQL), `db_table`
la tabla (`cdr`), y `db_tls true` pide una conexión cifrada con el certificado comprobado. La sesión se abre en solo
lectura, y la única consulta que se envía es un `SELECT` de los registros que empezaron después de la última
sincronización, en páginas de 5000.

La base de datos de FreePBX solo escucha en la propia centralita. No la abras a la red: llega a ella por SSH y apunta
`db_host` al túnel:

```sh
ssh -N -L 3306:127.0.0.1:3306 admin@pbx.example.lan &
pbx office config set db_host 127.0.0.1
```

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

Un plan de marcación que nombra los archivos de otra forma define su propio patrón, con `{uniqueid}`, `{linkedid}`,
`{yyyy}`, `{mm}`, `{dd}` y `*`:

```sh
pbx office config set recordings_pattern "calls/{yyyy}-{mm}-{dd}/*{linkedid}*"
```

Un archivo modificado en los últimos dos minutos puede que aún se esté escribiendo, así que espera a la siguiente
sincronización. Una llamada sin grabación se importa igualmente. Si la carpeta está en la centralita, léela por
[SFTP](#files-on-the-pbx-over-sftp) o móntala en solo lectura, por ejemplo
`sshfs pbx:/var/spool/asterisk/monitor ~/pbx-monitor -o ro`, y pon ese punto de montaje en `recordings_path`.

<a id="files-on-the-pbx-over-sftp"></a>

### Archivos de la centralita por SFTP

`files_from sftp` lee `Master.csv` y las grabaciones en la propia centralita, a través de su servidor SSH. No se copia
nada a una carpeta propia y no se escribe nada allí. Crea un usuario que solo pueda leer esas carpetas, por ejemplo uno
del grupo `pbx`, y luego:

```sh
pbx office config set files_from sftp
pbx office config set sftp_host pbx.example.lan
pbx office config set sftp_user wirecat
pbx office config set sftp_key_path ~/.ssh/wirecat_pbx      # or leave it out to sign in with a password
pbx office session start
```

El primer `session start` se conecta solo lo justo para ver la clave del servidor y se detiene. Imprime la huella de
la clave y el comando que la fija. Compara la huella con la de la propia centralita, que allí muestra
`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`, y solo entonces ejecuta ese comando
(`config set sftp_host_key SHA256:…`). Nunca se envía una contraseña o una clave a un servidor cuya clave no está
fijada, y se rechaza un servidor cuya clave cambia. Después `session start` pide la contraseña de SFTP, si no hay
archivo de clave, la comprueba leyendo los registros de llamadas más recientes y la guarda en el llavero.

Las rutas son las de la centralita: `cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv`, `recordings_path
/var/spool/asterisk/monitor`. Un perfil que lee sus registros de una base de datos guarda la contraseña de esa base,
así que su lado SFTP inicia sesión con un archivo de clave. Una conexión cortada o un tiempo de espera agotado se
reintentan; una contraseña incorrecta, una clave cambiada o un archivo que falta, no.

<a id="numbers-directions-and-people"></a>

## Números, direcciones y personas

- `phone_region` es el país de los números escritos sin `+`, como `ru` para `89161234567`. Así los números se guardan
  como `+79161234567`, la forma que usan las demás herramientas de WireCat, y quien llama es la misma persona en
  llamadas y chats. Sin este ajuste, solo los números escritos con `+` o `00` pasan a formato internacional.
- Una oficina que recibe llamadas de varios países los indica: `es,ru`. Un número se lee en el país al que
  corresponde. Un número que corresponde a dos de ellos, como `612345678` corresponde a España, Alemania y Francia, se
  guarda tal como está escrito y no se enlaza con nadie, porque un país equivocado lo uniría al contacto de un
  desconocido. `meetings sync` dice cuántas personas que llamaron quedaron así. Indica solo los países que atienden tus
  líneas: una llamada desde cualquier otro llega con su `+` o `00`.
- `extension_pattern` es una expresión regular para tus extensiones internas. La de por defecto, `^\d{2,5}$`, toma
  números de dos a cinco cifras. Un lado de la llamada es interno cuando su canal (`PJSIP/101-…`) o su número
  coincide.
- Una llamada es **entrante** cuando un número externo llegó a una extensión o entró por un contexto `from-trunk`,
  `from-pstn` o `from-did`, **saliente** cuando una extensión llamó a un número externo, e **interna** entre dos
  extensiones. Si no, su dirección queda vacía.
- Las personas de una llamada son el número externo como `client`, con el nombre del identificador de llamada cuando
  la centralita lo tenía, y como `manager` la extensión que hizo la llamada y cada extensión que contestó. Un número
  oculto (`anonymous`, `Restricted`) o un nombre del plan de marcación como `s` no es una persona.
- Un grupo de timbrado o una cola llega a sus miembros a través de canales `Local/<extension>@…`. La extensión de ese
  canal, y no el número del grupo, es el miembro que contestó.

<a id="import-the-history-then-keep-it-current"></a>

## Importa el historial y mantenlo al día

```sh
pbx office meetings sync --since-time 2024-01-01T00:00:00Z   # once: everything since then
pbx office meetings sync                                     # later: what is new
```

Cada sincronización vuelve a leer las seis horas anteriores a la última, porque una llamada se escribe en los registros
solo al terminar. Una llamada ya importada se actualiza y nunca se duplica. Un registro que no se puede leer se salta
y se cuenta en stderr, y el resto se importa. Lanza la sincronización a mano, desde cron o con un temporizador de
systemd.

<a id="transcribe"></a>

## Transcribir

```sh
pbx models download gigaam-v3       # Russian; models list shows the others
pbx office meetings transcribe --max-meetings 50
```

El reconocimiento se hace en este ordenador, y las grabaciones no se envían a ningún sitio. Una grabación ya transcrita
no se vuelve a leer salvo que el archivo cambie; `--replace` la transcribe de nuevo.

<a id="search-the-calls-with-everything-else"></a>

## Busca las llamadas junto con todo lo demás

Las llamadas están en el almacén de WireCat que lee cada herramienta de WireCat. Un agente con `memo` pregunta por una
persona en llamadas, chats y correo, y `search all` en cualquier CLI de WireCat busca en todo junto. Siguiente paso:
[úsalo](./usage.md), cómo se construyen los comandos y cómo lee un agente las llamadas.
