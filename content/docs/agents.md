---
title: "Connect your agent"
description: "Set up Codex, Cursor, Claude Code, Gemini CLI or Hermes to work with Telegram and MAX."
---

First [install the CLI and log in](./installation.mdx). Your local agent can call `tg` or `max`
in its terminal. A **skill** teaches it the commands, output formats and workflows; it does not
replace installation or login. [MCP](./mcp.md) is another way to expose tools to the agent.

## Choose your agent

Run the command for the messenger you installed. If you use both, run both commands.

| Agent | Telegram | MAX | Skill location |
|---|---|---|---|
| Codex | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Cursor Agent | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Claude Code | `tg skill install --for claude` | `max skill install --for claude` | `~/.claude/skills/<tool>-cli/SKILL.md` |
| Gemini CLI | `tg skill install --for agents` | `max skill install --for agents` | `~/.agents/skills/<tool>-cli/SKILL.md` |
| Hermes | Save `tg skill show` as described below | Save `max skill show` as described below | `~/.hermes/skills/<tool>-cli/SKILL.md` |

`<tool>-cli` is `tg-cli` or `max-cli`. `~` means your home directory, including on Windows.
`skill install` without `--for` installs into both `.claude/skills` and `.agents/skills`.

### Codex

Use Codex locally in the CLI or IDE. It discovers user skills in `~/.agents/skills`.
Select `$tg-cli` or `$max-cli` in a conversation; restart Codex if a newly installed skill is
missing. The CLI must be on the agent's PATH.
[Official Codex skills guide](https://learn.chatgpt.com/docs/build-skills).

### Cursor

Use **Agent** with terminal access. Cursor reads the shared `~/.agents/skills` directory;
find `tg-cli` or `max-cli` through `/` in Agent chat. Restart Cursor if it has not picked up the
new skill. You can also [connect MCP](./mcp.md#cursor-and-claude-desktop).
[Official Cursor skills guide](https://cursor.com/help/customization/skills).

### Claude Code

Run `/tg-cli` or `/max-cli` in your local Claude Code session. User skills live in
`~/.claude/skills`. MCP is optional when the terminal already works.
[Official Claude Code skills guide](https://code.claude.com/docs/en/skills).

### Gemini CLI

Run `gemini skills list` to check that `tg-cli` or `max-cli` is available. In a running session,
use `/skills reload` to refresh discovery. Gemini supports `~/.agents/skills` as a shared skill
directory. [Official Gemini skills guide](https://geminicli.com/docs/cli/skills/).

### Hermes

Hermes has its own skill directory. Ask it to create `~/.hermes/skills/tg-cli/SKILL.md` from
the **exact output** of `tg skill show`, or `~/.hermes/skills/max-cli/SKILL.md` from `max skill show`.
Keep the frontmatter and UTF-8 text. On macOS or Linux, for Telegram:

```sh
mkdir -p ~/.hermes/skills/tg-cli
tg skill show > ~/.hermes/skills/tg-cli/SKILL.md
```

For MAX, use `max-cli` in the path and `max skill show`. Start a new Hermes session and invoke
`/tg-cli` or `/max-cli`. The terminal environment must have the CLI and the same account session.
[Official Hermes skills guide](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/).

## Check the connection

Ask the agent: **“Use tg-cli / max-cli to check my account and list five chats. Then summarise
my unread messages by chat and say who needs an answer. Read only for this task.”**

It should be able to run `account show`, `chats list --limit 5` and `inbox --limit 5`, or the
equivalent MCP tools. If it cannot find the CLI, reopen the editor after installing Node/npm;
see [Windows and PATH](./installation.mdx#windows). If it reports no session, log in in the same
environment and profile the agent uses.

## The CLI already offers the skill

When `AI_AGENT` or `CLAUDECODE` is set, both CLIs suggest `skill install` if the installed skill
is missing or older than the CLI. The reminder goes to stderr, at most once per day; JSON stdout
stays usable. After upgrading the CLI, rerun the install command above. For Hermes, refresh the
file from `skill show`.

## Other clients

For **Claude Desktop**, use [MCP](./mcp.md#cursor-and-claude-desktop).
For an agent without skill support, give it [the Markdown docs](./mcp.md#documentation-for-your-agent).
For a cloud agent, install and log in in its execution environment; your local session is not
available there automatically.
