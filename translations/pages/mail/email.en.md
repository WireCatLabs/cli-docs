---
title: "Email"
description: "Connect a mailbox with the mail tool, then search it in Memo and link messages to the people you already know."
---

This guide explains how WireCat brings email into your agent's context: connect a mailbox with the
[mail tool](./index.md), then find its messages in Memo next to your notes and chats.
Use it when you want to find a decision in email or prepare for a conversation.

After following the guide, you will be able to:

- connect a mailbox and read the period you need into the shared store;
- link an email address to a person you already know;
- search and label mail with source references and check sync coverage;
- spot senders that look like spam or scams.

Mail is WireCat's own email tool. It copies your mailbox into the shared WireCat store. Memo is a tool
that runs on your computer and searches that store, so your agent can use mail together with notes and
downloaded messenger history. Memo does not change your mailbox.

## Before you start

[Install Mail](./installation.md) and prepare the mailbox: turn on IMAP and make an app password
(a separate password for one program that you can revoke). The [mailbox setup steps](./providers.md)
list this for each provider. [Install Memo using the notes guide](../memo/installation.md) to search mail.
You do not need to import a notes folder. Use a local AI agent on the
same computer. Messenger history is optional, but must already be downloaded if you want it in the same answer.

## Add email

Choose a profile name for the mailbox (here `ya`), then sign in and read the mail. Ask your agent to help:

```text prompt
Help me connect the mail account I choose with the mail tool.
Explain the provider steps, then read mail from the date I choose.
Show the sync result and tell me whether I need another run to finish that period.
```

For manual setup:

```sh
mail personal session start --address you@example.com
mail personal sync --since-time 2026-09-01
mail personal status
```

`session start` finds the server, checks the app password and keeps it in the system keyring. `sync` reads new mail
into the shared store and skips mail it already has. A large mailbox does not fit in one run: when `sync` reports
`state: partial`, run it again, and use `mail personal status` to see how far it got. To keep the mailbox current, schedule it:
`mail personal schedule command mail-personal --every 5m -- sync`. See [everyday use of mail](./usage.md) for folders,
limits and the other commands.

Memo needs no setting for this mail. It reads the same store, so `memo search mail` finds it at once. Search results
identify mailboxes by their addresses, such as `you@example.com`. Addresses you link to people later are the
senders and recipients, not additional accounts you must log into.

The text of a readable attachment is kept with its email and found with it. Memo also prepares new mail for search by
meaning, so `tg personal search conversations` and `max personal search conversations` can find it.

Memo can still import mail through Himalaya, a separate mail program. That older import is kept for existing
setups and will be removed; use `mail` for new accounts and see [the older import](../memo/mail.md) only if you
already rely on it.

## Outlook.com and Microsoft 365

Outlook.com and Microsoft 365 take no app password. You sign in to Microsoft in your browser, and WireCat's own
Microsoft app is built in, so you register nothing.

1. Outlook.com only: turn IMAP on, because Microsoft has it off by default. Open [outlook.live.com](https://outlook.live.com),
   select Settings (the cog), then "Mail", then "Forwarding and IMAP". Turn on "Let devices and apps use IMAP" and
   select "Save". Without it, the sign-in works but the mail server refuses the token.
2. Sign in. The browser opens; sign in to Microsoft and approve access. The tab says "Sign-in received; you can close
   this tab". `--no-browser` prints the link instead.

   ```sh
   mail outlook session start --address you@outlook.com
   ```

3. Read and keep the mail current:

   ```sh
   mail outlook sync
   mail outlook schedule command mail-outlook --every 5m -- sync
   ```

   `sync` reads INBOX and Sent by default. Sending works over the same sign-in.

For a work or school account, your admin may need to allow the app. If Microsoft says so, ask the admin to grant
consent. Sending also needs "Authenticated SMTP" on for the mailbox; reading works without it. See
[the guide to connect Outlook](./outlook.md#work-or-school-account-microsoft-365), which has the admin's link.

## Link email to the same person

An email address and a Telegram or MAX identity remain separate until you explicitly link
them. Linking records that they are the same **person** in the local store; it does not log in
to another account or combine your mailboxes. Import the mail and first store that person’s messenger identity by reading their profile or messages. They do not need to be saved in your address book. Replace the example username and email address:

```sh
tg personal contacts link @example_user email:rin@example.test
memo context telegram:"Rin Example" --json
```

For MAX, use `max personal contacts link` with that person's MAX ID or name. Check the returned identities
and source references. A similar display name is not proof of identity. If several accounts of
the requested provider are stored, use `memo context telegram:"Rin Example" --source telegram:1 --json`
with the account ID you actually use. See [linking and unlinking people](../people.md#link-your-accounts).

## Search your mail

```text prompt
Use Memo to find the budget agreement in the mail account I choose.
Show the matching emails, who wrote them and their source references. Explain the imported date range and any missing data.
```

To search imported email:

```sh
memo search mail 'budget' --json
memo search mail 'quote subject:budget mailbox:important' --json
```

`search mail` searches imported email. Besides words, it takes `from:`, `to:`, `cc:` and `bcc:` for a
person, `subject:` for words of the subject only and `mailbox:` for a folder or Gmail label. Results can include more than one mailbox; check each
source reference and ask your agent to keep the results from the address you choose.
`search all` also searches messages and notes; `skipped` identifies any kind it could not search.
Missing hits outside the imported date window do not establish that no email exists there.

## Spot spam and look-alike senders

Gmail filters most spam, but some scams and automated senders still reach your mail. Memo gives each sender
a score from signs in its mail, so your agent can point out a sender that only pretends to be a known brand.

```text prompt
Use Memo to check which senders in the mail account I choose look like scams.
Show each suspicious sender with its score, the signals behind it and one example email.
Leave out senders that score only because I never open their newsletters.
```

Each sync also scores the senders of
stored mail, at most once a day, and a search hit in `--json` carries its sender's `sender_score`. Mail from a
sender with signs of fraud, such as a brand name sent from another domain or a domain registered in the last
six months, comes after the other results; a domain you have written to is never moved, and `--plain-order`
keeps the plain order. A score from mail you never open only marks a newsletter. See [what each signal means](../memo/mail.md#choose-what-to-import).

## Label emails and keep notes about them

A tag labels a source; a note stores what you want to remember about it. Both are local.
Replace the full message reference and thread/account IDs with values from your results:

```sh
memo tags add follow-up --message 'msg:email/you%40example.com/12345/67890'
memo tags add work --chat 12345 --account email:you@example.com
memo tags list --source email:you@example.com --json
```

A full message reference carries its mailbox, thread and message IDs. For a thread label,
`--account email:<address>` names the mailbox the thread belongs to. These labels do not change Gmail
labels or mailbox flags. To save an assessment linked to one email:

```sh
memo notes add 'Waiting for a revised quote' --subject 'msg:email/you%40example.com/12345/67890' --json
```

See [creating, editing and exporting notes](../memo/notes.md#write-your-own-notes) and
[tagging notes, people and messages](../memo/tags.md) for the full workflow.

## Check the result

Check the selected mailbox, synced date window and whether another run is needed. A context
answer should list the email identity you linked and point to the relevant mail. If it does not,
check that the address is linked, the needed date range was imported and the account was selected.
An empty result from a partial import does not prove there were no agreements.

## If mail is missing

- **No mail account:** run `mail session list` and check the profile name in your command.
- **Only part of the period read:** run `mail <profile> sync` again; `--limit` bounds new messages per run.
- **Results include another mailbox:** check the source references and keep the intended address.
- **Mail is missing from person context:** check the exact email identity link and imported history.

Continue with [notes and source labels](../memo/notes.md#write-your-own-notes) to keep your own context
about the mail you found.
