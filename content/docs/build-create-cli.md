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

## What you need

- **An account at the service**, and a way for programs to reach it. Most services give you an API key in their
  settings, or let an app sign in for you. A link to the service's developer documentation helps your agent a lot.
- **An AI coding agent that can run commands**: Claude Code, Codex, Cursor, Gemini CLI or a similar one.
- **Node.js, pnpm and git** on your computer.

## Start from the template

[cli-template](https://github.com/WireCatLabs/cli-template) is where every new tool starts. This command makes a tool
named `acme` in the folder `acme-cli`, after a few short questions about the service:

```sh
npx @wirecat/cli-template new acme-cli --command acme --package @example/acme-cli --owner example
```

Check that the new tool runs:

```sh
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` is the profile: a name for one of your accounts. Now open the `acme-cli` folder with your AI agent.

## What happens next

1. **Tell your agent what you want.** Name the service, give it the link to the developer documentation, and say what
   you want to do. For example: "Connect acme to the Acme CRM API. Its docs are at https://example.com/api. I want to
   list my deals and find a deal by name."
2. **Answer its questions.** The agent asks how you sign in, what the service holds and what must never be saved.
   Short answers are fine.
3. **Try each command on your own account.** The agent builds commands one by one, such as one that lists your deals.
   Run them, and tell the agent what looks wrong or what is missing.
4. **Make it searchable.** Ask the agent to save what the service returns into WireCat, so search and your agents find
   it next to your chats and mail. [Add a source](./build-add-source.md) shows how.
5. **Share it, if you want.** When the built-in checks pass, publish the tool on npm, and others install it like any
   other WireCat tool.

## If you get stuck

- Run `node dist/bin/acme.js personal doctor` in the tool's folder. It checks the installation, the settings and the
  profiles.
- Ask your agent to read the template's instructions again. They cover the common problems.
- Open an issue in [cli-template](https://github.com/WireCatLabs/cli-template/issues) for a question or a bug. Leave
  out keys, passwords and private data.

## Show it on wirecat.dev

A tool outside WireCatLabs can appear here in the "Community tools" group. Open a pull request to
[cli-docs](https://github.com/WireCatLabs/cli-docs) that adds it to `tools.json` with `"community": true`. Its pages
are then copied from its repository at a reviewed release tag, like ours. The
[review list](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools) says what we check.
A community tool keeps its own npm scope: the `@wirecat` scope and the name "WireCat" stay ours.

## Keep it current

The template keeps improving. In your tool, with a clean git working tree, run:

```sh
npx @wirecat/cli-template upgrade
```

For each template file that changed since your version, it asks what to do: **apply** merges the change into your
file, **replace** takes the template's file, **skip** keeps yours, and **diff** shows the change first. A conflict
leaves the usual git markers; resolve them and run `upgrade` again. Files the template only seeded, such as your
source code and your pages, are never touched. `--dry-run` lists what would change and writes nothing.

## Template details

For when you or your agent need the exact options.

### The seven questions

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

### Learn from a tool like yours

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

### Four steps that need a person

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

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — how WireCat keeps records from many sources.
2. [Add a source](./build-add-source.md) — save your service's data so search and agents can use it.
3. [Keep your own data](./build-own-data.md) — where your tool keeps what only it needs.
4. [Sign in to a service](./build-sign-in.md) — keys, the keychain and accounts.
5. [Stay compliant and current](./build-stay-compliant.md) — checks, versions and upgrades.
