---
title: "Команды gcal"
---

<!-- Generated from the command tree by pnpm generate. Do not edit. -->


Все команды, параметры и коды выхода, созданные из самой программы. Тот же список в JSON выводит
`gcal commands --json`.

**Первое слово — профиль**, имя, которое вы выбираете сами: `gcal personal config show`. `GCAL_PROFILE`
задаёт профиль для всего сеанса оболочки. Профиль никогда не подставляется сам: команда, которой нужен аккаунт, без
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
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run even where the config says record false; record_input false leaves the typed words out. |
| `--no-record` | do not keep this run, even if it fails. |

## `gcal commands`

every command by section; --json prints its contract, one path per call

### `gcal commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
gcal commands info [path]
```

| Argument | | What it is |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

**Returns:** one command contract, or all schemas, error reasons and explicit overrides

**Example:** `gcal commands info commands`

## `gcal session`

sign in to Google and manage this profile's sign-in

### `gcal session start`

sign in to Google in the browser; read-only unless you pass --grant write

**Changes something in the service.**

```sh
gcal session start [options]
```

| Option | What it does |
|---|---|
| `--client-file <file>` | your own Desktop app OAuth client JSON from Google Cloud Console. |
| `--no-browser` | print the sign-in URL instead of opening a browser. |
| `--credential-storage <storage>` | where the sign-in is kept: keyring (the default, which falls back to a private file by itself when no keyring works), or file, not recommended. Default: `keyring`. |
| `--grant <scopes>` | also ask for these, comma-separated: write (create, change and delete events, and answer invitations), sharing (see and change who can see a calendar). |

**Returns:** sign in to Google in the browser; read-only unless you pass --grant write

**Example:** `gcal personal session start --client-file ~/client_secret.json`, `gcal personal session start --no-browser`, `gcal personal session start --grant write,sharing`

### `gcal session status`

show this profile's saved Google sign-in; tokens are never printed

```sh
gcal session status [options]
```

| Option | What it does |
|---|---|
| `--check` | ask Google whether the sign-in still works and which account it is. |

**Returns:** show this profile's saved Google sign-in; tokens are never printed

**Example:** `gcal personal session status`, `gcal personal session status --check --json`

### `gcal session end`

sign this profile out of Google on this computer; stored calendar data stays

**Changes something on this computer only.**

```sh
gcal session end
```

**Returns:** sign this profile out of Google on this computer; stored calendar data stays

**Example:** `gcal personal session end`

### `gcal session list`

list the profiles on this computer and whether each holds a Google sign-in; picks none

```sh
gcal session list
```

**Returns:** list the profiles here and whether each is signed in

**Example:** `gcal session list`, `gcal session list --json`

## `gcal calendars`

the account's calendars

### `gcal calendars list`

list the account's calendars from the provider, and which of them sync

**Changes something on this computer only.**

```sh
gcal calendars list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** calendar — id, external_id, title, timezone, access_role, primary, synced, seen_at; every field: gcal commands info calendars list

**Example:** `gcal personal calendars list --json`, `gcal personal calendars list synced:true`

### `gcal calendars sync`

sync this calendar from now on

**Changes something on this computer only.**

```sh
gcal calendars sync <calendar>
```

| Argument | | What it is |
|---|---|---|
| `calendar` | required | the calendar's id, or the provider's id. |

**Returns:** calendar — id, external_id, title, timezone, access_role, primary, synced, seen_at; every field: gcal commands info calendars sync

**Example:** `gcal personal calendars sync 3`

### `gcal calendars unsync`

stop syncing this calendar; what is stored stays

**Changes something on this computer only.**

```sh
gcal calendars unsync <calendar>
```

| Argument | | What it is |
|---|---|---|
| `calendar` | required | the calendar's id, or the provider's id. |

**Returns:** calendar — id, external_id, title, timezone, access_role, primary, synced, seen_at; every field: gcal commands info calendars unsync

**Example:** `gcal personal calendars unsync 3`

### `gcal calendars busy`

when calendars and people are taken, asked of the provider and not stored; with --duration-minutes, the free stretches they share

```sh
gcal calendars busy [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--duration-minutes <minutes>` | find free stretches at least this long, 5–1440. |
| `--hours <from-to>` | working hours in your time zone, Monday to Friday, with --duration-minutes. Default: `09:00-17:00`. |

**Returns:** calendar busy — start, end, timezone, calendars, slots, unknown; every field: gcal commands info calendars busy

**Example:** `gcal personal calendars busy person:ana@example.com --json`, `gcal personal calendars busy start>=2026-11-02 end<=2026-11-06 person:ana@example.com --duration-minutes 30 --hours 10:00-16:00`

## `gcal sync`

bring the synced calendars up to date: what changed since the last sync, or everything with --rescan; a run stops before its deadline or --max-pages and the next one goes on from there

**Changes something on this computer only.**

```sh
gcal sync [options]
```

| Option | What it does |
|---|---|
| `--rescan` | list every synced calendar's window again, dropping a round in progress. |
| `--max-pages <pages>` | at most this many requests to the provider in this run; as many as fit the deadline if not given. |
| `--embed` | also index new events for meaning search, with a model already downloaded. |

**Returns:** calendar sync — provider, account_id, window, calendars, synced, not_synced, complete, state, and 4 more; every field: gcal commands info sync

**Example:** `gcal personal sync`, `gcal personal sync --rescan --embed`, `gcal personal sync --timeout 2m`

## `gcal store`

the local store of calendar events

### `gcal store status`

how far each synced calendar's sync is: entries done, partial or complete, and when it last moved

```sh
gcal store status
```

**Returns:** calendar sync progress — calendar_id, external_id, title, round, job, profile, done, total, and 5 more; every field: gcal commands info store status

**Example:** `gcal personal store status --json`

## `gcal events`

the account's stored events

### `gcal events list`

list stored events, earliest first

```sh
gcal events list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | events at most, 1–1000. Default: `100`. |

**Returns:** event — id, event_series_id, title, description, location, starts_at, ends_at, timezone, and 12 more; every field: gcal commands info events list

**Example:** `gcal personal events list starts_at>=2026-11-02 starts_at<2026-11-07 --json`, `gcal personal events list ends_at>=today person:ana@example.com`

### `gcal events show`

one event: its calendar copies, attendees with their person, Drive files and history

```sh
gcal events show <event>
```

| Argument | | What it is |
|---|---|---|
| `event` | required | the event's id, or event:<id>. |

**Returns:** calendar event — id, event_series_id, title, description, location, starts_at, ends_at, timezone, and 17 more; every field: gcal commands info events show

**Example:** `gcal personal events show event:42 --json`

### `gcal events create`

add an event to a calendar; with --repeat, one that repeats

**Changes something in the service.**

```sh
gcal events create <calendar> [options]
```

| Argument | | What it is |
|---|---|---|
| `calendar` | required | the calendar's id, or the provider's id. |

| Option | What it does |
|---|---|
| `--title <title>` | the event's title. |
| `--start-time <time>` | when it starts: a time in your zone, or one with its own. |
| `--end-time <time>` | when it ends. |
| `--start-date <date>` | the first day of an all-day event, YYYY-MM-DD. |
| `--end-date <date>` | the last day of an all-day event. |
| `--location <text>` | where; empty clears it. |
| `--description <text>` | the details; empty clears it. |
| `--attendee <email>` | an attendee; repeat for each. Default: ``. |
| `--repeat <rule>` | how it repeats: an RFC 5545 rule: FREQ=DAILY\|WEEKLY\|MONTHLY, and INTERVAL, BYDAY (MO,WE; in MONTHLY also 1MO or -1FR), COUNT or UNTIL (a date, YYYYMMDD, for an all-day event; a UTC time, YYYYMMDDTHHMMSSZ, for a timed one). |
| `--notify` | the provider mails the other attendees; needs events.notify allowed; this or --no-notify is required when there are other attendees. |
| `--no-notify` | the provider mails nobody. |
| `--id <id>` | the id a create that ended in outcome_unknown named: a retry finds that event. |

**Returns:** calendar event write — operation_id, event, entry, scope, removed, ended, converted, from_calendar, and 3 more; every field: gcal commands info events create

**Example:** `gcal personal events create 3 --title 'Example planning' --start-time 2026-11-02T10:00 --end-time 2026-11-02T11:00`, `gcal personal events create 3 --title 'Example review' --start-date 2026-11-03 --end-date 2026-11-03 --attendee ana@example.com --no-notify`, `gcal personal events create 3 --title 'Example standup' --start-time 2026-11-02T09:30 --end-time 2026-11-02T09:45 --repeat 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12'`

### `gcal events update`

change an event; with --series every occurrence of the repeating event, with --following this occurrence and every later one; new times or dates switch it between timed and all-day

**Changes something in the service.**

```sh
gcal events update <event> [options]
```

| Argument | | What it is |
|---|---|---|
| `event` | required | the event's id, or event:<id>. |

| Option | What it does |
|---|---|
| `--title <title>` | the event's title. |
| `--start-time <time>` | when it starts: a time in your zone, or one with its own. |
| `--end-time <time>` | when it ends. |
| `--start-date <date>` | the first day of an all-day event, YYYY-MM-DD. |
| `--end-date <date>` | the last day of an all-day event. |
| `--location <text>` | where; empty clears it. |
| `--description <text>` | the details; empty clears it. |
| `--attendee <email>` | an attendee; repeat for each, replacing the list. Default: ``. |
| `--repeat <rule>` | how it repeats, with --series: an RFC 5545 rule: FREQ=DAILY\|WEEKLY\|MONTHLY, and INTERVAL, BYDAY (MO,WE; in MONTHLY also 1MO or -1FR), COUNT or UNTIL (a date, YYYYMMDD, for an all-day event; a UTC time, YYYYMMDDTHHMMSSZ, for a timed one). |
| `--calendar <id>` | the calendar, when the event is on more than one of the account's. |
| `--series` | change the whole repeating event, not only this occurrence. |
| `--following` | change this occurrence and every later one: the repeating event ends before it and a new one starts with the change. |
| `--id <id>` | with --following, the id an outcome_unknown named: a retry finds that new series. |
| `--notify` | the provider mails the other attendees; needs events.notify allowed; this or --no-notify is required when there are other attendees. |
| `--no-notify` | the provider mails nobody. |

**Returns:** calendar event write — operation_id, event, entry, scope, removed, ended, converted, from_calendar, and 3 more; every field: gcal commands info events update

**Example:** `gcal personal events update event:42 --start-time 2026-11-02T14:00 --end-time 2026-11-02T15:00 --notify`, `gcal personal events update event:42 --series --repeat 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20261231T230000Z' --no-notify`, `gcal personal events update event:42 --following --start-time 2026-11-09T10:00 --end-time 2026-11-09T10:30 --no-notify`

### `gcal events delete`

delete an event; a whole repeating event, or every later occurrence, needs events.delete.series allowed first

**Changes something in the service.**

```sh
gcal events delete <event> [options]
```

| Argument | | What it is |
|---|---|---|
| `event` | required | the event's id, or event:<id>. |

| Option | What it does |
|---|---|
| `--calendar <id>` | the calendar, when the event is on more than one of the account's. |
| `--series` | delete the whole repeating event, not only this occurrence. |
| `--following` | delete this occurrence and every later one: the repeating event ends before it. |
| `--notify` | the provider mails the other attendees; needs events.notify allowed; this or --no-notify is required when there are other attendees. |
| `--no-notify` | the provider mails nobody. |

**Returns:** calendar event write — operation_id, event, entry, scope, removed, ended, converted, from_calendar, and 3 more; every field: gcal commands info events delete

**Example:** `gcal personal events delete event:42 --no-notify`, `gcal personal events delete event:42 --following --no-notify`

### `gcal events move`

move an event, with its id, to another calendar of the account; a repeating one moves whole

**Changes something in the service.**

```sh
gcal events move <event> [options]
```

| Argument | | What it is |
|---|---|---|
| `event` | required | the event's id, or event:<id>. |

| Option | What it does |
|---|---|
| `--calendar <id>` | the calendar, when the event is on more than one of the account's. |
| `--to-calendar <id>` | the calendar to move it to: its id, or the provider's id. |
| `--series` | move the whole repeating event an occurrence belongs to. |
| `--notify` | the provider mails the other attendees; needs events.notify allowed; this or --no-notify is required when there are other attendees. |
| `--no-notify` | the provider mails nobody. |

**Returns:** calendar event write — operation_id, event, entry, scope, removed, ended, converted, from_calendar, and 3 more; every field: gcal commands info events move

**Example:** `gcal personal events move event:42 --to-calendar 4 --no-notify`

### `gcal events respond`

answer an invitation; the organiser is told only with --notify

**Changes something in the service.**

```sh
gcal events respond <event> <response> [options]
```

| Argument | | What it is |
|---|---|---|
| `event` | required | the event's id, or event:<id>. |
| `response` | required | the answer. One of: `accepted`, `tentative`, `declined`. |

| Option | What it does |
|---|---|
| `--calendar <id>` | the calendar, when the event is on more than one of the account's. |
| `--notify` | the provider mails the other attendees; needs events.notify allowed; this or --no-notify is required when there are other attendees. |
| `--no-notify` | the provider mails nobody. |

**Returns:** calendar event write — operation_id, event, entry, scope, removed, ended, converted, from_calendar, and 3 more; every field: gcal commands info events respond

**Example:** `gcal personal events respond event:42 accepted --notify`

## `gcal search`

find stored things by text: events

### `gcal search events`

find stored events by words, and by meaning when its model is downloaded; with --backend server, ask the provider instead

```sh
gcal search events <query> [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | required | what to find in titles, descriptions, places and attendees. |

| Option | What it does |
|---|---|
| `--limit <n>` | events per page. Default: `20`. |
| `--cursor <cursor>` | continue from a page's next_offset. Default: `0`. |
| `--exact` | every word as written, no word stems. |
| `--newest` | latest start first instead of best first. |
| `--backend <archive\|server\|both>` | where to search: archive, the local store, or server, the provider's own search over the synced calendars, earliest first. One of: `archive`, `server`, `both`. Default: `archive`. |

**Returns:** calendar search hit — provider, account, title, starts_at, ends_at, all_day, status, location, and 9 more; every field: gcal commands info search events

**Example:** `gcal personal search events roadmap planning --json`, `gcal personal search events --backend server quarterly review`

## `gcal people`

the people in the account's events

### `gcal people list`

one event's attendees, or everyone attending this week's events

```sh
gcal people list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** calendar attendee — email, name, response, organizer, optional, resource, self, person, and 2 more; every field: gcal commands info people list

**Example:** `gcal personal people list --json`, `gcal personal people list event:42`

### `gcal people link`

join an attendee to a person the owner knows elsewhere

**Changes something on this computer only.**

```sh
gcal people link <person> <other>
```

| Argument | | What it is |
|---|---|---|
| `person` | required | an attendee's address as email:<address>, or a person:<id>. |
| `other` | required | the same person in another tool, as <provider>:<person>, or me. |

**Returns:** calendar linked person — person, name, identities; every field: gcal commands info people link

**Example:** `gcal personal people link email:ana@example.com telegram:12345`

## `gcal links`

calendar copies the rules could not join alone

### `gcal links review`

copies that fit two or more events equally well, waiting for the owner's choice

```sh
gcal links review
```

**Returns:** calendar link review — id, entry_id, reason, candidates, untrusted; every field: gcal commands info links review

**Example:** `gcal personal links review --json`

### `gcal links resolve`

join a copy to the event you choose, or keep it apart

**Changes something on this computer only.**

```sh
gcal links resolve <review> <choice>
```

| Argument | | What it is |
|---|---|---|
| `review` | required | the review's id from links review. |
| `choice` | required | one of its candidates, as event:<id>, or apart. |

**Returns:** calendar link resolution — id, status, chosen; every field: gcal commands info links resolve

**Example:** `gcal personal links resolve 7 event:42`

## `gcal api`

discover and call the official Google Calendar API methods

### `gcal api list`

list the Google Calendar API methods gcal can call

```sh
gcal api list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** api method — name, mutates, destructive, scope; every field: gcal commands info api list

**Example:** `gcal personal api list`, `gcal personal api list service:calendar`

### `gcal api show`

show one method's request schema and contract, without calling Google

```sh
gcal api show <method>
```

| Argument | | What it is |
|---|---|---|
| `method` | required | Google method name, as api list prints it. |

**Returns:** show one method's request schema and contract, without calling Google

**Example:** `gcal personal api show calendar.events.list --json`

### `gcal api call`

call one Google Calendar API method by name with JSON parameters

**Changes something in the service.**

```sh
gcal api call <method> [options]
```

| Argument | | What it is |
|---|---|---|
| `method` | required | Google method name, as api list prints it. |

| Option | What it does |
|---|---|
| `--params <json>` | query and path parameters as a JSON object; none if left out. |
| `--body <json>` | request body as a JSON object. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** call one Google Calendar API method by name with JSON parameters

**Example:** `gcal personal api call calendar.events.list --params '{"calendarId":"primary","maxResults":10}'`, `gcal personal api call calendar.freebusy.query --body '{"timeMin":"2026-11-02T00:00:00Z","timeMax":"2026-11-03T00:00:00Z","items":[{"id":"primary"}]}'`

### `gcal api calendar-acl-delete`

Deletes an access control rule. — destructive (DELETE calendars/{calendarId}/acl/{ruleId})

**Changes something in the service.**

```sh
gcal api calendar-acl-delete [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--rule-id <value>` | ACL rule identifier. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Deletes an access control rule. — destructive (DELETE…

**Example:** `gcal personal api calendar-acl-delete --rule-id <value> --calendar-id <value>`

### `gcal api calendar-acl-get`

Returns an access control rule. — read (GET calendars/{calendarId}/acl/{ruleId})

```sh
gcal api calendar-acl-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--rule-id <value>` | ACL rule identifier. |

**Returns:** Returns an access control rule. — read (GET calendars/{calendarId}/acl/{ruleId})

**Example:** `gcal personal api calendar-acl-get --calendar-id <value> --rule-id <value>`

### `gcal api calendar-acl-insert`

Creates an access control rule. — write (POST calendars/{calendarId}/acl)

**Changes something in the service.**

```sh
gcal api calendar-acl-insert [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--send-notifications <value>` | Whether to send notifications about the calendar sharing change. Optional. The default is True. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Creates an access control rule. — write (POST calendars/{calendarId}/acl)

**Example:** `gcal personal api calendar-acl-insert --calendar-id <value>`

### `gcal api calendar-acl-list`

Returns the rules in the access control list for the calendar. — read (GET calendars/{calendarId}/acl)

```sh
gcal api calendar-acl-list [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--max-results <value>` | Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional. |
| `--show-deleted <value>` | Whether to include deleted ACLs in the result. Deleted ACLs are represented by role equal to "none". Deleted ACLs will always be included if syncToken is provided. Optional. The default is False. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--sync-token <value>` | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All entries deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. |
| `--page-token <value>` | Token specifying which result page to return. Optional. |

**Returns:** Returns the rules in the access control list for the calendar. — read (GET…

**Example:** `gcal personal api calendar-acl-list --calendar-id <value>`

### `gcal api calendar-acl-patch`

Updates an access control rule. This method supports patch semantics. — write (PATCH calendars/{calendarId}/acl/{ruleId})

**Changes something in the service.**

```sh
gcal api calendar-acl-patch [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--rule-id <value>` | ACL rule identifier. |
| `--send-notifications <value>` | Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an access control rule. This method supports patch semantics. —…

**Example:** `gcal personal api calendar-acl-patch --calendar-id <value> --rule-id <value>`

### `gcal api calendar-acl-update`

Updates an access control rule. — write (PUT calendars/{calendarId}/acl/{ruleId})

**Changes something in the service.**

```sh
gcal api calendar-acl-update [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--rule-id <value>` | ACL rule identifier. |
| `--send-notifications <value>` | Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an access control rule. — write (PUT…

**Example:** `gcal personal api calendar-acl-update --rule-id <value> --calendar-id <value>`

### `gcal api calendar-calendar-list-delete`

Removes a calendar from the user's calendar list. — destructive (DELETE users/me/calendarList/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendar-list-delete [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Removes a calendar from the user's calendar list. — destructive (DELETE…

**Example:** `gcal personal api calendar-calendar-list-delete --calendar-id <value>`

### `gcal api calendar-calendar-list-get`

Returns a calendar from the user's calendar list. — read (GET users/me/calendarList/{calendarId})

```sh
gcal api calendar-calendar-list-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

**Returns:** Returns a calendar from the user's calendar list. — read (GET…

**Example:** `gcal personal api calendar-calendar-list-get --calendar-id <value>`

### `gcal api calendar-calendar-list-insert`

Inserts an existing calendar into the user's calendar list. — write (POST users/me/calendarList)

**Changes something in the service.**

```sh
gcal api calendar-calendar-list-insert [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--color-rgb-format <value>` | Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Inserts an existing calendar into the user's calendar list. — write (POST…

**Example:** `gcal personal api calendar-calendar-list-insert`

### `gcal api calendar-calendar-list-list`

Returns the calendars on the user's calendar list. — read (GET users/me/calendarList)

```sh
gcal api calendar-calendar-list-list [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--show-hidden <value>` | Whether to show hidden entries. Optional. The default is False. |
| `--show-own-organization-only <value>` | Whether to show only entries for calendars from the organization. This parameter is only applicable to Google Workspace users. Optional. The default is False. |
| `--min-access-role <value>` | The minimum access role for the user in the returned entries. Optional. The default is no restriction. |
| `--sync-token <value>` | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If only read-only fields such as calendar properties or ACLs have changed, the entry won't be returned. All entries deleted and hidden since the previous list request will always be in the result set and it is not allowed to set showDeleted neither showHidden to False. |
| `--max-results <value>` | Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional. |
| `--page-token <value>` | Token specifying which result page to return. Optional. |
| `--show-deleted <value>` | Whether to include deleted calendar list entries in the result. Optional. The default is False. |

**Returns:** Returns the calendars on the user's calendar list. — read (GET…

**Example:** `gcal personal api calendar-calendar-list-list`

### `gcal api calendar-calendar-list-patch`

Updates an existing calendar on the user's calendar list. This method supports patch semantics. — write (PATCH users/me/calendarList/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendar-list-patch [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--color-rgb-format <value>` | Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an existing calendar on the user's calendar list. This method…

**Example:** `gcal personal api calendar-calendar-list-patch --calendar-id <value>`

### `gcal api calendar-calendar-list-update`

Updates an existing calendar on the user's calendar list. — write (PUT users/me/calendarList/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendar-list-update [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--color-rgb-format <value>` | Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an existing calendar on the user's calendar list. — write (PUT…

**Example:** `gcal personal api calendar-calendar-list-update --calendar-id <value>`

### `gcal api calendar-calendars-clear`

Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account. — destructive (POST calendars/{calendarId}/clear)

**Changes something in the service.**

```sh
gcal api calendar-calendars-clear [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Clears a primary calendar. This operation deletes all events associated with…

**Example:** `gcal personal api calendar-calendars-clear --calendar-id <value>`

### `gcal api calendar-calendars-delete`

Deletes a secondary calendar. Use calendars.clear for clearing all events on primary calendars. — destructive (DELETE calendars/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendars-delete [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Deletes a secondary calendar. Use calendars.clear for clearing all events on…

**Example:** `gcal personal api calendar-calendars-delete --calendar-id <value>`

### `gcal api calendar-calendars-get`

Returns metadata for a calendar. — read (GET calendars/{calendarId})

```sh
gcal api calendar-calendars-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

**Returns:** Returns metadata for a calendar. — read (GET calendars/{calendarId})

**Example:** `gcal personal api calendar-calendars-get --calendar-id <value>`

### `gcal api calendar-calendars-insert`

Creates a secondary calendar. — write (POST calendars)

**Changes something in the service.**

```sh
gcal api calendar-calendars-insert [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Creates a secondary calendar. — write (POST calendars)

**Example:** `gcal personal api calendar-calendars-insert`

### `gcal api calendar-calendars-patch`

Updates metadata for a calendar. This method supports patch semantics. — write (PATCH calendars/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendars-patch [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates metadata for a calendar. This method supports patch semantics. —…

**Example:** `gcal personal api calendar-calendars-patch --calendar-id <value>`

### `gcal api calendar-calendars-transfer-ownership`

Transfers a secondary calendar between users within a Google Workspace organization. Requires user authentication with Manage Calendars administrator privilege, and one of the following authorization scopes:  — destructive (POST calendars/{calendarId}/transferOwnership)

**Changes something in the service.**

```sh
gcal api calendar-calendars-transfer-ownership [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--use-admin-access <value>` | When true, the method runs using the user's Google Workspace administrator privileges. The calling user must be a Google Workspace administrator with the Manage Calendars privilege. This method currently only supports admin access, thus only true is accepted for this field. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs, call the calendarList.list method. |
| `--new-data-owner <value>` | The email address of a user who will become the data owner of the calendar. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Transfers a secondary calendar between users within a Google Workspace…

**Example:** `gcal personal api calendar-calendars-transfer-ownership --use-admin-access <value> --calendar-id <value> --new-data-owner <value>`

### `gcal api calendar-calendars-update`

Updates metadata for a calendar. — write (PUT calendars/{calendarId})

**Changes something in the service.**

```sh
gcal api calendar-calendars-update [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates metadata for a calendar. — write (PUT calendars/{calendarId})

**Example:** `gcal personal api calendar-calendars-update --calendar-id <value>`

### `gcal api calendar-colors-get`

Returns the color definitions for calendars and events. — read (GET colors)

```sh
gcal api calendar-colors-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |

**Returns:** Returns the color definitions for calendars and events. — read (GET colors)

**Example:** `gcal personal api calendar-colors-get`

### `gcal api calendar-events-delete`

Deletes an event. — destructive (DELETE calendars/{calendarId}/events/{eventId})

**Changes something in the service.**

```sh
gcal api calendar-events-delete [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--send-updates <value>` | Guests who should receive notifications about the deletion of the event. |
| `--event-id <value>` | Event identifier. |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Deletes an event. — destructive (DELETE calendars/{calendarId}/events/{eventId})

**Example:** `gcal personal api calendar-events-delete --event-id <value> --calendar-id <value>`

### `gcal api calendar-events-get`

Returns an event based on its Google Calendar ID. To retrieve an event using its iCalendar ID, call the events.list method using the iCalUID parameter. — read (GET calendars/{calendarId}/events/{eventId})

```sh
gcal api calendar-events-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--time-zone <value>` | Time zone used in the response. Optional. The default is the time zone of the calendar. |
| `--always-include-email <value>` | Deprecated and ignored. A value will always be returned in the email field for the organizer, creator and attendees, even if no real email address is available (i.e. a generated, non-working value will be provided). |
| `--event-id <value>` | Event identifier. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

**Returns:** Returns an event based on its Google Calendar ID. To retrieve an event using…

**Example:** `gcal personal api calendar-events-get --event-id <value> --calendar-id <value>`

### `gcal api calendar-events-import`

Imports an event. This operation is used to add a private copy of an existing event to a calendar. Only events with an eventType of default may be imported. — write (POST calendars/{calendarId}/events/import)

**Changes something in the service.**

```sh
gcal api calendar-events-import [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--supports-attachments <value>` | Whether API client performing operation supports event attachments. Optional. The default is False. |
| `--event-label-version <value>` | Version number of the event label feature supported by the API client. Version 0 assumes no event label support and processes the colorId field for color management. Version 1 enables support for event labels, and processes the eventLabelId in the event's body. In this case, the colorId field is ignored. The default is 0. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--conference-data-version <value>` | Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Imports an event. This operation is used to add a private copy of an…

**Example:** `gcal personal api calendar-events-import --calendar-id <value>`

### `gcal api calendar-events-insert`

Creates an event. — write (POST calendars/{calendarId}/events)

**Changes something in the service.**

```sh
gcal api calendar-events-insert [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--supports-attachments <value>` | Whether API client performing operation supports event attachments. Optional. The default is False. |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--event-label-version <value>` | Version number of the event label feature supported by the API client. Version 0 assumes no event label support and processes the colorId field for color management. Version 1 enables support for event labels, and processes the eventLabelId in the event's body. In this case, the colorId field is ignored. The default is 0. |
| `--conference-data-version <value>` | Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--send-updates <value>` | Whether to send notifications about the creation of the new event. Note that some emails might still be sent. The default is false. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Creates an event. — write (POST calendars/{calendarId}/events)

**Example:** `gcal personal api calendar-events-insert --calendar-id <value>`

### `gcal api calendar-events-instances`

Returns instances of the specified recurring event. — read (GET calendars/{calendarId}/events/{eventId}/instances)

```sh
gcal api calendar-events-instances [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--event-id <value>` | Recurring event identifier. |
| `--time-min <value>` | Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset. |
| `--page-token <value>` | Token specifying which result page to return. Optional. |
| `--always-include-email <value>` | Deprecated and ignored. A value will always be returned in the email field for the organizer, creator and attendees, even if no real email address is available (i.e. a generated, non-working value will be provided). |
| `--max-results <value>` | Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--show-deleted <value>` | Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events will still be included if singleEvents is False. Optional. The default is False. |
| `--time-zone <value>` | Time zone used in the response. Optional. The default is the time zone of the calendar. |
| `--original-start <value>` | The original start time of the instance in the result. Optional. |
| `--time-max <value>` | Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset. |

**Returns:** Returns instances of the specified recurring event. — read (GET…

**Example:** `gcal personal api calendar-events-instances --event-id <value> --calendar-id <value>`

### `gcal api calendar-events-list`

Returns events on the specified calendar. — read (GET calendars/{calendarId}/events)

```sh
gcal api calendar-events-list [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--time-zone <value>` | Time zone used in the response. Optional. The default is the time zone of the calendar. |
| `--time-min <value>` | Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax. |
| `--sync-token <value>` | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--show-hidden-invitations <value>` | Whether to include hidden invitations in the result. Optional. The default is False. |
| `--event-types <value>` | Event types to return. Optional. This parameter can be repeated multiple times to return events of different types. If unset, returns all event types. |
| `--time-max <value>` | Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin. |
| `--always-include-email <value>` | Deprecated and ignored. |
| `--q <value>` | Free text search terms to find events that match these terms in the following fields:. |
| `--show-deleted <value>` | Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False. |
| `--max-results <value>` | Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. |
| `--i-cal-uid <value>` | Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID. |
| `--order-by <value>` | The order of the events returned in the result. Optional. The default is an unspecified, stable order. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--updated-min <value>` | Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time. |
| `--shared-extended-property <value>` | Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints. |
| `--single-events <value>` | Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False. |
| `--private-extended-property <value>` | Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints. |
| `--page-token <value>` | Token specifying which result page to return. Optional. |

**Returns:** Returns events on the specified calendar. — read (GET…

**Example:** `gcal personal api calendar-events-list --calendar-id <value>`

### `gcal api calendar-events-move`

Moves an event to another calendar, i.e. changes an event's organizer. Note that only default events can be moved; birthday, focusTime, fromGmail, outOfOffice and workingLocation events cannot be moved. — write (POST calendars/{calendarId}/events/{eventId}/move)

**Changes something in the service.**

```sh
gcal api calendar-events-move [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--send-updates <value>` | Guests who should receive notifications about the change of the event's organizer. |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--event-id <value>` | Event identifier. |
| `--destination <value>` | Calendar identifier of the target calendar where the event is to be moved to. |
| `--calendar-id <value>` | Calendar identifier of the source calendar where the event currently is on. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Moves an event to another calendar, i.e. changes an event's organizer. Note…

**Example:** `gcal personal api calendar-events-move --event-id <value> --destination <value> --calendar-id <value>`

### `gcal api calendar-events-patch`

Updates an event. This method supports patch semantics. — write (PATCH calendars/{calendarId}/events/{eventId})

**Changes something in the service.**

```sh
gcal api calendar-events-patch [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--send-updates <value>` | Guests who should receive notifications about the event update (for example, title changes, etc.). |
| `--supports-attachments <value>` | Whether API client performing operation supports event attachments. Optional. The default is False. |
| `--event-label-version <value>` | Version number of the event label feature supported by the API client. Version 0 assumes no event label support and processes the colorId field for color management. Version 1 enables support for event labels, and processes the eventLabelId in the event's body. In this case, the colorId field is ignored. The default is 0. |
| `--event-id <value>` | Event identifier. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--always-include-email <value>` | Deprecated and ignored. A value will always be returned in the email field for the organizer, creator and attendees, even if no real email address is available (i.e. a generated, non-working value will be provided). |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--conference-data-version <value>` | Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an event. This method supports patch semantics. — write (PATCH…

**Example:** `gcal personal api calendar-events-patch --event-id <value> --calendar-id <value>`

### `gcal api calendar-events-quick-add`

Creates an event based on a simple text string. — write (POST calendars/{calendarId}/events/quickAdd)

**Changes something in the service.**

```sh
gcal api calendar-events-quick-add [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--send-updates <value>` | Guests who should receive notifications about the creation of the new event. |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--text <value>` | The text describing the event to be created. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Creates an event based on a simple text string. — write (POST…

**Example:** `gcal personal api calendar-events-quick-add --text <value> --calendar-id <value>`

### `gcal api calendar-events-update`

Updates an event. — write (PUT calendars/{calendarId}/events/{eventId})

**Changes something in the service.**

```sh
gcal api calendar-events-update [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--calendar-id <value>` | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `--max-attendees <value>` | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `--supports-attachments <value>` | Whether API client performing operation supports event attachments. Optional. The default is False. |
| `--event-id <value>` | Event identifier. |
| `--send-notifications <value>` | Deprecated. Please use sendUpdates instead. |
| `--conference-data-version <value>` | Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0. |
| `--send-updates <value>` | Guests who should receive notifications about the event update (for example, title changes, etc.). |
| `--event-label-version <value>` | Version number of the event label feature supported by the API client. Version 0 assumes no event label support and processes the colorId field for color management. Version 1 enables support for event labels, and processes the eventLabelId in the event's body. In this case, the colorId field is ignored. The default is 0. |
| `--always-include-email <value>` | Deprecated and ignored. A value will always be returned in the email field for the organizer, creator and attendees, even if no real email address is available (i.e. a generated, non-working value will be provided). |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |
| `--dry-run` | show every permission this call checks, with its level, and call nothing. |

**Returns:** Updates an event. — write (PUT calendars/{calendarId}/events/{eventId})

**Example:** `gcal personal api calendar-events-update --calendar-id <value> --event-id <value>`

### `gcal api calendar-freebusy-query`

Returns free/busy information for a set of calendars. — read (POST freeBusy)

```sh
gcal api calendar-freebusy-query [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

**Returns:** Returns free/busy information for a set of calendars. — read (POST freeBusy)

**Example:** `gcal personal api calendar-freebusy-query`

### `gcal api calendar-settings-get`

Returns a single user setting. — read (GET users/me/settings/{setting})

```sh
gcal api calendar-settings-get [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--setting <value>` | The id of the user setting. |

**Returns:** Returns a single user setting. — read (GET users/me/settings/{setting})

**Example:** `gcal personal api calendar-settings-get --setting <value>`

### `gcal api calendar-settings-list`

Returns all user settings for the authenticated user. — read (GET users/me/settings)

```sh
gcal api calendar-settings-list [options]
```

| Option | What it does |
|---|---|
| `--alt <value>` | Data format for the response. |
| `--fields <value>` | Selector specifying which fields to include in a partial response. |
| `--user-ip <value>` | Deprecated. Please use quotaUser instead. |
| `--pretty-print <value>` | Returns response with indentations and line breaks. |
| `--quota-user <value>` | An opaque string that represents a user for quota purposes. Must not exceed 40 characters. |
| `--page-token <value>` | Token specifying which result page to return. Optional. |
| `--sync-token <value>` | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. |
| `--max-results <value>` | Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional. |

**Returns:** Returns all user settings for the authenticated user. — read (GET…

**Example:** `gcal personal api calendar-settings-list`

## `gcal doctor`

check this installation: version, paths, config, profiles, store, OAuth client, where each sign-in is kept; no keyring or network

```sh
gcal doctor
```

**Returns:** check this installation; no keyring or network

**Example:** `gcal doctor`, `gcal doctor --json`

## `gcal models`

models that run on this machine

### `gcal models list`

speech and embedding models, their download status and the default of each kind

```sh
gcal models list [query]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: gcal commands info models list

**Next usually:** `gcal models download <model>`

**Example:** `gcal models list`, `gcal models list kind:text`

### `gcal models download`

download and verify one speech or embedding model

**Changes something on this computer only.**

```sh
gcal models download <model> [options]
```

| Argument | | What it is |
|---|---|---|
| `model` | required | a model id from models list. |

| Option | What it does |
|---|---|
| `--offline` | refuse a download that needs the network. |
| `--accept-terms` | accept the model's licence terms, for a model that has its own. |

**Returns:** model — id, kind, title, languages, size_bytes, downloaded, default, path, and 1 more; every field: gcal commands info models download

**Example:** `gcal models download e5-small`

## `gcal guide`

scenarios: the commands for a common task, in order, and why each

```sh
gcal guide [name]
```

| Argument | | What it is |
|---|---|---|
| `name` | optional | one scenario; without it, the list. |

**Returns:** scenarios: the commands for a common task, in order, and why each

**Example:** `gcal guide`, `gcal guide agent-access --json`

## `gcal skill`

the instructions an agent is given for this tool

### `gcal skill show`

print SKILL.md — `gcal skill install` puts it where Claude Code, Codex, Gemini CLI and OpenClaw look for it, and where Hermes does on request; --for prints the copy already there

```sh
gcal skill show [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | print the copy installed for these agents instead of this version's. One of: `claude`, `agents`. |

**Returns:** print the tool's instructions for AI agents

**Example:** `gcal skill show`

### `gcal skill install`

write SKILL.md to \~/.claude/skills/gcal-cli/ (Claude Code) and \~/.agents/skills/gcal-cli/ (Codex, Gemini CLI, OpenClaw); --for hermes also has Hermes read \~/.agents/skills, which changes Hermes's own settings, so all leaves it out

**Changes something on this computer only.**

```sh
gcal skill install [options]
```

| Option | What it does |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `hermes`, `all`. Default: `all`. |

**Returns:** install the tool's instructions for AI agents

**Example:** `gcal skill install --for agents`

### `gcal skill status`

for each place `gcal skill install` writes to, and for the copy Hermes reads: the path, the version installed there, and whether it is current, stale, missing or unversioned

```sh
gcal skill status
```

**Returns:** whether the installed instructions for AI agents match this version

**Example:** `gcal skill status`, `gcal skill status --json`

## `gcal mcp`

serve this profile to an agent over MCP and set it up — `claude mcp add gcal -- gcal <profile> mcp serve`

### `gcal mcp serve`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add gcal -- gcal <profile> mcp serve`; `gcal mcp serve --profiles a,b` or `--profiles all` serves those profiles from one server and each tool asks which

**Changes something in the service.**

```sh
gcal mcp serve [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.calendar.events.insert=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |

**Returns:** serve this profile's commands to an AI agent

**Example:** `gcal personal mcp serve`, `gcal mcp serve --profiles work,personal`, `gcal personal mcp serve --http --public-url https://laptop.example.ts.net`

### `gcal mcp revoke`

forget every login `mcp serve --http` gave a browser app, of this profile or of the server `--profiles` names; each app must log in again

**Changes something on this computer only.**

```sh
gcal mcp revoke [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** forget every login given to a browser app

**Example:** `gcal personal mcp revoke`, `gcal mcp revoke --profiles all`

### `gcal mcp server`

start, stop and check `mcp serve --http` in the background; status shows the login code for a browser app

#### `gcal mcp server start`

start `mcp serve --http` apart from this shell and answer once it listens, with its login code

**Changes something on this computer only.**

```sh
gcal mcp server start [options]
```

| Option | What it does |
|---|---|
| `--port <port>` | the local port (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net or https://<name>.ts.net/tg. |
| `--permission <key=level>` | make a permission stricter for this server only; repeat for more keys. |
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** start the HTTP MCP server in the background

**Example:** `gcal personal mcp server start --public-url https://laptop.example.ts.net`

#### `gcal mcp server stop`

stop `mcp serve --http` — only one that `mcp server start` started

**Changes something on this computer only.**

```sh
gcal mcp server stop [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** stop the background HTTP MCP server

**Example:** `gcal personal mcp server stop`

#### `gcal mcp server status`

whether `mcp serve --http` runs, on which port and address, the login code for a new browser app, and the apps logged in

```sh
gcal mcp server status [options]
```

| Option | What it does |
|---|---|
| `--profiles <names\|all>` | the server of several profiles that `mcp serve --profiles` serves: names, comma-separated, or all. |

**Returns:** whether the HTTP MCP server runs, its login code and the apps logged in

**Example:** `gcal personal mcp server status --json`

### `gcal mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
gcal mcp config [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.calendar.events.insert=deny; it never loosens the profile; repeat for more keys. |
| `--profiles <names\|all>` | serve several profiles from one server instead of one: names, comma-separated, or all for every profile. |

**Returns:** print the local MCP configuration of this profile, or of those --profiles names

**Example:** `gcal personal mcp config`, `gcal mcp config --profiles all`

### `gcal mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
gcal mcp add <client> [options]
```

| Argument | | What it is |
|---|---|---|
| `client` | required | codex or claude-code. |

| Option | What it does |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like api.calendar.events.insert=deny; it never loosens the profile; repeat for more keys. |

**Returns:** add this profile's local MCP server to Codex or Claude Code

**Example:** `gcal personal mcp add codex --allow-writes`

### `gcal mcp check`

check this profile's local MCP handshake and tool list

```sh
gcal mcp check [options]
```

| Option | What it does |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like api.calendar.events.insert=deny; it never loosens the profile; repeat for more keys. |

**Returns:** check this profile's local MCP handshake and tool list

**Example:** `gcal personal mcp check`

## `gcal upgrade`

upgrade gcal with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
gcal upgrade [options]
```

| Option | What it does |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

**Returns:** upgrade gcal with the package manager that installed it; --check only looks

**Example:** `gcal upgrade --check`

## `gcal config`

the settings in force, and where each one came from

### `gcal config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
gcal config show
```

**Returns:** the profile, the profiles that exist, and each setting with where it came from

**Example:** `gcal personal config show`

### `gcal config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
gcal config set <setting> <value> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, speech_model, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |
| `value` | required | a number, true or false; for a group tg:work,max:Alice,email:me@x. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** save a setting to the configuration file

**Example:** `gcal personal config set limit 20`

### `gcal config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
gcal config unset <setting> [options]
```

| Argument | | What it is |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, record, record_input, keep_runs_for_days, keep_successful_runs_for_days, runs_size_limit_mb, permissions, requests_per_minute, speech_model, picture_search, search_reranker, embedding_provider, embedding_model, embedding_base_url, embedding_dims, models, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin. |

| Option | What it does |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |

**Returns:** remove a setting from the configuration file

**Example:** `gcal personal config unset limit`

## `gcal runs`

recorded runs — what this tool did, and when

### `gcal runs list`

recorded runs, newest first

```sh
gcal runs list [query] [options]
```

| Argument | | What it is |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Option | What it does |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

**Returns:** run — run_id, command, started_at, status, cli_version, profile, completed_at, requests, and 23 more; every field: gcal commands info runs list

**Example:** `gcal personal runs list --limit 10`

### `gcal runs show`

one run: what it was, how it ended, and every event it logged

```sh
gcal runs show <run-id> [options]
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `gcal runs list`. |

| Option | What it does |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

**Returns:** run details — run_id, command, started_at, status, cli_version, directory, event_count, events, and 22 more; every field: gcal commands info runs show

**Example:** `gcal personal runs show run-101`

### `gcal runs path`

the directory holding one run

```sh
gcal runs path <run-id>
```

| Argument | | What it is |
|---|---|---|
| `run-id` | required | an id from `gcal runs list`. |

**Returns:** run location — path; every field: gcal commands info runs path

**Example:** `gcal personal runs path run-101`

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
| `130` | `cancelled` |
| `1` | anything else |
