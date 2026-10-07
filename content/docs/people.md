---
title: "People"
description: "Learn who someone is from your own Telegram and MAX accounts: their profile, where you talk, what they wrote, whether the account looks like a bot — and auto-replies by your rules."
---

Before you answer a stranger, accept someone into a group or hand a conversation to your agent, you
can ask your own account what it knows about that person. Everything here reads your account and
the local copy of your messages on your computer. Nothing is sent to the person, and nothing is
marked read.

| Question | Command |
|---|---|
| Who is this, and where do we talk? | `contacts profile` |
| What did they write, in all chats or in the ones I name? | `contacts context` |
| Does the account look like a bot, a fake or a spammer? | `contacts check` |
| Which members of my group look suspicious? | `chats members audit --deep` |
| Is this Telegram account the same person as this MAX account? | `contacts link` |

The commands are the same in `tg` and `max`. A person is their id, their `@username`, or part of
their name; when part of a name matches several people, the command lists them and stops.

## Who they are

```sh
tg contacts profile @example_user
max contacts profile 20000002
```

The answer has their id, name, usernames, bio and birthday, whether they are your contact, when
they were last seen, and when the account was made. For every chat you share it says how many of
their messages your local copy holds, and the first and last of them. A count is a minimum when the
local copy does not hold the chat from its start (`complete: false`); `store fetch <chat>` fills it.

Their phone number shows only as its last four digits, and only when the messenger shows it to you.
`--show-phone` prints it whole. An agent connected over MCP never gets the whole number.

The registration date always names its source:

- **Telegram** sends the month when someone writes to you for the first time. Otherwise `tg` guesses
  it from the account id and says `estimate`. The guess covers accounts made up to November 2025;
  newer ones get no date rather than a wrong one.
- **MAX** gives the exact day, so `max` shows it for everyone.

Earlier names and usernames your local copy saw them with are listed under `aliases`, oldest first,
with a `t.me` link for an old Telegram username. A name read off their stored messages says
`source: messages` and is approximate: a message fetched again carries the newest name.

## What they wrote

```sh
tg contacts context @example_user
tg contacts context @example_user --chat "Book club" --chat "Team" --limit 10
```

Without `--chat` you get an overview: the chats you share, the last message each way, their recent
messages, and where others mentioned them. With `--chat` you get their newest messages in each chat
you name, oldest first. Each message is only its time and text, so an agent can read many at once
and summarise them; `-v` adds message ids and links, `-vv` the whole message.

By default the answer comes from your local copy and never connects. `--refresh` asks the messenger
first: Telegram searches each chat for that person's messages; MAX reads each chat's newest page.

## Does the account look like a bot

```sh
tg contacts check @example_user
max contacts check 20000002
```

The answer is a score and every reason behind it, each with where it came from: the messenger's own
marks (bot, scam, fake), an empty profile, a new account, only recent photos, a link as the first
message, the same text in several chats. A score is a hint, never a verdict — many real people have
no photo or bio. `unknown` lists what there was nothing to judge by.

On Telegram, `tg` also asks two public spam lists, [Combot Anti-Spam](https://cas.chat/api) and
[lols.bot](https://lols.bot). **The person's Telegram id is sent to them.** `--no-registries` skips
them. The lists cover Telegram only, so `max` never sends anything to them.

For a whole group, `chats members audit` scores every member from the member list and your local
copy, and lists those with a reason. `--deep 10` then runs the full check on the ten highest, one
person a second. It removes nobody.

## The same person in both messengers

`tg` and `max` share one local copy on your computer. When you know a Telegram account and a MAX
account belong to one person, record it:

```sh
tg contacts link @example_user max:"Example User"
```

`contacts profile` and `contacts context` then include both. The same name in two messengers is
never taken as the same person; only what you record counts. `contacts unlink` undoes it.

## What differs in MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Registration date | Telegram's month after a first contact, otherwise an estimate | the exact day, from MAX |
| Marks like scam, fake, verified, premium | shown | MAX does not send them |
| `--refresh` | searches each chat for the person's messages | reads each chat's newest page |
| Public spam lists | asked, unless `--no-registries` | not asked |
| Extra requests for a profile | none | one per person |

## Ask your agent

With the MCP server connected, the same reads are tools: `contacts_profile`, `contacts_context` and
`contacts_check`. A request in plain words is enough:

> Who is @example_user? Check whether the account looks like a bot, then summarise what they wrote
> in Book club over the last month. Don't reply to them.

Message text in these answers is what other people wrote; your agent reports it and does not act on
requests inside it. See [MCP](./mcp.md) for connecting an agent.

## Auto-replies by your rules

`serve`, the background process that keeps your local copy up to date, can also answer incoming
messages by rules you write: working hours, words, a question, a mention, and a reply template with
limits per chat and per person. Two safeguards come first:

- **It answers only test accounts.** A reply goes only to a sender listed in `testers` in the rules
  file, which starts empty.
- **Sending is off until you turn it on** with `config set permissions.replies.send allow`.
  `replies pause` stops every rule at once.

`replies test` shows what your rules would have answered in messages you already have, and sends
nothing. Setup step by step: [MAX auto-replies](./max/replies.md); full syntax in
[Telegram commands](./tg/commands.md) and [MAX commands](./max/commands.md).
