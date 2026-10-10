---
title: "Managing your groups"
---

Use this page when you administer a MAX group and want help managing it. You will learn to find unanswered questions, inspect joins and who added members, summarise the week, handle spam under your rules and track membership history. By default, `max` flags violations; deleting a message or removing someone requires your permission.

These actions use your personal account in groups you administer. Terms used below:

- **Administrator** — a member permitted to manage a group. Some commands count only your replies and administrator replies.
- **Local archive** — messages saved on this computer. Reports and tasks see only downloaded history.
- **Task** — something awaiting you, such as an unanswered question. `max` opens and closes tasks locally.
- **Rules** — what `max chats moderate` checks, such as links or flooding, and which actions it may take.
- **Member snapshot** — a list saved on one day. Comparing snapshots shows joins and departures.

## What you can do

| Task | Command |
| --- | --- |
| Find questions that are waiting to be answered | `max review --unanswered` |
| See who joined, left, added or removed | `max chats events` |
| Sum up the week: decisions, promises, open questions | `max review --since-time 7d` |
| Keep a list of what's waiting for you | `max tasks list` |
| Remove spam according to your own rules | `max chats rules set`, `max chats moderate` |
| Replace leaked invitation link | `max chats link reset` |
| Let people in or turn them away | `max chats requests list\|accept\|decline` |
| View activity for the week | `max stats chats show` |
| Save list of participants every day | `max chats members fetch --track` |
| Find members who look like bots or spammers | `max chats members audit` |

The full list of commands for groups is [below](#что-можно). Details about each - [groups and channels in the user manual](./usage.md#группы-и-каналы); each option is in the [command reference](./commands.md).

## Working with an agent

An AI agent (such as Claude Code, Codex, Cursor, or Gemini CLI) can perform these checks for you. An agent with a terminal needs [max skill](https://github.com/WireCatLabs/max-cli/blob/v0.43.0/README.md#навык-для-агентов-с-терминалом); agent in an application without a terminal - [MCP server](./mcp.md). Below is your request, agent command and result.

<a id="an-admins-morning-who-needs-an-answer" />

### An admin's morning: who is waiting for an answer

Start with questions that have been waiting for you or the admins.

**Your request:**

> What in Поход has been waiting for an answer for more than four hours?

**Command:**

```sh
max review --chat "Поход" --unanswered 4h --json
```

**Example agent answer:**

> **3 questions are waiting for an answer.**
>
> | Person | Question | Waiting |
> | --- | --- | --- |
> | Lena | What time do we leave on Saturday? | 6 hours |
> | Sam | Are the tents shared? | 12 hours |
> | Ira | Who will bring the cooking pot? | 15 hours |
>
> Open a question to check the surrounding conversation.

These are `review` rules: a question mark outside a link, or a reply to you/an admin, can open a question. Your or an admin’s reply or next message can close it. The [statistics report](./rankings.md) counts linked direct answers and can give a different result.

<a id="this-weeks-new-members" />

### Newcomers this week

Review joining events. A new account is a reason to check, not proof of spam.

**Your request:**

> Who joined Поход this week? Show anyone worth reviewing.

**Command:**

```sh
max chats events "Поход" --type add --since-time 7d --json
```

**Example agent answer:**

> | Newcomer | How they joined |
> | --- | --- |
> | Kate | Added by Lena |
> | Oleg | Joined himself |
>
> Review Oleg’s available profile information before drawing conclusions. Account age alone is not grounds for removal.

Events cover available history only. The current member list can be checked separately.

### Link leaked

Change the invitation link only if you ask for it.

**Your request:**

> The invitation link to “Hike” has leaked. Replace it and allow only admins to add people.

**Replace link:**

```sh
max chats link reset "Поход" --json
```

**Limit adding participants:**

```sh
max chats update "Поход" --only-admins-add on --json
```

**Example agent answer:**

> | Setting | Result |
> | --- | --- |
> | Previous invitation link | Replaced |
> | Who may add members | Administrators only |
>
> The result includes the new link; share it only with people who need it.

These commands change the group. The example request authorises both changes; asking only to inspect a link does not.

### Removing spam with your confirmation

Preview what the rules propose before applying any action.

**Your request:**

> Check Поход for spam. Show the proposed actions first.

**Command:**

```sh
max chats moderate "Поход" --dry-run --json
```

**Example agent answer:**

> | Finding | Proposed action | Status |
> | --- | --- | --- |
> | Invite link | Delete the message | Preview only |
>
> Nothing was deleted. Confirm the specific message if you want to apply the action.

Applying an action requires your request and the profile's permissions. A preview does not authorise deletion.

<a id="a-weekly-group-summary" />

### A weekly report

Ask for a short recap of decisions, commitments and open questions.

**Your request:**

> Summarise the week in Поход.

**Command:**

```sh
max review --chat "Поход" --since-time 7d --json
```

**Example agent answer:**

> **Decided:** leave at 7:00 from the station.
>
> **Committed:**
>
> - Lena — food.
> - Sam — tents.
>
> **Still open:** who will bring the cooking pot.
>
> I can show the source messages if you want to verify the recap.

### Scheduled checks

No agent is required: moderation is an ordinary command. Run it twice a day, allowing deletion where the consent level is `ask`:

```cron
0 9,21 * * * max chats moderate "Поход" --allow-dangerous >> ~/max-check.log 2>&1
```

Without `--allow-dangerous` in cron, actions at level `ask` are just planned and waiting for you. The lines `PATH` and `XDG_RUNTIME_DIR`, without which `max` will not find Node and your login in cron, are in the section [how to run on a schedule](./recipes.md#как-запускать-по-расписанию).

## Available actions

| command | What does |
|---|---|
| `max review --chat <чат> --unanswered [длительность]` | questions that you and the admins did not answer within the specified time (for example, `4h`; default `24h`) |
| `max chats events <чат>` | who entered, left, who was added and removed, by whom; by default 7 days |
| `max chats members list <чат>` | page of participants from MAX (`--all` - all available, up to 5000): who is the owner and admins (immediately after `admins add` the role may be the same), when the account was created, when it was online |
| `max chats rules show\|set\|unset <чат>` | group rules |
| `max chats moderate <чат>` | checking according to the rules; does what the rules allow |
| `max chats members add\|remove`, `admins add\|remove` | members and admins |
| `max chats requests list <чат>` | applications to the channel with approval; admins see, application time is unknown |
| `max chats requests accept\|decline <чат> <человек>` | accept or reject one application; `--all` and `--link` are not supported |
| `max chats link show\|reset <чат>` | invitation link; `reset` - new, old stops working |
| `max chats inspect <ссылка>` | where the invitation or public link leads; does not enter anywhere |
| `max chats create`, `max chats join <ссылка>`, `max chats leave <чат>` | create a group, join via link, exit |
| `max chats update` | settings, title, description, photo, who can pin (`--all-can-pin`) and add people (`--only-admins-add`); read settings - `max chats show` |
| `max messages delete --for-everyone`, `pin`, `unpin` | delete for everyone, pin |

An agent connected via [MCP server](./mcp.md) can execute the same commands within the scope of profile rights.

Group-changing commands return `operationId` in JSON. After creating, joining, updating or resetting a link, the chat record is in `chat`. If the title or description changed but the settings request did not complete, the result is `outcome_unknown`. Read the group with `chats show` before retrying: the change may have applied partially.

## What needs your reply

`max review` maintains a task list in the local copy; `max serve` does not yet open tasks in MAX. An unanswered question or a message mentioning you by name opens a task; your reply closes it. A task links to the message without copying its text.

See what awaits you, the old ones on top, and then only questions and mentions in one group:

```sh
max tasks list --state open
```

```sh
max tasks list --chat "Поход" --type question,mention
```

Add something that the rules don't see, like your promise, or close a task that doesn't need to be answered:

```sh
max tasks add msg:max/<вы>/<чат>/<сообщение> --type promise
```

```sh
max tasks close <задача> --as dismissed --reason no-reply-needed
```

See open tasks by chat, the oldest and median time until closed:

```sh
max stats tasks show
```

A closed task stays closed and a dismissed task does not reappear. Only your reply closes the task; administrator replies are not yet counted, and an `@ник` mention is not detected. The same commands are available through MCP.

## Rules

Group rules define what `max chats moderate` checks and may do. Each group's rules stay on this computer and never go to MAX. The first `set` saves all rules with defaults. There is no background monitoring: checks happen only when `chats moderate` runs.

Show the rules. Before the first change, these are the default values, marked as unsaved:

```sh
max chats rules show "Поход"
```

Delete a message with a link:

```sh
max chats rules set "Поход" links delete
```

Block these people by number...

```sh
max chats rules set "Поход" blocked 12345,67890
```

...and delete them when they write or enter:

```sh
max chats rules set "Поход" blockedPeople remove
```

Delete without asking you:

```sh
max chats rules set "Поход" consent.delete allow
```

See what the test would do without doing anything:

```sh
max chats moderate "Поход" --dry-run
```

Check what's new from the last run and act:

```sh
max chats moderate "Поход"
```

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

Old files are read: `forbid` becomes `deny`, `flag` and `confirm` - `ask`. An agent connected via MCP operates only where the level is `allow`; level `ask` actions remain the plan for you, there are no server forms.

`chats moderate --json` returns `{ chatId, rows }`. `--since-time` accepts an ISO 8601 time or `30m`, `2h`, `1d`, not a message ID, and does not advance the saved position. The next-check position is stored with the rules; the old session position is migrated automatically before the first run. CLI and personal-account MCP share this position.

## Using a bot

An administrator bot in the group can run the same check: `max <бот> bot chats
moderate`. Unlike a personal account, it can ban removed users from returning through an invitation link. It cannot access account age. See [bot group checks](./bot.md#проверка-чата-по-правилам).

## Limitations

- **Personal accounts cannot ban.** A removed member can return through an invite link. Reset the link (`max chats link reset`) or use a bot check, which can ban.
- **Join requests exist only for a channel with approval.** A closed group has no approval: people join through the link immediately. In a channel with approval, `chats join` only sends a request (`requested: true`). `chats requests list` does not show when a person asked to join: MAX does not report it. You cannot answer all requests at once or select requests by link.
- **At most 10 actions per check** (`--max-actions`). Deletions count toward the hourly send limit; once it is reached, remaining actions wait for the next check.
- **Up to 1,000 messages per CLI check.** If there are more, the next check continues from that position.
- **One join means reading the full member list.** To find a new member's account age, the check reads every member; in a large group this can require dozens of MAX requests.
- **Nothing monitors the group automatically.** A check runs only when started by you, by an agent at your request, or by a schedule you set up.

## Statistics for group administrators

See the week’s messages, people who wrote and replies. For questions about who answers, who needs help and whether newcomers stay, open [Statistics](./rankings.md).

**Your request:**

> Show Поход’s activity this week and point out gaps in the history.

**Command:**

```sh
max stats chats show "Поход" --since-time 7d --offline --json
```

**Example agent answer:**

> | Metric | In available history |
> | --- | ---: |
> | Messages | 120 |
> | People who wrote | 18 |
> | Replies | 30 |
>
> History is incomplete: these are observed counts. This local request did not fetch joining or leaving events.

Without `--offline`, the CLI also fetches joining and leaving events. Saved daily member observations remain available locally. The first report cannot reconstruct past member lists.

### Member snapshots

`max chats members fetch` reads participants into a local copy: saves their profiles, changes, number of participants per day and the result of the completeness check. `--budget` limits the number of pages. If the list is incomplete, no one is recorded as having left: this requires the entire available list and a known number of group members, not exceeding the number of people read. In MAX, lists are often partial; increasing the budget only helps where the server actually serves the remaining pages.

<a id="ежедневная-история-состава"></a>

To collect the lineup every day, add the group to the watch list: `max chats tracking add <группа>` (does not read participants right away) or `max chats members fetch <группа> --track`. While `max server` is running, it receives the composition of the monitored groups: the first time a minute after connecting, then once a day. If the composition is already saved today in UTC, including an incomplete response, the automatic receipt is skipped; You can repeat it manually via `max chats members fetch <группа>`.

Tracking does not start the server or prolong its idle timeout: for daily history, keep `max server` running at all times. `max chats tracking list` shows the groups being monitored and the last number of participants saved; `show` - group status and snapshots of the number of participants over the last 30 days. `max chats tracking remove <группа>` stops automatic receiving; the accumulated history remains accessible through `max chats members history`.

`max chats members history` lists saved joins, departures and profile changes chronologically; `--since-time` limits the period. It never contacts MAX. A join uses MAX's timestamp when available, otherwise first observation. Departure time is the first complete snapshot missing the person, rather than their exact departure. The initial list does not mean everyone joined that day. `chats members list --offline` shows the latest complete saved membership; partial reads do not replace it. Without a complete snapshot, the list can be empty even when individual profiles and events exist. Profiles and history remain beside messages in the local archive.

`max chats members audit` reads members and shows signals of suspicious accounts. `--budget` limits pages, and `--min-score` sets the minimum score. This is a hint for human review: nobody is removed, administrators and the owner are excluded, `more` means an incomplete list, and `unknown` means unknown signals. MAX does not provide every Telegram signal. This check is unavailable with `--offline`. “Never wrote” means no messages from the person were found in local history; it does not prove they never posted in the group.

`--deep <n>` additionally checks the first n members in full, one per second: their profile and up to 1000 saved messages each. Public spammer lists cover only Telegram accounts, so they are not queried for MAX, as the response explains.

### Weekly report for your group

“Hike” below is a fictitious example group. First, download its messages via `store fetch`, if they are not already in a local copy, then save the current composition and prepare a report:

```sh
max chats tracking add "Поход" --json
```

```sh
max chats members fetch "Поход" --json
```

```sh
max stats chats show "Поход" --since-time 7d --by day --timezone Europe/Madrid --json
```

```sh
max chats members history "Поход" --since-time 7d --offline --json
```

```sh
max chats tracking show "Поход" --offline --json
```

```sh
max chats members audit "Поход" --json
```

Ask the agent to report message and active-sender counts, unanswered questions, membership changes and days with member snapshots. Keep incompleteness indicators in the report: `complete`, `more`, `unknown` and missing daily snapshots. Repeat membership collection for the next report; the first report cannot show departures before the first saved membership list.
