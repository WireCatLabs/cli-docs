---
title: "Recipes: your agent and your conversations"
---

Use these recipes for recurring MAX tasks with your AI agent, such as unread summaries, chat reports, commitments, unanswered requests and group checks. Each includes a ready-made request, a command and whether it changes MAX. You will learn to schedule tasks and set restrictions enforced by `max`.

Terms used below:

- **Agent** — your AI agent running commands on this computer.
- **Skill** — instructions for using `max`; `max skill install` puts them where the agent looks.
- **MCP client** — an agent application without terminal access, such as Claude Desktop; it calls `max mcp` tools instead of commands.
- **Noninteractive mode** — the agent receives one request, executes it and exits: Claude Code `-p` or `codex exec`.
- **cron** — the Linux/macOS scheduler running commands at specified times.

## What you can do

| Recipe | Writes to MAX | Suitable for schedule |
|---|---|---|
| [Morning Brief](#утренняя-сводка) | no | yes |
| [Weekly work chat report](#недельный-отчёт-по-рабочему-чату) | no | yes |
| [Who owes whom](#кто-кому-должен) | no | yes |
| [To whom you did not answer](#кому-вы-не-ответили) | no | yes |
| [Find what was said](#найти-что-было-сказано) | no | yes |
| [Draft answer](#черновик-ответа) | only after your “yes” | no |
| [Group you lead](#группа-которую-вы-ведёте) | only if allowed by group rules | yes |

## One-time setup

1. Install `max` and log in: see [installation](./installation.md) and [login and sessions](./sessions.md).
2. Install the skill for your agent:

   ```sh
   max skill install
   ```

The skill goes to Claude Code (`~/.claude/skills/max-cli/`) and Codex/Gemini CLI (`~/.agents/skills/max-cli/`). `max skill show` prints it for agents using other locations.

3. Save recipe requests in files, such as `~/max-recipes/`. The schedules below read those files.

The MCP client does not need the skill. Connect the MCP server (`max mcp config` prints an entry for its settings) and call the ready-made commands - `/catch-up`, `/review`, `/reply`, `/find`. See [ready command MCP servers](./mcp.md#команды-и-чаты-по-).

## Agent permissions

A scheduled agent runs while you are away. Set restrictions in configuration the agent cannot edit: a request such as “send nothing” can be misinterpreted, whereas the tool enforces its permissions.

**Prohibition at the agent level.** This is a setting for the agent itself. For example, Claude Code in `-p` mode only runs the command from `--allowedTools`. If `max messages send` is not in the list, the agent cannot call it:

```sh
claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
```

Codex does not have such a list. Its sandbox by default closes the network and file writing, and `max` needs both: connect to MAX and save what it reads to its copy. Therefore, Codex starts with `--sandbox danger-full-access`, and sending is limited by the `max` settings below.

**Restrictions in `max`** apply to every agent:

```sh
for resource in messages reactions polls topics chats contacts account bot conversations; do
  max config set "permissions.$resource" readonly
done
max config show                       # проверить эффективные права
max config set sendsPerHour 5          # или: не больше пяти сообщений в час
max recipients add "Иван Петров"       # и писать только в эти чаты
```

`readonly` restricts only its named resource: restricting `messages` does not block reactions, voting or chat changes. The loop sets every resource. A more specific key such as `permissions.messages.send: allow` takes precedence; remove such allowances for a read-only profile. After migration, legacy `readOnly` cannot be changed.

`permissions` also affects your own commands until removed with `max config unset permissions.<ресурс>`, restoring inherited settings and defaults. Use a separate profile to restrict only the agent. `max sends list` records every send attempt, including rejected ones. See [send protections](./security.md#защита-от-отправки-не-туда) and [permissions](./configuration-reference.md#права-доступа).

**Reading does not reveal your activity.** None of the commands below marks messages read, so other people do not see that the agent opened the chat.

## Scheduling

- **Claude Desktop - scheduled tasks.** The task runs on your computer, so `max` and your login are available to it. The skipped run (the computer was sleeping) is executed once after waking up. See [Claude scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks).
- **cron and `claude -p`.** Without an application, on any computer that is turned on at this time:

  ```cron
  30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)" >> ~/max-recipes/morning.log 2>&1
  ```

Cron jobs run in an almost empty environment. On Linux this breaks `max` in two ways:

- **`node: not found`, code 127.** The Node supplied via nvm, fnm or Volta is not in the system `PATH`, and cron knows only the system one.
  - **`no token found for profile "default", although it has logged in on this machine`, code 4.** `max` cannot reach the system password storage and does not see the token. **Don't login again**: login is fine, it's a matter of the environment.

Both lines go to the beginning of `crontab -e`, with their own values. The folder is from `dirname "$(which node)"`, the number is from `id -u`:

  ```cron
  PATH=/home/ivan/.nvm/versions/node/v24.19.0/bin:/home/ivan/.local/bin:/usr/local/bin:/usr/bin:/bin
  XDG_RUNTIME_DIR=/run/user/1000
  ```

The password store is available while you are logged in. Check the first run with your hands and look in the log. See [Claude's noninteractive mode](https://code.claude.com/docs/en/headless).

- **Cron with `codex exec`.** The equivalent for Codex:

  ```cron
  30 8 * * * codex exec --sandbox danger-full-access "$(cat ~/max-recipes/morning.md)" >> ~/max-recipes/morning.log 2>&1
  ```

See [Codex noninteractive mode](https://learn.chatgpt.com/docs/non-interactive-mode).
- **Inside an open session Claude Code** - `/loop` or “remind me at 15:00”. Works while the session is open. See [Claude Code Scheduled Tasks](https://code.claude.com/docs/en/scheduled-tasks).

Claude's cloud tasks (routines) are not suitable: they are executed on another computer where `max` and your login do not exist.

## Morning summary

Writes to MAX: **no**. Permit: `Bash(max inbox:*)`.

> Run `max inbox --new --json`. Group messages by chat. Give each chat one line: who is writing and what they need. Put items needing a response today first. Combine advertisements and service notifications into one final line.

`--new` shows each message once. `max` remembers where it left off in each chat, and the next run starts from that place. The very first run looks at the last 24 hours.

### Where “new” starts

- `max inbox` — unread messages, as MAX counts them: everything you have not opened on any device.
- `max inbox --new` — since the previous `--new` run. Only `max` knows this point; your contacts do not see it.
- `max inbox --since-time 2d` — the past two days; the saved point does not move.

None of them mark messages as read. If needed, add `--mark-read` or enable `catchUpMarksRead` in [settings](./configuration.md). Then the interlocutor will see what you have read.

### Direct chats, groups and channels separately

`--kind` leaves only chats of the required type: `dialog` - personal, `group` - groups, `channel` - channels. The channel summary and conversation summary can be run separately, at different times. Each chat has its own point, and one run does not hide what the other has not yet shown:

```cron
30 8 * * * claude -p "$(cat ~/max-recipes/morning.md)" --allowedTools "Bash(max inbox:*)"
0 19 * * * claude -p "$(cat ~/max-recipes/news.md)" --allowedTools "Bash(max inbox:*)"
```

`morning.md` contains `max inbox --new --kind dialog,group --json`; `news.md` contains `max inbox --new --kind channel --json` and a request to pick out the main points. Without `--kind`, everything comes together.

## Weekly work-chat report

Writes to MAX: **no**. Permit: `Bash(max messages list:*)`.

> Read the past 7 days in the Project Alpha chat: `max messages list "Проект Альфа"
> --after-time 7d --limit 200 --json`. If the response has `"hasMore": true`, continue reading. Report decisions, responsibilities and deadlines, and unanswered questions. Include the date and author for each item.

## Commitments and follow-ups

Writes to MAX: **no**. Permit: `Bash(max review:*)`, `Bash(max messages context:*)`, `Bash(max search messages:*)`.

> Run `max review --new --transcribe --json` (initially the past 3 days, then since each chat's previous `--new`). Group what I owe, replies I await and matters to clarify. Include chat, date and source message ids; give a deadline only when stated. Before calling something overdue, check later messages and work groups for completion. If `"complete": false`, explain missing coverage. Finish with unresolved items.

`--transcribe` first translates voice messages into text; this may take minutes. The next review is the same request plus unclosed items from the past: the agent will check them first. A chat that has not been read in full will save its point and come again. In the MCP client this is command `/review`.

## People you have not answered

The shortest option is `max review --since-time 7d --unanswered --json`: unanswered questions addressed to you in direct chats, or to you and admins in groups. The broader recipe below also catches requests without a question mark.

Writes to MAX: **no**. Permit: `Bash(max chats list:*)`, `Bash(max messages list:*)`.

> Run `max chats list --kind dialog --limit 30 --json`. For each chat active in the past 7 days, read `max messages list <id чата> --limit 5 --json`. Show chats whose latest message is not mine and contains a question or request: who it is with, the topic and days elapsed.

## Find what was said

Writes to MAX: **no**. Allow: `Bash(max search messages:*)`, `Bash(max messages context:*)`.

> Find invoice messages using `max search messages счёт --json`. For each match, read `max messages context <locator> --json` and explain who said what and when.

By default, the search is carried out both on the copy on this computer and on the MAX server. The local copy contains only what `max` has already saved. To search your entire chat history locally, first download it. This is a request from your account, so make it yourself: `max store fetch <чат>`. See [download history](./archive.md#скачать-историю).

## Drafting a reply

Writes to MAX: **only after your confirmation**. This recipe is for an interactive conversation, not a schedule.

> Read the last 20 messages with Ivan Petrov and suggest a reply to his latest question. Do not send it; show me the text.

When you agree, the agent sends himself: `max messages send "Иван Петров" "…"`. The MCP client connects via `max mcp`. Don't let the client pre-approve `max_write` and he will ask you before every submission. The profile rights still limit the recording. See [MCP Server](./mcp.md).

## A group you manage

Writes to MAX: **only as permitted by group rules**. Permit: `Bash(max review:*)`, `Bash(max chats events:*)`, `Bash(max chats members list:*)`, `Bash(max chats moderate:*)`.

> Run `max review --chat "Поход" --unanswered 4h --json`, `max chats events "Поход" --since-time
7d --json` and `max chats moderate "Поход" --dry-run --json`. Summarise questions awaiting replies, authors and waiting times; joins/additions this week and who added them; and rule violations with proposed actions. Send no replies and remove nobody: list commands for my approval.

With `--dry-run` command `chats moderate` only makes a plan. Without it, it acts within the group rules, so remove `Bash(max chats moderate:*)` from the list if the agent should never act. All scenarios and rules are [groups that you lead](./groups.md).

## Related collections

There are no ready-made recipes for MAX yet. For Telegram there is; their requests are also suitable for `max`, if you replace the tools with command:

- [Telegram MCP: complete guide](https://mcp.directory/blog/telegram-mcp-complete-guide-2026) - morning analysis of incoming messages, draft replies, channel summary, search in several chats.
- [pioh/tg](https://github.com/pioh/tg) - AI agent with a personal Telegram account: summary once every N minutes, “remind me if I haven’t answered my mom in 15 minutes,” monitoring people and chats.
- [Gorgias MCP cookbook](https://github.com/gorgias/mcp-cookbook) - recipes for the support service, but well organized: everyone is told whether he is writing something, and what to correct for himself.
