---
title: "Roadmap"
---

This page lists what is planned for `amo` and not done yet. Read it before you build a workaround for a missing
feature: it may already be on the way. The order can change, and there are no dates. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/amo-cli/issues).

## What works today

`amo` signs in to an amoCRM or Kommo account with a long-lived token or through your own integration in the browser.
It copies your own deals, their contacts and companies, the pipelines and the stage history into the local store on
your computer. You and your agent read that copy offline, see what changed since yesterday, get a morning digest, and
change deals, contacts and companies within the permissions you set, over the command line or MCP. See
[start here](./index.md).

## Next

- Files on deals and contacts: read and download the files attached to a deal or a client.
- Set a task or add a note on a deal with a command of its own and its own permission, over MCP too. Today a task or a
  note goes only through `api call` at a terminal, after you allow its key.
- The funnel by manager: how many deals each manager has in each stage, the average deal and the length of the sales
  cycle.
- Stalled deals: the open deals that have sat in one stage longer than you set.

## Later

- Read the account's products.
- Sign in through a button on wirecat.dev, without creating a private integration in your account.

What changed in each released version is in the [changelog](./changelog.md).
