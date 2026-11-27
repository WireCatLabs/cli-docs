---
title: "Comandos de linear"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Busca cualquier comando de linear, sus opciones y sus códigos de salida, con la seguridad de que coinciden con
tu versión: esta página se genera a partir del propio programa. Para la misma lista en JSON, ejecuta
`linear commands --json`. Las descripciones conservan el idioma de la ayuda.

**La primera palabra es el perfil**, un nombre que eliges tú: `linear personal config show`. `WCLINEAR_PROFILE`
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

## `linear commands`

every command by section; --json prints its contract, one path per call

### `linear commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
linear commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Example:** `linear commands info commands`

## `linear session`

keep this profile's Linear API token in the OS keyring

### `linear session start`

sign this profile in: the Linear API token is asked hidden or read from stdin, never taken as an argument, checked with Linear, and only then kept in the keyring, or in a private file

**Changes something on this computer only.**

```sh
linear session start [options]
```

| Option | What it does |
|---|---|
| `--credential-storage <storage>` | where the token is kept: keyring, which falls back to a private file by itself, or file. Default: `keyring`. |

**Example:** `linear personal session start`, `linear personal session start --credential-storage file`

### `linear session status`

show where this profile's token comes from: WCLINEAR_TOKEN, the keyring or a file, never the token; --check asks Linear whose token it is

```sh
linear session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Linear whether the token still works, and whose it is. |

**Example:** `linear personal session status`, `linear personal session status --check --json`

### `linear session end`

forget this profile's token on this computer; the token itself stays valid in Linear

**Changes something on this computer only.**

```sh
linear session end
```

**Example:** `linear personal session end`

### `linear session list`

list the profiles on this computer and whether each has a token; picks none

```sh
linear session list
```

**Example:** `linear session list`, `linear session list --json`

## `linear api`

the raw Linear API, one command per operation of its GraphQL schema

### `linear api list`

list every Linear API operation this CLI offers, without calling Linear

```sh
linear api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Example:** `linear personal api list`, `linear personal api list effect:destructive --json=command,path`

### `linear api show`

show one operation's parameters and request schema, without calling Linear

```sh
linear api show <operation>
```

| Argument | | What it is |
|---|---|---|
| `operation` | required | the operation as api list prints it (quoted), its old name, or its operation id. |

**Example:** `linear personal api show "administrable-teams" --json`

### `linear api administrable-teams`

All teams whose settings the user can administer. This includes teams the user can change settings for, but whose issues they may not have direct access to. This differs from the `teams` query which returns teams based on issue access. — read (query administrableTeams)

```sh
linear api administrable-teams [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned teams. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api administrable-teams`

### `linear api agent-activities`

Accessible agent activities, with filters and cursor-based pagination. — read (query agentActivities)

```sh
linear api agent-activities [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned agent activities. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api agent-activities`

### `linear api agent-activity`

Retrieves an unarchived agent activity by UUID. — read (query agentActivity)

```sh
linear api agent-activity [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the agent activity to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-activity`

### `linear api agent-activity-create`

Publishes an activity to your agent’s session and updates its lifecycle. Thoughts and actions report ongoing work; a response completes the turn unless it has the continue signal, an elicitation waits for user input, and an error records a failed turn. The session must be unarchived and owned by the authenticated app user. Use the agent app’s OAuth or workload identity token; personal API keys cannot publish agent activities. — write (mutation agentActivityCreate)

**Changes something in the service.**

```sh
linear api agent-activity-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The agent activity object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-activity-create`

### `linear api agent-session`

Retrieves an unarchived agent session by UUID or URL slug. — read (query agentSession)

```sh
linear api agent-session [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | UUID or URL slug of the agent session. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-session`

### `linear api agent-session-create-on-comment`

Starts an active session for your authenticated agent app on an existing issue comment thread. Supply the UUID of an unarchived root comment; replies and threads that already have a session are rejected. The caller must have access to the issue. Use the returned session ID when publishing activities. — write (mutation agentSessionCreateOnComment)

**Changes something in the service.**

```sh
linear api agent-session-create-on-comment [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The agent session object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-session-create-on-comment`

### `linear api agent-session-create-on-issue`

Starts an active session for your authenticated agent app and creates its comment thread on the issue. The issue must be accessible and writable. Supply its UUID or identifier, then use the returned session ID to publish progress and results with agentActivityCreate. — write (mutation agentSessionCreateOnIssue)

**Changes something in the service.**

```sh
linear api agent-session-create-on-issue [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The agent session object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-session-create-on-issue`

### `linear api agent-sessions`

Accessible agent sessions, with cursor-based pagination. — read (query agentSessions)

```sh
linear api agent-sessions [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api agent-sessions`

### `linear api agent-session-update`

Updates your agent’s session title, external links, or plan. Only the app user that owns the session can change these fields. Omitted fields remain unchanged, while each supplied plan or externalUrls list replaces that value. Updates other than a title-only change acknowledge a pending or stale session by making it active; publishing an activity still determines the next turn status. — write (mutation agentSessionUpdate)

**Changes something in the service.**

```sh
linear api agent-session-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial agent session object to update the agent session with. |
| `--id <value>` | The identifier of the agent session to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-session-update`

### `linear api agent-session-update-external-url`

Updates external links on a session owned by the authenticated agent app. A pending or stale session becomes active. — write (mutation agentSessionUpdateExternalUrl)

**Changes something in the service.**

```sh
linear api agent-session-update-external-url [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The agent session object to update. |
| `--id <value>` | The identifier of the agent session to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-session-update-external-url`

### `linear api agent-skill`

Retrieves an accessible, unarchived agent skill by UUID. — read (query agentSkill)

```sh
linear api agent-skill [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the agent skill to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-skill`

### `linear api agent-skill-create`

Creates reusable Markdown instructions for the Linear Agent, owned by the authenticated user. Omit teamId for a personal skill, or provide a team UUID to share it with that team. Creating a team skill requires permission to manage the team’s agent skills. The returned skill contains the saved instructions and display details. — write (mutation agentSkillCreate)

**Changes something in the service.**

```sh
linear api agent-skill-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The agent skill object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-skill-create`

### `linear api agent-skill-delete`

Deletes an agent skill and its inherited copies. Inherited skills must be deleted from the team that owns the source skill. — destructive (mutation agentSkillDelete)

**Changes something in the service.**

```sh
linear api agent-skill-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the agent skill to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-skill-delete`

### `linear api agent-skills`

Returns the skills the caller can access, including personal skills and shared team or workspace skills. Use filter to narrow the result and the connection arguments to paginate. Inherited team skills can appear as separate records; their inheritance fields identify the source. — read (query agentSkills)

```sh
linear api agent-skills [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned skills. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api agent-skills`

### `linear api agent-skill-update`

Updates a skill the caller can manage. Omitted fields remain unchanged, and a supplied body replaces the full instruction text. For a team skill, the caller needs agent skill management permission; moving it also requires that permission in the destination team. Inherited copies cannot be edited directly—update their source skill instead. — write (mutation agentSkillUpdate)

**Changes something in the service.**

```sh
linear api agent-skill-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Data to update the agent skill with. |
| `--id <value>` | The identifier of the agent skill to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api agent-skill-update`

### `linear api airbyte-integration-connect`

Registers an export key for Airbyte. Requires integration-creation and export permissions and a plan with data export. The key can read private-team data. — write (mutation airbyteIntegrationConnect)

**Changes something in the service.**

```sh
linear api airbyte-integration-connect [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Airbyte integration settings. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api airbyte-integration-connect`

### `linear api application-info`

Looks up an OAuth application's name, developer, and branding using its OAuth clientId. Use this to identify an application before authorization. Private applications can be read only from their owning workspace; this lookup does not grant or install the application. — read (query applicationInfo)

```sh
linear api application-info [options]
```

| Option | What it does |
|---|---|
| `--client-id <value>` | The client ID of the application. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api application-info`

### `linear api archived-integrations`

GitHub connections archived within the last 30 days, newest first. Connections dismissed from the reconnect list are omitted. — read (query archivedIntegrations)

```sh
linear api archived-integrations
```

**Example:** `linear personal api archived-integrations`

### `linear api attachment`

An attachment by UUID or URL. A URL returns one matching attachment; use attachmentsForURL to retrieve all matches. — read (query attachment)

```sh
linear api attachment [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The attachment UUID or URL. A URL returns one matching attachment. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment`

### `linear api attachment-create`

Creates an attachment, or updates the existing attachment with the same URL on the same issue. This is useful for links and metadata managed by your integration. Use attachmentLinkURL or a service-specific link mutation when you want Linear to fetch integration metadata and apply its supported link behavior. — write (mutation attachmentCreate)

**Changes something in the service.**

```sh
linear api attachment-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The attachment object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-create`

### `linear api attachment-delete`

Deletes the attachment record from its issue. This removes the link in Linear; it does not delete the external resource. — destructive (mutation attachmentDelete)

**Changes something in the service.**

```sh
linear api attachment-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the attachment to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-delete`

### `linear api attachment-issue`

The issue linked to an attachment. Deprecated; use attachmentsForURL and select each attachment’s issue. — read (query attachmentIssue)

```sh
linear api attachment-issue [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | `id` of the attachment for which you'll want to get the issue for. [Deprecated] `url` as the `id` parameter. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-issue`

### `linear api attachment-link-discord`

Link a Discord message to an issue. Requires a connected Discord integration. — write (mutation attachmentLinkDiscord)

**Changes something in the service.**

```sh
linear api attachment-link-discord [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue for which to link the Discord message. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--channel-id <value>` | The Discord channel ID for the message to link. |
| `--message-id <value>` | The Discord message ID for the message to link. |
| `--url <value>` | The Discord message URL for the message to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-discord`

### `linear api attachment-link-front`

Link a Front conversation to an issue. Requires a connected Front integration. — write (mutation attachmentLinkFront)

**Changes something in the service.**

```sh
linear api attachment-link-front [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--conversation-id <value>` | The Front conversation ID to link. |
| `--issue-id <value>` | The issue for which to link the Front conversation. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-front`

### `linear api attachment-link-git-hub-issue`

Link a GitHub issue to a Linear issue. Uses the matching GitHub integration and sync mapping when available; may fall back to a URL attachment. — write (mutation attachmentLinkGitHubIssue)

**Changes something in the service.**

```sh
linear api attachment-link-git-hub-issue [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The Linear issue for which to link the GitHub issue. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | The URL of the GitHub issue to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-git-hub-issue`

### `linear api attachment-link-git-hub-pr`

Link a GitHub pull request to an issue. Uses the matching GitHub integration when available; may fall back to a URL attachment. — write (mutation attachmentLinkGitHubPR)

**Changes something in the service.**

```sh
linear api attachment-link-git-hub-pr [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue for which to link the GitHub pull request. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | The URL of the GitHub pull request to link. |
| `--link-kind <value>` | The kind of link between the issue and the pull request. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-git-hub-pr`

### `linear api attachment-link-git-lab-mr`

Links a GitLab merge request to an issue. Supply the merge-request URL, number, and full project path including any groups. Linear uses a matching integration when available and otherwise creates a basic URL attachment. — write (mutation attachmentLinkGitLabMR)

**Changes something in the service.**

```sh
linear api attachment-link-git-lab-mr [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue for which to link the GitLab merge request. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | The URL of the GitLab merge request to link. |
| `--project-path-with-namespace <value>` | The path name to the project including any (sub)groups. E.g. linear/main/client. |
| `--number <value>` | The GitLab merge request number to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-git-lab-mr`

### `linear api attachment-link-intercom`

Link an Intercom conversation to an issue. Requires a connected Intercom integration. — write (mutation attachmentLinkIntercom)

**Changes something in the service.**

```sh
linear api attachment-link-intercom [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--conversation-id <value>` | The Intercom conversation ID to link. |
| `--part-id <value>` | An optional Intercom conversation part ID to link to. |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--issue-id <value>` | The issue for which to link the Intercom conversation. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-intercom`

### `linear api attachment-link-jira-issue`

Links a Jira issue to a Linear issue. The URL selects a connected Jira site; if it identifies no connected site, Linear uses the workspace’s sole Jira integration. With multiple Jira integrations, provide a URL for the intended site. — write (mutation attachmentLinkJiraIssue)

**Changes something in the service.**

```sh
linear api attachment-link-jira-issue [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue for which to link the Jira issue. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--jira-issue-id <value>` | The Jira issue key or ID to link. |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | URL used to select the connected Jira site and as a fallback if the Jira issue cannot be fetched. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-jira-issue`

### `linear api attachment-link-salesforce`

Link a Salesforce case to an issue. Requires a connected Salesforce integration and a valid case URL. — write (mutation attachmentLinkSalesforce)

**Changes something in the service.**

```sh
linear api attachment-link-salesforce [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue for which to link the Salesforce case. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | The URL of the Salesforce case to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-salesforce`

### `linear api attachment-link-slack`

Link an existing Slack message to an issue. This creates a rich attachment using the workspace's Slack integration. — write (mutation attachmentLinkSlack)

**Changes something in the service.**

```sh
linear api attachment-link-slack [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--issue-id <value>` | The issue to which to link the Slack message. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--url <value>` | The Slack message URL for the message to link. |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--sync-to-comment-thread <value>` | Sync the Slack thread with issue comments and import existing replies. Defaults to false; the thread cannot already be synced elsewhere. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-slack`

### `linear api attachment-link-url`

Links a URL to an issue and, when recognized, uses the workspace’s matching integration to fetch richer details. Supported integrations can add behaviors such as status updates. If no matching integration can enrich the link, Linear creates a basic URL attachment. — write (mutation attachmentLinkURL)

**Changes something in the service.**

```sh
linear api attachment-link-url [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--url <value>` | The url to link. |
| `--issue-id <value>` | The issue for which to link the url. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | The id for the attachment. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-url`

### `linear api attachment-link-zendesk`

Link a Zendesk ticket to an issue. Requires a connected Zendesk integration. — write (mutation attachmentLinkZendesk)

**Changes something in the service.**

```sh
linear api attachment-link-zendesk [options]
```

| Option | What it does |
|---|---|
| `--create-as-user <value>` | Display name credited with creating the attachment. Available only to OAuth applications using actor=app. |
| `--display-icon-url <value>` | Avatar URL for createAsUser. Requires createAsUser and an OAuth application using actor=app. |
| `--title <value>` | The title to use for the attachment. |
| `--ticket-id <value>` | The Zendesk ticket ID to link. |
| `--issue-id <value>` | The issue for which to link the Zendesk ticket. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--id <value>` | Optional attachment ID that may be provided through the API. |
| `--url <value>` | The URL of the Zendesk ticket to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-link-zendesk`

### `linear api attachments`

Issue attachments the caller can access, with cursor pagination. Use attachmentsForURL to look up a resource URL. — read (query attachments)

```sh
linear api attachments [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned attachments. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api attachments`

### `linear api attachments-for-url`

Finds the attachments for a resource URL across issues you can access. A URL can appear on several issues, so use this connection and select each attachment’s issue to find all linked issues. — read (query attachmentsForURL)

```sh
linear api attachments-for-url [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--url <value>` | The attachment URL. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api attachments-for-url`

### `linear api attachment-sources`

Lists distinct sources on accessible, non-archived issue attachments. API and OAuth attachment sources are grouped by URL domain; other sources are grouped by type. Each group includes the oldest attachment's source metadata. Results may be cached for up to one hour. — read (query attachmentSources)

```sh
linear api attachment-sources [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | (optional) if provided will only return attachment sources for the given team. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-sources`

### `linear api attachment-sync-to-slack`

Sync an existing Slack attachment with an issue comment thread and import existing replies. Requires a connected Slack integration whose bot can post in the channel; the Slack thread cannot already be synced elsewhere. — write (mutation attachmentSyncToSlack)

**Changes something in the service.**

```sh
linear api attachment-sync-to-slack [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The ID of the Slack attachment to begin syncing. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-sync-to-slack`

### `linear api attachment-update`

Updates an existing attachment’s title, subtitle, metadata, or icon. title is required even when changing another field, and metadata replaces the full stored object. This mutation does not move the attachment or change its URL. — write (mutation attachmentUpdate)

**Changes something in the service.**

```sh
linear api attachment-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial attachment object to update the attachment with. |
| `--id <value>` | The identifier of the attachment to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api attachment-update`

### `linear api audit-entries`

Lists recorded events from the workspace audit log, such as sign-ins, permission changes, and exports. Filter by action type, actor, request details, or time to find events of interest. Requires audit-log access; event metadata depends on the action and may outlive the user or resource it describes. — read (query auditEntries)

```sh
linear api audit-entries [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned audit entries. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api audit-entries`

### `linear api audit-entry-types`

Lists supported audit action identifiers and a description of each action. Use the returned type values to interpret AuditEntry.type or filter auditEntries. Requires permission to view the workspace audit log. — read (query auditEntryTypes)

```sh
linear api audit-entry-types
```

**Example:** `linear personal api audit-entry-types`

### `linear api authentication-sessions`

Lists active browser, desktop, and mobile sign-in sessions for the authenticated account. isCurrentSession identifies the session making this request. Use a returned session ID with logoutSession to revoke a specific session. Requires session JWT authentication; API keys and OAuth access tokens do not provide this session list. — read (query authenticationSessions)

```sh
linear api authentication-sessions
```

**Example:** `linear personal api authentication-sessions`

### `linear api available-users`

Lists the signed-in account's workspace access. users contains memberships available with the current sign-in method; availableOrganizations contains workspaces the account may join. lockedUsers and lockedOrganizations identify workspaces that require another sign-in method, such as SAML. Each workspace membership has a different user ID even when it belongs to the same account. — read (query availableUsers)

```sh
linear api available-users
```

**Example:** `linear personal api available-users`

### `linear api comment`

A comment by UUID or URL hash. Returns an error if no accessible comment matches. — read (query comment)

```sh
linear api comment [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | Comment UUID. Supply either id or hash. |
| `--hash <value>` | Comment hash from a Linear comment URL. Supply either hash or id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment`

### `linear api comment-create`

Creates a comment on one resource, or a reply when parentId is supplied. You must be allowed to comment on that resource. For issue comments, the author is subscribed to the issue unless doNotSubscribeToIssue is true. — write (mutation commentCreate)

**Changes something in the service.**

```sh
linear api comment-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The comment object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment-create`

### `linear api comment-delete`

Deletes a comment and, for a root comment, its replies. You must be allowed to delete the comment and comment on its resource. Deleting a reply selected as the resolution reopens the parent thread. — destructive (mutation commentDelete)

**Changes something in the service.**

```sh
linear api comment-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the comment to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment-delete`

### `linear api comment-resolve`

Marks a root comment’s thread as resolved by you. You may select one of its replies as resolvingCommentId, or resolve the thread without a specific reply. Pass the root comment ID, even when the discussion ended in a reply. — write (mutation commentResolve)

**Changes something in the service.**

```sh
linear api comment-resolve [options]
```

| Option | What it does |
|---|---|
| `--resolving-comment-id <value>` | The identifier of the child comment that resolves the thread. If not provided, the thread is resolved without a specific resolving comment. |
| `--id <value>` | The identifier of the comment to resolve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment-resolve`

### `linear api comments`

All comments the user has access to in the workspace. — read (query comments)

```sh
linear api comments [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned comments. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api comments`

### `linear api comment-unresolve`

Reopens a resolved thread and clears its resolution time, resolving user, and selected resolving reply. Pass the root comment ID. An already unresolved thread is returned unchanged. — write (mutation commentUnresolve)

**Changes something in the service.**

```sh
linear api comment-unresolve [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the comment to unresolve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment-unresolve`

### `linear api comment-update`

Replaces a comment’s Markdown body and records an edit time. Content edits are restricted to an authorized author or acting user; comments originating in synced Slack messages or Intercom cannot be edited here. Omit body to keep the existing message. — write (mutation commentUpdate)

**Changes something in the service.**

```sh
linear api comment-update [options]
```

| Option | What it does |
|---|---|
| `--skip-edited-at <value>` | [INTERNAL] Flag to prevent setting editedAt when updating bodyData (used for background uploads). |
| `--input <value>` | A partial comment object to update the comment with. |
| `--id <value>` | The identifier of the comment to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api comment-update`

### `linear api contact-create`

Submits a message to Linear support on behalf of the authenticated user. Delivery happens after the request succeeds. — write (mutation contactCreate)

**Changes something in the service.**

```sh
linear api contact-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The contact entry to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api contact-create`

### `linear api create-csv-export-report`

Queues a workspace CSV export and emails the requesting user a download link when it is ready. Success confirms scheduling, not completion. Private and restricted teams are excluded unless explicitly selected by their UUIDs. Requires workspace export permission, which permits selecting eligible teams even when the requester is not a member. — write (mutation createCsvExportReport)

**Changes something in the service.**

```sh
linear api create-csv-export-report [options]
```

| Option | What it does |
|---|---|
| `--include-private-team-ids <value>` | UUIDs of private teams to include in the export. Omit or use an empty list to exclude private teams. Restricted teams are selected separately. |
| `--include-restricted-team-ids <value>` | UUIDs of restricted teams to include in the export. An empty list excludes restricted teams. Omission falls back to the deprecated includeProtectedTeamIds list, or excludes them if neither list is provided. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api create-csv-export-report`

### `linear api create-initiative-update-reminder`

Create a notification to remind a user about an initiative update. — write (mutation createInitiativeUpdateReminder)

**Changes something in the service.**

```sh
linear api create-initiative-update-reminder [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | The user identifier to whom the notification will be sent. By default, it is set to the initiative owner. |
| `--initiative-id <value>` | The identifier of the initiative to remind about. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api create-initiative-update-reminder`

### `linear api create-project-update-reminder`

Create a notification to remind a user about a project update. — write (mutation createProjectUpdateReminder)

**Changes something in the service.**

```sh
linear api create-project-update-reminder [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | The user identifier to whom the notification will be sent. By default, it is set to the project lead. |
| `--project-id <value>` | The identifier of the project to remind about. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api create-project-update-reminder`

### `linear api customer`

Retrieves a single customer by ID or slug. — read (query customer)

```sh
linear api customer [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier or slug of the customer to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer`

### `linear api customer-create`

Creates a customer when the Customers feature is available and enabled in the workspace. Business domains and external IDs must not belong to another customer, including archived customers. If no status is supplied, the first customer status by position is used. — write (mutation customerCreate)

**Changes something in the service.**

```sh
linear api customer-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The customer to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-create`

### `linear api customer-delete`

Permanently deletes a customer, including an archived customer. Use customerMerge when you want to preserve its requests by transferring them to another customer. — destructive (mutation customerDelete)

**Changes something in the service.**

```sh
linear api customer-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-delete`

### `linear api customer-merge`

Merges two customers by transferring all needs from the source customer to the target customer. The source customer is archived after the merge. Domains, external IDs, and metadata are combined on the target customer. — write (mutation customerMerge)

**Changes something in the service.**

```sh
linear api customer-merge [options]
```

| Option | What it does |
|---|---|
| `--source-customer-id <value>` | The ID of the source customer to merge. All needs from this customer will be transferred to the target, and this customer will be archived. |
| `--target-customer-id <value>` | The ID of the target customer to merge into. This customer will receive all needs from the source customer and retain its own. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-merge`

### `linear api customer-need`

Retrieves a single customer need by ID or hash. — read (query customerNeed)

```sh
linear api customer-need [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the customer need to retrieve. Cannot be used together with hash. |
| `--hash <value>` | The hash prefix of the customer need to retrieve (minimum 8 characters). Cannot be used together with id. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need`

### `linear api customer-need-archive`

Archives a customer need so it can be removed from active request lists without permanently deleting it. Use customerNeedUnarchive to restore the saved need. — destructive (mutation customerNeedArchive)

**Changes something in the service.**

```sh
linear api customer-need-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer need to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-archive`

### `linear api customer-need-create`

Records customer feedback, optionally linked to an issue. Unlinked requests require Customer Signals to be enabled. You can identify the customer, add Markdown feedback, or link a source attachment. Multiple requests can be recorded for the same customer and issue. — write (mutation customerNeedCreate)

**Changes something in the service.**

```sh
linear api customer-need-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The customer need to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-create`

### `linear api customer-need-create-from-attachment`

Creates a customer need from an existing issue attachment. If that attachment already has an archived need, the need is restored and follows the attachment’s current issue. An existing active need is not duplicated. — write (mutation customerNeedCreateFromAttachment)

**Changes something in the service.**

```sh
linear api customer-need-create-from-attachment [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The customer need to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-create-from-attachment`

### `linear api customer-need-delete`

Permanently deletes a customer need. By default, its associated issue or project attachment is also deleted. Set keepAttachment to true to retain that source attachment; the linked issue or project is kept. — destructive (mutation customerNeedDelete)

**Changes something in the service.**

```sh
linear api customer-need-delete [options]
```

| Option | What it does |
|---|---|
| `--keep-attachment <value>` | Whether to keep the attachment associated with the customer need. |
| `--id <value>` | The identifier of the customer need to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-delete`

### `linear api customer-needs`

All customer needs in the workspace, with optional filtering. — read (query customerNeeds)

```sh
linear api customer-needs [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned customer needs. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api customer-needs`

### `linear api customer-need-unarchive`

Restores an archived customer need. The need must currently be archived; its saved feedback and associations are kept. — write (mutation customerNeedUnarchive)

**Changes something in the service.**

```sh
linear api customer-need-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer need to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-unarchive`

### `linear api customer-need-update`

Updates a customer request, including its feedback, customer, priority, or issue association. Only manually added source attachments can be replaced or removed. Use clearAttachment to remove such a source; moving the request to another issue also moves its source attachment. — write (mutation customerNeedUpdate)

**Changes something in the service.**

```sh
linear api customer-need-update [options]
```

| Option | What it does |
|---|---|
| `--clear-attachment <value>` | Whether to remove the manually added source attachment. Sources managed by an integration cannot be removed this way. A different, nonempty attachmentUrl takes precedence. |
| `--input <value>` | The properties of the customer need to update. |
| `--id <value>` | The identifier of the customer need to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-need-update`

### `linear api customers`

All customers in the workspace, with optional filtering and sorting. — read (query customers)

```sh
linear api customers [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned customers. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sorts <value>` | Sort criteria for the returned customers. Up to 3 sort fields can be specified. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api customers`

### `linear api customer-status`

One specific customer status. — read (query customerStatus)

```sh
linear api customer-status [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer status to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-status`

### `linear api customer-status-create`

Creates a workspace customer status. Requires permission to manage customer settings and rejects a name or display name already used by another active status. — write (mutation customerStatusCreate)

**Changes something in the service.**

```sh
linear api customer-status-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The CustomerStatus object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-status-create`

### `linear api customer-status-delete`

Deletes a customer status. Cannot delete the last remaining status in a workspace, and the status must not be in use by any customers. — destructive (mutation customerStatusDelete)

**Changes something in the service.**

```sh
linear api customer-status-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer status to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-status-delete`

### `linear api customer-statuses`

All customer statuses defined in the workspace. — read (query customerStatuses)

```sh
linear api customer-statuses [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api customer-statuses`

### `linear api customer-status-update`

Updates a workspace customer status. Requires permission to manage customer settings. Customers using the status retain their association with it. — write (mutation customerStatusUpdate)

**Changes something in the service.**

```sh
linear api customer-status-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial CustomerStatus object to update the CustomerStatus with. |
| `--id <value>` | The identifier of the customer status to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-status-update`

### `linear api customer-tier`

One specific customer tier. — read (query customerTier)

```sh
linear api customer-tier [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer tier to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-tier`

### `linear api customer-tier-create`

Creates a workspace customer tier. Requires permission to manage customer settings and rejects a name or display name already used by another active tier. — write (mutation customerTierCreate)

**Changes something in the service.**

```sh
linear api customer-tier-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The CustomerTier object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-tier-create`

### `linear api customer-tier-delete`

Deletes a customer tier. The tier must not be in use by any customers. — destructive (mutation customerTierDelete)

**Changes something in the service.**

```sh
linear api customer-tier-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer tier to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-tier-delete`

### `linear api customer-tiers`

All customer tiers defined in the workspace. — read (query customerTiers)

```sh
linear api customer-tiers [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api customer-tiers`

### `linear api customer-tier-update`

Updates a workspace customer tier. Requires permission to manage customer settings. Customers using the tier retain their association with it. — write (mutation customerTierUpdate)

**Changes something in the service.**

```sh
linear api customer-tier-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial CustomerTier object to update the CustomerTier with. |
| `--id <value>` | The identifier of the customer tier to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-tier-update`

### `linear api customer-unsync`

Disconnects a customer from its configured data source integration so the integration no longer updates it. External IDs belonging to that source are cleared. Requires permission to manage workspace customer settings. — write (mutation customerUnsync)

**Changes something in the service.**

```sh
linear api customer-unsync [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the customer to unsync. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-unsync`

### `linear api customer-update`

Updates the supplied customer fields, leaving omitted fields unchanged. For a customer managed by an integration, only fields that are editable in Linear are applied; managed fields are ignored. The request fails if none of the supplied fields are editable. — write (mutation customerUpdate)

**Changes something in the service.**

```sh
linear api customer-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the customer to update. |
| `--id <value>` | The identifier of the customer to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-update`

### `linear api customer-upsert`

Finds a customer using the supplied UUID, external ID, Slack channel, or domains, and updates it; otherwise creates one. A name is required when no customer matches. Unlike customerUpdate, this operation can override integration-managed fields, and a tierName can create a new customer tier. — write (mutation customerUpsert)

**Changes something in the service.**

```sh
linear api customer-upsert [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The customer to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api customer-upsert`

### `linear api custom-view`

One specific custom view, looked up by ID or slug. — read (query customView)

```sh
linear api custom-view [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the custom view to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api custom-view`

### `linear api custom-view-create`

Creates a saved view owned by you. Choose an issue, project, initiative, or update filter and set shared if others in its scope should use it. Display settings can be saved separately with viewPreferencesCreate. — write (mutation customViewCreate)

**Changes something in the service.**

```sh
linear api custom-view-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the custom view to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api custom-view-create`

### `linear api custom-view-delete`

Deletes a saved view without deleting the items it displayed. Only workspace members can delete views shared with the whole workspace; deleting a view used in a pinned tab also requires permission to edit that tab. Use customViewHasSubscribers to check whether other people receive notifications from the view. — destructive (mutation customViewDelete)

**Changes something in the service.**

```sh
linear api custom-view-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the custom view to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api custom-view-delete`

### `linear api custom-view-has-subscribers`

Whether a custom view has active notification subscribers other than the current user. Useful for warning before deleting a shared view. — read (query customViewHasSubscribers)

```sh
linear api custom-view-has-subscribers [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the custom view. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api custom-view-has-subscribers`

### `linear api custom-views`

All custom views accessible to the user, including personal views and shared workspace views. Excludes views scoped to a specific project or initiative. — read (query customViews)

```sh
linear api custom-views [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned custom views. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned custom views. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api custom-views`

### `linear api custom-view-update`

Updates a saved view’s metadata, scope, or filter configuration. Omitted fields are unchanged. Only workspace members can change views shared with the whole workspace; editing a view used in a pinned tab also requires permission to edit that tab. — write (mutation customViewUpdate)

**Changes something in the service.**

```sh
linear api custom-view-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the custom view to update. |
| `--id <value>` | The identifier of the custom view to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api custom-view-update`

### `linear api cycle`

Finds a cycle by its UUID or team-and-number identifier, such as ENG°12, including archived cycles. Use cycles with a team filter to discover a team’s cycles. — read (query cycle)

```sh
linear api cycle [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The cycle’s UUID or team-and-number identifier, such as ENG°12. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle`

### `linear api cycle-archive`

Archives a cycle and removes its current issues from it. The issues themselves are not archived. An inherited cycle must be managed through its parent team. Requires permission to manage the team. — destructive (mutation cycleArchive)

**Changes something in the service.**

```sh
linear api cycle-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the cycle to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle-archive`

### `linear api cycle-create`

Unsupported. This mutation always returns an error; cycles are generated from the team’s cycle settings. — write (mutation cycleCreate)

**Changes something in the service.**

```sh
linear api cycle-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The cycle object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle-create`

### `linear api cycles`

All cycles accessible to the user. — read (query cycles)

```sh
linear api cycles [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned cycles. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api cycles`

### `linear api cycle-shift-all`

Shifts an upcoming cycle and every later cycle in the team by the same number of days. Local times are preserved in the team’s time zone, and the team’s cycle start day is updated. Use this when moving the schedule as a whole; it requires permission to manage the team. — write (mutation cycleShiftAll)

**Changes something in the service.**

```sh
linear api cycle-shift-all [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The shift parameters specifying which cycle to start from and how many days to shift. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle-shift-all`

### `linear api cycle-start-upcoming-cycle-today`

Starts the upcoming cycle as of midnight today. Completes the previous cycle if it has not yet ended. Only the next upcoming (not yet started) cycle for the team can be started. Requires permission to manage the team. — write (mutation cycleStartUpcomingCycleToday)

**Changes something in the service.**

```sh
linear api cycle-start-upcoming-cycle-today [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the cycle to start as of midnight today. Must be the upcoming cycle. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle-start-upcoming-cycle-today`

### `linear api cycle-update`

Updates a cycle’s name, description, or schedule and returns the resulting cycle. Date changes can shorten adjacent cycles to prevent overlap. You cannot change an active cycle’s start or a completed cycle’s dates, or edit inherited cycles directly. Requires permission to manage the team. — write (mutation cycleUpdate)

**Changes something in the service.**

```sh
linear api cycle-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial cycle object to update the cycle with. |
| `--id <value>` | The identifier of the cycle to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api cycle-update`

### `linear api dependency-package-metadata`

Looks up license, publication time, and package-wide weekly downloads for up to 500 exact package versions. Currently supports the public npm registry. Results preserve request order, but missing versions, invalid package names, and failed registry lookups are omitted, so match by name and version rather than array index. Version facts and download counts are cached and may not reflect the latest registry changes. — read (query dependencyPackageMetadata)

```sh
linear api dependency-package-metadata [options]
```

| Option | What it does |
|---|---|
| `--packages <value>` | Packages to look up, in response order. Maximum 500. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api dependency-package-metadata`

### `linear api document`

Finds a document by UUID or the short identifier used in its URL. Archived documents can also be returned if you still have access. — read (query document)

```sh
linear api document [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier or slug of the document to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document`

### `linear api document-content-history`

Lists saved-version metadata for a DocumentContent UUID, newest first. Use the content record’s ID, such as Document.documentContentId, rather than the enclosing document’s UUID. The public result includes capture times and contributors, not historical body content. — read (query documentContentHistory)

```sh
linear api document-content-history [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the document content to retrieve history for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-content-history`

### `linear api document-create`

Creates a document in a project, issue, or release, with optional initial Markdown content. The returned document includes its assigned UUID and metadata; select content to read the resulting body. — write (mutation documentCreate)

**Changes something in the service.**

```sh
linear api document-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The document to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-create`

### `linear api document-delete`

Moves a document to the trash and archives it, including the sub-documents covered by its archive cascade. It is not permanently removed by this mutation. You must be allowed to manage the document; use documentUnarchive to restore it. — destructive (mutation documentDelete)

**Changes something in the service.**

```sh
linear api document-delete [options]
```

| Option | What it does |
|---|---|
| `--if-parent-document-id <value>` | [Internal] Only trash the document if it is still a sub-document of this document. Otherwise the mutation fails and the document is left unchanged. |
| `--id <value>` | The identifier of the document to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-delete`

### `linear api documents`

Lists documents you can access, with filters and cursor pagination. Archived documents are excluded unless includeArchived is true; access still follows each document’s location and sharing settings. — read (query documents)

```sh
linear api documents [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned documents. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned documents. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api documents`

### `linear api document-unarchive`

Restores a trashed document and its eligible sub-documents. You must be allowed to manage the restored documents. If the containing resource is archived, restore that resource first. — write (mutation documentUnarchive)

**Changes something in the service.**

```sh
linear api document-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the document to restore. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-unarchive`

### `linear api document-update`

Updates a document’s metadata or replaces its Markdown body. You must have edit access to the document. Supplying a different container moves the document there, which can affect access; omitted fields are left unchanged. — write (mutation documentUpdate)

**Changes something in the service.**

```sh
linear api document-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial document object to update the document with. |
| `--id <value>` | The identifier of the document to update. Also the identifier from the URL is accepted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-update`

### `linear api document-update-workspace-access`

[Internal] Changes what people outside a document's teams can do with a document in a public team or in a project with a public team: edit, comment, or view. It can't be above the document's general access. Only the owner of the document, an owner of one of its teams, or a workspace admin can change it. Comment and view need an owner who can access the document. — write (mutation documentUpdateWorkspaceAccess)

**Changes something in the service.**

```sh
linear api document-update-workspace-access [options]
```

| Option | What it does |
|---|---|
| `--previous-workspace-access <value>` | The workspace access level of this document when the change was confirmed. When given, the change fails if the document has another level now. |
| `--apply-to-sub-documents <value>` | Whether to also change the sub-documents whose levels equal the document's levels before the change. Sub-documents with other levels, without an owner who can access them, or that the user cannot loosen keep their level. |
| `--workspace-access <value>` | The new workspace access level: edit, comment, or view. |
| `--id <value>` | The identifier of the document. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api document-update-workspace-access`

### `linear api email-intake-address`

An accessible intake address by ID, including archived addresses. — read (query emailIntakeAddress)

```sh
linear api email-intake-address [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the intake address. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address`

### `linear api email-intake-address-create`

Creates an address that accepts email for one team or issue template. For team and template types, an existing active address for that destination is returned instead of creating another. Use the returned emailAddress as the forwarding destination in your mail provider. Asks creation requires the appropriate plan and integration management permission; team and template addresses require permission to manage their destination. Form templates cannot be used for template intake. — write (mutation emailIntakeAddressCreate)

**Changes something in the service.**

```sh
linear api email-intake-address-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The email intake address object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address-create`

### `linear api email-intake-address-delete`

Deletes an email intake address object. — destructive (mutation emailIntakeAddressDelete)

**Changes something in the service.**

```sh
linear api email-intake-address-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the email intake address to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address-delete`

### `linear api email-intake-addresses`

Email intake addresses accessible to the user in the workspace. — read (query emailIntakeAddresses)

```sh
linear api email-intake-addresses [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api email-intake-addresses`

### `linear api email-intake-address-refresh-ses-domain-status`

Requests a check of the intake address’s custom sending domain after you update its DNS records. The check runs asynchronously: success means a check was requested, not that the domain passed verification. Query sesDomainIdentity.canSendFromCustomDomain and dnsRecords for the result. Returns success=false when no custom domain is configured or the domain is already fully verified. — write (mutation emailIntakeAddressRefreshSesDomainStatus)

**Changes something in the service.**

```sh
linear api email-intake-address-refresh-ses-domain-status [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the email intake address to refresh the domain status for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address-refresh-ses-domain-status`

### `linear api email-intake-address-rotate`

Generates a new email address for an existing team or template intake configuration. The old address no longer routes incoming mail, so update any forwarding rules or places where you published it. The intake record and its settings are retained. Asks and Asks web addresses do not support rotation through this mutation. — write (mutation emailIntakeAddressRotate)

**Changes something in the service.**

```sh
linear api email-intake-address-rotate [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the email intake address. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address-rotate`

### `linear api email-intake-address-update`

Updates an existing email intake address. — write (mutation emailIntakeAddressUpdate)

**Changes something in the service.**

```sh
linear api email-intake-address-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the email intake address to update. |
| `--id <value>` | The identifier of the email intake address. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-intake-address-update`

### `linear api email-token-user-account-auth`

Completes email sign-in using the emailed token and the same clientAuthCode sent with emailUserAccountAuthChallenge. Successful authentication consumes the client binding and sets a session cookie. Use the returned memberships and available or locked workspaces to continue into a workspace; the deprecated token field is not populated. An expired token or a code from a different client cannot complete this flow. — write (mutation emailTokenUserAccountAuth)

**Changes something in the service.**

```sh
linear api email-token-user-account-auth [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The data used for token authentication. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-token-user-account-auth`

### `linear api email-unsubscribe`

Unsubscribes a user from the selected email category using the user ID and token from a Linear email. No sign-in is required because the token authorizes the change. An invalid token returns success=false; other email categories and notification channels are unchanged. — write (mutation emailUnsubscribe)

**Changes something in the service.**

```sh
linear api email-unsubscribe [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Unsubscription details. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-unsubscribe`

### `linear api email-user-account-auth-challenge`

Starts email sign-in and sends a one-time token to the supplied address. Generate and retain a clientAuthCode UUID, then pass it with the emailed token to emailTokenUserAccountAuth within ten minutes. Requesting another challenge replaces the stored client binding for that email. When login challenge verification is enabled, challengeResponse is also required. Success confirms the challenge was accepted; email delivery may finish in the background. — write (mutation emailUserAccountAuthChallenge)

**Changes something in the service.**

```sh
linear api email-user-account-auth-challenge [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The data used for email authentication. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api email-user-account-auth-challenge`

### `linear api emoji`

Finds a custom emoji by UUID or exact name. UUID lookup can return archived records, while name lookup returns an active emoji. Use emojis to list the workspace’s custom emoji. — read (query emoji)

```sh
linear api emoji [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier or the name of the emoji to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api emoji`

### `linear api emoji-create`

Creates a custom emoji from an image already uploaded to Linear. Its name must be unique in the workspace. The current user is recorded as the creator, and the source is user. — write (mutation emojiCreate)

**Changes something in the service.**

```sh
linear api emoji-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The emoji object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api emoji-create`

### `linear api emoji-delete`

Deletes an emoji. — destructive (mutation emojiDelete)

**Changes something in the service.**

```sh
linear api emoji-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the emoji to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api emoji-delete`

### `linear api emojis`

All custom emojis in the workspace. — read (query emojis)

```sh
linear api emojis [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned emojis. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned emojis. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api emojis`

### `linear api entity-external-link`

Retrieves a single entity external link by its identifier. — read (query entityExternalLink)

```sh
linear api entity-external-link [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the entity external link to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api entity-external-link`

### `linear api entity-external-link-create`

Adds an external resource to an initiative, project, or release the caller can access and write to. Provide exactly one parent, a destination URL, and the label to show in Linear. Omit sortOrder to place the link last among the parent’s resources. This stores a reference to the URL; it does not upload or copy the destination content. — write (mutation entityExternalLinkCreate)

**Changes something in the service.**

```sh
linear api entity-external-link-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The entity link object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api entity-external-link-create`

### `linear api entity-external-link-delete`

Removes a resource link from Linear and clears any team pins that refer to it. The external URL’s content is unchanged. The caller must have access to the link’s parent scope; archived links can also be deleted. — destructive (mutation entityExternalLinkDelete)

**Changes something in the service.**

```sh
linear api entity-external-link-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the entity link to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api entity-external-link-delete`

### `linear api entity-external-link-update`

Changes an unarchived resource link’s URL, display label, or position within its parent’s resources. Omitted fields remain unchanged, and the parent cannot be changed. The link must be writable and within the caller’s permitted scope. — write (mutation entityExternalLinkUpdate)

**Changes something in the service.**

```sh
linear api entity-external-link-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The entity link object to update. |
| `--id <value>` | The identifier of the entity link to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api entity-external-link-update`

### `linear api external-user`

Retrieves an external user by its Linear UUID, including archived records. Use the ExternalUser ID recorded on Linear content, not the person's ID in Slack, GitHub, or another external service. — read (query externalUser)

```sh
linear api external-user [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the external user to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api external-user`

### `linear api external-users`

External users and bots recorded by integrations in the workspace, with cursor-based pagination. — read (query externalUsers)

```sh
linear api external-users [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api external-users`

### `linear api favorite`

A specific favorite by ID. — read (query favorite)

```sh
linear api favorite [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the favorite. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api favorite`

### `linear api favorite-create`

Creates a sidebar favorite for the authenticated user. If it already exists, updates its position and supplied folder instead. — write (mutation favoriteCreate)

**Changes something in the service.**

```sh
linear api favorite-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The favorite object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api favorite-create`

### `linear api favorite-delete`

Removes a favorite from your sidebar. Deleting a custom folder also removes the favorites inside it; the bookmarked entities are unaffected. The mutation succeeds if the favorite no longer exists. — destructive (mutation favoriteDelete)

**Changes something in the service.**

```sh
linear api favorite-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the favorite reference to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api favorite-delete`

### `linear api favorites`

The authenticated user's favorites. Returns all bookmarked items that appear in the user's sidebar. — read (query favorites)

```sh
linear api favorites [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api favorites`

### `linear api favorite-update`

Changes the position, parent folder, or name of one of your favorites. Omitted fields stay unchanged. The target entity cannot be changed, and predefined live folders cannot be renamed. — write (mutation favoriteUpdate)

**Changes something in the service.**

```sh
linear api favorite-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial favorite object to update the favorite with. |
| `--id <value>` | The identifier of the favorite to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api favorite-update`

### `linear api file-upload`

Prepares a file upload and returns a signed destination. Upload the raw bytes with HTTP PUT to uploadFile.uploadUrl, using its headers and the supplied Content-Type; start the request within one minute and send exactly size bytes. Once the PUT succeeds, reference uploadFile.assetUrl in an issue description, comment, or attachment. This mutation does not create that reference for you. Workspace file-type restrictions and plan upload limits apply. — write (mutation fileUpload)

**Changes something in the service.**

```sh
linear api file-upload [options]
```

| Option | What it does |
|---|---|
| `--meta-data <value>` | Optional metadata encoded as a JSON string, such as {"issueId":"..."} or {"commentId":"..."}. These references record upload context; they do not insert the file into that issue or comment. You still need to use assetUrl when creating or updating the content. |
| `--make-public <value>` | Whether anyone with the asset URL can view the uploaded image without authenticating. Omit or set false for a private upload. Only non-SVG images can be public; other file types are rejected when this is true. |
| `--size <value>` | Exact file size in bytes. The upload request must match this size. |
| `--content-type <value>` | MIME type of the uploaded file. |
| `--filename <value>` | Filename of the uploaded file. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api file-upload`

### `linear api file-upload-dangerously-delete`

Permanently delete an uploaded file by asset URL. This should be used as a last resort and will break comments and documents that reference the asset. — destructive (mutation fileUploadDangerouslyDelete)

**Changes something in the service.**

```sh
linear api file-upload-dangerously-delete [options]
```

| Option | What it does |
|---|---|
| `--asset-url <value>` | The asset URL of the uploaded file to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api file-upload-dangerously-delete`

### `linear api git-automation-state-create`

Creates a rule that maps a Git event to an issue status for a team. Requires permission to manage that team. Rules cannot be created for retired teams. — write (mutation gitAutomationStateCreate)

**Changes something in the service.**

```sh
linear api git-automation-state-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The automation state to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-state-create`

### `linear api git-automation-state-delete`

Permanently deletes a Git automation rule. Requires permission to manage its team. Removing a branch-specific rule allows the team’s default for that event to apply again. — destructive (mutation gitAutomationStateDelete)

**Changes something in the service.**

```sh
linear api git-automation-state-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the automation state to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-state-delete`

### `linear api git-automation-state-update`

Updates the status, branch scope, or event of an existing rule. Requires permission to manage its team, and the team must not be retired. Omitted fields keep their values. — write (mutation gitAutomationStateUpdate)

**Changes something in the service.**

```sh
linear api git-automation-state-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The state to update. |
| `--id <value>` | The identifier of the state to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-state-update`

### `linear api git-automation-target-branch-create`

Creates a team’s target-branch pattern for Git automation. Add automation rules that reference the returned definition to choose the status changes. Requires team-management permission and an active, non-retired team. — write (mutation gitAutomationTargetBranchCreate)

**Changes something in the service.**

```sh
linear api git-automation-target-branch-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The Git target branch automation to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-target-branch-create`

### `linear api git-automation-target-branch-delete`

Deletes a target-branch definition and its associated automation rules. Future matching events use any remaining applicable rules, including team defaults. Requires team-management permission. — destructive (mutation gitAutomationTargetBranchDelete)

**Changes something in the service.**

```sh
linear api git-automation-target-branch-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the target branch definition to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-target-branch-delete`

### `linear api git-automation-target-branch-update`

Changes the pattern or matching mode used by every automation rule linked to this definition. Omitted fields stay unchanged. Requires team-management permission; definitions in retired teams cannot be updated. — write (mutation gitAutomationTargetBranchUpdate)

**Changes something in the service.**

```sh
linear api git-automation-target-branch-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The updates. |
| `--id <value>` | The identifier of the Git target branch automation to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api git-automation-target-branch-update`

### `linear api google-user-account-auth`

Exchanges a Google OAuth code, sets the authentication cookie, and returns workspace access details. May create an account unless disallowSignup is true. — write (mutation googleUserAccountAuth)

**Changes something in the service.**

```sh
linear api google-user-account-auth [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The data used for Google authentication. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api google-user-account-auth`

### `linear api image-upload-from-url`

Copies an image from an external URL into Linear’s private upload storage. The URL must let Linear download the image directly; an HTML page containing the image is not accepted. On success, the returned URL refers to the copied image and can be used in Linear content. Unlike fileUpload, this mutation performs the download and upload for you. — write (mutation imageUploadFromUrl)

**Changes something in the service.**

```sh
linear api image-upload-from-url [options]
```

| Option | What it does |
|---|---|
| `--url <value>` | URL of the file to be uploaded to Linear. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api image-upload-from-url`

### `linear api import-file-upload`

Prepares a file in Linear’s import storage. Upload the raw bytes with HTTP PUT to the returned uploadUrl, using all returned headers and the matching Content-Type. The upload must start within one minute and contain exactly the declared number of bytes. Success prepares the destination; it does not upload the bytes or start an import. — write (mutation importFileUpload)

**Changes something in the service.**

```sh
linear api import-file-upload [options]
```

| Option | What it does |
|---|---|
| `--meta-data <value>` | Optional metadata encoded as a JSON string, such as {"issueId":"..."} or {"commentId":"..."}. These references record upload context; they do not insert the file into that issue or comment. You still need to use assetUrl when creating or updating the content. |
| `--size <value>` | Exact file size in bytes. The upload request must match this size. |
| `--content-type <value>` | MIME type of the uploaded file. |
| `--filename <value>` | Filename of the uploaded file. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api import-file-upload`

### `linear api inbox-notifications`

The authenticated user’s visible inbox, excluding archived and snoozed notifications. Returns one notification per group of related activity. — read (query inboxNotifications)

```sh
linear api inbox-notifications [options]
```

| Option | What it does |
|---|---|
| `--first <value>` | The maximum number of inbox notification stacks to return. Defaults to 50. |
| `--after <value>` | The cursor after which to return inbox notification stacks. |
| `--unread-only <value>` | Whether to return only unread inbox notification stacks. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api inbox-notifications`

### `linear api inbox-notification-update`

Changes read or snooze state for the authenticated user’s group of related inbox notifications. Supply a notification UUID from the group and at least one state change. The response includes the requested notification and all notifications changed. — write (mutation inboxNotificationUpdate)

**Changes something in the service.**

```sh
linear api inbox-notification-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The inbox state changes to apply. |
| `--id <value>` | The identifier of the inbox notification to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api inbox-notification-update`

### `linear api initiative`

Returns an initiative you can access by UUID, URL slug, or human-readable initiative identifier. Archived initiatives can also be retrieved. — read (query initiative)

```sh
linear api initiative [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The initiative UUID, slug ID, or human-readable identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative`

### `linear api initiative-add-label`

Adds an initiative label while keeping the other labels. Label groups themselves cannot be applied, and the group’s selection rules still apply. — write (mutation initiativeAddLabel)

**Changes something in the service.**

```sh
linear api initiative-add-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to add. |
| `--id <value>` | The identifier of the initiative to add the label to. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-add-label`

### `linear api initiative-archive`

Archives an initiative. — destructive (mutation initiativeArchive)

**Changes something in the service.**

```sh
linear api initiative-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-archive`

### `linear api initiative-create`

Creates an initiative in a workspace where initiatives are enabled. You can assign an owner and lead team at creation. Add projects separately with initiativeToProjectCreate, and build a hierarchy with initiativeRelationCreate. — write (mutation initiativeCreate)

**Changes something in the service.**

```sh
linear api initiative-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiative to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-create`

### `linear api initiative-delete`

Moves an initiative to the trash instead of immediately deleting it permanently. You can restore it with initiativeUnarchive while it remains available. — destructive (mutation initiativeDelete)

**Changes something in the service.**

```sh
linear api initiative-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-delete`

### `linear api initiative-filter-suggestion`

Suggests filters for an initiative view based on a text prompt. — read (query initiativeFilterSuggestion)

```sh
linear api initiative-filter-suggestion [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | [Internal] The ID of the team if filtering a team view. |
| `--prompt <value>` | The text prompt to generate a filter suggestion from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-filter-suggestion`

### `linear api initiative-label`

Returns a single initiative label by its identifier. — read (query initiativeLabel)

```sh
linear api initiative-label [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the initiative label. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label`

### `linear api initiative-label-create`

Creates a workspace label or label group for initiatives. Requires workspace label-management permission. Use parentId to place a label in a group. — write (mutation initiativeLabelCreate)

**Changes something in the service.**

```sh
linear api initiative-label-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The initiative label to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label-create`

### `linear api initiative-label-delete`

Deletes an initiative label and its children, removing their assignments from initiatives. — destructive (mutation initiativeLabelDelete)

**Changes something in the service.**

```sh
linear api initiative-label-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label-delete`

### `linear api initiative-label-restore`

Restores a previously retired initiative label, making it available for use on new initiatives. — write (mutation initiativeLabelRestore)

**Changes something in the service.**

```sh
linear api initiative-label-restore [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to restore. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label-restore`

### `linear api initiative-label-retire`

Retires an initiative label. Retired labels remain on existing initiatives but cannot be applied to new ones. — write (mutation initiativeLabelRetire)

**Changes something in the service.**

```sh
linear api initiative-label-retire [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to retire. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label-retire`

### `linear api initiative-labels`

Returns all initiative labels in the workspace, with optional filtering. — read (query initiativeLabels)

```sh
linear api initiative-labels [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned initiative labels. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api initiative-labels`

### `linear api initiative-label-update`

Changes the supplied label fields. Omitted fields stay unchanged. Requires workspace label-management permission. — write (mutation initiativeLabelUpdate)

**Changes something in the service.**

```sh
linear api initiative-label-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial label object to update. |
| `--id <value>` | The identifier of the label to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-label-update`

### `linear api initiative-relation`

Returns a single initiative relation by its identifier. — read (query initiativeRelation)

```sh
linear api initiative-relation [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the initiative relation. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-relation`

### `linear api initiative-relation-create`

Adds a child initiative to a parent. Both must be accessible and unarchived, and the workspace must support sub-initiatives. When the new parent overlaps the child’s existing hierarchy, the overlapping parent links are removed as part of the move. Cycles and excessive nesting are rejected. — write (mutation initiativeRelationCreate)

**Changes something in the service.**

```sh
linear api initiative-relation-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The initiative relation to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-relation-create`

### `linear api initiative-relation-delete`

Removes a parent-child link without deleting either initiative. Deleting a link that no longer exists succeeds without making changes; an existing link still requires access to both initiatives. — destructive (mutation initiativeRelationDelete)

**Changes something in the service.**

```sh
linear api initiative-relation-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative relation to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-relation-delete`

### `linear api initiative-relations`

Returns all initiative parent-child relations in the workspace. — read (query initiativeRelations)

```sh
linear api initiative-relations [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api initiative-relations`

### `linear api initiative-relation-update`

Changes a child initiative’s ordering within its parent. The relation’s endpoints remain unchanged. Both initiatives must be visible to you. — write (mutation initiativeRelationUpdate)

**Changes something in the service.**

```sh
linear api initiative-relation-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiative relation to update. |
| `--id <value>` | The identifier of the initiative relation to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-relation-update`

### `linear api initiative-remove-label`

Removes a label from the initiative while keeping its other labels. The label itself is not deleted. — write (mutation initiativeRemoveLabel)

**Changes something in the service.**

```sh
linear api initiative-remove-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to remove. |
| `--id <value>` | The identifier of the initiative to remove the label from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-remove-label`

### `linear api initiatives`

Returns initiatives visible to you in the workspace, with optional filtering and sorting. Initiative access follows its lead team when one is assigned. — read (query initiatives)

```sh
linear api initiatives [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned initiatives. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned initiatives. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api initiatives`

### `linear api initiative-to-project`

Returns a single initiative-to-project association by its identifier. — read (query initiativeToProject)

```sh
linear api initiative-to-project [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the initiative-to-project link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-to-project`

### `linear api initiative-to-project-create`

Links an accessible, active project to an accessible, active initiative. Neither may be read-only. The link is rejected if the project is already in that initiative or one of its ancestors or descendants. App users need initiative:write scope. — write (mutation initiativeToProjectCreate)

**Changes something in the service.**

```sh
linear api initiative-to-project-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiativeToProject to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-to-project-create`

### `linear api initiative-to-project-delete`

Removes an active project-to-initiative link without deleting either entity. Requires access to the association; app users need initiative:write scope. — destructive (mutation initiativeToProjectDelete)

**Changes something in the service.**

```sh
linear api initiative-to-project-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiativeToProject to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-to-project-delete`

### `linear api initiative-to-projects`

Returns all initiative-to-project associations in the workspace. — read (query initiativeToProjects)

```sh
linear api initiative-to-projects [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api initiative-to-projects`

### `linear api initiative-to-project-update`

Changes the project’s sort order within the initiative. The initiative and project endpoints cannot be changed through this mutation. — write (mutation initiativeToProjectUpdate)

**Changes something in the service.**

```sh
linear api initiative-to-project-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiativeToProject to update. |
| `--id <value>` | The identifier of the initiativeToProject to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-to-project-update`

### `linear api initiative-unarchive`

Restores an archived or trashed initiative. This makes the existing initiative available again with its saved properties and associations. — write (mutation initiativeUnarchive)

**Changes something in the service.**

```sh
linear api initiative-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-unarchive`

### `linear api initiative-update`

Updates the supplied fields of an initiative you can access. Omitted fields keep their current values. Changing the lead team can change who can see the initiative, and the owner must be able to access the new team. — write (mutation initiativeUpdate)

**Changes something in the service.**

```sh
linear api initiative-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiative to update. |
| `--id <value>` | The identifier of the initiative to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-update`

### `linear api initiative-update-archive`

Archives an update and recalculates the initiative’s health from the remaining updates. You must be the author or have permission to manage workspace entities. Use initiativeUpdateUnarchive to restore it. — destructive (mutation initiativeUpdateArchive)

**Changes something in the service.**

```sh
linear api initiative-update-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative update to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-update-archive`

### `linear api initiative-update-create`

Publishes an update, records the current user as author, captures the initiative’s projects, and refreshes its health. Provide the written message in input.body. — write (mutation initiativeUpdateCreate)

**Changes something in the service.**

```sh
linear api initiative-update-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The initiative update object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-update-create`

### `linear api initiative-updates`

Returns all initiative status updates in the workspace, with optional filtering. — read (query initiativeUpdates)

```sh
linear api initiative-updates [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned initiative updates. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api initiative-updates`

### `linear api initiative-update-unarchive`

Restores an archived update and recalculates the initiative’s health. You must be the author or have permission to manage workspace entities. — write (mutation initiativeUpdateUnarchive)

**Changes something in the service.**

```sh
linear api initiative-update-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the initiative update to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-update-unarchive`

### `linear api initiative-update-update`

Edits an update’s message or health. You must be the author or have permission to manage workspace entities. Editing the latest update while it is less than one hour old also refreshes its project snapshots. — write (mutation initiativeUpdateUpdate)

**Changes something in the service.**

```sh
linear api initiative-update-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the initiative update to update. |
| `--id <value>` | The identifier of the initiative update to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api initiative-update-update`

### `linear api integration`

Retrieves an integration by UUID, including archived integrations. — read (query integration)

```sh
linear api integration [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the integration to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration`

### `linear api integration-archive`

Disconnects an integration that supports archiving while retaining its record for a later reconnect. You can archive your own personal connection; workspace connections generally require integration-creation permission. GitHub installation removal and Jira webhook cleanup run in the background, so a successful response can precede the completed disconnection. Services that do not support archiving must use integrationDelete instead. — destructive (mutation integrationArchive)

**Changes something in the service.**

```sh
linear api integration-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the integration to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-archive`

### `linear api integration-asks-connect-channel`

Connects the public or private Slack channel selected during OAuth to an existing Asks integration. The channel must be in that integration's Slack workspace and must not already be connected. Individual channel connections require full Asks access and permission to manage Asks settings. Check addBot after success and invite the bot manually when true. Direct messages work with Asks without this setup. — write (mutation integrationAsksConnectChannel)

**Changes something in the service.**

```sh
linear api integration-asks-connect-channel [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-asks-connect-channel`

### `linear api integration-delete`

Disconnects an integration that supports deletion and removes its connection record. You can remove your own personal connection; workspace connections require integration-creation permission, and team, project, or view connections follow the permissions for that resource. Some services finish external cleanup in the background, so success does not guarantee that cleanup has finished. Services that retain a record for reconnecting must use integrationArchive instead. — destructive (mutation integrationDelete)

**Changes something in the service.**

```sh
linear api integration-delete [options]
```

| Option | What it does |
|---|---|
| `--skip-installation-deletion <value>` | Whether to skip deleting the installation on the external service side. |
| `--id <value>` | The identifier of the integration to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-delete`

### `linear api integration-discord`

Connects a Discord server using the OAuth code and redirect URI from its authorization flow, and links the authorizing Discord user to your Linear account. A Linear workspace can have one Discord connection, and the Discord server cannot already belong to another Linear workspace's connection. — write (mutation integrationDiscord)

**Changes something in the service.**

```sh
linear api integration-discord [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Discord OAuth redirect URI. |
| `--code <value>` | The Discord OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-discord`

### `linear api integration-figma`

Connects Figma using an OAuth authorization code and its redirect URI, storing the credentials needed for the workspace integration. The workspace cannot already have an active Figma connection. — write (mutation integrationFigma)

**Changes something in the service.**

```sh
linear api integration-figma [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Figma OAuth redirect URI. |
| `--code <value>` | The Figma OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-figma`

### `linear api integration-front`

Connects Front using an OAuth grant. Requires the workspace's support integration plan feature and no existing Front connection. New connections initially reopen linked Front conversations when a Linear issue is completed or canceled; comments do not trigger reopening by default. — write (mutation integrationFront)

**Changes something in the service.**

```sh
linear api integration-front [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Front OAuth redirect URI. |
| `--code <value>` | The Front OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-front`

### `linear api integration-github-commit-create`

Creates the workspace's GitHub commit integration and returns its webhook secret. Use the secret when configuring the webhook in GitHub; creating this record alone does not configure GitHub to send events. — write (mutation integrationGithubCommitCreate)

**Changes something in the service.**

```sh
linear api integration-github-commit-create
```

**Example:** `linear personal api integration-github-commit-create`

### `linear api integration-github-connect`

Connects a GitHub App installation to the workspace using its installation ID and OAuth grant. If replacing a connection would make repositories used by GitHub Issues sync inaccessible, the call stops and returns gitHub.lostRepositoryNames. Review that list, then repeat with confirmReplace set to true to accept the change. GitHub Enterprise Cloud connections require the corresponding workspace plan feature. — write (mutation integrationGithubConnect)

**Changes something in the service.**

```sh
linear api integration-github-connect [options]
```

| Option | What it does |
|---|---|
| `--confirm-replace <value>` | Confirm replacing an existing installation after a prior call reported lostRepositoryNames. Defaults to false. |
| `--github-host <value>` | GitHub Enterprise Cloud hostname, such as acme.ghe.com, without a URL scheme or path. Omit for github.com. |
| `--code-access <value>` | Whether to connect the GitHub App with repository code access. Defaults to false. |
| `--code <value>` | The GitHub grant code that's exchanged for OAuth tokens. |
| `--installation-id <value>` | GitHub App installation ID as a positive integer string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-github-connect`

### `linear api integration-git-hub-enterprise-server-connect`

Starts a GitHub Enterprise Server connection for a GitHub organization or personal account. Open setupUrl to register the app, configure it with webhookSecret, then use installUrl to install it. Call verifyGitHubEnterpriseServerInstallation to check that the app has connected. Success here means the setup record was saved, not that installation is complete. An archived connection for the same organization is reused. — write (mutation integrationGitHubEnterpriseServerConnect)

**Changes something in the service.**

```sh
linear api integration-git-hub-enterprise-server-connect [options]
```

| Option | What it does |
|---|---|
| `--organization-name <value>` | GitHub organization login name. Use an empty string to create the app for a personal account. |
| `--github-url <value>` | The base URL of the GitHub Enterprise Server installation. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-git-hub-enterprise-server-connect`

### `linear api integration-github-import-connect`

Connects the GitHub Import App installation authorized by the supplied OAuth code. This creates the connection used to discover repositories for import; it does not import issues by itself. — write (mutation integrationGithubImportConnect)

**Changes something in the service.**

```sh
linear api integration-github-import-connect [options]
```

| Option | What it does |
|---|---|
| `--code <value>` | The GitHub grant code that's exchanged for OAuth tokens. |
| `--installation-id <value>` | GitHub App installation ID as a positive integer string. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-github-import-connect`

### `linear api integration-github-import-refresh`

Queues a refresh of repositories and labels available to a GitHub import integration. Success confirms scheduling. — write (mutation integrationGithubImportRefresh)

**Changes something in the service.**

```sh
linear api integration-github-import-refresh [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The id of the integration to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-github-import-refresh`

### `linear api integration-git-hub-personal`

Links your GitHub account using an OAuth code from Linear's GitHub App authorization flow. codeAccess selects the app with repository code access and defaults to false. This is a personal account connection; connecting a workspace's GitHub App installation uses integrationGithubConnect. — write (mutation integrationGitHubPersonal)

**Changes something in the service.**

```sh
linear api integration-git-hub-personal [options]
```

| Option | What it does |
|---|---|
| `--enterprise-url <value>` | The enterprise URL for GitHub Enterprise Cloud connections. Omit for github.com. |
| `--code-access <value>` | Whether to connect with code access. |
| `--code <value>` | The GitHub OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-git-hub-personal`

### `linear api integration-github-remove-code-access`

Removes repository code access from a GitHub connection. Check action in the response: Done means the change is complete, while InstallBasicApp means you need to finish installing the basic GitHub App before setup is complete. — write (mutation integrationGithubRemoveCodeAccess)

**Changes something in the service.**

```sh
linear api integration-github-remove-code-access [options]
```

| Option | What it does |
|---|---|
| `--integration-id <value>` | The ID of the integration to remove code access from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-github-remove-code-access`

### `linear api integration-gitlab-connect`

Connects a GitLab instance after checking its access token. Configure the GitLab webhook with the returned webhookSecret after a successful response. Only one GitLab connection is allowed per workspace. Token or connectivity failures return success=false and diagnostic error fields instead of creating a connection. — write (mutation integrationGitlabConnect)

**Changes something in the service.**

```sh
linear api integration-gitlab-connect [options]
```

| Option | What it does |
|---|---|
| `--access-token <value>` | GitLab access token for the instance being connected. Linear validates it before saving the connection and uses its reported scopes and expiry when available. |
| `--gitlab-url <value>` | Base URL of the GitLab instance, including its URL scheme. Linear uses this host for token validation and subsequent API requests. |
| `--validation-project-path <value>` | Optional path or numeric ID of a project to use for the setup health check. Set this when the GitLab tenant blocks non-project API endpoints. |
| `--readonly <value>` | Whether the access token is limited to a read-only scope. Used as a fallback when `validationProjectPath` is set and `personal_access_tokens/self` is unreachable. |
| `--expires-at <value>` | ISO timestamp when the access token expires. Used as a fallback when `validationProjectPath` is set and `personal_access_tokens/self` is unreachable. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gitlab-connect`

### `linear api integration-gitlab-rotate`

Rotates the GitLab token, revoking the previous token and saving its replacement. — write (mutation integrationGitlabRotate)

**Changes something in the service.**

```sh
linear api integration-gitlab-rotate [options]
```

| Option | What it does |
|---|---|
| `--integration-id <value>` | UUID of the GitLab integration. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gitlab-rotate`

### `linear api integration-gitlab-test-connection`

Tests the stored access token against a self-hosted GitLab instance, using the validation project when one is configured. A successful check clears the connection's authentication and transient failure state. On failure, inspect success and the error fields for provider or proxy diagnostics. This mutation does not support the GitLab.com OAuth connection. — write (mutation integrationGitlabTestConnection)

**Changes something in the service.**

```sh
linear api integration-gitlab-test-connection [options]
```

| Option | What it does |
|---|---|
| `--integration-id <value>` | The ID of the GitLab integration to test. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gitlab-test-connection`

### `linear api integration-gitlab-update-rotation-settings`

Enables or disables automatic self-rotation of the GitLab token. — write (mutation integrationGitlabUpdateRotationSettings)

**Changes something in the service.**

```sh
linear api integration-gitlab-update-rotation-settings [options]
```

| Option | What it does |
|---|---|
| `--enabled <value>` | Whether Linear should automatically rotate the GitLab token. |
| `--integration-id <value>` | UUID of the GitLab integration. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gitlab-update-rotation-settings`

### `linear api integration-gitlab-update-token`

Replaces a GitLab integration's access token after validating the replacement against its existing host and validation project. The connection and webhook stay in place. Supply readonly and expiresAt when the instance cannot report that token information. — write (mutation integrationGitlabUpdateToken)

**Changes something in the service.**

```sh
linear api integration-gitlab-update-token [options]
```

| Option | What it does |
|---|---|
| `--expires-at <value>` | The time at which the replacement token expires. Used when GitLab cannot return its expiry. |
| `--readonly <value>` | Whether the replacement token has read-only access. Required when GitLab cannot return its scopes. |
| `--access-token <value>` | Replacement GitLab access token. Validated before it replaces the current token. |
| `--integration-id <value>` | UUID of the GitLab integration. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gitlab-update-token`

### `linear api integration-gong`

Connects Gong using an OAuth authorization code and its redirect URI. Requires the workspace's Gong integration plan feature and integration-creation permission. The workspace cannot already have an active Gong connection. — write (mutation integrationGong)

**Changes something in the service.**

```sh
linear api integration-gong [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Gong OAuth redirect URI. |
| `--code <value>` | The Gong OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-gong`

### `linear api integration-google-sheets`

Connects Google Sheets using an OAuth grant that includes both access and refresh tokens. The workspace can have one active Google Sheets connection. This call saves the connection; use refreshGoogleSheetsData to request an export refresh. — write (mutation integrationGoogleSheets)

**Changes something in the service.**

```sh
linear api integration-google-sheets [options]
```

| Option | What it does |
|---|---|
| `--code <value>` | The Google OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-google-sheets`

### `linear api integration-has-scopes`

Checks whether an active integration has every requested OAuth scope recorded on its connection. Use missingScopes to decide whether to request another authorization grant. This does not contact the provider or verify that the current token still works. — read (query integrationHasScopes)

```sh
linear api integration-has-scopes [options]
```

| Option | What it does |
|---|---|
| `--scopes <value>` | Required scopes. |
| `--integration-id <value>` | The integration ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-has-scopes`

### `linear api integration-intercom`

Connects an Intercom workspace using an OAuth code and the redirect URI used during authorization. The workspace needs access to the support integration plan feature. Reconnecting the same Intercom workspace refreshes credentials and keeps its settings; disconnect first to switch to a different Intercom workspace. An Intercom workspace cannot be connected to another Linear workspace at the same time. — write (mutation integrationIntercom)

**Changes something in the service.**

```sh
linear api integration-intercom [options]
```

| Option | What it does |
|---|---|
| `--domain-url <value>` | The Intercom domain URL to use for the integration. Defaults to app.intercom.com if not provided. |
| `--redirect-uri <value>` | The Intercom OAuth redirect URI. |
| `--code <value>` | The Intercom OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-intercom`

### `linear api integration-intercom-delete`

Uninstalls the Intercom connection and removes its Linear record. It also completes local cleanup when access was already revoked in Intercom. Calling this after the Linear connection has been removed returns an error. — destructive (mutation integrationIntercomDelete)

**Changes something in the service.**

```sh
linear api integration-intercom-delete
```

**Example:** `linear personal api integration-intercom-delete`

### `linear api integration-intercom-settings-update`

[DEPRECATED] Updates settings on the Intercom integration. — write (mutation integrationIntercomSettingsUpdate)

**Changes something in the service.**

```sh
linear api integration-intercom-settings-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial Intercom integration settings object to update the integration settings with. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-intercom-settings-update`

### `linear api integration-jira-personal`

Links your Jira account to an existing workspace Jira integration. Supply either the OAuth authorization code for Jira Cloud or a personal access token for Jira Server. When the workspace has more than one possible Jira connection, supply workspaceIntegrationId to choose which one to link. — write (mutation integrationJiraPersonal)

**Changes something in the service.**

```sh
linear api integration-jira-personal [options]
```

| Option | What it does |
|---|---|
| `--workspace-integration-id <value>` | The workspace Jira integration to connect to. Required when the connection would otherwise be ambiguous. |
| `--code <value>` | The Jira OAuth code, when connecting using OAuth. |
| `--access-token <value>` | The Jira personal access token, when connecting using a PAT. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-jira-personal`

### `linear api integration-loom`

Enables Loom integration for the workspace. — write (mutation integrationLoom)

**Changes something in the service.**

```sh
linear api integration-loom
```

**Example:** `linear personal api integration-loom`

### `linear api integration-microsoft-personal-connect`

Links your Microsoft account to Linear. Its tenant must already be connected through a workspace Microsoft Teams integration. Reconnecting the same account refreshes credentials when the existing personal connection has an authentication error; otherwise, disconnect the existing personal connection before linking another account. — write (mutation integrationMicrosoftPersonalConnect)

**Changes something in the service.**

```sh
linear api integration-microsoft-personal-connect [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Microsoft OAuth redirect URI. |
| `--code <value>` | The Microsoft OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-microsoft-personal-connect`

### `linear api integration-microsoft-teams`

Connects the Microsoft tenant identified by the OAuth grant to this Linear workspace. An archived connection to the same tenant is restored. Multiple tenants require the corresponding plan feature, and a tenant cannot be actively connected to another Linear workspace. Personal Microsoft accounts are linked separately with integrationMicrosoftPersonalConnect. — write (mutation integrationMicrosoftTeams)

**Changes something in the service.**

```sh
linear api integration-microsoft-teams [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Microsoft OAuth redirect URI. |
| `--code <value>` | The Microsoft OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-microsoft-teams`

### `linear api integration-request`

Records interest in an integration that is not currently available. No authentication is required, and this does not create an integration or start an installation. Success means the request was accepted for analytics; it does not promise that the integration will be built. — write (mutation integrationRequest)

**Changes something in the service.**

```sh
linear api integration-request [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Integration request details. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-request`

### `linear api integrations`

Integrations accessible to the caller, with cursor-based pagination. — read (query integrations)

```sh
linear api integrations [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api integrations`

### `linear api integration-salesforce`

Connects Salesforce using an OAuth grant and verifies that the authorizing user can access the Linear managed package, including its required license. Requires the workspace's enterprise integration plan feature. Reconnecting an active connection to the same subdomain refreshes credentials while keeping settings and templates; restoring an archived connection runs setup again. Disconnect first to switch to a different Salesforce subdomain. — write (mutation integrationSalesforce)

**Changes something in the service.**

```sh
linear api integration-salesforce [options]
```

| Option | What it does |
|---|---|
| `--code <value>` | The Salesforce OAuth code. |
| `--subdomain <value>` | Salesforce installation subdomain. Use the subdomain alone, containing letters, numbers, and dashes, rather than a complete URL. |
| `--redirect-uri <value>` | The Salesforce OAuth redirect URI. |
| `--code-verifier <value>` | The PKCE code verifier matching the code_challenge sent on authorization. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-salesforce`

### `linear api integration-sentry-connect`

Connects a Sentry installation by exchanging its grant code and confirming installation with Sentry. The workspace can have one active Sentry connection. The new connection initially enables completing linked Linear issues when Sentry issues are resolved and reopening them when Sentry issues are unresolved. — write (mutation integrationSentryConnect)

**Changes something in the service.**

```sh
linear api integration-sentry-connect [options]
```

| Option | What it does |
|---|---|
| `--code <value>` | The Sentry grant code that's exchanged for OAuth tokens. |
| `--installation-id <value>` | The Sentry installationId to connect with. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-sentry-connect`

### `linear api integration-slack`

Connects a Slack workspace to the main Linear Slack app using an OAuth grant. Reconnecting an archived connection restores it with fresh credentials. Connecting multiple Slack workspaces requires the corresponding plan feature; the same Slack workspace cannot have two active connections or belong to another Linear workspace's connection. — write (mutation integrationSlack)

**Changes something in the service.**

```sh
linear api integration-slack [options]
```

| Option | What it does |
|---|---|
| `--requested-scopes <value>` | The Slack OAuth scopes the client requested. Used to warn when Slack grants fewer scopes than requested. |
| `--should-use-v2-auth <value>` | [DEPRECATED] Whether or not v2 of Slack OAuth should be used. No longer used. |
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack`

### `linear api integration-slack-asks`

Connects a Slack workspace to the Linear Asks app for issue intake. Requires a workspace plan with Asks access. An archived connection to the same Slack workspace is restored with fresh credentials. Multiple Slack workspaces require the corresponding plan feature, and each Slack workspace can be connected to Asks in only one Linear workspace. — write (mutation integrationSlackAsks)

**Changes something in the service.**

```sh
linear api integration-slack-asks [options]
```

| Option | What it does |
|---|---|
| `--requested-scopes <value>` | The Slack OAuth scopes the client requested. Used to warn when Slack grants fewer scopes than requested. |
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-asks`

### `linear api integration-slack-customer-channel-link`

Links a customer to a public or private Slack channel in a connected Asks workspace. Both the customer and channel must be unlinked. — write (mutation integrationSlackCustomerChannelLink)

**Changes something in the service.**

```sh
linear api integration-slack-customer-channel-link [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--customer-id <value>` | The customer to link the Slack channel with. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-customer-channel-link`

### `linear api integration-slack-custom-view-notifications`

Connects the Slack channel selected during OAuth to a custom view and creates default notification settings if needed. You must be able to edit the view, and the view cannot already have this type of Slack connection. Check the response for remaining bot or workspace setup. — write (mutation integrationSlackCustomViewNotifications)

**Changes something in the service.**

```sh
linear api integration-slack-custom-view-notifications [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--custom-view-id <value>` | UUID of the Linear custom view whose notifications should be sent to the selected Slack channel. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-custom-view-notifications`

### `linear api integration-slack-import-emojis`

Queues an import of custom emoji from Slack using the OAuth grant. Success confirms scheduling. — write (mutation integrationSlackImportEmojis)

**Changes something in the service.**

```sh
linear api integration-slack-import-emojis [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-import-emojis`

### `linear api integration-slack-or-asks-update-slack-team-name`

Fetches the current Slack workspace name and updates the name stored on an active Slack or Asks integration. This refreshes Linear's display name; it does not rename the workspace in Slack. A valid integration token is required. — write (mutation integrationSlackOrAsksUpdateSlackTeamName)

**Changes something in the service.**

```sh
linear api integration-slack-or-asks-update-slack-team-name [options]
```

| Option | What it does |
|---|---|
| `--integration-id <value>` | The integration ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-or-asks-update-slack-team-name`

### `linear api integration-slack-org-project-updates-post`

Connects the Slack channel selected during OAuth to receive project updates from across the workspace. Requires integration-management permission. Check addBot and the nudge fields in the response for any remaining Slack setup. — write (mutation integrationSlackOrgProjectUpdatesPost)

**Changes something in the service.**

```sh
linear api integration-slack-org-project-updates-post [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-org-project-updates-post`

### `linear api integration-slack-personal`

Links your Slack account for personal notifications and opens a direct message with the Linear app. The Slack workspace must already have a Slack or Asks connection. You can have one active personal Slack connection, and the same Slack account cannot be linked to another user in this Linear workspace. An archived connection owned by you can be restored. — write (mutation integrationSlackPersonal)

**Changes something in the service.**

```sh
linear api integration-slack-personal [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-personal`

### `linear api integration-slack-post`

Connects the Slack channel selected during OAuth to a Linear team and creates its default notification settings if needed. Requires permission to manage the team, and each team can have one such connection. Direct messages are not supported. Check addBot and the nudge fields in the response for any remaining Slack setup. — write (mutation integrationSlackPost)

**Changes something in the service.**

```sh
linear api integration-slack-post [options]
```

| Option | What it does |
|---|---|
| `--should-use-v2-auth <value>` | [DEPRECATED] Whether or not v2 of Slack OAuth should be used. No longer used. |
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--team-id <value>` | UUID of the Linear team whose notifications should be sent to the selected Slack channel. This is not a Slack workspace or channel ID. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-post`

### `linear api integration-slack-project-post`

Connects the Slack channel selected during OAuth to a project you can access. Choose notifications for project notifications or updates for project updates; each service can have one connection per project. The call also links the channel to the project and creates default notification settings if needed. Check the response for remaining bot or workspace setup. — write (mutation integrationSlackProjectPost)

**Changes something in the service.**

```sh
linear api integration-slack-project-post [options]
```

| Option | What it does |
|---|---|
| `--service <value>` | The service to enable once connected, either 'notifications' or 'updates'. |
| `--redirect-uri <value>` | The Slack OAuth redirect URI. |
| `--project-id <value>` | UUID of the Linear project whose notifications or updates should be sent to the selected Slack channel. |
| `--code <value>` | The Slack OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-slack-project-post`

### `linear api integrations-settings`

Retrieves a specific integration settings configuration by its identifier. — read (query integrationsSettings)

```sh
linear api integrations-settings [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the integration settings to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integrations-settings`

### `linear api integrations-settings-create`

Creates notification preferences for a destination you can access, with edit permission required for custom views. Supply exactly one team, project, initiative, or view. Settings must not already exist for that destination and, for team settings, context view; use integrationsSettingsUpdate when they do. An app writing initiative preferences also needs initiative:write scope. — write (mutation integrationsSettingsCreate)

**Changes something in the service.**

```sh
linear api integrations-settings-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The settings to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integrations-settings-create`

### `linear api integrations-settings-update`

Updates the event preferences on an existing integration settings record. Only supplied booleans change, and the destination stays the same. Custom-view settings require permission to edit the view; apps changing initiative settings need initiative:write scope. For older settings that combined update and comment notifications, the first edit preserves the previous comment preference independently. — write (mutation integrationsSettingsUpdate)

**Changes something in the service.**

```sh
linear api integrations-settings-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A settings object to update the settings with. |
| `--id <value>` | The identifier of the settings to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integrations-settings-update`

### `linear api integration-template`

Retrieves a single integration template connection by its identifier. — read (query integrationTemplate)

```sh
linear api integration-template [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the integration template to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-template`

### `linear api integration-template-create`

Makes an issue template available through Slack Asks, Slack, Intercom, Zendesk, or Salesforce. Slack Asks requires permission to manage Asks, a connected intake destination, and a team template; linking the template enables triage for that team. Other supported integrations require integration-management permission and accept up to ten templates. Private-team templates are supported only by Slack Asks. — write (mutation integrationTemplateCreate)

**Changes something in the service.**

```sh
linear api integration-template-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The template, integration, and optional external resource to link. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-template-create`

### `linear api integration-template-delete`

Removes a template's link to an integration or intake destination. The template itself and the integration remain available. Requires permission to manage the Asks integration for Slack Asks, or integration-management permission for other services. — destructive (mutation integrationTemplateDelete)

**Changes something in the service.**

```sh
linear api integration-template-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the template-integration link to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-template-delete`

### `linear api integration-templates`

All integration template connections for the workspace, linking templates to integrations. — read (query integrationTemplates)

```sh
linear api integration-templates [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api integration-templates`

### `linear api integration-zendesk`

Connects Zendesk using an OAuth grant and creates or selects the user that authors internal notes. Requires the workspace's support integration plan feature. Reconnecting the same subdomain refreshes credentials and keeps existing settings; an archived connection is restored. Disconnect the current integration before switching to a different Zendesk subdomain. — write (mutation integrationZendesk)

**Changes something in the service.**

```sh
linear api integration-zendesk [options]
```

| Option | What it does |
|---|---|
| `--subdomain <value>` | Zendesk subdomain, such as acme for acme.zendesk.com. Use letters, numbers, and dashes without a scheme or domain suffix. |
| `--code <value>` | The Zendesk OAuth authorization code. |
| `--scope <value>` | The Zendesk OAuth scopes. Required when connecting with `code`. |
| `--redirect-uri <value>` | The Zendesk OAuth redirect URI. Required when connecting with `code`. |
| `--bot-user-role <value>` | Role for the Zendesk bot user Linear creates: end-user or agent. Omit to retain the role on reconnect; new connections default to end-user. Ignored when botUserId selects an existing user. |
| `--bot-user-id <value>` | The Zendesk user ID to use as the author of internal notes instead of creating a bot user. Omit to keep the configured user on reconnect, or pass null to create a new bot user. |
| `--custom-api-url <value>` | Custom base URL for Zendesk API requests, such as a proxy in front of Zendesk. OAuth requests always use the standard subdomain URL. |
| `--access-token <value>` | Bearer token that authenticates API requests instead of a Zendesk OAuth token. Requires `customApiUrl`; no OAuth exchange is performed. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api integration-zendesk`

### `linear api issue`

Finds an issue by UUID or a human-readable identifier such as ENG-123. Archived issues can also be returned. The query fails if the issue does not exist or you cannot access it. — read (query issue)

```sh
linear api issue [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | Issue UUID or identifier, such as ENG-123. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue`

### `linear api issue-add-label`

Add a label without replacing the issue’s existing labels. The label must be available to the issue’s team. — write (mutation issueAddLabel)

**Changes something in the service.**

```sh
linear api issue-add-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to add. |
| `--id <value>` | The identifier of the issue to add the label to. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-add-label`

### `linear api issue-archive`

Archives an issue and its sub-issues, keeping their data available for later restoration. Archived issues are excluded from normal issue lists. Pass trash only when you want the deletion grace period to apply instead. — destructive (mutation issueArchive)

**Changes something in the service.**

```sh
linear api issue-archive [options]
```

| Option | What it does |
|---|---|
| `--trash <value>` | Whether to trash the issue and its sub-issues. |
| `--id <value>` | The identifier of the issue to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-archive`

### `linear api issue-batch-create`

Creates one to 50 issues in a single batch. If any creation fails, none of the issues in the batch are saved. Put parent inputs before their sub-issues and supply parent UUIDs to connect issues created in the same batch. — write (mutation issueBatchCreate)

**Changes something in the service.**

```sh
linear api issue-batch-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A list of issue objects to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-batch-create`

### `linear api issue-batch-update`

Applies the same update input to one to 50 issues. The batch runs as one transaction, so a failed update rolls back the other updates. Use the returned issues to read the resulting values. — write (mutation issueBatchUpdate)

**Changes something in the service.**

```sh
linear api issue-batch-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial issue object to update the issues with. |
| `--ids <value>` | One to 50 distinct issue UUIDs to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-batch-update`

### `linear api issue-create`

Creates an issue in the chosen team and returns it with its assigned identifier. You can supply a template to populate defaults and create any sub-issues it defines. Team settings and automation may set values such as the initial status, assignee, and cycle. — write (mutation issueCreate)

**Changes something in the service.**

```sh
linear api issue-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The issue object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-create`

### `linear api issue-delete`

Moves an issue to the trash and trashes its unarchived sub-issues that you can access. Trashed issues can be restored during the 30-day grace period; permanentlyDelete skips that period and requires workspace entity-management permission. — destructive (mutation issueDelete)

**Changes something in the service.**

```sh
linear api issue-delete [options]
```

| Option | What it does |
|---|---|
| `--permanently-delete <value>` | Delete immediately, skipping the 30-day grace period. Requires workspace permission to manage entities and access to the issue’s team. |
| `--id <value>` | The identifier of the issue to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-delete`

### `linear api issue-external-sync-disable`

Stop syncing an issue with the Jira or GitHub integration identified by its sync attachment. — write (mutation issueExternalSyncDisable)

**Changes something in the service.**

```sh
linear api issue-external-sync-disable [options]
```

| Option | What it does |
|---|---|
| `--attachment-id <value>` | The ID of the sync attachment to disable. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-external-sync-disable`

### `linear api issue-figma-file-key-search`

Find issues that are related to a given Figma file key. — read (query issueFigmaFileKeySearch)

```sh
linear api issue-figma-file-key-search [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--file-key <value>` | The Figma file key. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issue-figma-file-key-search`

### `linear api issue-filter-suggestion`

Suggests filters for an issue view based on a text prompt. — read (query issueFilterSuggestion)

```sh
linear api issue-filter-suggestion [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | [Internal] The ID of the team if filtering a team view. |
| `--project-id <value>` | The ID of the project if filtering a project view. |
| `--prompt <value>` | The text prompt to generate a filter suggestion from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-filter-suggestion`

### `linear api issue-import-check-csv`

Validate a Jira CSV uploaded to the workspace. Invalid files return an error. — read (query issueImportCheckCSV)

```sh
linear api issue-import-check-csv [options]
```

| Option | What it does |
|---|---|
| `--csv-url <value>` | Asset URL of a CSV uploaded to this workspace’s import storage. |
| `--service <value>` | CSV source service. Only jira is supported. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-check-csv`

### `linear api issue-import-check-sync`

Checks whether a GitHub or Jira import can continue syncing with its source after import. A false result includes an explanation when available; other services return canSync: false. This check does not enable sync. — read (query issueImportCheckSync)

```sh
linear api issue-import-check-sync [options]
```

| Option | What it does |
|---|---|
| `--issue-import-id <value>` | The ID of the issue import for which to check sync eligibility. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-check-sync`

### `linear api issue-import-create-asana`

Starts fetching Asana tasks into an asynchronous import job. Choose an existing destination team or a new team name. Configure the fetched data and call issueImportProcess to create Linear records. — write (mutation issueImportCreateAsana)

**Changes something in the service.**

```sh
linear api issue-import-create-asana [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | UUID of an existing destination team. Provide either teamId or teamName. |
| `--team-name <value>` | Name of a new destination team. Provide either teamId or teamName. |
| `--asana-token <value>` | Asana token to fetch information from the Asana API. |
| `--asana-team-name <value>` | Name of the source Asana team. |
| `--asana-project-names <value>` | Names of Asana projects in the team. When set, only tasks from these projects are imported. When empty, all projects are imported. |
| `--instant-process <value>` | Start creating Linear records after fetching source data, using default mappings. Defaults to false, allowing mappings to be reviewed first. |
| `--include-closed-issues <value>` | Include completed Asana tasks when fetching source data. |
| `--id <value>` | ID of issue import. If not provided it will be generated. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-create-asana`

### `linear api issue-import-create-clubhouse`

Starts fetching stories from Shortcut, whose legacy API name is clubhouse, into an asynchronous import job. Choose an existing destination team or a new team name. Configure the fetched data and call issueImportProcess to create Linear records. — write (mutation issueImportCreateClubhouse)

**Changes something in the service.**

```sh
linear api issue-import-create-clubhouse [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | UUID of an existing destination team. Provide either teamId or teamName. |
| `--team-name <value>` | Name of a new destination team. Provide either teamId or teamName. |
| `--clubhouse-token <value>` | Shortcut (formerly Clubhouse) token to fetch information from the Clubhouse API. |
| `--clubhouse-group-name <value>` | Name of the source Shortcut group. |
| `--instant-process <value>` | Start creating Linear records after fetching source data, using default mappings. Defaults to false, allowing mappings to be reviewed first. |
| `--include-closed-issues <value>` | Include completed Shortcut stories when fetching source data. |
| `--id <value>` | ID of issue import. If not provided it will be generated. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-create-clubhouse`

### `linear api issue-import-create-csvjira`

Creates an asynchronous import from a Jira CSV already uploaded to the workspace’s import storage. Choose an existing destination team or a new team name. The response accepts the job; it does not mean the imported records are ready. — write (mutation issueImportCreateCSVJira)

**Changes something in the service.**

```sh
linear api issue-import-create-csvjira [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | UUID of an existing destination team. To create a team, omit this and provide teamName. |
| `--team-name <value>` | Name of a new destination team. Cannot be combined with teamId. |
| `--csv-url <value>` | Asset URL of a Jira CSV uploaded to this workspace’s import storage. |
| `--jira-hostname <value>` | Jira installation or cloud hostname. |
| `--jira-token <value>` | Jira personal access token to access Jira REST API. |
| `--jira-email <value>` | Jira user account email. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-create-csvjira`

### `linear api issue-import-create-github`

Starts fetching GitHub issues into an asynchronous import job. Choose an existing destination team or provide a name for a new one, and repositories the workspace can import from. After fetching and configuration, use issueImportProcess to create the Linear records. Requires workspace import permission. — write (mutation issueImportCreateGithub)

**Changes something in the service.**

```sh
linear api issue-import-create-github [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | UUID of an existing destination team. Provide either teamId or teamName. |
| `--team-name <value>` | Name of a new destination team. Provide either teamId or teamName. |
| `--github-repo-ids <value>` | Numeric GitHub repository IDs to import. The workspace must have import access to these repositories. |
| `--github-labels <value>` | GitHub label names to use when filtering the imported issues. Omit or send an empty list to import without a label filter. |
| `--instant-process <value>` | Start creating Linear records after fetching source data, using default mappings. Defaults to false, allowing mappings to be reviewed first. |
| `--include-closed-issues <value>` | Include closed GitHub issues when fetching source data. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-create-github`

### `linear api issue-import-create-jira`

Starts fetching Jira issues into an asynchronous import job. Choose an existing destination team or a new team name and the source Jira project. After fetching and configuration, use issueImportProcess to create the Linear records. Requires workspace import permission. — write (mutation issueImportCreateJira)

**Changes something in the service.**

```sh
linear api issue-import-create-jira [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | UUID of an existing destination team. Provide either teamId or teamName. |
| `--team-name <value>` | Name of a new destination team. Provide either teamId or teamName. |
| `--jira-token <value>` | Jira personal access token to access Jira REST API. |
| `--jira-project <value>` | Jira project key from which we will import data. |
| `--jira-email <value>` | Jira user account email. |
| `--jira-hostname <value>` | Jira installation or cloud hostname. |
| `--jql <value>` | Additional JQL conditions within jiraProject. The project restriction is always applied. |
| `--instant-process <value>` | Start creating Linear records after fetching source data, using default mappings. Defaults to false, allowing mappings to be reviewed first. |
| `--include-closed-issues <value>` | Include closed Jira issues when fetching source data. |
| `--id <value>` | ID of issue import. If not provided it will be generated. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-create-jira`

### `linear api issue-import-delete`

Schedules deletion of an import and the data it created, then returns the job with status deleting. This is available within 14 days for eligible imports awaiting configuration, completed imports, or failed imports. You must be the creator or an admin with the destination team’s deletion permission, and another import from the same service must not be processing. — destructive (mutation issueImportDelete)

**Changes something in the service.**

```sh
linear api issue-import-delete [options]
```

| Option | What it does |
|---|---|
| `--issue-import-id <value>` | ID of the issue import to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-delete`

### `linear api issue-import-jql-check`

Validate JQL within the specified Jira project and return an approximate match count. — read (query issueImportJqlCheck)

```sh
linear api issue-import-jql-check [options]
```

| Option | What it does |
|---|---|
| `--jira-hostname <value>` | Jira installation or cloud hostname. |
| `--jira-token <value>` | Jira personal access token to access Jira REST API. |
| `--jira-email <value>` | Jira user account email. |
| `--jira-project <value>` | Jira project key to use as the base filter of the query. |
| `--jql <value>` | The JQL query to validate. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-jql-check`

### `linear api issue-import-process`

Saves the supplied mappings and schedules creation of Linear records from the fetched source data. The import must be inProgress; otherwise the mappings are saved but success is false. A successful response means processing was accepted, not that it has finished. Linear-to-Linear migrations can only be managed from the Linear app. — write (mutation issueImportProcess)

**Changes something in the service.**

```sh
linear api issue-import-process [options]
```

| Option | What it does |
|---|---|
| `--mapping <value>` | The mapping configuration to use for processing the import. |
| `--issue-import-id <value>` | ID of the issue import which we're going to process. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-process`

### `linear api issue-import-update`

Saves mapping choices without starting the import. For external-service imports, supply the full replacement mapping. Requires workspace import permission; Linear-to-Linear migrations can only be managed from the Linear app. — write (mutation issueImportUpdate)

**Changes something in the service.**

```sh
linear api issue-import-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the issue import to update. |
| `--id <value>` | The identifier of the issue import. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-import-update`

### `linear api issue-label`

A label by UUID, including archived labels. — read (query issueLabel)

```sh
linear api issue-label [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label`

### `linear api issue-label-create`

Create a workspace or team label. Requires permission to manage labels in its scope. — write (mutation issueLabelCreate)

**Changes something in the service.**

```sh
linear api issue-label-create [options]
```

| Option | What it does |
|---|---|
| `--replace-team-labels <value>` | Whether to replace all team-specific labels with the same name with this newly created workspace label (default: false). |
| `--input <value>` | The issue label to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label-create`

### `linear api issue-label-delete`

Deletes a label and its inherited copies. Assignments to that label are removed from issues in the background, so they may remain visible briefly after the mutation succeeds. Retire a label instead if you want to preserve its existing assignments. — destructive (mutation issueLabelDelete)

**Changes something in the service.**

```sh
linear api issue-label-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label-delete`

### `linear api issue-label-restore`

Makes a retired label available for new assignments again. Existing issue assignments are preserved. Restoring a group also restores its child labels. — write (mutation issueLabelRestore)

**Changes something in the service.**

```sh
linear api issue-label-restore [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to restore. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label-restore`

### `linear api issue-label-retire`

Retires a label so it cannot be newly assigned, while keeping it on issues that already use it. Retiring a group also retires its children. Use issueLabelRestore to make the label available again. — write (mutation issueLabelRetire)

**Changes something in the service.**

```sh
linear api issue-label-retire [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to retire. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label-retire`

### `linear api issue-labels`

Workspace and team labels the caller can access, with cursor pagination and optional filters. — read (query issueLabels)

```sh
linear api issue-labels [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned issue labels. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issue-labels`

### `linear api issue-label-update`

Update a label. Requires permission to manage labels in its scope; inherited labels must be edited at their source. — write (mutation issueLabelUpdate)

**Changes something in the service.**

```sh
linear api issue-label-update [options]
```

| Option | What it does |
|---|---|
| `--replace-team-labels <value>` | Whether to replace all team-specific labels with the same name with this updated workspace label (default: false). |
| `--input <value>` | A partial label object to update. |
| `--id <value>` | The identifier of the label to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-label-update`

### `linear api issue-priority-values`

Issue priority values and corresponding labels. — read (query issuePriorityValues)

```sh
linear api issue-priority-values
```

**Example:** `linear personal api issue-priority-values`

### `linear api issue-relation`

One specific issue relation, looked up by its unique identifier. — read (query issueRelation)

```sh
linear api issue-relation [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the issue relation to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-relation`

### `linear api issue-relation-create`

Creates a relationship between two issues, replacing any conflicting relation between the pair and reusing an identical one. A duplicate relation closes the source as a duplicate of the target and can move linked customer requests to the target. You must have access to both issues and any permissions required for the merge. — write (mutation issueRelationCreate)

**Changes something in the service.**

```sh
linear api issue-relation-create [options]
```

| Option | What it does |
|---|---|
| `--override-created-at <value>` | Used by client undo operations. Should not be set directly. |
| `--input <value>` | The issue relation to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-relation-create`

### `linear api issue-relation-delete`

Removes a relation by its UUID. Removing a duplicate relation also runs the unmerge behavior, including moving customer requests back to the original issue when applicable. — destructive (mutation issueRelationDelete)

**Changes something in the service.**

```sh
linear api issue-relation-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the issue relation to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-relation-delete`

### `linear api issue-relations`

Issue relations the caller can access, with cursor pagination. — read (query issueRelations)

```sh
linear api issue-relations [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issue-relations`

### `linear api issue-relation-update`

Changes a relation’s type or the issues it connects. Omitted fields are unchanged, and an issue cannot relate to itself. Changing to or from duplicate also applies the corresponding merge or unmerge behavior. — write (mutation issueRelationUpdate)

**Changes something in the service.**

```sh
linear api issue-relation-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the issue relation to update. |
| `--id <value>` | The identifier of the issue relation to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-relation-update`

### `linear api issue-reminder`

Creates a reminder notification for you at reminderAt. The time must be in the future, and existing reminders for this issue are replaced. The payload returns success without an issue object. — write (mutation issueReminder)

**Changes something in the service.**

```sh
linear api issue-reminder [options]
```

| Option | What it does |
|---|---|
| `--reminder-at <value>` | Future time at which to deliver the reminder notification. |
| `--id <value>` | The identifier of the issue to add a reminder for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-reminder`

### `linear api issue-remove-label`

Remove one label while keeping the issue’s other labels. — write (mutation issueRemoveLabel)

**Changes something in the service.**

```sh
linear api issue-remove-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to remove. |
| `--id <value>` | The identifier of the issue to remove the label from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-remove-label`

### `linear api issue-repository-suggestions`

Returns code repositories that are most likely to be relevant for implementing an issue. — read (query issueRepositorySuggestions)

```sh
linear api issue-repository-suggestions [options]
```

| Option | What it does |
|---|---|
| `--agent-session-id <value>` | Optional AgentSession ID associated with the issue for which the suggestions are being generated. |
| `--candidate-repositories <value>` | List of candidate repositories to restrict suggestions to. |
| `--issue-id <value>` | The ID of the issue to get repository suggestions for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-repository-suggestions`

### `linear api issues`

Lists issues you can access. Use filter to narrow the results by team, assignee, status, labels, project, or cycle, and cursor arguments to fetch subsequent pages. Archived issues are excluded unless includeArchived is true. — read (query issues)

```sh
linear api issues [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned issues. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned issues. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issues`

### `linear api issue-search`

[DEPRECATED] Search issues. This endpoint is deprecated and will be removed in the future – use `searchIssues` instead. — read (query issueSearch)

```sh
linear api issue-search [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned issues. |
| `--query <value>` | [Deprecated] Search string to look for. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issue-search`

### `linear api issue-share`

Shares an issue with a user who would not otherwise be able to access it. The viewer must have native access to the issue's full sub-issue tree and permission to share issues in the issue's team. Issues that inherit sharing from a parent issue cannot be shared directly. — write (mutation issueShare)

**Changes something in the service.**

```sh
linear api issue-share [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | The identifier of the user to share the issue with. |
| `--id <value>` | The identifier of the issue to share. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-share`

### `linear api issue-subscribe`

Subscribes a user to issue updates. Omit both userId and userEmail to subscribe yourself, or provide one of them to choose another workspace user. Subscribing an existing subscriber leaves the subscription in place. — write (mutation issueSubscribe)

**Changes something in the service.**

```sh
linear api issue-subscribe [options]
```

| Option | What it does |
|---|---|
| `--user-email <value>` | Email of an active workspace user to subscribe. Cannot be combined with userId. |
| `--user-id <value>` | UUID of the user to subscribe. Cannot be combined with userEmail. |
| `--id <value>` | The identifier of the issue to subscribe to. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-subscribe`

### `linear api issue-title-suggestion-from-customer-request`

Suggests an issue title based on a customer request message using AI summarization. — read (query issueTitleSuggestionFromCustomerRequest)

```sh
linear api issue-title-suggestion-from-customer-request [options]
```

| Option | What it does |
|---|---|
| `--request <value>` | The customer request message to generate an issue title from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-title-suggestion-from-customer-request`

### `linear api issue-to-release`

Get an active issue-to-release link by its UUID. — read (query issueToRelease)

```sh
linear api issue-to-release [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the issue-to-release association to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-to-release`

### `linear api issue-to-release-create`

Associates an issue with a release and returns the link. The issue must be editable and both resources accessible; release management must be available in the workspace. If the association already exists, the mutation returns an error rather than reusing it. — write (mutation issueToReleaseCreate)

**Changes something in the service.**

```sh
linear api issue-to-release-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the issueToRelease to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-to-release-create`

### `linear api issue-to-release-delete`

Removes an issue-to-release association by the link’s UUID, keeping the issue and release. The issue must be editable and the release accessible. Returns an error when the link does not exist. — destructive (mutation issueToReleaseDelete)

**Changes something in the service.**

```sh
linear api issue-to-release-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the issue-to-release association to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-to-release-delete`

### `linear api issue-to-release-delete-by-issue-and-release`

Removes the association between the specified issue and release, keeping both resources. The issue must be editable and the release accessible. Returns an error when the association does not exist. — write (mutation issueToReleaseDeleteByIssueAndRelease)

**Changes something in the service.**

```sh
linear api issue-to-release-delete-by-issue-and-release [options]
```

| Option | What it does |
|---|---|
| `--release-id <value>` | The identifier of the release. |
| `--issue-id <value>` | The identifier of the issue. Can be a UUID or issue identifier (e.g., 'LIN-123'). |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-to-release-delete-by-issue-and-release`

### `linear api issue-to-releases`

A paginated list of accessible issue-to-release links. — read (query issueToReleases)

```sh
linear api issue-to-releases [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api issue-to-releases`

### `linear api issue-unarchive`

Restores an archived issue and its sub-issues to normal issue lists. Automatic-archive markers are cleared, and a project association is removed if the project no longer includes the issue’s team. — write (mutation issueUnarchive)

**Changes something in the service.**

```sh
linear api issue-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the issue to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-unarchive`

### `linear api issue-unshare`

Stops sharing an issue with a user. The viewer must have native access to the issue's full sub-issue tree and permission to share issues in the issue's team. Issues that inherit sharing from a parent issue cannot be unshared directly. — write (mutation issueUnshare)

**Changes something in the service.**

```sh
linear api issue-unshare [options]
```

| Option | What it does |
|---|---|
| `--user-id <value>` | The identifier of the user to remove from the issue share. |
| `--id <value>` | The identifier of the issue to stop sharing. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-unshare`

### `linear api issue-unsubscribe`

Removes a user’s subscription to issue updates. Omit both userId and userEmail to unsubscribe yourself, or provide one of them to choose another workspace user. — write (mutation issueUnsubscribe)

**Changes something in the service.**

```sh
linear api issue-unsubscribe [options]
```

| Option | What it does |
|---|---|
| `--user-email <value>` | Email of an active workspace user to unsubscribe. Cannot be combined with userId. |
| `--user-id <value>` | UUID of the user to unsubscribe. Cannot be combined with userEmail. |
| `--id <value>` | The identifier of the issue to unsubscribe from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-unsubscribe`

### `linear api issue-update`

Updates an issue by UUID or human-readable identifier and returns its resulting values. Omitted fields keep their values; list inputs replace their existing lists unless an add/remove field is used. Changes can also trigger team workflow behavior, such as automatic cycle assignment. — write (mutation issueUpdate)

**Changes something in the service.**

```sh
linear api issue-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial issue object to update the issue with. |
| `--id <value>` | The identifier of the issue to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-update`

### `linear api issue-vcs-branch-search`

Find an accessible issue referenced by a version-control branch name. Null if no issue matches. — read (query issueVcsBranchSearch)

```sh
linear api issue-vcs-branch-search [options]
```

| Option | What it does |
|---|---|
| `--branch-name <value>` | The VCS branch name to search for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api issue-vcs-branch-search`

### `linear api jira-project`

Retrieves an accessible Jira project record by its Linear UUID, including an archived record. This ID is distinct from the project's Jira externalId or key. Read importStatus, syncStatus, and latestImport to track migration progress; a successful migration request can return before this work finishes. — read (query jiraProject)

```sh
linear api jira-project [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the Jira project to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api jira-project`

### `linear api jira-project-batch-migrate`

Imports or syncs up to 50 projects from one connected Jira site. When both are requested, sync starts after import. Projects are checked independently; retry failed projects only. Repeating an unchanged, running migration returns its existing records. Imports into one team run sequentially. Requires the `admin` scope, access to destination teams, and import permission when importing. — write (mutation jiraProjectBatchMigrate)

**Changes something in the service.**

```sh
linear api jira-project-batch-migrate [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The Jira projects to migrate. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api jira-project-batch-migrate`

### `linear api jira-projects`

Jira projects synced with teams the caller can administer, plus projects whose imports the caller can access. Supports filters and cursor-based pagination. — read (query jiraProjects)

```sh
linear api jira-projects [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned Jira projects. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api jira-projects`

### `linear api latest-release-by-access-key`

Returns the most recently completed or updated release for the pipeline associated with the access key. — read (query latestReleaseByAccessKey)

```sh
linear api latest-release-by-access-key
```

**Example:** `linear personal api latest-release-by-access-key`

### `linear api logout`

Signs out the current session and clears authentication cookies. If the token has no session ID, signs out all sessions for the account. — write (mutation logout)

**Changes something in the service.**

```sh
linear api logout [options]
```

| Option | What it does |
|---|---|
| `--reason <value>` | Optional reason recorded with the sign-out event. It does not change which sessions are revoked. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api logout`

### `linear api logout-all-sessions`

Signs out all sessions for the account, including the current session, and clears authentication cookies. — write (mutation logoutAllSessions)

**Changes something in the service.**

```sh
linear api logout-all-sessions [options]
```

| Option | What it does |
|---|---|
| `--reason <value>` | Optional reason recorded with the sign-out event. It does not change which sessions are revoked. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api logout-all-sessions`

### `linear api logout-other-sessions`

Signs out every other session for the authenticated account while keeping the current session active. — write (mutation logoutOtherSessions)

**Changes something in the service.**

```sh
linear api logout-other-sessions [options]
```

| Option | What it does |
|---|---|
| `--reason <value>` | Optional reason recorded with the sign-out event. It does not change which sessions are revoked. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api logout-other-sessions`

### `linear api logout-session`

Revokes one sign-in session belonging to the authenticated account. Use an ID returned by authenticationSessions; it may be the current session or another device's session. Requires session JWT authentication. — write (mutation logoutSession)

**Changes something in the service.**

```sh
linear api logout-session [options]
```

| Option | What it does |
|---|---|
| `--session-id <value>` | ID of the session to logout. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api logout-session`

### `linear api notification`

Returns one of the authenticated user’s notifications by UUID, including an archived notification. — read (query notification)

```sh
linear api notification [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the notification to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification`

### `linear api notification-archive`

Archives one of your notifications, removing it from the active inbox. Other notifications in the same group remain unchanged. Use notificationArchiveAll to archive the group. — destructive (mutation notificationArchive)

**Changes something in the service.**

```sh
linear api notification-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The id of the notification to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-archive`

### `linear api notification-archive-all`

Archives the authenticated user’s active notifications for the selected entity or notification group. — write (mutation notificationArchiveAll)

**Changes something in the service.**

```sh
linear api notification-archive-all [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The entity or notification group whose notifications to change. Supply exactly one identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-archive-all`

### `linear api notification-category-channel-subscription-update`

Subscribes to or unsubscribes from a specific notification category for a given notification channel. For example, subscribe to 'issueAssignment' notifications via the 'email' channel. — write (mutation notificationCategoryChannelSubscriptionUpdate)

**Changes something in the service.**

```sh
linear api notification-category-channel-subscription-update [options]
```

| Option | What it does |
|---|---|
| `--channel <value>` | The notification channel in which to subscribe to or unsubscribe from the category. |
| `--category <value>` | The notification category to subscribe to or unsubscribe from. |
| `--subscribe <value>` | True if the user wants to subscribe, false if the user wants to unsubscribe. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-category-channel-subscription-update`

### `linear api notification-mark-read-all`

Marks the authenticated user’s active notifications for the selected entity or notification group as read. — write (mutation notificationMarkReadAll)

**Changes something in the service.**

```sh
linear api notification-mark-read-all [options]
```

| Option | What it does |
|---|---|
| `--read-at <value>` | The time when notification was marked as read. |
| `--input <value>` | The entity or notification group whose notifications to change. Supply exactly one identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-mark-read-all`

### `linear api notification-mark-unread-all`

Marks the authenticated user’s active notifications for the selected entity or notification group as unread. — write (mutation notificationMarkUnreadAll)

**Changes something in the service.**

```sh
linear api notification-mark-unread-all [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The entity or notification group whose notifications to change. Supply exactly one identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-mark-unread-all`

### `linear api notifications`

Returns individual notifications received by the authenticated user, with optional filters. Related activity can produce several notifications; use inboxNotifications for the grouped inbox view. — read (query notifications)

```sh
linear api notifications [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filters returned notifications. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api notifications`

### `linear api notification-snooze-all`

Snoozes the authenticated user’s active notifications for the selected entity or notification group. — write (mutation notificationSnoozeAll)

**Changes something in the service.**

```sh
linear api notification-snooze-all [options]
```

| Option | What it does |
|---|---|
| `--snoozed-until-at <value>` | The time until a notification will be snoozed. After that it will appear in the inbox again. |
| `--input <value>` | The entity or notification group whose notifications to change. Supply exactly one identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-snooze-all`

### `linear api notification-subscription`

A specific notification subscription by ID. — read (query notificationSubscription)

```sh
linear api notification-subscription [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the notification subscription to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-subscription`

### `linear api notification-subscription-create`

Subscribes the authenticated user to one target and its requested notification types. Rejects an existing subscription to the same target and view. — write (mutation notificationSubscriptionCreate)

**Changes something in the service.**

```sh
linear api notification-subscription-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The subscription object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-subscription-create`

### `linear api notification-subscription-delete`

Deletes a notification subscription reference. — destructive (mutation notificationSubscriptionDelete)

**Changes something in the service.**

```sh
linear api notification-subscription-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the notification subscription reference to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-subscription-delete`

### `linear api notification-subscriptions`

The authenticated user's subscriptions to entity notifications. — read (query notificationSubscriptions)

```sh
linear api notification-subscriptions [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api notification-subscriptions`

### `linear api notification-subscription-update`

Updates a subscription owned by the authenticated user. Use active: false to pause it without deleting its configuration, or replace notificationSubscriptionTypes to change the events you follow. Subscriptions to read-only projects cannot be changed. — write (mutation notificationSubscriptionUpdate)

**Changes something in the service.**

```sh
linear api notification-subscription-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial notification subscription object to update the notification subscription with. |
| `--id <value>` | The identifier of the notification subscription to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-subscription-update`

### `linear api notification-unarchive`

Restores one of your archived notifications. Its read and snooze states are preserved, so a snoozed notification may still be absent from the visible inbox. — write (mutation notificationUnarchive)

**Changes something in the service.**

```sh
linear api notification-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The id of the notification to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-unarchive`

### `linear api notification-unsnooze-all`

Unsnoozes the authenticated user’s active notifications for the selected entity or notification group. — write (mutation notificationUnsnoozeAll)

**Changes something in the service.**

```sh
linear api notification-unsnooze-all [options]
```

| Option | What it does |
|---|---|
| `--unsnoozed-at <value>` | The time when the notification was unsnoozed. |
| `--input <value>` | The entity or notification group whose notifications to change. Supply exactly one identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-unsnooze-all`

### `linear api notification-update`

Updates one of the authenticated user’s notifications. Related notifications are unchanged. — write (mutation notificationUpdate)

**Changes something in the service.**

```sh
linear api notification-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial notification object to update the notification with. |
| `--id <value>` | The identifier of the notification to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api notification-update`

### `linear api oauth-application`

[ALPHA] A specific OAuth application created by the calling OAuth application through the public API. — read (query oauthApplication)

```sh
linear api oauth-application [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the OAuth application to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application`

### `linear api oauth-application-archive`

[ALPHA] Archives an OAuth application created by the calling OAuth application. — destructive (mutation oauthApplicationArchive)

**Changes something in the service.**

```sh
linear api oauth-application-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the OAuth application to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application-archive`

### `linear api oauth-application-coding-session-trusted-source`

Returns the authenticated OAuth application's trusted-source status for Coding Sessions in the workspace. Requires an OAuth access token with the `read` scope. — read (query oauthApplicationCodingSessionTrustedSource)

```sh
linear api oauth-application-coding-session-trusted-source
```

**Example:** `linear personal api oauth-application-coding-session-trusted-source`

### `linear api oauth-application-create`

[ALPHA] Creates an OAuth application private to the current workspace and managed by the calling OAuth application. The caller needs workspace API management permission. Save clientSecret and any webhookSecret from the first successful response. Retrying with the same idempotency key returns the existing unarchived application without updating it and with secrets omitted. Use the application’s id for later management operations and clientId for OAuth flows. — write (mutation oauthApplicationCreate)

**Changes something in the service.**

```sh
linear api oauth-application-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The OAuth application object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application-create`

### `linear api oauth-application-rotate-secret`

[ALPHA] Replaces the client secret for an application created by the caller and returns the new secret. Store it before discarding the response; it cannot be retrieved later. Tokens issued through client_credentials are revoked, while tokens from the authorization-code flow remain valid. The caller must be able to manage the application’s credentials, including its private-team access, as well as have workspace API management permission. — write (mutation oauthApplicationRotateSecret)

**Changes something in the service.**

```sh
linear api oauth-application-rotate-secret [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the OAuth application for which to rotate the secret. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application-rotate-secret`

### `linear api oauth-application-rotate-webhook-secret`

[ALPHA] Rotates the webhook signing secret for an OAuth application created by the calling OAuth application. — write (mutation oauthApplicationRotateWebhookSecret)

**Changes something in the service.**

```sh
linear api oauth-application-rotate-webhook-secret [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the OAuth application for which to rotate the webhook secret. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application-rotate-webhook-secret`

### `linear api oauth-applications`

[ALPHA] Lists unarchived applications created by the calling OAuth application in the current workspace. This is not a list of every application installed in the workspace. Requires OAuth authentication and workspace API management permission. — read (query oauthApplications)

```sh
linear api oauth-applications
```

**Example:** `linear personal api oauth-applications`

### `linear api oauth-application-update`

[ALPHA] Updates an unarchived application created by the calling OAuth application in this workspace. Omitted fields keep their current values. Enabling client_credentials or changing the webhook destination requires access to every private team available to the app, or workspace owner permission; an app with access to all private teams requires an owner. Workspace API management permission is required for every update. — write (mutation oauthApplicationUpdate)

**Changes something in the service.**

```sh
linear api oauth-application-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial OAuth application object to update. |
| `--id <value>` | The identifier of the OAuth application to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api oauth-application-update`

### `linear api organization`

Returns the workspace associated with the credentials used for this request. Its ID and URL key identify the workspace, and its fields expose shared settings and resources. — read (query organization)

```sh
linear api organization
```

**Example:** `linear personal api organization`

### `linear api organization-cancel-delete`

Cancels a scheduled workspace deletion while the deletion process still permits cancellation. Requires workspace-settings permission. — destructive (mutation organizationCancelDelete)

**Changes something in the service.**

```sh
linear api organization-cancel-delete
```

**Example:** `linear personal api organization-cancel-delete`

### `linear api organization-delete`

Schedules deletion of the workspace and its data after validating the code from organizationDeleteChallenge. This does not finish the deletion during the request. Use organizationCancelDelete while cancellation is still available. — destructive (mutation organizationDelete)

**Changes something in the service.**

```sh
linear api organization-delete [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Information required to delete the workspace. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-delete`

### `linear api organization-delete-challenge`

Requests a deletion confirmation code for the workspace. The code is sent to the requesting user's email and must be used with the organizationDelete mutation to confirm deletion. — write (mutation organizationDeleteChallenge)

**Changes something in the service.**

```sh
linear api organization-delete-challenge
```

**Example:** `linear personal api organization-delete-challenge`

### `linear api organization-domain-delete`

Removes a domain configuration from the workspace and its authentication settings. Requires workspace-settings permission. Other domain configurations for the workspace are unchanged. — destructive (mutation organizationDomainDelete)

**Changes something in the service.**

```sh
linear api organization-domain-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the domain to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-domain-delete`

### `linear api organization-exists`

Checks whether a workspace with the given URL key exists. — read (query organizationExists)

```sh
linear api organization-exists [options]
```

| Option | What it does |
|---|---|
| `--url-key <value>` | The URL key of the workspace to check. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-exists`

### `linear api organization-invite`

Fetches a specific workspace invite by its ID. — read (query organizationInvite)

```sh
linear api organization-invite [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the invite to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-invite`

### `linear api organization-invite-create`

Invites an email address to the workspace and sends an invitation email. Your role and workspace invitation settings must allow the requested role and teams. Guest invitations require teams; an existing user or unexpired invitation for the address causes an error. — write (mutation organizationInviteCreate)

**Changes something in the service.**

```sh
linear api organization-invite-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The organization invite object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-invite-create`

### `linear api organization-invite-delete`

Deletes (archives) a workspace invite, preventing it from being accepted. — destructive (mutation organizationInviteDelete)

**Changes something in the service.**

```sh
linear api organization-invite-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the organization invite to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-invite-delete`

### `linear api organization-invite-details`

Fetches public details of a specific workspace invite by its ID. This query does not require authentication and is used for invite acceptance flows. — read (query organizationInviteDetails)

```sh
linear api organization-invite-details [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the invite to retrieve details for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-invite-details`

### `linear api organization-invites`

All pending and accepted invites for the workspace. — read (query organizationInvites)

```sh
linear api organization-invites [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api organization-invites`

### `linear api organization-invite-update`

Replaces the teams an invitee will join on acceptance. Requires permission to manage invitations, and the selected teams must be valid for the invite’s role. This does not change the invitee’s email or role. — write (mutation organizationInviteUpdate)

**Changes something in the service.**

```sh
linear api organization-invite-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The updates to make to the organization invite object. |
| `--id <value>` | The identifier of the organization invite to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-invite-update`

### `linear api organization-start-trial`

[DEPRECATED] Starts a trial for the workspace. — write (mutation organizationStartTrial)

**Changes something in the service.**

```sh
linear api organization-start-trial
```

**Example:** `linear personal api organization-start-trial`

### `linear api organization-start-trial-for-plan`

Starts a trial for the workspace on the specified plan type. The workspace must not already be on a paid plan or in an active trial. — write (mutation organizationStartTrialForPlan)

**Changes something in the service.**

```sh
linear api organization-start-trial-for-plan [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Plan details for trial. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-start-trial-for-plan`

### `linear api organization-update`

Updates the workspace associated with your credentials. Omitted fields keep their current values. Most changes require workspace-settings permission; project and initiative reminder schedules require schedule-management permission. Some settings also depend on the workspace’s plan. — write (mutation organizationUpdate)

**Changes something in the service.**

```sh
linear api organization-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial workspace object to update the workspace with. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api organization-update`

### `linear api project`

Returns a project you can access by UUID, URL slug, or human-readable project identifier. Archived projects can also be retrieved. — read (query project)

```sh
linear api project [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The project UUID, slug ID, or human-readable identifier. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project`

### `linear api project-add-label`

Adds a project label while keeping the project’s other labels. The label must be available to the project; label-group and team-scoping rules still apply. — write (mutation projectAddLabel)

**Changes something in the service.**

```sh
linear api project-add-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to add. |
| `--id <value>` | The identifier of the project to add the label to. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-add-label`

### `linear api project-archive`

Archives a project. — destructive (mutation projectArchive)

**Changes something in the service.**

```sh
linear api project-archive [options]
```

| Option | What it does |
|---|---|
| `--trash <value>` | Whether to trash the project. |
| `--id <value>` | The identifier of the project to archive. Also the identifier from the URL is accepted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-archive`

### `linear api project-create`

Creates a project in the supplied teams. You can apply a project template to fill in defaults and create its milestones, initial issues, and initiative associations. The new project must have at least one accessible team. — write (mutation projectCreate)

**Changes something in the service.**

```sh
linear api project-create [options]
```

| Option | What it does |
|---|---|
| `--ai-conversation-id <value>` | [Internal] The identifier of the project draft conversation to attach to this project. |
| `--project-draft-id <value>` | [Internal] The identifier of the project draft that produced this project. |
| `--slack-channel-name <value>` | The full name for the Slack channel to create (including prefix). When provided, a Slack channel will be created and connected to the project. |
| `--input <value>` | The project properties to set on the new project. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-create`

### `linear api project-delete`

Moves a project to the trash. This archives the project rather than immediately deleting it permanently. You can restore it with projectUnarchive while it remains available in the trash. — destructive (mutation projectDelete)

**Changes something in the service.**

```sh
linear api project-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-delete`

### `linear api project-external-sync-disable`

Disables external sync on a project. — write (mutation projectExternalSyncDisable)

**Changes something in the service.**

```sh
linear api project-external-sync-disable [options]
```

| Option | What it does |
|---|---|
| `--sync-source <value>` | The source of the external sync to disable. |
| `--project-id <value>` | The ID of the project to disable external sync for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-external-sync-disable`

### `linear api project-filter-suggestion`

Suggests filters for a project view based on a text prompt. — read (query projectFilterSuggestion)

```sh
linear api project-filter-suggestion [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | [Internal] The ID of the team if filtering a team view. |
| `--prompt <value>` | Text describing the projects to match. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-filter-suggestion`

### `linear api project-label`

Returns a single project label by its identifier. — read (query projectLabel)

```sh
linear api project-label [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the project label. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label`

### `linear api project-label-create`

Creates a label or label group for projects. Workspace labels require workspace label-management permission; team labels require label-management permission in that team and a plan that supports team project labels. replaceTeamLabels can migrate matching labels into the new scope. — write (mutation projectLabelCreate)

**Changes something in the service.**

```sh
linear api project-label-create [options]
```

| Option | What it does |
|---|---|
| `--replace-team-labels <value>` | Whether to replace all team-specific labels with the same name with this newly created workspace label (default: false). |
| `--input <value>` | The project label to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label-create`

### `linear api project-label-delete`

Deletes a project label, its children, and inherited copies, removing their assignments from projects. — destructive (mutation projectLabelDelete)

**Changes something in the service.**

```sh
linear api project-label-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label-delete`

### `linear api project-label-restore`

Restores a previously retired project label, making it available for use on new projects. — write (mutation projectLabelRestore)

**Changes something in the service.**

```sh
linear api project-label-restore [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to restore. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label-restore`

### `linear api project-label-retire`

Retires a project label. Retired labels remain on existing projects but cannot be applied to new ones. — write (mutation projectLabelRetire)

**Changes something in the service.**

```sh
linear api project-label-retire [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the label to retire. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label-retire`

### `linear api project-labels`

All project labels. Returns a paginated list of labels visible to the authenticated user, including both workspace-level and team-scoped labels, with optional filtering. — read (query projectLabels)

```sh
linear api project-labels [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned project labels. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api project-labels`

### `linear api project-label-update`

Updates the supplied project-label fields and propagates changes to inherited copies. Requires label-management permission for the label’s workspace or team. Update the source label rather than an inherited copy. — write (mutation projectLabelUpdate)

**Changes something in the service.**

```sh
linear api project-label-update [options]
```

| Option | What it does |
|---|---|
| `--replace-team-labels <value>` | Whether to replace all team-specific labels with the same name with this updated workspace label (default: false). |
| `--input <value>` | A partial label object to update. |
| `--id <value>` | The identifier of the label to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-label-update`

### `linear api project-milestone`

Fetches a milestone by UUID, including archived milestones. — read (query projectMilestone)

```sh
linear api project-milestone [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the milestone. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-milestone`

### `linear api project-milestone-create`

Creates a milestone in a project you can edit. Its name must be unique among the project’s active milestones. A milestone starts without issues; assign issues to it separately. — write (mutation projectMilestoneCreate)

**Changes something in the service.**

```sh
linear api project-milestone-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The project milestone to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-milestone-create`

### `linear api project-milestone-delete`

Permanently deletes a milestone from a project you can edit. The issues are kept in the project, but their milestone association is removed. — destructive (mutation projectMilestoneDelete)

**Changes something in the service.**

```sh
linear api project-milestone-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project milestone to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-milestone-delete`

### `linear api project-milestone-move`

Moves a milestone and its issues to another project, including archived issues. The caller must have access to every issue in the milestone, and the milestone and destination project must be writable. If an issue's team is not part of the destination project, provide newIssueTeamId or addIssueTeamToProject. The returned team snapshots can be passed to the undo inputs when moving the milestone back to its original project. — write (mutation projectMilestoneMove)

**Changes something in the service.**

```sh
linear api project-milestone-move [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The project to move the milestone to, as well as any additional options need to make a successful move, or undo a previous move. |
| `--id <value>` | The identifier of the project milestone to move. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-milestone-move`

### `linear api project-milestones`

Returns all project milestones in the workspace, with optional filtering. — read (query projectMilestones)

```sh
linear api project-milestones [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned project milestones. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api project-milestones`

### `linear api project-milestone-update`

Updates a milestone in a project you can edit, including an archived milestone. Omitted fields keep their current values. Changing projectId moves the milestone and clears its links from issue drafts in the previous project. — write (mutation projectMilestoneUpdate)

**Changes something in the service.**

```sh
linear api project-milestone-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial object to update the project milestone with. |
| `--id <value>` | The identifier of the project milestone to update. Also the identifier from the URL is accepted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-milestone-update`

### `linear api project-relation`

Returns a single project relation by its identifier. — read (query projectRelation)

```sh
linear api project-relation [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the project relation. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-relation`

### `linear api project-relation-create`

Creates a dependency between two different projects using date or milestone anchors. — write (mutation projectRelationCreate)

**Changes something in the service.**

```sh
linear api project-relation-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The project relation to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-relation-create`

### `linear api project-relation-delete`

Deletes the dependency without deleting either project or milestone. — destructive (mutation projectRelationDelete)

**Changes something in the service.**

```sh
linear api project-relation-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project relation to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-relation-delete`

### `linear api project-relations`

Returns all project dependency relations in the workspace. — read (query projectRelations)

```sh
linear api project-relations [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api project-relations`

### `linear api project-relation-update`

Updates the supplied dependency fields and validates both project endpoints. — write (mutation projectRelationUpdate)

**Changes something in the service.**

```sh
linear api project-relation-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the project relation to update. |
| `--id <value>` | The identifier of the project relation to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-relation-update`

### `linear api project-remove-label`

Removes a project label while keeping the project’s other labels. The label itself is not deleted. — write (mutation projectRemoveLabel)

**Changes something in the service.**

```sh
linear api project-remove-label [options]
```

| Option | What it does |
|---|---|
| `--label-id <value>` | The identifier of the label to remove. |
| `--id <value>` | The identifier of the project to remove the label from. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-remove-label`

### `linear api projects`

Returns projects visible to you in the workspace. Use filter to narrow the results and the connection arguments to page or sort them. — read (query projects)

```sh
linear api projects [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned projects. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned projects. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api projects`

### `linear api project-status`

Returns a single project status by its identifier. — read (query projectStatus)

```sh
linear api project-status [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the project status. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-status`

### `linear api project-status-archive`

Archives a project status. The status must not have any active projects assigned to it and must not be the last status of its type. — destructive (mutation projectStatusArchive)

**Changes something in the service.**

```sh
linear api project-status-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project status to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-status-archive`

### `linear api project-status-create`

Creates a new project status. — write (mutation projectStatusCreate)

**Changes something in the service.**

```sh
linear api project-status-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The ProjectStatus object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-status-create`

### `linear api project-statuses`

Returns all project statuses in the workspace. — read (query projectStatuses)

```sh
linear api project-statuses [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api project-statuses`

### `linear api project-status-unarchive`

Unarchives a project status. — write (mutation projectStatusUnarchive)

**Changes something in the service.**

```sh
linear api project-status-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project status to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-status-unarchive`

### `linear api project-status-update`

Updates a project status. — write (mutation projectStatusUpdate)

**Changes something in the service.**

```sh
linear api project-status-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial ProjectStatus object to update the ProjectStatus with. |
| `--id <value>` | The identifier of the project status to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-status-update`

### `linear api project-unarchive`

Restores an archived or trashed project. The operation checks the project quota of each associated team before restoring it. — write (mutation projectUnarchive)

**Changes something in the service.**

```sh
linear api project-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project to restore. Also the identifier from the URL is accepted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-unarchive`

### `linear api project-update`

Updates the supplied fields of a project you can edit. Omitted fields keep their current values. List inputs such as memberIds and labelIds replace the corresponding lists; see each input for clearing rules and team-access behavior. — write (mutation projectUpdate)

**Changes something in the service.**

```sh
linear api project-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial project object to update the project with. |
| `--id <value>` | The identifier of the project to update. Also the identifier from the URL is accepted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update`

### `linear api project-update-archive`

Archives an update and recalculates the project’s health from the remaining updates. You must be the author or have permission to manage workspace entities. Use projectUpdateUnarchive to restore it. — destructive (mutation projectUpdateArchive)

**Changes something in the service.**

```sh
linear api project-update-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project update to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update-archive`

### `linear api project-update-create`

Publishes a status update for a project you can edit. The update records the current user as author, captures project progress, and refreshes the project’s health. Provide the message in input.body. — write (mutation projectUpdateCreate)

**Changes something in the service.**

```sh
linear api project-update-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Data for the project update to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update-create`

### `linear api project-update-delete`

Archives a project update and recalculates project health. Use projectUpdateUnarchive to restore it. — destructive (mutation projectUpdateDelete)

**Changes something in the service.**

```sh
linear api project-update-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project update to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update-delete`

### `linear api project-updates`

Returns all project status updates in the workspace, with optional filtering. — read (query projectUpdates)

```sh
linear api project-updates [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned project updates. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api project-updates`

### `linear api project-update-unarchive`

Restores an archived update and recalculates the project’s health. The update must currently be archived, and you must be its author or have permission to manage workspace entities. — write (mutation projectUpdateUnarchive)

**Changes something in the service.**

```sh
linear api project-update-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the project update to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update-unarchive`

### `linear api project-update-update`

Edits an update’s message or health. You must be its author or have permission to manage workspace entities. Editing the latest update while it is less than one hour old also refreshes its progress snapshot. — write (mutation projectUpdateUpdate)

**Changes something in the service.**

```sh
linear api project-update-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the project update to update. |
| `--id <value>` | The identifier of the project update to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api project-update-update`

### `linear api push-subscription-create`

Registers a browser or device to receive push notifications for the authenticated user. If the same subscription data is already registered, returns that record; otherwise replaces the subscription associated with the current sign-in session. userId in the input is ignored. Successful registration does not guarantee notification delivery; use pushSubscriptionTest to request a test notification. — write (mutation pushSubscriptionCreate)

**Changes something in the service.**

```sh
linear api push-subscription-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The push subscription to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api push-subscription-create`

### `linear api push-subscription-delete`

Deletes a push subscription to stop sending notifications through it. Select success to confirm deletion. This operation does not populate entity, so selecting that field produces a GraphQL error. — destructive (mutation pushSubscriptionDelete)

**Changes something in the service.**

```sh
linear api push-subscription-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the push subscription to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api push-subscription-delete`

### `linear api push-subscription-test`

Queues a test notification for the authenticated user. Limited to three requests per minute; success confirms scheduling, not delivery. — read (query pushSubscriptionTest)

```sh
linear api push-subscription-test [options]
```

| Option | What it does |
|---|---|
| `--target-mobile <value>` | Whether to target mobile devices. Defaults to false, which targets desktop notifications. |
| `--send-strategy <value>` | Use push for push subscribers, desktop for connected desktop clients, desktopAndPush for both, or desktopThenPush to prefer connected desktop clients. Defaults to push. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api push-subscription-test`

### `linear api quotas`

Public resource quotas for the authenticated workspace. These are not subscription limits. — read (query quotas)

```sh
linear api quotas [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Limits the returned quotas by key or scope. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api quotas`

### `linear api rate-limit-status`

Returns the quota state recorded for this GraphQL request, including both request count and query complexity. This query also consumes quota. Use remainingAmount with period and allowedAmount to pace requests: quota refills gradually, and reset is not a single instant when an exhausted fixed window is cleared. Other requests made with the same limited identity can consume the remaining quota. — read (query rateLimitStatus)

```sh
linear api rate-limit-status
```

**Example:** `linear personal api rate-limit-status`

### `linear api reaction-create`

Adds an emoji reaction as you to one issue, comment, or update. If you already used that emoji on the same resource, the existing reaction is returned. You must be allowed to comment on the target. — write (mutation reactionCreate)

**Changes something in the service.**

```sh
linear api reaction-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The reaction object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api reaction-create`

### `linear api reaction-delete`

Removes a reaction by its UUID and updates the target’s reaction summary. You must be its creator or have workspace permission to manage entities, and you must be allowed to comment on the target. — destructive (mutation reactionDelete)

**Changes something in the service.**

```sh
linear api reaction-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the reaction to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api reaction-delete`

### `linear api recent-releases-by-access-key`

Returns releases for the pipeline associated with the access key, ordered with the most recently completed or updated first. — read (query recentReleasesByAccessKey)

```sh
linear api recent-releases-by-access-key [options]
```

| Option | What it does |
|---|---|
| `--after <value>` | Returns releases after this release in the same order. Pass the ID of the last release from the previous page, and keep `includeArchived` unchanged between pages. A started release moves up when it is updated, so it can be skipped or repeated while you page. |
| `--include-archived <value>` | Includes archived releases alongside active ones. Defaults to false. Completed releases are archived automatically six months after completion when they have no unarchived issues. Deleted releases and releases of archived pipelines are never returned. |
| `--limit <value>` | Maximum number of releases to return. Defaults to 20 and is capped at 100. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api recent-releases-by-access-key`

### `linear api refresh-google-sheets-data`

Queues a Google Sheets export refresh. Success confirms scheduling; the returned integration may still contain the previous export state. — write (mutation refreshGoogleSheetsData)

**Changes something in the service.**

```sh
linear api refresh-google-sheets-data [options]
```

| Option | What it does |
|---|---|
| `--type <value>` | Export type: issue, project, or initiative. Defaults to issue. |
| `--id <value>` | The identifier of the Google Sheets integration to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api refresh-google-sheets-data`

### `linear api release`

Fetch a single release by its UUID or slug identifier. — read (query release)

```sh
linear api release [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The release UUID or slug ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release`

### `linear api release-archive`

Archives a release. — destructive (mutation releaseArchive)

**Changes something in the service.**

```sh
linear api release-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-archive`

### `linear api release-complete`

Completes the release identified by pipeline and version, or the latest started release when version is omitted. Completing a scheduled release may move its open issues to the next release, according to the pipeline’s rollover setting. — write (mutation releaseComplete)

**Changes something in the service.**

```sh
linear api release-complete [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The input containing the pipeline ID and optional version. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-complete`

### `linear api release-complete-by-access-key`

Marks a release as completed using an access key. If version is provided, completes that specific release; otherwise completes the most recent started release. The pipeline is inferred from the access key. — write (mutation releaseCompleteByAccessKey)

**Changes something in the service.**

```sh
linear api release-complete-by-access-key [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The input containing the optional version. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-complete-by-access-key`

### `linear api release-create`

Creates a new release in a pipeline. If no stage is specified, defaults to the first completed stage for continuous pipelines or the first started stage for scheduled pipelines. — write (mutation releaseCreate)

**Changes something in the service.**

```sh
linear api release-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The release to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-create`

### `linear api release-delete`

Moves a release to trash for permanent deletion after the retention period. Use releaseUnarchive to restore it before deletion. — destructive (mutation releaseDelete)

**Changes something in the service.**

```sh
linear api release-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-delete`

### `linear api release-note`

Fetch a release note by its UUID or slug identifier. — read (query releaseNote)

```sh
linear api release-note [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The release note UUID or slug ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-note`

### `linear api release-note-create`

Creates a note covering releases from one pipeline. Supply explicit release IDs or an inclusive range, plus an optional title and Markdown body. A scheduled pipeline’s note must cover exactly one release. — write (mutation releaseNoteCreate)

**Changes something in the service.**

```sh
linear api release-note-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The release note fields. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-note-create`

### `linear api release-note-delete`

Permanently deletes a release note and its body. The covered releases remain. — destructive (mutation releaseNoteDelete)

**Changes something in the service.**

```sh
linear api release-note-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release note to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-note-delete`

### `linear api release-notes`

Release notes in the workspace. — read (query releaseNotes)

```sh
linear api release-notes [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned release notes. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api release-notes`

### `linear api release-note-update`

Updates a release note’s title, body, or covered releases. Omitted fields remain unchanged, and a new release selection replaces the old one. The note stays in its original pipeline. — write (mutation releaseNoteUpdate)

**Changes something in the service.**

```sh
linear api release-note-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The fields to update. |
| `--id <value>` | The identifier of the release note to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-note-update`

### `linear api release-pipeline`

Fetch a single release pipeline by its UUID or slug identifier. — read (query releasePipeline)

```sh
linear api release-pipeline [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The release pipeline UUID or slug ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline`

### `linear api release-pipeline-archive`

Archives a pipeline and schedules archival of its releases. The release changes run in the background, so they may not be complete when this mutation returns. Requires workspace team-management permission or ownership of every associated team. — destructive (mutation releasePipelineArchive)

**Changes something in the service.**

```sh
linear api release-pipeline-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release pipeline to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline-archive`

### `linear api release-pipeline-by-access-key`

Returns the release pipeline associated with the access key. — read (query releasePipelineByAccessKey)

```sh
linear api release-pipeline-by-access-key
```

**Example:** `linear personal api release-pipeline-by-access-key`

### `linear api release-pipeline-create`

Creates a release pipeline with default stages, subject to your workspace’s plan and quota. Requires workspace team-management permission or ownership of every team associated with the pipeline. — write (mutation releasePipelineCreate)

**Changes something in the service.**

```sh
linear api release-pipeline-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The ReleasePipeline object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline-create`

### `linear api release-pipeline-delete`

Moves a pipeline and its releases to the trash for permanent deletion after the retention period. Repeating the operation does not extend that period. Requires workspace team-management permission or ownership of every associated team. — destructive (mutation releasePipelineDelete)

**Changes something in the service.**

```sh
linear api release-pipeline-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release pipeline to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline-delete`

### `linear api release-pipelines`

All release pipelines in the workspace, with optional filtering and sorting. — read (query releasePipelines)

```sh
linear api release-pipelines [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned release pipelines. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned release pipelines. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api release-pipelines`

### `linear api release-pipeline-unarchive`

Restores a pipeline and schedules restoration of its archived releases. Individually trashed releases are left in the trash. The release changes run in the background, and the same pipeline administration permissions apply. — write (mutation releasePipelineUnarchive)

**Changes something in the service.**

```sh
linear api release-pipeline-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release pipeline to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline-unarchive`

### `linear api release-pipeline-update`

Updates an existing release pipeline. Supports updating name, slug, type, production flag, path patterns, and team associations. Private teams that the current user cannot access are preserved in the team list. — write (mutation releasePipelineUpdate)

**Changes something in the service.**

```sh
linear api release-pipeline-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial ReleasePipeline object to update the ReleasePipeline with. |
| `--id <value>` | The identifier of the release pipeline to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-pipeline-update`

### `linear api releases`

All releases in the workspace, with optional filtering and sorting. — read (query releases)

```sh
linear api releases [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned releases. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned releases. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api releases`

### `linear api release-search`

Search releases with optional text matching against name, version, and pipeline name. When no search term is provided, returns releases ordered by stage priority (started > planned > completed > canceled). — read (query releaseSearch)

```sh
linear api release-search [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter to apply to the release results. |
| `--first <value>` | Maximum results. Capped at 50. |
| `--term <value>` | Search term to match against release name, version, and pipeline name. When omitted, returns releases ordered by stage priority. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-search`

### `linear api release-stage`

Fetch a single release stage by its UUID. — read (query releaseStage)

```sh
linear api release-stage [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the release stage. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-stage`

### `linear api release-stage-archive`

Archives a release stage. Only started-type stages can be archived, and only if they have no active releases and at least one other stage of the same type remains. Cannot archive the last non-frozen started stage. — destructive (mutation releaseStageArchive)

**Changes something in the service.**

```sh
linear api release-stage-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release stage to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-stage-archive`

### `linear api release-stage-create`

Creates a new release stage in a pipeline. Non-started stages must use default names and colors and are unique by type; creating a canonical duplicate returns the existing stage. Started stages can optionally be frozen, but at least one non-frozen started stage must remain. — write (mutation releaseStageCreate)

**Changes something in the service.**

```sh
linear api release-stage-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The ReleaseStage object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-stage-create`

### `linear api release-stages`

All release stages in the workspace, with optional filtering. — read (query releaseStages)

```sh
linear api release-stages [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned release stages. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api release-stages`

### `linear api release-stage-unarchive`

Unarchives a release stage. — write (mutation releaseStageUnarchive)

**Changes something in the service.**

```sh
linear api release-stage-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release stage to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-stage-unarchive`

### `linear api release-stage-update`

Updates an existing release stage. Only started-type stages can be edited. Supports updating name, color, position, and frozen status. — write (mutation releaseStageUpdate)

**Changes something in the service.**

```sh
linear api release-stage-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial ReleaseStage object to update the ReleaseStage with. |
| `--id <value>` | The identifier of the release stage to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-stage-update`

### `linear api release-sync`

Associates issues found in issue or pull request references with a release. Continuous pipelines create completed releases and reuse an existing version only when its commit SHA matches. Scheduled pipelines accumulate issues in an open release or use the supplied version. Existing issue associations are kept unless explicitly reverted in a scheduled pipeline. — write (mutation releaseSync)

**Changes something in the service.**

```sh
linear api release-sync [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The release data to sync. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-sync`

### `linear api release-sync-by-access-key`

Syncs release data using an access key for CI/CD integration. The pipeline is automatically inferred from the access key's configured resources, so no pipeline ID is needed in the input. — write (mutation releaseSyncByAccessKey)

**Changes something in the service.**

```sh
linear api release-sync-by-access-key [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The release data to sync. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-sync-by-access-key`

### `linear api release-unarchive`

Restores an archived or trashed release before it is permanently deleted. The release keeps its pipeline and saved issue associations. — write (mutation releaseUnarchive)

**Changes something in the service.**

```sh
linear api release-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the release to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-unarchive`

### `linear api release-update`

Updates a release by ID. Omitted fields remain unchanged. A release cannot move to another pipeline. — write (mutation releaseUpdate)

**Changes something in the service.**

```sh
linear api release-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial Release object to update the Release with. |
| `--id <value>` | The identifier of the release to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-update`

### `linear api release-update-by-pipeline`

Updates a release by pipeline identifier. Finds the release by version, otherwise the latest started release or else the planned release with the earliest target date, and optionally transitions it to a new stage by name. — write (mutation releaseUpdateByPipeline)

**Changes something in the service.**

```sh
linear api release-update-by-pipeline [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The input containing the pipeline ID, optional version, and optional stage name. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-update-by-pipeline`

### `linear api release-update-by-pipeline-by-access-key`

Updates a release by pipeline using an access key. — write (mutation releaseUpdateByPipelineByAccessKey)

**Changes something in the service.**

```sh
linear api release-update-by-pipeline-by-access-key [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The input containing the optional version and optional stage name. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api release-update-by-pipeline-by-access-key`

### `linear api resend-organization-invite`

Re-sends a workspace invitation email for the specified invite ID. — write (mutation resendOrganizationInvite)

**Changes something in the service.**

```sh
linear api resend-organization-invite [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the organization invite to re-send. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api resend-organization-invite`

### `linear api resend-organization-invite-by-email`

Re-sends a workspace invitation email to the specified email address, if an outstanding invite exists for that address. — write (mutation resendOrganizationInviteByEmail)

**Changes something in the service.**

```sh
linear api resend-organization-invite-by-email [options]
```

| Option | What it does |
|---|---|
| `--email <value>` | The email address tied to the organization invite to re-send. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api resend-organization-invite-by-email`

### `linear api roadmap`

[Deprecated] Returns a single roadmap by its identifier. Use initiatives instead. — read (query roadmap)

```sh
linear api roadmap [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The roadmap UUID or slug ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap`

### `linear api roadmap-archive`

No longer supported and returns an error. Use initiativeArchive. — destructive (mutation roadmapArchive)

**Changes something in the service.**

```sh
linear api roadmap-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the roadmap to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-archive`

### `linear api roadmap-create`

No longer supported and returns an error. Use initiativeCreate. — write (mutation roadmapCreate)

**Changes something in the service.**

```sh
linear api roadmap-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the roadmap to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-create`

### `linear api roadmap-delete`

No longer supported and returns an error. Use initiativeDelete. — destructive (mutation roadmapDelete)

**Changes something in the service.**

```sh
linear api roadmap-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the roadmap to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-delete`

### `linear api roadmaps`

Deprecated. Always returns an empty connection. Use initiatives. — read (query roadmaps)

```sh
linear api roadmaps [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api roadmaps`

### `linear api roadmap-to-project`

No longer supported and returns an error. Use initiativeToProject. — read (query roadmapToProject)

```sh
linear api roadmap-to-project [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The UUID of the legacy roadmap-to-project link. This query is no longer supported. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-to-project`

### `linear api roadmap-to-project-create`

No longer supported and returns an error. Use initiativeToProjectCreate. — write (mutation roadmapToProjectCreate)

**Changes something in the service.**

```sh
linear api roadmap-to-project-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the roadmapToProject to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-to-project-create`

### `linear api roadmap-to-project-delete`

No longer supported and returns an error. Use initiativeToProjectDelete. — destructive (mutation roadmapToProjectDelete)

**Changes something in the service.**

```sh
linear api roadmap-to-project-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the roadmapToProject to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-to-project-delete`

### `linear api roadmap-to-projects`

Deprecated. Always returns an empty connection. Use initiativeToProjects. — read (query roadmapToProjects)

```sh
linear api roadmap-to-projects [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api roadmap-to-projects`

### `linear api roadmap-to-project-update`

No longer supported and returns an error. Use initiativeToProjectUpdate. — write (mutation roadmapToProjectUpdate)

**Changes something in the service.**

```sh
linear api roadmap-to-project-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the roadmapToProject to update. |
| `--id <value>` | The identifier of the roadmapToProject to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-to-project-update`

### `linear api roadmap-unarchive`

No longer supported and returns an error. Use initiativeUnarchive. — write (mutation roadmapUnarchive)

**Changes something in the service.**

```sh
linear api roadmap-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the roadmap to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-unarchive`

### `linear api roadmap-update`

No longer supported and returns an error. Use initiativeUpdate. — write (mutation roadmapUpdate)

**Changes something in the service.**

```sh
linear api roadmap-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the roadmap to update. |
| `--id <value>` | The identifier of the roadmap to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api roadmap-update`

### `linear api saml-token-user-account-auth`

Completes SAML sign-in with the email and token issued by the SAML flow, then sets the authentication cookie. The response identifies workspace memberships and any workspaces that require a different sign-in method. Unlike email token sign-in, this operation does not require clientAuthCode. — write (mutation samlTokenUserAccountAuth)

**Changes something in the service.**

```sh
linear api saml-token-user-account-auth [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The data used for token authentication. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api saml-token-user-account-auth`

### `linear api search-documents`

Searches accessible documents using text matching and meaning. Use teamId to narrow the search, and includeArchived to include archived documents. Results are ordered by relevance unless orderBy is supplied and use cursor pagination. Limited to 30 requests per minute. — read (query searchDocuments)

```sh
linear api search-documents [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned documents. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--term <value>` | The text to search for, from 1 to 1024 characters. You can use keywords or a natural-language description; search combines text matching with relevance by meaning. |
| `--include-comments <value>` | Include comment text when searching issues. Defaults to false; ignored for project and document searches. |
| `--team-id <value>` | UUID of a team to restrict results to. Omit or pass null to search all accessible teams. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api search-documents`

### `linear api search-issues`

Searches accessible issues using text matching and meaning. Results are ordered by relevance unless orderBy is supplied; use includeComments to search discussion text too. The issue filter narrows the retrieved candidates, so totalCount is not the final filtered count. Limited to 30 requests per minute. — read (query searchIssues)

```sh
linear api search-issues [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned issues. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--term <value>` | The text to search for, from 1 to 1024 characters. You can use keywords or a natural-language description; search combines text matching with relevance by meaning. |
| `--include-comments <value>` | Include comment text when searching issues. Defaults to false; ignored for project and document searches. |
| `--team-id <value>` | UUID of a team to restrict results to. Omit or pass null to search all accessible teams. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api search-issues`

### `linear api search-projects`

Searches accessible projects using text matching and meaning. Use teamId to narrow the search, and includeArchived to include archived projects. Results are ordered by relevance unless orderBy is supplied and use cursor pagination. Limited to 30 requests per minute. — read (query searchProjects)

```sh
linear api search-projects [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--term <value>` | The text to search for, from 1 to 1024 characters. You can use keywords or a natural-language description; search combines text matching with relevance by meaning. |
| `--include-comments <value>` | Include comment text when searching issues. Defaults to false; ignored for project and document searches. |
| `--team-id <value>` | UUID of a team to restrict results to. Omit or pass null to search all accessible teams. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api search-projects`

### `linear api semantic-search`

Searches accessible issues, projects, initiatives, and documents together using a natural-language query. Use types to choose resource types and filters to narrow each type separately. Returns ranked results without cursor pagination; maxResults controls the requested count, with extra exact matches or original issues possible. Limited to 30 requests per minute. — read (query semanticSearch)

```sh
linear api semantic-search [options]
```

| Option | What it does |
|---|---|
| `--query <value>` | A search phrase or natural-language description of what you are looking for, from 1 to 1024 characters. Results combine text matching with relevance by meaning. |
| `--types <value>` | The types of results to return (default: all). |
| `--max-results <value>` | The requested number of ranked search results, from 1 to 50; defaults to 50. Exact matches and original issues for matching duplicates can add results beyond this number. |
| `--include-archived <value>` | Whether to include archived results in the search (default: false). |
| `--filters <value>` | Filters to apply to the semantic search results of each type. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api semantic-search`

### `linear api sla-configurations`

Lists enabled SLA rules from the workspace, the requested team, and its ancestor teams, in rule order. Only rules whose team and status filters could match the team are returned. Other issue conditions still need to be evaluated, so this list does not determine the SLA for a particular issue. Requires access to the requested team's settings. — read (query slaConfigurations)

```sh
linear api sla-configurations [options]
```

| Option | What it does |
|---|---|
| `--team-id <value>` | The identifier or key of the team to evaluate SLA rules against. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api sla-configurations`

### `linear api sso-url-from-email`

Returns a SAML sign-in URL for an existing membership or a matching email domain. Errors if no SSO-enabled workspace is found. — read (query ssoUrlFromEmail)

```sh
linear api sso-url-from-email [options]
```

| Option | What it does |
|---|---|
| `--is-desktop <value>` | Whether the client is the desktop app. |
| `--type <value>` | Type of identity provider. |
| `--email <value>` | Email to query the SSO login URL by. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api sso-url-from-email`

### `linear api team`

Fetches a specific team by its ID. — read (query team)

```sh
linear api team [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team`

### `linear api team-create`

Creates a team with workflow states, labels, and other initial resources. You become a member and, for private teams or plans that support team owners, an owner. copySettingsFromTeamId copies settings and related resources from an existing team; copied settings take precedence over input values except an explicit private value. — write (mutation teamCreate)

**Changes something in the service.**

```sh
linear api team-create [options]
```

| Option | What it does |
|---|---|
| `--copy-settings-from-team-id <value>` | The team id to copy settings from, if any. |
| `--input <value>` | The team object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-create`

### `linear api team-cycles-delete`

Permanently deletes all cycles for a team and disables cycles. Issues are kept, but their cycle associations are removed. Requires permission to manage the team. — destructive (mutation teamCyclesDelete)

**Changes something in the service.**

```sh
linear api team-cycles-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team, which cycles will be deleted. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-cycles-delete`

### `linear api team-delete`

Archives a team and schedules permanent deletion after a 30-day grace period. You cannot delete the workspace’s final active team. Requires a workspace administrator or team owner; use teamUnarchive before deletion begins to restore it. — destructive (mutation teamDelete)

**Changes something in the service.**

```sh
linear api team-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-delete`

### `linear api team-key-delete`

Deletes a previously used team key. The active team key (the team's current key) cannot be deleted. — destructive (mutation teamKeyDelete)

**Changes something in the service.**

```sh
linear api team-key-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team key to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-key-delete`

### `linear api team-membership`

Fetches a specific team membership by its ID. — read (query teamMembership)

```sh
linear api team-membership [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team membership to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-membership`

### `linear api team-membership-create`

Adds a user to an active team after checking permission and membership limits. Regular workspace members also join ancestor teams. The operation fails if the user is already a member or if the team is archived, retired, or managed through SCIM. — write (mutation teamMembershipCreate)

**Changes something in the service.**

```sh
linear api team-membership-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The team membership object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-membership-create`

### `linear api team-membership-delete`

Removes a user from a team after checking removal permissions and membership restrictions. Leaving cannot remove the user’s last active team, and SCIM-managed memberships must be managed through the identity provider. alsoLeaveParentTeams can extend the removal to parent teams. — destructive (mutation teamMembershipDelete)

**Changes something in the service.**

```sh
linear api team-membership-delete [options]
```

| Option | What it does |
|---|---|
| `--also-leave-parent-teams <value>` | Whether to leave the parent teams. |
| `--id <value>` | The identifier of the team membership to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-membership-delete`

### `linear api team-memberships`

All team memberships in the workspace. — read (query teamMemberships)

```sh
linear api team-memberships [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api team-memberships`

### `linear api team-membership-update`

Updates the team’s position in the member’s team list. — write (mutation teamMembershipUpdate)

**Changes something in the service.**

```sh
linear api team-membership-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial team membership object to update the team membership with. |
| `--id <value>` | The identifier of the team membership to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-membership-update`

### `linear api teams`

All teams whose issues the user can access. This includes public teams and private teams the user is a member of. This may differ from `administrableTeams`, which returns teams whose settings the user can change but whose issues they don't necessarily have access to. — read (query teams)

```sh
linear api teams [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned teams. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api teams`

### `linear api team-unarchive`

Restores an archived team and cancels its scheduled deletion while the grace period still permits cancellation. Requires workspace team-management permission, access to the team, and capacity for another active team on the workspace’s plan. — write (mutation teamUnarchive)

**Changes something in the service.**

```sh
linear api team-unarchive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the team to unarchive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-unarchive`

### `linear api team-update`

Updates the supplied team fields. Changes require the relevant team-management permissions. — write (mutation teamUpdate)

**Changes something in the service.**

```sh
linear api team-update [options]
```

| Option | What it does |
|---|---|
| `--mapping <value>` | [INTERNAL] Mapping of existing team entities to those inherited from the parent team. |
| `--input <value>` | A partial team object to update the team with. |
| `--id <value>` | The identifier of the team to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api team-update`

### `linear api template`

A template by UUID, including archived templates. — read (query template)

```sh
linear api template [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the template to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api template`

### `linear api template-create`

Create a template. Requires permission to manage templates in the workspace, team, or release pipeline that owns it. — write (mutation templateCreate)

**Changes something in the service.**

```sh
linear api template-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The template object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api template-create`

### `linear api template-delete`

Deletes a template and its inherited copies. Requires permission to manage templates in its scope; inherited copies must be deleted at their source. Resources already created from the template remain. — destructive (mutation templateDelete)

**Changes something in the service.**

```sh
linear api template-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the template to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api template-delete`

### `linear api templates`

All accessible workspace and team templates, including archived templates. Use templateSearch for filters and a result limit. — read (query templates)

```sh
linear api templates
```

**Example:** `linear personal api templates`

### `linear api template-search`

Finds templates matching a filter, ordered as they appear in Linear. Unlike templates, this excludes archived templates by default and supports a result limit. A null-team filter selects templates without a team, including pipeline-scoped release-note templates. — read (query templateSearch)

```sh
linear api template-search [options]
```

| Option | What it does |
|---|---|
| `--include-archived <value>` | Should archived resources be included (default: false). |
| `--first <value>` | Maximum results. Capped at 250. |
| `--filter <value>` | Filter to apply to the template results. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api template-search`

### `linear api templates-for-integration`

Lists templates enabled for the specified integration service. The returned templateData also includes the body as Markdown for integrations that cannot read Linear’s rich-text format. Unsupported service types return an empty list. — read (query templatesForIntegration)

```sh
linear api templates-for-integration [options]
```

| Option | What it does |
|---|---|
| `--integration-type <value>` | The type of integration for which to return associated templates. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api templates-for-integration`

### `linear api template-update`

Changes a template’s metadata, saved defaults, or team scope. Update an inherited template at its source, and supply the full templateData when replacing its configuration. Changing a template does not rewrite resources already created from it. — write (mutation templateUpdate)

**Changes something in the service.**

```sh
linear api template-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the template to update. |
| `--id <value>` | The identifier of the template. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api template-update`

### `linear api time-schedule`

Retrieves an accessible time schedule by UUID, including archived schedules. — read (query timeSchedule)

```sh
linear api time-schedule [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the time schedule to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule`

### `linear api time-schedule-create`

Creates an API-managed on-call schedule in the workspace. Provide a name and the complete list of shifts, then reference the returned schedule ID from a triage responsibility to use it for a team. An OAuth-created schedule is owned by that application for later updates and deletion. Duplicate IDs or external IDs are rejected. — write (mutation timeScheduleCreate)

**Changes something in the service.**

```sh
linear api time-schedule-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the time schedule to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule-create`

### `linear api time-schedule-delete`

Deletes an API-managed schedule and replaces linked triage responsibilities with available fallback users. The same ownership and team-management requirements as timeScheduleUpdate apply. Integration-synced schedules cannot be deleted here. — destructive (mutation timeScheduleDelete)

**Changes something in the service.**

```sh
linear api time-schedule-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the time schedule to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule-delete`

### `linear api time-schedule-refresh-integration-schedule`

Requests a refresh of a schedule managed by an integration. The schedule must have an associated integration. Success means the refresh was queued; the returned timeSchedule may still contain its previous shifts. Query the schedule again to read the refreshed entries. — write (mutation timeScheduleRefreshIntegrationSchedule)

**Changes something in the service.**

```sh
linear api time-schedule-refresh-integration-schedule [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the time schedule to refresh. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule-refresh-integration-schedule`

### `linear api time-schedules`

Returns the on-call schedules the caller can access, including API-managed and integration-managed schedules. Use the connection arguments to paginate. The integration and externalId fields identify where a schedule comes from. — read (query timeSchedules)

```sh
linear api time-schedules [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api time-schedules`

### `linear api time-schedule-update`

Updates an unarchived, API-managed schedule. Omitted fields remain unchanged; entries replaces every existing shift. OAuth callers can update only schedules created by the same application. Other callers need management permission for every team using the schedule, or workspace team management permission if no team uses it. Integration-synced schedules cannot be edited here. — write (mutation timeScheduleUpdate)

**Changes something in the service.**

```sh
linear api time-schedule-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the time schedule to update. |
| `--id <value>` | The identifier of the time schedule to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule-update`

### `linear api time-schedule-upsert-external`

Finds an unarchived schedule by its workspace-unique externalId and updates it, or creates one if none exists. For a new schedule, include name and the same externalId inside input; the lookup argument is not copied into input automatically. A supplied entries list replaces the old shifts. Email references without userId are matched to workspace users when possible; unmatched references remain external. The same ownership rules as timeScheduleUpdate apply to an existing schedule. — write (mutation timeScheduleUpsertExternal)

**Changes something in the service.**

```sh
linear api time-schedule-upsert-external [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the time schedule to insert or update. |
| `--external-id <value>` | Schedule identifier in the external service, unique within the workspace. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api time-schedule-upsert-external`

### `linear api track-anonymous-event`

Submits an anonymous $pageview or $pageleave analytics event, with optional properties and session correlation. Unsupported event names return success=false. A successful response means tracking accepted the event, not that analytics delivery has completed. Limited to 30 requests per hour. — write (mutation trackAnonymousEvent)

**Changes something in the service.**

```sh
linear api track-anonymous-event [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | Event tracking details. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api track-anonymous-event`

### `linear api triage-responsibilities`

All triage responsibilities. — read (query triageResponsibilities)

```sh
linear api triage-responsibilities [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api triage-responsibilities`

### `linear api triage-responsibility`

A specific triage responsibility. — read (query triageResponsibility)

```sh
linear api triage-responsibility [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the triage responsibility to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api triage-responsibility`

### `linear api triage-responsibility-create`

Creates the team’s triage responsibility using a manual user selection or an on-call schedule. The team must be writable, the workspace plan must support triage responsibility, and the caller needs team management permission. A team can have only one rule. Selecting an integration-managed schedule also queues a refresh of its shifts. — write (mutation triageResponsibilityCreate)

**Changes something in the service.**

```sh
linear api triage-responsibility-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the triage responsibility to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api triage-responsibility-create`

### `linear api triage-responsibility-delete`

Deletes a triage responsibility. — destructive (mutation triageResponsibilityDelete)

**Changes something in the service.**

```sh
linear api triage-responsibility-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the triage responsibility to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api triage-responsibility-delete`

### `linear api triage-responsibility-update`

Updates the action or responsible users for a writable team’s existing rule. Changing to a manual selection clears its schedule, and changing to a schedule clears its manual selection. Omitted fields remain unchanged. Requires team management permission; selecting a different integration-managed schedule queues a refresh. — write (mutation triageResponsibilityUpdate)

**Changes something in the service.**

```sh
linear api triage-responsibility-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the triage responsibility to update. |
| `--id <value>` | The identifier of the triage responsibility to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api triage-responsibility-update`

### `linear api usage-alert`

Retrieves a usage-based billing alert by UUID, including archived alerts. Requires workspace billing permission. — read (query usageAlert)

```sh
linear api usage-alert [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the usage alert to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api usage-alert`

### `linear api usage-alerts`

The workspace's usage-based billing alerts, such as a low or exhausted usage credit balance. Alerts for expired promotional credits are archived and excluded unless archived resources are requested. Use resolvedAt to tell an open alert from one whose condition has since cleared. Requires workspace billing permission. — read (query usageAlerts)

```sh
linear api usage-alerts [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned usage alerts. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api usage-alerts`

### `linear api user`

Fetches a specific user by their ID. — read (query user)

```sh
linear api user [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the user to retrieve. To retrieve the authenticated user, use `viewer` query. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user`

### `linear api user-change-role`

Changes the workspace role of a user. The requesting user must have a role equal to or higher than the target role. Requires workspace admin permissions. — write (mutation userChangeRole)

**Changes something in the service.**

```sh
linear api user-change-role [options]
```

| Option | What it does |
|---|---|
| `--role <value>` | The new role for the user. |
| `--id <value>` | The identifier of the user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-change-role`

### `linear api user-discord-connect`

Connects the Discord user to this Linear account via OAuth2. — write (mutation userDiscordConnect)

**Changes something in the service.**

```sh
linear api user-discord-connect [options]
```

| Option | What it does |
|---|---|
| `--redirect-uri <value>` | The Discord OAuth redirect URI. |
| `--code <value>` | The Discord OAuth code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-discord-connect`

### `linear api user-external-user-disconnect`

Disconnects the external user from this Linear account. — write (mutation userExternalUserDisconnect)

**Changes something in the service.**

```sh
linear api user-external-user-disconnect [options]
```

| Option | What it does |
|---|---|
| `--workspace-integration-id <value>` | The workspace Jira integration whose account mapping to remove. If omitted, removes all Jira mappings without a personal connection. |
| `--service <value>` | The external service to disconnect. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-external-user-disconnect`

### `linear api user-flag-update`

Updates a specific user settings flag by performing an operation (e.g., increment or clear) on it. — write (mutation userFlagUpdate)

**Changes something in the service.**

```sh
linear api user-flag-update [options]
```

| Option | What it does |
|---|---|
| `--operation <value>` | Flag operation to perform. |
| `--flag <value>` | Settings flag to increment. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-flag-update`

### `linear api user-revoke-all-sessions`

Revokes all active sessions for a user, forcing them to re-authenticate. Can only be called by a workspace admin or owner. — write (mutation userRevokeAllSessions)

**Changes something in the service.**

```sh
linear api user-revoke-all-sessions [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the user to logout all sessions of. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-revoke-all-sessions`

### `linear api user-revoke-session`

Revokes a specific authentication session for a user. The admin cannot revoke their own sessions with this mutation. Can only be called by a workspace admin or owner. — write (mutation userRevokeSession)

**Changes something in the service.**

```sh
linear api user-revoke-session [options]
```

| Option | What it does |
|---|---|
| `--session-id <value>` | The identifier of the session to revoke. |
| `--id <value>` | The identifier of the user whose session to revoke. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-revoke-session`

### `linear api users`

Users in the workspace, with filtering and pagination. Disabled accounts are excluded unless includeDisabled is true. — read (query users)

```sh
linear api users [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned users. |
| `--include-disabled <value>` | Include disabled and suspended accounts. Defaults to false. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--sort <value>` | Sort returned users. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api users`

### `linear api user-sessions`

Lists all active authentication sessions for a user. Can only be called by a workspace admin or owner. — read (query userSessions)

```sh
linear api user-sessions [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the user to list sessions of. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-sessions`

### `linear api user-settings`

The authenticated user's notification and UI settings. — read (query userSettings)

```sh
linear api user-settings
```

**Example:** `linear personal api user-settings`

### `linear api user-settings-flags-reset`

Resets one or more of the user's setting flags. If no specific flags are provided, all flags are reset. — write (mutation userSettingsFlagsReset)

**Changes something in the service.**

```sh
linear api user-settings-flags-reset [options]
```

| Option | What it does |
|---|---|
| `--flags <value>` | The flags to reset. If not provided all flags will be reset. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-settings-flags-reset`

### `linear api user-settings-update`

Updates the settings record identified by id. You must own that record or have permission to manage workspace entities. General settings and notification category or channel preferences merge with existing values. See notificationDeliveryPreferences for its schedule replacement and mobile-channel effects. — write (mutation userSettingsUpdate)

**Changes something in the service.**

```sh
linear api user-settings-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial notification object to update the settings with. |
| `--id <value>` | The identifier of the userSettings to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-settings-update`

### `linear api user-suspend`

Suspends a user, deactivating their account and revoking access to the workspace. The suspended user's sessions are invalidated. Can only be called by a workspace admin or owner. — write (mutation userSuspend)

**Changes something in the service.**

```sh
linear api user-suspend [options]
```

| Option | What it does |
|---|---|
| `--force-bypass-scim-restrictions <value>` | [INTERNAL] Whether to bypass SCIM restrictions when suspending. Use with caution — this overrides identity provider management. |
| `--id <value>` | The identifier of the user to suspend. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-suspend`

### `linear api user-unlink-from-identity-provider`

Unlinks a guest user from their identity provider. Can only be called by an admin when SCIM is enabled. — write (mutation userUnlinkFromIdentityProvider)

**Changes something in the service.**

```sh
linear api user-unlink-from-identity-provider [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the guest user to unlink from their identity provider. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-unlink-from-identity-provider`

### `linear api user-unsuspend`

Re-activates a suspended user, restoring their access to the workspace. Can only be called by a workspace admin or owner. — write (mutation userUnsuspend)

**Changes something in the service.**

```sh
linear api user-unsuspend [options]
```

| Option | What it does |
|---|---|
| `--force-bypass-scim-restrictions <value>` | [INTERNAL] Whether to bypass SCIM restrictions when unsuspending. Use with caution — this overrides identity provider management. |
| `--id <value>` | The identifier of the user to unsuspend. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-unsuspend`

### `linear api user-update`

Updates a user’s profile. Use the user UUID or me for your own account. Updating another user requires member-management permission; identity-provider rules may block name changes, and application accounts only accept name and displayName. — write (mutation userUpdate)

**Changes something in the service.**

```sh
linear api user-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial user object to update the user with. |
| `--id <value>` | The identifier of the user to update. Use `me` to reference currently authenticated user. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-update`

### `linear api user-view-preferences`

The authenticated user's workspace-level view display preferences for a view type. Returns the user-type preferences that are not scoped to a team, project, or other entity. Null if the user has not customized the view. — read (query userViewPreferences)

```sh
linear api user-view-preferences [options]
```

| Option | What it does |
|---|---|
| `--view-type <value>` | The view type the preferences are associated with. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api user-view-preferences`

### `linear api verify-git-hub-enterprise-server-installation`

Checks whether Linear has received the first connection from the GitHub Enterprise Server app during this setup attempt. — read (query verifyGitHubEnterpriseServerInstallation)

```sh
linear api verify-git-hub-enterprise-server-installation [options]
```

| Option | What it does |
|---|---|
| `--integration-id <value>` | The integration ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api verify-git-hub-enterprise-server-installation`

### `linear api viewer`

The account making this request. For OAuth applications using actor=app, this is the application account. — read (query viewer)

```sh
linear api viewer
```

**Example:** `linear personal api viewer`

### `linear api view-preferences-create`

Saves display settings for a view and scope. Existing records that conflict with the supplied type, view type, and scope are deleted and replaced, so supply the settings you want to retain. Personal preferences are owned by the current user. — write (mutation viewPreferencesCreate)

**Changes something in the service.**

```sh
linear api view-preferences-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The ViewPreferences object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api view-preferences-create`

### `linear api view-preferences-delete`

Deletes a saved preferences record, allowing the view to use its fallback defaults. You can delete only your own user-type preferences. If the record is already absent, the mutation still succeeds. — destructive (mutation viewPreferencesDelete)

**Changes something in the service.**

```sh
linear api view-preferences-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the ViewPreferences to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api view-preferences-delete`

### `linear api view-preferences-update`

Replaces the supplied settings objects on a saved preferences record. You can update only your own user-type preferences; changing workspace defaults for a custom view also requires permission to edit that view. — write (mutation viewPreferencesUpdate)

**Changes something in the service.**

```sh
linear api view-preferences-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the view preferences. |
| `--id <value>` | The identifier of the ViewPreferences object. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api view-preferences-update`

### `linear api webhook`

Retrieves a single webhook by its identifier. — read (query webhook)

```sh
linear api webhook [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the webhook to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api webhook`

### `linear api webhook-create`

Creates a webhook subscription and returns its configuration, including the signing secret. Choose one team or all public teams, and provide a public HTTPS destination with the resource types you want to receive. The destination must not already be registered for the same team scope. Requires workspace API management permission; a team-specific webhook also requires that team’s management permission. AuditEntry subscriptions have separate audit log access requirements. — write (mutation webhookCreate)

**Changes something in the service.**

```sh
linear api webhook-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The webhook object to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api webhook-create`

### `linear api webhook-delete`

Deletes a webhook subscription and stops future deliveries. — destructive (mutation webhookDelete)

**Changes something in the service.**

```sh
linear api webhook-delete [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the Webhook to delete. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api webhook-delete`

### `linear api webhook-rotate-secret`

Generates and returns a new HMAC-SHA256 signing secret for the webhook. Update your receiver to verify later deliveries with the returned key; the previous key is replaced rather than kept as a second active key. This changes webhook signatures, not the endpoint or subscribed event streams. — write (mutation webhookRotateSecret)

**Changes something in the service.**

```sh
linear api webhook-rotate-secret [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the Webhook to rotate the secret for. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api webhook-rotate-secret`

### `linear api webhooks`

Webhook subscriptions in the workspace, with cursor-based pagination. Requires permission to manage the workspace API. — read (query webhooks)

```sh
linear api webhooks [options]
```

| Option | What it does |
|---|---|
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api webhooks`

### `linear api webhook-update`

Updates an existing webhook without changing its team scope. Omitted properties remain unchanged, and resourceTypes replaces the complete list of event streams. Setting enabled to false pauses delivery while retaining the subscription. Changing secret changes the key your receiver must use for later deliveries. Requires workspace API management permission and access to the subscribed resource types. — write (mutation webhookUpdate)

**Changes something in the service.**

```sh
linear api webhook-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The properties of the Webhook. |
| `--id <value>` | The identifier of the Webhook. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api webhook-update`

### `linear api workflow-state`

An issue status by UUID, including archived statuses. — read (query workflowState)

```sh
linear api workflow-state [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the workflow state to retrieve. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api workflow-state`

### `linear api workflow-state-archive`

Archives an unused status so it is no longer available for new issues. First move or archive every active issue in that status. You must be able to manage the team, and cannot archive reserved or inherited statuses or the last active status of a type. — destructive (mutation workflowStateArchive)

**Changes something in the service.**

```sh
linear api workflow-state-archive [options]
```

| Option | What it does |
|---|---|
| `--id <value>` | The identifier of the state to archive. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api workflow-state-archive`

### `linear api workflow-state-create`

Add an issue status to a team. Requires permission to manage the team; inherited workflows cannot be edited directly. — write (mutation workflowStateCreate)

**Changes something in the service.**

```sh
linear api workflow-state-create [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | The state to create. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api workflow-state-create`

### `linear api workflow-states`

Issue statuses from teams the caller can access, with cursor pagination and optional filters. — read (query workflowStates)

```sh
linear api workflow-states [options]
```

| Option | What it does |
|---|---|
| `--filter <value>` | Filter returned workflow states. |
| `--before <value>` | Returns results before this cursor. Pair with `last` to paginate backward, using a cursor returned by the same connection. Keep the filters and ordering unchanged between pages. Cannot be combined with `first` or `after`. |
| `--after <value>` | Returns results after this cursor. Pair with `first` and the previous page's `endCursor` to fetch the next page. Keep the filters and ordering unchanged between pages. Cannot be combined with `last` or `before`. |
| `--first <value>` | The maximum number of results to return, starting after `after` if supplied. Between 1 and 250. Defaults to 50 when neither `first` nor `last` is supplied. Cannot be combined with `last` or `before`. |
| `--last <value>` | The maximum number of results to return, ending before `before` if supplied. Between 1 and 250. Cannot be combined with `first` or `after`. |
| `--include-archived <value>` | Includes archived resources alongside active ones. Defaults to false, which returns only active resources. This does not include deleted resources. |
| `--order-by <value>` | Orders results by creation time or last meaningful update time. Defaults to `createdAt`. Results are newest first with `first` and oldest first with `last`; use the returned `endCursor` as `before` to continue backward. Cannot be combined with custom `sort` options on fields that support them. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--all` | read every page, as the API pages it. |

**Example:** `linear personal api workflow-states`

### `linear api workflow-state-update`

Update a status’s name, color, description, or position. Requires permission to manage the team. Reserved and inherited statuses cannot be changed. — write (mutation workflowStateUpdate)

**Changes something in the service.**

```sh
linear api workflow-state-update [options]
```

| Option | What it does |
|---|---|
| `--input <value>` | A partial state object to update. |
| `--id <value>` | The identifier of the state to update. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Example:** `linear personal api workflow-state-update`

## `linear folders`

choose the Linear projects whose documents sync copies

### `linear folders add`

import a folder and everything under it on the next sync

**Changes something on this computer only.**

```sh
linear folders add <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | project id, linear:all for every project, or linear:elsewhere for documents outside projects. |

**Example:** `linear personal folders add linear:all`

### `linear folders list`

list the folder ids sync imports

```sh
linear folders list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** selected folder — id, name, path; every field: linear commands info folders list

**Example:** `linear personal folders list`

### `linear folders remove`

stop importing a folder; the next sync drops its documents

**Changes something on this computer only.**

```sh
linear folders remove <folder>
```

| Argument | | What it is |
|---|---|---|
| `folder` | required | project id, linear:all for every project, or linear:elsewhere for documents outside projects. |

**Example:** `linear personal folders remove FOLDER_ID`

## `linear status`

show the last sync, imported documents and pending work

```sh
linear status
```

**Example:** `linear personal status`

## `linear documents`

read the Linear documents synced to this computer

### `linear documents list`

list the synced Linear documents with their projects

```sh
linear documents list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many documents to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `linear documents show <document>`, `linear documents history <document>`, `linear documents context <document>`

**Example:** `linear personal documents list`, `linear personal documents list tag:budget`, `linear personal documents list person:PERSON_UID --limit 10`

### `linear documents show`

show an imported document's text, tabs and metadata

```sh
linear documents show <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or a search hit's document: ref. |

**Example:** `linear personal documents show DOC_ID`, `linear personal documents show document:42 --offline`

### `linear documents export`

write an imported document to a new Markdown file

**Changes something on this computer only.**

```sh
linear documents export <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or a search hit's document: ref. |

| Option | What it does |
|---|---|
| `--output <file>` | path of the Markdown file to write; an existing file is refused. |

**Example:** `linear personal documents export DOC_ID --output notes.md`

### `linear documents history`

list the versions of a document kept in the local copy, or show one with --revision

```sh
linear documents history <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | document id or a search hit's document: ref. |

| Option | What it does |
|---|---|
| `--revision <n>` | show the text of this version. |

**Example:** `linear personal documents history DOC_ID`, `linear personal documents history DOC_ID --revision 3`

### `linear documents context`

show a document with its tags, relationships, notes, memories and editors

```sh
linear documents context <document>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |

**Example:** `linear personal documents context DOC_ID`

## `linear changes`

list the documents the sync added, changed, removed or brought back, newest first

```sh
linear changes [options]
```

| Option | What it does |
|---|---|
| `--since <time>` | from this time: an ISO 8601 time, today, yesterday, or 30m, 2h, 1d ago. Default: `1d`. |
| `--until <time>` | up to this time, in the same forms. |
| `--event <events>` | only these, comma separated: added, changed, restored, deleted, unavailable, unsynced. |
| `--limit <n>` | how many changes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Example:** `linear personal changes`, `linear personal changes --since 7d --event deleted,unavailable`

## `linear search`

search imported documents by words, and by meaning when indexed

```sh
linear search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | words to look for, and fields such as tag: and date: that every hit must match. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many results to return. Default: `20`. |
| `--page <n>` | which page to return. Default: `1`. |
| `--exact` | match the words exactly: no word forms, no meaning. |

**Example:** `linear personal search budget`, `linear personal search "quarterly plan" --exact --limit 5`

## `linear catalog`

browse stored Linear files and folders offline

### `linear catalog import`

put cached file and folder metadata into the shared database

**Changes something on this computer only.**

```sh
linear catalog import
```

**Example:** `linear personal catalog import --offline`

### `linear catalog show`

show stored metadata and the stable file or folder reference

```sh
linear catalog show <file>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Linear file or folder id, or its URL. |

**Next usually:** `linear documents show <document>`, `linear documents history <document>`, `linear documents context <document>`

**Example:** `linear personal catalog show FILE_ID --offline`

### `linear catalog list`

list cached files and folders using metadata queries

```sh
linear catalog list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `linear documents show <document>`, `linear documents history <document>`, `linear documents context <document>`

**Example:** `linear personal catalog list "parent:FOLDER_ID AND kind:file" --offline`

### `linear catalog search`

search cached names, descriptions, types and observed people

```sh
linear catalog search <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | metadata query: kind, mime, name, parent, person, tag; AND, OR, NOT. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many entries to return (at most 1000). Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Next usually:** `linear documents show <document>`, `linear documents history <document>`, `linear documents context <document>`

**Example:** `linear personal catalog search "budget AND person:Rin*" --offline`

### `linear catalog tree`

show the cached hierarchy below a folder or all selected roots

```sh
linear catalog tree [folder] [options]
```

| Argument | | What it is |
|---|---|---|
| `folder` | optional | Linear folder id or URL; defaults to the explicitly selected profile's roots. |

| Option | What it does |
|---|---|
| `--depth <n>` | maximum descendant depth, from 0 to 50. Default: `5`. |

**Example:** `linear personal catalog tree --offline`, `linear personal catalog tree FOLDER_ID --depth 3 --offline`

### `linear catalog tags`

add owner tags to cached files or folders

#### `linear catalog tags list`

list local tags on a cached file or folder

```sh
linear catalog tags list <file> [query]
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Linear file or folder id, or its URL. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: linear commands info catalog tags list

**Example:** `linear personal catalog tags list FOLDER_ID --offline`

#### `linear catalog tags add`

add local tags on a cached file or folder

**Changes something on this computer only.**

```sh
linear catalog tags add <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Linear file or folder id, or its URL. |
| `tags` | required | local tag names. |

**Example:** `linear personal catalog tags add FOLDER_ID project --offline`

#### `linear catalog tags remove`

remove local tags on a cached file or folder

**Changes something on this computer only.**

```sh
linear catalog tags remove <file> <tags>
```

| Argument | | What it is |
|---|---|---|
| `file` | required | Linear file or folder id, or its URL. |
| `tags` | required | local tag names. |

**Example:** `linear personal catalog tags remove FOLDER_ID project --offline`

## `linear tags`

label imported documents; labels survive a sync

### `linear tags list`

list a document's tags

```sh
linear tags list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document tag — tag; every field: linear commands info tags list

**Example:** `linear personal tags list DOC_ID`

### `linear tags add`

tag a document

**Changes something on this computer only.**

```sh
linear tags add <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `linear personal tags add DOC_ID budget q3`

### `linear tags remove`

untag a document

**Changes something on this computer only.**

```sh
linear tags remove <document> <tags>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `tags` | required | one or more tags. |

**Example:** `linear personal tags remove DOC_ID budget q3`

## `linear relationships`

connect a document to people, projects, notes and other references

### `linear relationships list`

list a document's relationships

```sh
linear relationships list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document relationship — id, from, to, kind, role, confirmed, origin; every field: linear commands info relationships list

**Example:** `linear personal relationships list DOC_ID`

### `linear relationships add`

connect a document to another reference

**Changes something on this computer only.**

```sh
linear relationships add <document> <reference> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `reference` | required | what it connects to, such as person:<uid>, project:<id> or note:<id>. |

| Option | What it does |
|---|---|
| `--kind <kind>` | how the two relate. One of: `links-to`, `about`, `evidence`, `created-from`, `related-to`, `assigned-to`. Default: `related-to`. |
| `--role <role>` | the part the reference plays, in a word or two. |
| `--reason <text>` | why the two are connected. |

**Example:** `linear personal relationships add DOC_ID project:PROJECT_ID --kind about`, `linear personal relationships add DOC_ID person:PERSON_UID --kind assigned-to --role reviewer`

### `linear relationships remove`

remove one of a document's relationships

**Changes something on this computer only.**

```sh
linear relationships remove <document> <relationship-id>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `relationship-id` | required | id, as relationships list prints it. |

**Example:** `linear personal relationships remove DOC_ID LINK_ID`

## `linear notes`

write notes about an imported document

### `linear notes add`

write a note about a document

**Changes something on this computer only.**

```sh
linear notes add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `text` | required | the note's text. |

| Option | What it does |
|---|---|
| `--title <title>` | a title for the note. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: linear commands info notes add

**Next usually:** `linear notes show <document> <note>`, `linear notes edit <document> <note> <text>`, `linear notes remove <document> <note>`

**Example:** `linear personal notes add DOC_ID "Check the numbers" --title Review`

### `linear notes list`

list a document's notes

```sh
linear notes list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many notes to return. Default: `50`. |
| `--page <n>` | which page to return. Default: `1`. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: linear commands info notes list

**Next usually:** `linear notes show <document> <note>`, `linear notes edit <document> <note> <text>`, `linear notes remove <document> <note>`

**Example:** `linear personal notes list DOC_ID`, `linear personal notes list DOC_ID text:review --limit 10`

### `linear notes show`

show one note

```sh
linear notes show <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: linear commands info notes show

**Next usually:** `linear notes edit <document> <note> <text>`, `linear notes remove <document> <note>`

**Example:** `linear personal notes show DOC_ID note:NOTE_ID`

### `linear notes edit`

replace a note's text

**Changes something on this computer only.**

```sh
linear notes edit <document> <note> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |
| `text` | required | the note's new text. |

| Option | What it does |
|---|---|
| `--revision <n>` | revision from notes show; a newer note is not overwritten. |

**Returns:** note — ref, id, source, folder_id, path, title, text, revision, and 15 more; every field: linear commands info notes edit

**Next usually:** `linear notes show <document> <note>`, `linear notes remove <document> <note>`

**Example:** `linear personal notes edit DOC_ID note:NOTE_ID "Numbers checked" --revision 2`

### `linear notes remove`

delete one note

**Changes something on this computer only.**

```sh
linear notes remove <document> <note>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `note` | required | note:<id> reference, as notes list prints it. |

**Example:** `linear personal notes remove DOC_ID note:NOTE_ID`

## `linear memories`

keep what was learned from a document, with evidence; an agent's stay proposed

### `linear memories add`

record a memory about a document

**Changes something on this computer only.**

```sh
linear memories add <document> <text> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `text` | required | what to remember. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memory it is: personal or work. One of: `personal`, `work`. |
| `--kind <kind>` | what kind of memory it is. One of: `summary`, `digest`, `preference`. Default: `summary`. |
| `--supersedes <ref>` | a memory:<id> about the same document that this one replaces. |

**Example:** `linear personal memories add DOC_ID "The team prefers async reviews" --scope work --kind preference`

### `linear memories list`

list a document's memories

```sh
linear memories list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many memories to return. Default: `50`. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: linear commands info memories list

**Example:** `linear personal memories list DOC_ID scope:work`, `linear personal memories list DOC_ID kind:preference status:confirmed`

### `linear memories show`

show one memory

```sh
linear memories show <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `linear personal memories show DOC_ID memory:MEMORY_ID`

### `linear memories confirm`

confirm a proposed memory as true

**Changes something on this computer only.**

```sh
linear memories confirm <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `linear personal memories confirm DOC_ID memory:MEMORY_ID`

### `linear memories stale`

mark a memory as out of date

**Changes something on this computer only.**

```sh
linear memories stale <document> <memory>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `memory` | required | memory:<id> reference, as memories list prints it. |

**Example:** `linear personal memories stale DOC_ID memory:MEMORY_ID`

### `linear memories search`

search a document's memories by words

```sh
linear memories search <document> <query>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | required | words to look for, and scope:personal or scope:work — the fields are below. |

**Returns:** memory — ref, id, kind, text, subject, author, model, confidence, and 13 more; every field: linear commands info memories search

**Example:** `linear personal memories search DOC_ID reviews scope:work`, `linear personal memories search DOC_ID "async reviews"`

### `linear memories extract`

send a document's text to the model and show the memories it proposes

**Changes something in the service.**

```sh
linear memories extract <document> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |

| Option | What it does |
|---|---|
| `--scope <scope>` | whose memories they become: personal or work. One of: `personal`, `work`. |
| `--tab <id>` | send only this tab of the document. |
| `--yes` | save the proposals, each with its quote and the document's version. |

**Example:** `linear personal memories extract DOC_ID --scope work`, `linear personal memories extract DOC_ID --scope work --yes`

## `linear facts`

what happened, as a document shows it; an agent's stay proposed until confirmed

### `linear facts add`

record a fact a document shows

**Changes something on this computer only.**

```sh
linear facts add <document> <statement> [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `statement` | required | the fact, in one sentence. |

| Option | What it does |
|---|---|
| `--type <type>` | what kind of fact it is. One of: `fact`, `statement`, `question`, `decision`, `promise`. Default: `fact`. |
| `--scope <scope>` | whose fact it is: personal or work. One of: `personal`, `work`. |
| `--supersedes <ref>` | a decision only: the decision this one replaces. |
| `--occurred-time <time>` | when it happened, as the evidence shows, ISO 8601; a time without a zone is read in this computer's zone, a date alone as its midnight. |

**Example:** `linear personal facts add DOC_ID "Budget approved" --type decision --scope work`

### `linear facts list`

list a document's facts

```sh
linear facts list <document> [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many facts to return. Default: `50`. |

**Returns:** fact — ref, id, kind, text, status, project, subject, occurred_at, and 14 more; every field: linear commands info facts list

**Example:** `linear personal facts list DOC_ID status:proposed`, `linear personal facts list DOC_ID kind:decision`

### `linear facts show`

show one fact

```sh
linear facts show <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `linear personal facts show DOC_ID fact:FACT_ID`

### `linear facts confirm`

confirm a proposed fact; a decision it supersedes stops holding

**Changes something on this computer only.**

```sh
linear facts confirm <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `linear personal facts confirm DOC_ID fact:FACT_ID`

### `linear facts reverse`

an accepted decision no longer holds, and nothing replaced it

**Changes something on this computer only.**

```sh
linear facts reverse <document> <fact>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `fact` | required | fact:<id> reference, as facts list prints it. |

**Example:** `linear personal facts reverse DOC_ID fact:FACT_ID`

## `linear identities`

the Linear accounts seen on a document, and the people they belong to

### `linear identities list`

list the people Linear shows for a document

```sh
linear identities list <document> [query]
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** document identity — remote_id, provider, role, person; every field: linear commands info identities list

**Example:** `linear personal identities list DOC_ID`

### `linear identities link`

record that a Linear account belongs to a known person

**Changes something on this computer only.**

```sh
linear identities link <document> <linear-id> <person>
```

| Argument | | What it is |
|---|---|---|
| `document` | required | Linear file or folder id or URL in the local catalog, or a document:<n> ref. |
| `linear-id` | required | Linear account id, as identities list prints it. |
| `person` | required | person:<uid> reference of someone already known. |

**Example:** `linear personal identities link DOC_ID LINEAR_ID person:PERSON_UID`

## `linear sync`

bring the tracker's copy in the local store up to date: teams, users, states, labels, projects, sprints, issues and comments that changed since the last sync, or everything with --rescan; once a day it also finds what the tracker deleted, and says when it next will. Open issues assigned to you become your tasks, and close when the issue is done, canceled, a duplicate, deleted or goes to someone else. It also imports what changed in the chosen document folders, answered under documents; a part that fails leaves the other's answer. A run stops before its deadline or --max-pages and the next one goes on from there

**Changes something on this computer only.**

```sh
linear sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list everything again, issues and documents, dropping a round in progress; a rescan of the documents starts their walk over each time, so run it once and continue with a plain sync. |
| `--allow-deletions <count>` | let this run mark deleted up to this many of what its full list no longer has, when the guard holds it. |
| `--max-pages <pages>` | at most this many requests for the issues in this run, and as many for the documents. |
| `--embed` | also index new issues, projects and comments and the documents' pending text for meaning search, with a model already downloaded. |

**Returns:** tracker documents sync — provider, account, state, complete, synced, gaps, progress, deletions, and 5 more; every field: linear commands info sync

**Example:** `linear work sync`, `linear work sync --rescan`

## `linear issues`

the tracker's issues as last synced: state, team, project, assignee and labels

### `linear issues list`

issues copied from the tracker, newest change first; run sync to bring them up to date

```sh
linear issues list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker issue — kind, external_id, deleted; every field: linear commands info issues list

**Example:** `linear work issues list type:started`, `linear work issues list label:Bug assignee:none --json`

### `linear issues show`

one issue with its state, assignee and comments

```sh
linear issues show <issue>
```

| Argument | | What it is |
|---|---|---|
| `issue` | required | the issue's key (ENG-12) or id. |

**Returns:** tracker issue detail — kind, external_id, deleted; every field: linear commands info issues show

**Example:** `linear work issues show ENG-12`

### `linear issues search`

find issues, projects and comments in the copy by their words, and by meaning once sync --embed built their vectors

```sh
linear issues search <words> [options]
```

| Argument | | What it is |
|---|---|---|
| `words` | required | every word must match, in any form and any order; a word of four letters or more finds the words it begins; "a phrase" in quote marks inside the query keeps its words together; a question finds what holds some of its words. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker hit — kind, external_id, deleted; every field: linear commands info issues search

**Example:** `linear work issues search invoice currency`, `linear work issues search "why do refunds round wrong?"`

### `linear issues assign`

make an issue the owner's task, whoever it is assigned to: the task points at the issue and shows its key and title, which each sync keeps current; the same issue again answers its existing task

**Changes something on this computer only.**

```sh
linear issues assign <issue> [options]
```

| Argument | | What it is |
|---|---|---|
| `issue` | required | the issue's key (ENG-12) or id. |

| Option | What it does |
|---|---|
| `--due <time>` | when it is due: an ISO 8601 time, a day, today, or 3d from now. |

**Returns:** tracker issue task — task_id, issue, created, key; every field: linear commands info issues assign

**Example:** `linear work issues assign ENG-12 --due 2026-12-01`

### `linear issues create`

make an issue in the tracker, then store the tracker's copy of it

**Changes something in the service.**

```sh
linear issues create [options]
```

| Option | What it does |
|---|---|
| `--title <title>` | the issue's title. |
| `--description <text>` | the issue's text; an empty value clears it. |
| `--team <team>` | the team, by its id, key or name; left out, the copy's only team. |
| `--assignee <user>` | the user, by id, name or e-mail; empty for none; anyone but you checks issues.assign-others. |
| `--priority <n>` | critical or urgent (1), high (2), medium (3), low (4), none or empty (0), a 0.0–1.0 score or the old 0–4. |
| `--status <state>` | the workflow state, by its id or a name only one of the team's states has. |
| `--label <label>` | a label by its id or name; repeat it for each; replaces the issue's labels, and one empty value clears them. Default: ``. |
| `--project <project>` | the project, by its id or name; empty for none. |
| `--parent <id>` | the issue this one is part of, by its key or id; empty for none. |

**Returns:** tracker write — operation_id, untrusted, issue, comment; every field: linear commands info issues create

**Example:** `linear work issues create --title "Example: invoices fail for EUR" --team ENG --label Bug`, `linear work issues create --title "Example: write the guide" --assignee ada@example.com --priority high`

### `linear issues update`

change an issue in the tracker; what is left out keeps its value; the tracker's copy is stored again

**Changes something in the service.**

```sh
linear issues update <issue> [options]
```

| Argument | | What it is |
|---|---|---|
| `issue` | required | the issue's key (ENG-12) or id. |

| Option | What it does |
|---|---|
| `--title <title>` | the issue's title. |
| `--description <text>` | the issue's text; an empty value clears it. |
| `--team <team>` | the team, by its id, key or name; left out, the copy's only team. |
| `--assignee <user>` | the user, by id, name or e-mail; empty for none; anyone but you checks issues.assign-others. |
| `--priority <n>` | critical or urgent (1), high (2), medium (3), low (4), none or empty (0), a 0.0–1.0 score or the old 0–4. |
| `--status <state>` | the workflow state, by its id or a name only one of the team's states has. |
| `--label <label>` | a label by its id or name; repeat it for each; replaces the issue's labels, and one empty value clears them. Default: ``. |
| `--project <project>` | the project, by its id or name; empty for none. |
| `--parent <id>` | the issue this one is part of, by its key or id; empty for none. |

**Returns:** tracker write — operation_id, untrusted, issue, comment; every field: linear commands info issues update

**Example:** `linear work issues update ENG-12 --status "In Progress"`, `linear work issues update ENG-12 --assignee ""`

### `linear issues comments`

comments on the tracker's issues; issues show lists an issue's

#### `linear issues comments create`

add a comment to an issue in the tracker, then store it

**Changes something in the service.**

```sh
linear issues comments create <issue> [options]
```

| Argument | | What it is |
|---|---|---|
| `issue` | required | the issue's key (ENG-12) or id. |

| Option | What it does |
|---|---|
| `--text <text>` | the comment, as it is to read. |

**Returns:** tracker write — operation_id, untrusted, issue, comment; every field: linear commands info issues comments create

**Example:** `linear work issues comments create ENG-12 --text "Example: fixed in the next release"`

## `linear projects`

the tracker's projects: status, lead, teams and target date

### `linear projects list`

projects copied from the tracker, newest change first

```sh
linear projects list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker project — kind, external_id, deleted; every field: linear commands info projects list

**Example:** `linear work projects list`, `linear work projects list archived:include`

## `linear sprints`

each team's sprints (Linear's cycles): number, start, end and when completed

### `linear sprints list`

sprints copied from the tracker, newest change first

```sh
linear sprints list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker sprint — kind, external_id, deleted; every field: linear commands info sprints list

**Example:** `linear work sprints list`, `linear work sprints list archived:include`

## `linear teams`

the tracker's teams

### `linear teams list`

teams copied from the tracker, newest change first

```sh
linear teams list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker team — kind, external_id, deleted; every field: linear commands info teams list

**Example:** `linear work teams list`, `linear work teams list archived:include`

## `linear users`

the tracker's users, each with the person the store knows by the same e-mail

### `linear users list`

users copied from the tracker, newest change first

```sh
linear users list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker user — kind, external_id, deleted; every field: linear commands info users list

**Example:** `linear work users list`, `linear work users list archived:include`

## `linear states`

each team's workflow states and their type

### `linear states list`

states copied from the tracker, newest change first

```sh
linear states list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker state — kind, external_id, deleted; every field: linear commands info states list

**Example:** `linear work states list`, `linear work states list archived:include`

## `linear labels`

the tracker's labels

### `linear labels list`

labels copied from the tracker, newest change first

```sh
linear labels list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | rows per page, 1–500. Default: `50`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** tracker label — kind, external_id, deleted; every field: linear commands info labels list

**Example:** `linear work labels list`, `linear work labels list archived:include`

## `linear doctor`

the state this installation is in, without connecting unless --online

```sh
linear doctor [options]
```

| Option | What it does |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

**Example:** `linear doctor`, `linear doctor --json`

### `linear doctor reports`

problem reports

#### `linear doctor reports show`

what a problem report holds; writes nothing

```sh
linear doctor reports show
```

**Example:** `linear doctor reports show`

#### `linear doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
linear doctor reports create [options]
```

| Option | What it does |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

**Example:** `linear doctor reports create --output ./problem-report.json`

## `linear skill`

the instructions an agent is given for this tool

### `linear skill show`

print SKILL.md — `linear skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
linear skill show [name] [options]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | a part of this skill, or a skill shipped for a task: api-query, api-mutation, api. |

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Example:** `linear skill show`

### `linear skill install`

write SKILL.md to \~/.claude/skills/linear-cli/ (Claude Code) and \~/.agents/skills/linear-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
linear skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Example:** `linear skill install --for agents`

### `linear skill status`

for each place `linear skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
linear skill status
```

**Example:** `linear skill status`, `linear skill status --json`

## `linear mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add linear -- linear <profile> mcp serve`

### `linear mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add linear -- linear <profile> mcp serve`; `linear mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
linear mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Example:** `linear personal mcp serve`, `linear mcp serve --profiles work,personal`, `linear personal mcp serve --http --public-url https://laptop.example.ts.net`

### `linear mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
linear mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `linear personal mcp revoke`, `linear mcp revoke --profiles all`

### `linear mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `linear mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
linear mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `linear personal mcp server start --public-url https://laptop.example.ts.net`

#### `linear mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
linear mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `linear personal mcp server stop`

#### `linear mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
linear mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Example:** `linear personal mcp server status --json`

### `linear mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
linear mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.list=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Example:** `linear personal mcp config`, `linear mcp config --profiles all`

### `linear mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
linear mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like api.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `linear personal mcp add codex --allow-writes`

### `linear mcp check`

check this profile's local MCP handshake and tool list

```sh
linear mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.list=deny; it never loosens the profile; repeat for more keys. |

**Example:** `linear personal mcp check`

## `linear upgrade`

upgrade linear with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
linear upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Example:** `linear upgrade --check`

## `linear config`

the settings in force, and where each one came from

### `linear config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
linear config show
```

**Example:** `linear personal config show`

### `linear config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
linear config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `linear personal config set limit 20`

### `linear config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
linear config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, keep_store_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, owner_languages, crm.<provider>:<account>.links, crm.<provider>:<account>.company-types, crm.<provider>:<account>.scope, crm.<provider>:<account>.unassigned, crm.<provider>:<account>.self, crm.<provider>:<account>.stage-tasks, crm.<provider>:<account>.activities, crm.<provider>:<account>.files.max_files, crm.<provider>:<account>.files.max_file_mb, crm.<provider>:<account>.files.max_run_mb, crm.<provider>:<account>.files.run_minutes, crm.<provider>:<account>.files.days, crm.<provider>:<account>.files.max_total_mb. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Example:** `linear personal config unset limit`

### `linear config migrate`

write each setting the file lacks at its default, keeping yours

**Changes something on this computer only.**

```sh
linear config migrate
```

**Example:** `linear config migrate`

### `linear config repair`

fix broken JSON syntax in the settings file — comments, a missing or extra comma, unquoted keys, single quotes, missing closing brackets at the end — keeping every value, with a backup beside it; refuses anything with more than one reading and changes nothing then

**Changes something on this computer only.**

```sh
linear config repair [options]
```

| Option | What it does |
|---|---|
| `--dry-run` | say what it would fix, and change nothing. |

**Example:** `linear config repair`, `linear config repair --dry-run`

## `linear runs`

recorded runs — what this tool did, and when

### `linear runs list`

recorded runs, newest first

```sh
linear runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: linear commands info runs list

**Example:** `linear personal runs list --limit 10`

### `linear runs show`

one run: what it was, how it ended, and every event it logged

```sh
linear runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `linear runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: linear commands info runs show

**Example:** `linear personal runs show run-101`

### `linear runs path`

the directory holding one run

```sh
linear runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `linear runs list`. |

**Returns:** run location — path; every field: linear commands info runs path

**Example:** `linear personal runs path run-101`

## Códigos de salida

Decide según el código, no según el texto: el texto puede cambiar, el código no.

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
