---
title: "Команды wordpress"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Каждая команда, параметр и код выхода, созданные из самой программы. Тот же список в JSON дает
`wordpress commands --json`. Описания команд и параметров остаются на языке встроенной справки.

**Первым словом идет профиль**, имя, которое вы выбираете сами: `wordpress personal config show`. `WCWP_PROFILE`
делает то же для всего сеанса оболочки. Профиль никогда не подставляется сам: команда, которой нужен аккаунт, без
профиля останавливается и показывает профили на этом компьютере.

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

## `wordpress commands`

every command by section; --json prints its contract, one path per call

### `wordpress commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
wordpress commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `wordpress commands info commands`

## `wordpress session`

keep this profile's WordPress application password in the OS keyring

### `wordpress session start`

sign this profile in: the WordPress application password is asked hidden or read from stdin, never taken as an argument, checked with WordPress, and only then kept in the keyring, or in a private file. Make an application password in your WordPress profile; it can do what your user can, no more.

**Changes something on this computer only.**

```sh
wordpress session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |
| `--login <name>` | the WordPress user name the password belongs to. |
| `--site <address>` | the WordPress site, as https://blog.example.com or blog.example.com. |

**Example:** `wordpress personal session start --site blog.example.com --login <name>`, `wordpress personal session start --credential-storage file`

### `wordpress session status`

show where this profile's token comes from: WCWP_TOKEN, the keyring or a file, never the token; --check asks WordPress whose token it is

```sh
wordpress session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask WordPress whether the token still works, and whose it is. |

**Example:** `wordpress personal session status`, `wordpress personal session status --check --json`

### `wordpress session end`

forget this profile's token on this computer; the token itself stays valid in WordPress

**Changes something on this computer only.**

```sh
wordpress session end
```

**Example:** `wordpress personal session end`

### `wordpress session list`

list the profiles on this computer and whether each has a token; picks none

```sh
wordpress session list
```

**Example:** `wordpress session list`, `wordpress session list --json`

## `wordpress api`

the raw WordPress API, one command per operation of its index at /wp-json

### `wordpress api list`

list every WordPress API operation this CLI offers, without calling WordPress

```sh
wordpress api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `wordpress personal api list`, `wordpress personal api list effect:destructive --json=command,path`

### `wordpress api show`

show one operation's parameters and request schema, without calling WordPress

```sh
wordpress api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `wordpress personal api show "block-directory-search-list" --json`

### `wordpress api block-directory-search-list`

getWpV2BlockDirectorySearch — read (GET /wp/v2/block-directory/search)

```sh
wordpress api block-directory-search-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--term <value>` | Limit result set to blocks matching the search term. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api block-directory-search-list --term <value>`

### `wordpress api block-patterns-categories-list`

getWpV2BlockPatternsCategories — read (GET /wp/v2/block-patterns/categories)

```sh
wordpress api block-patterns-categories-list
```

**Example:** `wordpress personal api block-patterns-categories-list`

### `wordpress api block-patterns-patterns-list`

getWpV2BlockPatternsPatterns — read (GET /wp/v2/block-patterns/patterns)

```sh
wordpress api block-patterns-patterns-list
```

**Example:** `wordpress personal api block-patterns-patterns-list`

### `wordpress api block-types-list`

getWpV2BlockTypes — read (GET /wp/v2/block-types)

```sh
wordpress api block-types-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--namespace <value>` | Block namespace. |

**Example:** `wordpress personal api block-types-list`

### `wordpress api block-types-list-namespace`

getWpV2BlockTypesByNamespace — read (GET /wp/v2/block-types/{namespace})

```sh
wordpress api block-types-list-namespace [options]
```

| Option | What it does |
|---|---|
| `--namespace <value>` | namespace. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api block-types-list-namespace --namespace <value>`

### `wordpress api block-types-get`

getWpV2BlockTypesByNamespaceByName — read (GET /wp/v2/block-types/{namespace}/{name})

```sh
wordpress api block-types-get [options]
```

| Option | What it does |
|---|---|
| `--namespace <value>` | namespace. |
| `--name <value>` | name. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api block-types-get --namespace <value> --name <value>`

### `wordpress api blocks-list`

getWpV2Blocks — read (GET /wp/v2/blocks)

```sh
wordpress api blocks-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--tax-relation <value>` | Limit result set based on relationship between multiple taxonomies. |
| `--wp-pattern-category <value>` | Limit result set to items with specific terms assigned in the wp_pattern_category taxonomy. |
| `--wp-pattern-category-exclude <value>` | Limit result set to items except those with specific terms assigned in the wp_pattern_category taxonomy. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api blocks-list`

### `wordpress api blocks-create`

postWpV2Blocks — write (POST /wp/v2/blocks)

**Changes something in the service.**

```sh
wordpress api blocks-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api blocks-create`

### `wordpress api blocks-get`

getWpV2BlocksById — read (GET /wp/v2/blocks/{id})

```sh
wordpress api blocks-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--excerpt-length <value>` | Override the default excerpt length. |
| `--password <value>` | The password for the post if it is password protected. |

**Example:** `wordpress personal api blocks-get --id <value>`

### `wordpress api blocks-update`

postWpV2BlocksById — write (POST /wp/v2/blocks/{id})

**Changes something in the service.**

```sh
wordpress api blocks-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api blocks-update --id <value>`

### `wordpress api blocks-delete`

deleteWpV2BlocksById — destructive (DELETE /wp/v2/blocks/{id})

**Changes something in the service.**

```sh
wordpress api blocks-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api blocks-delete --id <value>`

### `wordpress api blocks-autosaves-list`

getWpV2BlocksByIdAutosaves — read (GET /wp/v2/blocks/{id}/autosaves)

```sh
wordpress api blocks-autosaves-list [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--parent <value>` | The ID for the parent of the autosave. |

**Example:** `wordpress personal api blocks-autosaves-list --id <value>`

### `wordpress api blocks-autosaves-create`

postWpV2BlocksByIdAutosaves — write (POST /wp/v2/blocks/{id}/autosaves)

**Changes something in the service.**

```sh
wordpress api blocks-autosaves-create [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api blocks-autosaves-create --id <value>`

### `wordpress api blocks-autosaves-get`

getWpV2BlocksByParentAutosavesById — read (GET /wp/v2/blocks/{parent}/autosaves/{id})

```sh
wordpress api blocks-autosaves-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api blocks-autosaves-get --parent <value> --id <value>`

### `wordpress api blocks-revisions-list`

getWpV2BlocksByParentRevisions — read (GET /wp/v2/blocks/{parent}/revisions)

```sh
wordpress api blocks-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by object attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api blocks-revisions-list --parent <value>`

### `wordpress api blocks-revisions-get`

getWpV2BlocksByParentRevisionsById — read (GET /wp/v2/blocks/{parent}/revisions/{id})

```sh
wordpress api blocks-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api blocks-revisions-get --parent <value> --id <value>`

### `wordpress api blocks-revisions-delete`

deleteWpV2BlocksByParentRevisionsById — destructive (DELETE /wp/v2/blocks/{parent}/revisions/{id})

**Changes something in the service.**

```sh
wordpress api blocks-revisions-delete [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as revisions do not support trashing. |

**Example:** `wordpress personal api blocks-revisions-delete --parent <value> --id <value>`

### `wordpress api categories-list`

getWpV2Categories — read (GET /wp/v2/categories)

```sh
wordpress api categories-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--hide-empty <value>` | Whether to hide terms not assigned to any posts. |
| `--include <value>` | Limit result set to specific IDs. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by term attribute. |
| `--page <value>` | Current page of the collection. |
| `--parent <value>` | Limit result set to terms assigned to a specific parent. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--post <value>` | Limit result set to terms assigned to a specific post. |
| `--search <value>` | Limit results to those matching a string. |
| `--slug <value>` | Limit result set to terms with one or more specific slugs. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api categories-list`

### `wordpress api categories-create`

postWpV2Categories — write (POST /wp/v2/categories)

**Changes something in the service.**

```sh
wordpress api categories-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api categories-create`

### `wordpress api categories-get`

getWpV2CategoriesById — read (GET /wp/v2/categories/{id})

```sh
wordpress api categories-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api categories-get --id <value>`

### `wordpress api categories-update`

postWpV2CategoriesById — write (POST /wp/v2/categories/{id})

**Changes something in the service.**

```sh
wordpress api categories-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api categories-update --id <value>`

### `wordpress api categories-delete`

deleteWpV2CategoriesById — destructive (DELETE /wp/v2/categories/{id})

**Changes something in the service.**

```sh
wordpress api categories-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as terms do not support trashing. |

**Example:** `wordpress personal api categories-delete --id <value>`

### `wordpress api comments-list`

getWpV2Comments — read (GET /wp/v2/comments)

```sh
wordpress api comments-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to comments published after a given ISO8601 compliant date. |
| `--author <value>` | Limit result set to comments assigned to specific user IDs. Requires authorization. |
| `--author-email <value>` | Limit result set to that from a specific author email. Requires authorization. |
| `--author-exclude <value>` | Ensure result set excludes comments assigned to specific user IDs. Requires authorization. |
| `--before <value>` | Limit response to comments published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by comment attribute. |
| `--page <value>` | Current page of the collection. |
| `--parent <value>` | Limit result set to comments of specific parent IDs. |
| `--parent-exclude <value>` | Ensure result set excludes specific parent IDs. |
| `--password <value>` | The password for the post if it is password protected. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--post <value>` | Limit result set to comments assigned to specific post IDs. |
| `--search <value>` | Limit results to those matching a string. |
| `--status <value>` | Limit result set to comments assigned a specific status. Requires authorization. |
| `--type <value>` | Limit result set to comments assigned a specific type. Requires authorization. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api comments-list`

### `wordpress api comments-create`

postWpV2Comments — write (POST /wp/v2/comments)

**Changes something in the service.**

```sh
wordpress api comments-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api comments-create`

### `wordpress api comments-get`

getWpV2CommentsById — read (GET /wp/v2/comments/{id})

```sh
wordpress api comments-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--password <value>` | The password for the parent post of the comment (if the post is password protected). |

**Example:** `wordpress personal api comments-get --id <value>`

### `wordpress api comments-update`

postWpV2CommentsById — write (POST /wp/v2/comments/{id})

**Changes something in the service.**

```sh
wordpress api comments-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api comments-update --id <value>`

### `wordpress api comments-delete`

deleteWpV2CommentsById — destructive (DELETE /wp/v2/comments/{id})

**Changes something in the service.**

```sh
wordpress api comments-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |
| `--password <value>` | The password for the parent post of the comment (if the post is password protected). |

**Example:** `wordpress personal api comments-delete --id <value>`

### `wordpress api font-collections-list`

getWpV2FontCollections — read (GET /wp/v2/font-collections)

```sh
wordpress api font-collections-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api font-collections-list`

### `wordpress api font-families-list`

getWpV2FontFamilies — read (GET /wp/v2/font-families)

```sh
wordpress api font-families-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api font-families-list`

### `wordpress api font-families-create`

postWpV2FontFamilies — write (POST /wp/v2/font-families)

**Changes something in the service.**

```sh
wordpress api font-families-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api font-families-create`

### `wordpress api font-families-font-faces-list`

getWpV2FontFamiliesByFontFamilyIdFontFaces — read (GET /wp/v2/font-families/{font_family_id}/font-faces)

```sh
wordpress api font-families-font-faces-list [options]
```

| Option | What it does |
|---|---|
| `--font-family-id <value>` | font_family_id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api font-families-font-faces-list --font-family-id <value>`

### `wordpress api font-families-font-faces-create`

postWpV2FontFamiliesByFontFamilyIdFontFaces — write (POST /wp/v2/font-families/{font_family_id}/font-faces)

**Changes something in the service.**

```sh
wordpress api font-families-font-faces-create [options]
```

| Option | What it does |
|---|---|
| `--font-family-id <value>` | font_family_id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api font-families-font-faces-create --font-family-id <value>`

### `wordpress api font-families-font-faces-get`

getWpV2FontFamiliesByFontFamilyIdFontFacesById — read (GET /wp/v2/font-families/{font_family_id}/font-faces/{id})

```sh
wordpress api font-families-font-faces-get [options]
```

| Option | What it does |
|---|---|
| `--font-family-id <value>` | font_family_id. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api font-families-font-faces-get --font-family-id <value> --id <value>`

### `wordpress api font-families-font-faces-delete`

deleteWpV2FontFamiliesByFontFamilyIdFontFacesById — destructive (DELETE /wp/v2/font-families/{font_family_id}/font-faces/{id})

**Changes something in the service.**

```sh
wordpress api font-families-font-faces-delete [options]
```

| Option | What it does |
|---|---|
| `--font-family-id <value>` | font_family_id. |
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api font-families-font-faces-delete --font-family-id <value> --id <value>`

### `wordpress api font-families-get`

getWpV2FontFamiliesById — read (GET /wp/v2/font-families/{id})

```sh
wordpress api font-families-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api font-families-get --id <value>`

### `wordpress api font-families-update`

postWpV2FontFamiliesById — write (POST /wp/v2/font-families/{id})

**Changes something in the service.**

```sh
wordpress api font-families-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api font-families-update --id <value>`

### `wordpress api font-families-delete`

deleteWpV2FontFamiliesById — destructive (DELETE /wp/v2/font-families/{id})

**Changes something in the service.**

```sh
wordpress api font-families-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api font-families-delete --id <value>`

### `wordpress api global-styles-revisions-list`

getWpV2GlobalStylesByParentRevisions — read (GET /wp/v2/global-styles/{parent}/revisions)

```sh
wordpress api global-styles-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api global-styles-revisions-list --parent <value>`

### `wordpress api global-styles-revisions-get`

getWpV2GlobalStylesByParentRevisionsById — read (GET /wp/v2/global-styles/{parent}/revisions/{id})

```sh
wordpress api global-styles-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api global-styles-revisions-get --parent <value> --id <value>`

### `wordpress api media-list`

getWpV2Media — read (GET /wp/v2/media)

```sh
wordpress api media-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--author <value>` | Limit result set to posts assigned to specific authors. |
| `--author-exclude <value>` | Ensure result set excludes posts assigned to specific authors. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--media-type <value>` | Limit result set to attachments of a particular media type or media types. |
| `--mime-type <value>` | Limit result set to attachments of a particular MIME type or MIME types. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--parent <value>` | Limit result set to items with particular parent IDs. |
| `--parent-exclude <value>` | Limit result set to all items except those of a particular parent ID. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api media-list`

### `wordpress api media-create`

postWpV2Media — write (POST /wp/v2/media)

**Changes something in the service.**

```sh
wordpress api media-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api media-create`

### `wordpress api media-get`

getWpV2MediaById — read (GET /wp/v2/media/{id})

```sh
wordpress api media-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api media-get --id <value>`

### `wordpress api media-update`

postWpV2MediaById — write (POST /wp/v2/media/{id})

**Changes something in the service.**

```sh
wordpress api media-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api media-update --id <value>`

### `wordpress api media-delete`

deleteWpV2MediaById — destructive (DELETE /wp/v2/media/{id})

**Changes something in the service.**

```sh
wordpress api media-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api media-delete --id <value>`

### `wordpress api media-edit`

postWpV2MediaByIdEdit — write (POST /wp/v2/media/{id}/edit)

**Changes something in the service.**

```sh
wordpress api media-edit [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api media-edit --id <value>`

### `wordpress api media-post-process`

postWpV2MediaByIdPostProcess — write (POST /wp/v2/media/{id}/post-process)

**Changes something in the service.**

```sh
wordpress api media-post-process [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api media-post-process --id <value>`

### `wordpress api menu-items-list`

getWpV2MenuItems — read (GET /wp/v2/menu-items)

```sh
wordpress api menu-items-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--menu-order <value>` | Limit result set to posts with a specific menu_order value. |
| `--menus <value>` | Limit result set to items with specific terms assigned in the menus taxonomy. |
| `--menus-exclude <value>` | Limit result set to items except those with specific terms assigned in the menus taxonomy. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by object attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--tax-relation <value>` | Limit result set based on relationship between multiple taxonomies. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api menu-items-list`

### `wordpress api menu-items-create`

postWpV2MenuItems — write (POST /wp/v2/menu-items)

**Changes something in the service.**

```sh
wordpress api menu-items-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api menu-items-create`

### `wordpress api menu-items-get`

getWpV2MenuItemsById — read (GET /wp/v2/menu-items/{id})

```sh
wordpress api menu-items-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api menu-items-get --id <value>`

### `wordpress api menu-items-update`

postWpV2MenuItemsById — write (POST /wp/v2/menu-items/{id})

**Changes something in the service.**

```sh
wordpress api menu-items-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api menu-items-update --id <value>`

### `wordpress api menu-items-delete`

deleteWpV2MenuItemsById — destructive (DELETE /wp/v2/menu-items/{id})

**Changes something in the service.**

```sh
wordpress api menu-items-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api menu-items-delete --id <value>`

### `wordpress api menu-items-autosaves-list`

getWpV2MenuItemsByIdAutosaves — read (GET /wp/v2/menu-items/{id}/autosaves)

```sh
wordpress api menu-items-autosaves-list [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--parent <value>` | The ID for the parent of the autosave. |

**Example:** `wordpress personal api menu-items-autosaves-list --id <value>`

### `wordpress api menu-items-autosaves-create`

postWpV2MenuItemsByIdAutosaves — write (POST /wp/v2/menu-items/{id}/autosaves)

**Changes something in the service.**

```sh
wordpress api menu-items-autosaves-create [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api menu-items-autosaves-create --id <value>`

### `wordpress api menu-items-autosaves-get`

getWpV2MenuItemsByParentAutosavesById — read (GET /wp/v2/menu-items/{parent}/autosaves/{id})

```sh
wordpress api menu-items-autosaves-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api menu-items-autosaves-get --parent <value> --id <value>`

### `wordpress api menu-locations-list`

getWpV2MenuLocations — read (GET /wp/v2/menu-locations)

```sh
wordpress api menu-locations-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api menu-locations-list`

### `wordpress api menu-locations-get`

getWpV2MenuLocationsByLocation — read (GET /wp/v2/menu-locations/{location})

```sh
wordpress api menu-locations-get [options]
```

| Option | What it does |
|---|---|
| `--location <value>` | location. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api menu-locations-get --location <value>`

### `wordpress api menus-list`

getWpV2Menus — read (GET /wp/v2/menus)

```sh
wordpress api menus-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--hide-empty <value>` | Whether to hide terms not assigned to any posts. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by term attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--post <value>` | Limit result set to terms assigned to a specific post. |
| `--search <value>` | Limit results to those matching a string. |
| `--slug <value>` | Limit result set to terms with one or more specific slugs. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api menus-list`

### `wordpress api menus-create`

postWpV2Menus — write (POST /wp/v2/menus)

**Changes something in the service.**

```sh
wordpress api menus-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api menus-create`

### `wordpress api menus-get`

getWpV2MenusById — read (GET /wp/v2/menus/{id})

```sh
wordpress api menus-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api menus-get --id <value>`

### `wordpress api menus-update`

postWpV2MenusById — write (POST /wp/v2/menus/{id})

**Changes something in the service.**

```sh
wordpress api menus-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api menus-update --id <value>`

### `wordpress api menus-delete`

deleteWpV2MenusById — destructive (DELETE /wp/v2/menus/{id})

**Changes something in the service.**

```sh
wordpress api menus-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as terms do not support trashing. |

**Example:** `wordpress personal api menus-delete --id <value>`

### `wordpress api navigation-list`

getWpV2Navigation — read (GET /wp/v2/navigation)

```sh
wordpress api navigation-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api navigation-list`

### `wordpress api navigation-create`

postWpV2Navigation — write (POST /wp/v2/navigation)

**Changes something in the service.**

```sh
wordpress api navigation-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api navigation-create`

### `wordpress api navigation-get`

getWpV2NavigationById — read (GET /wp/v2/navigation/{id})

```sh
wordpress api navigation-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--password <value>` | The password for the post if it is password protected. |

**Example:** `wordpress personal api navigation-get --id <value>`

### `wordpress api navigation-update`

postWpV2NavigationById — write (POST /wp/v2/navigation/{id})

**Changes something in the service.**

```sh
wordpress api navigation-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api navigation-update --id <value>`

### `wordpress api navigation-delete`

deleteWpV2NavigationById — destructive (DELETE /wp/v2/navigation/{id})

**Changes something in the service.**

```sh
wordpress api navigation-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api navigation-delete --id <value>`

### `wordpress api navigation-autosaves-list`

getWpV2NavigationByIdAutosaves — read (GET /wp/v2/navigation/{id}/autosaves)

```sh
wordpress api navigation-autosaves-list [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--parent <value>` | The ID for the parent of the autosave. |

**Example:** `wordpress personal api navigation-autosaves-list --id <value>`

### `wordpress api navigation-autosaves-create`

postWpV2NavigationByIdAutosaves — write (POST /wp/v2/navigation/{id}/autosaves)

**Changes something in the service.**

```sh
wordpress api navigation-autosaves-create [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api navigation-autosaves-create --id <value>`

### `wordpress api navigation-autosaves-get`

getWpV2NavigationByParentAutosavesById — read (GET /wp/v2/navigation/{parent}/autosaves/{id})

```sh
wordpress api navigation-autosaves-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api navigation-autosaves-get --parent <value> --id <value>`

### `wordpress api navigation-revisions-list`

getWpV2NavigationByParentRevisions — read (GET /wp/v2/navigation/{parent}/revisions)

```sh
wordpress api navigation-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by object attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api navigation-revisions-list --parent <value>`

### `wordpress api navigation-revisions-get`

getWpV2NavigationByParentRevisionsById — read (GET /wp/v2/navigation/{parent}/revisions/{id})

```sh
wordpress api navigation-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api navigation-revisions-get --parent <value> --id <value>`

### `wordpress api navigation-revisions-delete`

deleteWpV2NavigationByParentRevisionsById — destructive (DELETE /wp/v2/navigation/{parent}/revisions/{id})

**Changes something in the service.**

```sh
wordpress api navigation-revisions-delete [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as revisions do not support trashing. |

**Example:** `wordpress personal api navigation-revisions-delete --parent <value> --id <value>`

### `wordpress api pages-list`

getWpV2Pages — read (GET /wp/v2/pages)

```sh
wordpress api pages-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--author <value>` | Limit result set to posts assigned to specific authors. |
| `--author-exclude <value>` | Ensure result set excludes posts assigned to specific authors. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--menu-order <value>` | Limit result set to posts with a specific menu_order value. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--parent <value>` | Limit result set to items with particular parent IDs. |
| `--parent-exclude <value>` | Limit result set to all items except those of a particular parent ID. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api pages-list`

### `wordpress api pages-create`

postWpV2Pages — write (POST /wp/v2/pages)

**Changes something in the service.**

```sh
wordpress api pages-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api pages-create`

### `wordpress api pages-get`

getWpV2PagesById — read (GET /wp/v2/pages/{id})

```sh
wordpress api pages-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--excerpt-length <value>` | Override the default excerpt length. |
| `--password <value>` | The password for the post if it is password protected. |

**Example:** `wordpress personal api pages-get --id <value>`

### `wordpress api pages-update`

postWpV2PagesById — write (POST /wp/v2/pages/{id})

**Changes something in the service.**

```sh
wordpress api pages-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api pages-update --id <value>`

### `wordpress api pages-delete`

deleteWpV2PagesById — destructive (DELETE /wp/v2/pages/{id})

**Changes something in the service.**

```sh
wordpress api pages-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api pages-delete --id <value>`

### `wordpress api pages-autosaves-list`

getWpV2PagesByIdAutosaves — read (GET /wp/v2/pages/{id}/autosaves)

```sh
wordpress api pages-autosaves-list [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--parent <value>` | The ID for the parent of the autosave. |

**Example:** `wordpress personal api pages-autosaves-list --id <value>`

### `wordpress api pages-autosaves-create`

postWpV2PagesByIdAutosaves — write (POST /wp/v2/pages/{id}/autosaves)

**Changes something in the service.**

```sh
wordpress api pages-autosaves-create [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api pages-autosaves-create --id <value>`

### `wordpress api pages-autosaves-get`

getWpV2PagesByParentAutosavesById — read (GET /wp/v2/pages/{parent}/autosaves/{id})

```sh
wordpress api pages-autosaves-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api pages-autosaves-get --parent <value> --id <value>`

### `wordpress api pages-revisions-list`

getWpV2PagesByParentRevisions — read (GET /wp/v2/pages/{parent}/revisions)

```sh
wordpress api pages-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by object attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api pages-revisions-list --parent <value>`

### `wordpress api pages-revisions-get`

getWpV2PagesByParentRevisionsById — read (GET /wp/v2/pages/{parent}/revisions/{id})

```sh
wordpress api pages-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api pages-revisions-get --parent <value> --id <value>`

### `wordpress api pages-revisions-delete`

deleteWpV2PagesByParentRevisionsById — destructive (DELETE /wp/v2/pages/{parent}/revisions/{id})

**Changes something in the service.**

```sh
wordpress api pages-revisions-delete [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as revisions do not support trashing. |

**Example:** `wordpress personal api pages-revisions-delete --parent <value> --id <value>`

### `wordpress api pattern-directory-patterns-list`

getWpV2PatternDirectoryPatterns — read (GET /wp/v2/pattern-directory/patterns)

```sh
wordpress api pattern-directory-patterns-list [options]
```

| Option | What it does |
|---|---|
| `--category <value>` | Limit results to those matching a category ID. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--keyword <value>` | Limit results to those matching a keyword ID. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--slug <value>` | Limit results to those matching a pattern (slug). |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api pattern-directory-patterns-list`

### `wordpress api plugins-list`

getWpV2Plugins — read (GET /wp/v2/plugins)

```sh
wordpress api plugins-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--search <value>` | Limit results to those matching a string. |
| `--status <value>` | Limits results to plugins with the given status. |

**Example:** `wordpress personal api plugins-list`

### `wordpress api plugins-create`

postWpV2Plugins — write (POST /wp/v2/plugins)

**Changes something in the service.**

```sh
wordpress api plugins-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api plugins-create`

### `wordpress api posts-list`

getWpV2Posts — read (GET /wp/v2/posts)

```sh
wordpress api posts-list [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Limit response to posts published after a given ISO8601 compliant date. |
| `--author <value>` | Limit result set to posts assigned to specific authors. |
| `--author-exclude <value>` | Ensure result set excludes posts assigned to specific authors. |
| `--before <value>` | Limit response to posts published before a given ISO8601 compliant date. |
| `--categories <value>` | Limit result set to items with specific terms assigned in the categories taxonomy. |
| `--categories-exclude <value>` | Limit result set to items except those with specific terms assigned in the categories taxonomy. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--format <value>` | Limit result set to items assigned one or more given formats. |
| `--ignore-sticky <value>` | Whether to ignore sticky posts or not. |
| `--include <value>` | Limit result set to specific IDs. |
| `--modified-after <value>` | Limit response to posts modified after a given ISO8601 compliant date. |
| `--modified-before <value>` | Limit response to posts modified before a given ISO8601 compliant date. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by post attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--search-semantics <value>` | How to interpret the search input. |
| `--slug <value>` | Limit result set to posts with one or more specific slugs. |
| `--status <value>` | Limit result set to posts assigned one or more statuses. |
| `--sticky <value>` | Limit result set to items that are sticky. |
| `--tags <value>` | Limit result set to items with specific terms assigned in the tags taxonomy. |
| `--tags-exclude <value>` | Limit result set to items except those with specific terms assigned in the tags taxonomy. |
| `--tax-relation <value>` | Limit result set based on relationship between multiple taxonomies. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api posts-list`

### `wordpress api posts-create`

postWpV2Posts — write (POST /wp/v2/posts)

**Changes something in the service.**

```sh
wordpress api posts-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api posts-create`

### `wordpress api posts-get`

getWpV2PostsById — read (GET /wp/v2/posts/{id})

```sh
wordpress api posts-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--excerpt-length <value>` | Override the default excerpt length. |
| `--password <value>` | The password for the post if it is password protected. |

**Example:** `wordpress personal api posts-get --id <value>`

### `wordpress api posts-update`

postWpV2PostsById — write (POST /wp/v2/posts/{id})

**Changes something in the service.**

```sh
wordpress api posts-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api posts-update --id <value>`

### `wordpress api posts-delete`

deleteWpV2PostsById — destructive (DELETE /wp/v2/posts/{id})

**Changes something in the service.**

```sh
wordpress api posts-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to bypass Trash and force deletion. |

**Example:** `wordpress personal api posts-delete --id <value>`

### `wordpress api posts-autosaves-list`

getWpV2PostsByIdAutosaves — read (GET /wp/v2/posts/{id}/autosaves)

```sh
wordpress api posts-autosaves-list [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--parent <value>` | The ID for the parent of the autosave. |

**Example:** `wordpress personal api posts-autosaves-list --id <value>`

### `wordpress api posts-autosaves-create`

postWpV2PostsByIdAutosaves — write (POST /wp/v2/posts/{id}/autosaves)

**Changes something in the service.**

```sh
wordpress api posts-autosaves-create [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api posts-autosaves-create --id <value>`

### `wordpress api posts-autosaves-get`

getWpV2PostsByParentAutosavesById — read (GET /wp/v2/posts/{parent}/autosaves/{id})

```sh
wordpress api posts-autosaves-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api posts-autosaves-get --parent <value> --id <value>`

### `wordpress api posts-revisions-list`

getWpV2PostsByParentRevisions — read (GET /wp/v2/posts/{parent}/revisions)

```sh
wordpress api posts-revisions-list [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by object attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api posts-revisions-list --parent <value>`

### `wordpress api posts-revisions-get`

getWpV2PostsByParentRevisionsById — read (GET /wp/v2/posts/{parent}/revisions/{id})

```sh
wordpress api posts-revisions-get [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api posts-revisions-get --parent <value> --id <value>`

### `wordpress api posts-revisions-delete`

deleteWpV2PostsByParentRevisionsById — destructive (DELETE /wp/v2/posts/{parent}/revisions/{id})

**Changes something in the service.**

```sh
wordpress api posts-revisions-delete [options]
```

| Option | What it does |
|---|---|
| `--parent <value>` | parent. |
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as revisions do not support trashing. |

**Example:** `wordpress personal api posts-revisions-delete --parent <value> --id <value>`

### `wordpress api search-list`

getWpV2Search — read (GET /wp/v2/search)

```sh
wordpress api search-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--include <value>` | Limit result set to specific IDs. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--search <value>` | Limit results to those matching a string. |
| `--subtype <value>` | Limit results to items of one or more object subtypes. |
| `--type <value>` | Limit results to items of an object type. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api search-list`

### `wordpress api settings-list`

getWpV2Settings — read (GET /wp/v2/settings)

```sh
wordpress api settings-list
```

**Example:** `wordpress personal api settings-list`

### `wordpress api settings-create`

postWpV2Settings — write (POST /wp/v2/settings)

**Changes something in the service.**

```sh
wordpress api settings-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api settings-create`

### `wordpress api sidebars-list`

getWpV2Sidebars — read (GET /wp/v2/sidebars)

```sh
wordpress api sidebars-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api sidebars-list`

### `wordpress api sidebars-get`

getWpV2SidebarsById — read (GET /wp/v2/sidebars/{id})

```sh
wordpress api sidebars-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api sidebars-get --id <value>`

### `wordpress api sidebars-update`

postWpV2SidebarsById — write (POST /wp/v2/sidebars/{id})

**Changes something in the service.**

```sh
wordpress api sidebars-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api sidebars-update --id <value>`

### `wordpress api statuses-list`

getWpV2Statuses — read (GET /wp/v2/statuses)

```sh
wordpress api statuses-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api statuses-list`

### `wordpress api statuses-get`

getWpV2StatusesByStatus — read (GET /wp/v2/statuses/{status})

```sh
wordpress api statuses-get [options]
```

| Option | What it does |
|---|---|
| `--status <value>` | status. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api statuses-get --status <value>`

### `wordpress api tags-list`

getWpV2Tags — read (GET /wp/v2/tags)

```sh
wordpress api tags-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--hide-empty <value>` | Whether to hide terms not assigned to any posts. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by term attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--post <value>` | Limit result set to terms assigned to a specific post. |
| `--search <value>` | Limit results to those matching a string. |
| `--slug <value>` | Limit result set to terms with one or more specific slugs. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api tags-list`

### `wordpress api tags-create`

postWpV2Tags — write (POST /wp/v2/tags)

**Changes something in the service.**

```sh
wordpress api tags-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api tags-create`

### `wordpress api tags-get`

getWpV2TagsById — read (GET /wp/v2/tags/{id})

```sh
wordpress api tags-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api tags-get --id <value>`

### `wordpress api tags-update`

postWpV2TagsById — write (POST /wp/v2/tags/{id})

**Changes something in the service.**

```sh
wordpress api tags-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api tags-update --id <value>`

### `wordpress api tags-delete`

deleteWpV2TagsById — destructive (DELETE /wp/v2/tags/{id})

**Changes something in the service.**

```sh
wordpress api tags-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as terms do not support trashing. |

**Example:** `wordpress personal api tags-delete --id <value>`

### `wordpress api taxonomies-list`

getWpV2Taxonomies — read (GET /wp/v2/taxonomies)

```sh
wordpress api taxonomies-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--type <value>` | Limit results to taxonomies associated with a specific post type. |

**Example:** `wordpress personal api taxonomies-list`

### `wordpress api taxonomies-get`

getWpV2TaxonomiesByTaxonomy — read (GET /wp/v2/taxonomies/{taxonomy})

```sh
wordpress api taxonomies-get [options]
```

| Option | What it does |
|---|---|
| `--taxonomy <value>` | taxonomy. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api taxonomies-get --taxonomy <value>`

### `wordpress api template-parts-list`

getWpV2TemplateParts — read (GET /wp/v2/template-parts)

```sh
wordpress api template-parts-list [options]
```

| Option | What it does |
|---|---|
| `--area <value>` | Limit to the specified template part area. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--post-type <value>` | Post type to get the templates for. |
| `--wp-id <value>` | Limit to the specified post id. |

**Example:** `wordpress personal api template-parts-list`

### `wordpress api template-parts-create`

postWpV2TemplateParts — write (POST /wp/v2/template-parts)

**Changes something in the service.**

```sh
wordpress api template-parts-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api template-parts-create`

### `wordpress api template-parts-lookup-list`

getWpV2TemplatePartsLookup — read (GET /wp/v2/template-parts/lookup)

```sh
wordpress api template-parts-lookup-list [options]
```

| Option | What it does |
|---|---|
| `--is-custom <value>` | Indicates if a template is custom or part of the template hierarchy. |
| `--slug <value>` | The slug of the template to get the fallback for. |
| `--template-prefix <value>` | The template prefix for the created template. This is used to extract the main template type, e.g. in `taxonomy-books` extracts the `taxonomy`. |

**Example:** `wordpress personal api template-parts-lookup-list --slug <value>`

### `wordpress api templates-list`

getWpV2Templates — read (GET /wp/v2/templates)

```sh
wordpress api templates-list [options]
```

| Option | What it does |
|---|---|
| `--area <value>` | Limit to the specified template part area. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--post-type <value>` | Post type to get the templates for. |
| `--wp-id <value>` | Limit to the specified post id. |

**Example:** `wordpress personal api templates-list`

### `wordpress api templates-create`

postWpV2Templates — write (POST /wp/v2/templates)

**Changes something in the service.**

```sh
wordpress api templates-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api templates-create`

### `wordpress api templates-lookup-list`

getWpV2TemplatesLookup — read (GET /wp/v2/templates/lookup)

```sh
wordpress api templates-lookup-list [options]
```

| Option | What it does |
|---|---|
| `--is-custom <value>` | Indicates if a template is custom or part of the template hierarchy. |
| `--slug <value>` | The slug of the template to get the fallback for. |
| `--template-prefix <value>` | The template prefix for the created template. This is used to extract the main template type, e.g. in `taxonomy-books` extracts the `taxonomy`. |

**Example:** `wordpress personal api templates-lookup-list --slug <value>`

### `wordpress api themes-list`

getWpV2Themes — read (GET /wp/v2/themes)

```sh
wordpress api themes-list [options]
```

| Option | What it does |
|---|---|
| `--status <value>` | Limit result set to themes assigned one or more statuses. |

**Example:** `wordpress personal api themes-list`

### `wordpress api types-list`

getWpV2Types — read (GET /wp/v2/types)

```sh
wordpress api types-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api types-list`

### `wordpress api types-get`

getWpV2TypesByType — read (GET /wp/v2/types/{type})

```sh
wordpress api types-get [options]
```

| Option | What it does |
|---|---|
| `--type <value>` | type. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api types-get --type <value>`

### `wordpress api users-list`

getWpV2Users — read (GET /wp/v2/users)

```sh
wordpress api users-list [options]
```

| Option | What it does |
|---|---|
| `--capabilities <value>` | Limit result set to users matching at least one specific capability provided. Accepts csv list or single capability. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--has-published-posts <value>` | Limit result set to users who have published posts. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by user attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--roles <value>` | Limit result set to users matching at least one specific role provided. Accepts csv list or single role. |
| `--search <value>` | Limit results to those matching a string. |
| `--search-columns <value>` | Array of column names to be searched. |
| `--slug <value>` | Limit result set to users with one or more specific slugs. |
| `--who <value>` | Limit result set to users who are considered authors. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api users-list`

### `wordpress api users-create`

postWpV2Users — write (POST /wp/v2/users)

**Changes something in the service.**

```sh
wordpress api users-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api users-create`

### `wordpress api users-get`

getWpV2UsersById — read (GET /wp/v2/users/{id})

```sh
wordpress api users-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api users-get --id <value>`

### `wordpress api users-update`

postWpV2UsersById — write (POST /wp/v2/users/{id})

**Changes something in the service.**

```sh
wordpress api users-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api users-update --id <value>`

### `wordpress api users-delete`

deleteWpV2UsersById — destructive (DELETE /wp/v2/users/{id})

**Changes something in the service.**

```sh
wordpress api users-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as users do not support trashing. |
| `--reassign <value>` | Reassign the deleted user's posts and links to this user ID. |

**Example:** `wordpress personal api users-delete --id <value> --reassign <value>`

### `wordpress api users-application-passwords-delete-all`

deleteWpV2UsersByUserIdApplicationPasswords — destructive (DELETE /wp/v2/users/{user_id}/application-passwords)

**Changes something in the service.**

```sh
wordpress api users-application-passwords-delete-all [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | user_id. |

**Example:** `wordpress personal api users-application-passwords-delete-all --user-id <value>`

### `wordpress api users-application-passwords-delete`

deleteWpV2UsersByUserIdApplicationPasswordsByUuid — destructive (DELETE /wp/v2/users/{user_id}/application-passwords/{uuid})

**Changes something in the service.**

```sh
wordpress api users-application-passwords-delete [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | user_id. |
| `--uuid <value>` | uuid. |

**Example:** `wordpress personal api users-application-passwords-delete --user-id <value> --uuid <value>`

### `wordpress api users-me-get`

getWpV2UsersMe — read (GET /wp/v2/users/me)

```sh
wordpress api users-me-get [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api users-me-get`

### `wordpress api users-me-create`

postWpV2UsersMe — write (POST /wp/v2/users/me)

**Changes something in the service.**

```sh
wordpress api users-me-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api users-me-create`

### `wordpress api users-me-delete`

deleteWpV2UsersMe — destructive (DELETE /wp/v2/users/me)

**Changes something in the service.**

```sh
wordpress api users-me-delete [options]
```

| Option | What it does |
|---|---|
| `--force <value>` | Required to be true, as users do not support trashing. |
| `--reassign <value>` | Reassign the deleted user's posts and links to this user ID. |

**Example:** `wordpress personal api users-me-delete --reassign <value>`

### `wordpress api widget-types-list`

getWpV2WidgetTypes — read (GET /wp/v2/widget-types)

```sh
wordpress api widget-types-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api widget-types-list`

### `wordpress api widget-types-get`

getWpV2WidgetTypesById — read (GET /wp/v2/widget-types/{id})

```sh
wordpress api widget-types-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api widget-types-get --id <value>`

### `wordpress api widget-types-encode`

postWpV2WidgetTypesByIdEncode — write (POST /wp/v2/widget-types/{id}/encode)

**Changes something in the service.**

```sh
wordpress api widget-types-encode [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api widget-types-encode --id <value>`

### `wordpress api widget-types-render`

postWpV2WidgetTypesByIdRender — write (POST /wp/v2/widget-types/{id}/render)

**Changes something in the service.**

```sh
wordpress api widget-types-render [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api widget-types-render --id <value>`

### `wordpress api widgets-list`

getWpV2Widgets — read (GET /wp/v2/widgets)

```sh
wordpress api widgets-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--sidebar <value>` | The sidebar to return widgets for. |

**Example:** `wordpress personal api widgets-list`

### `wordpress api widgets-create`

postWpV2Widgets — write (POST /wp/v2/widgets)

**Changes something in the service.**

```sh
wordpress api widgets-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api widgets-create`

### `wordpress api widgets-get`

getWpV2WidgetsById — read (GET /wp/v2/widgets/{id})

```sh
wordpress api widgets-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api widgets-get --id <value>`

### `wordpress api widgets-update`

postWpV2WidgetsById — write (POST /wp/v2/widgets/{id})

**Changes something in the service.**

```sh
wordpress api widgets-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api widgets-update --id <value>`

### `wordpress api widgets-delete`

deleteWpV2WidgetsById — destructive (DELETE /wp/v2/widgets/{id})

**Changes something in the service.**

```sh
wordpress api widgets-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Whether to force removal of the widget, or move it to the inactive sidebar. |

**Example:** `wordpress personal api widgets-delete --id <value>`

### `wordpress api wp-pattern-category-list`

getWpV2WpPatternCategory — read (GET /wp/v2/wp_pattern_category)

```sh
wordpress api wp-pattern-category-list [options]
```

| Option | What it does |
|---|---|
| `--context <value>` | Scope under which the request is made; determines fields present in response. |
| `--exclude <value>` | Ensure result set excludes specific IDs. |
| `--hide-empty <value>` | Whether to hide terms not assigned to any posts. |
| `--include <value>` | Limit result set to specific IDs. |
| `--offset <value>` | Offset the result set by a specific number of items. |
| `--order <value>` | Order sort attribute ascending or descending. |
| `--orderby <value>` | Sort collection by term attribute. |
| `--page <value>` | Current page of the collection. |
| `--per-page <value>` | Maximum number of items to be returned in result set. |
| `--post <value>` | Limit result set to terms assigned to a specific post. |
| `--search <value>` | Limit results to those matching a string. |
| `--slug <value>` | Limit result set to terms with one or more specific slugs. |
| `--all` | read every page, as the API pages it. |

**Example:** `wordpress personal api wp-pattern-category-list`

### `wordpress api wp-pattern-category-create`

postWpV2WpPatternCategory — write (POST /wp/v2/wp_pattern_category)

**Changes something in the service.**

```sh
wordpress api wp-pattern-category-create [options]
```

| Option | What it does |
|---|---|
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api wp-pattern-category-create`

### `wordpress api wp-pattern-category-get`

getWpV2WpPatternCategoryById — read (GET /wp/v2/wp_pattern_category/{id})

```sh
wordpress api wp-pattern-category-get [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--context <value>` | Scope under which the request is made; determines fields present in response. |

**Example:** `wordpress personal api wp-pattern-category-get --id <value>`

### `wordpress api wp-pattern-category-update`

postWpV2WpPatternCategoryById — write (POST /wp/v2/wp_pattern_category/{id})

**Changes something in the service.**

```sh
wordpress api wp-pattern-category-update [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `wordpress personal api wp-pattern-category-update --id <value>`

### `wordpress api wp-pattern-category-delete`

deleteWpV2WpPatternCategoryById — destructive (DELETE /wp/v2/wp_pattern_category/{id})

**Changes something in the service.**

```sh
wordpress api wp-pattern-category-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | id. |
| `--force <value>` | Required to be true, as terms do not support trashing. |

**Example:** `wordpress personal api wp-pattern-category-delete --id <value>`

## `wordpress sync`

bring the copy of your posts up to date: channels, authors, tags and categories, and posts that changed since the last sync, or everything with --rescan. Once a day it also finds what the site deleted for good; trash stays a status. A site whose address changed, or a sign-in that sees only part, marks nothing deleted

**Changes something on this computer only.**

```sh
wordpress sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, every id too, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the source in this run. |

**Returns:** content sync — provider, account, state, complete, channels, due, metrics, synced, and 1 more; every field: wordpress commands info sync

**Example:** `wordpress work sync`, `wordpress work sync --rescan`

## `wordpress channels`

the sites and social accounts this profile publishes on

### `wordpress channels list`

the channels copied by the last sync

```sh
wordpress channels list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

**Returns:** content channel — external_id, kind, network, name; every field: wordpress commands info channels list

**Example:** `wordpress work channels list`

## `wordpress posts`

posts and pages as last synced, with their text as Markdown

### `wordpress posts list`

posts copied from the source, newest change first; run sync to bring them up to date

```sh
wordpress posts list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** content post — kind, external_id, deleted; every field: wordpress commands info posts list

**Example:** `wordpress work posts list status:draft`, `wordpress work posts list type:page published:>=2026-01-01`

### `wordpress posts show`

one post with its text, its authors and tags by name, its earlier versions and its last numbers

```sh
wordpress posts show <post>
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source, as posts list shows it. |

**Returns:** content post detail — kind, external_id, deleted; every field: wordpress commands info posts show

**Example:** `wordpress work posts show 10`

### `wordpress posts search`

find posts in the copy by the words of their title and text

```sh
wordpress posts search <words> [options]
```

| Argument | | What it is |
|---|---|---|
| `words` | required | every word must match; prefixes of three letters or more match too. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** content hit — kind, external_id, deleted; every field: wordpress commands info posts search

**Example:** `wordpress work posts search "pricing change"`

### `wordpress posts stats`

a post's readings of its numbers, one per sync, each kept, the newest first

```sh
wordpress posts stats <post>
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source. |

**Returns:** content metric — post, at; every field: wordpress commands info posts stats

**Example:** `wordpress work posts stats 10`

### `wordpress posts create`

write a new draft; publishing is its own step, posts publish

**Changes something in the service.**

```sh
wordpress posts create [options]
```

| Option | What it does |
|---|---|
| `--title <title>` | the post's title. |
| `--text-file <path>` | the text as Markdown, from a file, or - for stdin. |
| `--description <text>` | the short text lists show, the excerpt. |
| `--slug <slug>` | the address's last part. |
| `--tags <ids>` | its tags and categories, by comma-separated ids as tags list shows them; replaces them. |
| `--type <type>` | post or page; post when left out. |

**Returns:** content write — operation_id, post; every field: wordpress commands info posts create

**Example:** `wordpress work posts create --title 'Version 3' --text-file notes.md`

### `wordpress posts update`

change a post's fields; a published or scheduled post's change is public and checks posts.publish too

**Changes something in the service.**

```sh
wordpress posts update <post> [options]
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source. |

| Option | What it does |
|---|---|
| `--title <title>` | the post's title. |
| `--text-file <path>` | the text as Markdown, from a file, or - for stdin. |
| `--description <text>` | the short text lists show, the excerpt. |
| `--slug <slug>` | the address's last part. |
| `--tags <ids>` | its tags and categories, by comma-separated ids as tags list shows them; replaces them. |
| `--replace-body` | write the body over a post whose blocks or embeds Markdown cannot keep, flattening them. |

**Returns:** content write — operation_id, post; every field: wordpress commands info posts update

**Example:** `wordpress work posts update 10 --title 'Version 2 is out now'`

### `wordpress posts publish`

publish a post now, or at a later time with --at-time; a published post is answered as it is

**Changes something in the service.**

```sh
wordpress posts publish <post> [options]
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source. |

| Option | What it does |
|---|---|
| `--at-time <time>` | when it goes out instead of now: an ISO 8601 time, a day, or 3d from now; it must be ahead. |

**Returns:** content write — operation_id, post; every field: wordpress commands info posts publish

**Example:** `wordpress work posts publish 11`, `wordpress work posts publish 11 --at-time 2026-12-01T09:00:00Z`

### `wordpress posts unpublish`

bring a published or scheduled post back to a draft

**Changes something in the service.**

```sh
wordpress posts unpublish <post>
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source. |

**Returns:** content write — operation_id, post; every field: wordpress commands info posts unpublish

**Example:** `wordpress work posts unpublish 11`

### `wordpress posts delete`

move a post to the source's trash, from which it comes back; --allow-delete deletes it for good

**Changes something in the service.**

```sh
wordpress posts delete <post> [options]
```

| Argument | | What it is |
|---|---|---|
| `post` | required | the post's id at the source. |

| Option | What it does |
|---|---|
| `--allow-delete` | delete it for good, past the trash; checks posts.delete.force. |

**Returns:** content write — operation_id, post; every field: wordpress commands info posts delete

**Example:** `wordpress work posts delete 11`

## `wordpress users`

the source's users who write, each with the person the store knows by the same e-mail

### `wordpress users list`

users copied from the source

```sh
wordpress users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** content author — kind, external_id, deleted; every field: wordpress commands info users list

**Example:** `wordpress work users list`

## `wordpress tags`

the source's tags and categories

### `wordpress tags list`

tags copied from the source

```sh
wordpress tags list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** content term — kind, external_id, deleted; every field: wordpress commands info tags list

**Example:** `wordpress work tags list`

## `wordpress doctor`

the state this installation is in, without connecting unless --online

```sh
wordpress doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `wordpress doctor`, `wordpress doctor --json`

### `wordpress doctor reports`

problem reports

#### `wordpress doctor reports show`

what a problem report holds; writes nothing

```sh
wordpress doctor reports show
```

**Example:** `wordpress doctor reports show`

#### `wordpress doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
wordpress doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `wordpress doctor reports create --output ./problem-report.json`

## `wordpress skill`

the instructions an agent is given for this tool

### `wordpress skill show`

print SKILL.md — `wordpress skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
wordpress skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-wp-pattern-category, api-widgets, api-widget-types, api-users, api-types, api-themes, api-templates, api-template-parts, api-taxonomies, api-tags, api-statuses, api-sidebars, api-settings, api-search, api-posts, api-plugins, api-pattern-directory, api-pages, api-navigation, api-menus, api-menu-locations, api-menu-items, api-media, api-global-styles, api-font-families, api-font-collections, api-comments, api-categories, api-blocks, api-block-types, api-block-patterns, api-block-directory, api. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `wordpress skill show`

### `wordpress skill install`

write SKILL.md to \~/.claude/skills/wordpress-cli/ (Claude Code) and \~/.agents/skills/wordpress-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
wordpress skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `wordpress skill install --for agents`

### `wordpress skill status`

for each place `wordpress skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
wordpress skill status
```

**Example:** `wordpress skill status`, `wordpress skill status --json`

## `wordpress mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add wordpress -- wordpress <profile> mcp serve`

### `wordpress mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add wordpress -- wordpress <profile> mcp serve`; `wordpress mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
wordpress mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like posts.publish=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `wordpress personal mcp serve`, `wordpress mcp serve --profiles work,personal`, `wordpress personal mcp serve --http --public-url https://laptop.example.ts.net`

### `wordpress mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
wordpress mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `wordpress personal mcp revoke`, `wordpress mcp revoke --profiles all`

### `wordpress mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `wordpress mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
wordpress mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `wordpress personal mcp server start --public-url https://laptop.example.ts.net`

#### `wordpress mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
wordpress mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `wordpress personal mcp server stop`

#### `wordpress mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
wordpress mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `wordpress personal mcp server status --json`

### `wordpress mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
wordpress mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like posts.publish=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `wordpress personal mcp config`, `wordpress mcp config --profiles all`

### `wordpress mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
wordpress mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like posts.publish=deny; it never loosens the profile; repeat for more keys. |

**Example:** `wordpress personal mcp add codex --allow-writes`

### `wordpress mcp check`

check this profile's local MCP handshake and tool list

```sh
wordpress mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like posts.publish=deny; it never loosens the profile; repeat for more keys. |

**Example:** `wordpress personal mcp check`

## `wordpress upgrade`

upgrade wordpress with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
wordpress upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `wordpress upgrade --check`

## `wordpress config`

the settings in force, and where each one came from

### `wordpress config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
wordpress config show
```

**Example:** `wordpress personal config show`

### `wordpress config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
wordpress config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `wordpress personal config set limit 20`

### `wordpress config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
wordpress config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `wordpress personal config unset limit`

### `wordpress config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
wordpress config migrate
```

**Example:** `wordpress config migrate`

### `wordpress config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
wordpress config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `wordpress config repair`, `wordpress config repair --dry-run`

## `wordpress runs`

recorded runs — what this tool did, and when

### `wordpress runs list`

recorded runs, newest first

```sh
wordpress runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: wordpress commands info runs list

**Example:** `wordpress personal runs list --limit 10`

### `wordpress runs show`

one run: what it was, how it ended, and every event it logged

```sh
wordpress runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `wordpress runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: wordpress commands info runs show

**Example:** `wordpress personal runs show run-101`

### `wordpress runs path`

the directory holding one run

```sh
wordpress runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `wordpress runs list`. |

**Returns:** run location — path; every field: wordpress commands info runs path

**Example:** `wordpress personal runs path run-101`

## Коды выхода

Ветвитесь по коду, а не по тексту: текст может меняться, код нет.

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
