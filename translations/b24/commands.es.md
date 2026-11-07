---
title: "Comandos b24"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Todos los comandos, opciones y códigos de salida, generados a partir del propio programa. Para obtener la misma lista en
JSON, ejecuta `b24 commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `b24 personal config show`. `B24_PROFILE`
hace lo mismo para toda una sesión de la terminal. Nunca se da un perfil por supuesto: un comando que usa una cuenta
se detiene si no lo tiene y muestra los perfiles de este ordenador.

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

## `b24 commands`

every command by section; --json prints its contract, one path per call

### `b24 commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
b24 commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Returns:** one command contract, or all schemas, error reasons and explicit overrides

**Example:** `b24 commands info commands`

## `b24 session`

keep this profile's Bitrix24 webhook in the OS keyring

### `b24 session start`

sign this profile in: the incoming webhook's address (Bitrix24 → Developer resources → Other → Incoming webhook) is asked hidden or read from stdin, checked against the portal, and only then kept in the keyring, or in a private file when the keyring fails; the webhook acts with the rights of the employee who made it

**Changes something on this computer only.**

```sh
b24 session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the address is kept: keyring (the default, which falls back to a private file by itself when no keyring works), or file, not recommended. Default: `keyring`. |

**Returns:** sign in with a Bitrix24 incoming webhook

**Example:** `b24 work session start`, `b24 work session start --json`

### `b24 session status`

show where this profile's webhook address comes from: B24_TOKEN, the keyring or a file; never the address. --check asks the portal whose rights it carries: the user's id, name and whether they are an admin

```sh
b24 session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask the portal whether the webhook still works, and as whom. |

**Returns:** show where the webhook comes from, and with --check as whom it acts

**Example:** `b24 work session status`, `b24 work session status --check --json`

### `b24 session end`

forget this profile's webhook address on this computer; the webhook itself stays in Bitrix24

**Changes something on this computer only.**

```sh
b24 session end
```

**Returns:** forget this profile's webhook address on this computer

**Example:** `b24 work session end`

### `b24 session list`

list the profiles on this computer and whether each has a webhook; picks none

```sh
b24 session list
```

**Returns:** list the profiles here and whether each is signed in

**Example:** `b24 session list`, `b24 session list --json`

## `b24 sync`

bring the CRM's copy in the local store up to date: pipelines, companies, contacts, deals and leads that changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there

**Changes something on this computer only.**

```sh
b24 sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the CRM in this run. |

**Returns:** crm sync — provider, account, pipelines, synced, issues, complete, state, progress, and 2 more; every field: b24 commands info sync

**Example:** `b24 work sync`, `b24 work sync --rescan`, `b24 work sync --max-pages 20`

## `b24 store`

the local copy of the CRM

### `b24 store status`

how far each kind's sync is: rows saved, partial or complete, when it last moved, how many are stored

```sh
b24 store status
```

**Returns:** crm sync progress — kind, round, id_pass, stored, job, profile, done, total, and 5 more; every field: b24 commands info store status

**Example:** `b24 work store status --json`

## `b24 deals`

the CRM's deals as last synced: stage, status, amount and the people on them

### `b24 deals list`

deals copied from the CRM, newest first; run sync to bring them up to date

```sh
b24 deals list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | deals per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 24 more; every field: b24 commands info deals list

**Example:** `b24 work deals list status:open --json`, `b24 work deals list stage:"Quote sent"`

### `b24 deals show`

one deal with its pipeline, stage, status, amount and the people on it

```sh
b24 deals show <ref>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>, as a list shows it. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 24 more; every field: b24 commands info deals show

**Example:** `b24 work deals show deal:12`

### `b24 deals create`

make a deal in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
b24 deals create [options]
```

| Option | What it does |
|---|---|
| `--title <title>` | the deal's title. |
| `--pipeline <pipeline>` | pipeline:<id>, or a name only one of the CRM's pipelines has. |
| `--stage <stage>` | a stage of its pipeline, by the CRM's id or name; checks the move key too, and the close key for a won or lost stage. |
| `--amount <decimal>` | the expected sum, such as 1500.50, with --currency. |
| `--currency <code>` | an ISO 4217 code, such as EUR. |
| `--close-date <date>` | the day it is expected to close, YYYY-MM-DD. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals create

**Example:** `b24 work deals create --title "Example kitchen" --amount 15000 --currency EUR`, `b24 work deals create --title "Example office" --pipeline Sales --stage "Quote sent" --field UF_CRM_SOURCE=web`

### `b24 deals update`

change a deal in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
b24 deals update <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>, as a list shows it. |

| Option | What it does |
|---|---|
| `--title <title>` | the deal's title. |
| `--pipeline <pipeline>` | pipeline:<id>, or a name only one of the CRM's pipelines has. |
| `--stage <stage>` | a stage of its pipeline, by the CRM's id or name; checks the move key too, and the close key for a won or lost stage. |
| `--amount <decimal>` | the expected sum, such as 1500.50, with --currency. |
| `--currency <code>` | an ISO 4217 code, such as EUR. |
| `--close-date <date>` | the day it is expected to close, YYYY-MM-DD. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals update

**Example:** `b24 work deals update deal:12 --amount 18000`, `b24 work deals update deal:12 --field UF_CRM_SOURCE=`

### `b24 deals move`

move a deal to another stage of its pipeline; a won or lost stage checks the close key too

**Changes something in the service.**

```sh
b24 deals move <ref> <stage>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals move

**Example:** `b24 work deals move deal:12 "Quote sent"`

### `b24 deals close`

mark a deal won or lost, the CRM's own way

**Changes something in the service.**

```sh
b24 deals close <ref> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>, as a list shows it. |
| `outcome` | required | how it ended. One of: `won`, `lost`. |

| Option | What it does |
|---|---|
| `--reason <text>` | why, in a few words; kept with it. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals close

**Example:** `b24 work deals close deal:12 won`, `b24 work deals close deal:12 lost --reason "Example: chose another supplier"`

### `b24 deals delete`

delete a deal in the CRM; asks first unless allowed

**Changes something in the service.**

```sh
b24 deals delete <ref>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | deal:<id>, as a list shows it. |

**Returns:** crm removal — operation_id, ref, removed; every field: b24 commands info deals delete

**Example:** `b24 work deals delete deal:12`

## `b24 leads`

the CRM's leads as last synced

### `b24 leads list`

leads copied from the CRM, newest first; run sync to bring them up to date

```sh
b24 leads list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | leads per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 24 more; every field: b24 commands info leads list

**Example:** `b24 work leads list status:open --json`, `b24 work leads list stage:"Quote sent"`

### `b24 leads show`

one lead with its pipeline, stage, status, amount and the people on it

```sh
b24 leads show <ref>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>, as a list shows it. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 24 more; every field: b24 commands info leads show

**Example:** `b24 work leads show lead:12`

### `b24 leads create`

make a lead in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
b24 leads create [options]
```

| Option | What it does |
|---|---|
| `--title <title>` | the lead's title. |
| `--pipeline <pipeline>` | pipeline:<id>, or a name only one of the CRM's pipelines has. |
| `--stage <stage>` | a stage of its pipeline, by the CRM's id or name; checks the move key too, and the close key for a won or lost stage. |
| `--amount <decimal>` | the expected sum, such as 1500.50, with --currency. |
| `--currency <code>` | an ISO 4217 code, such as EUR. |
| `--close-date <date>` | the day it is expected to close, YYYY-MM-DD. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info leads create

**Example:** `b24 work leads create --title "Example kitchen" --amount 15000 --currency EUR`, `b24 work leads create --title "Example office" --pipeline Sales --stage "Quote sent" --field UF_CRM_SOURCE=web`

### `b24 leads update`

change a lead in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
b24 leads update <ref> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>, as a list shows it. |

| Option | What it does |
|---|---|
| `--title <title>` | the lead's title. |
| `--pipeline <pipeline>` | pipeline:<id>, or a name only one of the CRM's pipelines has. |
| `--stage <stage>` | a stage of its pipeline, by the CRM's id or name; checks the move key too, and the close key for a won or lost stage. |
| `--amount <decimal>` | the expected sum, such as 1500.50, with --currency. |
| `--currency <code>` | an ISO 4217 code, such as EUR. |
| `--close-date <date>` | the day it is expected to close, YYYY-MM-DD. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info leads update

**Example:** `b24 work leads update lead:12 --amount 18000`, `b24 work leads update lead:12 --field UF_CRM_SOURCE=`

### `b24 leads move`

move a lead to another stage of its pipeline; a won or lost stage checks the close key too

**Changes something in the service.**

```sh
b24 leads move <ref> <stage>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info leads move

**Example:** `b24 work leads move lead:12 "Quote sent"`

### `b24 leads close`

mark a lead won or lost, the CRM's own way

**Changes something in the service.**

```sh
b24 leads close <ref> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>, as a list shows it. |
| `outcome` | required | how it ended. One of: `won`, `lost`. |

| Option | What it does |
|---|---|
| `--reason <text>` | why, in a few words; kept with it. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info leads close

**Example:** `b24 work leads close lead:12 won`, `b24 work leads close lead:12 lost --reason "Example: chose another supplier"`

### `b24 leads delete`

delete a lead in the CRM; asks first unless allowed

**Changes something in the service.**

```sh
b24 leads delete <ref>
```

| Argument | | What it is |
|---|---|---|
| `ref` | required | lead:<id>, as a list shows it. |

**Returns:** crm removal — operation_id, ref, removed; every field: b24 commands info leads delete

**Example:** `b24 work leads delete lead:12`

## `b24 pipelines`

the CRM's pipelines and their stages, as last synced

### `b24 pipelines list`

pipelines copied from the CRM, with their stages in order and how many are open in each

```sh
b24 pipelines list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 3 more; every field: b24 commands info pipelines list

**Example:** `b24 work pipelines list --json`, `b24 work pipelines list kind:lead`

### `b24 pipelines show`

one pipeline with its funnel: how many reached each stage, how many went on, and the win rate

```sh
b24 pipelines show <pipeline>
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | required | pipeline:<id>, or a name only one of the CRM's pipelines has. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 3 more; every field: b24 commands info pipelines show

**Example:** `b24 work pipelines show pipeline:3`

## `b24 stages`

the stages of the CRM's pipelines, as last synced

### `b24 stages list`

every stage of the CRM's pipelines in order, with its outcome and how many are open in it

```sh
b24 stages list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** stage — name, position, outcome, external_id, open, pipeline, pipeline_name, kind, and 3 more; every field: b24 commands info stages list

**Example:** `b24 work stages list --json`, `b24 work stages list kind:lead`

## `b24 fields`

the CRM's own fields on deals, leads, people and organizations, as last synced

### `b24 fields list`

the CRM's custom fields of one kind, in its order, with a list field's options

```sh
b24 fields list <kind> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `kind` | required | deals, leads, people, organizations. |
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--limit <n>` | fields per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every field, no paging. |

**Returns:** crm field — code, label, type, multiple, filterable, untrusted, options; every field: b24 commands info fields list

**Example:** `b24 work fields list deals`, `b24 work fields list people --json`

## `b24 search`

search what the local store holds

### `b24 search all`

search the CRM's deals and leads by the words of their title, and messages, notes and calendar events other WireCat tools stored — best match first. Use it when you do not know where something was written

```sh
b24 search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words and "phrases"; deals and leads match the words of their title. |

| Option | What it does |
|---|---|
| `--only <resources>` | only these resources, separated by commas: crm, messages, notes, events; meetings when --source names a meeting account. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind, and meetings only when it names one. |
| `--max-meetings <n>` | how many of the meeting account's meetings to look through, newest first, or all for every one (default 100). |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 13 more; every field: b24 commands info search all

**Example:** `b24 work search all Example LLC`, `b24 work search all website --only crm --json`

## `b24 people`

read the portal's contacts

### `b24 people list`

list contacts on the portal, newest first

```sh
b24 people list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 5 more; every field: b24 commands info people list

**Example:** `b24 work people list`, `b24 work people list name:ivan*`

### `b24 people show`

show one of the contacts on the portal

```sh
b24 people show <id-or-name>
```

| Argument | | What it is |
|---|---|---|
| `id-or-name` | required | the id-or-name as list prints it. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 5 more; every field: b24 commands info people show

**Example:** `b24 work people show 42`, `b24 work people show 42 --json`

### `b24 people create`

create one person on the portal

**Changes something in the service.**

```sh
b24 people create [options]
```

| Option | What it does |
|---|---|
| `--first-name <name>` | the person's first name. |
| `--last-name <name>` | the person's last name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** create one person on the portal

**Example:** `b24 work people create --first-name Anna --last-name Ivanova`

### `b24 people update`

change one person on the portal; options left out keep their values

**Changes something in the service.**

```sh
b24 people update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the person's id. |

| Option | What it does |
|---|---|
| `--first-name <name>` | the person's first name. |
| `--last-name <name>` | the person's last name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** change one person on the portal; options left out keep their values

**Example:** `b24 work people update 4 --body '{"post":"Buyer"}'`

## `b24 organizations`

read the portal's companies

### `b24 organizations list`

list companies on the portal, newest first

```sh
b24 organizations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** crm organization — id, name, type_id, industry_id, revenue, currency, person_ids, assigned_to, and 6 more; every field: b24 commands info organizations list

**Example:** `b24 work organizations list`, `b24 work organizations list name:acme*`

### `b24 organizations show`

show one of the companies on the portal

```sh
b24 organizations show <id-or-name>
```

| Argument | | What it is |
|---|---|---|
| `id-or-name` | required | the id-or-name as list prints it. |

**Returns:** crm organization — id, name, type_id, industry_id, revenue, currency, person_ids, assigned_to, and 6 more; every field: b24 commands info organizations show

**Example:** `b24 work organizations show 42`, `b24 work organizations show 42 --json`

### `b24 organizations create`

create one organization on the portal

**Changes something in the service.**

```sh
b24 organizations create [options]
```

| Option | What it does |
|---|---|
| `--name <name>` | the name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** create one organization on the portal

**Example:** `b24 work organizations create --name "Acme"`

### `b24 organizations update`

change one organization on the portal; options left out keep their values

**Changes something in the service.**

```sh
b24 organizations update <id> [options]
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the organization's id. |

| Option | What it does |
|---|---|
| `--name <name>` | the name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** change one organization on the portal; options left out keep their values

**Example:** `b24 work organizations update 9 --name "Acme Ltd"`

## `b24 products`

read the portal's product catalog

### `b24 products list`

list catalog products on the portal, newest first

```sh
b24 products list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** product — id, name, price, currency, active, section_id; every field: b24 commands info products list

**Example:** `b24 work products list`, `b24 work products list active:true name:chair*`

### `b24 products show`

show one of the catalog products on the portal

```sh
b24 products show <id>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the id as list prints it. |

**Returns:** product — id, name, price, currency, active, section_id; every field: b24 commands info products show

**Example:** `b24 work products show 42`, `b24 work products show 42 --json`

## `b24 users`

read the portal's employees

### `b24 users list`

list employees on the portal, newest first

```sh
b24 users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

**Returns:** user — id, name, email, position, active, department_ids; every field: b24 commands info users list

**Example:** `b24 work users list`, `b24 work users list active:true`

### `b24 users show`

show one of the employees on the portal

```sh
b24 users show <id>
```

| Argument | | What it is |
|---|---|---|
| `id` | required | the id as list prints it. |

**Returns:** user — id, name, email, position, active, department_ids; every field: b24 commands info users show

**Example:** `b24 work users show 42`, `b24 work users show 42 --json`

## `b24 api`

see and call the Bitrix24 REST methods directly

### `b24 api list`

list the Bitrix24 methods b24's own commands call, with the REST version and permission of each

```sh
b24 api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** api method — name, rest, effect, scope, permission, default_level, also_checks; every field: b24 commands info api list

**Example:** `b24 personal api list`, `b24 personal api list scope:crm effect:write`

### `b24 api show`

show which REST version a method goes to, what it does and the permissions it checks; calls nothing

```sh
b24 api show <method>
```

| Argument | | What it is |
|---|---|---|
| `method` | required | the Bitrix24 method, such as crm.deal.list. |

**Returns:** show a method's REST version and permissions; calls nothing

**Example:** `b24 personal api show crm.deal.update --json`

### `b24 api call`

call one Bitrix24 method by name with its parameters as JSON; it checks api.<method>, and the key of the command that reads or writes the same records

**Changes something in the service.**

```sh
b24 api call <method> [options]
```

| Argument | | What it is |
|---|---|---|
| `method` | required | the Bitrix24 method, such as crm.deal.list. |

| Option | What it does |
|---|---|
| `--body <json>` | the method's parameters, as a JSON object. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** call one Bitrix24 method by name with JSON parameters

**Example:** `b24 work api call crm.deal.list --body '{"select":["id","title"],"pagination":{"limit":5}}'`, `b24 work api call crm.status.list --body '{"filter":{"ENTITY_ID":"STATUS"}}'`

## `b24 doctor`

the state this installation is in, without connecting unless --online

```sh
b24 doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Returns:** the state this installation is in, without connecting unless --online

**Example:** `b24 doctor`, `b24 doctor --json`

## `b24 skill`

the instructions an agent is given for this tool

### `b24 skill show`

print SKILL.md — `b24 skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
b24 skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Returns:** print the tool's instructions for AI agents

**Example:** `b24 skill show`

### `b24 skill install`

write SKILL.md to \~/.claude/skills/bitrix24-cli/ (Claude Code) and \~/.agents/skills/bitrix24-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
b24 skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Returns:** install the tool's instructions for AI agents

**Example:** `b24 skill install --for agents`

### `b24 skill status`

for each place `b24 skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
b24 skill status
```

**Returns:** whether the installed instructions for AI agents match this version

**Example:** `b24 skill status`, `b24 skill status --json`

## `b24 mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add b24 -- b24 <profile> mcp serve`

### `b24 mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add b24 -- b24 <profile> mcp serve`; `b24 mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
b24 mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Returns:** serve this profile's commands to an AI agent

**Example:** `b24 personal mcp serve`, `b24 mcp serve --profiles work,personal`, `b24 personal mcp serve --http --public-url https://laptop.example.ts.net`

### `b24 mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
b24 mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** forget every login given to a browser app

**Example:** `b24 personal mcp revoke`, `b24 mcp revoke --profiles all`

### `b24 mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `b24 mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
b24 mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** start the HTTP MCP server in the background

**Example:** `b24 personal mcp server start --public-url https://laptop.example.ts.net`

#### `b24 mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
b24 mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** stop the background HTTP MCP server

**Example:** `b24 personal mcp server stop`

#### `b24 mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
b24 mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** whether the HTTP MCP server runs, its login code and the apps logged in

**Example:** `b24 personal mcp server status --json`

### `b24 mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
b24 mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.delete=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** print the local MCP configuration of this profile, or of those --profiles names

**Example:** `b24 personal mcp config`, `b24 mcp config --profiles all`

### `b24 mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
b24 mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like deals.delete=deny; it never loosens the profile; repeat for more keys. |

**Returns:** add this profile's local MCP server to Codex or Claude Code

**Example:** `b24 personal mcp add codex --allow-writes`

### `b24 mcp check`

check this profile's local MCP handshake and tool list

```sh
b24 mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.delete=deny; it never loosens the profile; repeat for more keys. |

**Returns:** check this profile's local MCP handshake and tool list

**Example:** `b24 personal mcp check`

## `b24 upgrade`

upgrade b24 with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
b24 upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Returns:** upgrade b24 with the package manager that installed it; --check only looks

**Example:** `b24 upgrade --check`

## `b24 config`

the settings in force, and where each one came from

### `b24 config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
b24 config show
```

**Returns:** the profile, the profiles that exist, and each setting with where it came from

**Example:** `b24 personal config show`

### `b24 config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
b24 config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** save a setting to the configuration file

**Example:** `b24 personal config set limit 20`

### `b24 config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
b24 config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** remove a setting from the configuration file

**Example:** `b24 personal config unset limit`

### `b24 config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
b24 config migrate
```

**Returns:** write each setting the file lacks at its default, keeping yours

**Example:** `b24 config migrate`

### `b24 config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
b24 config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Returns:** fix the settings file's JSON syntax, keeping every value

**Example:** `b24 config repair`, `b24 config repair --dry-run`

## `b24 runs`

recorded runs — what this tool did, and when

### `b24 runs list`

recorded runs, newest first

```sh
b24 runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: b24 commands info runs list

**Example:** `b24 personal runs list --limit 10`

### `b24 runs show`

one run: what it was, how it ended, and every event it logged

```sh
b24 runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `b24 runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: b24 commands info runs show

**Example:** `b24 personal runs show run-101`

### `b24 runs path`

the directory holding one run

```sh
b24 runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `b24 runs list`. |

**Returns:** run location — path; every field: b24 commands info runs path

**Example:** `b24 personal runs path run-101`

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
