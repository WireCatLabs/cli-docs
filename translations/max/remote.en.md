---
title: "ChatGPT or Claude in a browser"
---

**Status:** built and tested with a local client. The complete setup with ChatGPT and Claude through a real tunnel has not been tested yet. If a step does not work as described, [open an issue](https://github.com/leemour/max-cli/issues).

`max mcp` communicates with an AI app over a channel on your own computer. Browser-based ChatGPT and Claude cannot use it directly: their servers connect over the internet to an address you provide. `max mcp --http` serves the same tools over HTTP with its own login, and **[Tailscale Funnel](https://tailscale.com/kb/1223/funnel)** gives your computer a public HTTPS address such as `https://laptop.tail1234.ts.net`. You do not need to buy a domain.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

## Before you begin

- **Anyone who logs in can read your MAX.** Login needs a one-time code that `max` prints in your terminal, so only someone who sees this terminal can add an app. Never put a tunnel in front of `max mcp` without `--http`: it has no login at all.
- **Every change asks first.** Through `--http`, every send, edit, reaction, forward, pin, vote or deletion first shows you a form in the app — at any profile permission level. An app that cannot show such forms can only read. A profile with `readonly` never writes; the recipient list and the hourly limit apply here too ([mcp.md](./mcp.md), [configuration](./configuration.md)).
- **The computer running `max` must be on.** To use a phone or an unconfigured laptop, run this on a small always-on server and log in to `max` there (`max setup --agent none`). You then need only a browser.
- **Who can use it:**

| App | Plans | Documentation |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, in developer mode | [Developer mode](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Any plan; free accounts allow one custom connector | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Only adults in the US with a personal Google account; unavailable in Russia and Europe | [Connected apps](https://support.google.com/gemini/answer/17209137?hl=en) |

## 1. Give your computer a public address

Install [Tailscale](https://tailscale.com/download) and sign in. Funnel requires MagicDNS, HTTPS certificates and Funnel permission enabled in your Tailscale network; see the [Funnel guide](https://tailscale.com/kb/1223/funnel). Then run this in a terminal you will leave open:

```sh
tailscale funnel 8765
```

The command prints an address, `https://<устройство>.<сеть>.ts.net`. Ctrl-C closes it.

## 2. Start `max` with login

In a second terminal:

```sh
max mcp --http --public-url https://<устройство>.<сеть>.ts.net
```

`max` listens only on `127.0.0.1:8765`, so only Funnel on this computer can reach it, and it prints a **login code** such as `K7QP-M2XD`. The code works once and for 10 minutes; after each login, `max` prints a new one. `--port` selects another port — give Funnel the same number.

## 3. Add it to your app

The address for the app is your Funnel address ending in `/mcp`: `https://<устройство>.<сеть>.ts.net/mcp`.

- **ChatGPT:** enable developer mode and add a connector with this address, following [Developer mode](https://developers.openai.com/api/docs/guides/custom-mcp-server).
- **Claude:** add a custom connector using this address, following [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). In the connector settings, you can also set each tool to always allowed, needs approval or blocked.

The app opens the `max` login page. Check the line that says where the login goes — it must be `chatgpt.com` or `claude.ai` — and enter the code from the terminal. The app stays connected for 30 days and renews the login itself; after that, it asks for a new code.

## Turning it off

Press Ctrl-C in both terminals. When Funnel closes, nothing remains exposed. To make all apps log in again:

```sh
max mcp --revoke
```

## Troubleshooting

- **The app says it cannot connect:** open `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp` in your browser — it should show a short JSON. If it does not, Funnel is not running, is not enabled in your Tailscale network, or points to another port.
- **The login page says “Too many wrong codes”:** after five wrong codes, it stays closed until you restart `max mcp --http`. If it was not you who entered them, someone found your address: restart, and consider a new device name in Tailscale.
- **Connected, but no tools:** `max mcp doctor` checks startup and the tool list, but not the MAX login. An explicit network command, such as `max account show`, checks the login.
- **A change fails with “the owner did not confirm this”:** the app did not show the form, or the form was declined. Nothing was sent.
- When recording is on, successful MCP calls appear in `max runs list`; errors are saved by default. An explicit `record: false` or `--no-record` turns off errors too ([Diagnostics](./diagnostics.md)).
