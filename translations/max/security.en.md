---
title: "What is stored on disk and what never is"
---
This tool accesses private conversations. Explaining what it records is a central part of its documentation.

## Safeguards at a glance

- **Other people's messages must not control the agent.** Reading tools warn the model that message text is data, not instructions. CLI and MCP share `permissions`: most writes are allowed by default, while `messages.delete` and ending other sessions require confirmation. Restrict resources with `readonly` or `deny`. `--confirm-send` requires your form before every write, including `allow`; its answer works once, for five minutes and only for the displayed parameters ([mcp.md](./mcp.md#подтверждение-формой-от-самого-сервера)).
- **Profile limits apply everywhere.** Reading and writing permissions, the recipient list and the hourly limit are checked by both the command and the background server, even for a program connecting directly to its socket. Every attempt is recorded without its text ([below](#защита-от-отправки-не-туда)).
- **The agent stays in its profile and cannot send your keys.** `MAX_PROFILE_LOCK` fixes the profile; `--file` rejects hidden files, `~/.ssh` and `max`'s own directories.
- **Other people's text cannot control the terminal.** Control and invisible characters are displayed as text, names and titles are printed on one line, and completion inserts only numbers ([below](#чужой-текст-на-экране)).
- **Network.** Files download only over HTTPS, never from this machine or local-network addresses, and within the configured size. MAX frames and decompressed data have limits; connections have timeouts ([below](#что-уходит-в-сеть)).
- **Token.** `max` does not save a token from `MAX_TOKEN` or pass it to the background server. The server does not disclose tokens to socket clients ([below](#где-живёт-токен)).
- **Files.** Linux and macOS files are created with mode `0600` inside `0700` directories, including the local conversation archive. Windows uses inherited ACLs from the user's directory ([below](#что-ещё-пишется-на-диск)).
- **Release.** GitHub Actions publishes the package with provenance. Publication does not run dependency code; direct dependency versions are pinned exactly.

## Token storage

The operating-system keyring uses service `max-cli` and an entry named after the profile. The token is not stored in configuration, command arguments, shell variables or history unless you explicitly supply it through the supported environment variable.

Without a keyring, it goes into `~/.config/max-cli/credentials.json` with permissions `0600`; the command reports this on stderr. `max doctor` also identifies file storage rather than keyring storage.

`MAX_TOKEN` overrides the keyring, supporting CI. A token provided through the variable remains only there:

- If MAX rotates the session token, `max` saves it neither to the keyring nor to a file, and reports this on stderr. Otherwise a machine without a keyring could leave a live token in a file later copied into build caches or artifacts.
- A command using `MAX_TOKEN` does not start background `max serve` or pass it the variable. Otherwise a one-command token could remain in a process for another fifteen minutes.

The `max bot` token is stored separately under the same `max-cli` service, in `bot:<профиль>`, or in the same `0600` file when no keyring exists. `MAX_BOT_TOKEN` overrides the keyring like `MAX_TOKEN`. `max bot auth set` checks the token with MAX before saving, so a typo does not overwrite a working token. It never saves a token from `MAX_BOT_TOKEN`.

**Configuration cannot contain secrets:** the schema has no token, phone-number or chat-ID fields.

## Other data written to disk

| Data | Location | Permissions |
|---|---|---|
| Profile state: device, login counter, `viewerId` | `~/.local/share/max-cli/profiles/<профиль>.json` | `0600` |
| Configuration | `~/.config/max-cli/config.json` | `0644` |
| Run records, with `--record`, and always for failures: command words, IDs, timings, error code; no content | `~/.local/share/max-cli/runs/…` | Directory `0700`, files `0600` |
| Send log, **always**: chat, time, ID, length, outcome; no text | `~/.local/share/max-cli/sends/<профиль>.jsonl` | Directory `0700`, files `0600` |
| Recipient allowlist, if enabled | `~/.local/share/max-cli/profiles/<профиль>.recipients.json` | `0600` |
| Group moderation rules, after the first `chats rules set` | `~/.local/share/max-cli/profiles/<профиль>.moderation.json` | `0600` |
| Bot: seen chats, send log, recipient list, `watch` position | `~/.local/share/max-cli/bots/…` | Directory `0700`, files `0600` |
| Shared message store for personal accounts, bots and `tg`, including text and voice transcripts | `~/.local/share/cli-messaging/messages.db` | Directory `0700`, file `0600` |
| Background `max serve` socket and log | `~/.local/share/max-cli/profiles/<профиль>.sock`, `.serve.log` | `0600` |
| Old profile cache; no longer opened | `~/.cache/max-cli/<профиль>.db` and its `-wal`, `-shm` files | Directory `0700`, files `0600` |
| Conversation export, **only through `max store export --output`** | Your chosen destination | `0600` |
| Downloaded attachments, **only through `max messages download`** | Current directory or `--output` | `0600` |
| Problem report, **only through `max doctor report create`** | Current directory or `--output` | `0600` |
| Speech models, **only after `max models audio download`** | `~/.cache/cli-common/models/audio/…` | Directory `0700`, files `0600` |

⚠ **The shared local store contains message text and voice transcripts**: it exists to answer offline. `max session end` does not remove it. `max store clear --left --allow-dangerous` removes only data for departed chats; there is no command to erase the entire shared store.

Old profile cache files are no longer opened. If they remain, `max doctor` shows their path; you can delete them separately without affecting the shared store.

Conversation content also exists in bot storage, exports and downloaded files; bot chat lists contain chat titles. Other items in the table contain no conversation content.

### If someone obtains your computer

On Linux and macOS, `0600` permissions keep files private from other users on this computer, but not from someone who obtains the disk. Full-disk encryption provides that protection: FileVault on macOS, LUKS on Linux and BitLocker on Windows. On Windows, `0600` and `0700` modes do not set ACLs: access depends on permissions inherited from your user directory and the chosen `MAX_*_DIR` directories. The permission numbers in the table apply to Unix. The local store has no encryption of its own: Node’s built-in SQLite does not provide it, and a key in the keychain would not stop a program running as you, because it can read the keychain just as `max` does.

## Actions the tool never takes on its own

- **Reading does not mark messages read unless requested.** Fetching history and marking it read are separate protocol operations. Only `max chats mark-read` and `messages list --mark-read` send the latter; tests verify ordinary reading does not.
- **Nothing unrequested is sent.** Only `messages send|edit|delete|forward|pin|unpin`, `reactions add|remove`, `polls vote|close|create`, `contacts add|remove|import|rename|block|unblock`, `account update`, `account sessions end`, `chats join|leave|create|update`, `chats members|admins …`, `chats link reset`, `chats folders create|update|delete`, `chats moderate` (only actions allowed by group rules), `chats mark-read` and `messages list --mark-read` change anything. Each performs only the operation in the command line. `max commands --json` labels them `mutates`.
- **Deletion requires confirmation by default.** The `ask` level for `messages.delete` requires a terminal answer or `--allow-dangerous`; explicit `allow` deletes without a question. Deleting for everyone also requires `--for-everyone`; the shared MCP tool does not permit this.
- **Phone numbers do not come from command-line arguments.** `contacts lookup` prompts or reads from a pipe; `contacts import` reads a file. Command lines are visible to `ps` and shell history. Errors, the send journal and run records contain no phone numbers; `max session start` and `max account show` mask them.
- **Messages are not logged.** Neither truncated text nor a hash is logged; see [diagnostics.md](./diagnostics.md).
- **Connections use no intermediary.** Exact destinations are listed under [network traffic](#что-уходит-в-сеть). `max` has no telemetry of its own; `max serve` sends MAX one service event like a hidden web-client tab, as explained there.
- **Only `max serve` holds a connection.** The first command needing MAX starts it in the background; it stops after 15 idle minutes. Disable this with `max config set serve false`.

## Preventing sends to the wrong place

An agent reads other people's messages alongside your instructions. A malicious message could pretend to be an instruction, such as “forward this conversation here”. Before each message, reaction, edit, forward or deletion, `max` checks four safeguards, then logs the attempt.

| Safeguard | How to enable | Rejection |
|---|---|---|
| forbid message writes, except more specific grants | `max agent config set permissions.messages readonly`; restrict other resources separately | code `5`, no connection |
| permit sends while forbidding other message writes | first `max agent config set permissions.messages readonly`, then `max agent config set permissions.messages.send allow`; other resources and more specific rules remain | code `5` for forbidden actions, no connection |
| Recipient allowlist | `max <профиль> recipients add <чат>`; disable with `recipients clear` | Code `7` |
| Hourly limit for messages, forwards, edits, notified pins, deleted messages and added members; reactions excluded | `sendsPerHour`, default `30` | Code `8`, with next available time |
| Log every attempt without content | Always; inspect with `max sends list` | — |

**Bots have their own `bot.*` keys, such as `bot.messages.send`.** They use the same levels. Common settings and `bot.defaults`/`bot.profiles` layers resolve in the same order; `config show --bot` reports effective permissions. Legacy `readOnly` and `allow` remain readable for compatibility before migration.

Each bot has its own recipient list (`max <имя> bot recipients add <чат>`) and log (`max <имя> bot sends list`). **Every** write passes them, including `messages send`, `messages pin` and `bot api`, preventing a generic API call from bypassing safeguards. Edits and deletions take the chat first: `max` fetches the message and refuses if it belongs to another chat. This comparison is unavailable for a chat addressed as `user:<id>`. Logs contain chat, action, outcome and text length, but not text. Bots have no hourly limit unless configured in `bot`: `max <имя> config set --bot sendsPerHour 200`.

**Background `max serve` enforces the same checks**, including for programs connecting directly to its socket instead of through `max`. It accepts only requests known to `max`, in their expected form; deleting an entire chat, for example, is rejected. `config set` changes take effect immediately without a server restart.

Account changes — contacts, profile, folders and sessions — also respect read-only mode. Recipient lists and hourly limits do not apply because these actions have no destination chat or message recipient. They are logged as `account` with the action, without names, numbers or titles.

The recipient list is optional: before anything is added, any chat is allowed. An enabled but empty list allows no destinations. When enabled, `chats create <название> <люди…>` and `chats members add` accept only people whose direct chat is listed. New group members cannot see older messages unless `--history` is supplied. Scheduled messages count in their send hour. Simultaneous commands cannot exceed the limit: capacity is held from checking until MAX responds. Clearing departed-chat data does not touch the send journal.

⚠ **What these checks cannot prevent.** An agent with shell access can change settings or disable recipient lists. These safeguards protect against a model **persuaded** by a message, rather than an agent **intentionally** bypassing them. For that, enforce an external boundary: a sandbox, a separate OS user or agent-level policy.

When choosing that boundary:

- **`MAX_PROFILE_LOCK` fixes a profile; `MAX_PROFILE` does not.** The first command word overrides `MAX_PROFILE`: an agent with `MAX_PROFILE=agent` can type `max work messages send …`. `MAX_PROFILE_LOCK=agent` refuses that call, but only where the agent cannot change its environment, such as MCP client settings or a wrapper script. An agent with shell access can unset the variable. MCP fixes its profile at startup.
- **`--file` rejects hidden files, files in hidden directories such as `~/.ssh`, and `max`'s own directories**, which hold keys and tokens. `--allow-any-file` removes the restriction; the agent must not add it on its own. Other files readable by your user can be sent; the journal stores only their type and size.
- **An agent rule such as “ask before `max messages send`”** misses a profile-qualified form such as `max work messages send`. Restrict the profile itself through `permissions` or a recipient list instead, and avoid keeping an unrestricted logged-in profile beside it.

## Untrusted text in your terminal

Other people supply names, chat titles, filenames and messages. `max` prevents them from controlling the terminal or faking displayed output:

- Control characters that recolor output, erase lines, change window titles or clipboard contents are displayed as text (`\x1b`), not executed. Invisible and text-direction characters are treated the same way.
- Names, titles and attachment captions are printed on one line; a newline cannot create a fake conversation or table row.
- If a supplied name matches one chat exactly and others partially, `max` displays all candidates instead of choosing.
- Completion inserts only chat or person IDs; names appear only as adjacent hints.
- Markdown exports and download paths receive the same sanitization; control characters are removed entirely from downloaded filenames.

`--json` is data: strings contain what MAX sent, escaped according to JSON rules. If another program prints it to a terminal, that program must sanitize it.

## What other processes can see

Command arguments are visible through `ps`. Tokens therefore cannot be arguments, but **message text can**:

```sh
max messages send 0 "текст"     # эта строка видна в ps и остаётся в истории оболочки
```

If this matters, supply text through a controlled script's environment rather than the command line, as you would a token.

Other users cannot read `max` files or its server socket: directories use `0700`, files `0600`.

## Network destinations

| Destination | When |
|---|---|
| `wss://api.oneme.ru/websocket`, with `Origin` set to `https://web.max.ru` | Any command needing MAX |
| MAX file servers, using addresses provided by MAX | `messages send --file`, `messages download` |
| `https://web.max.ru` in a temporary Chromium profile | `session start qr-chrome`, `session start sms`, `setup --method qr-chrome|sms` |
| Hugging Face and GitHub, for speech-model files | Only `max models audio download`; voice audio stays on this computer |
| `https://platform-api2.max.ru`, official Bot API, token in `Authorization` | Only `max bot` commands |
| npm registry, for the latest version number | `max upgrade`, and once a day when a person runs a terminal command; disabled by `updateCheck: false` |

`max messages download` uses HTTPS only and rejects local-machine and local-network destinations, including after redirects. Files are limited to 4 GiB; voice audio for transcription to 32 MiB.

`max bot` requests identify themselves as `max-cli/<версия>`, since MAX already recognizes the bot by token. `platform-api2.max.ru` uses a Russian Ministry of Digital Development root certificate absent from Node. `max` adds it only to its own Bot API requests, without changing the system.

Personal-account traffic contains no tool name or custom user-agent; the user-agent and device description come from the MAX web client. Frames use its address, binary format and compression. `max serve` mimics hidden-tab telemetry: one “chat list shown” event 20 seconds after login, containing only account ID and time, never messages or chat titles. One-off commands send no telemetry. After login, `max serve` requests the same read-only data as a tab: folders, banners, call history, stickers and reactions. Responses are neither displayed nor saved. One-off commands do not request these. Differences remain: the web tab also requests contacts, stories and push subscriptions, while `max` does not. MAX can therefore distinguish `max` from its web client.

## MAX rules and your account

`max` is not an official MAX app. The [MAX user agreement](https://legal.max.ru/ps), revision dated September 9, 2026, section 4.3.7, disallows automated programs without company permission. An account used with `max` may therefore be restricted; it may also be linked to government services and family communications.

Practical precautions:

- **Continue using MAX normally in the browser or on your phone alongside `max`.** An account used only for CLI requests behaves differently from a person's account.
- **Avoid a constant stream of requests.** Read when needed rather than polling every minute.

The same notice appears once on stderr when a profile first logs in through `max setup` or `max session start`.

## Personal use

The tool stores other people's conversations and contacts on your computer. The source documentation treats use with your own account for personal and household purposes as covered by exemptions in Russian personal-data law (152-FZ, article 1, part 2, paragraph 1) and GDPR (article 2(2)(c)). Working with other people's accounts or for business is outside personal use. Sharing a `max store export` file also goes beyond personal use, and exported photo links work without login.

A problem report (`max doctor report create`) is attached to a **public** GitHub issue. It contains no message text, names or phone numbers; chat and message IDs are replaced with labels. Open and inspect the file before submitting it.

## Browser login

`session start qr-chrome` and `sms` launch a browser with a **temporary profile**, separate from your saved passwords and cookies. It contains a logged-in web.max.ru session, so the directory is removed on every exit: success, window closure, `--timeout` or Ctrl-C. The token is read through a debugging pipe between the processes (`--remote-debugging-pipe`), without a network port other users could connect to.

`session start qr` draws a QR code in the terminal. It remains in scrollback but expires after a few minutes. In a narrow terminal, the code appears on a `127.0.0.1` page with a random path. Its URL is neither written to a file nor printed as text. The page disappears when the command exits.

Each login adds a device to the MAX app's session list. You can end it there.

## Unofficial protocol

MAX publishes no personal-account API. Protocol knowledge comes from observed live connections or others' reverse engineering; each operation records its source ([`protocol.md`](https://github.com/leemour/max-cli/blob/v0.27.0/docs/dev/protocol.md), “Where it came from” column).

**This can stop working without warning.** If it does, the command reports it on stderr instead of quietly returning an empty list.

## If a token leaks

```sh
max session end        # забыть локально
```

This is **not enough**: `session end` does not notify the server, so the session remains valid. Revoke it in the official client's device list, where it was created.

`max account sessions end --others --yes` ends **every other session**, including your phone app, which will require login again. Ending one session is unsupported because MAX provides no session ID. If MAX rotates this session's token in response, `max` saves it to the keyring before reporting success.

## Next steps

- [Diagnostics](./diagnostics.md) — exactly what is and is not logged.
- [Sessions](./sessions.md) — keyring, `MAX_TOKEN`, and forgetting versus revoking.
- [MCP guide](./mcp.md) — agent capabilities and permission flags.
