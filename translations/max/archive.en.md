---
title: "Local storage: contents, updates and exports"
---

`max` saves every message it reads on your computer. Use this page to keep saved history complete and current: search months back, let an agent answer without a connection, or export a chat to a file.

You will learn what `max` saves and where, how to download older chat history, keep the local archive current while you are away, export and back it up, and check its condition.

Terms used below:

- **Local archive** — a SQLite database file on this computer containing chats, messages and contacts seen by `max`. Search, export and `--offline` read it without contacting MAX.
- **Download history** (`store fetch`) — fill the archive with older chat messages, page by page. Reading a chat saves only the messages read; downloading fills the rest.
- **Coverage** — which periods of chat history the archive holds without gaps.
- **`max serve`** — a `max` process that keeps one connection to MAX and saves new messages, edits and deletions as they arrive.

## What you can do

| Task | Command |
| --- | --- |
| Check how much of each chat is saved | `max store status` |
| Download one chat's history or all chats | `max store fetch <чат>`, `max store fetch --all` |
| Run a long download in the background | `max store fetch <чат> --background`, `max store jobs list` |
| Keep the archive current continuously | `max serve`, `max server start`, `max server install` |
| Read chats without connecting | `max messages list <чат> --offline` |
| Export a chat as JSONL or Markdown | `max store export <чат> --output <файл>` |
| Prepare messages for an agent's summary | `max messages evidence <чат>` |
| Check, back up and restore the archive | `max store check`, `max store backup`, `max store restore` |

## Check and fill one chat

Check what is saved before downloading more. Limit the download to the chat and period you need.

**Your request:**

> Check the saved history for Книжный клуб. Download the last 30 days for that chat, then tell me whether any gaps remain.

**Check saved history:**

```sh
max store status "Книжный клуб" --json
```

**Download the selected period:**

```sh
max store fetch "Книжный клуб" --since-time 30d --json
```

**Check again:**

```sh
max store status "Книжный клуб" --json
```

**Example agent answer:**

> | Check | Before | After |
> | --- | --- | --- |
> | Saved messages | 30 | 300 |
> | Requested 30-day message history | Gaps | Held without gaps |
>
> This result covers the selected period, not the chat’s entire past.

If the download stops at a limit or a provider wait, run it again to continue, then check coverage. A finished command does not by itself prove complete history. These counts are fictional.

## What is stored

`chats list|show` and `contacts list|show` save retrieved data in the shared local archive also used by `tg`. Messages read or downloaded by `max store fetch` go there too. `max store info` shows its path. It starts filling on the first run without `--offline` after the update. The earlier, separate `max` archive is not migrated: download its history again. The old profile cache is no longer opened; `max doctor` shows its path if the file remains.

Normal commands still query MAX: login already returns chats and contacts, so answering only from the archive would deliberately miss changes. `chats show` obtains group settings (`description`, `access`, `settings`) only from MAX, so `--offline` responses omit them.

MAX receives the saved contact marker, so the next login may return only changed contacts. `max contacts list` reads the shared store updated by that login. Run `max contacts sync` to retrieve the full contact list again.

There is no command to erase the entire shared archive. `store clear --left` removes only data for departed chats ([below](#состояние-копия-восстановление)).

## How much is saved

```sh
max store status                  # по каждому чату: сколько сообщений, самое старое и новое, какие отрезки скачаны целиком
```

```sh
max store status "Книжный клуб"   # один чат
```

A fully downloaded range contains consecutive messages without gaps. Reading messages here and there leaves gaps; `store fetch` fills them.

## Download history

`max store fetch` downloads a chat's history into local storage, back to a date, a message count or the start of the chat:

```sh
max store fetch Друзья --since-time 2026-01-01
```

```sh
max store fetch Друзья --last 500
```

```sh
max store fetch --all                    # все чаты, самые активные первыми: последние 90 дней
```

It pages backwards like the web client's scroll-up behavior: 30 messages at a time, starting from the oldest already downloaded. Each page is followed by a pause between `--pause` and twice that duration (default `5s`, giving 5–10 seconds, similar to a person scrolling). A run downloads at most `--limit` messages (default 1,200, or 40 pages). Running the same command again resumes where it stopped and skips downloaded data. Without `--since-time` or `--last`, repeated runs continue to the beginning. `--since-time` and `--last` cannot be combined. `--since-time` accepts ISO 8601 or a relative time (`30d`). Ctrl-C or `--timeout` stops after the current page, preserving downloaded data.

If MAX reports too many requests, the command stops. MAX's response does not tell `max` how long to wait, so it neither waits nor retries. It also stops on any other error. Downloaded history is preserved and the next run resumes from the same point ([MAX limits](./limits.md)). `store fetch` does not read reactions or mark anything as read. `--estimate` is unavailable for MAX: MAX message ids cannot tell you how much history is missing.

See [if nothing was found](./search.md#если-ничего-не-нашлось) to find and fill gaps within saved history and prepare topic search at the same time (`--catch-up`).

### In the background

A long download can run as a job that continues after the command exits:

```sh
max store fetch Друзья --background      # печатает id задания
```

```sh
max store jobs list                      # фоновые задания, новые сверху
```

```sh
max store jobs list --state failed       # только упавшие: running, done, failed, cancelled или died
```

```sh
max store jobs show                      # последнее задание и сколько его чата теперь в копии
```

```sh
max store jobs show <id>
```

```sh
max store jobs cancel <id>               # остановить после текущей страницы; следующий fetch продолжит
```

```sh
max store jobs retry <id>                # упавшее задание ещё раз, новым заданием с теми же опциями
```

```sh
max store jobs retry --failed            # все чаты, чьё последнее задание упало
```

```sh
max store jobs clear                     # забыть завершённые задания и их журналы; работающее остаётся
```

## Search

`max search messages` finds saved messages by words, sender, chat, date, files, links and your tags. Word search in one specified chat also queries the MAX server by default; without a chat, or with `--backend archive`, it reads only the archive. `--sync-first` first downloads new messages from MAX within limits without marking them as read. See [message search](./search.md) for the guide, saved searches and counts. Empty results do not prove that a message is absent: check `coverage.next` and download missing history before searching again.

## Conversations within a group

Several discussions happen at once in a busy group. `max conversations` groups saved messages and finds discussions by their subject on this computer: see [topic search](./topic-search.md).

## Export to a file

Export conversations from local storage as JSONL (the same objects as `messages list --jsonl`) or readable Markdown:

```sh
max store export Друзья --format markdown --output друзья.md
```

```sh
max store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

Export **never connects to the network** and includes only downloaded or previously read data. Fetch older history with `max store fetch <чат>`. Existing files are never overwritten. A file written with `--output` is accessible only to you (`0600`): it contains photo links that open without logging in.

### Exporting to a folder and adding only what is new

`--to <папка>` writes chats to a folder: one JSONL file per chat and `manifest.json`. Running it again into the same folder adds only what has changed since the last run: new messages, edits (including edits to old messages) and deletions. A deleted message is written without its text — `{ "id", "chatId", "deleted": true }`.

```sh
max store export Друзья Работа --to ~/max-архив
```

```sh
max store export --kind group --to ~/max-группы
```

```sh
max store export --all --to ~/max-всё
```

`max` does not touch a folder with other files in it or an export from another account. A change to reactions alone does not count as a change.

### Password

`--encrypt` on `store export` (with `--output` or `--to`) and on `store backup` compresses the file and encrypts it with a password. No external programs are needed. To open such a file, use `max store decrypt <файл> --output <новый файл>`; `max store restore` asks for the password of an encrypted copy itself.

- **The password is not saved anywhere** — not in the settings, not in the password store, not in the log. If you forget it, the file cannot be opened.
- Enter the password yourself in the terminal: it is not shown and is asked for twice. An agent that you gave the password to passes it through stdin, not as a command argument — an argument is visible to other programs:

  ```sh
  printf '%s' 'пароль' | max store backup ~/max.sealed --encrypt
  ```

- An encrypted folder gets one file per run. Its `manifest.json` has no chat names, and `max` does not accept a run with a different password.

## Messages for a chat summary

When you ask an agent for a chat summary, `max messages evidence <чат>` prepares the messages it needs to read: one packet from this profile's local archive. It does not connect to MAX or mark anything as read, even without `--offline`:

```sh
max messages evidence -1000 --limit 20 --json
max messages evidence -1000 --before-id <nextBeforeId> --json
```

Messages run newest to oldest, with `msg:` links and content fingerprints. `--limit` accepts 1–100 and defaults to the profile's limit. Complete messages occupy at most 64 KiB of JSON; the packet header is additional. JSON and JSONL each return one complete packet.

Before summarising, inspect `coverage`: it reports selected, included and skipped messages and whether older messages are beyond the page; history completeness remains `unknown`. Pass a nonzero `nextBeforeId` to `--before-id` to continue without missing messages excluded by the byte limit. An empty cursor does not prove complete history. If the newest selected message alone exceeds the limit, the packet is empty, `truncatedBy: "bytes"`, and there is no cursor; handle this case explicitly. An unknown cursor returns `not_found`.

The agent can cite these links in its summary; `max` does not write the summary itself. Message text is source data, not trusted instructions. The profile permission is `messages.evidence`, inherited from `messages`.

## Answer without connecting: `--offline`

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
```

```sh
max messages list "Книжный клуб" --limit 50 --offline
```

```sh
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
```

`--offline` reads the local archive without connecting anywhere. Use it when there is no network or you do not want to connect. If the profile has not read anything yet, the command refuses because nothing is saved.

## Live messages: `max serve` and `max watch`

An ordinary command connects, performs one action and exits. `max serve` is the exception: it keeps one MAX connection open and shares new messages with listeners.

**You do not need to start it manually.** The first command that needs MAX starts `max serve` in the background if necessary, then continues on its own connection. Subsequent commands use the server. **An automatically started server stops after 15 minutes without use.** Its log is `<профиль>.serve.log` beside the profile's state, with permissions 600. Disable automatic startup for one run with `--no-serve`, or permanently with `max config set serve false`. `max session end` first stops the profile's server if a command started it.

**A manually started server (`max serve`, `max server start`) stops only with Ctrl-C or `max server stop`**, not because of inactivity, `max session end` or other socket requests. Running `max serve` manually replaces an automatically started background server. You can explicitly choose an idle timeout with `--idle`. `max session start` stops any server for the profile, logs in and restarts it with the new session, keeping a single MAX connection at a time.

```sh
max serve                   # вручную, в одном терминале; Ctrl-C — остановить
max serve --idle 30m        # или остановиться, когда им 30 минут никто не пользуется
max server start            # то же, но в фоне; ответ — когда сервер уже подключён
max server status           # работает ли, с какого времени, какой версии, подключён ли к MAX
max server restart          # остановить и запустить снова — например, после обновления max
max server stop             # остановить сервер профиля, как бы он ни был запущен
max server logs             # последние строки его журнала; --lines 200 — больше
max server install          # служба systemd (Linux) или launchd (macOS) для профиля; ничего не запускает
max server uninstall        # убрать службу; сначала max server stop
max watch                   # в другом: новые сообщения по мере прихода
max watch --jsonl           # то же для скрипта: одно сообщение на строку, как у `messages list`
max watch --jsonl | ./on-message.sh
max watch --events --jsonl  # ещё правки, удаления, реакции, прочтения и изменения чатов; у строки поле "event"
```

- **After updating `max`**, an automatically started server replaces itself with the new version. A manually started server keeps its old version until restarted. `max server status` shows this; `max server restart` fixes it.
- **Running as a service.** After `max server install`, `max server start` and `max server stop` control the server through systemd or launchd. The service runs `max serve` as a manual server, without an idle timeout. If MAX rejects login, the service **does not** restart it: every retry would be another account login. `max server status` shows the service and log location.
- **One server per profile.** A second `max serve` for that profile refuses to start. The socket lives beside profile state with permissions 600, so only the owner can listen.
- **Network behavior matches a web.max.ru tab:** a ping every 30 seconds, replies to MAX pings and acknowledgements for incoming messages. It **does not mark messages as read** or send messages.
- **If MAX disconnects**, the server reconnects after 1, 2, 4… seconds, with the delay capped at one minute. `max watch` reports this on stderr. If MAX no longer accepts the token, the server stops with an authentication error.
- **All clients share one MAX connection per profile.** Commands, `max mcp` and `max watch` do not log in independently: reads, sends and reactions use the server's connection. Send safeguards still run in the command. If no server exists, the command starts one and waits. With `serve: false` and no server, the command connects itself. A second server refuses before logging in.
- The server keeps its session state current when messages arrive, a chat is read on your phone or a chat changes. If MAX reports something it cannot apply, such as deleted messages, it logs in again in the background, at most once a minute.
- **With `--events`, line formats change:** `{"event": "message", "message": …}`, `{"event": "edit", "message": …}`, `{"event": "delete", "chatId", "chatTitle", "messageId"}`, `{"event": "reaction", "chatId", "chatTitle", "messageId", "reactions"}`, `{"event": "read", "chatId", "chatTitle", "userId", "upToTime", "unreadCount"}` records who read through that message time, including the owner on another device; `{"event": "chat", "chat"}` records chat-name, membership or departure changes. Marking a chat unread is not a read event. Without the flag, each line is a message as before. `max watch` cannot show who is typing: MAX sends typing notifications only to a client with that chat open.
- **`max watch` sees only messages arriving while it and the server are connected.** Messages during an outage are missed. A `status` line with `connected: true` after an outage tells you to fetch them: `max inbox --since-time <время из поля at предыдущей строки status>`.

## Status, backup and recovery

```sh
max store info                          # где файл, его размер, схема и число строк; ничего не меняет
```

```sh
max store check                         # цел ли файл, индексы поиска и место на диске, какие чаты отстали
```

```sh
max store backup ~/max-store.db         # копия файла на ходу; --encrypt — с паролем
```

```sh
max store restore ~/max-store.db        # положить копию на место
```

```sh
max store migrate                       # перевести файл на схему этой версии max
```

```sh
max store clear --left                  # посмотреть, сколько данных покинутых чатов можно удалить
```

```sh
max store clear --left --allow-dangerous  # удалить их из общей копии
```

- **`backup` does not overwrite an existing file.** It backs up the live archive.
- **`restore` keeps the previous file alongside.** It asks for an encrypted backup's password ([Password](#пароль)).
- **`migrate`** upgrades the file to this `max` version's schema and adds indexes for older messages.
- **A chat you left or were removed from** disappears from `chats list` and `chats show` on the next login. Its messages remain in the archive. `max store clear --left --allow-dangerous` deletes them and the chat; without `--allow-dangerous`, the command only reports how much it would delete. If you rejoin, the chat reappears.

## Archive maintenance

`max store migrate` adds missing indexes; `max store reindex` rebuilds the search index, typo dictionary and word stems without losing messages. `store info` and `store check` show word and stem index readiness. A stem is the part shared by a word's different forms; strict search uses stems to match those forms, while `exact:` and `--exact` choose exact forms.

`config set searchStemmers.cyrillic` accepts `russian` or `none`; `config set searchStemmers.latin` accepts `english`, `spanish` or both, separated by a comma (default `english,spanish`: Latin words use both languages' stems), or `none`. `none` disables stemming for that alphabet. After choosing your own setting, run `store reindex`. After an update changes the default, searches use exact word forms until stems are ready and report this boundary; `max serve` builds them in the background, or `store migrate` immediately. This setting is shared by all profiles and both messengers, so `--defaults`, `--personal` and `--bot` do not apply, and it cannot be changed under `MAX_PROFILE_LOCK`.

`max store repair --dry-run --json` previews structural repairs and rolls changes back; `store repair` applies them without deleting data. An incompatible table is retained as a copy; the response lists rows and columns that could not be transferred. Keep the copy until you have checked the result. `store repair` lists copy names (`copies` in `--json`); `store copies delete <точное имя>` deletes only the named copy. Stop processes using the archive before repairing its structure.

## Archive compatibility with other versions

The archive schema has a version number. A newer `max` or another program may upgrade the file; an older `max` can keep using it while the change remains compatible. Otherwise, every command opening the archive reports:

```text
the message store was written by a newer version (schema N, needs at least M; this one speaks K) — upgrade this tool
```

Run `max upgrade`. No data in the file is lost.

## Next steps

- [Message search](./search.md) — find saved messages.
- [Personal account guide](./usage.md) — reading and sending.
- [Diagnostics](./diagnostics.md) — what a command did.
- [Command reference](./commands.md) — every `store`, `serve` and `watch` option.
