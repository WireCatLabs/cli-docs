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
person here even if you never added them. `contacts list` lists the contacts available through the selected messenger. Adding, renaming or removing a contact is a separate action that changes your messenger
account.

You can also keep private context about a person. It stays on your computer and never reaches the
messenger:

- **Your own name for them.** Commands can then find the person by that name. It applies to the
  selected account and does not change their name in your contacts.
- **Notes.** Free text about the person that you or your agent can search later.

The commands are in the [Telegram people guide](./tg/people.md#your-own-names-and-notes-contacts-aliases-contacts-notes)
and the [MAX reference](./max/commands.md#max-contacts-aliases).

The same human often has a Telegram account and a MAX account. The tools treat them as two people
until you **link** them: you record on your computer that both accounts belong to one person. Then
an overview of what they wrote includes their messages from both messengers. See
[the same person in both messengers](#link-your-accounts).

## Phones and emails in messages

A phone number or an email address in a message belongs to someone, but the tools do not guess who. They list each one as a mention, and you say whose it is. Replace `1` with an id from the list:

```sh
tg personal mentions list
tg personal mentions confirm 1 person:7
```

`mentions confirm` records that the value belongs to the person (or to an organization with `organization:`). After that, a search such as `mentions:"person:7"` finds those messages. A wrong value can be dismissed with `mentions reject`. More: [Phones, links and names](./people.md#phones-links-names-and-addresses) and [How things are linked](./how-things-are-linked.md#mentions).

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
tg personal contacts show @example_user
max personal contacts show 20000002
```

`contacts show` also answers from the local store alone with `--offline`. Name a person by their ID or part of their name; in
Telegram, a `@username` also works. If part of a name matches several people, the command lists
them and stops. These reads use your account and the messages saved on your computer. Nothing is
sent to the person, and nothing is marked as read.

The available profile fields depend on what the messenger shares with your account:

- **Phone number:** shown in full, in the command line and over MCP, when the messenger gives it to your account.
  `--hide-phone` leaves it out. Older releases masked it and had `--show-phone`; that flag is gone.
- **Registration date:** always says where it came from. Telegram sends the month when someone
  writes to you for the first time; otherwise `tg` estimates it from the account ID and marks it
  `estimate`. The estimate covers accounts created up to August 2026; newer accounts get no date
  rather than a wrong one. MAX can supply the exact day; `max` shows it when available.
- **Earlier names:** names and usernames your saved history has seen, under `aliases`, oldest first,
  with a `t.me` link for an old Telegram username. A name taken from stored messages says
  `source: messages` and is approximate, because a message downloaded again carries the newest name.
- **Shared chats:** how many of their messages your local copy holds in each chat, and the first and
  last of them. When a chat is not saved from its start (`complete: false`), the count is a minimum;
  `messages sync <chat>` fills it in.

## Who reacted

```sh
tg personal reactions list "Book club" 101
tg personal reactions list "Book club" 101 reaction:🔥 --limit 20
```

`reactions list` shows who reacted to one message, newest first, with the reaction and the time. Add `reaction:`
and an emoji to keep one reaction. Where a chat hides the list, such as a channel, the command says so instead of
showing an empty list. WhatsApp does not offer this command yet.

## What they wrote

Both messengers can gather context from messages already saved on your computer:

```sh
tg personal contacts context @example_user --since-time 30d --limit 20
max personal contacts context 20000002 --since-time 30d --limit 20
```

Without `--chat`, you get an overview: shared chats, the last message each way, their recent
messages and where others mentioned them. Name the chats that matter to get their newest messages
in each one, oldest first, 20 per chat by default:

```sh
tg personal contacts context @example_user --chat "Book club" --chat "Team" --limit 10
max personal contacts context 20000002 --chat "Book club" --chat "Team" --limit 10
```

Each message is only its time and text, so an agent can read many at once and summarise them.
`-v` adds message IDs and links; `-vv` gives the whole message.

The answer comes from saved history and does not connect to the messenger. Missing messages do not
prove you never discussed something. With `--chat`, `--sync-first` asks the messenger first: Telegram
searches each chat for that person's messages; MAX reads each chat's newest page, because it cannot
search by sender. For more history, use [Telegram archive](./tg/archive.md) or
[MAX archive](./max/archive.md).

## Does the account look like a bot

Both messengers support an account check:

```sh
tg personal contacts check @example_user
max personal contacts check 20000002
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

To check a whole group, `chats members check` scores every member from the member list and your
saved history, and lists those with a reason. `--deep 10` then runs the full check on the ten
highest, one person per second. The owner and admins are left out, and nobody is removed:

```sh
tg personal chats members check "Book club" --deep 10
max personal chats members check "Book club" --deep 10
```

<a id="link-your-accounts" />

## The same person in both messengers

If you know two accounts belong to the same person, you can record that link locally:

```sh
tg personal contacts link @example_user max:"Example User"
```

Both accounts must already be in the history on this computer, so use `tg` and `max` on the same
computer. `contacts context` without `--chat` then gathers the linked identities.
`contacts context --chat` and `contacts show` show only the selected messenger identity. A shared
name alone is not a match; only the links you record count. `contacts unlink` removes that local
association.

### Link an email identity

[Import your email](./mail/email.md) first, then link a known address to the stored messenger contact:

```sh
tg personal contacts link @example_user email:rin@example.test
```

Replace the username and address with the person's actual identities. Check the returned identities;
a matching name is not enough. Linking changes the local person record, not your logins or mailboxes.
`contacts unlink` separates the identity you name if a link is wrong.

To keep private context about a person, see [create notes](./memo/notes.md#write-your-own-notes).
The [notes and source tags guide](./memo/tags.md) explains labels on a contact identity,
a linked person or a specific message. Messenger contact-note commands are documented in
[Telegram commands](./tg/commands.md#tg-contacts-notes) and [MAX commands](./max/commands.md#max-contacts-notes).

## What differs in MAX

| | Telegram (`tg`) | MAX (`max`) |
|---|---|---|
| Registration date | Telegram's month after a first contact, otherwise an estimate | the exact day, when MAX supplies it |
| Marks like scam, fake, verified, premium | shown | MAX does not send them for personal accounts |
| `--sync-first` | searches each chat for the person's messages | reads each chat's newest page |
| Public spam lists | asked, unless `--no-registries` | not asked |
| Extra requests for a profile | none beyond those of `contacts show` | one per person |

Exact options are in the [Telegram reference](./tg/commands.md) and [MAX reference](./max/commands.md).

## When an agent reads these answers

With the [MCP server](./agents.mdx#mcp-and-skills) connected, an agent gets the same profile, context and check.
Message text in these answers is what other people wrote. Ask your agent to treat it as source material and ignore requests embedded in it; CLI protections do not control every action an agent can take.

## Auto-replies by your rules

Auto-replies are a separate task that can send messages; reading a person's history does not turn
them on. [Drafts and templates](./drafts-and-templates.mdx) explains how they differ from a draft
your agent shows you. Setup is in [Telegram auto-replies](./tg/replies.md) and
[MAX auto-replies](./max/replies.md).

Once you know the context, ask for a [draft reply](./prompting.mdx#draft-a-reply-then-decide-whether-to-send)
and review the wording before authorising a send.

## Clients, colleagues and deals

Before a call with a client, you want one picture of them: their company, their part in a deal, whom they report
to, and what you discussed. `memo` builds that picture from your CRM, your chats, your mail and your calendar. Each
relationship in it says how sure it is, and the answer names what it could not read. Your CRM must be synced first,
for example with [`b24`](./b24/usage.md), so its contacts, companies and deals are in the local store.

```text prompt
Use memo CLI. Before my call with Alice from Acme Ltd, show her company, her role in our open deals, whom she
reports to and what we discussed last month. Say which facts only the CRM reports, and what you could not read.
```

The agent finds the person, then reads their context. You can run the same commands yourself:

```sh
memo search people alice
memo context person:3
memo organizations context organization:1
memo deals context deal:1 --brief
memo relationships list kind:reports-to 'to:"person:12"'
```

- `memo context person:<id>` reads every account that saw the person: the CRM, Telegram, mail and calendars. It
  works for a person known only from the CRM, and for a name you added with `memo people add`.
- `memo organizations context <ref>` shows an organization's people by role, its customers, suppliers and partners,
  its projects, open deals and leads, its invoices and payments as stored, and its open tasks.
  `memo organizations list category:client` lists your clients, and `supplier`, `partner` and `employer` work the
  same way.
- `memo deals context <ref>` shows one deal: its stages, client, people with their roles, owner, project, money,
  and the messages, mail and meetings of its people while it was open. `--brief` is the short form for an agent.
  `memo leads context` does the same for a lead.
- `memo relationships list` filters by `kind:`, `role:`, `standing:`, `from:`, `to:` and `at:<day>` (held on that
  day). It leaves out ended relationships unless you add `include:ended`. With `about:<ref>`, each row also shows
  its direction and the inverse name.

What each kind, role and standing means: [Business relationships](./how-things-are-linked.md#business-relationships).
To keep work accounts apart from personal ones: [Search CRM deals and keep work apart](./search.mdx#search-crm-deals-and-keep-work-apart).

### Examples

The examples below use a sample store. Your own company is Northstar Consulting, its CRM is Bitrix24 at
`example.bitrix24.com`, and Acme Ltd is a client. Alice and Bob are Acme's contacts, and Emma and Dana work at
Northstar. Your numbers and names will differ.

**A person known only from the CRM.** Emma is a Northstar employee with no messenger account. Her context still
answers, from the CRM and your calendar:

```text
$ memo context person:7
Emma  person:7
  email:emma@northstar.example
  bitrix24:example.bitrix24.com/user/u1  Emma
...
Business
Organizations
  Northstar Consulting  organization:2  member-of employee (Sales owner) reported by bitrix24:example.bitrix24.com
Reports to
  Dana  person:12  reports-to reported by bitrix24:example.bitrix24.com
Deals and leads
  Acme renewal · New  deal:1  related-to owner reported by bitrix24:example.bitrix24.com
Categories  employer
...
Not read: messages — no messenger identity is linked to them
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example
```

"Sales owner" is her job title. Her role is `employee`. "Not read" says that her messages could not be read,
because no messenger account is linked to her.

**The same person in the CRM and in Telegram.** Alice is a CRM contact and writes to you in Telegram. Once her
Telegram account and her CRM contact are one person, one context holds both:

```text
$ memo context person:3
Alice  person:3
  email:alice@acme.example
  bitrix24:example.bitrix24.com/contact/7  Alice
  telegram:201  Alice

Last from them   2026-10-04 00:00  telegram  Alice: Can we renew Atlas before December?  msg:telegram/100/201/1
...
Business
Organizations
  Acme Ltd  organization:1  member-of contact (Procurement manager) reported by bitrix24:example.bitrix24.com
Deals and leads
  Acme renewal · New  deal:1  related-to contact reported by bitrix24:example.bitrix24.com
Categories  client
...
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example, telegram:100
```

Her CRM contact joined her mail address because the address is the same. The Telegram account joined because you
linked it, for example with `tg personal contacts link`. A matching name never joins two accounts.

**An organization with employees and customers.** Your own company shows its people and its customers:

```text
$ memo organizations context organization:2
Northstar Consulting  organization:2  (your own)
Categories  employer
People
  Emma  person:7  member-of employee (Sales owner) reported by bitrix24:example.bitrix24.com
  person:1  person:1  member-of founder confirmed
  Dana  person:12  member-of employee (Head of sales) reported by bitrix24:example.bitrix24.com
Customers
  Acme Ltd  organization:1  customer-of confirmed
Written by its people  0 messages, 0 emails, 1 meetings
Read: bitrix24:example.bitrix24.com, google-calendar:owner@northstar.example
Not read: messages — no messenger identity is linked to them
```

`person:1` is you. The employees come from the CRM, so they are `reported`. Acme Ltd is a customer because you said
so, so it is `confirmed`. `memo organizations context organization:1` shows the same from Acme's side: Alice and Bob,
Northstar under Suppliers, the open deal, the invoice and the open task.

**A deal with a decision-maker and a related meeting.** The CRM knows Alice as the deal's contact and Emma as its
owner. Bob as the decision-maker comes from you, because Bitrix24 keeps no role for a deal's contact:

```text
$ memo deals context deal:1 --brief
Acme renewal  deal:1  Example sales/New  open
client Acme Ltd; owner Emma; project Atlas
  Alice  person:3  contact  reported
  Emma  person:7  owner  reported
  Bob  person:5  decision-maker  confirmed
stages ∅ → New
invoiced issued 1200.00 EUR; paid none
1 messages, 1 emails, 1 meetings (proposed); 1 open tasks
```

The meeting is the call with all three of them while the deal was open. It is marked `proposed`, because it shares
people with the deal and nothing links it to the deal. The invoice is issued and nothing is paid. A stage named Won
is not a payment either: money is what the invoices and payments say. Without `--brief`, the answer lists the
meeting, the mail and the message with their references.

**A reporting line with its source.** Emma reports to Dana. Ask for the source fields to see where this came from:

```text
$ memo relationships list 'about:"person:7"' --json=id,from,to,kind,standing,account,derived
{"items":[...,{"id":"9","from":"person:7","to":"person:12","kind":"reports-to","standing":"reported",
"account":"bitrix24:example.bitrix24.com","derived":"department-head"}],...}
```

The CRM account reported it, and `derived` says that it was worked out from the head of Emma's department. Nobody
confirmed it. Read from Dana's side, the same row says `manages`:

```text
$ memo relationships list 'about:"person:12"'
9  Person «Emma» → Person «Dana»  manages  reported by bitrix24:example.bitrix24.com
10  Person «Dana» → Organization «Northstar Consulting»  member-of as employee (Head of sales)  reported by bitrix24:example.bitrix24.com
```

A reporting line your agent adds is only a suggestion until you confirm it:

```text
$ memo relationships list 'about:"person:5"' kind:reports-to
1  Person «Alice» → Person «Bob»  manages  proposed by claude-code
```

**A relationship that changed and waits for review.** You set the CRM account's links to `review`. Then two things
change in the CRM: Alice leaves Acme Ltd, and Bob is added as a contact on the deal. After the next sync:

```text
$ memo relationships list 'about:"person:3"' include:ended
4  Deal «Acme renewal · New» (Atlas) → Person «Alice»  related-to as contact  reported by bitrix24:example.bitrix24.com
1  Person «Alice» → Person «Bob»  reports-to  proposed by claude-code
1  Person «Alice» → Organization «Acme Ltd»  member-of as contact (Procurement manager)  ended by bitrix24:example.bitrix24.com

$ memo review list kind:relationship
no project or account
2  relationship  Deal «Acme renewal · New» (Atlas) → Person «Bob» as contact  bitrix24  11-07
   reported by bitrix24:example.bitrix24.com
1  relationship  Person «Alice» → Person «Bob»  claude-code  11-07
   Alice said so on the renewal call
2 shown
```

Alice's membership is `ended`, and it is still there with its history. Bob's new role waits in `memo review`, and
his `decision-maker` role from you stays as it was. `memo review confirm 2` makes the new role yours, and
`memo review reject 2 --reason "not on this deal"` turns it down, so the sync does not suggest it again.

### Whose deals are copied

In a sales team's CRM most deals belong to other people. So a sync copies only your own deals and leads: those whose
responsible person is the CRM user the tool signs in as (in Bitrix24, the webhook's user). Contacts and companies are
always copied whole. A manager who wants every deal sets the account's `scope` to `all`, and `mine` goes back.
[Whose deals and leads](./b24/usage.md#whose-deals-and-leads) has the Bitrix24 details:

```sh
b24 work config set crm.bitrix24:example.bitrix24.com.scope all
b24 work config set crm.bitrix24:example.bitrix24.com.scope mine
```

A deal can also belong to nobody yet, for example one that a website form creates. Bitrix24 has no such deals: every
deal has a responsible person, by default the user who created it
([Bitrix24 REST docs](https://github.com/bitrix24/b24restdocs/blob/833b39804f03dd4eb0ab758cbf7c1ddf1fac4663/api-reference/crm/universal/crm-item-add.md#L186-L189)).
So you name the users whose deals count as nobody's, such as the user your website form creates them as, and the
sync copies their deals and leads too:

```sh
b24 work config set crm.bitrix24:example.bitrix24.com.unassigned 15,31
```

What happens when the scope changes:

- A deal given to another user leaves the copy at the next sync, and comes back if it is given back to you.
- Switching to `all` reads every deal and lead again. Switching to `mine` works from the copy alone and asks the CRM
  nothing.
- A deal outside the scope leaves your lists and search, in `b24` and in `memo`. Its earlier copy still stays in the
  store file on your computer.
- If you never set `scope`, and the first narrowing to `mine` would remove more than half of the stored deals or
  leads, the sync keeps them and says so (`crm.narrowing-held`). This happens when the sync's user holds few deals.
  The copy stays as it is until you set `scope` to `mine` or `all`.

`b24 work store status` shows, for deals and for leads, the saved `scope`, whether you set it, the scope the last
sync applied, and whether a narrowing is held.

One account's copy belongs to one CRM user. The first sync remembers that user in `crm.<provider>:<account>.self`, and
a sync that signs in as another user is refused. To hand the copy over, unset it, and the next sync remembers the new
user:

```sh
b24 work config unset crm.bitrix24:example.bitrix24.com.self
```

Only you change `scope`, `unassigned` and `self`: an agent that tries is refused. This guards against an agent's
mistake. It is not a security boundary: an agent that can run any command on your computer can get around it.

### Base stages

Each CRM, and each pipeline in it, names its stages its own way. Base stages are your own list of stages, one for
deals and one for leads: the columns your deals are sorted into across every pipeline and every CRM. Every other
stage is mapped onto one of them. Memo suggests the mapping, and you confirm it.

```sh
memo stages show deal
memo stages list confirmed:false
memo stages set stage:41 Proposal
memo stages confirm --pipeline pipeline:3
memo deals move deal:5 stage:3
```

- `memo stages show deal` makes the list on first use and shows each base stage with its open deals and the stages
  mapped onto it. It also shows what is unsorted: stages not mapped yet, or only suggested. If you have exactly one
  pipeline of your own for deals and it has open, won and lost stages, it becomes the list. Otherwise memo makes
  New, Qualification, Proposal, Negotiation, Won and Lost, in the first language of `owner_languages` (Russian until
  you set it). Your own `Leads` pipeline becomes the list for leads.
- `memo stages create`, `rename`, `move` and `remove` edit a list. Each list keeps at least one open, one won and one
  lost stage, and a stage that your own deals or leads stand in, or stood in, cannot be removed.
- `memo stages list` shows every other stage, of a CRM or of your own pipelines, with its base stage and whether it
  is `confirmed`. A CRM's stages are suggested at each sync, by outcome and by their place in the pipeline. A
  confirmed mapping is never changed by a sync.
- `memo stages set` maps one stage. `memo stages confirm --pipeline <pipeline>` confirms one pipeline's suggestions,
  and `memo stages confirm --all` confirms all of them.
- `memo deals move` and `memo leads move` take a base stage's `stage:<id>` and move your own deal to the one stage
  of its pipeline that is mapped there. When several stages are, the answer is `stage.choice-required` with the
  candidates: move again to one of them by its `stage:<id>`. When none is, the answer is `stage.unmapped`: map a
  stage first. A deal copied from a CRM moves on the CRM, with the tool its `writes_with` names (see below).
- In `--json`, each row of `memo deals list` and `memo leads list` has `base_stage`. It stays `null` until you
  confirm the mapping of the row's stage.

Your agent may suggest a mapping: its `memo stages set` stays a suggestion until you confirm it. Editing the lists
and `memo stages confirm` are refused to an agent. As with the CRM scope, this guards against mistakes and is not a
security boundary.

### Change a CRM deal

A deal, lead or pipeline copied from a CRM is changed on the CRM, not in memo, or the next sync would undo the change.
In `--json`, each such row of `memo deals list`, `memo leads list` and `memo pipelines list` has `writes_with`: the
tool that changes it (`tool`, such as `b24`), the row's `account`, and the `profile` to run that tool as. For
example, the agent reads `memo deals list status:open --json`, then runs `b24` as that profile, such as
`b24 work deals move deal:12 "Quote sent"`.

`profile` is set only when exactly one profile of that tool has run on the account. Otherwise it is `null`,
`profiles` lists the candidates and `why` says what to choose: your agent asks you which one to use and never picks
one. In a group, a profile on an account outside the group is never named. Your own deals have `"writes_with":
null`, because memo changes them itself.

## Phones, links, names and addresses

Find where someone sent a phone number, every link to one site, every chat that mentions a document, or every message
that names a colleague. The tools
notice these values in your saved messages, so you can search for them in any spelling and record what each one is:
this number is Anna's, this one belongs to a shop, this one is an order number and not a phone. You need the chat
history you want to search saved on your computer.

### What a mention is

A **mention** is a value the tools found in a message: a phone number, an email address, a link or a link to a Google
document, a person's name, or a street address. The tools look in the message text, in the text
of its files and in its voice note transcripts. They also read your saved notes, documents and email; you search
those through [memo](#search-your-mail).

Each mention is kept in one standard form, so search finds a value however it was written. `+1 (555) 010-0100` and
`+1 555 010 0100` are one number; so are the Russian `8 900 000-00-01` and `+7 900 000-00-01`. `docs.google.com` and
`drive.google.com` are one site, `google.com`.

Mentions are found by fixed rules on your computer. No AI provider reads your messages for this, and nothing is
sent to the messenger. The rules aim at "looks like a phone": dates, sums, card numbers and numbers after words such
as "order" or "invoice" are skipped, but some codes will still be found as phones. You dismiss those once. A number
written without `+` is read as a number of [your countries](#numbers-written-without-a-country-code).

### Ask your agent

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
does not prove the value was never sent: [fetch that history first](./search.mdx#fetch-the-relevant-chat-history-first).

### Search by a value

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

#### Numbers written without a country code

People write a local number the local way: `612 345 678` in Spain, `8 900 000-00-01` in Russia. Tell the tools which
countries your contacts are in, the most likely first:

```sh
tg personal config set phone_countries es,ru
```

A number without `+` is then read as a number of the first country it fits. The setting covers most of Europe, the
United States and Canada, and it applies to every tool that shares the local store. Without it, a number without
`+` is read as Russian. After you change it, read the saved numbers again with `mentions rebuild phone`; decisions
you made stay with their numbers.

#### Search your mail

Your saved mail takes the same fields. Mail search belongs to [memo](./mail/email.md):

```sh
memo search mail 'domain:example.com'
memo search mail 'phone:"+1 555 010 0100"'
memo search mail 'url:"https://news.example.com/click?id=1"'
memo search mail 'link:"/click?id=1"'
```

Mail is full of tracking links, each in one letter. memo keeps such a link once per letter, as its site, so
`domain:` still finds every letter. `url:` still finds a letter by the whole link: it reads the letter's text.
`link:` finds the letters whose links contain a part, such as a path or `id=1`; Latin letters match in any case.
Put a link or a part of one in quotes: `?`, `/` and `=` mean something else in a query.

### Review what was found

To see the mentions themselves, newest first:

```sh
tg personal mentions list kind:phone
tg personal mentions list domain:example.com status:found
tg personal mentions show 12
```

`list` gives each mention an ID, the date, the kind (`phone`, `email`, `url`, `document`, `person-name`, `place`), the value,
its status and
the message. `show` adds the text around it and how many other places hold the same value. `list` in tg and max shows mentions
in messages only; `memo mentions list --source email:<name>` lists those in mail, and `--source notes` or `--source documents` those in notes and documents.

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

### Record what a value is

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
- A street address is confirmed with no owner: `confirm 40` keeps it as a place. See [Street addresses](#street-addresses).

A decision covers the value, not one message. Confirm a number once and every message with it is linked to that
person, including messages that arrive later. Reject it and it stays dismissed everywhere. A number or an address
that already belongs to a person in your history is linked without you.

Confirming and rejecting change only the local store on your computer. Nothing is sent and the messenger account
does not change. The store records who decided. A command run in an agent's terminal that sets `AI_AGENT` or `CLAUDECODE` is
recorded as the agent's; `--as-owner` records it as yours. If your profile's [permissions](./configuration.mdx#permissions) do not allow these changes, the error names the setting
to change.

### Names of people

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

Names of people the tools do not know are found too, and wait for you. Such a name is a common first name in any
case («Ольге», «Sarah»), or a patronymic with the name before it («Анзор Мамедович»), with the surname or second name
beside it («Ольга Смирнова», «John Smith»). A first name that is also an ordinary word, such as «Вера», «Надежда» or
«Grace», counts only next to a second name. These names are never linked by the rules; `show` and `confirm` say who
it is.

When new people appear in your history, read the names again:

```sh
tg personal mentions rebuild person-name
max personal mentions rebuild person-name
```

### Street addresses

A street address is found by its shape: a street word next to a name and a house number. Addresses in Russia, the
rest of Europe, the United Kingdom and the United States are read: «ул. Ленина, д. 5», «Невский проспект 28»,
«Calle Mayor, 12», «12 rue de la Paix», «Hauptstraße 5», «221B Baker Street». A number alone, a price or a postcode is
never an address.

The mention takes the rest of the address too: the flat or suite, the postcode, the city, the region and the country,
also from the next lines of an email signature. The match uses only the street and the house, so «C/ Colón 5» and
«Calle Colón, 5, 46004 Valencia» are one address. Two streets of the same name in two cities are one address too, for
now.

```sh
tg personal mentions list kind:place
tg personal mentions confirm 40
tg personal mentions places
```

`confirm` keeps the address as a place of its own, with everything written there. Every mention of the same
address follows, and later ones are linked without you. `mentions places` lists the places, most mentioned first.
Most addresses are in email signatures; [memo](./mail/email.md) lists mentions in mail with `memo mentions list --source email:<name>`.

### Messages saved earlier

New messages get their mentions as they are saved. Read the history you saved earlier once:

```sh
tg personal mentions rebuild
max personal mentions rebuild
```

It reads every saved message, file text, transcript, note, document and email, shows its progress and keeps every
decision you made. You can run it again at any time.

### Phone numbers and privacy

Phone numbers are kept in the local store as digits, as they already are in the saved messages. They do not go to
logs, error messages or run records. A link is never opened and a site is never contacted.

### What is not there yet

- A list of the mentions in [notes and documents](./memo/notes.md) and in [email](./mail/email.md): they are found and
  searchable, but `mentions list` does not show them.
- A link to an ordinary website tied to anything. Such a link can only be dismissed.
- Places other than street addresses: a city alone, a building's name, a place described in words.
- Addresses outside Europe, the United Kingdom and the United States: they may be found with only part of the
  address.

Once you know where a number, a site or a name came up, [recall the context with that person](./people.md) before you reply.
