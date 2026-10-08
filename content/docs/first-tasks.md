---
title: "First tasks"
description: "Try a useful request, check the answer and move on to search, meeting context or draft replies."
---

Your account is connected. Ask your agent to find a message, catch up on a conversation or
prepare a reply. Describe what you need in your own words; the agent chooses the commands.

If you still need setup, start with [installation](./installation.mdx) or
[connecting your agent](./agents.mdx). To see the flow before trying it, open [Demo](./meeting-brief.mdx).


<a id="longer-examples" />

<a id="find-a-decision-in-older-history" />

<a id="check-promises-and-prepare-replies" />

<a id="other-useful-requests" />

## Your first five minutes

Choose one request and name your messenger: Telegram or MAX.

**Who needs my reply?**

```text prompt
Check my unread messages in Telegram. Tell me which questions need my reply and show the source messages. Only read: don't send anything or mark messages read.
```

**What happened today?**

```text prompt
Summarise today's messages in five of my active chats. One line per chat, with important questions separately. Say which chats you checked. Read only.
```

**Find something**

```text prompt
Find the last link someone sent me in my five most recent chats. Show the message and chat. Read only.
```

You get a short answer with messages you can open or identify. Start with a few chats so you can check the result.

## Find an older agreement

```text prompt
Find the price we agreed in the renovation group last month. Check later replies in case it changed. Show the confirmation and source messages. If history is missing, tell me before fetching more.
```

Expect the confirmed amount and the message behind it. If the agent finds only a proposal, the answer should say so. Missing local history is a reason to fetch that period, not proof that you never agreed.
[Find a message or decision](./search.md).

## Draft a reply

```text prompt
Read my conversation with the contractor. What are they waiting for from me? Draft a short reply based on our agreements. Don't invent a deadline and don't send it.
```

The draft stays in your agent chat. Review the recipient, facts and wording. You can ask for a shorter or warmer version before sending.

```text prompt
Send exactly the draft I approved to the contractor's private chat you just identified. Don't send it to the group or anyone else.
```

Sending is a separate step and still depends on your tool's permissions. If the agent cannot identify the recipient uniquely, choose the chat first.

## Prepare for a meeting

Try the meeting scenario in [Demo](./meeting-brief.mdx), then use your own project and chats. Ask for decisions, open questions and an agenda; tell the agent where else important agreements might be.

## Check the answer

Look for the checked chats and period, source messages for important conclusions, and any missing history. An answer without those details is worth a follow-up.

[More request examples](./prompting.mdx) · [Telegram help](./tg/troubleshooting.md) · [MAX help](./max/troubleshooting.md)
