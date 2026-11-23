---
title: "Install"
---

Connect your Linear workspace once, and from then on your AI agent answers about your issues without you pasting
them into the chat. Linear lets a program in only with a personal API key that you make in Linear's settings. Making
the key, installing `linear` and signing in take about five minutes.

When you finish, the agent on this computer reads a copy of your issues, projects and comments, even without the
internet, and changes issues as far as your key and your permissions allow.

You can do it all in [WireCat Desktop](/en/docs/desktop), an app that installs the tools for you, or in a terminal
with npm. Either way you need one personal API key.

**On this page:**

1. [What you need](#what-you-need)
2. [Make a personal API key](#make-a-personal-api-key)
3. [In WireCat Desktop](#in-wirecat-desktop)
4. [In a terminal](#in-a-terminal)
5. [Sign in](#sign-in)
6. [Check that it works](#check-that-it-works)
7. [Sign out](#sign-out)

## What you need

- A Linear workspace where you may make API keys. Admins always may. Members may unless an admin turned it off under
  **Settings → Administration → API → Member API keys**.
- For the terminal: Node.js 22.16 or a later 22.x, or Node.js 24 or later. Node 23 is not supported. WireCat Desktop
  sets up Node.js itself.

## Make a personal API key

Linear describes these steps on its page about the [API and webhooks](https://linear.app/docs/api-and-webhooks).

1. In Linear, open [Settings → Account → Security & access](https://linear.app/settings/account/security).
2. Create a new personal API key and give it a name, such as `WireCat`.
3. Choose its access. **Read** is enough to copy and search the workspace. Add **Write** if your agent may create and
   change issues. You can also limit the key to some teams.
4. Copy the key. Linear shows it only once.

## In WireCat Desktop

1. On the **Tools** page, click **Install** on the Linear row.
2. Click **Manage**, type an account name, such as `work`, and click **Sign in here**.
3. Paste the key. Desktop checks it with Linear before it saves it.

Desktop also gives your AI agents the tool's skill, so you can skip the rest of this page.

## In a terminal

Install `linear` once on each computer where you or an agent use it:

```sh
npm install -g @wirecat/linear-cli
linear --version
linear doctor
```

`doctor` needs no network and opens no keyring. It shows the version, where settings live, the profiles that exist,
and whether other users of the computer can read the settings.

Give your terminal agent the tool's skill, the short guide to its commands. An app that connects to MCP servers uses
the tool over MCP instead, as [use it](./usage.md#agents) shows.

```sh
linear skill install
```

## Sign in

A profile is a name you choose for one Linear account, such as `work`. It is the first word of every command that uses
an account. Sign the profile in with your key:

```sh
linear work session start
```

The command asks for the key without showing it, or reads it from stdin, never as an argument. Linear checks the key
first. Then it goes into the system keyring, or into a private file with `--credential-storage file` where no keyring
works.

## Check that it works

```sh
linear work session status --check
linear work sync
linear work issues list type:started
```

`session status --check` asks Linear whose key it is. `sync` copies the workspace, and `issues list` shows the issues in
progress from the copy.

## Sign out

`linear work session end` forgets the key on this computer. The key itself stays valid in Linear until you revoke it
in the same settings page.

Next: [use it](./usage.md).
