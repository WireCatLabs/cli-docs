---
title: "MCP server"
---

<a id="права-профиля-управляют-инструментами" />

Use this page to connect your MAX account to an agent application without terminal access, such as Claude Desktop or Cursor chat, or to let the application request approval before actions. You will learn to connect the account, choose what your agent may do, and use ready-made requests and chat mentions.

Terms used below:

- **MCP** ([Model Context Protocol](https://modelcontextprotocol.io)) — a standard for agent applications to use external tools. The application is the **MCP client**; `max mcp` is the **MCP server**.
- **Tool** — an action the server offers to your agent, such as reading or writing.
- **Ready-made request** (prompt) — a task the application displays as a command, such as reviewing unread messages.
- **Resource** — data the application can attach to the agent chat, such as a messenger chat.
- **Profile** — settings and one `max` login; see [profiles](./profiles.md).

The server is included with `max`; no separate installation is needed. It normally communicates through stdin and stdout. `max mcp --http --public-url` instead exposes tools on a local port behind your HTTPS tunnel.

## Do you need MCP?

An AI agent with terminal command access, such as Claude Code, Codex, Cursor agent or Gemini CLI, can call `max` directly. It learns how from the skill printed by `max skill show`. MCP is useful for:

- Applications without terminal access, such as Claude Desktop or Cursor chat.
- Applying profile permissions to each operation exposed by the application.

ChatGPT and Claude **in a browser** connect through `max mcp --http`; see [use from web or mobile](./remote.md).

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

First run `max setup --agent none` in your local terminal to log in to MAX; MCP does not perform login. Then `max mcp setup` connects the application separately. Your agent can read `max skill show` before login; it explains both steps.

**Codex or Claude Code on this computer:**

```sh
max mcp doctor                 # проверяет запуск MCP и список инструментов
max mcp setup codex           # добавляет сервер в Codex
max mcp setup claude-code     # или в Claude Code
```

For another profile, put its name first: `max work mcp setup codex`. Setup uses the application's own commands and leaves other servers intact. If an entry with the same name exists, remove it in the application before repeating setup. If the profile exposes write tools, check permissions, then repeat with `--allow-writes`. This flag confirms installation only: it does not change profile permissions or flags such as `--allow-send`.

`mcp doctor` reads no messages and does not log in to MAX. Success means MCP starts and lists tools; it does not prove the session is valid. `potentialWrites` counts tools without the read-only annotation. Web and mobile need a separate [remote connection](./remote.md).

**Claude Code manually:**

```sh
claude mcp add max -- max mcp
```

With a profile, put its name first as in any command:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor and other applications:** `max` prints the configuration entry:

```sh
max mcp config                  # права текущего профиля
max work mcp config
```

```json
{
  "mcpServers": {
    "max": {
      "type": "stdio",
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\you\\AppData\\Roaming\\npm\\node_modules\\@wirecat\\max-cli\\dist\\bin\\max.js", "mcp"]
    }
  }
}
```

Check profile permissions before connecting the agent, then insert the entry into the application's `mcpServers` configuration. Claude Desktop uses `%APPDATA%\Claude\claude_desktop_config.json` on Windows and `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS; Cursor uses `~/.cursor/mcp.json`. The command writes nothing itself.

Entries use full paths because an application launched outside a terminal does not inherit its `PATH`. On Windows, `max` is `max.cmd`, which cannot run without a shell. Flags such as `--allow-send` are included. `MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR`, `MESSAGING_STORE` and `XDG_RUNTIME_DIR` are included only when set; tokens are never included. `MAX_CACHE_DIR` covers only the old cache; `MESSAGING_STORE` sets the shared local archive. Passing the archive and keyring communication paths lets desktop applications use the same login and saved messages as the terminal.

With nvm, fnm or Volta, the Node path points to one version. Run `max mcp config` again after changing that version. The command refuses to run from `npx`, whose cache cleanup would remove the saved path.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` change where login data is found.** If set in the terminal but not in the MCP application, or vice versa, the server can report “no session” while terminal `max` works. Set them consistently or leave them unset everywhere.

Bots have their own server, `max <имя> bot mcp`; see [a bot for your agent](./bot.md#бот-для-агента-mcp). Bot-profile `permissions` controls access. Its legacy `--allow-send`, `--allow-delete` and `--allow-moderate` flags produce a warning and enable nothing.

## What your agent may do

Profile `permissions` controls access ([permissions reference](./configuration-reference.md#права-доступа)). `deny` blocks a command; `readonly` allows reading; `ask` and `allow` permit the requested write. The server has no confirmation form: configure approval in the agent application. Terminal commands at `ask` still require an answer or explicit flag. `--permission ключ=уровень` changes permissions only for this server process. `MAX_PROFILE_LOCK` can fix the profile.

Legacy `--confirm-send`, `--allow-send`, `--allow-delete` and `--http-confirmation` no longer control agent permissions. They produce a warning but keep saved configurations working; remove them from application entries.

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

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max mcp` and `max bot mcp`, without contacting MAX.

## Statistics charts

`max_read` (`command: "stats charts"`) reads local chat statistics and returns JSON `chart`. For an image, set `format: "png"`: the response contains a dark-theme PNG and JSON with `chart` data and `image` dimensions. Without `format`, it stays JSON. It neither contacts MAX nor writes files; permission `messages` is required. Join/leave charts (`membership`) are unavailable here.

## Discussion links

The `link-conversations` request lets an agent link replies into discussions. It first estimates volume through `max_read` (`command: "conversations batches status"`) and waits for your consent for this chat. It then reads packets through `max_read` (`command: "conversations batches next"`), saves links through `max_write` (`command: "conversations links add"`) and rebuilds through `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) deletes agent links and also requires rebuilding. Writes require `conversations.links`. If search vectors use an external service, MCP search sends it the question text too.

## Files and saved messages

`max_read` (`command: "attachments list"`) shows saved file paths and text status; `max_write` (`command: "attachments text set"`) saves text read by the agent for `content:` search. Extraction runs only in the terminal. `max_read` with `command: "messages context"` and `arguments: { offline: true }` reads only the local archive.

MAX has no Telegram-style topics, so there are no `max_topics_*` tools. Direct transcription can return a saved transcript from the same model. Photos use MAX previews selected by `index`, limited to 512 KB. Models never download automatically. The server releases its connection before local recognition; it closes the search component on shutdown.

## Connection lifecycle

The first call needing MAX opens a connection; subsequent network calls reuse it. Local search, statistics, evidence and saved login data need no connection. It closes after 2 minutes idle and always after 5 minutes from login: chat lists come from login responses and would otherwise become stale. The next call logs in again. Calls run sequentially even when the application sends them together.

With stdin/stdout, closing application stdin ends the server and its MAX connection. HTTP runs until Ctrl-C. `max mcp --http --public-url https://<имя>.ts.net` uses an HTTPS tunnel and terminal-code login. Permissions are the same over HTTP and stdin/stdout. `max mcp --revoke` revokes application logins while keeping the MAX session. See [use from web or mobile](./remote.md).
