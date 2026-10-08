---
title: "MAX bots"
---

`max bot` works with a bot through the official [MAX Bot API](https://dev.max.ru/docs-api), using its bot token. It is separate from your personal account: a bot has its own name, chats and token. `max …` without `bot` uses your personal account ([Personal account guide](./usage.md)).

Create a bot at [business.max.ru](https://business.max.ru/self). MAX issues bots only to verified organizations, individual entrepreneurs and registered self-employed people. Every bot undergoes moderation.

See the [Command reference](./commands.md) for all commands and options.

**The entire MAX Bot API is available**, including methods beyond the convenient message and chat commands:
`max <бот> bot api <операция>`. Pass parameters as flags and the body as JSON; method help lists the accepted fields. This is the full native CLI interface; MCP provides separate tools for common tasks.

## Your first minute

```sh
max sales bot auth set                                  # токен — в скрытом вводе
max sales bot me                                        # какой это бот
```

`auth set` asks MAX who the token belongs to before saving it. A typo cannot overwrite a working token.

## Finding a chat ID

MAX has no list of all chats a bot belongs to, so obtain IDs from what the bot has done or received.

- **A conversation with a person.** Address them as `user:<номер>`. The send response includes the destination chat ID in `chatId`.
- **A group or channel.** Add the bot, then request the latest updates from MAX:

  ```sh
  max sales bot api get-updates --limit 10
  ```

  The chat ID is in `chat_id`. With no new updates, the command waits up to 30 seconds; `--poll-timeout 0` disables waiting. MAX does not deliver these updates a second time. This command does not work while the bot has a webhook.

Open the chat with `max sales bot chats show` and its ID. The bot then knows its title, which you can use in subsequent commands. `chats list` shows every chat the bot has already seen.

- Group and channel IDs are **negative**.
- A positive ID usually identifies a person. Use `user:<номер>` for a person; without `user:`, MAX treats the ID as a chat and returns “chat not found” (code `6`), and `max` explains the correct form.

## Multiple bots

A bot is stored under a name you choose, used as the command's **first word**, just like a personal-account profile:

```sh
max sales bot auth set
max support bot auth set
max support bot messages send user:4815162342 "Ваша заявка принята"
max bot list --check          # все имена с токеном бота и какой бот за каждым
```

Without a name, the profile comes from `defaultProfile`, or `default` if unset: `max bot me`. `MAX_PROFILE` sets the name for the whole shell session.

## Token storage

The token is stored in the system password store, under `bot:<имя>`, separately from the personal-account token. If no password store is available, it goes into a file with permissions `0600`, just like a personal token.

```sh
max sales bot auth show       # откуда взят токен и какой это бот
max sales bot auth remove     # забыть токен
```

`MAX_BOT_TOKEN` takes precedence over stored credentials, which is useful in CI. `auth set` does not save a token from this variable.

## Messages

Use an ID for a chat, `user:<номер>` for a person, or a title for a chat the bot has already seen:

```sh
max sales bot messages send "Команда продаж" "Сборка готова"
max sales bot messages send user:4815162342 "Здравствуйте"
max sales bot messages send "Команда продаж" "**Итоги недели** в закрепе" --md
max sales bot messages send "Команда продаж" "Принято" --reply-to mid.0000019a7f3c21de
echo "Текст из трубы" | max sales bot messages send "Команда продаж" -
```

`--silent` sends without a notification. Text can contain up to 4,000 characters. `user:4815162342` and `mid.0000019a7f3c21de` are made-up IDs here and below; use your own.

### Files

`--file` attaches a file from disk. Images, video and audio are detected by extension; other files are sent as documents. `--photo` sends an image as a photo, `--voice` sends Ogg Opus as a voice message, and `--as-file` sends video as a document. Files from hidden directories or `max`'s own directories require `--allow-any-file`. Text is optional when sending a file:

```sh
max sales bot messages send "Команда продаж" "Отчёт за неделю" --file report.pdf
max sales bot messages send "Команда продаж" --file screenshot.png
```

The file is uploaded to MAX before the message is sent. While MAX processes a video or large file, it may report “not ready”; `max` waits up to four times, about nine seconds in total. If upload fails, nothing is sent to the chat.

`uploads put` only uploads the file and prints an attachment object. Put this in the body's `attachments` for `bot api send-message`:

```sh
max sales bot uploads put report.pdf
```

```sh
max sales bot messages list "Команда продаж" --limit 20
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de
max sales bot messages edit "Команда продаж" mid.0000019a7f3c21de "Исправленный текст"
max sales bot messages delete "Команда продаж" mid.0000019a7f3c21de --allow-dangerous
max sales bot messages pin "Команда продаж" mid.0000019a7f3c21de --notify
max sales bot messages unpin "Команда продаж" mid.0000019a7f3c21de
```

Always identify a message together with its chat. This keeps commands consistent between `max` and `tg`, where message IDs are scoped to a chat. `max` does not modify a message from another chat. `--html` supplies HTML text; `--md` and `--html` cannot be combined. Deletion prompts for confirmation; `--allow-dangerous` answers yes. Pinning is silent by default; `--notify` notifies members. A send response contains the message itself and `operationId`, the identifier of that write in the log.

If the connection drops during a send, `max` does not retry automatically. It reports an unknown outcome (code `14`). Check the chat before sending again.

## Chats

MAX has no “all bot chats” endpoint. `chats list` therefore shows **chats this bot has seen on this computer**: those opened with `chats show`, sent to or read from. It is not a complete list.

```sh
max sales bot chats list
max sales bot chats show "Команда продаж"
max sales bot chats action "Команда продаж" typing    # typing, photo, video, voice, file
max sales bot chats leave "Команда продаж"    # вернуть бота может только админ чата
```

### Members and admins

The bot must be a chat admin with permission for the action.

Adding a member through `bot chats members add` was checked on 3 October 2026: an administrator bot added a member who was absent, and the personal account confirmed the result. [MAX documentation](https://dev.max.ru/docs-api) says this method was removed on 30 September, but the server still performs it in the tested group. The command remains available; the MAX server determines whether the method works.

First allow the bot to join groups. By default, MAX prevents bots from being added to group chats, whether through the app or `max chats members add` (response `participants.filter.out`). Enable this at [business.max.ru](https://business.max.ru/self): bot → **⋮ → Settings → Privacy** ([MAX documentation](https://dev.max.ru/docs/chatbots/bots-create/manage)). Then add it to the group and make it an admin in the MAX app. Group checks require permission to read messages; without it, MAX returns no group messages. You can also grant it with your own account: `max chats admins add "Поход" <номер бота> --can read,members,delete`.

```sh
max sales bot chats members list "Команда продаж" --limit 50
max sales bot chats members add "Команда продаж" 4815162342 2342481516
max sales bot chats members remove "Команда продаж" 4815162342 --block
max sales bot chats admins list "Команда продаж"
max sales bot chats admins add "Команда продаж" 4815162342 --can read,pin --title "Дежурный"
max sales bot chats admins remove "Команда продаж" 4815162342
```

`members list` returns up to 100 people and a `marker`. Fetch the next page with `--marker` and that value. Admin permissions in `--can` use the same names as `max chats admins add`: `read`, `members`, `admins`, `info`, `pin`, `link`, `edit`, `delete`. `read` grants access to group messages.

## Local storage

`max` saves everything the bot reads, sends or receives on this computer. You can read and search this copy offline:

```sh
max sales bot messages list "Команда продаж" --offline
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de --offline
max sales bot messages search "итоги недели"
```

Search matches words, with best matches first; `--newest` puts recent matches first. All words are required. `"фраза"`, `-слово`, `а OR б` and the filters `from:`, `chat:`, `after:`, `before:`, `has:` work as in `max messages search --language legacy`, including typo correction. For strict search across the shared archive, use [regular search](./search.md) with `in:bots`.

Download older chat history into the local store:

```sh
max sales bot store fetch "Команда продаж"                 # до 1000 сообщений, новые сначала
max sales bot store fetch "Команда продаж" --last 500      # пока не будет 500 последних
max sales bot store fetch "Команда продаж" --since-time 7d # за последние семь дней
```

Repeated runs resume where the previous run stopped without refetching downloaded messages. Requests pause one second (`--pause`) and fetch 100 messages each (`--page-size`).

Normal commands still query MAX, which has the full chat history. A message the bot deletes, or that `watch` learns was deleted, is removed from local storage. If deletion happens while `watch` is stopped, the local copy does not know about it.

People are found in the same copy. Use an ID, `@username` or part of a name. If two people match, `max` shows both and asks for an ID.

```sh
max sales bot contacts show @ann                 # где писала, и её личный чат с ботом
max sales bot contacts show @ann --refresh       # сначала перечитать личный чат у MAX
max sales bot messages search --from @ann        # всё, что она написала
max sales bot messages search "счёт" --from @ann --from Борис
max sales bot messages between @ann Борис --limit 20
```

`between` shows only chats where every named person has posted, returning the latest 20 messages from each, oldest first. A “shared chat” here means the bot saw messages from each person, not that MAX's member list includes them.

**Each bot sees only its own local copy.** Reading another bot's copy requires both permission in configuration and an explicit request in the command:

```sh
max shop config set --bot readOtherBots true          # боту shop можно читать всех ботов
max shop config set --bot readOtherBots news,support  # или только этих
max shop bot messages search заказ --bots news        # и тогда — явно, в команде
max shop bot contacts show @ann --all-bots            # все, кого разрешено
```

`--all-bots` and `--bots` are supported by `messages search`, `contacts show` and `messages between`. Without `readOtherBots`, both refuse with code `5` and name the command that enables access. Through `max <имя> bot mcp`, the equivalent fields (`all_bots`, `bots`) are offered only when access is permitted.

## Updates

```sh
max sales bot watch                       # новые сообщения, до Ctrl-C или --timeout
max sales bot watch --events --jsonl       # и всё остальное: правки, удаления, кнопки, кто вошёл и вышел
max sales bot watch --types message_created,message_edited
```

`watch` saves incoming data before printing it: messages in local storage, button presses for `callbacks answer`, and joins and departures for group checks below. Without `--events`, only new messages are printed. With `--events`, every line identifies its event (`message`, `edit`, `delete`, `callback`, `joined`, `left`, `added`, `removed`, `started`, `other`). `--types` accepts MAX event names. The next run resumes where the previous one stopped. `watch` does not work while a webhook is configured.

Updates received by `watch` are no longer delivered to another reader using this bot's `get-updates`.

## Checking a chat against rules

A bot can monitor a group where it is an admin using the same rules as `max chats moderate` for a personal account ([groups.md](./groups.md)). Each bot has its own rules:

```sh
max sales bot chats rules set -72894839451 invites remove        # приглашения в чужие чаты — удалять автора
max sales bot chats rules set -72894839451 consent.remove allow  # без вопросов
max sales bot chats moderate -72894839451                        # проверить, что нового
max sales bot chats moderate -72894839451 --dry-run              # только показать
```

The check examines messages since the previous check (the past day on its first run) and new members, then performs actions allowed by rules and consent. Differences from personal accounts:

- **Removed members are banned** and cannot return through the invite link. The link appears expired or invalid to them but keeps working for everyone else. An admin can add them back manually (`max chats members add`). Use `--no-ban` to remove without banning. Bans work only in chats with an invite link.
- **The bot learns about joins only from `watch`.** MAX delivers each event to one reader, so checks use joins saved by `watch`. Without `watch`, the check examines only messages and reports that limitation.
- **Bots cannot see account ages.** The Bot API does not provide them, so the account-age rule does not apply.

The bot needs admin permissions to delete messages and remove members.

## Comments

Comments appear under channel posts. Specify the post ID (`mid.…`) first, then the comment ID:

```sh
max sales bot comments list mid.0000019a7f3c21de --limit 20
max sales bot comments get mid.0000019a7f3c21de 42
max sales bot comments send mid.0000019a7f3c21de "Спасибо за вопрос"
max sales bot comments edit mid.0000019a7f3c21de 42 "Исправлено"
max sales bot comments delete mid.0000019a7f3c21de 42
```

Comments use the same recipient allowlist as messages sent to that channel.

## Buttons

When someone presses a button under a bot message, the bot receives a callback ID (`callback_id`) and can answer it:

```sh
max sales bot callbacks answer f9LHodD0cOL5 --notification "Готово"
max sales bot callbacks answer f9LHodD0cOL5 --text "Заказ подтверждён"
```

`--notification` displays a short notice only to the person who pressed the button; `--text` replaces the message containing it. The response goes to the chat where the button was pressed, but the callback ID does not reveal that chat, so the recipient allowlist does not apply.

## Command menu

The menu is what someone sees when typing `/` in a bot chat.

```sh
max sales bot commands list
max sales bot commands set start=Начать help=Помощь "report=Отчёт за день"
max sales bot commands clear
```

`set` replaces the entire menu. Each entry is `имя=описание`; the description is optional.

## Webhooks

A webhook is an address where MAX pushes everything the bot receives. While one is configured, the bot cannot receive updates through `get-updates`.

```sh
max sales bot webhooks list
max sales bot webhooks set https://bot.example.ru/max --secret-stdin --types message_created,bot_started
max sales bot webhooks delete https://bot.example.ru/max
```

- The address must use HTTPS on port 443 with a certificate MAX trusts.
- A new address **does not replace** an old one: MAX sends every update to both. `set` therefore refuses if another address is configured. Remove it first, or use `--add` if you need both.
- `--secret-stdin` prompts without showing input or reads from a pipe. MAX sends this secret in `X-Max-Bot-Api-Secret`, letting your server identify MAX. The secret never appears in command arguments.

## Who the bot may contact

Bots follow the same profile settings as personal accounts:

- `permissions` sets levels for `bot.*` keys; `readonly` permits reading only;
- `allow` permits only named actions: sending `send`, editing `edit`, deleting `delete`, pinning `pin`, members and chat settings `groups`, bot commands `profile`, and receiving updates `read`. Actions without a corresponding word, such as webhooks, are forbidden when `allow` is set.

Each bot has its own list of chats it may write to:

```sh
max sales bot recipients add "Команда продаж"
max sales bot recipients list
max sales bot recipients remove "Команда продаж"
max sales bot recipients clear            # писать можно снова в любой чат
```

Without a list, the bot may write anywhere. With one, sending to another chat refuses with code `7` and shows a command to add it.

Every bot write — send, edit, delete or pin — is logged:

```sh
max sales bot sends list
```

The log records the chat, action, outcome and text length, but never the text itself. **Every** bot write, including through `bot api`, uses the recipient allowlist and log. There is no hourly send limit until one is configured in the `bot` section (`max <имя> config set --bot sendsPerHour 200`; see [Configuration](./configuration.md)).

## Any API operation

Every Bot API operation is available as `max bot api <операция>`. Commands are generated from the official API schema by cli-core; command construction and input validation are shared with Telegram. New MAX operations appear after updating the schema:

```sh
max sales bot api get-my-info
max sales bot api get-subscriptions
max sales bot api answer-on-callback --callback-id f9LHodD0cOL5 --body '{"notification": "Готово"}'
max sales bot api send-message --user-id 4815162342 --body-file message.json
```

Path and query parameters become flags; the body is JSON in `--body`, `--body -` (from a pipe) or `--body-file`. `--body-file -` also reads stdin. The native `timeout` parameter is named `--poll-timeout`; the global `--timeout` limits the whole command. The shared `--store-token <profile>` option is unavailable for current MAX methods: each rejects it before performing the operation. Before sending, the body is checked against the schema. Errors identify the field and expected type without exposing its value. See [Bot API coverage](https://github.com/leemour/max-cli/blob/v0.37.0/docs/dev/bot-api-coverage.md) for all operations and their read/write classification.

## Scripts and agents

With `--json`, stdout contains only data; errors go to stderr with an exit code:

| Code | Meaning |
|---|---|
| `4` | No bot token, or MAX rejected it |
| `5` | Read-only profile or action forbidden by `allow` |
| `6` | Chat not found, for example an unseen title or a person addressed without `user:` |
| `7` | Chat is absent from the bot's recipient allowlist |
| `8` | Bot's `sendsPerHour` limit reached |
| `14` | No response; the write outcome is unknown |

Messages use the same output format as personal-account messages. IDs above 2^53 are printed as strings to preserve every digit.

`--trace` and `--record` also work for bots: each Bot API request produces a stderr line; file uploads show type, size and response code without the URL or filename. Failed runs are saved and appear in `max runs list` ([Diagnostics](./diagnostics.md)).

## Certificate

The `platform-api2.max.ru` certificate is signed by a Russian Ministry of Digital Development root certificate absent from Node. `max` adds it only to its own Bot API requests, without changing your system. Bot requests identify themselves as `max-cli/<версия>`.

## Connecting a bot to an agent (MCP)

`max <имя> bot mcp` exposes a bot to an agent, just as `max mcp` exposes a personal account:

```sh
claude mcp add sales-bot -- max sales bot mcp
max sales bot mcp config          # запись для Claude Desktop, Cursor и других
```

The agent can access what the bot profile permits: the bot, chats it has seen, messages, search, people, members and administrators, comments, command menus, the log and recipient list. If the profile is not read-only, it can also write as the bot: send, edit, pin, indicate typing, comment, answer buttons, delete, add or remove members, and check a chat against its rules (`max_bot_write` (`command: "chats moderate"`)). `max_bot_read` (`command: "status"`) shows which profile the server represents, where the token comes from, which bot it is and which write tools are enabled.

- `permissions.bot: readonly` makes the agent read only unless more specific permissions override it;
- to allow only sends and comments, set `permissions.bot: readonly`, then `permissions.bot.messages.send: allow`; check for other more specific permissions;
- Deleting a message or comment defaults to level `ask`: the requested write is allowed without a server confirmation form; `deny` and `readonly` forbid it.
- Actions that chat rules require you to confirm remain plans for the owner.
- Older confirmation flags do not change access.

`--allow-send`, `--allow-delete` and `--allow-moderate` no longer grant permissions. The server accepts them with a warning.

Every write runs the command you would type yourself and checks the bot's recipient list, `permissions` and journal. The agent cannot access the token or webhooks. It can read the recipient list, command menu and administrators but cannot change them; leaving chats, sending files and `bot api` are also unavailable to it.

With `--md`, the bot uses MAX rules: `__жирный__`, `++подчёркнутый++`, `^^выделенный^^`, links, code, headings and quotations. The formatter creates safe HTML with escaped text and addresses; this is an internal representation, and the --md argument remains Markdown.
