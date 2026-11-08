---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/bitrix24-cli`. Una sección por versión, de la más reciente a la más antigua.

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
