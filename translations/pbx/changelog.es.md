---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/asterisk-cli`. Una sección por versión, la más reciente primero.

## 0.3.0 — 13.11.2026

### Cambiado — puede romper llamadas

- El comando ahora es `pbx`, también instalado como `wcat-pbx`. `asterisk` tapaba el programa propio de la centralita
  en un servidor que tiene los dos. Las variables empiezan por `PBX_` (`PBX_PROFILE`, `PBX_READ_ONLY`), la entrada MCP
  es `pbx-<profile>` y sus herramientas son `pbx_read`, `pbx_write` y `pbx_tools_search`. El paquete, sus ajustes y
  las contraseñas guardadas mantienen el nombre `asterisk-cli`, así que no hay que configurar nada de nuevo.

## 0.2.0 — 13.11.2026

### Añadido

- `files_from sftp` lee `Master.csv` y las grabaciones en la centralita por SFTP, en solo lectura, con el cliente SFTP
  de cli-core: reintentos si se corta la conexión, tiempos de espera y cada petición en la traza de la ejecución. La
  clave del servidor se fija con `sftp_host_key` antes de enviar ninguna contraseña o clave, y el primer
  `session start` muestra la huella para comprobarla. Consulta [conecta tu Asterisk](./asterisk.md#files-on-the-pbx-over-sftp).

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
