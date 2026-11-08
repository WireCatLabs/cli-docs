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
memo search all 'venue'               # messages, mail, notes and calendar events together
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
