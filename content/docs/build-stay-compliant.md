---
title: "Stay compliant and current"
description: "The standards handbook, the checks that enforce it, and what a cli-core release, breaking or not, asks of your tool."
---

Your tool works today. This page shows how to keep it working as cli-core and cli-base change: where the rules are,
which checks prove them, and what to do when a release changes something your tool uses.

## The handbook

The rules every WireCat tool follows are in the
[standards handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md). It ships inside `@wirecat/cli-base`, so your
tool has it at `node_modules/@wirecat/cli-base/docs/standards/README.md`, at the same version as the checks it runs.
Start with the [New CLI checklist](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md): each step names the check that proves it.

The pages a tool on the shared store reads first:

- [Data model](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md): entities, source records, `external_id`, field names, links;
- [Store](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md): store areas, migrations, no SQL from a tool;
- [Architecture](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md): layers and what goes in which package;
- [Security](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md) and [Accounts](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md): secrets and the explicit profile.

## The checks

- **`cli-dev lint`** (from cli-base) reads the commands your tool prints and checks names, flags, help and output
  rules. Known gaps go in `lint/baseline/` once; the baseline only shrinks, and at most ten overrides are allowed.
- **`cli-dev audit`** compares your commands with the other tools: the required root commands and the same contract
  for the same command path.
- **The shared lint configuration** (Biome with WireCat's plugins) checks your source: no deep imports into
  cli-core's internals, no shell built from strings.
- A rule no machine can check says "review only" in the handbook. Read it before you change that area.

## Versions and breaking changes

cli-core and cli-base are released whenever a change is ready, and a release may break callers
([WC-REL-8](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/releases.md#wc-rel-8--any-package-may-release-at-any-time)). Before version 1.0.0, a minor version may
break callers, and cli-core's changelog says how under "Changed — may break callers".

When a new cli-core comes out:

1. Read its changelog section, the breaking part first.
2. Bump cli-core in your tool on the same day as the other tools, so every tool opens the shared store at the same
   schema.
3. Run your tests and `cli-dev lint`, then release.

The shared store only moves forward. A newer cli-core may migrate the file; an older build then refuses it and says to
upgrade, instead of reading it wrong ([WC-STORE-10](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md#wc-store-10--an-older-build-refuses-a-store-it-cannot-read-and-says-to-upgrade)).
That is why a tool that stays on an old cli-core can stop working once the owner updates another tool.

A tool made from cli-template also takes the template's later changes with `npx @wirecat/cli-template upgrade`:
see [Keep it current](./build-create-cli.md#keep-it-current).

## Coming

- **A source-code check for store access**, so a tool that imports a SQLite driver directly fails lint.

## What breaks if you skip this

A tool that skips a bump reads a store it no longer understands and refuses to start. A tool that turns off a lint rule
drifts from the others, and agents that learned one tool's commands make mistakes in yours.

Back to the start: [Concepts in five minutes](./build-concepts.md).
