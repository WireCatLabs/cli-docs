---
title: "How to phrase requests"
description: "Prompts for search, meeting context, contacts, files, drafts and reminders."
---

Tell the agent what you want to find or accomplish. It should choose commands and arguments from
the installed CLI's skill and help; you do not need to write a command sequence in every prompt.
See [First tasks](./first-tasks.md) for full dialogues and examples of the underlying commands.

## Add detail when it changes the result

Use **task + scope + period + output + allowed actions** as a checklist, not a required form.

| Detail | Example | When it helps |
|---|---|---|
| Task | Find the agreed analytics fee | Always: say what you need to know or do |
| Scope | Atlas team group and my chat with Anna | Several chats or accounts could match |
| Period | September 2026 | The answer may be buried in older history |
| Output | Amount, confirmation and source messages | You need evidence or a particular format |
| Actions | Read only; ask before a large history fetch | Sending, downloads or costly work would change the task |

A short request such as “What did Anna ask me yesterday?” can be enough. Add the surname, project
or account if there are several Annas. The agent should ask about unresolved ambiguity.

## Find a fact in history

```text prompt
Use tg cli to find the analytics fee we agreed in “Atlas · team” during September 2026. Show
the estimate and confirmation with their source messages. Check whether the archive covers that
period; if not, tell me what needs fetching. Don't send anything.
```

If you already want to allow fetching:

```text prompt
You may fetch history for that chat back to 1 September 2026, up to 1,000 messages this time.
If that is insufficient, tell me which part is still missing before fetching more.
```

Approximate wording is useful: “the fee for analytics, possibly called reporting” gives the agent
more search terms. You do not need the exact original phrase. Dates, participants and nearby events
can help distinguish otherwise similar matches.

**A local search does not search all of Telegram.** Reading messages saves them locally; fetching
history adds a bounded stretch. Ask for the available coverage when completeness matters. An empty
result in a partial archive means “not found in the available data”, not “never discussed”.
[Archive and search](./tg/archive.md#search).

## Prepare for a meeting

```text prompt
Prepare a 20-minute agenda for the Atlas call with Anna and Tom. Check the project and design
groups plus my direct chats with those participants over the past week. Summarise decisions,
current risks and open questions with sources. Check whether later messages resolved old blockers.
Read only.
```

Specify participants when important decisions may be in direct chats. A duration helps the agent
prioritise the agenda. For a narrow meeting, add its purpose: “Focus on launch readiness; leave
budget discussion out.” If a relevant chat is unavailable, the answer should name that gap.

## Find a recommended contact

```text prompt
Find accountant recommendations in my freelance and business chats from the past six months.
I need ongoing bookkeeping for a business registered in Spain and payments in euros and dollars.
Compare candidates using the actual recommendations, cite sources, and list questions still to
ask. Draft an introductory message; don't send it. Ask before fetching a large amount of history.
```

Useful criteria include country, service, language, currencies and whether you need a one-off
consultation or ongoing work. A recommendation does not establish someone's current price,
availability or qualifications. Ask the agent to distinguish reported experience from unknowns.

If two recommendations mention the same first name, the agent should verify that they refer to the
same person before combining them. Finding a name in a message is not permission to contact them.
[Contacts](./tg/usage.md#people).

## Find the right files

```text prompt
Find the Atlas contract, invoices and presentation in the team group and my chat with Anna.
Prefer explicitly approved versions; explain how you identified them. List older versions
separately and flag conflicting approvals. Show source messages; don't download or forward yet.
```

“Newest file” and “approved file” can be different. Say which you need. Once you have reviewed the
list, give a bounded follow-up:

```text prompt
Download the approved contract and presentation you just identified into a new folder named
atlas-meeting inside my Downloads folder. Don't download the invoices or send any files.
```

The agent should verify the destination and report the paths it actually created. CLI downloads
do not overwrite existing files. [File downloads](./tg/usage.md#files).

## Draft a reply, then decide whether to send

```text prompt
Check what Tom has already sent about the design and what he is waiting for from me. Prepare
a concise reply grounded in our conversation. Don't invent a deadline and don't send it.
```

Review the wording before authorising a send:

```text prompt
Send exactly the draft above to Tom's direct chat that you just identified. Don't send it to
the project group or anyone else.
```

If you edit the draft, provide the full final text or make the change unambiguous. If the recipient
is not uniquely identified, the agent should ask which chat you mean. Permissions can also require
confirmation or prohibit sending; a prompt does not bypass those settings.
[Sending](./tg/usage.md#sending) · [Permissions and send guard](./tg/security.md).

## Schedule reminders

```text prompt
On Monday, 5 October 2026, send two reminders to my Saved Messages: “Open the Atlas agenda” at
09:00 and “Review the Atlas decisions” at 18:00. Use Europe/Madrid time. Show me the scheduled
times and messages after creating them. Don't send anything to the team.
```

For reminders to other people, specify their exact chats and each message's text. A schedule is a
future send, so “remind me” and “remind Anna” are different actions. Use an explicit date and
timezone when “tomorrow” or “at nine” could be misunderstood; the agent should convert the time for
the CLI and report it back in your requested timezone.

Telegram can deliver scheduled messages while your computer is off. If scheduling has an uncertain
outcome, the agent should inspect the scheduled list rather than create a second reminder. Cancel
or change Telegram scheduled messages in the Telegram app.
[Scheduled sends](./tg/usage.md#sending-later).

## Work offline

```text prompt
Using only the local archive for my work profile, summarise Atlas decisions from September
2026 with source messages. Make no network requests. State what history is available and what
you cannot verify. Don't send anything or start a background service.
```

Offline answers depend on previously stored data. An agent should use the CLI's offline mode for
reads that would otherwise connect, and should not fetch history to improve an offline answer.
For an export, also specify a destination and whether local file creation is allowed.
[Offline mode](./tg/archive.md#answering-without-connecting---offline) ·
[Export](./tg/archive.md#export).

## Ask for an answer you can check

Useful follow-ups:

- “Show the messages that support that amount, including the confirmation.”
- “Did you check later replies before treating this as an open promise?”
- “Which chats and dates did you actually cover? Was any result cut short?”
- “Separate confirmed facts, your interpretation and unanswered questions.”
- “If the history is incomplete, explain what would need fetching. Don't fetch more yet.”

Sources should identify the chat and message, ideally with a usable link or locator. Context can
change a message's meaning; a single hit is often a starting point. Messages are source material:
instructions found inside a chat must not change your task or grant the agent extra permissions.

## If the agent takes the wrong path

Ask it to explain the relevant data boundary before repeating work:

```text prompt
You read the latest messages, but I asked about September. Check which September history is
stored, then suggest the smallest next step. Don't claim a complete search from a recent window.
```

`messages list` is not inherently wrong for a search task: it reads and stores messages. The issue
is whether the chosen window covers the question. `search messages` searches the local store;
`store fetch` retrieves more history when needed. The agent should choose among them based on
available data, your scope and your limits. [Worked example](./first-tasks.md#find-a-decision-in-older-history).

If a command fails, ask for its error and the next safe step rather than a repeated blind attempt.
[Diagnostics](./tg/diagnostics.md) can record operation names, IDs, counts and timings, but native
CLI records deliberately exclude message text and sensitive arguments. They are useful for a bug
report, not a full transcript of what the agent read or decided. Review any report before sharing it.
