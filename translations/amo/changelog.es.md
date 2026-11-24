---
title: "Historial de cambios"
---

Cambios destacados en `@wirecat/amo-cli`. Una sección por versión, la más nueva primero.

## 0.4.0 — 24.11.2026

### Cambios — pueden romper scripts

- **`account remove` y la comprobación de un segundo inicio de sesión son ahora los comandos de CRM compartidos de
  cli-core** (`@wirecat/cli-core` 0.722.0). Los motivos siguen siendo `account-remove.account-shared` y
  `session.duplicate`, con los mismos detalles, y una prueba (`--dry-run`) sigue solo avisando. El rechazo ahora dice
  `amoCRM account <host>`.
- **`account remove --delete-data` se niega cuando amo no sabe qué cuenta tiene otro perfil**
  (`account-remove.account-unknown`, detalle `profile`): un perfil cuyo inicio de sesión guardado no se puede leer y
  que `session start` nunca recordó. `--keep-data` sigue eliminando.
- **`session start` rechaza un perfil llamado `files` o `foreign-contacts`** (`profile.reserved`): todas las cuentas
  comparten esas carpetas en la carpeta de estado.

### Corregido

- **La guía de instalación cita el rechazo de amoCRM para un usuario que no es administrador.** El inicio de sesión
  con un clic también muestra su cuenta, pero amoCRM lo rechaza bajo «Разрешить»: «Первичная установка интеграции
  доступна только администраторам аккаунта». La guía decía que solo mostraba las cuentas donde uno es administrador.

## 0.3.0 — 23.11.2026

### Añadido

- **Inicio de sesión con un clic: `amo <profile> session start --host https://<subdomain>.amocrm.ru --one-click`.** El
  navegador abre una página en connect.wirecat.dev, un servidor de WireCat en Rusia al que amoCRM puede llegar. La
  persona elige la cuenta y pulsa «Разрешить», y amoCRM crea en ella una integración de WireCat. Nadie copia un ID de
  integración, una clave secreta ni un token. amoCRM envía la clave secreta de la integración a connect.wirecat.dev, y
  `amo` la recoge una vez. `amo` canjea el código solo con la cuenta que nombra `--host`, y rechaza uno permitido en
  otra cuenta. Guarda y renueva el inicio de sesión igual que con `--client-id`. amoCRM solo deja permitirlo a un
  administrador de la cuenta ([amoCRM: el botón](https://www.amocrm.ru/developers/content/oauth/button)). Por ahora
  solo cuentas de amoCRM; Kommo inicia sesión con un token.
- **`amo setup` ofrece primero «Войти через amoCRM» a un administrador,** y el token en segundo lugar. WireCat Desktop
  muestra el enlace que hay que abrir y espera hasta que se permita el acceso.
- **`amo setup` pregunta si eres administrador de la cuenta.** Un administrador crea la integración como antes. Un
  usuario que no lo es recibe la petición que enviar a un administrador para un token de larga duración, un aviso de
  que el token lleva los permisos del administrador y, una vez conectado, cómo sincronizar sus propias negociaciones en
  lugar de las del administrador. WireCat Desktop muestra los mismos pasos. La página de instalación tiene el mismo
  camino en "Si no eres administrador".

### Corregido

- **La ayuda compartida del CRM ya no menciona leads ni los campos de Bitrix24.** amoCRM no tiene leads aparte:
  `changes list`, `search all` y los demás comandos compartidos describen ahora solo negociaciones.
- La configuración y la página de instalación ya no dicen que cualquiera puede iniciar sesión con la integración en el
  navegador: la guía de amoCRM dice que ofrece ese inicio de sesión solo en cuentas donde la persona es administradora
  ([amoCRM: paso a paso](https://www.amocrm.ru/developers/content/oauth/step-by-step)).

## 0.2.0 — 19.11.2026

### Añadido

- **`amo guide` lista escenarios de tareas frecuentes**, cada uno como comandos en orden y para qué sirve cada uno: la
  primera sincronización y el tablero del embudo, mantener la copia al día, y dejar que un agente cambie el CRM sin
  sorpresas.
- El README empieza con el banner de WireCat, y la página de instalación explica cómo WireCat Desktop conecta `amo`.

## 0.1.1 — 18.11.2026

### Corregido

- Publicado desde GitHub Actions con la firma de npm (provenance), así WireCat Desktop lo instala: Desktop rechaza la
  versión de una herramienta integrada que no compiló el workflow de su propio repositorio, y 0.1.0 se publicó desde un
  ordenador.
- La documentación para usuarios está al nivel de la de bitrix24-cli: páginas de MCP y de permisos, una página de inicio
  completa, `amo <profile> setup` en el inicio rápido del README, variables de entorno en la página de configuración y
  más filas en la resolución de problemas.

## 0.1.0 — 17.11.2026

### Añadido

- Partió de `@wirecat/cli-template` 0.24.0.
- Un ajuste de perfil `host` y el flujo de conexión de WireCat Desktop para un token de larga duración, en inglés, ruso
  y español (`amo setup`, `src/setup/`). `session start` guarda también `host`.
- Con cli-core 0.676.0: un perfil lee sin conexión solo las negociaciones de su propio usuario en una copia que hizo
  otro perfil de la misma cuenta (el administrador sigue leyéndolo todo), `organizations create|update --email|--phone`
  escriben los campos propios de la empresa o se niegan si la cuenta no los tiene, y `pipelines show --since-time|--until-time`
  dan el embudo de un periodo.
- Con cli-core 0.681.0 y cli-base 0.106.0: `setup apply --dry-run` nunca abre el llavero, y las partes de una skill se
  sirven junto a ella.
- Con cli-core 0.683.0: `changes list` y el resumen funcionan en Node 22.16, una nota aparece una sola vez en
  `changes list`, y se rechaza `config set crm.amocrm:<host>.self` (solo una sincronización con sesión iniciada fija el
  usuario de la copia).
- Con `config set crm.amocrm:<host>.activities on`, `sync` copia las tareas, los comentarios y las llamadas de tus
  negociaciones y sus clientes (90 días atrás la primera vez). `activities list` los lista, `changes list` muestra qué
  cambió y `schedule command crm-digest --at 08:30 -- changes list --format report` envía un resumen cada mañana. Una
  tarea borrada en amoCRM sale de la copia en la siguiente sincronización. Una llamada no guarda el número de teléfono
  ni la grabación, y el resumen no imprime el texto de las notas.
- `session start --host <address>` inicia sesión en una cuenta de amoCRM o Kommo con un token de larga duración, leído
  sin mostrarlo o desde stdin y guardado en el llavero con la dirección. `session status --check` muestra la cuenta y el
  usuario.
- `api list`, `api show` y `api call` llegan a cada operación de la referencia de la API v4 de amoCRM, cada una con su
  propia clave de permiso, los parámetros de consulta en `--params` y el cuerpo en `--body`. Las lecturas propias y los
  cambios de negociaciones, contactos y empresas están permitidos, y las demás lecturas, escrituras y borrados
  preguntan. Conversaciones, chats, Salesbots, webhooks, widgets, llamadas, añadir usuarios y escribir tareas están
  denegados hasta que los permitas.
- Solo el administrador de la cuenta borra, deja un campo vacío, desvincula registros o lee contactos, empresas, notas y
  eventos con `api call`, digan lo que digan los permisos.
- `sync` copia las negociaciones asignadas a ti y a los compañeros que elija un administrador, con sus embudos, su
  historial de etapas y sus borrados, y solo los contactos y empresas de esas negociaciones. Reduce sus lecturas con el
  complemento de filtros de la API de amoCRM cuando la cuenta lo tiene.
- `deals list`, `show`, `create`, `update`, `move` y `close` trabajan sobre la copia y escriben en amoCRM.
  `close lost` acepta un motivo de pérdida por su nombre. No hay `deals delete`: la API v4 no puede borrar una
  negociación.
- `people`, `organizations` y `users` leen la cuenta en directo. Se pueden crear y cambiar contactos y empresas. Quien
  no es administrador ve los teléfonos y correos del cliente de otro usuario como mucho 100 veces al día con `show`.
- `session start --client-id <id>` inicia sesión con tu propia integración privada por OAuth y renueva el token de
  acceso por sí mismo. La Redirect URI de la integración es `https://wirecat.dev/webhooks/apps/amo-callback`.
- `account remove` olvida el inicio de sesión y los archivos de un perfil. `--delete-data` además borra la copia de la
  cuenta, y se niega mientras otro perfil lee la misma cuenta (`--dry-run` lo lista todo y avisa).
- `schedule` ejecuta `sync` con un temporizador.
- `sync` continúa dentro de una página cuando se acaba el presupuesto de peticiones de una ejecución, y lee los clientes
  solo por los ids que nombran sus negociaciones. Un cliente de un compañero que no está en ninguna de tus
  negociaciones nunca entra en la copia, y un registro recuperado de la papelera de amoCRM vuelve sea cual sea el orden
  en que amoCRM lista los eventos.

### Cambiado — puede romper llamadas

- **La entrada del MCP Registry pregunta qué perfiles servir.** Antes iniciaba `mcp serve --profiles all`, así que un
  cliente que instalaba el servidor desde el registro llegaba a todas las cuentas del ordenador sin que el propietario
  eligiera. Ahora `--profiles` es un argumento obligatorio con el ejemplo `personal`: el cliente pide un perfil, una
  lista separada por comas o `all`. Por qué: una CLI nunca elige una cuenta por el propietario
  ([WC-MCP-9](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/mcp.md#wc-mcp-9--a-server-serves-the-profiles-it-is-told-with-one-connection-for-each)). Atención: un cliente configurado desde la entrada antigua mantiene `--profiles all` hasta que se configure de nuevo. Un
  servidor añadido a mano o con `mcp config` no cambia.

### Corregido

- Un inicio de sesión con `AMO_TOKEN` y `AMO_HOST` ahora encuentra a su usuario: cada comando pregunta a la cuenta de
  quién es el token, como hace `session start`, así que `deals list` y las demás lecturas de la copia muestran las
  negociaciones de ese usuario en lugar de ninguna. El token no se guarda en ningún sitio. Con `--offline` no se
  pregunta a nadie, y las lecturas no muestran ninguna.
