---
title: "Local storage: contents, updates and exports"
---

Everything `max` reads stays on your computer, so you can answer offline, search and export it. This page explains what is stored, how to keep it current, how to download earlier history and how to export it.

## What is stored

Read data is saved locally so commands can answer without a network connection:

```sh
max chats list --offline      # только из локальной копии, никуда не подключаться
max messages send 0 "текст" --offline   # отказ: из копии отправить нельзя
max store clear --left        # посмотреть, сколько данных покинутых чатов можно удалить
max store clear --left --allow-dangerous  # удалить их из общей копии
```

A chat you left or were removed from disappears from `chats list` and `chats show` on the next login. Its messages remain in local storage. `max store clear --left --allow-dangerous` deletes both the chat and its messages; without `--allow-dangerous`, the command only reports how much it would delete. If you rejoin, the chat reappears in the list.

`chats list|show` and `contacts list|show` store retrieved data in the shared copy also used by `tg`. It starts filling on the first run without `--offline` after the update; the previous `max` copy is not migrated into it. `chats show` obtains group settings (`description`, `access`, `settings`) only from MAX, so `--offline` responses omit them.

Normal commands still query MAX: login already returns chats and contacts, so answering only from storage would deliberately miss changes. Use `--offline` when there is no network or when you do not want to connect.

MAX receives the saved contact marker, so the next login may return only changed contacts. `max contacts list` reads the shared store updated by that login. Run `max contacts sync` to retrieve the full contact list again.

The old profile cache is no longer opened or migrated into the shared store. `max doctor` shows its path if the file remains. There is no command to erase the entire shared store; `store clear --left` removes only data for departed chats.

### Downloading history

`max store fetch` downloads a chat's history into local storage, back to a date, a message count or the start of the chat:

```sh
max store fetch Друзья --since-time 2026-01-01
max store fetch Друзья --last 500
max store fetch Друзья --background      # в фоне; `max store jobs show <id>` следит за ним
max store fetch --all                    # все чаты, самые активные первыми: последние 90 дней
```

It pages backwards like the web client's scroll-up behavior: 30 messages at a time, starting from the oldest already downloaded. Each page is followed by a pause between `--pause` and twice that duration (default `5s`, giving 5–10 seconds, similar to a person scrolling). A run downloads at most `--limit` messages (default 1,200, or 40 pages). Running the same command again resumes where it stopped and skips downloaded data. Without `--since-time` or `--last`, repeated runs continue to the beginning. `--since-time` and `--last` cannot be combined. `--since-time` accepts ISO 8601 or a relative time (`30d`). Ctrl-C or `--timeout` stops after the current page, preserving downloaded data.

If MAX reports too many requests, the command stops. The response does not tell `max` how long to wait, so `max` neither waits nor retries. It also stops on any other error. Downloaded history is preserved, and the next run resumes from the same point ([limits.md](./limits.md)). `store fetch` does not read reactions or mark anything as read. `--estimate` is unavailable for MAX: MAX message IDs cannot tell you how much history is missing.

Downloaded data goes into the shared store used by `tg`; `max store info` shows its path. `max store status` shows message counts and fully downloaded ranges for each chat. The older `max` cache is not migrated; download its history again.

`max store jobs list` shows background downloads; `max store jobs cancel <id>` stops one.

Maintain the local database file:

- `max store check` — file integrity, search indexes, disk space and stale chats.
- `max store backup <файл>` — back up the live store without overwriting an existing file; `max store restore <файл>` restores it and keeps the previous file alongside. With `--encrypt`, the copy is compressed and encrypted with a password — see [Password](#пароль);
- `max store reindex` — rebuild the search index, typo dictionary and word stems without losing messages.
- `max store migrate` upgrades the file to this `max` version’s schema and adds indexes for older messages.

### Exporting to a file

Export conversations from local storage as JSONL (the same objects as `messages list --jsonl`) or readable Markdown:

```sh
max store export Друзья --format markdown --output друзья.md
max store export 111 --format jsonl --since-time 2026-09-01 > чат.jsonl
```

Export **never connects to the network** and includes only downloaded or previously read data. Fetch older history with `max store fetch <чат>`. Existing files are never overwritten. A file written with `--output` is accessible only to you (`0600`): it contains photo links that open without logging in.

### Exporting to a folder and adding only what is new

`--to <папка>` writes chats to a folder: one JSONL file per chat and `manifest.json`. Running it again into the same folder adds only what has changed since the last run: new messages, edits (including edits to old messages) and deletions. A deleted message is written without its text — `{ "id", "chatId", "deleted": true }`.

```sh
max store export Друзья Работа --to ~/max-архив
max store export --kind group --to ~/max-группы
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

## Search

`max messages search` finds saved messages by words, sender, chat, date, files, links and your tags. Word search in one specified chat also queries the MAX server by default; without a chat, or with `--backend archive`, it reads only the archive. `--sync-first` first downloads new messages from MAX within limits without marking them as read. See [message search](./search.md) for the guide, saved searches and counts. Empty results do not prove that a message is absent: check `coverage.next` and download missing history before searching again.

## Conversations within a group

Several conversations happen at once in a busy group. `max conversations` groups saved messages and finds discussions by their subject on this computer: see [topic search](./topic-search.md).

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

## Next steps

- [Personal account guide](./usage.md) — reading and sending.
- [Diagnostics](./diagnostics.md) — what a command did.
- [Command reference](./commands.md) — every `store`, `serve` and `watch` option.

## Archive maintenance

`max store migrate` completes indexes; `max store reindex` rebuilds them. `store info` and `store check` show word/stem readiness. Strict search matches word forms; `exact:` and `--exact` choose literal forms. `config set searchStemmers.cyrillic` accepts `russian` or `none`; `config set searchStemmers.latin` accepts `english`, `spanish`, both comma-separated (the default `english,spanish`) or `none`. After your own change, run `store reindex`. An update changing the default automatically rebuilds stems; until ready, search uses exact forms and reports that. `max serve` fills the index in the background, `store migrate` immediately. The setting is shared by all profiles and both messengers: `--defaults`, `--personal` and `--bot` do not apply, and `MAX_PROFILE_LOCK` prevents changes.

`max store repair --dry-run --json` previews structural repairs and rolls changes back; `store repair` applies them without deleting data. An incompatible table is retained as a copy; the response lists rows and columns that could not be transferred. Keep the copy until you have checked the result. `store repair` lists copy names (`copies` in `--json`); `store copies delete <точное имя>` deletes only the named copy. Stop processes using the archive before repairing its structure.
