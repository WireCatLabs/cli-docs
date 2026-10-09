---
title: "Group admins"
description: "Keep up with questions, understand participation and manage your group."
---

This page is for people who run a Telegram or MAX group. By the end, you will be able to find questions awaiting a reply, understand activity and review who is in your group. It starts with requests for a read-only report, then explains how to check the result before changing members or moderation rules. Your account or bot needs the appropriate group rights for changes.

## Find what needs attention

```text prompt
Review yesterday’s messages in my project group. List questions still awaiting a reply, with sources. Check later messages before calling a question unanswered. Only read; do not change the group.
```

Review the questions, checked period and cited messages. If history is missing, [download the relevant chats](./search.md) before treating the report as complete.

Ask your assistant to review unanswered questions and mentions, with links to the messages.
Read [Telegram group tasks](./tg/groups.md) or [MAX group tasks](./max/groups.md) for the commands.

```sh
tg review --unanswered 24h
max review --unanswered 24h
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
be unavailable. [Check a whole group](./people.md#does-the-account-look-like-a-bot) shows the member audit
command; [People](./people.md) also covers profiles and shared conversations.

Recorded membership history starts when you fetch snapshots. It cannot reconstruct all earlier
joins and departures. Both tools can fetch tracked groups while their server is running. See what is recorded and when it is refreshed in the group guides for [Telegram](./tg/groups.md) and [MAX](./max/groups.md).

## Set rules and enable moderation

The CLI can help with rules, invitations and member management. Start with a preview, confirm
which action you want and who it affects, and give the bot or profile only the rights needed.
Removing a person or changing a link affects the group immediately.

[Telegram administration](./tg/groups.md) · [MAX administration](./max/groups.md) · [Permissions](./permissions.mdx)
