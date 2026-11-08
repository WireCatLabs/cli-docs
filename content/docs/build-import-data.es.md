---
title: "Importar datos de negocio"
description: "Un solo formato JSON lleva al almacén clientes, negociaciones, contratos, pedidos, facturas, pagos, datos bancarios, datos del teléfono y los objetos propios de una fuente, con las reglas que deciden qué espera al propietario."
---

Tienes datos de negocio en otro sistema: un ERP, una exportación de un CRM, un extracto bancario, una hoja de cálculo o
una copia del teléfono. Quieres llevarlos al almacén local del propietario, para que su agente de IA responda «cuánto
debe este cliente, bajo qué contrato, y si está pagado» con referencias y no con suposiciones. Esta página te da el
único formato que usa cualquier importación, sus reglas y un ejemplo completo, del archivo a las respuestas del agente.

Primero unas palabras. El **sobre de registros** es ese formato: un documento JSON, o JSONL con un registro por línea.
Cada elemento es un **registro de origen**, lo que tu fuente dice de una cosa. cli-core convierte un registro de origen
en una **entidad** (una persona, una negociación, un contrato) o en una **propuesta**, dinero que solo cuenta cuando el
propietario lo confirma. La página de [conceptos](./build-concepts.md) explica las entidades y los registros de origen
con más detalle.

## Para quién es esta página

- Construyes una herramienta de línea de comandos sobre WireCat y tu servicio tiene registros de negocio.
- Escribes un script puntual que lleva una exportación al almacén.
- Eres un agente de IA y te piden importar un archivo, o encontrar lo que trajo una importación.

## Un formato, tres entradas

Toda importación lee el mismo sobre, `schema_version: 1`, descrito por el
[JSON Schema](https://github.com/WireCatLabs/cli-core/blob/main/schemas/records-envelope.v1.schema.json).
Llega al almacén de una de tres maneras:

- **Un archivo** JSON o JSONL, que lee `records import` de la herramienta memo.
- **La entrada estándar**, el mismo comando con `-` en lugar del nombre del archivo, así otro programa puede enviarle
  datos por una tubería.
- **Desde tu propio código**, con `ingest` o `ingestLines` de `@wirecat/cli-core/services`.

Un sobre JSON tiene `schema_version`, `source` y `records`. En JSONL, la primera línea no vacía lleva `schema_version`,
`source` y el `options` opcional, y cada línea siguiente es un registro. JSONL se lee línea a línea y se escribe cada
1000 registros, así que un archivo de cualquier tamaño nunca está entero en memoria.

```json
{
  "schema_version": 1,
  "source": { "provider": "example-erp", "account": "demo", "batch_id": "2026-11-07" },
  "options": { "lines": "products" },
  "records": [
    { "key": "org", "type": "organization", "external_id": "C-1", "operation": "upsert", "revision": 1,
      "fields": { "name": "ООО Пример" }, "relations": [] }
  ]
}
```

- `source.provider` nombra tu sistema y `source.account` la cuenta en él. Juntos son la cuenta a la que pertenecen los
  registros. Los registros nunca coinciden entre cuentas.
- Un registro tiene una `key` (única en el archivo, el recibo la cita), un `type`, el id propio de la fuente en
  `external_id`, una `operation` (`upsert` o `delete`), sus `fields` (como mucho 64 KiB), una `revision` opcional y
  como mucho 100 `relations`.
- `options.lines` con el valor `products` lee el `product` de una línea como el id externo de un registro de producto.
  Con el valor por defecto, `text`, en una línea de factura es un dato más. Las líneas de pedido siempre lo leen como
  producto.

## Elige un tipo

Elige el tipo en este orden:

1. **Un tipo que WireCat ya tiene.** Si tu objeto es un cliente, una negociación, un contrato o un pago, envíalo con
   ese tipo, aunque tu sistema lo llame de otra forma. Así cada herramienta y cada agente lo leen igual.
2. **`custom:<name>`** para un objeto que WireCat no modela, como un presupuesto, un ticket o una franja de entrega. Se
   guarda tal como lo enviaste, con su JSON anidado y sus vínculos. Nunca se convierte en entidad, y nadie lee dinero
   de él.
3. **Una nueva entidad compartida** solo cuando una pregunta del propietario necesita reglas propias, como un total, un
   estado o una regla de coincidencia. Es un cambio en cli-core, no una tabla en tu herramienta. Abre primero un issue
   en [cli-core](https://github.com/WireCatLabs/cli-core/issues).

Un tipo desconocido se rechaza con `record.type`. Nunca se convierte por sí solo en un registro propio, así que una
errata en el nombre del tipo aparece en el recibo en lugar de esconderse en el almacén. `task` también se rechaza, las
tareas tienen sus propias reglas de origen.

## Los tipos

Una importación nunca escribe dinero confirmado. Todo lo que entra en un total de dinero llega como propuesta, y solo
el propietario la confirma o la rechaza en la lista de revisión de memo. El resto se escribe directamente.

| Tipo | En qué se convierte | Propuesta |
| --- | --- | --- |
| `person` | una persona, encontrada o creada (ver [coincidencias](#cómo-se-encuentran-personas-organizaciones-y-proyectos)) | no |
| `organization` | una organización, encontrada o creada | no |
| `project` | un proyecto, encontrado por su clave o creado | no |
| `product` | un producto o servicio con su precio, en el catálogo | no |
| `pipeline` | un pipeline de ventas con sus `stages` | no |
| `deal`, `lead` | una negociación o un lead, la misma fila que escribe la sincronización del CRM | no |
| `contract` | un contrato, con fechas y condiciones de renovación y aviso | sí, cuando tiene un valor. Sin valor, se escribe |
| `order` | un pedido con sus `lines` | sí |
| `invoice` | una factura con sus `lines` | sí |
| `payment` | un pago, su parte en cada factura que `settles`, o un reembolso | sí |
| `subscription` | una suscripción con sus `prices`, que nunca se sobrescriben | sí |
| `wallet` | una cuenta bancaria, una tarjeta o efectivo | no. Su saldo inicial queda en el registro hasta que el propietario lo fija |
| `transaction` | una línea de un extracto bancario, con sus `splits` | sí |
| `message` con `kind: "sms"` | un SMS en un chat (ver [datos del teléfono](#datos-del-teléfono-sms-llamadas-y-contactos)) | no |
| `event` con `kind: "call"` | una llamada, como evento | no |
| `custom:<name>` | solo un registro, guardado tal como llegó | no |

Los `fields` conocidos de cada tipo tienen su tipo en el esquema. Cualquier otra clave se guarda tal como llega. El
dinero es una cadena decimal, como `"10000.00"`, con su `currency` al lado.

## Vínculos

Un registro apunta a otros registros con `relations`. Cada vínculo tiene un `role` y un destino:

- **Otro registro de la misma cuenta:** `{ "role": "counterparty", "type": "organization", "external_id": "C-1" }`.
- **Una entidad que ya está en el almacén**, por su referencia con tipo: `{ "role": "counterparty", "ref": "organization:12" }`.

El tipo decide qué roles conoce. Una factura tiene `issuer`, `counterparty`, `project`, `contract` y `subscription`.
Un pago tiene `payer`, `payee`, `settles` (con un `amount`, su parte de esa factura) y `refund_of`. Una negociación
tiene `organization`, `person` y `project`. Un rol que se toma una vez, como el `counterparty` de una factura, se
rechaza si llega dos veces (`record.relation-ambiguous`).

- **`as`** dice qué papel tiene una persona u organización, como `"as": "decision-maker"` en la `person` de una
  negociación o `"as": "customer"` en la `party` de un contrato.
- **Un rol que el tipo no tiene** es una palabra propia de tu fuente, como `quoted-for` o `parent-ticket`. Se guarda
  tal como lo enviaste, se resuelve de registro a registro y nunca se convierte en otra cosa.
- **Un destino que todavía no está** deja el registro **en espera**. Un pago de una factura que envías mañana espera,
  y se escribe cuando llega la factura, en esta ejecución o en una posterior. El recibo nombra el rol que falta.

## Cómo se encuentran personas, organizaciones y proyectos

Un registro de persona, organización o proyecto se vincula a una entidad que el almacén ya tiene solo por un
identificador fuerte. Nunca por el nombre.

| Tipo | Identificadores fuertes |
| --- | --- |
| `person` | `fields.email` y `fields.phone` (uno o una lista), y el id de contacto propio de tu fuente |
| `organization` | `fields.identifiers`: `{ "scheme": "tax-id:ru", "value": "7700000000" }`, con esquema `email`, `domain`, `tax-id:<país>` o `registration:<país>` |
| `project` | `fields.key` |

- **Coincide exactamente una entidad:** el registro se vincula a ella, y la importación no le añade nada.
- **Coinciden dos o más:** no se crea nada y no se vincula nada. El registro espera al propietario, aparece en el
  recibo bajo `unmatched` con sus `candidates`. Solo el propietario dice cuál es. Un agente solo puede informar de
  ello.
- **No coincide ninguna:** la importación crea una entidad nueva, la marca como creada por la importación y le da los
  identificadores del registro.

Un e-mail se compara sin espacios en los extremos y en minúsculas. Un número de teléfono se compara en su forma
internacional, como `+447700900123`. Un número escrito sin `+` ni `00` solo se lee con una región: el ajuste
`phone_countries` del almacén, o la `region` de una importación vCard. Sin región no es un identificador, y el
registro crea una persona nueva en lugar de encontrar la que existe. Envía los números con `+` cuando los tengas.

Un dominio de correo gratuito como `gmail.com` se rechaza como `domain` de una organización (`record.identifier`).

## Revisiones, repeticiones y borrados

- **Repetir no cambia nada.** El mismo archivo dos veces da `unchanged` en cada registro. Los mismos campos y vínculos
  en otro orden cuentan como el mismo registro.
- **Las revisiones solo suben.** Cuando un registro tiene `revision`, cada versión posterior la envía. Una revisión
  menor, o la misma revisión con otro contenido, se rechaza con `record.stale-revision`.
- **Un registro cambiado** actualiza lo que se escribió directamente. Una propuesta que hizo la importación se
  actualiza mientras espera al propietario. Cuando el propietario ya decidió, el cambio solo se **marca** en el recibo,
  y su decisión se mantiene. Las facturas siempre se marcan, como en la primera versión del formato.
- **Los borrados son suaves.** `"operation": "delete"` marca el registro como borrado. Su entidad se queda, y una
  entidad propuesta o confirmada aparece como marcada, para que el propietario decida qué hacer con ella.

## El recibo y los errores

<!-- verify against released memo: records import and records check print this receipt -->

`ingest` e `ingestLines` devuelven este recibo, y `records import` y `records check` lo imprimen:

| Miembro | Qué contiene |
| --- | --- |
| `dryRun` | `true` cuando no se escribió nada |
| `source` | el proveedor, la cuenta y el `batchId` |
| `created`, `updated`, `unchanged`, `deleted`, `refused` | cuentas exactas |
| `proposed` | las propuestas creadas o cambiadas, como `invoice:1` |
| `waiting` | registros con un destino que falta: `key`, `pointer`, los roles en `missing` |
| `unmatched` | registros con dos o más candidatos: `key`, `pointer`, `reason`, `candidates` |
| `flagged` | registros cambiados o borrados cuya entidad no se tocó |
| `errors` | rechazos: `pointer`, `code`, `message`, `key` |
| `truncated` | `true` cuando una lista se detuvo en 1000 elementos. Las cuentas siguen siendo exactas |

El `pointer` es un JSON Pointer dentro del sobre, como `/records/0/type`, así tu herramienta puede mostrar el lugar
exacto. Un registro malo se rechaza y el resto se escribe. Un error en el propio sobre (`envelope.invalid`,
`envelope.schema-version`, `envelope.account-mismatch`) no deja pasar ningún registro.

Este es el recibo de un archivo con un tipo desconocido y un pago cuya factura todavía no ha llegado:

```json
{
  "dryRun": false,
  "source": { "provider": "example-erp", "account": "demo2", "batchId": "b2" },
  "created": 2,
  "updated": 0,
  "unchanged": 0,
  "deleted": 0,
  "refused": 1,
  "proposed": [],
  "waiting": [{ "key": "p", "pointer": "/records/1/relations", "missing": ["settles"] }],
  "flagged": [],
  "unmatched": [],
  "errors": [
    {
      "pointer": "/records/0/type",
      "code": "record.type",
      "message": "a type is one of invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, pipeline or custom:<name>",
      "key": "t"
    }
  ],
  "truncated": false
}
```

Una **ejecución de prueba** revisa todo el archivo y no escribe nada. Su recibo es el real, con las referencias entre
registros. Se ejecuta como una sola transacción que se deshace al final, así que tg, max y memo esperan al almacén
mientras dura. Una ejecución real confirma cada 1000 registros. Si se detiene a mitad, los registros anteriores quedan
escritos, y volver a ejecutarla es seguro.

## Datos del teléfono: SMS, llamadas y contactos

Una exportación del teléfono es un sobre de un teléfono, JSON o JSONL, que se importa en una sola cuenta, como
`phone:pixel`. Los registros, los SMS y las llamadas quedan en esa cuenta, así que un grupo de cuentas muestra el
teléfono una vez.

- Un SMS es un `message` con `kind: "sms"`. Se escribe en un chat por conversación, y la búsqueda lo lee como los
  mensajes de un servicio de mensajería.
- Una llamada es un `event` con `kind: "call"`. Nunca cuenta como ocupado, y un `events list` normal la muestra junto
  a las reuniones.
- La persona del otro lado es un registro `person` que envía la fuente, uno por número. El vínculo `counterpart` la
  nombra.

```json
{ "key": "sms-1", "type": "message", "external_id": "sms-1",
  "fields": { "kind": "sms", "direction": "in", "phone": "+447700900123", "name": "Иван Петров",
              "body": "Буду в 10", "sent_at": "2026-11-01T09:12:00+01:00", "read": true },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
{ "key": "call-1", "type": "event", "external_id": "call-1",
  "fields": { "kind": "call", "direction": "missed", "phone": "+447700900123", "started_at": "2026-11-01T10:00:00Z",
              "duration": 0 },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
```

Un SMS o una llamada se vincula a una persona solo a través de ese registro de persona. Ese registro se busca como
cualquier persona: un número exacto vincula, ninguno crea una persona, dos o más dejan el SMS o la llamada esperando
al propietario. Un registro sin `counterpart` guarda solo el número. Un archivo de contactos en formato vCard (`.vcf`) se convierte en el
mismo sobre: `ingestVcard` de `@wirecat/cli-core/services` lo lee y lo importa en una sola llamada, con una `region`
para los números nacionales.

<!-- verify against released cli-core: phone records come from cli-core feat/phone-records, not merged yet. Owner ruling 2026-11-08: one account per phone, no sms: or calls: accounts -->

## Un ejemplo completo

Un cliente inventado, de principio a fin. Un ERP llamado `example-erp`, cuenta `demo`, envía la organización del
cliente con su número fiscal, una persona con su e-mail que trabaja allí, un pipeline de ventas, una negociación con
esa persona como quien decide, un servicio, un contrato con valor, un pedido de venta con una línea de ese servicio,
una factura bajo el contrato, el pago que la salda y un presupuesto, un objeto que WireCat no modela, vinculado a la
negociación.

### El archivo

`erp.jsonl`, un registro por línea:

```json
{"schema_version": 1, "options": {"lines": "products"}, "source": {"provider": "example-erp", "account": "demo", "batch_id": "2026-11-07"}}
{"key": "org", "type": "organization", "external_id": "C-1", "operation": "upsert", "revision": 1, "fields": {"name": "ООО Пример", "identifiers": [{"scheme": "tax-id:ru", "value": "7700000000"}]}}
{"key": "anna", "type": "person", "external_id": "P-1", "operation": "upsert", "fields": {"name": "Анна Образцова", "email": "anna@example.com"}, "relations": [{"role": "member-of", "type": "organization", "external_id": "C-1"}]}
{"key": "pipe", "type": "pipeline", "external_id": "sales", "operation": "upsert", "fields": {"kind": "deal", "name": "Sales", "stages": [{"external_id": "new", "name": "New", "position": 1, "outcome": "open"}, {"external_id": "won", "name": "Won", "position": 2, "outcome": "won"}]}}
{"key": "deal", "type": "deal", "external_id": "D-7", "operation": "upsert", "fields": {"title": "Rental fleet 2027", "pipeline": "sales", "stage": "new", "amount": "120000.00", "currency": "RUB"}, "relations": [{"role": "organization", "type": "organization", "external_id": "C-1"}, {"role": "person", "type": "person", "external_id": "P-1", "as": "decision-maker"}]}
{"key": "svc", "type": "product", "external_id": "SKU-RENT", "operation": "upsert", "fields": {"kind": "service", "name": "Bike rental, month", "unit": "month", "unit_price": "10000.00", "currency": "RUB"}}
{"key": "contract", "type": "contract", "external_id": "K-2026-14", "operation": "upsert", "fields": {"name": "Rental agreement", "kind": "service", "status": "active", "effective_date": "2026-11-01", "expiration_date": "2027-10-31", "auto_renew": true, "notice_days": 30, "value": "120000.00", "currency": "RUB"}, "relations": [{"role": "party", "type": "organization", "external_id": "C-1", "as": "customer"}, {"role": "deal", "type": "deal", "external_id": "D-7"}]}
{"key": "order", "type": "order", "external_id": "O-55", "operation": "upsert", "fields": {"number": "O-55", "direction": "sale", "purpose": "business", "order_date": "2026-11-02", "currency": "RUB", "lines": [{"product": "SKU-RENT", "quantity": "12", "unit_price": "10000.00"}]}, "relations": [{"role": "customer", "type": "organization", "external_id": "C-1"}, {"role": "contract", "type": "contract", "external_id": "K-2026-14"}]}
{"key": "inv", "type": "invoice", "external_id": "INV-901", "operation": "upsert", "fields": {"direction": "receivable", "number": "901", "currency": "RUB", "issue_date": "2026-11-03", "due_date": "2026-11-17", "lines": [{"product": "SKU-RENT", "description": "Rental, November", "quantity": "1", "unit_price": "10000.00", "amount": "10000.00"}]}, "relations": [{"role": "counterparty", "type": "organization", "external_id": "C-1"}, {"role": "contract", "type": "contract", "external_id": "K-2026-14"}]}
{"key": "pay", "type": "payment", "external_id": "PAY-3", "operation": "upsert", "fields": {"direction": "in", "amount": "10000.00", "currency": "RUB", "date": "2026-11-05"}, "relations": [{"role": "payer", "type": "organization", "external_id": "C-1"}, {"role": "settles", "type": "invoice", "external_id": "INV-901", "amount": "10000.00"}]}
{"key": "quote", "type": "custom:quote", "external_id": "Q-7", "operation": "upsert", "fields": {"valid_until": "2026-11-30", "options": [{"bikes": 12, "insurance": {"kind": "full"}}]}, "relations": [{"role": "quoted-for", "type": "deal", "external_id": "D-7"}]}
```

El mismo archivo viene con cli-core como `@wirecat/cli-core/schemas/examples/records-business.jsonl`.

### Importarlo como desarrollador

Revisa primero el archivo y luego impórtalo. `--account` nombra la fuente como `<provider>:<account>`:

<!-- verify against released memo -->

```sh
memo records check erp.jsonl --account example-erp:demo --json
memo records import erp.jsonl --account example-erp:demo --json
```

El recibo de la primera importación:

```json
{
  "dryRun": false,
  "source": { "provider": "example-erp", "account": "demo", "batchId": "2026-11-07" },
  "created": 10,
  "updated": 0,
  "unchanged": 0,
  "deleted": 0,
  "refused": 0,
  "proposed": ["contract:1", "order:1", "invoice:1", "payment:1"],
  "waiting": [],
  "flagged": [],
  "unmatched": [],
  "errors": [],
  "truncated": false
}
```

<!-- verify against released memo: the receipt above is what cli-core's ingestLines returns. memo's --json output may wrap it -->

Qué pasó:

- Se crearon la organización y Anna, porque el almacén no tenía ese número fiscal ni ese e-mail.
- Se escribieron el pipeline, la negociación y el servicio.
- El contrato, el pedido, la factura y el pago son propuestas, y el pago está asignado a la factura.
- El presupuesto se guarda como registro, y su vínculo `quoted-for` apunta al registro de la negociación.

Ejecuta otra vez la misma importación y cada registro queda `unchanged`: `created: 0`, `unchanged: 10`, `proposed: []`.

### Importar desde tu propia herramienta de línea de comandos

Tu herramienta puede enviar los mismos registros sin memo. Abre el almacén, pasa las líneas y muestra el recibo:

```ts
import { createReadStream } from "node:fs"
import { ingestLines, jsonlLines } from "@wirecat/cli-core/services"
import { openStore } from "@wirecat/cli-core/store"

const store = await openStore()
const input = process.argv[2] === "-" ? process.stdin : createReadStream(process.argv[2])
const receipt = await ingestLines(store, jsonlLines(input), {
  account: "demo",
  onIssue: (error) => console.error(error.pointer, error.code, error.message),
})
console.log(JSON.stringify(receipt))
```

<!-- verify against released cli-core: jsonlLines is the new name of linesOf -->

- `account` es el `source.account` del sobre. Otro valor se rechaza con `envelope.account-mismatch`.
- `onIssue` recibe cada rechazo en el momento, también los que pasan de los primeros 1000 del recibo.
- `dryRun: true` revisa y no escribe nada. `chunk` cambia los 1000 registros por transacción.
- Para un sobre que ya tienes como un objeto JSON, llama a `ingest(store, envelope, { account })`.

### Lo que ve un agente

Un agente no necesita conocer tu ERP. Le pregunta a memo. Primero qué espera al propietario, luego la negociación, el
contrato, el registro propio y una búsqueda en los registros de negocio:

<!-- verify against released memo -->

```sh
memo review list kind:invoice,payment,order,contract --json
memo organizations context organization:1
memo deals show deal:1 --json
memo contracts show contract:1 --json
memo orders show order:1 --json
memo invoices show invoice:1 --json
memo records list type:custom:quote --account example-erp:demo --json
memo records show custom:quote:Q-7 --account example-erp:demo --json
memo search all "Rental agreement" --only business --json
```

- `review list` muestra las cuatro propuestas. El propietario las confirma, y solo entonces cuentan en los totales.
- `deals show` da la negociación con su organización, Anna como quien decide, y sus registros de origen, entre ellos
  el presupuesto.
- `contracts show` da las fechas, el valor, el plazo de aviso (30 días antes del 31 de octubre de 2027) y la
  negociación que cerró.
- `records show` da los campos del presupuesto tal como llegaron, con el JSON anidado, y su vínculo con la
  negociación.
- `search all --only business` busca en los títulos de facturas, pagos, pedidos, contratos, suscripciones, productos y
  cuentas. Cada resultado nombra la fuente de la que vino. Las transacciones bancarias y los registros propios no
  están, se encuentran con `transactions list` y `records list`.

## Siguiente

Para traer un servicio entero de forma periódica, con inicio de sesión y sincronización, sigue
[Añadir una fuente](./build-concepts.md#añadir-una-fuente).
