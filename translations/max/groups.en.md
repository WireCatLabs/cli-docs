---
title: "Managing your groups"
---

`max` helps group admins find unanswered questions, see who joined and how old their accounts are, and remove spam using rules you choose. By default it only reports issues. Deleting messages or removing members requires your permission.

Everything here uses your personal account in groups where you are an admin. See the [Personal account guide](./usage.md#группы-и-каналы) for command examples and the [Command reference](./commands.md) for every option.

Group-changing commands return `operationId` in JSON. After creating, joining, updating or resetting a link, the chat record is in `chat`. If the title or description changed but the settings request did not complete, the result is `outcome_unknown`. Read the group with `chats show` before retrying: the change may have applied partially.

## Working with an agent

An agent with terminal access, such as Claude Code or Codex, can use the [skill](https://github.com/leemour/max-cli/blob/v0.36.0/README.md#навык-для-агентов-с-терминалом). Without terminal access, use the [MCP server](./mcp.md), for example in Claude Desktop. Cursor supports both approaches. Below: your request, the agent’s command and the result.

### An admin's morning: who needs an answer

```text
Вы:     Что в «Поход» осталось без ответа?
Агент:  (max review --chat "Поход" --unanswered 4h --json)
        Без ответа больше 4 часов — 3 вопроса:
        · Лена, 08:12 — «Во сколько выезд в субботу?»
        · Артём, вчера 22:40 — ответ на ваш пост про маршрут: «А палатки общие?»
        · Ира, вчера 19:05 — «Кто везёт котелок?»
        На остальные ответили вы или админы.
```

A question is a message containing “?” or a reply to your message or an admin's message. It counts as answered if you or an admin reply to it, or are the first to speak after the person who asked. A “?” inside a link does not count as a question.

### This week's new members

```text
Вы:     Кто вступил в «Поход» за неделю? Есть подозрительные?
Агент:  (max chats events "Поход" --type add --json)
        (max chats members list "Поход" --all --json)
        За неделю добавили 4 человек:
        · Катя Смирнова — добавила Лена, аккаунту 3 года
        · Олег — вступил сам, аккаунту 2 дня
        · …
        Стоит посмотреть: Олег — аккаунт совсем новый.
```

### Removing spam with your confirmation

Set up the rules once:

```sh
max chats rules set "Поход" invites delete            # приглашения в чужие чаты — удалять
max chats rules set "Поход" newAccount.days 3         # аккаунт моложе трёх дней — отмечать
max chats rules set "Поход" consent.delete ask        # но перед удалением — спросить меня
```

```text
Вы:     Проверь «Поход».
Агент:  (max_write, command: "chats check")
        Найдено приглашение. Правила требуют отдельного согласия: действие оставлено планом.
        Для выполнения в терминале: max chats moderate "Поход" --allow-dangerous --json
Вы:     Выполняю эту команду.
```

In a terminal, `max chats moderate "Поход"` asks the same question itself: `[y/N]`.

### A weekly group summary

```text
Вы:     Сделай итог недели по «Поход».
Агент:  (max review --chat "Поход" --since-time 2026-09-20T00:00 --json)
        Решили: выезд 4 октября, в 7:00 от метро.
        Взяли на себя: Лена — продукты, Артём — палатки.
        Висит: кто везёт котелок — спросили трижды, ответа нет.
```

### Scheduled checks

No agent is required: moderation is an ordinary command. Run it twice a day, allowing deletion where the consent level is `ask`:

```cron
0 9,21 * * * max chats moderate "Поход" --allow-dangerous >> ~/max-check.log 2>&1
```

Without `--allow-dangerous`, cron actions at level `ask` are only planned and wait for you. See [recipes.md](./recipes.md#как-запускать-по-расписанию) for the `PATH` and `XDG_RUNTIME_DIR` lines needed for `max` to find Node and your sign-in in cron.

## Available actions

| Command | Purpose |
|---|---|
| `max review --chat <чат> --unanswered [длительность]` | Questions you and the admins have not answered within that duration, for example `4h`; default `24h` |
| `max chats events <чат>` | Who joined, left, was added or removed, and by whom; past 7 days by default |
| `max chats members list <чат>` | A page of members returned by MAX (`--all` for all available, up to 5,000): owner and admins (a role may still be stale immediately after `admins add`), account creation time and last seen time |
| `max chats rules show\|set\|unset <чат>` | Group rules |
| `max chats moderate <чат>` | Check against the rules and perform permitted actions |
| `max chats members add\|remove`, `admins add\|remove` | Manage members and admins |
| `max chats link show\|reset <чат>` | Invite link; `reset` creates a new one and invalidates the old one |
| `max chats update` | Settings, title, description and photo; read settings with `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | Delete for everyone, pin or unpin |

An agent without a terminal can use the equivalent MCP tools: `max_read` (`command: "review"`) with `unanswered_after_hours`, `max_read` (`command: "chats events"`), `max_read` (`command: "chats members"`), `max_read` (`command: "chats rules"`) and `max_write` (`command: "chats check"`) ([mcp.md](./mcp.md)).

## What needs your reply

`max review` maintains a task list in the local copy; `max serve` does not yet open tasks in MAX. An unanswered question or a message mentioning you by name opens a task; your reply closes it. A task links to the message without copying its text.

```sh
max tasks list --state open                               # что ждёт ответа, старые сверху
max tasks list --chat "Поход" --type question,mention
max tasks add msg:max/<вы>/<чат>/<сообщение> --type promise   # то, чего правила не видят
max tasks close <задача> --as dismissed --reason no-reply-needed
max stats tasks show                                           # открытые по чатам, самая старая, медиана до закрытия
```

Closed tasks stay closed, and dismissed tasks do not reappear. Only your reply closes a task; an administrator’s reply does not yet do so, and `@ник` mentions are not detected. Equivalent MCP tools are `max_read` (`command: "tasks list"`), `max_write` (`command: "tasks add"`), `max_write` (`command: "tasks close"`) and `max_read` (`command: "stats tasks show"`) ([mcp.md](./mcp.md)).

## Rules

Rules are stored on your computer, separately for each group. The first `set` writes the full set of rules with their defaults.

| Rule | Default | Meaning |
|---|---|---|
| `trusted` | — | Comma-separated user IDs; rules do not affect these people |
| `blocked` | — | User IDs whose messages and joins are checked |
| `blockedNames` | — | Comma-separated, case-insensitive parts of names |
| `blockedPeople` | `report` | Action for a blocked person's message or join |
| `invites` | `report` | Invitation to another chat (`max.ru/join/…`, Telegram links) |
| `links` | `report` | Any link |
| `forwards` | `report` | Forwarded message |
| `flood.messages`, `flood.minutes`, `flood.action` | 5, 1, `report` | More than 5 messages in one minute from one person |
| `newAccount.days`, `newAccount.action` | 7, `report` | Account younger than 7 days; 0 disables this rule |
| `consent.delete`, `consent.remove` | `ask` | Your permission level for each action |

A rule's action is `report` (flag the issue), `delete` (delete the message for everyone) or `remove` (remove the person from the group). If a message breaks several rules, the strongest action is selected. Rules do not affect you, admins or people in `trusted`.

Consent determines whether the action is performed:

- `deny` — never;
- `readonly` — report only;
- `ask` — ask in the terminal; without an answer, the action waits. `--allow-dangerous` authorizes these actions for this run;
- `allow` — act immediately.

Older files can still be read: `forbid` becomes `deny`, and `flag` and `confirm` become `ask`. MCP calls `max_write` with `command: "chats check"`; actions at consent level `ask` remain plans, with no server confirmation forms.

`chats moderate --json` returns `{ chatId, rows }`. `--since-time` accepts an ISO 8601 time or `30m`, `2h`, `1d`, not a message ID, and does not advance the saved position. The next-check position is stored with the rules; the old session position is migrated automatically before the first run. CLI and personal-account MCP share this position.

## Using a bot

If your bot is an admin in the group, it can perform the same check: `max <бот> bot chats
moderate`. Unlike the personal account, it can ban removed members so they cannot return through an invite link. It cannot see account age. See [bot.md](./bot.md#проверка-чата-по-правилам).

## Limitations

- **Personal accounts cannot ban.** A removed member can return through an invite link. Reset the link (`max chats link reset`) or use a bot check, which can ban.
- **No join requests.** MAX groups are either public or invite-only; there is no approval workflow for new members.
- **At most 10 actions per check** (`--max-actions`). Deletions count toward the hourly send limit; once it is reached, remaining actions wait for the next check.
- **Up to 1,000 messages per CLI check.** If there are more, the next check continues from that position.
- **One join means reading the full member list.** To find a new member's account age, the check reads every member; in a large group this can require dozens of MAX requests.
- **Nothing monitors the group automatically.** A check runs only when started by you, by an agent at your request, or by a schedule you set up.

## Statistics for group administrators

`max stats chats show` counts messages, active senders, replies, threads, reactions and answered questions for the selected period from local storage. `--by day` or `--by week` adds a calendar day or week breakdown; weeks start on Monday, and `--timezone` sets the time zone. Channel post views appear only if MAX provided them and they were saved with messages. A missing count does not mean zero. Reactions use saved data, without fresh requests for every post. Questions are identified as in `review --unanswered`.

A normal run also reads join and leave events from MAX. With `--offline`, those events are not requested, so `members` is absent. It differs from `memberCounts`: saved daily member-count snapshots remain available offline.

If `complete` is `false`, data is incomplete: totals reflect only available history, and medians and proportions may differ from results for the entire group. `fetch` suggests a command for downloading missing messages. Incomplete event history also limits join and leave counts. Even complete message history cannot reconstruct earlier member profiles or member lists from days before collection began.

### Member snapshots

`max chats members fetch` reads members into local storage, saving profiles, changes, daily member counts and completeness checks. `--budget` limits pages. An incomplete list marks nobody as having left: that requires the entire available list and a known group member count no greater than the number retrieved. MAX lists are often partial; a larger budget helps only when the server actually provides more pages.

`chats tracking add` adds a group to tracking. `chats tracking list` shows tracked groups; `show` shows group state and member-count snapshots for the last 30 days. `add` does not retrieve members immediately; `remove` stops tracking and preserves collected history. The MAX server collects tracked group membership daily while running. Adding tracking does not start the server or extend its idle timeout; see below.

`max chats members history` shows saved joins, leaves and profile changes in chronological order; `--since-time` limits the period. It does not contact MAX. Join time comes from MAX when known, otherwise it is the first observation of the person. Leave time is the first complete snapshot without them, not their exact departure time. The first retrieval establishes the initial membership; those people did not necessarily join that day. `chats members list --offline` shows the latest fully saved membership list; partial retrievals do not replace it. If there has not yet been a complete snapshot, this list may be empty even when individual profiles and events are saved. Profiles and history remain in local storage alongside messages.

`max chats members audit` reads members and shows signals of suspicious accounts. `--budget` limits pages, and `--min-score` sets the minimum score. This is a hint for human review: nobody is removed, administrators and the owner are excluded, `more` means an incomplete list, and `unknown` means unknown signals. MAX does not provide every Telegram signal. This check is unavailable with `--offline`. “Never wrote” means no messages from the person were found in local history; it does not prove they never posted in the group.

`--deep <n>` additionally checks the first n members in full, one per second: their profile and up to 1000 saved messages each. Public spammer lists cover only Telegram accounts, so they are not queried for MAX, as the response explains.

### Weekly report for your group

“Поход” below is a fictional example group. First download its messages with `store fetch` if they are not yet stored, then save current membership and prepare a report:

```sh
max chats tracking add "Поход" --json
max chats members fetch "Поход" --json
max stats chats show "Поход" --since-time 7d --by day --timezone Europe/Madrid --json
max chats members history "Поход" --since-time 7d --offline --json
max chats tracking show "Поход" --offline --json
max chats members audit "Поход" --json
```

Ask the agent to report message and active-sender counts, unanswered questions, membership changes and days with member snapshots. Keep incompleteness indicators in the report: `complete`, `more`, `unknown` and missing daily snapshots. Repeat membership collection for the next report; the first report cannot show departures before the first saved membership list.

## Daily membership history

Add a group with `max chats tracking add <группа>` or run `max chats members fetch <группа> --track`. While the MAX server runs, it retrieves tracked group membership first one minute after connecting, then daily. `max chats tracking list` shows tracked groups and their latest saved counts.

Tracking does not start the server or extend its idle timeout. Keep `max server` running continuously for daily history. If membership has already been saved today in UTC, including a partial response, automatic retrieval is skipped; retry manually with `max chats members fetch <группа>`. Incomplete membership does not prove absent members have left.

`max chats tracking remove <группа>` stops future automatic retrieval; saved history remains available through `max chats members history <группа>`.
