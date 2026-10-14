---
title: "Tasks"
description: "Questions, requests and promises from your chats, kept as tasks your agent can plan, link and close."
---

A task is one thing that waits on you: a question nobody answered, a request, a promise you made.
This page helps you keep those things from getting lost in your chats. After reading it, you can ask
your agent for today's agenda, turn a message into a task, link the messages that belong to it and
close it when it is done. Tasks stay on your computer, in the local store of `tg`, `max` and `memo`.
Nothing on this page sends a message.

The sections marked **Planned** describe work that is designed but not available yet: categories,
labels, keys per type, claiming and the duplicate check. [How tasks work](./tasks-architecture.mdx)
gives the technical detail.

## Where tasks come from

- **Rules find them in messages.** A question that nobody answered becomes a task of type `question`.
  A message that mentions you becomes a `mention` task; the messenger must mark the mention, a typed
  name alone is not seen. An auto-reply rule with the `task` action opens a `request` task for each
  matching message ([Telegram](./tg/replies.md), [MAX](./max/replies.md)). The rules run when your
  agent reviews your chats and while the tool runs in the background (`review` and `serve`).
- **Your agent or you add them.** A promise ("I will send the contract on Monday") or a request that
  no rule caught is added by hand, with type `promise` or `request`.
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
tg personal tasks list --chat "Renovation" --state open
```

Add a task for a message, then plan it:

```sh
tg personal tasks add msg:telegram/1/77/42 --type promise --title "Send Bob Sample the signed contract" --due 3d
tg personal tasks plan <task> --description "Done when Bob confirms he has it." --check 2d
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

`<task>` is the task's key, as `tasks agenda` prints it, or its full id. `max` has the
same commands.

</details>

- **agenda** lists tasks that are overdue, due soon or due for a check, then chats where you owe an
  answer and chats where you wait for one. It warns when the store has not saved anything for a while.
- **plan** sets the title, the description, the due date and the next check. The next check is when
  your agent should look at the task again; it does not remind you.
- **link** adds messages, chats, people, documents, notes or addresses to a task.
- **show** prints one task with its plan and everything linked to it.
- **close** closes a task as `done` or `dismissed`. A closed task stays closed.

## Relations between project tasks

One project task can wait for another (`blocked-by`), continue another (`follow-up-of`) or simply
relate to it (`related-to`). Only you apply these relations; an agent can suggest them. Today they
work between project tasks in `memo`: see [What to do first](./memo/tasks.md#what-to-do-first).

## How your agent works with tasks after a sync

1. Your agent fetches new messages (`messages sync`).
2. It runs a review, so the rules open and close tasks.
3. It reads the agenda and checks each new task against its messages.
4. It sets a title and a due date, links the messages that belong together, and closes what is done.
5. It shows you what it changed and asks before anything leaves your computer.

**Planned:** `sync` itself will run the rules, from where the last run stopped, and report how many
tasks it opened, attached to an existing task or sent to the review list.

## Planned: no duplicate tasks

The same request often comes in several messages: "can you send the invoice?", then "the invoice for
15 000, please", then a reminder two days later. These must stay one task. The tool will check each
new task before it creates it:

- **Sure it is the same task:** this happens only when the same rule already made a task for the
  same message. Nothing new is made, and the answer says which task and why.
- **Not sure:** the tool does not guess. When your agent adds the task, the tool refuses and lists up
  to five similar tasks with the reasons ("same person, same amount"). The agent chooses to attach the
  message to one of them or to make a new task. When a rule finds the task, the pair goes to a review
  list for your agent or you.
- **Clearly different:** a new task is made.

The check compares words (including other forms of a word and typos), the person, the amount of
money, the due date, the category, replies and the time. A chat alone never makes two tasks "the
same". **The tool never merges tasks on its own.** Some similar tasks, such as a gift for mum and a
gift for dad with the same amount, differ in one word's meaning, so your agent or you decide.

On the review list you merge a pair or mark it as different. A merge moves the messages to the kept
task and closes the other one as a duplicate. **A merge can be undone**, and nothing is deleted.

```text
tasks duplicates
tasks merge REQ-23 --into REQ-22
tasks duplicates reject REQ-23 REQ-22
tasks unmerge REQ-23
```

## Planned: categories, labels and keys

- **A category** says what a task is about: `money`, `documents`, `meeting`, `delivery`, `access`,
  `personal` or `other`. The list is fixed in the settings, so "finance" and "payments" never live
  side by side. A rule picks the category from the words of the message; your agent corrects it.
- **Labels** such as `urgent` or `waiting-for-them` are free words for filtering.
- **Keys per type:** a task found in a message gets a short key, such as `Q-15` for a question,
  `REQ-22` for a request, `M-7` for a mention or `PR-4` for a promise. A key never changes, so you can
  quote it in a chat or a note.

```text
tasks add msg:telegram/1/77/42 --type request --category money
tasks categories
tasks agenda --category money --label urgent
```

## Planned: claiming a task

When two agents, or an agent and you, work at the same time, one of them claims a task first. The
claim ends by itself after 30 minutes, so a stopped agent never blocks a task. Closing a task ends
its claim. The agenda hides tasks that someone else claimed.

```text
tasks claim REQ-22 --for 30m
tasks release REQ-22
```

## Related pages

- [How tasks work](./tasks-architecture.mdx): the data, the keys, claiming and the duplicate check
  step by step.
- [Tasks and reminders in Memo](./memo/tasks.md): project tasks, assignees and reminders.
- [Searching](./search.md): find the messages a task is about.
