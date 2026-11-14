---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/asterisk-cli`. Una sección por versión, la más reciente primero.

## 0.4.0 — 14.11.2026

### Añadido

- La descripción de cada llamada dice cómo terminó, para `meetings show`, WireCat Desktop y un agente: `Incoming
  call to 600: answered by 101 Анна Смирнова after 0:03, talk 0:24. 102 Борис Кузнецов did not answer.`
- `phone_region` acepta varios países, `es,ru`, para una oficina cuyas líneas telefónicas atienden más de uno. Un
  número escrito sin `+` se lee en el país al que corresponde; uno que corresponde a dos de ellos se guarda tal como
  está escrito, sin enlazar a nadie, y `meetings sync` dice cuántas personas que llamaron quedaron así. Consulta
  [números, direcciones y personas](./installation.md#numbers-directions-and-people).

### Cambiado — puede romper llamadas

- Una llamada es una reunión. Todas las filas del CDR de una llamada (los miembros de un grupo de timbrado, una cola,
  una transferencia) se unen por su `linkedid`, y el id de la reunión es ese `linkedid`. Sus personas son quien llamó,
  el empleado que la hizo y cada uno que contestó; sus metadatos dicen cómo terminó (`outcome`: answered, voicemail,
  busy, no_answer, failed), quién la hizo (`placedBy`), quién contestó (`answeredBy`), a quién le sonó sin contestar
  (`rang`), qué se marcó, la espera hasta la primera respuesta (`waitMs`), el tiempo de conversación (`talkMs`) y cada
  tramo. Las reuniones de una sola fila de 0.3.0 y anteriores se marcan como borradas en cuanto una sincronización
  vuelve a leer sus filas en una llamada; `meetings sync --since-time <first call>` las lee todas. Una
  transcripción hecha de una reunión de una sola fila se vuelve a hacer con `meetings transcribe`.
- La identidad de un empleado ahora es `extension:<profile>/<number>` (antes `extension:<number>`), así que la
  extensión 101 de un perfil y la 101 de otro son dos personas, no una. Un script que buscaba personas por
  `extension:101` añade el perfil: `extension:office/101`.
- El miembro de un grupo de timbrado o de una cola que contestó se nombra por el canal que llegó a él (`Local/101@…`),
  no por el número del grupo (`600`), y los empleados se nombran a partir del caller ID de las llamadas que hacen.
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
  `session start` muestra la huella para comprobarla. Consulta
  [conecta tu Asterisk](https://github.com/WireCatLabs/asterisk-cli/blob/v0.4.0/docs/asterisk.md#files-on-the-pbx-over-sftp).

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
