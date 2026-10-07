---
title: "Group admins"
description: "Keep up with questions, understand participation and manage your group."
---

Use WireCat to find questions that need an answer, understand group activity and review
membership. Start with a read-only report before enabling moderation.

## Find what needs attention

Ask your assistant to review unanswered questions and mentions, with links to the messages.
Read [Telegram group tasks](./tg/groups.md) or [MAX group tasks](./max/groups.md) for the commands.

```sh
tg review --unanswered 24
max review --unanswered 24
```

Check the suggested replies before sending them. A report is based on the history available
locally: missing messages can change its picture of the discussion.

## Understand activity

```sh
tg stats chats show "Team" --since-time 7d
max stats chats show "Team" --since-time 7d
```

Look at messages, active participants and questions answered. Missing history limits the
report; fetch more before drawing conclusions. Low activity does not prove someone is inactive
outside the messages you hold. Try [search](./search.md) for a particular discussion.

## Review membership

A member audit shows signals and reasons, not a verdict about a person. Review the evidence
before removing anyone. Telegram and MAX provide different information, so some signals may
be unavailable. [Know your people](./people.md) covers profiles and shared conversations.

Recorded membership history starts when you fetch snapshots. It cannot reconstruct all earlier
joins and departures. Both tools can fetch tracked groups while their server is running. Check the messenger guide
for what is recorded and when it is refreshed. See each messenger's group guide.

## Set rules and enable moderation

The CLI can help with rules, invitations and member management. Start with a preview, confirm
which action you want and who it affects, and give the bot or profile only the rights needed.
Removing a person or changing a link affects the group immediately.

[Telegram administration](./tg/groups.md) · [MAX administration](./max/groups.md) · [Permissions](./permissions.md)
