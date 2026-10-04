---
title: "MCP server"
---
`max mcp` gives an agent access to a profile over [MCP](https://modelcontextprotocol.io), through stdin and stdout without a network listener. It ships with `max`; no separate installation is needed.

**When to use it.** Claude Code, Codex and other agents with a terminal can use `max` directly with [agent instructions](https://github.com/leemour/max-cli/blob/v0.27.0/README.md#для-скриптов-и-агентов). Token use and capabilities are the same. MCP is useful for clients without a terminal, such as Claude Desktop, or chat-based integration in Cursor, and when you want the client to request permission for each send. Browser-based ChatGPT and Claude require [Remote access](./remote.md).

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

The profile goes first, as in any command:

```sh
claude mcp add max-work -- max work mcp
```

**Claude Desktop, Cursor and other clients:** `max` prints a ready-to-use configuration entry:

```sh
max mcp config                  # права текущего профиля
max work mcp config --confirm-send
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

⚠ **`MAX_CONFIG_DIR`, `MAX_STATE_DIR`, `MAX_CACHE_DIR` change where the session is found.** If they differ between your terminal and MCP client, the server may report no session although terminal commands work. Set identical values or leave them unset everywhere.

## Profile permissions control the tools

CLI and MCP share `permissions`. `deny` hides the tool; `readonly` exposes reading tools only. At `ask`, writes require a form; `allow` writes without a question. Most writes are allowed by default, including sends and changes to contacts, groups and the profile. Message deletion requires confirmation by default.

To let the agent read and delete messages without a form, while forbidding sends and edits:

```sh
max work config set permissions.messages readonly
max work config set permissions.messages.delete allow
```

Other resources retain their permissions. The recipient list and `sendsPerHour` limit apply at every level. The agent's shared delete tool deletes only for the owner; ending other sessions and accessing login secrets are unavailable to it.

### Server-side confirmation forms

```sh
claude mcp add max -- max mcp --confirm-send
```

`--confirm-send` displays a form before every write, including `allow`. Without it, only `ask` needs a form. Startup with `--yes` confirms other `ask` actions; `--allow-dangerous` confirms message deletion and moderation actions requiring that confirmation. These flags do not bypass `deny`, `readonly`, the recipient list or the limit.

The form is bound to the tool, chat and displayed parameters. An answer works once and for five minutes; substituting parameters after confirmation is refused. An owner's refusal or a client without form support writes nothing. Group moderation also follows its own rule levels: `readonly` only reports the result, while `ask` requires a form.

Legacy `--allow-send`, `--allow-mark-read`, `--allow-delete` and `--allow-moderate` are still accepted with warnings but grant no permissions. `mcpTools` no longer restricts the tool set. Convert an older file with `max config migrate --dry-run`, then `max config migrate`.

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
| `max_messages_link` | `max messages link` | a stored message locator, without connecting or returning message text |
| `max_messages_context` | `max messages show`, `context` | One message and surrounding messages |
| `max_messages_photo` | `max messages download` | A message photo as an image, up to 512 KB; files, videos, voice messages or larger photos refuse with a download command. Never returns a photo URL |
| `max_messages_scheduled` | `max messages scheduled` | Pending sends with `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | Voice-message text recognized on this machine |
| `max_messages_send` | `max messages send` | send under profile permissions; `at` schedules it, like `--at-time`; `reply_to` replies to a message and `markdown` enables formatting |
| `max_messages_edit` | `max messages edit` | edit your message under profile permissions |
| `max_messages_forward` | `max messages forward` | forward to another chat under profile permissions; `silent` suppresses notifications |
| `max_messages_pin` | `max messages pin` | pin in a group or channel under profile permissions; no notification unless `notify` is supplied |
| `max_messages_unpin` | `max messages unpin` | unpin; `message` is required, but MAX unpins the single pinned message regardless of its number; profile permissions apply |
| `max_reactions_add` | `max reactions add` | add a reaction under `reactions` permissions |
| `max_reactions_remove` | `max reactions remove` | Remove your reaction, under the same permissions |
| `max_polls_vote` | `max polls vote` | vote or retract a vote under profile permissions |
| `max_polls_create` | `max polls create` | create a poll under profile permissions |
| `max_chats_mark_read` | `max chats mark-read` | mark a chat as read under `chats.mark-read` permissions |
| `max_messages_delete` | `max messages delete` | delete for the owner under `messages.delete` permissions |
| `max_chats_check` | `max chats moderate` | check group rules and perform allowed actions under `chats.moderate` permissions and each action's level |
| `max_contacts_*`, `max_polls_close`, `max_chats_join` and others | `max contacts …`, `max polls close`, `max chats …`, `max account update` | under the corresponding resource permissions |

`max_review` considers stored and newly recognized transcripts before filtering questions. An unrecognized recording leaves the review incomplete; the original message `text` is unchanged.

Lists use `{ items, page, limit, hasMore }`; ids are strings. MCP and CLI formats can differ: `max_chats_events` retains `since` (including message ids) and `chatId`/`since`; `max_chats_members` retains `chatId`/`rolesKnown` and accepts no pagination options. New parameters and formats for the corresponding CLI commands are documented in [groups](./groups.md). Errors are `{ error: { code, message, … } }`, with the same codes as the CLI. An ambiguous chat name returns `candidates` and sends nothing.

`at` in `max_messages_send` follows `--at-time`: `2026-09-25T09:00` (local time), or `30m`, `2h`, `1d`, from one minute to one year, rounded down to a minute. It cannot be combined with `silent` or `send_id`. The message counts toward the limit in the hour when it is sent. `--confirm-send` shows the send time. If no response arrives, it is not retried; inspect the queue with `max_messages_scheduled`.

## Prompts and chats through `@`

The server provides four prompts; in Claude Code, these are `/` commands:

| Prompt | Argument | Agent behavior |
|---|---|---|
| `catch-up` | `since`, optional | Calls `max_inbox` once and summarizes by chat; sends nothing |
| `reply` | `chat` | Reads the chat, drafts a reply and sends only after you approve that text |
| `review` | `since`, `groups`, optional | Calls `max_review` once; groups commitments into what I owe, what I await and what needs clarification, with message IDs. Checks groups for completion before declaring anything overdue. Reminders remain drafts until approval. Ends with `since` for the next review |
| `find` | `text` | Finds a person or words and shows surrounding messages; sends nothing |

A `reply` is sent through `max_messages_send`, so when writes are forbidden the agent only shows the draft.

Chats are resources at `max://chat/<id>`, mentionable through `@` in Claude Code. A resource returns a chat and its latest messages. Resource listings come from shared `messages.db` for the profile account without querying MAX and remain empty before any data is stored. Only reading an individual chat logs into MAX.

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max mcp` and `max bot mcp`, without contacting MAX.

## Connection lifecycle

The first call logs into MAX; later calls reuse its connection. It closes after 2 minutes without calls, or 5 minutes after login regardless of activity. Chat lists come from the login response, so this limit prevents indefinitely stale lists. The next call logs in again. Calls run sequentially even when the client submits them together.

The server exits when the client closes stdin, closing its MAX connection too.
