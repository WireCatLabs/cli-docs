---
title: "Personal account guide"
---

<a id="ответ-и-реакция" />
<a id="правка-пересылка-закрепление" />
<a id="опросы" />
<a id="локальная-копия-и-новые-сообщения" />
<a id="настройки" />
<a id="человек" />

`max` allows you or your AI agent to read and write to your personal MAX account from a terminal. This page is an overview: from login to reading, sending and groups, in the order you need it. Open it when you start working with `max`, or when you want to know what's possible before asking an agent. The bot, which works through the official Bot API, is described on the [bot](./bot.md) page.

You will learn to identify a chat, read and search without marking messages read, send safely, and return results a script can parse. The [command reference](./commands.md) is generated from the program; this guide explains how commands fit together.

Terms used below:

- **Profile** — one MAX account configured here with its own login and settings, chosen as the command's first word ([profiles](#профиль--первое-слово)).
- **Chat** — a direct chat, group, channel or Favorites.
- **Local archive** — saved messages read by `max` on this computer ([local archive](./archive.md)).
- **Send protections** — permissions, allowed recipients and hourly limits ([security](./security.md)).
- **`max serve`** — the background process sharing one MAX connection across a profile's commands.

Each command performs one task, prints its result and exits. Only [`max serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) keeps a MAX connection open. The first command needing MAX starts it in the background; it stops after 15 minutes without use.

```sh
max [профиль] [опции] <ресурс> <действие> [аргументы]
```

## What you can do

| Area | What you can do | Start with |
| --- | --- | --- |
| Reading | Chats, messages, individual messages and context | `max chats list`, `max messages list <чат>` |
| Replies and commitments | Unread messages, promises and open matters | `max inbox`, `max review` |
| Voice | Transcribe locally | `max messages transcribe` |
| Files | Download attachments or chat files; browse media | `max messages download`, `max chats media` |
| People | Contacts, aliases, notes, profiles and bot signals | `max contacts list`, `max contacts profile` |
| Search | Messages, files, dates, people and discussions by meaning | `max search messages`, `max search conversations` |
| Sending | Text, files, voice, replies and scheduled messages | `max messages send` |
| Changes | Edit, forward, pin, delete, react, vote and mark read | `max messages edit`, `max reactions add` |
| Bots | Press buttons, start a bot and open a mini app | `max messages press`, `max chats start` |
| Organisation | Folders, notifications and privacy | `max chats folders list`, `max chats mute` |
| Groups | Members, invite links, join requests, admins and rules | `max chats members list`, `max chats rules show` |
| Monitoring | New messages and a current local archive | `max watch`, `max serve` |
| Checks | Command activity and profile permissions | `max runs list`, `max config show` |

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

The above result is fictitious. Ask to see the original messages before relying on the agent's interpretation. Setup, message actions, and permissions are explained in the sections below.

## Getting started

```sh
max setup --agent codex  # QR-вход и навык агента
```

```sh
max chats list           # ваши чаты
```

Setup may take about five minutes. The command checks up to five chats without starting a background service. History is downloaded separately after you choose the chat and amount. Before sign-in, the agent reads `max skill show`, which is available without a session. `max skill show link-conversations` prints the shared skill for linking conversations from the archive; no additional sign-in is needed.

## Logging in

The first run is `max setup`. For explicit re-login - `max session start qr`: a QR code will appear in the terminal, you will scan it with the MAX application, and the token will go into the keyring. All login methods are [login, sessions and profiles](./sessions.md). Without a method, `max session start` **imports the token** received in the official client and puts it in the operating system keyring.

```sh
max session start
MAX token: ▏               # ввод не отображается
```

**The token is not passed as an argument**: the argument is visible in `ps` to any process on the machine and remains in the shell history. Therefore, it is either asked from the terminal without echo, or read from the pipe:

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

```sh
max account list                # все профили на этом компьютере и аккаунт каждого; в MAX не обращается
```

```sh
max account sessions list       # где ещё выполнен вход
```

Sign out of MAX and forget the session on this computer:

```sh
max session end
```

`session end` ends the session on the MAX server (`revokedOnServer: true`). If the token was copied from a web.max.ru tab, that tab is also signed out.

`account show --json` contains the MAX fields `id`, `name`, `phone`, `description` and `username: null` as a general account format. The number is masked; `--show-phone` clearly shows it in its entirety.

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

Each profile has its own token and its own state. The local copy of messages is shared; The data in it is divided by account. More details - [profiles](./profiles.md).

## What to name the chat

The chat is addressed by **id or part of the name**. If part of the name matches two chats, command will refuse to guess and show the candidates: sending to the wrong conversation is irreversible. Having found the desired chat, then contact it **by id** - it is in the output, and it does not change.

`contacts show` accepts an **id, `@username` or name fragment**. It also refuses to guess when multiple people match.

The message can also be called one link `msg:…` from the output `search messages` - then the id after it is not needed.

## Reading

**Read does not mark anything as read.** The protocol separates "get history" from "mark read" and the second operation is not sent unless asked. You can only mark a chat as read explicitly ([below](#отметить-прочитанным)).

### Chats

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

`chats show` returns one object containing fields from `chats list` plus `members`, excluding you. For a channel, `members` is `null`: MAX can return only a few subscribers from thousands, which cannot represent its full membership. See [groups and channels](#группы-и-каналы).

### Messages

```sh
max messages list 0                 # сообщения чата по id
```

```sh
max messages list "Иван Петров"     # или по имени чата
```

```sh
max messages list 0 --limit 50
```

Read one message and its context; both chat and message ID are required (these IDs are examples):

```sh
max messages show -1000 100000000000000001
```

```sh
max messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

In the feed, what you are looking for is marked `◀`, in JSON - `"anchor": true`. If there is no such message - it was deleted or the chat is not the same - this is a “not found” error, and not the adjacent message. `--before-id` for `messages list` works for any id: the sending time is hardcoded into the id itself.

### Message link

`max messages link <chat> <message>` or `max messages link <msg:locator>` returns `{ locator, url, access, reason }`. Personal MAX first checks the message in the local archive and returns a locator; The native link format has not yet been confirmed. There is no connection with `--offline`. The other account's Locator is rejected. `messages links` is another command: it explains the connections of conversations ([search by topic](./topic-search.md)).

### What's waiting for an answer?

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

`--transcribe` transcribes voice messages that do not yet have text: slowly, up to a minute per five minutes of speech, and only if the model has already been downloaded ([voice to text](#голосовые-в-текст)). Without the flag, the response will contain the text of those already transcribed, and the rest will be in the list `unheard`.

#### Unanswered questions

```sh
max review --unanswered                      # вопросы, на которые сутки никто не ответил
```

```sh
max review --chat "Соседи" --unanswered 4h    # в одной группе, без ответа 4 часа
```

`--unanswered [длительность]` leaves only questions that are awaiting an answer - yours or the group admins. Question - a message with a “?” in text or transcript, or in response to your message or an admin message. Saved transcripts are always taken into account; `--transcribe` hears new voices before selecting questions. An unrecognized entry leaves the review incomplete. A question is considered answered if you or the admin answer it, or speak first after the person who asked. Questions younger than the specified period (for example, `4h`, `1d`; by default `24h`) are not shown: they have not yet been answered.

MAX provides admin information at login only for recently active chats. If unavailable, the command reports it and counts only your answers. Replies after the review's end are not visible. `--chat` restricts any review to one chat, with or without `--unanswered`.

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

`--transcribe` processes displayed voice messages lacking text; `--model` selects speech recognition for one run. `max` first downloads the required recordings, closes the connection, then recognises speech. The transcript appears below the voice message with 🎤, or in JSON `transcript`. Failures appear in `unheard` with a stderr reason; messages still display. Missing recognition files produce download guidance rather than an automatic download. Files in `~/.cache/cli-common/models/audio` are shared by `max` and `tg`.

Existing transcripts appear without the flag. With `--offline`, new audio cannot be downloaded or transcribed.

### Files

Save photos, files, video and audio to a directory, current by default:

```sh
max messages download -1000 100000000000000001 --output-dir ~/Downloads
```

```sh
max messages download -1000 --all --output-dir ~/Downloads --pause 5s   # все файлы чата
```

`--output` remains the compatible name `--output-dir`; You cannot specify different directories at the same time. The directory is created if it does not exist. The JSON of one message contains `{items}`; JSONL - one file entry per line. With `--all`, repeated run continues to traverse the saved progress; already saved files remain in place.

The file retains its name, the rest - `<id сообщения>-<номер>.<расширение>`. **The existing file is not overwritten**: command will stop with an error and name it. The video is saved as the largest MP4; calls, links and stickers are not downloaded, and there will be a line in stderr about this. Saved files are accessible only to the owner (permission 600). Voice messages have `kind: voice` in JSON; the extension of the unnamed attachment is selected via HTTP MIME. Sending files, formats and searching by text inside files - [attachments](./attachments.md).

<a id="медиа-чата"></a>

Chat media, like a gallery in the MAX application:

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

### People

```sh
max contacts list                   # люди, с кем есть личный чат
```

```sh
max contacts show @ivan             # один человек и общие с ним чаты
```

You can resolve anyone known to the local archive, including a group member not listed as a contact. `contacts show` returns name, `@username` and shared chats, newest first. It only reads: resolving someone does not message them. See [people](./people.md) for profiles, recent messages, bot checks and Telegram account links.

#### Who counts as a contact?

`max contacts list` shows **people with whom you have a direct chat**, newest conversation first. Group members are also saved with names and shared chats, but do not appear in this contact list.

MAX has no endpoint returning an address book, so only people from your chats are available. Contacts stay current because commands log in and each login requests **only changes since the previous one**.

```sh
max contacts sync     # забыть, где остановились, и забрать список заново
```

This is a repair action for inconsistent local data or a schema update that cleared it, not the normal workflow. Its response contains only counts, no names, phones or descriptions.

#### Your names and notes about people

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

Custom names and notes stay in the local copy and are not sent to MAX. `contacts rename` changes a name in the MAX address book; that is a separate operation. Commands can find a person by your custom name unless it matches another person’s name; in that case use an ID. `--revision` protects against editing an outdated note.

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

`--all` together with `--page` is a failure, not a quiet victory for one of them. `--limit` can be written to a settings file; `--page` and `--all` are not possible, the page number in the file is needed exactly once and then it gets in the way. `sends list` without `--limit` takes the configured `limit`; its JSON includes `items`, `page`, `limit`, `hasMore`, where `limit` is the selected list limit, not the number of rows; JSONL produces one attempt entry per line.

⚠ **The page number on a live list may repeat or skip a line.** The top is the most recent, so a message arriving between the first page and the second pushes someone over the line.

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

Part of the name is also accepted there - and in `max search messages --chat`: the chat name is searched among the saved ones, and a search in one chat also asks the MAX server (`--backend archive` - archive only). The search uses [search query language](./query-language.md): the word also finds its other forms, the beginning of the word is the explicit pattern `квартир*`, only the exact form is `exact:квартира`. `--regex` - separate mode: words - one JavaScript regular expression, case insensitive. More details: [search](./search.md).

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

<a id="графики-статистики"></a>

`max stats charts` uses the same data to return chart JSON. `--output activity.svg` saves a dark-theme SVG; `--output activity.png` saves PNG. Supply the chat identified through `max chats list`. `--chart-kind messages` counts messages, `active` counts active authors, `membership` shows joins/departures. `--by day` or `week` chooses intervals; weeks start Monday. `--timezone` applies to calendar dates.

The chat name `synthetic-group` in this example is fictional:

```sh
max stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

The JSON contains `chart`, and when saving the image, also `chartFile` with path and size. The image is written only to a new file, without overwriting. A missing date remains a gap and incomplete data is noted in the description and image. `membership` requires online chat events and is not available with `--offline`. Via MCP `max_read` (`command: "stats charts"`) returns JSON from local storage, without connecting and writing files; `format: "png"` adds a PNG and JSON image with `chart` and size `image`. Entries and exits are not available in it. Reading is subject to permission `messages`. `--jsonl` and stdout image are not available.

![Graph on fictitious data](https://raw.githubusercontent.com/WireCatLabs/max-cli/v0.43.0/docs/images/stats-charts.png)

Message and author rankings: [metrics, scores and evidence](./rankings.md).

## Sending

**Nothing is sent if you have not typed the sending command**, and the sending does not ask for confirmation: the recipient and the text are already written in the line you typed. Each submission goes through checks: read-only profile, list of recipients and hourly limit ([security](./security.md)).

```sh
max messages send 0 "текст"
```

```sh
max messages send "Иван Петров" "текст"
```

```sh
max messages send 0 "встреча **в 15:00**, не _в 14_" --md
```

`--md` applies MAX formatting: `**жирный**` or `__жирный__`, `_курсив_` or `*курсив*`, `~~зачёркнутый~~`, `++подчёркнутый++`, `[ссылка](https://example.com)` and inline or fenced code. Styles can nest; positions use UTF-16. Inline-code line breaks become spaces; MAX does not retain a code block's language. Without the flag, text stays literal. In-word `_` and `*` remain literal, and backslashes escape symbols. Links allow http, https and mailto; unclosed code blocks are rejected.

The MAX Bot API formatter also supports `^^выделение^^`, headings with `#` and quotations with `>`; it safely converts the result to HTML. The personal protocol rejects these three forms before sending or uploading a file. `||spoiler||` remains literal text in MAX. Telegram has its own syntax: `__текст__` means underline there, but bold in MAX.

`--topic` is for Telegram forum topics. MAX rejects it in `messages send` and `polls create` before sending; omit it for ordinary chats.

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

```sh
max stickers list                                    # наборы стикеров; --set <id> — стикеры набора с их id
```

```sh
max messages send 0 --sticker 51                     # стикер, один, без текста
```

With `--file`, `.jpg .jpeg .png .webp .gif` are sent as photos, `.mp4 .mov .webm .mkv` as videos, and everything else as files. With `--as-file`, the `--file` attachment is sent as a file, including videos. `--photo` accepts only `.jpg .png .webp`. A message can contain one `--file` attachment and one `--photo` attachment; **videos and files must be sent alone**, and the command rejects invalid combinations before uploading. Text is optional. If upload fails, nothing is sent. `max` does not currently send multiple files in one message. `--no-preview` is unavailable in MAX: its own client cannot do this, and the command rejects it.

`--voice` sends a voice message with duration and waveform, like a phone recording. It must be sent alone, without text, file or photo. Use Ogg Opus, the format MAX records; convert other audio first:

```sh
ffmpeg -i запись.m4a -ac 1 -ar 48000 -c:a libopus -b:a 32k заметка.ogg
```

Hidden files, files in hidden directories such as `~/.ssh`, and files in `max` directories are protected because they may contain keys or tokens. Use `--allow-any-file` only when intentionally sending one.

### Reply

```sh
max messages send 0 "да" --reply-to 100000000000000001   # ответ на сообщение в том же чате
```

A reply is a send, so all send options work with it.

### Reactions and polls

```sh
max reactions add 0 100000000000000001 👍                 # реакция; прежняя ваша заменяется
```

```sh
max reactions remove 0 100000000000000001
```

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

The interlocutor sees the reaction, as well as the answer. When reading, reactions are printed under the message - `👍 3  🔥 1  (you: 🔥)`; in JSON this field is `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` means “did not ask”: with `--offline` or if MAX did not respond - then there is one line in stderr about the reason.

When reading, a poll appears below the message: its question, choices with IDs in `[скобках]` (used by `polls vote`), vote counts and a ✓ on your choice. In JSON it is the attachment’s `poll` field:
`{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. A poll newer than the known version is shown as one line without choices. `polls show` and `polls vote|close` responses use the shared tg shape: `{chatId, messageId, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}`; for `vote` and `close`, it appears in `poll` beside `operationId`. With `--revote`, a poll created by `polls create` allows changing your vote.

web.max.ru does not display polls; it shows “Update MAX…” instead. People reading a chat in the browser cannot see your poll; they need the phone or desktop application.

Other participants can see your vote in a nonanonymous poll. The command rejects closed polls, excess choices, a second vote when revoting is forbidden and nonexistent choice ids before contacting MAX. Voting, closing and creating polls use send protections: voting is a reaction, closing an edit and creation a message. Creating/closing count toward `sendsPerHour`; votes, like reactions, do not. Votes are not automatically retried. Through `max mcp`, voting (`max_write`, `command: "polls vote"`) and creation (`command: "polls create"`) depend on `permissions`; closing (`command: "polls close"`) requires `polls.close` write permission ([MCP](./mcp.md)).

### Editing, forwarding, pinning, deleting

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

```sh
max messages delete 0 100000000000000001 --allow-dangerous                   # только у вас
```

```sh
max messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # несколько, до 10
```

```sh
max messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # у всех в чате
```

Other people see edits and may already have read the previous text. MAX permits edits to your messages for 7 days; forwarded copies do not change. Forwarding creates a new message and counts toward `sendsPerHour`. Edits and pins with `--notify` also count; silent pins pass safeguards but do not consume the hourly limit.

Pinning is available only in groups and channels. MAX does not pin messages in direct chats or “Favorites”, and the command rejects these immediately.

<a id="удаление"></a>

Deletion cannot be undone, so `messages.delete` defaults to `ask`: confirm in the terminal, or pass `--allow-dangerous` in JSON mode. Explicit `allow` for `permissions.messages.delete` permits deletion without that question; `readonly` and `deny` forbid it regardless of the flag. By default, the message disappears only for you and remains for the other person. `--for-everyone` removes it for everyone, and the other person cannot restore it.

Deletion passes send checks. **Each deleted message counts toward `sendsPerHour`** like one send, with at most 10 per run. Large deletion bursts resemble automation and can trigger MAX restrictions. Deleted data is removed from local cache and search too.

Message IDs may be separate arguments or comma-separated. After MAX acknowledges deletion, the tool reads the messages from the server. If a message remains or verification fails, it returns `outcome_unknown` instead of `deleted`. Check with `messages show` before retrying; deletion is not retried automatically.

### If the outcome is unknown

When sending, if no response arrives, the outcome is `outcome_unknown` (code `14`), **neither confirmed success nor failure**, because the message may have been sent. The error includes a `--send-id` for a safe retry:

```sh
max messages send 0 "текст" --send-id 1789784741828
```

MAX does not create a second message if a repeat came with the same `cid`. If the forwarding response was `outcome_unknown`, repeat it only with `--send-id` from the error - MAX will leave one copy. A repeat without it will be a second copy. The deferred message is not repeated: check `max messages scheduled <чат>`.

### Mark as read

```sh
max chats mark-read "Иван Петров"                  # до последнего сообщения
```

```sh
max chats mark-read "Иван Петров" --until 100000000000000001   # до этого сообщения включительно
```

```sh
max messages list "Иван Петров" --mark-read        # прочитать и отметить показанное
```

The other person sees the read receipt. It passes permission and recipient-list checks but does not consume the hourly message limit. `--offline` rejects it.

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
max contacts check 20000002                 # похож ли на бота
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
max account privacy show                    # кто находит по номеру, звонит, добавляет в чаты
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

The phone number is not written in the command line - it is seen by `ps` and the shell history. An added person with whom there is no dialogue will not appear in `contacts list` (only those with whom there is correspondence are there); it can be seen through `contacts show <id>`. You can also block someone who is not in your contacts. MAX does not give a short name (`@имя`) for a personal account: any is rejected as “This name is unavailable.” The folder name is no longer than 20 characters: MAX does not accept anything longer than that, and `max` will refuse on its own without sending anything. `import` sends other people's numbers to MAX. Human profile and bot verification in detail - [people](./people.md).

Contact changes return `operationId` in JSON. `add` and `rename` also return `person` with `id`, `name`, `username`; `remove`, `block` and `unblock` return `personId`. `import` returns `sent` and `recognised`: the first counts file rows, including duplicates, while the second contains person records returned by MAX. If MAX returned only phone numbers without records, `recognised` is empty; phone numbers are not included in the response.

`chats folders create` and `update` return `{operationId, folder}` in JSON; `delete` returns `{operationId, folderId}`. `list` returns a page of folders. `update` requires at least one change: `--title`, `--add` or `--remove`. Identify a folder by ID or exact name; if names repeat, use its ID from `list`.

`account update` returns `{operationId, account}` in JSON. The record contains `id`, `name`, `username` (`null` for MAX) and a masked `phone`. Read the description after a change with `account show`. Profile photos must be JPG, JPEG, PNG or WebP. `account sessions end --others --yes` returns `{operationId, sessions}`, the sessions that remain. If ending sessions succeeds but saving the new token or reading remaining sessions fails, the command reports an error while the journal records the completed action.

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

## Groups and channels

Scenarios for the group admin, all rules and restrictions - [groups you manage](./groups.md).

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

**Other people see** joining, leaving, adding members and renaming. `inspect`, `link show`, `events`, `members list` and `requests list` only read.

**Requests to join** are available from a channel where approval is enabled; the closed group does not have them. Then `chats join` only sends the request and `requested: true` responds, and the channel will appear in the list when the admin accepts it. `requests list` shows who is asking, but not when: MAX does not report this (`requestedAt: null`). You cannot reply to everyone at once (`--all`) and select applications using the link (`--link`) in MAX - the command will refuse. Actions go through the same checks as sending: a read-only profile will be rejected, a list of recipients will only be allowed into their chats, and an action without names or links will be included in the sending log. `create`, `members add` and `requests accept` count towards the limit of sendings per hour, one per person - they receive a message. Rejecting an application does not consume this limit. If the recipient list is enabled, you can only call people if you have a private chat with everyone on the list. Nothing is repeated on failure: repeat `create` - second group.

Group changes return `operationId` in JSON. `create`, `join`, `update` and `link reset` put the chat record in `chat`; `leave` returns `chatId`. Adding members returns `{operationId, chatId, added, notAdded}`; removing them returns `{operationId, chatId, removed}`. After a successful MAX response, `notAdded` is empty: MAX does not provide a separate list of partial failures; refusing to add a person returns an error. `admins` commands return `personId`; `admins add` also returns `rights` without duplicates. `link show` retains `{chatId, title, link}`.

In one `update`, the title or description and the settings are sent separately. If the first write succeeds but the second does not complete, the command returns `outcome_unknown`: the change may have applied partially. Read the group with `chats show` before retrying; requests are never retried automatically.

`events` reads service messages from chat history: who did what, and to whom. Event types: `create` means the chat was created, `add` means someone was added, `remove` means someone was removed and `pin` means a message was pinned. Other names appear unchanged. A run reads up to 2,000 messages, oldest first; if there are more, the command tells you where to continue.

`members list` asks MAX for members, so it works for channels and large groups too; `chats
show` includes only people seen by the local store. Each record includes the role (`owner`, `admin`, `member`; absent if MAX did not report group admins at login), account creation time (`registeredAt`: a very new account in a group is worth checking) and last-seen time (`lastSeenAt`; empty if hidden). It shows the requested page; `--all` reads all available members, up to 5,000. The command warns if MAX truncates the list or repeats a marker. `hasMore` indicates additional rows already read, rather than promising that the full list is available. JSON contains `items`, `page`, `limit`, `hasMore`; an absent `role` means MAX did not report roles. `chats inspect` shows a link’s destination without joining: `id`, `kind`, `title`, `username`, `participantsCount`, `description`, `member`. Unknown `member` and `username` values are `null`.

You can remove a member but cannot delete that person's messages. Deleting an entire chat for everyone is unsupported. Administrator rights accepted by `--can`: `read`, `members`, `admins`, `info`, `pin`, `link`, `post`, `edit`, `delete`. `read` corresponds to the app's Read messages switch; without it, a bot sees no group messages. `link` permits replacing the invitation link.

### Moderation rules

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

### Group check

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

There are no applications to join a group in MAX: the group is either open or is entered via an invitation link.

<a id="для-скриптов-и-агентов"></a>

## Output: table, JSON and return codes

A terminal displays a table or message feed. `--json` writes **exactly one JSON value to stdout** with no spinner, checkmark or warning. Nonterminal stdout, including pipes and CI, selects this automatically. Scripts and agents can rely on that separation.

```sh
max chats list --json
```

**Every list returns one object**, including bot lists. Unpaginated lists use `page` 1, `limit` equal to returned count and `hasMore` `false`:

```json
{ "items": [ … ], "page": 1, "limit": 20, "hasMore": true }
```

`--all` and `--offline` use **the same** object; `--all` sets `page: 1` and `hasMore: false`. The shape does not encode the data source; exit codes and diagnostics already do that.

`hasMore` means another page may exist, not a total count. It is exact for chats and contacts counted locally; if MAX did not provide all chats, the last page reports `hasMore: true`. ⚠ **For messages, it describes our copy, not the whole chat**: MAX does not report whether older messages exist. A full page is treated as evidence of more; after a short page, `max` requests one older message, because a short page can also occur in the middle of a conversation.

In the terminal, the line about the next page goes **to stderr**: stdout carries data in any mode, but continuation hints do not belong there.

**`--jsonl` outputs one object per line** without a wrapper, suitable for streaming and `jq`. Only stderr reports whether more pages exist.

```sh
max messages list -1000 --jsonl | jq 'select(.senderId == "111")'
```

Errors go **to stderr** with stdout empty, so they cannot be mistaken for data:

```json
{"error":{"code":"authentication_error","message":"no session for profile \"default\" — run `max setup` in a local terminal; agents: read `max skill show`"}}
```

You need to branch according to the return code, and not according to the text: the text changes, the code does not. The entire table is in the [command reference](./commands.md), and the most common: `4` - no session, `6` - not found, `9` - timeout, `14` - outcome unknown.

```sh
if ! max messages send 0 "текст" --json > /dev/null; then
  case $? in
    14) echo "могло уйти, повторять только с тем же --send-id" ;;
    4)  echo "нужен max setup" ;;
  esac
fi
```

## Connect an AI agent

An AI agent with terminal access, such as Claude Code, Codex or Gemini CLI, reads the `max` skill for rules and pitfalls beyond `--help`. `max setup` installs it; `max skill install` also does so (`--for claude`, `agents` or default `all`). Locations are `~/.claude/skills/max-cli/` for Claude Code and `~/.agents/skills/max-cli/` for Codex/Gemini CLI. `max skill show` prints the same instructions.

An agent without a terminal (for example, Claude Desktop or Cursor) connects via MCP: [MCP server](./mcp.md).

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

## New messages as they arrive

`max watch` prints new messages until it is stopped; `max serve` keeps the connection and saves everything to a local copy. How they work together, what a server does on the network and how to set it up as a service - [new messages immediately](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch).

## What a command did

By default, only run that ends in error is recorded ([diagnostics](./diagnostics.md)). Two separate things involve diagnostics:

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

## Local archive

`max` saves read messages locally for `--offline`, search and file export. See [local archive](./archive.md) for contents, downloading history, exporting and keeping it current.

## Settings and what the profile can do

An optional `~/.config/max-cli/config.json` file:

```json
{
  "defaultProfile": "personal",
  "profiles": {
    "personal": { "limit": 50, "timeoutMs": 20000, "color": true, "record": false, "keepRunsForDays": 30 }
  }
}
```

The order in which any setting is resolved is: **flag → environment variable → file → built-in value**. In the file, the profile is stronger than the general `defaults`, and sections `personal` and `bot` set values separately for personal accounts and for bots (`max config set --personal …`, `--bot …`). All fields, including `defaultProfile` and `permissions`, are [settings](./configuration.md). A typo in field name is an error with the field name, not the silent default.

**This file cannot contain secrets:** its schema has no secret fields.

<a id="что-профилю-можно"></a>

```sh
max config set permissions.messages readonly
```

```sh
max work config set permissions.messages.delete allow
```

```sh
max config set --defaults permissions.contacts readonly
```

Levels `deny`, `readonly`, `ask`, `allow` are used in both CLI and MCP. The more precise key takes precedence: a separately allowed delete does not allow sending. When `ask` the terminal asks; JSON requires an explicit confirmation flag. `allow` does not ask. Other resources and limits are not changed by this example. Old `readOnly`, `allow`, `mcpTools` are transferred through `config migrate`; preview - `config migrate --dry-run`. More details - [settings](./configuration.md).

## One person

`max contacts profile <человек>` shows what MAX and the local copy know about the person. `max contacts check <человек>` evaluates whether it looks like a bot. `max contacts context <человек>` reads his latest chat messages from a copy, and `max contacts link` links his MAX account to his Telegram account. Details - [people](./people.md).

## Next steps

- [Local copy](./archive.md) - search, download history, export, backup.
- [Settings](./configuration.md) - the entire settings file.
- [Security](./security.md) - what is on the disk and what stops sending.
- [Recipes](./recipes.md) - regular work for your AI agent.
- [Installation](./installation.md) - installation, update, where everything goes.
