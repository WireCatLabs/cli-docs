---
title: "Команды b24"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Все команды, параметры и коды выхода, созданные из самой программы. Тот же список в JSON выводит
`b24 commands --json`.

**Первым словом идет профиль**, имя, которое вы выбираете сами: `b24 work config show`. `B24_PROFILE`
задает профиль для всего сеанса оболочки. Профиль никогда не подставляется сам: команда, которой нужен аккаунт, без
профиля останавливается и показывает профили на этом компьютере. Описания команд и параметров ниже остаются на
языке встроенной справки.

## Параметры всех команд

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

keep this profile's Bitrix24 webhook or app sign-in in the OS keyring

### `b24 session start`

sign this profile in: the incoming webhook's address (Bitrix24 → Developer resources → Other → Incoming webhook) is asked hidden or read from stdin, checked against the portal, and only then kept in the keyring, or in a private file when the keyring fails; the webhook acts with the rights of the employee who made it. With --portal and --client-id it signs in through a local application in the browser instead: its key is asked hidden or read from stdin, and its tokens act with the rights of the employee who signs in

**Changes something on this computer only.**

```sh
b24 session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the sign-in is kept: keyring (the default, which falls back to a private file by itself when no keyring works), or file, not recommended. Default: `keyring`. |
| `--portal <host>` | sign in through a local application on this portal, such as example.bitrix24.ru. |
| `--client-id <id>` | the local application's Application ID (client_id), or B24_BITRIX24_CLIENT_ID; its key comes from B24_BITRIX24_CLIENT_SECRET, a hidden prompt or stdin. |

**Returns:** sign in with a Bitrix24 incoming webhook, or with a local application

**Example:** `b24 work session start`, `b24 work session start --json`, `b24 work session start --portal example.bitrix24.ru --client-id local.0123abcd.45678901`

### `b24 session status`

show how this profile signs in, with a webhook or a local application, and where that comes from: B24_TOKEN, the keyring or a file; never the address, the key or a token

```sh
b24 session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask the portal whether the sign-in still works and whose it is: the user's id, name and admin rights. |

**Returns:** show how this profile signs in, and with --check as whom it acts

**Example:** `b24 work session status`, `b24 work session status --check --json`

### `b24 session end`

forget this profile's webhook address, or its local application's key and tokens, on this computer; the webhook and the application stay in Bitrix24, which has no call that revokes a token: delete them there to stop them

**Changes something on this computer only.**

```sh
b24 session end
```

**Returns:** forget this profile's webhook address or application sign-in on this computer

**Example:** `b24 work session end`

### `b24 session list`

list the profiles on this computer and whether each has a webhook or an application sign-in; picks none

```sh
b24 session list
```

**Returns:** list the profiles here and whether each is signed in

**Example:** `b24 session list`, `b24 session list --json`

## `b24 account`

this profile on this computer

### `b24 account remove`

sign the profile out, then forget it on this computer: its settings, its saved sign-in and its files; --keep-data leaves its messages in the store, where search still finds them, --delete-data deletes them; asks first, or --yes

**Changes something on this computer only.**

```sh
b24 account remove [options]
```

| Option | What it does |
|---|---|
| `--keep-data` | leave what the store holds of this account, still searchable. |
| `--delete-data` | delete what the store and the tool's own files hold of this account. |
| `--dry-run` | list what it would remove and keep, and change nothing. |

**Returns:** account removal — profile, data, dry_run, account, revoked, config_file, removed, kept; every field: b24 commands info account remove

**Example:** `b24 personal account remove --keep-data --dry-run`, `b24 personal account remove --delete-data --yes`

## `b24 sync`

bring the CRM's copy in the local store up to date: pipelines, companies, contacts, deals and leads that changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there. Then each deal or lead that moved into a stage the stage-tasks setting names opens a local task, once per move

**Changes something on this computer only.**

```sh
b24 sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the CRM in this run. |

**Returns:** crm sync — provider, account, scope, pipelines, skipped_owner_rejected, stage_tasks, synced, issues, and 8 more; every field: b24 commands info sync

**Example:** `b24 work sync`, `b24 work sync --rescan`, `b24 work sync --max-pages 20`

## `b24 store`

the local copy of the CRM, and the shared store file it lives in

### `b24 store status`

how far each kind's sync is: rows saved, partial or complete, when it last moved, how many are stored

```sh
b24 store status
```

**Returns:** crm sync progress — kind, round, id_pass, stored, job, profile, done, total, and 6 more; every field: b24 commands info store status

**Example:** `b24 work store status --json`

### `b24 store apply`

apply scope mine to the contacts already stored: remove those no deal or lead of the chosen users and no kept company names, and the people they leave empty; counts only unless --yes, under scope all too. A sync that narrows the scope, or sync --rescan under mine, does this itself

**Changes something on this computer only.**

```sh
b24 store apply
```

**Returns:** crm contacts removed — contacts, persons, persons_kept, names, applied; every field: b24 commands info store apply

**Example:** `b24 work store apply`, `b24 work store apply --yes`

### `b24 store info`

the store file: where it is, its size, its schema against the one this tool speaks, which tools used it and how many rows it holds, by provider, chat kind, account, year (UTC) and attachment kind, over every account; changes nothing

```sh
b24 store info
```

**Returns:** store info — path, exists, schema, opens, error, bytes, journal_mode, pages, and 12 more; every field: b24 commands info store info

**Example:** `b24 work store info`

### `b24 store check`

whether the store is healthy — integrity, search indexes, disk

```sh
b24 store check
```

**Returns:** store check — path, exists, ok, opens, error, checks, schema, integrity, and 11 more; every field: b24 commands info store check

**Example:** `b24 work store check`

### `b24 store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
b24 store migrate
```

**Returns:** store migration — path, exists, from, to, normalized, indexed, terms, stemmed, and 1 more; every field: b24 commands info store migrate

**Example:** `b24 work store migrate`

### `b24 store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored, and drop the vectors no stored text uses; loses nothing

**Changes something on this computer only.**

```sh
b24 store rebuild
```

**Returns:** store reindex — path, exists, normalized, indexed, terms, stemmed, notes_indexed, file_texts, and 2 more; every field: b24 commands info store rebuild

**Example:** `b24 work store rebuild`

### `b24 store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
b24 store backup <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the new file. |

| Option | What it does |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

**Returns:** store backup — path, from, bytes, schema, rows, encrypted; every field: b24 commands info store backup

**Example:** `b24 work store backup ./backup.db`

### `b24 store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted. Given a rollback copy (backups/<store>-rollback-schema-<version>-<time>.db, kept for a day before an upgrade older tools cannot open), put its tables back in the store and return it to that version instead

**Changes something on this computer only.**

```sh
b24 store restore <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup` wrote, or a rollback copy; one written with --encrypt asks for its password. |

**Returns:** store restore — path, restored_from, kept_at, schema, rolled_back, was, tables, rebuilt, and 1 more; every field: b24 commands info store restore

**Example:** `b24 work store restore ./backup.db`

### `b24 store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
b24 store decrypt <file> [options]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Option | What it does |
|---|---|
| `--output <file>` | the new file, readable only by you. |

**Returns:** store decrypt — path, from, bytes; every field: b24 commands info store decrypt

**Example:** `b24 work store decrypt ./backup.enc --output ./restored.db`

### `b24 store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
b24 store repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

**Returns:** store repair — path, exists, dry_run, repaired, indexes_created, triggers_created, mismatches, foreign_key_violations, and 1 more; every field: b24 commands info store repair

**Example:** `b24 work store repair --dry-run`

### `b24 store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
b24 store reset [options]
```

| Option | What it does |
|---|---|
| `--no-backup` | delete the store without backing it up first. |
| `--dry-run` | list every table it would empty, with its rows, and delete nothing. |

**Returns:** store reset — path, exists, reset, dry_run, files, bytes, schema, tables, and 4 more; every field: b24 commands info store reset

**Example:** `b24 work store reset`

### `b24 store copies`

the tables `store repair` kept as copies

#### `b24 store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
b24 store copies delete <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

**Returns:** store copy removal — path, deleted; every field: b24 commands info store copies delete

**Example:** `b24 work store copies delete messages_copy_1`

### `b24 store tables`

the tables of the local store

#### `b24 store tables list`

every table of the local archive: its kind (data, search index, part of a search index, internal) and its rows, a search index's rows not counted; --full adds each table's size on disk, which reads the whole file (about ten seconds for 3 GB); changes nothing

```sh
b24 store tables list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** store table — name, kind, rows, bytes; every field: b24 commands info store tables list

**Example:** `b24 personal store tables list`, `b24 personal store tables list kind:data`, `b24 personal store tables list --full --json`

### `b24 store recover`

check every page and search index of the store, say what is damaged, what it means and the commands that recover it; changes nothing

#### `b24 store recover run`

copy every readable row into a new file with the sqlite3 program, rebuild the search indexes, mentions and vector index, check it, and put it in place of the store; the damaged file is kept beside it. Refuses while a WireCat timer or process has the store

**Changes something on this computer only.**

```sh
b24 store recover run
```

**Returns:** rebuild a damaged store from every row it can read

**Example:** `b24 personal store recover run`

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
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 27 more; every field: b24 commands info deals list

**Example:** `b24 work deals list status:open --json`, `b24 work deals list stage:"Quote sent"`, `b24 work deals list status:open --format csv > deals.csv`

### `b24 deals show`

one deal with its pipeline, stage, status, amount and the people on it

```sh
b24 deals show <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

**Returns:** deal — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 27 more; every field: b24 commands info deals show

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
b24 deals update <deal> [options]
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

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals update

**Example:** `b24 work deals update deal:12 --amount 18000`, `b24 work deals update deal:12 --field UF_CRM_SOURCE=`

### `b24 deals move`

move a deal to another stage of its pipeline; a won or lost stage checks the close key too

**Changes something in the service.**

```sh
b24 deals move <deal> <stage>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has; or a stage:<id>, of its pipeline or of the owner's base set, which moves it to the one stage of its pipeline mapped there and refuses several (with the candidates) or none. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info deals move

**Example:** `b24 work deals move deal:12 "Quote sent"`, `b24 work deals move deal:12 stage:5`

### `b24 deals close`

mark a deal won or lost, the CRM's own way

**Changes something in the service.**

```sh
b24 deals close <deal> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |
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
b24 deals delete <deal>
```

| Argument | | What it is |
|---|---|---|
| `deal` | required | deal:<id>, as a list shows it. |

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
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 27 more; every field: b24 commands info leads list

**Example:** `b24 work leads list status:open --json`, `b24 work leads list stage:"Quote sent"`, `b24 work leads list status:open --format csv > leads.csv`

### `b24 leads show`

one lead with its pipeline, stage, status, amount and the people on it

```sh
b24 leads show <lead>
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |

**Returns:** lead — id, ref, kind, title, summary, pipeline, pipeline_name, stage, and 27 more; every field: b24 commands info leads show

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
b24 leads update <lead> [options]
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |

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
b24 leads move <lead> <stage>
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |
| `stage` | required | the stage, by the CRM's id or a name only one stage of its pipeline has; or a stage:<id>, of its pipeline or of the owner's base set, which moves it to the one stage of its pipeline mapped there and refuses several (with the candidates) or none. |

**Returns:** crm write — operation_id, untrusted, deal, lead; every field: b24 commands info leads move

**Example:** `b24 work leads move lead:12 "Quote sent"`, `b24 work leads move lead:12 stage:5`

### `b24 leads close`

mark a lead won or lost, the CRM's own way

**Changes something in the service.**

```sh
b24 leads close <lead> <outcome> [options]
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |
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
b24 leads delete <lead>
```

| Argument | | What it is |
|---|---|---|
| `lead` | required | lead:<id>, as a list shows it. |

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

one pipeline as a board and a funnel: how many stand in each stage and their sum per currency, never converted, how many reached it and went on, and the win rate; won and lost stages are marked by outcome

```sh
b24 pipelines show [pipeline]
```

| Argument | | What it is |
|---|---|---|
| `pipeline` | optional | pipeline:<id>, or a name only one of the CRM's pipelines has; needed unless the CRM has one pipeline in all. |

**Returns:** pipeline — id, ref, name, kind, account, external_id, stages, created_at, and 3 more; every field: b24 commands info pipelines show

**Example:** `b24 work pipelines show pipeline:3`, `b24 work pipelines show Sales --json`

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

**Returns:** stage — name, position, outcome, external_id, open, pipeline, pipeline_name, kind, and 5 more; every field: b24 commands info stages list

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

search the CRM's deals and leads by the words of their title, company and contacts, and messages, notes, calendar events and meetings other WireCat tools stored — best match first. Use it when you do not know where something was written

```sh
b24 search all <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words and "phrases"; deals and leads match the words of their title, company and contacts. |

| Option | What it does |
|---|---|
| `--only <resources>` | only these resources, separated by commas: crm, messages, notes, events, meetings. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

**Returns:** hit — kind, ref, provider, account, title, timestamp, excerpt, url, and 17 more; every field: b24 commands info search all

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
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm person — id, name, first_name, last_name, position, organization_ids, assigned_to, created_at, and 5 more; every field: b24 commands info people list

**Example:** `b24 work people list`, `b24 work people list name:ivan*`, `b24 work people list --format csv > people.csv`

### `b24 people show`

show one of the contacts on the portal

```sh
b24 people show <person>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id or name, as list prints it. |

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

**Returns:** crm record created — operation_id, id, created; every field: b24 commands info people create

**Example:** `b24 work people create --first-name Anna --last-name Ivanova`

### `b24 people update`

change one person on the portal; options left out keep their values

**Changes something in the service.**

```sh
b24 people update <person> [options]
```

| Argument | | What it is |
|---|---|---|
| `person` | required | the person's id. |

| Option | What it does |
|---|---|
| `--first-name <name>` | the person's first name. |
| `--last-name <name>` | the person's last name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** crm record updated — operation_id, id, updated; every field: b24 commands info people update

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
| `--format <format>` | csv: this page as a table for a spreadsheet; --json=a,b picks its columns. One of: `csv`. |

**Returns:** crm organization — id, name, type_id, industry_id, revenue, currency, person_ids, assigned_to, and 6 more; every field: b24 commands info organizations list

**Example:** `b24 work organizations list`, `b24 work organizations list name:acme*`, `b24 work organizations list --format csv > organizations.csv`

### `b24 organizations show`

show one of the companies on the portal

```sh
b24 organizations show <organization>
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the organization's id or name, as list prints it. |

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

**Returns:** crm record created — operation_id, id, created; every field: b24 commands info organizations create

**Example:** `b24 work organizations create --name "Acme"`

### `b24 organizations update`

change one organization on the portal; options left out keep their values

**Changes something in the service.**

```sh
b24 organizations update <organization> [options]
```

| Argument | | What it is |
|---|---|---|
| `organization` | required | the organization's id. |

| Option | What it does |
|---|---|
| `--name <name>` | the name. |
| `--body <json>` | the other fields to set, as JSON with Bitrix24's own field names, such as {"post":"Buyer","assignedById":7}; naming another employee as the one responsible checks crm.assign-others. |
| `--field <key=value>` | a custom field, by its label or code as `fields list` prints them, and its value; a list field takes its option's label or id; repeat it for more fields, or for each value of a multiple field. Over --body for the same field; --dry-run does not look the names up. |

**Returns:** crm record updated — operation_id, id, updated; every field: b24 commands info organizations update

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
b24 products show <product>
```

| Argument | | What it is |
|---|---|---|
| `product` | required | the product's id, as list prints it. |

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
b24 users show <user>
```

| Argument | | What it is |
|---|---|---|
| `user` | required | the user's id, as list prints it. |

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

**Example:** `b24 work api list`, `b24 work api list scope:crm effect:write`

### `b24 api show`

show which REST version a method goes to, what it does and the permissions it checks; calls nothing

```sh
b24 api show <method>
```

| Argument | | What it is |
|---|---|---|
| `method` | required | the Bitrix24 method, such as crm.deal.list. |

**Returns:** show a method's REST version and permissions; calls nothing

**Example:** `b24 work api show crm.deal.update --json`

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

## `b24 schedule`

run a b24 command or an agent later or on a timer (systemd, launchd, Task Scheduler); an agent cannot send

### `b24 schedule command`

run b24 <args…> on a timer — reads save what they read, so this is how a chat's history fills the store

**Changes something on this computer only.**

```sh
b24 schedule command <name> <args> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `args` | required | the b24 command after its name, e.g. -- messages list <chat> --limit 50. |

| Option | What it does |
|---|---|
| `--every <duration>` | repeat: 30m, 2h, 1d. |
| `--at <HH:MM>` | every day at this local time; 'mon 09:00' once a week, 'mon,fri 09:00' on several days (mon, tue, wed, thu, fri, sat, sun); repeat it for more times. |
| `--at-time <time>` | one run: 30m, 2d from now, or an ISO time; the schedule removes itself after it. |
| `--notify-on <when>` | desktop notice after a run (default failures for an agent that repeats with --every, else always). One of: `always`, `failures`, `never`. |
| `--deliver-to <route>` | also send the result, when --notify-on says so, by the owner's own tg or mail: telegram-bot:<profile>/<chat id or user:id>, or email:<profile>/<address>; repeat it for more. |

**Returns:** run b24 <args…> on a timer — reads save what they read, so this is how a…

**Example:** `b24 personal schedule command health --every 1h -- doctor`, `b24 personal schedule command morning-check --at 08:00 -- doctor`

### `b24 schedule agent`

start an agent (claude, codex, gemini, cursor, opencode, openclaw, hermes, grok, kimi) with a prompt on a timer; it runs with B24_READ_ONLY=1, so it reads and drafts and cannot send, and its own limits hold it to these CLIs' commands; an agent with no such limit is refused (`schedule agents list` says which) — its answer is kept and you are notified

**Changes something on this computer only.**

```sh
b24 schedule agent <name> <harness> <prompt> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | lowercase letters, digits and dashes. |
| `harness` | required | the agent to start. One of: `claude`, `codex`, `gemini`, `cursor`, `opencode`, `openclaw`, `hermes`, `grok`, `kimi`. |
| `prompt` | required | what to do, e.g. "summarize what came in during the last day: b24 personal search messages 'date>1d' --newest --limit 20". |

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

**Returns:** start an agent (claude, codex, gemini, cursor, opencode, openclaw, hermes,…

**Example:** `b24 personal schedule agent review claude "review what came in overnight and draft replies" --at 08:30`, `b24 personal schedule agent triage gemini "list what needs an answer today" --every 2h`, `b24 personal schedule agent weekly claude "review the week's open threads" --at 09:00 --model opus`

### `b24 schedule list`

the schedules, when they run and how their last run went

```sh
b24 schedule list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** scheduled job — name, kind, when, last, paused, notify, deliver_to, harness, and 4 more; every field: b24 commands info schedule list

**Example:** `b24 personal schedule list`, `b24 personal schedule list kind:agent`

### `b24 schedule agents`

the coding agents an agent schedule may start

#### `b24 schedule agents list`

the agents a schedule may start, and which are on PATH here

```sh
b24 schedule agents list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** schedule harness — id, name, programs, reports_cost, restricted, restricted_reason, allowed_with_ack, installed, and 1 more; every field: b24 commands info schedule agents list

**Example:** `b24 personal schedule agents list`, `b24 personal schedule agents list --json`

### `b24 schedule run`

run a schedule now, as its timer would, and wait for it; a paused one runs too

**Changes something in the service.**

```sh
b24 schedule run <name> [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

| Option | What it does |
|---|---|
| `--no-notify` | keep the result here: send it along none of its routes. |
| `--deliver-to <route>` | send it along only this one of its own routes; repeat it for more. |

**Returns:** run a schedule now, as its timer would, and wait for it; a paused one runs too

**Example:** `b24 personal schedule run health`

### `b24 schedule remove`

stop a schedule and remove its timer; its past output stays

**Changes something on this computer only.**

```sh
b24 schedule remove <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Returns:** stop a schedule and remove its timer; its past output stays

**Example:** `b24 personal schedule remove health`

### `b24 schedule pause`

take a schedule off its timer and keep it; run runs it, resume puts it back

**Changes something on this computer only.**

```sh
b24 schedule pause <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Returns:** take a schedule off its timer and keep it; run runs it, resume puts it back

**Example:** `b24 personal schedule pause health`

### `b24 schedule resume`

put a paused schedule back on its timer

**Changes something on this computer only.**

```sh
b24 schedule resume <name>
```

| Argument | | What it is |
|---|---|---|
| `name` | required | the schedule's name, as `schedule list` shows it. |

**Returns:** put a paused schedule back on its timer

**Example:** `b24 personal schedule resume health`

### `b24 schedule exec`

what a timer runs, given the schedule's file; to run one by hand, use run

**Changes something in the service.**

```sh
b24 schedule exec <file> [seal]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | the schedule's schedule.json in the state folder, as the timer passes it. |
| `seal` | optional | the file's SHA-256 as it was saved, which the timer passes; a file that differs does not run. |

**Returns:** what a timer runs, given the schedule's file; to run one by hand, use run

**Example:** `b24 personal schedule exec ~/.local/share/bitrix24-cli/schedules/health/schedule.json`

## `b24 doctor`

the state this installation is in, without connecting unless --online

```sh
b24 doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

### `b24 doctor reports`

problem reports

#### `b24 doctor reports show`

what a problem report holds; writes nothing

```sh
b24 doctor reports show
```

**Returns:** what a problem report holds; writes nothing

**Example:** `b24 doctor reports show`

#### `b24 doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
b24 doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Returns:** write a problem report to a file, and say where to send it

**Example:** `b24 doctor reports create --output ./problem-report.json`

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

## `b24 guide`

scenarios: the commands for a common task, in order, and why each

```sh
b24 guide [name]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | one scenario; without it, the list. |

**Returns:** scenarios: the commands for a common task, in order, and why each

**Example:** `b24 guide`, `b24 guide first-sync --json`

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
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks. |
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
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks. |

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

## `b24 complete`

shell completion: `b24 complete zsh` prints the script to source

```sh
b24 complete [words]
```

| Argument | | What it is |
|---|---|---|
| `words` | optional | zsh for the shell script, or command words to complete. |

**Returns:** shell completion: `b24 complete zsh` prints the script to source

**Example:** `b24 complete zsh`

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
