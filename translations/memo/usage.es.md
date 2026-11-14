---
title: "Usar Memo"
---

Esta página muestra cómo es un día normal con Memo una vez instalado: traer lo que ha cambiado,
encontrar algo, prepararte para una conversación y guardar lo que has aprendido. Cada paso enlaza a
la página con los detalles. Casi siempre se lo pides a tu agente y él ejecuta los comandos; los
comandos están aquí para que puedas comprobar lo que hace.

## Traer lo que ha cambiado

Memo lee tus carpetas y buzones cuando se lo pides, no todo el tiempo. Un comando trae todo lo que
ha cambiado desde la última vez:

```sh
memo sync
```

Solo se leen los archivos cambiados y el correo nuevo, así que una segunda ejecución es rápida. En
Linux, `memo jobs start` lo ejecuta por ti cada pocos minutos ([mantener Memo al día](./archive.md)).
Los mensajes de Telegram, MAX y WhatsApp llegan a través de tg, max y wa, no a través de Memo.

## Encontrar algo

```text prompt
Use memo CLI to find what I wrote or received about the venue for the Harbour project.
Show the matching text and the source of each result.
```

Tu agente busca en tus notas, tu correo y tus mensajes a la vez y muestra de dónde viene cada
resultado. Cuando sabes dónde está algo, busca solo ahí:

```sh
memo search all 'venue'               # messages, mail, notes, events, CRM and meetings together
memo search notes 'venue'             # notes only
memo search mail 'from:kai invoice'   # mail only
```

[Búsqueda](./search.md) explica las palabras de búsqueda y cómo dar las fuentes a tu agente.

## Ver tu calendario y tus llamadas

`memo events list` muestra los eventos de todas las cuentas de calendario del almacén, los más recientes primero: los calendarios que guardó gcal
y las llamadas importadas de un teléfono con `memo records import`. Dice qué cuentas leyó. Sin una fecha,
muestra los últimos 30 días y los 7 siguientes.

```sh
memo events list                                   # every account, the last 30 days and the next 7
memo events list event_type:call                   # phone calls only
memo events list account:phone:pixel starts_at>=2026-10-01
memo events show event:42                          # one event, and the accounts and calendars that hold it
```

## Reuniones y llamadas en una sola lista

`memo meetings list` reúne en una lista los eventos del calendario, las reuniones de Zoom o Meet y las llamadas
telefónicas importadas, con una fila por cada reunión real: un evento del calendario y su reunión de Zoom son una sola
fila cuando el almacén los vinculó, o cuando comparten sala y sus horas se solapan. Cada fila dice de dónde viene, quién
participó (con sus referencias `person:`), sus enlaces para unirse y si hay una grabación, una transcripción o un
resumen guardados. Una fila aparece cuando se solapa con el periodo indicado. Sin periodo, son los últimos 30 días y
los 7 siguientes, y `started_at:[* TO *]` las lee todas. `memo meetings show` añade las líneas de la transcripción con
sus horas, los resúmenes, los hallazgos que esperan tu decisión y el texto del calendario.

```sh
memo meetings list                                         # every account, latest first
memo meetings list 'started_at:[2026-11-01 TO 2026-12-01}' kind:call
memo meetings list 'started_at:[2026-11-09T00:00:00+01:00 TO 2026-11-16T00:00:00+01:00}' --order start
memo meetings list 'started_at:[* TO *]' --page 3          # every row, no window
memo meetings list has_transcript:true person:"person:12"
memo meetings show event:42 --limit 100                    # or meeting:<account>/<id>
```

## Todos los documentos

`memo documents list` lista los documentos de todas las cuentas: Drive, carpetas de notas, fuentes que añadiste e
importaciones, primero los cambiados más recientemente, con su fuente, carpeta, tipo y enlace. Una palabra busca en su
texto igual que `memo search notes`. `memo documents tree` da las carpetas de cada cuenta con cuántos documentos tiene
cada una, y `memo documents show` una parte del texto de un documento con sus etiquetas, personas y reuniones.

```sh
memo documents list                                        # every account, newest first
memo documents list budget kind:pdf source:google-drive
memo documents list 'folder:"Projects/Acme"' --page 2
memo documents tree --depth 2
memo documents show document:42 --cursor 20000
```

## Prepararte para una conversación

```text prompt
Use memo CLI to show what I know about Kai Sample on Telegram: recent messages, mail and my notes.
Summarise what is still open between us.
```

`memo context telegram:"Kai Sample"` reúne los mensajes recientes de la persona, su correo y las
notas enlazadas a ella, cada cosa con su fuente. Consulta [Personas y proyectos](./people.md).

## Guardar lo que has aprendido

```sh
memo notes add 'Prefers calls in the morning' --subject telegram:'Kai Sample'
memo tags add follow-up --note note:NOTE_ID
memo tasks add --project HRB --title 'Book the venue'
```

Una nota guarda tus propias palabras sobre una persona, un mensaje o un proyecto
([notas](./notes.md#write-your-own-notes)). Una etiqueta es un rótulo que te ayuda a encontrar las
cosas de nuevo ([etiquetas](./tags.md)). Una tarea es algo que hacer ([tareas](./tasks.md)).

## Revisar lo que sugirió tu agente

Un agente puede proponer una acción, como una respuesta. Una aplicación conectada a través de MCP
también puede guardar recuerdos y hechos. Todo esto te espera:

```text prompt
Use memo CLI to show the memories, facts and actions waiting for my review, with their evidence.
Do not confirm or approve anything; I will decide.
```

[Recuerdos y hechos](./memories.md) explica cómo confirmarlos o rechazarlos. Aprobar una acción la convierte en una tarea para ti; Memo no envía nada. Un recuerdo o hecho añadido por el agente con `memo` también espera: con `AI_AGENT` o `CLAUDECODE`, Memo registra al agente como autor. Tus recuerdos se confirman y tus hechos se aceptan al instante.

Las propuestas de proyecto tienen un [flujo de revisión](./recipes.md#review-project-facts-and-follow-ups) separado.
Por defecto, solo tú las decides. Configura [`agent_decisions: true`](./configuration.md#agent_decisions) para que
un agente las decida con un motivo registrado y cree hechos aceptados y tareas numeradas. Las conclusiones de reuniones
siguen requiriendo al propietario.

## Llevar el control del dinero

Las facturas y los pagos son filas con un importe, una moneda y una parte, no hechos. Los importes son decimales como
`50000.00`, y los totales se separan por moneda: Memo nunca los convierte.

```sh
memo invoices add 50000.00 RUB Bed rental, November --kind receivable --organization organization:3 --project HRB
memo payments add 25000.00 RUB --kind in --organization organization:3 --occurred-time 2026-11-01 --project HRB
memo payments allocate payment:9 invoice:4 25000.00
memo projects status HRB
```

Lo que añades tú se confirma al instante. Lo que añade tu agente espera en `memo review kind:invoice,payment`, y solo
tú confirmas el dinero. Un pago que el agente lee en un chat se convierte en un pago o una factura cuando confirmas la conclusión.
`projects status` muestra lo facturado, lo pagado y lo que aún se debe, solo a partir de filas confirmadas.

Un pago asignado a la factura equivocada, o con el importe equivocado, se corrige con
`memo payments unlink payment:9 invoice:4`, que deshace esa asignación, y `payments allocate`, que crea
la correcta. El reparto de un pago confirmado lo corriges tú: se rechaza si lo ejecuta un agente.

La exportación de una fuente, como una hoja de pagos, llega como un sobre de registros (JSON, o JSONL con una línea de cabecera).
`memo records check payments.jsonl --account rentals` dice lo que haría una importación y no escribe nada.
`memo records import` la escribe. El mismo archivo dos veces no cambia nada, y sus facturas y pagos te esperan en
`memo review`.

Cuando el archivo nombra una parte con su propio id, como `organization:client`, sus facturas y pagos esperan hasta que
digas a cuál de tus entradas corresponde. `memo records list waiting:true --account sheet:rentals` muestra lo que espera, y
`memo records link organization:client organization:3 --account sheet:rentals` lo enlaza. Solo tú puedes hacerlo.

Los productos, contratos, suscripciones, cuentas bancarias y movimientos, las devoluciones, y cómo volver a encontrarlo todo con
`search all --only business` están en [Datos de negocio](./business.md).

## Seguir negociaciones y leads

Una negociación es lo que esperas vender: un título, el cliente, el importe esperado y la etapa en que está. Un lead es un primer
contacto, antes de ser una negociación. Cada uno está en un pipeline, una lista de etapas en orden. Su estado (abierto, ganado o perdido)
se guarda aparte de la etapa. Memo empieza con un pipeline de leads, `Leads` (new, contacted, qualified, won, lost).

```sh
memo pipelines add Sales Call Quote Contract won lost
memo deals add 'Site for the clinic' Call 500000.00 RUB --organization organization:3 --project HRB
memo deals move deal:5 Quote
memo deals close deal:5 won
memo leads add 'Call from the site'
memo pipelines show Sales
```

Tu agente escribe negociaciones, leads y pipelines igual que tú, al instante. Para limitar lo que puede hacer por MCP, configura las
claves de [`permissions`](./configuration.md#permissions), como `"deals": "readonly"`. Dos cuentas de CRM pueden tener cada una un
pipeline llamado Sales: nombra uno por su referencia, `pipeline:3`. `pipelines show` cuenta, por etapa, cuántas negociaciones
llegaron a ella y qué parte pasó a la siguiente. `projects status` muestra hasta cinco negociaciones abiertas del proyecto.

`memo deals context deal:5` da una negociación entera: cómo cambió su etapa, el cliente, sus personas con sus roles y
su posición, el propietario, el proyecto, las facturas y los pagos de su proyecto y de su cliente, cada uno diciendo
cómo se llegó a él, los mensajes, el correo y las reuniones de sus personas mientras estuvo abierta, y sus tareas
abiertas. Esos mensajes comparten personas con la negociación, pero nada los vincula, así que se marcan `proposed`.
Una etapa llamada Won no es un pago. El dinero es lo que dicen las facturas y los pagos. `--brief` es la forma corta
para un agente, y `memo leads context` hace lo mismo para un lead. `memo deals update deal:5 --project HRB` fija el
proyecto de una negociación, también de la copia de un CRM. La sincronización nunca lo cambia.

Una negociación copiada de una cuenta de CRM (`b24 <profile> sync`) y las personas en ella son `reported`: lo dice el
CRM y tú no lo confirmaste. Pon la cuenta del CRM en un grupo (`memo groups add work bitrix24:<portal>`), y una
ejecución de otro grupo no lee ninguna de sus negociaciones, personas ni relaciones.

En `--json`, cada fila de `deals list`, `leads list` y `pipelines list` copiada de un CRM tiene `writes_with`: la CLI
que la cambia en el CRM (`tool`, como `b24`), la `account` de la fila y el `profile` con el que ejecutarla. El perfil
se indica solo cuando exactamente un perfil de esa CLI se ha ejecutado en la cuenta. Si no, es `null`, `profiles`
lista los candidatos y `why` dice qué elegir. En un grupo nunca se nombra un perfil de una cuenta fuera del grupo.
Tus propias filas tienen `"writes_with": null`, porque memo las cambia él mismo.

### Etapas base

Cada CRM y cada uno de tus embudos llama a sus etapas a su manera. Las etapas base son una lista tuya para las
negociaciones y otra para los leads, las columnas de un tablero en todos los embudos. Cualquier otra etapa se asigna a
una de ellas. Memo sugiere la asignación y tú la confirmas.

```sh
memo stages show deal
memo stages list confirmed:false
memo stages set stage:41 stage:3
memo stages confirm --pipeline pipeline:3
memo deals move deal:5 stage:3
```

`stages show deal` crea la lista de negociaciones la primera vez, en tu primer idioma (`owner_languages`, ruso
mientras no esté definido). La lista de leads es el embudo `Leads` propio de memo tal cual: New, Contacted,
Qualified, Won, Lost. `stages show` da cada columna con sus negociaciones o leads abiertos y sus etapas asignadas, y lo
que está sin ordenar: etapas aún no asignadas o solo sugeridas. `stages create`, `rename`, `move` y
`remove` editan la lista, y cada lista conserva al menos una etapa abierta, una ganada y una perdida. `stages list`
muestra todas las demás etapas con su etapa base y `confirmed`. `stages set` asigna una etapa. `stages confirm --all`
confirma todas las sugerencias. Solo tú editas la lista y confirmas. El `stages set` de tu agente sigue siendo una
sugerencia hasta que lo confirmes.

`deals move` y `leads move` aceptan el `stage:<id>` de una etapa base. Mueven tu propia negociación a la única etapa
de su embudo asignada a ella. Cuando hay varias, la respuesta es `stage.choice-required` con `candidates`: muévela a
una de ellas por su `stage:<id>`. Cuando no hay ninguna, es `stage.unmapped`. La copia de un CRM se mueve en su CRM,
con la CLI de su `writes_with`. En `--json`, una fila de `deals list` y `leads list` tiene `base_stage`, que sigue en
`null` hasta que confirmes su asignación. En un grupo, `stages` cuenta y lista solo los embudos del grupo y los tuyos.

## Respuestas para scripts y agentes

Añade `--json` a la mayoría de los comandos para obtener una respuesta que un programa pueda leer.
La respuesta en texto es para personas; los agentes y los scripts deben pedir JSON.

Cada resultado nombra su fuente con una **referencia**, como `note:12`, `document:3` o
`msg:telegram/1/77/42`. Puedes pasar una referencia a otros comandos: para etiquetarla, escribir una
nota sobre ella o usarla como evidencia. [Cómo funciona Memo](./how-it-works.md#references) explica
cada tipo.

Las respuestas JSON comparten una forma. Un objeto está en `item`; una lista en `items`, con `page` indicando si hay más (`page.has_more`). `meta` identifica la ejecución y cuentas leídas; `missing`, cuando existe, explica lo que no se pudo cubrir. `--json=a,b` conserva esos campos del objeto o de cada elemento. Las rutas con puntos recorren objetos y arrays anidados. Usa `--json=ref,excerpt` para resultados compactos de `memo search all`. Parten del contenido de la respuesta; se conservan paginación, cobertura, siguientes pasos, datos ausentes y metadatos. Elegir campos reduce la salida, no el trabajo examinado.

Dónde están las referencias de búsqueda:

| Comando | Referencia de cada resultado |
|---|---|
| `memo search messages`, `memo search mail` | `items[].ref`, como en `tg personal search messages` |
| `memo search all` | `items[].ref`, con `kind`; `next` enumera tareas abiertas que apuntan al resultado (`tasks list source:"<ref>"`) |
| `memo search notes` | `items[].ref` |

`content:` limita al texto de archivos, `transcript:` a transcripciones de voz y `filename:` a nombres de archivo. Compara condiciones iguales: `memo search messages 'content:invoice'` con `tg personal search messages 'content:invoice'`, y una palabra simple con otra palabra simple.

## Elegir una cuenta

Cuando tienes varias cuentas de Telegram, MAX o correo, Memo no elige una por ti. Indica las cuentas
con `--source`: una cuenta como `telegram:1` o `email:work`, todas las cuentas de un servicio de
mensajería como `telegram`, todas las cuentas de un tipo como `mail`, o un grupo guardado como
`group:work`; separa varias con comas. Una lista lee todas las cuentas que indicas y dice cuáles. Una búsqueda sin cuenta busca en todas y lo indica, igual que `memo tasks list` y `memo reminders list` (las tareas de un proyecto necesitan `project:<key>`). Una carpeta de notas también es una cuenta: `notes:<number>`, con el número que dan los resultados de búsqueda como `folder_id`.

Un comando que cambia algo, como añadir una tarea o un recordatorio, actúa como una sola cuenta. Indícala con
`--account`, con el proveedor y la cuenta juntos: `--account telegram:1`, `--account email:work`. Si falta,
Memo te dice qué cuentas existen.

Las lecturas usan `--source`; las escrituras de una cuenta usan `--account provider:account`. Se rechazan las opciones de selección retiradas.

### Grupos de cuentas

Memo lee todas las cuentas por defecto. Eso es `all`, y `memo all …` lo dice en voz alta. Un grupo es una lista de
cuentas que guardas tú, sobre todo para limitar a un agente a los datos de trabajo. Pon una cuenta en uno con
`memo groups add work
bitrix24:acme` y lee solo ese grupo nombrándolo primero: `memo work search all "renewal"`, `memo work context
person:5`. `MEMO_GROUP=work` hace lo mismo en cada comando. En un grupo, una lectura toma solo las cuentas del grupo.
Un `--source` explícito acota dentro de él, y una cuenta fuera de él se rechaza, igual que el `--account` de una
escritura. Un comando que lee un solo tipo, como `search mail`, toma las cuentas del grupo de ese tipo. Lo que hiciste
tú (tus notas, proyectos, tareas, facturas, recuerdos y hechos) no pertenece a ninguna cuenta, así que todos los
grupos lo muestran.

`memo groups list` muestra cada grupo guardado y luego `all`, con sus cuentas, los nombres de perfil de cada app para
cada una (`tg work`, `b24 work`) y los otros grupos que también tienen esa cuenta. Una cuenta puede estar en varios, y
la lista nombra esos duplicados. Un perfil que se llama como un grupo es solo una sugerencia y nunca pone una cuenta en
un grupo. `personal` es un grupo como cualquier otro, vacío hasta que lo guardes. `--source personal` no es ese
grupo: son tus propias cuentas de mensajería, no los bots.

`memo groups remove work telegram:102` saca una cuenta, y `all` la sigue leyendo. `memo groups move telegram:102
personal work` la mueve en una sola escritura: la cuenta, luego el grupo que deja y luego el grupo al que entra. Sin
un bloqueo, un grupo es una comodidad y no un límite: las referencias (`msg:…`, `deal:5`) no se comprueban, y una
ejecución sin el nombre del grupo lee todas las cuentas. Para fijar un proceso a un grupo, consulta
[el bloqueo de MCP](./mcp.md#lock-an-agent-to-a-group).

Cada cuenta es personal o de trabajo: las vistas de trabajo y la preparación de reuniones leen solo cuentas de trabajo.
Toda cuenta es personal hasta que digas lo contrario, salvo la que añade un CLI de CRM como `b24`, que empieza como de
trabajo. `memo groups update
bitrix24:acme --scope work` mueve una, con lo que la búsqueda copió de su ámbito anterior, y `groups list` muestra el
`scope` de cada cuenta. `--chat 7 --scope work` fija un chat de la cuenta, y `--scope account` hace que ese chat vuelva
a seguir a su cuenta. Solo tú cambias un ámbito: un agente por MCP no ve el comando.
