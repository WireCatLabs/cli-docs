---
title: "Email and notes with Memo"
description: "Bring email, Markdown notes and messenger history together to prepare for a conversation or find a past decision."
---

Use Memo when the context you need is spread across messages, email and notes. It gathers what
is stored about a person and links back to the sources, so you or your AI agent can prepare for
a meeting or check an agreement. Import your notes and mail first; Memo does not download
Telegram or MAX history itself.

This guide covers **Memo**. Memo is an early-stage tool, available as `@leemour/cli-memo`.

## Install Memo

You need Node.js 22.16 or later in the 22.x series, or Node.js 24 or later, with npm.
For messenger context, [install Telegram or MAX](./installation.mdx) and download the history
you need with that tool. Memo reads their shared local store on the same computer.

```sh
npm install -g @leemour/cli-memo
memo --version
```

The check should print the installed Memo version. An agent with terminal access can run `memo` once it is
on the agent's PATH; give it this guide for the commands below.

## Add your notes

Choose an existing folder of notes and replace `/path/to/vault` with its full path.
Obsidian is the default format; use `--format markdown` for ordinary Markdown links.

```sh
memo folders add /path/to/vault
memo notes import --no-embed
memo notes search 'budget' --json
```

The first command prints a folder ID. Import copies the notes into the local store without
changing the original files. The search returns matching notes with their references and
matching text. `--no-embed` skips the extra step for search by meaning; word search still works.
Run import again after editing your files.

To associate an imported note with a person, replace the name and file path:

```sh
memo note telegram:"Rin Example" /path/to/vault/people/Rin.md
memo context telegram:"Rin Example" --json
```

Use `max:<name or id>` or `email:<address>` for another identity. The note must already be imported.
A name mentioned in ordinary text is not automatically a relationship; use an explicit note
association or a supported link such as an Obsidian `[[Rin Example]]` link.

## Add email

Memo reads email through [Himalaya](https://github.com/pimalaya/himalaya). Install Himalaya and
configure your mail account there first. Memo uses that account's name and address; it does not
need a separate copy of the mail password.

Add `mail.accounts` to Memo's configuration, keeping any existing settings. Default file locations:

| OS | Configuration file |
| --- | --- |
| Linux | `~/.config/cli-memo/config.json` |
| macOS | `~/Library/Preferences/cli-memo/config.json` |
| Windows | `%APPDATA%\cli-memo\Config\config.json` |

`MEMO_CONFIG_DIR` overrides the directory; on Linux, `XDG_CONFIG_HOME` also affects the default.
The example uses a Himalaya account named `gmail`; replace the name and address with yours.

```json
{
  "mail": {
    "accounts": [{ "name": "gmail", "address": "you@example.com" }]
  }
}
```

Gmail is the default mode and imports All Mail. For another IMAP provider, configure
`"mode": "imap"` and `"folders": ["INBOX", "Archive"]` in the account entry, using your
mailbox's actual folder names.

```sh
memo mail import --account gmail --since 2026-09-01 --json
```

Choose the first date you want to include. Each run reads at most 200 new messages by default;
run it again to continue if the result says the import is incomplete. The mailbox is read-only:
import does not send email or mark it read. Imported mail is stored locally; rerunning import
can remove the stored text of mail that has disappeared from the source.

Link an email address to its messenger identity explicitly with `tg contacts link` or
`max contacts link`; matching names alone do not identify the same person. See
[working with people](./people.md) for messenger contact tasks.

## Ask for the context you need

Give your agent a request like this, replacing the name:

> Use Memo to gather what we know about Rin Example before our meeting: recent messages,
> email, linked notes and open tasks. Include links to the sources and say what data is missing.

The agent can use these commands to gather person context or search across imported sources:

```sh
memo context telegram:"Rin Example" --json
memo search 'budget' --all --json
```

`--all` explicitly searches every stored account and imported notes. Check the returned source
references and coverage before relying on an answer. Missing history, mail outside the imported
window or unresolved note links can leave the result incomplete. Add `--account <id>` to
`context` when several accounts of that provider exist.

You can also save your own note about the person:

```sh
memo notes add 'Prefers morning meetings' --about telegram:'Rin Example'
memo notes list --about telegram:'Rin Example' --json
```

These notes live in the local store. Writing them does not change an imported file;
`memo notes export` is a separate, explicit action to write files.

## If something is missing

- **Command not found:** check `memo --version` in the agent's terminal and reopen it after installation.
- **No notes found:** check `memo folders list`, rerun `memo notes import --no-embed` and inspect the import result.
- **No mail account:** check that `mail.accounts` names an account configured in Himalaya.
- **Wrong or ambiguous person:** use the provider and exact ID; link identities explicitly.
- **Incomplete context:** import the relevant notes and mail, and download missing messenger history through tg or max.

When the sources are present, continue with [preparing a meeting brief](./meeting-brief.mdx).
For command options, run `memo --help` or a subcommand's `--help`.
The [Memo source documentation](https://github.com/leemour/cli-memo/blob/v0.2.0/README.md)
also covers tasks, relationships, tags, local reminders and evidence bundles.
