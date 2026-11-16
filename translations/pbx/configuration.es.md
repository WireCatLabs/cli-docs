---
title: "Ajustes"
---

A veces necesitas comprobar o cambiar cómo trabaja la herramienta con tu centralita: de dónde toma los registros de
llamadas, dónde busca las grabaciones, cómo transcribe las llamadas y qué pueden hacer sus comandos. Cada ajuste
aparece en una tabla con su valor por defecto y una explicación corta.

Los ajustes viven en un archivo, `config.json`, en la carpeta que muestra `pbx doctor`. Cada perfil (el nombre que das
a la conexión con una centralita) tiene su parte del archivo. Los valores de `defaults` se aplican a
todos los perfiles. Los tres comandos del ejemplo muestran los ajustes, cambian uno y lo quitan.

**En esta página:**

1. [La fuente](#the-source)
2. [Transcripción](#transcription)
3. [Permisos](#permissions)
4. [Registros de ejecución](#run-records)

```sh
pbx office config show
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config unset cdr_csv_path
```

`config show` lista cada ajuste y de dónde viene su valor: del archivo, de una variable de entorno o del valor por
defecto.

<a id="the-source"></a>

## La fuente

Qué significa cada ajuste está en [instala y conecta](./installation.md).

| Ajuste | Por defecto | Qué es |
| --- | --- | --- |
| `cdr_source` | `csv` | `csv`, `mysql` o `postgres` |
| `cdr_csv_path` | — | la ruta de `Master.csv` |
| `cdr_csv_columns` | contadas | los nombres de las columnas del CSV, separados por comas |
| `db_host`, `db_port`, `db_name`, `db_user` | —, 3306 o 5432 | la base de datos de los registros de llamadas (CDR); la contraseña la guarda `session start` |
| `db_table` | `cdr` | la tabla de los registros de llamadas |
| `db_tls` | `false` | una conexión cifrada con el certificado comprobado |
| `db_ssh_host`, `db_ssh_port`, `db_ssh_user` | —, 22, — | el servidor SSH por el que se llega a una base de datos que solo escucha en la centralita |
| `db_ssh_key_path` | — | un archivo de clave privada para ese servidor SSH; sin él, `session start` pide la contraseña SSH |
| `db_ssh_host_key` | — | la huella de la clave de ese servidor SSH, `SHA256:…`, que comprobaste; nada se conecta hasta fijarla |
| `recordings_path` | — | la carpeta de las grabaciones |
| `recordings_pattern` | el de FreePBX, luego `*{uniqueid}*` | cómo el nombre de una grabación indica la llamada |
| `recordings_channels` | — | quién habla en cada canal de una grabación estéreo: `caller,employee` o `employee,caller` |
| `cdr_timezone` | la de este ordenador | la zona de las horas de los registros de llamadas |
| `phone_region` | — | el país de los números escritos sin `+`, como `ru`, o varios: `es,ru` |
| `extension_pattern` | `^\d{2,5}$` | qué números son extensiones internas |
| `extension_names` | — | nombres de las extensiones internas, como `101=Anna Smirnova,103=Vera Orlova`; mandan sobre los nombres de FreePBX y el identificador de llamada |
| `files_from` | `local` | `local`, o `sftp` para leer `Master.csv` y las grabaciones en la centralita |
| `sftp_host`, `sftp_port`, `sftp_user` | —, 22, — | el servidor SSH de la centralita, para `files_from sftp` |
| `sftp_key_path` | — | un archivo de clave privada; sin él, `session start` pide la contraseña de SFTP |
| `sftp_host_key` | — | la huella de la clave del servidor, `SHA256:…`, que comprobaste; nada se conecta hasta fijarla |

<a id="transcription"></a>

## Transcripción

Estos dos ajustes se leen solo de la parte del archivo del propio perfil. Un valor en `defaults` no envía fuera las
grabaciones de ningún perfil. Consulta [transcripción en la nube](./installation.md#cloud-transcription).

| Ajuste | Por defecto | Qué es |
| --- | --- | --- |
| `transcribe_engine` | `local` | `local`, en este ordenador, u `openai`, que envía la voz a OpenAI |
| `transcribe_model` | `gpt-transcribe` | el modelo de voz del servicio, para `transcribe_engine openai` |

<a id="permissions"></a>

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`. El permiso se
define por ruta de comando, es decir, por sus palabras unidas con puntos: `meetings.sync`, `meetings.transcribe`,
`tags.add`. Por MCP (el protocolo con el que un agente llama a los comandos) no hay nadie a quien preguntar, así que
`ask` deja que el comando se ejecute. `PBX_READ_ONLY=1` rechaza cada comando que cambia tu inicio de sesión o tus
ajustes.

```sh
pbx office config set permissions.meetings.transcribe deny
```

<a id="run-records"></a>

## Registros de ejecución

Un registro de ejecución es lo que la herramienta guarda sobre un comando que se ejecutó. Un comando que falla se
guarda como ejecución. La muestran `pbx runs list` y `runs show`. `meetings sync`,
`meetings transcribe` y `session status --check` hacen su trabajo dentro de una ejecución. Por eso, con `--record` también se
guardan cuando salen bien. `record_input` decide si una ejecución guarda las palabras que escribiste. Los secretos se
ocultan siempre; consulta [Seguridad](./security.md).
