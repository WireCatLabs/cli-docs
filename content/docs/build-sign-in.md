---
title: "Sign in to a service"
description: "How a tool signs in to a provider, keeps its keys and tokens out of the store and the screen, and always names the profile."
---

Your tool talks to a service that needs a sign-in, such as Google or Zoom. This page shows where the keys and tokens
live, how the owner chooses the account, and what a sign-in must never do. It also says what the shared sign-in module
in cli-core will add.

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

## Coming in the next cli-core release

A shared sign-in module, `@wirecat/cli-core/oauth`, with one flow for every tool:

- the browser sign-in with a local return address or a pasted code, protected by `state` and PKCE;
- token exchange, refresh and sign-out;
- a lock per profile, so two commands never refresh the same token at once;
- providers declared in each tool (`drive` and a calendar tool declare Google, `zm` declares Zoom), with any step
  replaceable;
- one naming scheme for keyring entries, while today's entries keep working, so no one signs in again.

## What breaks if you skip this

A default profile reads or writes the wrong account. A token on the command line stays in the shell history. A token
in an error message reaches the agent's chat and its logs.

Next: [Stay compliant and current](./build-stay-compliant.md).
