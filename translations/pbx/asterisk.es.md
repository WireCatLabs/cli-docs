---
title: "Conecta tu Asterisk"
---

`pbx` lee dos cosas de tu centralita: los registros de llamadas (CDR) y, cuando las hay, las grabaciones. Aquí
ves dónde encontrar cada una, qué acceso dar y cómo configurar un perfil. No hace falta cambiar el plan de marcación
ni crear una cuenta de Asterisk Manager Interface (AMI) o REST Interface (ARI).

## Qué se admite

- **Asterisk 1.8 y posteriores**, y los sistemas basados en él: FreePBX, Issabel, VitalPBX. Los campos del CDR son los
  de la [especificación del CDR](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/CDR-Specification/).
- **Registros de llamadas** de una de estas fuentes:
  - `Master.csv`, que escribe el módulo `cdr_csv`, normalmente `/var/log/asterisk/cdr-csv/Master.csv`;
  - una tabla de MySQL o MariaDB (`cdr_mysql`, `cdr_adaptive_odbc`; FreePBX la guarda en `asteriskcdrdb.cdr`);
  - una tabla de PostgreSQL (`cdr_pgsql`).
- **Grabaciones** en una carpeta que este ordenador pueda leer, en una carpeta montada en solo lectura o en la propia
  carpeta de la centralita por SFTP. Se encuentran WAV, wav49 (`.WAV`), GSM, MP3, Ogg, Opus, FLAC y M4A. Para transcribir WAV y
  GSM hace falta `ffmpeg`.

Por ahora se ha comprobado con los registros y grabaciones inventados de `examples/`, hechos a partir de la
especificación del CDR y del código de `cdr_csv`, y todavía no con una centralita real.

## Elige una fuente

| Tienes | Pon en `cdr_source` | Necesitas |
|---|---|---|
| Asterisk sin más, con `cdr_csv` activo | `csv` (el valor por defecto) | permiso de lectura sobre `Master.csv` |
| FreePBX, Issabel, VitalPBX | `mysql` | un usuario de base de datos de solo lectura |
| CDR en PostgreSQL | `postgres` | un usuario de base de datos de solo lectura |

¿No lo sabes? En la centralita, `asterisk -rx "cdr show status"` muestra los módulos de CDR que escriben registros.

## Master.csv

```sh
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config set cdr_timezone Europe/Moscow
```

`Master.csv` no tiene línea de cabecera. Sus columnas dependen de `loguniqueid`, `loguserfield` y `newcdrcolumns` en
`cdr.conf` (`[csv]`), y `pbx` las distingue por el número de campos de cada línea. Así, las líneas escritas
después de activar una de ellas se leen junto a las anteriores. Activa `loguniqueid` y `newcdrcolumns` si puedes: sin
el `uniqueid` no se puede encontrar una grabación por su nombre, y sin `linkedid` y `sequence` los tramos de una
transferencia solo se distinguen por su contenido. Si la deducción falla, nombra las columnas:

```sh
pbx office config set cdr_csv_columns "accountcode,src,dst,dcontext,clid,channel,dstchannel,lastapp,lastdata,start,answer,end,duration,billsec,disposition,amaflags,uniqueid"
```

Las horas de `Master.csv` son la hora local de la centralita salvo con `usegmtime=yes`. Pon en `cdr_timezone` la zona
de la centralita, o `UTC` cuando `usegmtime` está activo. Sin este ajuste se usa la zona de este ordenador.

Si `pbx` funciona en otro ordenador, lee `Master.csv` en la centralita por SFTP (más abajo) o monta la carpeta de
registros de la centralita en solo lectura, por ejemplo con `sshfs pbx:/var/log/asterisk/cdr-csv ~/pbx-cdr -o ro`.

## Una base de datos de CDR

Crea un usuario que solo pueda leer la tabla del CDR. En MySQL o MariaDB:

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

`db_port` cambia el puerto (3306 para MySQL, 5432 para PostgreSQL), `db_table` cambia la tabla (`cdr`) y `db_tls true`
pide una conexión cifrada con el certificado comprobado. La sesión se abre en solo lectura, y la única consulta que se
envía es un `SELECT` de las filas que empezaron después de la última sincronización, en páginas de 5000.

La base de datos de FreePBX solo escucha en la propia centralita. No la abras a la red. Llega a ella por SSH y apunta
`db_host` al túnel:

```sh
ssh -N -L 3306:127.0.0.1:3306 admin@pbx.example.lan &
pbx office config set db_host 127.0.0.1
```

## Grabaciones

```sh
pbx office config set recordings_path /var/spool/asterisk/monitor
```

La grabación de una llamada se busca en este orden:

1. la columna `recordingfile` del CDR, que rellena FreePBX, dentro de la carpeta de fecha `YYYY/MM/DD` o en la propia
   carpeta. Un nombre que lleva fuera de `recordings_path` se ignora;
2. un archivo cuyo nombre contiene el `uniqueid` de la llamada, primero en `{yyyy}/{mm}/{dd}/` y luego en la propia
   carpeta.

Un plan de marcación que nombra los archivos de otra forma define su propio patrón, con `{uniqueid}`, `{linkedid}`,
`{yyyy}`, `{mm}`, `{dd}` y `*`:

```sh
pbx office config set recordings_pattern "calls/{yyyy}-{mm}-{dd}/*{linkedid}*"
```

Un archivo modificado en los últimos dos minutos puede que aún lo esté escribiendo MixMonitor, así que se deja para la
siguiente sincronización. Una llamada sin grabación se importa igualmente. La grabación se enlaza por su ruta: nunca se
copia, se mueve ni se cambia. Si la carpeta está en la centralita, léela por SFTP (más abajo) o móntala en solo lectura,
por ejemplo
`sshfs pbx:/var/spool/asterisk/monitor ~/pbx-monitor -o ro`, y pon ese punto de montaje en `recordings_path`.

## Archivos de la centralita por SFTP

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
/var/spool/asterisk/monitor`. Un perfil que lee su CDR de una base de datos guarda la contraseña de esa base, así que
su lado SFTP inicia sesión con un archivo de clave. Una conexión cortada o un tiempo de espera agotado se reintentan,
y una contraseña incorrecta, una clave cambiada o un archivo que falta no.

## Números, direcciones y personas

- `phone_region` es el país de los números escritos sin `+`, como `ru` para `89161234567`. Así los números se guardan
  como `+79161234567`, la forma que usan las demás herramientas de WireCat, y quien llama es la misma persona en
  llamadas y chats. Sin este ajuste, solo los números escritos con `+` o `00` pasan a formato internacional.
- `extension_pattern` es una expresión regular para tus extensiones internas. La de por defecto, `^\d{2,5}$`, toma
  números de dos a cinco cifras. Un lado de la llamada es interno cuando su canal (`PJSIP/101-…`) o su número
  coincide.
- Una llamada es **entrante** cuando un número externo llegó a una extensión o entró por un contexto `from-trunk`,
  `from-pstn` o `from-did`, **saliente** cuando una extensión llamó a un número externo, e **interna** entre dos
  extensiones. Si no, su dirección queda vacía.
- Cada llamada tiene dos personas: la extensión como `manager` y el número externo como `client`, con el nombre del
  identificador de llamada cuando la centralita lo tenía. Un número oculto (`anonymous`, `Restricted`) o un nombre del
  plan de marcación como `s` no es una persona.
- Un canal `Local/`, que usan las colas, los grupos de timbrado y el follow-me, nombra lo que se marcó y no quién está
  en la línea, así que ese lado lo decide el número.

## Importa el historial y mantenlo al día

```sh
pbx office meetings sync --since-time 2024-01-01T00:00:00Z   # once: everything since then
pbx office meetings sync                                     # later: what is new
```

Cada sincronización vuelve a leer las seis horas anteriores a la última, porque una llamada se escribe en el CDR solo
al terminar. Un registro ya importado se actualiza y nunca se duplica. Una fila que no se puede leer se salta y se
cuenta en stderr, y el resto se importa. Lanza la sincronización a mano, desde cron o con un temporizador de systemd.

## Transcribe

```sh
pbx models download gigaam-v3       # Russian; models list shows the others
pbx office meetings transcribe --max-meetings 50
```

El reconocimiento se hace en este ordenador. Una grabación ya transcrita no se vuelve a leer salvo que el archivo
cambie. `--replace` la transcribe de nuevo.

## Busca las llamadas junto con todo lo demás

Las llamadas están en el almacén de WireCat que lee cada herramienta de WireCat. Un agente con `memo` pregunta por una
persona en llamadas, chats y correo a la vez, y `search all` en cualquier CLI de WireCat busca en todo junto.
