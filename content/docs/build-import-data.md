---
title: "Import business data"
description: "One JSON format brings customers, deals, contracts, orders, invoices, payments, bank data, phone data and a source's own objects into the store, with the rules that decide what waits for the owner."
---

You have business data in another system: an ERP, a CRM export, a bank statement, a spreadsheet or a phone backup. You
want it in the owner's local store, so their AI agent can answer "what does this customer owe, under which contract,
and was it paid" with references instead of guesses. This page gives you the one format every import uses, the rules
it follows, and one complete example from the file to the agent's answers.

A few words first. The **records envelope** is that format: a JSON document, or JSONL with one record per line. Each
item in it is a **source record**, what your source says about one thing. cli-core turns a source record into an
**entity** (a person, a deal, a contract) or into a **proposal**: money that counts only after the owner confirms it.
The [concepts page](./build-concepts.md) explains entities and source records in more detail.

## Who this page is for

- You build a command-line tool on WireCat and your service has business records.
- You write a one-off script that moves an export into the store.
- You are an AI agent asked to import a file, or to find what an import brought in.

## One format, three ways in

Every import reads the same envelope, `schema_version: 1`, described by the
[JSON Schema](https://github.com/WireCatLabs/cli-core/blob/main/schemas/records-envelope.v1.schema.json).
It reaches the store in one of three ways:

- **A file**, JSON or JSONL, read by `records import` in the memo tool.
- **Standard input**, the same command with `-` in place of the file name, so another program can pipe into it.
- **From your own code**, with `ingest` or `ingestLines` from `@wirecat/cli-core/services`.

A JSON envelope has `schema_version`, `source` and `records`. In JSONL, the first non-empty line holds
`schema_version`, `source` and the optional `options`, and each further line is one record. JSONL is read line by line
and written every 1000 records, so a file of any length never sits in memory whole.

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

- `source.provider` names your system and `source.account` the account in it. Together they are the account the
  records belong to. Records never match across accounts.
- A record has a `key` (unique in the file, the receipt cites it), a `type`, the source's own id in `external_id`, an
  `operation` (`upsert` or `delete`), its `fields` (at most 64 KiB), an optional `revision`, and at most 100
  `relations`.
- `options.lines` set to `products` reads a line's `product` as the external id of a product record. The default,
  `text`, keeps it as plain data on an invoice line. Order lines always read it as a product.
- `options.phone_region`, a two-letter country such as `GB`, is the country a person's phone without `+` is read in.

## Choose a type

Pick the type in this order:

1. **A type WireCat already has.** If your object is a customer, a deal, a contract or a payment, send it as that
   type, even when your system calls it something else. Then every tool and every agent reads it the same way.
2. **`custom:<name>`** for an object WireCat does not model, such as a quote, a ticket or a delivery slot. It is kept
   as you sent it, nested JSON included, with its relations. It never becomes an entity, and nothing reads money from
   it.
3. **A new core entity** only when an owner's question needs rules of its own, such as a total, a status or a
   matching rule. That is a cli-core change, not a table in your tool. Open an issue in
   [cli-core](https://github.com/WireCatLabs/cli-core/issues) first.

An unknown type is refused with `record.type`. It is never turned into a custom record by itself, so a typo in a type
name shows up in the receipt instead of hiding in the store. `task` is refused too: tasks have their own source rules.

## The types

An import never writes confirmed money. Everything that feeds a money total arrives as a proposal, and only the owner
confirms or rejects it in memo's review list. The rest is written directly.

| Type | What it becomes | Proposal |
| --- | --- | --- |
| `person` | a person, matched or made (see [matching](#how-people-organizations-and-projects-are-matched)) | no |
| `organization` | an organization, matched or made | no |
| `project` | a project, matched by its key or made | no |
| `product` | a product or service with its price, in the catalogue | no |
| `pipeline` | a sales pipeline with its `stages` | no |
| `deal`, `lead` | a deal or lead, the same row a CRM sync writes | no |
| `contract` | a contract, with dates, renewal and notice terms | yes, when it has a value. Without one, written |
| `order` | an order with its `lines` | yes |
| `invoice` | an invoice with its `lines` | yes |
| `payment` | a payment, its share of each invoice it `settles`, or a refund | yes |
| `subscription` | a subscription with its `prices`, never overwritten | yes |
| `wallet` | a bank account, card or cash account | no. Its opening balance stays in the record until the owner sets it |
| `transaction` | one line of a bank statement, with its `splits` | yes |
| `message` with `kind: "sms"` | an SMS in a chat (see [phone data](#phone-data-sms-calls-and-contacts)) | no |
| `event` with `kind: "call"` | a call, as an event | no |
| `custom:<name>` | a record only, kept as sent | no |

Each type's known `fields` are typed in the schema. Any other key is kept as sent. Money is a decimal string, such as
`"10000.00"`, with its `currency` beside it.

## Relations

A record points at other records with `relations`. Each relation has a `role` and a target:

- **Another record of the same account:** `{ "role": "counterparty", "type": "organization", "external_id": "C-1" }`.
- **An entity already in the store**, by its typed reference: `{ "role": "counterparty", "ref": "organization:12" }`.

The type decides which roles it knows. An invoice has `issuer`, `counterparty`, `project`, `contract` and
`subscription`. A payment has `payer`, `payee`, `settles` (with an `amount`, its share of that invoice) and
`refund_of`. A deal has `organization`, `person` and `project`. A role taken once, such as an invoice's
`counterparty`, is refused when it names two different targets (`record.relation-ambiguous`).

- **`as`** says what part a person or organization plays, such as `"as": "decision-maker"` on a deal's `person` or
  `"as": "customer"` on a contract's `party`.
- **A role the type does not list** is your source's own word, such as `quoted-for` or `parent-ticket`. It is kept as
  you sent it and resolved record to record, and never turned into anything else.
- **A target that is not there yet** keeps the record **waiting**. A payment that settles an invoice you send
  tomorrow waits, and it is written when the invoice arrives, in this run or a later one. The receipt names the
  missing role.

## How people, organizations and projects are matched

A person, organization or project record links to an entity the store already has only by a strong identifier.
Never by name.

| Type | Strong identifiers |
| --- | --- |
| `person` | `fields.email` and `fields.phone` (one or a list), and your source's own contact id |
| `organization` | `fields.identifiers`: `{ "scheme": "tax-id:ru", "value": "7700000000" }`, with scheme `email`, `domain`, `tax-id:<country>` or `registration:<country>` |
| `project` | `fields.key` |

- **Exactly one entity matches:** the record links to it, and the import adds nothing to that entity.
- **Two or more match:** nothing is made and nothing is linked. The record waits for the owner, listed under
  `unmatched` in the receipt with its `candidates`. Only the owner says which one it is. An agent can only report it.
- **Nothing matches:** the import makes a new entity, marks it as made by the import, and gives it the record's
  identifiers.

An e-mail is compared trimmed and in lower case. A phone number is compared in its international form, such as
`+447700900123`. A number written without `+` or `00` is read only with a region: the envelope's
`options.phone_region`, or else the store's `phone_countries` setting when exactly one of its countries reads the
number as valid. Without one, it is no identifier. The receipt lists it under `ignored` (`record.phone-region`), and the
record makes a new person instead of matching. Send numbers with `+` when you have them.

A free-mail domain such as `gmail.com` is refused as an organization's `domain` (`record.identifier`).

## Revisions, repeats and deletes

- **Repeats change nothing.** The same file twice gives `unchanged` for every record. The same fields and relations in
  another order count as the same record.
- **Revisions only go up.** Once a record has a `revision`, every later version sends one. A lower revision, or the
  same revision with other content, is refused with `record.stale-revision`.
- **A changed record** updates what was written directly. A proposal the import made is updated while it still waits
  for the owner. Once the owner has decided, the change is only **flagged** in the receipt, and the owner's decision
  stays. Invoices are always flagged, as in the first version of the format.
- **Deletes are soft.** `"operation": "delete"` marks the record as deleted. Its entity stays and is listed under
  `flagged`, so the owner decides what to do with it. A custom record has no entity, so nothing is flagged.

## The receipt and errors

`ingest` and `ingestLines` return this receipt. With `--json`, `records import` and `records check` print it under
`item`, with the names in snake case: `dry_run` and `batch_id`.

| Member | What it holds |
| --- | --- |
| `dryRun` | `true` when nothing was written |
| `source` | the provider, account and `batchId` |
| `created`, `updated`, `unchanged`, `deleted`, `refused` | exact counts |
| `proposed` | the proposals made or changed, such as `invoice:1` |
| `waiting` | records with a missing target: `key`, `pointer`, `missing` roles |
| `unmatched` | records with two or more candidates: `key`, `pointer`, `reason`, `candidates` |
| `ignored` | values that look like an identifier and were kept as data only: `key`, `pointer`, `reason` |
| `flagged` | changed or deleted records whose entity was left alone |
| `errors` | refusals: `pointer`, `code`, `message`, `key` |
| `truncated` | `true` when a list stopped at 1000 entries. The counts stay exact |

The `pointer` is a JSON pointer into the envelope, such as `/records/0/type`, so your tool can show the exact place.
One bad record is refused and the rest are written. An error in the envelope itself (`envelope.invalid`,
`envelope.schema-version`, `envelope.account-mismatch`) takes no record at all.

Here is a receipt for a file with an unknown type and a payment whose invoice has not arrived yet:

```json
{
  "dryRun": false,
  "source": { "provider": "example-erp", "account": "demo2", "batchId": "b2" },
  "created": 1,
  "updated": 0,
  "unchanged": 0,
  "deleted": 0,
  "refused": 1,
  "proposed": [],
  "waiting": [{ "key": "p", "pointer": "/records/1/relations", "missing": ["settles"] }],
  "flagged": [],
  "unmatched": [],
  "ignored": [],
  "errors": [
    {
      "pointer": "/records/0/type",
      "code": "record.type",
      "message": "a type is one of invoice, payment, person, organization, project, order, product, contract, subscription, wallet, transaction, deal, lead, message, event, pipeline or custom:<name>",
      "key": "t"
    }
  ],
  "truncated": false
}
```

A **dry run** checks the whole file and writes nothing. Its receipt is the real one, references between records
included. It runs as one transaction that is rolled back at the end, so tg, max and memo wait for the store while it
runs. A real run commits every 1000 records. If it stops halfway, the records before stay written, and running it
again is safe.

## Phone data: SMS, calls and contacts

A phone export is one envelope of one phone, JSON or JSONL, imported under one account such as `phone:pixel`. The
records, the SMS and the calls all stay under that account, so an account group lists the phone once.

- An SMS is a `message` with `kind: "sms"`. It is written into one chat per thread, and search reads it like a
  messenger's messages.
- A call is an `event` with `kind: "call"`, kept in the phone account's own `Calls` calendar. It never counts as
  busy. `memo events list` shows it beside the meetings of every calendar account, by default from the last 30 days
  and the next 7. `memo events list event_type:call` keeps only the calls. To find a call by its number, use
  `memo search all "+447700900123" --only events`.
- The person on the other side is a `person` record that the source sends, one per number. The relation
  `counterpart` names it.

```json
{ "key": "sms-1", "type": "message", "external_id": "sms-1", "operation": "upsert",
  "fields": { "kind": "sms", "direction": "in", "phone": "+447700900123", "name": "Иван Петров",
              "body": "Буду в 10", "sent_at": "2026-11-01T09:12:00+01:00", "read": true },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
{ "key": "call-1", "type": "event", "external_id": "call-1", "operation": "upsert",
  "fields": { "kind": "call", "direction": "missed", "phone": "+447700900123", "started_at": "2026-11-01T10:00:00Z",
              "duration": 0 },
  "relations": [{ "role": "counterpart", "type": "person", "external_id": "+447700900123" }] }
```

An SMS or a call links to a person only through that person record. The person record is matched as any person is:
one exact number links, none makes a person, two or more leave the SMS or call waiting for the owner. A record with
no `counterpart` keeps only the number.

A contacts file in vCard format (`.vcf`) is converted to the same envelope. memo imports it into the phone's account:

```sh
memo records import contacts.vcf --account phone:pixel --json
```

From your own code, `ingestVcard` in `@wirecat/cli-core/services` reads it and imports it in one call, with a `region`
in lower case, such as `gb`, for national numbers. Without a region, a national number is kept but not matched, and the receipt's `vcard` list
says so.

## A complete example

One synthetic customer, end to end. An ERP called `example-erp`, account `demo`, sends a customer organization known
by its tax id, a person known by e-mail who works there, a sales pipeline, a deal with that person as decision-maker,
a service, a contract with a value, a sale order with one line of that service, an invoice under the contract, the
payment that settles it, and a quote, an object WireCat does not model, related to the deal.

### The file

`erp.jsonl`, one record per line:

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

The same file ships with cli-core as `@wirecat/cli-core/schemas/examples/records-business.jsonl`.

### Import it as a developer

Check the file first, then import it. `--account` names the source as `<provider>:<account>`:

```sh
memo records check erp.jsonl --account example-erp:demo --json
memo records import erp.jsonl --account example-erp:demo --json
```

The receipt of the first import:

```json
{
  "item": {
    "dry_run": false,
    "source": { "provider": "example-erp", "account": "demo", "batch_id": "2026-11-07" },
    "created": 10,
    "updated": 0,
    "unchanged": 0,
    "deleted": 0,
    "refused": 0,
    "proposed": ["contract:1", "order:1", "invoice:1", "payment:1"],
    "waiting": [],
    "flagged": [],
    "unmatched": [],
    "ignored": [],
    "errors": [],
    "truncated": false
  },
  "meta": { "run_id": "20261108T181443Z-process-620b48", "duration_ms": 42, "complete": true }
}
```

What happened:

- The organization and Anna were made, since nothing in the store had that tax id or that e-mail.
- The pipeline, the deal and the service were written.
- The contract, order, invoice and payment are proposals, and the payment is allocated to the invoice.
- The quote is kept as a record, and its `quoted-for` relation points at the deal's record.

Run the same import again and every record is `unchanged`: `created: 0`, `unchanged: 10`, `proposed: []`.

### Import from your own command-line tool

Your tool can send the same records without memo. Open the store, pass the lines, and show the receipt:

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

- `account` is the envelope's `source.account`. Another value is refused with `envelope.account-mismatch`.
- `onIssue` gets every refusal as it happens, also those past the receipt's first 1000.
- `dryRun: true` checks and writes nothing. `chunk` changes the 1000 records per transaction.
- For an envelope you already hold as one JSON object, call `ingest(store, envelope, { account })`.

### What an agent sees

An agent needs no knowledge of your ERP. It asks memo. First what waits for the owner, then the deal, the contract,
the custom record and a search across business records:

<!-- verify against released cli-core: needs cli-core #2668 (import relationships). organizations context lists no people yet, deals show has people: [] instead of Anna as decision-maker, and contracts show names no parties. The rest of this block is verified on the released memo -->

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

- `review list` shows the four proposals. The owner confirms them, and only then do they count in totals.
- `deals show` gives the deal with its organization, Anna as decision-maker, and its source records, the quote among
  them.
- `contracts show` gives the dates, the value, the notice deadline (1 October 2027, 30 days before 31 October 2027) and the deal it
  closed.
- `records show` gives the quote's fields as they were sent, nested JSON included, and its relation to the deal.
- `search all --only business` searches the titles of invoices, payments, orders, contracts, subscriptions, products
  and wallets. Each hit names the source it came from. Bank transactions and custom records are not in it, so reach
  them with `transactions list` and `records list`.

## Next

To bring a whole service in on a schedule, with sign-in and sync, follow [Add a source](./build-concepts.md#add-a-source).
