---
title: "Tasks"
description: "Questions, requests and promises from your chats, kept as tasks your agent can plan, link and close."
---

A task is one thing that waits on you: a question nobody answered, a request, a promise you made.
This page helps you keep those things from getting lost in your chats. After reading it, you can ask
your agent for today's agenda, turn a message into a task, link the messages that belong to it and
close it when it is done. Tasks stay on your computer, in the local store of `tg`, `max` and `memo`.
Nothing on this page sends a message.

Categories, tags on tasks, keys per type, claiming and the duplicate check are built in the shared
core of the tools (cli-core). `tg` and `max` have all of them; `memo` does not have claiming and the
duplicate review yet.
Closes that wait for you when an agent is unsure, follow-up tasks, the list of 59 categories and the
duplicate check that reads linked messages are in `tg` and `max`; `memo` does not have them yet.
Only `tg` reads the category list from the shared settings file so far.
[How tasks work](./tasks-architecture.mdx) gives the technical detail.

## Where tasks come from

- **Rules find them in messages.** A question that nobody answered becomes a task of type `question`.
  A message that mentions you becomes a `mention` task; the messenger must mark the mention, a typed
  name alone is not seen. An auto-reply rule with the `task` action opens a `request` task for each
  matching message ([Telegram](./tg/replies.md), [MAX](./max/replies.md)). The rules run when your
  agent syncs or reviews your chats, and while the tool runs in the background (`messages sync`,
  `review` and `serve`). A rule picks the task's category from the words of the message.
- **Your agent or you add them.** A promise ("I will send the contract on Monday") or a request that
  no rule caught is added by hand, with type `promise` or `request` and a category.
- **Project tasks** live in a project and have a key: the project's key and a number, such as
  `HRB-12`. Their types are `chore`, `bug` and `feature`. You make them with `memo`; see
  [Tasks and reminders in Memo](./memo/tasks.md).

A rule closes a `question` or `mention` task when you answer it in the chat. Adding a task for a
message that already has one gives back the existing task.

## Ask your agent

```text prompt
Use tg CLI. Sync my chats, then show my task agenda: what is overdue, what is due today and which chats wait for my answer. For each task, show the messages it came from. Don't send anything.
```

You should get a short list: open tasks with their due dates, and chats where someone wrote last.
Each task points to its messages, so you can check why it exists. For MAX, write "max CLI".

```text prompt
Use tg CLI. In my chat with Bob Sample, I promised to send the signed contract by Friday. Add a promise task for that message, due Friday, with a clear title. Link the earlier messages where we agreed the price.
```

```text prompt
Use tg CLI. Show me the tasks an agent suggested closing, with its reason and how sure it was. Don't close or reject anything yet.
```

```text prompt
Use tg CLI. Go through the list of tasks that may be duplicates. Merge the pairs that are clearly one job, reject the ones that are clearly different, and mark the rest unsure. Then show me only the unsure pairs.
```

## One task, many messages

A task starts from one message, its source. Later messages about the same thing are linked to it,
so the task holds the whole story. A link has a kind: `related-to` (the default), `evidence` (the
message shows the task is real) or `created-from`. A task can also point to a chat, a person, a
document, a note or a web address.

A chat can hold many tasks. Three different questions from Alice Example in one group are three
tasks. A task is about one thing, not about one chat or one person.

## Commands

<details>
<summary>Optional: commands for the terminal</summary>

What needs a look today:

```sh
tg personal tasks agenda
max personal tasks agenda
```

Open tasks of one chat:

```sh
tg personal tasks list 'chat:"Renovation" state:open'
```

Add a task for a message, then plan it:

```sh
tg personal tasks add msg:telegram/1/77/42 --type promise --category documents --title "Send Bob Sample the signed contract" --due 3d
tg personal tasks plan <task> --description "Done when Bob confirms he has it." --remind-time 2d
```

Link more messages, then see everything in one place:

```sh
tg personal tasks link <task> msg:telegram/1/77/45 msg:telegram/1/77/51 --kind evidence
tg personal tasks show <task>
```

Close it:

```sh
tg personal tasks close <task> --as done --reason "contract sent"
tg personal tasks close <task> --as dismissed --reason no-reply-needed
```

See the closes an agent suggested, then confirm or refuse one:

```sh
tg personal tasks list close:suggested
tg personal tasks close <task>
tg personal tasks reject <task>
```

`<task>` is the task's key, as `tasks agenda` prints it, or its full id. `max` has the same commands, including suggested closes.

</details>

- **agenda** lists tasks that are overdue, due soon or due for a check, then chats where you owe an
  answer and chats where you wait for one. It warns when the store has not saved anything for a while.
- **add** needs a type. It also needs a category (`--category`), and it
  refuses when a similar task exists; see [No duplicate tasks](#no-duplicate-tasks).
- **plan** sets the title, the description, the due date and the next check. The next check is when
  your agent should look at the task again; it does not remind you.
- **link** adds messages, chats, people, documents, notes or addresses to a task.
- **show** prints one task with its plan and everything linked to it.
- **close** closes a task as `done` or `dismissed`. A closed task stays closed. Only `tasks unmerge`
  reopens a task, and only one that a merge closed. An agent's close may wait for you; see
  [When an agent closes a task](#when-an-agent-closes-a-task).
- **reject** refuses a close that an agent suggested. The task stays open.

## Relations between tasks

One project task can wait for another (`blocked-by`), continue another (`follow-up-of`) or simply
relate to it (`related-to`). Only you apply these relations; an agent can suggest them. They work
between project tasks in `memo`: see [What to do first](./memo/tasks.md#what-to-do-first).

The tool also writes `follow-up-of` itself between tasks found in messages: a new task about a task
closed in the last 14 days is linked to it as a follow-up (see [No duplicate tasks](#no-duplicate-tasks)).

Two more kinds exist. `duplicate-of` says that a task is the same job as another. A merge writes it,
and it joins tasks found in messages of one account. `discovered-from` says that a task was found
while working on another.

## How your agent works with tasks after a sync

1. Your agent fetches new messages (`messages sync`). The sync runs the task rules on what it stored,
   from where the last run stopped. The first run reads only chats with a message in the last 14 days,
   so old questions do not become tasks. The answer says how many tasks were opened, how many were
   closed and how many went to the review list.
2. It reads the agenda and checks each new task against its messages.
3. It sets a title, a due date and the right category, links the messages that belong together, and
   closes what is done. When it is not sure that a task is done, its close waits for you.
4. It goes through the review list of possible duplicates (see below).
5. It shows you what it changed and asks before anything leaves your computer.

## When an agent closes a task

Both `tg` and `max` support this. In `memo`, an agent's close still closes the task.

An agent that closes a task says how sure it is that nothing more is needed, as a number from 0 to 1
(`--certainty`). At or above the store's threshold (0.8 by default), the task closes. Below it, the
task stays open with a close suggestion: which agent made it, how sure it was and why. The agenda
lists these tasks, and `tasks list close:suggested` finds them. You confirm a suggestion with
`tasks close <task>`, or refuse it with `tasks reject <task>`; the agent may suggest closing it again
later. A close cannot be undone, so an unsure one waits for you.

Two settings for the whole store control this: `task_agent_close` (`on` by default; `off` makes every
agent close a suggestion) and `task_agent_close_min` (0.8 by default).

The tool knows that an agent runs it from the `AI_AGENT` or `CLAUDECODE` environment variable. An
agent's close without `--certainty` is refused with `task.certainty-required`. When you asked the agent
to close a task, it closes it as you with `--as-owner`. A rule that closes a question you answered in
the chat is not an agent close and needs no certainty.

```text
tasks close REQ-22 --as done --certainty 0.9 --reason "invoice sent"
tasks list close:suggested
tasks close REQ-22
tasks reject REQ-22
config set task_agent_close_min 0.9
config set task_agent_close off
```

## No duplicate tasks

The same request often comes in several messages: "can you send the invoice?", then "the invoice for
15 000, please", then a reminder two days later. These must stay one task. The tool checks each
new task before it creates it:

- **Sure it is the same task:** this happens only when the same message already has a task of that
  type. A rule also opens nothing for a message that is linked to a task as `evidence`. Nothing new
  is made, and the answer shows that task.
- **Not sure:** the tool does not guess. When your agent adds the task, `tasks add` refuses and lists
  up to five similar tasks with the reasons ("same person, same amount"). The agent repeats the
  command with `--into <task>` to link the message to one of them, or with `--new` to make a new
  task. When a rule finds the task, the task is made and the similar pairs go to a review list.
- **Clearly different:** a new task is made.
- **Like a task closed in the last 14 days:** a new task is made and linked `follow-up-of` the closed
  one. The closed task stays closed. `tasks add` refuses only while an open task may be the same job.

The check compares words (including other forms of a word and typos), the person, the amount of
money, the due date, the category, replies and the time. It reads each task's title and description,
its source message and its 5 newest linked messages, so a task that a rule opened with an empty title
is compared by its message. It reads due dates in English, Russian and Spanish, such as `by Friday`,
`до пятницы` or `el viernes`. A chat alone never makes two tasks "the
same". **The tool never merges tasks on a score alone.** Some similar tasks, such as a gift for mum
and a gift for dad with the same amount, differ in one word's meaning, so an agent or you decide.

**Who decides.** The agent that reviews your chats after a sync goes through the review list. It
merges the pairs that are one job and rejects the pairs that are not. When it cannot tell, it marks
the pair unsure. You see only the unsure pairs, with `tasks duplicates decision:unsure`.

When you or your agent link a message to a task (`tasks link`, `tasks add --into` or `tasks merge`), the
check runs again for that task. New possible pairs go to the review list. The link always stays.

A merge links every message of the duplicate to the kept task and closes the duplicate as
`dismissed`, with a `duplicate-of` relation. **A merge can be undone**, and nothing is deleted. A
rejected pair does not come back.

```text
tasks related REQ-23
tasks duplicates
tasks merge REQ-23 --into REQ-22
tasks duplicates reject REQ-23 REQ-22
tasks duplicates defer REQ-23 REQ-22
tasks duplicates decision:unsure
tasks unmerge REQ-23
```

`tasks related` shows the tasks that may be the same job as one task, best first, each with a band
(`likely`, `maybe` or `different`) and the reasons. It changes nothing.

## Categories, tags and keys

- **A category** says what a task is about. The default list has 59 categories: narrow ones such as
  `taxes`, `bills`, `health`, `travel` and `fitness` come first, broad ones such as `money`,
  `documents` and `meeting` after them, and `work`, `personal` and `other` last. `tasks categories`
  prints each one with its meaning and its words. `tasks add` needs a category, and refuses a name
  that is not on the list. A rule picks the category from the words of the message, the narrower one
  when two fit (a utility bill is `bills`, not `money`), or `other` when no word matches; your agent
  corrects it with `tasks plan --category`.
- **One list in a shared settings file.** `tg` reads your changes to the list from
  `~/.config/WireCat/config.json`, section `task_categories`. This file is not a profile's settings
  file, so the list is the same in every profile, and "finance" and "payments" never live side by
  side. `max` and `memo` do not read this file yet. They use a list saved in the store, or their own
  default list: `max` has the same 59 categories, and `memo` still has the earlier seven (`money`,
  `documents`, `meeting`, `delivery`, `access`, `personal` and `other`).
- **You can change the list.** Each category has a meaning and the words a rule picks it by. A word
  matches its other forms too; a word can name its language, such as `es:vuelo`, and a Spanish word
  such as `es:pagar` then also matches `pagues` in a Spanish message. You can add or change a category,
  remove one, or go back to the default list; a list holds up to 80 categories. `other` cannot be
  removed. The file holds only your changes, so categories that a later release adds still arrive.
  `tasks categories` names the file in `file`, and `config show` marks the categories that come from
  it. A file that is not valid JSON, or names a bad category, is refused with its path.
- **A list saved in the store moves to the file.** A list that `tg` saved in the store before it used
  the file still applies. The next `config set` or `config unset` of a category moves it into the file
  and removes it from the store; after that, `max` and `memo` use their own default list again.
  `config unset task_categories` removes the section from the file and gives the current default list.
- **A category that left the list.** Tasks keep their category when it leaves the list.
  `tasks categories` names such categories under `unlisted`, with their open and total tasks, and
  `tasks agenda` names the ones open tasks still carry (`unlisted_categories`). Find their tasks with
  `tasks list category:<name>`, and move one with `tasks plan <task> --category <name>`.
- **Tags** such as `urgent` or `waiting-for-them` work on tasks too: `tags add urgent --task REQ-22`.
  Tags are for filtering only; the duplicate check ignores them.
- **Keys per type:** a task found in a message gets a short key, such as `Q-15` for a question,
  `REQ-22` for a request, `M-7` for a mention or `PR-4` for a promise. A key never changes, so you can
  quote it in a chat or a note. Older tasks keep their key, such as `IN1A2B3C4D-17`; both kinds of key
  and the full id keep working.

```text
tasks add msg:telegram/1/77/42 --type request --category money
tasks categories
tasks agenda category:money tag:urgent
tasks list category:money
tasks plan REQ-22 --category bills
config set task_categories.travel "trips and tickets | flight, hotel, es:vuelo"
config unset task_categories.travel
config unset task_categories
config show
```

In `tg`, you can also edit the file yourself. A name with its meaning and words adds or replaces a
category, and `null` removes a default one:

```json
{
  "task_categories": {
    "garden": "plants | seedling, es:planta",
    "religion": null
  }
}
```

The `config set task_categories…` and `config unset task_categories…` commands write the same file
and keep its other sections. No `config` command on this page changes one profile: the task settings
in [When an agent closes a task](#when-an-agent-closes-a-task) stay in the store.

## Claiming a task

When two agents, or an agent and you, work at the same time, one of them claims a task first. The
claim ends by itself after 30 minutes, so a stopped agent never blocks a task. Claiming again extends
your own claim. Closing a task ends its claim. The agenda shows who holds each task and hides tasks
that someone else claimed; `tasks agenda claimed:any` shows them too. You, the owner, can release any
claim.

The holder is one agent session. The tool takes the first of these that is set:

1. `--holder <name>`
2. the `WIRECAT_HOLDER` environment variable
3. `claude-code:<session id>`, from the `CLAUDE_CODE_SESSION_ID` variable that Claude Code sets
4. the agent's name, from the `AI_AGENT` variable
5. `owner`

An agent with no session variable, such as a web agent, passes its chat id with `--holder`.

```text
tasks claim REQ-22 --lease 30m
tasks release REQ-22
tasks agenda claimed:any
```

Agents that use the MCP server have the same tools, such as `tasks_claim`, `tasks_release`,
`tasks_categories`, `tasks_related`, `tasks_duplicates`, `tasks_merge` and `tasks_unmerge`.
In `tg`, `tasks_close` needs `certainty`, as an agent's `tasks close` does.

## Not built yet

- **Tuning the weights from your answers.** Every merge, rejection, `--into` and `--new` is kept,
  but nothing uses them yet to change the weights.

## Related pages

- [How tasks work](./tasks-architecture.mdx): the data, the keys, claiming and the duplicate check
  step by step.
- [Tasks and reminders in Memo](./memo/tasks.md): project tasks, assignees and reminders.
- [Searching](./search.md): find the messages a task is about.
