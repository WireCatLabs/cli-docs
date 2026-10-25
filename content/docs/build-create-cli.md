---
title: "Create your CLI"
description: "Start a new WireCat tool from cli-template in minutes, see what the shared core gives it, and learn why it is built this way."
---

You want a command-line tool for a service — a calendar, a notes app, a chat — that people and AI agents can use, and
that works with the other WireCat tools. The fastest way is to start from the template. This page shows the start,
what WireCat gives your tool, the steps in short, and then why it works this way.

## Start from the template

[cli-template](https://github.com/WireCatLabs/cli-template) makes a working skeleton: the shared commands, settings,
the agent guide and the MCP server run, and every check of the WireCat standards passes. It asks you a few questions
about the service and writes the answers into a design file for you or your agent.

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` is the profile: a name for one account. Every command that uses an account starts with it; none is ever
assumed.

`new` prints the steps that need a person: create the repository, set up publishing on npm, pick a day for the
monthly checks. Then give `docs/dev/DESIGN.md` to your agent and build the tool.

## What WireCat gives your tool

- **One shared store and search.** Your records sit next to messages, mail, meetings and documents from the other
  tools, and memo searches across all of them.
- **An MCP server for agents.** Every command is served to an agent, writes included, behind the profile's permission
  keys.
- **Accounts done right.** The profile is always explicit, and a read across accounts covers all of them.
- **Sign-in and secrets.** Tokens stay in the system keyring and never reach output or logs.
- **Checks that keep you compliant.** `cli-dev lint`, the shared lint rules and the release checks come with the
  template.

## How to build it, in short

1. **Describe the service.** Answer the questions in `docs/dev/DESIGN.md`: what the service holds, how one signs in,
   what must never be stored.
2. **Write the adapter.** One part of your code talks to the service and turns its objects into your tool's types.
3. **Store source records.** Save what the service returns through cli-core, with the service's id in `external_id`.
   cli-core links them to the people, events and documents other tools already know. See
   [Add a source](./build-add-source.md).
4. **Keep your own tables apart.** Sync checkpoints and caches go in your tool's own file. See
   [Keep your own data](./build-own-data.md).
5. **Name commands with the shared words.** `list`, `show`, `search`, the same flags as every other tool;
   `cli-dev lint` tells you when a name is off.
6. **Release.** `pnpm release:check` runs every check the standards ask for. See
   [Stay compliant and current](./build-stay-compliant.md).

## Why it works this way

**One store, so answers cross tools.** A question like "what did we decide about the launch?" needs the chat, the
mail and the meeting notes together. That works only when every tool writes into the same store with the same field
names.

**Source records and entities, so nothing is counted twice.** The same meeting arrives from two calendars and from
Zoom. Each copy is a source record; the meeting is one entity. When the tools cannot tell two candidates apart, they
make no link and ask the owner. A wrong merge is worse than a duplicate. The model is on
[Concepts in five minutes](./build-concepts.md).

**An explicit profile, so no command touches the wrong account.** A tool that picks "the first account" sends a work
message from a personal account sooner or later. A missing profile is an error that lists the choices.

**Every command over MCP, behind permissions, so agents can do real work safely.** An agent gets the same commands as
a person. The owner decides what runs with permission keys, and every write is journaled.

**Shared standards, so the core can change without breaking you.** The rules live in one
[handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), and machines check most of
them. A tool that follows them keeps working when cli-core changes, and the template's `upgrade` command brings its
later changes into your tool.

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — entities, source records, `external_id`, links.
2. [Add a source](./build-add-source.md) — write your service's records into the shared store.
3. [Keep your own data](./build-own-data.md) — your tool's private tables.
4. [Sign in to a service](./build-sign-in.md) — tokens, the keyring, the profile.
5. [Stay compliant and current](./build-stay-compliant.md) — checks, versions, upgrades.
