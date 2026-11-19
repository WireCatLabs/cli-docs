---
title: "Comandos de attio"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Busca cualquier comando de `attio`, sus opciones y lo que responde, con la seguridad de que coincide con tu versión:
esta página se genera a partir del propio programa.

Tu agente de IA lee la misma lista en JSON con `attio commands --json` y elige allí un comando y sus opciones. Cada
código de salida indica un tipo de fallo, así que un script o un agente sabe qué salió mal. Las descripciones
conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `attio personal config show`. `WCATTIO_PROFILE`
hace lo mismo para toda una sesión de la terminal. Nunca se da un perfil por supuesto: un comando que usa una cuenta
se detiene si no lo tiene y muestra los perfiles de este ordenador.

**En esta página:**

1. [Opciones para todos los comandos](#options-for-every-command)
2. [Negociaciones](#attio-deals)
3. [Embudos](#attio-pipelines)
4. [Personas](#attio-people)
5. [Empresas](#attio-organizations)
6. [Qué cambió](#attio-changes)
7. [La API](#attio-api)
8. [Códigos de salida](#exit-codes)

## Opciones para todos los comandos

| Option | What it does |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Default: `0`. |
| `--json` | machine-readable output: one JSON value on stdout; --json=id,text keeps only those fields. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off; a failure is still said. |
| `--trace` | the connection's own log lines on stderr — never content. |
| `--debug` | on a failure, its whole record — cause and stack — in place of the short line. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | never prompt or open interactive login; piped input remains available. |
| `--max-input-bytes <bytes>` | maximum buffered input bytes (default: 16777216). |
| `--max-output-bytes <bytes>` | maximum machine output bytes (default: 4194304; 0 disables). |
| `--brief` | found items as reference, title, time, author and excerpt only. |
| `--full` | found items with their whole text and every provider field. |
| `--compact` | one line per item for an agent: reference first, text last, paging and next steps as # lines. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `attio commands`

every command by section; --json prints its contract, one path per call

### `attio commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
attio commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `attio commands info commands`

## `attio session`

keep this profile's Attio token in the OS keyring

### `attio session start`

sign this profile in: the Attio API token is asked hidden or read from stdin, never taken as an argument, checked with Attio, and only then kept in the keyring, or in a private file

**Changes something on this computer only.**

```sh
attio session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `attio personal session start`, `attio personal session start --credential-storage file`

### `attio session status`

show where this profile's token comes from: WCATTIO_TOKEN, the keyring or a file, never the token; --check asks Attio whose token it is

```sh
attio session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Attio whether the token still works, and whose it is. |

**Example:** `attio personal session status`, `attio personal session status --check --json`

### `attio session end`

forget this profile's token on this computer; the token itself stays valid in Attio

**Changes something on this computer only.**

```sh
attio session end
```

**Example:** `attio personal session end`

### `attio session list`

list the profiles on this computer and whether each has a token; picks none

```sh
attio session list
```

**Example:** `attio session list`, `attio session list --json`

## `attio api`

the raw Attio API, one command per operation of its OpenAPI document

### `attio api list`

list every Attio API operation this CLI offers, without calling Attio

```sh
attio api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `attio personal api list`, `attio personal api list effect:destructive --json=command,path`

### `attio api show`

show one operation's parameters and request schema, without calling Attio

```sh
attio api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `attio personal api show "objects-list" --json`

### `attio api objects-list`

List objects — read (GET /v2/objects)

```sh
attio api objects-list
```

**Example:** `attio personal api objects-list`

### `attio api objects-create`

Create an object — write (POST /v2/objects)

**Changes something in the service.**

```sh
attio api objects-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-create`

### `attio api objects-get`

Get an object — read (GET /v2/objects/{object})

```sh
attio api objects-get [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |

**Example:** `attio personal api objects-get --object <value>`

### `attio api objects-update`

Update an object — write (PATCH /v2/objects/{object})

**Changes something in the service.**

```sh
attio api objects-update [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-update --object <value>`

### `attio api objects-delete`

Delete an object — destructive (DELETE /v2/objects/{object})

**Changes something in the service.**

```sh
attio api objects-delete [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |

**Example:** `attio personal api objects-delete --object <value>`

### `attio api objects-views-list`

List views for object — read (GET /v2/objects/{object}/views)

```sh
attio api objects-views-list [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--show-archived <value>` | show_archived. |
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api objects-views-list --object <value>`

### `attio api objects-views-create`

Create an object view — write (POST /v2/objects/{object}/views)

**Changes something in the service.**

```sh
attio api objects-views-create [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-views-create --object <value>`

### `attio api objects-views-get`

Get an object view — read (GET /v2/objects/{object}/views/{view_id})

```sh
attio api objects-views-get [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--view-id <value>` | view_id. |

**Example:** `attio personal api objects-views-get --object <value> --view-id <value>`

### `attio api objects-views-update`

Update an object view — write (PATCH /v2/objects/{object}/views/{view_id})

**Changes something in the service.**

```sh
attio api objects-views-update [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--view-id <value>` | view_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-views-update --object <value> --view-id <value>`

### `attio api objects-views-delete`

Delete an object view — destructive (DELETE /v2/objects/{object}/views/{view_id})

**Changes something in the service.**

```sh
attio api objects-views-delete [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--view-id <value>` | view_id. |

**Example:** `attio personal api objects-views-delete --object <value> --view-id <value>`

### `attio api activities-list`

List activities — read (GET /v2/activities)

```sh
attio api activities-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api activities-list`

### `attio api activities-create`

Create an activity — write (POST /v2/activities)

**Changes something in the service.**

```sh
attio api activities-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-create`

### `attio api activities-get`

Get an activity — read (GET /v2/activities/{activity})

```sh
attio api activities-get [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |

**Example:** `attio personal api activities-get --activity <value>`

### `attio api activities-update`

Update an activity — write (PATCH /v2/activities/{activity})

**Changes something in the service.**

```sh
attio api activities-update [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-update --activity <value>`

### `attio api activities-delete`

Delete an activity — destructive (DELETE /v2/activities/{activity})

**Changes something in the service.**

```sh
attio api activities-delete [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |

**Example:** `attio personal api activities-delete --activity <value>`

### `attio api attributes-list`

List attributes — read (GET /v2/{target}/{identifier}/attributes)

```sh
attio api attributes-list [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--show-archived <value>` | show_archived. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api attributes-list --target <value> --identifier <value>`

### `attio api attributes-create`

Create an attribute — write (POST /v2/{target}/{identifier}/attributes)

**Changes something in the service.**

```sh
attio api attributes-create [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-create --target <value> --identifier <value>`

### `attio api attributes-get`

Get an attribute — read (GET /v2/{target}/{identifier}/attributes/{attribute})

```sh
attio api attributes-get [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |

**Example:** `attio personal api attributes-get --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-update`

Update an attribute — write (PATCH /v2/{target}/{identifier}/attributes/{attribute})

**Changes something in the service.**

```sh
attio api attributes-update [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-update --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-options-list`

List select options — read (GET /v2/{target}/{identifier}/attributes/{attribute}/options)

```sh
attio api attributes-options-list [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--show-archived <value>` | show_archived. |

**Example:** `attio personal api attributes-options-list --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-options-create`

Create a select option — write (POST /v2/{target}/{identifier}/attributes/{attribute}/options)

**Changes something in the service.**

```sh
attio api attributes-options-create [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-options-create --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-options-update`

Update a select option — write (PATCH /v2/{target}/{identifier}/attributes/{attribute}/options/{option})

**Changes something in the service.**

```sh
attio api attributes-options-update [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--option <value>` | option. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-options-update --target <value> --identifier <value> --attribute <value> --option <value>`

### `attio api attributes-statuses-list`

List statuses — read (GET /v2/{target}/{identifier}/attributes/{attribute}/statuses)

```sh
attio api attributes-statuses-list [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--show-archived <value>` | show_archived. |

**Example:** `attio personal api attributes-statuses-list --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-statuses-create`

Create a status — write (POST /v2/{target}/{identifier}/attributes/{attribute}/statuses)

**Changes something in the service.**

```sh
attio api attributes-statuses-create [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-statuses-create --target <value> --identifier <value> --attribute <value>`

### `attio api attributes-statuses-update`

Update a status — write (PATCH /v2/{target}/{identifier}/attributes/{attribute}/statuses/{status})

**Changes something in the service.**

```sh
attio api attributes-statuses-update [options]
```

| Option | What it does |
|---|---|
| `--target <value>` | target. |
| `--identifier <value>` | identifier. |
| `--attribute <value>` | attribute. |
| `--status <value>` | status. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api attributes-statuses-update --target <value> --identifier <value> --attribute <value> --status <value>`

### `attio api objects-records-query`

List records — read (POST /v2/objects/{object}/records/query)

```sh
attio api objects-records-query [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api objects-records-query --object <value>`

### `attio api objects-records-create`

Create a record — write (POST /v2/objects/{object}/records)

**Changes something in the service.**

```sh
attio api objects-records-create [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-create --object <value>`

### `attio api objects-records-upsert`

Upsert a record — write (PUT /v2/objects/{object}/records)

**Changes something in the service.**

```sh
attio api objects-records-upsert [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--matching-attribute <value>` | matching_attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-upsert --object <value> --matching-attribute <value>`

### `attio api objects-records-get`

Get a record — read (GET /v2/objects/{object}/records/{record_id})

```sh
attio api objects-records-get [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |

**Example:** `attio personal api objects-records-get --object <value> --record-id <value>`

### `attio api objects-records-replace`

Update a record (overwrite multiselect values) — write (PUT /v2/objects/{object}/records/{record_id})

**Changes something in the service.**

```sh
attio api objects-records-replace [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-replace --object <value> --record-id <value>`

### `attio api objects-records-update`

Update a record (append multiselect values) — write (PATCH /v2/objects/{object}/records/{record_id})

**Changes something in the service.**

```sh
attio api objects-records-update [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-update --object <value> --record-id <value>`

### `attio api objects-records-delete`

Delete a record — destructive (DELETE /v2/objects/{object}/records/{record_id})

**Changes something in the service.**

```sh
attio api objects-records-delete [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |

**Example:** `attio personal api objects-records-delete --object <value> --record-id <value>`

### `attio api objects-records-merge`

Merge two records — write (POST /v2/objects/{object}/records/merge)

**Changes something in the service.**

```sh
attio api objects-records-merge [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-merge --object <value>`

### `attio api objects-records-attributes-values-list`

List record attribute values — read (GET /v2/objects/{object}/records/{record_id}/attributes/{attribute}/values)

```sh
attio api objects-records-attributes-values-list [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--attribute <value>` | attribute. |
| `--show-historic <value>` | show_historic. |
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api objects-records-attributes-values-list --object <value> --record-id <value> --attribute <value>`

### `attio api objects-records-attributes-values-replace`

Write record attribute values — write (PUT /v2/objects/{object}/records/{record_id}/attributes/{attribute}/values)

**Changes something in the service.**

```sh
attio api objects-records-attributes-values-replace [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--attribute <value>` | attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-attributes-values-replace --object <value> --record-id <value> --attribute <value>`

### `attio api objects-records-entries-list`

List record entries — read (GET /v2/objects/{object}/records/{record_id}/entries)

```sh
attio api objects-records-entries-list [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api objects-records-entries-list --object <value> --record-id <value>`

### `attio api objects-records-search`

Search records — read (POST /v2/objects/records/search)

```sh
attio api objects-records-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api objects-records-search`

### `attio api activities-records-query`

List activity records — read (POST /v2/activities/{activity}/records/query)

```sh
attio api activities-records-query [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api activities-records-query --activity <value>`

### `attio api activities-records-create`

Create an activity record — write (POST /v2/activities/{activity}/records)

**Changes something in the service.**

```sh
attio api activities-records-create [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-records-create --activity <value>`

### `attio api activities-records-upsert`

Upsert an activity record — write (PUT /v2/activities/{activity}/records)

**Changes something in the service.**

```sh
attio api activities-records-upsert [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--matching-attribute <value>` | matching_attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-records-upsert --activity <value> --matching-attribute <value>`

### `attio api activities-records-get`

Get an activity record — read (GET /v2/activities/{activity}/records/{record_id})

```sh
attio api activities-records-get [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--record-id <value>` | record_id. |

**Example:** `attio personal api activities-records-get --activity <value> --record-id <value>`

### `attio api activities-records-replace`

Update an activity record (overwrite multiselect values) — write (PUT /v2/activities/{activity}/records/{record_id})

**Changes something in the service.**

```sh
attio api activities-records-replace [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--record-id <value>` | record_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-records-replace --activity <value> --record-id <value>`

### `attio api activities-records-update`

Update an activity record (append multiselect values) — write (PATCH /v2/activities/{activity}/records/{record_id})

**Changes something in the service.**

```sh
attio api activities-records-update [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--record-id <value>` | record_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api activities-records-update --activity <value> --record-id <value>`

### `attio api activities-records-delete`

Delete an activity record — destructive (DELETE /v2/activities/{activity}/records/{record_id})

**Changes something in the service.**

```sh
attio api activities-records-delete [options]
```

| Option | What it does |
|---|---|
| `--activity <value>` | activity. |
| `--record-id <value>` | record_id. |

**Example:** `attio personal api activities-records-delete --activity <value> --record-id <value>`

### `attio api sql`

Query SQL — write (POST /v2/sql)

**Changes something in the service.**

```sh
attio api sql [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api sql`

### `attio api lists-list`

List all lists — read (GET /v2/lists)

```sh
attio api lists-list
```

**Example:** `attio personal api lists-list`

### `attio api lists-create`

Create a list — write (POST /v2/lists)

**Changes something in the service.**

```sh
attio api lists-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-create`

### `attio api lists-get`

Get a list — read (GET /v2/lists/{list})

```sh
attio api lists-get [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |

**Example:** `attio personal api lists-get --list <value>`

### `attio api lists-update`

Update a list — write (PATCH /v2/lists/{list})

**Changes something in the service.**

```sh
attio api lists-update [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-update --list <value>`

### `attio api lists-views-list`

List views for list — read (GET /v2/lists/{list}/views)

```sh
attio api lists-views-list [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--show-archived <value>` | show_archived. |
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api lists-views-list --list <value>`

### `attio api lists-views-create`

Create a list view — write (POST /v2/lists/{list}/views)

**Changes something in the service.**

```sh
attio api lists-views-create [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-views-create --list <value>`

### `attio api lists-views-get`

Get a list view — read (GET /v2/lists/{list}/views/{view_id})

```sh
attio api lists-views-get [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--view-id <value>` | view_id. |

**Example:** `attio personal api lists-views-get --list <value> --view-id <value>`

### `attio api lists-views-update`

Update a list view — write (PATCH /v2/lists/{list}/views/{view_id})

**Changes something in the service.**

```sh
attio api lists-views-update [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--view-id <value>` | view_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-views-update --list <value> --view-id <value>`

### `attio api lists-views-delete`

Delete a list view — destructive (DELETE /v2/lists/{list}/views/{view_id})

**Changes something in the service.**

```sh
attio api lists-views-delete [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--view-id <value>` | view_id. |

**Example:** `attio personal api lists-views-delete --list <value> --view-id <value>`

### `attio api lists-entries-query`

List entries — read (POST /v2/lists/{list}/entries/query)

```sh
attio api lists-entries-query [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api lists-entries-query --list <value>`

### `attio api lists-entries-create`

Create an entry (add record to list) — write (POST /v2/lists/{list}/entries)

**Changes something in the service.**

```sh
attio api lists-entries-create [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-entries-create --list <value>`

### `attio api lists-entries-upsert`

Upsert a list entry by parent — write (PUT /v2/lists/{list}/entries)

**Changes something in the service.**

```sh
attio api lists-entries-upsert [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-entries-upsert --list <value>`

### `attio api lists-entries-get`

Get a list entry — read (GET /v2/lists/{list}/entries/{entry_id})

```sh
attio api lists-entries-get [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |

**Example:** `attio personal api lists-entries-get --list <value> --entry-id <value>`

### `attio api lists-entries-replace`

Update a list entry (overwrite multiselect values) — write (PUT /v2/lists/{list}/entries/{entry_id})

**Changes something in the service.**

```sh
attio api lists-entries-replace [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-entries-replace --list <value> --entry-id <value>`

### `attio api lists-entries-update`

Update a list entry (append multiselect values) — write (PATCH /v2/lists/{list}/entries/{entry_id})

**Changes something in the service.**

```sh
attio api lists-entries-update [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-entries-update --list <value> --entry-id <value>`

### `attio api lists-entries-delete`

Delete a list entry — destructive (DELETE /v2/lists/{list}/entries/{entry_id})

**Changes something in the service.**

```sh
attio api lists-entries-delete [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |

**Example:** `attio personal api lists-entries-delete --list <value> --entry-id <value>`

### `attio api lists-entries-attributes-values-list`

List attribute values for a list entry — read (GET /v2/lists/{list}/entries/{entry_id}/attributes/{attribute}/values)

```sh
attio api lists-entries-attributes-values-list [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |
| `--attribute <value>` | attribute. |
| `--show-historic <value>` | show_historic. |
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api lists-entries-attributes-values-list --list <value> --entry-id <value> --attribute <value>`

### `attio api lists-entries-attributes-values-replace`

Write list entry attribute values — write (PUT /v2/lists/{list}/entries/{entry_id}/attributes/{attribute}/values)

**Changes something in the service.**

```sh
attio api lists-entries-attributes-values-replace [options]
```

| Option | What it does |
|---|---|
| `--list <value>` | list. |
| `--entry-id <value>` | entry_id. |
| `--attribute <value>` | attribute. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api lists-entries-attributes-values-replace --list <value> --entry-id <value> --attribute <value>`

### `attio api workspace-members-list`

List workspace members — read (GET /v2/workspace_members)

```sh
attio api workspace-members-list
```

**Example:** `attio personal api workspace-members-list`

### `attio api workspace-members-get`

Get a workspace member — read (GET /v2/workspace_members/{workspace_member_id})

```sh
attio api workspace-members-get [options]
```

| Option | What it does |
|---|---|
| `--workspace-member-id <value>` | workspace_member_id. |

**Example:** `attio personal api workspace-members-get --workspace-member-id <value>`

### `attio api notes-list`

List notes — read (GET /v2/notes)

```sh
attio api notes-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--parent-object <value>` | parent_object. |
| `--parent-record-id <value>` | parent_record_id. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api notes-list`

### `attio api notes-create`

Create a note — write (POST /v2/notes)

**Changes something in the service.**

```sh
attio api notes-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api notes-create`

### `attio api notes-get`

Get a note — read (GET /v2/notes/{note_id})

```sh
attio api notes-get [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | note_id. |

**Example:** `attio personal api notes-get --note-id <value>`

### `attio api notes-update`

Update a note — write (PATCH /v2/notes/{note_id})

**Changes something in the service.**

```sh
attio api notes-update [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | note_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api notes-update --note-id <value>`

### `attio api notes-delete`

Delete a note — destructive (DELETE /v2/notes/{note_id})

**Changes something in the service.**

```sh
attio api notes-delete [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | note_id. |

**Example:** `attio personal api notes-delete --note-id <value>`

### `attio api tasks-list`

List tasks — read (GET /v2/tasks)

```sh
attio api tasks-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--sort <value>` | sort. |
| `--linked-object <value>` | linked_object. |
| `--linked-record-id <value>` | linked_record_id. |
| `--assignee <value>` | assignee. |
| `--is-completed <value>` | is_completed. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api tasks-list`

### `attio api tasks-create`

Create a task — write (POST /v2/tasks)

**Changes something in the service.**

```sh
attio api tasks-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api tasks-create`

### `attio api tasks-get`

Get a task — read (GET /v2/tasks/{task_id})

```sh
attio api tasks-get [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | task_id. |

**Example:** `attio personal api tasks-get --task-id <value>`

### `attio api tasks-update`

Update a task — write (PATCH /v2/tasks/{task_id})

**Changes something in the service.**

```sh
attio api tasks-update [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | task_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api tasks-update --task-id <value>`

### `attio api tasks-delete`

Delete a task — destructive (DELETE /v2/tasks/{task_id})

**Changes something in the service.**

```sh
attio api tasks-delete [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | task_id. |

**Example:** `attio personal api tasks-delete --task-id <value>`

### `attio api threads-list`

List threads — read (GET /v2/threads)

```sh
attio api threads-list [options]
```

| Option | What it does |
|---|---|
| `--record-id <value>` | record_id. |
| `--object <value>` | object. |
| `--entry-id <value>` | entry_id. |
| `--list <value>` | list. |
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api threads-list`

### `attio api threads-get`

Get a thread and its comments — read (GET /v2/threads/{thread_id})

```sh
attio api threads-get [options]
```

| Option | What it does |
|---|---|
| `--thread-id <value>` | thread_id. |
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--created-after <value>` | created_after. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api threads-get --thread-id <value>`

### `attio api comments-create`

Create a comment — write (POST /v2/comments)

**Changes something in the service.**

```sh
attio api comments-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api comments-create`

### `attio api comments-get`

Get a comment — read (GET /v2/comments/{comment_id})

```sh
attio api comments-get [options]
```

| Option | What it does |
|---|---|
| `--comment-id <value>` | comment_id. |

**Example:** `attio personal api comments-get --comment-id <value>`

### `attio api comments-delete`

Delete a comment — destructive (DELETE /v2/comments/{comment_id})

**Changes something in the service.**

```sh
attio api comments-delete [options]
```

| Option | What it does |
|---|---|
| `--comment-id <value>` | comment_id. |

**Example:** `attio personal api comments-delete --comment-id <value>`

### `attio api emails-list`

List emails — read (GET /v2/emails)

```sh
attio api emails-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--linked-object <value>` | linked_object. |
| `--linked-record-ids <value>` | linked_record_ids. |
| `--participants <value>` | participants. |
| `--domain <value>` | domain. |
| `--sent-after <value>` | sent_after. |
| `--sent-before <value>` | sent_before. |
| `--exclude-automated-participants <value>` | exclude_automated_participants. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api emails-list`

### `attio api sequences-unsubscribed-emails`

Add emails to the unsubscribe list — write (POST /v2/sequences/unsubscribed_emails)

**Changes something in the service.**

```sh
attio api sequences-unsubscribed-emails [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api sequences-unsubscribed-emails`

### `attio api workspace-blocklist-addresses-list`

List workspace blocklist addresses — read (GET /v2/workspace_blocklist_addresses)

```sh
attio api workspace-blocklist-addresses-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api workspace-blocklist-addresses-list`

### `attio api workspace-blocklist-addresses-replace`

Add or update workspace blocklist addresses — write (PUT /v2/workspace_blocklist_addresses)

**Changes something in the service.**

```sh
attio api workspace-blocklist-addresses-replace [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api workspace-blocklist-addresses-replace`

### `attio api workspace-blocklist-addresses-delete`

Delete a workspace blocklist address — destructive (DELETE /v2/workspace_blocklist_addresses/{address})

**Changes something in the service.**

```sh
attio api workspace-blocklist-addresses-delete [options]
```

| Option | What it does |
|---|---|
| `--address <value>` | address. |

**Example:** `attio personal api workspace-blocklist-addresses-delete --address <value>`

### `attio api meetings-list`

List meetings — read (GET /v2/meetings)

```sh
attio api meetings-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--linked-object <value>` | linked_object. |
| `--linked-record-id <value>` | linked_record_id. |
| `--participants <value>` | participants. |
| `--sort <value>` | sort. |
| `--ends-from <value>` | ends_from. |
| `--starts-before <value>` | starts_before. |
| `--timezone <value>` | timezone. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api meetings-list`

### `attio api meetings-create`

Create a meeting — write (POST /v2/meetings)

**Changes something in the service.**

```sh
attio api meetings-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api meetings-create`

### `attio api meetings-get`

Get a meeting — read (GET /v2/meetings/{meeting_id})

```sh
attio api meetings-get [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |

**Example:** `attio personal api meetings-get --meeting-id <value>`

### `attio api meetings-replace`

Update a meeting (overwrite linked records) — write (PUT /v2/meetings/{meeting_id})

**Changes something in the service.**

```sh
attio api meetings-replace [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api meetings-replace --meeting-id <value>`

### `attio api meetings-update`

Update a meeting (append linked records) — write (PATCH /v2/meetings/{meeting_id})

**Changes something in the service.**

```sh
attio api meetings-update [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api meetings-update --meeting-id <value>`

### `attio api meetings-delete`

Delete a meeting — destructive (DELETE /v2/meetings/{meeting_id})

**Changes something in the service.**

```sh
attio api meetings-delete [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |

**Example:** `attio personal api meetings-delete --meeting-id <value>`

### `attio api meetings-call-recordings-list`

List call recordings — read (GET /v2/meetings/{meeting_id}/call_recordings)

```sh
attio api meetings-call-recordings-list [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api meetings-call-recordings-list --meeting-id <value>`

### `attio api meetings-call-recordings-create`

Create call recording — write (POST /v2/meetings/{meeting_id}/call_recordings)

**Changes something in the service.**

```sh
attio api meetings-call-recordings-create [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api meetings-call-recordings-create --meeting-id <value>`

### `attio api meetings-call-recordings-get`

Get call recording — read (GET /v2/meetings/{meeting_id}/call_recordings/{call_recording_id})

```sh
attio api meetings-call-recordings-get [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--call-recording-id <value>` | call_recording_id. |

**Example:** `attio personal api meetings-call-recordings-get --meeting-id <value> --call-recording-id <value>`

### `attio api meetings-call-recordings-delete`

Delete call recording — destructive (DELETE /v2/meetings/{meeting_id}/call_recordings/{call_recording_id})

**Changes something in the service.**

```sh
attio api meetings-call-recordings-delete [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--call-recording-id <value>` | call_recording_id. |

**Example:** `attio personal api meetings-call-recordings-delete --meeting-id <value> --call-recording-id <value>`

### `attio api meetings-call-recordings-transcript-list`

Deprecated: Get call transcript — read (GET /v2/meetings/{meeting_id}/call_recordings/{call_recording_id}/transcript)

```sh
attio api meetings-call-recordings-transcript-list [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meeting_id. |
| `--call-recording-id <value>` | call_recording_id. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api meetings-call-recordings-transcript-list --meeting-id <value> --call-recording-id <value>`

### `attio api files-list`

List files — read (GET /v2/files)

```sh
attio api files-list [options]
```

| Option | What it does |
|---|---|
| `--object <value>` | object. |
| `--record-id <value>` | record_id. |
| `--storage-provider <value>` | storage_provider. |
| `--parent-folder-id <value>` | parent_folder_id. |
| `--limit <value>` | limit. |
| `--cursor <value>` | cursor. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api files-list --object <value> --record-id <value>`

### `attio api files-create`

Create a folder — write (POST /v2/files)

**Changes something in the service.**

```sh
attio api files-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api files-create`

### `attio api files-get`

Get a file — read (GET /v2/files/{file_id})

```sh
attio api files-get [options]
```

| Option | What it does |
|---|---|
| `--file-id <value>` | file_id. |

**Example:** `attio personal api files-get --file-id <value>`

### `attio api files-delete`

Delete a file — destructive (DELETE /v2/files/{file_id})

**Changes something in the service.**

```sh
attio api files-delete [options]
```

| Option | What it does |
|---|---|
| `--file-id <value>` | file_id. |

**Example:** `attio personal api files-delete --file-id <value>`

### `attio api files-download-list`

Download a file — read (GET /v2/files/{file_id}/download)

```sh
attio api files-download-list [options]
```

| Option | What it does |
|---|---|
| `--file-id <value>` | file_id. |

**Example:** `attio personal api files-download-list --file-id <value>`

### `attio api webhooks-list`

List webhooks — read (GET /v2/webhooks)

```sh
attio api webhooks-list [options]
```

| Option | What it does |
|---|---|
| `--limit <value>` | limit. |
| `--offset <value>` | offset. |
| `--all` | read every page, as the API pages it. |

**Example:** `attio personal api webhooks-list`

### `attio api webhooks-create`

Create a webhook — write (POST /v2/webhooks)

**Changes something in the service.**

```sh
attio api webhooks-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api webhooks-create`

### `attio api webhooks-get`

Get a webhook — read (GET /v2/webhooks/{webhook_id})

```sh
attio api webhooks-get [options]
```

| Option | What it does |
|---|---|
| `--webhook-id <value>` | webhook_id. |

**Example:** `attio personal api webhooks-get --webhook-id <value>`

### `attio api webhooks-update`

Update a webhook — write (PATCH /v2/webhooks/{webhook_id})

**Changes something in the service.**

```sh
attio api webhooks-update [options]
```

| Option | What it does |
|---|---|
| `--webhook-id <value>` | webhook_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `attio personal api webhooks-update --webhook-id <value>`

### `attio api webhooks-delete`

Delete a webhook — destructive (DELETE /v2/webhooks/{webhook_id})

**Changes something in the service.**

```sh
attio api webhooks-delete [options]
```

| Option | What it does |
|---|---|
| `--webhook-id <value>` | webhook_id. |

**Example:** `attio personal api webhooks-delete --webhook-id <value>`

### `attio api self-list`

Identify — read (GET /v2/self)

```sh
attio api self-list
```

**Example:** `attio personal api self-list`

## `attio sync`

bring the CRM's copy in the local store up to date: pipelines, companies, contacts, deals that changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there

**Changes something on this computer only.**

```sh
attio sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the CRM in this run. |

**Returns:** crm sync — provider, account, scope, pipelines, skipped_owner_rejected, stage_tasks, synced, issues, and 9 more; every field: attio commands info sync

**Example:** `attio work sync`, `attio work sync --rescan`, `attio work sync --max-pages 20`

## `attio store`

the local copy of the CRM, and the shared store file it lives in

### `attio store status`

how far each kind's sync is: rows saved, partial or complete, when it last moved, how many are stored

```sh
attio store status
```

**Returns:** crm sync progress — kind, round, id_pass, stored, job, profile, done, total, and 6 more; every field: attio commands info store status

**Example:** `attio work store status --json`

### `attio store apply`

apply scope mine to the contacts already stored: remove those no deal of the chosen users and no kept company names, and the people they leave empty; counts only unless --yes, under scope all too. A sync that narrows the scope, or sync --rescan under mine, does this itself

**Changes something on this computer only.**

```sh
attio store apply [options]
```

| Option | What it does |
|---|---|
| `--yes` | remove the contacts it counts; otherwise only count them. |

**Returns:** crm contacts removed — contacts, persons, persons_kept, names, applied; every field: attio commands info store apply

**Example:** `attio work store apply`, `attio work store apply --yes`

### `attio store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
attio store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: attio commands info store info

**Example:** `attio work store info`

### `attio store check`

whether the store is healthy — integrity, search indexes, disk

```sh
attio store check
```

**Returns:** store check — path, exists, ok, opens, error, checks, schema, integrity, and 11 more; every field: attio commands info store check

**Example:** `attio work store check`

### `attio store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
attio store migrate
```

**Returns:** store migration — path, exists, from, to, normalized, indexed, terms, stemmed, and 1 more; every field: attio commands info store migrate

**Example:** `attio work store migrate`

### `attio store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored, and drop the vectors no stored text uses; loses nothing

**Changes something on this computer only.**

```sh
attio store rebuild
```

**Returns:** store reindex — path, exists, normalized, indexed, terms, stemmed, notes_indexed, file_texts, and 2 more; every field: attio commands info store rebuild

**Example:** `attio work store rebuild`

### `attio store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
attio store backup <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

| Option | What it does |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store backup — path, from, bytes, schema, rows, encrypted; every field: attio commands info store backup

**Example:** `attio work store backup ./backup.db`

### `attio store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted. Given a rollback copy (backups/<store>-rollback-schema-<version>-<time>.db, kept for a day before an upgrade older tools cannot open), put its tables back in the store and return it to that version instead

**Changes something on this computer only.**

```sh
attio store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote, or a rollback copy; one written with --encrypt asks for its password. |

**Returns:** store restore — path, restored_from, kept_at, schema, rolled_back, was, tables, rebuilt, and 1 more; every field: attio commands info store restore

**Example:** `attio work store restore ./backup.db`

### `attio store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
attio store decrypt <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Option | What it does |
|---|---|
| `--output <file>` | the new file, readable only by you. |

**Returns:** store decrypt — path, from, bytes; every field: attio commands info store decrypt

**Example:** `attio work store decrypt ./backup.enc --output ./restored.db`

### `attio store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
attio store repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

**Returns:** store repair — path, exists, dry_run, repaired, indexes_created, triggers_created, mismatches, foreign_key_violations, and 1 more; every field: attio commands info store repair

**Example:** `attio work store repair --dry-run`

### `attio store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
attio store reset [options]
```

| Option | What it does |
|---|---|
| `--no-backup` | delete the store without backing it up first. |
| `--dry-run` | list every table it would empty, with its rows, and delete nothing. |

**Returns:** store reset — path, exists, reset, dry_run, files, bytes, schema, tables, and 4 more; every field: attio commands info store reset

**Example:** `attio work store reset`

### `attio store copies`

the tables `store repair` kept as copies

#### `attio store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
attio store copies delete <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

**Returns:** store copy removal — path, deleted; every field: attio commands info store copies delete

**Example:** `attio work store copies delete messages_copy_1`

### `attio store tables`

the tables of the local store

#### `attio store tables list`

every table of the local archive: its kind (data, search index, part of a search index, internal) and its rows, a search index's rows not counted; --full adds each table's size on disk, which reads the whole file (about ten seconds for 3 GB); changes nothing

```sh
attio store tables list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** store table — name, kind, rows, bytes; every field: attio commands info store tables list

**Example:** `attio personal store tables list`, `attio personal store tables list kind:data`, `attio personal store tables list --full --json`

### `attio store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

#### `attio store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

**Changes something on this computer only.**

```sh
attio store recover run
```

**Example:** `attio personal store recover run`

## `attio deals`

the CRM's deals as last synced: stage, status, amount and the people on them

### `attio deals list`

deals copied from the CRM, newest first; run sync to bring them up to date

```sh
attio deals list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | deals per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: attio commands info deals list

**Example:** `attio work deals list status:open --json`, `attio work deals list stage:"Quote sent"`, `attio work deals list status:open --format csv > deals.csv`

### `attio deals show`

one deal with its pipeline, stage, status, amount and the people on it, and the newest recorded meetings and calls of those people in this account's scope; with the activities setting on, its activities and tasks too

```sh
attio deals show <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: attio commands info deals show

**Example:** `attio work deals show deal:12`

## `attio pipelines`

the CRM's pipelines and their stages, as last synced

### `attio pipelines list`

pipelines copied from the CRM, with their stages in order and how many are open in each

```sh
attio pipelines list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: attio commands info pipelines list

**Example:** `attio work pipelines list --json`

### `attio pipelines show`

one pipeline as a board and a funnel: how many stand in each stage and their sum per currency, never converted, how many reached it and went on, and the win rate; won and lost stages are marked by outcome

```sh
attio pipelines show [pipeline] [options]
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | optional | pipeline:<id>, or a name only one of the CRM's pipelines has; needed unless the CRM has one pipeline in all. |

| Option | What it does |
|---|---|
| `--since-time <time>` | count the rows made at or after this date or time (ISO 8601, or 30d ago). |
| `--until-time <time>` | count the rows made at or before this date or time; a date alone is that whole day. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: attio commands info pipelines show

**Example:** `attio work pipelines show pipeline:3`, `attio work pipelines show Sales --since-time 30d --json`

## `attio stages`

the stages of the CRM's pipelines, as last synced

### `attio stages list`

every stage of the CRM's pipelines in order, with its outcome and how many are open in it

```sh
attio stages list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** stage — name, position, outcome, external_id, open, pipeline, pipeline_name, kind, and 7 more; every field: attio commands info stages list

**Example:** `attio work stages list --json`

## `attio people`

the CRM's contacts, read live: the copy holds only your own

### `attio people list`

contacts in the CRM, newest first; another client is found here, never in the copy

```sh
attio people list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | words the CRM's own search looks for in contacts. |

| Option | What it does |
|---|---|
| `--limit <n>` | contacts per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: attio commands info people list

**Example:** `attio work people list`, `attio work people list anna --json`, `attio work people list --format csv > people.csv`

### `attio people show`

one of the CRM's contacts, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
attio people show <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the CRM's id of the person, as list prints it, or its exact name. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: attio commands info people show

**Example:** `attio work people show 42`, `attio work people show "Anna Example" --json`

## `attio organizations`

the CRM's companies, read live: the copy holds only your own

### `attio organizations list`

companies in the CRM, newest first; another client is found here, never in the copy

```sh
attio organizations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | words the CRM's own search looks for in companies. |

| Option | What it does |
|---|---|
| `--limit <n>` | companies per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: attio commands info organizations list

**Example:** `attio work organizations list`, `attio work organizations list anna --json`, `attio work organizations list --format csv > organizations.csv`

### `attio organizations show`

one of the CRM's companies, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
attio organizations show <organization>
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the CRM's id of the organization, as list prints it, or its exact name. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: attio commands info organizations show

**Example:** `attio work organizations show 42`, `attio work organizations show "Anna Example" --json`

## `attio users`

the CRM account's users: the people of your own company who own deals

### `attio users list`

the CRM's users, read live, in the CRM's order

```sh
attio users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | users per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: attio commands info users list

**Example:** `attio work users list`, `attio work users list active:true --json`

### `attio users show`

one of the CRM's users, read live

```sh
attio users show <user>
```

| Argument | | What it is |
|---|---|---|
| `user` | required | the CRM's id of the user, as list prints it. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: attio commands info users show

**Example:** `attio work users show 7`

## `attio changes`

what changed in the CRM's deals, activities and contacts, as the syncs copied it

### `attio changes list`

deals made, moved, won, lost and given another owner, activities added and done, and contacts added, newest first; the last day unless at: says otherwise

```sh
attio changes list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | changes per page, 1–500. Default: `50`. |
| `--cursor <cursor>` | the next page, as the last answer's page.next gave it. |
| `--format <format>` | csv: this page as a table; report: the window as a morning digest document, for schedule command. Run by a schedule, the report starts where that schedule's last one ended. One of: `csv`, `report`. |

**Returns:** crm change — change, at, kind, ref, external_id, account, title, pipeline, and 10 more; every field: attio commands info changes list

**Example:** `attio work changes list "at>=1d"`, `attio work changes list change:won at>=7d --json`, `attio work changes list "at>=1d" --format report`

## `attio fields`

the CRM's own fields on deals, people and organizations, as last synced

### `attio fields list`

the CRM's custom fields of one kind, in its order, with a list field's options

```sh
attio fields list <kind> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deals, people, organizations. |
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--limit <n>` | fields per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every field, no paging. |

**Returns:** crm field — code, label, type, multiple, filterable, untrusted, options; every field: attio commands info fields list

**Example:** `attio work fields list deals`, `attio work fields list people --json`

## `attio search`

search what the local store holds

### `attio search all`

search the CRM's deals by the words of their title, company, contacts and activities, and the messages, notes, calendar events and meetings other WireCat tools stored — best match first. Use it when you do not know where something was written

```sh
attio search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words and "phrases"; deals match the words of their title, company, contacts and activities. |

| Option | What it does |
|---|---|
| `--only <resources>` | only these resources, separated by commas: crm, messages, notes, events, meetings. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 18 more; every field: attio commands info search all

**Example:** `attio work search all Example LLC`, `attio work search all website --only crm --json`

## `attio doctor`

the state this installation is in, without connecting unless --online

```sh
attio doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `attio doctor`, `attio doctor --json`

### `attio doctor reports`

problem reports

#### `attio doctor reports show`

what a problem report holds; writes nothing

```sh
attio doctor reports show
```

**Example:** `attio doctor reports show`

#### `attio doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
attio doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `attio doctor reports create --output ./problem-report.json`

## `attio skill`

the instructions an agent is given for this tool

### `attio skill show`

print SKILL.md — `attio skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
attio skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-workspace-members, api-workspace-blocklist, api-webhooks, api-views, api-transcripts, api-threads, api-tasks, api-sql, api-sequences, api-records, api-objects, api-notes, api-meta, api-meetings, api-lists, api-files, api-entries, api-emails, api-comments, api-call-recordings, api-attributes, api-activity-records, api-activities, api. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `attio skill show`

### `attio skill install`

write SKILL.md to \~/.claude/skills/attio-cli/ (Claude Code) and \~/.agents/skills/attio-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
attio skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `attio skill install --for agents`

### `attio skill status`

for each place `attio skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
attio skill status
```

**Example:** `attio skill status`, `attio skill status --json`

## `attio mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add attio -- attio <profile> mcp serve`

### `attio mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add attio -- attio <profile> mcp serve`; `attio mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
attio mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.objects-records-delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `attio personal mcp serve`, `attio mcp serve --profiles work,personal`, `attio personal mcp serve --http --public-url https://laptop.example.ts.net`

### `attio mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
attio mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `attio personal mcp revoke`, `attio mcp revoke --profiles all`

### `attio mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `attio mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
attio mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `attio personal mcp server start --public-url https://laptop.example.ts.net`

#### `attio mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
attio mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `attio personal mcp server stop`

#### `attio mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
attio mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `attio personal mcp server status --json`

### `attio mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
attio mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.objects-records-delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `attio personal mcp config`, `attio mcp config --profiles all`

### `attio mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
attio mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like api.objects-records-delete=deny; it never loosens the profile; repeat for more keys. |

**Example:** `attio personal mcp add codex --allow-writes`

### `attio mcp check`

check this profile's local MCP handshake and tool list

```sh
attio mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.objects-records-delete=deny; it never loosens the profile; repeat for more keys. |

**Example:** `attio personal mcp check`

## `attio upgrade`

upgrade attio with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
attio upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `attio upgrade --check`

## `attio config`

the settings in force, and where each one came from

### `attio config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
attio config show
```

**Example:** `attio personal config show`

### `attio config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
attio config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `attio personal config set limit 20`

### `attio config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
attio config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `attio personal config unset limit`

### `attio config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
attio config migrate
```

**Example:** `attio config migrate`

### `attio config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
attio config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `attio config repair`, `attio config repair --dry-run`

## `attio runs`

recorded runs — what this tool did, and when

### `attio runs list`

recorded runs, newest first

```sh
attio runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: attio commands info runs list

**Example:** `attio personal runs list --limit 10`

### `attio runs show`

one run: what it was, how it ended, and every event it logged

```sh
attio runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `attio runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: attio commands info runs show

**Example:** `attio personal runs show run-101`

### `attio runs path`

the directory holding one run

```sh
attio runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `attio runs list`. |

**Returns:** run location — path; every field: attio commands info runs path

**Example:** `attio personal runs path run-101`

## Exit codes

Branch on the code, not on the text: the text can change, the code does not.

| Code | When |
|---|---|
| `0` | it worked |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `15` | `conflict` |
| `130` | `cancelled` |
| `1` | anything else |
