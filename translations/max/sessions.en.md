---
title: "Login, sessions and profiles"
---

<a id="откуда-берётся-токен" />
<a id="проверить-и-забыть" />
<a id="если-ключницы-нет" />
<a id="сколько-живёт-токен" />

Use this page when connecting `max` to a MAX account for the first time, adding a second account or recovering from “no session”. You will learn to log in, check which account is connected, log out, and locate the saved data that keeps the login available.

Terms used below:

- **Session** — this computer's `max` login to your MAX account, consisting of a token and device identity. MAX lists it as another device in the app.
- **Token** — the credential MAX issues at login. It can read your chats; treat it as a password. `max` keeps it in the keyring.
- **Device identity** — how `max` identifies itself to MAX, consistently across commands. It is saved beside other state files.
- **Keyring** — the operating system's password storage.
- **Profile** — a named login with its own token, state and settings. Without a name, `max` uses `default`. You need another profile for another account or separate restrictions ([profiles](#профили)).

Do not confuse `max session` and `max account sessions`. `max session` — login of `max` itself; `max account sessions` lists all other devices and applications signed into your account.

## First run

`max setup --agent codex` checks local directories, guides you through QR login, checks your account and up to five chats, and installs the agent skill. Agent choices: `codex`, `cursor`, `claude`, `gemini`, `all`, `none`. Without a parameter, an interactive terminal asks you; machine mode skips skill installation. `max skill show` is available before login.

Allow about five minutes. History downloads separately after you choose a chat and volume; setup does not start a background service. Repeating setup checks the existing session. `--method token|qr|qr-chrome|sms` selects a new login method; default `qr`. QR and browser methods require a person at the local terminal. Do not pass a token as an argument. Repeat interrupted setup. For an expired token, explicitly run `max session start qr`; if the keyring is unavailable, follow the environment repair guidance first.

## Log in

`max session start <способ>` supports four login methods. Whichever method you use, the token is saved to the keyring only after MAX accepts it.

| Method | What happens | Requirements |
|---|---|---|
| `token` (default) | Paste a token issued by an official client, or pipe it in | None |
| `qr` | A QR code appears directly in the terminal; scan it with the MAX app. In a narrow terminal, the code opens in your default browser | A terminal about 70 columns wide, or any browser |
| `qr-chrome` | web.max.ru opens in a separate browser window; scan its QR code | Chrome, Chromium, Edge or Brave |
| `sms` | The same web.max.ru window; choose phone-number login on the page | Chrome, Chromium, Edge or Brave |

```sh
max session start qr
```

**`qr-chrome` and `sms` are the most cautious methods.** web.max.ru handles login in a real browser, so MAX sees its own web client. The browser uses a separate temporary profile, not yours. Once web.max.ru is logged in, the window closes and the profile is deleted, including when you press Ctrl-C. Closing the window does not end the session; it is like closing a tab. The browser is detected automatically; set `MAX_BROWSER` to use another. Snap-packaged browsers are unsupported because they use their own `/tmp` directory.

**`qr` requests a MAX code over `max`'s own connection**, identifying as a web client. It works without a browser, but is not the actual web client.

**login via SMS - only through the browser.** When SMS asks for a `max` connection, MAX requires a captcha, and it can only be completed on the page.

After any of these three methods, a new device appears in the MAX app's session list. If your account has a cloud password, `qr` prompts for it without showing what you type, up to three times. After that, you must scan the code again.

All three require a person at the terminal; otherwise they return code 2. An AI agent without a terminal can use `token`. While `MAX_TOKEN` is set, these three methods also refuse: it overrides the keyring and would hide the new session.

### Importing a token manually

`max session start` without a method **imports** a token already issued by an official client, such as `web.max.ru`, and stores it in the keyring. This also works when login is blocked by a CAPTCHA or an unusual second factor.

```sh
max session start
MAX token: ▏          # ввод не отображается
```

**The token is not accepted as a command argument.** Arguments are visible in `ps` to any process on the machine and remain in shell history. Instead, the terminal prompts without echoing input, or the command reads from a pipe when there is no terminal:

```sh
pass show max/token | max session start
```

For CI and one-off runs, use the environment variable. It **takes precedence over the keyring**: when `MAX_TOKEN` is set, it is used without writing anything to the keyring. The background `max serve` process does not start with this variable; the command connects to MAX itself.

```sh
MAX_TOKEN="$(cat /path/to/token)" max chats list --json
```

## Check and exit

```sh
max account show             # под кем выполнен вход: id, имя, последние четыре цифры телефона
max account list             # все профили на этом компьютере и аккаунт каждого
max account sessions list    # все устройства и приложения, вошедшие в аккаунт; ничего не завершает
max session end              # выйти из MAX и забыть токен на этой машине
```

`session end` first ends the session on the MAX server, then erases the token on this computer. The response reports the outcome:

```json
{ "profile": "default", "forgotten": true, "revokedOnServer": true }
```

**If you signed in with a token from a web.max.ru tab, they share one session:** `session end` also signs that tab out of MAX.

If MAX does not respond, the token is kept so you can retry the command. A token MAX no longer accepts is erased immediately: there is no remaining session to end.

## How long does a session last?

The token's lifetime is unknown: MAX does not report it. It continues working after the web.max.ru tab is closed. When MAX stops accepting it, log in again with `max session start`.

`max` does not limit logins, but counts them for each profile. `max doctor` shows the count.

## Profiles

Each profile keeps its own token and state; the shared local archive identifies the account for each message. Name a profile as the **first word**, rather than a flag:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
export MAX_PROFILE=personal # или на всю сессию оболочки
```

Rule: **The first word is profile unless it matches the name command.** Therefore a profile cannot be named `chats`, `runs` or `session` - `max session start` and `max setup` reject such a name. Otherwise, `max chats` would silently mean “chats profile without command”. The name consists of Latin letters, numbers, periods, hyphens and underscores and begins with a letter or number.

Order, first match wins: first word, `MAX_PROFILE`, `defaultProfile` in the settings file, then `default`.

If the first word is not a command and no command follows it, the program explains what happened instead of silently displaying help:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
Run `max --help` for the commands, or `max nonsense account show` if "nonsense" is your profile.
```

**`MAX_PROFILE_LOCK` assigns the process to one profile.** Specify it where the agent is running, and the first word or `MAX_PROFILE` with the name of another profile will be rejected (return code `5`). Without it, the agent could choose a profile with fewer restrictions.

Why each profile is needed and how the profile works with the bot - in the [profiles and bots](./profiles.md) section.

## Storage locations

| Data | Location |
| --- | --- |
| Token | OS keyring, service `max-cli`, entry named after the profile |
| Token without a keyring | `credentials.json` beside settings, permissions `0600` |
| CI token | `MAX_TOKEN`; overrides keyring |
| Bot token | OS keyring, service `max-cli`, entry `bot:<профиль>`; or `MAX_BOT_TOKEN` |
| Chats observed by bots | `~/.local/share/max-cli/bots/` |
| Device, login count, `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json`, permissions `0600` |
| Settings | `~/.config/max-cli/config.json` |

Directories for macOS and Windows are listed in the section [where everything goes](./installation.md#куда-всё-ложится).

**The device identity is saved on the first read**, before it is used. A client that presents itself to MAX as a new device on every command does not behave like a real client; server-side sessions are tied to that identity.

On a machine without a keyring (a typical container), recording fails - then the token is placed in the file `credentials.json` next to the settings, with the rights `0600`, and command says this in one line on stderr. In CI, it is more correct not to rely on either one or the other and pass `MAX_TOKEN`.

> ⚠ `MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` also change the keyring service name. A session saved with these variables is **not visible** to a command run without them, and vice versa. Set them consistently or leave them unset everywhere.

## Next steps

- [Read the first chats](./usage.md)
- [Settings and the order in which they are applied](./configuration.md)
- [What gets on the disk and what never gets](./security.md)
