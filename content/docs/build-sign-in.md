---
title: "Sign in and stay compliant"
description: "How a tool signs in to a provider and keeps secrets out of the store and the screen, plus the standards, checks and cli-core releases it must follow."
---

Your tool talks to a service that needs a sign-in, such as Google or Zoom. This page shows where the keys and tokens
live, how the owner chooses the account, and what a sign-in must never do. It also shows the shared sign-in module in
cli-core.

## The rules

- **The profile is always explicit.** The owner names the profile in every command, such as `acme work sync`. A tool
  never picks the first profile in a list, and a missing profile is an error that lists the choices
  ([accounts rules](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md)).
- **Secrets come from the environment, then the OS keyring, then a private file**
  ([WC-SECR-4](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-4--secrets-come-from-the-environment-then-the-os-keyring-then-a-private-file)).
- **A secret is never taken on the command line**, because it stays in the shell history
  ([WC-SECR-5](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-5--a-secret-is-never-taken-on-the-command-line)).
- **A token stays inside the transport.** It never reaches the store, a log, an error or the output
  ([WC-SECR-7](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md#wc-secr-7--a-token-stays-inside-the-transport)).

## Steps

1. Ask the owner for the secret with a hidden prompt, or start the provider's sign-in page in the browser.
2. Save the token with `Credentials` from `@wirecat/cli-base`, keyed by the profile name.
3. Read it back by the same profile when a command needs it, and pass it only to the code that calls the service.

## Worked example

```ts
import { Credentials } from "@wirecat/cli-base"

const credentials = new Credentials({ service: "acme-cli", configDir, envVar: "ACME_TOKEN" })
credentials.write(profile, token)
const saved = credentials.read(profile)
```

`profile` is the name the owner typed. `saved.secret` goes to the service client and nowhere else; `saved.source`
says whether it came from the environment, the keyring or the file.

## Browser sign-in with the shared module

For a service that signs in through its web page (OAuth), use the shared sign-in module `@wirecat/cli-core/oauth`.
It gives every tool one flow:

- the browser sign-in with a local return address or a pasted code, protected by `state` and PKCE;
- token exchange, refresh and sign-out;
- a lock per profile, so two commands never refresh the same token at once;
- your tool declares its provider; cli-core holds no provider's addresses or ids, and any step can be replaced;
- one naming scheme for keyring entries; an older entry can still be read, so no one has to sign in again.

```ts
import { credentialStorage, type OAuthProvider, oauthAccount, standardCodec, tokenKeeper } from "@wirecat/cli-core/oauth"

const acme: OAuthProvider = {
  id: "acme",
  name: "Acme",
  authorizeUrl: "https://acme.example/oauth/authorize",
  tokenUrl: "https://acme.example/oauth/token",
  client: { clientId: "your-app-id" },
  redirect: { kind: "loopback" },
}

const keeper = tokenKeeper({
  provider: acme,
  storage: credentialStorage({
    credentials: { service: "acme-cli", configDir, envVar: "ACME_TOKEN" },
    account: oauthAccount(acme.id, profile),
    codec: standardCodec(acme.id),
  }),
  lockDir: configDir,
  fetch,
  signInCommand: `acme ${profile} sign-in`,
})

await keeper.signIn({ scopes: ["meetings:read"], openBrowser })
const accessToken = await keeper.accessToken()
```

`configDir` and `profile` are as above; `openBrowser` opens a URL in the owner's browser. `accessToken()` refreshes
the token when it is about to expire. The token is saved with `Credentials`, so the rules above still hold.

## What breaks if you skip this

A default profile reads or writes the wrong account. A token on the command line stays in the shell history. A token
in an error message reaches the agent's chat and its logs.

Next: [Stay compliant and current](./build-sign-in.md#stay-compliant-and-current).

## Stay compliant and current

Your tool works today. This page shows how to keep it working as cli-core and cli-base change: where the rules are,
which checks prove them, and what to do when a release changes something your tool uses.

### The handbook

The rules every WireCat tool follows are in the
[standards handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md). It ships inside `@wirecat/cli-base`, so your
tool has it at `node_modules/@wirecat/cli-base/docs/standards/README.md`, at the same version as the checks it runs.
Start with the [New CLI checklist](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md): each step names the check that proves it.

The pages a tool on the shared store reads first:

- [Data model](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md): entities, source records, `external_id`, field names, links;
- [Store](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/store.md): store areas, migrations, no SQL from a tool;
- [Architecture](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/architecture.md): layers and what goes in which package;
- [Security](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/security.md) and [Accounts](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/accounts.md): secrets and the explicit profile.

### The checks

- **`cli-dev lint`** (from cli-base) reads the commands your tool prints and checks names, flags, help and output
  rules. Known gaps go in `lint/baseline/` once; the baseline only shrinks, and at most ten overrides are allowed.
- **`cli-dev audit`** compares your commands with the other tools: the required root commands and the same contract
  for the same command path.
- **The shared lint configuration** (Biome with WireCat's plugins) checks your source: no deep imports into
  cli-core's internals, no shell built from strings.
- A rule no machine can check says "review only" in the handbook. Read it before you change that area.

### Versions and breaking changes

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

### Coming

- **A source-code check for store access**, so a tool that imports a SQLite driver directly fails lint.

### What breaks if you skip this

A tool that skips a bump reads a store it no longer understands and refuses to start. A tool that turns off a lint rule
drifts from the others, and agents that learned one tool's commands make mistakes in yours.

Back to the start: [Concepts in five minutes](./build-concepts.md).
