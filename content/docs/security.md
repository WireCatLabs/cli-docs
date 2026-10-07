---
title: Security
description: Control the assistant's access, understand where your messages go, and know the limits of those controls.
---

WireCat works with your own Telegram or MAX account. Start with reading, decide which actions
you want to allow, and keep your computer and account login private.

## Decide what the assistant can do

[Permissions](./permissions.md) can let an assistant read, ask before changing something, or
refuse an action. You can also restrict recipients and set an hourly send limit. These controls
are useful for preventing a mistaken send or a loop that sends too many messages.

A refusal means the requested action is not allowed by the current settings. Check the recipient
and permission before retrying. Do not tell an assistant to bypass the restriction to make a task finish.

For important replies, ask for a draft and review the recipient and text before sending.
Reading messages does not mark them as read; that is a separate action.

## Where your information goes

The tools run on your computer and connect to your messenger. They keep a local copy of the
messages they read, so search and summaries can use that history later.

Your chosen AI assistant receives the messages you ask it to work with. If you use an online
model for analysis, replies or search by meaning, the data needed for that task may also go to
that model's provider. Local models can keep that processing on your computer; check which
provider you selected before using them with sensitive conversations.

Exports, downloaded files and transcripts contain the information you requested. Choose where
you save them and who can access that folder. `tg doctor` or `max doctor` shows the exact paths
used on your computer.

<a id="what-the-guard-cannot-hold" />

## What the controls cannot protect

- **Someone who can use your computer account.** They may be able to read your stored messages
  and use your messenger login. Use a screen lock, a protected user account and disk encryption.
- **An assistant with unrestricted terminal or file access.** It may change the same settings you
  can change. A read-only profile is useful, but it is not a separate secure computer.
- **Every misleading instruction in a message.** The tools identify message text as information,
  but a model can still misunderstand it. Keep sending permission narrow and review important actions.
- **Data you share with another service.** Permission to read a chat does not control that AI
  service's own storage or privacy policy. Share only the context you need.
- **Actions after they happen.** Messages may be seen before you delete them. Removing a local
  copy does not remove copies held by recipients or other services.

The local message store is not encrypted by the tools. Signing out or uninstalling does not
necessarily remove that copy. Review stored data and exports separately when retiring a computer.

## Connecting from a browser

[Browser setup](./browser-apps.mdx) uses an HTTPS address and a one-time code from your terminal.
Only approve a connection you started, and check the destination app before entering the code.
Never share login codes or messenger credentials in a chat or public issue.

The app's approval and the server's permission are separate controls. If both allow sending
without another question, a tool call can send immediately. Use a profile that only reads when
you do not need sending. Stop the server or tunnel to pause access; `tg mcp --revoke` or
`max mcp --revoke` makes connected apps log in again.

## A practical starting point

1. Connect a profile with permission to read only.
2. Try finding messages and asking for summaries.
3. Allow sending only when you need it, to the recipients you intend.
4. Ask for drafts, keep a send limit, and review your settings when you add another assistant.

## Report a problem

Do not put credentials or private messages in a public issue. For a security problem, contact
[the maintainer](mailto:hello@wirecat.dev) or use private vulnerability reporting on the
[Telegram repository](https://github.com/leemour/tg-cli/security/advisories/new) or
[MAX repository](https://github.com/leemour/max-cli/security/advisories/new).
