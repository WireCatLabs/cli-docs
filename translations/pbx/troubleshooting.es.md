---
title: "Cuando algo falla"
---

Empieza por el síntoma, haz la comprobación y repite el comando. Guarda el código de error, el motivo y el nombre del
perfil para una consulta de soporte.

| Síntoma | Qué hacer |
| --- | --- |
| No sabes qué está configurado | Ejecuta `pbx doctor`. No lee el llavero ni usa la red. |
| No se encuentra `pbx` | Abre una terminal nueva y comprueba que la carpeta global de npm está en el `PATH`. |
| `pbx` ejecuta otro programa | Otra herramienta usa ese nombre. Escribe `wcat-pbx`. |
| «name a profile» | Pon el perfil primero, como en `pbx office meetings list`, o define `PBX_PROFILE`. |
| `source.not-configured` | El mensaje nombra el ajuste y el `config set` que lo rellena. |
| `cdr.unknown-columns` | Master.csv tiene un número de columnas que `cdr_csv` nunca escribe. Nombra las columnas con `cdr_csv_columns`. |
| Las horas se desvían varias horas | Pon en `cdr_timezone` la zona de la centralita, o `UTC` cuando `cdr.conf` tiene `usegmtime=yes`. Luego vuelve a ejecutar `meetings sync --since-time`: los registros se actualizan, no se duplican. |
| «N call records could not be read» | Esas filas no tienen hora de inicio. El resto se importó. |
| `db.refused` | La base de datos rechazó el usuario o la contraseña. Vuelve a ejecutar `session start`. |
| `db.no-table`, `db.no-select` | Define `db_table` o da al usuario `SELECT` sobre la tabla. |
| `network_error` de la base de datos | El servidor no es accesible desde aquí. Usa un túnel SSH, como muestra [conecta tu Asterisk](./asterisk.md#a-cdr-database). |
| Una llamada no tiene grabación | Revisa `recordings_path` y luego `recordings_pattern`. Un archivo modificado en los últimos dos minutos se deja para la siguiente sincronización. |
| `model.not-downloaded` | Ejecuta `pbx models download gigaam-v3`, o el modelo que nombra el mensaje. |
| Una llamada WAV o GSM no se transcribe | Instala `ffmpeg`. |
| El archivo de ajustes no se lee | `doctor` lista cada problema del archivo en `config.issues`. Ejecuta el `config unset` que indica cada uno. |

Nunca pegues una contraseña, una grabación o una transcripción en una consulta de soporte.
