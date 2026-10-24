---
title: "Keep your own data"
description: "Where a tool keeps tables no other tool needs, such as sync checkpoints and caches, and how they refer to shared records."
---

Your tool needs tables that only it uses: a sync checkpoint, a cache, the provider's own bookkeeping. This page shows
where they go and how they refer to the shared store, so cli-core can change its schema without breaking your tool and
no other tool comes to depend on your internals.

## The rule

- A table only your tool needs lives in **your tool's own SQLite file**, next to the shared store.
- Your tool runs its own migrations on that file.
- Your tables refer to shared records **by id only**, such as an account id or a document id.
- No other tool opens your file, and your tool opens no other tool's file.

The rule is [WC-DATA-1](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md#wc-data-1--a-record-more-than-one-tool-needs-is-a-core-entity-in-cli-core-a-clis-own-tables-stay-private).
If a second tool needs the same records, they are a core entity and belong in cli-core instead.

## Steps

1. Find the shared store's folder with `storePath` from `@wirecat/cli-core/store`. It follows `MESSAGING_STORE`, so
   tests that move the shared store move your file too.
2. Open your file in that folder with `openCache` from the same module. It picks the SQLite of the runtime (Node or
   Bun) and sets the same pragmas as the shared store.
3. Create and change your tables with forward-only migrations: add, never edit or rebuild
   ([WC-STORE-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-7--migrations-only-go-forward-add-never-edit-or-rebuild)).

## Worked example

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

## Coming

A cli-core helper that opens a tool's own file and runs its migrations is on the later list. Until it exists, use
`openCache` as above.

## What breaks if you skip this

A private table inside the shared store breaks when cli-core migrates, and other tools start reading it. A copy of a
shared field in your table goes stale when the owner edits the original. Another tool that opens your file breaks on
your next change.

Next: [Sign in to a service](./build-sign-in.md).
