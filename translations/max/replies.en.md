---
title: "Automatic replies"
---

`max serve` replies according to profile rules. Replies are allowed only to accounts in `testers` and only with `permissions.replies.send allow`. A new file has an empty `testers` list: nobody receives a reply until you add your test account.

See [commands.md](./commands.md#max-replies) for the full reference.

## Create and enable a rule

```sh
max replies add away
max replies edit away --template 'Спасибо, {{ sender.firstName | default: "вам" }}! Отвечу утром.'
max replies edit away --outside 09:00-19:00 --days mon-fri --timezone Europe/Madrid
max replies edit away --per-chat 1/12h --per-person 1/1d
```

`add` creates a disabled rule with all current settings. The file `<профиль>.replies.json` is next to the `configFile` shown by `max config show --json`. Add your test account ID to its `testers` list. Rule names contain lowercase letters, digits and hyphens; duplicate IDs are rejected. A rule with action `reply` cannot be enabled without template text. Empty text is allowed for disabled rules and the `task` action.

```sh
max replies test --since-time 7d
max replies on away
max config set permissions.replies.send allow
max serve
```

Preview reads only saved messages. Without send permission, the server stays silent; `ask` also forbids sending because a background server has nobody to ask. `max replies off away` disables one rule.

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

The first time you set a schedule, supply the time window, days and time zone together; later you can change one field. `--no-hours` clears the window and cannot be combined with its fields. Before writing, the original file and the complete result are validated. An invalid edit does not overwrite the file; other rules, `testers`, their order and reply history are preserved.

`max replies audience` shows the file’s shared audience. `--reply all` allows any audience; `--reply listed` allows only the allowlists. `--allow-people`, `--allow-chats`, `--deny-people` and `--deny-chats` replace their respective lists. Denial takes precedence over allowance. With `listed` and an empty allowlist, nobody receives replies; the command warns about this. The `testers` restriction applies on top of the audience. The `task` action opens a local task and is not limited by the reply audience.

## Liquid templates and models

Available variables are `sender.firstName`, `sender.name`, `chat.title`, `chat.kind` and `now` in the rule’s time zone, or UTC when no time window is set. Filters are supported, for example `{{ now | date: "%H:%M" }}`. Incoming message text is not a template variable. Unknown variables and filters are rejected; `default` handles missing values. Templates cannot read files, and time, memory and output length are limited.

A model can change only the `ai` block; text outside it remains your text with ordinary substitutions:

```liquid
Спасибо, {{ sender.firstName | default: "вам" }}!
{% ai %}Коротко подтвердите получение; я отвечу завтра.{% else %}Отвечу завтра.{% endai %}
```

The block body after substitutions is the instruction. Incoming text is sent to the model separately as data. The model’s response is not executed as Liquid; an overlong response or a complete repeat of the incoming text is rejected. If no provider is configured, consent is absent or the call fails, `else` is used. Without it, the reply is skipped with an explanation.

Set `models.replies.provider` (`openai` or `anthropic`), the exact model ID in `models.replies.model`, and `models.replies.baseUrl` if needed. Shared values come from `models.default`; `provider off` disables the assignment. `config set` and `config unset` accept these keys; `config show` shows each field’s source. The older `analysisProvider`, `analysisModel` and `analysisBaseUrl` still work for analysis. Store the key with `max models text key set`; for a custom server, the key name is its host with port, and the public provider key is not sent there.

Model consent is separate from permission to send replies:

```sh
max replies consents show
max replies consents grant
max replies consents revoke
```

`grant` allows incoming data to be sent to the selected provider for the whole profile. `replies consents deny` with a chat ID forbids model use for that chat; `allow` with an ID removes that denial but does not grant profile consent. Denials survive grant/revoke. Changing the provider or endpoint requires new consent. Changes to consent, settings, rules, audience or pause during a model call are checked before its result is sent.

`max replies test` shows instructions and fallback text without calling a model. `max replies test --ai` explicitly allows saved messages to be sent to the configured model with valid consent. It sends no reply to the messenger and does not change reply history; `--ai` cannot be combined with `--offline`. Older `{firstName}`, `{name}` and `model: may-reword` are read with a warning: the original populated template remains the fallback text. New files do not need the `model` field.

## What rules leave alone

- Your own messages, channels, bots and messages sent on behalf of a chat.
- Edited messages, already processed messages and messages that arrived before `serve` started.
- In groups, messages that neither mention you nor reply to you, unless the rule names the group in `chats`.

`perChat` and `perPerson` limits are required. Two autoresponders stop at the first limit.

`max replies pause` immediately stops all rules; `resume` lifts the pause without a restart. `status` shows send permission, enabled rules and audience. `max sends list` shows sent replies labeled with their rule.
