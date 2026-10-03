---
title: "Managing your groups"
---

`max` helps group admins find unanswered questions, see who joined and how old their accounts are, and remove spam using rules you choose. By default it only reports issues. Deleting messages or removing members requires your permission.

Everything here uses your personal account in groups where you are an admin. See the [Personal account guide](./usage.md#группы-и-каналы) for command examples and the [Command reference](./commands.md) for every option.

## Working with an agent

An agent with a terminal, such as Claude Code or Codex, can use a [skill](https://github.com/leemour/max-cli/blob/v0.23.0/README.md#навык-для-агентов-с-терминалом). An agent can also connect through the [MCP server](./mcp.md), for example in Claude Desktop or Cursor. The examples below show your request, the command the agent runs and the result.

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
Агент:  (max chats events "Поход" --event add --json, max chats members list "Поход" --json)
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
max chats rules set "Поход" consent.delete confirm    # но перед удалением — спросить меня
```

```text
Вы:     Проверь «Поход».
Агент:  (max_chats_check)
        — форма: «delete message … from Олег for everyone (invites)?» —
Вы:     Да.
Агент:  Удалено одно сообщение с приглашением от Олега. Олег отмечен: аккаунту 2 дня.
        Остальное в порядке.
```

In a terminal, `max chats check "Поход"` asks the same question directly: `[y/N]`.

### A weekly group summary

```text
Вы:     Сделай итог недели по «Поход».
Агент:  (max review --chat "Поход" --since-time 2026-09-20T00:00 --json)
        Решили: выезд 4 октября, в 7:00 от метро.
        Взяли на себя: Лена — продукты, Артём — палатки.
        Висит: кто везёт котелок — спросили трижды, ответа нет.
```

### Scheduled checks

You do not need an agent: a check is a regular command. Run twice a day, allowing deletion where consent is set to `flag`:

```cron
0 9,21 * * * max chats check "Поход" --allow-dangerous >> ~/max-check.log 2>&1
```

Cron has no terminal, so actions requiring `confirm` are only planned and wait for you. See [Scheduled commands](./recipes.md#как-запускать-по-расписанию) for the `PATH` and `XDG_RUNTIME_DIR` lines needed for cron to find Node and your saved session.

## Available actions

| Command | Purpose |
|---|---|
| `max review --chat <чат> --unanswered [длительность]` | Questions you and the admins have not answered within that duration, for example `4h`; default `24h` |
| `max chats events <чат>` | Who joined, left, was added or removed, and by whom; past 7 days by default |
| `max chats members list <чат>` | All members returned by MAX: owner and admins (a role may still be stale immediately after `admins add`), account creation time and last seen time |
| `max chats rules show\|set\|unset <чат>` | Group rules |
| `max chats check <чат>` | Check against the rules and perform permitted actions |
| `max chats members add\|remove`, `admins add\|remove` | Manage members and admins |
| `max chats link show\|reset <чат>` | Invite link; `reset` creates a new one and invalidates the old one |
| `max chats update` | Settings, title and description; read settings with `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | Delete for everyone, pin or unpin |

Agents without a terminal can use equivalent MCP tools: `max_review` with `unanswered_after_hours`, `max_chats_events`, `max_chats_members`, `max_chats_rules` and `max_chats_check` ([MCP guide](./mcp.md)).

## Rules

Rules are stored on your computer, separately for each group. The first `set` writes the full set of rules with their defaults.

| Rule | Default | Meaning |
|---|---|---|
| `trusted` | — | Comma-separated user IDs; rules do not affect these people |
| `blocked` | — | User IDs whose messages and joins are checked |
| `blockedNames` | — | Comma-separated, case-insensitive parts of names |
| `blockedPeople` | `report` | Action for a blocked person's message or join |
| `invites` | `report` | Invitation to another chat (`max.ru/join/…`) |
| `links` | `report` | Any link |
| `forwards` | `report` | Forwarded message |
| `flood.messages`, `flood.minutes`, `flood.action` | 5, 1, `report` | More than 5 messages in one minute from one person |
| `newAccount.days`, `newAccount.action` | 7, `report` | Account younger than 7 days; 0 disables this rule |
| `consent.delete`, `consent.remove` | `flag` | Your permission level for each action |

A rule's action is `report` (flag the issue), `delete` (delete the message for everyone) or `remove` (remove the person from the group). If a message breaks several rules, the strongest action is selected. Rules do not affect you, admins or people in `trusted`.

Consent determines whether the action is performed:

- `forbid` — never.
- `flag` — only with `--allow-dangerous`; in the bot MCP server, it acts like `confirm` and requires your form approval.
- `confirm` — ask you in the terminal or an MCP form; without you, the action waits.
- `allow` — immediately.

## Using a bot

If your bot is an admin in the group, it can run the same check: `max <бот> bot chats
check`. Unlike a personal account, it can ban removed members so they cannot return through an invite link. It cannot see account ages. See [Bot group checks](./bot.md#проверка-чата-по-правилам).

## Limitations

- **Personal accounts cannot ban.** A removed member can return through an invite link. Reset the link (`max chats link reset`) or use a bot check, which can ban.
- **No join requests.** MAX groups are either public or invite-only; there is no approval workflow for new members.
- **At most 10 actions per check** (`--max-actions`). Deletions count toward the hourly send limit; once it is reached, remaining actions wait for the next check.
- **Up to 2,000 messages per check.** If more exist, the next check continues where this one stopped.
- **One join means reading the full member list.** To find a new member's account age, the check reads every member; in a large group this can require dozens of MAX requests.
- **Nothing monitors the group automatically.** A check runs only when started by you, by an agent at your request, or by a schedule you set up.
