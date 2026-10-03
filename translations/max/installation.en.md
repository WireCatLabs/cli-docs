---
title: "Installation"
---

`max` is a single command. It installs as a normal npm package, runs on Node or Bun, compiles nothing during installation and starts nothing by itself. The background `max serve` starts later, when the first ordinary command needs it; setup does not start it (`serve` in [configuration.md](./configuration.md)).

## Requirements

- **Node 22.16 or later** — tested on 24.19.0; 22.16 is the minimum specified in `package.json`.
- **Or Bun 1.3+** — tested on 1.3.14, with a separate CI check on every pull request.
- Linux, macOS or Windows — developed on Linux; tests also pass on macOS and Windows.

OS keyring access uses a prebuilt binary, so there is nothing to compile. If the machine has no keyring, the token is stored in a file beside the configuration, and the command tells you in one line.

## Standard installation

Run without installing:

```sh
npx @leemour/max-cli --help
pnpm dlx @leemour/max-cli --help
bunx @leemour/max-cli --help
```

Install permanently:

```sh
npm install -g @leemour/max-cli
pnpm add -g @leemour/max-cli
bun add -g @leemour/max-cli
```

The package is **`@leemour/max-cli`**; the command it installs is **`max`**.

Check the installation:

```sh
max --version
max --help              # список команд
```

If installation succeeded but `max` cannot be found, `npx @leemour/max-cli doctor` explains why and which command to run ([Troubleshooting](./troubleshooting.md#max-не-находится-после-установки)).

## From source

Use this if you are changing the code or want a version before its release.

```sh
git clone git@github.com:leemour/max-cli.git
cd max-cli
pnpm install
pnpm build
```

Then either put the command on your `PATH`:

```sh
pnpm link --global      # теперь работает просто `max`
```

Or run it by its path without linking:

```sh
node dist/bin/max.js --help
```

Check the installation:

```sh
max --version
max --help              # список команд
```

The unscoped name (`max-cli`) has belonged to another package since 2018, so the scope is required.

## First run and instructions for your agent

```sh
max --help
max setup --help
max commands --json
max skill show                    # доступно до входа
max setup --agent codex            # QR-вход и навык агента
```

Allow about five minutes. `setup` checks your account and up to five chats, reusing an existing session. Download history separately after choosing a chat and how much to fetch. Setup does not start the background service. Agent choices: `codex`, `cursor`, `claude`, `gemini`, `all`, `none`. To install the skill separately, use `max skill install --for all`. For login methods and recovery, see [sessions.md](./sessions.md).

**Windows.** Open a new PowerShell after installing Node.js. If script execution is blocked, use `npm.cmd` and `max.cmd`. If the command is not on PATH:

```powershell
npm.cmd exec --yes --package=@leemour/max-cli -- max setup --agent codex
```

The same prefix works for `--help`, `skill show` and other commands. For diagnostics: `npm.cmd exec --yes --package=@leemour/max-cli -- max doctor --json`.

## Where files are stored

Settings and state directories follow your operating system’s conventions:

| Purpose | Linux | macOS | Windows | Contents |
|---|---|---|---|---|
| Configuration | `~/.config/max-cli/` | `~/Library/Preferences/max-cli/` | `%APPDATA%\max-cli\Config\` | `config.json`, and a token file if there is no keyring |
| State | `~/.local/share/max-cli/` | `~/Library/Application Support/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` | `profiles/<имя>.json`, `bots/` with chats seen by bots and their send logs, and a `runs/` directory with run records |

`max doctor` shows the exact paths on your machine.

**The token is stored in the operating-system keyring**, rather than a file when a keyring is available. `config.json` has no token field, and the configuration schema will reject one.

Override `max` directories with `MAX_CONFIG_DIR` and `MAX_STATE_DIR`. The shared store is separate; `MESSAGING_STORE` selects its file. `max doctor` shows the exact path.

> ⚠ **These variables also change the keyring entry.** A session saved with `MAX_CONFIG_DIR` is invisible to a command run without it: the service name used to store the token changes. This is useful for temporary profiles and tests, but once cost the owner half an hour of “no session” errors despite having a valid token. Either set the variables consistently or leave them unset.

## Shell completion

Tab completes commands, actions, flags and their values. Where a chat or person is expected, it suggests an ID from the selected account in shared storage, with the chat title or person's name alongside it. Add one line to your shell configuration:

```sh
echo 'source <(max complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(max complete bash)' >> ~/.bashrc    # bash
max complete fish | source                         # fish, в config.fish
```

For PowerShell, add `max complete powershell | Out-String | Invoke-Expression` to your profile.

Tab **never connects to MAX**: connecting on every keypress would log into the account hundreds of times. Chat and person names come from shared `messages.db` for the selected profile account. Before the account is known or storage exists, only commands and flags are completed. Bot commands suggest chats from their local chat list. Chats are suggested by ID with their titles alongside: a title containing a space would otherwise reach `max` as two words.

## Updating and uninstalling

```sh
max upgrade           # тем же менеджером пакетов, которым max поставлен: pnpm, npm или bun
max upgrade --check   # только сказать, есть ли новее; ничего не ставит
```

### Upgrade JSON response

`max upgrade --check --json` reports current and available versions without installing anything. The shared response contains `current`, `latest`, `newer`, `installer`, `command`, `updated` and `restarted`, a list of profiles whose servers restarted after the upgrade. On a version check, when no update is available or when no server restarts, this is an empty array; existing fields remain. MAX still does not automatically restart servers after upgrading. Scripts that validate an exact set of keys must account for the new `restarted` field.

Once a day, `max` checks npm for a newer version. If one exists, it prints one line to stderr after the command, only for a person using a terminal: not with `--json`, pipes, `--quiet` or `CI`. Disable this with `max config set updateCheck false --defaults`. `max` never updates itself automatically.

For a source installation, use `git pull && pnpm install && pnpm build`.

Uninstalling removes the command, but not your data:

```sh
max session end                        # забыть токен ДО удаления команды
max <бот> bot auth remove              # и токен каждого бота
npm uninstall -g @leemour/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli ~/.local/share/cli-messaging
```

`max session end` and `bot auth remove` delete tokens from the keyring. If you uninstall the command first, its keyring entry remains. It is harmless, but still stored there.

## Next steps

[Personal account guide](./usage.md) — log in and run your first commands.
