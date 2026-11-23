---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/hubspot-cli`. Una sección por versión, la más nueva primero.

## 0.5.0 — 21.11.2026

### Cambiado: puede romper a quien lo usa

- **El borrado GDPR de un contacto está desactivado hasta que lo permitas.** `api contacts-gdpr-delete` borra un
  contacto y todo lo que tiene para siempre, y bloquea que su dirección vuelva. Su clave `people.erase` era `ask`, y por
  MCP `ask` sigue adelante sin preguntar. Ahora es `deny` por defecto: la llamada responde `permission_error` y no
  envía nada. Los borrados normales siguen preguntando. Atención: para borrar contactos, ejecuta
  `hubspot <profile> config set permissions.people.erase allow`. Mira [permisos](./permissions.md).

### Corregido

- **Una llamada `api` denegada se rechaza antes de leer su cuerpo.** Una llamada cuya clave es `deny` respondía
  `validation_error` cuando no tenía cuerpo o lo tenía mal, y ahora responde `permission_error`, en la línea de
  comandos y por MCP (cli-core 0.715.0).

## 0.4.0 — 19.11.2026

### Cambiado: puede romper a quien lo usa

- **`deals.write`, `people.write` y `organizations.write` ya no existen.** Solo detenían el camino de `api`, así que
  `deals.write: deny` seguía dejando pasar `deals update`. Una escritura con `api` en negociaciones, contactos o
  empresas comprueba ahora la clave del comando que hace lo mismo (`deals.update`, `people.create`), como en amoCRM y
  b24, y una fusión comprueba `<group>.update`. Así una escritura directa en una negociación, un contacto o una empresa
  avanza igual que su comando, y los borrados siguen preguntando. Atención: un ajuste que nombra una de las tres claves
  antiguas ya no coincide con nada. Pon en su lugar `deals.update`, `deals.create` o la clave de grupo `deals`.

### Corregido

- **Una lectura denegada en un comando del CRM también se deniega con `api`.** `config set permissions.people deny`
  detenía `people list` pero no `api contacts-list`, que leía los mismos contactos. Ahora cada lectura directa
  comprueba la clave del comando que lee los mismos registros: `people`, `organizations`, `deals`, `leads`,
  `activities`, `users`, `pipelines`, `stages` y `fields`. Mira [permisos](./permissions.md).

## 0.3.2 — 19.11.2026

## 0.3.1 — 19.11.2026

### Corregido

- **Las notas, reuniones y tareas se leen como texto limpio.** Los códigos HTML como `&#8217;` y `&mdash;` se
  convierten en los caracteres que representan y los bloques de estilo se descartan, así la búsqueda encuentra las
  palabras. Antes solo se decodificaban seis códigos.
- **El límite diario de HubSpot dice «no reintentar» en todos los caminos.** Los comandos del CRM lo daban por
  reintentable y `api` no, así que un agente podía reintentar durante horas.
- **`session start --help` ya no dice que hubspot no cambia nada.** La escritura llegó en 0.2.0.

## 0.3.0 — 18.11.2026

### Cambiado: puede romper a quien lo usa

- **La entrada del MCP Registry pregunta qué perfiles servir.** Antes arrancaba `mcp serve --profiles all`, así que un
  cliente que instalaba el servidor desde el registro llegaba a todas las cuentas del ordenador sin que el dueño
  eligiera. Ahora `--profiles` es un argumento obligatorio con el ejemplo `personal`: el cliente pide un perfil, una
  lista separada por comas o `all`. Por qué: una CLI nunca elige una cuenta por el dueño
  ([WC-MCP-9](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/mcp.md#wc-mcp-9--a-server-serves-the-profiles-it-is-told-with-one-connection-for-each)).
  A tener en cuenta: un cliente configurado con la entrada antigua conserva `--profiles all` hasta que se configure de
  nuevo. Un servidor añadido a mano o con `mcp config` no cambia.

### Corregido

- **`mcp serve` arranca en un ordenador que aún no tiene perfil.** Muestra sus herramientas, y cada llamada responde
  con el comando que configura un perfil. Antes el servidor se detenía al arrancar, así que un directorio que revisa
  servidores no podía listarlas. Desde cli-core 0.699.0.

## 0.2.0 — 17.11.2026

### Añadido

- **`deals create`, `update`, `move`, `close` y `delete` cambian negociaciones en HubSpot, y la copia toma cada
  respuesta.** `close` mueve una negociación a la etapa de ganada o perdida de su embudo y guarda `--reason` como el
  motivo de cierre de HubSpot. `delete` archiva la negociación y pregunta antes. Consulta el [uso](./usage.md).
- **`people create|update` y `organizations create|update` cambian contactos y empresas.** Un contacto guarda un
  correo y dos números, una empresa un número y ningún correo. Una lista más larga se rechaza antes de enviar nada.
- **`api` ofrece también las escrituras y los borrados de HubSpot: 66 escrituras y 33 borrados de la API del CRM,
  versión 2026-03.** Cada escritura comprueba `api.<command>` y la clave `<group>.write` de su grupo, cada borrado su
  `<group>.delete`, y ambos preguntan por defecto. Una escritura que hace lo mismo que un comando comprueba también la
  clave de ese comando (`deals.update`), un cuerpo que cambia la etapa de una negociación comprueba `deals.move` y
  `deals.close`, y uno que asigna un propietario comprueba `crm.assign-others`, que por defecto es `deny`.
  `api contacts-gdpr-delete` comprueba además `people.erase`, para negar solo el borrado definitivo. `--dry-run`
  nombra cada clave. Consulta los [ajustes](./configuration.md#permissions).
- **Los scopes de escritura son opcionales.** La configuración y la [instalación](./installation.md#make-a-key)
  enumeran `crm.objects.{deals,contacts,companies}.write`. Sin ellos la clave solo lee.

### Corregido

- **`api` envía la clave con cada operación.** Las especificaciones de objetos de HubSpot marcan 115 operaciones como
  si no necesitaran inicio de sesión, así que en 0.1.0 `api deals-get`, `api contacts-list` y las demás operaciones de
  registros salían sin la clave y HubSpot respondía 401. Las operaciones de embudos, propiedades, propietarios y cuenta
  no estaban afectadas.

## 0.1.0 — 17.11.2026

### Añadido

- Partió de `@wirecat/cli-template` 0.25.0.
- **`session start` inicia la sesión de un perfil con una clave de servicio de HubSpot o un token de app privada.** La
  clave se lee oculta o desde stdin, nunca como argumento, se comprueba contra la cuenta y se guarda en el llavero con
  el id de la cuenta. Se rechaza un segundo perfil en la misma cuenta. `WCHUBSPOT_TOKEN` funciona en CI junto a
  `WCHUBSPOT_ACCOUNT`, el id de la cuenta. Consulta la [instalación](./installation.md).
- **`sync` copia el CRM de la cuenta en el almacén compartido de WireCat.** Negociaciones, contactos, empresas, leads
  (Sales Hub Professional o Enterprise), propietarios, embudos y propiedades, y las notas, llamadas, correos, reuniones
  y tareas cuando el ajuste de actividades está activado. `deals list`, `pipelines`, `changes list` y `search all`
  responden después sin conexión. Una clave no nombra a ningún usuario, así que cada perfil lee toda la copia: filtra
  por `owner:<owner id>`, no por `owner:me`.
- **`people`, `organizations` y `users` leen contactos, empresas y propietarios en directo desde la cuenta.**
- **`api` ofrece todas las operaciones de lectura de la API del CRM de HubSpot, versión 2026-03, a partir de sus 15
  especificaciones.** Un comando por operación, cada uno con su propia clave de permiso. Esta versión solo lee: las
  escrituras de la API no se ofrecen, y `api show` sobre una de ellas lo dice.
- **Un límite diario agotado termina la petición enseguida y dice cuándo vuelve.** HubSpot reparte un límite diario
  entre todas las apps de la cuenta. `hubspot` informa `hubspot.daily-limit` con la espera hasta la medianoche de la
  cuenta, y evita que cualquier proceso de la cuenta vuelva a preguntar antes. El límite de diez segundos se espera.
- **`WCHUBSPOT_ACCOUNT` se comprueba contra `WCHUBSPOT_TOKEN` antes de escribir nada.** Un `sync` con el id de otra
  cuenta se detiene con `account.mismatch` y nombra ambos ids, así el CRM de una cuenta nunca se archiva bajo otra.
  `session status --check` solo con el token imprime el id que hay que poner. Consulta la
  [resolución de problemas](./troubleshooting.md).
