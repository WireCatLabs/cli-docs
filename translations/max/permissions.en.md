---
title: "Permissions"
---

Permissions apply to a profile: a set of settings for one account or bot. Start with read access and allow changes as needed. See [Profiles and bots](./profiles.md).

## Choose an access level

| Level | Behavior |
|---|---|
| `deny` | The action is forbidden, including reading. |
| `readonly` | Reading is allowed; changes are forbidden. |
| `ask` | Changes prompt for confirmation in the terminal. |
| `allow` | The action can run without another confirmation. |

A denial means you need to check the action and settings. It does not indicate a connection problem. Do not ask the assistant to remove the restriction just to finish the task.

## Allow one action

```sh
max work config set permissions.messages.send ask
```

Replace `work` with your profile name. To allow reading messages and forbid changes by default:

```sh
max work config set permissions.messages readonly
```

A more specific key takes precedence: `permissions.messages.send ask` keeps the confirmation prompt before sending in the terminal and allows sending through MCP. To forbid sending, set this key to `readonly`. Check other exceptions with `config show`.

These permissions apply to messages. Reactions and chat management have separate keys. See the [configuration reference](./configuration-reference.md) for complete read-only profile examples.

## Bot permissions

Bot permissions and limits are set in the bot section. To require confirmation before sending in the terminal:

```sh
max support config set permissions.bot.messages.send ask --bot
max support config set sendsPerHour 30 --bot
```

## Limit recipients and repeated sends

The recipient list limits which chats the profile can send to. The hourly limit helps stop sending loops. These checks apply even when the command is allowed. See [Security](./security.md) for the commands that manage them.

## Temporarily change MCP server permissions

Add `--permission messages.send=allow` when starting the server to allow that process to send messages. Saved settings are unchanged. Through MCP, `ask` does not require a server confirmation form: the application manages its own confirmations and may allow a call without another prompt. To forbid changes, use `deny` or `readonly`. [Browser setup](./remote.md) explains the full connection process.

## Limitations and detailed rules

An assistant with access to configuration files or an unrestricted terminal can change these permissions. Read [Security](./security.md) before granting that access. The messenger configuration reference describes nested permissions and exact command keys.
