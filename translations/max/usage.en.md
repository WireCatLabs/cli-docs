---
title: "Personal account guide"
---
This page covers your personal account. Bots using the official Bot API have a separate [Bot guide](./bot.md).

Each command performs one task, prints its result and exits. Only [`max serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) keeps a MAX connection open. The first command needing MAX starts it in the background; it stops after 15 minutes without use.

```sh
max [профиль] [опции] <ресурс> <действие> [аргументы]
```

The [Command reference](./commands.md) lists every command and option, generated from the program itself.

## Getting started

```sh
max setup --agent codex  # QR-вход и навык агента
max chats list           # ваши чаты
```

Setup may take about five minutes. It checks up to five chats and does not start the background service. Download history separately after choosing a chat and how much to fetch. Before login, your agent reads `max skill show`, available without a session.

`max skill show link-conversations` prints the shared skill for linking archived conversations; it needs no additional login.

## Logging in

For your first run, use `max setup`. For an explicit fresh login, use `max session start qr`: scan the terminal’s QR code with the MAX app, and the token is saved in your operating system’s keychain. See [docs/sessions.md](./sessions.md) for all login methods. Without a method, `max session start` **imports a token** obtained from the official client and saves it in the keychain.

```sh
max session start
MAX token: ▏               # ввод не отображается
```

**Tokens cannot be command arguments.** Arguments appear in `ps` and shell history. Instead, enter the token at a hidden terminal prompt or provide it through a pipe:

```sh
pass show max/token | max session start
```

CI and one-off runs can use `MAX_TOKEN`, which takes precedence over the keyring:

```sh
MAX_TOKEN="$(cat /path/to/token)" max chats list
```

Check your account:

```sh
max account show                # номер телефона — только последние 4 цифры
max account show --show-phone   # номер целиком
```

Forget the session on this machine:

```sh
max session end
```

`session end` deletes the token **locally** without notifying MAX. A session opened in the browser remains valid, as the response shows: `revokedOnServer: false`.

## Profiles use the first word

Multiple accounts can coexist. Supply a profile as the first word, not a flag:

```sh
max chats list              # профиль default
max personal chats list     # профиль personal
```

**The first word is a profile unless it matches a command name.** A profile named `chats` is therefore rejected during creation, with an explanation.

For a whole shell session, use a variable:

```sh
export MAX_PROFILE=personal
max chats list
```

Each profile has its own token and state. The local message store is shared, with data separated by account.

## Reading

```sh
max chats list                      # все чаты
max chats list --limit 5            # первые пять
max chats list --unread             # только чаты с непрочитанным
max chats show "Иван Петров"        # один чат: вид, непрочитанное, последнее сообщение, участники
max contacts list                   # люди, с кем есть личный чат
max contacts show @ivan             # один человек и общие с ним чаты
max messages list 0                 # сообщения чата по id
max messages list "Иван Петров"     # или по имени чата
max messages list 0 --limit 50
```

Address a chat by **ID or part of its title**. If two chats match, the command lists candidates instead of guessing: sending to the wrong conversation is irreversible.

`contacts show` also accepts **ID, `@username` or part of a name**, without guessing between matches. It finds anyone known to local storage, including group members not considered contacts. The response includes name, `@username` and shared chats, newest first. Finding someone never sends them a message.

`chats show` returns one object: fields from the `chats list` row plus `members`, everyone except you. For a channel, `members` is `null`: MAX may return four subscribers out of thousands, which would be misleading as a full member list.

Unread messages across chats, or messages since your last check:

```sh
max inbox                               # непрочитанное — по счётчику MAX, у каждого сообщения чат
max inbox --new                         # что пришло с прошлой проверки, каждое сообщение один раз
max inbox --new --jsonl                 # то же для скрипта: одно сообщение на строку
max inbox --since-time 2026-09-24T09:00 # разовый взгляд с этого времени
max inbox --all                         # и чаты без звука, и архив
```

**`max inbox` never marks messages read**, so it returns the same unread data until you read it in the app. For scheduled runs, use `--new`: its saved position advances only after output is printed. The first `--new` covers 24 hours. `--since-time` does not move this position. Your own messages are excluded. If a chat exceeds `--limit` (default 20), the newest messages are shown with a stderr command for the rest. A run reads at most 20 chats; others appear in stderr and `skipped`.

Muted and archived chats are skipped unless you were mentioned or replied to; stderr reports the skipped count. `--all` includes them.

Read one message and its context; both chat and message ID are required (these IDs are examples):

```sh
max messages show -1000 100000000000000001
max messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

The selected message is marked `◀` in the feed and `"anchor": true` in JSON. A missing or wrong-chat message returns not found, not a neighboring message. `--before-id` with `messages list` works for any ID because its timestamp is encoded in it. You can also use a `msg:…` locator from `messages search`, without a separate message ID.

Save photos, files, video and audio to a directory, current by default:

```sh
max messages download -1000 100000000000000001 --output-dir ~/Downloads
```

`--output` remains a compatible name for `--output-dir`; do not specify different directories with both. The directory is created if missing. Single-message JSON contains `{items}`; JSONL emits one file record per line.

For the entire chat: `max messages download -1000 --all --output-dir ~/Downloads --pause 5s`. Repeating the command continues saved progress; previously saved files remain in place.

`max messages evidence -1000 --limit 20 --json` returns a bounded message packet from the local archive, with locators and completeness information, without connecting to MAX. Select older messages with `--before-id`. A packet does not establish that the history is complete.

Files keep their name; other attachments use `<id сообщения>-<номер>.<расширение>`. **Existing files are not overwritten**: the command stops with an error naming the file. Video downloads use the largest MP4; calls, links and stickers are not downloaded and produce a stderr note. Saved files are owner-only (mode 600). Voices have `kind: voice` in JSON; unnamed attachments get their extension from HTTP MIME.

### Message link

`max messages link <chat> <message>` or `max messages link <msg:locator>` returns `{ locator, url, access, reason }`. Personal MAX first validates the message in the local archive and returns a locator; a native link format has not yet been verified. `--offline` makes no connection. A locator from another account is refused. `messages links` remains the conversation-relationship command.

### Voice messages to text

Transcription happens **on your computer**; audio is not sent elsewhere. Download a speech model once, with a separate command:

```sh
max models audio list                # какие модели есть, какие скачаны, какая по умолчанию (*)
max models audio download gigaam-v3  # 233 МБ, один раз
max messages transcribe "Иван Петров" 100000000000000001
```

Models live in a directory shared by MAX and Telegram; `CLI_COMMON_CACHE_DIR` relocates it. `models audio list --json` returns an `items/page/limit/hasMore` page and the `directory` path. Downloaded files are reused. `gigaam-v3` remains first, and `config set --defaults transcribeModel <модель>` selects the model.

| Model | Languages | Size | 5 minutes of speech |
|---|---|---|---|
| `gigaam-v3`, default | Russian; best Russian recognition | 233 MB | ~40 s |
| `gigaam-v3-ctc` | Russian; slightly faster, weaker capitalization | 226 MB | ~36 s |
| `parakeet-v3` | 25: Bulgarian, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hungarian, Italian, Latvian, Lithuanian, Maltese, Polish, Portuguese, Romanian, Slovak, Slovenian, Spanish, Swedish, Russian, Ukrainian | 671 MB | ~60 s |

Timings use one thread on a Ryzen AI 9 HX 470 laptop. Select another model for one run with `--model parakeet-v3`, or permanently with `"transcribeModel": "parakeet-v3"` in configuration `defaults`. Every download is checked against a checksum embedded in `max`; a mismatch prevents installation.

Text is stored under your account in the shared local `messages.db`, used by `messages list`, `messages transcribe`, `inbox`, `review` and MCP. Repeating a request by chat id with the same model answers immediately, without network or model execution. Transcripts from the old profile-specific cache are not migrated; `--transcribe` recreates them. Recordings download over the reading connection, which closes before local recognition. Downloading does not need a second login. Memory usage is about 700 MB (`parakeet-v3` uses 1.3 GB).

Transcribe displayed voice messages in a chat or inbox:

```sh
max messages list "Иван Петров" --transcribe
max inbox --transcribe
```

`--transcribe` processes only displayed voice messages missing text. `--model` overrides the model for one run. `max` downloads the audio first, closes the connection, then runs recognition. Text appears under the voice message with 🎤, or as `transcript` in `--json`. Failures are listed in `unheard` with a stderr reason; the messages are still printed. If the model is absent, the command explains how to download it without downloading automatically. Models live in `~/.cache/cli-common/models/audio`, shared by `max` and `tg`.

Existing transcripts appear without the flag. With `--offline`, new audio cannot be downloaded or transcribed.

**Reading never marks messages read.** Fetching history and marking read are separate protocol operations; tests verify that the latter is sent only when requested. Explicitly mark a chat read, visible to the other person:

```sh
max chats mark-read "Иван Петров"                  # до последнего сообщения
max chats mark-read "Иван Петров" --until 100000000000000001   # до этого сообщения включительно
max messages list "Иван Петров" --mark-read        # прочитать и отметить показанное
```

Read receipts pass send checks: read-only profiles and recipient lists may reject them, but they do not count toward the hourly send limit. They refuse with `--offline`.

### Reviewing commitments

```sh
max review                                   # всё за последние 3 дня
max review --since-time 2026-09-23T09:00     # с конца прошлого обзора
max review --since-time 2026-09-23T09:00 --transcribe --json
```

This returns all messages, yours and others', in chats active since `--since-time`. Use it to identify promises, things you await and unclear points; interpreting them is your or your agent's job. Nothing is marked read. At most 300 messages are included per chat; exceeding this marks the review incomplete. Muted and archived chats are skipped unless you were mentioned or replied to, as in `inbox`; `--all` includes them.

The final stderr line shows the interval covered. Start the next review from that `--since-time` boundary to avoid gaps. If coverage is incomplete because of too many chats, truncated history or untranscribed audio, the command says so; avoid advancing the boundary.

`--transcribe` processes audio lacking text, taking up to a minute per five minutes of speech, and only with a downloaded model ([Voice transcription](#голосовые-в-текст)). Without it, saved transcripts appear and remaining audio is listed in `unheard`.

#### Unanswered questions

```sh
max review --unanswered                      # вопросы, на которые сутки никто не ответил
max review --chat "Соседи" --unanswered 4h    # в одной группе, без ответа 4 часа
```

`--unanswered [длительность]` keeps questions waiting for your answer or a group administrator's. A question contains “?” in its text or transcript, or replies to your message or an administrator's. Stored transcripts always participate; `--transcribe` recognizes new voices before question selection. An unrecognized recording leaves the review incomplete. A question is answered if you or an administrator replied to it or spoke next after its author. Questions younger than the specified duration, such as `4h` or `1d` (default `24h`), are omitted because there has not been time to answer.

MAX provides admin information at login only for recently active chats. If unavailable, the command reports it and counts only your answers. Replies after the review's end are not visible. `--chat` restricts any review to one chat, with or without `--unanswered`.

### Pagination

`chats list`, `contacts list` and `chats members list` have three pagination options. `messages list`, `inbox`, `sends list` and `runs list` have only `--limit`; `chats events` reads events from a specified time without pagination:

```sh
max contacts list --limit 5             # по пять в странице
max contacts list --limit 5 --page 2    # шестой по десятый
max contacts list --all                 # всё, без страниц
max contacts list --order name          # по алфавиту вместо «кто писал последним»
```

Combining `--all` and `--page` is rejected. `--limit` has a configuration setting; `--page` and `--all` do not, because a saved page number is useful once and disruptive afterward.

⚠ **Page numbers on live lists may repeat or skip rows.** Lists are newest first, so new messages between pages can move entries across the boundary. This is a limitation of live pagination.

**Message history uses `--before-id`, not page numbers**, giving a precise time-based position:

```sh
max messages list 0 --limit 20
max messages list 0 --before-id 116762160362694583        # id самой старой строки, которую вы видите
max messages list 0 --before-time 2026-09-20T01:00:00Z    # работает и когда того сообщения уже нет
max messages list 0 --after-id 116762160362694583         # что пришло после этого сообщения
max messages list 0 --after-time 2026-09-20T01:00:00Z     # или после этого времени
```

`--after-id` and `--after-time` read forwards: up to `--limit` messages **after** the position, oldest first, with a stderr hint for the next page: `--after-id <id последней
строки>`. Only one of the four position options is allowed; they describe alternative starting points, not a bounded interval.

The anchor itself is excluded with `--before-id` and `--after-id`, preventing duplicate boundary messages. Offline, only `--before-id` is supported, using an ID already stored locally.

Times accept ISO 8601 or relative values: `30m`, `2h`, `1d`; `--after-time 7d` covers the past week. If an ID is missing locally, as a deleted message may be, the command explains the alternative method.

### Finding a chat before sending

```sh
max chats list --search иван             # чаты, в названии которых есть «иван»
max chats list --search work --kind group # только группы
max chats list --unread --kind dialog    # личные чаты, где есть непрочитанное
max contacts list --search петров        # люди по имени или @username
max messages search "договор"            # по тексту сообщений, которые уже прочитаны
max messages search "договор" --chat 42  # в одном чате
```

Search needs **at least three characters**. With `--search`, `--kind` or `--unread`, `chats list` checks all chats MAX provided at login and reports (`partial`) if MAX did not provide them all; with `--offline`, it checks all stored chats.

After finding the chat, use its **ID**, shown in output and stable:

```sh
max messages list 42 --limit 20
max messages send 42 "текст"
```

Partial chat names also work here and in `max messages search --chat`: search reads the local store without connecting to MAX and resolves names among saved chats. The default search uses strict Lucene: whole words, or an explicit prefix pattern such as `квартир*`. The previous typo-correcting search is available with `--language legacy`; `--regex` is a separate case-insensitive regular-expression mode. See [search](./search.md).

### How many messages matched

`max messages stats` counts messages from the local archive without connecting to MAX. Without a query, it counts all saved messages of the current account; with a query, it counts strict Lucene matches, like `messages search`. Each message is counted once.

```sh
max messages stats "договор" --by chat --json
max messages stats --by sender --chat "Работа" --limit 10 --json
max messages stats --by day --timezone Europe/Madrid --json
max messages stats --by hour --timezone UTC --jsonl
```

`--by` groups by chat, sender, calendar day or hour. `--limit` limits the rows, and `total` is the number of all matching messages. In an incomplete archive, the numbers are a lower bound: check `coverage` and `completeness` before you treat zero matches as proof. To include all saved MAX accounts, add `--source max` explicitly; without it, other profiles are not included. JSON contains `by`, `items`, `total`, `page`, `limit`, `hasMore`, `query`, `coverage` and `completeness`; JSONL prints the `items` rows.

### Who counts as a contact

`max contacts list` shows **people with whom you have a direct chat**, newest conversation first. Group members are also saved with names and shared chats, but do not appear in this contact list.

MAX has no endpoint returning an address book, so only people from your chats are available. Contacts stay current because commands log in and each login requests **only changes since the previous one**.

```sh
max contacts sync     # забыть, где остановились, и забрать список заново
```

This is a repair action for inconsistent local data or a schema update that cleared it, not the normal workflow. Its response contains only counts, no names, phones or descriptions.

## Sending

```sh
max messages send 0 "текст"
max messages send "Иван Петров" "текст"
```

`--topic` is for Telegram forum topics. MAX rejects it in `messages send` and `polls create` before sending; omit it for ordinary chats.

Sending does not ask for confirmation: you already supplied the recipient and text in the command.

### Text from a pipe

Omit the last argument to read the body from stdin:

```sh
echo "текст" | max messages send 0
max messages send 0 <<'EOF'
первая строка

третья
EOF
cat письмо.txt | max messages send 0
```

This supports **multiline** text and keeps it out of `ps` and shell history, following the same privacy principle as tokens. All newlines are preserved except one final newline commonly added by `echo`.

⚠ **If stdin is a terminal, the command refuses instead of waiting.** `max messages send 0` without text is treated as a missing argument, preventing an apparently hung command.

If no response arrives, the outcome is `outcome_unknown` (code `14`), **neither confirmed success nor failure**, because the message may have been sent. The error includes a `--send-id` for a safe retry:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

MAX does not create a second message when the same `cid` is reused.

### Sending later

```sh
max messages send 0 "напоминание" --at-time 2026-09-25T09:00   # местное время
max messages send 0 "напоминание" --at-time 2h                # или через 30m, 2h, 1d
max messages scheduled 0                                       # что ждёт отправки в этом чате
```

The message waits **on MAX's server** and sends even if your computer is off. MAX discards seconds, so time is rounded down to the minute. Less than a minute or more than a year away is rejected.

- Response: `{sendId, operationId, message, scheduledFor}`, containing the queued message and time. **Its ID changes when sent.**
- `--silent` is unsupported: MAX always sends scheduled messages with notifications.
- Send safeguards (read-only, recipients, hourly limit) are checked when queuing.
- Missing responses are not retried. `outcome_unknown` advises checking the queue; `--send-id` cannot be combined with `--at-time`. Scheduled-send deduplication has not been verified.
- **Cancel or edit in the MAX app.** `max` does not issue cancellation.

### Replies and reactions

```sh
max messages send 0 "да" --reply-to 100000000000000001   # ответ на сообщение в том же чате
max reactions add 0 100000000000000001 👍                 # реакция; прежняя ваша заменяется
```

Other people see reactions, just like replies. Remove yours with `max reactions remove 0 100000000000000001`.

Reading shows reactions beneath a message, such as `👍 3  🔥 1  (you: 🔥)`. JSON uses `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` means not queried, with `--offline`, or unavailable from MAX; stderr explains the reason.

### Editing, forwarding and pinning

```sh
max messages edit 0 100000000000000001 "новый текст"          # только своё; вложения остаются
max messages forward 0 100000000000000001 --to "Коллеги"      # переслать одно сообщение в другой чат
max messages pin 0 100000000000000001                         # закрепить, без уведомления участникам
max messages pin 0 100000000000000001 --notify                # закрепить и уведомить
max messages unpin 0 100000000000000001                       # открепить; в чате MAX закреплено одно сообщение
```

Others see edits and may already have read the old text. MAX allows editing your own messages within 7 days; forwarded messages cannot be edited. Forwarding creates a new message and passes send checks, counting toward `sendsPerHour`. Edits and pins with `--notify` also count; silent pins are checked but do not count. Retry an unknown forward outcome only with the error's `--send-id`; otherwise a second copy is created.

Pins work only in groups and channels, not direct chats or Saved Messages. Unsupported destinations refuse immediately.

### Deleting

```sh
max messages delete 0 100000000000000001 --allow-dangerous                   # только у вас
max messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # несколько, до 10
max messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # у всех в чате
```

Deletion cannot be undone, so `messages.delete` defaults to `ask`: confirm in the terminal, or pass `--allow-dangerous` in JSON mode. Explicit `allow` for `permissions.messages.delete` permits deletion without that question; `readonly` and `deny` forbid it regardless of the flag. By default, the message disappears only for you and remains for the other person. `--for-everyone` removes it for everyone, and the other person cannot restore it.

Deletion passes send checks. **Each deleted message counts toward `sendsPerHour`** like one send, with at most 10 per run. Large deletion bursts resemble automation and can trigger MAX restrictions. Deleted data is removed from local cache and search too.

### Polls

```sh
max polls create 0 "Обед?" "Да" "Нет" --multiple     # опрос отдельным сообщением
max polls show 0 100000000000000001                  # варианты с id и сколько за каждый
max polls vote 0 100000000000000001 1                # голос за вариант с id 1
max polls vote 0 100000000000000001 --retract        # снять голос, если опрос это разрешает
max polls close 0 100000000000000001                 # закрыть свой опрос; открыть снова нельзя
```

Reading displays the question, answers with IDs in `[скобках]` for `polls vote`, vote counts and ✓ for your choice. JSON stores a `poll` attachment field: `{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. Unknown newer poll versions display a single line without answers. `polls show` and `polls vote|close` responses share the `tg` shape: `{chatId, messageId, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}`. For `vote` and `close`, this is in `poll` beside `operationId`. Polls created with `polls create` and `--revote` allow changing votes.

web.max.ru does not display polls, showing “Update MAX…” instead. Browser readers cannot see your poll; phone and desktop apps can.

Other participants can see votes unless the poll is anonymous. The command refuses locally, as the web client does, if the poll is closed, multiple choices are supplied for a single-choice poll, a second vote is forbidden, or an option id does not exist. Voting, closing and creating polls run the same checks as sending: a vote is a reaction, closing is an edit, and creation is a message. `sendsPerHour` counts creation and closure, but not votes or reactions. Votes are never retried automatically. For agents, `max_polls_vote` and `max_polls_create` in `max mcp` use `permissions`; `max_polls_close` requires write access to `polls.close` ([mcp.md](./mcp.md)).

### Contacts, profile and folders

```sh
max contacts lookup                         # спросит номер; или: echo "+7…" | max contacts lookup
max contacts add 20000002                   # id из lookup, или часть известного имени
max contacts remove 20000002
max contacts rename 20000002 "Соседка" "Анна" # своё имя для человека; он его не видит
max contacts block 20000002                 # больше не сможет вам писать
max contacts unblock 20000002
max contacts import книжка.csv              # строка: номер, запятая, табуляция или точка с запятой, имя
max account update --description "о себе"   # имя остаётся прежним
max account update --photo портрет.png      # новое фото профиля
max account sessions list                   # где ещё выполнен вход
max account sessions end --others --yes     # выйти везде, кроме этого сеанса — и на телефоне
max chats folders list
max chats folders create "Работа" --chat -1000 --chat "Проект"
max chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
max chats folders delete "Офис"             # чаты остаются
```

Phone numbers do not appear in command arguments, visible through `ps` and history. An added person without a direct conversation is absent from `contacts list`, but accessible through `contacts show <id>`. You can block someone not in contacts. MAX does not offer personal-account short names (`@имя`); attempts return “This name is unavailable”. Folder names must not exceed 20 characters; longer names refuse before contacting MAX. `import` sends other people's phone numbers to MAX.

Contact changes return `operationId` in JSON. `add` and `rename` also return `person` with `id`, `name`, `username`; `remove`, `block` and `unblock` return `personId`. `import` returns `sent` and `recognised`: the first counts file rows, including duplicates, while the second contains person records returned by MAX. If MAX returned only phone numbers without records, `recognised` is empty; phone numbers are not included in the response.

`chats folders create` and `update` return `{operationId, folder}` in JSON; `delete` returns `{operationId, folderId}`. `list` returns a page of folders. `update` requires at least one change: `--title`, `--add` or `--remove`. Identify a folder by ID or exact name; if names repeat, use its ID from `list`.

`account update` returns `{operationId, account}` in JSON. The record contains `id`, `name`, `username` (`null` for MAX) and a masked `phone`. Read the description after a change with `account show`. Profile photos must be JPG, JPEG, PNG or WebP. `account sessions end --others --yes` returns `{operationId, sessions}`, the sessions that remain. If ending sessions succeeds but saving the new token or reading remaining sessions fails, the command reports an error while the journal records the completed action.

### Photos, video, files and voice messages

```sh
max messages send 0 "отчёт" --file отчёт.pdf
max messages send 0 "с дачи" --file ролик.mp4          # видео, которое смотрят прямо в чате
max messages send 0 --file ролик.mp4 --as-file       # то же видео файлом для скачивания
max messages send 0 --photo снимок.png                # фото
max messages send 0 --voice заметка.ogg              # голосовое сообщение
```

With `--file`, `.jpg .jpeg .png .webp .gif` become photos, `.mp4 .mov .webm .mkv` videos, and other extensions documents. `--as-file` sends the `--file` attachment as a document, including video. `--photo` accepts only `.jpg .png .webp`. One `--file` and one `--photo` attachment are supported, but **video and documents must be sent alone**, enforced before uploading. Text is optional. Upload failure sends nothing. Multiple files in one message are currently unsupported. MAX does not support `--no-preview`; the command refuses it.

`--voice` sends a voice message with duration and waveform, like a phone recording. It must be sent alone, without text, file or photo. Use Ogg Opus, the format MAX records; convert other audio first:

```sh
ffmpeg -i запись.m4a -ac 1 -ar 48000 -c:a libopus -b:a 32k заметка.ogg
```

Hidden files, files in hidden directories such as `~/.ssh`, and files in `max` directories are protected because they may contain keys or tokens. Use `--allow-any-file` only when intentionally sending one.

With `--md`, MAX uses its own formatter: `**жирный**` or `__жирный__`, `_курсив_` or `*курсив*`, `~~зачёркнутый~~`, `++подчёркнутый++`, `[ссылка](https://example.com)` and monospaced code in backticks or a block. Styles nest; positions use UTF-16 offsets. Newlines inside inline code become spaces; MAX does not retain a block's language. Without the flag, text is sent literally. `_` and `*` within words remain literal; a backslash escapes a mark. Links allow http, https and mailto; an unclosed code block is rejected.

The MAX Bot API formatter also supports `^^выделение^^`, headings with `#` and quotations with `>`; it safely converts the result to HTML. The personal protocol rejects these three forms before sending or uploading a file. `||spoiler||` remains literal text in MAX. Telegram has its own syntax: `__текст__` means underline there, but bold in MAX.

```sh
max messages send 0 "встреча **в 15:00**, не _в 14_" --md
```

### Groups and channels

See [Managing groups](./groups.md) for admin workflows, rules and limitations.

```sh
max chats inspect https://max.ru/join/…          # что за ссылкой; не вступает
max chats join https://max.ru/join/…             # вступить в группу или канал
max chats leave "Семья"                          # выйти
max chats create "Поход" "Аня" 20000002          # создать группу с людьми (имя или id)
max chats create "Новости" --channel            # закрытый канал; люди входят по ссылке-приглашению
max chats members list "Поход" --all             # все участники: когда заведён аккаунт, когда был в сети
max chats members add "Поход" "Боря"             # без старых сообщений; с ними — --history
max chats members remove "Поход" "Боря"
max chats admins add "Поход" "Аня" --can members,pin
max chats admins remove "Поход" "Аня"              # снять права; участником остаётся
max chats update "Поход" --title "Поход-2026" --description "в июле"
max chats show "Поход"                           # настройки группы — в поле settings
max chats update "Поход" --all-can-pin off       # поменять одну
max chats link show "Поход"                      # ссылка-приглашение, если вам её видно
max chats link reset "Поход"                     # новая ссылка; старая перестаёт работать
max chats events "Поход"                         # кто вступил, вышел, кого добавили и удалили — за 7 дней
max chats events "Поход" --type add,remove --since-time 2026-09-01T00:00
```

**Other people see these changes:** joins, departures, additions and new titles. `inspect`, `link show`, `events` and `members list` only read. Changes pass send checks: read-only refuses; recipients restrict destinations; actions are logged without titles or links. `create` and `members add` count one hourly send per person because each receives a message. If recipients are restricted, each person's direct chat must be listed. Failures are not retried: repeating `create` makes another group.

Group changes return `operationId` in JSON. `create`, `join`, `update` and `link reset` put the chat record in `chat`; `leave` returns `chatId`. Adding members returns `{operationId, chatId, added, notAdded}`; removing them returns `{operationId, chatId, removed}`. After a successful MAX response, `notAdded` is empty: MAX does not provide a separate list of partial failures; refusing to add a person returns an error. `admins` commands return `personId`; `admins add` also returns `rights` without duplicates. `link show` retains `{chatId, title, link}`.

In one `update`, the title or description and the settings are sent separately. If the first write succeeds but the second does not complete, the command returns `outcome_unknown`: the change may have applied partially. Read the group with `chats show` before retrying; requests are never retried automatically.

`events` reads service messages from chat history: who did what, and to whom. Event types: `create` means the chat was created, `add` means someone was added, `remove` means someone was removed and `pin` means a message was pinned. Other names appear unchanged. A run reads up to 2,000 messages, oldest first; if there are more, the command tells you where to continue.

`members list` asks MAX for members, so it works for channels and large groups too; `chats
show` includes only people seen by the local store. Each record includes the role (`owner`, `admin`, `member`; absent if MAX did not report group admins at login), account creation time (`registeredAt`: a very new account in a group is worth checking) and last-seen time (`lastSeenAt`; empty if hidden). It shows the requested page; `--all` reads all available members, up to 5,000. The command warns if MAX truncates the list or repeats a marker. `hasMore` indicates additional rows already read, rather than promising that the full list is available. JSON contains `items`, `page`, `limit`, `hasMore`; an absent `role` means MAX did not report roles. `chats inspect` shows a link’s destination without joining: `id`, `kind`, `title`, `username`, `participantsCount`, `description`, `member`. Unknown `member` and `username` values are `null`.

You can remove a member but cannot clear their messages. Deleting an entire chat is intentionally unsupported. Admin `--can` permissions are `read`, `members`, `admins`, `info`, `pin`, `link`, `post`, `edit`, `delete`. `read` grants access to every group message, matching “Read messages” in the app; without it, bots see none. `link` allows resetting invite links.

#### Moderation rules

```sh
max chats rules show "Поход"                          # правила группы; без них — значения по умолчанию
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отметить
max chats rules set "Поход" trusted 30000003,30000004 # этих людей правила не трогают
max chats rules set "Поход" consent.delete ask        # перед удалением — спрашивать
max chats rules unset "Поход" consent.delete          # вернуть значение по умолчанию
```

Rules live on this computer beside profile settings; the response names the file. The first group `set` writes every rule and default, showing all configurable fields. You can edit the file manually; `rules show` validates it.

By default, rules only report (`report`). Beyond that, a rule can `delete` a message or `remove` a person. Each action has its own consent level (`consent.delete`, `consent.remove`): `deny` means never, `readonly` means report only, `ask` means ask first (the default) and `allow` means act without asking. `--allow-dangerous` authorizes `ask` actions for this run. Old `forbid`, `flag` and `confirm` values in files are read as `deny`, `ask` and `ask`.

#### Checking a group

```sh
max chats moderate "Поход"                       # что нового нарушает правила; делает то, что разрешено
max chats moderate "Поход" --dry-run             # только показать
max chats moderate "Поход" --allow-dangerous     # сделать и то, что стоит на уровне ask
max chats moderate "Поход" --since-time 2026-09-20T00:00
```

The check reads messages and joins since the previous check, or the past day initially. Messages are checked for blocked authors, invites, links, forwards and flooding; new members against blocklists and account-age rules. You, admins and `trusted` people are exempt.

Rules and consent determine the action. Everything is reported by default. Each result identifies the issue, person, rule, action and outcome: `reported`, flagged; `done`, completed; `planned`, awaiting a flag or approval, with a manual command; `forbidden`, disallowed by rules; `declined`, rejected by you; `refused`, blocked by profile safeguards or hourly limits; `skipped`, not reached yet.

The JSON response is `{ chatId, rows }`. A check reads up to 1,000 messages. The saved position is in the rules file; the old session position is migrated automatically. `--since-time` and `--dry-run` do not advance it. Personal-account MCP uses the same position and keeps `max_chats_check`.

A check performs at most 10 actions (`--max-actions`). Deletions count toward the hourly limit; remaining actions are deferred. The next check starts from the first unperformed message. Removed people may return through invite links because personal accounts cannot ban.

MAX has no join-request approval: groups are public or accessed by invitation.

## Scripts and agents

```sh
max chats list --json
```

`--json` produces **exactly one JSON value on stdout**, without spinners, checkmarks or warnings. This also happens automatically when stdout is not a terminal, including pipes and CI.

**Every list returns one object**, including bot lists. Unpaginated lists use `page` 1, `limit` equal to returned count and `hasMore` `false`:

```json
{ "items": [ … ], "page": 1, "limit": 20, "hasMore": true }
```

`--all` and `--offline` use **the same** object; `--all` sets `page: 1` and `hasMore: false`. The shape does not encode the data source; exit codes and diagnostics already do that.

`hasMore` means another page may exist, not a total count. It is exact for chats and contacts counted locally; if MAX did not provide all chats, the last page reports `hasMore: true`. ⚠ **For messages, it describes our copy, not the whole chat**: MAX does not report whether older messages exist. A full page is treated as evidence of more; after a short page, `max` requests one older message, because a short page can also occur in the middle of a conversation.

Terminals still display tables, with continuation hints **on stderr**. Stdout contains data in every mode.

**`--jsonl` outputs one object per line** without a wrapper, suitable for streaming and `jq`. Only stderr reports whether more pages exist.

```sh
max messages list -1000 --jsonl | jq 'select(.senderId == "111")'
```

## Conversation display

`max messages list` and `max messages search` show a feed instead of a table in terminals:

```text
── 3 января 2026 ──

10:05:12  Анна
          созвонимся в четверг?

10:09:03  вы
          ↳ Анна: созвонимся в четверг?
          Договорились.
          📎 photo
          edited 10:09:30
```

Times are local, with separators between days. `вы` identifies your messages; unnamed senders use their ID. `↳` marks a reply; `↪` a forward's original author. `📎` marks attachments, as clickable links in colored terminals or addresses without color.

`-v` adds message, sender and chat IDs and attachment URLs; `-vv` includes every known field. Show the version with `max -V`.

Errors go **to stderr** with stdout empty, so they cannot be mistaken for data:

```json
{"error":{"code":"authentication_error","message":"no session for profile \"default\" — run `max setup` in a local terminal; agents: read `max skill show`"}}
```

Branch on exit codes, not wording. See the full [Command reference](./commands.md); common codes are `4`, no session; `6`, not found; `9`, timeout; `14`, unknown outcome.

```sh
if ! max messages send 0 "текст" --json > /dev/null; then
  case $? in
    14) echo "могло уйти, повторять только с тем же --send-id" ;;
    4)  echo "нужен max setup" ;;
  esac
fi
```

## Local storage and live messages

See [Local storage](./archive.md) for saved data, live updates (`max serve`, `max watch`), history downloads and exports.

## What a command did

Only failed runs are recorded by default ([Diagnostics](./diagnostics.md)). Enable two separate diagnostic features:

```sh
max chats list --trace      # показать, ничего не сохраняя
max chats list --record       # сохранить, ничего не показывая
```

`--trace` prints a stderr line per request, working alongside `--json`:

```text
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  213ms  48.0 kB  25 chats  6 contacts
```

`--record` saves the same events in a run directory for 30 days:

```sh
max runs list                 # что делалось, новое сверху
max runs show <id>            # один запуск: чем кончился и куда ходил
max runs path <id>            # каталог, для jq и grep
```

**Records contain no conversation content.** Operations, opcodes, request numbers, IDs, byte counts and durations are recorded. Chat titles, names, message text, phone numbers and tokens never are, including truncated or hashed forms.

## Configuration

An optional `~/.config/max-cli/config.json` file:

```json
{
  "defaultProfile": "personal",
  "profiles": {
    "personal": { "limit": 50, "timeoutMs": 20000, "color": true, "record": false, "keepRunsForDays": 30 }
  }
}
```

Every setting resolves in this order: **flag → environment variable → file → built-in default**. In the file, profile settings override shared `defaults`, while `personal` and `bot` set values separately for personal and bot accounts (`max config set --personal …`, `--bot …`). All fields, including `defaultProfile` and `permissions`, are listed in [configuration.md](./configuration.md). A misspelled field produces an error naming it rather than silently choosing a default.

**This file cannot contain secrets:** its schema has no secret fields.

### Profile permissions

```sh
max config set permissions.messages readonly
max work config set permissions.messages.delete allow
max config set --defaults permissions.contacts readonly
```

`deny`, `readonly`, `ask` and `allow` apply in CLI and MCP. More specific keys take precedence: permitting deletion separately does not permit sending. At `ask`, the terminal prompts; JSON requires an explicit confirmation flag. `allow` does not prompt. This example leaves other resources and limits unchanged. Convert legacy `readOnly`, `allow` and `mcpTools` with `config migrate`; preview with `config migrate --dry-run`. See [configuration.md](./configuration.md).

## Next steps

- [Command reference](./commands.md) — generated from the program.
- [Configuration](./configuration.md) — the full settings file.
- [Installation](./installation.md) — install, update and storage locations.

`sends list` uses the configured `limit` when `--limit` is omitted. JSON includes `items`, `page`, `limit`, `hasMore`; `limit` is the selected page limit, not the number of rows. JSONL outputs one send-attempt record per line.

`account show --json` retains MAX's `id`, `name`, `phone` and `description`, adding `username: null` for the shared account format. Phone numbers remain masked; `--show-phone` explicitly reveals the entire number.

## A person's profile

`max contacts profile <человек>` shows what MAX reports about a person and how much they write in shared chats:

- name, username link and description;
- `registered` — account creation time reported by MAX itself (`source: max`);
- `hasPhoto` — whether they have their own photo;
- for each shared chat, the number of their messages in the local copy, and the first and last message.
  `complete: false` means the chat is not fully stored, so the count is a lower bound.

The command makes one additional MAX request beyond `contacts show` and does not notify the person. MAX does not provide labels such as “bot” or “scammer” for personal accounts, so `flags` is empty. With `--offline`, the answer comes from the local copy.

## Does a person look like a bot?

`max contacts check <человек>` assesses one person for signs of a bot, fake account or spammer. Each reason includes its source:

- profile: missing photo, username or description, unusual name;
- stored messages: no messages, a link as the first message, the same text in several chats.

Public spam lists (Combot CAS and lols.bot) cover Telegram accounts only. They are not queried for MAX, and the response explains this; the person's ID is not sent anywhere. `--offline` reads stored data only. The score is a hint, not a conclusion.

## A person's local context

`max contacts context <человек>` reads stored messages and shared chats for linked identities, without connecting or marking anything as read. `complete: false` and `notRead` indicate gaps in the archive. `max contacts link <человек> telegram:<id>` links MAX and Telegram identities; `contacts unlink` removes the link. This writes to the local contact graph and does not change the MAX address book.

`max contacts context <человек> --chat <чат> --chat <чат>` returns the person's latest messages in each named chat, oldest first, with only time and text: a compact input for an AI agent to summarize. `--limit` applies to each chat (20 by default); `-v` adds IDs, message links, sender and reply reference; `-vv` includes everything. `--refresh` first reads the chat from MAX: it takes the person's messages from the latest chat page, because MAX cannot search by sender. Nothing is marked as read.

`contacts context` returns message text and therefore follows `messages` permissions; local identity links follow `contacts` permissions.

## Statistics charts

`max stats charts` returns a chart description in JSON. `--output activity.svg` also saves a dark-theme SVG. Pass a chat found through `max chats list` as the command argument. `--chart-kind messages` shows messages, `active` shows active authors, and `membership` shows joins and departures. `--by day` or `week` sets the period; weeks begin on Monday. `--timezone` applies to calendar dates.

The chat name `synthetic-group` in this example is fictional:

```sh
max stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

JSON contains `chart` and, when an image is saved, `chartFile` with its path and size. SVG is written only to a new file, without overwriting. A missing date remains a gap; incomplete data is marked in both description and image. `membership` requires online chat events and is unavailable with `--offline`. MCP `max_stats_charts` returns JSON from the local store, without connecting or writing files; joins and departures are unavailable there. Reading follows the `messages` permission. PNG, `--jsonl` and an image on stdout are not yet available.

![Chart using fictional data](https://raw.githubusercontent.com/leemour/max-cli/v0.29.0/docs/images/stats-charts.png)
