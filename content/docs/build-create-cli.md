---
title: "Create your CLI"
description: "Connect a service WireCat does not support yet: build your own tool with our template and your AI agent, with guides for every step."
---

You can build your own command-line tool for any service or API — quickly, with our template and your AI agent. Use a
CRM, a task tracker or a notes app that WireCat does not support yet? Add it yourself.

This page shows what it takes, what you get, and where to start. The guides after it walk you through each part.

## Two ways to use it

Both start from the same template and get the same foundation. The only difference is how far you connect your tool.

- **A tool of its own.** You want a fast command-line tool for one service, and nothing more. The template gives you
  the foundation from the first day: the service's data kept on your computer, quick search in it, memory for what
  your agent learns, a server for AI agents and safe sign-in. You do not need any other WireCat tool.
- **Part of WireCat.** You already have WireCat tools for chats, mail or meetings, and want one search over all of
  it. Then connect your tool to the others: what it saves sits next to everything else, and one question finds it.
  This takes a few more steps, described in [Add a source](./build-concepts.md#add-a-source).

You can start with the first and connect your tool later.

## How to build it, in short

1. **Start from the template.** One command makes a working tool with everything already set up. You do not start
   from an empty folder.
2. **Tell your AI agent which service to connect.** The template comes with instructions for the agent. It asks you a
   few plain questions about the service — what it holds, how you sign in — and then writes the code.
3. **Try it on your account.** Run the tool, look at what it found, and ask your agent to fix what is missing.
4. **Share it, if you like.** Built-in checks tell you when the tool is ready to publish for other people.

You do not need to know how WireCat works inside to get started. The guides below explain each part when you need it.

## What WireCat gives your tool

- **Your data on your computer, with fast search.** What your tool saves stays in a local file. Search finds words in
  any form in English, Russian and Spanish, and by meaning if you turn it on.
- **Memory for your agent.** Your agent can keep what it learned — a summary, a preference — and find it later.
- **One search across all your tools,** if you connect it: what your tool saves sits next to messages, mail, meetings
  and documents from the other tools.
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
   it next to your chats and mail. [Add a source](./build-concepts.md#add-a-source) shows how.
5. **Share it, if you want.** When the built-in checks pass, publish the tool on npm. Others install it with npm in a
   terminal, or add it in WireCat Desktop by its npm name:
   [Make it addable in WireCat Desktop](#make-it-addable-in-wirecat-desktop).

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
A community tool keeps its own npm scope: the `@wirecat` scope and the name "WireCat" stay ours. A listed tool
with a `desktop` entry also appears in WireCat Desktop, with the **Community** badge, for people who turn on
**Enable community tools**. Until it is listed, anyone can add it by its npm name, as an unchecked tool.
[List your tool in WireCat](./build-list-tool.md) has every step, from the pull request to WireCat Desktop.

## Make it addable in WireCat Desktop

WireCat Desktop can add a tool that WireCat has not checked, by its npm name
([Add your own tool](./desktop/index.mdx#add-your-own-tool); coming in the next WireCat Desktop release). Before it
installs anything, it reads three things from npm: the package's details, the record of where npm built it, and the
file `contracts/wirecat.json` out of the package. It never runs the package to find out what the tool is. So your
tool needs that file, a data folder named after its package, and a release npm can tie to your repository.

### The manifest

`contracts/wirecat.json` is the manifest: what your tool tells WireCat about itself. It lists the commands with what
each one reads and writes, and the commands Desktop runs to check, set up, sync and connect the tool. It needs a
current `@wirecat/cli-base`.

- **It is generated, never typed.** `cli-dev manifest` writes it from your built program and an identity you export.
  You type only what code cannot know: a `tagline` (at most 55 characters), the sign-in texts `signIn.gives` and
  `signIn.asks`, and, with a `sync` command, `syncs` (what it copies, at most 40 characters).
- **It is committed and shipped.** Commit the file. `files` in `package.json` lists `contracts/wirecat.json`, so it is
  inside the package on npm.
- **CI keeps it current.** `pnpm contracts:check` fails when the file no longer matches the program.
- **It holds no version.** Desktop reads the version from npm, so a release does not change the file.

A tool made with the current cli-template has all of this from `new`:

- The bin calls `wcatStart` before the program loads, with `DESKTOP` from `src/identity.ts`: the docs link, the tagline
  (made from the description) and sign-in texts made from your `--sign-in` answer. Rewrite both in your own words. `src/wcat.ts` adds each command's permission key and exports it all as `WCAT`.
- `package.json` names the program twice: the command word (`acme-crm`) and `wcat-acme-crm`, which `wcat acme-crm`
  runs.
- `pnpm generate` writes `contracts/wirecat.json` with `cli-dev manifest`, and `pnpm contracts:check` checks it.

**For an older CLI, one with no `contracts/wirecat.json`:** add these by hand, since `src/` and `package.json` are yours and `upgrade` does not
change them. Add the `wcatStart` call in the bin, `DESKTOP` in `src/identity.ts`, `src/wcat.ts`, the `wcat-<command>`
program name, and `cli-dev manifest --program dist/program.js --identity dist/wcat.js` (with `--check` for the
checks) in the `generate`, `generate:check` and `contracts:check` scripts, and move to the current `@wirecat/cli-base`.
A new CLI made with the current template shows each file.

With the file shipped, `wcat-acme-crm --wcat-describe` answers format 2: the name, version, description and docs link
with `"wcat_describe": 2`, plus the file's `desktop` part and `manifest_sha256`, the hash of the file. After the
install, Desktop runs it once and refuses the tool when the hash differs from the file it showed in the review. The
[cli-base rule WC-CMD-29](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/commands.md#wc-cmd-29--answer---wcat-describe-and-take-no-name-wirecat-reserves)
has the exact format.

### The data folder

Desktop's **Uninstall and delete data** deletes only folders named after the tool, so the name must belong to your
tool. For a package `@<scope>/<name>`, the identity's `appName`, in lower case, is `<scope>-<name>` or starts with
`<scope>-<name>-`. Every `.` and `_` of the package name becomes `-`, and the whole name has at most 64 characters:
`@leemour/acme-crm-cli` → `leemour-acme-crm-cli`. The current cli-template writes it this way for every package
outside `@wirecat`, and use the same name for the skill and the keyring entries; keep it when you rename the tool. An
older CLI has `appName` without the scope (`acme-crm-cli`): change it in `src/identity.ts` before its
first release. Desktop refuses a manifest that breaks this rule.

### Publish under your own scope

Publish under your own npm scope, such as `@leemour/acme-crm-cli`. The `@wirecat` scope, the name "WireCat" and the
names WireCat reserves for its tools, such as `tg`, `mail` or `wcat`, stay ours.

1. **Make the repository public.** npm makes no record of where it built a package from a private repository, and
   WireCat Desktop shows that record in its review.
2. **Publish the first version by hand** with `bin/release --local`. npm sets a trusted publisher only for a package
   that already exists.
3. **Set the trusted publisher** on npmjs.com, as npm's [Trusted publishing](https://docs.npmjs.com/trusted-publishers)
   page says: your GitHub owner and repository, the workflow file `release.yml` (case matters) and the environment
   `npm`. Trusted publishing needs npm 11.5.1 or later.
4. **Release with `bin/release`** from then on. It starts `release.yml`, which publishes with no npm token, and npm
   records where it built each version.

### Add it in Desktop, then list it

1. **Add it on your own computer.** In WireCat Desktop, turn on **Allow tools WireCat has not checked** in Settings,
   then use **Add your own tool** on the Tools page with your npm name. Your tool appears with the **Not checked**
   badge. A tool from a private repository can only be added this way.
2. **Ask for a listing,** if you want everyone to find it. A listed tool shows on wirecat.dev and, with the
   **Community** badge, in WireCat Desktop. Listing is for approved publishers:
   [List your tool in WireCat](./build-list-tool.md) has the steps and what we check.

## End to end, with an example

This walk-through makes `@leemour/acme-crm-cli`, a made-up tool for a made-up Acme CRM: the names are an example,
and no such package exists. Use your own scope and service.

1. **Make the tool.**

   ```sh
   npx @wirecat/cli-template new acme-crm-cli --command acme-crm --package @leemour/acme-crm-cli --owner leemour \
     --category crm
   cd acme-crm-cli && pnpm install
   ```

2. **Add a command with your agent.** Open the folder with your AI agent and ask: "Add `deals list`: it lists my
   deals from the Acme CRM API, docs at https://example.com/api. It only reads." Try it on your account
   after `pnpm build`: `node dist/bin/acme-crm.js personal deals list`.
3. **Check what Desktop will show.** Rewrite the tagline and the sign-in texts in `DESKTOP` in `src/identity.ts`, for
   example `tagline: "Your Acme CRM deals, searchable on your computer"`, `gives: "your Acme CRM contacts and deals"`
   and `asks: "an Acme CRM API token"`. `appName` is already `leemour-acme-crm-cli`.
4. **Generate and commit.** `pnpm generate` builds the tool and rewrites its contracts, the manifest
   `contracts/wirecat.json` among them:

   ```sh
   pnpm generate
   git add contracts src && git commit -m "feat: deals list"
   ```

5. **Publish.** The first time with `bin/release --local`, then set the trusted publisher and use `bin/release`, as
   [Publish under your own scope](#publish-under-your-own-scope) says.
6. **Add it in Desktop.** Turn on **Allow tools WireCat has not checked**, click **Add your own tool**, type
   `@leemour/acme-crm-cli`, read the review, then **Add** and **Install and run**. After **Restart now**, open
   **Manage** on its row, add the profile `personal` and sign in.
7. **Connect your agent.** On the Agents page, **Connect** gives Claude Code the tool's skill. In a terminal, the same
   is:

   ```sh
   wcat-acme-crm skill install --for claude
   ```

8. **Ask your agent.** In Claude Code: "Use acme-crm with the profile personal: which of my deals close this month,
   and who is the contact on each?"

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
| What kind of tool is it? | `--category` | `messenger`, `mail`, `notes`, `files`, `meetings`, `calendar`, `crm` |
| Which languages is the content in? | `--content-lang` | language codes, several allowed: `en,ru` |
| How does a person sign in? | `--sign-in` | `oauth`, `token`, `session` (phone code, QR), `none` |
| What does the service offer to build on? | `--api` | `official-client`, `official-docs`, `unofficial` |
| How do people filter what they find? | `--filters` | several of `time`, `person`, `container`, `text`, `status` |
| What must never reach the store, a log or the output? | `--never-store` | several of `tokens`, `codes`, `secret-links`, `content` |
| What untrusted input arrives? | `--untrusted` | several of `files`, `links`, `names`, and `messages` (messenger, mail), `records` (crm), `invitations` (calendar) or `transcripts` (meetings); or `none` alone |

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
| calendar | [`gcal-cli`](https://github.com/WireCatLabs/gcal-cli) |
| mail | [`mail-cli`](https://github.com/WireCatLabs/mail-cli) |
| CRM | [`bitrix24-cli`](https://github.com/WireCatLabs/bitrix24-cli) |
| other | none yet: choose the nearest one with your agent |

### Four steps that need a person

`new` prints them at the end. The last one applies only to tools in the WireCatLabs organization.

1. Create the repository and protect its `main` branch, as the
   [New CLI checklist](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md) says.
2. Publish the first version by hand with `bin/release --local`: npm offers trusted publishing only for a package
   that already exists. Then set npm trusted publishing for your package, naming `release.yml`, and add any secrets
   the tool needs. [Publish under your own scope](#publish-under-your-own-scope) has the details.
3. Choose a day of the month for the monthly checks that no other of your repositories uses. The template's
   `.github/workflows/monthly.yml` holds a placeholder that CI rejects until you do.
4. **WireCatLabs tools only:** add the tool to cli-base's parity groups, cli-core's list of WireCat tools and this
   site's `tools.json`.

A tool outside WireCatLabs keeps its own parity group file instead and runs `cli-dev audit --groups <file>`, so it is
compared with our tools without a pull request to cli-base.

## Where to go next

1. [Concepts in five minutes](./build-concepts.md) — how WireCat keeps records from many sources.
2. [Add a source](./build-concepts.md#add-a-source) — save your service's data so search and agents can use it.
3. [Keep your own data](./build-concepts.md#keep-your-own-data) — where your tool keeps what only it needs.
4. [Sign in to a service](./build-sign-in.md) — keys, the keychain and accounts.
5. [Stay compliant and current](./build-sign-in.md#stay-compliant-and-current) — checks, versions and upgrades.
