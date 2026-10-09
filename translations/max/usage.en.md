---
title: "Personal account guide"
---

This page covers your personal account. Bots using the official Bot API have a separate [Bot guide](./bot.md).

Each command performs one task, prints its result and exits. Only [`max serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) keeps a MAX connection open. The first command needing MAX starts it in the background; it stops after 15 minutes without use.

```sh
max [профиль] [опции] <ресурс> <действие> [аргументы]
```

The [Command reference](./commands.md) lists every command and option, generated from the program itself.

## Read a chat with your agent

Once your account is connected, ask for a short recap. This task reads messages; it sends nothing.

**Your request:**

> Summarise the five latest messages in Книжный клуб. Show decisions and open questions. Send nothing.

**Command:**

```sh
max messages list "Книжный клуб" --limit 5 --json
```

**Example agent answer:**

> **Decision:** the next discussion is Thursday at 18:00.
>
> **Still open:** which meeting place to use.
>
> I can show the messages behind this recap. Nothing was sent.

The recap below is fictional. Ask the agent to open the source messages before relying on its interpretation. Setup, message actions and permissions are explained in the sections below.

## Getting started

```sh
max setup --agent codex  # QR-вход и навык агента
```

```sh
max chats list           # ваши чаты
```

Setup may take about five minutes. The command checks up to five chats without starting a background service. History is downloaded separately after you choose the chat and amount. Before sign-in, the agent reads `max skill show`, which is available without a session. `max skill show link-conversations` prints the shared skill for linking conversations from the archive; no additional sign-in is needed.

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
```

```sh
max account show --show-phone   # номер целиком
```

Sign out of MAX and forget the session on this computer:

```sh
max session end
```

`session end` ends the session on the MAX server (`revokedOnServer: true`). If the token was copied from a web.max.ru tab, that tab is also signed out.

## Profiles use the first word

Multiple accounts can coexist. Supply a profile as the first word, not a flag:

```sh
max chats list              # профиль default
```

```sh
max personal chats list     # профиль personal
```

**The first word is a profile unless it matches a command name.** A profile named `chats` is therefore rejected during creation, with an explanation.

For a whole shell session, use a variable:

```sh
export MAX_PROFILE=personal
max chats list
```

Each profile has its own token and state. The local message store is shared, with data separated by account.

`max account list` shows every profile on this computer and its account without contacting MAX.

## Reading

```sh
max chats list                      # все чаты
```

```sh
max chats list --limit 5            # первые пять
```

```sh
max chats list --unread             # только чаты с непрочитанным
```

```sh
max chats show "Иван Петров"        # один чат: вид, непрочитанное, последнее сообщение, участники
```

```sh
max contacts list                   # люди, с кем есть личный чат
```

```sh
max contacts show @ivan             # один человек и общие с ним чаты
```

```sh
max messages list 0                 # сообщения чата по id
```

```sh
max messages list "Иван Петров"     # или по имени чата
```

```sh
max messages list 0 --limit 50
```

Address a chat by **ID or part of its title**. If two chats match, the command lists candidates instead of guessing: sending to the wrong conversation is irreversible.

`contacts show` also accepts **ID, `@username` or part of a name**, without guessing between matches. It finds anyone known to local storage, including group members not considered contacts. The response includes name, `@username` and shared chats, newest first. Finding someone never sends them a message.

`chats show` returns one object: fields from the `chats list` row plus `members`, everyone except you. For a channel, `members` is `null`: MAX may return four subscribers out of thousands, which would be misleading as a full member list.

Unread messages across chats, or messages since your last check:

```sh
max inbox                               # непрочитанное — по счётчику MAX, у каждого сообщения чат
```

```sh
max inbox --new                         # что пришло с прошлой проверки, каждое сообщение один раз
```

```sh
max inbox --new --jsonl                 # то же для скрипта: одно сообщение на строку
```

```sh
max inbox --since-time 2026-09-24T09:00 # разовый взгляд с этого времени
```

```sh
max inbox --all                         # и чаты без звука, и архив
```

**`max inbox` never marks messages read**, so it returns the same unread data until you read it in the app. For scheduled runs, use `--new`: its saved position advances only after output is printed. The first `--new` covers 24 hours. `--since-time` does not move this position. Your own messages are excluded. If a chat exceeds `--limit` (default 20), the newest messages are shown with a stderr command for the rest. A run reads at most 20 chats; others appear in stderr and `skipped`.

Muted and archived chats are skipped unless you were mentioned or replied to; stderr reports the skipped count. `--all` includes them.

Read one message and its context; both chat and message ID are required (these IDs are examples):

```sh
max messages show -1000 100000000000000001
```

```sh
max messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

The selected message is marked `◀` in the feed and `"anchor": true` in JSON. A missing or wrong-chat message returns not found, not a neighboring message. `--before-id` with `messages list` works for any ID because its timestamp is encoded in it. You can also use a `msg:…` locator from `search messages`, without a separate message ID.

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

See the [voice recognition guide](./audio-recognition.md) for model selection, commands and limits.

Voice messages are transcribed **on your computer**: recordings are not sent anywhere. Download the recognition model once with a separate command:

```sh
max models audio list                # какие модели есть, какие скачаны, какая по умолчанию (*)
```

```sh
max models audio download gigaam-v3  # 233 МБ, один раз
```

```sh
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

Transcribe the voice messages in chat or inbox results in one run:

```sh
max messages list "Иван Петров" --transcribe
```

```sh
max inbox --transcribe
```

`--transcribe` processes only displayed voice messages that have no text yet; `--model` selects a model for one run. First `max` downloads all required recordings, then closes the connection before running the model. Text appears below the voice message with a 🎤 icon, or in `transcript` with `--json`. Failed transcriptions are listed in `unheard`, with a reason in stderr; messages are still displayed. If the model is not downloaded, the command tells you how to download it but does not do so itself. Models are stored in `~/.cache/cli-common/models/audio`, one shared copy for `max` and `tg`.

Existing transcripts appear without the flag. With `--offline`, new audio cannot be downloaded or transcribed.

**Reading marks nothing as read.** The protocol separates retrieving history from marking it read. The latter is not sent unless requested, and a test verifies this. You can explicitly mark a chat as read; the other person will see it:

```sh
max chats mark-read "Иван Петров"                  # до последнего сообщения
```

```sh
max chats mark-read "Иван Петров" --until 100000000000000001   # до этого сообщения включительно
```

```sh
max messages list "Иван Петров" --mark-read        # прочитать и отметить показанное
```

Read receipts pass send checks: read-only profiles and recipient lists may reject them, but they do not count toward the hourly send limit. They refuse with `--offline`.

### Reviewing commitments

```sh
max review                                   # всё за последние 3 дня
```

```sh
max review --since-time 2026-09-23T09:00     # с конца прошлого обзора
```

```sh
max review --since-time 2026-09-23T09:00 --transcribe --json
```

This returns all messages, yours and others', in chats active since `--since-time`. Use it to identify promises, things you await and unclear points; interpreting them is your or your agent's job. Nothing is marked read. At most 300 messages are included per chat; exceeding this marks the review incomplete. Muted and archived chats are skipped unless you were mentioned or replied to, as in `inbox`; `--all` includes them.

The final stderr line shows the interval covered. Start the next review from that `--since-time` boundary to avoid gaps. If coverage is incomplete because of too many chats, truncated history or untranscribed audio, the command says so; avoid advancing the boundary.

`--transcribe` processes audio lacking text, taking up to a minute per five minutes of speech, and only with a downloaded model ([Voice transcription](#голосовые-в-текст)). Without it, saved transcripts appear and remaining audio is listed in `unheard`.

#### Unanswered questions

```sh
max review --unanswered                      # вопросы, на которые сутки никто не ответил
```

```sh
max review --chat "Соседи" --unanswered 4h    # в одной группе, без ответа 4 часа
```

`--unanswered [длительность]` keeps questions waiting for your answer or a group administrator's. A question contains “?” in its text or transcript, or replies to your message or an administrator's. Stored transcripts always participate; `--transcribe` recognizes new voices before question selection. An unrecognized recording leaves the review incomplete. A question is answered if you or an administrator replied to it or spoke next after its author. Questions younger than the specified duration, such as `4h` or `1d` (default `24h`), are omitted because there has not been time to answer.

MAX provides admin information at login only for recently active chats. If unavailable, the command reports it and counts only your answers. Replies after the review's end are not visible. `--chat` restricts any review to one chat, with or without `--unanswered`.

### Pagination

`chats list`, `contacts list` and `chats members list` have three pagination options. `messages list`, `inbox`, `sends list` and `runs list` have only `--limit`; `chats events` reads events from a specified time without pagination:

```sh
max contacts list --limit 5             # по пять в странице
```

```sh
max contacts list --limit 5 --page 2    # шестой по десятый
```

```sh
max contacts list --all                 # всё, без страниц
```

```sh
max contacts list --order name          # по алфавиту вместо «кто писал последним»
```

Combining `--all` and `--page` is rejected. `--limit` has a configuration setting; `--page` and `--all` do not, because a saved page number is useful once and disruptive afterward.

⚠ **Page numbers on a live list can repeat or skip a row.** The newest items come first, so a message arriving between page one and page two shifts an item across the boundary. This is how numbered pagination works; the limitation is stated here rather than avoided.

**Message history uses `--before-id`, not page numbers**, giving a precise time-based position:

```sh
max messages list 0 --limit 20
```

```sh
max messages list 0 --before-id 116762160362694583        # id самой старой строки, которую вы видите
```

```sh
max messages list 0 --before-time 2026-09-20T01:00:00Z    # работает и когда того сообщения уже нет
```

```sh
max messages list 0 --after-id 116762160362694583         # что пришло после этого сообщения
```

```sh
max messages list 0 --after-time 2026-09-20T01:00:00Z     # или после этого времени
```

`--after-id` and `--after-time` read forwards: up to `--limit` messages **after** the position, oldest first, with a stderr hint for the next page: `--after-id <id последней
строки>`. Only one of the four position options is allowed; they describe alternative starting points, not a bounded interval.

The anchor message itself is excluded with both `--before-id` and `--after-id`: MAX returns it, but this program discards it so the next page does not start with the last row of the previous one. With `--offline`, only `--before-id` works, and only with an ID present in the local copy.

Times accept ISO 8601 or relative values: `30m`, `2h`, `1d`; `--after-time 7d` covers the past week. If an ID is missing locally, as a deleted message may be, the command explains the alternative method.

### Finding a chat before sending

```sh
max chats list --search иван             # чаты, в названии которых есть «иван»
```

```sh
max chats list --search work --kind group # только группы
```

```sh
max chats list --unread --kind dialog    # личные чаты, где есть непрочитанное
```

```sh
max contacts list --search петров        # люди по имени или @username
```

```sh
max search all "договор"                 # сообщения, почта и заметки на этом компьютере
```

```sh
max search messages "договор"            # по тексту сообщений, которые уже прочитаны
```

```sh
max search messages "договор" --chat 42  # в одном чате
```

Search text must contain **at least three characters**: two letters match too much of the list to be useful. `chats list` with `--search`, `--kind` or `--unread` checks all chats MAX supplied at sign-in and reports `partial` if MAX did not supply all of them. With `--offline`, it checks all saved chats.

Once you find the chat, use its **ID** from the output; it does not change:

```sh
max messages list 42 --limit 20
```

```sh
max messages send 42 "текст"
```

A title fragment is also accepted, including in `max search messages --chat`. Chat names are resolved from saved chats, and a search in one chat also queries the MAX server (`--backend archive` uses only the archive). Search defaults to strict Lucene: a word matches other word forms, a prefix requires an explicit pattern such as `квартир*`, and `exact:квартира` matches only the exact form. The older search with corrections is available through `--language legacy`; `--regex` is a separate case-insensitive regular-expression mode. See [search](./search.md).

### How many messages matched

`max stats messages show` counts local archive messages without connecting to MAX. Without a query, it counts all saved messages for the current account; with a query, it counts strict Lucene matches as in `search messages`. Each message is counted once.

```sh
max stats messages show "договор" --by chat --json
```

```sh
max stats messages show --by sender --chat "Работа" --limit 10 --json
```

```sh
max stats messages show --by day --timezone Europe/Madrid --json
```

```sh
max stats messages show --by hour --timezone UTC --jsonl
```

`--by` groups by chat, sender, calendar day or hour. `--limit` limits the rows, and `total` is the number of all matching messages. In an incomplete archive, the numbers are a lower bound: check `coverage` and `completeness` before you treat zero matches as proof. To include all saved MAX accounts, add `--source max` explicitly; without it, other profiles are not included. JSON contains `by`, `items`, `total`, `page`, `limit`, `hasMore`, `query`, `coverage` and `completeness`; JSONL prints the `items` rows.

### Who counts as a contact

`max contacts list` shows **people with whom you have a direct chat**, newest conversation first. Group members are also saved with names and shared chats, but do not appear in this contact list.

MAX has no endpoint returning an address book, so only people from your chats are available. Contacts stay current because commands log in and each login requests **only changes since the previous one**.

```sh
max contacts sync     # забыть, где остановились, и забрать список заново
```

This is a repair action for inconsistent local data or a schema update that cleared it, not the normal workflow. Its response contains only counts, no names, phones or descriptions.

### Your own names and notes for people

```sh
max contacts alias set "Борис Тестов" Боря          # своё имя для человека, только на этом компьютере
```

```sh
max contacts alias rm "Борис Тестов"
```

```sh
max contacts notes add "Борис Тестов" --file note.txt   # или текст из stdin
```

```sh
max contacts notes list "Борис Тестов"
```

```sh
max contacts notes edit "Борис Тестов" <id> --revision 1 --file note.txt
```

```sh
max contacts notes remove "Борис Тестов" <id>
```

```sh
max contacts show "Борис Тестов" --with-notes
```

```sh
max contacts list --search-notes квартира           # люди, в чьих заметках есть это слово
```

Notes about the same person are shared across profiles where that person is visible; aliases belong to the selected account.

Custom names and notes stay in the local copy and are not sent to MAX. `contacts rename` changes a name in the MAX address book; that is a separate operation. Commands can find a person by your custom name unless it matches another person’s name; in that case use an ID. `--revision` protects against editing an outdated note.

## Sending

```sh
max messages send 0 "текст"
```

```sh
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
```

```sh
max messages send 0 "напоминание" --at-time 2h                # или через 30m, 2h, 1d
```

```sh
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
```

```sh
max reactions add 0 100000000000000001 👍                 # реакция; прежняя ваша заменяется
```

Other people see reactions, just like replies. Remove yours with `max reactions remove 0 100000000000000001`.

Reading shows reactions beneath a message, such as `👍 3  🔥 1  (you: 🔥)`. JSON uses `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` means not queried, with `--offline`, or unavailable from MAX; stderr explains the reason.

### Editing, forwarding and pinning

```sh
max messages edit 0 100000000000000001 "новый текст"          # только своё; вложения остаются
```

```sh
max messages forward 0 100000000000000001 --to "Коллеги"      # переслать одно сообщение в другой чат
```

```sh
max messages pin 0 100000000000000001                         # закрепить, без уведомления участникам
```

```sh
max messages pin 0 100000000000000001 --notify                # закрепить и уведомить
```

```sh
max messages unpin 0 100000000000000001                       # открепить; в чате MAX закреплено одно сообщение
```

The other person sees an edit and may have already read the original text. MAX allows editing your own messages for 7 days. Forwarded messages cannot be edited. A forward is a new message: it passes the same checks as a send and counts toward `sendsPerHour`. Edits and pins with `--notify` also count; silent pins pass the checks but do not count toward the limit. If a forward returns `outcome_unknown`, retry only with the `--send-id` from the error so MAX keeps one copy. A retry without it creates a second copy.

Pinning is available only in groups and channels. MAX does not pin messages in direct chats or “Favorites”, and the command rejects these immediately.

### Deleting

```sh
max messages delete 0 100000000000000001 --allow-dangerous                   # только у вас
```

```sh
max messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # несколько, до 10
```

```sh
max messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # у всех в чате
```

Deletion cannot be undone, so `messages.delete` defaults to `ask`: confirm in the terminal, or pass `--allow-dangerous` in JSON mode. Explicit `allow` for `permissions.messages.delete` permits deletion without that question; `readonly` and `deny` forbid it regardless of the flag. By default, the message disappears only for you and remains for the other person. `--for-everyone` removes it for everyone, and the other person cannot restore it.

Deletion passes send checks. **Each deleted message counts toward `sendsPerHour`** like one send, with at most 10 per run. Large deletion bursts resemble automation and can trigger MAX restrictions. Deleted data is removed from local cache and search too.

### Polls

```sh
max polls create 0 "Обед?" "Да" "Нет" --multiple     # опрос отдельным сообщением
```

```sh
max polls show 0 100000000000000001                  # варианты с id и сколько за каждый
```

```sh
max polls vote 0 100000000000000001 1                # голос за вариант с id 1
```

```sh
max polls vote 0 100000000000000001 --retract        # снять голос, если опрос это разрешает
```

```sh
max polls close 0 100000000000000001                 # закрыть свой опрос; открыть снова нельзя
```

When reading, a poll appears below the message: its question, choices with IDs in `[скобках]` (used by `polls vote`), vote counts and a ✓ on your choice. In JSON it is the attachment’s `poll` field:
`{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. A poll newer than the known version is shown as one line without choices. `polls show` and `polls vote|close` responses use the shared tg shape: `{chatId, messageId, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}`; for `vote` and `close`, it appears in `poll` beside `operationId`. With `--revote`, a poll created by `polls create` allows changing your vote.

web.max.ru does not display polls; it shows “Update MAX…” instead. People reading a chat in the browser cannot see your poll; they need the phone or desktop application.

Other members can see your vote unless the poll is anonymous. The command rejects invalid votes locally as the web client does: a closed poll, multiple choices in a single-choice poll, a second vote when revoting is forbidden, or a nonexistent choice ID. Voting, closing and creating polls pass the same checks as sending: a vote is treated like a reaction, closing like an edit, and a new poll like a message. New polls and closing count toward `sendsPerHour`; votes, like reactions, do not. Votes are not retried automatically. For agents, `max_write` (`command: "polls vote"`) and `max_write` (`command: "polls create"`) in `max mcp` require `permissions`; `max_write` (`command: "polls close"`) requires the write permission `polls.close` ([mcp.md](./mcp.md)).

### Bot buttons

```sh
max messages show <бот> 100000000000000001            # кнопки под сообщением: [1 Да] [2 Нет]
```

```sh
max messages press <бот> 100000000000000001 2         # нажать вторую кнопку
```

```sh
max messages press <бот> 100000000000000001 "Да"      # или по её тексту
```

The bot sees who pressed. Only ordinary callback buttons are pressed. For other kinds, the command explains the next action: a link's address appears under the message; use `messages send` for a text button and `chats app` for a mini app.

```sh
max chats start <бот>                                 # запустить бота, как кнопка «Начать»
```

```sh
max chats start <бот> --payload ref1                  # с параметром, как ссылка max.ru/<бот>?start=ref1
```

```sh
max chats start https://max.ru/<бот>?start=ref1       # по ссылке — и бота, которому вы ещё не писали
```

```sh
max chats app <бот>                                   # адрес мини-приложения бота
```

`chats start` accepts a bot chat or bot link, including a bot missing from your chat list; its chat will appear. Links to people are refused. Starting is a message from you and uses the same send checks. `chats app` prints an address that signs in as you: keep it private. Anyone opening it enters as you. The address is not written to logs or files by `max`.

After a lost start/press reply, `outcome_unknown` (exit 14) means the bot may already have acted. Check its reply before repeating; there is no automatic retry. Contact and location buttons are never pressed. Presses use reaction checks and do not count toward `sendsPerHour`. Buttons are visible in messages read from MAX, and are absent from the local copy.

### Contacts, profile and folders

```sh
max contacts lookup                         # спросит номер; или: echo "+7…" | max contacts lookup
```

```sh
max contacts add 20000002                   # id из lookup, или часть известного имени
```

```sh
max contacts remove 20000002
```

```sh
max contacts rename 20000002 "Соседка" "Анна" # своё имя для человека; он его не видит
```

```sh
max contacts block 20000002                 # больше не сможет вам писать
```

```sh
max contacts unblock 20000002
```

```sh
max contacts profile 20000002               # профиль, дата создания, его сообщения по общим чатам
```

```sh
max contacts check 20000002                 # похож ли на бота; подробнее — people.md
```

```sh
max contacts import книжка.csv              # строка: номер, запятая, табуляция или точка с запятой, имя
```

```sh
max account update --description "о себе"   # имя остаётся прежним
```

```sh
max account update --photo портрет.png      # новое фото профиля
```

```sh
max account sessions list                   # где ещё выполнен вход
```

```sh
max account privacy show                    # кто находит по номеру, звонит, добавляет в чаты
```

```sh
max stickers list                           # наборы стикеров; --set <id> — стикеры набора с их id
```

```sh
max messages send 0 --sticker 51            # стикер, один, без текста
```

```sh
max account privacy set --calls contacts    # звонить могут только контакты; остальное не меняется
```

```sh
max account privacy set --hide-online on    # скрыть «в сети» и «был недавно»
```

```sh
max chats mute "Поход"                      # без уведомлений из чата, насовсем
```

```sh
max chats mute "Поход" --until 8h           # на 8 часов; или до даты: --until 2026-10-09T09:00
```

```sh
max chats unmute "Поход"
```

```sh
max chats clear "Поход" --allow-dangerous   # удалить все сообщения у себя; у остальных останутся
```

```sh
max chats delete "Поход" --allow-dangerous  # удалить чат у себя; у остальных он останется
```

```sh
max calls list                              # звонки, новые сверху
```

```sh
max account sessions end --others --yes     # выйти везде, кроме этого сеанса — и на телефоне
```

```sh
max chats folders list
```

```sh
max chats folders create "Работа" --chat -1000 --chat "Проект"
```

```sh
max chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
```

```sh
max chats folders delete "Офис"             # чаты остаются
```

```sh
max chats folders order "Офис" "Семья"      # после «Все чаты»: эти две, затем остальные
```

Do not put phone numbers on the command line: `ps` and shell history expose it. An added person without a direct conversation does not appear in `contacts list`, which lists only people with conversations; use `contacts show <id>`. You can block someone who is not a contact. MAX does not provide short usernames (`@имя`) for personal accounts: all are rejected as “This name is unavailable”. Folder names are limited to 20 characters; MAX rejects longer names, and `max` rejects them locally without sending anything. `import` sends other people’s phone numbers to MAX.

Contact changes return `operationId` in JSON. `add` and `rename` also return `person` with `id`, `name`, `username`; `remove`, `block` and `unblock` return `personId`. `import` returns `sent` and `recognised`: the first counts file rows, including duplicates, while the second contains person records returned by MAX. If MAX returned only phone numbers without records, `recognised` is empty; phone numbers are not included in the response.

`chats folders create` and `update` return `{operationId, folder}` in JSON; `delete` returns `{operationId, folderId}`. `list` returns a page of folders. `update` requires at least one change: `--title`, `--add` or `--remove`. Identify a folder by ID or exact name; if names repeat, use its ID from `list`.

`account update` returns `{operationId, account}` in JSON. The record contains `id`, `name`, `username` (`null` for MAX) and a masked `phone`. Read the description after a change with `account show`. Profile photos must be JPG, JPEG, PNG or WebP. `account sessions end --others --yes` returns `{operationId, sessions}`, the sessions that remain. If ending sessions succeeds but saving the new token or reading remaining sessions fails, the command reports an error while the journal records the completed action.

### Chat media

```sh
max chats media "Поход"                           # фото, видео, файлы, аудио и ссылки, как галерея в MAX
```

```sh
max chats media "Поход" --type photo,video        # только фото и видео
```

```sh
max chats media "Поход" --before-id <id>          # то, что старше этого сообщения
```

The list comes from the MAX server, including media not downloaded to this computer. Reading marks nothing as read.

### Photos, video, files and voice messages

```sh
max messages send 0 "отчёт" --file отчёт.pdf
```

```sh
max messages send 0 "с дачи" --file ролик.mp4          # видео, которое смотрят прямо в чате
```

```sh
max messages send 0 --file ролик.mp4 --as-file       # то же видео файлом для скачивания
```

```sh
max messages send 0 --photo снимок.png                # фото
```

```sh
max messages send 0 --voice заметка.ogg              # голосовое сообщение
```

With `--file`, `.jpg .jpeg .png .webp .gif` are sent as photos, `.mp4 .mov .webm .mkv` as videos, and everything else as files. With `--as-file`, the `--file` attachment is sent as a file, including videos. `--photo` accepts only `.jpg .png .webp`. A message can contain one `--file` attachment and one `--photo` attachment; **videos and files must be sent alone**, and the command rejects invalid combinations before uploading. Text is optional. If upload fails, nothing is sent. `max` does not currently send multiple files in one message. `--no-preview` is unavailable in MAX: its own client cannot do this, and the command rejects it.

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

**Channel join requests.** Approval applies to channels, not closed groups. `chats join` returns `requested: true`; the channel appears after an admin accepts. `requests list` shows pending people without request times (`requestedAt: null`). Bulk actions and `--link` filters are unsupported. `requests accept` consumes one hourly allowance per person; declining does not. See the group-admin guide above for channel request limits.

```sh
max chats inspect https://max.ru/join/…          # что за ссылкой; не вступает
```

```sh
max chats join https://max.ru/join/…             # вступить; канал с одобрением ответит requested: true
```

```sh
max chats leave "Семья"                          # выйти
```

```sh
max chats create "Поход" "Аня" 20000002          # создать группу с людьми (имя или id)
```

```sh
max chats create "Новости" --channel            # закрытый канал; люди входят по ссылке-приглашению
```

```sh
max chats members list "Поход" --all             # все участники: когда заведён аккаунт, когда был в сети
```

```sh
max chats members add "Поход" "Боря"             # без старых сообщений; с ними — --history
```

```sh
max chats members remove "Поход" "Боря"
```

```sh
max chats admins add "Поход" "Аня" --can members,pin
```

```sh
max chats admins remove "Поход" "Аня"              # снять права; участником остаётся
```

```sh
max chats update "Поход" --title "Поход-2026" --description "в июле"
```

```sh
max chats update "Поход" --photo обложка.jpg    # новое фото группы
```

```sh
max chats show "Поход"                           # настройки группы — в поле settings
```

```sh
max chats update "Поход" --all-can-pin off       # поменять одну
```

```sh
max chats link show "Поход"                      # ссылка-приглашение, если вам её видно
```

```sh
max chats link reset "Поход"                     # новая ссылка; старая перестаёт работать
```

```sh
max chats requests list "Канал"                  # кто просится в канал с одобрением; видят только админы
```

```sh
max chats requests accept "Канал" 20000002        # впустить; decline — отказать
```

```sh
max chats events "Поход"                         # кто вступил, вышел, кого добавили и удалили — за 7 дней
```

```sh
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
```

```sh
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
```

```sh
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отметить
```

```sh
max chats rules set "Поход" trusted 30000003,30000004 # этих людей правила не трогают
```

```sh
max chats rules set "Поход" consent.delete ask        # перед удалением — спрашивать
```

```sh
max chats rules unset "Поход" consent.delete          # вернуть значение по умолчанию
```

Rules live on this computer beside profile settings; the response names the file. The first group `set` writes every rule and default, showing all configurable fields. You can edit the file manually; `rules show` validates it.

By default, rules only report (`report`). Beyond that, a rule can `delete` a message or `remove` a person. Each action has its own consent level (`consent.delete`, `consent.remove`): `deny` means never, `readonly` means report only, `ask` means ask first (the default) and `allow` means act without asking. `--allow-dangerous` authorizes `ask` actions for this run. Old `forbid`, `flag` and `confirm` values in files are read as `deny`, `ask` and `ask`.

#### Checking a group

```sh
max chats moderate "Поход"                       # что нового нарушает правила; делает то, что разрешено
```

```sh
max chats moderate "Поход" --dry-run             # только показать
```

```sh
max chats moderate "Поход" --allow-dangerous     # сделать и то, что стоит на уровне ask
```

```sh
max chats moderate "Поход" --since-time 2026-09-20T00:00
```

The check reads messages and joins since the previous check, or the past day initially. Messages are checked for blocked authors, invites, links, forwards and flooding; new members against blocklists and account-age rules. You, admins and `trusted` people are exempt.

Rules and consent determine the action. Everything is reported by default. Each result identifies the issue, person, rule, action and outcome: `reported`, flagged; `done`, completed; `planned`, awaiting a flag or approval, with a manual command; `forbidden`, disallowed by rules; `declined`, rejected by you; `refused`, blocked by profile safeguards or hourly limits; `skipped`, not reached yet.

In JSON, the response is `{ chatId, rows }`. Each check reads up to 1000 messages. Its saved position is in the rules file; an older position from the session is migrated automatically. `--since-time` and `--dry-run` do not advance it. Personal-account MCP uses the same position when saving `max_write` (`command: "chats check"`).

A check performs at most 10 actions (`--max-actions`). Deletions count toward the hourly limit; remaining actions are deferred. The next check starts from the first unperformed message. Removed people may return through invite links because personal accounts cannot ban.

Groups are public or invite-only; approval queues apply to channels.

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

`max messages list` and `max search messages` show a feed instead of a table in terminals:

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

See [archive.md](./archive.md) for what `max` stores locally, how to keep it current (`max serve`, `max watch`), how to download chat history and how to export it to a file.

## What a command did

Only failed runs are recorded by default ([Diagnostics](./diagnostics.md)). Enable two separate diagnostic features:

```sh
max chats list --trace      # показать, ничего не сохраняя
```

```sh
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
```

```sh
max runs show <id>            # один запуск: чем кончился и куда ходил
```

```sh
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
```

```sh
max work config set permissions.messages.delete allow
```

```sh
max config set --defaults permissions.contacts readonly
```

`deny`, `readonly`, `ask` and `allow` apply in CLI and MCP. More specific keys take precedence: permitting deletion separately does not permit sending. At `ask`, the terminal prompts; JSON requires an explicit confirmation flag. `allow` does not prompt. This example leaves other resources and limits unchanged. Convert legacy `readOnly`, `allow` and `mcpTools` with `config migrate`; preview with `config migrate --dry-run`. See [configuration.md](./configuration.md).

## Next steps

- [Command reference](./commands.md) — generated from the program.
- [Configuration](./configuration.md) — the full settings file.
- [Installation](./installation.md) — install, update and storage locations.

`sends list` uses the configured `limit` when `--limit` is omitted. JSON includes `items`, `page`, `limit`, `hasMore`; `limit` is the selected page limit, not the number of rows. JSONL outputs one send-attempt record per line.

`account show --json` retains MAX's `id`, `name`, `phone` and `description`, adding `username: null` for the shared account format. Phone numbers remain masked; `--show-phone` explicitly reveals the entire number.

## People

`contacts profile`, `contacts context`, `contacts check` and `contacts link` show what MAX and the local copy know about one person, their recent messages by chat and whether they look like a bot: [people.md](./people.md).

## Statistics charts

`max stats charts` returns a chart description in JSON. `--output activity.svg` also saves a dark-theme SVG; `--output activity.png` saves a PNG. Pass a chat found with `max chats list` as the command argument. `--chart-kind messages` shows messages, `active` shows active authors, and `membership` shows joins and leaves. `--by day` or `week` sets the period; weeks start on Monday. `--timezone` applies to calendar dates.

The chat name `synthetic-group` in this example is fictional:

```sh
max stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

JSON contains `chart`; when saving an image, it also contains `chartFile` with its path and size. Images are written only to new files, without overwriting. Missing dates remain gaps; incomplete data is marked in the description and image. `membership` requires online chat events and is unavailable with `--offline`. MCP `max_read` (`command: "stats charts"`) returns JSON from local storage without connecting or writing files; `format: "png"` adds a PNG image and JSON with `chart` and the size of `image`. Joins and leaves are unavailable there. Reading follows `messages` permission. `--jsonl` and images in stdout are unavailable.

![Chart using fictional data](https://raw.githubusercontent.com/leemour/max-cli/0ea6d48eb20b72bda128e37f931ecd4de3de10f0/docs/images/stats-charts.png)

Message and author rankings: [metrics, scores and evidence](./rankings.md).
