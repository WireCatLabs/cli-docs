---
title: "Comandos de amo"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Busca cualquier comando de `amo`, sus opciones y lo que responde, con la seguridad de que coincide con tu versión:
esta página se genera a partir del propio programa.

Tu agente de IA lee la misma lista en JSON con `amo commands --json` y elige allí un comando y sus opciones. Cada
código de salida indica un tipo de fallo, así que un script o un agente sabe qué salió mal. Las descripciones
conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `amo personal config show`. `AMO_PROFILE`
hace lo mismo para toda una sesión de la terminal. Nunca se da un perfil por supuesto: un comando que usa una cuenta
se detiene si no lo tiene y muestra los perfiles de este ordenador.

**En esta página:**

1. [Opciones para todos los comandos](#options-for-every-command)
2. [Negociaciones](#amo-deals)
3. [Embudos](#amo-pipelines)
4. [Contactos](#amo-people)
5. [Empresas](#amo-organizations)
6. [Qué cambió](#amo-changes)
7. [La API](#amo-api)
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

## `amo commands`

every command by section; --json prints its contract, one path per call

### `amo commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
amo commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `amo commands info commands`

## `amo session`

keep this profile's amoCRM sign-in and account address in the OS keyring

### `amo session start`

sign this profile in: --host names the account, and its long-lived token (a private integration → Keys and scopes → Generate a long-lived token) is asked hidden or read from stdin, never taken as an argument, checked against the account, and only then kept in the keyring with the address, or in a private file. The token acts with the rights of the administrator who made it. With --client-id it signs in through that integration in the browser instead: its secret key is asked hidden or read from stdin, and the tokens act with the rights of the user who signs in; the integration's Redirect URI must be https://wirecat.dev/webhooks/apps/amo-callback. Each sign-in forgets the profile's other kind

**Changes something on this computer only.**

```sh
amo session start [options]
```

| Option | What it does |
|---|---|
| `--host <address>` | the account's address, such as https://example.amocrm.ru, kept as given. |
| `--client-id <id>` | the integration's ID (client_id), or AMO_AMOCRM_CLIENT_ID; its secret key comes from AMO_AMOCRM_CLIENT_SECRET, a hidden prompt or stdin. |
| `--credential-storage <storage>` | where the sign-in is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `amo work session start --host https://example.amocrm.ru`, `amo work session start --host https://example.kommo.com --json`, `amo work session start --host https://example.amocrm.ru --client-id 0123abcd-4567-89ef-0123-456789abcdef`

### `amo session status`

show which account this profile signs in to, with a long-lived token or an integration, and where that comes from: AMO_TOKEN, the keyring or a file; never a token or the secret key

```sh
amo session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask the account whether the sign-in still works and whose it is: the account, the user and admin. |

**Example:** `amo work session status`, `amo work session status --check --json`

### `amo session end`

forget this profile's long-lived token, or its integration's secret key and tokens, and the account address on this computer; amoCRM has no call that revokes a token: revoke it on the integration's Keys and scopes tab, or switch the integration off

**Changes something on this computer only.**

```sh
amo session end
```

**Example:** `amo work session end`

### `amo session list`

list the profiles on this computer, whether each has a token and for which account; picks none

```sh
amo session list
```

**Example:** `amo session list`, `amo session list --json`

## `amo account`

this profile on this computer

### `amo account remove`

sign the profile out, then forget it on this computer: its settings, its saved sign-in and its files; --keep-data leaves its messages in the store, where search still finds them, --delete-data deletes them; asks first, or --yes

**Changes something on this computer only.**

```sh
amo account remove [options]
```

| Option | What it does |
|---|---|
| `--keep-data` | leave what the store holds of this account, still searchable. |
| `--delete-data` | delete what the store and the tool's own files hold of this account. |
| `--dry-run` | list what it would remove and keep, and change nothing. |

**Returns:** account removal — profile, data, dry_run, account, revoked, config_file, removed, kept; every field: amo commands info account remove

**Example:** `amo personal account remove --keep-data --dry-run`, `amo personal account remove --delete-data --yes`

## `amo sync`

bring the CRM's copy in the local store up to date: pipelines, companies, contacts, deals and leads that changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there. With the activities setting on, also the activities and tasks on the deals and leads it keeps. Then each deal or lead that moved into a stage the stage-tasks setting names opens a local task, once per move

**Changes something on this computer only.**

```sh
amo sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the CRM in this run. |

**Returns:** crm sync — provider, account, scope, pipelines, skipped_owner_rejected, stage_tasks, synced, issues, and 9 more; every field: amo commands info sync

**Example:** `amo work sync`, `amo work sync --rescan`, `amo work sync --max-pages 20`

## `amo store`

the local copy of the CRM, and the shared store file it lives in

### `amo store status`

how far each kind's sync is: rows saved, partial or complete, when it last moved, how many are stored

```sh
amo store status
```

**Returns:** crm sync progress — kind, round, id_pass, stored, job, profile, done, total, and 6 more; every field: amo commands info store status

**Example:** `amo work store status --json`

### `amo store apply`

apply scope mine to the contacts already stored: remove those no deal or lead of the chosen users and no kept company names, and the people they leave empty; counts only unless --yes, under scope all too. A sync that narrows the scope, or sync --rescan under mine, does this itself

**Changes something on this computer only.**

```sh
amo store apply [options]
```

| Option | What it does |
|---|---|
| `--yes` | remove the contacts it counts; otherwise only count them. |

**Returns:** crm contacts removed — contacts, persons, persons_kept, names, applied; every field: amo commands info store apply

**Example:** `amo work store apply`, `amo work store apply --yes`

### `amo store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
amo store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: amo commands info store info

**Example:** `amo work store info`

### `amo store check`

whether the store is healthy — integrity, search indexes, disk

```sh
amo store check
```

**Returns:** store check — path, exists, ok, opens, error, checks, schema, integrity, and 11 more; every field: amo commands info store check

**Example:** `amo work store check`

### `amo store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
amo store migrate
```

**Returns:** store migration — path, exists, from, to, normalized, indexed, terms, stemmed, and 1 more; every field: amo commands info store migrate

**Example:** `amo work store migrate`

### `amo store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored, and drop the vectors no stored text uses; loses nothing

**Changes something on this computer only.**

```sh
amo store rebuild
```

**Returns:** store reindex — path, exists, normalized, indexed, terms, stemmed, notes_indexed, file_texts, and 2 more; every field: amo commands info store rebuild

**Example:** `amo work store rebuild`

### `amo store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
amo store backup <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

| Option | What it does |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store backup — path, from, bytes, schema, rows, encrypted; every field: amo commands info store backup

**Example:** `amo work store backup ./backup.db`

### `amo store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted. Given a rollback copy (backups/<store>-rollback-schema-<version>-<time>.db, kept for a day before an upgrade older tools cannot open), put its tables back in the store and return it to that version instead

**Changes something on this computer only.**

```sh
amo store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote, or a rollback copy; one written with --encrypt asks for its password. |

**Returns:** store restore — path, restored_from, kept_at, schema, rolled_back, was, tables, rebuilt, and 1 more; every field: amo commands info store restore

**Example:** `amo work store restore ./backup.db`

### `amo store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
amo store decrypt <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Option | What it does |
|---|---|
| `--output <file>` | the new file, readable only by you. |

**Returns:** store decrypt — path, from, bytes; every field: amo commands info store decrypt

**Example:** `amo work store decrypt ./backup.enc --output ./restored.db`

### `amo store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
amo store repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

**Returns:** store repair — path, exists, dry_run, repaired, indexes_created, triggers_created, mismatches, foreign_key_violations, and 1 more; every field: amo commands info store repair

**Example:** `amo work store repair --dry-run`

### `amo store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
amo store reset [options]
```

| Option | What it does |
|---|---|
| `--no-backup` | delete the store without backing it up first. |
| `--dry-run` | list every table it would empty, with its rows, and delete nothing. |

**Returns:** store reset — path, exists, reset, dry_run, files, bytes, schema, tables, and 4 more; every field: amo commands info store reset

**Example:** `amo work store reset`

### `amo store copies`

the tables `store repair` kept as copies

#### `amo store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
amo store copies delete <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

**Returns:** store copy removal — path, deleted; every field: amo commands info store copies delete

**Example:** `amo work store copies delete messages_copy_1`

### `amo store tables`

the tables of the local store

#### `amo store tables list`

every table of the local archive: its kind (data, search index, part of a search index, internal) and its rows, a search index's rows not counted; --full adds each table's size on disk, which reads the whole file (about ten seconds for 3 GB); changes nothing

```sh
amo store tables list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** store table — name, kind, rows, bytes; every field: amo commands info store tables list

**Example:** `amo personal store tables list`, `amo personal store tables list kind:data`, `amo personal store tables list --full --json`

### `amo store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

#### `amo store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

**Changes something on this computer only.**

```sh
amo store recover run
```

**Example:** `amo personal store recover run`

## `amo deals`

the CRM's deals as last synced: stage, status, amount and the people on them

### `amo deals list`

deals copied from the CRM, newest first; run sync to bring them up to date

```sh
amo deals list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | deals per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: amo commands info deals list

**Example:** `amo work deals list status:open --json`, `amo work deals list stage:"Quote sent"`, `amo work deals list status:open --format csv > deals.csv`

### `amo deals show`

one deal with its pipeline, stage, status, amount and the people on it, and the newest recorded meetings and calls of those people in this account's scope; with the activities setting on, its activities and tasks too

```sh
amo deals show <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 30 more; every field: amo commands info deals show

**Example:** `amo work deals show deal:12`

### `amo deals create`

make a deal in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
amo deals create [options]
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

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: amo commands info deals create

**Example:** `amo work deals create --title "Example kitchen" --amount 15000 --currency EUR`, `amo work deals create --title "Example office" --pipeline Sales --stage "Quote sent" --field UF_CRM_SOURCE=web`

### `amo deals update`

change a deal in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
amo deals update <deal> [options]
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

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: amo commands info deals update

**Example:** `amo work deals update deal:12 --amount 18000`, `amo work deals update deal:12 --field UF_CRM_SOURCE=`

### `amo deals move`

move a deal to another stage of its pipeline; a won or lost stage checks the close key too

**Changes something in the service.**

```sh
amo deals move <deal> <stage>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has; or a stage:<id>, of its pipeline or of the owner's base set, which moves it to the one stage of its pipeline mapped there and refuses several (with the candidates) or none. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: amo commands info deals move

**Example:** `amo work deals move deal:12 "Quote sent"`, `amo work deals move deal:12 stage:5`

### `amo deals close`

mark a deal won or lost, the CRM's own way

**Changes something in the service.**

```sh
amo deals close <deal> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
| `outcome` | required | how it ended. One of: `won`, `lost`. |

| Option | What it does |
|---|---|
| `--reason <text>` | why, in a few words; kept with it. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: amo commands info deals close

**Example:** `amo work deals close deal:12 won`, `amo work deals close deal:12 lost --reason "Example: chose another supplier"`

## `amo pipelines`

the CRM's pipelines and their stages, as last synced

### `amo pipelines list`

pipelines copied from the CRM, with their stages in order and how many are open in each

```sh
amo pipelines list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: amo commands info pipelines list

**Example:** `amo work pipelines list --json`, `amo work pipelines list kind:lead`

### `amo pipelines show`

one pipeline as a board and a funnel: how many stand in each stage and their sum per currency, never converted, how many reached it and went on, and the win rate; won and lost stages are marked by outcome

```sh
amo pipelines show [pipeline] [options]
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | optional | pipeline:<id>, or a name only one of the CRM's pipelines has; needed unless the CRM has one pipeline in all. |

| Option | What it does |
|---|---|
| `--since-time <time>` | count the rows made at or after this date or time (ISO 8601, or 30d ago). |
| `--until-time <time>` | count the rows made at or before this date or time; a date alone is that whole day. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 9 more; every field: amo commands info pipelines show

**Example:** `amo work pipelines show pipeline:3`, `amo work pipelines show Sales --since-time 30d --json`

## `amo stages`

the stages of the CRM's pipelines, as last synced

### `amo stages list`

every stage of the CRM's pipelines in order, with its outcome and how many are open in it

```sh
amo stages list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** stage — name, position, outcome, external_id, open, pipeline, pipeline_name, kind, and 7 more; every field: amo commands info stages list

**Example:** `amo work stages list --json`, `amo work stages list kind:lead`

## `amo people`

the CRM's contacts, read live: the copy holds only your own

### `amo people list`

contacts in the CRM, newest first; another client is found here, never in the copy

```sh
amo people list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | contacts per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: amo commands info people list

**Example:** `amo work people list`, `amo work people list name:anna* --json`, `amo work people list --format csv > people.csv`

### `amo people show`

one of the CRM's contacts, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
amo people show <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the CRM's id of the person, as list prints it, or its exact name. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 6 more; every field: amo commands info people show

**Example:** `amo work people show 42`, `amo work people show "Anna Example" --json`

### `amo people create`

make a person in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
amo people create [options]
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

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: amo commands info people create

**Example:** `amo work people create --first-name Anna --last-name Example --position Buyer`

### `amo people update`

change a person in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
amo people update <person> [options]
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

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: amo commands info people update

**Example:** `amo work people update 42 --position Buyer`

## `amo organizations`

the CRM's companies, read live: the copy holds only your own

### `amo organizations list`

companies in the CRM, newest first; another client is found here, never in the copy

```sh
amo organizations list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | companies per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: amo commands info organizations list

**Example:** `amo work organizations list`, `amo work organizations list name:anna* --json`, `amo work organizations list --format csv > organizations.csv`

### `amo organizations show`

one of the CRM's companies, read live, with its phones and e-mails; one that is not your client counts toward the day's limit when the CRM sets one

```sh
amo organizations show <organization>
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the CRM's id of the organization, as list prints it, or its exact name. |

**Returns:** crm organization — id, name, type, own, person_ids, assigned_to, created_at, updated_at, and 5 more; every field: amo commands info organizations show

**Example:** `amo work organizations show 42`, `amo work organizations show "Anna Example" --json`

### `amo organizations create`

make an organization in the CRM, then store the CRM's copy of it

**Changes something in the service.**

```sh
amo organizations create [options]
```

| Option | What it does |
|---|---|
| `--name <name>` | the company's name. |
| `--email <address>` | an e-mail address to give it; repeat it for more; replaces its list, and an empty one clears it. |
| `--phone <phone>` | a phone number to give it, in international form starting with +; repeat it for more; replaces its list, and an empty one clears it. |
| `--owner <user>` | the CRM user it is assigned to; anyone but the sign-in's own user checks crm.assign-others. |
| `--field <key=value>` | one of the CRM's own fields, by its code or label as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field; an empty value clears it. Default: ``. |

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: amo commands info organizations create

**Example:** `amo work organizations create --name "Example LLC"`

### `amo organizations update`

change a organization in the CRM; what is left out keeps its value; the CRM's copy is stored again

**Changes something in the service.**

```sh
amo organizations update <organization> [options]
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

**Returns:** crm record write — operation_id, stored, untrusted, removed, person, organization; every field: amo commands info organizations update

**Example:** `amo work organizations update 9 --name "Example Ltd"`

## `amo users`

the CRM account's users: the people of your own company who own deals

### `amo users list`

the CRM's users, read live, in the CRM's order

```sh
amo users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | users per page, 1–250. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: amo commands info users list

**Example:** `amo work users list`, `amo work users list active:true --json`

### `amo users show`

one of the CRM's users, read live

```sh
amo users show <user>
```

| Argument | | What it is |
|---|---|---|
| `user` | required | the CRM's id of the user, as list prints it. |

**Returns:** crm user — id, name, email, position, active, department_ids, untrusted; every field: amo commands info users show

**Example:** `amo work users show 7`

## `amo activities`

the CRM's activities and tasks on deals, leads, contacts and companies, as last synced

### `amo activities list`

activities copied from the CRM, open ones first by due time, then the rest newest first; status:open unless a status is given; the activities setting must be on

```sh
amo activities list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | activities per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** crm activity — external_id, kind, subject, body, due_at, done, done_at, assignee, and 4 more; every field: amo commands info activities list

**Example:** `amo work activities list overdue:true`, `amo work activities list due:today --json`, `amo work activities list deal:12 status:done`

## `amo changes`

what changed in the CRM's deals, leads, activities and contacts, as the syncs copied it

### `amo changes list`

deals and leads made, moved, won, lost and given another owner, activities added and done, and contacts added, newest first; the last day unless at: says otherwise

```sh
amo changes list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | changes per page, 1–500. Default: `50`. |
| `--cursor <cursor>` | the next page, as the last answer's page.next gave it. |
| `--format <format>` | csv: this page as a table; report: the window as a morning digest document, for schedule command. Run by a schedule, the report starts where that schedule's last one ended. One of: `csv`, `report`. |

**Returns:** crm change — change, at, kind, ref, external_id, account, title, pipeline, and 10 more; every field: amo commands info changes list

**Example:** `amo work changes list "at>=1d"`, `amo work changes list change:won at>=7d --json`, `amo work changes list "at>=1d" --format report`

## `amo fields`

the CRM's own fields on deals, leads, people and organizations, as last synced

### `amo fields list`

the CRM's custom fields of one kind, in its order, with a list field's options

```sh
amo fields list <kind> [query] [options]
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

**Returns:** crm field — code, label, type, multiple, filterable, untrusted, options; every field: amo commands info fields list

**Example:** `amo work fields list deals`, `amo work fields list people --json`

## `amo search`

search what the local store holds

### `amo search all`

search the CRM's deals and leads by the words of their title, company, contacts and activities, and the messages, notes, calendar events and meetings other WireCat tools stored — best match first. Use it when you do not know where something was written

```sh
amo search all <query> [options]
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

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 18 more; every field: amo commands info search all

**Example:** `amo work search all Example LLC`, `amo work search all website --only crm --json`

## `amo api`

see and call the amoCRM API v4 operations directly

### `amo api list`

list every operation of the Kommo API reference (amoCRM's API v4) that amo may call, with its permission key, default level and the page it comes from

```sh
amo api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** api operation — name, effect, family, summary, permission, default_level, also_checks, source; every field: amo commands info api list

**Example:** `amo work api list`, `amo work api list family:leads effect:write`

### `amo api show`

show what an operation does, the permissions it checks and its reference page; calls nothing

```sh
amo api show <method>
```

| Argument | | What it is |
|---|---|---|
| `method` | required | the HTTP verb and path, such as "GET /api/v4/leads", as api list prints it. |

**Example:** `amo work api show "PATCH /api/v4/leads/{id}" --json`, `amo work api show "GET /api/v4/leads/42"`

### `amo api call`

call one operation of the Kommo API reference on the signed-in account; it checks api.<path>.<verb>, and the key of the command that reads or writes the same records

**Changes something in the service.**

```sh
amo api call <method> [options]
```

| Argument | | What it is |
|---|---|---|
| `method` | required | the HTTP verb and path, such as "GET /api/v4/leads/42", as api list prints it. |

| Option | What it does |
|---|---|
| `--params <json>` | the query parameters as a JSON object, named as the reference does: {"filter[id][]":[1,2]}. |
| `--body <json>` | the request body as JSON, an array of records for most writes. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Example:** `amo work api call "GET /api/v4/leads" --params '{"limit":5,"with":"loss_reason"}'`, `amo work api call "PATCH /api/v4/leads/42" --body '{"price":1000}' --dry-run`

## `amo schedule`

run a amo command or an agent later or on a timer (systemd, launchd, Task Scheduler); an agent cannot send

### `amo schedule command`

run amo <args…> on a timer — reads save what they read, so this is how a chat's history fills the store

**Changes something on this computer only.**

```sh
amo schedule command <name> <args> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `args` | required | the amo command after its name, e.g. -- messages list <chat> --limit 50. |

| Option | What it does |
|---|---|
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |

**Example:** `amo personal schedule command health --every 1h -- doctor`, `amo personal schedule command morning-check --at 08:00 -- doctor`

### `amo schedule agent`

start an agent (claude, codex, gemini, cursor, opencode, openclaw, hermes, grok, kimi) with a prompt on a timer; it runs with AMO_READ_ONLY=1, so it reads and drafts and cannot send, and its own limits hold it to these CLIs' commands; an agent with no such limit is refused (`schedule agents list` says which) — its answer is kept and you are notified

**Changes something on this computer only.**

```sh
amo schedule agent <name> <harness> <prompt> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `harness` | required | the agent to start. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `prompt` | required | what to do, e.g. "summarize what came in during the last day: amo personal search messages 'date>1d' --newest --limit 20". |

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

**Example:** `amo personal schedule agent review claude "review what came in overnight and draft replies" --at 08:30`, `amo personal schedule agent triage gemini "list what needs an answer today" --every 2h`, `amo personal schedule agent weekly claude "review the week's open threads" --at 09:00 --model opus`

### `amo schedule list`

the schedules, when they run and how their last run went

```sh
amo schedule list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** scheduled job — name, kind, when, last, paused, notify, deliver_to, harness, and 4 more; every field: amo commands info schedule list

**Example:** `amo personal schedule list`, `amo personal schedule list kind:agent`

### `amo schedule agents`

the coding agents an agent schedule may start

#### `amo schedule agents list`

the agents a schedule may start, and which are on PATH here

```sh
amo schedule agents list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** schedule harness — id, name, programs, reports_cost, restricted, restricted_reason, allowed_with_ack, installed, and 1 more; every field: amo commands info schedule agents list

**Example:** `amo personal schedule agents list`, `amo personal schedule agents list --json`

### `amo schedule run`

run a schedule now, as its timer would, and wait for it; a paused one runs too

**Changes something in the service.**

```sh
amo schedule run <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--no-notify` | keep the result here: send it along none of its routes. |
| `--deliver-to <route>` | send it along only this one of its own routes; repeat it for more. |

**Example:** `amo personal schedule run health`

### `amo schedule remove`

stop a schedule and remove its timer; its past output stays

**Changes something on this computer only.**

```sh
amo schedule remove <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `amo personal schedule remove health`

### `amo schedule pause`

take a schedule off its timer and keep it; run runs it, resume puts it back

**Changes something on this computer only.**

```sh
amo schedule pause <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `amo personal schedule pause health`

### `amo schedule resume`

put a paused schedule back on its timer

**Changes something on this computer only.**

```sh
amo schedule resume <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Example:** `amo personal schedule resume health`

### `amo schedule exec`

what a timer runs, given the schedule's file; to run one by hand, use run

**Changes something in the service.**

```sh
amo schedule exec <file> [seal]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the schedule's schedule.json in the state folder, as the timer passes it. |
| `seal` | optional | the file's SHA-256 as it was saved, which the timer passes; a file that differs does not run. |

**Example:** `amo personal schedule exec ~/.local/share/amo-cli/schedules/health/schedule.json`

## `amo doctor`

the state this installation is in, without connecting unless --online

```sh
amo doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `amo doctor`, `amo doctor --json`

### `amo doctor reports`

problem reports

#### `amo doctor reports show`

what a problem report holds; writes nothing

```sh
amo doctor reports show
```

**Example:** `amo doctor reports show`

#### `amo doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
amo doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `amo doctor reports create --output ./problem-report.json`

## `amo skill`

the instructions an agent is given for this tool

### `amo skill show`

print SKILL.md — `amo skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
amo skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: writing, setup, reading, output, mcp. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `amo skill show`

### `amo skill install`

write SKILL.md to \~/.claude/skills/amo-cli/ (Claude Code) and \~/.agents/skills/amo-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
amo skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `amo skill install --for agents`

### `amo skill status`

for each place `amo skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
amo skill status
```

**Example:** `amo skill status`, `amo skill status --json`

## `amo mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add amo -- amo <profile> mcp serve`

### `amo mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add amo -- amo <profile> mcp serve`; `amo mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
amo mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.close=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `amo personal mcp serve`, `amo mcp serve --profiles work,personal`, `amo personal mcp serve --http --public-url https://laptop.example.ts.net`

### `amo mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
amo mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `amo personal mcp revoke`, `amo mcp revoke --profiles all`

### `amo mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `amo mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
amo mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `amo personal mcp server start --public-url https://laptop.example.ts.net`

#### `amo mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
amo mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `amo personal mcp server stop`

#### `amo mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
amo mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `amo personal mcp server status --json`

### `amo mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
amo mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.close=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `amo personal mcp config`, `amo mcp config --profiles all`

### `amo mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
amo mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like deals.close=deny; it never loosens the profile; repeat for more keys. |

**Example:** `amo personal mcp add codex --allow-writes`

### `amo mcp check`

check this profile's local MCP handshake and tool list

```sh
amo mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like deals.close=deny; it never loosens the profile; repeat for more keys. |

**Example:** `amo personal mcp check`

## `amo upgrade`

upgrade amo with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
amo upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `amo upgrade --check`

## `amo config`

the settings in force, and where each one came from

### `amo config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
amo config show
```

**Example:** `amo personal config show`

### `amo config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
amo config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, host, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `amo personal config set limit 20`

### `amo config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
amo config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, host, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `amo personal config unset limit`

### `amo config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
amo config migrate
```

**Example:** `amo config migrate`

### `amo config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
amo config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `amo config repair`, `amo config repair --dry-run`

## `amo setup`

connect this profile to amo: the same questions WireCat Desktop shows, asked in the terminal, checked, and saved only when the check succeeds; show, apply and run are the same flow for programs

### `amo setup show`

print the connection flow as a WireCat setup document: steps, texts in every language, and each setting's own JSON Schema; with a profile it adds the profile's current values, a secret only as { set: true }

```sh
amo setup show
```

**Example:** `amo personal setup show --json`, `amo office setup show --json`

### `amo setup apply`

read the answers as one JSON object on stdin (input id → value), keep only those on the path they lead to, check each with its setting's own schema, then run the CLI's check and save the settings and secrets; --dry-run only checks and saves nothing

**Changes something on this computer only.**

```sh
amo setup apply [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | check the answers, and save nothing. |

**Example:** `amo office setup apply --dry-run --json`, `amo office setup apply --json`

### `amo setup run`

run one run step of the flow: apply checks the answers, runs the CLI's check and saves; the sign-in events go to stderr as JSON lines and the result to stdout; with --answer-stdin the answers are stdin's first line

**Changes something on this computer only.**

```sh
amo setup run <action> [options]
```

| Argument | | What it is |
|---|---|---|
| `action` | required | the step's action: apply. |

| Option | What it does |
|---|---|
| `--answer-stdin` | with --json and no terminal: print each question as a `needs` line on stderr and read its answer, one line, from stdin. |

**Example:** `amo office setup run apply --json --answer-stdin`

## `amo runs`

recorded runs — what this tool did, and when

### `amo runs list`

recorded runs, newest first

```sh
amo runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: amo commands info runs list

**Example:** `amo personal runs list --limit 10`

### `amo runs show`

one run: what it was, how it ended, and every event it logged

```sh
amo runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `amo runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: amo commands info runs show

**Example:** `amo personal runs show run-101`

### `amo runs path`

the directory holding one run

```sh
amo runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `amo runs list`. |

**Returns:** run location — path; every field: amo commands info runs path

**Example:** `amo personal runs path run-101`

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
