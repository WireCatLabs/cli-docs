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

[cli-template](https://github.com/WireCatLabs/cli-template) is where every new tool starts. These commands make a
tool named `acme` and check that it runs:

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
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

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — how WireCat keeps records from many sources, and why.
2. [Add a source](./build-add-source.md) — save your service's data so search and agents can use it.
3. [Keep your own data](./build-own-data.md) — where your tool keeps what only it needs.
4. [Sign in to a service](./build-sign-in.md) — keys, the keychain and accounts.
5. [Stay compliant and current](./build-stay-compliant.md) — checks, versions and upgrades.
