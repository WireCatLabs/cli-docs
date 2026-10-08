---
title: "MCP server"
---

`max mcp` exposes a profile to an agent through [MCP](https://modelcontextprotocol.io), using stdin/stdout by default. `--http --public-url` exposes tools on a local port behind your HTTPS tunnel. The server is included with `max`; no separate installation is needed.

**When you need it.** Claude Code, Codex and other agents with a terminal can use `max` directly with the [agent instructions](https://github.com/leemour/max-cli/blob/v0.37.0/README.md#для-скриптов-и-агентов). MCP is for clients without a terminal, such as Claude Desktop and Cursor chat, and for people who want the client to apply profile permissions to every operation. ChatGPT and Claude in a browser connect through `--http`; see [remote.md](./remote.md).

## Connecting

Bots have their own server, `max <имя> bot mcp` ([bot.md](./bot.md#бот-для-агента-mcp)). Access is determined by the bot profile's `permissions`. Its `--allow-send`, `--allow-delete` and `--allow-moderate` flags are accepted with a warning and enable nothing. The following sections describe personal-account permissions and confirmation flags; legacy access flags grant no permissions.

First run `max setup --agent none` in a local terminal; MCP cannot log you in. This connects your MAX account; `max mcp setup` below separately connects the MCP client. Your agent can read `max skill show` before login.

**Codex or Claude Code on this computer:**

```sh
max mcp doctor                 # проверяет запуск MCP и список инструментов
max mcp setup codex           # добавляет сервер в Codex
max mcp setup claude-code     # или в Claude Code
```

For another profile, put its name first: `max work mcp setup codex`. Setup uses the client itself and does not overwrite other servers. If an entry with the same name exists, remove it in the client before repeating setup. If the profile offers write tools, check its permissions first, then repeat with `--allow-writes`. This flag approves installation only; it does not change profile permissions or flags such as `--allow-send`.

`mcp doctor` reads no messages and does not log into MAX. Success confirms MCP startup, not session validity. `potentialWrites` counts tools not declared read-only. Browser and phone access need a separate remote connection ([Remote access](./remote.md)).

**Claude Code:**

```sh
claude mcp add max -- max mcp
```

With a profile, put its name first as in any command:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor and other clients:** `max` prints a ready-to-use configuration entry:

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
      "args": ["C:\\Users\\you\\AppData\\Roaming\\npm\\node_modules\\@leemour\\max-cli\\dist\\bin\\max.js", "mcp"]
    }
  }
}
```

Paste it into `mcpServers` in your client's configuration. Claude Desktop uses `%APPDATA%\Claude\claude_desktop_config.json` on Windows and `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS; Cursor uses `~/.cursor/mcp.json`. The command writes nothing itself.

Paths in the entry are absolute: a client launched outside the terminal does not see its `PATH`, and on Windows `max` is a `max.cmd` file that a client without a shell cannot launch. `--allow-send` and other flags are copied into the entry. `MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` are included only when set; the token never is. `MAX_CACHE_DIR` now refers only to the legacy cache; `MESSAGING_STORE` selects the shared archive. If the terminal sets `MESSAGING_STORE`, add the same value to the MCP entry's `env` manually: `max mcp config` does not copy it. Otherwise a desktop-launched client may open another archive, and local search or a message locator will not find the stored data.

With Node installed through nvm, fnm or Volta, the path points to one Node version. After changing versions, run `max mcp config` again. The command refuses when run through `npx`, because the `npx` cache may be deleted and invalidate the path.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` change where sign-in data is found.** If they are set in your terminal but not in your MCP client, or vice versa, the server reports “no session” even though `max` works in the terminal. Set them identically in both places or leave them unset everywhere.

## Profile permissions control the tools

MCP follows the profile’s effective `permissions`. `deny` forbids the command, `readonly` forbids writes, and `ask` and `allow` permit a requested write without a confirmation form. In the CLI, `ask` still requires an answer or explicit flag. `--permission ключ=уровень` overrides the level only for the server process. Lock the profile with `MAX_PROFILE_LOCK`. Older `--confirm-send`, `--allow-send`, `--allow-delete` and `--http-confirmation` flags no longer determine access; they are accepted with a warning so saved configurations can still start.

## Tools

The personal-account server offers three tools:

| Tool | Purpose |
|---|---|
| `max_tools_search` | Find a command for a task and get its arguments and write indicator |
| `max_read` | Run a discovered read command |
| `max_write` | Run a discovered write command; absent if the profile allows no writes |

A read call looks like `{ "command": "messages list", "arguments": { "chat": "<id>", "limit": 5 } }`. Searching with `{"query":"stats messages show"}` describes message counts; `stats chats show` describes chat activity. `status` reads profile state without connecting. Unavailable commands are neither returned by search nor executed. Command responses keep their fields and limits; text is data, not instructions to the agent. The shared result schema is open: additional provider fields are allowed, without promising complete validation of business rules.

Older tools such as `max_messages_list` and `max_status` no longer exist. Bots use the same approach: `max_bot_tools_search`, `max_bot_read` and `max_bot_write`. Write the command inside the call without `bot`, for example `messages send`.

See the [CLI contract](./cli-contract.md) for command paths, limits and retry rules.

## Prompts and chats through `@`

The server offers six ready-made prompts, available as `/` commands in Claude Code:

| Prompt | Argument | Agent behavior |
|---|---|---|
| `catch-up` | `kind`, `mode`: optional | Calls `max_read` (`command: "inbox"`); `mode` is `unread` (default), `new` or a point in time; `kind` selects the chat type; marking as read requires separate confirmation |
| `reply` | `chat` | Reads the chat, drafts a reply and sends only after you approve that text |
| `link-conversations` | none | first estimate volume and obtain owner consent, then batches, links and graph rebuild |
| `review` | `since`, `groups`: optional | Calls `max_read` (`command: "review"`) once and groups items into “I owe”, “waiting for others” and “needs clarification”, with message IDs; checks groups for completion before labeling items overdue; reminders remain drafts until you agree; ends with `since` for the next review |
| `open-tasks` | `chat`: optional | Calls review to update tasks, shows open tasks and suggests drafts; closes a task only with the owner’s consent |
| `find` | `text` | Finds a person or words and shows surrounding messages; sends nothing |

Sending in `reply` uses `max_write` (`command: "messages send"`), so if writes are forbidden, the agent only shows a draft.

Chats are resources at `max://chat/<id>`, mentionable through `@` in Claude Code. A resource returns a chat and its latest messages. Resource listings come from shared `messages.db` for the profile account without querying MAX and remain empty before any data is stored. Only reading an individual chat logs into MAX.

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max mcp` and `max bot mcp`, without contacting MAX.

## Connection lifecycle

The first call that needs MAX opens the connection; later network calls reuse it. Local search, statistics, evidence and reading stored data do not need a login. It closes after 2 minutes without calls, or 5 minutes after login regardless of activity. Chat lists come from the login response, so this limit prevents indefinitely stale lists. The next call logs in again. Calls run sequentially even when the client submits them together.

Telegram topics are not available in MAX, so there are no `max_topics_*` tools. Direct recognition can return a saved transcript from the same model; a photo uses the MAX preview, is selected with `index` and is limited to 512 KB. Models are never downloaded automatically. Before local recognition, the server releases the connection; the search model closes when the server exits.

In stdin/stdout mode, the server exits when the client closes stdin, closing its MAX connection too. HTTP runs until Ctrl-C.

`max mcp --http --public-url https://<имя>.ts.net` is accessible through an HTTPS tunnel, with sign-in using a code from the terminal. Permissions apply equally through HTTP and stdin/stdout; there are no server confirmation forms. `max mcp --revoke` ends application sign-ins while preserving the MAX session. See [browser connection](./remote.md).

Through MCP, the agent gets the `link-conversations` instructions, estimates the work with `max_read` (`command: "conversations batches status"`) and waits for the owner’s consent for that chat. It then reads `max_read` (`command: "conversations batches next"`), saves answers through `max_write` (`command: "conversations links add"`) and rebuilds the graph through `max_write` (`command: "conversations build"`). `max_write` (`command: "conversations links clear"`) removes agent answers; rebuild the graph afterward as well. Writes require `conversations.links`. External-vector settings also apply to MCP search: the question is sent to the selected service.

`max_read` (`command: "attachments list"`) shows paths and text status; `max_write` (`command: "attachments text set"`) saves agent-written text for `content:`. Extraction uses the CLI. `max_read` with `command: "messages context"` and `arguments: { offline: true }` reads only the archive.

## Statistics charts

`max_read` (`command: "stats charts"`) reads statistics from local storage and returns `chart` in JSON. For an image, set `format: "png"`: the response includes a dark-theme PNG and JSON with the source `chart` data and `image` size. Without `format`, the response remains JSON. The tool does not connect to MAX or write files; it requires `messages` access. Joins and leaves (`membership`) are unavailable in this mode.
