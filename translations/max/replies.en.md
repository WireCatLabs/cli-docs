---
title: "Automatic replies"
---

Auto-replies answer MAX messages when you cannot respond yourself, such as “I'll reply in the morning” after working hours. Use this page to create a rule with your text, choose who may receive it and test what it would answer without sending. [Drafts and reply templates](https://wirecat.dev/ru/docs/drafts-and-templates) offers ready-made texts.

Terms used below:

- **Rule** — which incoming messages match and whether to reply, open a task or do both.
- **Template** — reusable reply text with fields such as sender name and time.
- **Audience** — the people and chats eligible for replies, regardless of what a rule matches.
- `max serve` — the background process receiving new messages and applying rules.

Who receives the response and when something is sent:

- **Anyone selected by the rules gets a response until you limit the audience.** Reply only to selected people: `max replies audience --reply listed --allow-people …`; exclude someone: `--deny-people` and `--deny-chats`.
- **Nothing is sent until you enable sending.** Need `permissions.replies.send allow`; `ask` also prohibits sending, because there is no one to ask the background server. The new rule is also disabled until you enable it.

See the [auto-reply command reference](./commands.md#max-replies).

## Create and enable a rule

```sh
max replies add away
max replies edit away --template 'Спасибо, {{ sender.firstName | default: "вам" }}! Отвечу утром.'
max replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
max replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` creates a disabled rule with all current settings. `<профиль>.replies.json` lives beside `configFile` from `max config show --json`. By default, rules may reply to anyone they match. To restrict replies to selected people, enter comma-separated MAX ids; `max contacts show <имя> --json` returns the person's `id`:

```sh
max replies audience --reply listed --allow-people 1000001
```

To reply to everyone except some people or chats, leave `--reply all` and ban them:

```sh
max replies audience --deny-people 1000002 --deny-chats 1000003
```

After the first command in the file:

```json
{
  "audience": {
    "reply": "listed",
    "allow": { "people": ["1000001"], "chats": [] },
    "deny": { "people": [], "chats": [] }
  },
  "rules": [ … ]
}
```

Rule names are lowercase letters, numbers, and hyphens; repeated id is rejected. A rule with action `reply` cannot be enabled without template text. For a disabled rule and action `task`, empty text is acceptable.

```sh
max replies test --since-time 7d
max replies on away
max config set permissions.replies.send allow
max serve
```

`replies test` reads only saved messages: does not send anything, does not change anything and does not connect to MAX. Without permission to send, the server is silent. `max replies off away` disables one rule.

## Edit conditions and audience

`replies edit` changes only supplied fields. Comma-separated lists are replaced entirely; an empty string clears a list. IDs remain strings, including large numbers.

| Fields | Options |
|---|---|
| Actions | `--do reply,task`: reply, task or both |
| Chats | `--kinds dialog,group`, `--chats`, `--not-chats` |
| Conditions | `--words`, `--question` / `--no-question`, `--mentions-me` / `--no-mentions-me` |
| Senders | `--people`, `--not-people`, `--contacts-only` / `--no-contacts-only` |
| Reply | `--template`, `--as-reply` / `--no-as-reply` |
| Limits | `--per-chat`, `--per-person`, for example `1/12h` |
| Working hours | `--outside`, `--days`, `--timezone`, `--no-hours` |

The first working-hours edit requires the window, days and time zone together; later edits can change one field. `--no-hours` clears the window and cannot combine with its fields. The original file and full result are validated before writing. Invalid edits leave the file intact; other rules, audience, order and reply history are preserved.

`max replies audience` shows the file-wide audience. A new file uses `--reply all`: anyone matched by a rule is eligible. `--reply listed` restricts replies to allowed people and chats. `--allow-people`, `--allow-chats`, `--deny-people` and `--deny-chats` replace their respective lists. Denials override allowances. An empty `listed` audience receives nothing; the command warns. A `task` action opens a local task and is not restricted by reply audience.

## Liquid templates and AI replies

Examples of response texts for common cases and when it is better to leave a draft are on the [Drafts and response templates](https://wirecat.dev/ru/docs/drafts-and-templates) page.

Available variables are `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` and `now` in the rule’s time zone, or UTC when no time window is set. Filters are supported, for example `{{ now | date: "%H:%M" }}`. Incoming message text is not a template variable. Unknown variables and filters are rejected; `default` handles missing values. Templates cannot read files, and time, memory and output length are limited.

AI-generated text can change only the `ai` block. Everything outside remains your template with ordinary substitutions:

```liquid
Спасибо, {{ sender.firstName | default: "вам" }}!
{% ai %}Коротко подтвердите получение; я отвечу завтра.{% else %}Отвечу завтра.{% endai %}
```

After substitutions, the block body is the instruction. Incoming text goes separately to the AI provider as data. The generated response is never executed as Liquid; overlong text and an exact repeat of the incoming message are rejected. Without a configured provider, consent or a successful call, `else` supplies the reply. Without a fallback, sending is skipped with a reason.

Set `models.replies.provider` (`openai` or `anthropic`), the exact model ID in `models.replies.model`, and `models.replies.baseUrl` if needed. Shared values come from `models.default`; `provider off` disables the assignment. `config set` and `config unset` accept these keys; `config show` shows each field’s source. The older `analysisProvider`, `analysisModel` and `analysisBaseUrl` still work for analysis. Store the key with `max models text key set`; for a custom server, the key name is its host with port, and the public provider key is not sent there.

Consent to share data with an AI provider is separate from permission to send replies:

```sh
max replies consents show
max replies consents grant
max replies consents revoke
```

`grant` allows incoming data to be sent to the selected provider for the whole profile. `replies consents deny` with a chat ID forbids model use for that chat; `allow` with an ID removes that denial but does not grant profile consent. Denials survive grant/revoke. Changing the provider or endpoint requires new consent. Changes to consent, settings, rules, audience or pause during a model call are checked before its result is sent.

`max replies test` shows instructions and fallback text without calling a model. `max replies test --ai` explicitly allows saved messages to be sent to the configured model with valid consent. It sends no reply to the messenger and does not change reply history; `--ai` cannot be combined with `--offline`. Older `{firstName}`, `{name}` and `model: may-reword` are read with a warning: the original populated template remains the fallback text. New files do not need the `model` field.

## What rules leave alone

- Those whom the audience does not allow.
- Your messages, channels, bots, messages on behalf of the chat.
- Changed message, already processed message and what came before run `serve`.
- In a group - a message without mentioning you or replying to you, if the rule does not name the group in `chats`.

`perChat` and `perPerson` limits are required. Two autoresponders stop at the first limit.

`max replies pause` immediately stops all rules; `resume` lifts the pause without a restart. `status` shows send permission, enabled rules and audience. `max sends list` shows sent replies labeled with their rule.
