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
Node.js, pnpm and git, these commands make a tool named `acme` and check that it runs:

```sh
git clone https://github.com/WireCatLabs/cli-template.git
cd cli-template && pnpm install && pnpm kit:build && cd ..
node cli-template/kit/dist/main.js new acme-cli --command acme --package @example/acme-cli --owner example
cd acme-cli && pnpm install && pnpm build
node dist/bin/acme.js personal doctor
```

`personal` is the profile: a name for one of your accounts. Then open the `acme-cli` folder with your AI agent and
tell it which service to connect. The template's instructions guide it from there.

## Why it works this way

**One place for all your data, so answers come from every tool at once.** A question like "what did we decide about
the launch?" needs the chat, the mail and the meeting notes together. That works only when every tool saves into the
same place, in the same shape.

**Nothing counted twice.** The same meeting can arrive from two calendars and from Zoom. WireCat keeps each copy and
knows they are one meeting. When it cannot tell two things apart, it asks you instead of guessing. The details are on
[Concepts in five minutes](./build-concepts.md).

**Always the account you meant.** A tool that picks "the first account" sends a work message from a personal account
sooner or later. A WireCat tool stops and lists your accounts when you do not say which one.

**Agents can do real work, safely.** An agent gets the same commands as you. You decide with permissions what it may
change, and every change is recorded.

**Shared rules, so WireCat can grow without breaking your tool.** The rules are in one
[handbook](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/README.md), and most of them are checked
automatically. The template's `upgrade` command brings its later improvements into your tool.

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — how WireCat keeps records from many sources.
2. [Add a source](./build-add-source.md) — save your service's data so search and agents can use it.
3. [Keep your own data](./build-own-data.md) — where your tool keeps what only it needs.
4. [Sign in to a service](./build-sign-in.md) — keys, the keychain and accounts.
5. [Stay compliant and current](./build-stay-compliant.md) — checks, versions and upgrades.
