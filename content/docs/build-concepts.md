---
title: "Concepts, sources and your own data"
description: "The shared store model, how to bring a provider's records in as source records and where a tool keeps tables of its own."
---

You are building a command-line tool, or an agent integration, that reads or writes the shared WireCat store. This page
gives you the model in five minutes: what kinds of record exist, how they connect, and which rules keep your tool from
breaking other tools. Below it also shows how to add a source and keep your own data. [Sign in and stay compliant](./build-sign-in.md) comes next.

## The shared store

Every WireCat tool keeps its data in one SQLite file on the owner's computer, `wirecat.db`. The `@wirecat/cli-core`
package owns that file: its tables, its migrations and the code that reads and writes them. A tool reaches the file
only through cli-core, never with its own SQL ([store rules](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md)).

## Entities and source records

- An **entity** is the real thing the owner means: a person, an event, a document. It holds no provider id.
- A **source record** is what one source says about an entity: a Telegram user, an email address, a Zoom meeting, a
  calendar entry, a Drive file. It holds the account it came from and the provider's own id.

One entity gathers source records from several sources. The same meeting in Zoom and in two calendars is one event.
The same person in Telegram and in mail is one person. Your tool writes source records; cli-core links them to
entities.

## `external_id`

The id a provider gives a record goes in `external_id`, unique within its account. A second id the provider also uses
gets a named column of its own, such as `ical_uid`. Never a column named after the provider, and never only inside
`metadata` ([WC-DATA-3](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-3--a-providers-id-goes-in-external_id)).

## Links

A link from a source record to its entity records how it was made, how sure it is, who made it and when. Every change
is logged, so a wrong link can be undone. Three rules hold everywhere:

1. A link the owner made is never replaced by an automatic one.
2. Two equally good candidates make no link.
3. A matching title or an overlapping time alone never links two records.

The rules are [WC-DATA-6](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-6--every-link-records-how-it-was-made-the-owners-link-wins-ambiguity-makes-no-link).
How links look to a reader is on [How things are linked](./how-things-are-linked.md).

## Core entities and your own tables

A record more than one tool may need is a **core entity**: its table lives in cli-core. A table only your tool needs,
such as a sync checkpoint or a cache, lives in your tool's own SQLite file, and no other tool reads it
([WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private)).
See [Keep your own data](./build-concepts.md#keep-your-own-data).

## More in the store

- **The provider registry.** Your tool records its provider (name, kind, aliases, command) in the store each time it
  runs, so every other tool knows the new source without a cli-core release. Rows of a provider no tool has recorded
  are skipped and reported, never searched as messages. See [Add a source](./build-concepts.md#add-a-source).
- **The review list.** Pairs the tools cannot tell apart, such as two events for one meeting, wait there for the
  owner to decide.
- **Calendar entries and files** are source records of events and documents, and every identity can hold an email
  address, so one address joins one person.

## What breaks if you skip this

A provider id kept only in `metadata` cannot be updated by key, so every sync makes a duplicate. A link made by title
alone joins two different meetings, and the owner sees the wrong recording. SQL against the shared file breaks on the
next cli-core migration.

Next: [Add a source](./build-concepts.md#add-a-source).

## Add a source

You have a service, such as a calendar, a meeting app or a file store, and you want its records in the shared WireCat
store so that search and every other tool can use them. This page shows the steps: choose the entity your records
feed, write them as source records, let cli-core link them, and keep secrets out. It assumes you know the
[concepts](./build-concepts.md).

### Steps

1. **Choose the entity.** Decide what the owner means by your records: a person, an event or a document. Your records
   are source records of that entity. If nothing fits, the record type is a new core entity and needs a cli-core
   change, not a table of your own.
2. **Write through cli-core.** Save records through cli-core's store areas, never with your own SQL
   ([WC-STORE-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-5--a-cli-writes-no-sql-against-the-shared-store)).
   If an area lacks the method you need, add it to cli-core with its test.
3. **Key by the provider's id.** Each record has its `account_id` and the provider's id in `external_id`. Saving the
   same record again updates it instead of adding a copy.
4. **Use the standard names.** A field you filter, sort, join or list on is a column with a standard name: `title`,
   `url`, `starts_at`, `ends_at`, `external_updated_at`. Times are UTC milliseconds. Anything else goes in `metadata`,
   allow-listed ([WC-DATA-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-4--use-the-standard-field-names),
   [WC-DATA-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-5--a-field-the-store-filters-sorts-joins-or-lists-on-is-a-column-the-rest-is-allow-listed-json)).
5. **Let matching link them.** cli-core links your record to its entity by a rule: the same key, a shared id such as
   a calendar's `ical_uid`, a join link or an exact content hash. Two equal candidates make no link.
6. **Soft-delete what disappears.** When the provider stops returning a record, it gets `deleted_at`. Its entity and
   the owner's links stay ([WC-DATA-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-7--a-source-record-the-provider-stops-returning-is-soft-deleted-its-entity-and-links-stay)).

### Worked example: Zoom meetings

The `zm` tool brings Zoom meetings into the store this way today:

- each meeting is a `meetings` row, a source record, saved through cli-core's meeting store;
- `account_id` is the Zoom account and `external_id` is Zoom's meeting id, unique together;
- `event_id` points at the event, the entity, and is set by event linking;
- the participants are identities, so a Zoom participant and the same person in Telegram can meet at one person.

A recording that arrives later finds the same row by its key and updates it.

### Never store

- tokens, passwords and keys ([security rules](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md));
- meeting passcodes, PINs and the query string of a join link;
- a provider's raw response; keep only allow-listed fields.

### Register your provider

Each time your tool runs, it records its provider in the store: its name, kind, aliases and command. Every other tool
then knows the new source without a cli-core release. Rows of a provider no tool has recorded are skipped and
reported, never searched as messages.

```ts
import { openStore } from "@wirecat/cli-core/store"

const store = await openStore()
await store.accounts.registerProvider({ name: "acme", kind: "meetings", aliases: ["acme"], command: "acme" })
```

`kind` is what search reads your records as: `messages`, `mail`, `notes`, `documents`, `meetings` or `events`.

### What breaks if you skip this

Without `external_id`, each sync adds the same record again. Without soft delete, a failed sync erases what the owner
linked or wrote. Without the shared store areas, the next cli-core migration breaks your tool.

Next: [Keep your own data](./build-concepts.md#keep-your-own-data).

## Keep your own data

Your tool needs tables that only it uses: a sync checkpoint, a cache, the provider's own bookkeeping. This page shows
where they go and how they refer to the shared store, so cli-core can change its schema without breaking your tool and
no other tool comes to depend on your internals.

### The rule

- A table only your tool needs lives in **your tool's own SQLite file**, next to the shared store.
- Your tool runs its own migrations on that file.
- Your tables refer to shared records **by id only**, such as an account id or a document id.
- No other tool opens your file, and your tool opens no other tool's file.

The rule is [WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private).
If a second tool needs the same records, they are a core entity and belong in cli-core instead.

### Steps

1. Find the shared store's folder with `storePath` from `@wirecat/cli-core/store`. It follows `MESSAGING_STORE`, so
   tests that move the shared store move your file too.
2. Open your file in that folder with `openCache` from the same module. It picks the SQLite of the runtime (Node or
   Bun) and sets the same pragmas as the shared store.
3. Create and change your tables with forward-only migrations: add, never edit or rebuild
   ([WC-STORE-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-7--migrations-only-go-forward-add-never-edit-or-rebuild)).

### Worked example

A tool named `acme-cli` keeps one sync checkpoint per account:

```ts
import { dirname, join } from "node:path"
import { openCache, storePath } from "@wirecat/cli-core/store"

const own = await openCache(join(dirname(storePath()), "acme-cli.db"))
own.exec(`CREATE TABLE IF NOT EXISTS sync_checkpoints (
  account_id INTEGER PRIMARY KEY,
  cursor TEXT NOT NULL,
  updated_at INTEGER NOT NULL
)`)
```

`account_id` is the id of the account row in the shared store. The checkpoint never copies the account's name or
provider; it reads them from cli-core when it needs them.

### Coming

A cli-core helper that opens a tool's own file and runs its migrations is on the later list. Until it exists, use
`openCache` as above.

### What breaks if you skip this

A private table inside the shared store breaks when cli-core migrates, and other tools start reading it. A copy of a
shared field in your table goes stale when the owner edits the original. Another tool that opens your file breaks on
your next change.

Next: [Sign in and stay compliant](./build-sign-in.md).
