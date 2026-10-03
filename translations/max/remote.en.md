---
title: "ChatGPT or Claude in a browser"
---

**Status:** this setup follows each tool's documentation. We have not tested the complete setup end to end. If a step does not work as described, [open an issue](https://github.com/leemour/max-cli/issues).

`max mcp` communicates with an AI app over a channel on your own computer. Browser-based ChatGPT and Claude cannot use it directly: their servers connect over the internet to an address you provide. This page puts two free tools between them and `max`:

- **[mcp-auth-proxy](https://github.com/sigbit/mcp-auth-proxy)** starts `max mcp` and permits connections only after you enter your password on its login page.
- **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** gives your computer a public HTTPS address such as `https://laptop.tail1234.ts.net`. You do not need to buy a domain.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ mcp-auth-proxy (пароль) ──▶ max mcp ──▶ MAX
```

## Before you begin

- **Anyone who passes the password check can read your MAX account.** Use a long password you do not use elsewhere. Never run this setup without a password or expose an unauthenticated tunnel.
- **Read-only by default.** `max mcp` sends nothing without `--allow-send`. Add the flag only if the app needs to send, and first read the [MCP guide](./mcp.md): `--confirm-send` and recipient allowlists apply here too.
- **The computer running `max` must stay on.** To use a phone or a laptop without installing anything there, run the setup on a small always-on server and log into `max` there (`max setup --agent none`). You then need only a browser.
- **Availability:**

| App | Plans | Documentation |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, in developer mode | [Developer mode](https://developers.openai.com/api/docs/guides/developer-mode) |
| Claude | Any plan; free accounts allow one custom connector | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Only adults in the US with a personal Google account; unavailable in Russia and Europe | [Connected apps](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Give your computer a public address

Install [Tailscale](https://tailscale.com/download) and sign in. Funnel requires MagicDNS, HTTPS certificates and Funnel permission enabled in your Tailscale network; see the [Funnel guide](https://tailscale.com/kb/1223/funnel). Then run this in a terminal you will leave open:

```sh
tailscale funnel 8080
```

The command prints an address, `https://<устройство>.<сеть>.ts.net`. Ctrl-C closes it.

## 2. Put authentication in front of `max`

Download `mcp-auth-proxy` from its [releases page](https://github.com/sigbit/mcp-auth-proxy/releases). In a second terminal, enter a password at the hidden prompt so it stays out of shell history, then start the proxy with your address:

```sh
read -rs PASSWORD && export PASSWORD
./mcp-auth-proxy \
  --external-url https://<устройство>.<сеть>.ts.net \
  --no-auto-tls \
  --listen 127.0.0.1:8080 \
  -- max mcp
```

`--no-auto-tls` is used because Tailscale already provides the certificate. `--listen 127.0.0.1:8080` makes the proxy reachable only by Funnel on this computer. Instead of a password, the proxy supports GitHub or Google login restricted to your account; see [Proxy configuration](https://github.com/sigbit/mcp-auth-proxy/blob/main/docs/docs/configuration.md).

## 3. Add it to your app

Give the app your Funnel address ending in `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT:** enable developer mode and add a connector with this address, following [Developer mode](https://developers.openai.com/api/docs/guides/developer-mode). By default, ChatGPT asks for confirmation before every action that changes something.
- **Claude:** add a custom connector using this address, following [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). For each tool, choose always allow, ask or deny in the connector settings.

The app opens the proxy login page. Enter the password once.

## Turning it off

Press Ctrl-C in both terminals. When Funnel closes, nothing remains exposed externally. To prevent the app from reconnecting, remove its connector in the app settings and change the password before the next proxy run.

## Troubleshooting

- **The app cannot connect:** open the address in your browser; the proxy login page should appear. If not, Funnel is not running or is not enabled for your network.
- **Connected, but no tools:** run `max mcp` directly in a terminal once. An expired session will be visible there (`max session start`).
- Everything `max mcp` does is recorded like any other command: `max runs list` ([Diagnostics](./diagnostics.md)).
