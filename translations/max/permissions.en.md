---
title: "Permissions"
---

Read this page before letting an AI agent, a script or another person use your MAX account through `max`. For each profile, you can choose which actions are read-only, which need your approval and which can run without asking. You will learn to make a read-only profile, allow an individual action such as sending, and understand the checks that still apply.

Terms used below:

- **Profile** — named settings for one account or bot, such as `work` ([profiles and bots](./profiles.md)).
- **Permission key** — a command or command-group name, such as `messages` or `messages.send`. A longer key is more specific.
- **Access level** — what happens when a command runs: `deny`, `readonly`, `ask` or `allow`.

Start with reading and allow changes as needed.

## Choose an access level

| Level | Behavior |
|---|---|
| `deny` | The action is forbidden, including reading. |
| `readonly` | Reading is allowed; changes are forbidden. |
| `ask` | Changes prompt for confirmation in the terminal. |
| `allow` | The action can run without another confirmation. |

A denial means you need to check the action and settings. It does not indicate a connection problem. Do not ask the agent to remove the restriction just to finish the task.

## Allow one action

```sh
max work config set permissions.messages.send ask
```

Replace `work` with your profile name. To allow reading messages and forbid changes by default:

```sh
max work config set permissions.messages readonly
```

A more specific key takes precedence: `permissions.messages.send ask` keeps the confirmation prompt before sending in the terminal and allows sending through MCP. To forbid sending, set this key to `readonly`. Check other exceptions with `config show`.

These permissions cover messages. Reactions and chat administration have separate keys. See the [permissions reference](./configuration-reference.md#права-доступа) for all keys and a read-only profile example.

## Bot permissions

Bot permissions and limits are set in the bot section. To require confirmation before sending in the terminal:

```sh
max support config set permissions.bot.messages.send ask --bot
max support config set sendsPerHour 30 --bot
```

## Limit recipients and repeated sends

The recipient list restricts the chats a profile can send to. The hourly limit helps stop a sending loop. These checks also apply to an allowed command. See [protection against sending to the wrong place](./security.md#защита-от-отправки-не-туда) for the controls.

## Temporarily change MCP server permissions

Add `--permission messages.send=allow` when starting the server to allow that process to send messages. Saved settings are unchanged. Through MCP, `ask` does not require a server confirmation form: the application manages its own confirmations and may allow a call without another prompt. To forbid changes, use `deny` or `readonly`. [Browser setup](./remote.md) explains the full connection process.

## Limitations and detailed rules

An agent with access to configuration files or an unrestricted terminal can change these permissions. Read [security](./security.md) before granting that access. The [permissions reference](./configuration-reference.md#права-доступа) explains nested permissions and exact command keys.
