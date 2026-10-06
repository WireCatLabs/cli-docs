---
title: "MCP server"
---
`max mcp` gives an agent access to a profile over [MCP](https://modelcontextprotocol.io) — through stdin and stdout by default; `--http --public-url` serves the tools on a local port behind your HTTPS tunnel. It ships with `max`; no separate installation is needed.

**When to use it.** Claude Code, Codex and other agents with a terminal can use `max` directly with [agent instructions](https://github.com/leemour/max-cli/blob/v0.28.0/README.md#для-скриптов-и-агентов): the agent calls the CLI directly. MCP is useful for clients without a terminal, such as Claude Desktop, or chat-based integration in Cursor, and when you want the client to request permission for each send. Browser-based ChatGPT and Claude connect through `--http`: see [Remote access](./remote.md).

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

In stdin/stdout mode, this example lets the agent read and delete messages without a form, while forbidding sends and edits. Over HTTP, deletion also requires a form:

```sh
max work config set permissions.messages readonly
max work config set permissions.messages.delete allow
```

Other resources retain their permissions. The recipient list and `sendsPerHour` limit apply at every level. The agent's shared delete tool deletes only for the owner; ending other sessions and accessing login secrets are unavailable to it.

### Server-side confirmation forms

```sh
claude mcp add max -- max mcp --confirm-send
```

`--confirm-send` displays a form before every write, including `allow`. Without it, in stdin/stdout mode only `ask` needs a form. Startup with `--yes` confirms other `ask` actions; `--allow-dangerous` confirms message deletion and moderation actions requiring that confirmation. These flags do not bypass `deny`, `readonly`, the recipient list or the limit. A local refresh of conversations under `ask` or `--confirm-send` is refused before any write: the owner starts it through the CLI.

The form is bound to the tool, chat and displayed parameters. An answer works once and for five minutes; substituting parameters after confirmation is refused. An owner's refusal or a client without form support writes nothing. Group moderation also follows its own rule levels: `readonly` only reports the result, while `ask` requires a form.

Legacy `--allow-send`, `--allow-mark-read`, `--allow-delete` and `--allow-moderate` are still accepted with warnings but grant no permissions. `mcpTools` no longer restricts the tool set. Convert an older file with `max config migrate --dry-run`, then `max config migrate`.

## Tools

| Tool | Command | Purpose |
|---|---|---|
| `max_inbox` | `max inbox`, `--since-time` | Unread messages or everything since a time in one call; `transcribe` converts voice messages; never marks read; `new` keeps its own MCP points, separate from `max inbox --new`; cannot be combined with `since_time`; `kinds` selects chat kinds; muted and archived chats are skipped unless they mention the owner; `all: true` includes them |
| `max_review` | `max review` | All messages, including yours, in chats active since `since_time` (default 3 days), for reviewing commitments; `transcribe` converts voice messages; `chat` restricts to one chat; `unanswered` selects questions unanswered by you or admins for that many hours; muted and archived chats are skipped unless they mention the owner; `all: true` includes them; never marks read; `kinds` selects chat kinds, `new` keeps its own points and cannot be combined with `since_time` or `unanswered` |
| `max_account_show` | `max account show` | Logged-in account |
| `max_status` | `max doctor` | Server profile, token presence, prior login and enabled write tools; never logs into MAX |
| `max_chats_list` | `max chats list` | Chats, filtered by name, kind or unread messages |
| `max_chats_members_audit` | `max chats members audit` | Members with signs of suspicious accounts; removes no one, unknown signs are listed in `unknown` |
| `max_chats_stats` | MCP only | Group or channel statistics for a period from the local archive; the member list is not requested, so `members` is absent; with `complete: false` the numbers are a lower bound |
| `max_chats_show` | `max chats show` | One chat, its members and group settings |
| `max_chats_events` | `max chats events` | Joins, departures, additions and removals from service messages; past 7 days without `since_time` |
| `max_chats_members` | `max chats members list` | Group or channel members returned by MAX, with account creation and last seen times |
| `max_chats_rules_show`, `max_chats_moderate` | `max chats rules show`, `max chats moderate` | Canonical rules and moderation; an `ask`-level action is only planned for the owner |
| `max_chats_rules` | `max chats rules show` | Group moderation rules; only the owner can change them through a command |
| `max_contacts_list` | `max contacts list` | People with direct conversations |
| `max_contacts_show` | `max contacts show` | One person and shared chats |
| `max_account_sessions` | `max account sessions list` | List of devices, without login secrets |
| `max_contacts_lookup` | `max contacts lookup` | Search by phone number without adding a contact; the phone number is not returned |
| `max_chats_members_list`, `max_chats_members_show` | `max chats members …` | Members with pagination, and one member |
| `max_chats_link`, `max_chats_link_revoke` | `max chats link …` | Invite link and its revocation, under profile permissions |
| `max_chats_folders_*` | `max chats folders …` | List, create, update and delete folders |
| `max_chats_update`, `max_chats_settings` | `max chats update`, `settings` | Group title and settings |
| `max_polls_show` | `max polls show` | A poll and its answer options |
| `max_messages_evidence` | `max messages evidence` | A bundle of messages from the current account's archive, without connecting |
| `max_messages_stats` | `max messages stats` | Number of query matches in the local archive |
| `max_conversations_status`, `max_conversations_refresh` | `max conversations status`, `search --refresh` | Index status and local refresh; writing is controlled by `conversations.embed` |
| `max_conversations_related` | `max conversations related` | Similar conversations from saved vectors, without running the model |
| `max_conversations_list`, `max_conversations_show`, `max_conversations_search` | `max conversations …` | Conversations from the built local archive; search by words and by the installed model |
| `max_messages_list` | `max messages list` | Chat messages; `transcribe` converts voice messages; never marks read |
| `max_messages_search` | `max messages search` | Search data already read on this machine |
| `max_messages_link` | `max messages link` | a stored message locator, without connecting or returning message text |
| `max_messages_context` | `max messages show`, `context` | One message and surrounding messages |
| `max_messages_photo` | `max messages download` | A message photo as an image, up to 512 KB; files, videos, voice messages or larger photos refuse with a download command. Never returns a photo URL |
| `max_messages_scheduled` | `max messages scheduled` | Pending sends with `scheduledFor` |
| `max_messages_transcribe` | `max messages transcribe` | Voice-message text recognized on this machine |
| `max_messages_send` | `max messages send` | send under profile permissions; `at_time` schedules it, like `--at-time`; `reply_to` replies to a message and `md` enables formatting; `file` or `photo` attaches a file, with the text as its caption |
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

Lists use `{ items, page, limit, hasMore }`; ids are strings. Arguments of the shared tools match Telegram: `since_time`, `before_n`/`after_n`, `at_time`, `md`; `send_id` is a decimal string. An unknown argument is refused before anything runs, so the old `at` will not send a message immediately. `max_chats_check` and `max_chats_rules` remain as compatible names; the main names are `max_chats_moderate` and `max_chats_rules_show`.

Errors are `{ error: { code, message, … } }`, with the same codes as the CLI. An ambiguous chat name returns `candidates` and sends nothing.

`at_time` in `max_messages_send` follows `--at-time`: `2026-09-25T09:00` (local time), or `30m`, `2h`, `1d`, from one minute to one year, rounded down to a minute. It cannot be combined with `silent` or `send_id`. The message counts toward the limit in the hour when it is sent. `--confirm-send` shows the send time. If no response arrives, it is not retried; inspect the queue with `max_messages_scheduled`.

## Prompts and chats through `@`

The server provides four prompts; in Claude Code, these are `/` commands:

| Prompt | Argument | Agent behavior |
|---|---|---|
| `catch-up` | `kind`, `mode`, optional | Calls `max_inbox`; `mode` is `unread` (default), `new` or a point in time; `kind` selects the chat kind; marking as read needs a separate confirmation |
| `reply` | `chat` | Reads the chat, drafts a reply and sends only after you approve that text |
| `review` | `since`, `groups`, optional | Calls `max_review` once; groups commitments into what I owe, what I await and what needs clarification, with message IDs. Checks groups for completion before declaring anything overdue. Reminders remain drafts until approval. Ends with `since` for the next review |
| `find` | `text` | Finds a person or words and shows surrounding messages; sends nothing |

A `reply` is sent through `max_messages_send`, so when writes are forbidden the agent only shows the draft.

Chats are resources at `max://chat/<id>`, mentionable through `@` in Claude Code. A resource returns a chat and its latest messages. Resource listings come from shared `messages.db` for the profile account without querying MAX and remain empty before any data is stored. Only reading an individual chat logs into MAX.

`max://skill` contains the `max` skill, identical to `max skill show`. It is available in both `max mcp` and `max bot mcp`, without contacting MAX.

## Connection lifecycle

The first call that needs MAX opens the connection; later network calls reuse it. Local search, statistics, evidence and reading stored data do not need a login. It closes after 2 minutes without calls, or 5 minutes after login regardless of activity. Chat lists come from the login response, so this limit prevents indefinitely stale lists. The next call logs in again. Calls run sequentially even when the client submits them together.

Telegram topics are not available in MAX, so there are no `max_topics_*` tools. Direct recognition can return a saved transcript from the same model; a photo uses the MAX preview, is selected with `index` and is limited to 512 KB. Models are never downloaded automatically. Before local recognition, the server releases the connection; the search model closes when the server exits.

In stdin/stdout mode, the server exits when the client closes stdin, closing its MAX connection too. HTTP runs until Ctrl-C.

`max mcp --http --public-url https://<имя>.ts.net` is available through your HTTPS tunnel, with login by a code from the terminal. Over HTTP, every write requires a form regardless of `allow`, `--yes` or `--allow-dangerous`. `max mcp --revoke` ends app logins and keeps the MAX session. See [connecting from a browser](./remote.md).
