---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/bitrix24-cli`. Una sección por versión, de la más reciente a la más antigua.

## 0.24.0 — 17.11.2026

### Añadido

- **Construido sobre cli-core 0.683.0** (antes 0.670.0), con sus novedades del CRM. `deals list` y `leads list`
  aceptan `updated:`, `created:`, `closed:` y `owner:` (`owner:me` es tu propio usuario del portal).
  `pipelines show --since-time --until-time` muestra el embudo de un periodo con las negociaciones cerradas, la
  duración del ciclo, los responsables y los motivos de pérdida. `deals show` responde `stage_history` a partir del
  propio historial de etapas del portal. `stages list` responde `stage_task`. Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **`people create` y `organizations create` aceptan `--email` y `--phone`.** Un teléfono solo se acepta en formato
  internacional (`+…`). `people update` y `organizations update` los siguen rechazando: Bitrix24 añadiría los nuevos
  a los antiguos en lugar de sustituirlos.
- **`calls export` escribe las llamadas de otras centralitas en el contacto del cliente en Bitrix24**, una vez cada
  una, con `telephony.externalCall.register` y `finish`. Viene desactivado. Necesita el ajuste `export_calls`, los
  permisos de los dos métodos y el inicio de sesión con la aplicación local, porque Bitrix24 no deja que ningún
  webhook escriba una llamada. `--dry-run` muestra los campos de cada llamada y dónde acaba, y no envía nada.
  Consulta [Llamadas](./calls.md).
- **Las llamadas de la telefonía de Bitrix24 en el almacén.** `meetings sync` copia el historial de llamadas del
  portal. Cada llamada es una reunión de tipo llamada con su dirección, el número del cliente, el empleado, el tiempo
  de conversación y cómo terminó. Se copian las del usuario que inició sesión o las de los usuarios elegidos en
  `unassigned`, nunca las de todo el portal. El empleado es el usuario del portal en la copia. El cliente se une al
  contacto, a la cuenta de mensajería o a las llamadas de otra centralita con el mismo número de móvil.
  `meetings list`, `show`, `transcript`, `export` y `people` las leen, y `memo context` las muestra en el historial
  de una persona. El webhook necesita el ámbito `telephony`. Consulta [Llamadas](./calls.md).
- **`meetings transcribe` y `models`** pasan las grabaciones de las llamadas a texto con un modelo de voz local, en
  este ordenador.
- **`download_recordings`** guarda la grabación de cada llamada en la carpeta de estado, para que WireCat Desktop la
  reproduzca. **`phone_region`** lee los números que el portal escribe sin `+`.
- **`b24 setup` te guía para conectar un portal**, y WireCat Desktop muestra los mismos pasos: crear un webhook
  entrante, marcar sus permisos y pegar su dirección. `b24 setup show --json` imprime los pasos (formato de
  configuración v1). `b24 work setup apply` comprueba la dirección en el portal como lo hace `session start`, y solo
  entonces la guarda. Para una aplicación local sigue bastando un `session start --portal … --client-id …`, que se
  muestra al final.
- **Los permisos que hay que marcar nombran ahora `task` para las tareas de Bitrix24, `telephony` para las llamadas,
  y `disk` y `documentgenerator` para los archivos y documentos de los clientes**, junto a `crm`, `user_basic` y
  `department`. Si marcas `disk` ahora, no tendrás que volver a editar el webhook cuando llegue la función de
  archivos.
- **`changes list`** de cli-core 0.678.0: qué cambió en la copia del CRM en un periodo, y `--format report` para un
  resumen por la mañana.
- **`sync` copia también las llamadas del portal**, después del CRM, como hace `meetings sync`, así que la
  sincronización de WireCat Desktop y la que sigue a la instalación traen las llamadas. Un paso de llamadas que
  falla, por ejemplo por un webhook sin el ámbito telephony, queda como una nota, y la sincronización del CRM termina
  bien. El ajuste `sync_calls` (activado si no se pone) las deja fuera. Cuando llegan llamadas y `phone_region` no
  está puesto, la nota dice cómo ponerlo. Consulta [Llamadas](./calls.md).

### Cambios — pueden romper scripts

- **`sync` lee el historial de etapas del portal cada vez**, 90 días hacia atrás la primera vez, así que el embudo y
  `deals show` cuentan las etapas por las que una negociación pasó de verdad. Un webhook sin el permiso de
  `crm.stagehistory.list` lo nombra en los `issues`.
- **Las lecturas del CRM sin conexión leen el inicio de sesión guardado para saber tu usuario del portal**, de
  `B24_TOKEN`, del llavero del sistema o del archivo de credenciales, sin red. Donde no se alcanza ningún llavero, la
  lectura avisa y usa el archivo. Si no encuentra ningún inicio de sesión, no muestra negociaciones ni prospectos.
- **`pipelines list`, `stages list` y `pipelines show` omiten una etapa que el portal quitó**, salvo que haya una
  negociación en ella.
- **La skill del agente es más corta.** `SKILL.md` guarda lo que un agente necesita en cada turno (la regla del
  perfil, responder desde el CRM, los límites de las escrituras, el `ask` de MCP que no pregunta, la salida) en unos
  8 KB en lugar de 18 KB, y enlaza el resto en `skills/bitrix24-cli/references/`: lectura, escritura, MCP, salida y
  configuración. No se quitó ninguna regla. La skill dice ahora qué cambió desde que se escribió. Las actividades,
  las tareas y los comentarios de las negociaciones se leen cuando el dueño los activa. `deals list` acepta
  `updated:`, `created:`, `closed:` y `owner:me`. `pipelines show` cuenta el embudo de un periodo. `people create` y
  `organizations create` aceptan `--email` y `--phone`, mientras que `update` los rechaza. Un perfil que no es el
  administrador lee sin conexión solo sus propias negociaciones y prospectos. Un agente que lee la skill gasta unos
  2.500 tokens menos en cada turno.
- **`people`, `organizations` y `users` son ahora los comandos compartidos del CRM de WireCat**, con las mismas
  palabras, consulta y respuesta que en todas las herramientas de CRM. Una empresa responde `type` y `own` en lugar
  de `type_id`. Su sector, sus ingresos y su moneda pasan a `provider_metadata`, y `industry_id:` ya no es un filtro.
  Cada lista y cada vista en vivo dan los campos personalizados en `provider_metadata`, cada elemento nombra sus
  campos `untrusted`, y `--offline` los sigue rechazando. Un usuario es la entidad `crm_user`, no `user`. Un nombre
  que encaja con varios registros da `crm.record-ambiguous`, no `organization.ambiguous` ni `person.ambiguous`.
- **Estas tres listas se paginan con `--limit` (de 1 a 250, 50 si no se pone) y `--page`.** `--all`, un límite mayor
  de 250 y el `defaults.limit` del perfil ya no se aplican a ellas. `users list name:` busca una parte del nombre
  completo entre todos los empleados, no con la búsqueda por nombre del propio portal.
- **`people create`, `people update`, `organizations create` y `organizations update` son las escrituras
  compartidas.** Aceptan `--name`, `--owner`, `--field` y, para las personas, `--first-name`, `--last-name` y
  `--position`. `--body` desaparece (`api call` escribe cualquier otro campo). Cada una responde el registro tal como
  lo tiene el portal, y lo guarda.
- **Una etiqueta en `--field` necesita antes un `sync`.** Hasta entonces, nombra el campo por su código, como lo
  imprime `fields list`.
- **La cuenta de 100 contactos y empresas ajenos al día es ahora de cli-core** y vuelve a empezar desde cero. Su
  mensaje y su motivo (`crm.foreign-contacts-spent`) son los compartidos, y `api call` rechaza las lecturas de
  clientes con `crm.client-reads-admin-only`.
- **Vuelve a iniciar sesión tras actualizar si usas una aplicación local (`session start --app`).** El inicio de
  sesión guardado pasó a la forma de cli-core y el antiguo ya no se lee. Un inicio de sesión con webhook no se ve
  afectado.
- **Una ejecución con carpetas movidas (`B24_CONFIG_DIR`, `B24_STATE_DIR`) ya no renueva un inicio de sesión de
  aplicación caducado.** Bitrix24 sustituye el token de renovación en cada renovación, así que una ejecución movida
  que lo renovara cerraría la sesión de las ejecuciones del propio dueño. Lo dice. Renuévalo en una ejecución sin
  carpetas movidas.

### Corregido

- **Un contacto dado a un compañero sale de la copia en el siguiente `sync`**, con su teléfono y su correo. Antes, su
  único teléfono y su único correo se quedaban hasta un `sync --rescan`.
- **Un campo que el portal no describe se muestra igualmente**, a partir de `userfield.list`, sin etiqueta: `sync` lo
  guarda y `--field` puede ponerlo.
- **`api call` rechaza las lecturas de prospectos a quien no sea administrador de Bitrix24**, como ya rechaza las de
  contactos y empresas. Un prospecto guarda su propio nombre, teléfonos y correos, así que `crm.lead.list` daba a un
  empleado los datos de contacto de los prospectos de todo el portal saltándose la regla de 100 al día.
- **Las etapas de ganada y perdida leídas de `EXTRA.SEMANTICS` son ganadas y perdidas, no abiertas.** Una etapa que
  el portal lista sin el `SEMANTICS` corto solo lleva `success`, `failure` o `apology`, y `sync` la guardaba como
  abierta. Sus negociaciones contaban como abiertas y `deals close` no encontraba ninguna etapa ganada.
- **Una ronda de actividades repartida entre varias ejecuciones de `sync` ya no pierde lo que cambió mientras
  duraba.** Terminaba con la hora de la última ejecución, así que el `since` de la ronda siguiente se saltaba cada
  actividad, tarea y comentario cambiados entre medias. Una tarea completada en ese tiempo seguía abierta en la copia
  hasta que volvía a cambiar. Ahora la ronda termina con la hora de su primera página.

### Seguridad

- **Un perfil que no es el administrador del portal lee sin conexión solo las negociaciones y los prospectos
  asignados a él.** La copia se guarda por portal, así que el perfil de un empleado normal en el mismo portal que el
  del administrador leía cada negociación que el administrador había sincronizado, y `search all` las encontraba por
  los correos y teléfonos de sus contactos. Ahora la negociación de otro usuario da `not_found` y los informes solo
  cuentan las propias. Un perfil cuyo inicio de sesión no nombra ningún usuario del portal no lee ninguna
  negociación de la copia, lo dice y sale con 1. Vuelve a iniciar sesión con `session start`. El administrador, según
  lo encontró su último `sync`, lee toda la copia como antes. Hasta que se ejecute un `sync` de esta versión, cada
  perfil lee solo sus propias negociaciones y prospectos: ejecuta `sync` una vez tras actualizar.
- **Ningún enlace de descarga de archivos en la copia ni en la salida.** Un archivo en un campo personalizado de un
  registro del CRM se guarda ahora como su id de archivo, en `sync` y en cada respuesta de `show`, `list` y de
  escritura: el enlace de descarga de Bitrix24 (`urlMachine`, `downloadUrl`) lleva un token de acceso. Un archivo sin
  id y un enlace del portal con un token se muestran como `[link removed]`. Un campo de sitio web o de enlace escrito
  a mano se queda. `api call` imprime `[link removed]` en lugar de cada enlace de descarga, de cada `publicUrl` de un
  documento generado y de cada enlace del portal con un token. Una copia sincronizada antes de esta versión puede
  guardar todavía esos enlaces. `b24 work sync --rescan` reescribe los registros que el portal sigue listando. Un
  registro borrado o fuera del alcance de la sincronización conserva lo que tenía hasta
  `account remove --delete-data`. Consulta [Seguridad](./security.md).
- **`api call` rechaza los métodos que crean un enlace público**: `enablePublicUrl` de los documentos generados,
  `crm.invoice.getExternalLink` y `salescenter.payment.getPublicUrl`, tanto lecturas como escrituras, como ya
  rechazaba `disk.*.getExternalLink`.
- **La descarga de una grabación de llamada se registra sin el código del webhook**: su registro de ejecución guarda
  `/rest/:user/:token/…`, nunca el enlace.

## 0.23.0 — 14.11.2026

### Cambios — pueden romper scripts

- **Un nivel `readonly` ya no detiene `b24 sync`** (cli-core 0.662.0, antes 0.659.0). Un comando que solo trae datos
  de Bitrix24 al almacén local se ejecuta en `readonly`. `deny` lo sigue rechazando. Los comandos que escriben los
  archivos del dueño o llaman a otro servicio siguen bloqueados por `readonly`. Un perfil que usaba `readonly` para
  detener la sincronización pone la clave en `deny`.

## 0.22.0 — 14.11.2026

### Cambios — pueden romper scripts

- **Construido sobre cli-core 0.659.0** (antes 0.654.0). Una configuración compartida de WireCat
  (`~/.config/WireCat/config.json`) con una marca de orden de bytes, un comentario, una coma final o una coma que
  falta entre dos líneas se repara ahora al leerla, y el archivo antiguo queda al lado como
  `config.json.bak-<time>`. Para otros daños, el mensaje nombra la línea y el arreglo probable. Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

## 0.21.0 — 14.11.2026

### Añadido

- **Comentarios de la línea de tiempo en negociaciones y prospectos.** Con `activities` activado, `sync` lee los
  comentarios de la línea de tiempo de cada negociación y prospecto abiertos de la copia, y de cada uno cerrado que
  cambió desde la última sincronización. `deals show`, `leads show` y `search all` los ven. El portal responde una
  negociación o un prospecto por petición, así que una copia de 100 negociaciones abiertas necesita unas 100
  peticiones por sincronización. Un comentario en una negociación cerrada que nada más cambió espera hasta que la
  negociación cambie. Consulta
  [actividades y tareas de una negociación](./usage.md#activities-and-tasks-on-a-deal).

### Corregido

- **Solo se leen las tareas de las negociaciones y los prospectos de la copia.** `sync` pedía al portal cada tarea
  cambiada en 90 días y descartaba las de otras negociaciones. Ahora filtra por las negociaciones y los prospectos de
  la copia, 50 por petición.

## 0.20.0 — 13.11.2026

### Añadido

- **Un agente puede ejecutar una programación por MCP.** `schedule list`, `schedule run` y `schedule exec` son
  herramientas de MCP, cada una tras su propia clave de permiso. Añadir, pausar, reanudar o quitar un temporizador
  por MCP sigue rechazado salvo que `permissions.mcp.authority` sea `allow`. Antes, b24 dejaba todo `schedule` fuera
  de MCP. Consulta [MCP](./mcp.md).
- `b24 --help` lista `pbx`, la herramienta de Asterisk, en "Works with" (cli-core 0.651.0).

### Cambios — pueden romper scripts

- **Construido sobre cli-core 0.651.0** (antes 0.650.0). Una huella de proyecto de reuniones desfasada es ahora
  `conflict`, no `configuration_error`. Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **Construido sobre cli-core 0.654.0** (antes 0.651.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- **`sync` funciona en una instalación nueva.** Una configuración compartida de WireCat que no se podía leer (una
  marca de orden de bytes, un JSON roto, una carpeta en su lugar, una forma antigua de `setup`) hacía que b24
  rechazara `sync` con "setup's answer keeps every WireCat tool read-only". Ahora solo la propia respuesta de «solo
  lectura» del dueño limita b24, y aun así `sync` funciona: solo lee el portal al almacén local (cli-core 0.654.0).

## 0.19.0 — 13.11.2026

### Añadido

- **Una tarea de etapa se abre para una etapa recorrida entre dos sincronizaciones.** Mientras `stage-tasks` nombra
  una etapa, `sync` lee el historial de etapas del portal (`crm.stagehistory.list`). Así, una negociación que en un
  día pasó de «Nueva» por «Presupuesto» a «Ganada» abre las tareas de «Presupuesto» y de «Ganada». Antes, solo las de
  «Ganada». El historial se lee desde la última sincronización, una o dos páginas al día, y nada sin el ajuste
  (cli-core 0.650.0).

### Cambios — pueden romper scripts

- **Construido sobre cli-core 0.650.0** (antes 0.648.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Corregido

- `sync` guarda el importe de una negociación o un prospecto tal como lo escribió el portal. A partir de unos 10 mil
  millones con céntimos o kopeks, el redondeo antiguo añadía cifras como `98765432109.869995`, y la copia dejaba
  fuera esa negociación. Un importe que la copia no puede guardar, de más de unos 90 billones o con más decimales de
  los que tiene su moneda, se sigue nombrando en los `issues` de `sync` y se deja fuera, como antes.
- Dos perfiles en un mismo portal comparten ahora un mismo ritmo de peticiones. Bitrix24 cuenta las peticiones por
  portal, así que antes podían ir el doble de rápido de lo que el portal permite y recibir rechazos.
- Una escritura que el portal rechazó por su límite de peticiones se vuelve a enviar tras la espera que pide el
  portal, igual que una lectura. El portal rechaza esa petición antes de hacer nada, así que no se hace dos veces. Una
  escritura que no recibió respuesta sigue sin volver a enviarse nunca.
- `sync` pasa a la copia cada teléfono y cada correo de un contacto, no solo el primero, así que una llamada o un
  chat desde cualquiera de ellos se puede asociar al contacto.

## 0.18.0 — 13.11.2026

### Añadido

- **`search all` encuentra una negociación o un prospecto por las palabras de sus actividades.** Con las
  actividades activadas, el asunto y el texto de cada llamada, correo, reunión, pendiente y tarea de una negociación
  cuentan como sus palabras, junto a su título, su empresa y sus contactos.
  `b24 work search all warehouse lease` encuentra la negociación cuyo correo hablaba de ello (cli-core 0.648.0).

### Cambios — pueden romper scripts

- **Construido sobre cli-core 0.648.0 y cli-base 0.98.0** (antes 0.647.0 y 0.97.0). Consulta el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).
- **Un perfil que este ordenador nunca ha visto da `not_found`** con el motivo `profile.unknown`, los perfiles de
  aquí y la pista para iniciar sesión, código de salida 6. Antes era `authentication_error`, código de salida 4. Un
  perfil puesto en el entorno mantiene el rechazo de inicio de sesión.
- **`store reset` ya no se ofrece por MCP**: necesita `--yes`, que una llamada de MCP no puede pasar.

## 0.17.0 — 12.11.2026

### Corregido

- `crm sync` con las actividades activadas guarda también un correo, una llamada o una reunión cuyo propio dueño es
  un contacto o una empresa y que solo está vinculado a tu negociación o prospecto. Antes, esa actividad nunca
  llegaba a `deals show`.
- `crm sync` con las actividades activadas lee solo las actividades de tus propias negociaciones y prospectos,
  cincuenta por petición, en lugar de todas las actividades del portal. La primera lectura de un portal grande tardaba
  unos cuatro minutos para un puñado de actividades. Ahora hace tantas peticiones como negociaciones y prospectos
  tengas, divididas entre cincuenta.

## 0.16.0 — 12.11.2026

### Añadido

- **Actividades y tareas en negociaciones y prospectos.** Con `crm.bitrix24:<portal>.activities` en `on`, `sync` lee
  también las llamadas, los correos, las reuniones y los pendientes de las negociaciones y los prospectos que guarda,
  y las tareas de Bitrix24 vinculadas a ellos. `deals show` y `leads show` los listan, primero los abiertos. La
  primera sincronización lee 90 días. El teléfono o el correo del cliente en una actividad nunca se copia. Viene
  desactivado y solo lo pone el dueño. Las tareas necesitan el ámbito `task`.
  ([uso](./usage.md#activities-and-tasks-on-a-deal))

### Corregido

- **Construido sobre cli-core 0.647.0** (antes 0.645.0). `doctor --help` vuelve a mostrar su Returns y su Example. Lo
  que cambió está en el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

## 0.15.0 — 12.11.2026

### Añadido

- **`account remove` olvida un perfil.** `b24 <profile> account remove --keep-data` olvida la dirección del webhook o
  el inicio de sesión de la aplicación local, los ajustes del perfil y sus archivos en este ordenador. Deja su copia
  del portal en el almacén, donde la búsqueda la sigue encontrando. `--delete-data` borra además las negociaciones,
  los prospectos, los contactos, las empresas y el estado de sincronización del portal. Pregunta antes, o acepta
  `--yes`. `--dry-run` muestra lo que quitaría y lo que conservaría. Es el comando compartido de cli-core, con la misma
  respuesta que las demás herramientas de WireCat, así que WireCat Desktop quita una cuenta de Bitrix24 de la misma
  forma. El webhook sigue en Bitrix24. `--delete-data` se niega (motivo `account-remove.portal-shared`) mientras otro
  perfil de este ordenador lee el mismo portal, porque el almacén guarda una sola copia de él.
- **Una tarea cuando una negociación o un prospecto entra en una etapa.** El ajuste
  `crm.bitrix24:<portal>.stage-tasks` nombra etapas, y cada `sync` abre una tarea local por cada negociación o
  prospecto que pasó a una de ellas desde la última sincronización, una vez por cada paso. Solo tú lo pones. Los pasos
  hechos antes de ponerlo por primera vez no abren ninguna. Consulta
  [una tarea cuando una negociación entra en una etapa](./usage.md#a-task-when-a-deal-enters-a-stage).
- **Completar comandos en la terminal:** `b24 complete zsh` imprime el script que debes cargar. También para bash, fish y
  PowerShell.
- **Los comandos del archivo del almacén compartido y los informes de problemas.** `b24 store backup`, `check`,
  `repair`, `restore` y los demás cuidan el único archivo de almacén que comparten todas las herramientas de WireCat.
  `b24 doctor reports create` escribe un informe para enviar con un problema. Un agente por MCP también los ve, cada
  uno con su permiso, como cualquier escritura.
- **`b24` te avisa cuando sale una versión nueva**, tras un comando que terminó bien, por stderr. `update_check: false`
  o `B24_NO_UPDATE_CHECK=1` lo desactiva.

### Cambios — pueden romper scripts

- **Sobre cli-core 0.644.0.** Una página de una lista del CRM responde `hasMore` y `nextCursor`, la forma única de las
  listas de cli-core.
- **`session start` rechaza un webhook que ya usa otro perfil.** El mismo portal y el mismo empleado que un perfil con
  sesión iniciada en este ordenador dan un `conflict` con el motivo `session.duplicate`. La respuesta nombra ese
  perfil y dice cómo volver a iniciar su sesión o quitarlo. No se pregunta nada al portal. Volver a iniciar sesión con
  el mismo perfil, y el webhook de otro empleado en el mismo portal, siguen funcionando.

### Corregido

- **Un webhook sin el permiso de usuarios dice qué marcar.** Cuando `user.current` responde `INSUFFICIENT_SCOPE`,
  `session start` dice que al webhook le falta "Users (basic)" (`user_basic`, «Пользователи (базовый)»), dónde
  añadirlo en el portal (Developer resources → Integrations, edita el webhook) y que vuelvas a iniciar sesión con la
  dirección que muestra. El motivo sigue siendo `webhook.scope-missing` y el inicio de sesión sigue rechazado.
- **Una sincronización copia tus propias negociaciones y prospectos sin configurar nada.** Hasta que elijas usuarios
  en `crm.bitrix24:<portal>.unassigned`, una sincronización copia las negociaciones y los prospectos del usuario que
  inició sesión, y sus clientes. Antes se detenía con `configuration_error`, que WireCat Desktop mostraba como
  `config.invalid`, hasta que se ejecutaba un `config set` en una terminal. Una lista elegida funciona como antes.
  Consulta [de quién son las negociaciones y los prospectos](./usage.md#whose-deals-and-leads).
- **Un `scope all` guardado dice su motivo.** El rechazo lleva `bitrix.scope-all-refused`, donde antes mostraba el
  `config.invalid` general.
- **Un prospecto conserva su propia persona y su empresa.** Un prospecto a menudo no tiene un contacto ni una empresa
  vinculados. Su nombre y su empresa estaban en los campos del propio prospecto, y `sync` los descartaba, así que
  «Иван Петров, ООО Ромашка» solo se encontraba por el título del prospecto. Ahora `b24` lee `name`, `secondName`,
  `lastName` y `companyTitle` y los da al almacén como el nombre del contacto y de la empresa del prospecto. Con un
  cli-core que los guarde, `leads show` responde `contact_name` y `company_name`, y `search all` encuentra el
  prospecto por ellos. Se dan a todos. Solo los teléfonos y los correos de los clientes de otras personas siguen
  ocultos.

## 0.14.0 — 12.11.2026

### Añadido

- **`b24 guide` muestra escenarios para tareas comunes**, cada uno como comandos en orden con su porqué: `first-sync`
  (la primera sincronización y el tablero del embudo), `keep-in-sync` (un temporizador y la búsqueda) y
  `safe-agent-writes` (un agente por MCP cuyas escrituras siguen siendo tuyas). `b24 guide <name> --json` da uno
  como datos.
- **Páginas de [MCP](./mcp.md) y [Permisos](./permissions.md).** Cómo añadir `b24` a un agente, qué ve el agente y
  qué no se le ofrece nunca. Cada nivel, los niveles incluidos, las claves que comprueba un comando y las
  comprobaciones que ningún nivel levanta.
- **Inicio de sesión con una aplicación local.** `b24 <profile> session start --portal <host> --client-id <id>`
  inicia sesión en el navegador con una aplicación local que creas en el portal, y actúa con los permisos del
  empleado que inicia sesión. La clave de la aplicación se pide sin mostrarla, o se lee de stdin o de
  `B24_BITRIX24_CLIENT_SECRET`. El inicio de sesión vuelve por `https://wirecat.dev/webhooks/apps/b24-callback` o por
  la dirección que pegues. Los tokens se renuevan solos. `session status` y `session list` muestran el tipo de inicio
  de sesión, y `session end` olvida cualquiera de los dos. El webhook entrante sigue siendo la vía rápida, consulta
  [iniciar sesión](./usage.md#with-a-local-application).

### Corregido

- **El inicio rápido copia negociaciones.** El [README](https://github.com/WireCatLabs/bitrix24-cli/blob/v0.24.0/README.md)
  ahora elige de quién copiar negociaciones y prospectos antes del primer `sync`, que hasta entonces no copia nada.
  Ya no dice que un administrador copia todo el CRM, dice que por MCP un borrado con `ask` se ejecuta, y nombra
  `wcat-b24` para cuando se encuentra primero el comando `b24` de otro paquete.
  [Solución de problemas](./troubleshooting.md) incluye el error "no CRM user is chosen".
- **Por MCP, `ask` no detiene una escritura.** El
  [README](https://github.com/WireCatLabs/bitrix24-cli/blob/v0.24.0/README.md), [seguridad](./security.md) y la
  primera pantalla recomendaban poner `deals.move` en `ask` frente a los robots del portal, pero eso solo detiene un
  movimiento en una terminal. Por MCP nadie responde, así que la escritura sigue adelante. Ahora dicen que se ponga
  `readonly` o `deny`, o que se active la aprobación en el cliente del agente.
- **La habilidad del agente cubre lo que un agente necesita.** `b24 skill show` ahora incluye códigos de salida y
  motivos de error, MCP y la trampa de `ask`, la primera configuración desde el webhook hasta la primera
  sincronización, los límites de una escritura y las trampas.
- Los ejemplos usan el perfil `work` en todas partes, en lugar de `personal`.
- **`b24 commands` muestra el CRM por secciones.** Negociaciones, prospectos, contactos y empresas se dividen en Read
  y Write, embudos, etapas, campos, productos, usuarios y `api` están en Read, `sync` en Automate y `session` en Set
  up. Antes, la mayor parte de `b24` estaba en Other.
- **Los dos archivos de estado locales se escriben de forma atómica y siguen siendo privados.** La lista de tus
  propias empresas y el recuento del día de clientes ajenos mostrados se escriben ahora con un archivo temporal y un
  cambio de nombre, como el archivo de ajustes.
- **Un `sync` diario ya no vuelve a leer todos los clientes.** Una ronda de cambios leía cada contacto y empresa
  nombrados en las negociaciones y prospectos de los usuarios elegidos, cambiara algo o no. En un portal con 50.000
  negociaciones eran unas 300 peticiones y casi tres minutos para una sincronización sin nada nuevo. Ahora lee solo
  los clientes de las negociaciones y prospectos que cambiaron, y lista las negociaciones de los usuarios para sus
  clientes una vez por sincronización, en lugar de una vez para contactos y otra para empresas.

## 0.13.0 — 11.11.2026

### Cambios — pueden romper scripts

- **Solo el webhook de un administrador de Bitrix24 borra o vacía datos en el CRM.** Para cualquier otro webhook,
  `b24` rechaza `deals delete`, `leads delete`, un `api call` a un método que borra (su nombre termina en `.delete`,
  `.deletefieldvalue` o `.markdeleted`), una actualización o un `.set` que deja un campo vacío (un valor vacío,
  `null`, `[]`, un vínculo `0` a empresa, contacto o prospecto, o un teléfono o correo marcado `DELETE: Y`), y
  `batch`. El rechazo es un `permission_error` con el motivo `employee.delete`, `employee.clear` o `employee.batch`,
  y ningún nivel de permisos lo levanta. Al crear se pueden seguir dejando campos vacíos.
- **Solo el webhook de un administrador de Bitrix24 desvincula registros o fusiona duplicados.** Para cualquier otro
  webhook, `api call` rechaza un método cuyo nombre termina en `.unbind`, como `crm.timeline.bindings.unbind`, con el
  motivo `employee.unbind`, y una fusión de duplicados, `crm.entity.mergeBatch`, que borra todos los registros menos
  uno, con el motivo `employee.merge`. Como con los borrados, ningún nivel de permisos lo levanta.
  `crm.deal.contact.delete` y `crm.deal.contact.items.delete` ya contaban como borrados.
- **La cuenta de un portal se guarda como de trabajo.** El primer `sync`, escritura o lectura de un perfil guarda la
  cuenta de un portal nuevo con el ámbito `work`, así que las vistas de trabajo y la preparación de reuniones leen su
  copia y las lecturas personales la dejan fuera. Un portal que ya está en el almacén mantiene su ámbito, que es
  `personal` en todos los almacenes hasta ahora. Cámbialo una vez con
  `memo groups update bitrix24:<portal> --scope work` (memo 0.131.81 o posterior). Una sincronización nunca vuelve a
  cambiar un ámbito.

## 0.12.0 — 10.11.2026

### Añadido

- `store apply` quita de una copia hecha con `scope mine` los contactos que no nombra ninguna negociación ni
  prospecto de los usuarios elegidos y que no pertenecen a ninguna empresa conservada, y las personas que quedan
  vacías. Sin `--yes` solo cuenta. Una sincronización que reduce la copia, o `sync --rescan`, lo hace sola, y su
  respuesta da las cifras como `contacts_removed`.
- **Construido sobre cli-core 0.631.0** (antes 0.630.0). El almacén pasa a la versión 64 al abrirse por primera vez:
  guardar o quitar el vínculo de una negociación con una persona ya no lee todos esos vínculos. Lo que cambió está en
  el [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

### Cambios — pueden romper scripts

- Una sincronización copia solo las negociaciones y prospectos de los usuarios que el propietario elige en
  `crm.bitrix24:<portal>.unassigned`, y sus clientes. Por defecto no hay nadie elegido, tampoco el usuario del propio
  webhook. Hasta que el propietario elija, la sincronización se rechaza (`configuration_error`, motivo
  `bitrix.scope-users-unchosen`) y nombra el `config set` que hay que ejecutar. Atención: una copia existente falla
  en su próxima sincronización hasta que el propietario elija.
- Ninguna sincronización copia ya todo el CRM, tampoco la de un administrador. Una sincronización con un
  `scope all` guardado se rechaza (motivo `bitrix.scope-all-refused`, antes `bitrix.scope-all-admin-only`) y dice
  que se ponga `mine`. Una vez puesto, las negociaciones y prospectos de usuarios no elegidos se marcan como borrados
  en la copia local. Cualquier otro cliente se encuentra en vivo en el portal con `people list` u
  `organizations list`.
- El webhook de un empleado puede elegirse a sí mismo, a un usuario despedido o a alguien que no es empleado, y el de
  un administrador, a cualquiera.

### Corregido

- El nombre de un contacto ya no lleva el `null` o `null #<id>` que una importación al portal dejó en sus campos de
  nombre ("Ярослав Орлов null #907" ahora es "Ярослав Орлов"). Lo tenían 101.876 de 114.165 contactos en un portal
  real. Atención: un nombre guardado antes conserva ese resto hasta que ese contacto se sincronice de nuevo.
- **Construido sobre cli-core 0.630.0** (antes 0.623.0). El almacén pasa a la versión 63 al abrirse por primera vez.
  Un contacto del CRM ya no se une a tu propia persona ni le cambia el nombre, y dos contactos que comparten el buzón
  o el teléfono de una empresa siguen siendo dos personas. Lo que cambió entre medias está en el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

## 0.11.0 — 10.11.2026

### Cambios — pueden romper scripts

- Con `scope mine` una sincronización copia solo los clientes del usuario: los contactos y empresas asignados a él o
  a un usuario sin asignar, y los que nombran las negociaciones y prospectos que copia. Antes copiaba toda la base de
  contactos y empresas del portal, 114.165 contactos en un portal real donde el usuario no tenía ninguna negociación.
  La pasada diaria de borrados también lista solo esos id. Atención: una copia que ya tiene toda la base conserva sus
  contactos, y las empresas esperan a `sync --rescan`.
- Solo un administrador de Bitrix24 puede sincronizar con `scope all`. A un jefe de departamento se le rechaza como a
  un empleado (`bitrix.scope-all-admin-only`, antes `bitrix.scope-all-manager-only`).
- Cualquiera que no sea administrador de Bitrix24 ve teléfonos y correos solo de sus propios clientes.
  `people list` y `organizations list` los omiten en el resto, y `people show` y `organizations show` de uno los dan,
  como mucho para 100 de esos contactos y empresas al día entre el usuario y sus agentes. `api call` rechaza las
  lecturas de contactos y empresas (`crm.contact.*`, `crm.company.*`, `crm.item.*` de tipo 3 o 4, requisitos,
  direcciones, búsquedas de duplicados) a cualquiera que no sea administrador, digan lo que digan los permisos.
- Solo un administrador de Bitrix24 puede nombrar a un empleado en activo en `crm.bitrix24:<portal>.unassigned`. Un
  jefe de departamento queda limitado a usuarios despedidos y a quienes no son empleados, como todos los demás.
- **Construido sobre cli-core 0.623.0** (antes 0.621.0). El almacén pasa a la versión 61 al abrirse por primera vez
  (vínculos entre personas, solo añade). Lo que cambió entre medias está en el
  [historial de cambios de cli-core](https://github.com/WireCatLabs/cli-core/blob/main/CHANGELOG.md).

## 0.10.0 — 09.11.2026

### Añadido

- `session start` y `session status --check` responden si el usuario del webhook es `manager` (un administrador de
  Bitrix24 o el jefe de un departamento), junto a `admin`.

### Cambios — pueden romper scripts

- Solo un responsable copia todas las negociaciones y prospectos: una sincronización con
  `crm.bitrix24:<portal>.scope all` se rechaza (`configuration_error`) salvo que el usuario del webhook sea
  administrador de Bitrix24 o jefe de un departamento, algo que se comprueba en cada sincronización. Los demás copian
  sus propias negociaciones y prospectos y los que no tienen asignado a nadie, y el rechazo dice que se ponga `scope`
  en `mine`. Atención: con un webhook sin el ámbito `department`, un jefe de departamento cuenta como empleado.
- Para cualquiera que no sea responsable, `crm.bitrix24:<portal>.unassigned` solo cuenta a los usuarios que el portal
  muestra como despedidos o como no empleados (extranet, correo, bot), y se comprueba en cada sincronización. Un
  empleado en activo en la lista se omite con el motivo en los `issues` de la sincronización
  (`crm.unassigned-dropped`), y sus negociaciones y prospectos salen de la copia local. Un responsable puede seguir
  nombrando a cualquiera. Atención: con un webhook sin el ámbito `user`, para un empleado nadie cuenta como sin
  asignar.

## 0.9.0 — 09.11.2026

### Añadido

- `sync` guarda en el almacén local quién es quién. Un contacto es miembro de cada una de sus empresas con el rol
  `contact`, con su cargo al lado. Los contactos de una negociación y de un prospecto están en ella, con el principal
  marcado, y la persona responsable es su `owner`. Los empleados son miembros de tus propias empresas, se leen en cada
  sincronización y dependen del jefe de su departamento. Un prospecto convertido apunta a su negociación. Estas
  relaciones están `reported` hasta que las confirmas, terminan en lugar de borrarse cuando el portal deja de
  decirlas y nunca cambian una que hiciste tú. Atención: el webhook necesita los ámbitos `user_basic` y `department`
  para los correos de los empleados y las relaciones de dependencia. Sin ellos la sincronización lee el resto.
- `schedule` instala un temporizador que ejecuta `sync`, u otro comando de `b24`, por su cuenta. MCP no lo ofrece.
- Por defecto una sincronización copia solo las negociaciones y prospectos del propio usuario del webhook y los de los
  usuarios en `crm.bitrix24:<portal>.unassigned`. Bitrix24 siempre nombra a una persona responsable, así que así es
  como las negociaciones de un formulario web o de una integración cuentan como de nadie.
  `config set crm.bitrix24:<portal>.scope all` las copia todas. La respuesta de la sincronización tiene `scope` (con
  el usuario del webhook como `self`) y el `out_of_scope` de cada tipo: una negociación pasada a otro usuario sale de
  la copia local en la siguiente sincronización. Los contactos y las empresas se copian enteros como antes.
- Sin un ajuste `scope`, un primer `mine` que marcaría como borrados más de la mitad de las negociaciones o
  prospectos guardados los conserva (`crm.narrowing-held`) hasta que el propietario ponga `scope`. Un agente no puede
  poner `scope`, `self` ni `unassigned`.
- La copia de un portal pertenece a un solo usuario: una sincronización con el webhook de un usuario distinto al de la
  primera sincronización se rechaza hasta `config unset crm.bitrix24:<portal>.self`.

### Cambios — pueden romper scripts

- Los `people` de una negociación y de un prospecto ahora incluyen al empleado responsable, con el rol `owner`, junto
  a sus contactos. Atención: el código que tomaba cada entrada de `people` por un contacto de un cliente.
- `store status` cuenta tus propias empresas entre las organizaciones y a los empleados del portal entre las
  personas.
- `api call department.get` y `crm.mycompany.basic.list` se ejecutan sin preguntar, como las demás lecturas que hace
  `b24`. `department.get` se rechaza con `users.list: deny`, y `crm.mycompany.*` con `organizations.list: deny`.
- Un webhook creado solo con los ámbitos `crm` y `user` recibe ahora una entrada en los `issues` de cada
  sincronización: Bitrix24 le niega los departamentos. Añade el ámbito `department` o cuenta con esa entrada.
- La primera sincronización tras la actualización marca como borrados en la copia local las negociaciones y
  prospectos de otros usuarios. Salen de las listas y de la búsqueda, y su copia anterior queda en el archivo del
  almacén. Pon `crm.bitrix24:<portal>.scope all` antes de ella para conservarlos.
- Una respuesta de lista sin sus elementos ahora hace fallar la sincronización de ese tipo (`invalid_response`) en
  lugar de terminar ahí la lista.

### Corregido

- `api show department.get` y `api call` llamaban `basic` al ámbito del método, y el de Bitrix24 es `department`.
- Un método que Bitrix24 solo deja llamar a una aplicación instalada (`WRONG_AUTH_TYPE`) se rechaza como
  `permission_error` con el motivo `webhook.app-only`. Antes `b24` decía que se había rechazado el webhook y pedía
  volver a iniciar sesión, lo que no puede ayudar. Atención: un script que se ramificaba por `authentication_error`
  para este rechazo.
- `create` y `update` de `people` y `organizations` declaran sus respuestas (`crm_record_created`,
  `crm_record_updated`), así que `--json` acepta sus nombres de campo y `commands info` los lista.
- `session start` y la solución de problemas nombran los mismos ámbitos del webhook que el README: `crm`,
  `user_basic` y `department`. La solución de problemas también pedía `catalog`, que `b24` no usa.
- `api show`, `api list` y una llamada rechazada nombraban el ámbito `basic` para cada método fuera de cinco prefijos
  de nombre, como `im.message.add` y `tasks.task.add`. Ahora nombran el ámbito que da la referencia de Bitrix24
  (`im`, `task`, `calendar`), o `unknown`, y un rechazo por uno desconocido no nombra ámbito.

### Seguridad

- `b24` envía peticiones solo al portal de la dirección de tu webhook y rechaza cualquier otro host antes de que salga
  un solo byte del equipo. Su manifiesto lo dice (`network`), así que WireCat Desktop muestra adónde van los datos.

## 0.8.0 — 08.11.2026

### Añadido

- El paquete incluye `contracts/wirecat.json`, así que WireCat Desktop puede leer qué hace `b24`, cómo iniciar sesión
  y qué copia `sync` antes de instalarlo. `b24 --wcat-describe` ahora responde en el formato 2, con la sección Desktop
  de ese archivo y su SHA-256.

### Corregido

- La primera sincronización de un portal grande usa mucha menos memoria y tarda un tercio menos: con datos sintéticos
  de 20.000 negociaciones, el pico baja de 3,7 GB a 0,55 GB.
- `session start` vuelve a pedir el webhook cuando no llegó nada. Un Enter vacío en la entrada oculta, como tras un
  Ctrl+V que no pegó nada en una terminal de Linux, fallaba al momento con "no webhook address was given". Ahora
  indica pegar con Ctrl+Shift+V (Cmd+V en macOS) y vuelve a preguntar, hasta tres veces.
- Un fallo al arrancar `b24`, o en un paso esperado, termina con código 1 y el error de fallo de b24
  (`command.crashed` en JSON cuando stdout no es una terminal). Antes imprimía la pila de Node sin procesar.

## 0.7.0 — 08.11.2026

### Añadido

- El paquete también instala el comando como `wcat-b24`, así que `wcat b24` lo ejecuta y `wcat --help` lo muestra.
  `b24 --wcat-describe` imprime qué es la herramienta, su versión y su página de documentación.
- `config set owner_languages` indica los idiomas que lee el propietario.

### Cambios — pueden romper scripts

- Una búsqueda sin ninguna letra ni dígito se rechaza (`validation_error`). `""`, un `?` solo o un emoji solo no
  encontraban nada y no decían nada. Un `*` solo sigue leyéndose como comodín.

### Corregido

- La primera sincronización de un portal grande es aproximadamente el doble de rápida. Ya no se ralentiza con cada
  negociación que guarda: con datos sintéticos de 10 responsables de negociaciones, 20 000 negociaciones, 10 000
  leads y 20 000 contactos se sincronizan en 30 s en lugar de 61 s.

## 0.6.0 — 08.11.2026

### Añadido

- `people list --format csv` y `organizations list --format csv` imprimen una página como tabla CSV para una hoja de
  cálculo, como ahora también `deals list` y `leads list`. stdout lleva la tabla y nada más; el camino a la página
  siguiente va a stderr. Las columnas son los campos propios del registro y luego cada campo personalizado del portal
  por su etiqueta: un campo de dinero como `<label> amount` y `<label> currency`, y dos campos con la misma
  etiqueta se distinguen por su código. `--json=a,b` a su lado elige las columnas, un campo personalizado como
  `provider_metadata.<code>`. Una celda con la que una hoja de cálculo empezaría una fórmula recibe un `'` delante.
  `--jsonl`, un `--json` sin campos y `--compact` se rechazan con `output.conflict`, y los agentes no reciben la opción.
- `pipelines show` es el tablero del embudo de ventas: cada etapa da sus negociaciones o prospectos y su total en cada
  moneda, y en una terminal imprime una tabla de las etapas con el total abierto, las ganadas, las perdidas y la tasa
  de éxito. El embudo se puede omitir cuando el portal tiene solo uno.

### Cambios — pueden romper scripts

- Un campo personalizado que el portal no tiene, nombrado en la consulta de una lista o en `--json`, se rechaza con
  `param` igual a `--query` o `--json`, donde antes decía `--field`.
- Un comando en un perfil sin webhook se rechaza con el motivo `session.missing`, donde antes decía `webhook.missing`:
  el único «no has iniciado sesión» que da cada herramienta de WireCat con un token de API. El webhook se lee y se
  guarda donde estaba, `B24_TOKEN`, luego la entrada `token:<profile>` del llavero bajo `bitrix24-cli`, luego un archivo
  privado, ahora con el almacén de tokens compartido de cli-core.

## 0.5.0 — 07.11.2026

### Añadido

- `sync` copia los embudos, las empresas, los contactos, las negociaciones y los prospectos del portal al almacén local
  de WireCat: lo que cambió desde la última sincronización, o todo con `--rescan`; una vez al día también encuentra lo
  que el portal borró. `store status` dice hasta dónde ha llegado cada tipo. Una sincronización se detiene antes de su
  plazo o de `--max-pages`, y la siguiente sigue desde ahí.
- `deals close <ref> won|lost` y `leads close`, a la primera etapa ganada o perdida del embudo del elemento, y
  `deals delete` y `leads delete`, que preguntan antes.
- `deals create` y `update` aceptan `--pipeline`, `--stage`, `--amount` con `--currency`, `--close-date` y
  `--owner`; los prospectos aceptan lo mismo salvo `--close-date`. Una etapa comprueba la clave de mover, y una ganada o
  perdida también la de cerrar.
- `search all` encuentra las negociaciones y los prospectos guardados junto a los mensajes, las notas y los eventos de
  las demás herramientas de WireCat. Con `deals.list: deny` deja fuera las negociaciones y las nombra en `missing` y en
  stderr, y lo mismo con los prospectos; si se niegan todos los tipos que se le pidieron, se rechaza
  (`search.all-denied`).
- `b24 --help` y un `b24` sin más empiezan con para qué sirve `b24`, qué probar primero y por dónde empezar.

### Cambios — pueden romper scripts

- `deals`, `leads`, `pipelines` y `stages` son los comandos de CRM compartidos de cli-core, iguales en todas las
  herramientas de CRM de WireCat. Sus listas y `show` leen el almacén local, así que ejecuta antes `sync`; `--offline`
  ya funciona con ellos.
- Una negociación o un prospecto se nombra por su ref, `deal:12` o `lead:7`, como la imprime una lista, no por su id de
  Bitrix24 ni por su título.
- Una negociación o un prospecto responde `ref`, `pipeline` y `pipeline_name`, `stage` (su nombre), `status` (`open`,
  `won` o `lost`), `close_date`, `amount` como cadena decimal en `currency`, ambos `null` si no hay importe, `assignee`
  como `<portal>/user/<id>`, y los campos propios del portal en `provider_metadata` por código. `stage_id`,
  `pipeline_id`, `outcome`, `closes_on`, `assigned_to` y `person_ids` desaparecen de ellos; los contactos están en
  `people` y la empresa en `organization`.
- Su consulta de lista acepta `status`, `stage`, `pipeline` y `organization`; la palabra libre, las ventanas de tiempo
  y los campos propios del portal desaparecen de ella. `--all` desaparece de esas listas.
- `deals move <ref> <stage>` recibe la etapa como argumento, no con `--stage`.
- Las escrituras de negociaciones y prospectos no tienen `--body`. `--field <label or code>=<value>` fija un campo
  personalizado según las definiciones que guardó el último `sync`: un campo de lista recibe la etiqueta o el id de su
  opción, un campo múltiple un `--field` por valor, y un valor vacío lo vacía. Se rechaza un código que nombra un campo
  estándar (`stageId`, `categoryId`, `assignedById`, el `STATUS_ID` de un prospecto), y también un `--field` sin clave
  antes de su `=`.
- La etiqueta de un campo personalizado y la de una opción de lista se comparan como cli-core compara los nombres, en
  cada `--field` y consulta: `е` encuentra `ё`, y una letra escrita con dos puntos de código encuentra la misma letra
  escrita con uno. `people show` y `organizations show` comparan un nombre con las coincidencias del portal de la
  misma forma. Una etiqueta que coincidía con un campo puede coincidir ahora con dos, y entonces se rechaza con ambos.
- `fields list <deals|leads|people|organizations>` es el de cli-core: lee las definiciones que guardó `sync`, así que
  ejecuta antes `sync`, y cada campo nombra sus partes `untrusted`.
- `api.crm.deal.update` (y las demás claves `api.*` de negociaciones y prospectos) en `ask` ahora también pregunta en
  `deals update`, `move` y `close`, no solo en `api call`. `--dry-run` de una escritura de negociación o prospecto
  nombra cada clave que puede comprobar: la clave `api.*`, y las claves de mover, cerrar y `crm.assign-others` con la
  opción que haría que cada una se aplique.
- `sync` lee las definiciones de campos del portal de cada tipo, una petición más por tipo, así que `--max-pages` llega
  más tarde a los elementos. Un webhook sin derechos para leerlas sigue sincronizando; cualquier otro fallo ahí hace
  fallar la sincronización.
- Los prospectos están en un único embudo llamado `Leads`, porque los prospectos de Bitrix24 no tienen ninguno.
- `deals.delete` y `leads.delete` están por defecto en `ask`; un `api call` que fija una etapa comprueba `deals.close`
  (o `leads.close`) además de `deals.move`.
- `mcp` y `doctor` son los comandos compartidos de cli-core: `mcp` añade `config`, `add` y `check`, y `--profiles` y
  `--permission` en `serve`; `doctor` añade `--online`.
- Un `--body` o un método de `api call` que se puede leer de más de una forma se rechaza antes de enviar nada: un
  cuerpo que nombra un campo dos veces con cualquier grafía, un `entityTypeId` que no es un número simple, un `fields`
  que no es un objeto, un método con cualquier sufijo que no sea un único `.json` y un método `crm.item` sin
  `entityTypeId`. Envía cada campo una vez, con una sola grafía.
- `--operation-id` desaparece de todas las escrituras. En un portal real, una creación repetida con el mismo id creó un
  segundo elemento, así que una repetición nunca es segura: tras un `outcome_unknown`, haz `sync` y `show` del
  elemento y vuelve a escribirlo solo si no está. Una escritura de negociación o prospecto con `--operation-id` se
  rechaza antes de enviar nada.

### Corregido

- Un `sync` después del primero funciona. Pedía al portal los cambios con una hora que el portal rechaza, así que cada
  tipo fallaba y no se copiaba nada nuevo. Las horas de un filtro van ahora en segundos enteros con un desfase, y eso
  también corrige `updated_at:` y `created_at:` en `people list` y `organizations list`.
- Una escritura que recibe como respuesta un fallo del servidor o de la pasarela (500, 502, 504) es `outcome_unknown`,
  no `provider_unavailable`: puede que el portal la hiciera. Una escritura que corta una cancelación también es
  `outcome_unknown`, nunca `cancelled`.
- Las etapas se leen página a página: un directorio de más de las 50 primeras filas de REST 2 perdía sus últimas
  etapas.
- Un id o un responsable que no es un número se rechaza antes de enviar nada; antes salía vacío.
- `--body` conserva tal como se escribieron los enteros mayores de 2^53; `api call --body -` lee el cuerpo de stdin.
- Una petición que no recibe respuesta se corta a los 10 segundos, no a los 30, para que una lectura se pueda volver a
  intentar antes de que se agoten los 30 s propios de un comando de una sola ejecución.
- `show` de contactos y empresas falla cuando las etiquetas de campos del portal fallan por un motivo distinto de la
  falta de derechos, en lugar de mostrar el elemento sin sus etiquetas.

### Seguridad

- Las comprobaciones de permisos de `api call` y de las escrituras de `people` y `organizations` leen un cuerpo
  exactamente como se envía, así que la clave que comprueban es la que necesita la escritura.
- Las lecturas de `api call` comprueban las mismas claves que los comandos que leen esos elementos, como ya hacían sus
  escrituras.

## 0.4.0 — 06.11.2026

### Añadido

- `create` y `update` de negociaciones, prospectos, contactos y empresas aceptan `--field "<label or code>=<value>"`,
  repetido para más campos o para cada valor de un campo múltiple. La etiqueta se busca en el portal; dos campos con esa
  etiqueta se rechazan con sus códigos. Un campo de lista recibe la etiqueta o el id de su opción. `--field` gana sobre
  `--body` para el mismo campo, y `--title`, `--name`, `--first-name` y `--last-name` ganan sobre ambos. Los demás
  valores van al portal tal como se escribieron. `--dry-run` no busca los nombres.
- `list` de negociaciones, prospectos, contactos y empresas filtra por los campos propios del portal:
  `<code or label>:<value>`, para los campos por los que puede filtrar el portal; un campo de lista recibe la etiqueta o
  el id de su opción. Una etiqueta con espacios se escribe `lead_source:web` o `Lead\ source:web`.
- `list --json=…,provider_metadata.<code>` añade ese campo personalizado a cada elemento, como lo da `show`;
  `--json=…,provider_metadata` los añade todos. Solo se piden los códigos que lista el portal.
- `fields list <deals|leads|people|organizations>` muestra los campos personalizados del portal de ese tipo: código,
  etiqueta, tipo, si contiene varios valores, si una lista puede filtrar por él, y las opciones de un campo de lista con
  sus ids.

### Cambios — pueden romper scripts

- `show` da el valor de un campo de lista por la etiqueta de su opción, no por su id; el id pasa a `option_id`, a su
  lado. Un campo que contiene varias opciones da ambos como arrays.
- `api call` funciona con una lista de permitidos. Las lecturas de CRM, catálogo y usuarios y las escrituras de los
  cuatro tipos del CRM se permiten como antes. Cualquier otro método pregunta, así que necesita `--yes` sin terminal, y
  se deniegan las familias que envían mensajes a personas, publican o sacan datos: `imconnector`, `log.blogpost`, los
  enlaces públicos a archivos y `event.bind` se suman a `im`, `imopenlines` y los demás. `api show` indica el nivel de
  cada método.

### Corregido

- Un `deny` en un perfil vuelve a detener un comando de lectura. `b24` solo pasaba a cli-core `resolveSettings`, así
  que cli-core nunca veía la tabla de permisos de b24: `deals.list: deny` no detenía `deals list`, tampoco por MCP, y
  con cualquier clave de b24 en los ajustes todo `--dry-run` fallaba con "names no command".
- `api.crm.<type>.add` y `api.crm.<type>.update` ahora se aplican en `create`, `update` y `move` de `deals`, `leads`,
  `people` y `organizations`, igual que las claves de comando ya se aplicaban en `api call`. `--dry-run` las nombra
  junto a la clave propia del comando.
- `api call --dry-run` nombra cada clave que comprueba la llamada con su nivel, como `api.crm.deal.delete` en `ask`, en
  lugar de "no key, allowed".
- `api call crm.item.add|update|delete` con `entityTypeId` de 1 a 4 comprueba la clave del comando de prospectos,
  negociaciones, contactos o empresas, como ya hacía `crm.deal.update`: `deals.delete: deny` ahora detiene
  `crm.item.delete` para una negociación.
- Todo método cuyo nombre termina en `delete` pregunta, no solo los de la lista. Un nombre de método en mayúsculas o
  con el sufijo `.json` se lee como su nombre simple, así que ya no esquiva una clave.
- Una escritura que fija una etapa comprueba `deals.move` o `leads.move`: `update` y `create` con `stageId` en
  `--body`, también por MCP, y `api call` con `STAGE_ID` o el `STATUS_ID` de un prospecto. `ASSIGNED_BY_ID` comprueba
  `crm.assign-others` igual que `assignedById`.
- Una escritura se envía una sola vez. Una escritura de REST 3.0 que no recibía respuesta se enviaba hasta tres veces
  más con la misma `Idempotency-Key`, algo que aún no se ha comprobado en un portal real; ahora es `outcome_unknown` al
  momento, y su mensaje nombra `--operation-id` una vez.
- `deals list` y `stages list` aceptan `pipeline_id:0`, el embudo por defecto.
- La lista de permitidos mantiene rechazadas las lecturas de las familias denegadas, como antes: `crm.activity.list`,
  `im.*`, `tasks.*` y las demás están en `deny`, y `api show` lo dice.
- El servidor MCP aplica la tabla de permisos de b24 (WC-PERM-23): la búsqueda de herramientas muestra como no
  disponible un comando que el perfil deniega, en lugar de ofrecerlo como disponible.

## 0.3.0 — 06.11.2026

### Cambios — pueden romper scripts

- `show` de negociaciones, prospectos, contactos y empresas da a cada campo personalizado su título en el portal:
  `provider_metadata` asocia el código del campo con `{ "label", "value" }`. `label` es `null` cuando el portal no
  tiene título para él o no responde a la petición de títulos; `show` responde igualmente.

## 0.2.0 — 06.11.2026

### Corregido

- Los comandos que llaman al portal ahora se ejecutan dentro de la ejecución de cli-core: el `meta.run_id` de cada
  respuesta nombra una ejecución que encuentra `runs show`, con las peticiones al portal dentro, `meta.duration_ms`
  mide el comando y `--timeout` detiene un comando atascado. Las anulaciones de permisos de un agente MCP ahora también
  llegan a estos comandos.
- `show` de negociaciones, prospectos, contactos y empresas ya no muestra los campos personalizados del portal que no
  tienen valor: `provider_metadata` deja fuera `null`, `""` y `[]`, y se omite cuando no queda nada.

## 0.1.0 — 06.11.2026

### Corregido

- Un motivo de error que también define un cli-core más nuevo ya no hace que todo comando que falla se bloquee en lugar
  de imprimir su error.

### Añadido

- Creado a partir de `@wirecat/cli-template` 0.14.0.
- El cliente de la API REST de Bitrix24 a través de un webhook entrante: REST 3.0 para negociaciones, prospectos,
  contactos y empresas, REST 2 para lo demás; los límites de peticiones del portal se respetan y se esperan; una
  escritura solo se repite con una `Idempotency-Key`; el secreto del webhook queda fuera de todo error y registro de
  ejecución.
- `session start | status | end` por perfil y `session list`: la dirección del webhook se lee oculta o de stdin, se
  comprueba contra el portal y se guarda en el llavero con `bitrix24-cli`; `session status --check` dice de quién son
  los derechos que lleva el webhook.
- `list` y `show` de `deals`, `leads`, `people` (contactos), `organizations` (empresas), `pipelines`, `stages` (con el
  resultado de cada etapa), `products` y `users`, en directo desde el portal. Una lista acepta una consulta que se
  convierte en el filtro propio del portal; una palabra libre en ella coincide con parte de un título o un nombre. Un
  nombre que comparten dos elementos se rechaza, con ambos como candidatos.
- `create` y `update` de `deals`, `leads`, `people` y `organizations`, y `move` de negociaciones y prospectos: cada
  escritura responde su `operation_id`, que Bitrix24 recibe como `Idempotency-Key`, así que `--operation-id` repite
  una escritura sin riesgo; `--dry-run` la previsualiza; asignar un elemento a otro empleado se deniega hasta que se
  permita (`crm.assign-others`).
- `api list`, `api show <method>` y `api call <method> --body <json>`: cualquier método de Bitrix24, en la versión de
  REST en la que está, comprobando `api.<method>` y la clave del comando que hace lo mismo; las escrituras de
  mensajería, automatización, tareas y `batch` se deniegan hasta que se permitan.
