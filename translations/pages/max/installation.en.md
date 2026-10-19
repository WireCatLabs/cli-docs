---
title: "Install max"
description: "Install the max tool, log in to MAX with a QR code and connect your AI agent, with its help or by hand."
---

Use this page to connect your MAX account to an AI agent on your computer. When you finish, you can ask the agent to read your chats, find messages and prepare replies. Allow about five minutes, and keep your phone with MAX signed in nearby.

## The steps

1. [Install max](#install). max is a small program that gives your agent access to your MAX account. Your agent can install it for you, or you can do it by hand.
2. [Log in to MAX](#log-in). You scan a QR code with your phone. This adds your computer as a new device on your account.
3. [Connect your agent](#connect-agent). The agent gets the instructions it needs to use max.
4. [Check that it works](#check). The agent shows your account and a few chats.

If a step does not work, see [Questions and answers](#questions).

<a id="install" />

<a id="установить" />

<a id="обычный-способ" />

<a id="что-нужно" />

<a id="requirements" />

## 1. Install max

There are two ways to install. Both give the same result.

### With your agent

Use an agent that can run programs on this computer, for example Claude Code, Codex, Cursor or Gemini CLI. If you only use an agent chat in a browser or on your phone, follow [Connect from the web or your phone](/en/docs/browser-apps) instead.

Copy this request into your agent. It will help you install and log in on your computer.

```text prompt
Help connect my MAX account to my AI agent on this computer.
Follow https://wirecat.dev/en/docs/max/installation: check the required programs and help install the tool.
Show me the login steps so I can confirm account access myself.
Connect the tool's instructions to my agent. Then show my account and a few chats. Do not send any messages.
```

The agent goes through these steps with you:

1. **It checks your computer.** max needs Node.js 22.16 or newer. If it is missing, the agent explains how to install it.
2. **It installs max.** This does not touch your account yet.
3. **It starts the login.** The agent runs `max personal setup` in a terminal window, and a QR code appears there. You scan it with your phone, as described in [Log in to MAX](#log-in). If the agent cannot show you that window, it asks you to run `max personal setup` yourself.
4. **It connects itself to max.** The agent installs the max instructions for itself.
5. **It shows the result.** You see your account name and a few chats. The agent sends nothing.

You confirm the login yourself, on your phone. Do not paste codes or passwords into the agent chat.

<a id="windows-одна-команда-установки" />

<a id="windows-one-command-installation" />

### By hand in a terminal

Open Terminal on macOS or Linux, or PowerShell on Windows.

1. **Install Node.js 22.16 or newer** (22.x or 24+), or Bun 1.3+. See [Node.js, npm and finding the command](/en/docs/installation#nodejs).
2. **Install max:**

   ```sh
   npm install -g @wirecat/max-cli && max skill install --for all
   ```

   npm 12 may print "install scripts blocked". This is harmless: the install script adds the instructions for your agents only when `MAX_INSTALL_AGENT` is set, so the second command installs them. On Windows, open a new terminal if `max` is not found.

   On Windows, you can use one command instead. It installs max, adds it to `PATH` (the folders where the terminal looks for commands) and connects all supported agents:

   ```powershell
   & ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool max -Agent all
   ```

3. **Check the installation:**

   ```sh
   max --version
   ```

   You see a version number. If you see "command not found", see [max is not found after installation](#q-not-found).

4. **Start the login:**

   ```sh
   max personal setup
   ```

   Continue with the next step.

<a id="log-in" />

<a id="первый-запуск" />

<a id="первый-запуск-и-инструкция-для-агента" />

<a id="first-run" />

## 2. Log in to MAX

Login adds your computer as a new device on your MAX account, like the MAX desktop app. You can see this device in MAX on your phone and remove it at any time. Login does not download your chat history.

`max personal setup` shows the login. Your agent starts it, or you run it yourself.

`personal` is the name of this login on your computer, called a profile. Any name works. Later commands start with the same name, for example `max personal doctor`.

1. Wait for the login QR code to appear on your computer. It appears in the terminal. If the window is too narrow, setup opens the code in your browser.

2. On your phone, open MAX, then **Settings → Devices**, and choose QR scanning. Allow camera access if MAX asks.

3. Point the scanner at the code on your computer. Use the login code from setup, not your profile's QR code for sharing contacts. Confirm in MAX if it asks.
4. If setup asks for your additional account password, enter the password you set in MAX. The terminal does not show what you type. Type it and press Enter.
5. Wait until setup confirms the login and checks your account and up to five chats.

<a id="connect-agent" />

## 3. Connect your agent

The agent needs instructions to use max. These instructions are called a skill. Setup asks which agent you use and installs the skill for it. The install command above already runs `max skill install --for all`.

To install it again, or for another agent:

```sh
max skill install --for all
```

Open a new agent session after this, so the agent loads the instructions. For other agents and MCP apps, see [Connect your agent](/en/docs/agents).

<a id="check" />

## 4. Check that it works

Ask your agent:

```text prompt
Use max CLI. Show my MAX account and my five latest chats. Do not send anything.
```

Check that the name and the chats belong to the account you wanted to connect. If they do, max is ready.

Setup does not download your whole chat history. To search older messages, ask the agent to [download the history you need](/en/docs/max/archive).

By hand, `max personal doctor` shows whether you are logged in and where max keeps its files. It does not connect to MAX.

<a id="дальше" />

<a id="next-steps" />

**Next:** [try your first task](/en/docs/first-tasks).

<a id="questions" />

## Questions and answers

<a id="q-qr" />

### Scanning the QR code does not work

**With your agent:** ask the agent to use browser login. A separate browser window opens web.max.ru. Scan its QR code, or choose phone-number login and complete the steps on the page, including the CAPTCHA if one appears.

**By hand:** run one of these:

```sh
max personal setup --method qr-chrome   # web.max.ru in a separate browser window
max personal setup --method sms         # the same window, with phone-number login
```

Browser login needs Chrome, Chromium, Edge or Brave. Browsers installed as a snap package do not work. The window uses a temporary profile, not your own, and closes after login.

### The QR code expired, or setup stopped

**With your agent:** ask it to run setup again, then scan the new code.

**By hand:** run `max personal setup` again. If you already logged in, setup uses that login and does not ask again.

<a id="q-not-found" />

### max is not found after installation

**With your agent:** restart the agent, or ask it to open a new terminal. A terminal that was open during the install does not see the new command. On Windows, an agent in a terminal that was already open must refresh its environment and read `max skill show` before it logs in.

**By hand:** open a new terminal and run `max --version` again. If it still fails, this command explains why and what to run:

```sh
npx @wirecat/max-cli doctor
```

On Windows, npm sometimes skips the step that adds max to `PATH`. Run this repair in PowerShell. It keeps your other `PATH` entries:

```powershell
$maxNpmPrefix = (npm.cmd prefix -g).Trim()
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$maxNpmPrefix\node_modules\@wirecat\max-cli\install\windows.ps1" -RepairOnly -Prefix $maxNpmPrefix
$env:Path = "$maxNpmPrefix;$env:Path"
max skill install --for all
max --version
```

### After an update, max says no profile was named

max never chooses an account by itself: every command that uses your account starts with the profile name.

**With your agent:** tell it the profile name. If you set max up earlier without naming a profile, it is called `default`.

**By hand:** put the name first (`max default chats list`), or set it once: `export MAX_PROFILE=default` in your shell profile. If you added max to an MCP app with `max mcp config`, run that command again.

### After an update, max stops and names two archive files

The update moves the message archive to the WireCat folder once. If both the old and the new place hold different copies, max stops with exit code 3 and names both files. Keep the one you need, move the other away, and run the command again. Nothing was moved or changed.

### Where do I enter codes and passwords?

In the setup terminal or on the web.max.ru page, never in the agent chat. If you cannot find the terminal window, ask the agent to show it.

### The agent cannot use max after setup

**With your agent:** open a new agent session, so it loads the max instructions. If it still cannot, follow [Connect your agent](/en/docs/agents).

**By hand:** run `max skill install --for claude` for Claude Code, `--for agents` for Codex, Gemini CLI and other agents that read `~/.agents`, or `--for all`.

### A chat or older messages are missing

Setup checks only a few chats. Ask the agent to download the chat and the period you need: see [Local archive](/en/docs/max/archive). An empty search result does not mean that the chat has no such messages.

### Can I try max without installing it?

Yes: `npx @wirecat/max-cli --help`. This runs max once. It does not add the `max` command or connect your agent.

### Where is my login kept?

In your operating system's password storage (the keyring), not in a file. If your computer has no keyring, max saves the login in a file next to its settings and tells you so. See [Security](/en/docs/security).

<a id="files" />

<a id="куда-всё-ложится" />

## Where files are stored

| What | Linux and macOS | Windows |
| --- | --- | --- |
| Settings | `~/.config/max-cli/` | `%APPDATA%\max-cli\Config\` |
| State: profiles, bots, run records | `~/.local/share/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` |
| Cache | `~/.cache/max-cli/` | `%LOCALAPPDATA%\max-cli\Cache\` |
| Local message archive, shared with tg | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Speech recognition models | `~/.local/share/WireCat/models/audio/` | `%LOCALAPPDATA%\WireCat\Data\models\audio\` |

`max personal doctor` shows the exact paths on your computer. `WIRECAT_STATE_DIR` moves the whole WireCat folder; it replaces `CLI_COMMON_CACHE_DIR`. To change these locations or other settings, see [Configuration](/en/docs/configuration) and the [max settings reference](/en/docs/max/configuration).

The first run after an update from an older max moves the archive and the models here once, from `~/.local/share/cli-messaging/` and `~/.cache/cli-common/models/`. If both places hold different copies, max stops and names both files: keep one and run it again.

<a id="обновление" />

<a id="обновление-и-удаление" />

<a id="json-ответ-обновления" />

<a id="upgrade-json-response" />

## Update

```sh
max upgrade           # uses the package manager that installed max: npm, pnpm or bun
max upgrade --check   # only says whether a newer version exists
```

If you update from a version that kept messages in `messages.db`, first copy any notes or tags that exist only on your computer: the old file is deleted when the new archive opens. `max personal messages sync --all` downloads the messages again, but not local notes or tags.

Update tg and memo together with max: they share the message archive, and an older tool would create a new archive in the old place.

max does not update itself. It checks for a new version once a day and prints a one-line notice in the terminal. Your login stays after an update.

<a id="удаление" />

<a id="removal" />

## Remove

Removing max deletes the command, not your data. Log out first, so the login is also removed from the keyring:

```sh
max personal server uninstall          # only if you installed the background service
max personal session end               # log out and forget the login
npm uninstall -g @wirecat/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli
rm -rf ~/.claude/skills/max-cli ~/.agents/skills/max-cli
```

If you connected bots, also run `max <profile> bot auth remove` for each bot profile. Remove `~/.local/share/WireCat/` only if no other tool, such as tg, still needs the saved messages.

<a id="из-исходников" />

<a id="from-source" />

## From source

Install from source if you change the code or want a version that is not released yet.

```sh
git clone git@github.com:WireCatLabs/max-cli.git
cd max-cli
pnpm install
pnpm build
pnpm link --global      # makes the max command available
```

To run it without linking: `node dist/bin/max.js --help`. To update: `git pull && pnpm install && pnpm build`.
