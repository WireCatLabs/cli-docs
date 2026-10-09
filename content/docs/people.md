---
title: "People"
description: "Recall who someone is and what you discussed before replying, using your own Telegram or MAX history."
---

Recall who a person is and what you discussed before replying. Ask your agent how you know them, what you agreed and which account signals are available, with the messages behind each answer. You can also keep one person’s Telegram and MAX accounts together.

## What a person is here

A person is someone your account has seen in a chat: in a one-to-one chat or in a group you share.
The tools know them by their messenger account, its ID and, in Telegram, its `@username`, and by
what the history saved on your computer holds about them.

A person does not have to be in your contacts. Your contacts are the messenger's address book:
the people you added, often by phone number. Someone who wrote in a group you both belong to is a
person here even if you never added them. `contacts list` shows the people you have a one-to-one
chat with. Adding, renaming or removing a contact is a separate action that changes your messenger
account.

You can also keep private context about a person. It stays on your computer and never reaches the
messenger:

- **Your own name for them.** Commands can then find the person by that name. It applies to the
  selected account and does not change their name in your contacts.
- **Notes.** Free text about the person that you or your agent can search later.

The commands are in the [Telegram people guide](./tg/people.md#your-own-names-and-notes-contacts-alias-contacts-notes)
and the [MAX reference](./max/commands.md#max-contacts-alias).

The same human often has a Telegram account and a MAX account. The tools treat them as two people
until you **link** them: you record on your computer that both accounts belong to one person. Then
an overview of what they wrote includes their messages from both messengers. See
[the same person in both messengers](#link-your-accounts).

## Ask your agent

```text prompt
Before I reply to @example_user, remind me who they are and what we've discussed in the past month. Show the chats and source messages. Separate confirmed agreements from unanswered questions. Read only: don't reply or mark messages as read.
```

Replace the username with a name or account ID. If several people match, choose the right one
before the agent reads more. Expect a brief with the person's identity, relevant conversations
and questions still open. The answer should say which history was available.

## Who they are

Both messengers provide a profile with the person's identity and shared conversations:

```sh
tg contacts profile @example_user
max contacts profile 20000002
```

Use `contacts show` for a shorter lookup. Name a person by their ID or part of their name; in
Telegram, a `@username` also works. If part of a name matches several people, the command lists
them and stops. These reads use your account and the messages saved on your computer. Nothing is
sent to the person, and nothing is marked as read.

The available profile fields depend on what the messenger shares with your account:

- **Phone number:** only the last four digits, and only when the messenger shows the number to you.
  `--show-phone` prints it in full. An agent connected over MCP never gets the full number.
- **Registration date:** always says where it came from. Telegram sends the month when someone
  writes to you for the first time; otherwise `tg` estimates it from the account ID and marks it
  `estimate`. The estimate covers accounts created up to August 2026; newer accounts get no date
  rather than a wrong one. MAX gives the exact day, so `max` shows it for everyone.
- **Earlier names:** names and usernames your saved history has seen, under `aliases`, oldest first,
  with a `t.me` link for an old Telegram username. A name taken from stored messages says
  `source: messages` and is approximate, because a message downloaded again carries the newest name.
- **Shared chats:** how many of their messages your local copy holds in each chat, and the first and
  last of them. When a chat is not saved from its start (`complete: false`), the count is a minimum;
  `store fetch <chat>` fills it in.

## What they wrote

Both messengers can gather context from messages already saved on your computer:

```sh
tg contacts context @example_user --since-time 30d --limit 20
max contacts context 20000002 --since-time 30d --limit 20
```

Without `--chat`, you get an overview: shared chats, the last message each way, their recent
messages and where others mentioned them. Name the chats that matter to get their newest messages
in each one, oldest first, 20 per chat by default:

```sh
tg contacts context @example_user --chat "Book club" --chat "Team" --limit 10
max contacts context 20000002 --chat "Book club" --chat "Team" --limit 10
```

Each message is only its time and text, so an agent can read many at once and summarise them.
`-v` adds message IDs and links; `-vv` gives the whole message.

The answer comes from saved history and does not connect to the messenger. Missing messages do not
prove you never discussed something. With `--chat`, `--refresh` asks the messenger first: Telegram
searches each chat for that person's messages; MAX reads each chat's newest page, because it cannot
search by sender. For more history, use [Telegram archive](./tg/archive.md) or
[MAX archive](./max/archive.md).

## Does the account look like a bot

Both messengers support an account check:

```sh
tg contacts check @example_user
max contacts check 20000002
```

The answer is a score and every reason behind it, each with its source: the messenger's own marks,
an empty profile, a new account, recent photos only, a link as the first message, or the same text in
several chats. A score is a clue, not proof: many real people have no photo or bio. `unknown` lists
the signals there was nothing to judge by, so a low score with a long `unknown` list means little.
The full list of reasons is in the [Telegram people guide](./tg/people.md) and
[MAX people guide](./max/people.md).

On Telegram, `tg` also asks two public spam lists, [Combot Anti-Spam](https://cas.chat/api) and
[lols.bot](https://lols.bot). **The person's Telegram ID is sent to them.** Use `--no-registries`
to skip those lookups. The lists cover Telegram accounts only, so `max` never sends anything to them.

To check a whole group, `chats members audit` scores every member from the member list and your
saved history, and lists those with a reason. `--deep 10` then runs the full check on the ten
highest, one person per second. The owner and admins are left out, and nobody is removed:

```sh
tg chats members audit "Book club" --deep 10
max chats members audit "Book club" --deep 10
```

<a id="link-your-accounts" />

## The same person in both messengers

If you know two accounts belong to the same person, you can record that link locally:

```sh
tg contacts link @example_user max:"Example User"
```

Both accounts must already be in the history on this computer, so use `tg` and `max` on the same
computer. `contacts context` without `--chat` then gathers the linked identities.
`contacts context --chat` and `contacts profile` show only the selected messenger identity. A shared
name alone is not a match; only the links you record count. `contacts unlink` removes that local
association.

### Link an email identity

[Import your email](./email.mdx) first, then link a known address to the stored messenger contact:

```sh
tg contacts link @example_user email:rin@example.test
```

Replace the username and address with the person's actual identities. Check the returned identities;
a matching name is not enough. Linking changes the local person record, not your logins or mailboxes.
`contacts unlink` separates the identity you name if a link is wrong.

To keep private context about a person, see [create notes](./memo.mdx#create-your-own-notes).
The [notes and source tags guide](./memo.mdx#tag-your-sources) explains labels on a contact identity,
a linked person or a specific message. Messenger contact-note commands are documented in
[Telegram commands](./tg/commands.md#tg-contacts-notes) and [MAX commands](./max/commands.md#max-contacts-notes).

## What differs in MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Registration date | Telegram's month after a first contact, otherwise an estimate | the exact day, from MAX |
| Marks like scam, fake, verified, premium | shown | MAX does not send them for personal accounts |
| `--refresh` | searches each chat for the person's messages | reads each chat's newest page |
| Public spam lists | asked, unless `--no-registries` | not asked |
| Extra requests for a profile | none beyond those of `contacts show` | one per person |

Exact options are in the [Telegram reference](./tg/commands.md) and [MAX reference](./max/commands.md).

## When an agent reads these answers

With the [MCP server](./mcp.mdx) connected, an agent gets the same profile, context and check.
Message text in these answers is what other people wrote. Your agent reports it and does not act
on requests found inside it.

## Auto-replies by your rules

Auto-replies are a separate task that can send messages; reading a person's history does not turn
them on. [Drafts and templates](./drafts-and-templates.mdx) explains how they differ from a draft
your agent shows you. Setup is in [Telegram auto-replies](./tg/replies.md) and
[MAX auto-replies](./max/replies.md).

Once you know the context, ask for a [draft reply](./prompting.mdx#draft-a-reply-then-decide-whether-to-send)
and review the wording before authorising a send.
