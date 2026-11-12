---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/bitrix24-cli`. Una sección por versión, de la más reciente a la más antigua.

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

### Cambiado — puede romper llamadas

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

- **El inicio rápido copia negociaciones.** El [README](https://github.com/WireCatLabs/bitrix24-cli/blob/v0.15.0/README.md)
  ahora elige de quién copiar negociaciones y prospectos antes del primer `sync`, que hasta entonces no copia nada.
  Ya no dice que un administrador copia todo el CRM, dice que por MCP un borrado con `ask` se ejecuta, y nombra
  `wcat-b24` para cuando se encuentra primero el comando `b24` de otro paquete.
  [Solución de problemas](./troubleshooting.md) incluye el error "no CRM user is chosen".
- **Por MCP, `ask` no detiene una escritura.** El
  [README](https://github.com/WireCatLabs/bitrix24-cli/blob/v0.15.0/README.md), [seguridad](./security.md) y la
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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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

### Cambiado — puede romper llamadas

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
