---
title: "Ajustes"
---

Los ajustes viven en un archivo, `config.json`, en la carpeta que muestra `pbx doctor`. Cada perfil tiene su
parte, y `defaults` se aplica a todos los perfiles.

```sh
pbx office config show
pbx office config set cdr_csv_path /var/log/asterisk/cdr-csv/Master.csv
pbx office config unset cdr_csv_path
```

`config show` lista cada ajuste y de dónde viene: el archivo, una variable o el valor por defecto.

## La fuente

Qué significa cada ajuste está en [conecta tu Asterisk](./asterisk.md).

| Ajuste | Por defecto | Qué es |
| --- | --- | --- |
| `cdr_source` | `csv` | `csv`, `mysql` o `postgres` |
| `cdr_csv_path` | — | la ruta de `Master.csv` |
| `cdr_csv_columns` | contadas | los nombres de las columnas del CSV, separados por comas |
| `db_host`, `db_port`, `db_name`, `db_user` | —, 3306 o 5432 | la base de datos del CDR; la contraseña la guarda `session start` |
| `db_table` | `cdr` | la tabla del CDR |
| `db_tls` | `false` | una conexión cifrada con el certificado comprobado |
| `recordings_path` | — | la carpeta de las grabaciones |
| `recordings_pattern` | el de FreePBX, luego `*{uniqueid}*` | cómo el nombre de una grabación indica la llamada |
| `cdr_timezone` | la de este ordenador | la zona de las horas del CDR |
| `phone_region` | — | el país de los números escritos sin `+`, como `ru` |
| `extension_pattern` | `^\d{2,5}$` | qué números son extensiones internas |
| `files_from` | `local` | `local`, o `sftp` para leer `Master.csv` y las grabaciones en la centralita |
| `sftp_host`, `sftp_port`, `sftp_user` | —, 22, — | el servidor SSH de la centralita, para `files_from sftp` |
| `sftp_key_path` | — | un archivo de clave privada; sin él, `session start` pide la contraseña de SFTP |
| `sftp_host_key` | — | la huella de la clave del servidor, `SHA256:…`, que comprobaste; nada se conecta hasta fijarla |

## Permisos

`permissions` decide qué puede hacer un comando en este perfil: `allow`, `ask`, `readonly` o `deny`, por ruta de
comando (`meetings.sync`, `meetings.transcribe`). Por MCP no hay nadie a quien preguntar, así que `ask` deja que el
comando se ejecute. `PBX_READ_ONLY=1` rechaza cada comando que cambia tu inicio de sesión o tus ajustes.

```sh
pbx office config set permissions.meetings.transcribe deny
```

## Registros de ejecución

Un comando que falla se guarda como ejecución, para `pbx runs list` y `runs show`. `meetings sync`, `meetings
transcribe` y `session status --check` hacen su trabajo dentro de una ejecución, así que `--record` las guarda también
cuando salen bien. `record_input` decide si una ejecución guarda las palabras que escribiste. Los secretos se ocultan
siempre; consulta [Seguridad](./security.md).
