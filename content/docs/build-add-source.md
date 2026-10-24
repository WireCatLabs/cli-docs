---
title: "Add a source"
description: "Bring a new provider's records into the shared store as source records that cli-core can link to people, events and documents."
---

You have a service, such as a calendar, a meeting app or a file store, and you want its records in the shared WireCat
store so that search and every other tool can use them. This page shows the steps: choose the entity your records
feed, write them as source records, let cli-core link them, and keep secrets out. It assumes you know the
[concepts](./build-concepts.md).

## Steps

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

## Worked example: Zoom meetings

The `zm` tool brings Zoom meetings into the store this way today:

- each meeting is a `meetings` row, a source record, saved through cli-core's meeting store;
- `account_id` is the Zoom account and `external_id` is Zoom's meeting id, unique together;
- `event_id` points at the event, the entity, and is set by event linking;
- the participants are identities, so a Zoom participant and the same person in Telegram can meet at one person.

A recording that arrives later finds the same row by its key and updates it.

## Never store

- tokens, passwords and keys ([security rules](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md));
- meeting passcodes, PINs and the query string of a join link;
- a provider's raw response; keep only allow-listed fields.

## Coming in the next cli-core release

Your tool will record its provider in the store when it runs: its name, kind, aliases and command. Until then, a
provider that cli-core does not list is treated as a messenger. After that release, rows of a provider no tool has
recorded are skipped and reported, never searched as messages.

## What breaks if you skip this

Without `external_id`, each sync adds the same record again. Without soft delete, a failed sync erases what the owner
linked or wrote. Without the shared store areas, the next cli-core migration breaks your tool.

Next: [Keep your own data](./build-own-data.md).
