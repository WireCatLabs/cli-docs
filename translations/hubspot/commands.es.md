---
title: "Comandos de hubspot"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Busca cualquier comando de hubspot, sus opciones y sus códigos de salida, con la seguridad de que coinciden con tu
versión: esta página se genera a partir del propio programa. Tu agente de IA lee la misma lista en JSON con
`hubspot commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `hubspot personal config show`. `WCHUBSPOT_PROFILE`
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

## `hubspot commands`

every command by section; --json prints its contract, one path per call

### `hubspot commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
hubspot commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `hubspot commands info commands`

## `hubspot session`

keep this profile's HubSpot key and account id in the OS keyring

### `hubspot session start`

sign this profile in: a service key (Development → Keys → Service keys) or a legacy private app's access token is asked hidden or read from stdin, never taken as an argument, checked against the account, and only then kept in the keyring with the account's id, or in a private file. The key reads and writes what its scopes allow

**Changes something on this computer only.**

```sh
hubspot session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the key is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `hubspot work session start`, `hubspot work session start --json`, `hubspot work session start --credential-storage file`

### `hubspot session status`

show which account this profile signs in to and where its key comes from: WCHUBSPOT_TOKEN, the keyring or a file; never the key

```sh
hubspot session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask HubSpot whether the key still works and which account it reads. |

**Example:** `hubspot work session status`, `hubspot work session status --check --json`

### `hubspot session end`

forget this profile's key and account id on this computer; the key itself stays valid in HubSpot: delete or rotate it where it was made

**Changes something on this computer only.**

```sh
hubspot session end
```

**Example:** `hubspot work session end`

### `hubspot session list`

list the profiles on this computer, whether each has a key and for which account; picks none

```sh
hubspot session list
```

**Example:** `hubspot session list`, `hubspot session list --json`

## `hubspot account`

this profile on this computer

### `hubspot account remove`

sign the profile out, then forget it on this computer: its settings, its saved sign-in and its files; --keep-data leaves its messages in the store, where search still finds them, --delete-data deletes them; asks first, or --yes

**Changes something on this computer only.**

```sh
hubspot account remove [options]
```

| Option | What it does |
|---|---|
| `--keep-data` | leave what the store holds of this account, still searchable. |
| `--delete-data` | delete what the store and the tool's own files hold of this account. |
| `--dry-run` | list what it would remove and keep, and change nothing. |

**Returns:** account removal — profile, data, dry_run, account, revoked, config_file, removed, kept; every field: hubspot commands info account remove

**Example:** `hubspot personal account remove --keep-data --dry-run`, `hubspot personal account remove --delete-data --yes`

## `hubspot sync`

bring the CRM's copy in the local store up to date: pipelines, companies, contacts, deals and leads that changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there

**Changes something on this computer only.**

```sh
hubspot sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the CRM in this run. |

**Returns:** crm sync — provider, account, scope, pipelines, skipped_owner_rejected, stage_tasks, synced, issues, and 9 more; every field: hubspot commands info sync

**Example:** `hubspot work sync`, `hubspot work sync --rescan`, `hubspot work sync --max-pages 20`

## `hubspot store`

the local copy of the CRM, and the shared store file it lives in

### `hubspot store status`

how far each kind's sync is: rows saved, partial or complete, when it last moved, how many are stored

```sh
hubspot store status
```

**Returns:** crm sync progress — kind, round, id_pass, stored, job, profile, done, total, and 6 more; every field: hubspot commands info store status

**Example:** `hubspot work store status --json`

### `hubspot store apply`

apply scope mine to the contacts already stored: remove those no deal or lead of the chosen users and no kept company names, and the people they leave empty; counts only unless --yes, under scope all too. A sync that narrows the scope, or sync --rescan under mine, does this itself

**Changes something on this computer only.**

```sh
hubspot store apply [options]
```

| Option | What it does |
|---|---|
| `--yes` | remove the contacts it counts; otherwise only count them. |

**Returns:** crm contacts removed — contacts, persons, persons_kept, names, applied; every field: hubspot commands info store apply

**Example:** `hubspot work store apply`, `hubspot work store apply --yes`

### `hubspot store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
hubspot store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: hubspot commands info store info

**Example:** `hubspot work store info`

### `hubspot store check`

whether the store is healthy — integrity, search indexes, disk

```sh
hubspot store check
```

**Returns:** store check — path, exists, ok, opens, error, checks, schema, integrity, and 11 more; every field: hubspot commands info store check

**Example:** `hubspot work store check`

### `hubspot store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
hubspot store migrate
```

**Returns:** store migration — path, exists, from, to, normalized, indexed, terms, stemmed, and 1 more; every field: hubspot commands info store migrate

**Example:** `hubspot work store migrate`

### `hubspot store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored, and drop the vectors no stored text uses; loses nothing

**Changes something on this computer only.**

```sh
hubspot store rebuild
```

**Returns:** store reindex — path, exists, normalized, indexed, terms, stemmed, notes_indexed, file_texts, and 2 more; every field: hubspot commands info store rebuild

**Example:** `hubspot work store rebuild`

### `hubspot store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
hubspot store backup <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

| Option | What it does |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store backup — path, from, bytes, schema, rows, encrypted; every field: hubspot commands info store backup

**Example:** `hubspot work store backup ./backup.db`

### `hubspot store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted. Given a rollback copy (backups/<store>-rollback-schema-<version>-<time>.db, kept for a day before an upgrade older tools cannot open), put its tables back in the store and return it to that version instead

**Changes something on this computer only.**

```sh
hubspot store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote, or a rollback copy; one written with --encrypt asks for its password. |

**Returns:** store restore — path, restored_from, kept_at, schema, rolled_back, was, tables, rebuilt, and 1 more; every field: hubspot commands info store restore

**Example:** `hubspot work store restore ./backup.db`

### `hubspot store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
hubspot store decrypt <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Option | What it does |
|---|---|
| `--output <file>` | the new file, readable only by you. |

**Returns:** store decrypt — path, from, bytes; every field: hubspot commands info store decrypt

**Example:** `hubspot work store decrypt ./backup.enc --output ./restored.db`

### `hubspot store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
hubspot store repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

**Returns:** store repair — path, exists, dry_run, repaired, indexes_created, triggers_created, mismatches, foreign_key_violations, and 1 more; every field: hubspot commands info store repair

**Example:** `hubspot work store repair --dry-run`

### `hubspot store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
hubspot store reset [options]
```

| Option | What it does |
|---|---|
| `--no-backup` | delete the store without backing it up first. |
| `--dry-run` | list every table it would empty, with its rows, and delete nothing. |

**Returns:** store reset — path, exists, reset, dry_run, files, bytes, schema, tables, and 4 more; every field: hubspot commands info store reset

**Example:** `hubspot work store reset`

### `hubspot store copies`

the tables `store repair` kept as copies

#### `hubspot store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
hubspot store copies delete <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

**Returns:** store copy removal — path, deleted; every field: hubspot commands info store copies delete

**Example:** `hubspot work store copies delete messages_copy_1`

### `hubspot store tables`

the tables of the local store

#### `hubspot store tables list`

every table of the local archive: its kind (data, search index, part of a search index, internal) and its rows, a search index's rows not counted; --full adds each table's size on disk, which reads the whole file (about ten seconds for 3 GB); changes nothing

```sh
hubspot store tables list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** store table — name, kind, rows, bytes; every field: hubspot commands info store tables list

**Example:** `hubspot personal store tables list`, `hubspot personal store tables list kind:data`, `hubspot personal store tables list --full --json`

### `hubspot store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

#### `hubspot store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

**Changes something on this computer only.**

```sh
hubspot store recover run
```

**Example:** `hubspot personal store recover run`

## `hubspot deals`

the CRM's deals as last synced: stage, status, amount and the people on them

### `hubspot deals list`

deals copied from the CRM, newest first; run sync to bring them up to date

```sh
hubspot deals list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | deals per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: hubspot commands info deals list

**Example:** `hubspot work deals list status:open --json`, `hubspot work deals list stage:"Quote sent"`, `hubspot work deals list status:open --format csv > deals.csv`

### `hubspot deals show`

one deal with its pipeline, stage, status, amount and the people on it, and the newest recorded meetings and calls of those people in this account's scope; with the activities setting on, its activities and tasks too

```sh
hubspot deals show <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: hubspot commands info deals show

**Example:** `hubspot work deals show deal:12`

### `hubspot deals create`

make a deal in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
hubspot deals create [options]
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

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: hubspot commands info deals create

**Example:** `hubspot work deals create --title "Example kitchen" --amount 15000 --currency EUR`, `hubspot work deals create --title "Example office" --pipeline Sales --stage "Quote sent" --field Source=web`

### `hubspot deals update`

change a deal in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
hubspot deals update <deal> [options]
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

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

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: hubspot commands info deals update

**Example:** `hubspot work deals update deal:12 --amount 18000`, `hubspot work deals update deal:12 --field Source=`

### `hubspot deals move`

move a deal to another stage of its pipeline; a won or lost stage checks the close key too

**Changes something in the service.**

```sh
hubspot deals move <deal> <stage>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has; or a stage:<id>, of its pipeline or of the owner's base set, which moves it to the one stage of its pipeline mapped there and refuses several (with the candidates) or none. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: hubspot commands info deals move

**Example:** `hubspot work deals move deal:12 "Quote sent"`, `hubspot work deals move deal:12 stage:5`

### `hubspot deals close`

mark a deal won or lost, the CRM's own way

**Changes something in the service.**

```sh
hubspot deals close <deal> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
| `outcome` | required | how it ended. One of: `won`, `lost`. |

| Option | What it does |
|---|---|
| `--reason <text>` | why, in a few words; kept with it. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: hubspot commands info deals close

**Example:** `hubspot work deals close deal:12 won`, `hubspot work deals close deal:12 lost --reason "Example: chose another supplier"`

### `hubspot deals delete`

delete a deal in the CRM; asks first unless allowed

**Changes something in the service.**

```sh
hubspot deals delete <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

**Returns:** crm removal — operation_id, ref, removed; every field: hubspot commands info deals delete

**Example:** `hubspot work deals delete deal:12`

## `hubspot leads`

the CRM's leads as last synced

### `hubspot leads list`

leads copied from the CRM, newest first; run sync to bring them up to date

```sh
hubspot leads list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | leads per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: hubspot commands info leads list

**Example:** `hubspot work leads list status:open --json`, `hubspot work leads list stage:"Quote sent"`, `hubspot work leads list status:open --format csv > leads.csv`

### `hubspot leads show`

one lead with its pipeline, stage, status, amount and the people on it, and the newest recorded meetings and calls of those people in this account's scope; with the activities setting on, its activities and tasks too

```sh
hubspot leads show <lead>
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: hubspot commands info leads show

**Example:** `hubspot work leads show lead:12`

## `hubspot pipelines`

the CRM's pipelines and their stages, as last synced

### `hubspot pipelines list`

pipelines copied from the CRM, with their stages in order and how many are open in each

```sh
hubspot pipelines list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: hubspot commands info pipelines list

**Example:** `hubspot work pipelines list --json`, `hubspot work pipelines list kind:lead`

### `hubspot pipelines show`

one pipeline as a board and a funnel: how many stand in each stage and their sum per currency, never converted, how many reached it and went on, and the win rate; won and lost stages are marked by outcome

```sh
hubspot pipelines show [pipeline] [options]
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | optional | pipeline:<id>, or a name only one of the CRM's pipelines has; needed unless the CRM has one pipeline in all. |

| Option | What it does |
|---|---|
| `--since-time <time>` | count the rows made at or after this date or time (ISO 8601, or 30d ago). |
| `--until-time <time>` | count the rows made at or before this date or time; a date alone is that whole day. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: hubspot commands info pipelines show

**Example:** `hubspot work pipelines show pipeline:3`, `hubspot work pipelines show Sales --since-time 30d --json`

## `hubspot stages`

the stages of the CRM's pipelines, as last synced

### `hubspot stages list`

every stage of the CRM's pipelines in order, with its outcome and how many are open in it

```sh
hubspot stages list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** stage — name, position, outcome, external_id, open, pipeline, pipeline_name, kind, and 7 more; every field: hubspot commands info stages list

**Example:** `hubspot work stages list --json`, `hubspot work stages list kind:lead`

## `hubspot people`

the CRM's contacts, read live: the copy holds only your own

### `hubspot people list`

contacts in the CRM, newest first; another client is found here, never in the copy

```sh
hubspot people list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | contacts per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: hubspot commands info people list

**Example:** `hubspot work people list`, `hubspot work people list name:anna* --json`, `hubspot work people list --format csv > people.csv`

### `hubspot people show`

one of the CRM's contacts, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
hubspot people show <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the CRM's id of the person, as list prints it, or its exact name. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: hubspot commands info people show

**Example:** `hubspot work people show 42`, `hubspot work people show "Anna Example" --json`

### `hubspot people create`

make a person in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
hubspot people create [options]
```

| Option | What it does |
|---|---|
| `--name <name>` | the whole name. |
| `--first-name <name>` | the first name; empty clears it. |
| `--last-name <name>` | the last name; empty clears it. |
| `--position <title>` | the job title; empty clears it. |
| `--email <address>` | an e-mail address to give it; repeat it for more; replaces its list, and an empty one clears it. |
| `--phone <phone>` | a phone number to give it, in international form starting with +; repeat it for more; replaces its list, and an empty one clears it. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: hubspot commands info people create

**Example:** `hubspot work people create --first-name Anna --last-name Example --position Buyer`

### `hubspot people update`

change a person in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
hubspot people update <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the CRM's id of the person, as list prints it. |

| Option | What it does |
|---|---|
| `--name <name>` | the whole name. |
| `--first-name <name>` | the first name; empty clears it. |
| `--last-name <name>` | the last name; empty clears it. |
| `--position <title>` | the job title; empty clears it. |
| `--email <address>` | an e-mail address to give it; repeat it for more; replaces its list, and an empty one clears it. |
| `--phone <phone>` | a phone number to give it, in international form starting with +; repeat it for more; replaces its list, and an empty one clears it. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: hubspot commands info people update

**Example:** `hubspot work people update 42 --position Buyer`

## `hubspot organizations`

the CRM's companies, read live: the copy holds only your own

### `hubspot organizations list`

companies in the CRM, newest first; another client is found here, never in the copy

```sh
hubspot organizations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | companies per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: hubspot commands info organizations list

**Example:** `hubspot work organizations list`, `hubspot work organizations list name:anna* --json`, `hubspot work organizations list --format csv > organizations.csv`

### `hubspot organizations show`

one of the CRM's companies, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
hubspot organizations show <organization>
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the CRM's id of the organization, as list prints it, or its exact name. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: hubspot commands info organizations show

**Example:** `hubspot work organizations show 42`, `hubspot work organizations show "Anna Example" --json`

### `hubspot organizations create`

make an organization in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
hubspot organizations create [options]
```

| Option | What it does |
|---|---|
| `--name <name>` | the company's name. |
| `--email <address>` | an e-mail address to give it; repeat it for more; replaces its list, and an empty one clears it. |
| `--phone <phone>` | a phone number to give it, in international form starting with +; repeat it for more; replaces its list, and an empty one clears it. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: hubspot commands info organizations create

**Example:** `hubspot work organizations create --name "Example LLC"`

### `hubspot organizations update`

change a organization in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
hubspot organizations update <organization> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the CRM's id of the organization, as list prints it. |

| Option | What it does |
|---|---|
| `--name <name>` | the company's name. |
| `--email <address>` | an e-mail address to give it; repeat it for more; replaces its list, and an empty one clears it. |
| `--phone <phone>` | a phone number to give it, in international form starting with +; repeat it for more; replaces its list, and an empty one clears it. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: hubspot commands info organizations update

**Example:** `hubspot work organizations update 9 --name "Example Ltd"`

## `hubspot users`

the CRM account's users: the people of your own company who own deals

### `hubspot users list`

the CRM's users, read live, in the CRM's order

```sh
hubspot users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | users per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: hubspot commands info users list

**Example:** `hubspot work users list`, `hubspot work users list active:true --json`

### `hubspot users show`

one of the CRM's users, read live

```sh
hubspot users show <user>
```

| Argument | | What it is |
|---|---|---|
| `user` | required | the CRM's id of the user, as list prints it. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: hubspot commands info users show

**Example:** `hubspot work users show 7`

## `hubspot activities`

the CRM's activities and tasks on deals, leads, contacts and companies, as last synced

### `hubspot activities list`

activities copied from the CRM, open ones first by due time, then the rest newest first; status:open unless a status is given; the activities setting must be on

```sh
hubspot activities list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | activities per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** crm activity — external_id, kind, subject, body, due_at, done, done_at, assignee, and 4 more; every field: hubspot commands info activities list

**Example:** `hubspot work activities list overdue:true`, `hubspot work activities list due:today --json`, `hubspot work activities list deal:12 status:done`

## `hubspot changes`

what changed in the CRM's deals, leads, activities and contacts, as the syncs copied it

### `hubspot changes list`

deals and leads made, moved, won, lost and given another owner, activities added and done, and contacts added, newest first; the last day unless at: says otherwise

```sh
hubspot changes list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | changes per page, 1–500. Default: `50`. |
| `--cursor <cursor>` | the next page, as the last answer's page.next gave it. |
| `--format <format>` | csv: this page as a table; report: the window as a morning digest document, for schedule command. Run by a schedule, the report starts where that schedule's last one ended. One of: `csv`, `report`. |

**Returns:** crm change — change, at, kind, ref, external_id, account, title, pipeline, and 10 more; every field: hubspot commands info changes list

**Example:** `hubspot work changes list "at>=1d"`, `hubspot work changes list change:won at>=7d --json`, `hubspot work changes list "at>=1d" --format report`

## `hubspot fields`

the CRM's own fields on deals, leads, people and organizations, as last synced

### `hubspot fields list`

the CRM's custom fields of one kind, in its order, with a list field's options

```sh
hubspot fields list <kind> [query] [options]
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

**Returns:** crm field — code, label, type, multiple, filterable, untrusted, options; every field: hubspot commands info fields list

**Example:** `hubspot work fields list deals`, `hubspot work fields list people --json`

## `hubspot search`

search what the local store holds

### `hubspot search all`

search the CRM's deals and leads by the words of their title, company, contacts and activities, and the messages, notes, calendar events and meetings other WireCat tools stored — best match first. Use it when you do not know where something was written

```sh
hubspot search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words and "phrases"; deals and leads match the words of their title, company, contacts and activities. |

| Option | What it does |
|---|---|
| `--only <resources>` | only these resources, separated by commas: crm, messages, notes, events, meetings. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 18 more; every field: hubspot commands info search all

**Example:** `hubspot work search all Example LLC`, `hubspot work search all website --only crm --json`

## `hubspot api`

the raw HubSpot API, one command per operation of its OpenAPI document

### `hubspot api list`

list every HubSpot API operation this CLI offers, without calling HubSpot

```sh
hubspot api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `hubspot personal api list`, `hubspot personal api list effect:destructive --json=command,path`

### `hubspot api show`

show one operation's parameters and request schema, without calling HubSpot

```sh
hubspot api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `hubspot personal api show "contacts-list" --json`

### `hubspot api contacts-list`

Retrieve contacts — read (GET /crm/objects/2026-03/contacts)

```sh
hubspot api contacts-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api contacts-list`

### `hubspot api contacts-create`

Create a contact — write (POST /crm/objects/2026-03/contacts)

**Changes something in the service.**

```sh
hubspot api contacts-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-create`

### `hubspot api contacts-batch-archive`

Archive a batch of contacts — destructive (POST /crm/objects/2026-03/contacts/batch/archive)

**Changes something in the service.**

```sh
hubspot api contacts-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-batch-archive`

### `hubspot api contacts-batch-create`

Create a batch of contacts — write (POST /crm/objects/2026-03/contacts/batch/create)

**Changes something in the service.**

```sh
hubspot api contacts-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-batch-create`

### `hubspot api contacts-batch-read`

Retrieve a batch of contacts — read (POST /crm/objects/2026-03/contacts/batch/read)

```sh
hubspot api contacts-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-batch-read`

### `hubspot api contacts-batch-update`

Update a batch of contacts — write (POST /crm/objects/2026-03/contacts/batch/update)

**Changes something in the service.**

```sh
hubspot api contacts-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-batch-update`

### `hubspot api contacts-batch-upsert`

Create or update a batch of contacts — write (POST /crm/objects/2026-03/contacts/batch/upsert)

**Changes something in the service.**

```sh
hubspot api contacts-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-batch-upsert`

### `hubspot api contacts-gdpr-delete`

Permanently delete a contact (GDPR-compliant) — destructive (POST /crm/objects/2026-03/contacts/gdpr-delete)

**Changes something in the service.**

```sh
hubspot api contacts-gdpr-delete [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-gdpr-delete`

### `hubspot api contacts-merge`

Merge two contacts — destructive (POST /crm/objects/2026-03/contacts/merge)

**Changes something in the service.**

```sh
hubspot api contacts-merge [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-merge`

### `hubspot api contacts-search`

Search for contacts — read (POST /crm/objects/2026-03/contacts/search)

```sh
hubspot api contacts-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api contacts-search`

### `hubspot api contacts-get`

Retrieve a contact — read (GET /crm/objects/2026-03/contacts/{contactId})

```sh
hubspot api contacts-get [options]
```

| Option | What it does |
|---|---|
| `--contact-id <value>` | contactId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api contacts-get --contact-id <value>`

### `hubspot api contacts-update`

Update a contact — write (PATCH /crm/objects/2026-03/contacts/{contactId})

**Changes something in the service.**

```sh
hubspot api contacts-update [options]
```

| Option | What it does |
|---|---|
| `--contact-id <value>` | contactId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api contacts-update --contact-id <value>`

### `hubspot api contacts-delete`

Archive a contact — destructive (DELETE /crm/objects/2026-03/contacts/{contactId})

**Changes something in the service.**

```sh
hubspot api contacts-delete [options]
```

| Option | What it does |
|---|---|
| `--contact-id <value>` | contactId. |

**Example:** `hubspot personal api contacts-delete --contact-id <value>`

### `hubspot api associations-default-replace`

— write (PUT /crm/objects/2026-03/{fromObjectType}/{fromObjectId}/associations/default/{toObjectType}/{toObjectId})

**Changes something in the service.**

```sh
hubspot api associations-default-replace [options]
```

| Option | What it does |
|---|---|
| `--from-object-id <value>` | fromObjectId. |
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-id <value>` | toObjectId. |
| `--to-object-type <value>` | toObjectType. |

**Example:** `hubspot personal api associations-default-replace --from-object-id <value> --from-object-type <value> --to-object-id <value> --to-object-type <value>`

### `hubspot api associations-replace`

— write (PUT /crm/objects/2026-03/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId})

**Changes something in the service.**

```sh
hubspot api associations-replace [options]
```

| Option | What it does |
|---|---|
| `--object-id <value>` | objectId. |
| `--object-type <value>` | objectType. |
| `--to-object-id <value>` | toObjectId. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-replace --object-id <value> --object-type <value> --to-object-id <value> --to-object-type <value>`

### `hubspot api associations-delete`

— destructive (DELETE /crm/objects/2026-03/{objectType}/{objectId}/associations/{toObjectType}/{toObjectId})

**Changes something in the service.**

```sh
hubspot api associations-delete [options]
```

| Option | What it does |
|---|---|
| `--object-id <value>` | objectId. |
| `--object-type <value>` | objectType. |
| `--to-object-id <value>` | toObjectId. |
| `--to-object-type <value>` | toObjectType. |

**Example:** `hubspot personal api associations-delete --object-id <value> --object-type <value> --to-object-id <value> --to-object-type <value>`

### `hubspot api companies-list`

Retrieve companies — read (GET /crm/objects/2026-03/companies)

```sh
hubspot api companies-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api companies-list`

### `hubspot api companies-create`

Create a company — write (POST /crm/objects/2026-03/companies)

**Changes something in the service.**

```sh
hubspot api companies-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-create`

### `hubspot api companies-batch-archive`

Archive a batch of companies — destructive (POST /crm/objects/2026-03/companies/batch/archive)

**Changes something in the service.**

```sh
hubspot api companies-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-batch-archive`

### `hubspot api companies-batch-create`

Create a batch of companies — write (POST /crm/objects/2026-03/companies/batch/create)

**Changes something in the service.**

```sh
hubspot api companies-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-batch-create`

### `hubspot api companies-batch-read`

Retrieve a batch of companies — read (POST /crm/objects/2026-03/companies/batch/read)

```sh
hubspot api companies-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-batch-read`

### `hubspot api companies-batch-update`

Update a batch of companies — write (POST /crm/objects/2026-03/companies/batch/update)

**Changes something in the service.**

```sh
hubspot api companies-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-batch-update`

### `hubspot api companies-batch-upsert`

Create or update a batch of companies by unique property values — write (POST /crm/objects/2026-03/companies/batch/upsert)

**Changes something in the service.**

```sh
hubspot api companies-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-batch-upsert`

### `hubspot api companies-merge`

Merge two companies — destructive (POST /crm/objects/2026-03/companies/merge)

**Changes something in the service.**

```sh
hubspot api companies-merge [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-merge`

### `hubspot api companies-search`

Search for companies — read (POST /crm/objects/2026-03/companies/search)

```sh
hubspot api companies-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api companies-search`

### `hubspot api companies-get`

Retrieve a company — read (GET /crm/objects/2026-03/companies/{companyId})

```sh
hubspot api companies-get [options]
```

| Option | What it does |
|---|---|
| `--company-id <value>` | companyId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api companies-get --company-id <value>`

### `hubspot api companies-update`

Update a company — write (PATCH /crm/objects/2026-03/companies/{companyId})

**Changes something in the service.**

```sh
hubspot api companies-update [options]
```

| Option | What it does |
|---|---|
| `--company-id <value>` | companyId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api companies-update --company-id <value>`

### `hubspot api companies-delete`

Archive a company — destructive (DELETE /crm/objects/2026-03/companies/{companyId})

**Changes something in the service.**

```sh
hubspot api companies-delete [options]
```

| Option | What it does |
|---|---|
| `--company-id <value>` | companyId. |

**Example:** `hubspot personal api companies-delete --company-id <value>`

### `hubspot api deals-list`

List — read (GET /crm/objects/2026-03/0-3)

```sh
hubspot api deals-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api deals-list`

### `hubspot api deals-create`

Create — write (POST /crm/objects/2026-03/0-3)

**Changes something in the service.**

```sh
hubspot api deals-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-create`

### `hubspot api deals-batch-archive`

Archive a batch of deals by ID — destructive (POST /crm/objects/2026-03/0-3/batch/archive)

**Changes something in the service.**

```sh
hubspot api deals-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-batch-archive`

### `hubspot api deals-batch-create`

Create a batch of deals — write (POST /crm/objects/2026-03/0-3/batch/create)

**Changes something in the service.**

```sh
hubspot api deals-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-batch-create`

### `hubspot api deals-batch-read`

Read a batch of deals by internal ID, or unique property values — read (POST /crm/objects/2026-03/0-3/batch/read)

```sh
hubspot api deals-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-batch-read`

### `hubspot api deals-batch-update`

Update a batch of deals by internal ID, or unique property values — write (POST /crm/objects/2026-03/0-3/batch/update)

**Changes something in the service.**

```sh
hubspot api deals-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-batch-update`

### `hubspot api deals-batch-upsert`

Create or update a batch of deals by unique property values — write (POST /crm/objects/2026-03/0-3/batch/upsert)

**Changes something in the service.**

```sh
hubspot api deals-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-batch-upsert`

### `hubspot api deals-merge`

Merge two deals with same type — destructive (POST /crm/objects/2026-03/0-3/merge)

**Changes something in the service.**

```sh
hubspot api deals-merge [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-merge`

### `hubspot api deals-search`

Search for deals using various filters and criteria to retrieve specific records. — read (POST /crm/objects/2026-03/0-3/search)

```sh
hubspot api deals-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api deals-search`

### `hubspot api deals-get`

Read — read (GET /crm/objects/2026-03/0-3/{dealId})

```sh
hubspot api deals-get [options]
```

| Option | What it does |
|---|---|
| `--deal-id <value>` | dealId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api deals-get --deal-id <value>`

### `hubspot api deals-update`

Update — write (PATCH /crm/objects/2026-03/0-3/{dealId})

**Changes something in the service.**

```sh
hubspot api deals-update [options]
```

| Option | What it does |
|---|---|
| `--deal-id <value>` | dealId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api deals-update --deal-id <value>`

### `hubspot api deals-delete`

Archive — destructive (DELETE /crm/objects/2026-03/0-3/{dealId})

**Changes something in the service.**

```sh
hubspot api deals-delete [options]
```

| Option | What it does |
|---|---|
| `--deal-id <value>` | dealId. |

**Example:** `hubspot personal api deals-delete --deal-id <value>`

### `hubspot api tickets-list`

List — read (GET /crm/objects/2026-03/tickets)

```sh
hubspot api tickets-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api tickets-list`

### `hubspot api tickets-create`

Create — write (POST /crm/objects/2026-03/tickets)

**Changes something in the service.**

```sh
hubspot api tickets-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-create`

### `hubspot api tickets-batch-archive`

Archive a batch of tickets by ID — destructive (POST /crm/objects/2026-03/tickets/batch/archive)

**Changes something in the service.**

```sh
hubspot api tickets-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-batch-archive`

### `hubspot api tickets-batch-create`

Create a batch of tickets — write (POST /crm/objects/2026-03/tickets/batch/create)

**Changes something in the service.**

```sh
hubspot api tickets-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-batch-create`

### `hubspot api tickets-batch-read`

Read a batch of tickets by internal ID, or unique property values — read (POST /crm/objects/2026-03/tickets/batch/read)

```sh
hubspot api tickets-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-batch-read`

### `hubspot api tickets-batch-update`

Update a batch of tickets by internal ID, or unique property values — write (POST /crm/objects/2026-03/tickets/batch/update)

**Changes something in the service.**

```sh
hubspot api tickets-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-batch-update`

### `hubspot api tickets-batch-upsert`

Create or update a batch of tickets by unique property values — write (POST /crm/objects/2026-03/tickets/batch/upsert)

**Changes something in the service.**

```sh
hubspot api tickets-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-batch-upsert`

### `hubspot api tickets-merge`

Merge two tickets — destructive (POST /crm/objects/2026-03/tickets/merge)

**Changes something in the service.**

```sh
hubspot api tickets-merge [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-merge`

### `hubspot api tickets-search`

Search for tickets — read (POST /crm/objects/2026-03/tickets/search)

```sh
hubspot api tickets-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api tickets-search`

### `hubspot api tickets-get`

Read — read (GET /crm/objects/2026-03/tickets/{ticketId})

```sh
hubspot api tickets-get [options]
```

| Option | What it does |
|---|---|
| `--ticket-id <value>` | ticketId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api tickets-get --ticket-id <value>`

### `hubspot api tickets-update`

Update — write (PATCH /crm/objects/2026-03/tickets/{ticketId})

**Changes something in the service.**

```sh
hubspot api tickets-update [options]
```

| Option | What it does |
|---|---|
| `--ticket-id <value>` | ticketId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tickets-update --ticket-id <value>`

### `hubspot api tickets-delete`

Archive — destructive (DELETE /crm/objects/2026-03/tickets/{ticketId})

**Changes something in the service.**

```sh
hubspot api tickets-delete [options]
```

| Option | What it does |
|---|---|
| `--ticket-id <value>` | ticketId. |

**Example:** `hubspot personal api tickets-delete --ticket-id <value>`

### `hubspot api leads-list`

List — read (GET /crm/objects/2026-03/leads)

```sh
hubspot api leads-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api leads-list`

### `hubspot api leads-create`

Create — write (POST /crm/objects/2026-03/leads)

**Changes something in the service.**

```sh
hubspot api leads-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-create`

### `hubspot api leads-batch-archive`

Archive a batch of leads by ID — destructive (POST /crm/objects/2026-03/leads/batch/archive)

**Changes something in the service.**

```sh
hubspot api leads-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-batch-archive`

### `hubspot api leads-batch-create`

Create a batch of leads — write (POST /crm/objects/2026-03/leads/batch/create)

**Changes something in the service.**

```sh
hubspot api leads-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-batch-create`

### `hubspot api leads-batch-read`

Read a batch of leads by internal ID, or unique property values — read (POST /crm/objects/2026-03/leads/batch/read)

```sh
hubspot api leads-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-batch-read`

### `hubspot api leads-batch-update`

Update a batch of leads by internal ID, or unique property values — write (POST /crm/objects/2026-03/leads/batch/update)

**Changes something in the service.**

```sh
hubspot api leads-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-batch-update`

### `hubspot api leads-batch-upsert`

Create or update a batch of leads by unique property values — write (POST /crm/objects/2026-03/leads/batch/upsert)

**Changes something in the service.**

```sh
hubspot api leads-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-batch-upsert`

### `hubspot api leads-search`

Search for leads using specified criteria. — read (POST /crm/objects/2026-03/leads/search)

```sh
hubspot api leads-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api leads-search`

### `hubspot api leads-get`

Read — read (GET /crm/objects/2026-03/leads/{leadsId})

```sh
hubspot api leads-get [options]
```

| Option | What it does |
|---|---|
| `--leads-id <value>` | leadsId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api leads-get --leads-id <value>`

### `hubspot api leads-update`

Update — write (PATCH /crm/objects/2026-03/leads/{leadsId})

**Changes something in the service.**

```sh
hubspot api leads-update [options]
```

| Option | What it does |
|---|---|
| `--leads-id <value>` | leadsId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api leads-update --leads-id <value>`

### `hubspot api leads-delete`

Archive — destructive (DELETE /crm/objects/2026-03/leads/{leadsId})

**Changes something in the service.**

```sh
hubspot api leads-delete [options]
```

| Option | What it does |
|---|---|
| `--leads-id <value>` | leadsId. |

**Example:** `hubspot personal api leads-delete --leads-id <value>`

### `hubspot api notes-list`

List — read (GET /crm/objects/2026-03/notes)

```sh
hubspot api notes-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api notes-list`

### `hubspot api notes-create`

Create — write (POST /crm/objects/2026-03/notes)

**Changes something in the service.**

```sh
hubspot api notes-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-create`

### `hubspot api notes-batch-archive`

Archive a batch of notes by ID — destructive (POST /crm/objects/2026-03/notes/batch/archive)

**Changes something in the service.**

```sh
hubspot api notes-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-batch-archive`

### `hubspot api notes-batch-create`

Create a batch of notes — write (POST /crm/objects/2026-03/notes/batch/create)

**Changes something in the service.**

```sh
hubspot api notes-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-batch-create`

### `hubspot api notes-batch-read`

Read a batch of notes by internal ID, or unique property values — read (POST /crm/objects/2026-03/notes/batch/read)

```sh
hubspot api notes-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-batch-read`

### `hubspot api notes-batch-update`

Update a batch of notes by internal ID, or unique property values — write (POST /crm/objects/2026-03/notes/batch/update)

**Changes something in the service.**

```sh
hubspot api notes-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-batch-update`

### `hubspot api notes-batch-upsert`

Create or update a batch of notes by unique property values — write (POST /crm/objects/2026-03/notes/batch/upsert)

**Changes something in the service.**

```sh
hubspot api notes-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-batch-upsert`

### `hubspot api notes-search`

Search for notes based on specified criteria. — read (POST /crm/objects/2026-03/notes/search)

```sh
hubspot api notes-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api notes-search`

### `hubspot api notes-get`

Read — read (GET /crm/objects/2026-03/notes/{noteId})

```sh
hubspot api notes-get [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | noteId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api notes-get --note-id <value>`

### `hubspot api notes-update`

Update — write (PATCH /crm/objects/2026-03/notes/{noteId})

**Changes something in the service.**

```sh
hubspot api notes-update [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | noteId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api notes-update --note-id <value>`

### `hubspot api notes-delete`

Archive — destructive (DELETE /crm/objects/2026-03/notes/{noteId})

**Changes something in the service.**

```sh
hubspot api notes-delete [options]
```

| Option | What it does |
|---|---|
| `--note-id <value>` | noteId. |

**Example:** `hubspot personal api notes-delete --note-id <value>`

### `hubspot api calls-list`

List — read (GET /crm/objects/2026-03/calls)

```sh
hubspot api calls-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api calls-list`

### `hubspot api calls-create`

Create — write (POST /crm/objects/2026-03/calls)

**Changes something in the service.**

```sh
hubspot api calls-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-create`

### `hubspot api calls-batch-archive`

Archive a batch of calls by ID — destructive (POST /crm/objects/2026-03/calls/batch/archive)

**Changes something in the service.**

```sh
hubspot api calls-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-batch-archive`

### `hubspot api calls-batch-create`

Create a batch of calls — write (POST /crm/objects/2026-03/calls/batch/create)

**Changes something in the service.**

```sh
hubspot api calls-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-batch-create`

### `hubspot api calls-batch-read`

Read a batch of calls by internal ID, or unique property values — read (POST /crm/objects/2026-03/calls/batch/read)

```sh
hubspot api calls-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-batch-read`

### `hubspot api calls-batch-update`

Update a batch of calls by internal ID, or unique property values — write (POST /crm/objects/2026-03/calls/batch/update)

**Changes something in the service.**

```sh
hubspot api calls-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-batch-update`

### `hubspot api calls-batch-upsert`

Create or update a batch of calls by unique property values — write (POST /crm/objects/2026-03/calls/batch/upsert)

**Changes something in the service.**

```sh
hubspot api calls-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-batch-upsert`

### `hubspot api calls-search`

Search for calls — read (POST /crm/objects/2026-03/calls/search)

```sh
hubspot api calls-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api calls-search`

### `hubspot api calls-get`

Read — read (GET /crm/objects/2026-03/calls/{callId})

```sh
hubspot api calls-get [options]
```

| Option | What it does |
|---|---|
| `--call-id <value>` | callId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api calls-get --call-id <value>`

### `hubspot api calls-update`

Update — write (PATCH /crm/objects/2026-03/calls/{callId})

**Changes something in the service.**

```sh
hubspot api calls-update [options]
```

| Option | What it does |
|---|---|
| `--call-id <value>` | callId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api calls-update --call-id <value>`

### `hubspot api calls-delete`

Archive — destructive (DELETE /crm/objects/2026-03/calls/{callId})

**Changes something in the service.**

```sh
hubspot api calls-delete [options]
```

| Option | What it does |
|---|---|
| `--call-id <value>` | callId. |

**Example:** `hubspot personal api calls-delete --call-id <value>`

### `hubspot api emails-list`

List — read (GET /crm/objects/2026-03/emails)

```sh
hubspot api emails-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api emails-list`

### `hubspot api emails-create`

Create — write (POST /crm/objects/2026-03/emails)

**Changes something in the service.**

```sh
hubspot api emails-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-create`

### `hubspot api emails-batch-archive`

Archive a batch of emails by ID — destructive (POST /crm/objects/2026-03/emails/batch/archive)

**Changes something in the service.**

```sh
hubspot api emails-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-batch-archive`

### `hubspot api emails-batch-create`

Create a batch of emails — write (POST /crm/objects/2026-03/emails/batch/create)

**Changes something in the service.**

```sh
hubspot api emails-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-batch-create`

### `hubspot api emails-batch-read`

Read a batch of emails by internal ID, or unique property values — read (POST /crm/objects/2026-03/emails/batch/read)

```sh
hubspot api emails-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-batch-read`

### `hubspot api emails-batch-update`

Update a batch of emails by internal ID, or unique property values — write (POST /crm/objects/2026-03/emails/batch/update)

**Changes something in the service.**

```sh
hubspot api emails-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-batch-update`

### `hubspot api emails-batch-upsert`

Create or update a batch of emails by unique property values — write (POST /crm/objects/2026-03/emails/batch/upsert)

**Changes something in the service.**

```sh
hubspot api emails-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-batch-upsert`

### `hubspot api emails-search`

Search for emails using specified criteria and filters. — read (POST /crm/objects/2026-03/emails/search)

```sh
hubspot api emails-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api emails-search`

### `hubspot api emails-get`

Read — read (GET /crm/objects/2026-03/emails/{emailId})

```sh
hubspot api emails-get [options]
```

| Option | What it does |
|---|---|
| `--email-id <value>` | emailId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api emails-get --email-id <value>`

### `hubspot api emails-update`

Update — write (PATCH /crm/objects/2026-03/emails/{emailId})

**Changes something in the service.**

```sh
hubspot api emails-update [options]
```

| Option | What it does |
|---|---|
| `--email-id <value>` | emailId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api emails-update --email-id <value>`

### `hubspot api emails-delete`

Archive — destructive (DELETE /crm/objects/2026-03/emails/{emailId})

**Changes something in the service.**

```sh
hubspot api emails-delete [options]
```

| Option | What it does |
|---|---|
| `--email-id <value>` | emailId. |

**Example:** `hubspot personal api emails-delete --email-id <value>`

### `hubspot api meetings-list`

List — read (GET /crm/objects/2026-03/meetings)

```sh
hubspot api meetings-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api meetings-list`

### `hubspot api meetings-create`

Create — write (POST /crm/objects/2026-03/meetings)

**Changes something in the service.**

```sh
hubspot api meetings-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-create`

### `hubspot api meetings-batch-archive`

Archive a batch of meetings by ID — destructive (POST /crm/objects/2026-03/meetings/batch/archive)

**Changes something in the service.**

```sh
hubspot api meetings-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-batch-archive`

### `hubspot api meetings-batch-create`

Create a batch of meetings — write (POST /crm/objects/2026-03/meetings/batch/create)

**Changes something in the service.**

```sh
hubspot api meetings-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-batch-create`

### `hubspot api meetings-batch-read`

Read a batch of meetings by internal ID, or unique property values — read (POST /crm/objects/2026-03/meetings/batch/read)

```sh
hubspot api meetings-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-batch-read`

### `hubspot api meetings-batch-update`

Update a batch of meetings by internal ID, or unique property values — write (POST /crm/objects/2026-03/meetings/batch/update)

**Changes something in the service.**

```sh
hubspot api meetings-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-batch-update`

### `hubspot api meetings-batch-upsert`

Create or update a batch of meetings by unique property values — write (POST /crm/objects/2026-03/meetings/batch/upsert)

**Changes something in the service.**

```sh
hubspot api meetings-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-batch-upsert`

### `hubspot api meetings-search`

Search for meetings — read (POST /crm/objects/2026-03/meetings/search)

```sh
hubspot api meetings-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api meetings-search`

### `hubspot api meetings-get`

Read — read (GET /crm/objects/2026-03/meetings/{meetingId})

```sh
hubspot api meetings-get [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meetingId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api meetings-get --meeting-id <value>`

### `hubspot api meetings-update`

Update — write (PATCH /crm/objects/2026-03/meetings/{meetingId})

**Changes something in the service.**

```sh
hubspot api meetings-update [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meetingId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api meetings-update --meeting-id <value>`

### `hubspot api meetings-delete`

Archive — destructive (DELETE /crm/objects/2026-03/meetings/{meetingId})

**Changes something in the service.**

```sh
hubspot api meetings-delete [options]
```

| Option | What it does |
|---|---|
| `--meeting-id <value>` | meetingId. |

**Example:** `hubspot personal api meetings-delete --meeting-id <value>`

### `hubspot api tasks-list`

List — read (GET /crm/objects/2026-03/tasks)

```sh
hubspot api tasks-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. Usage of this parameter will reduce the maximum number of objects that can be read by a single request. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api tasks-list`

### `hubspot api tasks-create`

Create — write (POST /crm/objects/2026-03/tasks)

**Changes something in the service.**

```sh
hubspot api tasks-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-create`

### `hubspot api tasks-batch-archive`

Archive a batch of tasks by ID — destructive (POST /crm/objects/2026-03/tasks/batch/archive)

**Changes something in the service.**

```sh
hubspot api tasks-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-batch-archive`

### `hubspot api tasks-batch-create`

Create a batch of tasks — write (POST /crm/objects/2026-03/tasks/batch/create)

**Changes something in the service.**

```sh
hubspot api tasks-batch-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-batch-create`

### `hubspot api tasks-batch-read`

Read a batch of tasks by internal ID, or unique property values — read (POST /crm/objects/2026-03/tasks/batch/read)

```sh
hubspot api tasks-batch-read [options]
```

| Option | What it does |
|---|---|
| `--archived <value>` | Whether to return only results that have been archived. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-batch-read`

### `hubspot api tasks-batch-update`

Update a batch of tasks by internal ID, or unique property values — write (POST /crm/objects/2026-03/tasks/batch/update)

**Changes something in the service.**

```sh
hubspot api tasks-batch-update [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-batch-update`

### `hubspot api tasks-batch-upsert`

Create or update a batch of tasks by unique property values — write (POST /crm/objects/2026-03/tasks/batch/upsert)

**Changes something in the service.**

```sh
hubspot api tasks-batch-upsert [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-batch-upsert`

### `hubspot api tasks-search`

Search for tasks using specified criteria. — read (POST /crm/objects/2026-03/tasks/search)

```sh
hubspot api tasks-search [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api tasks-search`

### `hubspot api tasks-get`

Read — read (GET /crm/objects/2026-03/tasks/{taskId})

```sh
hubspot api tasks-get [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | taskId. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--associations <value>` | A comma separated list of object types to retrieve associated IDs for. If any of the specified associations do not exist, they will be ignored. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--properties <value>` | A comma separated list of the properties to be returned in the response. If any of the specified properties are not present on the requested object(s), they will be ignored. |
| `--properties-with-history <value>` | A comma separated list of the properties to be returned along with their history of previous values. If any of the specified properties are not present on the requested object(s), they will be ignored. |

**Example:** `hubspot personal api tasks-get --task-id <value>`

### `hubspot api tasks-update`

Update — write (PATCH /crm/objects/2026-03/tasks/{taskId})

**Changes something in the service.**

```sh
hubspot api tasks-update [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | taskId. |
| `--id-property <value>` | The name of a property whose values are unique for this object type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api tasks-update --task-id <value>`

### `hubspot api tasks-delete`

Archive — destructive (DELETE /crm/objects/2026-03/tasks/{taskId})

**Changes something in the service.**

```sh
hubspot api tasks-delete [options]
```

| Option | What it does |
|---|---|
| `--task-id <value>` | taskId. |

**Example:** `hubspot personal api tasks-delete --task-id <value>`

### `hubspot api owners-list`

List owners — read (GET /crm/owners/2026-03)

```sh
hubspot api owners-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--email <value>` | Filter by email address (optional). |
| `--limit <value>` | The maximum number of results to display per page. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api owners-list`

### `hubspot api owners-get`

Retrieve a specific owner by ID — read (GET /crm/owners/2026-03/{ownerId})

```sh
hubspot api owners-get [options]
```

| Option | What it does |
|---|---|
| `--owner-id <value>` | The unique identifier of the owner to retrieve. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--id-property <value>` | Specifies which property to use for identifying the owner. Valid values are 'id' or 'userId'. Defaults to 'id'. |

**Example:** `hubspot personal api owners-get --owner-id <value>`

### `hubspot api pipelines-list`

Retrieve all pipelines — read (GET /crm/pipelines/2026-03/{objectType})

```sh
hubspot api pipelines-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |

**Example:** `hubspot personal api pipelines-list --object-type <value>`

### `hubspot api pipelines-create`

Create a pipeline — write (POST /crm/pipelines/2026-03/{objectType})

**Changes something in the service.**

```sh
hubspot api pipelines-create [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-create --object-type <value>`

### `hubspot api pipelines-get`

Return a pipeline by ID — read (GET /crm/pipelines/2026-03/{objectType}/{pipelineId})

```sh
hubspot api pipelines-get [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |

**Example:** `hubspot personal api pipelines-get --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-replace`

Replace a pipeline — destructive (PUT /crm/pipelines/2026-03/{objectType}/{pipelineId})

**Changes something in the service.**

```sh
hubspot api pipelines-replace [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--validate-deal-stage-usages-before-delete <value>` | validateDealStageUsagesBeforeDelete. |
| `--validate-references-before-delete <value>` | validateReferencesBeforeDelete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-replace --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-update`

Perform a partial update of the pipeline identified by pipelineId. — write (PATCH /crm/pipelines/2026-03/{objectType}/{pipelineId})

**Changes something in the service.**

```sh
hubspot api pipelines-update [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--validate-deal-stage-usages-before-delete <value>` | validateDealStageUsagesBeforeDelete. |
| `--validate-references-before-delete <value>` | validateReferencesBeforeDelete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-update --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-delete`

Delete a pipeline — destructive (DELETE /crm/pipelines/2026-03/{objectType}/{pipelineId})

**Changes something in the service.**

```sh
hubspot api pipelines-delete [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--validate-deal-stage-usages-before-delete <value>` | validateDealStageUsagesBeforeDelete. |
| `--validate-references-before-delete <value>` | validateReferencesBeforeDelete. |

**Example:** `hubspot personal api pipelines-delete --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-audit-list`

Return an audit of all changes to the pipeline — read (GET /crm/pipelines/2026-03/{objectType}/{pipelineId}/audit)

```sh
hubspot api pipelines-audit-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |

**Example:** `hubspot personal api pipelines-audit-list --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-stages-list`

Return all stages of a pipeline — read (GET /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages)

```sh
hubspot api pipelines-stages-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |

**Example:** `hubspot personal api pipelines-stages-list --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-stages-create`

Create a pipeline stage — write (POST /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages)

**Changes something in the service.**

```sh
hubspot api pipelines-stages-create [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-stages-create --object-type <value> --pipeline-id <value>`

### `hubspot api pipelines-stages-get`

Return a pipeline stage by ID — read (GET /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages/{stageId})

```sh
hubspot api pipelines-stages-get [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--stage-id <value>` | stageId. |

**Example:** `hubspot personal api pipelines-stages-get --object-type <value> --pipeline-id <value> --stage-id <value>`

### `hubspot api pipelines-stages-replace`

Replace a pipeline stage — write (PUT /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages/{stageId})

**Changes something in the service.**

```sh
hubspot api pipelines-stages-replace [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--stage-id <value>` | stageId. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-stages-replace --object-type <value> --pipeline-id <value> --stage-id <value>`

### `hubspot api pipelines-stages-update`

Update specific properties of an existing pipeline stage. — write (PATCH /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages/{stageId})

**Changes something in the service.**

```sh
hubspot api pipelines-stages-update [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--stage-id <value>` | stageId. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api pipelines-stages-update --object-type <value> --pipeline-id <value> --stage-id <value>`

### `hubspot api pipelines-stages-delete`

Delete a pipeline stage — destructive (DELETE /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages/{stageId})

**Changes something in the service.**

```sh
hubspot api pipelines-stages-delete [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--stage-id <value>` | stageId. |
| `--validate-references-before-delete <value>` | validateReferencesBeforeDelete. |

**Example:** `hubspot personal api pipelines-stages-delete --object-type <value> --pipeline-id <value> --stage-id <value>`

### `hubspot api pipelines-stages-audit-list`

Retrieve a reverse chronological list of all changes made to a specific pipeline stage. — read (GET /crm/pipelines/2026-03/{objectType}/{pipelineId}/stages/{stageId}/audit)

```sh
hubspot api pipelines-stages-audit-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--pipeline-id <value>` | pipelineId. |
| `--stage-id <value>` | stageId. |

**Example:** `hubspot personal api pipelines-stages-audit-list --object-type <value> --pipeline-id <value> --stage-id <value>`

### `hubspot api properties-list`

Read all properties — read (GET /crm/properties/2026-03/{objectType})

```sh
hubspot api properties-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of CRM object for which properties are being retrieved, such as 'contacts', 'companies', etc. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--data-sensitivity <value>` | Filter properties based on data sensitivity level. Valid values are 'non_sensitive', 'sensitive', and 'highly_sensitive'. Defaults to 'non_sensitive'. |
| `--locale <value>` | Specify the locale to retrieve properties in a particular language or regional format. |
| `--properties <value>` | A comma-separated list of property names to include in the response. |

**Example:** `hubspot personal api properties-list --object-type <value>`

### `hubspot api properties-create`

Create a property — write (POST /crm/properties/2026-03/{objectType})

**Changes something in the service.**

```sh
hubspot api properties-create [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of object for which the property is being created, such as contacts, companies, or deals. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-create --object-type <value>`

### `hubspot api properties-batch-archive`

Archive a batch of properties — destructive (POST /crm/properties/2026-03/{objectType}/batch/archive)

**Changes something in the service.**

```sh
hubspot api properties-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of object whose properties are to be archived. This is a required parameter and identifies the specific object type within HubSpot. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-batch-archive --object-type <value>`

### `hubspot api properties-batch-create`

Create a batch of properties — write (POST /crm/properties/2026-03/{objectType}/batch/create)

**Changes something in the service.**

```sh
hubspot api properties-batch-create [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of CRM object for which the properties are being created, such as contacts, companies, or deals. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-batch-create --object-type <value>`

### `hubspot api properties-batch-read`

Read a batch of properties — read (POST /crm/properties/2026-03/{objectType}/batch/read)

```sh
hubspot api properties-batch-read [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of CRM object for which properties are being retrieved. This is a required path parameter. |
| `--locale <value>` | A string specifying the locale to use for the response. This can be used to tailor the response to a specific language or region. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-batch-read --object-type <value>`

### `hubspot api properties-groups-list`

Read all property groups — read (GET /crm/properties/2026-03/{objectType}/groups)

```sh
hubspot api properties-groups-list [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of CRM object for which to retrieve property groups, such as 'contacts' or 'deals'. |
| `--locale <value>` | The language locale to use for property group labels. This can help in displaying labels in the preferred language. |

**Example:** `hubspot personal api properties-groups-list --object-type <value>`

### `hubspot api properties-groups-create`

Create a property group — write (POST /crm/properties/2026-03/{objectType}/groups)

**Changes something in the service.**

```sh
hubspot api properties-groups-create [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of object for which the property group is being created, such as contacts, companies, or deals. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-groups-create --object-type <value>`

### `hubspot api properties-groups-get`

Read a property group — read (GET /crm/properties/2026-03/{objectType}/groups/{groupName})

```sh
hubspot api properties-groups-get [options]
```

| Option | What it does |
|---|---|
| `--group-name <value>` | The name of the property group to retrieve details for. |
| `--object-type <value>` | The type of CRM object for which the property group is being retrieved, such as contacts or deals. |
| `--locale <value>` | The language locale to use for the response. This can affect the language of the labels and descriptions returned. |

**Example:** `hubspot personal api properties-groups-get --group-name <value> --object-type <value>`

### `hubspot api properties-groups-update`

Update a property group — write (PATCH /crm/properties/2026-03/{objectType}/groups/{groupName})

**Changes something in the service.**

```sh
hubspot api properties-groups-update [options]
```

| Option | What it does |
|---|---|
| `--group-name <value>` | The name of the property group to update. |
| `--object-type <value>` | The type of object for which the property group is being updated, such as contacts, companies, or deals. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-groups-update --group-name <value> --object-type <value>`

### `hubspot api properties-groups-delete`

Archive a property group — destructive (DELETE /crm/properties/2026-03/{objectType}/groups/{groupName})

**Changes something in the service.**

```sh
hubspot api properties-groups-delete [options]
```

| Option | What it does |
|---|---|
| `--group-name <value>` | The unique name of the property group to be deleted. |
| `--object-type <value>` | The type of object for which the property group is defined, such as contacts, companies, or deals. |

**Example:** `hubspot personal api properties-groups-delete --group-name <value> --object-type <value>`

### `hubspot api properties-get`

Read a property — read (GET /crm/properties/2026-03/{objectType}/{propertyName})

```sh
hubspot api properties-get [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of object the property belongs to, such as 'contacts' or 'deals'. |
| `--property-name <value>` | The name of the property to retrieve. |
| `--archived <value>` | Whether to return only results that have been archived. |
| `--data-sensitivity <value>` | The level of data sensitivity to filter properties by. Valid values are 'non_sensitive', 'sensitive', and 'highly_sensitive'. Defaults to 'non_sensitive'. |
| `--locale <value>` | The locale to use for property labels and descriptions. |
| `--properties <value>` | A comma-separated list of property names to include in the response. |

**Example:** `hubspot personal api properties-get --object-type <value> --property-name <value>`

### `hubspot api properties-update`

Update a property — write (PATCH /crm/properties/2026-03/{objectType}/{propertyName})

**Changes something in the service.**

```sh
hubspot api properties-update [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of object for which the property is being updated, such as contacts, companies, or deals. |
| `--property-name <value>` | The unique name of the property to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api properties-update --object-type <value> --property-name <value>`

### `hubspot api properties-delete`

Archive a property — destructive (DELETE /crm/properties/2026-03/{objectType}/{propertyName})

**Changes something in the service.**

```sh
hubspot api properties-delete [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | The type of CRM object that the property belongs to, such as contacts, companies, or deals. |
| `--property-name <value>` | The unique name of the property to delete. |

**Example:** `hubspot personal api properties-delete --object-type <value> --property-name <value>`

### `hubspot api associations-usage-high-usage-report-update`

Report high usage — write (POST /crm/associations/2026-03/usage/high-usage-report/{userId})

**Changes something in the service.**

```sh
hubspot api associations-usage-high-usage-report-update [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | userId. |

**Example:** `hubspot personal api associations-usage-high-usage-report-update --user-id <value>`

### `hubspot api associations-batch-archive`

Remove associations — destructive (POST /crm/associations/2026-03/{fromObjectType}/{toObjectType}/batch/archive)

**Changes something in the service.**

```sh
hubspot api associations-batch-archive [options]
```

| Option | What it does |
|---|---|
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-batch-archive --from-object-type <value> --to-object-type <value>`

### `hubspot api associations-batch-associate-default`

Create Default Associations — write (POST /crm/associations/2026-03/{fromObjectType}/{toObjectType}/batch/associate/default)

**Changes something in the service.**

```sh
hubspot api associations-batch-associate-default [options]
```

| Option | What it does |
|---|---|
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-batch-associate-default --from-object-type <value> --to-object-type <value>`

### `hubspot api associations-batch-create`

Associate records (labelled) — write (POST /crm/associations/2026-03/{fromObjectType}/{toObjectType}/batch/create)

**Changes something in the service.**

```sh
hubspot api associations-batch-create [options]
```

| Option | What it does |
|---|---|
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-batch-create --from-object-type <value> --to-object-type <value>`

### `hubspot api associations-batch-labels-archive`

Delete Specific Labels — destructive (POST /crm/associations/2026-03/{fromObjectType}/{toObjectType}/batch/labels/archive)

**Changes something in the service.**

```sh
hubspot api associations-batch-labels-archive [options]
```

| Option | What it does |
|---|---|
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-batch-labels-archive --from-object-type <value> --to-object-type <value>`

### `hubspot api associations-batch-read`

Retrieve associations — read (POST /crm/associations/2026-03/{fromObjectType}/{toObjectType}/batch/read)

```sh
hubspot api associations-batch-read [options]
```

| Option | What it does |
|---|---|
| `--from-object-type <value>` | fromObjectType. |
| `--to-object-type <value>` | toObjectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `hubspot personal api associations-batch-read --from-object-type <value> --to-object-type <value>`

### `hubspot api search`

— read (POST /crm/objects/2026-03/{objectType}/search)

```sh
hubspot api search [options]
```

| Option | What it does |
|---|---|
| `--object-type <value>` | objectType. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api search --object-type <value>`

### `hubspot api associations-get`

Retrieve all associations by object type — read (GET /crm/objects/2026-03/{objectType}/{objectId}/associations/{toObjectType})

```sh
hubspot api associations-get [options]
```

| Option | What it does |
|---|---|
| `--object-id <value>` | objectId. |
| `--object-type <value>` | objectType. |
| `--to-object-type <value>` | toObjectType. |
| `--after <value>` | The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results. |
| `--limit <value>` | The maximum number of results to display per page. |
| `--all` | read every page, as the API pages it. |

**Example:** `hubspot personal api associations-get --object-id <value> --object-type <value> --to-object-type <value>`

### `hubspot api account-info-api-usage-daily-private-apps-list`

Retrieve private app daily API usage — read (GET /account-info/2026-03/api-usage/daily/private-apps)

```sh
hubspot api account-info-api-usage-daily-private-apps-list
```

**Example:** `hubspot personal api account-info-api-usage-daily-private-apps-list`

### `hubspot api account-info-details-list`

Retrieve account details — read (GET /account-info/2026-03/details)

```sh
hubspot api account-info-details-list
```

**Example:** `hubspot personal api account-info-details-list`

## `hubspot schedule`

run a hubspot command or an agent later or on a timer (systemd, launchd, Task Scheduler); an agent cannot send

### `hubspot schedule command`

run hubspot <args…> on a timer — reads save what they read, so this is how the store stays current

**Changes something on this computer only.**

```sh
hubspot schedule command <name> <args> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `args` | required | the hubspot command after its name, e.g. -- doctor. |

| Option | What it does |
|---|---|
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |

**Example:** `hubspot personal schedule command health --every 1h -- doctor`, `hubspot personal schedule command morning-check --at 08:00 -- doctor`

### `hubspot schedule agent`

start an agent (claude, codex, gemini, cursor, opencode, openclaw, hermes, grok, kimi) with a prompt on a timer; it runs with WCHUBSPOT_READ_ONLY=1, so it reads and drafts and cannot send, and its own limits hold it to these CLIs' commands; an agent with no such limit is refused (`schedule agents list` says which) — its answer is kept and you are notified

**Changes something on this computer only.**

```sh
hubspot schedule agent <name> <harness> <prompt> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `harness` | required | the agent to start. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `prompt` | required | what to do, e.g. "say what needs attention in this installation: hubspot doctor". |

| Option | What it does |
|---|---|
| `--model <model>` | the model it runs on: an alias such as sonnet, or a model id; "" for the agent's own default (default sonnet for claude, the agent's own for the others, or the config file's). |
| `--max-cost <usd>` | claude only: stop a run that costs more than this, in US dollars. |
| `--allow-dangerous` | start an agent its own limits cannot hold to these CLIs' commands, where `schedule agents list` says allowed_with_ack: it may then run any program inside its sandbox. |
| `--max-cost-per-day <usd>` | claude only, as the others report no cost: start no run for the rest of the day once its runs cost this much, in US dollars; 0 for no cap (default 5, or the config file's). |
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |

**Example:** `hubspot personal schedule agent review claude "review what came in overnight and draft replies" --at 08:30`, `hubspot personal schedule agent triage gemini "list what needs an answer today" --every 2h`, `hubspot personal schedule agent weekly claude "review the week's open threads" --at 09:00 --model opus`

### `hubspot schedule list`

the schedules, when they run and how their last run went

```sh
hubspot schedule list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** scheduled job — name, kind, when, last, paused, notify, deliver_to, harness, and 4 more; every field: hubspot commands info schedule list

**Example:** `hubspot personal schedule list`, `hubspot personal schedule list kind:agent`

### `hubspot schedule agents`

the coding agents an agent schedule may start

#### `hubspot schedule agents list`

the agents a schedule may start, and which are on PATH here

```sh
hubspot schedule agents list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** schedule harness — id, name, programs, reports_cost, restricted, restricted_reason, allowed_with_ack, installed, and 1 more; every field: hubspot commands info schedule agents list

**Example:** `hubspot personal schedule agents list`, `hubspot personal schedule agents list --json`

### `hubspot schedule run`

run a schedule now, as its timer would, and wait for it; a paused one runs too

**Changes something in the service.**

```sh
hubspot schedule run <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--no-notify` | keep the result here: send it along none of its routes. |
| `--deliver-to <route>` | send it along only this one of its own routes; repeat it for more. |

**Example:** `hubspot personal schedule run health`

### `hubspot schedule remove`

stop a schedule and remove its timer; its past output stays

**Changes something on this computer only.**

```sh
hubspot schedule remove <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `hubspot personal schedule remove health`

### `hubspot schedule pause`

take a schedule off its timer and keep it; run runs it, resume puts it back

**Changes something on this computer only.**

```sh
hubspot schedule pause <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `hubspot personal schedule pause health`

### `hubspot schedule resume`

put a paused schedule back on its timer

**Changes something on this computer only.**

```sh
hubspot schedule resume <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `hubspot personal schedule resume health`

### `hubspot schedule exec`

what a timer runs, given the schedule's file; to run one by hand, use run

**Changes something in the service.**

```sh
hubspot schedule exec <file> [seal]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the schedule's schedule.json in the state folder, as the timer passes it. |
| `seal` | optional | the file's SHA-256 as it was saved, which the timer passes; a file that differs does not run. |

**Example:** `hubspot personal schedule exec ~/.local/share/hubspot-cli/schedules/health/schedule.json`

## `hubspot doctor`

the state this installation is in, without connecting unless --online

```sh
hubspot doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `hubspot doctor`, `hubspot doctor --json`

### `hubspot doctor reports`

problem reports

#### `hubspot doctor reports show`

what a problem report holds; writes nothing

```sh
hubspot doctor reports show
```

**Example:** `hubspot doctor reports show`

#### `hubspot doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
hubspot doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `hubspot doctor reports create --output ./problem-report.json`

## `hubspot skill`

the instructions an agent is given for this tool

### `hubspot skill show`

print SKILL.md — `hubspot skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
hubspot skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-search, api-batch, api-basic, api-advanced, api. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `hubspot skill show`

### `hubspot skill install`

write SKILL.md to \~/.claude/skills/hubspot-cli/ (Claude Code) and \~/.agents/skills/hubspot-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
hubspot skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `hubspot skill install --for agents`

### `hubspot skill status`

for each place `hubspot skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
hubspot skill status
```

**Example:** `hubspot skill status`, `hubspot skill status --json`

## `hubspot mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add hubspot -- hubspot <profile> mcp serve`

### `hubspot mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add hubspot -- hubspot <profile> mcp serve`; `hubspot mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
hubspot mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like people.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `hubspot personal mcp serve`, `hubspot mcp serve --profiles work,personal`, `hubspot personal mcp serve --http --public-url https://laptop.example.ts.net`

### `hubspot mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
hubspot mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `hubspot personal mcp revoke`, `hubspot mcp revoke --profiles all`

### `hubspot mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `hubspot mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
hubspot mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `hubspot personal mcp server start --public-url https://laptop.example.ts.net`

#### `hubspot mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
hubspot mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `hubspot personal mcp server stop`

#### `hubspot mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
hubspot mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `hubspot personal mcp server status --json`

### `hubspot mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
hubspot mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like people.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `hubspot personal mcp config`, `hubspot mcp config --profiles all`

### `hubspot mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
hubspot mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like people.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `hubspot personal mcp add codex --allow-writes`

### `hubspot mcp check`

check this profile's local MCP handshake and tool list

```sh
hubspot mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like people.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `hubspot personal mcp check`

## `hubspot upgrade`

upgrade hubspot with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
hubspot upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `hubspot upgrade --check`

## `hubspot config`

the settings in force, and where each one came from

### `hubspot config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
hubspot config show
```

**Example:** `hubspot personal config show`

### `hubspot config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
hubspot config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `hubspot personal config set limit 20`

### `hubspot config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
hubspot config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `hubspot personal config unset limit`

### `hubspot config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
hubspot config migrate
```

**Example:** `hubspot config migrate`

### `hubspot config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
hubspot config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `hubspot config repair`, `hubspot config repair --dry-run`

## `hubspot setup`

connect this profile to hubspot: the same questions WireCat Desktop shows, asked in the terminal, checked, and saved only when the check succeeds; show, apply and run are the same flow for programs

### `hubspot setup show`

print the connection flow as a WireCat setup document: steps, texts in every language, and each setting's own JSON Schema; with a profile it adds the profile's current values, a secret only as { set: true }

```sh
hubspot setup show
```

**Example:** `hubspot personal setup show --json`, `hubspot office setup show --json`

### `hubspot setup apply`

read the answers as one JSON object on stdin (input id → value), keep only those on the path they lead to, check each with its setting's own schema, then run the CLI's check and save the settings and secrets; --dry-run only checks and saves nothing

**Changes something on this computer only.**

```sh
hubspot setup apply [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | check the answers, and save nothing. |

**Example:** `hubspot office setup apply --dry-run --json`, `hubspot office setup apply --json`

### `hubspot setup run`

run one run step of the flow: apply checks the answers, runs the CLI's check and saves; the sign-in events go to stderr as JSON lines and the result to stdout; with --answer-stdin the answers are stdin's first line

**Changes something on this computer only.**

```sh
hubspot setup run <action> [options]
```

| Argument | | What it is |
|---|---|---|
| `action` | required | the step's action: apply. |

| Option | What it does |
|---|---|
| `--answer-stdin` | with --json and no terminal: print each question as a `needs` line on stderr and read its answer, one line, from stdin. |

**Example:** `hubspot office setup run apply --json --answer-stdin`

## `hubspot runs`

recorded runs — what this tool did, and when

### `hubspot runs list`

recorded runs, newest first

```sh
hubspot runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: hubspot commands info runs list

**Example:** `hubspot personal runs list --limit 10`

### `hubspot runs show`

one run: what it was, how it ended, and every event it logged

```sh
hubspot runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `hubspot runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: hubspot commands info runs show

**Example:** `hubspot personal runs show run-101`

### `hubspot runs path`

the directory holding one run

```sh
hubspot runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `hubspot runs list`. |

**Returns:** run location — path; every field: hubspot commands info runs path

**Example:** `hubspot personal runs path run-101`

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
