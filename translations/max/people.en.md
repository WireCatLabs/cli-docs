---
title: "People: profiles, messages and bot checks"
---

Use this page to learn about a person: who they are, what they wrote to you or in your groups, and whether their account shows signs of a bot or spammer. You will learn to view their profile, collect messages for a summary, check an account before trusting it, and keep your own names and notes.

Terms used below:

- **Local archive** — messages `max` keeps on this computer. Counts and messages on this page come from it, so they cover only downloaded history.
- **Profile** here means what MAX reports about a person: name, description, photo and badges. It is not a `max` login profile.
- Identify a **person** by id or part of their name. If several people match, the command stops and lists them; run it again with the id.

## What you can do

| Task | Command |
| --- | --- |
| Learn who someone is and where you chat with them | `max personal contacts info` |
| Read their messages across all chats or selected chats | `max personal contacts context` |
| Prepare for a conversation: messages, tasks, notes and meetings | `max personal contacts prepare` |
| Check an account for bot, fake or spammer signals | `max personal contacts check` |
| Check the most suspicious group members | `max personal chats members check --deep` |
| Record that a MAX account and a Telegram account belong to one person | `max personal contacts link` |
| Keep your own name and notes for a person | `max personal contacts aliases`, `max personal contacts notes` |

See the [contacts command reference](./commands.md#max-contacts) for all options.

## Who they are: `contacts info`

```sh
max personal contacts info 20000002
max personal contacts info 20000002 --json
```

The command shows what MAX reports about the person and how many of their messages are saved locally in each shared chat. In JSON this is the `item` field of the response, as with `contacts context` and `contacts check` below:

```json
{
  "id": "20000002",
  "name": "Пример Примеров",
  "usernames": [],
  "bio": "Книги и велосипед",
  "phone": "***0123",
  "flags": { "bot": false },
  "registered": { "at": "2021-03-14T00:00:00.000Z", "source": "max", "precision": "day" },
  "has_photo": true,
  "seen": "2026-10-08T07:12:00.000Z",
  "chats": [
    { "id": "30000003", "title": "Пример Примеров", "kind": "dialog", "their_messages": 128,
      "first_at": "2024-02-11T09:14:00.000Z", "last_at": "2026-10-05T18:02:00.000Z", "complete": true },
    { "id": "-40000004", "title": "Книжный клуб", "kind": "group", "their_messages": 37,
      "first_at": "2025-06-01T10:00:00.000Z", "last_at": "2026-09-30T20:41:00.000Z", "complete": false }
  ],
  "aliases": [
    { "name": "Пример П.", "first_seen_at": "2024-03-02T08:00:00.000Z",
      "last_seen_at": "2024-03-02T08:00:00.000Z", "source": "profile" }
  ]
}
```

- **`registered`**: the account creation date reported by MAX itself (`source: max`). It is not an estimate.
- **`flags`**: `bot: true` identifies a bot. MAX does not provide scammer or verified flags for personal accounts.
- **`has_photo`**: whether the person has a profile photo.
- **`seen`**: the last time the person was in MAX, or `online`. MAX is asked separately on each call; the field is absent when MAX supplies no presence.
- **`phone`**: only the last four digits, and only if MAX shows you the number. `--show-phone` prints the full number. The MCP tool always hides it.
- **`chats`**: all shared chats and any other chats where the local copy contains their messages.
- **`aliases`**: previous names observed by the local copy, oldest first. `source: profile` means the name changed while the copy was tracking it; `source: messages` means a name found in saved messages. The latter is approximate: downloading a message again gives it the current name. This is empty until the local copy has observed a name change.

The command makes one additional MAX request beyond those made by `contacts show` and does not notify the person. With `--offline`, it builds the response from the local copy.

### Counts describe the saved copy

`their_messages`, `first_at` and `last_at` are calculated from the local copy, not requested from MAX. If `complete: false`, the chat is not saved from its beginning: the count is a minimum, and `first_at` may be later than the person’s actual first message. Download the chat to fill it in:

```sh
max personal messages sync "Книжный клуб"
```

## Prepare for a conversation

`contacts prepare` assembles a briefing from saved data: conversation context, direct chats where the person spoke last, open tasks, accepted facts, your notes and recent meetings. Every item links to its source. It does not connect to MAX or send read receipts.

```sh
max personal contacts prepare 20000002 --since-time 2026-10-01T00:00:00Z --limit 10
```

For a general conversation overview, use `contacts context` below.

## What they wrote: `contacts context`

Without `--chat`, the command assembles an overview from the local copy: shared chats, the latest message in each direction, recent direct messages from the person and recent group messages where others mentioned them. It does not connect to MAX or mark anything as read.

```sh
max personal contacts context 20000002
```

With `--chat`, it shows the person’s latest messages in each specified chat, oldest first, 20 per chat:

```sh
max personal contacts context 20000002 --chat "Книжный клуб" --chat "Работа" --limit 10
max personal contacts context 20000002 --chat "Книжный клуб" --sync-first
```

```json
{
  "person": { "uid": "p_7", "provider": "max", "id": "20000002", "name": "Пример Примеров" },
  "chats": [
    {
      "chat": { "id": "-40000004", "title": "Книжный клуб", "kind": "group" },
      "messages": [
        { "at": "2026-09-29T19:02:00.000Z", "text": "Следующим берём сборник рассказов" },
        { "at": "2026-09-30T20:41:00.000Z", "text": "В четверг могу у себя" }
      ],
      "complete": false,
      "more": true
    }
  ],
  "limits": { "messages": 10 }
}
```

- By default, messages include only time and text so an agent can read many at once. `-v` adds message ID, link, sender and reply target; `-vv` adds everything.
- `--sync-first` first retrieves the latest page of each chat from MAX, then selects the person’s messages from it: MAX cannot search by sender. Without `--sync-first`, results come from the local copy.
- `more: true` means there are messages older than the limit; `complete: false` means the local copy does not contain the chat from its beginning.
- A voice message includes `transcript` when it has been transcribed.

## Bot, fake account or spammer: `contacts check`

```sh
max personal contacts check 20000002
```

```json
{
  "person": { "id": "20000002", "name": "Пример Примеров", "username": null, "provider": "max" },
  "score": 3,
  "reasons": [
    { "reason": "no_bio", "weight": 1, "source": "messenger" },
    { "reason": "link_first", "weight": 2, "source": "store" }
  ],
  "registries": [
    { "name": "cas", "answer": "unknown", "checked_at": "2026-10-07T08:00:00.000Z",
      "detail": "lists Telegram accounts only, not max" },
    { "name": "lols", "answer": "unknown", "checked_at": "2026-10-07T08:00:00.000Z",
      "detail": "lists Telegram accounts only, not max" }
  ],
  "unknown": [],
  "checked_at": "2026-10-07T08:00:00.000Z"
}
```

The score adds the weights of detected reasons. It is a hint, not a conclusion: many real people have no photo or description, so those reasons carry little weight.

| Reason | Weight | Meaning |
|---|---|---|
| `new_account` | 2 | Account created less than 30 days ago, using the date from MAX |
| `link_first` | 2 | Their first saved message is a link |
| `same_text` | 2 | Identical text in several chats |
| `no_photo`, `no_username`, `no_bio` | 1 | The profile lacks this information |
| `odd_name` | 1 | Missing name, a long sequence of digits, or a link in the name |
| `never_wrote` | 1 | None of their messages are in the local copy |
| `deleted` | 1 | The account is deleted |

`unknown` lists signals that could not be assessed. A low score with a long `unknown` list tells you little.

### What leaves your computer

Nothing. Public spammer lists (Combot CAS and lols.bot) cover only Telegram accounts, so `max` does not query them and marks them `unknown`. The person’s ID is not sent anywhere. `--offline` reads only saved data.

## Group members: `chats members check --deep`

```sh
max personal chats members check "Книжный клуб"
max personal chats members check "Книжный клуб" --deep 10
```

`chats members check` scores all members using the member list and local copy, without a separate request for each person, and shows those with a detected reason, highest scores first. `--deep 10` then runs a full `contacts check` for the ten highest-scoring people, one person per second. It removes nobody; owners and administrators are excluded.

## One person in two messengers: `contacts link`

`max` and `tg` on the same computer use one local copy. If you know a MAX account and a Telegram account belong to the same person, record the link:

```sh
max personal contacts link 20000002 telegram:1000001
max personal contacts unlink 20000002
```

After linking, `contacts context` without `--chat` combines both accounts: shared chats and messages from MAX and Telegram. `contacts info` and `contacts context --chat` still show only the account you named. A link is your explicit record: matching names in two messengers never establish that they are one person. This record does not change the MAX address book.

## Your names and notes: `contacts aliases`, `contacts notes`

```sh
max personal contacts aliases set "Борис Пример" Боря            # ваше имя для человека, только на этом компьютере
max personal contacts aliases remove "Борис Пример"
max personal contacts notes add "Борис Пример" --text-file note.txt  # или текст из stdin
max personal contacts notes list "Борис Пример"
max personal contacts notes edit "Борис Пример" <id> --revision 1 --text-file note.txt
max personal contacts notes remove "Борис Пример" <id>
max personal contacts show "Борис Пример" --with-notes
max personal contacts list notes:квартира                     # люди, в чьих заметках есть этот текст
```

Aliases and notes stay in the local archive and never go to MAX. An alias applies only to the account you are using; a person's note is visible in every `max` login profile on this computer that encounters that person. `contacts rename` changes the name in the MAX address book, which is different. Commands resolve your alias unless it matches another person's name; then use an id. `--revision` prevents changing a note that has changed since you read it. Refreshing contacts keeps notes and aliases, and linking people does not merge them.

## Next steps

To see what is happening across a group and who is waiting for an answer, open [groups you manage](./groups.md). Your AI agent can run all the commands on this page; [connecting an agent through MCP](./mcp.md) explains how.
