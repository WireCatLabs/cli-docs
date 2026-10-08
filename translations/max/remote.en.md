---
title: "ChatGPT or Claude in a browser"
---

**Status:** HTTP and permissions have been checked locally. The owner confirmed reading and sending through Claude web in Telegram on 07 October 2026 using `permissions`; MAX and OpenAI web have not yet had separate browser tests. Each OS’s instructions need testing on that OS. If a step fails, [open an issue](https://github.com/leemour/max-cli/issues).

`max mcp` communicates with an AI app over a channel on your own computer. Browser-based ChatGPT and Claude cannot use it directly: their servers connect over the internet to an address you provide. `max mcp --http` serves the same tools over HTTP with its own login, and **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** gives your computer a public HTTPS address such as `https://laptop.tail1234.ts.net`. You do not need to buy a domain.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

## Before you begin

- **Anyone who logs in can read your MAX.** Login needs a one-time code that `max` prints in your terminal, so only someone who sees this terminal can add an app. Never put a tunnel in front of `max mcp` without `--http`: it has no login at all.
- **Profile permissions govern writes.** `deny` and `readonly` forbid changes; `ask` and `allow` permit a requested write through MCP without a server confirmation form. Application confirmation depends on its settings. Recipient lists and hourly limits still apply ([mcp.md](./mcp.md), [configuration](./configuration.md)).
- **The computer running `max` must be on.** To use a phone or an unconfigured laptop, run this on a small always-on server and log in to `max` there (`max setup --agent none`). You then need only a browser.
- **Who can use it:**

| App | Plans | Documentation |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, in developer mode | [Developer mode](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Any plan; free accounts allow one custom connector | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Only adults in the US with a personal Google account; unavailable in Russia and Europe | [Connected apps](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Prepare Tailscale

Install the CLI and sign in to MAX ([installation](./installation.md)); for local setup without an agent, use `max setup --agent none`. Start the server as the same user with the same profile. Put the profile name first if needed: `max work mcp`. Install Tailscale separately; both MAX and Telegram support this tunnel.

Install [Tailscale](https://tailscale.com/download), sign in and enable [Funnel](https://tailscale.com/docs/features/tailscale-funnel). Your network needs MagicDNS, HTTPS certificates and Funnel permission. The first run may print an authorization link. Keep two terminal windows open. The first runs the tunnel; when prompted, copy its HTTPS address to the second. Use an origin without `/mcp` or another path; keep a port such as `:8443`.

## 2. Start the tunnel and server

The server listens on `127.0.0.1:8765`, prints a one-time sign-in code and runs without administrator privileges. Only Tailscale may need elevated privileges. The commands below allow sending for the lifetime of this process with `--permission messages.send=allow`. Other permissions are described below.

### Windows (PowerShell)

Install the Tailscale application and sign in through its tray menu. After installing Node.js, the CLI and Tailscale, open a new PowerShell window to refresh PATH. The `.cmd` suffix avoids PowerShell execution-policy errors for npm commands. If MAX is not configured yet, run `max.cmd setup --agent none` in ordinary PowerShell.

First window: administrator PowerShell for Funnel. The `&` operator is needed because the standard installation path contains a space; replace the path if you chose another directory.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Second window: ordinary PowerShell as the user who signed in to MAX:

```powershell
$mcpPublicUrl = Read-Host 'Вставьте HTTPS origin из Funnel (без /mcp)'
max.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --permission messages.send=allow
```

Run both processes in Windows. WSL is a separate environment: do not assume a Windows tunnel targeting Windows loopback can automatically reach a server inside WSL.

### macOS (Terminal)

Install the Tailscale application and sign in. If `tailscale` is absent from PATH, use the application’s built-in CLI ([guide](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). First Terminal window:

```sh
TAILSCALE_BE_CLI=1 /Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 8765
```

Second window, as the user who ran `max setup --agent none`. Works in zsh and bash:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

### Linux (Terminal)

Install Tailscale using the [Linux instructions](https://tailscale.com/download/linux) and sign in with `sudo tailscale up`. First terminal window:

```sh
sudo tailscale funnel 8765
```

Second window: ordinary user without `sudo`, so MAX can find the session from `max setup --agent none`:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

## MAX and Telegram at the same time

Each server needs a separate local port and public HTTPS address. For example, keep Telegram on local `8765` and public `443`; start a second Funnel with `--https=8443 8766` and MAX with `--port 8766`. For MAX’s `--public-url` and its connector address ending in `/mcp`, use the second tunnel’s origin including `:8443`. Use your OS’s command above for the second Funnel. Allowed public Funnel ports are `443`, `8443` and `10000` ([reference](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## Permissions for the server’s lifetime

The server has no confirmation forms. Application confirmation depends on its settings and cannot be verified by the server. If the application permanently allows a tool, its next call may run without another prompt.

Repeatable `--permission ключ=уровень` overrides permissions only for this process. For example, `--permission messages.send=allow` allows sending from a `readonly` profile, while `--permission messages=allow` replaces saved permissions for the entire messages resource. To allow deletion, specify `--permission messages.delete=allow` separately. Levels are `deny`, `readonly`, `ask` and `allow`. The configuration file, recipient list and send limit are unchanged. To allow reading, specify the corresponding resource or command at level `allow`.

With temporary permission overrides, MCP connects directly to MAX: an existing `max serve` service continues using its profile’s saved permissions.

## 3. Add it to your app

The address for the app is your Funnel address ending in `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT / Codex web:** open **Plugins → + Add custom MCP server** and create a plugin following the [OpenAI instructions](https://developers.openai.com/plugins/quickstart). Specify the `/mcp` address and OAuth; connect with the terminal code, install the plugin and enable it in a Work chat or mention it with `@`. Local Codex `config.toml` does not configure the web connection. Availability depends on your account and workspace. Choose DCR for registration. The server advertises DCR and S256 verification as required by [OpenAI OAuth](https://developers.openai.com/plugins/build/auth).
- **Claude:** add a custom connector using this address, following [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). In the connector settings, you can also set each tool to always allowed, needs approval or blocked.

The app opens the `max` login page. Check the line that says where the login goes — it must be `chatgpt.com` or `claude.ai` — and enter the code from the terminal. The app stays connected for 30 days and renews the login itself; after that, it asks for a new code.

## Turning it off

Ctrl-C in both windows stops the server and tunnel running in the foreground. Restart with the same commands; application sign-ins survive restarts. If Funnel was started with `--bg`, Ctrl-C does not stop it: check `tailscale funnel status` and disable only its public port, for example `tailscale funnel --https=443 off`. Use your OS’s Tailscale command above, with elevated privileges if needed. Do not use `funnel reset` while a second server is running: it resets every route. Stopping only MCP leaves the route in place, but tools become unavailable. To make every application sign in again:

```sh
max mcp --revoke
```

## Troubleshooting

- **The app says it cannot connect:** open `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp` in your browser — it should show a short JSON. If it does not, Funnel is not running, is not enabled in your Tailscale network, or points to another port.
- **The login page says “Too many wrong codes”:** after five wrong codes, it stays closed until you restart `max mcp --http`. If it was not you who entered them, someone found your address: restart, and consider a new device name in Tailscale.
- **Connected, but no tools:** `max mcp doctor` checks startup and the tool list, but not the MAX login. An explicit network command, such as `max account show`, checks the login.
- **Reads work but writes fail:** check the profile’s effective permissions and temporary `--permission` overrides. `deny` and `readonly` forbid writes regardless of application confirmation.
- When recording is on, successful MCP calls appear in `max runs list`; errors are saved by default. An explicit `record: false` or `--no-record` turns off errors too ([Diagnostics](./diagnostics.md)).
