---
title: "Registro de cambios"
---

Cambios destacados de `@wirecat/linear-cli`. Una sección por versión, la más reciente primero.

## 0.5.0 — 25.11.2026

### Cambios — pueden romper scripts

- **linear se basa en cli-core 1.0.0 y cli-base 1.0.0.** Tras su primera ejecución el almacén está en la versión 73,
  y solo lo abren las herramientas con cli-core 1.0, así que actualiza todos los CLI de WireCat de este ordenador a la
  vez. La migración guarda una copia para revertir y no se ejecuta si no puede escribirla.
- **`sync --rescan` ya no deja que una sincronización marque como borradas la mayor parte de las incidencias o los
  documentos.** Solo vuelve a listarlo todo. Cuando la protección retiene una pasada, `sync --allow-deletions <count>`
  deja marcar como borrados como mucho ese número. La opción es para el propietario en una terminal, y el servidor MCP
  no la ofrece.
- **Una llamada MCP que nombra una carpeta denegada responde `permission_error`**, no `validation_error`.

## 0.4.1 — 25.11.2026

### Corregido

- Un agente que lee `linear skill show` aprende ahora los usos principales: sincronizar, buscar incidencias por palabras clave, filtrar por id, escribir incidencias y dónde están en el grupo `api` el archivado, las relaciones, los adjuntos y los hitos. Antes era el texto de ejemplo de la plantilla.

## 0.4.0 — 25.11.2026

### Añadido

- **Los ciclos de Linear, como sprints.** `sync` copia los ciclos de cada equipo, `sprints list` los muestra con su
  número, inicio y fin, y `issues list sprint:<id>` (o `sprint:none`) acota las incidencias. Un ciclo sin nombre se
  muestra como `Sprint <number>`.
- **Una incidencia movida a la papelera de Linear sale de la copia local.** Moverla a la papelera no cambia su hora de
  edición, así que una sincronización que solo lee cambios no la veía. La comprobación diaria de incidencias borradas
  ya no cuenta las de la papelera, así que ellas y sus comentarios salen de la copia. Una incidencia restaurada de la
  papelera vuelve en la siguiente comprobación diaria. La respuesta de `sync` dice cuándo se hizo esa comprobación por
  última vez y cuándo toca la próxima (`deletions`).
- **Un documento restaurado de la papelera de Linear vuelve sin `--rescan`.** Una vez por semana `sync` recorre
  enteras las carpetas elegidas y lo trae de vuelta.

### Corregido

- **Las incidencias en un estado Duplicate se conservan.** Su estado se perdía, así que apuntaban a un estado que la
  copia no tenía. Ahora `issues list type:duplicate` las muestra, y una tarea de una de ellas se cierra.
- **Un `sync` sin nada nuevo lo dice.** Sus recuentos nombran solo las filas que cambiaron, así que Desktop lo muestra
  al día. Un tipo de dato que la clave no puede leer aparece en `meta.issues`.

## 0.3.1 — 24.11.2026

### Corregido

- **Un documento movido a la papelera de Linear sale de la copia local en la siguiente sincronización.** Moverlo a la
  papelera no cambia su hora de edición, así que un `sync` normal no lo veía hasta `sync --rescan`. Ahora la
  sincronización también lee el registro de auditoría de documentos borrados del espacio de trabajo. Si Linear niega
  ese registro a tu clave (necesita acceso al registro de auditoría), la sincronización sale bien igualmente y avisa
  `source.deletions-unchecked`. Entonces `sync --rescan` encuentra los documentos de la papelera. Un documento que
  restauras de la papelera vuelve solo con `sync --rescan`.

## 0.3.0 — 23.11.2026

### Añadido

- **Los documentos de Linear, sincronizados junto a las incidencias.** El mismo `sync` los copia en el almacén local,
  y los comandos de documentos comunes de cli-core los leen sin conexión: `folders` elige los proyectos (`linear:all`
  para todos los proyectos y los documentos fuera de ellos), `documents list|show|export|history|context`, `search`,
  `status`, `changes`, `catalog`, y los grupos `tags`, `notes`, `memories`, `facts`, `relationships` e `identities`.
  `linear <profile> search` los encuentra por palabras y por significado, y `search all` de memo los encuentra en el
  apartado de notas como tipo `document`. Solo se quita un documento que Linear puso en la papelera. Uno archivado,
  oculto o que ya no se ve conserva su texto.
- **Incidencias, proyectos y comentarios encontrados por significado.** `sync --embed` los indexa con un modelo ya
  descargado, y entonces `search all` de memo los encuentra por significado además de por palabras (cli-core
  0.730.0).
- **Incidencias encontradas por otras formas de una palabra y por su comienzo.** `search all` e `issues search`
  encuentran "invoices" con "invoice" y "export" con "exp…" (cuatro letras o más). Los comentarios se encuentran por
  significado junto con la clave y el título de su incidencia, y dos inicios de sesión en un mismo espacio de trabajo
  muestran cada incidencia una vez (cli-core 0.736.0).
- **Crear, cambiar y comentar incidencias de Linear.** `linear <profile> issues create --title …`,
  `issues update <issue>` e `issues comments create <issue> --text …`, a partir de las escrituras de gestor de incidencias de
  cli-core. Un equipo, estado, etiqueta, proyecto o usuario se nombra por su id o por un nombre que solo tiene una fila
  de la copia local. Cada escritura comprueba su propia clave (`issues.create`, `issues.update`,
  `issues.comments.create`) y la clave de la operación de la API. `--dry-run` muestra la escritura y no envía nada.
  Asignar una incidencia a otra persona comprueba también `issues.assign-others`, denegado salvo que tu perfil lo
  permita.

## 0.2.0 — 21.11.2026

### Añadido

- **Las incidencias de Linear asignadas a ti se vuelven tus tareas de WireCat.** Después de cada `sync`, cada
  incidencia abierta asignada al usuario con la sesión iniciada es una tarea en el almacén común, con la clave y el
  título de la incidencia (`ENG-12 Fix login`), así que la página Tasks de WireCat Desktop y tu agente la ven. La
  tarea se cierra cuando la incidencia se completa, se cancela, se archiva, se borra, se queda sin asignar o pasa a
  otra persona, y se abre de nuevo cuando la incidencia vuelve a ti. Una tarea que cerraste tú sigue cerrada, y una
  que reabriste no se vuelve a cerrar. La respuesta de la sincronización dice lo que hizo en `tasks`. No se escribe
  nada en Linear.

### Cambios — pueden romper scripts

- **`issues assign` da a su tarea la clave y el título de la incidencia**, que cada sincronización mantiene al día.
  Antes la tarea no copiaba nada del texto de la incidencia. Asignar una incidencia de la que la sincronización ya hizo
  una tarea convierte esa tarea en tuya y la abre de nuevo si estaba cerrada, y que la incidencia pase a otra persona
  ya no la cierra.
- **Una llamada `api` cuya clave de permiso es `deny` (o `readonly`, para una escritura) se rechaza antes de leer su
  cuerpo**, con `permission_error` (código 5). Antes, un cuerpo ausente o no válido respondía primero
  `validation_error` (código 2).

### Corregido

- **La ayuda del grupo `api` nombra el esquema GraphQL de Linear**, no un documento OpenAPI.
- **`api show` acepta una operación por su nombre entre comillas, su nombre antiguo o su id de operación.**
- **Los pasos de inicio de sesión nombran la página correcta.** Una clave de API personal de Linear se crea en
  Settings → Account → Security & access, y a los pasos les faltaba Account.
- **Las páginas de seguridad y de ajustes ya no nombran el ejemplo de la plantilla.** Hablaban de una dirección
  inventada y de un comando `comments` que linear no tiene.

## 0.1.0 — 18.11.2026

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.31.0.
- Construido a partir de un solo archivo, `wirecat.config.ts`, sin hooks.
- **`linear <profile> sync` copia tu espacio de trabajo de Linear en el almacén local de WireCat**: equipos, usuarios,
  estados del flujo de trabajo, etiquetas, proyectos, incidencias y comentarios, con los archivados marcados. Después
  de la primera vez solo lee lo que cambió, y una vez al día encuentra lo que Linear borró. La copia pertenece al
  usuario cuya clave de API personal inició sesión, porque Linear muestra a cada miembro equipos distintos.
- **`linear <profile> issues`, `projects`, `teams`, `users`, `states` y `labels` leen la copia**, también sin
  conexión. `issues assign ENG-12` convierte una incidencia en tu tarea: la tarea apunta a la incidencia y no copia
  nada de su texto.
- **`linear <profile> api` llega a cada consulta y mutación del esquema GraphQL de Linear**, un comando para cada una.
  Una escritura pide su clave de permiso, y un borrado o un archivado pide `linear.delete`.
- Inicio de sesión con una clave de API personal de Linear por stdin: `linear <profile> session start`. Se guarda en el
  llavero del sistema, nunca como argumento.
