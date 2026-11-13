---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/asterisk-cli`. Una sección por versión, la más reciente primero.

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
