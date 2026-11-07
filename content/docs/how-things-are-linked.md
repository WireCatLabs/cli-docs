---
title: "How things are linked"
description: "Which records the tools connect (messages, people, chats, files, mentions, notes, tasks, facts, Drive documents, tags), who creates each link, and what to run when one is missing."
---

You can ask your agent for everything about one person, or for the messages behind a decision, because the tools keep links between records. This page explains which links exist, who creates each one (the tool, you or your agent) and how to follow them. After it, you can tell why a link is missing and which command adds it. Search and links work on what is already in the local store, so download the history first: [Searching](./search.mdx#fetch-the-relevant-chat-history-first).

## The idea

`tg`, `max`, `memo` and `drive` can share records when explicitly configured to use the same compatible local database. Drive uses the shared database by default (see [where the files live](./drive/configuration.md#where-the-files-live)), so its records can be linked to the other tools unless you moved it. A link is one of two things:

- **Part of the record.** A message has a chat and a sender.
- **A stored link between two records.** A note is about a person. A fact is backed by messages.

Identities are never joined by guessing from names. Each stored link records who made it.

## A reference names any record

Every result carries a reference: a short typed name for the record. Copy it into the next command.

| Reference | What it points to |
| --- | --- |
| `msg:telegram/1/77/42` | One message: messenger, account, chat, message |
| `chat:telegram/1/77` | A chat in one account |
| `contact:telegram/501` | A contact in one messenger |
| `person:7` | A person, with all the accounts you linked to them |
| `organization:3`, `project:4`, `task:5` | Your organizations, projects and tasks |
| `note:12`, `document:3` | A note, or a file from a notes folder or Drive |
| `meeting:1/7/3/4` | A retained transcript cue: account, meeting, transcript, cue position |
| `memory:8`, `fact:9` | A memory or a fact |

A message reference includes the account, so the same message number in another account is a different message. The field that holds the reference is `ref` in most answers. A few answers call it `locator`, and one Drive list calls it `reference`. Copy the value, not the field name.

```sh
tg personal messages context "msg:telegram/1/77/42" --thread
```

## Messages, chats and people

A message belongs to one chat and has a sender. The sender is an identity: one account in one messenger. A person is one or more identities.

Only you join identities into one person. The same name or the same email domain is never enough.

```sh
tg personal contacts link "Kai Sample" max:Kai
```

After that, `contacts events` follows the person across messengers. It lists what they wrote, where they were mentioned, and their chats, mail, meetings and tasks, newest first, from the store only.

```sh
tg personal contacts events "Kai Sample" 'at>=2026-10-01' --limit 20
```

The tool also records who took part in what (sender, recipient, participant, assignee, author, mentioned, linked). That record is why "everything about Kai" is one lookup and not a scan of every message.

The person timeline follows recorded participation and explicit message links. Confirming a found phone, email or name mention makes it searchable with `mentions:`, but does not by itself add a timeline entry.

## Replies and conversations

Every message can point at the earlier message it answers. Each pointer says where it came from:

- **The messenger.** An explicit reply. It wins over everything else.
- **A rule of the tool.** A message that mentions someone, or that continues the same sender.
- **Your agent.** An answer it stored after reading the chat. Storing it needs the profile permission `conversations.links`.

`conversations rebuild` joins these pointers into conversations for one chat. `messages context` with `--thread` follows the chain from a message instead of showing its neighbours in time. A link that went out of date after an edit or a deletion is shown but never followed. A rebuild gives conversations new ids, so keep the `msg:` reference of the message, not the conversation id. How the graph is built: [How search works](./search-architecture.mdx#3-reconstruct-discussions-with-a-message-graph).

## Files, voice notes and pictures

- A file belongs to a message, an email or a meeting. Its extracted text stays with it, so `content:` finds the message that carried the file.
- A voice note's transcript belongs to the message, so `transcript:` finds that message.
- A picture is found through the chat around it or through what it shows. Both are explained in [What gets indexed](./what-is-indexed.md#pictures).

## Meeting transcripts

A transcript cue has a `meeting:` reference that retains its meeting and transcript revision. Use it to read the surrounding passage and keep its coverage. A participant can be explicitly linked to a person, and a meeting can have confirmed project membership; a name match alone creates neither link. A participant link does not establish who spoke a cue. [Meeting evidence and links](./zm/meetings.md) explains how to inspect these associations before saving a sourced finding.

## Mentions

A mention is a phone number, an email address, a link, a Google document link, or the name of a person you know, found by rules in message text, file text and transcripts. Each mention starts as `found`. You then confirm it (`linked`) or reject it (`dismissed`).

- `mentions list` shows what was found. `mentions show <id>` shows the text around one.
- `mentions confirm <id> person:7` says who owns a phone number or an address, or which person a name means. `person:` or `organization:` both work for a phone or an address. A stored Google document needs no argument.
- `mentions reject <id>` dismisses that value everywhere and on later syncs. A plain link cannot be confirmed, only rejected.
- `mentions rebuild` reads messages stored before mentions existed. `mentions rebuild person-name` finds names again after you add or rename people.

Both record who decided. When an agent runs them, the decision is stored under the agent's name; `--as-owner` stores it as yours.

Search finds mentions however they were written: `phone:`, `email:`, `url:` and `domain:` look at the value, and `mentions:"person:7"` finds messages that mention a confirmed person, organization or document. These commands are in the latest releases of `tg` and `max`; run `mentions --help` to check yours. More: [What gets indexed](./what-is-indexed.md#phones-emails-and-links).

## Notes, tasks, facts and memories

`memo` keeps the records that you or your agent write about everything above.

- A **note** is about a person, a chat, a task or a document. A `[[Kai Sample]]` link in a note becomes a link to that person once someone with that name or username is in the store. A name in plain text is not a link.
- A **task** can come from a message. A question task links to the message that answered it.
- A **fact** (a statement, a question, a decision or a promise) keeps links to its evidence: the messages, notes or documents behind it. A new decision can replace an earlier one. A fact your agent adds waits as proposed until you accept it.
- A **memory** is a conclusion with evidence and a review status. A change in the source can make it stale.

## Tags

A tag goes on any record: a message, a chat, a person, a document, a note, a task. `tag:work` finds a message that has the tag, a message in a chat that has it, and a message from a person that has it. A tag on a Drive folder applies to that folder; tag its documents separately.

```sh
tg personal tags add work --chat "Book club"
```

## Drive documents

`drive` imports documents into its configured local store. A document can carry tags, notes, facts and memories, and link to a person (`drive personal relationships`, `drive personal tags`). `drive personal documents list person:7` lists the documents linked to that person.

## Business relationships

A business relationship says how two of your records stand to each other: Alice is a contact of Acme Ltd, Emma
reports to Dana, Acme Ltd buys from your company. `memo` and a CRM tool such as `b24` keep these relationships in
the shared store. So your agent, `memo` and WireCat Desktop read the same answer, with the source of each
relationship.

### Kinds and roles

| Kind | From → to | Roles | Read from the other end |
| --- | --- | --- | --- |
| `member-of` | a person → an organization or a project | organization: `employee`, `contractor`, `founder`, `owner`, `manager`, `adviser`, `contact`. Project: `owner`, `manager`, `contributor`, `client-contact`, `approver` | the organization's or project's people |
| `reports-to` | a person → a person | none | `manages` |
| `customer-of` | a person or an organization → an organization | none | supplier of |
| `partner-of` | an organization ↔ an organization | none | the same both ways |
| `related-to` | a deal or a lead → a person | `owner`, `contact`, `decision-maker`, `influencer` | the person's deals and leads |

Each relationship has one name. The store keeps one direction, and an answer read from the other end shows the
inverse name, such as `manages` for `reports-to`. There is no second name to store, so a relationship cannot exist
twice under two names. A chat can also be `member-of` a project, and `related-to` can join people, organizations,
projects and tasks when no other kind fits.

A role says what the person is in that place, and it comes from the list above. A job title is something else: it
is kept beside the role, for example `--position "Procurement manager"`, and it is never a role. One person can
hold several roles in the same organization. `memo` refuses a role that is not on the list and names the list. A
role saved before the lists existed stays as written, and `relationships list` marks it `custom`.

### How sure a relationship is

Every relationship in an answer has a standing:

| Standing | Means |
| --- | --- |
| `confirmed` | You wrote it, or you confirmed it. |
| `reported` | A CRM account says so, and nobody confirmed it. The answer names the account. |
| `proposed` | Your agent or a scan suggested it. It waits for you in `memo review`. |
| `ended` | It held, and it does not hold now. You ended it, or the source stopped reporting it. |

Your word wins. A CRM sync never changes or ends a relationship you made or confirmed, and it never writes again
one you removed or rejected. When the CRM reports a different role for the same pair, that is a second relationship
next to yours, with its own standing. When the CRM stops reporting a relationship, for example a contact left a
company, the sync ends it. It stays in the store as `ended` and is never deleted. The store also keeps a record of
every change to a relationship: when it was added, changed, ended, confirmed, rejected, withdrawn by its source,
reported again or removed.

### From a CRM to people and organizations

A CRM sync turns its records into the people and organizations you already have:

- **A company** becomes an organization. A company with the same name as one of yours stays a separate
  organization, because names are never matched.
- **A contact** becomes a person. It joins a person you already have only when the e-mail address is exactly the
  same. A name is never enough. If you separated two identities, they stay separate after every sync.
- **Your own company** in the CRM is marked as your own. A company that is `customer-of` your own company is a
  `client`, and one your own company is `customer-of` is a `supplier`. These categories are worked out from the
  relationships each time you ask. A CRM company type, such as `CUSTOMER`, makes a company a customer only when you
  say what the type means.
- **An employee** of the CRM account becomes a person, a member of your own company with the role `employee`.
- **Reporting lines** come from departments: each employee reports to the head of their department, and a head to
  the head of the parent department. The answer says this line was derived from department heads.

Some things a CRM cannot tell, so they come only from you. In Bitrix24 these are a deal contact's part (decision-maker
or influencer), whom a contact reports to, a company's parent company and the dates when a relationship started or
ended. [Who is who in Bitrix24](./b24/usage.md#who-is-who) lists what `b24` reads and the settings that change it,
for example to have every new CRM relationship wait for your review.

To see the relationships of a person, a company or a deal, with examples: [Clients, colleagues and
deals](./people.md#clients-colleagues-and-deals).

## Who makes a link

| Link | Made by |
| --- | --- |
| A message in its chat, with its sender | The tool, when it saves the message |
| A reply | The messenger |
| A guessed reply (mention, same sender) | A rule of the tool |
| A chosen reply | Your agent, with `conversations.links` |
| A phone, email, link, document or name found in text | A rule of the tool, as `found` |
| A mention confirmed or rejected | You, or your agent, recorded by name |
| Two identities, one person | You, with `contacts link` |
| A tag | You, with `tags add` |
| A note, a task or a fact about a record | You, or your agent through `memo` |
| A fact from an agent | Your agent, as proposed; you accept it |

Each stored link records its source: `file` (written in a note file), `owner` (added by you), `suggested` (proposed, not yet confirmed) or `message` (written in a stored message).

A link between an identity and its person also keeps how it was made, how sure it is and who made it, and every move
of an identity from one person to another is logged, so a wrong link can be undone. The rule for every tool is that
a link you made is never replaced by an automatic one, and two equally good candidates make no link at all
([the data-model standard](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/data-model.md)).
**Coming in the next cli-core release:** the same record for events and documents, and a review list where you
decide the pairs the tools could not tell apart.

## Use links in a question

Four requests an agent can answer because of links. Replace the names with yours.

```text prompt
Use tg CLI. Find the message where we agreed on the delivery date, then show the messages around it as one conversation.
```

```text prompt
Use tg CLI. Who owns the phone number +1 555 010 0100? Show where it appears and propose a person.
```

```text prompt
Use tg CLI. Show everything about Kai Sample in the last month, across every messenger I linked to them.
```

```text prompt
Use memo. Which task came from the message about the invoice, and which message answered it?
```

## If a link is missing

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| A person's timeline shows one messenger only | The identities are not linked | `contacts link`, then ask again |
| `--thread` shows only neighbours in time | No conversations built for the chat | `conversations rebuild --chat "Book club"` |
| A phone or email in an old message is not found | The message was stored before mentions existed | `mentions rebuild` |
| A name of a new contact is not found | Mentions were built before the person existed | `mentions rebuild person-name` |
| Words inside a file are not found | The file text was not extracted | `attachments extract` |
| A chat has no messages at all | The history was never downloaded | `messages sync` |

Next: [Search efficiently](./search.mdx) shows how to pick the right command and narrow a search. For the stored columns behind these links, see [the data model](./data-model.mdx#how-they-connect).
