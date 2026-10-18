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
- **`max personal serve`** — the background process sharing one MAX connection across a profile's commands.

Each command performs one task, prints its result and exits. Only [`max personal serve`](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch) keeps a MAX connection open. The first command needing MAX starts it in the background; it stops after 15 minutes without use.

```sh
max [profile] [options] <resource> <action> [arguments]
```

## What you can do

| Area | What you can do | Start with |
| --- | --- | --- |
| Reading | Chats, messages, individual messages and context | `max personal chats list`, `max personal messages list <chat>` |
| Replies and commitments | Unread messages, promises and open matters | `max personal inbox`, `max personal review` |
| Voice | Transcribe locally | `max personal messages transcribe` |
| Files | Download attachments or chat files; browse media | `max personal messages download`, `max personal chats media` |
| People | Contacts, aliases, notes, profiles and bot signals | `max personal contacts list`, `max personal contacts profile` |
| Search | Messages, files, dates, people and discussions by meaning | `max personal search messages`, `max personal search conversations` |
| Sending | Text, files, voice, replies and scheduled messages | `max personal messages send` |
| Changes | Edit, forward, pin, delete, react, vote and mark read | `max personal messages edit`, `max personal reactions add` |
| Bots | Press buttons, start a bot and open a mini app | `max personal messages press`, `max personal chats start` |
| Organisation | Folders, notifications and privacy | `max personal chats folders list`, `max personal chats mute` |
| Groups | Members, invite links, join requests, admins and rules | `max personal chats members list`, `max personal chats rules show` |
| Monitoring | New messages and a current local archive | `max personal watch`, `max personal serve` |
| Checks | Command activity and profile permissions | `max personal runs list`, `max config show` |

## Read a chat with your agent

Once your account is connected, ask for a short recap. This task reads messages; it sends nothing.

**Your request:**

> Summarise the five latest messages in Книжный клуб. Show decisions and open questions. Send nothing.

**Command:**

```sh
max personal messages list "Книжный клуб" --limit 5 --json
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
max personal setup --agent codex  # QR login and the agent skill
```

```sh
max personal chats list           # your chats
```

Setup may take about five minutes. The command checks up to five chats without starting a background service. History is downloaded separately after you choose the chat and amount. Before sign-in, the agent reads `max skill show`, which is available without a session. `max skill show link-conversations` prints the shared skill for linking conversations from the archive; no additional sign-in is needed.

## Logging in

The first run is `max personal setup`. For explicit re-login - `max personal session start qr`: a QR code will appear in the terminal, you will scan it with the MAX application, and the token will go into the keyring. All login methods are [login, sessions and profiles](./sessions.md). Without a method, `max personal session start` **imports the token** received in the official client and puts it in the operating system keyring.

```sh
max personal session start
MAX token: ▏               # input is not shown
```

**The token is not passed as an argument**: the argument is visible in `ps` to any process on the machine and remains in the shell history. Therefore, it is either asked from the terminal without echo, or read from the pipe:

```sh
pass show max/token | max personal session start
```

CI and one-off runs can use `MAX_TOKEN`, which takes precedence over the keyring:

```sh
MAX_TOKEN="$(cat /path/to/token)" max personal chats list
```

Check your account:

```sh
max personal account show                # phone number: only the last 4 digits
```

```sh
max personal account show --show-phone   # the full number
```

```sh
max account list                # all profiles on this computer and the account of each; does not contact MAX
```

```sh
max personal account sessions list       # where else you are logged in
```

Sign out of MAX and forget the session on this computer:

```sh
max personal session end
```

`session end` ends the session on the MAX server (`revoked_on_server: true`). If the token was copied from a web.max.ru tab, that tab is also signed out.

`account show --json` contains the MAX fields `id`, `name`, `phone`, `description` and `username: null` as a general account format. The number is masked; `--show-phone` clearly shows it in its entirety.

## Profiles use the first word

Multiple accounts can coexist. Supply a profile as the first word, not a flag:

```sh
max personal chats list     # profile personal
max work chats list         # profile work
```

**The first word is a profile unless it matches a command name.** A profile named `chats` is therefore rejected during creation, with an explanation.

`max` never picks a profile by itself, even when there is only one: without a name, the command stops and lists the profiles on this computer. The name comes from the first word or `MAX_PROFILE`.

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
max personal chats list                      # all chats
```

```sh
max personal chats list --limit 5            # the first five
```

```sh
max personal chats list 'unread_count>0' --offline # only chats with unread messages
```

```sh
max personal chats show "Иван Петров"        # one chat: kind, unread count, last message, members
```

`chats show` returns one object containing fields from `chats list` plus `members`, excluding you. For a channel, `members` is `null`: MAX can return only a few subscribers from thousands, which cannot represent its full membership. See [groups and channels](#группы-и-каналы).

### Messages

```sh
max personal messages list 0                 # messages of the chat by id
```

```sh
max personal messages list "Иван Петров"     # or by chat name
```

```sh
max personal messages list 0 --limit 50
```

Read one message and its context; both chat and message ID are required (these IDs are examples):

```sh
max personal messages show -1000 100000000000000001
```

```sh
max personal messages context -1000 100000000000000001 --before-n 3 --after-n 3
```

In the feed, what you are looking for is marked `◀`, in JSON - `"anchor": true`. If there is no such message - it was deleted or the chat is not the same - this is a “not found” error, and not the adjacent message. `id<…` in the query of `messages list` works for any id: the sending time is hardcoded into the id itself.

### Message link

`max personal messages link <chat> <message>` or `max personal messages link <msg:locator>` returns `{ locator, url, access, reason }`. Personal MAX first checks the message in the local archive and returns a locator; The native link format has not yet been confirmed. There is no connection with `--offline`. The other account's Locator is rejected. `messages links` is another command: it explains the connections of conversations ([search by topic](./topic-search.md)).

### What's waiting for an answer?

```sh
max personal inbox                               # unread, by MAX's counter; each message carries its chat
```

```sh
max personal inbox --new                         # what arrived since the last check, each message once
```

```sh
max personal inbox --new --jsonl                 # the same for a script: one message per line
```

```sh
max personal inbox 'date>"2026-09-24T09:00:00Z"' # a one-off look from this time
```

```sh
max personal inbox --all                         # muted chats and the archive too
```

**`max personal inbox` never marks messages read**, so it returns the same unread data until you read it in the app. For scheduled runs, use `--new`: its saved position advances only after output is printed. The first `--new` covers 24 hours. The query `date>…` does not move this position. Your own messages are excluded. If a chat exceeds `--limit` (default 20), the newest messages are shown, and `next` has a command for the rest. A run reads at most 20 chats; the others are listed in `missing`.

Muted and archived chats are skipped unless you were mentioned or replied to; `missing` reports the skipped count. `--all` includes them.

### Reviewing commitments

```sh
max personal review                                   # everything from the last 3 days
```

```sh
max personal review 'date>"2026-09-23T09:00:00Z"'   # since the end of the previous review
```

```sh
max personal review 'date>"2026-09-23T09:00:00Z"' --transcribe --json
```

This returns all messages, yours and others', in chats active since that time. Use it to identify promises, things you await and unclear points; interpreting them is your or your agent's job. Nothing is marked read. At most 300 messages are included per chat; exceeding this marks the review incomplete. Muted and archived chats are skipped unless you were mentioned or replied to, as in `inbox`; `--all` includes them.

In the terminal, the final stderr line shows the interval covered. In JSON, the first `next` step is `review.next`: start the next review from it to avoid gaps. If coverage is incomplete because of too many chats, truncated history or untranscribed audio, this is listed in `missing`, and `review.next` starts from the same boundary.

`--transcribe` transcribes voice messages that do not yet have text: slowly, up to a minute per five minutes of speech, and only if the model has already been downloaded ([voice to text](#голосовые-в-текст)). Without the flag, the response will contain the text of those already transcribed. With the flag, what could not be transcribed is listed in `missing`.

#### Unanswered questions

```sh
max personal review --unanswered                      # questions nobody has answered for a day
```

```sh
max personal review 'chat:"Соседи"' --unanswered 4h  # in one group, unanswered for 4 hours
```

`--unanswered [duration]` leaves only questions that are awaiting an answer - yours or the group admins. Question - a message with a “?” in text or transcript, or in response to your message or an admin message. Saved transcripts are always taken into account; `--transcribe` hears new voices before selecting questions. An unrecognized entry leaves the review incomplete. A question is considered answered if you or the admin answer it, or speak first after the person who asked. Questions younger than the specified period (for example, `4h`, `1d`; by default `24h`) are not shown: they have not yet been answered.

MAX provides admin information at login only for recently active chats. If unavailable, the command reports it and counts only your answers. Replies after the review's end are not visible. `chat:` in the query restricts any review to one chat, with or without `--unanswered`.

### Voice messages to text

See the [voice recognition guide](./audio-recognition.md) for model selection, commands and limits.

Voice messages are transcribed **on your computer**: recordings are not sent anywhere. Download the recognition model once with a separate command:

```sh
max personal models audio list                # which models exist, which are downloaded, which is the default (*)
```

```sh
max personal models audio download gigaam-v3  # 233 MB, once
```

```sh
max personal messages transcribe "Иван Петров" 100000000000000001
```

Models live in a directory shared by MAX and Telegram; `WIRECAT_STATE_DIR` relocates it. `models audio list --json` returns an `items` list with `page`; each model has its `path`. Downloaded files are reused. `gigaam-v3` remains first, and `config set --defaults transcribe_model <model>` selects the model.

| Model | Languages | Size | 5 minutes of speech |
|---|---|---|---|
| `gigaam-v3`, default | Russian; best Russian recognition | 233 MB | ~40 s |
| `gigaam-v3-ctc` | Russian; slightly faster, weaker capitalization | 226 MB | ~36 s |
| `parakeet-v3` | 25: Bulgarian, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hungarian, Italian, Latvian, Lithuanian, Maltese, Polish, Portuguese, Romanian, Slovak, Slovenian, Spanish, Swedish, Russian, Ukrainian | 671 MB | ~60 s |

Timings use one thread on a Ryzen AI 9 HX 470 laptop. Select another model for one run with `--model parakeet-v3`, or permanently with `"transcribe_model": "parakeet-v3"` in configuration `defaults`. Every download is checked against a checksum embedded in `max`; a mismatch prevents installation.

Text is stored under your account in the shared local `wirecat.db`, used by `messages list`, `messages transcribe`, `inbox`, `review` and MCP. Repeating a request by chat id with the same model answers immediately, without network or model execution. Transcripts from the old profile-specific cache are not migrated; `--transcribe` recreates them. Recordings download over the reading connection, which closes before local recognition. Downloading does not need a second login. Memory usage is about 700 MB (`parakeet-v3` uses 1.3 GB).

Transcribe the voice messages in chat or inbox results in one run:

```sh
max personal messages list "Иван Петров" --transcribe
```

```sh
max personal inbox --transcribe
```

`--transcribe` processes displayed voice messages lacking text; `--model` selects speech recognition for one run. `max` first downloads the required recordings, closes the connection, then recognises speech. The transcript appears below the voice message with 🎤, or in JSON `transcript`. Failures and their reasons are listed in `missing`; messages still display. Missing recognition files produce download guidance rather than an automatic download. Files in `~/.local/share/WireCat/models/audio` are shared by `max` and `tg`.

Existing transcripts appear without the flag. Without the flag, the others are listed in `missing` with a `transcript` entry, so a response with them does not look complete. With `--offline`, new audio cannot be downloaded or transcribed.

### Files

Save photos, files, video and audio to a directory, current by default:

```sh
max personal messages download -1000 100000000000000001 --output-dir ~/Downloads
```

```sh
max personal messages download -1000 --all --output-dir ~/Downloads --pause 5s   # all files of the chat
```

`--output` remains the compatible name `--output-dir`; You cannot specify different directories at the same time. The directory is created if it does not exist. The JSON of one message contains `{items}`; JSONL - one file entry per line. With `--all`, repeated run continues to traverse the saved progress; already saved files remain in place.

The file retains its name, the rest - `<message id>-<number>.<extension>`. **The existing file is not overwritten**: the failure appears in `batch` and independent files continue. The video is saved as the largest MP4; calls, links and stickers are not downloaded, and there will be a line in stderr about this. Saved files are accessible only to the owner (permission 600). Voice messages have `kind: voice` in JSON; the extension of the unnamed attachment is selected via HTTP MIME. Sending files, formats and searching by text inside files - [attachments](./attachments.md).

<a id="медиа-чата"></a>

Chat media, like a gallery in the MAX application:

```sh
max personal chats media "Поход"                           # photos, videos, files, audio and links, like the gallery in MAX
```

```sh
max personal chats media "Поход" --type photo,video        # only photos and videos
```

```sh
max personal chats media "Поход" --cursor <cursor>         # next page: the cursor comes from page.next
```

The list comes from the MAX server, including media not downloaded to this computer. Reading marks nothing as read.

### People

```sh
max personal contacts list                   # people you have a private chat with
```

```sh
max personal contacts show @ivan             # one person and the chats you share
```

You can resolve anyone known to the local archive, including a group member not listed as a contact. `contacts show` returns name, `@username` and shared chats, newest first. It only reads: resolving someone does not message them. See [people](./people.md) for profiles, recent messages, bot checks and Telegram account links.

#### Who counts as a contact?

`max personal contacts list` shows **people with whom you have a direct chat**, newest conversation first. Group members are also saved with names and shared chats, but do not appear in this contact list.

MAX has no endpoint returning an address book, so only people from your chats are available. Contacts stay current because commands log in and each login requests **only changes since the previous one**.

```sh
max personal contacts sync     # forget where it stopped and fetch the list again
```

This is a repair action for inconsistent local data or a schema update that cleared it, not the normal workflow. Its response contains only counts, no names, phones or descriptions.

#### Your names and notes about people

```sh
max personal contacts alias set "Борис Тестов" Боря          # your own name for a person, on this computer only
```

```sh
max personal contacts alias rm "Борис Тестов"
```

```sh
max personal contacts notes add "Борис Тестов" --file note.txt   # or text from stdin
```

```sh
max personal contacts notes list "Борис Тестов"
```

```sh
max personal contacts notes edit "Борис Тестов" <id> --revision 1 --file note.txt
```

```sh
max personal contacts notes remove "Борис Тестов" <id>
```

```sh
max personal contacts show "Борис Тестов" --with-notes
```

```sh
max personal contacts list notes:квартира                   # people whose notes contain this word
```

Custom names and notes stay in the local copy and are not sent to MAX. `contacts rename` changes a name in the MAX address book; that is a separate operation. Commands can find a person by your custom name unless it matches another person’s name; in that case use an ID. `--revision` protects against editing an outdated note.

### Pagination

`chats list`, `contacts list`, `chats members list` and `sends list` have three pagination options. `runs list` has `--limit` and `--page`; `inbox` has only `--limit`; `chats events` reads events from a specified time without pagination:

```sh
max personal contacts list --limit 5             # five per page
```

```sh
max personal contacts list --limit 5 --page 2    # sixth to tenth
```

```sh
max personal contacts list --all                 # everything, without pages
```

```sh
max personal contacts list --order name          # alphabetical instead of "who wrote last"
```

`--all` together with `--page` is a failure, not a quiet victory for one of them. `--limit` can be written to a settings file; `--page` and `--all` are not possible, the page number in the file is needed exactly once and then it gets in the way. `sends list` without `--limit` takes the configured `limit`; its JSON includes `items` and `page` with `limit` and `has_more`, where `limit` is the selected list limit, not the number of rows; JSONL produces one attempt entry per line.

⚠ **The page number on a live list may repeat or skip a line.** The top is the most recent, so a message arriving between the first page and the second pushes someone over the line.

**Message history has no page numbers: the query sets the starting point**, giving a precise time-based position:

```sh
max personal messages list 0 --limit 20
```

```sh
max personal messages list 0 'id<116762160362694583'          # older than the oldest row you see
```

```sh
max personal messages list 0 'date<"2026-09-20T01:00:00Z"'    # works even when that message no longer exists
```

```sh
max personal messages list 0 'id>116762160362694583'          # what arrived after this message
```

```sh
max personal messages list 0 'date>"2026-09-20T01:00:00Z"'    # or after this time
```

`id>…` and `date>…` read forwards: up to `--limit` messages **after** the position, oldest first. The `page.next` step in `next` names the next page in either direction: pass it to `--cursor`. The query takes only one starting point; two together are rejected: they describe alternative starting points, not a bounded interval.

The anchor message itself is excluded with both `id<…` and `id>…`: MAX returns it, but this program discards it so the next page does not start with the last row of the previous one. With `--offline`, only `id<…` works, and only with an ID present in the local copy.

Times accept ISO 8601 or relative values: `30m`, `2h`, `1d` (`date>7d` covers the past week), or a date such as `2026-09-20`. Put an exact time in quotes inside the query, with seconds and an offset:
`'date<"2026-09-20T01:00:00+02:00"'`. If an ID is missing locally, as a deleted message may be, the command explains the alternative method.

### Finding a chat before sending

```sh
max personal chats list title:иван --offline      # chats whose title contains "иван"
```

```sh
max personal chats list 'title:work kind:group' --offline # groups only
```

```sh
max personal chats list 'unread_count>0 kind:dialog' --offline # private chats with unread messages
```

```sh
max personal contacts list name:петров            # people by name, your own name for them or @username
```

```sh
max personal search all "договор"                 # messages and notes on this computer
```

```sh
max personal search messages "договор"            # in the text of messages already read
```

```sh
max personal search messages 'договор chat:42'    # in one chat
```

`title:` needs **at least three characters**: two letters match too much of the list to be useful. A `chats list` query answers only from the local copy, so it needs `--offline`: MAX itself does not filter the chat list, and without `--offline` a field in the query is rejected. `contacts list name:` also searches the local copy and fails while it has no contacts.

Once you find the chat, use its **ID** from the output; it does not change:

```sh
max personal messages list 42 --limit 20
```

```sh
max personal messages send 42 "text"
```

Part of the name is also accepted there - and in `chat:` of `max personal search messages`: the chat name is searched among the saved ones, and without `--discover`, a search in one chat also asks the MAX server (`--backend archive` - archive only). The search uses [search query language](./query-language.md): the word also finds its other forms, the beginning of the word is the explicit pattern `квартир*`, only the exact form is `exact:квартира`, a Lucene regular expression is `text:/pass(port)?/`. More details: [search](./search.md).

### How many messages matched

`max personal stats messages show` counts local archive messages without connecting to MAX. Without a query, it counts all saved messages for the current account; with a query, it counts strict Lucene matches as in `search messages`. Each message is counted once.

```sh
max personal stats messages show "договор" --by chat --json
```

```sh
max personal stats messages show --by sender --chat "Работа" --limit 10 --json
```

```sh
max personal stats messages show --by day --timezone Europe/Madrid --json
```

```sh
max personal stats messages show --by hour --timezone UTC --json
```

`--by` groups by chat, sender, calendar day or hour. `--limit` limits the rows, and `total` is the number of all matching messages. In an incomplete archive, the numbers are a lower bound: check `missing` before you treat zero matches as proof. To include all saved MAX accounts, add `--source max` explicitly; without it, other profiles are not included. JSON is one report `{item: {by, total, rows}}`, with `next` and `missing` beside it; `--jsonl` is not accepted for the report.

<a id="графики-статистики"></a>

`max personal stats charts` uses the same data to return chart JSON. `--output activity.svg` saves a dark-theme SVG; `--output activity.png` saves PNG. Supply the chat identified through `max personal chats list`. `--chart-kind messages` counts messages, `active` counts active authors, `membership` shows joins/departures. `--by day` or `week` chooses intervals; weeks start Monday. `--timezone` applies to calendar dates.

The chat name `synthetic-group` in this example is fictional:

```sh
max personal stats charts synthetic-group --chart-kind messages --by day --timezone Europe/Madrid --output activity.svg --json
```

The JSON is `{item}` with the chart description; when the image is saved, it also has `file` with path and size. The image is written only to a new file, without overwriting. A missing date remains a gap and incomplete data is noted in the description and image. `membership` requires online chat events and is not available with `--offline`. Via MCP `max_read` (`command: "stats charts"`) returns JSON from local storage, without connecting and writing files; `format: "png"` adds a PNG and JSON image with `chart` and size `image`. Entries and exits are not available in it. Reading is subject to permission `messages`. `--jsonl` and stdout image are not available.

![Graph on fictitious data](https://raw.githubusercontent.com/WireCatLabs/max-cli/v0.62.0/docs/images/stats-charts.png)

Message and author rankings: [metrics, scores and evidence](./rankings.md).

## Sending

**Nothing is sent if you have not typed the sending command**, and the sending does not ask for confirmation: the recipient and the text are already written in the line you typed. Each submission goes through checks: read-only profile, list of recipients and hourly limit ([security](./security.md)).

```sh
max personal messages send 0 "text"
```

```sh
max personal messages send "Иван Петров" "text"
```

```sh
max personal messages send 0 "meeting **at 15:00**, not _at 14_" --md
```

`--md` applies MAX formatting: `**bold**` or `__bold__`, `_italic_` or `*italic*`, `~~strikethrough~~`, `++underline++`, `[link](https://example.com)` and inline or fenced code. Styles can nest; positions use UTF-16. Inline-code line breaks become spaces; MAX does not retain a code block's language. Without the flag, text stays literal. In-word `_` and `*` remain literal, and backslashes escape symbols. Links allow http, https and mailto; unclosed code blocks are rejected.

The MAX Bot API formatter also supports `^^highlight^^`, headings with `#` and quotations with `>`; it safely converts the result to HTML. The personal protocol rejects these three forms before sending or uploading a file. `||spoiler||` remains literal text in MAX. Telegram has its own syntax: `__text__` means underline there, but bold in MAX.

`--topic` is for Telegram forum topics. MAX rejects it in `messages send` and `polls create` before sending; omit it for ordinary chats.

### Text from a pipe

Omit the last argument to read the body from stdin:

```sh
echo "text" | max personal messages send 0
max personal messages send 0 <<'EOF'
first line

third line
EOF
cat letter.txt | max personal messages send 0
```

This supports **multiline** text and keeps it out of `ps` and shell history, following the same privacy principle as tokens. All newlines are preserved except one final newline commonly added by `echo`.

⚠ **If stdin is a terminal, the command refuses instead of waiting.** `max personal messages send 0` without text is treated as a missing argument, preventing an apparently hung command.

### Sending later

```sh
max personal messages send 0 "reminder" --at-time 2026-09-25T09:00   # local time
```

```sh
max personal messages send 0 "reminder" --at-time 2h                # or in 30m, 2h, 1d
```

```sh
max personal messages scheduled 0                                       # what is waiting to be sent in this chat
```

The message waits **on MAX's server** and sends even if your computer is off. MAX discards seconds, so time is rounded down to the minute. Less than a minute or more than a year away is rejected.

- Response: `{item: {operation_id, message, scheduled_for}}`, containing the queued message and time;
  the `messages.scheduled` step in `next` shows the queue. **Its ID changes when sent.**
- `--silent` is unsupported: MAX always sends scheduled messages with notifications.
- Send safeguards (read-only, recipients, hourly limit) are checked when queuing.
- Missing responses are not retried. `outcome_unknown` advises checking the queue; `--operation-id` cannot be combined with `--at-time`. Scheduled-send deduplication has not been verified.
- **Cancel or edit in the MAX app.** `max` does not issue cancellation.

### Photos, video, files and voice messages

```sh
max personal messages send 0 "report" --file report.pdf
```

```sh
max personal messages send 0 "from the cottage" --file clip.mp4          # a video that plays right in the chat
```

```sh
max personal messages send 0 --file clip.mp4 --as-file       # the same video as a file to download
```

```sh
max personal messages send 0 --photo snapshot.png                # a photo
```

```sh
max personal messages send 0 --voice note.ogg              # a voice message
```

```sh
max personal stickers list                                    # sticker sets; --set <id> lists a set's stickers with their ids
```

```sh
max personal messages send 0 --sticker 51                     # one sticker, no text
```

With `--file`, `.jpg .jpeg .png .webp .gif` are sent as photos, `.mp4 .mov .webm .mkv` as videos, and everything else as files. With `--as-file`, the `--file` attachment is sent as a file, including videos. `--photo` accepts only `.jpg .png .webp`. A message can contain one `--file` attachment and one `--photo` attachment; **videos and files must be sent alone**, and the command rejects invalid combinations before uploading. Text is optional. If upload fails, nothing is sent. `max` does not currently send multiple files in one message. `--no-preview` is unavailable in MAX: its own client cannot do this, and the command rejects it.

`--voice` sends a voice message with duration and waveform, like a phone recording. It must be sent alone, without text, file or photo. Use Ogg Opus, the format MAX records; convert other audio first:

```sh
ffmpeg -i recording.m4a -ac 1 -ar 48000 -c:a libopus -b:a 32k note.ogg
```

Known credential files and folders (such as `~/.ssh`), `max` directories and the message store are protected. Ordinary hidden working folders are allowed. The CLI provides `--allow-any-file` for an explicitly selected protected file.

### Reply

```sh
max personal messages send 0 "yes" --reply-to 100000000000000001   # a reply to a message in the same chat
```

A reply is a send, so all send options work with it.

### Reactions and polls

```sh
max personal reactions add 0 100000000000000001 👍                 # a reaction; your previous one is replaced
```

```sh
max personal reactions remove 0 100000000000000001
```

```sh
max personal polls create 0 "Lunch?" "Yes" "No" --multiple     # a poll as a separate message
```

```sh
max personal polls show 0 100000000000000001                  # the options with ids and the votes for each
```

```sh
max personal polls vote 0 100000000000000001 1                # vote for the option with id 1
```

```sh
max personal polls vote 0 100000000000000001 --retract        # withdraw the vote, if the poll allows it
```

```sh
max personal polls close 0 100000000000000001                 # close your poll; it cannot be reopened
```

The interlocutor sees the reaction, as well as the answer. When reading, reactions are printed under the message - `👍 3  🔥 1  (you: 🔥)`; in JSON this field is `reactions`: `{counts: [{reaction, count}], mine, total}`. `null` means “did not ask”: with `--offline` or if MAX did not respond - then there is one line in stderr about the reason.

When reading, a poll appears below the message: its question, choices with IDs in `[brackets]` (used by `polls vote`), vote counts and a ✓ on your choice. In JSON it is the attachment’s `poll` field:
`{id, question, answers: [{id, text, votes, mine}], total, multiple, anonymous, revote, closed,
quiz}`. A poll newer than the known version is shown as one line without choices. `polls show` and `polls vote|close` responses use the shared tg shape: `{chat_id, message_id, question, answers: [{id, text, voters,
chosen}], closed, multiple, anonymous, voters}` in `item`; for `vote` and `close`, it appears in `poll` beside `operation_id`. With `--revote`, a poll created by `polls create` allows changing your vote.

web.max.ru does not display polls; it shows “Update MAX…” instead. People reading a chat in the browser cannot see your poll; they need the phone or desktop application.

Other participants can see your vote in a nonanonymous poll. The command rejects closed polls, excess choices, a second vote when revoting is forbidden and nonexistent choice ids before contacting MAX. Voting, closing and creating polls use send protections: voting is a reaction, closing an edit and creation a message. Creating/closing count toward `sends_per_hour`; votes, like reactions, do not. Votes are not automatically retried. Through `max personal mcp`, voting (`max_write`, `command: "polls vote"`) and creation (`command: "polls create"`) depend on `permissions`; closing (`command: "polls close"`) requires `polls.close` write permission ([MCP](./mcp.md)).

### Editing, forwarding, pinning, deleting

```sh
max personal messages edit 0 100000000000000001 "new text"          # your own messages only; attachments stay
```

```sh
max personal messages forward 0 100000000000000001 --to "Коллеги"      # forward one message to another chat
```

```sh
max personal messages pin 0 100000000000000001                         # pin, without notifying members
```

```sh
max personal messages pin 0 100000000000000001 --notify                # pin and notify
```

```sh
max personal messages unpin 0 100000000000000001                       # unpin; a MAX chat holds one pinned message
```

```sh
max personal messages delete 0 100000000000000001 --allow-dangerous                   # for you only
```

```sh
max personal messages delete 0 100000000000000001 100000000000000002 --allow-dangerous # several, up to 10
```

```sh
max personal messages delete 0 100000000000000001 --for-everyone --allow-dangerous    # for everyone in the chat
```

Other people see edits and may already have read the previous text. MAX permits edits to your messages for 7 days; forwarded copies do not change. Forwarding creates a new message and counts toward `sends_per_hour`. Edits and pins with `--notify` also count; silent pins pass safeguards but do not consume the hourly limit.

Pinning is available only in groups and channels. MAX does not pin messages in direct chats or “Favorites”, and the command rejects these immediately.

<a id="удаление"></a>

Deletion cannot be undone, so `messages.delete` defaults to `ask`: confirm in the terminal, or pass `--allow-dangerous` in JSON mode. Explicit `allow` for `permissions.messages.delete` permits deletion without that question; `readonly` and `deny` forbid it regardless of the flag. By default, the message disappears only for you and remains for the other person. `--for-everyone` removes it for everyone, and the other person cannot restore it.

Deletion passes send checks. **Each deleted message counts toward `sends_per_hour`** like one send, with at most 10 per run. Large deletion bursts resemble automation and can trigger MAX restrictions. Deleted data is removed from local cache and search too.

Message IDs may be separate arguments or comma-separated. After MAX acknowledges deletion, the tool reads the messages from the server. If a message remains or verification fails, it returns `outcome_unknown` instead of `deleted`. Check with `messages show` before retrying; deletion is not retried automatically.

### If the outcome is unknown

When sending, if no response arrives, the outcome is `outcome_unknown` (code `14`), **neither confirmed success nor failure**, because the message may have been sent. The error includes a `--operation-id` for a safe retry:

```sh
max personal messages send 0 "text" --operation-id 1789784741828
```

MAX does not create a second message if a repeat came with the same `cid`. If the forwarding response was `outcome_unknown`, repeat it only with `--operation-id` from the error - MAX will leave one copy. A repeat without it will be a second copy. The deferred message is not repeated: check `max personal messages scheduled <chat>`.

### Mark as read

```sh
max personal chats mark-read "Иван Петров"                  # up to the last message
```

```sh
max personal chats mark-read "Иван Петров" --until-id 100000000000000001   # up to and including this message
```

```sh
max personal messages list "Иван Петров" --mark-read        # read and mark what is shown
```

The other person sees the read receipt. It passes permission and recipient-list checks but does not consume the hourly message limit. `--offline` rejects it.

### Contacts, profile and folders

```sh
max personal contacts lookup                         # asks for the number; or: echo "+7…" | max personal contacts lookup
```

```sh
max personal contacts add 20000002                   # the id from lookup, or part of a known name
```

```sh
max personal contacts remove 20000002
```

```sh
max personal contacts rename 20000002 "Соседка" "Анна" # your own name for a person; they do not see it
```

```sh
max personal contacts block 20000002                 # they can no longer write to you
```

```sh
max personal contacts unblock 20000002
```

```sh
max personal contacts profile 20000002               # profile, creation date, their messages in shared chats
```

```sh
max personal contacts check 20000002                 # does it look like a bot
```

```sh
max personal contacts import address-book.csv              # a line: number, comma, tab or semicolon, name
```

```sh
max personal account update --description "about me"   # the name stays as it was
```

```sh
max personal account update --photo portrait.png      # a new profile photo
```

```sh
max personal account privacy show                    # who can find you by number, call you, add you to chats
```

```sh
max personal account privacy set --calls contacts    # only contacts can call; nothing else changes
```

```sh
max personal account privacy set --hide-online on    # hide "online" and "was recently online"
```

```sh
max personal chats mute "Поход"                      # no notifications from the chat, for good
```

```sh
max personal chats mute "Поход" --until 8h           # for 8 hours; or until a date: --until 2026-10-09T09:00
```

```sh
max personal chats unmute "Поход"
```

```sh
max personal chats clear "Поход" --allow-dangerous   # delete all messages for you; others keep them
```

```sh
max personal chats delete "Поход" --allow-dangerous  # delete the chat for you; others keep it
```

```sh
max personal calls list                              # calls, newest first
```

```sh
max personal account sessions end --others --yes     # log out everywhere except this session, the phone too
```

```sh
max personal chats folders list
```

```sh
max personal chats folders create "Работа" --chat -1000 --chat "Проект"
```

```sh
max personal chats folders update "Работа" --title "Офис" --add -2000 --remove -1000
```

```sh
max personal chats folders delete "Офис"             # the chats stay
```

```sh
max personal chats folders order "Офис" "Семья"      # after "All chats": these two, then the rest
```

The phone number is not written in the command line - it is seen by `ps` and the shell history. An added person with whom there is no dialogue will not appear in `contacts list` (only those with whom there is correspondence are there); it can be seen through `contacts show <id>`. You can also block someone who is not in your contacts. MAX does not give a short name (`@name`) for a personal account: any is rejected as “This name is unavailable.” The folder name is no longer than 20 characters: MAX does not accept anything longer than that, and `max` will refuse on its own without sending anything. `import` sends other people's numbers to MAX. Human profile and bot verification in detail - [people](./people.md).

Contact changes return `{item}` with `operation_id` in JSON. `add` and `rename` also return `person` with `id`, `name`, `username`; `remove`, `block` and `unblock` return `person_id`. `import` returns `sent` and `recognised`: the first counts file rows, including duplicates, while the second contains person records returned by MAX. If MAX returned only phone numbers without records, `recognised` is empty; phone numbers are not included in the response.

`chats folders create` and `update` return `{item: {operation_id, folder}}` in JSON; `delete` returns `{item: {operation_id, folder_id}}`. `list` returns a page of folders. `update` requires at least one change: `--title`, `--add` or `--remove`. Identify a folder by ID or exact name; if names repeat, use its ID from `list`.

`account update` returns `{item: {operation_id, account}}` in JSON. The record contains `id`, `name`, `username` (`null` for MAX) and a masked `phone`. Read the description after a change with `account show`. Profile photos must be JPG, JPEG, PNG or WebP. `account sessions end --others --yes` returns `{item: {operation_id, sessions}}`, the sessions that remain. If ending sessions succeeds but saving the new token or reading remaining sessions fails, the command reports an error while the journal records the completed action.

### Bot buttons

```sh
max personal messages show <bot> 100000000000000001            # buttons under the message: [1 Yes] [2 No]
```

```sh
max personal messages press <bot> 100000000000000001 2         # press the second button
```

```sh
max personal messages press <bot> 100000000000000001 "Да"      # or by its text
```

The bot sees who pressed. Only ordinary callback buttons are pressed. For other kinds, the command explains the next action: a link's address appears under the message; use `messages send` for a text button and `chats app` for a mini app.

```sh
max personal chats start <bot>                                 # start the bot, like the "Start" button
```

```sh
max personal chats start <bot> --start ref1                    # with a parameter, like the link max.ru/<bot>?start=ref1
```

```sh
max personal chats start https://max.ru/<bot>?start=ref1       # by link, even a bot you have never written to
```

```sh
max personal chats app <bot>                                   # the address of the bot's mini-app
```

`chats start` accepts a bot chat or bot link, including a bot missing from your chat list; its chat will appear. Links to people are refused. Starting is a message from you and uses the same send checks. `chats app` prints an address that signs in as you: keep it private. Anyone opening it enters as you. The address is not written to logs or files by `max`.

After a lost start/press reply, `outcome_unknown` (exit 14) means the bot may already have acted. Check its reply before repeating; there is no automatic retry. Contact and location buttons are never pressed. Presses use reaction checks and do not count toward `sends_per_hour`. Buttons are visible in messages read from MAX, and are absent from the local copy.

## Groups and channels

Scenarios for the group admin, all rules and restrictions - [groups you manage](./groups.md).

```sh
max personal chats inspect https://max.ru/join/…          # what is behind the link; does not join
```

```sh
max personal chats join https://max.ru/join/…             # join; a channel with approval answers requested: true
```

```sh
max personal chats leave "Семья"                          # leave
```

```sh
max personal chats create "Поход" "Аня" 20000002          # create a group with people (name or id)
```

```sh
max personal chats create "Новости" --channel            # a private channel; people join by invite link
```

```sh
max personal chats members list "Поход" --all             # all members: account creation date, last seen
```

```sh
max personal chats members add "Поход" "Боря"             # without old messages; --history to include them
```

```sh
max personal chats members remove "Поход" "Боря"
```

```sh
max personal chats admins add "Поход" "Аня" --can members,pin
```

```sh
max personal chats admins remove "Поход" "Аня"              # remove rights; stays a member
```

```sh
max personal chats update "Поход" --title "Поход-2026" --description "in July"
```

```sh
max personal chats update "Поход" --photo cover.jpg    # a new group photo
```

```sh
max personal chats show "Поход"                           # group settings are in the settings field
```

```sh
max personal chats update "Поход" --all-can-pin off       # change one setting
```

```sh
max personal chats link show "Поход"                      # the invite link, if you can see it
```

```sh
max personal chats link reset "Поход"                     # a new link; the old one stops working
```

```sh
max personal chats requests list "Канал"                  # who asks to join a channel with approval; admins only
```

```sh
max personal chats requests accept "Канал" 20000002        # let in; decline refuses
```

```sh
max personal chats events "Поход"                         # who joined, left, was added or removed, over 7 days
```

```sh
max personal chats events "Поход" 'time>=2026-09-01'         # since 1 September
```

**Other people see** joining, leaving, adding members and renaming. `inspect`, `link show`, `events`, `members list` and `requests list` only read.

**Requests to join** are available from a channel where approval is enabled; the closed group does not have them. Then `chats join` only sends the request and `requested: true` responds, and the channel will appear in the list when the admin accepts it. `requests list` shows who is asking, but not when: MAX does not report this (`requested_at: null`). You cannot reply to everyone at once (`--all`) and select applications using the link (`--link`) in MAX - the command will refuse. Actions go through the same checks as sending: a read-only profile will be rejected, a list of recipients will only be allowed into their chats, and an action without names or links will be included in the sending log. `create`, `members add` and `requests accept` count towards the limit of sendings per hour, one per person - they receive a message. Rejecting an application does not consume this limit. If the recipient list is enabled, you can only call people if you have a private chat with everyone on the list. Nothing is repeated on failure: repeat `create` - second group.

Group changes return `{item}` with `operation_id` in JSON. `create`, `join`, `update` and `link reset` put the chat record in `chat`; `leave` returns `chat_id`. Adding members returns `{operation_id, chat_id, added, not_added}`; removing them returns `{operation_id, chat_id, removed}`. After a successful MAX response, `not_added` is empty: MAX does not provide a separate list of partial failures; refusing to add a person returns an error. `admins` commands return `person_id`; `admins add` also returns `rights` without duplicates. `link show` retains `{chat_id, title, link}`.

In one `update`, the title or description and the settings are sent separately. If the first write succeeds but the second does not complete, the command returns `outcome_unknown`: the change may have applied partially. Read the group with `chats show` before retrying; requests are never retried automatically.

`events` reads service messages from chat history: who did what, and to whom. Event types: `create` means the chat was created, `add` means someone was added, `remove` means someone was removed and `pin` means a message was pinned. Other names appear unchanged. A run reads up to 2,000 messages, oldest first; if there are more, the command tells you where to continue.

`members list` asks MAX for members, so it works for channels and large groups too; `chats
show` includes only people seen by the local store. Each record includes the role (`owner`, `admin`, `member`; absent if MAX did not report group admins at login), account creation time (`registered_at`: a very new account in a group is worth checking) and last-seen time (`last_seen_at`; empty if hidden). It shows the requested page; `--all` reads all available members, up to 5,000. The command warns if MAX truncates the list or repeats a marker. `page.has_more` indicates additional rows already read, rather than promising that the full list is available. JSON contains `items` and `page`; an absent `role` means MAX did not report roles. `chats inspect` shows a link’s destination without joining: `id`, `kind`, `title`, `username`, `participants_count`, `description`, `member`. Unknown `member` and `username` values are `null`.

You can remove a member but cannot delete that person's messages. Deleting an entire chat for everyone is unsupported. Administrator rights accepted by `--can`: `read`, `members`, `admins`, `info`, `pin`, `link`, `post`, `edit`, `delete`. `read` corresponds to the app's Read messages switch; without it, a bot sees no group messages. `link` permits replacing the invitation link.

### Moderation rules

```sh
max personal chats rules show "Поход"                          # the group's rules; without any, the defaults
```

```sh
max personal chats rules set "Поход" invites delete            # invitations to other chats: delete
```

```sh
max personal chats rules set "Поход" newAccount.days 3         # an account younger than three days: flag
```

```sh
max personal chats rules set "Поход" trusted 30000003,30000004 # the rules do not touch these people
```

```sh
max personal chats rules set "Поход" consent.delete ask        # ask before deleting
```

```sh
max personal chats rules unset "Поход" consent.delete          # back to the default
```

Rules live on this computer beside profile settings; the response names the file. The first group `set` writes every rule and default, showing all configurable fields. You can edit the file manually; `rules show` validates it.

By default, rules only report (`report`). Beyond that, a rule can `delete` a message or `remove` a person. Each action has its own consent level (`consent.delete`, `consent.remove`): `deny` means never, `readonly` means report only, `ask` means ask first (the default) and `allow` means act without asking. `--allow-dangerous` authorizes `ask` actions for this run. Old `forbid`, `flag` and `confirm` values in files are read as `deny`, `ask` and `ask`.

### Group check

```sh
max personal chats moderate "Поход"                       # what new breaks the rules; does what is allowed
```

```sh
max personal chats moderate "Поход" --dry-run             # only show
```

```sh
max personal chats moderate "Поход" --allow-dangerous     # also do what is set to ask
```

```sh
max personal chats moderate "Поход" --since-time 2026-09-20T00:00:00Z
```

The check reads messages and joins since the previous check, or the past day initially. Messages are checked for blocked authors, invites, links, forwards and flooding; new members against blocklists and account-age rules. You, admins and `trusted` people are exempt.

Rules and consent determine the action. Everything is reported by default. Each result identifies the issue, person, rule, action and outcome: `reported`, flagged; `done`, completed; `planned`, awaiting a flag or approval, with a manual command; `forbidden`, disallowed by rules; `declined`, rejected by you; `refused`, blocked by profile safeguards or hourly limits; `skipped`, not reached yet.

In JSON, the response is `{ item: { chat_id, rows } }`. Each check reads up to 1000 messages. Its saved position is in the rules file. `--since-time` and `--dry-run` do not advance it. Personal-account MCP uses the same position: `max_write` (`command: "chats moderate"`).

A check performs at most 10 actions (`--max-actions`). Deletions count toward the hourly limit; remaining actions are deferred. The next check starts from the first unperformed message. Removed people may return through invite links because personal accounts cannot ban.

There are no applications to join a group in MAX: the group is either open or is entered via an invitation link.

<a id="для-скриптов-и-агентов"></a>

## Output: table, JSON and return codes

A terminal displays a table or message feed. `--json` writes **exactly one JSON value to stdout** with no spinner, checkmark or warning. Nonterminal stdout, including pipes and CI, selects this automatically. Scripts and agents can rely on that separation.

```sh
max personal chats list --json
```

**Every list returns one object**, including bot lists. One thing is
`{"item": …}`. Unpaginated lists use `page.limit` equal to returned count and `page.has_more` `false`:

```json
{ "items": [ … ], "page": { "limit": 20, "has_more": true }, "meta": { … } }
```

Beside it there can be `next`: commands worth running next (the `page.next` step names the next page), and `missing`: what the response lacks and why. Keys are in snake_case.

`--all` and `--offline` use **the same** object; `--all` sets `has_more: false`. The shape does not encode the data source; exit codes and diagnostics already do that.

`has_more` means another page may exist, not a total count. It is exact for chats and contacts counted locally; if MAX did not provide all chats, the last page reports `has_more: true`. ⚠ **For messages, it describes our copy, not the whole chat**: MAX does not report whether older messages exist. A full page is treated as evidence of more; after a short page, `max` requests one older message, because a short page can also occur in the middle of a conversation.

In the terminal, the line about the next page goes **to stderr**: stdout carries data in any mode, but continuation hints do not belong there.

**`--jsonl` outputs one object per line** without a wrapper, suitable for streaming and `jq`. Only stderr reports whether more pages exist.

```sh
max personal messages list -1000 --jsonl | jq 'select(.sender_id == "111")'
```

Errors that end the command go **to stderr** with stdout empty, so they cannot be mistaken for data:

```json
{"error":{"code":"authentication_error","message":"no session for profile \"personal\" — run `max personal setup` in a local terminal; agents: read `max skill show`"}}
```

Partial reads or downloads can return JSON with exit code `0`: inspect `missing` and `next`. Partial download JSONL adds `batch_summary`; completed work stays saved.

You need to branch according to the return code, and not according to the text: the text changes, the code does not. The entire table is in the [command reference](./commands.md), and the most common: `4` - no session, `6` - not found, `9` - timeout, `14` - outcome unknown.

```sh
if ! max personal messages send 0 "text" --json > /dev/null; then
  case $? in
    14) echo "may have gone out; retry only with the same --operation-id" ;;
    4)  echo "max personal setup is needed" ;;
  esac
fi
```

## Connect an AI agent

An AI agent with terminal access, such as Claude Code, Codex or Gemini CLI, reads the `max` skill for rules and pitfalls beyond `--help`. `max personal setup` installs it; `max skill install` also does so (`--for claude`, `agents` or default `all`). Locations are `~/.claude/skills/max-cli/` for Claude Code and `~/.agents/skills/max-cli/` for Codex/Gemini CLI. `max skill show` prints the same instructions. After updating `max`, run `max skill install` again: if the skill is missing or older than `max`, the agent sees one line about it on stderr once a day. Turn the hint off with `max config set skill_hint false --defaults`. How agents find skills: [Codex](https://learn.chatgpt.com/docs/build-skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/).

An agent without a terminal (for example, Claude Desktop or Cursor) connects via MCP: [MCP server](./mcp.md).

## Conversation display

`max personal messages list` and `max personal search messages` show a feed instead of a table in terminals:

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

`max personal watch` prints new messages until it is stopped; `max personal serve` keeps the connection and saves everything to a local copy. How they work together, what a server does on the network and how to set it up as a service - [new messages immediately](./archive.md#новые-сообщения-сразу-max-serve-и-max-watch).

## What a command did

By default, only run that ends in error is recorded ([diagnostics](./diagnostics.md)). Two separate things involve diagnostics:

```sh
max personal chats list --trace      # show it, without saving anything
```

```sh
max personal chats list --record       # save it, without showing anything
```

`--trace` prints a stderr line per request, working alongside `--json`:

```text
→ session.login     op 19  seq 2  871 B
← session.login     op 19  seq 2  213ms  48.0 kB  25 chats  6 contacts
```

`--record` saves the same events in a run directory for 30 days:

```sh
max personal runs list                 # what was done, newest first
```

```sh
max personal runs show <id>            # one run: how it ended and where it went
```

```sh
max personal runs path <id>            # the directory, for jq and grep
```

**Records contain no conversation content.** Operations, opcodes, request numbers, IDs, byte counts and durations are recorded. Chat titles, names, message text, phone numbers and tokens never are, including truncated or hashed forms.

## Local archive

`max` saves read messages locally for `--offline`, search and file export. See [local archive](./archive.md) for contents, downloading history, exporting and keeping it current.

## Settings and what the profile can do

An optional `~/.config/max-cli/config.json` file:

```json
{
  "profiles": {
    "personal": { "limit": 50, "timeout_ms": 20000, "color": true, "record": false, "keep_runs_for_days": 30 }
  }
}
```

The order in which any setting is resolved is: **flag → environment variable → file → built-in value**. In the file, the profile is stronger than the general `defaults`, and sections `personal` and `bot` set values separately for personal accounts and for bots (`max personal config set --personal …`, `--bot …`). All fields, including `permissions`, are [settings](./configuration.md). A typo in field name is an error with the field name, not the silent default.

**This file cannot contain secrets:** its schema has no secret fields.

<a id="что-профилю-можно"></a>

```sh
max personal config set permissions.messages readonly
```

```sh
max work config set permissions.messages.delete allow
```

```sh
max config set --defaults permissions.contacts readonly
```

Levels `deny`, `readonly`, `ask`, `allow` are used in both CLI and MCP. The more precise key takes precedence: a separately allowed delete does not allow sending. When `ask` the terminal asks; JSON requires an explicit confirmation flag. `allow` does not ask. Other resources and limits are not changed by this example. More details - [settings](./configuration.md).

## One person

`max personal contacts profile <person>` shows what MAX and the local copy know about the person. `max personal contacts check <person>` evaluates whether it looks like a bot. `max personal contacts context <person>` reads his latest chat messages from a copy, and `max personal contacts link` links his MAX account to his Telegram account. Details - [people](./people.md).

## Next steps

- [Local copy](./archive.md) - search, download history, export, backup.
- [Settings](./configuration.md) - the entire settings file.
- [Security](./security.md) - what is on the disk and what stops sending.
- [Recipes](./recipes.md) - regular work for your AI agent.
- [Installation](./installation.md) - installation, update, where everything goes.
