---
title: "Install tg"
description: "Install the tg tool, register its Telegram app, log in with a QR code and connect your AI agent, with its help or by hand."
---

Use this page to connect your Telegram account to an AI agent on your computer. When you finish, you can ask the agent to read your chats, find messages and prepare replies. Allow about five minutes, and keep your phone with Telegram signed in nearby.

## The steps

1. [Install tg](#install). tg is a small program that gives your agent access to your Telegram account. Your agent can install it for you, or you can do it by hand.
2. [Log in to Telegram](#log-in). You confirm twice on your phone: once with a code that registers tg with Telegram, then by scanning a QR code. This adds your computer as a new device on your account.
3. [Connect your agent](#connect-agent). The agent gets the instructions it needs to use tg.
4. [Check that it works](#check). The agent shows your account and a few chats.

If a step does not work, see [Questions and answers](#questions).

<a id="install" />

<a id="what-it-needs" />

<a id="requirements" />

## 1. Install tg

There are two ways to install. Both give the same result.

### With your agent

Use an agent that can run programs on this computer, for example Claude Code, Codex, Cursor or Gemini CLI. If you only use an agent chat in a browser or on your phone, follow [Connect from the web or your phone](/en/docs/browser-apps) instead.

Copy this request into your agent. It will help you install and log in on your computer.

```text prompt
Help connect my Telegram account to my AI agent on this computer.
Follow https://wirecat.dev/en/docs/tg/installation: check the required programs and help install the tool.
Show me the login steps so I can confirm account access myself.
Connect the tool's instructions to my agent. Then show my account and a few chats. Do not send any messages.
```

The agent goes through these steps with you:

1. **It checks your computer.** tg needs Node.js 22.16 or newer. If it is missing, the agent explains how to install it.
2. **It installs tg.** This does not touch your account yet.
3. **It starts the login.** The agent runs `tg personal setup` in a terminal window. You confirm on your phone, as described in [Log in to Telegram](#log-in). If the agent cannot show you that window, it pastes the QR code into the chat as text instead: see [the agent cannot show me the terminal](#q-agent-qr).
4. **It connects itself to tg.** The agent installs the tg instructions for itself.
5. **It shows the result.** You see your account name and a few chats. The agent sends nothing.

You confirm the login yourself, on your phone. Do not paste codes or passwords into the agent chat.

<a id="windows-one-install-command" />

### By hand in a terminal

Open Terminal on macOS or Linux, or PowerShell on Windows.

1. **Install Node.js 22.16 or newer** (22.x or 24+), or Bun. See [Node.js, npm and finding the command](/en/docs/installation#nodejs).
2. **Install tg:**

   ```sh
   npm install -g @wirecat/tg-cli && tg skill install --for all
   ```

   npm 12 may print "install scripts blocked". This is harmless: the install script adds the instructions for your agents only when `TG_INSTALL_AGENT` is set, so the second command installs them. On Windows, open a new terminal if `tg` is not found.

   On Windows, you can use one command instead. It installs tg, adds it to `PATH` (the folders where the terminal looks for commands) and connects all supported agents:

   ```powershell
   & ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool tg -Agent all
   ```

3. **Check the installation:**

   ```sh
   tg --version
   ```

   You see a version number. If you see "command not found", see [tg is not found after installation](#q-not-found).

4. **Start the login:**

   ```sh
   tg personal setup
   ```

   Continue with the next step.

<a id="log-in" />

<a id="first-run" />

## 2. Log in to Telegram

Login adds your computer as a new device on your Telegram account, like Telegram Desktop. You can see this device in Telegram on your phone and remove it at any time. Login does not download your chat history.

`tg personal setup` shows the login. Your agent starts it, or you run it yourself.

`personal` is the name of this login on your computer, called a profile. Any name works. Later commands start with the same name, for example `tg personal doctor`.

Telegram asks for two confirmations. First, tg registers its own Telegram app for your account — two values called App api_id and App api_hash, which identify the program but give no access to messages. Then you scan a QR code, which signs tg in.

1. When setup asks for your phone number, enter it with the country code, for example +44… . This first confirmation lets tg prepare the connection details that Telegram requires for your account.
2. Open Telegram on your phone and find the service message from Telegram with the code for my.telegram.org. This code arrives in Telegram, not by SMS. Enter it at the setup prompt. tg reads your existing connection details or creates them for you; you do not need to write a program.

   ![Telegram message with the login code for my.telegram.org](/screenshots/telegram/code-message.jpg)

3. Next, wait for the account-login QR code on your computer. These are separate confirmations: the earlier code prepares the connection, while this QR code signs tg in to your account.
4. In Telegram on your phone, open **Settings → Devices** and choose **Link Desktop Device** or **Add Device**. Allow camera access if asked, then point the scanner at the QR code shown by setup on your computer. Use Telegram's scanner, not the phone's regular camera app.

   ![Telegram Settings → Devices, with Add Device highlighted](/screenshots/telegram/add-device.jpg)

5. If setup asks for your additional Telegram password, enter the password you set in Telegram. It is not the one-time code. The terminal does not show what you type. Type it and press Enter.
6. Wait until setup confirms the login and checks your account and up to five chats.

<a id="connect-agent" />

## 3. Connect your agent

The agent needs instructions to use tg. These instructions are called a skill. Setup asks which agent you use and installs the skill for it. The install command above already runs `tg skill install --for all`.

To install it again:

```sh
tg skill install --for all
```

Open a new agent session after this, so the agent loads the instructions. For other agents and MCP apps, see [Connect your agent](/en/docs/agents).

<a id="check" />

## 4. Check that it works

Ask your agent:

```text prompt
Use tg CLI. Show my Telegram account and my five latest chats. Do not send anything.
```

Check that the name and the chats belong to the account you wanted to connect. If they do, tg is ready.

Setup does not download your whole chat history. To search older messages, ask the agent to [download the history you need](/en/docs/tg/archive).

By hand, `tg personal doctor` shows whether you are logged in and where tg keeps its files. It does not connect to Telegram.

<a id="next" />

**Next:** [try your first task](/en/docs/first-tasks).

<a id="questions" />

## Questions and answers

<a id="q-qr" />

### Scanning the QR code does not work

**With your agent:** ask the agent to use phone-number login. Enter your number and the new login code at the setup prompts, then your additional Telegram password if asked. The code may arrive in Telegram rather than by SMS; setup says which.

**By hand:**

```sh
tg personal setup --method phone
```

<a id="q-agent-qr" />

### The agent cannot show me the terminal with the QR code

The agent runs `tg personal session start qr` in the background. Without a terminal, tg prints the QR code as text. The agent pastes it into the chat as a code block, exactly as printed, and you scan it from the screen. When Telegram renews the code, the agent pastes the new one and says that the old one expired. This works only when tg already has its Telegram app and your account has no additional password; otherwise run `tg personal setup` yourself. More in [when the agent runs the login](/en/docs/agents#agent-login).

<a id="q-app" />

### Registering the Telegram app does not work

tg fills in the my.telegram.org form for you. If Telegram changes that site, register the app by hand and give tg its two values.

**With your agent:** ask it to use manual app registration. It opens my.telegram.org/apps in your browser.

**By hand:** run `tg personal setup --app browser`, then:

1. Open my.telegram.org/apps and sign in with your phone number. Enter the code from the Telegram service chat on that page, not in the agent chat.

   ![my.telegram.org form for entering the phone number and confirmation code](/screenshots/telegram/my-telegram-login.png)

2. Choose **API development tools**. You need the application settings, not Delete account.

   ![my.telegram.org menu with API development tools highlighted](/screenshots/telegram/my-telegram-api-tools.png)

3. If there is no application yet, choose a title and short name, select **Desktop** and create it. If an application already exists, use it.
4. Enter App api_id and App api_hash in the setup terminal when asked. The hash stays hidden while you type. These are connection values, not a bot token.

   ![App configuration with App api_id and App api_hash highlighted](/screenshots/telegram/my-telegram-credentials.png)

5. Continue with the QR login.

### The QR code expired, or setup stopped

**With your agent:** ask it to finish the login, then run setup again.

**By hand:** run `tg personal session start` to finish the login, then `tg personal setup` again. If you already logged in, setup uses that login and does not ask again.

<a id="q-not-found" />

### tg is not found after installation

**With your agent:** restart the agent, or ask it to open a new terminal. A terminal that was open during the install does not see the new command.

**By hand:** open a new terminal and run `tg --version` again. npm cannot change the `PATH` of the terminal it ran in. On Windows, the PowerShell command in [Install tg](#install) also fixes `PATH` when npm skipped its installation script, and updates the current terminal as well.

### Where do I enter codes and passwords?

In the setup terminal or on the my.telegram.org page, never in the agent chat. If you cannot find the terminal window, ask the agent to show it.

### The agent cannot use tg after setup

**With your agent:** open a new agent session, so it loads the tg instructions. If it still cannot, follow [Connect your agent](/en/docs/agents).

**By hand:** run `tg skill install --for claude` for Claude Code, `--for agents` for Codex, Gemini CLI and other agents that read `~/.agents`, or `--for all`.

### After an update, tg says no profile was named

tg never chooses an account by itself: every command that uses your account starts with the profile name.

**With your agent:** tell it the profile name. If you set tg up earlier without naming a profile, it is called `default`.

**By hand:** put the name first (`tg default chats list`), or set it once: `export TG_PROFILE=default` in your shell profile. If you added tg to an MCP app, create that entry again with `tg default mcp config`. Anything else that starts `tg serve` or `tg mcp` for you, such as a scheduled job, needs the profile in its command too: `tg default serve`.

### After an update, tg stops and names two archive files

The update moves the message archive to the WireCat folder once. If both the old and the new place hold different copies, tg stops with exit code 3 and names both files. Keep the one you need, move the other away, and run the command again. Nothing was moved or changed.

### A chat or older messages are missing

Setup checks only a few chats. Ask the agent to download the chat and the period you need: see [Local archive](/en/docs/tg/archive). An empty search result does not mean that the chat has no such messages.

### Can I try tg without installing it?

Yes: `npx @wirecat/tg-cli --help`. This runs tg once. It does not add the `tg` command or connect your agent.

### Where is my login kept?

The login is a session file in tg's state folder (see the table below). Whoever has that file can read your chats, so treat it like a password. The App api_id and App api_hash are kept in your operating system's password storage (the keyring). See [Security](/en/docs/security).

<a id="files" />

<a id="where-files-go" />

## Where files are stored

| What | Linux and macOS | Windows |
| --- | --- | --- |
| Settings | `~/.config/tg-cli/` | `%APPDATA%\tg-cli\Config\` |
| State: the login, run records, sends, recipients | `~/.local/share/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Data\` |
| Cache | `~/.cache/tg-cli/` | `%LOCALAPPDATA%\tg-cli\Cache\` |
| Local message archive, shared with max | `~/.local/share/WireCat/wirecat.db` | `%LOCALAPPDATA%\WireCat\Data\wirecat.db` |
| Speech recognition models | `~/.local/share/WireCat/models/audio/` | `%LOCALAPPDATA%\WireCat\Data\models\audio\` |

`tg personal doctor` shows the exact paths on your computer. `WIRECAT_STATE_DIR` moves the whole WireCat folder. To change these locations or other settings, see [Configuration](/en/docs/configuration) and the [tg settings reference](/en/docs/tg/configuration).

The first run after an update from an older tg moves the archive and the models here once, from `~/.local/share/cli-messaging/` and `~/.cache/cli-common/models/`. On macOS, older versions kept their own folders in `~/Library`; those move once too.

<a id="upgrade" />

<a id="upgrade-json-result" />

<a id="shell-completion" />

## Update

```sh
tg upgrade            # uses the package manager that installed tg: npm, pnpm or bun
tg upgrade --check    # only says whether a newer version exists
```

If you update from a version that kept messages in `messages.db`, first copy any notes or tags that exist only on your computer: the old file is deleted when the new archive opens. `tg personal messages sync --all` downloads the messages again, but not local notes or tags.

Update max and memo together with tg: they share the message archive, and an older tool would create a new archive in the old place.

tg does not update itself. It checks for a new version once a day and prints a one-line notice in the terminal. After an update, `tg upgrade` restarts the background `serve` it started. Your login stays.

<a id="uninstall" />

## Remove

Removing tg deletes the command, not your data. Log out first, while tg is still installed:

```sh
tg personal server uninstall          # only if you installed the background service
tg personal session end               # log out on Telegram's side and delete the session file
npm uninstall -g @wirecat/tg-cli
rm -rf ~/.config/tg-cli ~/.local/share/tg-cli ~/.cache/tg-cli
rm -rf ~/.claude/skills/tg-cli ~/.agents/skills/tg-cli
```

If you connected bots, also run `tg <profile> bot auth remove` for each bot profile. Logging out keeps the App api_id and App api_hash in the keyring, under the service `tg-cli`; remove that entry with your system's keyring tool if you want them gone. Remove `~/.local/share/WireCat/` only if no other tool, such as max, still needs the saved messages.

## From source

Install from source if you change the code or want a version that is not released yet.

```sh
git clone https://github.com/WireCatLabs/tg-cli.git
cd tg-cli
pnpm install
pnpm build
```

In a checkout, `bin/tg` keeps its settings, login and archive under `.tg/` in the checkout, never in your real profile. `node dist/bin/tg.js` uses the real folders above. To update: `git pull && pnpm install && pnpm build`.
