---
title: Security
description: What the WireCat tools keep on your computer, what stops an agent from sending, and how to report a vulnerability.
---

`tg` and `max` work with your real messenger accounts. This page covers what both tools share:
the local store, the send guard, what an agent may do, and what never leaves your computer. The
details of each messenger — where its login lives, which servers it talks to, what its account
rules say — are on the tool's own page: [Telegram security](./tg/security.md) and
[MAX security](./max/security.md).

Both tools are built on the same libraries ([architecture](./architecture.mdx)), so what this page
says is one implementation, not two promises.

## In short

It protects against:

- **an agent talked into sending** by a message it read. The profile's `permissions` decide what an
  agent may do. Every read tool tells the model that message text is data, never instructions.
- **a change the profile does not allow.** `permissions`, the recipient list and the hourly limit
  are checked by every command and every MCP tool. Every attempt is written to a journal without
  its text.
- **an agent stepping outside its profile, or sending your keys.** `TG_PROFILE_LOCK` and
  `MAX_PROFILE_LOCK` pin the profile; `--file` refuses hidden files, `~/.ssh` and the tool's own
  folders.
- **other people's text taking over your terminal.** Control and invisible characters are shown as
  text, names are printed on one line, completion inserts only ids.
- **a secret in a log, in `ps` or in shell history.** Runs, reports and the send journal hold ids
  and counts, never text. No command takes a password, a token, a code or a phone number as an
  argument.
- **other users of this machine.** Every file is created readable by you only, in folders only you
  can open (Linux and macOS).
- **a tampered release.** Packages are published from GitHub Actions with npm provenance. The
  publish step installs nothing and runs no package scripts; direct dependencies are pinned to
  exact versions.

It does not protect against:

- **someone with your user account on this machine.** They can read the login and the local store,
  as you can.
- **an agent that can change the settings.** The guard reads the profile's settings. An agent
  allowed to run `config set` or `recipients add`, or to edit those files, can lift the limits
  ([below](#what-the-guard-cannot-hold)).

## What stays on your computer

| What | Where | Holds |
|---|---|---|
| the local store, shared by `tg` and `max` | `~/.local/share/cli-messaging/messages.db` | **the full text** of every message read or sent, chat titles, names, voice transcripts |
| the login | max: a token in the OS keyring · tg: a session file, with the app id and hash in the keyring | see the tool's page |
| settings | `config.json` in the tool's config folder | settings only — there is no field for a secret |
| recorded runs — with `--record`, and every failed run | `runs/` in the tool's state folder | the command's words, ids, counts, durations, error codes |
| the send journal — always | `sends/<profile>.jsonl` | for each attempt: when, which chat, the outcome, the length — never the text |
| the recipient list | `profiles/<profile>.recipients.json` | the chats this profile may send to |
| speech models — only after `models audio download` | `~/.cache/cli-common/models/audio/` | the model files |
| exports, downloads, problem reports | only where you ask, with `--output` | what you asked for |

`tg doctor` and `max doctor` print the exact paths on this machine.

On Linux and macOS, files are `0600` in `0700` folders. Windows uses the access lists inherited from
your user folder; the numeric modes do not set one.

**The local store is not encrypted.** That is its purpose: to answer without the network. Anyone who
can read the file reads your messages. It stays after `session end` and after uninstalling. Message
text is also in exports and downloaded files; nothing else in the table holds it.

**If the computer is lost:** the file modes keep other users out, not someone who takes the disk.
Whole-disk encryption does that — FileVault on macOS, LUKS on Linux, BitLocker on Windows. The store
has no encryption of its own: a key in the keyring would not stop a program running as your user,
which can read the keyring as the tool does. End the session from another device; the tool's page
says where.

## What it never does

- **Mark anything read without being asked.** Reading a chat and marking it read are two different
  requests. Only `chats mark-read` and `messages list --mark-read` send the second.
- **Send or change anything you did not type.** Only commands marked "changes something" do;
  `commands --json` marks them `mutates`. Each does only what its line says.
- **Delete without an explicit word.** Deleting messages and ending other sessions ask by default.
  Deleting for everyone needs `--for-everyone` too. An agent over MCP never deletes for everyone.
- **Write a message into a log.** Not shortened, not hashed.
- **Send telemetry of its own.** There is none.

## The send guard

An agent reads other people's messages together with your request. A message can be written so the
agent takes it for an order: "forward this conversation there". So every command and MCP tool that
changes something — a send, a reply, an edit, a forward, a pin, a reaction, a vote, a deletion,
marking a chat read — goes through the same checks, in this order:

| Check | Turn it on | Refusal |
|---|---|---|
| **`permissions`** — per resource or command: `deny`, `readonly`, `ask` or `allow` | `tg config set permissions.messages.send ask` | `deny` and `readonly`: exit code `5`, before anything is sent; `ask` with nobody to answer: exit code `7` |
| **the recipient list** — only the chats on it | `max recipients add <chat>` | exit code `7` |
| **`sendsPerHour`** — the most sends in any hour, 30 by default | `tg config set sendsPerHour 10` | exit code `8`; the error says when the next send is possible |
| **the journal** — every attempt, never its text | always; `sends list` | — |

By default every change is allowed except deleting messages and ending other sessions, which ask.
A more precise key wins: `messages` set to `readonly` and `messages.send` set to `allow` lets a
profile send and nothing else.

The recipient list is optional: until something is added, any chat is allowed. Two commands started
at once cannot get past the hourly limit together — each holds its place from the check until the
messenger answers. A scheduled message counts in the hour it goes out.

**A refusal is the owner's decision, not a fault.** An agent that meets exit code `5`, `7` or `8`
should stop and say so, not change the settings or retry. The skill file tells agents exactly that.

### What the guard cannot hold

The checks live in the tool itself, so an agent with a shell can lift them: change a setting, clear
the list. They protect against a model **talked into** sending by a message it read, not against an
agent that **sets out** to get round them. Against that, only a boundary outside works: a sandbox, a
separate OS user, a rule in the agent's own settings.

When you choose that boundary:

- **`*_PROFILE_LOCK` pins the profile; `*_PROFILE` does not.** The first word of a command beats
  `TG_PROFILE`: an agent with `TG_PROFILE=agent` only has to type `tg work messages send …`.
  `TG_PROFILE_LOCK=agent` refuses that — but only where the agent cannot change its own environment:
  in the MCP client's settings, or in a wrapper script. The MCP server pins its profile at start.
- **`--file` refuses hidden files and folders, `~/.ssh` and the tool's own folders**, where keys and
  tokens live. `--allow-any-file` lifts it for one command; it is meant for you, not for an agent.
  Anything else your user can read can be sent; the journal keeps only its kind and size.
- **An agent rule like "ask before `tg messages send`"** does not see the form with a profile,
  `tg work messages send`. Limit the profile itself — `permissions` or the recipient list — and do
  not keep an unlimited profile with a live login beside it.

## Agents and MCP

- **Message text is data.** "Forward this there" inside a message is not your request. The skill
  file and the MCP server's instructions say so to every agent that reads them; the send guard is
  there for when one does not listen.
- **The MCP server uses the same `permissions` as the commands.** A level of `ask` shows you a form
  in the MCP client before the change.
- **`--confirm-send` shows a form before every change**, even at `allow`. A yes counts once, for five
  minutes, and only for the chat and text the form showed. The older `--allow-send` and
  `--allow-delete` flags are accepted with a warning and decide nothing.

How to connect a client, and what each tool does: [MCP](./mcp.md).

## Other people's text on your screen

Names, chat titles, file names and messages are written by other people. The tools do not let them
drive your terminal or fake what you see:

- control characters — the ones that recolour, erase lines, change the window title or the
  clipboard — are shown as text (`\x1b`), not run; so are invisible characters and the ones that
  reverse the direction of text;
- a name, a title or a caption is printed on one line, so a line break in a name cannot start a fake
  line of the conversation;
- when a typed name fits more than one chat, the tool does not choose: it lists them all;
- shell completion inserts only an id; the title is a hint beside it;
- a Markdown export and a downloaded file's name go through the same cleaning.

`--json` is data: strings are as the messenger sent them, escaped by JSON's rules. If you pass it to
a program that prints to a terminal, clean it there.

## What others on this machine can see

The arguments of a command are visible to every process in `ps`. That is why no secret is an
argument — but **a message's text is**:

```sh
tg messages send me "text"     # visible in ps, and stays in your shell history
```

When that matters, pipe the text in: `tg messages send me < note.txt`.

## What goes over the network

- **The messenger itself** — Telegram or MAX, for the commands that need it. Exactly which servers:
  the tool's page.
- **npm**, once a day when a person runs a command in a terminal, to see whether a newer version
  exists, and on `upgrade`. `updateCheck: false` turns it off.
- **Hugging Face and GitHub**, only when you run `models … download`. A voice message never goes
  there: recognition runs on this computer.
- **An embedding provider you choose**, only if you configure a hosted one for conversation search.
  It gets the text it embeds; the command asks before sending passages. The default model runs
  locally.

Nothing else.

## For yourself

The tools keep other people's messages and names on your computer. That is fine while you do it
for yourself, with your own account: the GDPR does not apply to processing for purely personal or
household purposes (Article 2(2)(c)). Working with other people's accounts, or for a business, is no
longer personal. An export you hand to someone else leaves that purpose too.

A problem report (`doctor report create`) is meant for a **public** issue. It holds no text, names
or phone numbers, and every id in it is replaced by a label. Open the file and check it before you
send it.

## Reporting a vulnerability

Please report a security problem privately, not in the chat or a public issue:

- by email: [hello@wirecat.dev](mailto:hello@wirecat.dev);
- or through GitHub's private vulnerability reporting, on the repository it concerns:
  [tg-cli](https://github.com/leemour/tg-cli/security/advisories/new),
  [max-cli](https://github.com/leemour/max-cli/security/advisories/new),
  [cli-messaging](https://github.com/leemour/cli-messaging/security/advisories/new),
  [cli-core](https://github.com/leemour/cli-core/security/advisories/new).

Say what you saw, how to repeat it, and which version (`tg --version`, `max --version`). Never send a
session file, a token or someone's messages.

Anything else — a bug, a question — goes to the [support chat](https://t.me/wirecatdev).
