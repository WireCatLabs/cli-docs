---
title: "Create your CLI"
description: "Connect a service WireCat does not support yet: build your own tool with our template and your AI agent, with guides for every step."
---

You can build your own WireCat tool for any service or API — quickly, with our template and your AI agent. Use a CRM,
a task tracker or a notes app that WireCat does not support yet? Add it yourself. Your tool then works like the
others: you and your agents can search it, ask about it and act on it next to your chats, mail and meetings.

This page shows what it takes, what you get, and where to start. The guides after it walk you through each part.

## How to build it, in short

1. **Start from the template.** One command makes a working tool with everything already set up. You do not start
   from an empty folder.
2. **Tell your AI agent which service to connect.** The template comes with instructions for the agent. It asks you a
   few plain questions about the service — what it holds, how you sign in — and then writes the code.
3. **Try it on your account.** Run the tool, look at what it found, and ask your agent to fix what is missing.
4. **Share it, if you like.** Built-in checks tell you when the tool is ready to publish for other people.

You do not need to know how WireCat works inside to get started. The guides below explain each part when you need it.

## What WireCat gives your tool

- **Search across everything.** What your tool saves sits next to messages, mail, meetings and documents from the
  other tools, and one question searches them all.
- **Work with AI agents.** Every command of your tool is ready for an agent, and you decide what the agent may change.
- **Your accounts stay apart.** You always say which account a command uses, so nothing goes to the wrong one.
- **Sign-in and passwords handled safely.** Keys stay in your computer's keychain and never show up in output.
- **Checks that keep it working.** The template brings the same checks every WireCat tool runs, so your tool keeps
  working as WireCat grows.

## Start from the template

[cli-template](https://github.com/WireCatLabs/cli-template) is where every new tool starts. On a computer with
Node.js 22.16 or newer, pnpm and git, this command makes a tool named `acme` in the folder `acme-cli`:

```sh
npx @wirecat/cli-template new acme-cli --command acme --package @example/acme-cli --owner example
```

In a terminal, `new` then asks seven short questions about the service (below). It copies the template, names
everything after your command word, starts a git repository and writes your answers to `docs/dev/DESIGN.md`. It does
not install packages, commit or push. Check that the new tool runs:

```sh
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` is the profile: a name for one of your accounts. Every command that uses an account starts with it, and the
tool never picks one for you. Then open the `acme-cli` folder with your AI agent and give it `docs/dev/DESIGN.md`.
The template's instructions guide it from there.

## The seven questions

Each answer except the languages is a choice from a short list, and also takes `other:<your answer>`. Without a
terminal, for example in a script or an agent's shell, pass them as flags. A missing one is then an error that lists
the choices; nothing is guessed.

| Question | Flag | Choices (several are comma-separated) |
| --- | --- | --- |
| What kind of tool is it? | `--category` | `messenger`, `mail`, `notes`, `files`, `calendar`, `meetings` |
| Which languages is the content in? | `--content-lang` | language codes, several allowed: `en,ru` |
| How does a person sign in? | `--sign-in` | `oauth`, `token`, `session` (phone code, QR), `none` |
| What does the service offer to build on? | `--api` | `official-client`, `official-docs`, `unofficial` |
| How do people filter what they find? | `--filters` | several of `time`, `person`, `container`, `text`, `status` |
| What must never reach the store, a log or the output? | `--never-store` | several of `tokens`, `codes`, `secret-links`, `content` |
| What untrusted input arrives? | `--untrusted` | several of `messages`, `files`, `links`, `names`; or `none` alone |

The same tool, made without any question:

```sh
npx @wirecat/cli-template new acme-cli --command acme --package @example/acme-cli --owner example \
  --category notes --content-lang en --sign-in token --api official-docs --filters time,text \
  --never-store tokens --untrusted messages,links
```

## Learn from a tool like yours

The template has no sample code. Your agent learns from the WireCat tool closest to yours, picked by the first answer:

| Kind of tool | Reference tool |
| --- | --- |
| messenger | [`whatsapp-cli`](https://github.com/WireCatLabs/whatsapp-cli), then [`tg-cli`](https://github.com/WireCatLabs/tg-cli) and [`max-cli`](https://github.com/WireCatLabs/max-cli) |
| files and documents | [`drive-cli`](https://github.com/WireCatLabs/drive-cli) |
| meetings | [`zoom-cli`](https://github.com/WireCatLabs/zoom-cli) |
| notes | [`cli-memo`](https://github.com/WireCatLabs/cli-memo) |
| mail, calendar, other | none yet: choose the nearest one with your agent |

For now, search shows your tool's records as messages. Once cli-core can register a new kind of source, your tool can
register its own.

## Four steps that need a person

`new` prints them at the end. The last one applies only to tools in the WireCatLabs organization.

1. Create the repository and protect its `main` branch, as the
   [New CLI checklist](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md) says.
2. Set npm trusted publishing for your package, naming `release.yml`, and add any secrets the tool needs.
3. Choose a day of the month for the monthly checks that no other of your repositories uses. The template's
   `.github/workflows/monthly.yml` holds a placeholder that CI rejects until you do.
4. **WireCatLabs tools only:** add the tool to cli-base's parity groups, cli-core's list of WireCat tools and this
   site's `tools.json`.

A tool outside WireCatLabs keeps its own parity group file instead and runs `cli-dev audit --groups <file>`, so it is
compared with our tools without a pull request to cli-base.

## Keep it current

The template keeps improving. In your tool, with a clean git working tree, run:

```sh
npx @wirecat/cli-template upgrade
```

For each template file that changed since your version, it asks what to do: **apply** merges the change into your
file, **replace** takes the template's file, **skip** keeps yours, and **diff** shows the change first. A conflict
leaves the usual git markers; resolve them and run `upgrade` again. Files the template only seeded, such as your
source code and your pages, are never touched. `--dry-run` lists what would change and writes nothing.

## Show it on wirecat.dev

A tool outside WireCatLabs can appear here in the "Community tools" group. Open a pull request to
[cli-docs](https://github.com/WireCatLabs/cli-docs) that adds it to `tools.json` with `"community": true`. Its pages
are then copied from its repository at a reviewed release tag, like ours. The
[review list](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools) says what we check.
A community tool keeps its own npm scope: the `@wirecat` scope and the name "WireCat" stay ours.

## Why it works this way

**One place for all your data, so answers come from every tool at once.** A question like "what did we decide about
the launch?" needs the chat, the mail and the meeting notes together. That works only when every tool saves into the
same place, in the same shape.

**Nothing counted twice.** The same meeting can arrive from two calendars and from Zoom. WireCat keeps each copy and
knows they are one meeting. When it cannot tell two things apart, it asks you instead of guessing. The details are on
[Concepts in five minutes](./build-concepts.md).

**Always the account you meant.** A tool that picks "the first account" sends a work message from a personal account
sooner or later. A WireCat tool stops and lists your accounts when you do not say which one.

**Agents can do real work, safely.** An agent gets the same commands as you: the MCP server serves every command,
writes included. You decide with permissions what it may change, and every change is recorded.

**Shared rules, so WireCat can grow without breaking your tool.** The rules are in one
[handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), and most of them are checked
automatically. The template's `upgrade` command brings its later improvements into your tool, as shown above.

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — how WireCat keeps records from many sources.
2. [Add a source](./build-add-source.md) — save your service's data so search and agents can use it.
3. [Keep your own data](./build-own-data.md) — where your tool keeps what only it needs.
4. [Sign in to a service](./build-sign-in.md) — keys, the keychain and accounts.
5. [Stay compliant and current](./build-stay-compliant.md) — checks, versions and upgrades.
