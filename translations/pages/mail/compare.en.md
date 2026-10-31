---
title: "Compared with other tools"
---

Pick a tool by the job. This page says what `mail` does, what it leaves out and when to use something else. It
compares `mail` only with other WireCat tools; it makes no claims about other projects. The facts about `mail` come
from its documentation and source, checked on 31 October 2026, before its first release (0.1.0); they are checked
again at each release.

✅ yes · ❌ no · ➖ not covered on this page

The tools:

- **mail**: this tool. Reads a mailbox over IMAP into the shared WireCat store, so you and your AI agent can search it
  without the internet. It signs in with an app password kept in the OS keyring, and serves an MCP server.
- **[Memo](../memo/mail.md)**: imports mail through Himalaya, a separate mail program, beside your notes and
  messages, and searches everything together. Memo does not log in to the mailbox itself.

## What each tool does

| Job | mail | Memo |
| --- | --- | --- |
| Log in to a mailbox itself, with an app password in the keyring | ✅ | ❌ uses an account set up in Himalaya |
| Read mail over IMAP | ✅ | ✅ through Himalaya |
| Search mail offline in the shared store | ✅ | ✅ |
| MCP server for agents | ✅ | ✅ |
| Send, reply or delete mail | ❌ | ➖ not covered here |
| Keep attachments | ❌ text and headers only | ➖ not covered here |

## Providers

`mail` signs in with an app password to Yandex, Gmail, iCloud, Mail.ru and Fastmail, and to any other provider whose
IMAP server it can find (through the MX record, Thunderbird's ISPDB or the domain's autoconfig file) or that you name
with `--host`. Outlook and Microsoft 365 are not supported yet: Microsoft offers OAuth only for IMAP, and `mail` has
no OAuth sign-in. See [preparing the mailbox](./providers.md).

## When to use something else

- You need to send, reply to or delete mail: `mail` is read only.
- Your mailbox is Outlook or Microsoft 365: wait for OAuth sign-in.
- You need the files attached to messages: `mail` does not store attachment bytes.
