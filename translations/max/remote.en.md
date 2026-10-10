---
title: "ChatGPT or Claude in a browser"
---

Connect an AI chat in your browser or on your phone, such as ChatGPT, Codex web or Claude, to read and reply in MAX. The app cannot run `max` on your computer, so you give it a public HTTPS address. It connects to `max` at that address within the profile's permissions; you can stop the connection or revoke access.

Terms used here:

- **MCP** (Model Context Protocol) is a standard way for an AI app to call external tools. `max mcp` is the MCP server installed with `max`; apps on your computer are covered in the [MCP server guide](./mcp.md).
- **Remote connection** means the app connects from its servers, over the internet, to the address you provide. `max mcp --http` serves the same tools over HTTP on `127.0.0.1`.
- **HTTPS tunnel** is a program that gives a port on your computer a public HTTPS address. This guide uses [Tailscale Funnel](https://tailscale.com/docs/features/tailscale-funnel); Cloudflare Tunnel also works. Funnel does not require you to buy a domain.
- **Public address** is that address, for example `https://laptop.tail1234.ts.net`. Pass it to `max` as `--public-url` and to the app with `/mcp` appended.
- **Login code** is the one-time code `max` prints in your terminal. The app's login page asks for it, so connecting an app requires access to that terminal.

```text
ChatGPT / Claude ──интернет──▶ Tailscale Funnel ──▶ max mcp --http (вход) ──▶ MAX
```

If your Tailscale connection already works, keep it; you do not need a second tunnel. Local connections through stdin and stdout continue to work as before.

## What you can do

| Task | Where |
|---|---|
| Connect an AI app in your browser or on your phone to MAX | [Start the tunnel and server](#2-запустить-туннель-и-сервер), then [add it to the app](#3-добавить-в-приложение) |
| Run MAX and Telegram servers side by side | [MAX and Telegram together](#max-и-telegram-одновременно) |
| Use Cloudflare instead of Tailscale | [Cloudflare Tunnel](#вместо-tailscale-cloudflare-tunnel) |
| Allow more or fewer actions for one server run | [Permissions for the server process](#права-только-на-время-работы-сервера) |
| Stop the server or sign out of all apps | [Switch off](#выключить) |
| Transfer a saved file or a PDF page as an image to a remote agent | [Transfer a saved file](#передача-сохранённого-файла-агенту), [read a PDF page by page](#читать-pdf-без-сохранения-файла-у-агента) |

## Before you begin

- **Anyone who logs in can read your MAX.** Login requires the code from your terminal. Never put a tunnel in front of `max mcp` without `--http`: that mode has no login protection.
- **Profile permissions decide what the app may change.** `deny` and `readonly` refuse changes; `ask` and `allow` let the requested change proceed through MCP without a server confirmation form. Approval inside the app is a separate control and depends on its settings. Recipient restrictions and the hourly send limit still apply ([agent permissions in MCP](./mcp.md#что-может-агент), [configuration guide](./configuration.md)).
- **The computer running `max` must stay on.** To connect from a phone or a laptop with nothing installed, run the tool and tunnel on a small server that stays on, and log into `max` there (`max setup --agent none`). You then need only a browser on your device.
- **Who can add a remote connector:**

| App | Plans | Documentation |
|---|---|---|
| ChatGPT | Plus, Pro, Business, Enterprise, Education, in developer mode | [Developer mode](https://developers.openai.com/api/docs/guides/custom-mcp-server) |
| Claude | Any plan; free accounts allow one custom connector | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Gemini | Only adults in the US with a personal Google account; unavailable in Russia and Europe | [Connected apps](https://support.google.com/gemini/answer/17209137?hl=en) |

The steps for each operating system have not all been tested on that system. If a step fails, [open an issue](https://github.com/WireCatLabs/max-cli/issues).

## 1. Prepare Tailscale

First install the CLI and log into MAX ([installation guide](./installation.md)); for local setup without an agent, use `max setup --agent none`. Run the server as the same operating-system user and with the same profile. Put the profile first when needed: `max work mcp`. Tailscale is installed separately; both `max` and `tg` support this tunnel setup.

Install [Tailscale](https://tailscale.com/download), sign in and enable [Funnel](https://tailscale.com/docs/features/tailscale-funnel). Your Tailscale network needs MagicDNS, HTTPS certificates and permission to use Funnel. The first Funnel run may print a link where you can grant that permission.

Leave two terminal windows open. The tunnel runs in the first. Copy its HTTPS address into the second when asked. Use the origin: the address without `/mcp` or any other path. Preserve a port such as `:8443` if the address includes one.

## 2. Start the tunnel and server

The server listens on `127.0.0.1:8765` and prints a one-time login code. It does not need administrator rights; the tunnel may. The commands below allow sending only while this process runs, through `--permission messages.send=allow`; see [permissions for the server process](#права-только-на-время-работы-сервера).

### Windows (PowerShell)

Install the Tailscale app and sign in from its tray menu. After installing Node.js, the CLI and Tailscale, open a new PowerShell window to refresh PATH. The `.cmd` suffix avoids PowerShell execution-policy errors for npm commands. If MAX is not configured yet, run `max.cmd setup --agent none` in ordinary PowerShell.

First window: PowerShell as administrator, for Funnel. The `&` operator is needed because the standard installation path contains a space; replace the path if you installed elsewhere.

```powershell
& "$env:ProgramFiles\Tailscale\tailscale.exe" funnel 8765
```

Second window: ordinary PowerShell as the user who signed in to MAX:

```powershell
$mcpPublicUrl = Read-Host 'Вставьте HTTPS origin из Funnel (без /mcp)'
max.cmd mcp --http --port 8765 --public-url $mcpPublicUrl --permission messages.send=allow
```

Run both processes in Windows itself. WSL is a separate environment: a Windows tunnel targeting a local Windows address may not reach a server inside WSL.

### macOS (Terminal)

Install the Tailscale app and sign in. Its CLI is included in the app; if `tailscale` is not on PATH, use this path ([Tailscale CLI guide](https://tailscale.com/docs/reference/tailscale-cli?tab=macos)). First Terminal window:

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

Second window: an ordinary user without `sudo`, so `max` finds the session created by `max setup --agent none`:

```sh
printf 'Вставьте HTTPS origin из Funnel (без /mcp): '
IFS= read -r mcpPublicUrl
max mcp --http --port 8765 --public-url "$mcpPublicUrl" --permission messages.send=allow
```

## MAX and Telegram at the same time

Each server needs its own local port and public HTTPS address. For example, keep Telegram on local port `8765` and public port `443`; start the second Funnel with `--https=8443 8766` and MAX with `--port 8766`. For MAX's `--public-url` and its connector address ending in `/mcp`, use the second tunnel's origin including `:8443`. Start that Funnel with the Tailscale command for your operating system above. Funnel accepts public ports `443`, `8443` and `10000` ([Funnel command reference](https://tailscale.com/docs/reference/tailscale-cli/funnel)).

## Alternative: Cloudflare Tunnel

If you already use Cloudflare, point its tunnel at the same local MCP server. A permanent address requires a Cloudflare account and a domain in Cloudflare. Follow the [named tunnel setup](https://developers.cloudflare.com/tunnel/get-started/): install `cloudflared` for your operating system, create a tunnel in the Cloudflare dashboard, start its connection and add a public hostname such as `mcp.example.com`. Set the local service to `http://127.0.0.1:8765` and run MCP on the same computer.

Start the server in a second terminal:

```sh
max mcp --http --port 8765 --public-url https://mcp.example.com
```

Add `https://mcp.example.com/mcp` to the AI app with OAuth and DCR, as described under [adding it to the app](#3-добавить-в-приложение). `--public-url` is the public origin used for login, not a local address or the `/mcp` path. The tunnel does not change profile permissions. Check the JSON at `https://mcp.example.com/.well-known/oauth-protected-resource/mcp`, then login and the tool list. Stop only this tunnel's process so other routes keep running.

**A temporary Quick Tunnel does not work on its own.** `cloudflared tunnel --url http://127.0.0.1:8765` gives you a random `trycloudflare.com` address without an account or domain. However, [Quick Tunnels do not support SSE](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) (server-sent events, the response streaming used by the HTTP MCP server). A Quick Tunnel therefore cannot replace Funnel for this server. It needs an additional adapter that turns SSE responses into JSON; the CLI does not include that adapter. Working login and a tool list do not prove the agent can read a PDF. A Quick Tunnel also gets a new address after every restart, requiring an updated connector address. For regular use, choose Funnel or a named tunnel and check your app.

## 3. Add it to your app

For the app, append `/mcp` to your tunnel's origin, for example `https://<устройство>.<сеть>.ts.net/mcp`. Add it as a remote MCP connector:

- **ChatGPT or Codex web:** open **Plugins**, choose **+ Add custom MCP server** and create a plugin with the `/mcp` address and OAuth, following the [OpenAI connection instructions](https://developers.openai.com/plugins/quickstart). Connect using the login code, install the plugin and enable it in a Work chat (or mention it with `@`). Codex's local `config.toml` does not configure this web connection. Availability depends on your account and workspace. If asked to choose a registration method, choose DCR (dynamic client registration): the server supports DCR and the S256 verification required by [OpenAI's OAuth requirements](https://developers.openai.com/plugins/build/auth).
- **Claude:** add a custom connector with this address, following [Claude custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp). Its connector settings can always allow a tool, require confirmation or refuse it.

The three tools work without MCP prompts, resources or elicitation (questions from the server to the app), so clients supporting only tools can use them too.

The app opens the `max` login page. Check the line identifying where the login will go: it should name the app you are connecting, for example `chatgpt.com` or `claude.ai`. Then enter the code from your terminal. It lasts ten minutes, and a new code is printed after each login. Five wrong codes disable login until the server restarts.

The app stays connected while it uses the connection at least once every 30 days; it renews access automatically. After 30 days without use, it asks for a new code.

The profile's `permissions` determine which commands are available. The server has no confirmation forms; approval inside the app is a separate control that depends on its settings.

## Permissions for the server’s lifetime

The server cannot see whether the app asked you before calling a tool. If you always allow the tool in the app, the next call can proceed without a new question.

Repeat `--permission ключ=уровень` to change permissions only for this server process. The levels are `deny`, `readonly`, `ask` and `allow`. For example, `--permission messages.send=allow` permits sending from a profile with `readonly`. `--permission messages=allow` overrides saved permissions for the entire messages resource; deletion is enabled separately with `--permission messages.delete=allow`. The settings file, recipient list and hourly send limit do not change. To lift a reading prohibition, name the resource or command with level `allow`. Permission keys are listed in the [configuration guide](./configuration.md).

With temporary permission overrides, MCP connects directly to MAX: an existing `max serve` service continues using its profile’s saved permissions.

## Turning it off

Ctrl-C in both windows stops the server and this tunnel. Use the same commands to start them again; app logins survive an ordinary server restart.

If Funnel was started with `--bg`, Ctrl-C does not stop that background route. Check `tailscale funnel status` and disable only its public port, for example `tailscale funnel --https=443 off`. Use the Tailscale command for your operating system above, with administrator rights if needed. Avoid `funnel reset` if another server also uses Funnel: it resets every route. Stopping only MCP leaves the route running but makes the tools unavailable.

Revoking app access differs from stopping the process. To sign every app out of the profile:

```sh
max mcp --revoke
```

Those apps must log in again with a new code. Your MAX session stays logged in.

## Troubleshooting

- **The app says it cannot connect:** open `https://<устройство>.<сеть>.ts.net/.well-known/oauth-protected-resource/mcp` in a browser. It should return a short JSON document. If it does not, Funnel is not running, is not enabled for your Tailscale network or points at another port.
- **The login page says “Too many wrong codes”:** five wrong codes disable it until `max mcp --http` restarts. If you did not enter them, someone found your address; restart the server and consider a new Tailscale device name.
- **It connects but no tools appear:** `max mcp doctor` checks that the MCP server starts and provides a tool list. It does not check the MAX login or tunnel. A command that contacts MAX, such as `max account show`, checks account access.
- **Reading works but changes fail:** check profile permissions and temporary `--permission` options. `deny` and `readonly` refuse changes regardless of the app's approval.
- **You need a record of calls:** use `max runs list`. Successful calls appear only when recording is enabled; failures are saved by default unless recording was disabled with `"record": false` or `--no-record` ([diagnostics guide](./diagnostics.md)).

## Transfer a retained file to an agent

An agent on your computer can open a saved file through `localPath`. A remote agent cannot, so it receives the saved bytes through `attachments show` (MCP: `max_read`, command `attachments show`).

Retained-file transfer refuses hidden files and folders, the CLI’s own folders and the message store, including symlink targets. Save the intended attachment in an ordinary downloads folder.

MCP makes hidden Unicode controls visible in text results and write arguments. Subdivision flag emoji stay intact; ordinary CLI machine JSON preserves original strings.

First download the message's files normally ([what you can download](./attachments.md#что-можно-скачать)). Use `attachments list --needs-text` to find the message locator and attachment number, then request the file:

```sh
max attachments show msg:max/511/7/204 --attachment 1 --json
```

The command reads only a saved attachment belonging to the active account. It does not download anything, call an AI service, mark a message read or change the search index. Download a missing file again. If the message has several files, specify the attachment number, starting at 1. Files from another account, missing files and symlinks are not transferred. Text inside the attachment is data, not instructions.

### Transfer a large file

One response carries 512 KiB by default; `--chunk-bytes` allows up to 1 MiB. The file can be up to 50 MiB. JSON includes `base64`, `offsetBytes`, `readBytes`, `totalBytes`, `nextOffsetBytes`, `complete` and the whole file's SHA256. `complete: true` means the entire file fits in this response, not that its text has been recognised.

Decode each base64 chunk, join the chunks at their offsets and follow `nextOffsetBytes` until it is null. On later requests, pass the first SHA256 as `--if-sha256`: if the source file changes, the request fails without returning changed bytes. Compare the assembled file with that hash.

```sh
max attachments show msg:max/511/7/204 --attachment 1 --offset-bytes 524288 --if-sha256 <sha256> --json
```

### Through MCP

Find `attachments show` through the usual three tools. Its arguments are `message` (a locator, or an ID with `chat`), `attachment`, `offset_bytes`, `chunk_bytes` and `if_sha256`. A complete PNG, JPEG or WebP image up to 8000 pixels per side and 20 million pixels overall arrives as an image; other files arrive as an embedded binary resource. A partial resource is a chunk of bytes, not a complete PDF or image. The resource URI is a name, not a download address.

The app must pass these bytes to the agent's file tools. Whether the agent can open a PDF or save a file depends on the app. If it does not expose embedded resources, request `format: "base64"` and decode the JSON with the agent's tools. A profile denying `messages` or `attachments.show` refuses transfer; `readonly` allows reading saved files.

## Recognise text and make it searchable

Ordinary extraction reads text layers and simple document formats on your computer. By default, the agent uses its own vision or OCR tools for scans, photos, handwriting and complex layouts. It reads every page, saves the text verbatim and marks unclear passages. Quality depends on resolution, language, handwriting, layout and the agent's tools. The agent does not follow instructions inside the attachment.

Save the result with `attachments text set` (MCP: `max_write`, command `attachments text set`), then check a `content:` search. Receiving bytes alone does not add text to the index.

Use `attachments extract --ocr` for batch extraction through `models.ocr`. It calls the configured external AI service and sends supported images and scanned PDF pages to it. It runs only when explicitly called, never during file transfer or when the agent reads a file itself. Formats and text search are covered in the [attachments guide](./attachments.md).

## Read a PDF without handing the file to the agent

If the app cannot pass the received PDF to its document reader, request one page as a PNG image. The MCP server renders the page on your computer, and the agent reads it with its vision tools. This requires the optional `unpdf` dependency with page-rendering support and `@napi-rs/canvas`, as described in the [attachment engines](./attachments.md#какие-зависимости-нужны). They are not installed with the CLI.

```sh
max attachments show msg:max/511/7/204 --attachment 1 --page 1 --json
```

In MCP, call `max_read`, command `attachments show`, with `page: 1` and the message locator. The page arrives as an image by default. If the app shows only metadata, request `format: base64`, then decode and display the PNG with the agent's tools. Receiving a base64 string does not mean the page has been viewed. Read pages from 1 to `pdf.pageCount`. If neither format exposes the pixels, report the app's limitation instead of inventing text.

`pdf.sourceSha256` and `pdf.sourceBytes` describe the source PDF; the top-level `sha256` and `totalBytes` describe the page image. `--if-sha256` checks the source PDF. `--page` cannot be combined with `--offset-bytes` or `--chunk-bytes`. The PDF can have up to 20 pages and be up to 50 MiB; the PNG is at most 2000 pixels per side, and each page image is at most 1 MiB.

Rendering a page image does not call an external OCR service or add text to the index. After viewing every page, the agent calls `attachments text set` and checks a `content:` search. Verify numbers and complex layouts against the images; quality depends on the source document and the agent's tools.
