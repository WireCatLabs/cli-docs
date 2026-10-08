---
title: "People"
description: "Recall who someone is and what you discussed before replying, using your own Telegram or MAX history."
---

Someone has written to you, but you don't remember where you met or what you agreed. Ask your
agent to find the person, collect your previous conversations and show the messages behind its
answer. You need a [connected account](./installation.mdx) and an [agent](./agents.md).

## Ask your agent

```text prompt
Before I reply to @example_user, remind me who they are and what we've discussed in the past month. Show the chats and source messages. Separate confirmed agreements from unanswered questions. Read only: don't reply or mark messages as read.
```

Replace the username with a name or account ID. If several people match, choose the right one
before the agent reads more. Expect a brief with the person's identity, relevant conversations
and questions still open. The answer should say which history was available.

## Who they are

For a quick lookup in the reviewed Telegram release, use `contacts show`. MAX also provides
a fuller profile:

```sh
tg contacts show @example_user
max contacts profile 20000002
```

These are different commands. Telegram v0.28.0 does not provide `contacts profile` or
`contacts check`. MAX v0.29.0 does. Use the command for your messenger; the same command name
in a newer release is not evidence that your installed version supports it.

## What they wrote

Both messengers can gather context from messages already saved on your computer:

```sh
tg contacts context @example_user --since-time 30d --limit 20
max contacts context 20000002 --since-time 30d --limit 20
```

The result can include shared chats, recent messages and mentions. It is limited by saved history;
missing messages do not prove you never discussed something. For more history, use
[Telegram archive](./tg/archive.md) or [MAX archive](./max/archive.md).

MAX additionally supports restricting context to a chat:

```sh
max contacts context 20000002 --chat "Team" --limit 10
```

Telegram v0.28.0 has no `--chat` option on this command. Ask the agent to read the named
conversation instead; [reading messages](./tg/usage.md#reading) explains that path.

## Does the account look like a bot

This check is available in the reviewed MAX release:

```sh
max contacts check 20000002
```

Read the reasons and missing evidence alongside the score. A signal is a clue, not proof
that a person is fraudulent. Telegram v0.28.0 has no corresponding command; don't substitute
a guessed invocation.

## The same person in both messengers

If you know two accounts belong to the same person, you can record that link locally:

```sh
tg contacts link @example_user max:"Example User"
```

Linked identities can then contribute to `contacts context`. A shared name alone is not a match.
Only link accounts you have identified; `contacts unlink` removes that local association.

## What differs in MAX

Use your messenger's [Telegram reference](./tg/commands.md) or [MAX reference](./max/commands.md)
when you need exact options. The version differences above refer to this site's reviewed releases.

## Auto-replies by your rules

Auto-replies are a separate task that can send messages. Start with [MAX auto-replies](./max/replies.md)
if you want to configure them; reading a person's history does not turn them on.

Once you know the context, ask for a [draft reply](./prompting.md#draft-a-reply-then-decide-whether-to-send)
and review the wording before authorising a send.
