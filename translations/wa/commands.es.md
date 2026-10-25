---
title: "Todos los comandos"
---

<!-- Generated from the command tree by scripts/commands.ts. Do not edit; run `pnpm generate`. -->

Consulta la sintaxis de cada comando, sus opciones y sus códigos de salida. Las descripciones técnicas de API y campos se conservan en inglés.

El mismo catálogo en JSON: `wa commands --json`.

Estructura del comando:

```sh
wa [profile] [options] <resource> <verb> [arguments]
```

**La primera palabra es el perfil** cuando no es un comando: `wa work chats list` muestra los chats del perfil `work`. `WA_PROFILE` lo fija para toda la sesión del terminal; ningún ajuste del archivo de configuración lo elige. **No se presupone un perfil**, aunque solo exista uno: sin nombre, un comando que necesita cuenta termina con código 2 y enumera los perfiles del ordenador. Los comandos sin cuenta (`--help`, `--version`, `commands`, `skill show`, `account list`, `config show`) funcionan sin perfil.

## Opciones globales

| Opción | Qué hace |
|---|---|
| `-V, --version` | output the version number. |
| `-v, --verbose` | more detail in what is shown: -v ids, -vv everything we know. Default: `0`. |
| `--json` | machine-readable output: one JSON value on stdout; --json=id,text keeps only those fields. |
| `--jsonl` | machine-readable output: one JSON object per line, for streaming and jq. |
| `--quiet` | diagnostics off; a failure is still said. |
| `--trace` | the connection's own log lines on stderr — never message content. |
| `--debug` | on a failure, its whole record — cause and stack — in place of the short line. |
| `--timeout <duration>` | give up on the whole command after this — 30s, 2m, 500ms. |
| `--offline` | answer from what was recorded and never connect; fails if nothing was. |
| `--no-input` | never prompt or open interactive login; piped input remains available. |
| `--max-input-bytes <bytes>` | maximum buffered input bytes (default: 16777216). |
| `--max-output-bytes <bytes>` | maximum machine output bytes (default: 4194304; 0 disables). |
| `--brief` | found messages as reference, title, time, sender and excerpt only. |
| `--full` | found messages with their whole text and every provider field. |
| `--dry-run` | preview parsed arguments and permissions before running the action. |
| `--yes` | go ahead without the question an ask level puts before a write. |
| `--record` | keep this run — ids and timings, never message content. |
| `--no-record` | do not keep it, whatever the configuration says. |

## `wa session`

link this profile to WhatsApp as a device, or unlink it

### `wa session start`

link by QR code (default) or a pairing code, then keep the pushed history

**Changes something in WhatsApp.**

```sh
wa session start [method]
```

| Argumento | | Qué es |
|---|---|---|
| `method` | optional | how to link. One of: `qr`, `phone`. Default: `qr`. |

### `wa session end`

unlink this device on WhatsApp's side and delete its keys here

**Changes something in WhatsApp.**

```sh
wa session end
```

## `wa setup`

set up WhatsApp and connect your agent

**Changes something in WhatsApp.**

```sh
wa setup [options]
```

| Opción | Qué hace |
|---|---|
| `--agent <agent>` | install the skill for this agent; asks at a terminal, otherwise none. One of: `none`, `codex`, `cursor`, `claude`, `gemini`, `all`. |
| `--method <method>` | how to log in when there is no session. One of: `qr`, `phone`. Default: `qr`. |

## `wa account`

the logged-in account

### `wa account list`

every profile on this computer, and the account each is logged in as; asks the messenger nothing

```sh
wa account list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

### `wa account show`

who this profile is logged in as; the phone number shows its last four digits

```sh
wa account show [options]
```

| Opción | Qué hace |
|---|---|
| `--show-phone` | print the whole phone number. |

### `wa account update`

change the name, the description or the photo everyone sees on your profile

**Changes something in WhatsApp.**

```sh
wa account update [options]
```

| Opción | Qué hace |
|---|---|
| `--first-name <name>` | your first name. |
| `--last-name <name>` | your last name. |
| `--description <text>` | about you. |
| `--photo <file>` | a new profile photo — a .jpg or .jpeg file. |

### `wa account sessions`

where else this account is logged in — not `wa session`, which is this tool's own login

#### `wa account sessions list`

every device and app logged in to this account; nothing is ended

```sh
wa account sessions list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

### `wa account privacy`

who may find, call or add the account

#### `wa account privacy show`

the account's privacy settings; reading changes nothing

```sh
wa account privacy show
```

#### `wa account privacy set`

change who may find, call or add the account; the settings not named stay

**Changes something in WhatsApp.**

```sh
wa account privacy set [options]
```

| Opción | Qué hace |
|---|---|
| `--last-seen <who>` | who sees when the account was last online: everyone, contacts or nobody. |
| `--hide-online <on\|off>` | hide online status and last seen. |
| `--profile-photo <who>` | who sees the profile photo: everyone, contacts or nobody. |
| `--about-text <who>` | who sees the about text: everyone, contacts or nobody. |
| `--read-receipts <on\|off>` | send read receipts. |
| `--chat-invites <who>` | who may add the account to groups and channels: everyone, contacts or nobody. |
| `--calls <who>` | whose calls ring: everyone, contacts or nobody. |

## `wa chats`

the account's chats

### `wa chats list`

chats, newest first, archived ones included; the query is answered from the local store, so online, where the messenger filters nothing, it needs --offline

```sh
wa chats list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

### `wa chats events`

who joined, left, was added or removed, and by whom — from the chat's service messages; the last 7 days unless the query names time

```sh
wa chats events <chat> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

### `wa chats inspect`

what an invite or public link leads to, without joining it

```sh
wa chats inspect <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | required | an invite link or a public one. |

### `wa chats show`

one chat: its kind, unread count, last message time and who is in it

```sh
wa chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats documents`

the Google Docs and Drive documents linked in a chat's stored messages

#### `wa chats documents list`

every document link in the chat, newest first, and whether the store has it

```sh
wa chats documents list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

### `wa chats members`

who is in a group

#### `wa chats members list`

everyone in a group, a page at a time, with their role and when they were last seen

```sh
wa chats members list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms; this list filters by none yet. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

#### `wa chats members check`

members that look like bots, each with its reasons — read from the member list and the local store; never one request per person, and it removes nobody

```sh
wa chats members check <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |
| `--deep <n>` | also check the top n in full — profile, photos and everything they wrote — one person a second; the public ban lists cover Telegram only, so nothing is sent. |

#### `wa chats members history`

who joined, who left and whose profile changed, oldest first — what chats members fetch recorded in the local store; never asks the messenger

```sh
wa chats members history <chat> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa chats members fetch`

read a group's whole member list into the local store's member history: who joined, who left, daily counts and profile changes; someone is recorded as gone only when every member was read

**Changes something on this computer only.**

```sh
wa chats members fetch <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--track` | also fetch it daily while serve runs; chats tracking lists and edits those chats. |
| `--max-pages <pages>` | at most this many pages of 200 members, a pause between them (default: 10). |

#### `wa chats members add`

add people; they are told

**Changes something in WhatsApp.**

```sh
wa chats members add <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | an id, or part of a name. |

#### `wa chats members remove`

remove people; their messages stay

**Changes something in WhatsApp.**

```sh
wa chats members remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | an id, or part of a name. |

### `wa chats mark-read`

mark a chat read; the other side sees that you read it

**Changes something in WhatsApp.**

```sh
wa chats mark-read <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--until-id <id>` | only up to this message id; the newest by default. |

### `wa chats tracking`

the chats whose member lists serve fetches daily into the local store — chats members fetch --track adds one

#### `wa chats tracking list`

every tracked chat: since when, and its last member count

```sh
wa chats tracking list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa chats tracking show`

one chat: whether it is tracked, and its member count per day for the last 30 days

```sh
wa chats tracking show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

#### `wa chats tracking add`

fetch this chat's member list daily while serve runs, from its next run

**Changes something on this computer only.**

```sh
wa chats tracking add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

#### `wa chats tracking remove`

stop fetching it daily; the history already kept stays

**Changes something on this computer only.**

```sh
wa chats tracking remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats create`

create a group or a channel; the people added are told

**Changes something in WhatsApp.**

```sh
wa chats create <title> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | required | the group's name. |
| `person` | optional | people to add: an id, or part of a name. |

| Opción | Qué hace |
|---|---|
| `--channel` | a private channel instead of a group; people join it by its link. |

### `wa chats join`

join a group or channel by its link; the others in it see that you joined

**Changes something in WhatsApp.**

```sh
wa chats join <link>
```

| Argumento | | Qué es |
|---|---|---|
| `link` | required | an invite link, or a public one. |

### `wa chats leave`

leave a group or channel; the others in it see that you left

**Changes something in WhatsApp.**

```sh
wa chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats update`

rename a group or channel, change its description, or turn one of its settings on or off

**Changes something in WhatsApp.**

```sh
wa chats update <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--title <title>` | the new name. |
| `--description <text>` | the new description. |
| `--photo <file>` | a new photo for it — a .jpg or .jpeg file. |
| `--remove-photo` | take its photo away; not with --photo. |
| `--only-admins-add <on\|off>` | only admins may add members. |
| `--join-approval <on\|off>` | people ask to join, and an admin lets them in. |
| `--only-admins-send <on\|off>` | only admins may send messages. |
| `--only-admins-edit-info <on\|off>` | only admins may change the name, photo and description. |
| `--disappear-after <duration\|off>` | new messages disappear this long after sending: 24h, 7d, 90d; off keeps them. |

### `wa chats links`

a group's invite link

#### `wa chats links show`

the invite link, if you may see it

```sh
wa chats links show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

#### `wa chats links reset`

replace the invite link; the old one stops working

**Changes something in WhatsApp.**

```sh
wa chats links reset <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats requests`

requests to join a group that needs an admin's approval

#### `wa chats requests list`

who asked to join, newest first; only admins see them, and reading tells nobody

```sh
wa chats requests list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

#### `wa chats requests confirm`

let them in; the group sees them join

**Changes something in WhatsApp.**

```sh
wa chats requests confirm <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | who asked: an id from `chats requests list`. |

#### `wa chats requests reject`

turn the request away

**Changes something in WhatsApp.**

```sh
wa chats requests reject <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | who asked: an id from `chats requests list`. |

### `wa chats admins`

give or take back a member's admin rights

#### `wa chats admins add`

make a member an admin, with every right: members, admins, info, pin, link, post, delete

**Changes something in WhatsApp.**

```sh
wa chats admins add <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | an id, or part of a name. |

#### `wa chats admins remove`

take an admin's rights back; they stay a member

**Changes something in WhatsApp.**

```sh
wa chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `person` | required | an id, or part of a name. |

### `wa chats folders`

your chat folders

#### `wa chats folders list`

your chat folders, in the order the app shows them

```sh
wa chats folders list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa chats folders show`

one chat folder, with the names of the chats in it

```sh
wa chats folders show <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | required | the folder's id, or its title exactly. |

#### `wa chats folders create`

create a chat folder

**Changes something in WhatsApp.**

```sh
wa chats folders create <title> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `title` | required | the folder's name; the app may refuse a long one. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat to put in it, by id or name; repeat it for more. |

#### `wa chats folders update`

rename a folder, or change which chats are in it

**Changes something in WhatsApp.**

```sh
wa chats folders update <folder> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | required | folder id, or its title exactly. |

| Opción | Qué hace |
|---|---|
| `--title <title>` | a new name. |
| `--add <chat>` | put a chat in it; repeat it for more. |
| `--remove <chat>` | take a chat out of it, and off its excluded and pinned lists; repeat it for more. |

#### `wa chats folders delete`

delete a folder; the chats in it stay

**Changes something in WhatsApp.**

```sh
wa chats folders delete <folder>
```

| Argumento | | Qué es |
|---|---|---|
| `folder` | required | folder id, or its title exactly. |

### `wa chats rules`

what `chats moderate` judges a group by, kept in a file of this profile

#### `wa chats rules show`

the group's rules; the defaults, marked not saved, if it has none yet

```sh
wa chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

#### `wa chats rules set`

change one rule; the group's first change writes every rule with its default

**Changes something on this computer only.**

```sh
wa chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |
| `value` | required | the new value; a list is comma-separated. |

#### `wa chats rules unset`

put one rule back to its default

**Changes something on this computer only.**

```sh
wa chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `key` | required | one of: trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove. |

### `wa chats moderate`

judge a group's new messages and members by its rules, and act as they allow

**Changes something in WhatsApp.**

```sh
wa chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

### `wa chats mute`

stop notifications from a chat, for good or until a time; nobody in it is told

**Changes something in WhatsApp.**

```sh
wa chats mute <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--until <time>` | only until then: 2026-09-25T09:00 (local time), or 30m, 2h, 7d from now. |

### `wa chats unmute`

hear a muted chat again

**Changes something in WhatsApp.**

```sh
wa chats unmute <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats archive`

move a chat into the archive; nobody in it is told

**Changes something in WhatsApp.**

```sh
wa chats archive <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats unarchive`

bring an archived chat back to the chat list

**Changes something in WhatsApp.**

```sh
wa chats unarchive <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats pin`

keep a chat at the top of your chat list; nobody in it is told

**Changes something in WhatsApp.**

```sh
wa chats pin <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats unpin`

let a pinned chat move down the chat list again

**Changes something in WhatsApp.**

```sh
wa chats unpin <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats mark-unread`

mark a chat unread on your own devices; nobody in it is told

**Changes something in WhatsApp.**

```sh
wa chats mark-unread <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa chats delete`

delete a chat from this account; the others in it keep it and its messages

**Changes something in WhatsApp.**

```sh
wa chats delete <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `wa chats clear`

delete every message in a chat for this account; the others in it keep theirs

**Changes something in WhatsApp.**

```sh
wa chats clear <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

## `wa contacts`

people this account has a one-to-one chat with

### `wa contacts list`

people you have a one-to-one chat with; name: matches the name, your local alias or the @username, notes: your private notes about them

```sh
wa contacts list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |
| `--order <recent\|name>` | newest conversation first, or alphabetical. Default: `recent`. |

### `wa contacts show`

one person and the chats you share with them

```sh
wa contacts show <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Opción | Qué hace |
|---|---|
| `--with-notes` | include your private notes, subject to contacts.notes.list permission. |

### `wa contacts info`

everything the messenger says about one person — handles, flags, last seen, when they registered — and how many of their messages the store holds in each chat you share, the first and the last, and the earlier names and usernames the store saw them with

```sh
wa contacts info <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Opción | Qué hace |
|---|---|
| `--show-phone` | print the whole phone number. |

### `wa contacts context`

what the store holds about one person, in every messenger linked to them: shared chats, the last messages each way, their recent messages, where others mentioned them — never connects

```sh
wa contacts context <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | at most this many messages in each list; 10 if not given. |
| `--since-time <time>` | nothing older than this ISO 8601 time, or 2h / 1d ago. |
| `--chat <chat>` | a chat, by id or name; repeat it for more — then their newest messages in each, 20 unless --limit, short unless -v. |

### `wa contacts prepare`

before you talk to someone: what contacts context gives, plus the one-to-one chats where they wrote last, open tasks, accepted facts, your notes and their recent meetings, each with its reference; never connects

```sh
wa contacts prepare <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | at most this many messages, and items in each section; 10 if not given. |
| `--since-time <time>` | no message or meeting older than this ISO 8601 time, or 2h / 1d ago. |

### `wa contacts events`

everything one person took part in, in every messenger linked to them — messages they wrote or were mentioned in, chats, mail, meetings, tasks — newest first, from the store; never connects

```sh
wa contacts events <person> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | at most this many; 50 if not given. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it, with the same filters. |

### `wa contacts check`

whether one person looks like a bot, a fake or a spammer: their profile and what they wrote in the store — a hint, never a verdict; the public ban lists cover Telegram only, so nothing is sent

```sh
wa contacts check <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |

| Opción | Qué hace |
|---|---|
| `--no-registries` | do not ask the public ban lists; nothing about them leaves this machine. |

### `wa contacts link`

record that two people in the store are one person — the same name is never enough

**Changes something on this computer only.**

```sh
wa contacts link <person> <other>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name. |
| `other` | required | the same in another messenger of the store, as <messenger>:<person> — max:Ana; me: it is you, as zoom:<id> me. |

### `wa contacts unlink`

undo contacts link for one identity: it is a person of its own again

**Changes something on this computer only.**

```sh
wa contacts unlink <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | their id, @username, or part of their name; <messenger>:<person> for another messenger. |

### `wa contacts lookup`

who has this phone number — asks for it, or reads it from stdin; never an argument

```sh
wa contacts lookup
```

### `wa contacts sync`

take the whole contact list from the messenger into the local store

**Changes something on this computer only.**

```sh
wa contacts sync
```

### `wa contacts aliases`

a private local display name in the selected account

#### `wa contacts aliases set`

your own name for a person in this account; kept on this machine, never sent

**Changes something on this computer only.**

```sh
wa contacts aliases set <person> <alias>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `alias` | required | the private name to use for this person. |

#### `wa contacts aliases remove`

drop your local name for a person; their own name shows again

**Changes something on this computer only.**

```sh
wa contacts aliases remove <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |

### `wa contacts notes`

your private notes on a stored contact, the same in every account that sees them

#### `wa contacts notes list`

every private note you keep on a person, oldest first

```sh
wa contacts notes list <person> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa contacts notes show`

one private note on a person, with its revision for edit

```sh
wa contacts notes show <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

#### `wa contacts notes add`

add a private note on a person from stdin or --text-file; never sent

**Changes something on this computer only.**

```sh
wa contacts notes add <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |

| Opción | Qué hace |
|---|---|
| `--text-file <path>` | read note text from a file; omitted or - reads stdin. |

#### `wa contacts notes edit`

replace a note's text; --revision must match the one you read

**Changes something on this computer only.**

```sh
wa contacts notes edit <person> <id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

| Opción | Qué hace |
|---|---|
| `--text-file <path>` | read note text from a file; omitted or - reads stdin. |
| `--revision <n>` | the revision you read before editing. |

#### `wa contacts notes remove`

delete one private note on a person

**Changes something on this computer only.**

```sh
wa contacts notes remove <person> <id>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the person's id, reference or known name. |
| `id` | required | the note id from contacts notes list. |

### `wa contacts add`

add a person to your contacts — `contacts list` still shows only people you have a dialog with

**Changes something in WhatsApp.**

```sh
wa contacts add <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `wa contacts block`

stop a person from writing to you — they need not be a contact

**Changes something in WhatsApp.**

```sh
wa contacts block <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `wa contacts unblock`

let a blocked person write to you again

**Changes something in WhatsApp.**

```sh
wa contacts unblock <person>
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |

### `wa contacts rename`

rename the contact in the messenger address book; use contacts alias for a private local name

**Changes something in WhatsApp.**

```sh
wa contacts rename <person> <first-name> [last-name]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | person id — `contacts lookup` finds one — or part of a known name. |
| `first-name` | required | the name you want to see for them. |
| `last-name` | optional | the last name you want to see for them. |

### `wa contacts import`

upload phone numbers and add the people the messenger has under them

**Changes something in WhatsApp.**

```sh
wa contacts import <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | required | one person per line: number, then a comma, a tab or a semicolon, then the name. |

## `wa messages`

read and send messages

### `wa messages evidence`

general chat context, newest first, with references, coverage and fingerprints for verification

```sh
wa messages evidence <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many, 1–100. |
| `--cursor <cursor>` | go on from where page.next says the last packet stopped. |

### `wa messages list`

a chat's messages, oldest to newest

```sh
wa messages list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | where to start: id<42, date>2026-10-01; starred:true keeps the ones you starred. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |

### `wa messages send`

send a text message; without [text], the text is read from stdin

**Changes something in WhatsApp.**

```sh
wa messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `text` | optional | the message. |

| Opción | Qué hace |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--operation-id <id>` | repeat a send whose outcome was unknown, without risking a second copy. |
| `--no-preview` | no preview card for a link in the text. |
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--file <file>` | attach a file; the text becomes its caption; repeat it for an album. Default: ``. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption; repeat it for an album. Default: ``. |
| `--as-file` | send each --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from credential folders or this CLI's own folders. |
| `--filename <name>` | the name others see for the --file, instead of its name on disk. |
| `--sticker-file <file>` | send a .webp file as a sticker, alone, with no text. |

### `wa messages show`

one message, by its chat and id or by its msg: locator

```sh
wa messages show <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

### `wa messages context`

a message and what came either side of it, oldest first

```sh
wa messages context <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

| Opción | Qué hace |
|---|---|
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--before-n <n>` | how many before it. Default: `5`. |
| `--after-n <n>` | how many after it. Default: `5`. |

### `wa messages download`

save a message's photos, files, videos and voice notes to a folder — or a whole chat's with --all

**Changes something on this computer only.**

```sh
wa messages download <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | optional | the message id; left out with --all. |

| Opción | Qué hace |
|---|---|
| `--output-dir <dir>` | where to save them; created if missing. Default: `.`. |
| `--all` | every file of the chat, newest first; run it again to continue where it stopped. |
| `--pause <duration>` | with --all, a pause between pages, to stay under the provider's limits. Default: `2s`. |
| `--extract` | read text layers from the files this download maps into the local content index. |

### `wa messages transcribe`

a voice message as text — by WhatsApp where it can, else by a model on this machine

```sh
wa messages transcribe <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the id of a voice message. |

| Opción | Qué hace |
|---|---|
| `--local` | use the model on this machine, never the messenger. |
| `--model <model>` | which downloaded model; implies --local (`models list`). |

### `wa messages edit`

change the text of your own message; the other side may have read it already

**Changes something in WhatsApp.**

```sh
wa messages edit <chat> <message> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the id of your own message. |
| `text` | optional | the new text; without it, read from stdin. |

| Opción | Qué hace |
|---|---|
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |

### `wa messages delete`

delete messages for you only; with --for-everyone, for everyone in the chat

**Changes something in WhatsApp.**

```sh
wa messages delete <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message ids, by spaces or commas, at most 10. |

| Opción | Qué hace |
|---|---|
| `--for-everyone` | delete for everyone in the chat, not only for you — they cannot get it back. |
| `--allow-dangerous` | go ahead without the question an ask level puts before a deletion. |

### `wa messages forward`

forward one message to another chat

**Changes something in WhatsApp.**

```sh
wa messages forward <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | the chat the message is in: a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

| Opción | Qué hace |
|---|---|
| `--to <chat>` | where it goes: a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--operation-id <id>` | repeat a forward whose outcome was unknown, without risking a second copy. |

### `wa messages pin`

pin a message in a chat; its members are told

**Changes something in WhatsApp.**

```sh
wa messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

| Opción | Qué hace |
|---|---|
| `--expire-time <time>` | how long the pin lasts: 24h, 7d or 30d; 7d by default. |

### `wa messages unpin`

unpin a message in a chat

**Changes something in WhatsApp.**

```sh
wa messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

### `wa messages star`

star a message, so it is easy to find again; only you see the star

**Changes something in WhatsApp.**

```sh
wa messages star <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

### `wa messages unstar`

take the star off a message

**Changes something in WhatsApp.**

```sh
wa messages unstar <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

### `wa messages link`

a message permalink when supported, and its account-scoped locator

```sh
wa messages link <chat> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

### `wa messages comments`

the comments received under a post, oldest to newest

```sh
wa messages comments <chat> <post> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | the chat: a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `post` | required | the post's message id in the chat. |
| `query` | optional | where to start: id<42. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |
| `--cursor <cursor>` | go on from where the last page stopped; page.next gives it. |

### `wa messages links`

why a message is in its conversation: each link it has, and the chain of answers back to the start

```sh
wa messages links <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

### `wa messages sync`

bring a chat's history in the local store up to date, newest first; run it again to continue; --all syncs every chat

**Changes something on this computer only.**

```sh
wa messages sync [chat] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | optional | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--all` | every chat, most recently active first — what search needs; the last 90d unless --since-time or --last. |
| `--limit <n>` | at most this many messages in this run, per chat with --all; 1000 if not given. |
| `--page-size <n>` | how many messages one request asks for; 50 if not given. |
| `--pause <duration>` | the least pause between pages, to stay under the provider's limits; each is up to twice that. Default: `2s`. |
| `--since-time <time>` | stop once it reaches messages older than this: ISO 8601, or 2h / 1d ago. |
| `--last <n>` | stop once the newest n messages are held. |
| `--catch-up` | prepare local search after this run; overrides search_catch_up. |
| `--no-catch-up` | skip local preparation after this run. |
| `--catch-up-chunks <n>` | at most this many local vector chunks. |
| `--catch-up-messages <n>` | skip a graph rebuild larger than this many messages. |
| `--catch-up-time <duration>` | local preparation time budget, 30s by default. |
| `--background` | run as a job that outlives this command; `store jobs show` follows it. |
| `--dry-run` | only estimate how many messages, requests and minutes a full fetch would still take — from the store, no request. |

## `wa reactions`

react to messages

### `wa reactions add`

put your reaction on a message; it replaces the one you had

**Changes something in WhatsApp.**

```sh
wa reactions add <chat> <message> <emoji>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |
| `emoji` | required | one emoji, for example 👍. |

### `wa reactions remove`

take your reaction off a message

**Changes something in WhatsApp.**

```sh
wa reactions remove <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the message id. |

## `wa polls`

read a poll, vote in it, create one

### `wa polls show`

a poll and its answer ids, as the message carries it now

```sh
wa polls show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the id of the message that carries the poll. |

### `wa polls voters`

who voted for what, newest first

```sh
wa polls voters <chat> <message> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the id of the message that carries the poll. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

### `wa polls vote`

vote in a poll, or take your vote back; the others see it

**Changes something in WhatsApp.**

```sh
wa polls vote <chat> <message> [answers] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | the id of the message that carries the poll. |
| `answers` | optional | answer ids, as `polls show` prints them. |

| Opción | Qué hace |
|---|---|
| `--retract` | take your vote back. |

### `wa polls create`

send a poll to a chat, as a message of its own; everyone sees who voted for what

**Changes something in WhatsApp.**

```sh
wa polls create <chat> <question> <answers> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `question` | required | the question. |
| `answers` | required | two answers or more. |

| Opción | Qué hace |
|---|---|
| `--multiple` | people may pick several answers. |
| `--operation-id <id>` | repeat a create whose outcome was unknown, without risking a second poll. |

## `wa models`

models that run on this machine

### `wa models keys`

API keys for embedding and analysis providers

#### `wa models keys set`

store a key, typed at a hidden prompt or piped on stdin — never as an argument

**Changes something on this computer only.**

```sh
wa models keys set <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | required | openai, anthropic, or the host of a --base-url server that wants a key. |

#### `wa models keys remove`

forget a stored key

**Changes something on this computer only.**

```sh
wa models keys remove <provider>
```

| Argumento | | Qué es |
|---|---|---|
| `provider` | required | openai, anthropic, or a server's host. |

### `wa models list`

speech and embedding models, their download status and the default of each kind

```sh
wa models list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

### `wa models download`

download and verify one speech or embedding model

**Reads from an outside service.**

```sh
wa models download <model> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `model` | required | a model id from models list. |

| Opción | Qué hace |
|---|---|
| `--accept-terms` | accept the model's licence terms, for a model that has its own. |

## `wa inbox`

other people's unread messages in every chat; --new for what arrived since the last check

```sh
wa inbox [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | from when: date>2h, date>2026-10-01; the saved point stays put. |

| Opción | Qué hace |
|---|---|
| `--new` | what arrived since the last check, each message once — for scheduled runs. |
| `--limit <n>` | at most this many per chat, the newest. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |

## `wa review`

every message, yours too, in chats that changed since a point — for reviewing who owes what

```sh
wa review [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | where the last review ended and which chat: date>2h, chat:"Book club"; 3 days ago if no date. |

| Opción | Qué hace |
|---|---|
| `--unanswered [duration]` | only questions to you or a group's admins that nobody answered, asked at least this long ago — 4h, 1d; 24h if not given. |
| `--all` | muted and archived chats too — left out unless they mention you or reply to you. |
| `--transcribe` | turn voice messages not heard yet into text — by the messenger where it can, else by a model on this machine; can take minutes. |
| `--model <model>` | which downloaded speech model hears them, with --transcribe; `models list` shows them. |
| `--new` | what changed since the last `review --new`, a point per chat — for scheduled runs. |

## `wa watch`

print new messages as they arrive, until Ctrl-C or --timeout (either ends it normally)

```sh
wa watch [options]
```

| Opción | Qué hace |
|---|---|
| `--events` | include changes and receipts; each item names its event. |

## `wa serve`

keep the local store current until stopped — what a systemd or launchd unit runs

**Changes something in WhatsApp.**

```sh
wa serve
```

## `wa server`

`wa serve` in the background: start, stop, restart, status, logs; install adds a systemd or launchd unit

### `wa server start`

start serve in the background — through the unit if one is installed — and answer once it connects

**Changes something on this computer only.**

```sh
wa server start
```

### `wa server stop`

stop this profile's serve — through the unit if it runs under one

**Changes something on this computer only.**

```sh
wa server stop
```

### `wa server restart`

stop it and start it again

**Changes something on this computer only.**

```sh
wa server restart
```

### `wa server status`

whether serve runs for this profile, since when, who started it, and the unit if there is one

```sh
wa server status
```

### `wa server logs`

serve's latest log lines — from the journal under systemd, else its log file

```sh
wa server logs [options]
```

| Opción | Qué hace |
|---|---|
| `-n, --limit <n>` | how many lines. Default: `50`. |

### `wa server install`

write a systemd user unit or a launchd agent for this profile; starts nothing

**Changes something on this computer only.**

```sh
wa server install
```

### `wa server uninstall`

remove this profile's unit; stop it first

**Changes something on this computer only.**

```sh
wa server uninstall
```

## `wa store`

the local store of messages

### `wa store status`

per chat: messages stored, the oldest and newest, and the stretches held completely

```sh
wa store status [chat]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | optional | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa store gaps`

inspect recorded interior coverage gaps and explicitly fetch them

#### `wa store gaps show`

local coverage plan; missing message ids alone do not imply missing history

```sh
wa store gaps show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

#### `wa store gaps repair`

fetch bounded interior gaps and recheck coverage; never delete unseen messages

**Changes something on this computer only.**

```sh
wa store gaps repair <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | total messages in this repair, 500 by default. |
| `--max-gaps <n>` | at most this many gaps, 5 by default. |
| `--repair-time <duration>` | time budget for the repair, 30s by default. Default: `30s`. |
| `--page-size <n>` | messages per provider page. |
| `--pause <duration>` | provider pause between pages. Default: `2s`. |
| `--fingerprint <hash>` | refuse if this previously inspected coverage plan changed. |
| `--catch-up` | prepare local search after repair; overrides search_catch_up. |
| `--no-catch-up` | skip local search preparation after repair. |
| `--catch-up-chunks <n>` | maximum local chunks prepared. |
| `--catch-up-messages <n>` | maximum stored messages read for preparation. |
| `--catch-up-time <duration>` | preparation time within the repair's remaining budget. |
| `--background` | repair as an existing store job; inspect store jobs show. |

### `wa store jobs`

background sync jobs

#### `wa store jobs list`

background sync jobs, newest first

```sh
wa store jobs list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

#### `wa store jobs show`

one background job — the newest when none is named — and what the store now holds of its chat

```sh
wa store jobs show [job]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | optional | the job id `messages sync --background` printed. |

#### `wa store jobs cancel`

stop a running background job after its current page; a later sync resumes where it stopped

**Changes something on this computer only.**

```sh
wa store jobs cancel <job>
```

| Argumento | | Qué es |
|---|---|---|
| `job` | required | the job id. |

#### `wa store jobs retry`

start a partial, failed or died job again, as a new job; the sync resumes where the store stopped

**Changes something on this computer only.**

```sh
wa store jobs retry [job] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `job` | optional | the job id. |

| Opción | Qué hace |
|---|---|
| `--failed` | every chat whose newest job partial, failed or died. |

#### `wa store jobs clear`

forget finished jobs and remove their logs; a running job is kept

**Changes something on this computer only.**

```sh
wa store jobs clear
```

### `wa store export`

a chat's stored messages, oldest first: --jsonl one message per line, --json the list envelope of messages; never asks the messenger

**Changes something on this computer only.**

```sh
wa store export [chat] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | optional | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); several with --output-dir. |

| Opción | Qué hace |
|---|---|
| `--format <format>` | jsonl: one message per line, the default with --output; markdown: a transcript with a heading per day, replies and forwards quoted. |
| `--since-time <time>` | only from this ISO 8601 time, or 30m / 2h / 1d ago, on. |
| `--output <file>` | write JSON lines, or the transcript, to this new file, readable only by you. |
| `--output-dir <dir>` | write into this folder, a file per chat and a manifest; run again on it for only what changed since. |
| `--include <kinds>` | with --output-dir: every stored chat of these kinds, comma-separated: dialog, group, channel, saved. |
| `--all` | with --output-dir: every stored chat of this account. |
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `wa store clear`

delete from the store the chats this account has left, with their messages

**Changes something on this computer only.**

```sh
wa store clear [options]
```

| Opción | Qué hace |
|---|---|
| `--left` | the chats this account has left — the only thing this clears. |
| `--allow-dangerous` | yes, delete — it cannot be undone, and a chat you left cannot be fetched again. |
| `--dry-run` | list the chats it would delete, and delete nothing. |

### `wa store info`

the store file: where it is, its size, its schema and how many rows it holds; changes nothing

```sh
wa store info
```

### `wa store check`

whether the store is healthy — integrity, search indexes, disk, and which chats are behind

```sh
wa store check
```

### `wa store migrate`

bring the store up to this build's schema, then normalize, index and stem the messages and notes stored before it

**Changes something on this computer only.**

```sh
wa store migrate
```

### `wa store rebuild`

rebuild the word index, its typo vocabulary, the stems, the files' word index, the notes' indexes and who took part in what, from what is stored; loses nothing

**Changes something on this computer only.**

```sh
wa store rebuild
```

### `wa store backup`

copy the store into a new file, while it is in use; never overwrites a file

**Changes something on this computer only.**

```sh
wa store backup <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | required | the new file. |

| Opción | Qué hace |
|---|---|
| `--encrypt` | compress and encrypt with a password, typed at a hidden prompt or piped on stdin; it is never kept — lose it and the file cannot be opened. |

### `wa store restore`

put a backup in place of the store; the store it replaces is kept beside it, never deleted

**Changes something on this computer only.**

```sh
wa store restore <file>
```

| Argumento | | Qué es |
|---|---|---|
| `file` | required | a file `store backup` wrote; one written with --encrypt asks for its password. |

### `wa store decrypt`

open a file written with --encrypt into a new file; asks for its password

**Changes something on this computer only.**

```sh
wa store decrypt <file> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `file` | required | a file `store backup --encrypt` or `store export --encrypt` wrote. |

| Opción | Qué hace |
|---|---|
| `--output <file>` | the new file, readable only by you. |

### `wa store repair`

bring every table to this build's shape, deleting nothing: a table of the wrong shape is kept as a copy beside a new one

**Changes something on this computer only.**

```sh
wa store repair [options]
```

| Opción | Qué hace |
|---|---|
| `--dry-run` | say what it would do, and change nothing. |

### `wa store reset`

back the store up beside itself, then delete it and start an empty one at this build's schema; asks first, or --yes

**Changes something on this computer only.**

```sh
wa store reset [options]
```

| Opción | Qué hace |
|---|---|
| `--no-backup` | delete the store without backing it up first. |

### `wa store copies`

the tables `store repair` kept as copies

#### `wa store copies delete`

delete one copy `store repair` kept, named exactly; refuses any other table

**Changes something on this computer only.**

```sh
wa store copies delete <name>
```

| Argumento | | Qué es |
|---|---|---|
| `name` | required | the copy's name, as `store repair` printed it. |

## `wa conversations`

the conversations inside a chat, found in the stored messages by replies, mentions and who wrote next

### `wa conversations list`

a chat's conversations, the newest first: when, how many messages, how many people

```sh
wa conversations list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |

### `wa conversations show`

one conversation's messages, oldest first — by its id, or the one a message is in

```sh
wa conversations show <conversation> [message]
```

| Argumento | | Qué es |
|---|---|---|
| `conversation` | required | a conversation id from `conversations list`; or a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter), with a message. |
| `message` | optional | a message id in that chat: show the conversation it is in. |

### `wa conversations related`

the conversations nearest in meaning to the one a message is in, in every built chat, best first — from the vectors `conversations embed` stored; runs no model

```sh
wa conversations related <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `message` | required | a message id in that chat. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

### `wa conversations status`

how fresh each built chat's conversations and vectors are: messages the build has not seen, chunks with a current, stale or missing vector

```sh
wa conversations status [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat: a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

### `wa conversations batches`

windows of a chat for your own AI agent to link: which earlier message each one answers

#### `wa conversations batches status`

how many messages still wait for an answer, in how many batches, and how much text

```sh
wa conversations batches status [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

#### `wa conversations batches show`

the next window to answer, with the messages before it; message text goes to stdout only

```sh
wa conversations batches show [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--size <n>` | messages to answer per batch, 10–200; 50 by default. |

### `wa conversations links`

message links and the conversations derived from them

#### `wa conversations links rebuild`

find a chat's conversations in what the store holds, replacing the last build; without --chat, every chat that changed since its build and every group never built; never asks the messenger

**Sends text to an outside service.**

```sh
wa conversations links rebuild [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--analyze` | link batches using the configured analysis provider; requires --chat and remembers consent for this chat/provider. |
| `--analysis-provider <provider>` | analysis: agent, openai or anthropic. |
| `--model <model>` | analysis model; overrides analysis_model. |
| `--base-url <url>` | analysis API endpoint; overrides analysis_base_url. |
| `--size <n>` | analysis answer messages per batch, 10–200; default 50. |
| `--max-tokens <n>` | analysis input/output reservation cap per run; default 100000. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |

#### `wa conversations links add`

store your agent's answer to a batch, read as JSON from stdin: { "model", "answers": [{ "message", "parent", "confidence" }] }; all or nothing

**Changes something on this computer only.**

```sh
wa conversations links add [options]
```

| Opción | Qué hace |
|---|---|
| `--batch <id>` | the batch id `conversations batches show` printed. |

#### `wa conversations links clear`

drop your agent's answers for a chat, or only one model's; messages are never touched

**Changes something on this computer only.**

```sh
wa conversations links clear [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--answer-model <model>` | only the stored answers this model gave. |

### `wa conversations embeddings`

stored conversation vectors

#### `wa conversations embeddings status`

how many chunks of a chat have a vector of the model, how many are left, and what is left costs

```sh
wa conversations embeddings status [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

#### `wa conversations embeddings clear`

drop a chat's vectors, or only one model's; messages and conversations are never touched

**Changes something on this computer only.**

```sh
wa conversations embeddings clear [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |

### `wa conversations rebuild`

build, then embed with the model on this machine, the chats that changed since their build and the group chats never built — or only --chat; bounded per run, so run it again for the rest; never asks the messenger, downloads no model and sends no text anywhere

**Changes something on this computer only.**

```sh
wa conversations rebuild [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |

### `wa conversations consents`

remembered analysis permissions for this account's chats and provider endpoints

#### `wa conversations consents list`

which chats and provider endpoints you allowed to analyse, and when

```sh
wa conversations consents list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa conversations consents remove`

forget analysis permissions so the next analysis asks again

**Changes something on this computer only.**

```sh
wa conversations consents remove [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | revoke only this chat's consents; defaults to every chat. |
| `--consent-provider <identity>` | exact provider identity from consents list; defaults to every provider. |

### `wa conversations embed`

compute a vector for each chunk of a chat's conversations for search by meaning — on this machine, or with --embedding-provider through a service and your key; resumes where it stopped; without --chat, every built chat with chunks left, on this machine only

**Sends text to an outside service.**

```sh
wa conversations embed [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--threads <n>` | local: threads in all (default: min(8, cores)). |
| `--concurrency <n>` | remote: requests at once (default: 4). |
| `--max-tokens <n>` | remote: stop before a run that could send more tokens than this. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given, and no limit with --chat. |

## `wa attachments`

the files of stored messages: their text in the local store, where search finds it

### `wa attachments extract`

read the text of downloaded files — text, PDF/DOCX text layers, ODT/ODS/XLSX/PPTX/EPUB — into the local store, where search finds them

**Changes something on this computer only.**

```sh
wa attachments extract [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat's files; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--from-dir <dir>` | match files in this nonrecursive directory; needs --chat. |
| `--cursor <cursor>` | continue from the cursor returned by a bounded extraction. |
| `--download` | first save the files no download saved yet, from the messenger, into --output-dir. |
| `--output-dir <dir>` | with --download, where to save them; created if missing. |
| `--limit <n>` | read at most this many files; run it again to continue. |
| `--ocr` | explicitly call models.ocr for bulk image and scanned-PDF text extraction. |
| `--concurrency <n>` | remote: requests at once (default: 4). |

### `wa attachments list`

files of stored messages, newest first: where each was saved and whether its text is held — never the text

```sh
wa attachments list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

### `wa attachments show`

read a bounded chunk of one retained attachment; JSON includes base64 bytes

```sh
wa attachments show <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); or a msg: locator alone. |
| `message` | optional | the message id. |

| Opción | Qué hace |
|---|---|
| `--attachment <n>` | file position from 1; required for several files. |
| `--page <n>` | render one PDF page as PNG, from 1; optional unpdf/canvas, no OCR. |
| `--offset-bytes <n>` | byte offset from 0. |
| `--chunk-bytes <n>` | bytes to return, 1–1048576 (default524288). |
| `--expected-fingerprint <hash>` | require the whole file SHA-256 from the preceding chunk. |

### `wa attachments update`

keep the text an agent read from a file — a scan, a photo — so search finds it; nothing is sent

**Changes something on this computer only.**

```sh
wa attachments update <chat> [message] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter); or a msg: locator, with no message id after it. |
| `message` | optional | the message id. |

| Opción | Qué hace |
|---|---|
| `--attachment <n>` | which file of the message, from 1; needed when it has more than one. |
| `--text-file <path>` | read the text from this file; - or none reads stdin. |

### `wa attachments download`

archive media from selected chats; verify and keep existing copies

**Changes something on this computer only.**

```sh
wa attachments download <dir> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory; created if missing. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat; repeat for more; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). Default: ``. |
| `--since-time <time>` | include messages from this ISO timestamp with a time zone. |
| `--pause <duration>` | pause between history pages. Default: `2s`. |

### `wa attachments check`

rehash all archived files without connecting to the messenger

```sh
wa attachments check <dir>
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory. |

### `wa attachments jobs`

daily media archive timers for this profile

#### `wa attachments jobs install`

install a Linux daily archive timer for this directory; starts nothing

**Changes something on this computer only.**

```sh
wa attachments jobs install <dir> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

| Opción | Qué hace |
|---|---|
| `--at <HH:mm>` | daily start time. Default: `03:00`. |
| `--timezone <zone>` | IANA time zone of the daily start time. Default: `UTC`. |
| `--chat <chat>` | only this chat; repeat for more; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). Default: ``. |
| `--since-time <time>` | include messages from this ISO timestamp with a time zone. |

#### `wa attachments jobs start`

enable the installed archive timer at login and start its daily schedule

**Changes something on this computer only.**

```sh
wa attachments jobs start <dir>
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

#### `wa attachments jobs stop`

disable the archive timer; a download already running finishes

**Changes something on this computer only.**

```sh
wa attachments jobs stop <dir>
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

#### `wa attachments jobs status`

show whether this directory's archive timer is installed and active

```sh
wa attachments jobs status <dir>
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

#### `wa attachments jobs uninstall`

remove this directory's stopped archive timer; keep archived files

**Changes something on this computer only.**

```sh
wa attachments jobs uninstall <dir>
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | archive directory, used with the same profile as install. |

### `wa attachments move`

move older images into another verified archive; remember their new locations

**Changes something on this computer only.**

```sh
wa attachments move <dir> <archive-dir> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `dir` | required | source media archive directory. |
| `archive-dir` | required | destination archive directory; created if needed. |

| Opción | Qué hace |
|---|---|
| `--before-time <time>` | move images whose message date is before this ISO timestamp with zone. |
| `--dry-run` | show counts and bytes without moving files or creating the destination. |

## `wa tags`

your own labels on chats, people, messages and tasks, kept in the local store and never sent; tag: in a search finds them

### `wa tags rebuild`

derive local group/channel tags from cached metadata using keyword rules

**Changes something on this computer only.**

```sh
wa tags rebuild [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a stored group/channel; repeat to select several. Default: ``. |
| `--limit <n>` | process at most 1–500 chats. Default: `50`. |
| `--sync-first` | read current descriptions from the messenger before classifying. |
| `--dry-run` | preview cached classification without changing the store. |

### `wa tags add`

put tags on one chat, person, message or task

**Changes something on this computer only.**

```sh
wa tags add <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | the chat to tag, or the chat of --message; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--contact <person>` | the person to tag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to tag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | the task to tag: its id or key, as tasks list shows it. |

### `wa tags remove`

take tags off one chat, person, message or task

**Changes something on this computer only.**

```sh
wa tags remove <tag> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `tag` | required | one or more tags: 1–32 letters a–z, digits and hyphens; upper case is lowered. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | the chat to untag, or the chat of --message; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--contact <person>` | the person to untag: their id, @username or name, as the local store knows them. |
| `--message <message>` | the message to untag: its id in --chat, or a msg: locator alone. |
| `--task <id>` | the task to untag: its id or key, as tasks list shows it. |
| `--claim <claim>` | remove only this ownership claim: manual or auto. |

### `wa tags list`

what is tagged: this account's chats, messages and tasks, and the people of its messenger

```sh
wa tags list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

## `wa mentions`

phones, e-mail, links, documents, names and addresses in stored messages

### `wa mentions list`

this account's mentions matching the query, newest first; --new for those found since the last review

```sh
wa mentions list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | fields below; a bare word is a value, so a phone typed with 8 finds it written with +7. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--new` | undecided mentions found since the last --new run that showed them all; the first run shows every one. |

### `wa mentions domains`

the sites this account's links point to, most linked first, with chats and first and last time

```sh
wa mentions domains [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | narrows the links counted: the fields below; dismissed links are never counted. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

### `wa mentions places`

confirmed addresses, in every account, most mentioned first; `mentions confirm <id>` adds one

```sh
wa mentions places [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |

### `wa mentions show`

one mention, the text around it, and how many other places hold its value

```sh
wa mentions show <id>
```

| Argumento | | Qué es |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |

### `wa mentions confirm`

say what a mention is: a phone's owner everywhere it is written, the stored document, who a name means, an address as a place

**Changes something on this computer only.**

```sh
wa mentions confirm <id> [person] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |
| `person` | optional | person:<uid> or organization:<id> that owns the phone or the e-mail address; person:<uid> a name means; a document or a street address needs none. |

| Opción | Qué hace |
|---|---|
| `--all-in-chat` | a name: also every undecided place of the same name in its chat. |
| `--as-owner` | record it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

### `wa mentions reject`

not a real mention: dismiss its value everywhere and on later syncs; a name only where it is

**Changes something on this computer only.**

```sh
wa mentions reject <id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `id` | required | the mention's id, from mentions list. |

| Opción | Qué hace |
|---|---|
| `--all-in-chat` | a name: also every undecided place of the same name in its chat. |
| `--as-owner` | record it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

### `wa mentions rebuild`

find the mentions of every stored message again; decisions are kept

**Changes something on this computer only.**

```sh
wa mentions rebuild [kind]
```

| Argumento | | Qué es |
|---|---|---|
| `kind` | optional | only this kind: person-name after people were added or renamed. One of: `phone`, `email`, `url`, `document`, `person-name`, `place`. |

## `wa images`

search pictures by what they show, with a model on this machine

### `wa images embed`

compute a vector for each picture the store knows and has none for — downloading it through the messenger, keeping only the vector; needs `picture_search` on in the profile and `images models download clip-b32`; resumes where it stopped

**Changes something on this computer only.**

```sh
wa images embed [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--limit <n>` | at most this many pictures in one run; 100 if not given. |

### `wa images models`

models that read pictures, for `images embed` and picture search

#### `wa images models list`

the picture models, which are downloaded, and which one is the default

```sh
wa images models list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa images models download`

download a picture model once, checked against the sha256 this version expects

**Reads from an outside service.**

```sh
wa images models download <model>
```

| Argumento | | Qué es |
|---|---|---|
| `model` | required | a model id from `images models list`. |

## `wa metadata`

cached group/channel descriptions for local automatic tags

### `wa metadata show`

a stored chat's cached description, as automatic tags read it

```sh
wa metadata show [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a stored chat. |

### `wa metadata sync`

fetch group and channel descriptions again and cache them

**Changes something on this computer only.**

```sh
wa metadata sync [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | stored group/channel; repeat for several. Default: ``. |
| `--only-missing` | only chats with no metadata yet; without --chat, every stored group/channel. |
| `--limit <n>` | process at most 1–500 chats. Default: `50`. |

## `wa stats`

statistics about messages, chats and their authors

### `wa stats messages`

message statistics from the local store

#### `wa stats messages show`

how many stored messages match, by chat, sender, day or hour — the local store only

```sh
wa stats messages show [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query, as for search messages; none counts every stored message; with --saved, more words AND-ed to it. |

| Opción | Qué hace |
|---|---|
| `--by <group>` | count by chat, sender, day or hour (default: chat). |
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query. |
| `--limit <n>` | how many rows. |
| `--timezone <zone>` | the IANA timezone for calendar days and hours. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--saved <name\|id>` | count what a saved search or an earlier run matches; options typed here replace its own. |

#### `wa stats messages counters`

per-counter observations and bounded remote refresh

#### `wa stats messages counters show`

show saved counter values and their observation freshness

```sh
wa stats messages counters show [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | strict Lucene query over stored messages. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--source <accounts>` | held accounts of this messenger; refresh uses the active account. |
| `--exact` | bare words match exact forms. |
| `--timezone <zone>` | IANA timezone for query dates. |
| `--selection <json>` | pinned counter-targets selection from counters show; conflicts with query and scope. |
| `--counters <names>` | distinct views,reactions,comments fields; all three by default. |
| `--limit <n>` | messages, 1–100; 20 by default. |
| `--max-age <duration>` | maximum fresh observation age; 24h by default. |

#### `wa stats messages counters sync`

read authoritative counters for bounded messages and update their local observations

**Changes something on this computer only.**

```sh
wa stats messages counters sync [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | strict Lucene query over stored messages. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--source <accounts>` | held accounts of this messenger; refresh uses the active account. |
| `--exact` | bare words match exact forms. |
| `--timezone <zone>` | IANA timezone for query dates. |
| `--selection <json>` | pinned counter-targets selection from counters show; conflicts with query and scope. |
| `--counters <names>` | distinct views,reactions,comments fields; all three by default. |
| `--limit <n>` | messages, 1–100; 20 by default. |
| `--max-messages <n>` | maximum messages to refresh, 1–100. |
| `--sync-time <duration>` | remote refresh budget; 30s by default, maximum 5m. |
| `--dry-run` | preview exact stored targets and counter capabilities without connecting. |

#### `wa stats messages unanswered`

oldest detected questions without an observed qualifying explicit reply

```sh
wa stats messages unanswered [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Opción | Qué hace |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; 20 if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

#### `wa stats messages discussion`

viewed posts with little recorded discussion

```sh
wa stats messages discussion [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Opción | Qué hace |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; 20 if not given. |

#### `wa stats messages top`

rank stored messages by a measure or explainable score; counters are snapshots with per-field observation freshness

```sh
wa stats messages top [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Opción | Qué hace |
|---|---|
| `--measure <name>` | the ranking metric; not with score or weights. One of: `views`, `reactions`, `forwards`, `comments`, `replies`, `thread-size`. |
| `--score <preset>` | helpful/active for authors; engaging for either target. One of: `helpful`, `active`, `engaging`. |
| `--weights <json>` | the complete component weights; replaces preset weights. |
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--timezone <zone>` | the IANA timezone for dates and active days. |
| `--limit <n>` | ranked rows, 1–100. |
| `--saved <name\|id>` | run a saved query or ranking run; typed options replace stored options. |

#### `wa stats messages evidence`

bounded messages, answer pairs or retention members from an exact drilldown selection

```sh
wa stats messages evidence <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | required | the canonical message locator, or retention cohort reference, from drilldown. |

| Opción | Qué hace |
|---|---|
| `--selection <json>` | the resolved ranking selection returned in drilldown. |
| `--component <name>` | the exposed ranking component. |
| `--limit <n>` | evidence rows, 1–100; 20 if not given. |
| `--cursor <cursor>` | continue the same component and stored-evidence fingerprint. |

### `wa stats contacts`

statistics about human authors

#### `wa stats contacts responses`

counts and median/p90 latency for selected human answering identities

```sh
wa stats contacts responses [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Opción | Qué hace |
|---|---|
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; 20 if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

#### `wa stats contacts top`

rank the human authors of stored messages by a measure or explainable score; counters are snapshots with per-field observation freshness

```sh
wa stats contacts top [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | a strict Lucene query; none selects every stored message. |

| Opción | Qué hace |
|---|---|
| `--measure <name>` | the ranking metric; not with score or weights. One of: `messages`, `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads`, `active-days`. |
| `--score <preset>` | helpful/active for authors; engaging for either target. One of: `helpful`, `active`, `engaging`. |
| `--weights <json>` | the complete component weights; replaces preset weights. |
| `--source <accounts>` | every held account of this messenger; personal, bots or all. |
| `--timezone <zone>` | the IANA timezone for dates and active days. |
| `--limit <n>` | ranked rows, 1–100. |
| `--saved <name\|id>` | run a saved query or ranking run; typed options replace stored options. |

#### `wa stats contacts evidence`

bounded messages, answer pairs or retention members from an exact drilldown selection

```sh
wa stats contacts evidence <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `person` | required | the exact native person id from the ranking row. |

| Opción | Qué hace |
|---|---|
| `--selection <json>` | the resolved ranking selection returned in drilldown. |
| `--component <name>` | the exposed ranking component. |
| `--limit <n>` | evidence rows, 1–100; 20 if not given. |
| `--cursor <cursor>` | continue the same component and stored-evidence fingerprint. |

### `wa stats chats`

statistics about one chat

#### `wa stats chats show`

a group's or channel's numbers for a period: messages, active members, replies, reactions, questions answered, joins and leaves — counted from the local store; joins and leaves too

```sh
wa stats chats show <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--by <group>` | also one row per calendar day or week (weeks start on Monday). |
| `--timezone <zone>` | the IANA timezone for calendar days. |

#### `wa stats chats newcomers`

known-join members and their help within a join window

```sh
wa stats chats newcomers <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | from this ISO 8601 time, or 2h / 1d ago; 30d ago if not given. |
| `--until-time <time>` | through this ISO 8601 time, or 2h / 1d ago. |
| `--within <duration>` | the help window after a known newcomer join. |
| `--saved <name\|id>` | run a saved report of this kind; typed report options replace stored options. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--limit <n>` | report rows, 1–100; 20 if not given. |
| `--answerer <person>` | stored name, alias, @username, ID or person:provider/account/id; ambiguous names require a choice; repeat for more. |

#### `wa stats chats retention`

joining cohorts and observed checkpoint membership from saved roster observations

```sh
wa stats chats retention <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | joining period starts at ISO 8601 or a relative time; last 90 days by default. |
| `--until-time <time>` | joining period ends at this time; now by default. |
| `--checkpoints <durations>` | up to 10 increasing joining ages, comma separated; 1d,7d,30d by default. |
| `--within <duration>` | activity and early departure window after joining; 7d by default. |
| `--by <group>` | group joining dates by calendar day or Monday week. One of: `day`, `week`. |
| `--timezone <zone>` | IANA timezone for joining cohorts. |
| `--limit <n>` | cohorts and member evidence, 1–100. |

### `wa stats tasks`

task statistics

#### `wa stats tasks show`

per chat: how many tasks are open, the oldest open one, the median time to close

```sh
wa stats tasks show [options]
```

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--type <type>` | only this type: question, request, mention or promise. |

### `wa stats charts`

a chart's data from a chat's statistics, and optionally a dark SVG or PNG image

**Changes something on this computer only.**

```sh
wa stats charts <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--chart-kind <messages\|active\|membership>` | what to draw: messages, active authors, or joins and leaves. Default: `messages`. |
| `--by <group>` | one point per calendar day or week (weeks start on Monday). Default: `day`. |
| `--since-time <time>` | ISO 8601, or 2h / 1d ago; 7 days ago if not given. |
| `--timezone <zone>` | the IANA timezone for calendar days. |
| `--output <file>` | write a dark image to a new .svg or .png file. |

## `wa tasks`

what waits on you — unanswered questions, mentions, requests, promises — kept in the local store; review and serve add them

### `wa tasks list`

tasks, oldest first, with their message or note source

```sh
wa tasks list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |

### `wa tasks add`

add a task for a stored message or note — a promise, a request

**Changes something on this computer only.**

```sh
wa tasks add <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `message` | required | a message locator, msg:<provider>/<account>/<chat>/<message>, or note:<id>. |

| Opción | Qué hace |
|---|---|
| `--type <type>` | the task's type: question, request, mention or promise. |
| `--category <name>` | what it is about, from the list tasks categories prints: money, documents, meeting, …. |
| `--into <id>` | when tasks add listed tasks that may be the same job: link the message to this one instead of opening a task. |
| `--new` | when tasks add listed tasks that may be the same job: open the task anyway. |
| `--title <title>` | one line: the action and its object — send Alex the API token. |
| `--description <text>` | the detail, in Markdown: who owes whom, done when, next step, keywords. |
| `--due <time>` | when it must be done: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |

### `wa tasks update`

update a task's text, schedule, category, assignees, priority or parent; nothing reaches the messenger

**Changes something on this computer only.**

```sh
wa tasks update <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--category <name>` | what it is about, from the list tasks categories prints: money, documents, meeting, …; a change is kept in the task's history. |
| `--priority <n>` | priority from 0 (urgent) through 4 (low). |
| `--parent <id>` | parent task in the same project; none clears it. |
| `--title <title>` | one line: the action and its object — send Alex the API token. |
| `--description <text>` | the detail, in Markdown: who owes whom, done when, next step, keywords. |
| `--due <time>` | when it must be done: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--remind-time <time>` | when to look at it again: an ISO 8601 time or 2h, 3d from now; none clears it. |
| `--assignee <person...>` | who does it: sender (whoever sent the task's message) or person:<id>; none clears it. Leave it out when unsure: a task with no assignee is better than none. |

### `wa tasks link`

link a task to messages, chats, people or URLs — or to another task: task:<id>

**Changes something on this computer only.**

```sh
wa tasks link <task> [targets] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |
| `targets` | optional | msg: locators, person:<id>, document:<id>, note:<id>, a URL; or task:<id>, which links two project tasks. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | a chat it concerns, repeatable; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--kind <kind>` | related-to (default), evidence — it shows the task is real — or created-from; for task:<id>, related-to, blocked-by, follow-up-of, duplicate-of or discovered-from. |

### `wa tasks show`

one task: its plan and everything linked to it

```sh
wa tasks show <task>
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

### `wa tasks related`

tasks that may be the same job as this one, best first, each with a band — likely, maybe, different — and the reasons; merges nothing

```sh
wa tasks related <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many, at most 40 (default 10). |

### `wa tasks duplicates`

pairs of tasks that may be one job

#### `wa tasks duplicates list`

pairs of tasks a rule opened that may be one job, newest first, with score and reasons: merge, reject or defer each; decision:unsure lists the ones deferred to the owner

```sh
wa tasks duplicates list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many. |

#### `wa tasks duplicates reject`

two tasks are not the same job: the pair leaves the list and is never offered again

**Changes something on this computer only.**

```sh
wa tasks duplicates reject <task> <other-task>
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task listed as the duplicate, by its id or key. |
| `other-task` | required | the task it was paired with. |

#### `wa tasks duplicates defer`

the fields and the text cannot tell: leave the pair to the owner, who lists it with decision:unsure

**Changes something on this computer only.**

```sh
wa tasks duplicates defer <task> <other-task>
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task listed as the duplicate, by its id or key. |
| `other-task` | required | the task it was paired with. |

### `wa tasks merge`

one job seen twice: link every message of the duplicate to the task and close the duplicate dismissed, duplicate-of the task; nothing is deleted, and tasks unmerge undoes it

**Changes something on this computer only.**

```sh
wa tasks merge <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the duplicate, by its id or key; it must be open. |

| Opción | Qué hace |
|---|---|
| `--into <id>` | the task that stays, by its id or key. |

### `wa tasks unmerge`

undo a merge: reopen the task and remove its duplicate-of relation; messages the merge linked stay linked

**Changes something on this computer only.**

```sh
wa tasks unmerge <task>
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the merged task, by its id or key. |

### `wa tasks agenda`

what needs a look today, from the local store and without message text: tasks overdue, due or to check, chats where you owe an answer, chats where you wait for one, open tasks someone else does

```sh
wa tasks agenda [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--due-within <duration>` | list tasks due within this: 30m, 2h, 1d (default 1d). |
| `--unanswered <duration>` | list chats where someone else wrote last this long ago (default 1d). |
| `--waiting <duration>` | list chats where you wrote last this long ago (default 7d). |
| `--within <duration>` | leave out chats silent longer than this: they ended (default 30d). |
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

### `wa tasks categories`

the categories a task takes, with what each means and the words a rule picks it by

```sh
wa tasks categories
```

### `wa tasks scan`

the task rules over a chat's newest stored messages: in a one-to-one chat a question you did not answer, in a group only a question in reply to you and a mention of you, open a task, and your answer closes one; a channel opens none — for a chat the first sync left alone (config task_first_pass_per_chat). Lists what would open and changes nothing unless --yes; with --yes the duplicate check runs as on a sync. Reads only the local store

**Changes something on this computer only.**

```sh
wa tasks scan <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

| Opción | Qué hace |
|---|---|
| `--last <n>` | read the newest n stored messages of each chat (default 50, at most 1000). |

### `wa tasks claim`

take an open task so no other agent works it at once; the claim lapses by itself

**Changes something on this computer only.**

```sh
wa tasks claim <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--lease <duration>` | how long the claim lasts: 30m, 2h (default 30m); claiming again extends it. |
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

### `wa tasks release`

give back a task you claimed, before the claim lapses; the owner may release any

**Changes something on this computer only.**

```sh
wa tasks release <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--holder <name>` | who you are for claims: a session id or a chat id; default WIRECAT_HOLDER, else Claude Code's session, else the agent's name. |

### `wa tasks close`

close a task: done, or dismissed when it needs no answer. An agent (AI_AGENT or CLAUDECODE set) states its --certainty; below config task_agent_close_min, or with task_agent_close off, the task stays open and the close waits on the owner, who confirms it with tasks close or refuses it with tasks reject. A closed task stays closed, unless tasks unmerge reopens a merged one

**Changes something on this computer only.**

```sh
wa tasks close <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--as <state>` | how it is closed: done, or dismissed — it needs no answer; the owner may leave it out to confirm an agent's close. |
| `--reason <text>` | why, kept with the task — no-reply-needed, for example. |
| `--certainty <n>` | an agent's: how sure it is, 0 to 1, that the task needs nothing more. |
| `--as-owner` | close it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

### `wa tasks reject`

refuse the close an agent suggested: the task stays open and leaves close:suggested; the agent may close it again

**Changes something on this computer only.**

```sh
wa tasks reject <task> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `task` | required | the task's id or key, as tasks list shows it. |

| Opción | Qué hace |
|---|---|
| `--as-owner` | refuse it as yours although an agent's terminal runs the tool (AI_AGENT or CLAUDECODE set). |

## `wa search`

find things by text: one resource when you know it (messages, notes), or search all across messages and notes; for mail, the separate memo CLI: memo search mail

### `wa search all`

search messenger messages and notes in the local store, and a meeting account's transcripts when --source names one — best match first; not mail (the separate memo CLI searches it: memo search mail), tasks, people, memories or projects. Use it when you do not know where something was written; search messages or notes reads one kind with all its fields

```sh
wa search all <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | required | strict Lucene query: words, "phrases", AND/OR/NOT, field groups and date ranges. |

| Opción | Qué hace |
|---|---|
| `--only <resources>` | only these resources, separated by commas: messages, notes; meetings when --source names a meeting account. |
| `--source <accounts>` | only these accounts, separated by commas: provider:account as a hit shows it, a provider, a kind or group:<name>; each resource reads the ones of its kind, and meetings only when it names one. |
| `--max-meetings <n>` | how many of the meeting account's meetings to look through, newest first, or all for every one (default 100). |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

### `wa search messages`

search messenger messages in the local store — what was read, fetched or kept by serve; --discover searches the archive only

```sh
wa search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | strict Lucene query: words, "phrases", AND/OR/NOT, field groups and date ranges; with --saved, more words AND-ed to it. |

| Opción | Qué hace |
|---|---|
| `--thread` | the stored reply chain and replies instead of time neighbours; falls back when no graph exists. |
| `--thread-hops <n>` | at most this many links from the hit (default: 8). |
| `--thread-messages <n>` | at most this many messages in each thread context (default: 50). |
| `--thread-bytes <n>` | at most this many bytes of whole messages and links in each context (default: 65536). |
| `--thread-within <duration>` | messages within this long either side of the hit (default: 1d). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query; or a list: group:work,telegram:Alice. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--newest` | newest first instead of best first. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--context <n>` | messages before and after each hit; 2 in the terminal, 0 otherwise. |
| `--discover` | find partial lexical matches and eligible replies in the local archive; results are evidence, not confirmed answers. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--saved <name\|id>` | run a saved search or an earlier run; options typed here replace its own. |

### `wa search notes`

search the notes — written in memo, or imported from a notes folder — by words and, with the local text model, by meaning; each hit says which found it and what it links to

```sh
wa search notes <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | required | strict Lucene query: words, "phrases", AND/OR/NOT, tag:, source:internal (written in memo) or source:file (from a notes folder) and date ranges. |

| Opción | Qué hace |
|---|---|
| `--source <accounts>` | only these notes accounts, separated by commas: notes:internal for notes written in memo, notes:<folder id> as a hit shows it, notes, documents or group:<name>. |
| `--filter <query>` | a query every hit must also match; it does not change the search by meaning. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--exact` | words as written only; meaning is not searched. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |

### `wa search conversations`

the conversations nearest to a query in meaning and in words, best first, in one chat or every one — meaning after `conversations embed`; runs on this machine

**Reads from an outside service.**

```sh
wa search conversations <query> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | required | what to look for, in your own words, in any language the model reads. |

| Opción | Qué hace |
|---|---|
| `--model <model>` | local: a model id from `models list` (default: e5-small); remote: the provider's model. |
| `--embedding-provider <provider>` | embedding provider: local or openai; flags override profile settings. |
| `--base-url <url>` | a server with OpenAI's /v1/embeddings: Gemini, Jina, or Ollama and LM Studio on this machine. |
| `--dims <n>` | remote: the vector size — needed with --base-url; shortens an OpenAI model's. |
| `--max-chats <n>` | at most this many chats in one run; 20 if not given. |
| `--max-chunks <n>` | at most this many chunks embedded in one run; 2000 if not given. |
| `--chat <chat>` | only this chat: a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--since-time <time>` | only those still going at this ISO 8601 time, or 30m / 2h / 1d ago, or later. |
| `--filter <query>` | strict Lucene filter: any message in a conversation must match; does not change the meaning query. |
| `--source <accounts>` | accounts to search: personal, bots, all, a provider, or a list like group:work,telegram:Alice,email:me@example.com; defaults to the active account. |
| `--timezone <zone>` | IANA timezone for filter dates; system timezone by default. |
| `--limit <n>` | how many. |
| `--catch-up` | first build and embed, on this machine, the chats in scope that changed or were never built — within --max-chats and --max-chunks. |

### `wa search runs`

search recorded diagnostic metadata and events; literal words and field:value terms joined by AND; no message contents

```sh
wa search runs [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | matches per page, at most 100. Default: `20`. |
| `--page <n>` | result page. Default: `1`. |

## `wa searches`

saved searches and the history of search messages and stats messages show, kept in the local store; --saved runs one

### `wa searches create`

save a search under a name without running it; search messages --saved <name> runs it

**Changes something on this computer only.**

```sh
wa searches create <name> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | required | up to 64 letters a–z, digits and hyphens, not only digits. |
| `query` | optional | the query, as for search messages; none matches every stored message. |

| Opción | Qué hace |
|---|---|
| `--chat <chat>` | only this chat — the same as chat: in the query; a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |
| `--source <accounts>` | every account of this messenger held in the store; personal, bots or all — the same as in: in the query; or a list: group:work,telegram:Alice,email:me@example.com. |
| `--limit <n>` | how many. |
| `--newest` | newest first instead of best first. |
| `--exact` | bare words and quotes match their exact form only, as exact:word does; text: still matches every form. |
| `--context <n>` | messages before and after each hit. |
| `--timezone <zone>` | the IANA timezone for calendar date boundaries. |
| `--by <group>` | count by chat, sender, day or hour for stats messages show --saved. |
| `--selection <json>` | save the resolved parent ranking query and options from a drilldown. |
| `--replace` | overwrite a saved search of the same name. |

### `wa searches show`

one saved search or earlier run: its query, options and how often it ran

```sh
wa searches show <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | required | a saved search's name, or the id of any row of searches history. |

### `wa searches list`

the saved searches, by name

```sh
wa searches list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

### `wa searches history`

the searches and counts that ran, newest first — saved ones included; never their results

```sh
wa searches history [options]
```

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

### `wa searches delete`

delete a saved search, or one run from the history

**Changes something on this computer only.**

```sh
wa searches delete <name|id>
```

| Argumento | | Qué es |
|---|---|---|
| `name\|id` | required | a saved search's name, or the id of any row of searches history. |

### `wa searches clear`

empty the history; saved searches stay

**Changes something on this computer only.**

```sh
wa searches clear
```

## `wa flood`

the waits WhatsApp asked this profile to keep, and a hold on its writes

### `wa flood clear`

forget them, lift the hold and the profile's pace, once WhatsApp no longer limits the account; changes nothing there

**Changes something on this computer only.**

```sh
wa flood clear
```

## `wa recipients`

the chats this profile may send to, when the list is on

### `wa recipients list`

the chats on the list; empty and off until the first add

```sh
wa recipients list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

### `wa recipients add`

allow sending to this chat; the first add turns the list on

**Changes something on this computer only.**

```sh
wa recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat: its name, or its WhatsApp id (…@lid, …@g.us, …@newsletter). |

### `wa recipients remove`

stop allowing this chat; the list stays on

**Changes something on this computer only.**

```sh
wa recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | chat id, or the title as the list shows it. |

### `wa recipients clear`

delete the list, which turns it off: this profile may send to any chat again

**Changes something on this computer only.**

```sh
wa recipients clear
```

## `wa sends`

every attempt to send from this profile — never the text

### `wa sends list`

attempts to send, newest first: sent, refused, failed, or not known

```sh
wa sends list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. |
| `--page <n>` | which page, starting at 1. |
| `--all` | every row, no paging. |

## `wa runs`

recorded runs — what this tool did, and when

### `wa runs list`

recorded runs, newest first

```sh
wa runs list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many to show. Default: `20`. |
| `--page <n>` | which page, starting at 1. Default: `1`. |

### `wa runs show`

one run: what it was, how it ended, and every event it logged

```sh
wa runs show <run-id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | required | an id from `wa runs list`. |

| Opción | Qué hace |
|---|---|
| `--problems` | only failed responses, warnings and crashes. |

### `wa runs path`

the directory holding one run

```sh
wa runs path <run-id>
```

| Argumento | | Qué es |
|---|---|---|
| `run-id` | required | an id from `wa runs list`. |

## `wa config`

the settings in force, and where each one came from

### `wa config show`

the profile, the profiles that exist, and each setting with where it came from

```sh
wa config show [options]
```

| Opción | Qué hace |
|---|---|
| `--bot` | the settings a bot command on this profile gets, rather than the personal account's. |

### `wa config set`

save a setting to the configuration file

**Changes something on this computer only.**

```sh
wa config set <setting> <value> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, sender_colors, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, transcribe_with, speech_model, search_catch_up, picture_search, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, phone_number_id, waba_id, graph_version, read_other_bots, update_check, skill_hint, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat, account_groups.<name>. |
| `value` | required | a number, true or false, or for allow a list like send,reaction; for a group tg:work,max:Alice,email:me@x. |

| Opción | Qué hace |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

### `wa config unset`

remove a setting from the configuration file

**Changes something on this computer only.**

```sh
wa config unset <setting> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `setting` | required | one of: limit, timeout_ms, color, sender_colors, record, keep_runs_for_days, permissions, sends_per_hour, requests_per_minute, transcribe_with, speech_model, search_catch_up, picture_search, embedding_provider, embedding_model, embedding_base_url, embedding_dims, analysis_provider, analysis_model, analysis_base_url, models, phone_number_id, waba_id, graph_version, read_other_bots, update_check, skill_hint, default_profile, search_stemmers.cyrillic, search_stemmers.latin, phone_countries, task_categories.<name>, task_agent_close, task_agent_close_min, task_first_pass_per_chat, account_groups.<name>. |

| Opción | Qué hace |
|---|---|
| `--defaults` | change what every profile gets, rather than this profile. |
| `--personal` | only for personal accounts — the personal section of the file. |
| `--bot` | only for bots — the bot section of the file. |

## `wa doctor`

the state this installation is in, without connecting unless --online

```sh
wa doctor [options]
```

| Opción | Qué hace |
|---|---|
| `--online` | also connect once and read the account; sends nothing. |

### `wa doctor reports`

problem reports

#### `wa doctor reports show`

what a problem report holds; writes nothing

```sh
wa doctor reports show
```

#### `wa doctor reports create`

write a problem report to a file, and say where to send it

**Changes something on this computer only.**

```sh
wa doctor reports create [options]
```

| Opción | Qué hace |
|---|---|
| `--run <id>` | the run the report is about; the newest failed one if not given. |
| `--output <file>` | where to write it; a new file in this directory if not given. |

## `wa commands`

every command by section; --json prints its contract, one path per call

### `wa commands info`

one command contract, or all schemas, error reasons and explicit overrides

```sh
wa commands info [path]
```

| Argumento | | Qué es |
|---|---|---|
| `path` | optional | one command path; without one, export schemas, error reasons and explicit overrides. |

## `wa complete`

shell completion: `wa complete zsh` prints the script to source

```sh
wa complete [words]
```

| Argumento | | Qué es |
|---|---|---|
| `words` | optional | zsh for the shell script, or command words to complete. |

## `wa upgrade`

upgrade wa with the package manager that installed it; --check only looks

**Changes something on this computer only.**

```sh
wa upgrade [options]
```

| Opción | Qué hace |
|---|---|
| `--check` | say whether a newer version exists, and install nothing. |

## `wa mcp`

serve this profile to an agent over MCP, on stdin and stdout — `claude mcp add wa -- wa <profile> mcp`

**Changes something in WhatsApp.**

```sh
wa mcp [options]
```

| Opción | Qué hace |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.send=deny; it never loosens the profile; repeat for more keys. |
| `--http` | serve over HTTP on 127.0.0.1 for ChatGPT and Claude in the browser, behind your tunnel; the profile's permissions decide. |
| `--port <port>` | the local port for --http (default 8765). |
| `--public-url <url>` | the tunnel's https address the browser apps use, e.g. https://<name>.ts.net. |
| `--revoke` | forget every login given to a browser app; each must log in again. |

### `wa mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
wa mcp config [options]
```

| Opción | Qué hace |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.send=deny; it never loosens the profile; repeat for more keys. |

### `wa mcp add`

add this profile's local MCP server to Codex or Claude Code

**Changes something on this computer only.**

```sh
wa mcp add <client> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `client` | required | codex or claude-code. |

| Opción | Qué hace |
|---|---|
| `--allow-writes` | acknowledge that this profile offers writing tools. |
| `--permission <key=level>` | make a permission stricter for this server only, like messages.send=deny; it never loosens the profile; repeat for more keys. |

### `wa mcp check`

check this profile's local MCP handshake and tool list

```sh
wa mcp check [options]
```

| Opción | Qué hace |
|---|---|
| `--permission <key=level>` | make a permission stricter for this server only, like messages.send=deny; it never loosens the profile; repeat for more keys. |

## `wa bot`

a WhatsApp bot, through the official Bot API and a bot token — not your personal account

### `wa bot auth`

the bot token this profile uses

#### `wa bot auth set`

check a bot token with WhatsApp, then keep it — typed at a hidden prompt or piped on stdin

**Changes something on this computer only.**

```sh
wa bot auth set [options]
```

| Opción | Qué hace |
|---|---|
| `--secret <name>` | keep this secret instead of the token, the same way: app-secret (the Meta app's secret, from App settings → Basic; checks each webhook delivery); verify-token (a string you choose and type in the App Dashboard's webhook setup too; answers Meta's handshake). |

#### `wa bot auth show`

where this profile's bot token comes from, and which bot it is

```sh
wa bot auth show
```

#### `wa bot auth remove`

forget this profile's bot token

**Changes something on this computer only.**

```sh
wa bot auth remove
```

### `wa bot list`

every name on this machine that has a bot token; --check asks WhatsApp which bot each is

```sh
wa bot list [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--check` | ask the messenger who each bot is, with its token. |

### `wa bot chats`

the chats this bot is in — WhatsApp gives a bot no list of them, so `list` shows the ones it has seen

#### `wa bot chats list`

chats this bot has seen on this machine — not a complete list from WhatsApp

```sh
wa bot chats list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa bot chats show`

one chat from WhatsApp, and remember it

```sh
wa bot chats show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |

#### `wa bot chats leave`

take the bot out of a chat; only an admin of the chat can bring it back

**Changes something in WhatsApp.**

```sh
wa bot chats leave <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |

#### `wa bot chats action`

show what the bot is doing in a chat — typing, sending a photo — for a few seconds

**Changes something in WhatsApp.**

```sh
wa bot chats action <chat> <action>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `action` | required | what the chat sees. One of: `typing`, `photo`, `video`, `voice`, `file`. |

#### `wa bot chats admins`

the admins of a chat the bot is an admin in

#### `wa bot chats admins list`

the chat's admins and what each may do

```sh
wa bot chats admins list <chat> [query]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa bot chats admins add`

make a member an admin with these rights

**Changes something in WhatsApp.**

```sh
wa bot chats admins add <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

| Opción | Qué hace |
|---|---|
| `--can <rights>` | what they may do, comma-separated: read, members, admins, info, pin, link, post, edit, delete. |
| `--title <title>` | the title shown beside their name. |

#### `wa bot chats admins remove`

take an admin's rights back; they stay a member

**Changes something in WhatsApp.**

```sh
wa bot chats admins remove <chat> <person>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

#### `wa bot chats members`

the people in a chat the bot is an admin in

#### `wa bot chats members remove`

take a person out of a chat; their messages stay

**Changes something in WhatsApp.**

```sh
wa bot chats members remove <chat> <person> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, or the title of a chat this bot has seen. |
| `person` | required | the person's user id. |

| Opción | Qué hace |
|---|---|
| `--block` | also keep them from coming back by the chat's link. |

#### `wa bot chats rules`

a chat's moderation rules for this bot, kept on this machine

#### `wa bot chats rules show`

the chat's rules; the defaults, marked not saved, if it has none yet

```sh
wa bot chats rules show <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |

#### `wa bot chats rules set`

change one rule — trusted, blocked, blockedNames, links, invites, forwards, blockedPeople, flood.messages, flood.minutes, flood.action, newAccount.days, newAccount.action, consent.delete, consent.remove

**Changes something on this computer only.**

```sh
wa bot chats rules set <chat> <key> <value>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |
| `key` | required | the rule. |
| `value` | required | its new value. |

#### `wa bot chats rules unset`

put one rule back to its default

**Changes something on this computer only.**

```sh
wa bot chats rules unset <chat> <key>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |
| `key` | required | the rule. |

#### `wa bot chats moderate`

judge a group's new messages and joins by its rules, and act as they allow — as the bot

**Changes something in WhatsApp.**

```sh
wa bot chats moderate <chat> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a group's id, or the title of a group this bot has seen. |

| Opción | Qué hace |
|---|---|
| `--since-time <time>` | judge what came after this ISO 8601 time, or 2h / 1d ago; the saved point stays. |
| `--dry-run` | judge and plan; do nothing. |
| `--allow-dangerous` | yes to every action whose level in the group's rules is ask. |
| `--no-block` | remove without banning; by default a removed person cannot come back by the link. |
| `--max-actions <n>` | at most this many actions in one run; 10 if not given. |

### `wa bot messages`

the messages in the chats this bot is in

#### `wa bot messages send`

send a message as the bot; without [text], the text is read from stdin

**Changes something in WhatsApp.**

```sh
wa bot messages send <chat> [text] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `text` | optional | the message. |

| Opción | Qué hace |
|---|---|
| `--reply-to <message>` | answer this message, by its id in the same chat. |
| `--silent` | deliver without a notification. |
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |
| `--file <file>` | attach a file; the text becomes its caption. |
| `--photo <file>` | attach a .jpg, .png or .webp as a photo; the text becomes its caption. |
| `--as-file` | send the --file as a file to download, a video included. |
| `--voice <file>` | send an Ogg Opus file as a voice message, alone, with no text. |
| `--allow-any-file` | send a file even from credential folders or this CLI's own folders. |

#### `wa bot messages list`

the latest messages in a chat; where WhatsApp gives a bot no history, and with --offline, the ones this bot has seen on this machine

```sh
wa bot messages list <chat> [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `query` | optional | field:value terms that narrow the list — the fields are below. |

| Opción | Qué hace |
|---|---|
| `--limit <n>` | how many, the newest. |

#### `wa bot messages show`

one message by its id in a chat

```sh
wa bot messages show <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

#### `wa bot messages edit`

replace the text of a message the bot sent

**Changes something in WhatsApp.**

```sh
wa bot messages edit <chat> <message> <text> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |
| `text` | required | the new text. |

| Opción | Qué hace |
|---|---|
| `--md` | read this messenger's Markdown; see its formatting guide for supported syntax. |
| `--html` | the text is HTML: <b>, <i>, <a href>, <code>. |

#### `wa bot messages delete`

delete messages in a chat the bot can delete in; it cannot be undone

**Changes something in WhatsApp.**

```sh
wa bot messages delete <chat> <messages> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `messages` | required | message ids. |

| Opción | Qué hace |
|---|---|
| `--allow-dangerous` | delete without asking. |

#### `wa bot messages pin`

pin a message in a chat; quietly unless --notify

**Changes something in WhatsApp.**

```sh
wa bot messages pin <chat> <message> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

| Opción | Qué hace |
|---|---|
| `--notify` | tell the chat's members. |

#### `wa bot messages unpin`

unpin a message in a chat

**Changes something in WhatsApp.**

```sh
wa bot messages unpin <chat> <message>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, user:<id> for a person, or the title of a chat this bot has seen. |
| `message` | required | message id. |

#### `wa bot messages between`

what two or more people wrote in the chats they have all written in — from the local copy, grouped by chat, oldest first; --limit counts per chat. Common chats are the ones this copy saw each of them write in, not a member list from WhatsApp

```sh
wa bot messages between <people> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `people` | required | two or more people — an id, @username or part of a name each. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that read_other_bots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by read_other_bots. |
| `--limit <n>` | how many of the latest messages from each chat. |

### `wa bot search`

find what this bot's local copy holds, by text

#### `wa bot search messages`

search the messages this bot has read, sent or received on this machine — the local copy only, best match first; a Lucene query: every word must appear; "a phrase", -word, a OR b, from: chat: date: has:; by text, by --from, or both

```sh
wa bot search messages [query] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | the words to find. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that read_other_bots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by read_other_bots. |
| `--limit <n>` | how many. |
| `--page <n>` | which page, starting at 1. |
| `--newest` | newest first instead of best first. |
| `--from <who>` | only what this person wrote — an id, @username or part of a name; repeat it for any of several. |

### `wa bot recipients`

the chats this bot may write to; with no list, every chat — `clear` removes the list

#### `wa bot recipients list`

the chats on the list, or nothing when there is no list

```sh
wa bot recipients list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa bot recipients add`

allow a chat: its id, `user:<id>`, or the title of a chat this bot has seen

**Changes something on this computer only.**

```sh
wa bot recipients add <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a chat id, `user:<id>`, or the title of a chat this bot has seen. |

#### `wa bot recipients remove`

take a chat off the list

**Changes something on this computer only.**

```sh
wa bot recipients remove <chat>
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | the chat id, or the title as the list shows it. |

#### `wa bot recipients clear`

remove the list: the bot may write to any chat again

**Changes something on this computer only.**

```sh
wa bot recipients clear
```

### `wa bot sends`

what this bot sent, edited and deleted from this machine — ids and outcomes, never text

#### `wa bot sends list`

every send, edit and delete this bot made from this machine, with its outcome

```sh
wa bot sends list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

### `wa bot watch`

print new messages as they arrive and keep them, until Ctrl-C or --timeout (either ends it normally)

**Changes something in WhatsApp.**

```sh
wa bot watch [options]
```

| Opción | Qué hace |
|---|---|
| `--events` | also edits, deletions, buttons pressed and people coming and going; every line names its event. |
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |
| `--public-url <url>` | receive by webhook at your tunnel's https address instead of polling, e.g. https://<name>.ts.net. |
| `--port <port>` | the local port behind the tunnel for --public-url (default 8766). |

### `wa bot callbacks`

answers to the buttons people press under the bot's messages

#### `wa bot callbacks answer`

answer a pressed button by its callback id: --notification shows the person a one-time note, --text replaces the message the button was on

**Changes something in WhatsApp.**

```sh
wa bot callbacks answer <callback> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `callback` | required | the callback id `bot watch` printed. |

| Opción | Qué hace |
|---|---|
| `--text <text>` | the message's new text. |
| `--notification <text>` | a note only the person who pressed sees. |

### `wa bot commands`

the bot's command menu — what people see after /

#### `wa bot commands list`

the commands in the menu now

```sh
wa bot commands list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa bot commands set`

replace the whole menu: each command as name=description, e.g. start=Begin

**Changes something in WhatsApp.**

```sh
wa bot commands set <commands>
```

| Argumento | | Qué es |
|---|---|---|
| `commands` | required | name=description, one per command. |

#### `wa bot commands clear`

empty the menu

**Changes something in WhatsApp.**

```sh
wa bot commands clear
```

### `wa bot webhooks`

where the messenger pushes this bot's updates — while one is set, `bot watch` gets nothing

#### `wa bot webhooks list`

the webhooks this bot has

```sh
wa bot webhooks list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms; this list filters by none yet. |

#### `wa bot webhooks set`

send this bot's updates to an HTTPS address; refused while another is set

**Changes something in WhatsApp.**

```sh
wa bot webhooks set <url> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `url` | required | the HTTPS address. |

| Opción | Qué hace |
|---|---|
| `--types <types>` | only these update types, comma-separated, in the messenger's words. |
| `--secret-stdin` | a secret the messenger sends back with each update — asked for, or read from a pipe. |

#### `wa bot webhooks delete`

stop sending updates to this address; with none left, `bot watch` works again

**Changes something in WhatsApp.**

```sh
wa bot webhooks delete <url>
```

| Argumento | | Qué es |
|---|---|---|
| `url` | required | the address. |

### `wa bot contacts`

people this bot has seen write — from the local copy on this machine, never asking WhatsApp unless told to

#### `wa bot contacts show`

one person: the chats they wrote in (with their last message there) and the latest messages of their private chat with the bot

```sh
wa bot contacts show <who> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `who` | required | an id, @username or part of a name. |

| Opción | Qué hace |
|---|---|
| `--all-bots` | also read every other bot's copy on this machine that read_other_bots allows. |
| `--bots <profiles>` | also read these bots' copies, comma separated — each allowed by read_other_bots. |
| `--limit <n>` | how many messages from the private chat. |
| `--sync-first` | read the private chat with them again from the messenger first — one request. |

### `wa bot me`

the bot this profile's token belongs to: id, name and username

```sh
wa bot me
```

### `wa bot mcp`

serve this bot to an agent over MCP, on stdin and stdout — `claude mcp add sales-bot -- wa sales bot mcp`

#### `wa bot mcp config`

print the mcpServers entry for Claude Desktop, Cursor and others, with full paths; writes nothing

```sh
wa bot mcp config
```

### `wa bot api`

every Cloud API operation wa keeps, generated from Meta's OpenAPI file

```sh
wa bot api [options]
```

| Opción | Qué hace |
|---|---|
| `--store-token <profile>` | keep a returned authentication token only in this bot profile's OS keyring; never print it. |
| `--allow-any-file` | read @path files even from credential folders or this CLI's own folders. |

#### `wa bot api add-phone-numbers`

Add Phone Number to Business Account — write (POST /{Version}/{Business-ID}/add_phone_numbers)

**Changes something in WhatsApp.**

```sh
wa bot api add-phone-numbers [options]
```

| Opción | Qué hace |
|---|---|
| `--business-id <value>` | Your WhatsApp Business Account ID. This ID can be found in your Business Manager. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-business-portfolio`

Get Business Portfolio (Specific Fields) — read (GET /{Version}/{Business-ID})

```sh
wa bot api get-business-portfolio [options]
```

| Opción | Qué hace |
|---|---|
| `--business-id <value>` | Business-ID. |
| `--fields <value>` | fields. |

#### `wa bot api get-owned-whats-app-business-accounts`

Get Owned WhatsApp Business Accounts — read (GET /{Version}/{Business-ID}/owned_whatsapp_business_accounts)

```sh
wa bot api get-owned-whats-app-business-accounts [options]
```

| Opción | Qué hace |
|---|---|
| `--business-id <value>` | Your Business ID. This ID represents the business portfolio that owns the. |
| `--business-type <value>` | Filter accounts by business type. Can specify multiple types as comma-separated values. |
| `--after <value>` | Cursor for forward pagination. Use the cursor from the previous response. |
| `--first <value>` | Number of results to return in forward pagination. Maximum value is 100. |
| `--before <value>` | Cursor for backward pagination. Use the cursor from the previous response. |
| `--last <value>` | Number of results to return in backward pagination. Maximum value is 100. |
| `--find <value>` | Find a specific WhatsApp Business Account by ID within the owned accounts. |

#### `wa bot api get-blocked-users`

Get blocked users — read (GET /{Version}/{Phone-Number-ID}/block_users)

```sh
wa bot api get-blocked-users [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |

#### `wa bot api block-users`

Block user(s) — write (POST /{Version}/{Phone-Number-ID}/block_users)

**Changes something in WhatsApp.**

```sh
wa bot api block-users [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api unblock-users`

Unblock user(s) — write (DELETE /{Version}/{Phone-Number-ID}/block_users)

**Changes something in WhatsApp.**

```sh
wa bot api unblock-users [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api check-call-permissions`

Check Call Permissions — read (GET /{Version}/{Phone-Number-ID}/call_permissions)

```sh
wa bot api check-call-permissions [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The ID of the phone number registered with your WhatsApp Business Account. |
| `--user-wa-id <value>` | The WhatsApp ID of the user you want to check call permissions for. |

#### `wa bot api manage-calls`

Manage Calls — write (POST /{Version}/{Phone-Number-ID}/calls)

**Changes something in WhatsApp.**

```sh
wa bot api manage-calls [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The ID of the phone number registered with your WhatsApp Business Account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api send-marketing-message`

Send Marketing Template Message — write (POST /{Version}/{Phone-Number-ID}/marketing_messages)

**Changes something in WhatsApp.**

```sh
wa bot api send-marketing-message [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | WhatsApp Business Phone Number ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api upload-media`

Upload Image — write (POST /{Version}/{Phone-Number-ID}/media)

**Changes something in WhatsApp.**

```sh
wa bot api upload-media [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api send-message`

Send Message. — write (POST /{Version}/{Phone-Number-ID}/messages)

**Changes something in WhatsApp.**

```sh
wa bot api send-message [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api list-qr-codes`

List All Message QR Codes — read (GET /{Version}/{Phone-Number-ID}/message_qrdls)

```sh
wa bot api list-qr-codes [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The WhatsApp Business Account phone number ID for which to list QR codes. |
| `--fields <value>` | Comma-separated list of fields to include in the response. Available fields:. |
| `--code <value>` | Filter results to a specific QR code by its unique identifier. |
| `--limit <value>` | Maximum number of QR codes to return in a single response. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |

#### `wa bot api create-or-update-qr-code`

Create or Update Message QR Code — write (POST /{Version}/{Phone-Number-ID}/message_qrdls)

**Changes something in WhatsApp.**

```sh
wa bot api create-or-update-qr-code [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The WhatsApp Business Account phone number ID for which to create or update the QR code. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-qr-code`

Get Individual Message QR Code — read (GET /{Version}/{Phone-Number-ID}/message_qrdls/{QR-Code-ID})

```sh
wa bot api get-qr-code [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The WhatsApp Business Account phone number ID that owns the QR code. |
| `--qr-code-id <value>` | The unique 14-character identifier of the QR code to retrieve. |
| `--fields <value>` | Comma-separated list of fields to include in the response. Available fields:. |

#### `wa bot api delete-qr-code`

Delete Individual Message QR Code — destructive (DELETE /{Version}/{Phone-Number-ID}/message_qrdls/{QR-Code-ID})

**Changes something in WhatsApp.**

```sh
wa bot api delete-qr-code [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The WhatsApp Business Account phone number ID that owns the QR code to be deleted. |
| `--qr-code-id <value>` | The unique 14-character identifier of the QR code to delete. |

#### `wa bot api send-encrypted-message`

Send Encrypted Message — write (POST /{Version}/{Phone-Number-ID}/messages_encrypted)

**Changes something in WhatsApp.**

```sh
wa bot api send-encrypted-message [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The ID of the phone number used to send the message. Retrieved from the WhatsApp Business Account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-official-business-account-status`

Get Official Business Account Status — read (GET /{Version}/{Phone-Number-ID}/official_business_account)

```sh
wa bot api get-official-business-account-status [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api request-official-business-account`

Update Official Business Account Status — write (POST /{Version}/{Phone-Number-ID}/official_business_account)

**Changes something in WhatsApp.**

```sh
wa bot api request-official-business-account [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-phone-number`

Retrieve WhatsApp Business Phone Number Information — read (GET /{Version}/{Phone-Number-ID})

```sh
wa bot api get-phone-number [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business Account phone number ID (CSID). This unique identifier is assigned when you. |
| `--fields <value>` | Comma-separated list of additional fields to include in the response. If not specified,. |

#### `wa bot api update-phone-number`

Update WhatsApp Business Account Phone Number Status and Configuration — write (POST /{Version}/{Phone-Number-ID})

**Changes something in WhatsApp.**

```sh
wa bot api update-phone-number [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business Account phone number ID (CSID). This ID is provided when you. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api deregister-phone-number`

Deregister WhatsApp Business Phone Number — destructive (POST /{Version}/{Phone-Number-ID}/deregister)

**Changes something in WhatsApp.**

```sh
wa bot api deregister-phone-number [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The ID of the phone number to deregister. This ID is provided when you register. |

#### `wa bot api get-message-history`

Get WhatsApp Business Account Message History — read (GET /{Version}/{Phone-Number-ID}/message_history)

```sh
wa bot api get-message-history [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business Account phone number ID. This ID is provided when you register. |
| `--message-id <value>` | Filter results by specific WhatsApp message ID (WAMID). When provided,. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--limit <value>` | Maximum number of message history entries to return per page. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |

#### `wa bot api register-phone-number`

Register WhatsApp Business Phone Number — destructive (POST /{Version}/{Phone-Number-ID}/register)

**Changes something in WhatsApp.**

```sh
wa bot api register-phone-number [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The ID of the phone number to register. This ID is provided when the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api request-verification-code`

Request Phone Number Verification Code — write (POST /{Version}/{Phone-Number-ID}/request_code)

**Changes something in WhatsApp.**

```sh
wa bot api request-verification-code [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-phone-number-settings`

Get phone number settings — read (GET /{Version}/{Phone-Number-ID}/settings)

```sh
wa bot api get-phone-number-settings [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--include-sip-credentials <value>` | Include SIP credentials in the response (requires additional permissions). |

#### `wa bot api update-phone-number-settings`

Update phone number settings — write (POST /{Version}/{Phone-Number-ID}/settings)

**Changes something in WhatsApp.**

```sh
wa bot api update-phone-number-settings [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api verify-phone-number-code`

Verify Phone Number Verification Code — write (POST /{Version}/{Phone-Number-ID}/verify_code)

**Changes something in WhatsApp.**

```sh
wa bot api verify-phone-number-code [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | The WhatsApp Business Account phone number ID that needs verification. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-encryption-public-key`

Get Business Encryption Public Key — read (GET /{Version}/{Phone-Number-ID}/whatsapp_business_encryption)

```sh
wa bot api get-encryption-public-key [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api set-encryption-public-key`

Set Business Encryption Public Key — write (POST /{Version}/{Phone-Number-ID}/whatsapp_business_encryption)

**Changes something in WhatsApp.**

```sh
wa bot api set-encryption-public-key [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-business-profile`

Get WhatsApp Business Profile — read (GET /{Version}/{Phone-Number-ID}/whatsapp_business_profile)

```sh
wa bot api get-business-profile [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api update-business-profile`

Update WhatsApp Business Profile — write (POST /{Version}/{Phone-Number-ID}/whatsapp_business_profile)

**Changes something in WhatsApp.**

```sh
wa bot api update-business-profile [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-commerce-settings`

Get commerce settings — read (GET /{Version}/{Phone-Number-ID}/whatsapp_commerce_settings)

```sh
wa bot api get-commerce-settings [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |

#### `wa bot api set-commerce-settings`

Set or update commerce settings — write (POST /{Version}/{Phone-Number-ID}/whatsapp_commerce_settings)

**Changes something in WhatsApp.**

```sh
wa bot api set-commerce-settings [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Phone-Number-ID. |
| `--is-cart-enabled <value>` | is_cart_enabled. |
| `--is-catalog-visible <value>` | is_catalog_visible. |

#### `wa bot api get-business-compliance-info`

Get Business Compliance Information — read (GET /{Version}/{Phone-Number-ID}/business_compliance_info)

```sh
wa bot api get-business-compliance-info [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business Account phone number ID. This ID can be found in your. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api update-business-compliance-info`

Update Business Compliance Information — write (POST /{Version}/{Phone-Number-ID}/business_compliance_info)

**Changes something in WhatsApp.**

```sh
wa bot api update-business-compliance-info [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business Account phone number ID. This ID can be found in your. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-media`

Retrieve Media URL — read (GET /{Version}/{Media-ID})

```sh
wa bot api get-media [options]
```

| Opción | Qué hace |
|---|---|
| `--media-id <value>` | Media-ID. |
| `--phone-number-id <value>` | Specifies that this action only be performed if the media belongs to the provided phone number. |

#### `wa bot api delete-media`

Delete Media — destructive (DELETE /{Version}/{Media-ID})

**Changes something in WhatsApp.**

```sh
wa bot api delete-media [options]
```

| Opción | Qué hace |
|---|---|
| `--media-id <value>` | Media-ID. |
| `--phone-number-id <value>` | Specifies that deletion of the media  only be performed if the media belongs to the provided phone number. |

#### `wa bot api get-message-history-events`

Get WhatsApp Message History Events — read (GET /{Version}/{Message-History-ID}/events)

```sh
wa bot api get-message-history-events [options]
```

| Opción | Qué hace |
|---|---|
| `--message-history-id <value>` | Your WhatsApp Business Message History ID. This ID is provided when you retrieve. |
| `--status-filter <value>` | Filter results by specific delivery status. When provided,. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--limit <value>` | Maximum number of message history events to return per page. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |

#### `wa bot api get-assigned-whats-app-business-accounts`

Get Assigned WhatsApp Business Accounts — read (GET /{Version}/{User-ID}/assigned_whatsapp_business_accounts)

```sh
wa bot api get-assigned-whats-app-business-accounts [options]
```

| Opción | Qué hace |
|---|---|
| `--user-id <value>` | The user ID for whom to retrieve assigned WhatsApp Business Accounts. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--limit <value>` | Maximum number of accounts to return per page. Default is 25, maximum is 100. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |

#### `wa bot api get-whats-app-account-number-details`

Get WhatsApp Account Number Details — read (GET /{Version}/{WhatsApp-Account-Number-ID})

```sh
wa bot api get-whats-app-account-number-details [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-account-number-id <value>` | Your WhatsApp Account Number ID. This ID represents the account number entity. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api get-assigned-users`

List Assigned Users — read (GET /{Version}/{WhatsApp-Business-Account-ID}/assigned_users)

```sh
wa bot api get-assigned-users [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-business-account-id <value>` | Your WhatsApp Business Account ID. This ID is provided when you create the account. |
| `--business <value>` | Business ID that owns or has access to the WhatsApp Business Account. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--limit <value>` | Maximum number of assigned users to return per page. Default is 25, maximum is 100. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |

#### `wa bot api add-assigned-user`

Add User to WhatsApp Business Account — write (POST /{Version}/{WhatsApp-Business-Account-ID}/assigned_users)

**Changes something in WhatsApp.**

```sh
wa bot api add-assigned-user [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-business-account-id <value>` | Your WhatsApp Business Account ID. This ID is provided when you create the account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api remove-assigned-user`

Remove User from WhatsApp Business Account — write (DELETE /{Version}/{WhatsApp-Business-Account-ID}/assigned_users)

**Changes something in WhatsApp.**

```sh
wa bot api remove-assigned-user [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-business-account-id <value>` | Your WhatsApp Business Account ID. This ID is provided when you create the account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api configure-conversational-automation`

Configure Conversational Automation — write (POST /{Version}/{Phone-Number-ID}/conversational_automation)

**Changes something in WhatsApp.**

```sh
wa bot api configure-conversational-automation [options]
```

| Opción | Qué hace |
|---|---|
| `--phone-number-id <value>` | Your WhatsApp Business phone number ID. This ID represents the phone number. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-credit-lines`

Get credit lines — read (GET /{Version}/{Business-ID}/extendedcredits)

```sh
wa bot api get-credit-lines [options]
```

| Opción | Qué hace |
|---|---|
| `--business-id <value>` | Business-ID. |

#### `wa bot api list-phone-numbers`

Get WhatsApp Business Account Phone Numbers — read (GET /{Version}/{WABA-ID}/phone_numbers)

```sh
wa bot api list-phone-numbers [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--filtering <value>` | JSON-encoded array of filter conditions. Each filter should specify field, operator, and value. |
| `--sort <value>` | Sort field and direction. Format: field_name.asc or field_name.desc. |
| `--limit <value>` | Maximum number of phone numbers to return per page. |
| `--after <value>` | Cursor for pagination - retrieve records after this cursor. |
| `--before <value>` | Cursor for pagination - retrieve records before this cursor. |

#### `wa bot api create-phone-number`

Create WhatsApp Business Account Phone Number — write (POST /{Version}/{WABA-ID}/phone_numbers)

**Changes something in WhatsApp.**

```sh
wa bot api create-phone-number [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID where the phone number will be added. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api list-schedules`

Get WhatsApp Business Account Schedules — read (GET /{Version}/{WABA-ID}/schedules)

```sh
wa bot api list-schedules [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--filtering <value>` | JSON-encoded array of filter conditions. Each filter should specify field, operator, and value. |
| `--sort <value>` | Sort field and direction. Format: field_name.asc or field_name.desc. |
| `--limit <value>` | Maximum number of schedules to return per page. |
| `--after <value>` | Cursor for pagination - retrieve records after this cursor. |
| `--before <value>` | Cursor for pagination - retrieve records before this cursor. |

#### `wa bot api create-schedule`

Create WhatsApp Business Account Schedule — write (POST /{Version}/{WABA-ID}/schedules)

**Changes something in WhatsApp.**

```sh
wa bot api create-schedule [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID where the schedule will be created. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api list-subscribed-apps`

Get All Subscriptions for a WABA — read (GET /{Version}/{WABA-ID}/subscribed_apps)

```sh
wa bot api list-subscribed-apps [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api subscribe-app`

Subscribe to WABA Webhooks — write (POST /{Version}/{WABA-ID}/subscribed_apps)

**Changes something in WhatsApp.**

```sh
wa bot api subscribe-app [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api unsubscribe-app`

Unsubscribe from WABA Webhooks — write (DELETE /{Version}/{WABA-ID}/subscribed_apps)

**Changes something in WhatsApp.**

```sh
wa bot api unsubscribe-app [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |

#### `wa bot api get-template`

Get template by ID (default fields) — read (GET /{Version}/{TEMPLATE_ID})

```sh
wa bot api get-template [options]
```

| Opción | Qué hace |
|---|---|
| `--template-id <value>` | TEMPLATE_ID. |

#### `wa bot api edit-template`

Edit template — write (POST /{Version}/{TEMPLATE_ID})

**Changes something in WhatsApp.**

```sh
wa bot api edit-template [options]
```

| Opción | Qué hace |
|---|---|
| `--template-id <value>` | TEMPLATE_ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api list-templates`

Get template by name (default fields) — read (GET /{Version}/{WABA-ID}/message_templates)

```sh
wa bot api list-templates [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WABA-ID. |
| `--name <value>` | name. |

#### `wa bot api create-template`

Create authentication template w/ OTP copy code button — write (POST /{Version}/{WABA-ID}/message_templates)

**Changes something in WhatsApp.**

```sh
wa bot api create-template [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WABA-ID. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api delete-template`

Delete template by name — destructive (DELETE /{Version}/{WABA-ID}/message_templates)

**Changes something in WhatsApp.**

```sh
wa bot api delete-template [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | WABA-ID. |
| `--name <value>` | name. |
| `--hsm-id <value>` | Template ID. |

#### `wa bot api list-activities`

Get WhatsApp Business Account Activities — read (GET /{Version}/{WABA-ID}/activities)

```sh
wa bot api list-activities [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | Your WhatsApp Business Account ID. This ID can be found in your WhatsApp Manager. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |
| `--limit <value>` | Maximum number of activity records to return per page. Default is 25, maximum is 100. |
| `--after <value>` | Cursor for pagination. Use this to get the next page of results. |
| `--before <value>` | Cursor for pagination. Use this to get the previous page of results. |
| `--since <value>` | Unix timestamp or ISO 8601 date string. Only return activities that occurred after this time. |
| `--until <value>` | Unix timestamp or ISO 8601 date string. Only return activities that occurred before this time. |
| `--activity-type <value>` | Filter activities by type. Can be a single type or comma-separated list of types. |

#### `wa bot api get-business-account`

Get WhatsApp Business Account Details — read (GET /{Version}/{WABA-ID})

```sh
wa bot api get-business-account [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | Your WhatsApp Business Account ID. This ID is provided when you create the account. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api update-business-account`

Update WhatsApp Business Account — write (POST /{Version}/{WABA-ID})

**Changes something in WhatsApp.**

```sh
wa bot api update-business-account [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-id <value>` | Your WhatsApp Business Account ID. This ID is provided when you create the account. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

#### `wa bot api get-business-bot`

Get WhatsApp Business Bot Details — read (GET /{Version}/{WABA-Bot-ID})

```sh
wa bot api get-business-bot [options]
```

| Opción | Qué hace |
|---|---|
| `--waba-bot-id <value>` | Your WhatsApp Business Bot ID. This ID is provided when you create the bot. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api get-business-profile-by-id`

Get WhatsApp Business Profile Details — read (GET /{Version}/{WhatsApp-Business-Profile-ID})

```sh
wa bot api get-business-profile-by-id [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-business-profile-id <value>` | Your WhatsApp Business Profile ID. This ID is provided when the profile is created. |
| `--fields <value>` | Comma-separated list of fields to include in the response. If not specified,. |

#### `wa bot api update-business-profile-by-id`

Update WhatsApp Business Profile — write (POST /{Version}/{WhatsApp-Business-Profile-ID})

**Changes something in WhatsApp.**

```sh
wa bot api update-business-profile-by-id [options]
```

| Opción | Qué hace |
|---|---|
| `--whats-app-business-profile-id <value>` | Your WhatsApp Business Profile ID. This ID is provided when the profile is created. |
| `--body <json>` | the request body as JSON; - reads it from stdin. |
| `--body-file <path>` | the request body from a JSON file; - is stdin. |

### `wa bot templates`

approved messages: the only kind WhatsApp delivers 24 hours after a person wrote

#### `wa bot templates list`

the business account's templates, with status, language and category

```sh
wa bot templates list [query]
```

| Argumento | | Qué es |
|---|---|---|
| `query` | optional | field:value terms that narrow the list — the fields are below. |

#### `wa bot templates send`

send an approved template; hello_world is pre-approved on the test number

**Changes something in WhatsApp.**

```sh
wa bot templates send <chat> <name> [language] [options]
```

| Argumento | | Qué es |
|---|---|---|
| `chat` | required | a phone number in digits, or user:<id> as `bot watch` shows it. |
| `name` | required | the template's name, as `bot templates list` shows it. |
| `language` | optional | the template's language code. Default: `en_US`. |

| Opción | Qué hace |
|---|---|
| `--payload <json>` | the values for the template's placeholders, as Meta's components array. |

### `wa bot media`

files people sent to the number

#### `wa bot media download`

save a file someone sent, by its media id; Meta's link for it lasts 5 minutes

**Changes something on this computer only.**

```sh
wa bot media download <media-id> [options]
```

| Argumento | | Qué es |
|---|---|---|
| `media-id` | required | the media id, from the attachment `bot watch --jsonl` printed. |

| Opción | Qué hace |
|---|---|
| `--output <file>` | where to write the file. |

## `wa skill`

the instructions an agent is given for this tool

### `wa skill show`

print SKILL.md — `wa skill install` puts it where Claude Code, Codex and Gemini CLI look for it

```sh
wa skill show [name]
```

| Argumento | | Qué es |
|---|---|---|
| `name` | optional | one of the skills shipped for a task: follow-ups, link-conversations. |

### `wa skill install`

write SKILL.md to \~/.claude/skills/whatsapp-cli/ (Claude Code) and \~/.agents/skills/whatsapp-cli/ (Codex, Gemini CLI)

**Changes something on this computer only.**

```sh
wa skill install [options]
```

| Opción | Qué hace |
|---|---|
| `--for <agents>` | which agents to install for. One of: `claude`, `agents`, `all`. Default: `all`. |

## Códigos de salida

Branch on the code, not on the text: the text can change, the code does not.

| Code | When |
|---|---|
| `0` | it worked |
| `2` | `validation_error` |
| `3` | `configuration_error` |
| `4` | `authentication_error` |
| `5` | `permission_error` |
| `6` | `not_found` |
| `7` | `confirmation_required` |
| `8` | `rate_limited` |
| `9` | `timeout` |
| `10` | `network_error` |
| `11` | `provider_error` |
| `12` | `provider_unavailable` |
| `13` | `invalid_response` |
| `14` | `outcome_unknown` |
| `130` | `cancelled` |
| `1` | anything else |

`0` and only `0` means the operation was done. `14` (`outcome_unknown`) means a message **may**
have gone: repeat it only with the same `--operation-id`, which WhatsApp uses to drop a second copy.
