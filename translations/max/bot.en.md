---
title: "MAX bots"
---

A MAX bot is a separate account that can send messages, answer people and help manage a group. Use this page to connect one to `max`, find its chats, read and send on its behalf, restrict recipients and give your AI agent access to it.

Terms used below:

- **Bot** — a separate MAX account controlled by a program. `max bot` uses the official [MAX Bot API](https://dev.max.ru/docs-api). It has its own name, chats and token. `max …` without `bot` uses your personal account ([personal account guide](./usage.md)).
- **Token** — the bot's secret credential. Create the bot at [business.max.ru](https://business.max.ru/self). MAX issues bots to verified organisations, individual entrepreneurs and self-employed people, and moderates each bot.
- **Bot name** — the name you save its token under, such as `sales`, placed first in every command: `max sales bot …`.
- **Local archive** — what the bot read, sent or received, saved on this computer.

## What you can do

| Task | Command |
| --- | --- |
| Connect a bot and check which bot it is | `max <бот> bot auth set`, `max <бот> bot me` |
| Send, edit, delete and pin messages and files | `max <бот> bot messages send\|edit\|delete\|pin` |
| See new messages, button clicks and entries | `max <бот> bot watch` |
| Read and search what the bot saw | `max <бот> bot messages list`, `max <бот> bot search messages` |
| Download old chat history | `max <бот> bot store fetch` |
| Manage members and admins | `max <бот> bot chats members`, `max <бот> bot chats admins` |
| Bring order to the group according to your own rules | `max <бот> bot chats moderate` |
| Reply in the comments under channel posts | `max <бот> bot comments` |
| Respond to buttons, set command menus and webhooks | `max <бот> bot callbacks`, `commands`, `webhooks` |
| Limit chats where the bot can write | `max <бот> bot recipients` |
| Call any Bot API operation | `max <бот> bot api <операция>` |
| Transfer bot to AI agent | `max <бот> bot mcp` |

A complete list of commands and options is in the [command reference](./commands.md).

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

Identify a chat by number and a person by `user:<номер>`; a previously seen chat also accepts its name. Always name the chat with the message, keeping `max` and `tg` commands consistent where message numbers are chat-specific. `max` does not change a message from another chat.

```sh
max sales bot messages send "Команда продаж" "Сборка готова"
max sales bot messages send user:4815162342 "Здравствуйте"
max sales bot messages send "Команда продаж" "**Итоги недели** в закрепе" --md
max sales bot messages send "Команда продаж" "Принято" --reply-to mid.0000019a7f3c21de
echo "Текст из трубы" | max sales bot messages send "Команда продаж" -
max sales bot messages list "Команда продаж" --limit 20
max sales bot messages show "Команда продаж" mid.0000019a7f3c21de
max sales bot messages edit "Команда продаж" mid.0000019a7f3c21de "Исправленный текст"
max sales bot messages delete "Команда продаж" mid.0000019a7f3c21de --allow-dangerous
max sales bot messages pin "Команда продаж" mid.0000019a7f3c21de --notify
max sales bot messages unpin "Команда продаж" mid.0000019a7f3c21de
```

`--silent` sends without a notification. Text is limited to 4,000 characters. The example ids `user:4815162342` and `mid.0000019a7f3c21de` are fictional; substitute yours. `--html` uses HTML; it cannot be combined with `--md`. Deletion asks for confirmation; `--allow-dangerous` confirms it. Pinning is silent by default; `--notify` informs members. The response contains the message and `operationId`, its audit-entry id.

If the connection drops during a send, `max` does not retry automatically. It reports an unknown outcome (code `14`). Check the chat before sending again.

### Files

`--file` attaches a file from disk. Images, video and audio are detected by extension; other files are sent as documents. `--photo` sends an image as a photo, `--voice` sends Ogg Opus as a voice message, and `--as-file` sends video as a document. Known credential files, `max`'s own directories and the message store require `--allow-any-file`; ordinary hidden working directories are allowed. Text is optional when sending a file:

```sh
max sales bot messages send "Команда продаж" "Отчёт за неделю" --file report.pdf
max sales bot messages send "Команда продаж" --file screenshot.png
```

The file is uploaded to MAX before the message is sent. While MAX processes a video or large file, it may report “not ready”; `max` waits up to four times, about nine seconds in total. If upload fails, nothing is sent to the chat.

`uploads put` only uploads the file and prints an attachment object. Put this in the body's `attachments` for `bot api send-message`:

```sh
max sales bot uploads put report.pdf
```

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

An administrator bot can add members through `bot chats members add`. [MAX documentation](https://dev.max.ru/docs-api) marks this method removed, but the MAX server executes it; the server determines availability.

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
max sales bot search messages "итоги недели"
```

Search - by words, best matches on top; `--newest` - new on top. All the words are needed; `"фраза"`, `-слово`, `а OR б` and filters `from:`, `chat:`, `after:`, `before:`, `has:` work, and the typo is corrected. To strictly search the general archive, use [regular search](./search.md) with `in:bots`.

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
max sales bot search messages --from @ann        # всё, что она написала
max sales bot search messages "счёт" --from @ann --from Борис
max sales bot messages between @ann Борис --limit 20
```

`between` shows only chats where every named person has posted, returning the latest 20 messages from each, oldest first. A “shared chat” here means the bot saw messages from each person, not that MAX's member list includes them.

**Each bot sees only its own local copy.** Reading another bot's copy requires both permission in configuration and an explicit request in the command:

```sh
max shop config set --bot readOtherBots true          # боту shop можно читать всех ботов
max shop config set --bot readOtherBots news,support  # или только этих
max shop bot search messages заказ --bots news        # и тогда — явно, в команде
max shop bot contacts show @ann --all-bots            # все, кого разрешено
```

`--all-bots` and `--bots` are supported by `search messages`, `contacts show` and `messages between`. Without `readOtherBots`, both refuse with code `5` and name the command that enables access. Through `max <имя> bot mcp`, the equivalent fields (`all_bots`, `bots`) are offered only when access is permitted.

## Updates

```sh
max sales bot watch                       # новые сообщения, до Ctrl-C или --timeout
max sales bot watch --events --jsonl       # и всё остальное: правки, удаления, кнопки, кто вошёл и вышел
max sales bot watch --types message_created,message_edited
```

`watch` saves incoming data before printing it: messages in local storage, button presses for `callbacks answer`, and joins and departures for group checks below. Without `--events`, only new messages are printed. With `--events`, every line identifies its event (`message`, `edit`, `delete`, `callback`, `joined`, `left`, `added`, `removed`, `started`, `other`). `--types` accepts MAX event names. The next run resumes where the previous one stopped. `watch` does not work while a webhook is configured.

Updates received by `watch` are no longer delivered to another reader using this bot's `get-updates`.

## Checking a chat against rules

A bot can follow a group where he is an admin, according to the same rules as `max chats moderate` for a personal account (see [rules in groups that you manage](./groups.md#правила)). Each bot has its own rules:

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

The journal records the chat, action type, outcome and text length, but no text. Recipient restrictions and journalling apply to **every** bot write, including `bot api`. A bot has no hourly send limit until one is set in configuration section `bot` (`max <имя> config set --bot sendsPerHour 200`; see [configuration](./configuration.md)).

## Any API operation

`max bot api <операция>` exposes all Bot API operations, including those without convenient commands above. Commands are generated from the official API schema; new operations appear after a schema update. Operation help lists accepted fields:

```sh
max sales bot api get-my-info
max sales bot api get-subscriptions
max sales bot api answer-on-callback --callback-id f9LHodD0cOL5 --body '{"notification": "Готово"}'
max sales bot api send-message --user-id 4815162342 --body-file message.json
```

Path and request parameters are flags, body is JSON in `--body`, `--body -` (from the pipe) or `--body-file`. `--body-file -` also reads stdin. The native parameter `timeout` is called `--poll-timeout`, and the global `--timeout` limits the entire command. The general option `--store-token <profile>` is not available for current MAX methods: they all reject it before performing the operation. Before sending, the body is checked against the schema, and the error message contains the field and what was expected in it, without the value itself. A list of all operations and which ones read and which ones write is [Bot API coverage](https://github.com/WireCatLabs/max-cli/blob/v0.45.1/docs/dev/bot-api-coverage.md).

<a id="для-скриптов-и-агентов"></a>

## If the bot fails or makes a mistake

The failure or error is explained in the error message, and the command exits with the code:

| Code | What happened | What to do |
|---|---|---|
| `4` | there is no bot token or MAX did not accept it | rerun `bot auth set` |
| `5` | read-only profile or action not allowed `allow` | change permissions only if you want to allow it |
| `6` | chat not found - for example, by name, which the bot has not yet seen, or a person without `user:` | indicate the chat number or `user:<номер>`, or open the chat via `bot chats show` |
| `7` | chat is not in the list of bot recipients | add chat via `bot recipients add` |
| `8` | exhausted `sendsPerHour` bot | wait or raise the limit |
| `14` | no response received: unknown whether MAX completed the write | check chat before repeating |

The [command reference](./commands.md) lists all codes. Bot `--trace` and `--record` log each Bot API request on stderr. File uploads report type, size and response code without URLs or filenames. Failed runs are saved in `max runs list` ([diagnostics](./diagnostics.md)).

## Certificate

The `platform-api2.max.ru` certificate is signed by a Russian Ministry of Digital Development root certificate absent from Node. `max` adds it only to its own Bot API requests, without changing your system. Bot requests identify themselves as `max-cli/<версия>`.

## Connecting a bot to an agent (MCP)

`max <имя> bot mcp` gives your AI agent access to a bot, just as `max mcp` exposes your personal account:

```sh
claude mcp add sales-bot -- max sales bot mcp
max sales bot mcp config          # запись для Claude Desktop, Cursor и других приложений
```

The agent can access what the bot profile permits: the bot, chats it has seen, messages, search, people, members and administrators, comments, command menus, the log and recipient list. If the profile is not read-only, it can also write as the bot: send, edit, pin, indicate typing, comment, answer buttons, delete, add or remove members, and check a chat against its rules (`max_bot_write` (`command: "chats moderate"`)). `max_bot_read` (`command: "status"`) shows which profile the server represents, where the token comes from, which bot it is and which write tools are enabled.

- `permissions.bot: readonly` makes the agent read only unless more specific permissions override it;
- to allow only sends and comments, set `permissions.bot: readonly`, then `permissions.bot.messages.send: allow`; check for other more specific permissions;
- Deleting a message or comment defaults to level `ask`: the requested write is allowed without a server confirmation form; `deny` and `readonly` forbid it.
- Actions that chat rules require you to confirm remain plans for the owner.
- Older confirmation flags do not change access.

`--allow-send`, `--allow-delete` and `--allow-moderate` do not control permissions; the server accepts them with a warning.

Every write runs the command you would type yourself and checks the bot's recipient list, `permissions` and journal. The agent cannot access the token or webhooks. It can read the recipient list, command menu and administrators but cannot change them; leaving chats, sending files and `bot api` are also unavailable to it.

With `--md`, the bot uses MAX rules: `__жирный__`, `++подчёркнутый++`, `^^выделенный^^`, links, code, headings and quotations. The formatter creates safe HTML with escaped text and addresses; this is an internal representation, and the --md argument remains Markdown.
