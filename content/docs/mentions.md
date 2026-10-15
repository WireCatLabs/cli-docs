---
title: "Phones, links and names"
description: "Find every message with a phone number, email address, link, Google document or the name of someone you know, however it was written, and record who it is."
---

Find where someone sent a phone number, every link to one site, every chat that mentions a document, or every message
that names a colleague. The tools
notice these values in your saved messages, so you can search for them in any spelling and record what each one is:
this number is Anna's, this one belongs to a shop, this one is an order number and not a phone. You need the chat
history you want to search saved on your computer.

## What a mention is

A **mention** is a value the tools found in a message: a phone number, an email address, a link or a link to a Google
document, or the name of someone you know. The tools look in the message text, in the text
of its files and in its voice note transcripts. They also read your saved notes, documents and email; you search
those through [memo](#search-your-mail).

Each mention is kept in one standard form, so search finds a value however it was written. `+1 (555) 010-0100` and
`+1 555 010 0100` are one number; so are the Russian `8 900 000-00-01` and `+7 900 000-00-01`. `docs.google.com` and
`drive.google.com` are one site, `google.com`.

Mentions are found by fixed rules on your computer. No AI provider reads your messages for this, and nothing is
sent to the messenger. The rules aim at "looks like a phone": dates, sums, card numbers and numbers after words such
as "order" or "invoice" are skipped, but some codes will still be found as phones. You dismiss those once. A number
written without `+` is read as a number of [your countries](#numbers-written-without-a-country-code).

## Ask your agent

```text prompt
In my Telegram history, find every message where someone sent the number +1 555 010 0100. Show the chat, the date and the message around it. Read only: don't reply or mark messages as read.
```

```text prompt
List the links to google.com that people sent me last month in MAX, grouped by chat. Read only.
```

```text prompt
In Telegram, find the messages where people wrote about Anna Smirnova, in any grammatical case. Read only.
```

The agent searches the history saved on your computer. If a chat or a period is missing there, an empty answer
does not prove the value was never sent: [fetch that history first](./search.md#fetch-the-relevant-chat-history-first).

## Search by a value

Four search fields find messages by a mention:

```sh
tg personal search messages 'phone:"+1 555 010 0100"'
tg personal search messages 'email:"ana@example.com"'
max personal search messages 'domain:example.com'
max personal search messages 'url:"https://example.com/price"'
```

- `phone:` finds a number with any spaces, dashes or brackets. Type it with its country code and `+`. A number typed
  without `+` is read in [your countries](#numbers-written-without-a-country-code). A number of eight digits or more
  also finds a saved number that ends with those digits.
- `email:` finds an address in any letter case. Quote it, because `@` has a meaning of its own in a query.
- `domain:` finds every link and every address on that site, its subdomains included.
- `url:` finds one link. Tracking parameters such as `utm_source` and the part after `#` are ignored.

A value found in a file or a voice note finds the message the file came with. The fields combine with the rest of
the [query language](./tg/query-language.md), for example `domain:example.com AND date>=2026-09-01`.

### Numbers written without a country code

People write a local number the local way: `612 345 678` in Spain, `8 900 000-00-01` in Russia. Tell the tools which
countries your contacts are in, the most likely first:

```sh
tg personal config set phone_countries es,ru
```

A number without `+` is then read as a number of the first country it fits. The setting covers most of Europe, the
United States and Canada, and it applies to every tool that shares the local store. Without it, a number without
`+` is read as Russian. After you change it, read the saved numbers again with `mentions rebuild phone`; decisions
you made stay with their numbers.

### Search your mail

Your saved mail takes the same fields. Mail search belongs to [memo](./email.mdx):

```sh
memo search mail 'domain:example.com'
memo search mail 'phone:"+1 555 010 0100"'
```

## Review what was found

To see the mentions themselves, newest first:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` gives each mention an ID, the date, the kind (`phone`, `email`, `url`, `document`, `person-name`), the value,
its status and
the message. `show` adds the text around it and how many other places hold the same value. `list` shows mentions
in messages only; mentions in notes, documents and mail are searchable but not listed yet.

To see only what was found since you last looked:

```sh
tg personal mentions list --new
```

`--new` moves your review point forward only when it showed everything, so a cut page does not skip a mention. When
`messages sync` saves messages with new mentions, its answer says how many there are and suggests this command.

To see which sites people send you links to, most linked first, with the number of chats and the first and last
link:

```sh
max personal mentions domains
```

A mention has one of three statuses:

| Status | Meaning |
| --- | --- |
| `found` | the rules found it; nobody has said what it is yet |
| `linked` | it is known what it is: a person's number, a company's address, a document in the local store |
| `dismissed` | not a real mention, or not worth keeping |

## Record what a value is

```sh
tg personal mentions confirm 12 person:7
tg personal mentions confirm 12 organization:3
tg personal mentions reject 14
```

- `confirm 12 person:7` records that this number or address belongs to person 7. `organization:<id>` records that
  it belongs to an organization, such as a shop's phone or a company's `info@` address.
- `reject 14` dismisses a value that is not a real mention, such as an order number that looks like a phone.
- A document link is confirmed without an owner once the document is in the local store: `confirm 15`.
- A `t.me` link to a chat or a person you have in your history is linked to that chat or account without you.

A decision covers the value, not one message. Confirm a number once and every message with it is linked to that
person, including messages that arrive later. Reject it and it stays dismissed everywhere. A number or an address
that already belongs to a person in your history is linked without you.

Confirming and rejecting change only the local store on your computer. Nothing is sent and the messenger account
does not change. The store records who decided. A command run in an agent's terminal that sets `AI_AGENT` or `CLAUDECODE` is
recorded as the agent's; `--as-owner` records it as yours. If your profile's [permissions](./permissions.mdx) do not allow these changes, the error names the setting
to change.

## Names of people

The tools also find the names of people you have met in a chat: the person's name and the names of their
accounts. A name is found in any grammatical case, so «Анна» also finds «Анне» and «Анну», and a
name written in Latin letters also finds its Russian spelling: «Valery» finds «Валерию». Two names of one person in a
row, such as a first name and a surname, count as one full name.

A name is only a capitalized word of four letters or more. Shorter words, such as «Оля», are skipped: they are more
often ordinary words than names. People known only from email are left out; most of them are companies and mailing
lists.

The same name can belong to several people, so a name is decided where it is written, not everywhere:

```sh
tg personal mentions list kind:person-name status:found
tg personal mentions confirm 31 person:7
tg personal mentions confirm 31 person:7 --all-in-chat
tg personal search messages 'mentions:"person:7"'
```

`--all-in-chat` decides the name in every other place in the same chat too, where nobody has decided it yet. In a
team chat, one Olga is usually one person.

`show` lists the people a name may be. A name is linked to a person without you only when exactly one person with
that name wrote in that chat. `mentions:"person:7"` finds the messages that name person 7, or contain their confirmed
phone number or address.

When new people appear in your history, read the names again:

```sh
tg personal mentions rebuild person-name
max personal mentions rebuild person-name
```

## Messages saved earlier

New messages get their mentions as they are saved. Read the history you saved earlier once:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

It reads every saved message, file text, transcript, note, document and email, shows its progress and keeps every
decision you made. You can run it again at any time.

## Phone numbers and privacy

Phone numbers are kept in the local store as digits, as they already are in the saved messages. They do not go to
logs, error messages or run records. A link is never opened and a site is never contacted.

## What is not there yet

- Names of people the tools do not know yet.
- A list of the mentions in [notes and documents](./memo/notes.md) and in [email](./email.mdx): they are found and
  searchable, but `mentions list` does not show them.
- A link to an ordinary website tied to anything. Such a link can only be dismissed.
- Street addresses.

Once you know where a number, a site or a name came up, [recall the context with that person](./people.md) before you reply.
