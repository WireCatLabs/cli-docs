---
title: "Sign in to a service"
description: "How a tool signs in to a provider, keeps its keys and tokens out of the store and the screen, and always names the profile."
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

Next: [Stay compliant and current](./build-stay-compliant.md).
