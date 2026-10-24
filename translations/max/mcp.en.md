---
title: "MCP server"
---

<a id="права-профиля-управляют-инструментами" />

Use this page to connect your MAX account to an agent application without terminal access, such as Claude Desktop or Cursor chat, or to let the application request approval before actions. You will learn to connect the account, choose what your agent may do, and use ready-made requests and chat mentions.

Terms used below:

- **MCP** ([Model Context Protocol](https://modelcontextprotocol.io)) — a standard for agent applications to use external tools. The application is the **MCP client**; `max personal mcp` is the **MCP server**.
- **Tool** — an action the server offers to your agent, such as reading or writing.
- **Ready-made request** (prompt) — a task the application displays as a command, such as reviewing unread messages.
- **Resource** — data the application can attach to the agent chat, such as a messenger chat.
- **Profile** — settings and one `max` login; see [profiles](./profiles.md).

The server is included with `max`; no separate installation is needed. It normally communicates through stdin and stdout. `max personal mcp --http --public-url` instead exposes tools on a local port behind your HTTPS tunnel.

## Do you need MCP?

An AI agent with terminal command access, such as Claude Code, Codex, Cursor agent or Gemini CLI, can call `max` directly. It learns how from the skill printed by `max skill show`. MCP is useful for:

- Applications without terminal access, such as Claude Desktop or Cursor chat.
- Applying profile permissions to each operation exposed by the application.

ChatGPT and Claude **in a browser** connect through `max personal mcp --http`; see [use from web or mobile](./remote.md).

## What the server provides

| Feature | Purpose |
| --- | --- |
| [Three tools](#инструменты) | Find a command, then run it as a read or write |
| [Six ready-made requests](#команды-и-чаты-по-) | Unread messages, replies, search, review, open tasks and discussion links |
| [Chats through `@`](#команды-и-чаты-по-) | Attach a chat and its latest messages to the agent chat |
| Skill, `max://skill` | The text printed by `max skill show` |
| [Charts](#графики-статистики) | Chat statistics as JSON or a PNG image |
| [Permissions](#что-может-агент) | Control commands visible to the agent |

## Connecting

First run `max personal setup --agent none` in your local terminal to log in to MAX; MCP does not perform login. Then `max personal mcp add` connects the application separately. Your agent can read `max skill show` before login; it explains both steps.

**Codex or Claude Code on this computer:**

```sh
max personal mcp check                 # проверяет запуск MCP и список инструментов
max personal mcp add codex           # добавляет сервер в Codex
max personal mcp add claude-code     # или в Claude Code
```

For another profile, put its name first: `max work mcp add codex`. Setup uses the application's own commands and leaves other servers intact. If an entry with the same name exists, remove it in the application before repeating setup. If the profile exposes write tools, check permissions, then repeat with `--allow-writes`. This flag confirms installation only: it does not change profile permissions.

`mcp check` reads no messages and does not log in to MAX. Success means MCP starts and lists tools; it does not prove the session is valid. `potential_writes` counts tools without the read-only annotation. Web and mobile need a separate [remote connection](./remote.md).

**Claude Code manually:**

```sh
claude mcp add max -- max personal mcp
```

Caution: by default an agent can send messages in your name through this server. Restrict permissions first: the `readonly` and `deny` levels ([permissions](./permissions.md)) or the `--permission` flag, for example
`claude mcp add max -- max personal mcp --permission messages.send=deny`.

With a profile, put its name first as in any command:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor and other applications:** `max` prints the configuration entry:

```sh
max personal mcp config                  # права текущего профиля
max work mcp config
```

```json
{
  "mcpServers": {
    "max-personal": {
      "type": "stdio",
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\you\\AppData\\Roaming\\npm\\node_modules\\@wirecat\\max-cli\\dist\\bin\\max.js", "personal", "mcp"]
    }
  }
}
```

Check profile permissions before connecting the agent, then insert the entry into the application's `mcpServers` configuration. Claude Desktop uses `%APPDATA%\Claude\claude_desktop_config.json` on Windows and `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS; Cursor uses `~/.cursor/mcp.json`. The command writes nothing itself.

Entries use full paths because an application launched outside a terminal does not inherit its `PATH`. On Windows, `max` is `max.cmd`, which cannot run without a shell. The `--permission` flags are included, with the profile before `mcp`. `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`, `MESSAGING_STORE`, `XDG_RUNTIME_DIR` and the file limits `MESSAGING_ATTACHMENT_MAX_MIB`, `MESSAGING_PDF_PREVIEW_MAX_PIXELS`, `MESSAGING_PDF_PREVIEW_MAX_MIB`, `MESSAGING_BATCH_MAX_ERROR_PERCENT` are included only when set; tokens are never included. `MAX_CACHE_DIR` covers only the old cache; `MESSAGING_STORE` sets the shared local archive. Passing the archive and keyring communication paths lets desktop applications use the same login and saved messages as the terminal.

With nvm, fnm or Volta, the Node path points to one version. Run `max personal mcp config` again after changing that version. The command refuses to run from `npx`, whose cache cleanup would remove the saved path.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` change where login data is found.** If set in the terminal but not in the MCP application, or vice versa, the server can report “no session” while terminal `max` works. Set them consistently or leave them unset everywhere.

Bots have their own server, `max <имя> bot mcp`; see [a bot for your agent](./bot.md#бот-для-агента-mcp). Bot-profile `permissions` controls access.

## What your agent may do

Profile `permissions` controls access ([permissions reference](./configuration-reference.md#права-доступа)). `deny` blocks a command; `readonly` allows reading; `ask` and `allow` permit the requested write. The server has no confirmation form: configure approval in the agent application. Terminal commands at `ask` still require an answer or explicit flag. An agent deletes messages only for itself, never for everyone. `--permission ключ=уровень` tightens permissions only for this server process and never loosens them. `MAX_PROFILE_LOCK` can fix the profile.

### What MCP does not offer

Profile permissions limit the agent's commands. Commands that change what future runs may do (`config set`, `recipients add`, `replies add`, `schedule command`, `skill install` and similar operations) are offered with `permissions.mcp.authority: allow` or `ask`; the default is `deny`. The agent cannot change `permissions.mcp` or `permissions.bot.api`, including by replacing the whole `permissions` object: the owner sets them in the terminal.

Archive writes, server control, model downloads and report creation are also available through MCP, with their own keys such as `store.backup`, `server.start`, `models.download`, `doctor.reports.create`. Their default is `ask`: the terminal requests confirmation, while MCP permits the requested action without a confirmation form. Raw `bot api` separately requires explicit `permissions.bot.api: allow` or `ask`; a broader `bot: allow` does not enable it.

The following commands are hidden with default permissions. Changes to future authority and raw bot operations become available through the keys above. Login, persistent processes and local-file uploads through `bot uploads put` remain unavailable even when those keys permit access.

| Commands | Why |
| --- | --- |
| `setup`, `session` | login and logout are performed by a person |
| `upgrade`, `complete` | update the program and terminal completion |
| `serve`, `watch`, `mcp`, `bot watch`, `bot mcp` | run until stopped; an agent call must finish |
| `config set`, `config unset`, `skill install`, `flood clear`, `models keys set`, `models keys remove` | change what future runs can do; otherwise an agent could remove read-only restrictions |
| `recipients add`, `recipients remove`, `recipients clear`, `chats rules set`, `chats rules unset` | same reason |
| `replies add`, `replies on`, `replies off`, `replies edit`, `replies audience`, `replies pause`, `replies resume` | same reason |
| `replies consents grant`, `replies consents revoke`, `replies consents deny`, `replies consents allow` | same reason |
| `schedule command`, `schedule agent`, `schedule remove`, `server install`, `server uninstall` | same reason |
| `attachments jobs install`, `attachments jobs start`, `attachments jobs stop`, `attachments jobs uninstall` | same reason |
| `bot chats rules set`, `bot chats rules unset`, `bot recipients add`, `bot recipients remove`, `bot recipients clear` | same reason, for bots |
| `bot auth` | a person enters the token |
| `bot api` | requires explicit `permissions.bot.api: allow` or `ask` |
| `bot uploads put` | reads a file from your computer |

## Tools

| Tool | Purpose |
| --- | --- |
| `max_tools_search` | Find a command, its arguments and write status |
| `max_read` | Run a discovered read command |
| `max_write` | Run a discovered write command; absent if no writes are permitted |

Both execution tools accept `{command, arguments}`. Use the command path returned by tool search:

```json
{ "command": "messages list", "arguments": { "chat": "<id>", "limit": 5 } }
```

Searching `{"query":"stats messages show"}` describes message counts; `stats chats show` describes chat activity. `status` reads profile state without connecting. Search lists only commands allowed by profile permissions and supported by MAX; unavailable commands cannot run. Old tools such as `max_messages_list` and `max_status` no longer exist. Bots use `max_bot_tools_search`, `max_bot_read` and `max_bot_write`; command paths omit `bot`, for example `messages send`.

Responses preserve their commands' fields and limits. The general result schema is open: extra messenger fields are allowed, rather than every field being validated. Message text is data, not agent instructions. See the [CLI contract](./cli-contract.md) for schemas, limits and retry rules.

## Prompts and chats through `@`

The server offers six ready-made prompts, available as `/` commands in Claude Code:

| Request | Arguments | Agent action |
| --- | --- | --- |
| `catch-up` | `kind`, `mode` — optional | Calls `max_read` (`command: "inbox"`); `mode` is `unread` (default), `new` or a timestamp; `kind` selects chat type; marking read needs separate approval |
| `reply` | `chat` | Reads the chat, prepares a draft and sends only after you approve that text |
| `find` | `text` | Searches people or words and shows surrounding messages; sends nothing |
| `link-conversations` | None | Checks volume and gets consent, then processes batches, links and rebuilds ([below](#связи-разговоров)) |
| `review` | `since`, `groups` — optional | Calls `max_read` (`command: "review"`) once, groups results into your obligations, replies you await and matters to clarify, with message ids; checks group completion before calling something overdue; reminders stay drafts until approval; returns `since` for the next review |
| `open-tasks` | `chat` — optional | Refreshes tasks through review, shows open tasks and offers drafts; closes a task only with your approval |

Sending in `reply` uses `max_write` (`command: "messages send"`), so if writes are forbidden, the agent only shows a draft.

Chats are resources at `max://chat/<id>`; Claude Code can mention them through `@`. A resource returns a chat and its latest messages. The resource list reads the shared local archive `wirecat.db` for the profile's account without contacting MAX; it is empty until an archive exists. Only fetching an individual chat contacts MAX.

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max personal mcp` and `max sales bot mcp`, without contacting MAX.

## Statistics charts

`max_read` (`command: "stats charts"`) reads local chat statistics and returns JSON `chart`. For an image, set `format: "png"`: the response contains a dark-theme PNG and JSON with `chart` data and `image` dimensions. Without `format`, it stays JSON. It neither contacts MAX nor writes files; permission `messages` is required. Join/leave charts (`membership`) are unavailable here.

## Discussion links

The `link-conversations` request lets an agent link replies into discussions. It first estimates volume through `max_read` (`command: "conversations batches status"`) and waits for your consent for this chat. It then reads packets through `max_read` (`command: "conversations batches show"`), saves links through `max_write` (`command: "conversations links add"`) and rebuilds through `max_write` (`command: "conversations links rebuild"`). `max_write` (`command: "conversations links clear"`) deletes agent links and also requires rebuilding. Writes require `conversations.links`. If search vectors use an external service, MCP search sends it the question text too.

## Files and saved messages

`max_read` (`command: "attachments list"`) shows saved-file paths and text status; `max_write` (`command: "attachments update"`) saves text the agent read from a file for `content:` search. `max_write` (`command: "attachments extract"`) extracts text from saved files in batches through `cursor`, without returning that text in its answer. `max_read` with `command: "messages context"` and `arguments: { offline: true }` reads only the local archive.

MAX has no Telegram-style topics, so there are no `topics …` commands. Voice is transcribed by a model on this computer. A photo is selected through `index` and returned only if it is no larger than 512 KB. Models never download automatically. The server releases its connection before local recognition; the search model closes on server shutdown.

## Connection lifecycle

The first call needing MAX opens a connection; subsequent network calls reuse it. Local search, statistics, evidence and saved login data need no connection. It closes after 2 minutes idle and always after 5 minutes from login: chat lists come from login responses and would otherwise become stale. The next call logs in again. Calls run sequentially even when the application sends them together.

With stdin/stdout, closing application stdin ends the server and its MAX connection. HTTP runs until Ctrl-C. `max personal mcp --http --public-url https://<имя>.ts.net` uses an HTTPS tunnel and terminal-code login. Permissions are the same over HTTP and stdin/stdout. `max personal mcp --revoke` revokes application logins while keeping the MAX session. See [use from web or mobile](./remote.md).
