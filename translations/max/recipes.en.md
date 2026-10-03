---
title: "Recipes: your agent and your conversations"
---

Delegate regular MAX tasks to Claude Code or Codex: unread summaries, chat reports, commitments, unanswered-message reminders and checks on groups you manage. Each recipe includes a prompt, required permissions and scheduling instructions.

## One-time setup

1. Install `max` and log in: [Installation](./installation.md), [Sessions](./sessions.md).
2. Give your agent instructions for `max` by installing its skill:

   ```sh
   max skill install
   ```

   The skill is installed into Claude Code, Codex and Gemini CLI directories.
3. Save recipe prompts to files, for example in `~/max-recipes/`. The scheduling commands below read these files.

In Claude Desktop or other clients using MCP, including Cursor, a skill is not required. Connect the MCP server (`max mcp config` prints a configuration entry) and use `/catch-up`, `/review`, `/reply` and `/find` ([MCP prompts](./mcp.md#команды-и-чаты-по-)).

## Agent permissions

A scheduled agent runs without you, so enforce restrictions in settings rather than the prompt. An agent may misunderstand “do not send anything”; a configuration restriction is enforced by the program.

**Agent-level restrictions.** Claude Code in `-p` mode runs only commands permitted by `--allowedTools`. Without `max messages send` in the list, the agent cannot call it:

```sh
claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
```

Codex has no equivalent list. Its default sandbox blocks network access and file writes, both needed by `max` to connect and save local data. These examples use `--sandbox danger-full-access`, with sends restricted through `max` settings.

**Restrictions in `max`** apply to every agent:

```sh
max config set readOnly true           # профиль ничего не отправит
max config set sendsPerHour 5          # или: не больше пяти сообщений в час
max recipients add "Иван Петров"       # и писать только в эти чаты
```

`readOnly` also prevents you from sending until you disable it with `max config unset readOnly`. All send attempts, including rejected ones, appear in `max sends list`.

**Reading does not reveal your activity.** None of the commands below marks messages read, so other people do not see that the agent opened the chat.

## Scheduling

- **Claude Desktop scheduled tasks.** They run on your computer and can access `max` and your session. A missed run while the computer slept executes once after waking. See [Claude scheduled-task documentation](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **Cron with `claude -p`.** No app is needed; the computer must be on at the scheduled time:

  ```cron
  30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)" >> ~/max-recipes/morning.log 2>&1
  ```

  Cron runs with a nearly empty environment. On Linux, this can cause two problems:

  - **`node: not found`, code 127.** Node installed through nvm, fnm or volta is outside the system `PATH` known to cron.
  - **`no token found for profile "default", although it has logged in on this machine`, code 4.** `max` cannot access the password store. **Do not log in again:** this is an environment issue, not an invalid session.

  Add both lines at the start of `crontab -e`, using your values: get the directory from `dirname "$(which node)"` and the number from `id -u`:

  ```cron
  PATH=/home/ivan/.nvm/versions/node/v24.19.0/bin:/home/ivan/.local/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

  The password store remains accessible while you are logged into the operating system. Test the first run manually and check the log. See [Claude headless mode](https://code.claude.com/docs/en/headless) for `-p`.

- **Cron with `codex exec`.** The equivalent for Codex:

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/max-recipes/morning.md)" >> ~/max-recipes/morning.log 2>&1
  ```

  See [Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).
- **An open Claude Code session:** use `/loop` or ask “remind me at 15:00”. This works while the session remains open ([Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)).

Claude cloud routines do not work for this setup: they run elsewhere and cannot access your computer's `max` session.

## Morning summary

Writes to MAX: **no**. Permit: `Bash(max inbox:*)`.

> Run `max inbox --new --json`. Group messages by chat. Give each chat one line: who is writing and what they need. Put items needing a response today first. Combine advertisements and service notifications into one final line.

`--new` shows each message once: `max` saves its position and resumes from there on the next run. The first run covers the past 24 hours.

## Weekly work-chat report

Writes to MAX: **no**. Permit: `Bash(max messages list:*)`.

> Read the past 7 days in the Project Alpha chat: `max messages list "Проект Альфа"
> --after-time 7d --limit 200 --json`. If the response has `"hasMore": true`, continue reading. Report decisions, responsibilities and deadlines, and unanswered questions. Include the date and author for each item.

## Commitments and follow-ups

Writes to MAX: **no**. Permit: `Bash(max review:*)`, `Bash(max messages context:*)`, `Bash(max messages search:*)`.

> Run `max review --since-time <конец прошлого обзора> --transcribe --json` (without `--since-time`, it covers 3 days). Make three lists: what I owe, what I am waiting for, and what needs clarification. For each item, include its chat, date and supporting message IDs; include a deadline only if explicitly stated. Before calling anything overdue, check whether it was completed later or in work groups. If `"complete": false`, explain what is missing. End with the `--since-time` value for the next review and outstanding items.

For the next review, repeat the request and include previous outstanding items; the agent checks them first. In Claude Desktop and other MCP clients, use `/review` ([MCP prompts](./mcp.md#команды-и-чаты-по-)).

## People you have not answered

The shortest option is `max review --since-time 7d --unanswered --json`: unanswered questions addressed to you in direct chats, or to you and admins in groups. The broader recipe below also catches requests without a question mark.

Writes to MAX: **no**. Permit: `Bash(max chats list:*)`, `Bash(max messages list:*)`.

> Run `max chats list --kind dialog --limit 30 --json`. For each chat active in the past 7 days, read `max messages list <id чата> --limit 5 --json`. Show chats whose latest message is not mine and contains a question or request: who it is with, the topic and days elapsed.

## Drafting a reply

Writes to MAX: **only after your confirmation**. This recipe is for an interactive conversation, not a schedule.

> Read the last 20 messages with Ivan Petrov and suggest a reply to his latest question. Do not send it; show me the text.

Once you approve, the agent sends with `max messages send "Иван Петров" "…"`. An agent without a terminal connects through `max mcp --allow-send --confirm-send`: before every send, you see the chat and text and accept or decline ([MCP guide](./mcp.md)).

## A group you manage

Writes to MAX: **only as permitted by group rules**. Permit: `Bash(max review:*)`, `Bash(max chats events:*)`, `Bash(max chats members list:*)`, `Bash(max chats check:*)`.

> Run `max review --chat "Поход" --unanswered 4h --json` and `max chats check "Поход" --dry-run
> --json`. Briefly list who is waiting for answers, what the rule check found and its proposed actions. Do not delete anything; list the commands that would perform the actions if I approve.

See [Managing groups](./groups.md) for all scenarios and rules.

## Related collections

There are no ready-made MAX recipe collections yet. For Telegram:

- [Telegram MCP complete guide](https://mcp.directory/blog/telegram-mcp-complete-guide-2026) — morning inbox triage, reply drafts, channel summaries and cross-chat search. Prompts also work for `max` if tools are replaced with commands.
- [pioh/tg](https://github.com/pioh/tg) — Claude Code and Codex with a personal Telegram account: summaries every N minutes, “remind me if I have not replied to Mom in 15 minutes”, and watching people and chats.
- [Gorgias MCP cookbook](https://github.com/gorgias/mcp-cookbook) — support recipes with a useful structure: each states whether it writes anything and what to customize.
