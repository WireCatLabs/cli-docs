---
title: "Cuando algo falla"
---

¿Un comando no arranca, no llegan las llamadas, las horas están desplazadas o una llamada no se transcribe? Busca tu
síntoma en la tabla. Al lado está qué comprobar y cómo arreglarlo. Después, repite el comando que falló.

Si no se arregla, escribe a soporte. Guarda para la consulta el código de error, el motivo del mensaje y el nombre del
perfil. Un perfil es el nombre que das a la conexión con la centralita.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `pbx doctor`. No lee el llavero (donde el sistema guarda las contraseñas) ni usa la red. |
| No se encuentra `pbx` | Abre una terminal nueva. Comprueba que la carpeta global de npm está en el `PATH`, la lista de carpetas donde el sistema busca programas. |
| `pbx` ejecuta otro programa | Otra herramienta usa ese nombre. Escribe `wcat-pbx`. |
| «name a profile» | Pon el perfil primero, como en `pbx office meetings list`, o define `PBX_PROFILE`. |
| `source.not-configured` | El mensaje nombra el ajuste y el `config set` que lo rellena. |
| `cdr.unknown-columns` | Master.csv tiene un número de columnas que el módulo `cdr_csv` nunca escribe. Nombra las columnas en `cdr_csv_columns`. |
| Las horas están desplazadas varias horas | Pon en `cdr_timezone` la zona horaria de la centralita. Si `cdr.conf` tiene `usegmtime=yes`, pon `UTC`. Luego vuelve a ejecutar `meetings sync --since-time`: los registros se actualizan, no se duplican. |
| «N call records could not be read» | Esas filas no tienen hora de inicio. El resto de llamadas se importó. |
| `db.refused` | La base de datos rechazó el usuario o la contraseña. Vuelve a ejecutar `session start`. |
| `db.no-table`, `db.no-select` | Define `db_table` o da al usuario el permiso `SELECT` sobre la tabla. |
| `network_error` de la base de datos | El servidor de la base de datos no es accesible desde este ordenador. Llega a él por el acceso SSH de la centralita, como muestra [una base de datos detrás del SSH de la centralita](./installation.md#a-database-behind-the-phone-systems-ssh). |
| `sftp.host-key-missing` | La clave del servidor SFTP o SSH aún no está fijada. Compara la huella de la clave del mensaje con la salida de `ssh-keygen -lf` en el servidor. Luego ejecuta el `config set` que nombra el mensaje. |
| «this profile needs 2 passwords» | Escribe cada contraseña cuando se pida. O pásalas una por línea, en el orden que da el mensaje. |
| `transcription.no-key` | El perfil transcribe con OpenAI y no tiene clave. Pásala en `OPENAI_API_KEY`, o ejecuta `config set transcribe_engine local`. |
| Una llamada no tiene grabación | Revisa `recordings_path` y luego `recordings_pattern`. Un archivo modificado en los últimos dos minutos se deja para la siguiente sincronización. |
| `model.not-downloaded` | Ejecuta `pbx models download gigaam-v3`, o descarga el modelo que nombra el mensaje. |
| Una llamada WAV, GSM o M4A no se transcribe | Instala `ffmpeg`, un programa para trabajar con audio. |
| Una grabación aparece como demasiado larga | Una grabación de más de una hora no se transcribe. Tampoco un archivo MP3, Ogg o FLAC de más de 64 MB. |
| `search meetings --model` o `meetings embed` dice que falta el modelo | Ejecuta `pbx models download embeddinggemma`, o descarga el modelo que nombraste. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno. |

Nunca pegues una contraseña, una grabación o una transcripción en una consulta de soporte.
