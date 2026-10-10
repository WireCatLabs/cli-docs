---
title: "What is stored on disk and what never is"
---

Read this page before giving an AI agent or script access to your MAX account through `max`, or to understand what it saves on your computer. It explains login storage, disk writes, network destinations, send protections and leaked-token recovery. You can then assess what a person with computer access or an agent with `max` access may do.

Terms used below:

- **Token** — the credential keeping your MAX login active. Anyone holding it can use the account.
- **Shared local archive** — the unencrypted database where `max` and `tg` save messages on your computer.
- **Send protections** — permission, recipient-list and hourly-limit checks before changes reach MAX.

What `max` and `tg` share — the local copy of conversations, protection against wrong sends, agent permissions, other people's text on screen, what others on the machine can see, and how to report a vulnerability — is described on the [shared security page](https://wirecat.dev/ru/docs/security). This page covers only what is specific to MAX.

## Safeguards at a glance

What any WireCat tool protects against is on the [shared page](https://wirecat.dev/ru/docs/security). Specific to MAX:

- **The background server also checks profile limits.** Permissions, the recipient list and the hourly limit are checked by both the command and `max serve`, even for a program connecting directly to its socket ([below](#защита-от-отправки-не-туда)).
- **Token.** `max` does not save a token from `MAX_TOKEN` or pass it to the background server. The server does not disclose tokens to socket clients ([below](#где-живёт-токен)).
- **Network.** Files download only over HTTPS, never from this machine or local-network addresses, and within the configured size. MAX frames and decompressed data have limits; connections have timeouts ([below](#что-уходит-в-сеть)).
- **Account.** `max` is not an official app, and the MAX rules do not allow such programs without the company's consent ([below](#правила-max-и-ваш-аккаунт)).

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
| Shared message store for personal accounts, bots and `tg`, including text, voice transcripts, downloaded attachment paths and their extracted text | `~/.local/share/cli-messaging/messages.db` | Directory `0700`, file `0600` |
| Background `max serve` socket and log | `~/.local/share/max-cli/profiles/<профиль>.sock`, `.serve.log` | `0600` |
| Old profile cache; no longer opened | `~/.cache/max-cli/<профиль>.db` and its `-wal`, `-shm` files | Directory `0700`, files `0600` |
| Conversation export, **only through `max store export --output`** | Your chosen destination | `0600` |
| Downloaded attachments, `max messages download` or `max attachments extract --download --output-dir` | Current directory or `--output` | `0600` |
| Problem report, **only through `max doctor report create`** | Current directory or `--output` | `0600` |
| Speech models, **only after `max models audio download`** | `~/.cache/cli-common/models/audio/…` | Directory `0700`, files `0600` |

⚠ **The shared local store contains message text and voice transcripts**: it exists to answer offline. `max session end` does not remove it. `max store clear --left --allow-dangerous` removes only data for departed chats; there is no command to erase the entire shared store.

Old profile cache files are no longer opened. If they remain, `max doctor` shows their path; you can delete them separately without affecting the shared store.

Conversation content also exists in bot storage, exports and downloaded files; bot chat lists contain chat titles. Other items in the table contain no conversation content.

### If someone obtains your computer

Only full-disk encryption protects against someone who obtains the disk — see the [shared page](https://wirecat.dev/ru/docs/security). On Windows, access to files depends on the permissions of your user directory and the chosen `MAX_*_DIR` directories; the permission numbers in the table apply to Unix.

## Preventing sends to the wrong place

Why protection against wrong sends is needed and how it works is described on the [shared page](https://wirecat.dev/ru/docs/security). Before each write — a message, reaction, edit, forward or deletion — `max` checks four safeguards, then logs the attempt:

| Check | How to enable | Denial |
|---|---|---|
| forbid message writes, except more specific grants | `max agent config set permissions.messages readonly`; restrict other resources separately | code `5`, no connection |
| permit sends while forbidding other message writes | first `max agent config set permissions.messages readonly`, then `max agent config set permissions.messages.send allow`; other resources and more specific rules remain | code `5` for forbidden actions, no connection |
| Recipient allowlist | `max <профиль> recipients add <чат>`; disable with `recipients clear` | Code `7` |
| Hourly limit for messages, forwards, edits, notified pins, deleted messages and added members; reactions excluded | `sendsPerHour`, default `30` | Code `8`, with next available time |
| Log every attempt without content | Always; inspect with `max sends list` | — |

**Bots have their own `bot.*` keys, such as `bot.messages.send`.** They use the same levels. Common settings and `bot.defaults`/`bot.profiles` layers resolve in the same order; `config show --bot` reports effective permissions. Legacy `readOnly` and `allow` remain readable for compatibility before migration.

Each bot has its own recipient list (`max <имя> bot recipients add <чат>`) and log (`max <имя> bot sends list`). **Every** write passes them, including `messages send`, `messages pin` and `bot api`, preventing a generic API call from bypassing safeguards. Edits and deletions take the chat first: `max` fetches the message and refuses if it belongs to another chat. This comparison is unavailable for a chat addressed as `user:<id>`. Logs contain chat, action, outcome and text length, but not text. Bots have no hourly limit unless configured in `bot`: `max <имя> config set --bot sendsPerHour 200`.

**The background server `max serve` performs the same checks** for everything passing through it, including requests from programs connected directly to its socket rather than through `max`. It accepts only requests known to `max`, in the form `max` sends them; for example, it rejects deleting an entire chat. Changes made with `config set` apply immediately without restarting the server.

Account changes — contacts, profile, folders and sessions — also respect read-only mode. Recipient lists and hourly limits do not apply because these actions have no destination chat or message recipient. They are logged as `account` with the action, without names, numbers or titles.

The recipient list is optional: before anything is added, any chat is allowed. An enabled but empty list allows no destinations. When enabled, `chats create <название> <люди…>` and `chats members add` accept only people whose direct chat is listed. New group members cannot see older messages unless `--history` is supplied. Scheduled messages count in their send hour. Simultaneous commands cannot exceed the limit: capacity is held from checking until MAX responds. Clearing departed-chat data does not touch the send journal.

⚠ **What these checks cannot prevent.** The checks are inside `max` itself: an agent with shell access can remove them. Which external boundary to set is described on the [shared page](https://wirecat.dev/ru/docs/security). For `max`: `MAX_PROFILE_LOCK` fixes the profile, not `MAX_PROFILE`; `--file` rejects hidden files, `~/.ssh` and `max`'s own directories unless `--allow-any-file` is set.

## Actions the tool never takes on its own

- **Does not mark read without a request.** Fetching history and marking read are separate protocol operations. Only `max chats mark-read` and `messages list --mark-read` send the latter; ordinary reading does not.
- **Makes only requested changes.** Changes come from `messages send|edit|delete|forward|pin|unpin|press`, `reactions add|remove`, `polls vote|close|create`, `contacts add|remove|import|rename|block|unblock`, `account update`, `account sessions end`, `session end`, `chats join|leave|create|update|start|app`, `chats members|admins …`, `chats requests accept|decline`, `chats link reset`, `chats folders create|update|delete|order`, `chats moderate` (within group rules), `chats mark-read` and `messages list --mark-read`. Each performs the requested command-line action. `max commands --json` marks them `mutates`.
- **Deletion asks by default.** `messages.delete` at `ask` requires terminal confirmation or `--allow-dangerous`; explicit `allow` deletes without asking. Deleting for everyone also requires `--for-everyone`, which the general MCP tool does not permit.
- **Keeps phone numbers off command lines.** `contacts lookup` reads interactively or through a pipe; `contacts import` reads a file. `ps` and shell history can expose arguments. Errors, send journals and run records omit the number; `max session start` and `max account show` mask it.
- **Does not log messages**, including truncated text or hashes ([diagnostics](./diagnostics.md)).
- **Does not use intermediaries.** [Network destinations](#что-уходит-в-сеть) lists connections. There is no project telemetry; `max serve` sends MAX one service event like a hidden web-client tab, explained there.
- **Keeps its connection in `max serve`.** The first command needing MAX starts it in the background; it stops after 15 idle minutes. Disable this with `max config set serve false`.

## Untrusted text in your terminal

Names, titles and text from other people cannot control the terminal: control and invisible characters are displayed as text, names are printed on one line, and completion inserts only numbers. Details are on the [shared page](https://wirecat.dev/ru/docs/security).

## What other processes can see

Tokens are not passed as arguments, but message text is, and it is visible in `ps` and in shell history ([shared page](https://wirecat.dev/ru/docs/security)). State files and the background server socket are protected by `0600` file permissions and `0700` directories. Other files may have different permissions, such as `0644` for configuration. Check permissions separately when moving files or redirecting output.

## Network destinations

| Destination | When |
|---|---|
| `wss://api.oneme.ru/websocket`, with `Origin` set to `https://web.max.ru` | Any command needing MAX |
| MAX file servers, using addresses provided by MAX | `messages send --file`, `messages download` |
| `https://web.max.ru` in a temporary Chromium profile | `session start qr-chrome`, `session start sms`, `setup --method qr-chrome|sms` |
| Hugging Face and GitHub, for speech-model files | Only `max models audio download`; voice audio stays on this computer |
| Hugging Face, for text-model files | Only `max models text download`; the local model does not send messages |
| Configured external embedding service | `conversations embed` sends conversation text after consent; `search conversations`, including MCP, sends the question when an external service is selected |
| Configured OpenAI-compatible service or Anthropic | `conversations build --analyze --chat` sends bounded batches after consent for the account, chat and service |
| `https://platform-api2.max.ru`, official Bot API, token in `Authorization` | Only `max bot` commands |
| npm registry, for the latest version number | `max upgrade`, and once a day when a person runs a terminal command; disabled by `updateCheck: false` |

`max messages download` uses HTTPS only and rejects local-machine and local-network destinations, including after redirects. Files are limited to 4 GiB; voice audio for transcription to 32 MiB.

`max bot` requests identify themselves as `max-cli/<версия>`, since MAX already recognizes the bot by token. `platform-api2.max.ru` uses a Russian Ministry of Digital Development root certificate absent from Node. `max` adds it only to its own Bot API requests, without changing the system.

Personal-account traffic contains no tool name or custom user-agent; the user-agent and device description come from the MAX web client. Frames use its address, binary format and compression. `max serve` mimics hidden-tab telemetry: one “chat list shown” event 20 seconds after login, containing only account ID and time, never messages or chat titles. One-off commands send no telemetry. After login, `max serve` requests the same read-only data as a tab: folders, banners, call history, stickers and reactions. Responses are neither displayed nor saved. One-off commands do not request these. Differences remain: the web tab also requests contacts, stories and push subscriptions, while `max` does not. MAX can therefore distinguish `max` from its web client.

## MAX rules and your account

`max` is not an official MAX app. The [MAX user agreement](https://legal.max.ru/ps), revision dated September 9, 2026, section 4.3.7, disallows automated programs without company permission. An account used with `max` may therefore be restricted; it may also be linked to government services and family communications.

Recommended practices:

- **Use MAX normally in a browser or on your phone alongside `max`.** An account that only answers `max` requests looks different from one used by a person.
- **Do not turn `max` into a continuous stream of requests.** Read when needed, rather than every minute on a schedule.

The same notice appears once on stderr when a profile first logs in through `max setup` or `max session start`.

## Browser login

`session start qr-chrome` and `sms` launch a browser with a **temporary profile**, separate from your saved passwords and cookies. It contains a logged-in web.max.ru session, so the directory is removed on every exit: success, window closure, `--timeout` or Ctrl-C. The token is read through a debugging pipe between the processes (`--remote-debugging-pipe`), without a network port other users could connect to.

`session start qr` draws a QR code in the terminal. It remains in scrollback but expires after a few minutes. In a narrow terminal, the code appears on a `127.0.0.1` page with a random path. Its URL is neither written to a file nor printed as text. The page disappears when the command exits.

Each login adds a device to the MAX app's session list. You can end it there.

## Unofficial protocol

MAX does not publish an API for user accounts. Everything that is known about the protocol here was either measured on a live connection, or read in someone else’s reverse engineering - and for each operation it is written down exactly where it came from ([protocol description](https://github.com/WireCatLabs/max-cli/blob/main/docs/dev/protocol.md), column “Where it came from”).

**This can stop working without warning.** If it does, the command reports it on stderr instead of quietly returning an empty list.

## Personal use

The tool stores other people’s conversations and contacts on your computer, including message text. Access to the local database gives access to this data. Sharing a `max store export` file also shares the conversation contents; photo links in it may open without login. Before sharing, check the contents and intended recipients. This page describes how the tool works and does not certify legal compliance for your use case.

A problem report (`max doctor report create`) is attached to a **public** GitHub issue. It contains no message text, names or phone numbers; chat and message IDs are replaced with labels. Open and inspect the file before submitting it.

## If a token leaks

```sh
max session end        # выйти из MAX и забыть локально
```

`session end` ends this session on the MAX server, making a leaked token stop working. If MAX does not respond, the command reports it and keeps the token; retry the command.

`max account sessions end --others --yes` ends **every other session**, including your phone app, which will require login again. Ending one session is unsupported because MAX provides no session ID. If MAX rotates this session's token in response, `max` saves it to the keyring before reporting success.

## Next steps

- [General Security Page](https://wirecat.dev/ru/docs/security): what is the same in `max` and `tg`, and how to report a vulnerability
- [Diagnostics](./diagnostics.md): what exactly is recorded and what is never recorded
- [login, sessions and profiles](./sessions.md): keyring, `MAX_TOKEN`, what `session end` does
- [MCP](./mcp.md): what the agent can do via the MCP server and what each flag turns on
- [Permissions](./permissions.md): how to configure `permissions` and `sendsPerHour`
