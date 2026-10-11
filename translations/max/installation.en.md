---
title: "Installation"
---

<a id="обычный-способ" />
<a id="первый-запуск-и-инструкция-для-агента" />
<a id="обновление-и-удаление" />

Use this page to install `max`, move it to another computer, update it or uninstall it. You will learn to check that the command runs and locate its saved files. Connecting your MAX account is the next step, covered separately.

Terms used below:

- **npm package** — how `max` is distributed. npm, pnpm or Bun downloads **`@wirecat/max-cli`** and installs the **`max`** command.
- **Node** or **Bun** — the runtime executing `max`; install one first.
- **PATH** — directories a terminal searches for commands. Running `max` by name requires its directory on PATH.
- **Keyring** — the operating system's password storage, where `max` keeps the account token.
- **Skill** — instructions teaching your AI agent how to use `max`.

The installation does not compile anything: a ready-made binary is used to access the keyring. It does not run a background service, does not log into your account, and does not read chats. The background `max serve` appears later: it is launched by the first regular command that needs MAX (setup does not launch it; it is the `serve` setting in [settings](./configuration.md)).

## Requirements

- **Node 22.16+ (22.x) or 24+** with npm
- **Or Bun 1.3+** to run the command
- Linux, macOS or Windows

Without a keyring, `max` saves the token in a file beside settings and prints a one-line notice.

## Install

```sh
npm install -g @wirecat/max-cli
pnpm add -g @wirecat/max-cli
bun add -g @wirecat/max-cli
```

Run without installing:

```sh
npx @wirecat/max-cli --help
pnpm dlx @wirecat/max-cli --help
bunx @wirecat/max-cli --help
```

Check that everything is in place:

```sh
max --version
max --help              # список команд
max doctor              # где лежат файлы и есть ли вход; к MAX не подключается
```

If the installation is successful, but `max` is not located, `npx @wirecat/max-cli doctor` will tell you why and what command to execute ([`max` is not located after installation](./troubleshooting.md#max-не-находится-после-установки)).

## First run

`max --help` and `max setup --help` work immediately after installation. `max skill show` also works before login; `max commands --json` lists commands and options.

Run the setup in a local terminal:

```sh
max setup --agent codex            # QR-вход и навык агента
max setup --help                   # примеры и способы входа
```

`--agent` selects where to install the skill: `codex`, `cursor`, `claude`, `gemini`, `all` or `none`. Allow about five minutes: `setup` logs in and checks your account and up to five chats. Download history separately after choosing the chat and amount. Setup does not start a background service; repeating it reuses the existing session. Install the skill separately with `max skill install --for all`. See [login instructions](./sessions.md) for methods and interrupted login.

**Global npm installation** also installs the skill for all supported agents by default. `MAX_INSTALL_AGENT=codex|cursor|claude|gemini|all|none` selects an agent or disables skill installation. Local package installation and `npx` neither change PATH nor install the skill.

### Windows: one command installation

Run in PowerShell when Node.js 22.16+ or 24+ is already installed:

```powershell
& ([scriptblock]::Create((Invoke-RestMethod 'https://wirecat.dev/install.ps1'))) -Tool max -Agent all
```

The installer installs the npm package, preserves existing user PATH entries, adds npm's command directory once, updates the current PowerShell PATH and installs the skill. It verifies `max` runs by name. `-Agent codex|cursor|claude|gemini|all|none` chooses skill destinations. Repeating it updates the skill without duplicating PATH or changing PowerShell execution policy.

With npm, use `npm.cmd install -g @wirecat/max-cli`. If installation scripts are permitted, the package adds its directory to user PATH without removing existing entries and provides a working `.cmd` launcher. Open a new terminal: npm cannot update the PATH of the terminal that launched it.

If npm skipped the installation script, run repair from the installed package:

```powershell
$maxNpmPrefix = (npm.cmd prefix -g).Trim()
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$maxNpmPrefix\node_modules\@wirecat\max-cli\install\windows.ps1" -RepairOnly -Prefix $maxNpmPrefix
$env:Path = "$maxNpmPrefix;$env:Path"
max skill install --for all
max --version
```

Repair preserves other PATH entries and permanent PowerShell policy. Repeating it creates no duplicate entries. Use `max doctor` for diagnostics; see [`max` not found after installation](./troubleshooting.md#max-не-находится-после-установки) for alternatives.

The first commands for reading chats are in the [login and first commands](./usage.md#вход) section.

## From source

This is necessary if you are editing code or want a version that has not yet been released.

```sh
git clone git@github.com:WireCatLabs/max-cli.git
cd max-cli
pnpm install
pnpm build
```

Then either add the command to PATH:

```sh
pnpm link --global      # теперь работает просто `max`
```

Or run it by its path without linking:

```sh
node dist/bin/max.js --help
```

The package is named with the scope `@wirecat/`: the name `max-cli` without the scope is occupied by someone else's package.

## Where files are stored

Three directories follow operating system conventions, and two more are shared with other tools:

| What | Linux | macOS | Windows |
|---|---|---|---|
| settings | `~/.config/max-cli/` | `~/Library/Preferences/max-cli/` | `%APPDATA%\max-cli\Config\` |
| state | `~/.local/share/max-cli/` | `~/Library/Application Support/max-cli/` | `%LOCALAPPDATA%\max-cli\Data\` |
| cache | `~/.cache/max-cli/` | `~/Library/Caches/max-cli/` | `%LOCALAPPDATA%\max-cli\Cache\` |
| shared local archive | `~/.local/share/cli-messaging/wirecat.db` | under `~/Library/Application Support/cli-messaging/` | under `%LOCALAPPDATA%\cli-messaging\Data\` |
| speech recognition models | `~/.cache/cli-common/models/audio/` | under `~/Library/Caches/cli-common/` | under `%LOCALAPPDATA%\cli-common\Cache\` |

- **settings** — `config.json`, plus `credentials.json` containing a token only when no keyring is available.
- **state** — `profiles/<имя>.json` (device and login count), `bots/` (observed bot chats and send journals), run records (`runs/`) and `inbox --new` cursors (`inbox/`).
- **shared local archive** — shared with tools using the same library, including [tg-cli](https://github.com/WireCatLabs/tg-cli); see [local archive](./archive.md).
- **speech-recognition downloads** — fetched only by your explicit `max models audio download` for [voice transcription](./audio-recognition.md).

`max doctor` shows the exact paths on your machine.

**The token is stored in the operating-system keyring**, rather than a file when a keyring is available. `config.json` has no token field, and the configuration schema will reject one.

Each location can be overridden with an environment variable: `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`, `MESSAGING_STORE` (the shared copy file itself) and `CLI_COMMON_CACHE_DIR` (models).

> ⚠ **Directory variables also change the keyring service name.** A session saved with `MAX_CONFIG_DIR`, `MAX_STATE_DIR` or `MAX_CACHE_DIR` is invisible to commands run without them, producing “no session” despite a saved login. This isolates temporary profiles and tests. Set the variables consistently or leave them unset everywhere.

## Shell completion

Tab completes commands, actions, flags and their values. For a chat or person, it inserts an id from the selected account's local archive and displays the name alongside. Add a line to your shell configuration:

```sh
echo 'source <(max complete zsh)' >> ~/.zshrc      # zsh
echo 'source <(max complete bash)' >> ~/.bashrc    # bash
max complete fish | source                         # fish, в config.fish
```

For PowerShell, add `max complete powershell | Out-String | Invoke-Expression` to your profile.

Tab **never connects to MAX**: connecting on every keypress would log into the account hundreds of times. Chat and person names come from shared `wirecat.db` for the selected profile account. Before the account is known or storage exists, only commands and flags are completed. Bot commands suggest chats from their local chat list. Chats are suggested by ID with their titles alongside: a title containing a space would otherwise reach `max` as two words.

## Update

**When updating from the old `messages.db`, preserve any local-only data first.** The current store is `wirecat.db`; opening the default store deletes the old `messages.db` and its `-wal`/`-shm` files.
Before running the new version, close old programs and copy any needed file and companions to another folder. `max store fetch --all` restores server messages, not old local notes or tags.
Login stays ([the store and other versions](./archive.md#копия-и-другие-версии)).

```sh
max upgrade           # тем же менеджером пакетов, которым max поставлен: pnpm, npm или bun
max upgrade --check   # только сказать, есть ли новее; ничего не ставит
```

`max upgrade` does not directly restart `max serve`. An automatically started server is replaced by the first command using the new version. A manually started server keeps running old code until you run `max server restart`. `max` never updates itself automatically.

### Upgrade JSON response

`max upgrade --check --json` reports the current and available version without installation. The answer contains `current`, `latest`, `newer`, `installer`, `command`, `updated` and `restarted`. `restarted` - list of profiles whose servers were restarted after the update; for `max` it is always empty.

Once a day, `max` checks npm for updates and prints a one-line stderr notice after a command, only for a person using a terminal: never with `--json`, pipes, `--quiet` or `CI`. Disable it with `max config set updateCheck false --defaults`.

For a source installation, use `git pull && pnpm install && pnpm build`.

## Removal

Uninstalling removes the command, not its data. Log out before removing `max`. `sales` is an example bot profile; repeat that line for each connected bot.

```sh
max server uninstall                   # если ставили фоновую службу
max session end                        # выйти и забыть токен ДО удаления команды
max sales bot auth remove              # забыть токен бота из профиля sales
npm uninstall -g @wirecat/max-cli
rm -rf ~/.config/max-cli ~/.local/share/max-cli ~/.cache/max-cli
```

`max session end` and `bot auth remove` delete tokens from the keyring. If you uninstall the command first, its keyring entry remains. It is harmless, but still stored there.

Other tools may use the shared local archive. Remove `~/.local/share/cli-messaging/` only when no tool still needs its saved messages.

## Next steps

[Login to your account and execute the first commands](./usage.md#вход).
