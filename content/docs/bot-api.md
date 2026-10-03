---
title: Full Bot API
description: Every official Telegram and MAX Bot API method from the CLI.
---

**All Bot API methods are exposed through the CLI.** Use the complete native interface alongside
convenient bot commands for messages, files and chat administration. Telegram covers all 185
methods in the pinned Bot API 10.3 schema; MAX covers all 33 operations in its official schema.

Use Telegram CLI **0.25.0 or later** and MAX CLI **0.25.0 or later**. See [installation](./installation.mdx).

## Discover every method

```sh
tg sales bot api --help
max sales bot api --help
tg sales bot api get-me --json
max sales bot api get-my-info --json
```

The first word is your bot profile. Each method's `--help` lists its native fields. Method names
and parameters follow the provider's API, so they can differ between Telegram and MAX.

## Use native inputs and results

Parameters are flags or JSON through `--body`, `--body-file` or stdin. The provider's native
`timeout` is `--poll-timeout`; `--timeout` limits the whole command. Results retain the provider's
native structure, and integers outside JavaScript's safe range are strings.

Some methods need specific bot rights or platform capabilities. Writes use the profile's guard,
recipient checks and journal. Keep credentials out of arguments: use stdin or a protected JSON
file. Credential-returning methods require `--store-token <profile>` and store the token only
in the OS keyring, printing a receipt.

## CLI and MCP

The complete native API is a **CLI interface**. MCP provides separate tools for common tasks;
it does not expose one tool per native API method. An agent with terminal access can use
`tg bot api` or `max bot api` for operations beyond those tools.

Details: [Telegram bot guide](https://github.com/leemour/tg-cli/blob/v0.25.0/docs/bot.md),
[MAX bot guide](https://github.com/leemour/max-cli/blob/v0.25.0/docs/bot.md),
[Telegram Bot API](https://core.telegram.org/bots/api), [MAX Bot API](https://dev.max.ru/docs-api).
