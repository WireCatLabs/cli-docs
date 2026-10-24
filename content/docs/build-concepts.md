---
title: "Concepts in five minutes"
description: "Entities, source records, external_id, links and the review list: the model every tool on the shared WireCat store follows."
---

You are building a command-line tool, or an agent integration, that reads or writes the shared WireCat store. This page
gives you the model in five minutes: what kinds of record exist, how they connect, and which rules keep your tool from
breaking other tools. The next pages show how to add a source, keep your own data, sign in and stay compliant.

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
See [Keep your own data](./build-own-data.md).

## Coming in the next cli-core release

- **The provider registry.** Your tool records its provider (name, kind, aliases, command) in the store each time it
  runs, so every other tool knows the new source without a cli-core release. Rows of a provider no tool has recorded
  are skipped and reported, never searched as messages.
- **The review list.** Pairs the tools cannot tell apart, such as two events for one meeting, wait there for the
  owner to decide.
- **Calendar entries and files** as source records of events and documents, and an email address on every identity,
  so one address joins one person.

## What breaks if you skip this

A provider id kept only in `metadata` cannot be updated by key, so every sync makes a duplicate. A link made by title
alone joins two different meetings, and the owner sees the wrong recording. SQL against the shared file breaks on the
next cli-core migration.

Next: [Add a source](./build-add-source.md).
