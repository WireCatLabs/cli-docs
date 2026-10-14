---
title: "Phones, emails and links"
description: "Find every message with a phone number, email address, link or Google document, however it was written, and record whose number it is."
---

Find where someone sent a phone number, every link to one site, or every chat that mentions a document. The tools
notice these values in your saved messages, so you can search for them in any spelling and record what each one is:
this number is Anna's, this one belongs to a shop, this one is an order number and not a phone. You need `tg` 0.54.0
or `max` 0.51.0 or later, and the chat history you want to search saved on your computer.

## What a mention is

A **mention** is a value the tools found in a message: a phone number, an email address, a link or a link to a Google
document. They look in the message text, in the text of its files and in its voice note transcripts.

Each mention is kept in one standard form, so search finds a value however it was written. `+1 (555) 010-0100` and
`+1 555 010 0100` are one number; so are the Russian `8 900 000-00-01` and `+7 900 000-00-01`. `docs.google.com` and
`drive.google.com` are one site, `google.com`.

Mentions are found by fixed rules on your computer. No AI provider reads your messages for this, and nothing is
sent to the messenger. The rules aim at "looks like a phone": dates, sums, card numbers and numbers after words such
as "order" or "invoice" are skipped, but some codes will still be found as phones. You dismiss those once. A number
from another country written without `+` is found only after a word such as "phone" or "tel", and then as plain
digits.

## Ask your agent

```text prompt
In my Telegram history, find every message where someone sent the number +1 555 010 0100. Show the chat, the date and the message around it. Read only: don't reply or mark messages as read.
```

```text prompt
List the links to google.com that people sent me last month in MAX, grouped by chat. Read only.
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

- `phone:` finds a number with any spaces, dashes or brackets. Type it with its country code and `+`. Without the
  `+`, only Russian numbers are recognized: `8 900…` and `9…` with ten digits are read as `+7`.
- `email:` finds an address in any letter case. Quote it, because `@` has a meaning of its own in a query.
- `domain:` finds every link and every address on that site, its subdomains included.
- `url:` finds one link. Tracking parameters such as `utm_source` and the part after `#` are ignored.

A value found in a file or a voice note finds the message the file came with. The fields combine with the rest of
the [query language](./tg/query-language.md), for example `domain:example.com AND date>=2026-09-01`.

## Review what was found

To see the mentions themselves, newest first:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` gives each mention an ID, the date, the kind (`phone`, `email`, `url`, `document`), the value, its status and
the message. `show` adds the text around it and how many other places hold the same value.

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

A decision covers the value, not one message. Confirm a number once and every message with it is linked to that
person, including messages that arrive later. Reject it and it stays dismissed everywhere. A number or an address
that already belongs to a person in your history is linked without you.

Confirming and rejecting change only the local store on your computer. Nothing is sent and the messenger account
does not change. The store records who decided. A command run in an agent's terminal that sets `AI_AGENT` or `CLAUDECODE` is
recorded as the agent's; `--as-owner` records it as yours. If your profile's [permissions](./permissions.mdx) do not allow these changes, the error names the setting
to change.

## Messages saved before this version

New messages get their mentions as they are saved. Read the history you saved earlier once:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

It reads every saved message, file text and transcript, shows its progress and keeps every decision you made. You
can run it again at any time.

## Phone numbers and privacy

Phone numbers are kept in the local store as digits, as they already are in the saved messages. They do not go to
logs, error messages or run records. A link is never opened and a site is never contacted.

## What is not there yet

- Names of people you know, written in any grammatical case. They are built and come in a later release.
- Mentions in [notes and files](./memo/notes.md) and in [email](./email.mdx).
- A link tied to the chat or the stored document it points to. For now a link can only be dismissed.
- Street addresses.

Once you know where a number or a site came up, [recall the context with that person](./people.md) before you reply.
