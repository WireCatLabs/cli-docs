---
title: "MCP server"
---

`max mcp` gives an agent access to a profile over [MCP](https://modelcontextprotocol.io), through stdin and stdout without a network listener. It ships with `max`; no separate installation is needed.

**When to use it.** Claude Code, Codex and other agents with a terminal can use `max` directly with [agent instructions](https://github.com/leemour/max-cli/blob/v0.23.0/README.md#для-скриптов-и-агентов). Token use and capabilities are the same. MCP is useful for clients without a terminal, such as Claude Desktop, or chat-based integration in Cursor, and when you want the client to request permission for each send. Browser-based ChatGPT and Claude require [Remote access](./remote.md).

## Connecting

Bots use a separate server, `max <имя> bot mcp` ([Bot MCP](./bot.md#бот-для-агента-mcp)). Its profile settings `readOnly` and `allow` control access. Bot flags `--allow-send`, `--allow-delete` and `--allow-moderate` are accepted with warnings and enable nothing. The `max mcp` flags described below apply to personal accounts and enable their write tools.

Log in through the terminal first (`max session start`); MCP does not handle login.

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

The profile goes first, as in any command:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor and other clients:** `max` prints a ready-to-use configuration entry:

```sh
max mcp config                  # только чтение
max work mcp config --allow-send
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

Paths are absolute because a client launched outside a terminal does not inherit its `PATH`. On Windows, `max` is a `max.cmd` file, which a client without a shell cannot execute. Flags such as `--allow-send` are included in the entry. `MAX_CONFIG_DIR`, `MAX_STATE_DIR` and `MAX_CACHE_DIR` are included only when set; tokens are never included.

With Node installed through nvm, fnm or Volta, the path points to one Node version. After changing versions, run `max mcp config` again. The command refuses when run through `npx`, because the `npx` cache may be deleted and invalidate the path.

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR` change where the session is found.** If they differ between your terminal and MCP client, the server may report no session although terminal commands work. Set identical values or leave them unset everywhere.

## Sending stays disabled until enabled

Without flags or `mcpTools` settings, the server is **read-only**: write tools are absent from its tool list. Enable sends:

```sh
claude mcp add max -- max mcp --allow-send
```

MCP sends pass the same checks as `max messages send`: read-only mode, recipient allowlist, hourly limit and send logging ([Security](./security.md)). The tool is also marked destructive: VS Code and Cursor request permission for each call, and Claude Code's documentation describes a confirmation dialog even when other actions have been pre-approved.

### Server-side confirmation forms

```sh
claude mcp add max -- max mcp --allow-send --confirm-send
```

With `--confirm-send`, every action visible to others — sending, editing, forwarding, pinning, reacting, voting, marking read, deleting and `mcpTools` actions — first shows a form. It includes **the destination chat**, its title and ID after resolving the agent's input, other arguments and **the full text**. Only Accept performs the action; there are no editable fields, only a button. The client's dialog shows arguments as the model supplied them (`chat: "Team"`); the server's form shows what you are approving (“Team Alpha (111)”).

- Declining or closing the form sends nothing. The agent receives `confirmation_required` and must not retry.
- A client without form support receives an error; **nothing is sent**. Claude Code supports forms.
- Approval is tied to the displayed arguments. Changing the chat, text or tool after approval performs nothing.
- Approval works once and expires after 5 minutes. Reusing the same response sends nothing.
- Without `--allow-send`, `--allow-mark-read`, `--allow-delete`, `--allow-moderate` or configured `mcpTools`, this flag causes a startup error because there is nothing to confirm.

`--allow-mark-read` exposes `max_chats_mark_read`. Other people can see read receipts, so this is a separate permission not included in `--allow-send`. It passes the same checks as sending.

`--allow-delete` exposes `max_messages_delete`, deleting up to 10 messages **only for the account owner**, not other participants. Deletion is irreversible, so `--allow-send` does not include it. This tool cannot delete for everyone; use `max messages delete --for-everyone` or rule-based group checks below. Deletion passes send checks, and each message counts toward `sendsPerHour`.

`--allow-moderate` exposes `max_chats_check`, equivalent to `max chats check`: check group rules and perform permitted actions. The flag supplies the consent required by `flag`; with it, messages and members are removed where consent is `flag` or `allow`. For `confirm`, the server first performs nothing and shows one form containing all such actions. After approval it performs exactly those actions. If new actions appear meanwhile, it refuses and the check must be run again. `forbid` actions never run. With `dry_run`, only a plan is displayed. The profile requires `delete` and `groups` permissions.

Flags enable tools; the profile's `allow` determines which tools the agent can see. **Both are required.** `max mcp --allow-send --allow-delete` with `allow` set to `send` exposes sending, but not editing, forwarding, pinning or deletion. Read tools are always visible.

### Account changes require configuration

Contacts, closing polls, joining or leaving groups, creating groups, admins and profile changes cannot be enabled by flags. Enable groups of these tools through `mcpTools` in the configuration file:

```sh
max config set mcpTools contacts,polls      # профилю по умолчанию
max work config set mcpTools groups         # профилю work
```

| Group | Tools | Required `allow` permission |
|---|---|---|
| `contacts` | `max_contacts_add`, `_remove`, `_rename`, `_block`, `_unblock` | `contacts` |
| `polls` | `max_polls_close` | `edit` |
| `groups` | `max_chats_join`, `_leave`, `_create`, `max_chats_admins_add`, `_remove` | `groups` |
| `profile` | `max_account_update` — name and description, no photo | `profile` |

This prevents an agent from enabling them by adding a startup flag. Every action passes `readOnly`, `allow` and send logging as the command does. `--confirm-send` also shows forms for these actions. `mcpTools` is rejected in the `bot` configuration section.

## Tools

| Tool | Command | Purpose |
|---|---|---|
| `max_inbox` | `max inbox`, `--since-time` | Unread messages or everything since a time in one call; `transcribe` converts voice messages; never marks read or advances `max inbox --new`; includes muted and archived chats like `max inbox --all` |
| `max_review` | `max review` | All messages, including yours, in chats active since `since` (default 3 days), for reviewing commitments; `transcribe` converts voice messages; `chat` restricts to one chat; `unanswered_after_hours` selects questions unanswered by you or admins for that many hours; includes muted and archived chats like `max review --all`; never marks read |
| `max_account_show` | `max account show` | Logged-in account |
| `max_status` | `max doctor` | Server profile, token presence, prior login and enabled write tools; never logs into MAX |
| `max_chats_list` | `max chats list` | Chats, filtered by name, kind or unread messages |
| `max_chats_show` | `max chats show` | One chat, its members and group settings |
| `max_chats_events` | `max chats events` | Joins, departures, additions and removals from service messages; past 7 days without `since` |
| `max_chats_members` | `max chats members list` | Group or channel members returned by MAX, with account creation and last seen times |
| `max_chats_rules` | `max chats rules show` | Group moderation rules; only the owner can change them through a command |
| `max_contacts_list` | `max contacts list` | People with direct conversations |
| `max_contacts_show` | `max contacts show` | One person and shared chats |
| `max_messages_list` | `max messages list` | Chat messages; `transcribe` converts voice messages; never marks read |
| `max_messages_search` | `max messages search` | Search data already read on this machine |
| `max_messages_context` | `max messages show`, `context` | One message and surrounding messages |
| `max_messages_photo` | `max messages download` | A message photo as an image, up to 512 KB; files, videos, voice messages or larger photos refuse with a download command. Never returns a photo URL |
| `max_messages_scheduled` | `max messages scheduled` | Pending sends with `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | Voice-message text recognized on this machine |
| `max_messages_send` | `max messages send` | Send, only with `--allow-send`; `at` schedules like `--at-time`; `reply_to` replies to a message; `markdown` formats text |
| `max_messages_edit` | `max messages edit` | Edit your message, only with `--allow-send` |
| `max_messages_forward` | `max messages forward` | Forward to another chat, only with `--allow-send`; `silent` disables notifications |
| `max_messages_pin` | `max messages pin` | Pin in a group or channel, only with `--allow-send`; silent unless `notify` is supplied |
| `max_messages_unpin` | `max messages unpin` | Unpin; requires `message`, but MAX removes its single pin regardless of the ID; only with `--allow-send` |
| `max_reactions_add` | `max reactions add` | Add a reaction, with `--allow-send` and `reaction` permission |
| `max_reactions_remove` | `max reactions remove` | Remove your reaction, under the same permissions |
| `max_polls_vote` | `max polls vote` | Vote or withdraw a vote, only with `--allow-send` |
| `max_polls_create` | `max polls create` | Create a poll, only with `--allow-send` |
| `max_chats_mark_read` | `max chats mark-read` | Mark a chat read, only with `--allow-mark-read` |
| `max_messages_delete` | `max messages delete` | Delete for the owner, only with `--allow-delete` |
| `max_chats_check` | `max chats check` | Check group rules and perform permitted actions, only with `--allow-moderate` |
| `max_contacts_*`, `max_polls_close`, `max_chats_join` and others | `max contacts …`, `max polls close`, `max chats …`, `max account update` | Available only for a group enabled in `mcpTools` above |

Responses match command `--json` output: lists use `{ items, page, limit, hasMore }`, IDs are strings. Errors use `{ error: { code, message, … } }` with CLI error codes. Ambiguous chat names return `candidates` without sending anything.

`at` in `max_messages_send` follows `--at-time`: `2026-09-25T09:00` (local time), or `30m`, `2h`, `1d`, from one minute to one year, rounded down to a minute. It cannot be combined with `silent` or `send_id`. The message counts toward the limit in the hour when it is sent. `--confirm-send` shows the send time. If no response arrives, it is not retried; inspect the queue with `max_messages_scheduled`.

## Prompts and chats through `@`

The server provides four prompts; in Claude Code, these are `/` commands:

| Prompt | Argument | Agent behavior |
|---|---|---|
| `catch-up` | `since`, optional | Calls `max_inbox` once and summarizes by chat; sends nothing |
| `reply` | `chat` | Reads the chat, drafts a reply and sends only after you approve that text |
| `review` | `since`, `groups`, optional | Calls `max_review` once; groups commitments into what I owe, what I await and what needs clarification, with message IDs. Checks groups for completion before declaring anything overdue. Reminders remain drafts until approval. Ends with `since` for the next review |
| `find` | `text` | Finds a person or words and shows surrounding messages; sends nothing |

`reply` sends through `max_messages_send`; without `--allow-send`, it only displays the draft.

Chats are resources at `max://chat/<id>`, mentionable through `@` in Claude Code. A resource returns a chat and its latest messages. Resource listings come from shared `messages.db` for the profile account without querying MAX and remain empty before any data is stored. Only reading an individual chat logs into MAX.

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max mcp` and `max bot mcp`, without contacting MAX.

## Connection lifecycle

The first call logs into MAX; later calls reuse its connection. It closes after 2 minutes without calls, or 5 minutes after login regardless of activity. Chat lists come from the login response, so this limit prevents indefinitely stale lists. The next call logs in again. Calls run sequentially even when the client submits them together.

The server exits when the client closes stdin, closing its MAX connection too.
