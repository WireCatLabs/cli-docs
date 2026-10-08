---
title: "Sessions and profiles"
---

A session consists of your MAX account token and a stable device identity. The token is stored in the operating-system keyring; everything else lives in a file beside the configuration.

## First run

`max setup --agent codex` checks local directories, guides you through QR login, checks your account and up to five chats, and installs the agent skill. Agent choices: `codex`, `cursor`, `claude`, `gemini`, `all`, `none`. Without a parameter, an interactive terminal asks you; machine mode skips skill installation. `max skill show` is available before login.

Allow about five minutes. Download history separately after choosing a chat and how much to fetch; setup does not start the background service. Running it again checks the existing session. `--method token|qr|qr-chrome|sms` selects the method for a fresh login; setup defaults to `qr`. QR and browser login require a person at the local terminal. Do not pass a token as an argument. If setup is interrupted, run it again. For an expired token, explicitly run `max session start qr`; if the keychain is unavailable, first fix the environment as instructed.

## Getting a token

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

**`qr` requests a code through our own connection**, which imitates the web client. It works without a browser, but it is not the actual web client.

**SMS login works only through a browser.** When our connection requests an SMS, MAX requires a CAPTCHA that can only be completed on the web page.

After any of these three methods, a new device appears in the MAX app's session list. If your account has a cloud password, `qr` prompts for it without showing what you type, up to three times. After that, you must scan the code again.

All three methods require a person at the terminal; otherwise the command refuses with exit code 2. Scripts and agents can use `token`. These methods also refuse while `MAX_TOKEN` is set, because it takes precedence over the keyring and would override the new session.

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

## Checking and forgetting a session

```sh
max account show      # кто вы: id, имя, телефон
max session end       # выйти из MAX и забыть токен на этой машине
```

`session end` first ends the session on the MAX server, then erases the token on this computer. The response reports the outcome:

```json
{ "profile": "default", "forgotten": true, "revokedOnServer": true }
```

**If you signed in with a token from a web.max.ru tab, they share one session:** `session end` also signs that tab out of MAX.

If MAX does not respond, the token is kept so you can retry the command. A token MAX no longer accepts is erased immediately: there is no remaining session to end.

## Profiles

Each profile has its own token and state; the local message store is shared, with data separated by account. Select a profile with the **first word**, rather than a flag:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
export MAX_PROFILE=personal # или на всю сессию оболочки
```

The rule: **the first word is a profile name unless it matches a command name.** A profile cannot be named `chats`, `runs` or `session`; creation rejects these names with an explanation. Otherwise, `max chats` would silently mean “profile chats, without a command”.

If the first word is not a command and no command follows it, the program explains what happened instead of silently displaying help:

```text
"nonsense" is not a command, so it was read as a profile name — and no command followed it.
Run `max --help` for the commands, or `max nonsense account show` if "nonsense" is your profile.
```

## Storage locations

| Item | Location |
|---|---|
| Token | OS keyring, service `max-cli`, entry named after the profile |
| Bot token | OS keyring, service `max-cli`, entry `bot:<профиль>`; or `MAX_BOT_TOKEN` |
| Chats seen by a bot | `~/.local/share/max-cli/bots/` |
| Device, login counter, `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json`, permissions `0600` |
| Configuration | `~/.config/max-cli/config.json` |

**The device identity is saved on the first read**, before it is used. A client that presents itself to MAX as a new device on every command does not behave like a real client; server-side sessions are tied to that identity.

> ⚠ `MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` also change the keyring entry by changing the underlying service name. A session saved with these variables is **invisible** to a command run without them, and vice versa. Either set them consistently or leave them unset.

## When no keyring is available

On a machine without a keyring, such as a typical container, saving the token there fails. It is then stored in `credentials.json` beside the configuration, with permissions `0600`, and the command reports this in one line on stderr.

For CI, pass `MAX_TOKEN` instead of relying on either storage method.

## Token lifetime

The token's lifetime is unknown: MAX does not report it. It continues working after the web.max.ru tab is closed. When MAX stops accepting it, log in again with `max session start`.

`max` does not limit logins, but counts them for each profile. `max doctor` shows the count.

## Next steps

- [Personal account guide](./usage.md) — your first commands.
- [Configuration](./configuration.md) — settings and precedence.
- [Security](./security.md) — what is stored on disk and what never is.
