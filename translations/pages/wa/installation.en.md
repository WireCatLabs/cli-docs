---
title: "Install wa"
description: "Install the WhatsApp tool, link your phone as a device and connect your AI agent."
---

Connect your WhatsApp account to an AI agent on your computer. When you finish, the agent can read saved chats, find messages and prepare replies. Keep your phone signed in to WhatsApp nearby and allow about five minutes for recent history to arrive.

## The steps

1. [Install wa](#install): the command-line tool and its WhatsApp engine.
2. [Link your account](#log-in): scan a QR code in WhatsApp on your phone.
3. [Connect your agent](#connect-agent): install its instructions, called a skill.
4. [Check the result](#check): see the selected account and a few saved chats.

This is an unofficial client. Read [security](./security.md) and [limits](./limits.md) before linking; WhatsApp can restrict or ban accounts using unofficial clients.

<a id="install" />
<a id="requirements" />

## 1. Install wa

### With your agent

Use an agent with terminal access on this computer, such as Codex, Claude Code, Cursor or Gemini CLI. For a browser-only chat, use [web or mobile access](/en/docs/browser-apps) instead.

```text prompt
Use wa CLI. Help connect my WhatsApp account to my AI agent. Follow https://wirecat.dev/en/docs/wa/installation. Check the required programs and install the tool. Ask which account and profile name I want; personal is an example. I will approve device linking on my phone. Install the skill and show my account and a few chats. Do not send messages or start background work without asking.
```

### By hand in a terminal

Open Terminal on macOS or Linux, or PowerShell on Windows. You need Node.js 22.16 or later within 22.x, or 24 or later, with npm; see [runtime setup](/en/docs/installation#nodejs).

```sh
npm install -g @wirecat/whatsapp-cli
wa --version
wa doctor
```

Keep optional packages enabled: npm installs the WhatsApp engine for your operating system and processor. A manager may report blocked install scripts; check the installation with the commands below. If the engine is missing, see [troubleshooting](./troubleshooting.md#whatsapp-engine-is-not-installed). On Windows, open a new terminal if the command is not found.

<a id="log-in" />
<a id="first-run" />

## 2. Link your WhatsApp account

In these examples, personal names a profile: one linked account on this computer. Choose any name and repeat it in later commands. The tool never chooses an account for you.

```sh
wa personal setup
```

1. Run setup in the terminal. It checks folders and starts device linking; an already linked profile is reused.
2. On your phone, open WhatsApp → Settings → Linked devices → Link a device. Use the scanner inside WhatsApp to scan the QR shown by setup.
3. Keep WhatsApp open while recent chats arrive. Setup checks your account and up to five saved chats, then offers the agent skill.

This adds a linked device, like WhatsApp Web. Remove it at any time from Linked devices on your phone. If you prefer a pairing code, use `wa personal setup --method phone`; the number is entered in the terminal. Complete the confirmation yourself. Older history is a [separate request to the phone](./archive.md#older-history-from-your-phone).

<a id="connect-agent" />

## 3. Connect your agent

A skill is a short instruction file that tells a terminal agent how to use wa. Setup can install it for your chosen agent. To install it separately:

```sh
wa skill install --for all
```

An app without terminal access can use [MCP](./mcp.md). Choose the profile’s [permissions](./permissions.md) before connecting: MCP offers writing commands as well as reading commands.

<a id="check" />

## 4. Check the result

```sh
wa personal account show
wa personal chats list --limit 5
```

The account must be the one you chose on your phone. The chat list comes from saved history and sends no read receipts. Empty or incomplete history is not evidence that a chat has no messages; see [history coverage](./archive.md).

To keep receiving new messages, run `wa personal serve` in a terminal; Ctrl-C stops it. Only one connection can use a linked device. Read [the connection rule](./sessions.md#one-connection-per-device) before running another connected command.

<a id="questions" />

## Questions and answers

### The QR code is not visible

Ask your agent to show the terminal or paste the text QR into the chat. Use WhatsApp’s scanner. If the terminal is too narrow, widen it and wait for the next QR. Other linking failures are covered in [troubleshooting](./troubleshooting.md).

## Advanced installation and maintenance

## From source

To run `wa` from a checkout of the repository instead:

```sh
git clone https://github.com/WireCatLabs/whatsapp-cli.git
cd whatsapp-cli
pnpm install
pnpm build
pnpm engine:build   # needs Go
node dist/bin/wa.js --version
```

## Where files go

The device keys, the settings and the local store each have their own place:
[where the parts are kept](./sessions.md#where-the-parts-are-kept).

## Shell completion

Tab completes commands, options and their values. Where a chat is expected, it offers chats from the local store.
Add one line to your shell's startup file:

```sh
echo 'source <(wa complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(wa complete bash)' >> ~/.bashrc    # bash
wa complete fish | source                         # fish, in config.fish
```

PowerShell: `wa complete powershell | Out-String | Invoke-Expression` in your profile.

A Tab never connects to WhatsApp. With no local store yet, only commands and options complete.

## Upgrade

```sh
wa upgrade            # with the package manager that installed wa
wa upgrade --check    # only say whether a newer version exists; installs nothing
```

`upgrade` asks npm, so `--offline` is refused with exit code `2`. `upgrade --check` runs under `WA_READ_ONLY`;
`upgrade` without it does not.

After an update, `wa upgrade` restarts each running background `serve`, so it does not keep running the old code.
The engine comes as a package of `wa`, so it updates with it. Once a day `wa` says on stderr when a newer version
exists; `WA_NO_UPDATE_CHECK=1`, or `update_check: false` in the settings, turns that off.

From source: `git pull && pnpm install && pnpm build && pnpm engine:build`.

## Uninstall

Removing the command leaves your data. Unlink first, while `wa` is still there:

```sh
wa personal server uninstall         # if you installed the background unit; stop it first
wa personal session end              # unlinks the device on WhatsApp's side and deletes its keys here
npm uninstall -g @wirecat/whatsapp-cli
rm -rf ~/.config/whatsapp-cli ~/.local/share/whatsapp-cli ~/.cache/whatsapp-cli
```

Repeat `session end` for each profile. The local store is shared with other WireCat tools. Delete
`~/.local/share/WireCat/` only if nothing else uses it: it holds the messages every one of them has kept.

## Next

[Link a profile and read your first chats](./usage.md#set-up-a-profile).
